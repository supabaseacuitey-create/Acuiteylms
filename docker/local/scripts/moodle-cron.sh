#!/bin/sh
# Acuitey local Moodle cron loop (one run per ~60s, no overlap via flock).
# Do NOT start this service until Moodle installation is complete.
# Working directory matters on Moodle 5.2: run from the distribution root
# (/var/www/moodle) so that admin/cli/cron.php resolves correctly.
set -e

cd /var/www/moodle

while true; do
  if flock -n /tmp/moodle-cron.lock php admin/cli/cron.php; then
    echo "[cron] ran OK at $(date -u +%FT%TZ)"
  else
    echo "[cron] previous run still active or failed at $(date -u +%FT%TZ)"
  fi
  sleep 60
done
