# Acuitey LMS — Staging Deployment (Coolify)

Staging preparation bundle. This directory has passed STATIC REVIEW ONLY
(file inspection, `php -l`, `sh -n`, secret/hostname/env audits — see
“Validation status” below); the Docker image has NOT been built here.
**Deployment itself is a manual, explicitly-authorized step on the
Hostinger VPS. Nothing here deploys automatically.**

Non-goals (never do these): use the production portal hostname for staging,
create/change DNS, use production databases or payment credentials, create
real student accounts, run live Razorpay transactions, commit secrets.

## Contents

```text
docker/staging/
  Dockerfile            COPY-based PHP 8.3 + Apache image (no bind mounts, no secrets baked in)
  compose.yml           acuitey-staging: app, db (PG16), redis (Redis 7), cron (opt-in profile)
  apache/moodle.conf    Vhost, DocumentRoot = /var/www/moodle/public
  php/staging.ini       Production-like PHP/OPcache (display_errors Off, no timestamp checks)
  config/moodle-config.php  Env-driven staging config.php template (baked into image)
  scripts/docker-entrypoint.sh  moodledata volume ownership only
  scripts/moodle-cron.sh        60s cron loop with flock (post-install only)
  scripts/backup.sh             pg_dump + moodledata tar to the backups volume
  scripts/restore.sh            Guarded restore (confirmation + env + installed-DB guards)
  .env.staging.example          PLACEHOLDERS ONLY (tracked)
  README.md               This file
```

`/.dockerignore` (repository root) guarantees the local `moodle/config.php`,
all `.env` files, Git metadata, keys, archives, and runtime data never enter
any image layer. `.gitignore` alone cannot do this — Docker ignores it.

## Manual Coolify deployment checklist (VPS-only, verify each step in the UI)

> Staging hostname is NOT approved. Use the placeholder until the client
> signs off. Never enter the production portal hostname.

1. **Project**: in Coolify, create/open the staging project on the Hostinger VPS.
2. **Service**: add a Docker Compose deployment from this repository
   (`atuladarsh/AcuiteyLMS`, branch `feature/ACU-WAVE1`, compose path
   `docker/staging/compose.yml`). Confirm the exact menu/field names in the
   Coolify version installed on the VPS — they change between releases.
3. **Target service + port**: route to service `app`, container port `80`.
   The compose `expose: ["80"]` only documents the internal port; ingress
   comes from Traefik, not from compose.
