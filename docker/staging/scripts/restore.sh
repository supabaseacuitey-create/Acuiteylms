#!/bin/sh
# Acuitey staging restore: database + moodledata from backup.sh artifacts.
# HARDENED: refuses to run without explicit confirmation, refuses the wrong
# environment, requires the stack to be offline (app + cron stopped, site in
# maintenance mode), requires the backup pair to be consistent (same UTC
# stamp), refuses an unreachable/unknown database target, and refuses to
# overwrite an installed Moodle without an additional override.
# Dataroot is REPLACED, never merged: the archive is integrity-checked first,
# then /var/moodledata contents are cleared (mountpoint kept) before extract,
# so stale files can never mix with restored files.
# Never auto-run; never referenced by compose.
#
# Preconditions (operator, VPS): stop app + cron, enable Moodle maintenance
# mode, verify both backup files share one stamp (backup.sh writes
# moodle-db-<STAMP>.dump + moodledata-<STAMP>.tgz together).
#
# Usage:
#   CONFIRM=YES-I-UNDERSTAND DEPLOY_ENV=staging OFFLINE_ACK=YES-STACK-STOPPED \
#     /usr/local/bin/acuitey-restore.sh <db-dump-file> <moodledata-tgz>
#   (Filenames only — no paths: files must live in $BACKUP_DIR.)
#   To overwrite an already-installed Moodle, additionally set
#   FORCE_OVERWRITE_INSTALLED=YES.
set -e

# Guard 1: explicit confirmation.
if [ "${CONFIRM:-}" != "YES-I-UNDERSTAND" ]; then
  echo "ABORT: set CONFIRM=YES-I-UNDERSTAND to proceed. Nothing was restored." >&2
  exit 2
fi

# Guard 2: target-environment check (never restore blindly).
if [ "${DEPLOY_ENV:-}" != "staging" ]; then
  echo "ABORT: DEPLOY_ENV must be exactly 'staging' (got '${DEPLOY_ENV:-<empty>}'). Nothing was restored." >&2
  exit 2
fi

# Guard 2b: offline/maintenance acknowledgment. A restore while app/cron
# serve traffic lets the database and dataroot change mid-restore and yields
# a corrupt site. The operator must stop app + cron and enable Moodle
# maintenance mode BEFORE running this script.
if [ "${OFFLINE_ACK:-}" != "YES-STACK-STOPPED" ]; then
  echo "ABORT: stop app + cron and enable maintenance mode first, then set OFFLINE_ACK=YES-STACK-STOPPED. Nothing was restored." >&2
  exit 2
fi

: "${MOODLE_DB_HOST:?MOODLE_DB_HOST must be set}"
: "${MOODLE_DB_NAME:?MOODLE_DB_NAME must be set}"
: "${MOODLE_DB_USER:?MOODLE_DB_USER must be set}"
: "${MOODLE_DB_PASSWORD:?MOODLE_DB_PASSWORD must be set}"

# Guard 4 uses the configured table prefix (default mdl_, same as
# compose.yml and moodle-config.php). Validated to safe characters so the
# environment value cannot inject SQL into the detection query.
MOODLE_DB_PREFIX="${MOODLE_DB_PREFIX:-mdl_}"
case "$MOODLE_DB_PREFIX" in
  *[!a-zA-Z0-9_]*|'') echo "ABORT: MOODLE_DB_PREFIX contains unsafe characters. Nothing was restored." >&2; exit 2;;
esac
CONFIG_TABLE="${MOODLE_DB_PREFIX}config"

BACKUP_DIR="${BACKUP_DIR:-/backups}"

# Guard 3: filename confinement (no paths, no traversal).
DB_ARG="${1:-}"; DATA_ARG="${2:-}"
case "$DB_ARG" in ""|*/*) echo "ABORT: first argument must be a backup filename in $BACKUP_DIR." >&2; exit 2;; esac
case "$DATA_ARG" in ""|*/*) echo "ABORT: second argument must be a backup filename in $BACKUP_DIR." >&2; exit 2;; esac
DB_FILE="$BACKUP_DIR/$DB_ARG"; DATA_FILE="$BACKUP_DIR/$DATA_ARG"
[ -f "$DB_FILE" ] || { echo "ABORT: not found: $DB_FILE" >&2; exit 2; }
[ -f "$DATA_FILE" ] || { echo "ABORT: not found: $DATA_FILE" >&2; exit 2; }

