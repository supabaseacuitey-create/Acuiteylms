BEGIN PRODUCTION IMPLEMENTATION — WAVE 1 ONLY

Project workspace:

C:\Users\Atul\Desktop\moodle

This is the FIRST approved production implementation phase.

Use as governing documents:

docs/implementation/ACUITEY-IMPLEMENTATION-WBS.md
docs/implementation/ACUITEY-KICKOFF-PLAN.md
docs/implementation/ACUITEY-OPEN-DECISIONS.md
docs/implementation/ACUITEY-COMPONENT-MAPPING.md
docs/implementation/ACUITEY-ACCEPTANCE-CRITERIA.md

Design source of truth:

docs/design/ACUITEY-DESIGN.md
docs/design/FINAL-DESIGN-REVIEW.md

Prototype references:

docs/design/prototypes/homepage.html
docs/design/prototypes/course-catalogue.html
docs/design/prototypes/student-dashboard.html
docs/design/prototypes/faculty-dashboard.html

IMPORTANT GOVERNANCE:

Implement ONLY the 12 approved Wave 1 tasks:

ACU-ENV-001
ACU-ENV-002
ACU-ENV-003
ACU-ENV-004

ACU-BASE-001
ACU-BASE-002
ACU-BASE-004

ACU-THEME-001
ACU-THEME-002
ACU-THEME-003
ACU-THEME-004
ACU-THEME-005

Do NOT start any other WBS task.

--------------------------------------------------

ABSOLUTE CONSTRAINTS
--------------------------------------------------

1. ZERO Moodle core modifications.

Do not edit existing files under core locations such as:

/admin
/course
/enrol
/lib
/mod
/user
/theme/boost

unless the file is part of a newly created supported plugin/theme path.

1. Do not implement:

- local_acuitey routing engine
- capacity rules
- candidate selection
- reassignment logic
- timeout logic
- payment gateway code
- certificate backend
- Zoom account-specific integration
- automated faculty status changes

1. Do not resolve any DEC-* item yourself.

2. Do not introduce speculative database tables.

3. Do not modify the design prototypes.

4. Do not create unsupported Moodle hacks.

--------------------------------------------------

PRE-FLIGHT CHECK
--------------------------------------------------

Before writing files:

1. Inspect the current Moodle source tree.
2. Confirm exact Moodle version.
3. Confirm PHP requirements from this Moodle version.
4. Inspect the existing Git state.
5. Check whether config.php exists.
6. Check whether Moodle is already installed locally.
7. Inspect existing theme directory structure.
8. Inspect Boost theme structure relevant to inheritance.
9. Inspect current .gitignore.
10. Check available PHP, Composer, Node/npm and database tooling.

Report any environment limitation before attempting destructive configuration.

Do not delete or overwrite existing user configuration.

--------------------------------------------------

TASK ACU-ENV-001
LOCAL DEVELOPMENT ENVIRONMENT
--------------------------------------------------

Establish or verify a working local Moodle development environment.

Target:

Moodle 5.2.3+

Requirements:

- supported PHP version
- required PHP extensions
- PostgreSQL preferred for Acuitey target alignment
- local web runtime
- Moodle debugging suitable for development
- writable moodledata outside web root
- cron availability

IMPORTANT:

Do not force Docker if a working native environment already exists.

Inspect first and use the least disruptive setup.

Do not place secrets in Git.

If local database credentials are required, use local-only configuration and document them via example placeholders rather than committing secrets.

--------------------------------------------------

TASK ACU-ENV-002
VERSION CONTROL & CORE INTEGRITY
--------------------------------------------------

Inspect the existing Git setup.

Create or update repository protection documentation so that:

- custom code is tracked
- Moodle core remains clean
- generated/runtime files are excluded
- local config secrets are excluded
- moodledata is excluded
- test output is excluded
- IDE/runtime artifacts are excluded

Do NOT configure .gitignore in a way that ignores the future custom theme or plugin.

Create:

docs/implementation/WAVE1-GIT-GOVERNANCE.md

Document:

