# Acuitey Moodle 5.2.3+ — Staging Readiness Audit (READ-ONLY)

- Date (UTC): 2026-10-12
- Branch verified: `feature/ACU-WAVE1` (active branch confirmed via `git branch --show-current`)
- Branch SHAs: `main` = `9cc7fc6af`, `develop` = `7cf5d6392`, `feature/ACU-WAVE1` = `7cf5d6392` (develop == feature; both one commit ahead of main)
- Working tree: clean (`git status`: nothing to commit)
- Method: read-only. No files modified except this `AUDIT.md`. No installs, no containers, no deploys, no commits/pushes, no network calls. `.env` contents never read (key names only). No secret values printed here or in chat.
- Evidence convention: `path:line` or command-output summary. `UNKNOWN` = cannot be verified from repo alone.

---

## 1. Executive summary (max 10 lines + risk rating)

1. Branch is `feature/ACU-WAVE1` as required; tree is clean; develop == feature, one commit ahead of main.
2. Moodle core identified locally as 5.2.3+ (`moodle/public/version.php:32-36`); local PHP 8.3.27 satisfies `composer.json` `>=8.3.0`.
3. Zero Wave 1 implementation present: no `theme_acuitey`, none of the 5 required `WAVE1-*.md` reports exist.
4. No staging deployment definition: no `Dockerfile`, no `compose.yml`, no Coolify config, no `moodle/config.php` site config.
5. DB/Redis/cron/moodledata/backup are documented plans only; nothing is configured or verifiable in code.
6. No tracked credential leak found (site config absent; tracked `config.php` files are loader/CI-template/placeholders).
7. Core-integrity baseline is broken: `main` lacks 105 `cache/` files restored on this branch; no upstream tag/remote to diff against.
8. CI is upstream Moodle QA only; no Acuitey staging/deploy workflow, no Behat/codechecker gate for custom code.
9. 17 client decisions (DEC-001..017) remain unresolved per governance docs; Wave 1 was designed to avoid them, but staging still has nothing to promote.
10. Verdict: **NO-GO for staging** until deployment, persistence, and Wave 1 implementation gaps are closed.

**Overall risk rating: HIGH (staging blocked; no data-exposure Critical found).**

---

## 2. Section-by-section status table (items 1–14)

| # | Scope | Status | One-line basis |
|---|-------|--------|----------------|
| 1 | Repo structure, Git config, branching, large/binary files | **Fail** | Vendored 62k-file core, no upstream remote/tag, no `WAVE1-GIT-GOVERNANCE.md`; large ignored zips on disk |
| 2 | Security: credentials, `.gitignore`, tracked secrets, `config.php` | **Pass** | No hardcoded secrets in tracked files (verified); site `moodle/config.php` correctly absent + ignored |
| 3 | Moodle version + PHP/composer deps vs 5.2 requirements | **Unknown** | Version + PHP major verified locally; extensions/`php.ini`/official docs need external verification |
| 4 | Core integrity: modified core, upstream diff | **Fail** | No upstream tag/remote; `main` incomplete (0 `cache/` files) vs feature (105); no `WAVE1-CORE-INTEGRITY.md` |
| 5 | Custom themes/plugins: version/deps/compat/safety | **Fail** | `theme_acuitey` absent (0 files tracked, 0 on disk); 0/5 theme tasks implemented |
| 6 | Database + Redis (pgsql, pooler, sessions/MUC/locks) | **Unknown** | Only `config-dist.php` commented examples + architecture proposals; no staging config to verify |
| 7 | Docker/Coolify readiness (image, compose, health, env, docroot, proxy) | **Fail** | No `Dockerfile`/`compose`/`coolify` tracked; docroot `/public` verified in code but no proxy/env config |
| 8 | Storage, backups, restore, cron | **Fail** | No volume/backup/restore/cron-runner implementation; docs-only targets |
| 9 | PHP extensions, `php.ini`, OPcache, memory/uploads | **Unknown** | Only `php -v` shows PHP 8.3.27 + OPcache build; limits/extensions unverified |
| 10 | DNS, HTTPS, headers, firewall, ports | **Unknown** | Zero evidence in repo; all live-state |
| 11 | CI/CD, tests, lint, branch protection | **Fail** | Upstream QA only; no Acuitey deploy workflow; no Behat/codechecker; no protection evidence |
| 12 | Architecture docs + unresolved decisions | **Fail** | Docs exist but 17/17 DEC items unresolved; `GATE-01` frozen per kickoff/WBS |
| 13 | Implemented vs documented requirements | **Fail** | 0/12 Wave 1 tasks implemented on this branch (gap table §7) |
| 14 | Risks + fixes | **Fail** | 7 High blockers open (see §3/§5) |

