# Use official PHP 8.3 Apache on Debian bookworm (pinned, no `latest`).
FROM php:8.3-apache-bookworm

# Avoid interactive prompts during build.
ENV DEBIAN_FRONTEND=noninteractive

# System libraries needed to compile the Moodle-required PHP extensions.
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
    ; \
    docker-php-ext-configure gd --with-freetype --with-jpeg; \
    docker-php-ext-install -j"$(nproc)" \
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

# Apache: rewrite support, quiet ServerName warning, Moodle public vhost.
RUN set -eux; \
    a2enmod rewrite; \
    echo "ServerName localhost" > /etc/apache2/conf-available/servername.conf; \
    a2enconf servername

COPY apache/moodle.conf /etc/apache2/sites-available/000-default.conf
COPY php/development.ini /usr/local/etc/php/conf.d/acuitey-development.ini

# Safe init helpers (moodledata ownership only; never touches bind-mounted source).
COPY scripts/docker-entrypoint.sh /usr/local/bin/acuitey-entrypoint.sh
COPY scripts/moodle-cron.sh /usr/local/bin/moodle-cron.sh
RUN chmod +x /usr/local/bin/acuitey-entrypoint.sh /usr/local/bin/moodle-cron.sh \
    && mkdir -p /var/moodledata \
    && chown www-data:www-data /var/moodledata

WORKDIR /var/www/moodle

EXPOSE 80

ENTRYPOINT ["/usr/local/bin/acuitey-entrypoint.sh"]
CMD ["apache2-foreground"]
