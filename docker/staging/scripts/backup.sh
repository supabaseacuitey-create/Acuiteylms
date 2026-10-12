#!/bin/sh
# Acuitey staging backup: PostgreSQL custom-format dump + moodledata archive.
# Runs INSIDE the app container (has postgresql-client + the moodledata mount).
# Credentials come ONLY from the container environment (Compose/Coolify env).
# Prints paths only — never secret values.
# NOTE: for a consistent pair, enable Moodle maintenance mode (and ideally
# stop cron) BEFORE running this: the dump and the tar are taken sequentially
# and site writes between them would make the pair inconsistent at restore.
#
# Usage:
#   docker compose -f docker/staging/compose.yml exec app /usr/local/bin/acuitey-backup.sh
set -e

: "${MOODLE_DB_HOST:?MOODLE_DB_HOST must be set}"
: "${MOODLE_DB_NAME:?MOODLE_DB_NAME must be set}"
: "${MOODLE_DB_USER:?MOODLE_DB_USER must be set}"
: "${MOODLE_DB_PASSWORD:?MOODLE_DB_PASSWORD must be set}"

BACKUP_DIR="${BACKUP_DIR:-/backups}"
STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
DB_FILE="$BACKUP_DIR/moodle-db-$STAMP.dump"
DATA_FILE="$BACKUP_DIR/moodledata-$STAMP.tgz"

mkdir -p "$BACKUP_DIR"

export PGPASSWORD="$MOODLE_DB_PASSWORD"
pg_dump -h "$MOODLE_DB_HOST" -U "$MOODLE_DB_USER" -d "$MOODLE_DB_NAME" -Fc -f "$DB_FILE"
unset PGPASSWORD

tar -czf "$DATA_FILE" -C /var/moodledata .

echo "BACKUP-OK db=$DB_FILE data=$DATA_FILE (target host: $MOODLE_DB_HOST, db: $MOODLE_DB_NAME)"