Rule applied: nothing marked `Pass` on documentation alone. `Pass` only where locally verified in tracked code/config.

---

## 3. Findings (Critical / High / Medium / Low)

No secret values are reproduced. Secret references use `path:line key-name (value redacted)`.

### Critical — 0 found

No hardcoded credential leak, private key, or token value was found in tracked files or in the two-commit history surface examined. Tracked `moodle/public/config.php:25-31` is a core loader stub (no `$CFG->db*` keys). Tracked `moodle/.github/workflows/composed/config.php:32-38` uses `getenv(...)` (keys `dbtype/dblibrary/dbhost/dbname/dbuser/dbpass/prefix`, values not stored). Site `moodle/config.php` is absent on disk and ignored. `config-dist.php:41-46` contains placeholder keys only (`dbtype/dblibrary/dbhost/dbname/dbuser/dbpass`, values are upstream defaults). This is **not** a clean bill for staging — see High blockers.

### High

| ID | Title | Evidence | Impact | Recommended fix | Effort | Confidence |
|----|-------|----------|--------|-----------------|--------|------------|
| H1 | Wave 1 theme not implemented; nothing staging-ready to promote | `moodle/public/theme/` on disk has only `boost,classic` + core shims; `glob theme/acuitey/**` = 0 files; `git ls-tree` for `acuitey` returns only docs mentions | Staging deploy would ship unmodified Boost; all ACU-THEME-001..005 acceptance fails | Implement ACU-THEME-001..005 under `moodle/public/theme/acuitey/` per `prompt.md:307-429` + `ACUITEY-DESIGN.md`; validate with `php -l`, discovery, SCSS compile | L | High |
| H2 | No Docker/Coolify deployment definition | `glob **/Dockerfile*` = 0; `**/docker-compose*` = 0; `**/compose.yml|yaml` = 0; `**/coolify*` = 0; `git ls-files \| findstr Dockerfile/docker-compose/coolify` = no output | Cannot build/promote reproducibly; Traefik routing, healthchecks, env injection undefined | Add versioned `Dockerfile` + `compose.yml` (or Coolify-managed equivalent in repo), healthcheck, env-key list without values, `/public` docroot | M | High |
| H3 | No persistent moodledata volume, backup, restore drill, or cron runner | No `moodledata/` tracked (correct) and none configured; no volume/compose; `INSTALL.txt:16` + `WBS:932` document `* * * * * cron.php` only; `ARCHITECTURE.md:359-363` targets RTO<1h/RPO<15m are proposal-only | Data loss on redeploy; scheduled tasks/Adhoc never run; restore untested | Define external `dataroot` volume, nightly encrypted offsite backup + restore procedure + drill log, 1-min CLI cron (`admin/cli/cron.php`, not web `cron.php`) | M | High |
| H4 | DB/Redis unconfigured; pooler incompatibility risk open | No site config (`moodle/config.php` absent); `config-dist.php:62` (`dbhandlesoptions`), `:104-112` (`fetchbuffersize`, pgBouncer transaction-mode note), `:366-384` (Redis session handler, all commented) are examples only; subagent doc grep: `cachestore_redis/session_handler/dboptions/dbtype.*pgsql` in `docs/` = 0 hits; `pooler\|pgbouncer\|supabase` = 2 diagram-text hits only | Wrong pooler mode or shared Redis DB breaks sessions/MUC/locks or causes outage | Create staging config from `config-dist.php` via env (direct PG connection, no transaction-mode pooler; dedicated Redis DBs for sessions vs MUC vs locks); document host/port/DB numbers without values | M | High |
| H5 | Core-integrity baseline broken; upstream equivalence unprovable | `git tag` = empty; `git remote -v` = only `origin AcuiteyLMS`; `main` has 0 files under `moodle/public/cache`, feature has 105; diff `main..feature` = 169 files / 33,499 insertions; no `WAVE1-CORE-INTEGRITY.md` | Cannot prove “zero core mods vs official 5.2.3+”; future security patches have no clean base | Add upstream `moodle` remote + `v5.2.3` tag reference (no code change now), publish `WAVE1-CORE-INTEGRITY.md` with `git diff --stat`, `php -l` log, and explicit added-vs-modified split | S | High |
| H6 | No staging CI/CD pipeline; branch protection unevidenced | Tracked workflows only: `push.yml:1-125`, `composed.yml:1-118`, `onebyone.yml`, `windows.yml`, `web-installer-test.yml` (all upstream core QA: Grunt + PHPUnit mysqli/pgsql + ephemeral redis/postgres); grep `coolify\|staging\|deploy\|ACUITEY` in workflows = 0 hits | Manual deploys, no quality gate for `theme_acuitey`, no attestable promotion | Add Acuitey workflow (lint + `php -l` + PHPCS + PHPUnit smoke + build/push image) + required checks + secret-scanning; document branch protection | M | High |
| H7 | Reverse-proxy/HTTPS/headers/firewall/ports undefined in repo | No compose/Traefik labels, no `sslproxy`/`reverseproxy` config (only `config-dist.php` commented examples exist upstream); `docs/architecture` proposes Hostinger KVM + Nginx + Cloudflare but Coolify/Traefik absent from docs grep | Staging behind Coolify/Traefik will loop/misroute or expose insecure headers/ports | Define `wwwroot`, `sslproxy`, `reverseproxy`, trusted proxies, HSTS/X-Frame/X-Content headers, firewall + exposed-port list as code/docs | M | Med |