# Guard 3b: backup-pair consistency. backup.sh writes
# moodle-db-<STAMP>.dump + moodledata-<STAMP>.tgz from one run; restoring a
# database and files from different points in time yields a corrupt site.
# When both args follow that convention, stamps must be identical.
DB_STAMP="$DB_ARG"; DATA_STAMP="$DATA_ARG"
case "$DB_STAMP" in moodle-db-*.dump) DB_STAMP="${DB_STAMP#moodle-db-}"; DB_STAMP="${DB_STAMP%.dump}";; *) DB_STAMP="unknown";; esac
case "$DATA_STAMP" in moodledata-*.tgz) DATA_STAMP="${DATA_STAMP#moodledata-}"; DATA_STAMP="${DATA_STAMP%.tgz}";; *) DATA_STAMP="unknown";; esac
if [ "$DB_STAMP" != "unknown" ] && [ "$DATA_STAMP" != "unknown" ] && [ "$DB_STAMP" != "$DATA_STAMP" ]; then
  echo "ABORT: backup pair mismatch (db stamp $DB_STAMP != data stamp $DATA_STAMP). Restore a consistent pair. Nothing was restored." >&2
  exit 2
fi
if [ "$DB_STAMP" = "unknown" ] || [ "$DATA_STAMP" = "unknown" ]; then
  echo "WARNING: filenames do not follow the backup.sh convention; pair consistency UNVERIFIED — proceed only if you verified the pair manually."
fi

echo "PRE-FLIGHT: target host=$MOODLE_DB_HOST db=$MOODLE_DB_NAME backups: $DB_ARG + $DATA_ARG"
echo "PRE-FLIGHT: the database WILL be replaced and /var/moodledata WILL be overwritten."

# Guard 4: refuse to overwrite an installed Moodle without explicit override.
# FAIL-CLOSED: if PostgreSQL is unreachable, the detection query errors, or
# the result is not a plain count, target state is UNKNOWN — abort and never
# restore. An unknown target must never be treated as empty.
export PGPASSWORD="$MOODLE_DB_PASSWORD"
if ! INSTALLED="$(psql -h "$MOODLE_DB_HOST" -U "$MOODLE_DB_USER" -d "$MOODLE_DB_NAME" -tAc "SELECT count(*) FROM pg_tables WHERE tablename='$CONFIG_TABLE';" 2>/dev/null)"; then
  echo "ABORT: cannot reach target database host=$MOODLE_DB_HOST db=$MOODLE_DB_NAME (target state UNKNOWN). Nothing was restored." >&2
  unset PGPASSWORD
  exit 2
fi
INSTALLED="$(printf '%s' "$INSTALLED" | tr -d '[:space:]')"
case "$INSTALLED" in
  ''|*[!0-9]*)
    echo "ABORT: installed-database detection returned an unexpected result (target state UNKNOWN). Nothing was restored." >&2
    unset PGPASSWORD
    exit 2
    ;;
esac
if [ "$INSTALLED" != "0" ]; then
  if [ "${FORCE_OVERWRITE_INSTALLED:-}" != "YES" ]; then
    echo "ABORT: target already contains an installed Moodle ($CONFIG_TABLE present). Set FORCE_OVERWRITE_INSTALLED=YES to proceed. Nothing was restored." >&2
    unset PGPASSWORD
    exit 2
  fi
  echo "WARNING: overwriting installed Moodle (override acknowledged)."
fi

pg_restore --clean --if-exists -h "$MOODLE_DB_HOST" -U "$MOODLE_DB_USER" -d "$MOODLE_DB_NAME" "$DB_FILE"
unset PGPASSWORD

# Dataroot REPLACE (never merge): validate the archive BEFORE destroying
# anything, then clear contents (mountpoint kept) so stale files — deleted
# courses, stale caches/sessions — can never mix with restored files.
[ -d /var/moodledata ] || { echo "ABORT: /var/moodledata missing. Nothing was restored." >&2; exit 2; }
tar -tzf "$DATA_FILE" >/dev/null || { echo "ABORT: moodledata archive failed integrity check. Database was already restored — re-run with a good pair after fixing. Dataroot untouched." >&2; exit 2; }
find /var/moodledata -mindepth 1 -delete || { echo "ABORT: could not clear /var/moodledata. Nothing was extracted." >&2; exit 2; }
tar -xzf "$DATA_FILE" -C /var/moodledata

echo "RESTORE-OK db=$DB_ARG data=$DATA_ARG (target host: $MOODLE_DB_HOST, db: $MOODLE_DB_NAME)"
