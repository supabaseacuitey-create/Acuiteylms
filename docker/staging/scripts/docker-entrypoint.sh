#!/bin/sh
# Acuitey staging entrypoint: ensure the moodledata VOLUME is writable.
# SAFE: only touches /var/moodledata (named volume). Never touches the
# COPY'd Moodle source at /var/www/moodle.
set -e

mkdir -p /var/moodledata
# Tolerant chown: services running as www-data (e.g. cron) cannot chown;
# the directory is already www-data-owned after first start.
chown www-data:www-data /var/moodledata || true
chmod 0770 /var/moodledata || true

exec docker-php-entrypoint "$@"