### Medium

| ID | Title | Evidence | Impact | Recommended fix | Effort | Confidence |
|----|-------|----------|--------|-----------------|--------|------------|
| M1 | All 5 required Wave 1 governance/baseline reports missing | `glob docs/implementation/*.md` = 6 planning docs only; `**/WAVE1-*.md` = 0; expected per `prompt.md:165,201,221,276,304,441,495`: `WAVE1-GIT-GOVERNANCE.md`, `WAVE1-DEV-TOOLING.md`, `WAVE1-PERFORMANCE-BASELINE.md`, `WAVE1-COURSE-CATEGORY-BASELINE.md`, `WAVE1-ENROLMENT-BASELINE.md`, `WAVE1-CORE-INTEGRITY.md`, `WAVE1-IMPLEMENTATION-REPORT.md` | No auditable baseline for env/tooling/perf/category/enrolment/integrity | Author the 7 files from local evidence only; mark unexecuted checks `NOT EXECUTED — reason` | S | High |
| M2 | PHP runtime limits/extensions unverified | Locally verified: `php -v` = `PHP 8.3.27 + OPcache v8.3.27`; `composer.json:31` requires `php >=8.3.0` + extensions list (`intl, pgsql suggestion`, etc.); `INSTALL.txt:1-20` has no extension list | Staging image may lack `pgsql/intl/soap/opcache` tuning, `memory_limit/upload_max_filesize/post_max_size/max_execution_time` | Publish required `php -m` + `php.ini` values from staging image + Coolify env; set OPcache for production | S | High |
| M3 | 17/17 client decisions unresolved; staging hostname/taxonomy blocked | `ACUITEY-OPEN-DECISIONS.md:6` “Requires Formal Client Confirmation”; `KICKOFF-PLAN.md:15` + `WBS:9` “FROZEN ON HOLD — PENDING GATE-01”; DEC-001..017 table in subagent evidence (e.g. DEC-013 `OPEN-DECISIONS.md:197-208`, DEC-017 `:249-266`) | Wave 1 can proceed (by design avoids DECs) but Phase 1 taxonomy (`ACU-BASE-003`), hostname (`ACU-OPS-001/004`), and all routing/pay/LTI work cannot | Keep Wave 1 DEC-free; gate staging hostname + category taxonomy on DEC-017/DEC-013 sign-off before promoting beyond foundation | S | High |
| M4 | 62k-file vendored core with no upstream update path; large PDFs in git | `git ls-tree main` ≈ 62,026 files, feature ≈ 62,194; `git ls-tree -l` top blobs include `ckeditor.js.map` 6.8MB, `video-lazy` 3.2MB, `docs/deliverables/*.pdf` 1.1–2.0MB | Security-patch cost, clone/CI bloat, binary churn | Add upstream remote + tag, document update procedure, move deliverable PDFs to releases; consider submodule/sparse strategy long-term | M | Med |
| M5 | Large ignored artifacts present on disk | `moodle.zip` 261,724,580 bytes, `bkp_docs.zip` 7,221,611 bytes, `project_structure.txt` 196,608 bytes on disk; `git check-ignore -v` maps them to `.gitignore:45 *.zip`, `:110 project_structure.txt`, `:59 .venv/`, `:68 graphify-out/`; `git status` clean (untracked-but-ignored) | Disk/bandwidth hygiene; risk of accidental force-add | Keep ignored; remove or relocate out of workspace; never `git add -f` archives | S | High |
| M6 | No Behat/codechecker gate for custom code | `push.yml:34-46` Grunt gate + `:119,125` PHPUnit init/run; `composed.yml:92-118` same; `onebyone.yml:21-27` dispatch-only; grep `behat\|codechecker\|moodle-plugin-ci` in workflows = 0 custom hits | Theme regressions undetected | Enable PHPCS (`phpcs.xml.dist` exists) + PHPUnit smoke for `theme_acuitey`; add Behat readiness doc per ACU-ENV-003 | S | Med |

