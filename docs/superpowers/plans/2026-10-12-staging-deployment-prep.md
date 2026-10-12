# Staging Deployment Preparation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create an isolated, production-like `docker/staging/` bundle (image + compose + config + runbooks) for Coolify staging deployment, validated locally without touching the VPS.

**Architecture:** Mirror the proven `docker/local/` stack but staging-hardened: Moodle source COPY'd into the image (no bind mount), production PHP/OPcache settings, env-driven staging `config.php` baked as a template (values from Coolify env, never in git), Traefik-expected ingress (no host ports), profile-gated cron, backup/restore scripts, all secrets as placeholder-only examples.

**Tech Stack:** Docker Engine 29.8.2, Compose v5.5.1, `php:8.3-apache-bookworm`, `postgres:16-bookworm`, `redis:7-bookworm`, Moodle 5.2.3+, PowerShell host.

**Spec:** The task message in this session ("ACUITEY LMS — COOLIFY STAGING DEPLOYMENT PREPARATION") plus `docker/local/README.md`, `docker/local/compose.yml`, `docker/local/Dockerfile`, `moodle/config-dist.php` (authoritative for `$CFG` keys), `moodle/public/version.php` (5.2.3+), `AUDIT.md`.

## Global Constraints

- No Moodle core modifications (`moodle/` untouched; verify with `git status`/`git diff`).
- No `docker/local/` modifications (separately approved only).
- Never disturb the running local installer; never delete/reset any Docker volume.
- No VPS/Coolify connection, no auto-deploy, no DNS changes, no production hostnames.
- Staging hostname unapproved: use an `https://STAGING-HOST-PLACEHOLDER` style placeholder; the literal `portal.acuiteysolutions.com` must appear nowhere under `docker/staging/`.
- No commits, pushes, or branch changes (plan steps end in verification, never `git commit`).
- No secrets in tracked files, chat, or shell history; `.env.staging.example` holds placeholders only; never create a real `.env.staging`.
- No prod DB/payment credentials; no real student accounts; no Razorpay.
- STOP after local validation; Coolify steps are manual documentation only.
- MANDATORY CORRECTIONS (conditional approval):
  1. Staging build gets an effective root `.dockerignore` (local `moodle/config.php`, all `.env` files, Git metadata, keys, archives, runtime data excluded); Docker reads `.dockerignore` only from the build-context root, so `.gitignore` is NOT sufficient — verify exclusions, never assume.
  2. Staging Compose `build.context` is the repository root (`../..` from `docker/staging/compose.yml`) so `COPY moodle/` resolves; verify every COPY path by building.
  3. `expose: ["80"]` documents the internal port only and provides NO ingress; Coolify/Traefik routing (target service, domain, TLS, middleware, env) is configured in the Coolify UI and documented as manual VPS-only steps, each marked verify-on-VPS.
  4. Real local `.env` values must NEVER enter staging commands, build args, logs, or images: staging validation uses ONLY `docker/staging/.env.staging.example` placeholders; audit for leakage.
  5. `restore.sh` requires explicit confirmation, a target-environment guard, and refuses to overwrite an installed Moodle DB without an additional override; never claim a restore drill passed without executing one (full drill is VPS/manual and stays NOT EXECUTED locally).
  6. Local install/volumes are sacrosanct: staging uses only `acuitey-staging-*` resources; no install step runs automatically anywhere in this plan.
  7. Every verdict is evidence-based: PASS only with command output; VPS-only items are NOT EXECUTED by design, never inferred from build/config success.
  8. Staging-prep files only; nothing else changes.

## Review Focus

- Staging placeholder hostname silently becoming the production portal host — a reasonable person expects staging to never answer on the portal domain. Test pinned in Task 6.
- Moodle `wwwroot` scheme disagreeing with Traefik TLS termination (redirect loops / mixed content) — a reasonable person expects `https` wwwroot + documented proxy flags. Test pinned in Task 4.
- Invented Redis/MUC/session `$CFG` keys that Moodle 5.2 does not support — a reasonable person expects only `config-dist.php`-verified keys. Test pinned in Task 4.
- Local-dev material leaking into the staging bundle: Windows bind-mount paths, `acuitey-local` references, or local `.env` values — a reasonable person expects zero host-path volumes and zero local cross-wiring, with local `moodle/config.php` excluded from every image layer (`.gitignore` is not enough). Tests pinned in Tasks 1, 2, and 6.
- Real secret values committed under `docker/staging/` — a reasonable person expects placeholders only. Test pinned in Task 6.