- upstream strategy
- custom code locations
- prohibited core-edit policy
- branch recommendation
- pre-commit/core-integrity check approach

Do not automatically push or create remote branches.

--------------------------------------------------

TASK ACU-ENV-003
DEVELOPER TOOLING
--------------------------------------------------

Set up or document development tooling appropriate to this Moodle version.

Where technically compatible:

- Moodle coding standards / PHPCS
- PHPUnit readiness
- Behat readiness
- PHP linting
- JS linting if required
- SCSS compilation/testing

Do not install unnecessary global dependencies.

Prefer project-local tooling where feasible.

If a required tool cannot run in the current Windows environment, document the exact limitation and recommended execution path rather than hiding the failure.

Create:

docs/implementation/WAVE1-DEV-TOOLING.md

--------------------------------------------------

TASK ACU-ENV-004
PERFORMANCE BASELINE
--------------------------------------------------

Do NOT deploy Redis yet unless a working local Redis service is already intentionally available.

For Wave 1:

- inspect Moodle cache configuration capability
- establish a performance-baseline checklist
- document how Redis/MUC will later be benchmarked
- do not claim production Redis performance

Create:

docs/implementation/WAVE1-PERFORMANCE-BASELINE.md

If a safe local benchmark can be run, record results explicitly as:

LOCAL DEVELOPMENT BASELINE

not production performance.

--------------------------------------------------

TASK ACU-BASE-001
BASE SITE SETTINGS
--------------------------------------------------

Configure only confirmed/non-business-sensitive baseline settings if Moodle is installed and writable.

Before changing anything, report current values.

Use Acuitey project context for:

- site identity
- language baseline
- locale-safe defaults

IMPORTANT:

Do NOT hard-code IST if the actual Acuitey operational timezone has not been explicitly confirmed by the client.

The WBS currently references IST, but treat timezone as a configuration item requiring verification.

If not confirmed, leave existing timezone unchanged and document it.

Do not silently select timezone on behalf of the client.

--------------------------------------------------

TASK ACU-BASE-002
COURSE CATEGORY SCAFFOLDING
--------------------------------------------------

Do NOT permanently create client-facing category taxonomy that depends on DEC-013.

DEC-013 remains unresolved.

Therefore:

- verify Moodle category functionality
- document the intended category setup process
- optionally create development-only SAMPLE categories only if clearly reversible and explicitly marked SAMPLE
- do not treat sample categories as production taxonomy

Prefer documentation over persistent production configuration at this stage.

Create:

docs/implementation/WAVE1-COURSE-CATEGORY-BASELINE.md

--------------------------------------------------

TASK ACU-BASE-004
NATIVE ENROLMENT BASELINE
--------------------------------------------------

Inspect native Moodle enrolment capabilities.

Verify availability of:

- enrol_self
- enrol_fee

Do not configure real fees.
Do not activate payment gateways.
Do not create merchant configuration.

Document:

- which native enrolment plugins are available
- which are enabled
- what configuration remains pending

Create:

docs/implementation/WAVE1-ENROLMENT-BASELINE.md

--------------------------------------------------

TASK ACU-THEME-001
CREATE theme_acuitey SKELETON
--------------------------------------------------

Production implementation may now begin for the approved custom theme.

Create only under:

theme/acuitey/

Use Moodle-supported child-theme architecture with:

theme_boost

as parent.

Create the minimum valid theme skeleton required by this Moodle version.

Potential files may include:

theme/acuitey/version.php
theme/acuitey/config.php
theme/acuitey/lib.php
theme/acuitey/settings.php
theme/acuitey/lang/en/theme_acuitey.php

Only create files that are technically appropriate for the installed Moodle version.

Do not blindly copy older Moodle theme boilerplate.

Inspect current Boost/theme APIs first.

--------------------------------------------------

TASK ACU-THEME-002
DESIGN TOKENS / SCSS FOUNDATION
--------------------------------------------------

Implement the approved Acuitey design tokens from:

docs/design/ACUITEY-DESIGN.md

Use:

Oxford Navy #0C192C
Action Cobalt #1D4ED8
approved slate/neutral palette
approved semantic states
approved restrained radii
hairline borders
minimal shadows
approved typography hierarchy