### Low

| ID | Title | Evidence | Impact | Recommended fix | Effort | Confidence |
|----|-------|----------|--------|-----------------|--------|------------|
| L1 | Planning-doc count inconsistency | `KICKOFF-PLAN.md:23` says Category A 31 but `:38` header says 32; `:25` says Category B 15 but `:93` header says 14 | Confusion in scope tracking | Correct counts or add footnote; single source in WBS | S | Med |
| L2 | Performance baseline unmeasured | No `WAVE1-PERFORMANCE-BASELINE.md`; acceptance `ACCEPTANCE-CRITERIA.md:284-290` (TTFB<250ms/page<800ms/≤25 queries) vs `WBS:107,149` (TTFB<300ms) unmeasured | Cannot claim Redis/MUC benefit later | Record local-only baseline explicitly as `LOCAL DEVELOPMENT BASELINE` per `prompt.md:223-227` | S | High |
| L3 | Single remote, no Moodle upstream | `git remote -v` = `origin https://github.com/atuladarsh/AcuiteyLMS.git` only | Manual upstream compares | `git remote add moodle https://github.com/moodle/moodle.git` (read-only reference) + tag fetch policy | S | High |

---

## 4. Missing configurations (must exist before staging)

1. `moodle/config.php` (site config, env-driven, never committed): `wwwroot`, `dataroot` (external volume), `dbtype=pgsql`, direct host/port/name, `dbuser`, `dbpass` (value redacted), `prefix`, `dboptions` (pooler-safe), `session_handler_class` + Redis host/port/DB/auth/prefix (dedicated DBs), `sslproxy`/`reverseproxy`/trusted proxies, `directorypermissions`, debug/cron settings.
2. `Dockerfile` + `compose.yml`/Coolify service: PHP 8.3 image with required extensions, `/public` docroot, healthcheck (`admin/cli/cron.php --help` or HTTP check), env-key allowlist, `moodledata` volume mount, 1-min cron sidecar/service.
3. Persistent volume + backup/restore runbook + drill evidence (RTO/RPO agreed; PITR + dumps + `dataroot` snapshots).
4. Traefik/Coolify routing + TLS + security headers + firewall/exposed-port matrix.
5. `php.ini`/OPcache policy: `memory_limit`, `upload_max_filesize`, `post_max_size`, `max_execution_time`, `opcache.enable`, `intl/pgsql/soap/gd/zip` presence.
6. Acuitey CI workflow + branch protection + secret scanning (no values in repo).
7. `WAVE1-*.md` baselines + `theme_acuitey/version.php` metadata (`version`, `requires`, `component`, `maturity`).