---

### Task 1: Staging Dockerfile + root .dockerignore (COPY-based, leak-proof image)

**Files:**
- Create: `docker/staging/Dockerfile`
- Create: `.dockerignore` (repository root — Docker reads `.dockerignore` ONLY from the build-context root, which is the repo root per Task 2; a copy under `docker/staging/` would be silently ignored)

**Interfaces:**
- Consumes: `docker/local/Dockerfile` (extension set reference — read, do not modify).
- Produces: image `acuitey-staging-app:8.3` with docroot `/var/www/moodle/public`, used by Tasks 2–6 verifications.

- [ ] **Step 1: Write `.dockerignore` at repository root** — exclude: `.git/` (history may contain secrets + bloat), `moodle/config.php`, `moodle/config-local.php`, `moodle/config.override.php`, `**/.env` and `**/.env.*` (ALL env files including `docker/local/.env`; examples stay excluded too — nothing env-like enters any layer), `*.pem`/`*.key`/`*.p12`/`*.pfx`, `*.zip`/`*.tar*`/`*.7z`/`*.rar`, `moodledata/` + `**/moodledata/`, `.venv/`, `graphify-out/`, `*.sql*`/`*.dump`/`*.backup`. Header comment states the rationale: `.gitignore` does NOT affect `docker build`; without this file the local `moodle/config.php` would persist in an intermediate layer even though the template overwrites it. Do NOT exclude `moodle/` itself or `docker/staging/`.

- [ ] **Step 2: Write `docker/staging/Dockerfile`** (all paths relative to repo-root context) — `FROM php:8.3-apache-bookworm`; `docker-php-ext-install` exactly `exif gd intl opcache pgsql pdo_pgsql soap zip` (same set as local); `apt-mark manual` runtime libs before `purge --auto-remove` (local lesson: unmarked purge breaks `gd`/`pgsql`/`zip` at runtime); build-time assertion that all eight extensions plus OPcache load; `a2enmod rewrite headers`; `COPY moodle/ /var/www/moodle/`; `COPY docker/staging/apache/moodle.conf /etc/apache2/sites-available/000-default.conf`; `COPY docker/staging/php/staging.ini /usr/local/etc/php/conf.d/`; `COPY docker/staging/config/moodle-config.php /var/www/moodle/config.php` (template overwrites the `.dockerignore`-excluded local file — belt and suspenders); `COPY docker/staging/scripts/` helpers; `WORKDIR /var/www/moodle`; `EXPOSE 80`; entrypoint + `apache2-foreground`.

- [ ] **Step 3: Build the image and verify it passes**

Run: `docker compose -f docker/staging/compose.yml --env-file docker/staging/.env.staging.example build app` (NEVER substitute `docker/local/.env`; placeholders suffice for build — if `:?` guards trip, build with `docker build -f docker/staging/Dockerfile .` from repo root instead and note it)
Expected: `BUILD PASS` with `extensions OK` in build log and zero `Unable to load dynamic library` warnings.

- [ ] **Step 4: Verify no local config or secrets baked into any layer**

Run: `docker run --rm acuitey-staging-app:8.3 sh -c 'grep -q "allowindexing = 2" /var/www/moodle/config.php && echo TEMPLATE-OK; ! grep -q "debugdisplay = 1" /var/www/moodle/config.php && echo NO-LOCAL-CONFIG-OK'`
Expected: both `TEMPLATE-OK` and `NO-LOCAL-CONFIG-OK` (the baked `config.php` is the staging template — `debugdisplay = 1` exists only in the local dev config).
Run: `Select-String -Path docker/staging/Dockerfile -Pattern 'VOLUME|bind|moodle:rw|ARG.*PASS|ENV.*PASS'`
Expected: no matches (source enters only via `COPY`; no secret build-args/env).

- [ ] **Step 3: Verify no bind-mount leakage in the Dockerfile**

Run: `Select-String -Path docker/staging/Dockerfile -Pattern 'VOLUME|bind|moodle:rw'`
Expected: no matches (source enters only via `COPY`).

### Task 2: Staging Compose (isolated services, cron, healthchecks)

**Files:**
- Create: `docker/staging/compose.yml`

**Interfaces:**
- Consumes: Task 1 image name `acuitey-staging-app:8.3`.
- Produces: project `acuitey-staging`, services `app`/`db`/`redis`/`cron`, volumes `acuitey-staging-pgdata`/`acuitey-staging-moodledata`/`acuitey-staging-backups`, used by Tasks 6–9.

