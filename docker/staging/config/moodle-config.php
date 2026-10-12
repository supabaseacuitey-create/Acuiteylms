<?php
///////////////////////////////////////////////////////////////////////////
// Acuitey LMS — STAGING config.php template (baked into the staging image).
//
// Installed as <moodle-dist>/config.php. Values come ONLY from runtime
// environment (Coolify env settings) — this file contains NO secret values.
// Reference: moodle/config-dist.php (authoritative for option names).
// Only config-dist.php-verified keys are used here; no invented cache keys.
// Moodle 5.2.3+, PostgreSQL direct connection, NO pooler.
///////////////////////////////////////////////////////////////////////////

unset($CFG);
global $CFG;
$CFG = new stdClass();

function staging_env(string $key, ?string $default = null): ?string {
    $value = getenv($key);
    if ($value === false || $value === '') {
        return $default;
    }
    return $value;
}

// --- 1. DATABASE (PostgreSQL, direct, staging) ---
$CFG->dbtype    = 'pgsql';   // Moodle driver name for PostgreSQL.
$CFG->dblibrary = 'native';
$CFG->dbhost    = staging_env('MOODLE_DB_HOST', 'db');
$CFG->dbname    = staging_env('MOODLE_DB_NAME', 'moodle');
$CFG->dbuser    = staging_env('MOODLE_DB_USER', 'moodle');
$CFG->dbpass    = staging_env('MOODLE_DB_PASSWORD');
if ($CFG->dbpass === null || $CFG->dbpass === '') {
    // Fail closed: never fall back to an empty/default database password.
    if (PHP_SAPI === 'cli') {
        fwrite(STDERR, "config.php: MOODLE_DB_PASSWORD is not set in the environment.\n");
        exit(1);
    }
    http_response_code(500);
    die('Moodle is not configured (missing MOODLE_DB_PASSWORD).');
}
$CFG->prefix    = staging_env('MOODLE_DB_PREFIX', 'mdl_');
$CFG->dboptions = [
    // Direct PostgreSQL. No pgBouncer, no transaction pooling
    // (see config-dist.php notes on dbhandlesoptions/fetchbuffersize).
    'dbpersist' => false,
];

// --- 2. WEB SITE LOCATION (staging; must be https) ---
$CFG->wwwroot = staging_env('STAGING_WWWROOT', 'https://STAGING-HOST-PLACEHOLDER');

// --- 3. DATA FILES LOCATION (persistent volume, outside public webroot) ---
$CFG->dataroot = staging_env('MOODLE_DATAROOT', '/var/moodledata');

// --- 4. DATA FILES PERMISSIONS (config-dist.php default) ---
$CFG->directorypermissions = 02777;

// --- 5. ADMIN DIRECTORY (default) ---
$CFG->admin = 'admin';

// --- 6. REVERSE PROXY / TLS (Coolify/Traefik terminates TLS) ---
// config-dist.php:426 — enable when using an external SSL appliance.
// The site must be reachable via https: ONLY (never both schemes).
$CFG->sslproxy = true;
// config-dist.php:422 ($CFG->reverseproxy) stays UNSET unless Coolify
// port-forwarding demonstrably requires it — a manual VPS step, not a default.

// --- 7. STAGING HARDENING ---
// Noindex: verified Moodle hook (public/lib/classes/output/core_renderer.php:
// $CFG->allowindexing == 2 forces a robots noindex meta tag). Staging must
// never be indexed. Access restriction itself (basic auth) is enforced at
// the Traefik middleware layer — see docker/staging/README.md.
// NOTE: the production portal hostname must never be used as STAGING_WWWROOT.
$CFG->allowindexing = 2;

// --- 8. PRODUCTION-SAFE ERROR HANDLING (staging default) ---
// Debugging stays OFF. To diagnose temporarily, set these via an explicit
// Coolify env change and revert immediately afterwards — never commit.
// Reference: config-dist.php "Force a debugging mode" section.
$CFG->debug = 0;
$CFG->debugdisplay = 0;

// Path to PHP for scheduled/adhoc CLI tasks inside the container.
$CFG->pathtophp = staging_env('MOODLE_PATHTOPHP', '/usr/local/bin/php');

// --- PENDING (intentionally NOT enabled) ---
// Redis sessions / MUC / locking require version-verified Moodle 5.2 cache
// mappings configured via Site administration AFTER installation. The Redis 7
// service in compose is ready, but no session-handler or cache-store settings
// are applied here until verified. No keys are invented here.

require_once(__DIR__ . '/lib/setup.php'); // Do not edit (config-dist.php trailer)
