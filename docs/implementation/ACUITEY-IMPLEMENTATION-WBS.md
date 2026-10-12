# Acuitey LMS — Master Implementation Work Breakdown Structure (WBS)

**Target Platform:** Moodle LMS 5.2.3+ (Build: 20260916)  
**Parent Theme:** Boost (`theme_boost`)  
**Proposed Custom Theme:** `theme_acuitey`  
**Proposed Custom Plugin:** `local_acuitey`  
**Source of Truth:** [`ACUITEY-DESIGN.md`](file:///C:/Users/Atul/Desktop/moodle/docs/design/ACUITEY-DESIGN.md) & [`FINAL-DESIGN-REVIEW.md`](file:///C:/Users/Atul/Desktop/moodle/docs/design/FINAL-DESIGN-REVIEW.md)  
**Document Classification:** Master Engineering Backlog & Implementation WBS  
**Status:** FROZEN ON HOLD — PENDING GATE-01 (Client Architecture Review Pending)  

---

## 1. Executive Summary & Architecture Governance

This Work Breakdown Structure (WBS) translates the approved Acuitey LMS visual design system, interaction models, and architectural boundaries into an actionable engineering roadmap.

### Core Architectural Guardrails:
1. **Zero Moodle Core Modifications:** Moodle core files (`/lib`, `/course`, `/user`, `/enrol`, `/admin`, `/mod`) remain 100% untouched.
2. **Strict Subsystem Encapsulation:** Visual presentation is isolated in `theme_acuitey`, routing and capacity management in `local_acuitey`, payments in `core_payment` gateway drivers, and video conferencing in native `mod_lti`.
3. **No Premature Build:** Implementation remains strictly frozen until stakeholders approve this backlog and resolve the documented client decisions.
4. **Task Classification Statuses:**
   - **`READY`:** Fully specified; zero technical or business blockers; can execute immediately upon phase activation.
   - **`READY WITH ASSUMPTION`:** Architecture and UI are clear; implementation can proceed based on documented baseline assumptions (can be refined without architectural rework).
   - **`BLOCKED BY CLIENT DECISION`:** Technical design depends directly on an unresolved business decision documented in [`ACUITEY-OPEN-DECISIONS.md`](file:///C:/Users/Atul/Desktop/moodle/docs/implementation/ACUITEY-OPEN-DECISIONS.md).

---

## 2. Implementation Readiness Summary

| Phase | Phase Name | Total Tasks | READY | READY W/ ASSUMPTION (SCAFFOLDING) | BLOCKED |
| :---: | :--- | :---: | :---: | :---: | :---: |
| **0** | Environment & Project Readiness | 4 | 4 | 0 | 0 |
| **1** | Moodle Base Configuration | 4 | 3 | 0 | 1 (DEC-013) |
| **2** | `theme_acuitey` Foundation | 5 | 5 | 0 | 0 |
| **3** | Homepage & Course Catalogue | 5 | 4 | 1 (UI Taxonomy) | 0 |
| **4** | Student Dashboard | 4 | 2 | 1 (UI Support) | 1 (DEC-007) |
| **5** | Faculty Operations Workspace | 5 | 1 | 4 (UI Scaffolding) | 0 |
| **6** | `local_acuitey` Routing Core | 7 | 2 | 0 | 5 (DEC-001/002/003/004/014) |
| **7** | Payments & Enrolment Checkout | 4 | 0 | 2 (Scaffolding / Mock) | 2 (DEC-011, DEC-012) |
| **8** | Zoom / LTI 1.3 Advantage Integration | 4 | 1 | 1 (UI Card) | 2 (DEC-008, DEC-009/010) |
| **9** | Roles, Permissions & Security | 4 | 3 | 1 (UI Admin) | 0 |
| **10**| Notifications & Messaging | 3 | 3 | 0 | 0 |
| **11**| Testing, a11y & Performance QA | 5 | 4 | 1 (Mock Gateway) | 0 |
| **12**| Deployment, Monitoring & Ops | 4 | 2 | 2 (KVM & Endpoint Scaffolding) | 0 |
| **13**| UAT & Production Go-Live | 3 | 1 | 2 (Staging/Cutover) | 0 |
| **TOTAL** | **Entire Implementation Scope** | **57** | **31 (54.4%)** | **15 (26.3%)** | **11 (19.3%)** |

---

## 3. End-to-End Implementation Dependency Graph

```
[Phase 0: Environment & Repo Setup]
                 │
                 ▼
[Phase 1: Moodle Base & Custom Fields (DEC-013)]
                 │
                 ▼
[Phase 2: theme_acuitey Foundation & SCSS Tokens]
                 │
        ┌────────┴────────────────────────┐
        ▼                                 ▼
[Phase 3: Homepage & Catalogue]   [Phase 9: Roles & Contextual RBAC]
        │                                 │
        ▼                                 ▼
[Phase 4: Student Dashboard]      [Phase 6: local_acuitey Routing Core]
        │                         (DEC-001, DEC-003, DEC-014)
        │                                 │
        └────────────────┬────────────────┘
                         ▼
        [Phase 5: Faculty Operations Workspace]
                         │
        ┌────────────────┴────────────────┐
        ▼                                 ▼
[Phase 7: Payment Gateways]       [Phase 8: Zoom / LTI 1.3]
  (DEC-011, DEC-012)                (DEC-008, DEC-009)
        │                                 │
        └────────────────┬────────────────┘
                         ▼
        [Phase 10: Notifications & Messaging]
                         │
                         ▼
        [Phase 11: Testing, a11y & Performance QA]
                         │
                         ▼
        [Phase 12: Deployment & Monitoring (Hostinger KVM)]
                         │
                         ▼
        [Phase 13: Client UAT & Production Launch]
```

---

## 4. Work Breakdown Structure (WBS) by Phase

### PHASE 0: Environment & Project Readiness

#### ACU-ENV-001: Local Moodle Development Environment Initialization
- **Phase:** Phase 0 (Environment Readiness)
- **Description:** Provision local containerized/native Moodle 5.2.3+ instance with PHP 8.2/8.3, PostgreSQL/MariaDB, and development debugging flags enabled.
- **Technical Area:** Local Infrastructure
- **Moodle Component:** Core System & Database
- **Proposed Plugin/Theme:** None (Base Platform)
- **Dependency:** None
- **Inputs Required:** Moodle 5.2.3+ core distribution, PHP 8.2+, database server.
- **Output / Deliverable:** Running local Moodle 5.2.3+ instance with accessible admin login.
- **Acceptance Criteria:** `admin/index.php` loads cleanly; `$CFG->debug = DEBUG_DEVELOPER` is active; zero database connection errors.
- **Risk:** PHP extension mismatches (sodium, intl, opcache).
- **Status:** `READY`
- **Client Decision Required?** No

#### ACU-ENV-002: Version Control & Branching Strategy Setup
- **Phase:** Phase 0 (Environment Readiness)
- **Description:** Establish Git branching model isolating `theme/acuitey` and `local/acuitey` directories while tracking upstream Moodle core via clean `.gitignore`.
- **Technical Area:** DevOps / SCM
- **Moodle Component:** Git repository root
- **Proposed Plugin/Theme:** Repository configuration
- **Dependency:** ACU-ENV-001
- **Inputs Required:** Git repository root at `C:\Users\Atul\Desktop\moodle`.
- **Output / Deliverable:** `.gitignore` and branching documentation guaranteeing zero core modifications.
- **Acceptance Criteria:** Git status tracks only custom plugin and theme paths; Moodle core updates can pull cleanly from upstream.
- **Risk:** Accidental commits to Moodle core directories.
- **Status:** `READY`
- **Client Decision Required?** No

#### ACU-ENV-003: Developer Tooling, Linters & Test Harness Setup
- **Phase:** Phase 0 (Environment Readiness)
- **Description:** Configure PHP_CodeSniffer with Moodle Coding Standards (moodle-cs), PHPUnit test suite, and Behat acceptance runner.
- **Technical Area:** Quality Engineering
- **Moodle Component:** Development environment tools
- **Proposed Plugin/Theme:** Root dev tooling
- **Dependency:** ACU-ENV-001
- **Inputs Required:** Composer, PHP_CodeSniffer, Moodle CS ruleset.
- **Output / Deliverable:** Functional `vendor/bin/phpcs` and `php admin/tool/phpunit/cli/init.php`.
- **Acceptance Criteria:** PHPCS correctly lints sample Moodle plugin files against Moodle standard rules.
- **Risk:** Local pathing differences on Windows/Linux.
- **Status:** `READY`
- **Client Decision Required?** No

#### ACU-ENV-004: Baseline Performance & Cache Benchmarking
- **Phase:** Phase 0 (Environment Readiness)
- **Description:** Configure local Moodle Universal Cache (MUC) using Redis or APCu and benchmark baseline page delivery speed.
- **Technical Area:** Performance / Caching
- **Moodle Component:** MUC (`core_cache`)
- **Proposed Plugin/Theme:** Core configuration
- **Dependency:** ACU-ENV-001
- **Inputs Required:** Redis server / local caching backend.
- **Output / Deliverable:** Active MUC store configuration in `config.php`.
- **Acceptance Criteria:** TTFB for uncached admin pages < 300ms; cache stores operational in admin interface.
- **Risk:** Redis connectivity timeouts on local development environments.
- **Status:** `READY`
- **Client Decision Required?** No

---

### PHASE 1: Moodle Base Configuration

#### ACU-BASE-001: Site Identity & Default Institutional Configuration
- **Phase:** Phase 1 (Base Configuration)
- **Description:** Configure core Moodle site name ("Acuitey Solutions Enterprise LMS"), default language (en), timezone (Asia/Kolkata), and cookie privacy banners.
- **Technical Area:** Site Administration
- **Moodle Component:** Core Configuration (`$CFG`)
- **Proposed Plugin/Theme:** None
- **Dependency:** ACU-ENV-001
- **Inputs Required:** Institutional branding guidelines.
- **Output / Deliverable:** Configured core Moodle database settings.
- **Acceptance Criteria:** Site title displays correctly; timezones resolve accurately across India Standard Time (IST).
- **Risk:** Low.
- **Status:** `READY`
- **Client Decision Required?** No

#### ACU-BASE-002: Course Categories & Academic Disciplines Structure
- **Phase:** Phase 1 (Base Configuration)
- **Description:** Create the core course category hierarchy reflecting approved academic disciplines: Cloud Architecture, Distributed Systems, Data Governance & AI, Systems Foundations.
- **Technical Area:** Course Administration
- **Moodle Component:** Course Categories (`core_course`)
- **Proposed Plugin/Theme:** None
- **Dependency:** ACU-BASE-001
- **Inputs Required:** Approved academic disciplines.
- **Output / Deliverable:** Populated category tree in Moodle.
- **Acceptance Criteria:** Categories exist with correct parent/child relationships and category IDs.
- **Risk:** Low.
- **Status:** `READY`
- **Client Decision Required?** No

#### ACU-BASE-003: Moodle Course Custom Fields Taxonomy Setup
- **Phase:** Phase 1 (Base Configuration)
- **Description:** Configure custom field categories and definitions via Moodle's native Custom Fields API (`core_customfield`) for `discipline_category`, `academic_level`, and `term_duration`. Do not permanently create the proposed course fields until confirmed by the client; theme components may use mock/sample metadata only.
- **Technical Area:** Course Custom Fields
- **Moodle Component:** `core_customfield`
- **Proposed Plugin/Theme:** None
- **Dependency:** ACU-BASE-002
- **Inputs Required:** Client sign-off on DEC-013 taxonomy.
- **Output / Deliverable:** Active custom fields appearing on all course edit forms (post-approval).
- **Acceptance Criteria:** Course custom fields created only after client formalizes DEC-013; prototype and theme components use mock/sample metadata only prior to approval.
- **Risk:** Premature taxonomy setup forces schema rework and data migrations.
- **Status:** `BLOCKED BY CLIENT DECISION — DEC-013`
- **Client Decision Required?** **Yes (DEC-013)**

#### ACU-BASE-004: Native Enrolment Plugins Activation
- **Phase:** Phase 1 (Base Configuration)
- **Description:** Enable and configure native enrolment drivers: `enrol_self` (for Free / Open Access courses) and `enrol_fee` (for paid tracks via `core_payment`).
- **Technical Area:** Enrolment Subsystem
- **Moodle Component:** `enrol_self`, `enrol_fee`, `core_enrol`
- **Proposed Plugin/Theme:** None
- **Dependency:** ACU-BASE-001
- **Inputs Required:** Enrolment policy parameters.
- **Output / Deliverable:** Active enrolment plugins enabled in Site Administration.
- **Acceptance Criteria:** Courses can be assigned self-enrolment or fee-based enrolment instances.
- **Risk:** Low.
- **Status:** `READY`
- **Client Decision Required?** No

---

### PHASE 2: `theme_acuitey` Foundation

#### ACU-THEME-001: Child Theme Scaffolding & Boost Inheritance
- **Phase:** Phase 2 (Theme Foundation)
- **Description:** Scaffold `theme/acuitey` with `config.php`, `version.php`, `lib.php`, declaring `theme_boost` as parent theme.
- **Technical Area:** Theme Architecture
- **Moodle Component:** Theme Subsystem (`core_theme`)
- **Proposed Plugin/Theme:** `theme_acuitey`
- **Dependency:** ACU-ENV-001
- **Inputs Required:** Theme specification in [`ACUITEY-DESIGN.md`](file:///C:/Users/Atul/Desktop/moodle/docs/design/ACUITEY-DESIGN.md).
- **Output / Deliverable:** Installable `theme_acuitey` plugin directory.
- **Acceptance Criteria:** Theme installs cleanly via Moodle admin notifications; selectable as site theme.
- **Risk:** Version incompatibilities if `$plugin->requires` is set incorrectly.
- **Status:** `READY`
- **Client Decision Required?** No

#### ACU-THEME-002: SCSS Design Tokens & Pipeline Setup
- **Phase:** Phase 2 (Theme Foundation)
- **Description:** Implement SCSS token architecture compiling Oxford Navy (`#0C192C`), Action Cobalt (`#1D4ED8`), Slate neutrals, 1px hairlines, and restrained radii into Moodle's SCSS pipeline.
- **Technical Area:** Styling & CSS
- **Moodle Component:** `theme_acuitey/scss/`
- **Proposed Plugin/Theme:** `theme_acuitey`
- **Dependency:** ACU-THEME-001
- **Inputs Required:** Token definitions from [`ACUITEY-DESIGN.md`](file:///C:/Users/Atul/Desktop/moodle/docs/design/ACUITEY-DESIGN.md).
- **Output / Deliverable:** Compiled theme stylesheet with custom CSS variables.
- **Acceptance Criteria:** SCSS compiles without syntax errors; CSS variables match design token hex values exactly.
- **Risk:** Bootstrap SCSS variable conflict with Moodle Boost base variables.
- **Status:** `READY`
- **Client Decision Required?** No

#### ACU-THEME-003: Core UI Component SCSS Styling
- **Phase:** Phase 2 (Theme Foundation)
- **Description:** Implement Acuitey buttons (Primary Navy, Action Cobalt, Secondary Outline), form inputs, status badges, and 1px hairline card utilities.
- **Technical Area:** Styling & CSS
- **Moodle Component:** `theme_acuitey/scss/acuitey/`
- **Proposed Plugin/Theme:** `theme_acuitey`
- **Dependency:** ACU-THEME-002
- **Inputs Required:** Component styling rules from [`ACUITEY-DESIGN.md`](file:///C:/Users/Atul/Desktop/moodle/docs/design/ACUITEY-DESIGN.md).
- **Output / Deliverable:** Modular SCSS partials (`_buttons.scss`, `_cards.scss`, `_badges.scss`, `_tables.scss`).
- **Acceptance Criteria:** All uppercase selectors enforce `letter-spacing: 0.08em`; buttons provide visible `:focus-visible` rings.
- **Risk:** Low.
- **Status:** `READY`
- **Client Decision Required?** No

#### ACU-THEME-004: Moodle Boost Navbar Mustache Override
- **Phase:** Phase 2 (Theme Foundation)
- **Description:** Override `theme_boost/navbar` with `theme_acuitey/templates/navbar.mustache` incorporating the `AS` monogram, enterprise title, navigation links, and profile badge.
- **Technical Area:** Templating (Mustache)
- **Moodle Component:** `theme_acuitey/templates/navbar.mustache`
- **Proposed Plugin/Theme:** `theme_acuitey`
- **Dependency:** ACU-THEME-003
- **Inputs Required:** Prototype header markup from `homepage.html`.
- **Output / Deliverable:** Functional `navbar.mustache` integrated with Moodle session globals.
- **Acceptance Criteria:** Exact 60px height; user profile renders authenticated user initials; navigation links highlight active screen.
- **Risk:** Breaking core user menu dropdown JavaScript if DOM IDs differ.
- **Status:** `READY`
- **Client Decision Required?** No

#### ACU-THEME-005: Moodle Boost Navigation Drawer Styling & Responsive Layout
- **Phase:** Phase 2 (Theme Foundation)
- **Description:** Override Moodle Boost drawer SCSS to implement clean flat styling, hairline borders, and responsive off-canvas collapse on viewports < 1024px.
- **Technical Area:** Layout & Responsive Styling
- **Moodle Component:** `theme_acuitey/scss/moodle/drawer.scss`
- **Proposed Plugin/Theme:** `theme_acuitey`
- **Dependency:** ACU-THEME-004
- **Inputs Required:** Prototype drawer layout from `faculty-dashboard.html`.
- **Output / Deliverable:** Responsive drawer layout supporting desktop docking and mobile overlay.
- **Acceptance Criteria:** Drawer opens/closes smoothly via toggle button; accessible keyboard trap prevention; no horizontal page scroll.
- **Risk:** High-concurrency z-index collision with modal dialogs.
- **Status:** `READY`
- **Client Decision Required?** No

---

### PHASE 3: Homepage & Course Catalogue

#### ACU-CAT-001: Frontpage Marketing Hero Template
- **Phase:** Phase 3 (Catalogue & Home)
- **Description:** Implement `theme_acuitey/templates/frontpage_hero.mustache` featuring marketing headline, search panel, and educational value indicators.
- **Technical Area:** Templating
- **Moodle Component:** `layout/frontpage.php`
- **Proposed Plugin/Theme:** `theme_acuitey`
- **Dependency:** ACU-THEME-004
- **Inputs Required:** Approved copy and markup from `homepage.html`.
- **Output / Deliverable:** Server-rendered hero template on Moodle frontpage.
- **Acceptance Criteria:** Renders cleanly for unauthenticated users; search form targets course catalogue; zero unverified accreditation claims.
- **Risk:** Low.
- **Status:** `READY`
- **Client Decision Required?** No

#### ACU-CAT-002: Faceted Course Catalogue Search & Renderer
- **Phase:** Phase 3 (Catalogue & Home)
- **Description:** Implement custom course catalogue layout overriding `core_course/category_view` with sidebar filters and responsive grid container.
- **Technical Area:** Course Subsystem & Templating
- **Moodle Component:** `theme_acuitey/templates/catalogue_filters.mustache`
- **Proposed Plugin/Theme:** `theme_acuitey`
- **Dependency:** ACU-BASE-003, ACU-THEME-003
- **Inputs Required:** Approved catalogue layout from `course-catalogue.html`.
- **Output / Deliverable:** Filterable course listing page at `/course/index.php`.
- **Acceptance Criteria:** Filter options query Moodle Course Custom Fields without exposing internal API codes; results count updates dynamically.
- **Risk:** Performance degradation on large course catalogues without database indexing on custom fields.
- **Status:** `READY WITH ASSUMPTION` (UI Scaffolding: Uses mock/sample metadata only until DEC-013 is formally approved)
- **Client Decision Required?** **Yes (DEC-013 for permanent custom field binding)**

#### ACU-CAT-003: Faceted Course Card Mustache Template
- **Phase:** Phase 3 (Catalogue & Home)
- **Description:** Develop `theme_acuitey/templates/course_card.mustache` supporting discipline chip, academic level badge, synopsis, conditional faculty row, and fee track.
- **Technical Area:** Templating
- **Moodle Component:** Course rendering pipeline
- **Proposed Plugin/Theme:** `theme_acuitey`
- **Dependency:** ACU-CAT-002
- **Inputs Required:** Approved course card markup from `course-catalogue.html`.
- **Output / Deliverable:** Reusable course card template used across homepage and catalogue.
- **Acceptance Criteria:** Conditional `{{#hasfaculty}}` section correctly hides individual faculty when unassigned; free courses display *"Free / Open Access"*.
- **Risk:** Low.
- **Status:** `READY`
- **Client Decision Required?** No

#### ACU-CAT-004: Course Category Chips Navigation
- **Phase:** Phase 3 (Catalogue & Home)
- **Description:** Implement `theme_acuitey/templates/category_chips.mustache` rendering top-level discipline category pills linked to category views.
- **Technical Area:** Templating
- **Moodle Component:** Course category navigation
- **Proposed Plugin/Theme:** `theme_acuitey`
- **Dependency:** ACU-BASE-002, ACU-CAT-002
- **Inputs Required:** Category hierarchy from Phase 1.
- **Output / Deliverable:** Horizontal scrollable category pill bar.
- **Acceptance Criteria:** Clicking category filters catalogue; active state visually distinct with `#0C192C` fill.
- **Risk:** Low.
- **Status:** `READY`
- **Client Decision Required?** No

#### ACU-CAT-005: Institutional Theme Footer Template
- **Phase:** Phase 3 (Catalogue & Home)
- **Description:** Implement `theme_acuitey/templates/footer.mustache` with governance metadata, core separation disclosure, and institutional links.
- **Technical Area:** Templating
- **Moodle Component:** `theme_boost/footer`
- **Proposed Plugin/Theme:** `theme_acuitey`
- **Dependency:** ACU-THEME-001
- **Inputs Required:** Approved footer markup from prototypes.
- **Output / Deliverable:** Unified footer rendered across all site layouts.
- **Acceptance Criteria:** Renders copyright, sample data disclosure, and responsive link row; zero visual clutter.
- **Risk:** Low.
- **Status:** `READY`
- **Client Decision Required?** No

---

### PHASE 4: Student Dashboard

#### ACU-STU-001: Student Dashboard Layout & Two-Column Grid
- **Phase:** Phase 4 (Student Dashboard)
- **Description:** Implement `layout/columns2.php` override for `/my/` separating main learning operations (`1fr`) from contextual block region (`340px`).
- **Technical Area:** Layout & Architecture
- **Moodle Component:** `theme_boost/columns2`, `/my/index.php`
- **Proposed Plugin/Theme:** `theme_acuitey`
- **Dependency:** ACU-THEME-003
- **Inputs Required:** Approved student dashboard layout from `student-dashboard.html`.
- **Output / Deliverable:** Clean server-rendered dashboard container for enrolled students.
- **Acceptance Criteria:** Responsive breakpoint collapse at 1024px and 768px; zero horizontal overflow.
- **Risk:** Low.
- **Status:** `READY`
- **Client Decision Required?** No

#### ACU-STU-002: Active Course Progress & Milestone Deliverables Card
- **Phase:** Phase 4 (Student Dashboard)
- **Description:** Override `block_myoverview` to render Acuitey course progress cards displaying milestone count, percentage bar, and next assignment rubric preview.
- **Technical Area:** Block Override & Completion API
- **Moodle Component:** `block_myoverview`, `completion_info`
- **Proposed Plugin/Theme:** `theme_acuitey`
- **Dependency:** ACU-STU-001
- **Inputs Required:** Course progress markup from `student-dashboard.html`.
- **Output / Deliverable:** `theme_acuitey/templates/block_myoverview.mustache`.
- **Acceptance Criteria:** Progress bar accurately tracks Moodle activity completion criteria; *"Continue Learning"* deep-links to active module.
- **Risk:** Performance lag when computing completion for students in 10+ courses (mitigated by MUC cache).
- **Status:** `READY`
- **Client Decision Required?** No

#### ACU-STU-003: Student Faculty Support Panel Integration
- **Phase:** Phase 4 (Student Dashboard)
- **Description:** Implement sidebar widget rendering student's assigned supervisor or faculty pool support state across the 4 approved visual states. UI scaffolding remains neutral; business logic must not be implemented; do not assume whether Acuitey uses permanent mentor assignment, on-demand consultation, milestone routing, or a hybrid model pending DEC-014.
- **Technical Area:** Plugin Presentation
- **Moodle Component:** Block Region / Local Plugin Output
- **Proposed Plugin/Theme:** `local_acuitey` / `theme_acuitey`
- **Dependency:** ACU-STU-001
- **Inputs Required:** Support panel markup from `student-dashboard.html`.
- **Output / Deliverable:** `local_acuitey/templates/student_support_panel.mustache`.
- **Acceptance Criteria:** Renders neutral presentation scaffolding capable of displaying assigned supervisor or departmental pool; underlying business rules and routing triggers deferred pending DEC-014.
- **Risk:** Premature binding to a specific mentoring model requires template refactoring.
- **Status:** `READY WITH ASSUMPTION` (UI Scaffolding: Neutral presentation template only; mentoring workflow logic blocked by DEC-014)
- **Client Decision Required?** **Yes (DEC-014)**

#### ACU-STU-004: Earned Certificates Widget Implementation
- **Phase:** Phase 4 (Student Dashboard)
- **Description:** Implement sidebar widget placeholder rendering completed course certificates with sample status. The Student Dashboard may contain a neutral certificate placeholder/widget only; do NOT implement a specific certificate engine yet (Moodle badges, `mod_customcert`, external credential platform, custom PDF generator) until client approval.
- **Technical Area:** Completion & Certification
- **Moodle Component:** Pending DEC-007 (Moodle Badges, `mod_customcert`, external platform, or custom PDF)
- **Proposed Plugin/Theme:** `theme_acuitey` (UI Scaffolding)
- **Dependency:** ACU-STU-001
- **Inputs Required:** Approved certificate card markup from `student-dashboard.html`; client decision on DEC-007.
- **Output / Deliverable:** Neutral UI placeholder widget in `theme_acuitey/templates/certificates_widget.mustache`.
- **Acceptance Criteria:** Student Dashboard renders neutral certificate placeholder/widget; zero unverified cryptographic claims; backend certificate engine is NOT selected or implemented prior to client approval of DEC-007.
- **Risk:** Premature selection of certificate subsystem causes throwaway integration code.
- **Status:** `BLOCKED / DEFERRED BY CLIENT DECISION — DEC-007` (Neutral UI placeholder scaffolding only; backend certificate engine blocked by DEC-007)
- **Client Decision Required?** **Yes (DEC-007)**

---

### PHASE 5: Faculty Operations Workspace

#### ACU-FAC-001: Faculty Workspace Page Scaffolding & Routing
- **Phase:** Phase 5 (Faculty Workspace)
- **Description:** Create custom Moodle page controller (`local/acuitey/faculty/dashboard.php`) accessible to users with `local/acuitey:viewallocations` capability.
- **Technical Area:** Page Controller & RBAC
- **Moodle Component:** `local_acuitey` controller
- **Proposed Plugin/Theme:** `local_acuitey`
- **Dependency:** ACU-THEME-003, ACU-THEME-005
- **Inputs Required:** Faculty workspace layout from `faculty-dashboard.html`.
- **Output / Deliverable:** Secure page controller at `/local/acuitey/faculty/dashboard.php`.
- **Acceptance Criteria:** Students accessing URL are redirected with Access Denied; authorized faculty view operational dashboard.
- **Risk:** Incorrect capability check causing access leakage.
- **Status:** `READY`
- **Client Decision Required?** No

#### ACU-FAC-002: Faculty Live Availability Switcher Component
- **Phase:** Phase 5 (Faculty Workspace)
- **Description:** Implement operational segmented control allowing faculty to switch live status (`Available`, `In Session`, `Unavailable`, `Offline`) with AJAX persistence. Provides manual availability UI only; do NOT implement automatic transition from Live Session Started to "In Session" status until DEC-015 is confirmed.
- **Technical Area:** State Persistence & AJAX
- **Moodle Component:** `local_acuitey` availability service
- **Proposed Plugin/Theme:** `local_acuitey`
- **Dependency:** ACU-FAC-001
- **Inputs Required:** Segmented control markup and JS handler from `faculty-dashboard.html`.
- **Output / Deliverable:** `local_acuitey/templates/faculty_availability.mustache` + AMD JS module.
- **Acceptance Criteria:** State updates asynchronously with sesskey check; persists to user state table; visual feedback confirms status; manual toggle remains independent; zero automated live-session state overrides implemented prior to DEC-015 approval.
- **Risk:** Database lock contention if state toggled rapidly (mitigated by debounce).
- **Status:** `READY WITH ASSUMPTION` (UI Scaffolding: Manual availability UI only; automatic session status coupling deferred per DEC-015)
- **Client Decision Required?** **Yes (DEC-015)**

#### ACU-FAC-003: Incoming Student Allocation Queue UI
- **Phase:** Phase 5 (Faculty Workspace)
- **Description:** Implement the primary allocation queue container and request card components featuring matching context, Accept action, and Request Reassignment trigger.
- **Technical Area:** Plugin Templating & UI
- **Moodle Component:** `local_acuitey` queue renderer
- **Proposed Plugin/Theme:** `local_acuitey`
- **Dependency:** ACU-FAC-001
- **Inputs Required:** Allocation queue markup from `faculty-dashboard.html`.
- **Output / Deliverable:** `local_acuitey/templates/allocation_queue.mustache` and `allocation_request.mustache`.
- **Acceptance Criteria:** Displays request subject match, elapsed time, and workload context; Action Cobalt border accent; action buttons connect to neutral stub endpoints; business routing logic deferred to Phase 6.
- **Risk:** Complex state transitions in UI prior to Phase 6 backend completion.
- **Status:** `READY WITH ASSUMPTION` (UI Scaffolding: Presentation components only; routing engine blocked by DEC-001 to DEC-005)
- **Client Decision Required?** No (UI Only)

#### ACU-FAC-004: Supervisor Workload & Capacity Progress Widget
- **Phase:** Phase 5 (Faculty Workspace)
- **Description:** Implement sidebar widget rendering active supervisee count versus configured capacity ceiling (e.g. `14 / 20 Allocated Students [SAMPLE DATA]`).
- **Technical Area:** Metrics & Templating
- **Moodle Component:** `local_acuitey` capacity manager
- **Proposed Plugin/Theme:** `local_acuitey`
- **Dependency:** ACU-FAC-001
- **Inputs Required:** Capacity widget markup from `faculty-dashboard.html`.
- **Output / Deliverable:** `local_acuitey/templates/faculty_capacity.mustache`.
- **Acceptance Criteria:** Monospace metric numbers; capacity percentage bar matches ratio; explanatory copy notes allocation eligibility role; presentation scaffolding uses mock data until DEC-001 is resolved.
- **Risk:** Low.
- **Status:** `READY WITH ASSUMPTION` (UI Scaffolding: Presentation widget only; capacity model blocked by DEC-001)
- **Client Decision Required?** **Yes (DEC-001)**

#### ACU-FAC-005: Assigned Students Roster Table & Direct Messaging
- **Phase:** Phase 5 (Faculty Workspace)
- **Description:** Implement data table listing currently assigned supervisees with course, assignment date, milestone status, and direct Moodle messaging shortcut.
- **Technical Area:** Tabular Presentation & Core Messaging Integration
- **Moodle Component:** `core_message`, Moodle Groups API
- **Proposed Plugin/Theme:** `local_acuitey`
- **Dependency:** ACU-FAC-001
- **Inputs Required:** Table markup from `faculty-dashboard.html`.
- **Output / Deliverable:** `local_acuitey/templates/assigned_students.mustache`.
- **Acceptance Criteria:** Table renders assigned students; clicking *"Message"* opens Moodle messaging drawer; query scope remains neutral until DEC-016 is confirmed.
- **Risk:** Supervisee scope decision (DEC-016) affects underlying query joins.
- **Status:** `READY WITH ASSUMPTION` (UI Scaffolding: Assumes assigned group query until DEC-016 confirmed)
- **Client Decision Required?** **Yes (DEC-016)**

---

### PHASE 6: `local_acuitey` Routing Core

#### ACU-ROUTE-001: Plugin Database Schema & XMLDB Installation
- **Phase:** Phase 6 (Routing Core)
- **Description:** Implement `local/acuitey/db/install.xml` defining plugin entities: `faculty_avail`, `faculty_cap`, `alloc_req`, `alloc_cand`, `assignment`, and `audit_log`.
- **Technical Area:** Database Architecture (XMLDB)
- **Moodle Component:** Moodle XMLDB Subsystem
- **Proposed Plugin/Theme:** `local_acuitey`
- **Dependency:** ACU-ENV-001
- **Inputs Required:** Conceptual entity definitions from [`ACUITEY-COMPONENT-MAPPING.md`](file:///C:/Users/Atul/Desktop/moodle/docs/implementation/ACUITEY-COMPONENT-MAPPING.md); resolution of DEC-001.
- **Output / Deliverable:** Validated `install.xml` creating plugin tables during installation.
- **Acceptance Criteria:** Tables install cleanly via XMLDB editor; foreign keys to `mdl_user` and `mdl_course` pass schema verification.
- **Risk:** Schema modifications post-production require complex upgrade scripts (`db/upgrade.php`).
- **Status:** `BLOCKED BY CLIENT DECISION` (Requires DEC-001 capacity model)
- **Client Decision Required?** **Yes (DEC-001)**

#### ACU-ROUTE-002: Faculty Availability Service Class
- **Phase:** Phase 6 (Routing Core)
- **Description:** Implement `classes/service/availability_manager.php` with methods: `get_status()`, `set_status()`, `is_available_for_routing()`, and cache layer.
- **Technical Area:** Business Logic & Caching
- **Moodle Component:** `local_acuitey` service layer
- **Proposed Plugin/Theme:** `local_acuitey`
- **Dependency:** ACU-ROUTE-001
- **Inputs Required:** Availability states specification.
- **Output / Deliverable:** Tested `availability_manager` class.
- **Acceptance Criteria:** Unit tests verify status persistence and fast MUC caching lookup.
- **Risk:** Low.
- **Status:** `READY`
- **Client Decision Required?** No

#### ACU-ROUTE-003: Supervisor Capacity Manager Class
- **Phase:** Phase 6 (Routing Core)
- **Description:** Implement `classes/service/capacity_manager.php` calculating active supervisee counts against limits and determining allocation eligibility across configured capacity models.
- **Technical Area:** Business Logic
- **Moodle Component:** `local_acuitey` service layer
- **Proposed Plugin/Theme:** `local_acuitey`
- **Dependency:** ACU-ROUTE-001
- **Inputs Required:** Capacity rules from DEC-001 (global vs departmental vs individual faculty capacity).
- **Output / Deliverable:** Tested `capacity_manager` class.
- **Acceptance Criteria:** Calculates eligibility according to client-approved capacity model; must NOT assume or choose the individual/per-profile model before client sign-off on DEC-001.
- **Risk:** Premature implementation locks in incompatible database and calculation logic.
- **Status:** `BLOCKED BY CLIENT DECISION — DEC-001`
- **Client Decision Required?** **Yes (DEC-001)**

#### ACU-ROUTE-004: Candidate Selector & Multi-Criteria Matching Engine
- **Phase:** Phase 6 (Routing Core)
- **Description:** Implement `classes/service/candidate_selector.php` filtering faculty by subject match, role authorization, live availability, and capacity.
- **Technical Area:** Algorithmic Matching
- **Moodle Component:** `local_acuitey` matching service
- **Proposed Plugin/Theme:** `local_acuitey`
- **Dependency:** ACU-ROUTE-002, ACU-ROUTE-003
- **Inputs Required:** Candidate ordering criteria from DEC-004.
- **Output / Deliverable:** Tested `candidate_selector` engine.
- **Acceptance Criteria:** Returns ordered eligible faculty per client-selected policy; must NOT pre-select least-utilized, round-robin, expertise-first, or any combined score until DEC-004 client approval.
- **Risk:** Sorting algorithm rewrite if business priority differs from engineering assumptions.
- **Status:** `BLOCKED BY CLIENT DECISION — DEC-004`
- **Client Decision Required?** **Yes (DEC-004)**

#### ACU-ROUTE-005: Allocation Service State Machine & Reassignment Workflow
- **Phase:** Phase 6 (Routing Core)
- **Description:** Implement `classes/service/allocation_service.php` managing lifecycle transitions (`create_request`, `offer_candidate`, `accept_allocation`, `request_reassignment`, `escalate`).
- **Technical Area:** State Machine & Workflow
- **Moodle Component:** `local_acuitey` core service
- **Proposed Plugin/Theme:** `local_acuitey`
- **Dependency:** ACU-ROUTE-004
- **Inputs Required:** Reassignment destination policy from DEC-003; retry threshold from DEC-005; mentoring workflow scope from DEC-014.
- **Output / Deliverable:** Master `allocation_service` orchestrator.
- **Acceptance Criteria:** State transitions follow approved lifecycle; must NOT implement automatic next-candidate routing, admin escalation, hybrid retry threshold, or maximum retry count until DEC-003 and DEC-005 are confirmed; mentoring workflow scope remains open per DEC-014 (no permanent vs consultation assumptions).
- **Risk:** Complex state machine divergence across unconfirmed escalation branches.
- **Status:** `BLOCKED BY CLIENT DECISION — DEC-003, DEC-005, DEC-014`
- **Client Decision Required?** **Yes (DEC-003, DEC-005, DEC-014)**

#### ACU-ROUTE-006: Asynchronous Offer Dispatch & Expiry Background Tasks
- **Phase:** Phase 6 (Routing Core)
- **Description:** Implement `classes/task/allocation_dispatch_task.php` (ad-hoc task for async routing) and generic task infrastructure for monitoring offer timeouts once policy is established.
- **Technical Area:** Background Processing (Moodle Tasks)
- **Moodle Component:** `core\task\adhoc_task`, `core\task\scheduled_task`
- **Proposed Plugin/Theme:** `local_acuitey`
- **Dependency:** ACU-ROUTE-005
- **Inputs Required:** Timeout duration policy from DEC-002.
- **Output / Deliverable:** Background task classes registered in `db/tasks.php`.
- **Acceptance Criteria:** Generic background task infrastructure may be designed, but no timeout policy (2 hours, 4 hours, 24 hours) or cron expiry behavior may be implemented before DEC-002 client approval.
- **Risk:** Hard-coding timeouts premature to client operational cadence.
- **Status:** `BLOCKED BY CLIENT DECISION — DEC-002`
- **Client Decision Required?** **Yes (DEC-002)**

#### ACU-ROUTE-007: Immutable Routing Audit Logger
- **Phase:** Phase 6 (Routing Core)
- **Description:** Implement `classes/service/audit_logger.php` recording all state changes, reassignment rationales, and administrative overrides to `mdl_local_acuitey_audit_log`.
- **Technical Area:** Compliance & Auditing
- **Moodle Component:** `local_acuitey` audit logger
- **Proposed Plugin/Theme:** `local_acuitey`
- **Dependency:** ACU-ROUTE-001
- **Inputs Required:** Governance audit standards.
- **Output / Deliverable:** Append-only audit logger service.
- **Acceptance Criteria:** Every routing action creates an immutable log record; read-only admin query interface.
- **Risk:** Unindexed log growth over multi-year deployments (requires annual archiving strategy).
- **Status:** `READY`
- **Client Decision Required?** No

---

### PHASE 7: Payments & Enrolment Checkout

#### ACU-PAY-001: Razorpay Payment Gateway Plugin Scaffolding
- **Phase:** Phase 7 (Payments)
- **Description:** Scaffold `payment/gateway/razorpay/` adhering to Moodle's `core_payment` gateway API specification.
- **Technical Area:** Payment Gateway
- **Moodle Component:** `core_payment` subsystem
- **Proposed Plugin/Theme:** `payment_gateway_razorpay`
- **Dependency:** ACU-BASE-004
- **Inputs Required:** Razorpay API v1 specifications; resolution of DEC-011.
- **Output / Deliverable:** Installable Moodle payment gateway plugin.
- **Acceptance Criteria:** Appears in Moodle Payment Accounts configuration under Site Administration.
- **Risk:** API deprecation in external gateway SDKs.
- **Status:** `BLOCKED BY CLIENT DECISION` (Requires DEC-011 gateway confirmation)
- **Client Decision Required?** **Yes (DEC-011)**

#### ACU-PAY-002: Server-Side Authenticity/Signature Verification & Idempotency
- **Phase:** Phase 7 (Payments)
- **Description:** Implement gateway-specific server-side authenticity/signature verification against merchant secrets, amount validation against order, and transaction deduplication.
- **Technical Area:** Payment Security & Cryptography
- **Moodle Component:** `payment_gateway_*` driver
- **Proposed Plugin/Theme:** Gateway driver layer
- **Dependency:** ACU-PAY-001
- **Inputs Required:** Merchant API keys from DEC-012; gateway selection from DEC-011.
- **Output / Deliverable:** Secure payment capture and verification handler.
- **Acceptance Criteria:** Validates payment authenticity using gateway-specific server-side authenticity/signature verification; valid signatures grant enrolment; tampered or replayed requests return HTTP 400 and log security alert; production credentials not required until DEC-012 resolved.
- **Risk:** Clock drift on local server affecting timestamp validation.
- **Status:** `READY WITH ASSUMPTION` (UI / Infrastructure Scaffolding; assumes simulated gateway mock driver until DEC-011 and DEC-012 confirmed)
- **Client Decision Required?** **Yes (DEC-011, DEC-012)**

#### ACU-PAY-003: PhonePe Payment Gateway Plugin Development
- **Phase:** Phase 7 (Payments)
- **Description:** Scaffold and implement `payment/gateway/phonepe/` with payload handling and gateway-specific server-side authenticity/signature verification.
- **Technical Area:** Payment Gateway
- **Moodle Component:** `core_payment` subsystem
- **Proposed Plugin/Theme:** `payment_gateway_phonepe`
- **Dependency:** ACU-BASE-004
- **Inputs Required:** PhonePe PG API specs; resolution of DEC-011 and DEC-012.
- **Output / Deliverable:** Functional PhonePe payment gateway driver.
- **Acceptance Criteria:** Generates valid PhonePe payment redirects; verifies authenticity via gateway-specific server-side authenticity/signature verification; triggers `enrol_fee`.
- **Risk:** Gateway-specific server-side verification API changes.
- **Status:** `BLOCKED BY CLIENT DECISION — DEC-011, DEC-012` (Requires DEC-011 and DEC-012)
- **Client Decision Required?** **Yes (DEC-011, DEC-012)**

#### ACU-PAY-004: Payment Reconciliation & Automatic Enrolment Hook
- **Phase:** Phase 7 (Payments)
- **Description:** Implement integration triggering native `enrol_fee::enrol_user()` upon verified payment receipt and emitting `\core_enrol\event\user_enrolment_created`.
- **Technical Area:** Enrolment Integration
- **Moodle Component:** `core_payment`, `enrol_fee`
- **Proposed Plugin/Theme:** Gateway plugins
- **Dependency:** ACU-PAY-002
- **Inputs Required:** Enrolment duration and course fee settings.
- **Output / Deliverable:** Instant post-payment course enrolment.
- **Acceptance Criteria:** Verified payment instantly grants course access and triggers routing request (Phase 6).
- **Risk:** Low.
- **Status:** `READY WITH ASSUMPTION`
- **Client Decision Required?** No

---

### PHASE 8: Zoom / LTI 1.3 Advantage Integration

#### ACU-LTI-001: Moodle External Tool (`mod_lti`) Configuration
- **Phase:** Phase 8 (Zoom / LTI)
- **Description:** Configure Moodle's native External Tool provider (`mod_lti`) with LTI 1.3 Advantage parameters (OIDC auth URL, Key Set URL, Access Token URL) for Zoom.
- **Technical Area:** LTI 1.3 Advantage
- **Moodle Component:** `mod_lti` core module
- **Proposed Plugin/Theme:** None (Core Activity Configuration)
- **Dependency:** ACU-BASE-001
- **Inputs Required:** Institutional Zoom LTI Pro marketplace credentials from DEC-008.
- **Output / Deliverable:** Pre-configured external tool available in course activity picker.
- **Acceptance Criteria:** Tool configuration passes LTI 1.3 deployment test handshake.
- **Risk:** Institutional firewall blocking OIDC JWKS endpoints.
- **Status:** `BLOCKED BY CLIENT DECISION` (Requires DEC-008 credentials)
- **Client Decision Required?** **Yes (DEC-008)**

#### ACU-LTI-002: Single Sign-On Launch Handshake Validation
- **Phase:** Phase 8 (Zoom / LTI)
- **Description:** Validate authenticated role-based launch handshakes: faculty launches as Host/Instructor; student launches as Attendee/Learner with zero password prompts.
- **Technical Area:** Authentication & SSO
- **Moodle Component:** `mod_lti` launch pipeline
- **Proposed Plugin/Theme:** None
- **Dependency:** ACU-LTI-001
- **Inputs Required:** Test student and faculty user accounts.
- **Output / Deliverable:** Functional SSO meeting launch.
- **Acceptance Criteria:** Clicking *"Start Live Session"* opens meeting with host controls; *"Join Live Session"* opens attendee viewer.
- **Risk:** User email mismatch between Moodle and Zoom account.
- **Status:** `READY`
- **Client Decision Required?** No

#### ACU-LTI-003: Live Session Widget Component Presentation
- **Phase:** Phase 8 (Zoom / LTI)
- **Description:** Connect `live_session_card.mustache` in Student and Faculty Dashboards to query upcoming `mod_lti` course events and render dynamic launch CTAs.
- **Technical Area:** Templating & Calendar API
- **Moodle Component:** `core_calendar`, `theme_acuitey`
- **Proposed Plugin/Theme:** `theme_acuitey`
- **Dependency:** ACU-THEME-003, ACU-LTI-002
- **Inputs Required:** Prototype live session card markup.
- **Output / Deliverable:** Dynamic live session widget displaying next upcoming clinic.
- **Acceptance Criteria:** Displays session topic, course, time; button deep-links to active LTI launch URL.
- **Risk:** Low.
- **Status:** `READY WITH ASSUMPTION`
- **Client Decision Required?** No

#### ACU-LTI-004: Telemetry & Attendance Synchronization Evaluation
- **Phase:** Phase 8 (Zoom / LTI)
- **Description:** Implement optional Zoom attendance webhook listener or LTI Assignment and Grade Services (AGS) synchronization if supported by account.
- **Technical Area:** Webhooks / Gradebook Integration
- **Moodle Component:** `mod_lti` AGS / Webhook receiver
- **Proposed Plugin/Theme:** `local_acuitey` (optional endpoint)
- **Dependency:** ACU-LTI-002
- **Inputs Required:** Client confirmation on DEC-009 and DEC-010.
- **Output / Deliverable:** Optional attendance sync handler.
- **Acceptance Criteria:** Only implemented if client confirms requirement and provides licensed Zoom webhook credentials; remains completely deferred pending DEC-009/010.
- **Risk:** High maintenance overhead if Zoom changes webhook schemas.
- **Status:** `BLOCKED BY CLIENT DECISION — DEC-009, DEC-010` (Deferred to optional milestone per DEC-009/010)
- **Client Decision Required?** **Yes (DEC-009, DEC-010)**

---

### PHASE 9: Roles, Permissions & Security

#### ACU-SEC-001: Contextual Capability Definitions
- **Phase:** Phase 9 (Roles & Security)
- **Description:** Implement `local/acuitey/db/access.php` defining custom capabilities: `local/acuitey:viewallocations`, `local/acuitey:acceptallocation`, `local/acuitey:requestreassignment`, `local/acuitey:viewassignedstudents`, `local/acuitey:updateavailability`, `local/acuitey:manageallocations`.
- **Technical Area:** Access Control (RBAC)
- **Moodle Component:** Moodle Access Subsystem (`core_role`)
- **Proposed Plugin/Theme:** `local_acuitey`
- **Dependency:** ACU-ROUTE-001
- **Inputs Required:** Capability matrix from [`ACUITEY-COMPONENT-MAPPING.md`](file:///C:/Users/Atul/Desktop/moodle/docs/implementation/ACUITEY-COMPONENT-MAPPING.md).
- **Output / Deliverable:** Registered capability definitions.
- **Acceptance Criteria:** Capabilities assignable to roles in Site Administration (`admin/roles/manage.php`).
- **Risk:** Low.
- **Status:** `READY`
- **Client Decision Required?** No

#### ACU-SEC-002: Default Role Archetype Configurations
- **Phase:** Phase 9 (Roles & Security)
- **Description:** Map permissions to standard archetypes: assign faculty capabilities to `editingteacher`/`teacher`; assign admin capabilities to `manager`/`academicadmin`.
- **Technical Area:** Role Administration
- **Moodle Component:** `core_role`
- **Proposed Plugin/Theme:** `local_acuitey`
- **Dependency:** ACU-SEC-001
- **Inputs Required:** Role matrix specifications.
- **Output / Deliverable:** Automated role capability bindings applied on plugin installation.
- **Acceptance Criteria:** Faculty users automatically gain workspace access; students strictly isolated.
- **Risk:** Custom roles manually created by administrators inheriting unexpected permissions.
- **Status:** `READY`
- **Client Decision Required?** No

#### ACU-SEC-003: Privacy API & GDPR Compliance Implementation
- **Phase:** Phase 9 (Roles & Security)
- **Description:** Implement `classes/privacy/provider.php` fulfilling Moodle's Privacy Subsystem (`\core_privacy\local\metadata\provider`) to support data export and deletion requests.
- **Technical Area:** Privacy & Compliance (GDPR)
- **Moodle Component:** `core_privacy`
- **Proposed Plugin/Theme:** `local_acuitey`
- **Dependency:** ACU-ROUTE-001
- **Inputs Required:** Privacy metadata documentation.
- **Output / Deliverable:** Certified Moodle Privacy Provider.
- **Acceptance Criteria:** Admin privacy data requests export all student allocations; user deletion purges user-linked routing state.
- **Risk:** Privacy check failure blocks official Moodle plugin certification.
- **Status:** `READY`
- **Client Decision Required?** No

#### ACU-SEC-004: Academic Operations Administrative Override Suite
- **Phase:** Phase 9 (Roles & Security)
- **Description:** Implement administrative management interface (`/local/acuitey/admin/queue.php`) allowing Academic Operations to inspect all queues, reassign stalled requests, and configure capacity.
- **Technical Area:** Administration UI
- **Moodle Component:** `local_acuitey` admin module
- **Proposed Plugin/Theme:** `local_acuitey`
- **Dependency:** ACU-SEC-001, ACU-ROUTE-005
- **Inputs Required:** Resolution of DEC-006.
- **Output / Deliverable:** Administrative management dashboard.
- **Acceptance Criteria:** Accessible only with `local/acuitey:manageallocations`; allows manual re-routing of any request.
- **Risk:** Low.
- **Status:** `READY WITH ASSUMPTION` (Assumes standard admin force-assign action)
- **Client Decision Required?** **Yes (DEC-006)**

---

### PHASE 10: Notifications & Messaging

#### ACU-NOTIF-001: Allocation Event Message Providers Setup
- **Phase:** Phase 10 (Messaging)
- **Description:** Register message providers in `local/acuitey/db/messages.php` for `allocation_offer`, `allocation_reassigned`, and `allocation_escalated`.
- **Technical Area:** Notifications & Messages
- **Moodle Component:** `core_message` subsystem
- **Proposed Plugin/Theme:** `local_acuitey`
- **Dependency:** ACU-ROUTE-005
- **Inputs Required:** Notification templates and copy.
- **Output / Deliverable:** Configurable notification streams in user messaging preferences.
- **Acceptance Criteria:** Offering an allocation triggers web notification and optional email dispatch.
- **Risk:** Email deliverability delays if SMTP is unconfigured.
- **Status:** `READY`
- **Client Decision Required?** No

#### ACU-NOTIF-002: Top Navbar Notification Badge Live Integration
- **Phase:** Phase 10 (Messaging)
- **Description:** Connect top navbar message and notification bell icons in `navbar.mustache` to Moodle's native popover controllers.
- **Technical Area:** Front-End Integration
- **Moodle Component:** `core_message/message_popover`
- **Proposed Plugin/Theme:** `theme_acuitey`
- **Dependency:** ACU-THEME-004, ACU-NOTIF-001
- **Inputs Required:** Navbar popover markup.
- **Output / Deliverable:** Interactive notification popovers in header.
- **Acceptance Criteria:** Unread count displays badge dot; clicking displays recent notifications.
- **Risk:** Low.
- **Status:** `READY`
- **Client Decision Required?** No

#### ACU-NOTIF-003: Direct Student Advising Messaging Drawer Shortcut
- **Phase:** Phase 10 (Messaging)
- **Description:** Implement JavaScript trigger opening Moodle's native conversation drawer focused on specific student user ID from Assigned Students roster.
- **Technical Area:** Messaging AMD Module
- **Moodle Component:** `core_message/message_drawer`
- **Proposed Plugin/Theme:** `local_acuitey`
- **Dependency:** ACU-FAC-005
- **Inputs Required:** Moodle messaging AMD API (`core_message/message_drawer`).
- **Output / Deliverable:** Seamless 1-click messaging initiation.
- **Acceptance Criteria:** Clicking *"Message"* immediately opens conversation drawer without page reload.
- **Risk:** Low.
- **Status:** `READY`
- **Client Decision Required?** No

---

### PHASE 11: Testing, a11y & Performance QA

#### ACU-QA-001: PHPUnit Test Suite for Allocation & Capacity Services
- **Phase:** Phase 11 (Testing & QA)
- **Description:** Author comprehensive automated PHPUnit test cases covering candidate selection, capacity counting, state transitions, and audit logging.
- **Technical Area:** Automated Testing
- **Moodle Component:** `admin/tool/phpunit`
- **Proposed Plugin/Theme:** `local_acuitey/tests/`
- **Dependency:** ACU-ROUTE-005
- **Inputs Required:** Acceptance criteria scenarios from [`ACUITEY-ACCEPTANCE-CRITERIA.md`](file:///C:/Users/Atul/Desktop/moodle/docs/implementation/ACUITEY-ACCEPTANCE-CRITERIA.md).
- **Output / Deliverable:** Passing PHPUnit test suite with >85% code coverage.
- **Acceptance Criteria:** All test cases pass via `vendor/bin/phpunit local_acuitey_testcase`.
- **Risk:** Database fixture tear-down issues on complex mock data.
- **Status:** `READY`
- **Client Decision Required?** No

#### ACU-QA-002: Behat Acceptance Test Scenarios
- **Phase:** Phase 11 (Testing & QA)
- **Description:** Implement Behat feature files verifying end-to-end user journeys: student enrolment, faculty offer acceptance, and reassignment workflow.
- **Technical Area:** BDD / Acceptance Testing
- **Moodle Component:** `admin/tool/behat`
- **Proposed Plugin/Theme:** `local_acuitey/tests/behat/`
- **Dependency:** ACU-QA-001
- **Inputs Required:** Gherkin scenarios from [`ACUITEY-ACCEPTANCE-CRITERIA.md`](file:///C:/Users/Atul/Desktop/moodle/docs/implementation/ACUITEY-ACCEPTANCE-CRITERIA.md).
- **Output / Deliverable:** Automated browser acceptance test suite.
- **Acceptance Criteria:** Behat scenarios execute and pass cleanly on headless Chrome.
- **Risk:** Flaky tests due to asynchronous UI transitions.
- **Status:** `READY`
- **Client Decision Required?** No

#### ACU-QA-003: WCAG 2.1 Level AA Accessibility Audit
- **Phase:** Phase 11 (Testing & QA)
- **Description:** Execute automated (axe-core/Pa11y) and manual keyboard navigation audits across all four screens to verify WCAG AA compliance.
- **Technical Area:** Accessibility (a11y)
- **Moodle Component:** All screens
- **Proposed Plugin/Theme:** Theme and Plugin
- **Dependency:** ACU-CAT-001, ACU-STU-001, ACU-FAC-001
- **Inputs Required:** WCAG 2.1 AA checklist.
- **Output / Deliverable:** Formal a11y audit report with zero critical/serious violations.
- **Acceptance Criteria:** Contrast ratios >= 4.5:1; visible focus states; screen-reader accessible landmarks; zero keyboard traps.
- **Risk:** Low.
- **Status:** `READY`
- **Client Decision Required?** No

#### ACU-QA-004: Payment Idempotency & Webhook Security Test Suite
- **Phase:** Phase 11 (Testing & QA)
- **Description:** Author test scripts simulating duplicate webhook callbacks, tampered signatures, and network timeouts to verify payment security.
- **Technical Area:** Security Testing
- **Moodle Component:** `payment_gateway_*`
- **Proposed Plugin/Theme:** Gateway plugins
- **Dependency:** ACU-PAY-002
- **Inputs Required:** Payment security test cases.
- **Output / Deliverable:** Automated payment security test suite.
- **Acceptance Criteria:** Zero duplicate enrolments; invalid signatures rejected with 400.
- **Risk:** Gateway simulator discrepancies with live gateway behaviors.
- **Status:** `READY WITH ASSUMPTION`
- **Client Decision Required?** No

#### ACU-QA-005: Concurrency & Database Query Profiling
- **Phase:** Phase 11 (Testing & QA)
- **Description:** Profile dashboard and catalogue pages using Moodle Performance Info footer to verify database query counts and memory usage.
- **Technical Area:** Performance Engineering
- **Moodle Component:** Moodle Profiler (`$CFG->perfdebug`)
- **Proposed Plugin/Theme:** All custom code
- **Dependency:** ACU-FAC-001, ACU-STU-001
- **Inputs Required:** High-concurrency performance criteria (<25 queries per page).
- **Output / Deliverable:** Performance profiling report and query optimization indices.
- **Acceptance Criteria:** Faculty Dashboard executes < 25 DB queries; memory footprint < 16MB per request.
- **Risk:** N+1 query patterns in template rendering loops (mitigated by bulk record retrieval).
- **Status:** `READY`
- **Client Decision Required?** No

---

### PHASE 12: Deployment, Monitoring & Ops

#### ACU-OPS-001: Production Server Stack Provisioning (Hostinger KVM)
- **Phase:** Phase 12 (Infrastructure & Ops)
- **Description:** Provision Hostinger KVM virtual machine running Ubuntu 24.04 LTS, Nginx 1.26+, PHP 8.2-FPM with Opcache, and secure TLS termination. Nginx virtual host `server_name`, TLS certificates, and Moodle `$CFG->wwwroot` are gated by DEC-017 (`portal.acuiteysolutions.com` vs `academy.acuiteysolutions.com`); production server configuration must not finalize hostname settings until confirmed.
- **Technical Area:** Systems Engineering
- **Moodle Component:** Web Server Infrastructure
- **Proposed Plugin/Theme:** Infrastructure (PROPOSED)
- **Dependency:** ACU-ENV-001
- **Inputs Required:** Server provisioning credentials; resolution of DEC-017.
- **Output / Deliverable:** Hardened Linux web server hosting Moodle.
- **Acceptance Criteria:** Nginx serves HTTPS via Let's Encrypt for client-approved subdomain; PHP-FPM pool tuned; Moodledata placed outside web root; no raw-IP access; DNS, TLS, wwwroot, and Nginx hostname remain unfinalized until DEC-017 confirmed.
- **Risk:** Server resource constraints under high concurrent video streaming (mitigated by Zoom hosting media externally).
- **Status:** `READY WITH ASSUMPTION` (UI / Infrastructure Scaffolding; assumes KVM baseline, production domain gated by DEC-017)
- **Client Decision Required?** **Yes (DEC-017 for production hostname)**

#### ACU-OPS-002: Managed Database & Redis Cache Layer Setup
- **Phase:** Phase 12 (Infrastructure & Ops)
- **Description:** Provision managed PostgreSQL or MariaDB database and configure local Redis daemon for Moodle Universal Cache (MUC) and session storage.
- **Technical Area:** Database & Caching Ops
- **Moodle Component:** Database & MUC
- **Proposed Plugin/Theme:** Infrastructure (PROPOSED)
- **Dependency:** ACU-OPS-001
- **Inputs Required:** Database connection parameters.
- **Output / Deliverable:** Connected, optimized database and Redis caching layer.
- **Acceptance Criteria:** Database latency < 5ms; Redis handling session store without lock deadlocks.
- **Risk:** Low.
- **Status:** `READY`
- **Client Decision Required?** No

#### ACU-OPS-003: Moodle Background Cron Runner Configuration
- **Phase:** Phase 12 (Infrastructure & Ops)
- **Description:** Configure system crontab (`* * * * * php /var/www/moodle/admin/cli/cron.php > /dev/null 2>&1`) executing every 1 minute.
- **Technical Area:** Systems Engineering
- **Moodle Component:** Moodle Cron Engine
- **Proposed Plugin/Theme:** Crontab
- **Dependency:** ACU-OPS-001
- **Inputs Required:** Root server crontab access.
- **Output / Deliverable:** High-frequency cron runner executing background tasks.
- **Acceptance Criteria:** Moodle Site Administration verifies cron has run within the past 60 seconds; ad-hoc allocation tasks process instantly.
- **Risk:** Cron stalls on unhandled task exceptions (mitigated by Moodle task timeout limits).
- **Status:** `READY`
- **Client Decision Required?** No

#### ACU-OPS-004: Automated Offsite Backup & Monitoring Stack
- **Phase:** Phase 12 (Infrastructure & Ops)
- **Description:** Implement nightly automated encrypted backups of database and Moodledata to offsite object storage (S3/Wasabi); configure uptime and error log monitoring referencing the client-approved production LMS hostname (`portal.acuiteysolutions.com` or `academy.acuiteysolutions.com` per DEC-017).
- **Technical Area:** Disaster Recovery & Observability
- **Moodle Component:** Backup & Logging
- **Proposed Plugin/Theme:** Ops Automation
- **Dependency:** ACU-OPS-001
- **Inputs Required:** Backup storage bucket credentials; confirmed production hostname from DEC-017.
- **Output / Deliverable:** Automated backup scripts and uptime health check endpoint.
- **Acceptance Criteria:** Nightly backup executes without interrupting web traffic; restore drill verified in staging; HTTPS uptime monitoring targets confirmed canonical hostname rather than raw server IP; endpoint unfinalized until DEC-017 confirmed.
- **Risk:** Moodledata storage volume exceeding backup transfer windows.
- **Status:** `READY WITH ASSUMPTION` (UI / Infrastructure Scaffolding; monitoring endpoint gated by DEC-017)
- **Client Decision Required?** **Yes (DEC-017 for monitoring endpoint)**

---

### PHASE 13: UAT & Production Go-Live

#### ACU-UAT-001: Stakeholder Staging Deployment & Pilot Demo
- **Phase:** Phase 13 (UAT & Launch)
- **Description:** Deploy complete, integrated build (`theme_acuitey`, `local_acuitey`, payment drivers) to staging environment for stakeholder acceptance testing.
- **Technical Area:** UAT / Release Management
- **Moodle Component:** Complete Platform
- **Proposed Plugin/Theme:** All Custom Plugins
- **Dependency:** All previous phases (Phases 0–12)
- **Inputs Required:** Staging domain and test user cohorts.
- **Output / Deliverable:** Accessible staging site populated with representative academic data.
- **Acceptance Criteria:** Stakeholders execute end-to-end student and faculty flows successfully without encountering errors.
- **Risk:** Stakeholder change requests requiring scope adjustments.
- **Status:** `READY WITH ASSUMPTION`
- **Client Decision Required?** No

#### ACU-UAT-002: Security Vulnerability Scan & Penetration Test Sign-Off
- **Phase:** Phase 13 (UAT & Launch)
- **Description:** Perform dynamic application security testing (DAST) verifying CSRF tokens, session fixation resistance, SQL injection immunity, and role isolation.
- **Technical Area:** Security Engineering
- **Moodle Component:** Entire Platform
- **Proposed Plugin/Theme:** Security Audit
- **Dependency:** ACU-UAT-001
- **Inputs Required:** Security testing toolset (OWASP ZAP / Burp Suite).
- **Output / Deliverable:** Clean security sign-off report.
- **Acceptance Criteria:** Zero High or Critical security vulnerabilities identified.
- **Risk:** Low.
- **Status:** `READY`
- **Client Decision Required?** No

#### ACU-UAT-003: Production Cutover, DNS Switch & Go-Live
- **Phase:** Phase 13 (UAT & Launch)
- **Description:** Execute production cutover checklist: migrate database schema, warm caches, switch live DNS within Acuitey's DNS zone to approved subdomain (`portal.acuiteysolutions.com` or `academy.acuiteysolutions.com` per DEC-017), verify live SSL/TLS certificates, validate "Portal Login" navigation button on `www.acuiteysolutions.com`, and monitor initial user traffic.
- **Technical Area:** Release Engineering
- **Moodle Component:** Production Environment
- **Proposed Plugin/Theme:** All
- **Dependency:** ACU-UAT-001, ACU-UAT-002
- **Inputs Required:** Live domain DNS management access; confirmed client hostname from DEC-017.
- **Output / Deliverable:** Live, production-accessible Acuitey Solutions LMS on approved branded subdomain.
- **Acceptance Criteria:** Production URL (`portal.acuiteysolutions.com` OR `academy.acuiteysolutions.com`) resolves cleanly over HTTPS; main site Portal Login button routes to LMS; zero raw-IP access; live transactions and routing operate smoothly; DNS, TLS, wwwroot, Nginx hostname, monitoring endpoint, Zoom/LTI callbacks, and payment callbacks must not be finalized until DEC-017 is confirmed.
- **Risk:** DNS propagation delays.
- **Status:** `READY WITH ASSUMPTION` (Release Scaffolding; cutover gated by DEC-017)
- **Client Decision Required?** **Yes (DEC-017 for canonical production hostname)**