- [ ] **Step 1: Write `docker/staging/compose.yml`** — `name: acuitey-staging`; `build.context: ../..` (repository root, so `COPY moodle/` resolves), `dockerfile: docker/staging/Dockerfile`; `db` (`postgres:16-bookworm`, `pg_isready` healthcheck, staging-named `pgdata` volume, no `ports`); `redis` (`redis:7-bookworm`, `redis-cli ping` healthcheck, ephemeral, no `ports`); `app` (Task 1 image, `expose: ["80"]` and NO `ports` — `expose` documents the internal port only and provides NO ingress; Traefik routing is configured in the Coolify UI per Task 7; `moodledata` volume only, no source bind; env `MOODLE_DB_*`, `STAGING_WWWROOT`, `MOODLE_DATAROOT=/var/moodledata` with `:?` guards on passwords; `depends_on` healthy; lenient HTTP healthcheck per local lesson: 90s start, 30s timeout); `cron` (same image, `profiles: ["cron"]`, `user: www-data`, loop script, no ports); `backups` named volume mounted to db + app for `backup.sh`/`restore.sh`; single bridge network; `mem_limit`/`cpus` within envelope. Container/volume/network names ALL prefixed `acuitey-staging-` so `down`/`rm` can never touch `acuitey-local-*` resources.

- [ ] **Step 2: Validate compose config**

Run: `docker compose -f docker/staging/compose.yml --env-file docker/staging/.env.staging.example config --quiet`
Expected: `COMPOSE-CONFIG PASS` (placeholders satisfy interpolation; real secrets never needed).

- [ ] **Step 3: Verify zero host-path volumes, zero published DB/Redis ports, zero local cross-wiring**

Run: `Select-String -Path docker/staging/compose.yml -Pattern '^\s*-\s*\.\.'`
Expected: no matches (no relative-path volume mounts; the only `../..` in the file is `build.context`, which starts with `context:`).
Run: `Select-String -Path docker/staging/compose.yml -Pattern '^\s*ports:'`
Expected: no matches (comment lines start with `#`, so only a real `ports:` key would match).
Run: `Select-String -Path docker/staging/compose.yml -Pattern 'acuitey-local|localhost:8080|local/\.env'`
Expected: no matches (staging compose never references the local project, its URL, or its env file).

### Task 3: Apache + PHP staging configuration

**Files:**
- Create: `docker/staging/apache/moodle.conf`
- Create: `docker/staging/php/staging.ini`

**Interfaces:**
- Consumes: Task 1 image (for `apachectl configtest` verification).
- Produces: hardened vhost + production PHP settings consumed by the Task 1 image build (note ordering: write these files BEFORE running Task 1 Step 2; re-run build after any change).

- [ ] **Step 1: Write `apache/moodle.conf`** — `DocumentRoot /var/www/moodle/public`, `<Directory>` with `-Indexes +FollowSymLinks`, `AllowOverride All`, `Require all granted`; `TraceEnable Off`; security headers (`X-Content-Type-Options: nosniff`, `Referrer-Policy: same-origin`; FRAME options left to Moodle/Traefik with a comment saying so — do not invent conflicting headers).

- [ ] **Step 2: Write `php/staging.ini`** — `display_errors Off`, `display_startup_errors Off`, `log_errors On`, `error_reporting E_ALL`, `max_input_vars 5000`, `memory_limit 512M`, `upload_max_filesize 128M`, `post_max_size 128M`, `max_execution_time 300`, `opcache.enable 1`, `opcache.validate_timestamps 0`, `opcache.revalidate_freq 60`, `opcache.memory_consumption 256M`; comment that timezone stays unset (client decision).

- [ ] **Step 3: Verify Apache config inside the built image**

Run: `docker run --rm acuitey-staging-app:8.3 apachectl configtest`
Expected: `Syntax OK`.

### Task 4: Staging Moodle config template (env-driven, no invented keys)

