# Acuitey LMS staging image. Build context is the REPOSITORY ROOT
# (see docker/staging/compose.yml build.context), so all COPY paths below
# are repo-relative. Moodle source enters ONLY via COPY.
# No secrets are baked in: DB credentials arrive via runtime environment.
FROM php:8.3-apache-bookworm

ENV DEBIAN_FRONTEND=noninteractive

# Moodle-required PHP extensions + postgresql-client (backup/restore tooling).
# Kept minimal: no composer, no node, no extra servers.
RUN set -eux; \
    apt-get update; \
    apt-get install -y --no-install-recommends \
        curl \
        libfreetype6-dev \
        libicu-dev \
        libjpeg62-turbo-dev \
        libpng-dev \
        libpq-dev \
        libxml2-dev \
        libzip-dev \
        pkg-config \
        postgresql-client \
    ; \
    docker-php-ext-configure gd --with-freetype --with-jpeg; \
    # Limited to 2 parallel jobs: the Hostinger KVM 4 staging target has
    # limited vCPU/RAM and full nproc parallelism risks OOM during compile.
    docker-php-ext-install -j2 \
        exif \
        gd \
        intl \
        opcache \
        pgsql \
        pdo_pgsql \
        soap \
        zip \
    ; \
    apt-mark manual \
        libfreetype6 \
        libicu72 \
        libjpeg62-turbo \
        libpng16-16 \
        libpq5 \
        libxml2 \
        libzip4 \
        postgresql-client \
    ; \
    apt-get purge -y --auto-remove \
        libfreetype6-dev \
        libicu-dev \
        libjpeg62-turbo-dev \
        libpng-dev \
        libpq-dev \
        libxml2-dev \
        libzip-dev \
        pkg-config \
    ; \
    rm -rf /var/lib/apt/lists/*; \
    php -r 'foreach (["exif","gd","intl","pgsql","pdo_pgsql","soap","zip","sodium"] as $e) { if (!extension_loaded($e)) { fwrite(STDERR, "missing extension: $e\n"); exit(1); } } if (!extension_loaded("Zend OPcache") && !extension_loaded("opcache")) { fwrite(STDERR, "missing extension: opcache\n"); exit(1); } echo "extensions OK\n";'

# Apache: rewrite + headers, quiet ServerName warning, staging vhost.
RUN set -eux; \
    a2enmod rewrite headers; \
    echo "ServerName localhost" > /etc/apache2/conf-available/servername.conf; \
    a2enconf servername

# Moodle source: COPY'd from the repository.
# Copied FIRST so the staging config template below always wins, even if a
# stray config.php ever reached the build context (.dockerignore forbids it).
COPY moodle/ /var/www/moodle/

COPY docker/staging/apache/moodle.conf /etc/apache2/sites-available/000-default.conf
COPY docker/staging/php/staging.ini /usr/local/etc/php/conf.d/acuitey-staging.ini
# Staging config template (env-driven, no secret values). Applied AFTER the
# source copy so it is authoritative for this path in every layer.
COPY docker/staging/config/moodle-config.php /var/www/moodle/config.php

# Safe init + operations helpers (moodledata ownership only; never source).
COPY docker/staging/scripts/docker-entrypoint.sh /usr/local/bin/acuitey-entrypoint.sh
COPY docker/staging/scripts/moodle-cron.sh /usr/local/bin/moodle-cron.sh
COPY docker/staging/scripts/backup.sh /usr/local/bin/acuitey-backup.sh
COPY docker/staging/scripts/restore.sh /usr/local/bin/acuitey-restore.sh
RUN chmod +x /usr/local/bin/acuitey-entrypoint.sh /usr/local/bin/moodle-cron.sh /usr/local/bin/acuitey-backup.sh /usr/local/bin/acuitey-restore.sh \
    && mkdir -p /var/moodledata \
    && chown www-data:www-data /var/moodledata

WORKDIR /var/www/moodle

EXPOSE 80

ENTRYPOINT ["/usr/local/bin/acuitey-entrypoint.sh"]
CMD ["apache2-foreground"]