---

## 5. Deployment blockers (all must be `PASS` before staging deploy)

- [ ] B1 — `theme_acuitey` implemented and discoverable (currently 0 files) — **FAIL**
- [ ] B2 — Reproducible image + compose/Coolify definition with healthcheck — **FAIL**
- [ ] B3 — External `moodledata` on persistent volume (outside webroot) — **FAIL (unconfigured)**
- [ ] B4 — Site `config.php` via env; pgsql direct (no transaction-mode pooler); Redis sessions/MUC/locks isolated — **FAIL (unconfigured)**
- [ ] B5 — 1-min CLI cron running (`admin/cli/cron.php`) with <60s recency check — **FAIL (documented only)**
- [ ] B6 — Backup + restore tested with evidence — **FAIL**
- [ ] B7 — No secrets in git history/protected files (site config absent, loader/template only) — **PASS (verified; re-verify after config is introduced)**
- [ ] B8 — Core-integrity report + upstream tag reference — **FAIL**
- [ ] B9 — Staging `wwwroot`/TLS/proxy/headers verified behind Traefik — **FAIL (unknown)**
- [ ] B10 — PHP extensions + `php.ini`/OPcache verified in image — **FAIL (unknown; only `php -v` local)**
- [ ] B11 — CI required checks green on the staging SHA — **FAIL (no Acuitey pipeline)**

Result: **9/11 blockers failing → NO-GO.**

---

## 6. Needs manual verification (exact commands/settings; live systems not in repo)

- Staging Coolify service: confirm image tag, env keys present (values hidden), volume mount for `dataroot`, healthcheck URL, 1-min cron service logs. Check: Coolify UI → service → `Volumes`, `Env`, `Healthchecks`, `Logs`; `docker exec <app> php admin/cli/cron.php --help`.
- Database: `psql` connectivity from app net (no pooler transaction mode). Check: staging `config.php` keys `dbtype/dbhost/dbname/dbuser` (names only) + `dboptions/dbhandlesoptions/fetchbuffersize` per `config-dist.php:48-112`; Supabase dashboard → connection mode = `session`/direct, not `transaction`.
- Redis 7: `redis-cli -h <host> -p <port> INFO replication` + `CONFIG GET maxmemory*`; verify distinct DB indices/ prefixes for sessions vs MUC; check `session_handler_class` key name in staging config (value hidden).
- PHP in image: `php -v`, `php -m`, `php -i | findstr /I "memory_limit upload_max_filesize post_max_size max_execution_time opcache.enable"` (or Linux `grep -i` equivalent on VPS).
- Moodle install state: once deployed, `php admin/cli/cron.php` recency, `Site administration → Server → System paths` (`dataroot` outside `/public`), `Server → Session handling`, `Caching → Cache stores` (Redis mapped).
- DNS/TLS/headers/ports: `nslookup <staging-host>`, browser HSTS check, `curl -I https://<staging-host>` (verify `Strict-Transport-Security`, `X-Frame-Options`, `X-Content-Type-Options`), VPS `ufw status` / Hostinger firewall rules, `ss -tlnp` for exposed ports, Traefik router TLS=true.
- GitHub: `Settings → Branches → protection` (require PR + required checks), `Settings → Secrets and variables → Actions` (keys only), `Actions` run for staging SHA green.
- Git history secret re-scan after staging config lands: `git log --all --oneline -S "dbpass" -- moodle/config.php`, `git log --all --oneline -S "BEGIN PRIVATE KEY"`, `git grep -n -i -E "api[_-]?key|secret|token" -- <staging-config-dir>` (report file:line:key only, never values).
- Moodle requirements cross-check (external): compare `moodle/public/version.php:32-36` + `moodle/composer.json:31-50` against `https://docs.moodle.org` / `INSTALL.txt:18` for PHP 8.3 extension list; mark any delta `UNKNOWN` until docs confirm.

---

## 7. Requirements gap table (documented vs implemented on `feature/ACU-WAVE1`)