**Files:**
- Create: `docker/staging/config/moodle-config.php` (COPY'd to `/var/www/moodle/config.php` by Task 1 Dockerfile)

**Interfaces:**
- Consumes: `moodle/config-dist.php` (key authority), `moodle/config.php` (local env pattern reference — read only).
- Produces: staging `$CFG` consumed by the image; semantics relied on by Task 8 README.

- [ ] **Step 1: Write `config/moodle-config.php`** — keys LIMITED to `config-dist.php`-verified names: `dbtype pgsql`, `dblibrary native`, `dbhost/dbname/dbuser/dbpass` (env, fail-closed on missing password), `prefix` (env, default `mdl_`), `dboptions ['dbpersist' => false]` (direct PG, no pooler keys), `wwwroot` (env `STAGING_WWWROOT`, must be `https`), `dataroot /var/moodledata`, `directorypermissions 02777`, `admin`, `pathtophp /usr/local/bin/php`, `debug 0` + `debugdisplay 0` with a comment on temporary enablement, `sslproxy true` (Traefik terminates TLS; `config-dist.php:426`), `allowindexing 2` (verified core noindex hook in `core_renderer.php:269`), `require_once(__DIR__ . '/lib/setup.php')` trailer exactly as `config-dist.php` ends. Explicitly ABSENT with comments: `session_handler_class`/any MUC cache mapping (pending verification), `reverseproxy` (unset unless Coolify port-forwarding demands it — manual step), production debug.

- [ ] **Step 2: Lint and audit the template**

Run: `C:\php8.3\php.exe -l docker/staging/config/moodle-config.php`
Expected: `No syntax errors detected`.
Run: `Select-String -Path docker/staging/config/moodle-config.php -Pattern 'session_handler_class|cache_|portal\.acuiteysolutions|CHANGEME|password\s*=\s*[''"][^''"]'`
Expected: no matches (no invented cache keys, no portal host, no real secret literals).

### Task 5: Entrypoint + cron + backup/restore scripts

**Files:**
- Create: `docker/staging/scripts/docker-entrypoint.sh`
- Create: `docker/staging/scripts/moodle-cron.sh`
- Create: `docker/staging/scripts/backup.sh`
- Create: `docker/staging/scripts/restore.sh`

**Interfaces:**
- Consumes: Task 1 image (`flock`, `pg_dump` availability checks run against it).
- Produces: scripts used by compose services (Tasks 2) and Task 8 runbook.

- [ ] **Step 1: Write `docker-entrypoint.sh`** — mkdir + tolerant `chown www-data:www-data /var/moodledata || true` + `chmod 0770 || true`; `exec docker-php-entrypoint "$@"`; comment: touches the volume only, never source.

- [ ] **Step 2: Write `moodle-cron.sh`** — `cd /var/www/moodle`; `flock -n` 60s loop over `php admin/cli/cron.php`; never started pre-install (compose profile enforces).

- [ ] **Step 3: Write `backup.sh`** — `pg_dump -Fc` of the `db` service to the `backups` volume timestamped file + `tar` of `moodledata`; all credentials from environment; prints paths only, never values; refuses to run if required env is empty.

- [ ] **Step 4: Write `restore.sh`** — hardened against accidents: requires ALL of (a) `CONFIRM=YES-I-UNDERSTAND`, (b) `DEPLOY_ENV=staging` exactly (refuses any other value, preventing runs against the wrong environment), (c) explicit backup filename args that must exist; target-environment check prints the resolved DB host/wwwroot and aborts unless they match the staging services; installed-DB guard queries for the `mdl_config` table — if the target already holds an installed Moodle, abort unless `FORCE_OVERWRITE_INSTALLED=YES` is also set; prints a pre-flight summary (target, backup files, what will be destroyed) and a 10-second countdown-less immediate abort path is NOT provided — it aborts, never pauses-then-continues. `pg_restore --clean` + moodledata tar restore only after all guards pass. Never auto-run, never referenced by compose.

- [ ] **Step 5: Syntax-check all four scripts and test restore guards WITHOUT touching data**

Run: `& 'C:\Program Files\Git\bin\sh.exe' -n <each script>`
Expected: all four `PASS`, and `docker exec` check `which flock` already verified present in this image family (re-verify post-build: `docker run --rm acuitey-staging-app:8.3 which flock pg_dump`).
Run (guard behavior, no DB writes): `sh restore.sh` with no env, then with `CONFIRM=YES-I-UNDERSTAND` but `DEPLOY_ENV=wrong`
Expected: both abort with a clear refusal message and exit non-zero; NEITHER touches the database. A full restore drill requires a live staging stack and stays NOT EXECUTED locally by design (document the exact drill in Task 7; never claim it passed).

### Task 6: Example env + secrets audit

**Files:**
- Create: `docker/staging/.env.staging.example`

**Interfaces:**
- Consumes: Task 2 compose (key names must match interpolation exactly).
- Produces: placeholder contract relied on by Task 8 env table.

- [ ] **Step 1: Write `.env.staging.example`** — same key shape as local plus `STAGING_WWWROOT=https://STAGING-HOST-PLACEHOLDER`; every secret value a `CHANGEME-staging-*` placeholder; header states real values live ONLY in Coolify env settings, never in git, and explicitly forbids `--env-file docker/local/.env` (or any local env file) in any staging command — staging validation uses ONLY this example file.

- [ ] **Step 2: Run the secrets/hostname audit**

Run: `Select-String -Path docker/staging/*,docker/staging/**/* -Pattern 'portal\.acuiteysolutions|Welcome|BEGIN PRIVATE KEY|BEGIN RSA'`
Expected: no matches (Review Focus 1 + 5).
Run: `Select-String -Path docker/staging/**/* -Pattern 'acuitey-local|localhost:8080'`
Expected: no matches (no local project/URL cross-wiring anywhere in staging files).
Run: `Test-Path docker/staging/.env.staging` and `git status -sb -- docker/staging`
Expected: `.env.staging` does NOT exist; status shows only `?? docker/staging/` (untracked, uncommitted).

### Task 7: README (Coolify manual steps, runbook, rollback)

**Files:**
- Create: `docker/staging/README.md`

**Interfaces:**
- Consumes: outputs and verified facts of Tasks 1–6.
- Produces: the human deployment checklist; no code depends on it.

- [ ] **Step 1: Write `docker/staging/README.md`** — prerequisites (VPS/Coolify access, DNS decision pending); exact manual Coolify steps, each marked verify-on-VPS: create project → add Compose deployment pointing at repo path `docker/staging/compose.yml`; set target service `app`, container port `80` (Traefik routes to the Compose service's internal port — `expose: ["80"]` in compose is documentation only and provides no ingress by itself); attach the approved staging domain (never the portal host); enable TLS (Traefik/Let's Encrypt) so the `https` wwwroot + `sslproxy` config agree; add Traefik basic-auth middleware for staging access restriction; enter env vars from the names-only table (values typed into Coolify, never committed); confirm Coolify-managed volumes map to the named volumes; first-install command (`install_database.php` as `www-data`, DB-empty precheck); cron profile start post-install; backup/restore runbook with exact commands and a full-drill procedure marked VPS-only (RTO/RPO as targets-to-agree); rollback procedure (re-point Coolify at the previous image tag, `restore.sh` with its guards, `admin/cli/upgrade.php` note); noindex verification (`allowindexing=2` + check meta tag); an explicit "validated locally" vs "VPS-only (NOT EXECUTED)" split; explicit non-goals (no portal hostname, no DNS, no prod creds).

### Task 8: Final validation sweep + report

**Files:** none (verification only).

- [ ] **Step 1: Rebuild from clean state and re-run file-level tests**

Run: staging `docker build`, `compose config --quiet`, `php -l` on the config template, `sh -n` on scripts, `apachectl configtest`, the Task 2/4/6 grep audits.
Expected: all PASS.

- [ ] **Step 2: Optional safe runtime boot (no ports, isolated volumes)**

Run: `up -d db` then `up -d app` from `docker/staging/compose.yml` (no published ports, staging-named volumes — zero conflict with the local stack); `docker exec` health + homepage check via container `curl`; then `down` (volumes kept). If ANY doubt about disturbing the local installer, SKIP and mark runtime-boot NOT EXECUTED with reason.
Expected: PASS or NOT EXECUTED (never FAIL-quietly).

- [ ] **Step 3: Core-integrity and Git check**

Run: `git status -sb`, `git diff --stat`, `git branch --show-current`
Expected: branch `feature/ACU-WAVE1`, empty diff, only `?? AUDIT.md` (pre-existing) and `?? docker/` untracked.

- [ ] **Step 4: Report with an evidence verdict table** — one row per required check, each citing its command output: Docker build, Compose validation, PHP requirements, public docroot, persistent storage, PG design, Redis design, cron config, healthchecks, Coolify routing compat, secrets handling, backup/rollback readiness, core integrity. Verdict vocabulary is STRICT: PASS (command output seen) or NOT EXECUTED with reason (VPS-only: Coolify routing end-to-end, TLS issuance, full restore drill, real install). Build/config success must NEVER be presented as deployment readiness. Then list files created, remaining risks, and the manual Coolify checklist pointer. Then STOP.
