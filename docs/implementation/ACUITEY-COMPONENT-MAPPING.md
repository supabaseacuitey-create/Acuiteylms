# Acuitey LMS — Component Architecture & Subsystem Mapping

**Target Platform:** Moodle LMS 5.2.3+ (Build: 20260916)  
**Parent Theme:** Boost (`theme_boost`)  
**Custom Theme:** `theme_acuitey` (PROPOSED)  
**Custom Plugin:** `local_acuitey` (PROPOSED)  
**Source of Truth:** [`ACUITEY-DESIGN.md`](file:///C:/Users/Atul/Desktop/moodle/docs/design/ACUITEY-DESIGN.md) & [`FINAL-DESIGN-REVIEW.md`](file:///C:/Users/Atul/Desktop/moodle/docs/design/FINAL-DESIGN-REVIEW.md)  
**Document Classification:** Technical Architecture & Component Boundary Specification  
**Status:** Canonical Implementation Plan — Zero Core Modifications  

---

## 1. Moodle Core vs. Custom Boundary Governance

To ensure seamless upstream tracking and lifetime upgradeability of Moodle LMS, the Acuitey platform enforces a strict boundary between native Moodle core capabilities and custom extension layers.

### Boundary Principles:
1. **Zero Moodle Core Modifications:** Core PHP scripts, database tables, and default Mustache templates inside `/lib`, `/course`, `/user`, `/enrol`, `/admin`, `/mod`, and `/theme/boost` remain 100% untouched.
2. **Strict Encapsulation in Supported Plugin Types:**
   - Visual styling, page layouts, and presentation overrides reside exclusively in `theme/acuitey/`.
   - Proprietary allocation routing, supervisor availability, and capacity logic reside exclusively in `local/acuitey/`.
   - Payment processing resides exclusively in standard payment gateway plugins (`payment/gateway/razorpay/`, `payment/gateway/phonepe/`).
   - Live video conferencing leverages native LTI 1.3 tool handling via `mod_lti`.
3. **No Unnecessary Third-Party Plugins:** Core APIs are prioritized over third-party dependencies to eliminate technical debt and security surface area.
4. **No SPA Takeover:** The interface remains server-rendered via Moodle's native Mustache templating and PHP controllers, preserving core session handling, access control, and accessibility landmarks.

---

## 2. Master Component Classification Matrix

Every approved feature across the four prototypes is classified below into one of seven architectural tiers:
- **[A] MOODLE CORE / STANDARD:** Native Moodle subsystem utilized directly without modification.
- **[B] theme_acuitey:** Custom child-theme template, layout, or SCSS override.
- **[C] local_acuitey:** Custom local plugin implementing proprietary business logic.
- **[D] PAYMENT PLUGIN / GATEWAY:** Moodle `core_payment` gateway driver.
- **[E] STANDARD ACTIVITY / LTI:** Core Moodle activity module configured via standard administrative interfaces.
- **[F] OPTIONAL THIRD-PARTY PLUGIN:** Community-supported plugin subject to client confirmation.
- **[G] CLIENT CONFIGURATION:** Administrative setup within standard Moodle settings.

| Feature / UI Component | Prototype Source | Architectural Classification | Native Moodle API / Subsystem | Proposed Custom Artifact |
| :--- | :--- | :--- | :--- | :--- |
| **Top Navbar & Brand Header** | All Screens | **[B] theme_acuitey** | `theme_boost/navbar`, `$USER`, `core_renderer` | `theme_acuitey/templates/navbar.mustache` |
| **Navigation Drawer** | Dashboards, Catalogue | **[B] theme_acuitey** | `theme_boost_drawer`, `navigation_node` | `theme_acuitey/scss/moodle/drawer.scss` |
| **User Notifications & Messages Popover** | Top Navbar | **[A] MOODLE CORE** | `core_message`, `core_payment`, Notification popover | Styled via `theme_acuitey/scss/moodle/` |
| **Marketing Hero & Value Indicators** | Homepage | **[B] theme_acuitey** | Frontpage layout container | `theme_acuitey/templates/frontpage_hero.mustache` |
| **Course Category Chips & Search** | Homepage & Catalogue | **[B] theme_acuitey** | `core_course/category_view`, `core_customfield` | `theme_acuitey/templates/category_chips.mustache` |
| **Course Cards Grid** | Homepage & Catalogue | **[B] theme_acuitey** | `core_course_renderer::course_info_box()` | `theme_acuitey/templates/course_card.mustache` |
| **Catalogue Faceted Filters** | Catalogue | **[B] theme_acuitey** | Moodle Course Custom Fields (`core_customfield`) | `theme_acuitey/templates/catalogue_filters.mustache` |
| **Active Course Progress Cards** | Student Dashboard | **[B] theme_acuitey** | `block_myoverview`, Core Completion API (`completion_info`) | `theme_acuitey/templates/block_myoverview.mustache` |
| **Milestone Activity & Rubric Preview** | Student Dashboard | **[A] MOODLE CORE** | `mod_assign`, `gradingform_rubric` | Styled via `theme_acuitey/scss/` |
| **Live Classroom Launcher Card** | Dashboards | **[E] STANDARD ACTIVITY / LTI** | `mod_lti/view` (LTI 1.3 Advantage Single Sign-On) | `theme_acuitey/templates/live_session_card.mustache` |
| **Faculty Mentorship Support Panel** | Student Dashboard | **[C] local_acuitey** | Enrolment group query & supervisor resolution | `local_acuitey/templates/student_support_panel.mustache` |
| **Earned Certificates Module** | Student Dashboard | **[A] MOODLE CORE / [F]** | Core Badges or `mod_customcert` (Pending Decision) | Styled via `theme_acuitey/scss/` |
| **Faculty Live Availability Toggle** | Faculty Dashboard | **[C] local_acuitey** | Custom user preferences or plugin state table | `local_acuitey/templates/faculty_availability.mustache` |
| **Student Allocation Queue Card** | Faculty Dashboard | **[C] local_acuitey** | Ad-hoc routing queue & dispatch task | `local_acuitey/templates/allocation_queue.mustache` |
| **Supervisor Capacity Utilization Gauge**| Faculty Dashboard | **[C] local_acuitey** | Active assignment aggregation against limit | `local_acuitey/templates/faculty_capacity.mustache` |
| **Assigned Supervisee Roster Table** | Faculty Dashboard | **[C] local_acuitey** | Core Groups / Cohorts API & course context | `local_acuitey/templates/assigned_students.mustache` |
| **Pending Assessments Grading Queue** | Faculty Dashboard | **[A] MOODLE CORE** | `mod_assign`, Gradebook API (`grade_get_grades()`) | Standard Moodle grading table styled via SCSS |
| **Advising Inquiries Widget** | Faculty Dashboard | **[A] MOODLE CORE** | `core_message` conversation threads | Standard Moodle messaging styled via SCSS |
| **Enrolment Checkout Modal** | Catalogue / Enrol | **[D] PAYMENT PLUGIN** | `core_payment` gateway abstraction | `payment_gateway_razorpay/templates/checkout.mustache` |
| **Free / Open Access Enrolment** | Catalogue / Course | **[A] MOODLE CORE** | `enrol_self` native enrolment driver | Standard Moodle self-enrolment workflow |
| **Fee-based Automatic Enrolment** | Payment Flow | **[A] MOODLE CORE** | `enrol_fee` native enrolment driver | Core enrolment triggered upon payment reconciliation |
| **Institutional Theme Footer** | All Screens | **[B] theme_acuitey** | `theme_boost/footer` | `theme_acuitey/templates/footer.mustache` |

---

## 3. `theme_acuitey` Scope & Template Architecture

The custom child theme `theme_acuitey` extends `theme_boost` strictly through Moodle's supported theme APIs.

### 3.1 Proposed Directory Structure (PROPOSED FUTURE FILES)
```
theme/acuitey/
├── config.php                      # Theme configuration (declares parent = 'boost', layouts, sheets)
├── version.php                     # Theme metadata and Moodle version requirement (5.2.3+)
├── lib.php                         # Theme callback hooks (page_init, before_http_headers)
├── settings.php                    # Admin settings (brand assets, analytics, institutional notices)
├── lang/
│   └── en/
│       └── theme_acuitey.php       # Internationalization strings for UI components
├── scss/
│   ├── preset/
│   │   └── default.scss            # Bootstrap variable overrides (Navy/Cobalt/Slate tokens)
│   ├── acuitey/
│   │   ├── _tokens.scss            # Hairlines, radii, font-family, spacing tokens
│   │   ├── _buttons.scss           # Primary, Action Cobalt, Secondary outline buttons
│   │   ├── _cards.scss             # Clean flat panels, 1px borders, zero box-shadow
│   │   ├── _tables.scss            # Accessible data tables with light headers
│   │   ├── _drawers.scss           # Moodle Boost drawer override styling
│   │   └── _badges.scss            # Status pills and uppercase tracking (0.08em)
│   └── styles.scss                 # Master SCSS pipeline entry point
├── layout/
│   ├── frontpage.php               # Homepage layout wrapper
│   ├── columns2.php                # Two-column layout with right contextual sidebar
│   └── standard.php                # Standard administrative layout
└── templates/
    ├── navbar.mustache             # Boost navbar replacement with Acuitey branding & role badge
    ├── footer.mustache             # Institutional footer with governance metadata
    ├── frontpage_hero.mustache     # Marketing hero, discipline search, value indicators
    ├── category_chips.mustache     # Category pill navigation bar
    ├── course_card.mustache        # Faceted curriculum card with optional faculty row
    ├── catalogue_filters.mustache  # Sidebar faceted filter controls
    ├── block_myoverview.mustache   # Active learning progress cards override
    └── live_session_card.mustache  # Single-sign-on live conference launch widget
```

### 3.2 Layout & Region Mapping
- **Frontpage Layout (`layout/frontpage.php`):** Renders `frontpage_hero.mustache`, followed by the Moodle main content region displaying course categories and featured curriculums.
- **Two-Column Dashboard Layout (`layout/columns2.php`):** Used for both Student Dashboard (`/my/`) and Faculty Operations Workspace. Separates the main operational workflow (`1fr`) from the contextual block region (`340px`).

---

## 4. `local_acuitey` Scope & Plugin Architecture

The `local_acuitey` plugin houses the proprietary allocation routing engine, live availability persistence, supervisor capacity tracking, and student-to-faculty assignment governance.

### 4.1 Proposed Directory Structure (PROPOSED FUTURE FILES)
```
local/acuitey/
├── version.php                     # Plugin version, component = 'local_acuitey', requires Moodle 5.2.3+
├── lib.php                         # Core hooks (local_acuitey_extend_navigation)
├── settings.php                    # Admin configuration (timeouts, max reassignments, capacity defaults)
├── db/
│   ├── install.xml                 # XMLDB schema definition for plugin entities (PROPOSED)
│   ├── access.php                  # Capability definitions (local/acuitey:*)
│   ├── events.php                  # Event observers (routing triggers upon enrolment/request)
│   ├── tasks.php                   # Scheduled and ad-hoc task declarations
│   └── services.php                # External web services for mobile/API queries (if approved)
├── classes/
│   ├── service/
│   │   ├── availability_manager.php# Manages faculty live state (Available, In Session, Unavailable, Offline)
│   │   ├── capacity_manager.php    # Aggregates active student load against configured ceilings
│   │   ├── candidate_selector.php  # Multi-criteria candidate evaluation and filtering engine
│   │   ├── allocation_service.php  # Handles request creation, offer dispatch, accept, and reassign
│   │   └── audit_logger.php        # Immutable audit history recorder
│   ├── task/
│   │   ├── allocation_dispatch_task.php # Ad-hoc task for asynchronous offer processing
│   │   └── offer_expiry_cron.php   # Scheduled task monitoring unresponded offer timeouts
│   ├── event/
│   │   ├── allocation_requested.php# Dispatched when a student submits a supervision request
│   │   ├── allocation_offered.php  # Dispatched when an offer is presented to candidate faculty
│   │   ├── allocation_accepted.php # Dispatched when faculty accepts; triggers assignment creation
│   │   ├── reassignment_requested.php # Dispatched when faculty declines/reassigns
│   │   └── allocation_escalated.php# Dispatched when manual administrative review is required
│   └── privacy/
│       └── provider.php            # Implements \core_privacy\local\metadata\provider (GDPR compliance)
└── templates/
    ├── allocation_queue.mustache   # Faculty incoming allocation request queue container
    ├── allocation_request.mustache # Individual request card with matching context and actions
    ├── faculty_availability.mustache# Operational status switcher bar
    ├── faculty_capacity.mustache   # Supervisor workload progress widget
    ├── assigned_students.mustache  # Active supervisees data table
    └── reassignment_dialog.mustache# Accessible modal for declining and requesting reassignment
```

---

## 5. Conceptual Data Model Planning (PROPOSED ENTITIES)

*Note: No XMLDB files or database tables are created in this phase. The following conceptual schema represents the planned data persistence layer:*

### 5.1 `mdl_local_acuitey_faculty_avail` (Faculty Live Availability)
- **Purpose:** Stores the operational availability state of faculty members eligible for student routing.
- **Key Fields:** `id`, `userid` (FK to `mdl_user`), `status` (`available`, `in_session`, `unavailable`, `offline`), `status_reason`, `timemodified`.
- **Moodle Relations:** Directly links to `mdl_user.id`.
- **Privacy & GDPR:** Contains user-linked operational state; included in Privacy API export/purge routines.

### 5.2 `mdl_local_acuitey_faculty_cap` (Supervisor Capacity Configuration)
- **Purpose:** Tracks configurable student capacity limits and active supervisory assignments per faculty member.
- **Key Fields:** `id`, `userid` (FK to `mdl_user`), `departmentid` (optional FK to category), `max_capacity` (integer limit), `active_load` (cached count), `allow_overflow` (boolean), `timemodified`.
- **Moodle Relations:** Foreign key to `mdl_user.id`.

### 5.3 `mdl_local_acuitey_alloc_req` (Student Allocation Request)
- **Purpose:** Master record for student-initiated or enrolment-triggered allocation workflows.
- **Key Fields:** `id`, `req_uuid` (UUID v4), `studentid` (FK to `mdl_user`), `courseid` (FK to `mdl_course`), `support_category` (milestone, thesis, lab, consultation), `status` (`waiting`, `offered`, `accepted`, `assigned`, `reassign_requested`, `escalated`, `closed`), `reassignment_count` (int), `timecreated`, `timemodified`.
- **Moodle Relations:** Links to `mdl_user.id` (student) and `mdl_course.id`.

### 5.4 `mdl_local_acuitey_alloc_cand` (Allocation Candidate Offer)
- **Purpose:** Tracks offers made to individual faculty candidates during a request's routing lifecycle.
- **Key Fields:** `id`, `requestid` (FK to `alloc_req`), `facultyid` (FK to `mdl_user`), `offer_status` (`offered`, `accepted`, `reassigned`, `expired`), `offer_reason` (matching metadata summary), `expiry_time` (timestamp), `responded_time` (timestamp).
- **Moodle Relations:** Links to `mdl_user.id` (faculty member) and `alloc_req.id`.

### 5.5 `mdl_local_acuitey_assignment` (Active Student-to-Faculty Supervision)
- **Purpose:** Stores finalized student-to-faculty mentoring bindings.
- **Key Fields:** `id`, `studentid` (FK to `mdl_user`), `facultyid` (FK to `mdl_user`), `courseid` (FK to `mdl_course`), `support_category`, `groupid` (FK to `mdl_groups`), `status` (`active`, `completed`, `terminated`), `start_date`, `end_date`.
- **Moodle Relations:** Links to Moodle native groups (`mdl_groups`) for contextual course activity isolation.

### 5.6 `mdl_local_acuitey_audit_log` (Immutable Routing Audit Trail)
- **Purpose:** Append-only log recording every lifecycle transition, reassignment reason, and administrative override.
- **Key Fields:** `id`, `requestid`, `action`, `actor_userid` (who performed action), `previous_state`, `new_state`, `payload_json` (audit details), `timecreated`.
- **Retention & Audit:** Preserved across the academic audit lifecycle for institutional governance.

---

## 6. Roles & Capability Matrix

Moodle's contextual RBAC evaluates permissions strictly by context. Custom capabilities are registered under the `local/acuitey` namespace:

| Role Name | Moodle Context Scope | Standard Capabilities Reused | Proposed `local_acuitey` Capabilities |
| :--- | :--- | :--- | :--- |
| **Learner / Student** | Course & Activity (`context_course`) | `moodle/course:view`, `mod/assign:submit`, `mod/lti:view` | `local/acuitey:requestallocation` (request supervision) |
| **Faculty / Supervisor** | Course & Activity (`context_course`) | `mod/assign:grade`, `mod/quiz:grade`, `moodle/course:managegroups` | `local/acuitey:viewallocations`<br>`local/acuitey:acceptallocation`<br>`local/acuitey:requestreassignment`<br>`local/acuitey:viewassignedstudents`<br>`local/acuitey:updateavailability` |
| **Academic Operations Admin** | Category & Course (`context_coursecat`) | `moodle/category:manage`, `moodle/course:create`, `moodle/cohort:assign` | `local/acuitey:manageallocations` (manual override)<br>`local/acuitey:configurecapacity` |
| **Finance Administrator** | System (`context_system`) | `moodle/payment:manageaccounts`, `moodle/payment:viewreports` | None (Strictly isolated from pedagogical data) |
| **Site Administrator** | Global System (`context_system`) | Full site administration privileges | All capabilities granted by default |

---

## 7. Payment Architecture & Gateway Integration Model

Enrolment checkout leverages Moodle's native Payment Subsystem (`core_payment`).

```
Student clicks "Enrol Now"
          │
          ▼
Moodle core_payment checks course fee
          │
          ▼
User selects Razorpay or PhonePe gateway modal
          │
          ▼
Gateway Driver creates order via Server-Side API
          │
          ▼
Student completes payment in secure gateway iframe/app
          │
          ▼
Gateway webhook / return callback received by Moodle
          │
          ▼
Gateway-Specific Server-Side Authenticity & Signature Verification
(Razorpay HMAC SHA256 / PhonePe SHA256 X-VERIFY)
          │
          ▼
Amount & Currency validated against Moodle order table
          │
          ▼
Idempotency verified (prevent duplicate processing)
          │
          ▼
core_payment triggers enrol_fee::enrol_user()
          │
          ▼
Student enrolment activated; Dashboard access granted
```

### Gateway Differentiation & Governance:
- **Razorpay Integration:** Utilizes gateway-specific server-side authenticity/signature verification against merchant secrets.
- **PhonePe Integration:** Utilizes gateway-specific server-side authenticity/signature verification against merchant status APIs.
- **Signature Security Mandate:** Signature verification and payment status queries must always execute server-side within the PHP gateway driver. Client-side success callbacks are never trusted alone.
- **Idempotency:** Payment transaction references (`payment_id`) are unique-constrained in the payment account ledger to reject duplicate replay attempts.

---

## 8. Zoom / LTI 1.3 Advantage Integration Model

Live video conferencing leverages Moodle's native LTI module (`mod_lti`) configured with LTI 1.3 Advantage Single Sign-On.

### 8.1 Launch Handshake Workflow
1. User clicks **"Start Live Session"** (Faculty) or **"Join Live Session"** (Student) within Moodle.
2. Moodle `mod_lti` initiates an OpenID Connect (OIDC) authentication request to the institutional Zoom LTI 1.3 gateway.
3. Zoom authenticates the session token, verifies course and role context (`Instructor` vs. `Learner`), and issues a signed JSON Web Token (JWT).
4. Moodle completes the launch, embedding or redirecting to the authenticated conference room with zero manual login or password entry required.

### 8.2 Operational Telemetry Disclaimer
- **Attendance Synchronization:** Subject to institutional Zoom licensing, API account tier, and configuration capabilities. *Not guaranteed as a baseline core feature.*
- **Grade Synchronization:** LTI Assignment and Grade Services (AGS) are supported natively by `mod_lti` but will only be activated if the client provides explicit grading criteria for live attendance.
