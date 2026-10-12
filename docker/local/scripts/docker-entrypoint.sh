#!/bin/sh
# Acuitey local entrypoint: ensure the moodledata VOLUME is writable.
# SAFE: only touches /var/moodledata (named volume). Never touches the
# bind-mounted Moodle source at /var/www/moodle.
set -e

mkdir -p /var/moodledata
# Tolerant chown: the cron service runs as www-data (see compose.yml), which
# cannot chown. The directory is already www-data-owned after first start.
chown www-data:www-data /var/moodledata || true
chmod 0770 /var/moodledata || true

exec docker-php-entrypoint "$@"
