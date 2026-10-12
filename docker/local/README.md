# Acuitey LMS — Local Docker Development Environment

Local development ONLY. Nothing here targets production (Hostinger / Coolify /
Supabase / `portal.acuiteysolutions.com`). No production credentials, hosts, or
DNS appear in this folder.

## Prerequisites

- Windows 11 + WSL 2, Docker Desktop (Linux containers) with `docker compose`.
- This repository checked out on branch `feature/ACU-WAVE1`.
  Do NOT switch, create, or reset branches for this setup.
- Ports free on the Windows host: `127.0.0.1:8080` (web). DB/Redis expose NO
  host ports by design.
- Existing XAMPP installation is NOT used and must NOT be modified.

## Project structure

```text
docker/local/
  Dockerfile          PHP 8.3 + Apache image (Moodle extensions, public docroot)
  compose.yml         Services: app, db (PostgreSQL 16), redis (Redis 7), cron (opt-in profile)
  apache/moodle.conf  VirtualHost, DocumentRoot = /var/www/moodle/public
  php/development.ini Dev PHP limits (max_input_vars=5000, memory/uploads, OPcache dev mode)
  scripts/docker-entrypoint.sh  Makes the moodledata VOLUME writable (never touches source)
  scripts/moodle-cron.sh        60s cron loop with flock (start only AFTER install)
  .env.example        Placeholder keys ONLY (tracked)
  .env                LOCAL-ONLY values (git-ignored, never commit)
  README.md           This file

moodle/config.php     Site config, env-driven, git-ignored (created once, only if absent)
```

Containers / volumes / network use the `acuitey-local-*` prefix so they never
collide with unrelated Docker projects.

## Create `.env` from `.env.example`

```powershell
Copy-Item docker/local/.env.example docker/local/.env
# Edit docker/local/.env and set local-only passwords:
#   POSTGRES_PASSWORD=...   (local dev only, alphanumeric recommended;
#                            avoid `$` which Compose would interpolate)
#   MOODLE_DB_PASSWORD=...   (same value as POSTGRES_PASSWORD for local dev)
```

Required local variables: `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD`,
`MOODLE_DB_HOST` (=`db`), `MOODLE_DB_NAME`, `MOODLE_DB_USER`,
`MOODLE_DB_PASSWORD`, `MOODLE_DB_PREFIX`, `MOODLE_WWWROOT`
(`http://localhost:8080`), `APP_PORT` (`8080`).

## Build and start

From the repository root (`C:\Users\Atul\Desktop\moodle`):

```powershell
$env:PATH += ';C:\Users\Atul\AppData\Local\Programs\DockerDesktop\resources\bin'
docker compose -f docker/local/compose.yml --env-file docker/local/.env config --quiet  # validate
docker compose -f docker/local/compose.yml --env-file docker/local/.env build app        # build PHP image
docker compose -f docker/local/compose.yml --env-file docker/local/.env up -d db redis    # start data services
docker compose -f docker/local/compose.yml --env-file docker/local/.env up -d app        # start Moodle web
```

Wait for `db` and `redis` to report `(healthy)` before starting `app`
(`depends_on: service_healthy` also enforces this).

## Access Moodle

- URL: `http://localhost:8080` (bound to `127.0.0.1` only).
- Before installation the site redirects (HTTP 303) into the Moodle installer.
- Installation is a SEPARATE, explicitly-authorized step (see below). Containers
  running does NOT mean Moodle is installed.

## Stop and restart

```powershell
docker compose -f docker/local/compose.yml --env-file docker/local/.env stop      # stop, keep volumes
docker compose -f docker/local/compose.yml --env-file docker/local/.env start app # restart web only
docker compose -f docker/local/compose.yml --env-file docker/local/.env ps        # status
docker compose -f docker/local/compose.yml --env-file docker/local/.env down      # stop + remove containers/network (VOLUMES KEPT)
```

`down` does NOT delete `acuitey-local-pgdata` / `acuitey-local-moodledata`.

## Logs

```powershell
docker logs acuitey-local-app
docker logs acuitey-local-db
docker logs acuitey-local-redis
docker compose -f docker/local/compose.yml --env-file docker/local/.env logs -f app
```

## Moodle CLI commands

Working directory inside the app container is the Moodle distribution root
(`/var/www/moodle`), so `admin/cli/*` paths resolve (Moodle 5.2 layout):

```powershell
docker exec acuitey-local-app php -v
docker exec acuitey-local-app php -m
docker exec acuitey-local-app php admin/cli/cfg.php --name=wwwroot
docker exec -u www-data acuitey-local-app php admin/cli/cron.php        # one-shot, AFTER install only (www-data keeps dataroot ownership clean)
```

Never use `php -S`; Apache is the web server.

## Moodle installation (explicitly gated)