Source of record: `prompt.md:31-47` (12 Wave 1 tasks), `docs/implementation/ACUITEY-IMPLEMENTATION-WBS.md:98-286`, `docs/implementation/ACUITEY-KICKOFF-PLAN.md:136-143,225-228`, acceptance `ACUITEY-ACCEPTANCE-CRITERIA.md:12-19,250-300`.

| Task | Documented requirement | Implemented on branch | Gap |
|------|------------------------|-----------------------|-----|
| ACU-ENV-001 Local env (5.2.3+, PHP, PG, dataroot, cron, debug) | `prompt.md:113-142`; WBS ENV gates `WBS:107` | Moodle code present + `php -v` 8.3.27 ok; no site install, no `moodle/config.php`, no dataroot volume, no cron service | **Open** — env detected, not established |
| ACU-ENV-002 Git governance | `prompt.md:145-176` → `WAVE1-GIT-GOVERNANCE.md` | `.gitignore` improved (narrows `**/config.php` to `/moodle/config.php` etc.) but report missing; 62k vendored files, no upstream | **Open** — partial ignore fix only |
| ACU-ENV-003 Dev tooling | `prompt.md:179-203` → `WAVE1-DEV-TOOLING.md`; `phpcs.xml.dist`, `phpunit.xml.dist`, Grunt present | No `WAVE1-DEV-TOOLING.md`; PHPCS/PHPUnit/Behat readiness undocumented for Windows; only `php -l` spot-checked | **Open** |
| ACU-ENV-004 Perf baseline | `prompt.md:206-228` → `WAVE1-PERFORMANCE-BASELINE.md`; criteria `ACCEPTANCE:284-290` | File missing; no TTFB/query measurement; Redis correctly not yet deployed | **Open (expected: local-only baseline)** |
| ACU-BASE-001 Site settings (identity/lang/timezone) | `prompt.md:231-254`; WBS `WBS:167` (IST title gated) | No installed site to configure; timezone correctly left unchanged (unconfirmed) | **Open — correctly deferred** |
| ACU-BASE-002 Categories | `prompt.md:257-278` → `WAVE1-COURSE-CATEGORY-BASELINE.md`; blocked by DEC-013 | File missing; no SAMPLE categories (correct per DEC-013 hold) | **Open — correctly deferred** |
| ACU-BASE-004 Enrolment (`self`, `fee`, no gateway) | `prompt.md:281-305` → `WAVE1-ENROLMENT-BASELINE.md` | File missing; native plugins uninspected (no runtime) | **Open** |
| ACU-THEME-001 Skeleton `theme_acuitey` (parent Boost) | `prompt.md:307-338`; WBS `WBS:227` installable/selectable | 0 files (glob + `theme/` listing confirm) | **Open** |
| ACU-THEME-002 Tokens/SCSS (`#0C192C`, `#1D4ED8`) | `prompt.md:341-365`; WBS `WBS:241` | Absent with parent task | **Open** |
| ACU-THEME-003 Components (buttons/inputs/cards/badges/tables/focus) | `prompt.md:367-386`; criteria `AC-A11Y-001/002`, `AC-RESP-001` | Absent | **Open** |
| ACU-THEME-004 Navbar (60px, preserve session/menus/a11y) | `prompt.md:388-409`; WBS `WBS:269` | Absent | **Open** |
| ACU-THEME-005 Drawer (preserve tree/perms/collapse, <1024px) | `prompt.md:411-429`; WBS `WBS:283` | Absent | **Open** |
| Core integrity + validation + report | `prompt.md:431-514` → `WAVE1-CORE-INTEGRITY.md`, `WAVE1-IMPLEMENTATION-REPORT.md`; `PASS/FAIL/NOT EXECUTED` discipline | Reports missing; only ad-hoc `php -l` on 3 files this audit | **Open** |

Score: **0/12 Wave 1 tasks complete** on verified branch state. No evidence of out-of-scope Wave 2 work (good containment).

---

## 8. Prioritized action plan

### Now (audit hygiene, no staging impact)