Create modular SCSS structure appropriate to Moodle.

Keep tokens centralized.

Do not embed prototype-only SAMPLE DATA styles into production theme behavior.

--------------------------------------------------

TASK ACU-THEME-003
CORE UI COMPONENT STYLING
--------------------------------------------------

Implement foundational styling only for:

- buttons
- inputs
- cards/panels
- badges/status labels
- tables
- focus states
- general typography
- basic responsive spacing

Do not yet implement full Homepage, Catalogue, Student Dashboard, or Faculty Dashboard templates.

This task is shared UI foundation only.

--------------------------------------------------

TASK ACU-THEME-004
NAVBAR
--------------------------------------------------

Implement the approved Acuitey navbar treatment using supported Moodle theme override mechanisms.

Preserve:

- Moodle session behavior
- user menu
- notification behavior
- messaging behavior
- accessibility
- responsive behavior

Do not replace native Moodle navigation with custom hard-coded navigation.

Do not hard-code role-specific business links.

Use Moodle navigation APIs/structures.

--------------------------------------------------

TASK ACU-THEME-005
NAVIGATION DRAWER
--------------------------------------------------

Apply approved Acuitey visual styling to Moodle's navigation drawer.

Requirements:

- preserve Moodle navigation tree
- preserve permissions
- preserve collapse behavior
- responsive mobile behavior
- accessible controls
- no hard-coded learner/faculty navigation that bypasses Moodle navigation APIs

Do not build a separate SPA sidebar.

--------------------------------------------------

CORE INTEGRITY CHECK
--------------------------------------------------

Before and after implementation:

Generate a core integrity report.

Create:

docs/implementation/WAVE1-CORE-INTEGRITY.md

Include:

- files added
- files modified
- custom theme files
- root configuration files changed
- whether any existing Moodle core file changed
- Git diff summary

Acceptance requirement:

ZERO existing Moodle core application files modified.

If any unexpected core change exists:

STOP
REPORT IT
DO NOT CONTINUE

--------------------------------------------------

VALIDATION
--------------------------------------------------

Run all checks available in the current environment.

At minimum:

1. PHP syntax validation on every new PHP file.
2. Moodle plugin/theme discovery validation.
3. Theme version metadata validation.
4. SCSS compilation or equivalent Moodle theme compilation check.
5. Cache purge / theme cache check if Moodle runtime is available.
6. Basic page render check.
7. Desktop/mobile navbar and drawer smoke test.
8. Coding standards checks where tooling works.
9. Git diff/core-integrity inspection.

Do not report a test as passed if it was not executed.

Use:

PASS
FAIL
NOT EXECUTED — reason

--------------------------------------------------

DOCUMENTATION
--------------------------------------------------

Create:

docs/implementation/WAVE1-IMPLEMENTATION-REPORT.md

Include:

1. environment detected
2. tools detected
3. tasks completed
4. files created
5. files modified
6. Moodle configuration changes
7. theme_acuitey structure
8. validation results
9. screenshots if useful
10. warnings
11. deferred items
12. client decisions still outstanding
13. Git diff summary
14. core integrity confirmation

--------------------------------------------------

STOP CONDITIONS
--------------------------------------------------

Immediately stop if:

- a Moodle core file must be modified to continue
- installed Moodle APIs differ materially from the planned architecture
- PHP/runtime version is incompatible
- theme cannot be registered without a workaround/hack
- existing config or database would need destructive changes
- implementation would require choosing a DEC-* business option

Report the blocker rather than improvising.

--------------------------------------------------

FINAL REPORT
--------------------------------------------------

At completion report:

1. Wave 1 task status for all 12 tasks
2. environment/runtime status
3. files created
4. files modified
5. theme registration result
6. SCSS/theme validation result
7. developer tooling result
8. base Moodle configuration result
9. enrolment baseline result
10. core integrity result
11. unresolved issues
12. DEC-* items still blocking later work
13. recommended next task/wave

Do NOT continue to Wave 2.

Wait for my explicit approval.