> INSTALLATION CREATES DATABASE TABLES. Do not run until authorized.
>
> Because the environment-driven `moodle/config.php` already exists,
> `admin/cli/install.php` refuses to run (it reports "use
> `admin/cli/install_database.php`"). The correct tool is
> `install_database.php`, which reuses the existing `config.php` — DB
> type/host/name/user, prefix, wwwroot and dataroot all come from there, so
> those flags do not exist on this script (unknown options abort the run).

Precheck — the database must be the LOCAL service and empty:

```powershell
docker exec acuitey-local-db psql -U moodle -d moodle -t -c 'SELECT count(*) FROM pg_tables WHERE schemaname NOT IN (''pg_catalog'',''information_schema'');'
# expect 0. If a previous install was interrupted, do NOT blindly re-run:
# first check `docker exec acuitey-local-app ps -o pid,etime -C php` — if the
# installer is still alive, leave it alone until it exits.
```

Run as `www-data` (same uid as Apache), with the local-only admin password
held in a shell variable — never typed literally into commands, files, or
chat:

```powershell
docker exec -i -u www-data acuitey-local-app php admin/cli/install_database.php `
  --lang=en --adminuser=admin --adminemail=<local-admin-email> `
  --fullname='Acuitey LMS - Local Development' --shortname='AcuiteyLocal' `
  --agree-license --adminpass=$adminPass
```

Notes:

- `--chmod`, `--dbtype/--dbhost/--dbname/--dbuser/--dbpass`, `--wwwroot`,
  `--dataroot` and `--non-interactive` are NOT options of
  `install_database.php`. (No `--non-interactive` flag exists; the script is
  non-interactive when all required options are supplied.)
- CLI arguments are briefly visible in the container process table while the
  installer runs. After a successful install, rotate the local admin password
  via Site administration → Users → Browse list of users.
- After a successful install, verify `http://localhost:8080` returns HTTP 200
  (before installation it returns 303 into the installer).

## Cron

- One-shot (safe anytime AFTER install):
  `docker exec acuitey-local-app php admin/cli/cron.php`
- Recurring 60s service (ONLY after install completes):

```powershell
docker compose -f docker/local/compose.yml --env-file docker/local/.env --profile cron up -d cron
docker logs acuitey-local-cron
```

The loop uses `flock` so runs never overlap.

## Troubleshooting

- `config --quiet` fails: `.env` missing or a `..._PASSWORD` empty. Recreate
  `.env` from `.env.example`; never commit it (`git status` must not list it —
  it is ignored via `.gitignore:7`).
- `app` unhealthy / slow first page: cold Moodle cache builds on a Windows
  bind-mount are slow; the healthcheck allows 90s startup + 30s checks.
- `MOODLE_DB_PASSWORD is not set`: container env missing; check
  `docker exec acuitey-local-app env | grep MOODLE_` (names only).
- DB auth errors: `POSTGRES_PASSWORD` and `MOODLE_DB_PASSWORD` must match;
  both come from `docker/local/.env`.
- Port clash on 8080: set `APP_PORT=8081` in `.env`, recreate `app`. Never
  touch XAMPP ports.
- Never run `docker system prune` / `docker volume prune` (would endanger
  unrelated projects).
- Secret hygiene: plain `docker compose config` (without `--quiet`) prints
  interpolated passwords — always validate with `config --quiet`. `docker
  inspect` on a running container likewise shows env values; never paste that
  output into tickets, docs, or chat. `ps -o cmd` inside the app container
  exposes CLI arguments — use `ps -o pid,etime -C php` for status checks.

## Inspect persistent volumes (safe, read-only)

```powershell
docker volume ls --filter name=acuitey-local
docker volume inspect acuitey-local-moodledata
docker volume inspect acuitey-local-pgdata
docker exec acuitey-local-db psql -U moodle -d moodle -t -c 'SELECT count(*) FROM pg_tables;'
```

## Reset ONLY this project's environment (DESTRUCTIVE — READ FIRST)

> WARNING: this permanently deletes the local dev database AND moodledata.
> It does NOT touch Moodle source, Git branches, XAMPP, or any other project.
> Stop and confirm before running.

```powershell
docker compose -f docker/local/compose.yml --env-file docker/local/.env down
docker volume rm acuitey-local-pgdata acuitey-local-moodledata
```

## Implemented vs pending

Implemented:

- Pinned `php:8.3-apache-bookworm` app image with Moodle extensions
  (pgsql/pdo_pgsql, gd, intl, zip, soap, exif, sodium, OPcache), rewrite,
  `moodle/public` docroot bound to `127.0.0.1:8080`.
- PostgreSQL 16 (persistent volume, direct connection, healthcheck, no host
  port, no pooler) and Redis 7 (internal-only, healthcheck, ephemeral dev
  cache) services.
- Env-driven `moodle/config.php` (git-ignored): pgsql, `wwwroot`
  `http://localhost:8080`, `dataroot` `/var/moodledata` (external volume),
  dev debugging, fail-closed on missing DB password.
- One-shot + opt-in recurring CLI cron (post-install only).

Pending (require separate authorization / verification):

- Moodle installation itself (`admin/cli/install.php`, admin credentials).
- Recurring cron start (only after install).
- Redis sessions / MUC / locking mappings (service ready; Moodle-side cache
  configuration must be version-verified first — no keys invented here).
- `phpredis` PHP extension (add to Dockerfile only together with the verified
  Redis integration above).
- Custom Acuitey theme / Wave 1 application work (explicitly out of scope).