- Decide vendored-core vs upstream-remote strategy; add Moodle upstream remote + tag reference (read-only).
- Remove/relocate `moodle.zip`, `bkp_docs.zip` from workspace root (keep ignored; never force-add).
- Fix `KICKOFF-PLAN.md` Category A/B count footnotes (L1).
- Keep `DEC-*` untouched (do not self-resolve per `prompt.md:81`).

### Before staging (must complete for GO)

1. Implement ACU-THEME-001..005 + `version.php`/`config.php`/`lib.php`/`settings.php`/lang minimum per installed 5.2 APIs (parent `theme_boost`).
2. Author the 7 `WAVE1-*.md` baselines from local evidence; use `PASS/FAIL/NOT EXECUTED — reason` honestly.
3. Add `Dockerfile` + `compose`/Coolify definition (`/public` docroot, healthcheck, env keys, `dataroot` volume, 1-min `admin/cli/cron.php`).
4. Provide env-driven `moodle/config.php` template (keys only in repo); configure staging direct-PG + dedicated Redis DBs; set `sslproxy`/proxy/headers.
5. Implement backup/restore runbook + drill; verify `php -m`/`php.ini`/OPcache in image.
6. Add Acuitey CI (PHPCS + `php -l` + PHPUnit smoke + image build) + branch protection + secret scan.
7. Publish `WAVE1-CORE-INTEGRITY.md` (`git diff --stat main..feature`, added-vs-modified split, `php -l` log).

### Before production (after staging GO)

- DEC-013 taxonomy + DEC-017 hostname sign-off; full enrolment/category/theme fidelity gates (`ACCEPTANCE:12-19,250-300`).
- Behat suite + accessibility/contrast audit + responsive matrix (390px, 44px targets).
- PITR + offsite backup SLA proof, load baseline (TTFB<250ms/page<800ms/≤25 queries), Redis/MUC benchmark as `LOCAL` vs `STAGING` (never claim prod perf early).
- Security hardening review (headers, firewall, exposed ports, secret rotation) + UAT sign-off per `ACU-UAT-003`.

---

## 9. Staging GO / NO-GO checklist + final verdict

Pass/fail criteria (concrete; `UNKNOWN` = fail for GO):

- [ ] No secrets in git history or tracked configs (keys only; values redacted) — **PASS** (loader + `getenv` template + placeholders only; site config absent)
- [ ] `moodledata` on persistent volume outside webroot — **FAIL**
- [ ] 1-min CLI cron running with <60s recency — **FAIL**
- [ ] Backup taken + restore tested with log — **FAIL**
- [ ] Direct-PG (no transaction pooler) + Redis sessions/MUC/locks isolated — **FAIL**
- [ ] Image + compose/Coolify + healthcheck + env allowlist versioned — **FAIL**
- [ ] `wwwroot`/TLS/Traefik proxy + headers verified — **FAIL**
- [ ] PHP extensions + `php.ini`/OPcache verified in image — **FAIL**
- [ ] CI required checks green on deploy SHA — **FAIL**
- [ ] `theme_acuitey` installs/selects; SCSS compiles; smoke (desktop/mobile navbar+drawer) passes — **FAIL**
- [ ] Core-integrity report + upstream tag reference published — **FAIL**
- [ ] `WAVE1-*.md` baselines published (no `PASS` claimed without execution) — **FAIL**

**Final verdict: NO-GO for staging.** Only the secrets-hygiene criterion passes. Promoting this SHA would deploy unmodified Boost with no persistence, no runner, no pipeline, and no auditable baseline. Close §8 “Before staging” items, then re-audit the staging SHA.

---

## 10. Appendix: files reviewed and commands run

### Files reviewed (representative; full `git ls-tree` ≈ 62k files not enumerated)