4. **Domain + TLS**: attach the approved staging domain; enable TLS
   (Traefik/Let's Encrypt) so the site is `https:`-only — this must agree
   with `STAGING_WWWROOT=https://...` and `$CFG->sslproxy = true`.
5. **Access restriction**: add a Traefik basic-auth middleware in front of the
   staging domain (staging must never be public). Confirm middleware naming in
   the VPS Coolify version.
6. **Environment variables** (type values into Coolify; names only below —
   never commit values):

   | Variable | Example shape (placeholder) |
   |---|---|
   | `POSTGRES_DB` | `moodle` |
   | `POSTGRES_USER` | `moodle` |
   | `POSTGRES_PASSWORD` | staging-only generated value |
   | `MOODLE_DB_HOST` | `db` |
   | `MOODLE_DB_NAME` | `moodle` |
   | `MOODLE_DB_USER` | `moodle` |
   | `MOODLE_DB_PASSWORD` | same staging-only value |
   | `MOODLE_DB_PREFIX` | `mdl_` |
   | `STAGING_WWWROOT` | `https://<approved-staging-host>` (never the portal host) |

7. **Volumes**: confirm Coolify provisions persistent volumes for
   `acuitey-staging-pgdata`, `acuitey-staging-moodledata`,
   `acuitey-staging-backups` (or Coolify-managed equivalents — record the
   actual names).
8. **Deploy** the stack from Coolify. Wait for `db`/`redis` healthy, then `app`.
   (`app` HEALTHY pre-install means the web server is responding — HTTP 303
   into the installer — not that Moodle is installed. Readiness is HTTP 200
   after step 9 plus admin login.)
9. **First install** (DB must be empty — check row count first):

   ```sh
   docker exec acuitey-staging-db psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -t \
     -c "SELECT count(*) FROM pg_tables WHERE schemaname NOT IN ('pg_catalog','information_schema');"
   # expect 0
   docker exec -i -u www-data acuitey-staging-app \
     php admin/cli/install_database.php --lang=en \
     --adminuser=admin --adminemail=<staging-admin-email> \
     --fullname='Acuitey LMS - Staging' --shortname='AcuiteyStaging' \
     --agree-license --adminpass="$STAGING_ADMIN_PASS"
   ```

   `$STAGING_ADMIN_PASS` is a shell variable holding a staging-only password —
   never a literal in history, files, or chat. Rotate it post-install via
   Site administration → Users.
10. **Verify**: homepage returns HTTP 200; admin login works; page `<head>`
    contains `<meta name="robots" content="noindex" />` (`allowindexing=2`).
11. **Start recurring cron** (ONLY after install):

    ```sh
    docker compose --profile cron up -d cron
    docker logs acuitey-staging-cron
    ```

## Backup / restore runbook

- **Backup** (staging stack running):

  ```sh
  docker compose -f docker/staging/compose.yml exec app /usr/local/bin/acuitey-backup.sh
  # artifacts land in the acuitey-staging-backups volume as
  # moodle-db-<UTC-stamp>.dump + moodledata-<UTC-stamp>.tgz (consistent pair)
  ```

- **Restore** (guarded; aborts unless every guard passes):

  ```sh
  # 1. Stop app + cron FIRST and enable Moodle maintenance mode
  #    (Site administration → Server → Maintenance mode, or CLI).
  #    Never restore while the stack serves traffic.
  # 2. Pick ONE consistent backup pair (same <STAMP>):
  #      moodle-db-<STAMP>.dump + moodledata-<STAMP>.tgz
  CONFIRM=YES-I-UNDERSTAND DEPLOY_ENV=staging OFFLINE_ACK=YES-STACK-STOPPED \
    /usr/local/bin/acuitey-restore.sh <db-dump-file> <moodledata-tgz>
  # add FORCE_OVERWRITE_INSTALLED=YES only to replace an installed Moodle
  # 3. Disable maintenance mode and restart app + cron afterwards.
  ```

  Guards: explicit confirmation, `DEPLOY_ENV=staging` exact match,
  offline/maintenance acknowledgment (`OFFLINE_ACK=YES-STACK-STOPPED`),
  filenames confined to the backups volume, backup-pair stamp consistency,
  fail-closed installed-DB detection (unreachable/unknown target aborts),
  installed-DB refusal, archive integrity check before any deletion.
  Dataroot is REPLACED (contents cleared, mountpoint kept) — never merged.
  A full restore drill is VPS/manual and must be witnessed — never claimed
  from local validation. Agree RTO/RPO targets with the client and record
  the first successful drill date here.

## Rollback procedure

1. In Coolify, re-point the `app` service at the previous working image tag
   (record every promoted tag in the release log below).
2. If data changed since the bad deploy, restore the matching
   database-plus-moodledata pair with `restore.sh` (its guards apply).
3. Run `php admin/cli/upgrade.php --non-interactive` if versions differ.
4. Verify homepage 200 + admin login + cron recency before closing the incident.

Release log (newest first): _(none yet)_

## Redis note

The Redis 7 service is ready (internal-only, health-checked), but Moodle
sessions/MUC/locking stay on defaults until version-verified mappings are
configured via Site administration. No cache keys are invented in
`moodle-config.php`. The `phpredis` extension is a follow-up with that work.

## Validation status

Verdict vocabulary is STRICT: PASS = command output seen; NOT EXECUTED =
not run here, with reason. Static-review success is NEVER presented as
deployment readiness.

- PASS (static review, evidence on file): `php -l` on
  `config/moodle-config.php`; `sh -n` on all four staging scripts plus both
  local scripts; DocumentRoot/volume/network design review; secret/hostname
  audits (no production host, no credentials, no payment config);
  compose-to-example env-name consistency; `.dockerignore` exclusion review;
  restore-guard static review including prefix-derived and fail-closed
  installed-DB detection, offline/pair-consistency guards, and
  replace-not-merge dataroot handling (logic tested without a database;
  no real restore performed); Git/core-integrity status (no tracked
  file modified).
- NOT EXECUTED (Docker stopped / VPS-only by design): Docker image build;
  PHP extension set assertion inside the image; `compose config --quiet`;
  `apachectl configtest`; in-image secrets check (no local config in any
  layer); runtime healthchecks (app/db/redis/cron); restore-guard behavior
  against a live database; full backup/restore drill; Coolify routing
  end-to-end; TLS issuance; Traefik middleware; first install; cron
  recurrence; performance/resilience.