- `moodle/public/version.php:1-37` (5.2.3+, branch `502`)
- `moodle/composer.json:1-109` (`php >=8.3.0`, `haspublicdir:true`, `pgsql` suggested)
- `moodle/config-dist.php:30-159` (DB example + `dbhandlesoptions`, `fetchbuffersize`/pgBouncer notes) and `:340-399` (session handlers incl. Redis `:366-384`, commented)
- `moodle/public/config.php:1-31` (loader stub; no `$CFG->db*`)
- `moodle/.github/workflows/composed/config.php:1-60` (CI template, `getenv`, no literals)
- `moodle/.github/workflows/push.yml:1-125`, `composed.yml:1-118`, `onebyone.yml:1-100`, `windows.yml:1-35`, `web-installer-test.yml:1-23`
- `moodle/INSTALL.txt:1-20`, `moodle/phpunit.xml.dist`, `moodle/phpcs.xml.dist` (existence)
- `.gitignore:1-110` (vs `main:.gitignore` overbroad `**/config.php`)
- `.env.cgr.example` (key names only: `TARGET_REPO_PATH`, `MEMGRAPH_*`, `CYPHER_*/ORCHESTRATOR_*`)
- `prompt.md:1-553` (Wave 1 governance + 12 tasks + stop conditions)
- `docs/implementation/ACUITEY-*.md` (6 files), `docs/architecture/ARCHITECTURE.md:307-363,398-404` + `08-deployment-architecture.html`, `docs/design/ACUITEY-DESIGN.md`, `docs/client-review/*`, `docs/deliverables/*` (PDF presence noted)
- `moodle/public/theme/` listing (no `acuitey`), `moodle/public/cache/` (105 files on feature, 0 on main), `docs/editorial-system-design` pooler mentions (2 hits)

### Commands run (read-only; PowerShell host)

- `git branch --show-current` → `feature/ACU-WAVE1`
- `git status`, `git remote -v`, `git log --oneline -20`, `git log --oneline --all --graph -15`
- `git rev-parse main develop feature/ACU-WAVE1`
- `git diff --stat main..feature/ACU-WAVE1` → 169 files, 33,499 insertions
- `git diff --name-status main..feature/ACU-WAVE1` / `main..develop` / `develop..feature` (last = empty)
- `git ls-tree -r --name-only <ref>` (+ `-- moodle`, `+ -- moodle/public/cache`, `+ -- moodle/.github`), `git ls-tree -r -l` (size sort), `git ls-tree -r --name-only <ref> | Measure-Object -Line`
- `git show <sha>:moodle/public/config.php`, `git show main:.gitignore`, `git show --name-status --oneline HEAD`, `git log --oneline -- moodle/public/config.php`, `git log --oneline -S "dbpass|password|BEGIN PRIVATE KEY" --all` (commit+file only)
- `git grep -n -i -E "dbpass|secret|api[_-]?key|private[_-]?key|BEGIN (RSA |OPENSSH |EC )?PRIVATE KEY" <ref> -- moodle docs` (file:line:key only)
- `git check-ignore -v moodle.zip bkp_docs.zip project_structure.txt .venv graphify-out`
- `git ls-files | Select-String "zip$|env$|config.php$|Dockerfile|docker-compose|coolify"` (tracked-file existence)
- `php -v` → `PHP 8.3.27 + OPcache v8.3.27`; `php -l moodle/public/{config,version,cache/classes/cache,cache/stores/redis/lib}.php`
- Directory reads via `read` tool: workspace root, `moodle/`, `docs/`, `docs/implementation/`; `glob` for `Dockerfile*`, `docker-compose*`, `theme/acuitey/**`, `docs/implementation/*.md`, `phpunit.xml*`
- Redacted content views: `Get-Content <file> | % { mask quoted strings }` for `config.php` files; `Get-Content .env.cgr.example | % { key names only }`; `Select-String` key-name extraction (values never printed)
- Subagent (read-only) doc/CI sweeps for DEC table, `WAVE1-*` absence, workflow summaries, `config-dist.php` pooler/Redis notes, cron hits

### Not verified (intentionally; would require network/live access)

- Official Moodle 5.2.3+ PHP/extension matrix (compare local `version.php`/`composer.json` vs docs site on staging host)
- Live DNS, VPS/Coolify UI state, Traefik routers, TLS certs, firewall rules, exposed ports, backup restores, cron recency, DB pooler mode, Redis `INFO`
- GitHub branch protection, Actions secrets/attestations, required-check status for a future staging SHA

*End of audit. Only `AUDIT.md` was created; no other files were modified, moved, or deleted.*
