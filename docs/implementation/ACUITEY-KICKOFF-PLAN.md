# Acuitey LMS — Engineering Kickoff & Implementation Sequencing Plan

**Target Platform:** Moodle LMS 5.2.3+  
**Parent Theme:** Boost (`theme_boost`)  
**Proposed Custom Theme:** `theme_acuitey`  
**Proposed Custom Plugin:** `local_acuitey`  
**Source Documents:**
- [`ACUITEY-IMPLEMENTATION-WBS.md`](file:///C:/Users/Atul/Desktop/moodle/docs/implementation/ACUITEY-IMPLEMENTATION-WBS.md)
- [`ACUITEY-COMPONENT-MAPPING.md`](file:///C:/Users/Atul/Desktop/moodle/docs/implementation/ACUITEY-COMPONENT-MAPPING.md)
- [`ACUITEY-ACCEPTANCE-CRITERIA.md`](file:///C:/Users/Atul/Desktop/moodle/docs/implementation/ACUITEY-ACCEPTANCE-CRITERIA.md)
- [`ACUITEY-OPEN-DECISIONS.md`](file:///C:/Users/Atul/Desktop/moodle/docs/implementation/ACUITEY-OPEN-DECISIONS.md)
- [`ACUITEY-CLIENT-DECISION-PACK.md`](file:///C:/Users/Atul/Desktop/moodle/docs/implementation/ACUITEY-CLIENT-DECISION-PACK.md)
- [`ACUITEY-SYSTEM-DESIGN-REVIEW-TRACKER.md`](file:///C:/Users/Atul/Desktop/moodle/docs/client-review/ACUITEY-SYSTEM-DESIGN-REVIEW-TRACKER.md)  
**Document Classification:** Engineering Release Management & Phased Kickoff Plan  
**Status:** ON HOLD — PENDING GATE-01 (Client Architecture Review Pending) — Production Code Frozen  

---

## 1. Executive Implementation Strategy

The Acuitey LMS implementation is strictly governed to ensure engineering proceeds efficiently while **never pre-selecting or hard-coding unconfirmed client business decisions**.

All 57 implementation tasks defined across the master WBS are rigorously classified into three distinct categories:
- **Category A: SAFE TO START NOW (31 Tasks, 54.4%):** Foundational, theme, infrastructure, and generic service tasks that have complete technical specifications, zero external dependencies, and cannot accidentally embed an unresolved business rule.
- **Category B: UI / INFRASTRUCTURE SCAFFOLDING ONLY (15 Tasks, 26.3%):** Presentation templates, neutral layout shells, and mock/simulated test harnesses that can be constructed safely without implementing backend business rules, hostnames, or pre-selecting client options.
- **Category C: BLOCKED BY CLIENT DECISION (11 Tasks, 19.3%):** Tasks directly dependent on unresolved client decisions (`DEC-001` through `DEC-017`). Implementation is strictly frozen until the client formally signs off on the specific decision brief.

### Core Architectural Governance Rules:
> [!IMPORTANT]
> **Category A (SAFE TO START NOW):** May proceed immediately once implementation kickoff is approved. These tasks have zero touchpoints with unresolved business rules.  
> **Category B (UI / INFRASTRUCTURE SCAFFOLDING ONLY):** May proceed with UI layouts and neutral component scaffolding using mock/sample data only. Must NOT encode business logic, automated status transitions, or algorithm defaults.  
> **Category C (BLOCKED BY CLIENT DECISION):** Work is strictly frozen. No database schema, algorithm logic, timeout duration, gateway driver, or certificate engine may be implemented until the corresponding `DEC-*` decision is formally resolved by the client.

---

## 2. Work Readiness Classification

### 2.1 CATEGORY A: SAFE TO START NOW (Zero Blockers — 32 Tasks)
These tasks have complete technical specifications, zero unresolved business rules, and cannot accidentally embed or pre-select an open client decision:

- **Environment & Developer Harness (Phase 0):**
  - `ACU-ENV-001`: Local Moodle 5.2.3+ development environment initialization.
  - `ACU-ENV-002`: Git version control and upstream tracking isolation (`.gitignore`).
  - `ACU-ENV-003`: PHPCS Moodle coding standards, PHPUnit, and Behat runner setup.
  - `ACU-ENV-004`: Baseline performance and MUC Redis cache benchmarking.
- **Moodle Baseline Setup (Phase 1):**
  - `ACU-BASE-001`: Site identity, timezone (IST), and language configuration.
  - `ACU-BASE-002`: Core course category tree structure (Cloud Architecture, Software Engineering, Governance, Foundations).
  - `ACU-BASE-004`: Native enrolment plugins activation (`enrol_self`, `enrol_fee`).
- **`theme_acuitey` Foundation (Phase 2):**
  - `ACU-THEME-001`: Child theme scaffolding inheriting from `theme_boost`.
  - `ACU-THEME-002`: SCSS design tokens pipeline (Oxford Navy, Action Cobalt, hairlines, tracking).
  - `ACU-THEME-003`: Core UI component styling (buttons, cards, badges, inputs).
  - `ACU-THEME-004`: Moodle Boost top navbar Mustache template override (`navbar.mustache`).
  - `ACU-THEME-005`: Moodle Boost navigation drawer SCSS and responsive off-canvas collapse.
- **Public & Discovery Experience (Phase 3):**
  - `ACU-CAT-001`: Frontpage marketing hero template (`frontpage_hero.mustache`).
  - `ACU-CAT-003`: Faceted course card Mustache template (`course_card.mustache`, optional faculty avatar).
  - `ACU-CAT-004`: Course category navigation chips (`category_chips.mustache`).
  - `ACU-CAT-005`: Institutional theme footer template (`footer.mustache`).
- **Student Dashboard Foundation (Phase 4):**
  - `ACU-STU-001`: Student dashboard two-column layout wrapper (`layout/columns2.php`).
  - `ACU-STU-002`: Active course progress cards overriding `block_myoverview`.
- **Faculty Operations Workspace (Phase 5):**
  - `ACU-FAC-001`: Faculty workspace page controller (`/local/acuitey/faculty/dashboard.php`) and capability check.
- **Routing Infrastructure (Phase 6):**
  - `ACU-ROUTE-002`: Faculty availability service class (`availability_manager.php`) with getter/setter and cache layer for manual availability.
  - `ACU-ROUTE-007`: Immutable routing audit logger service (`audit_logger.php`).
- **Live Classroom SSO (Phase 8):**
  - `ACU-LTI-002`: Single Sign-On launch handshake validation via native `mod_lti`.
- **Roles, Permissions & Compliance (Phase 9):**
  - `ACU-SEC-001`: Contextual capability declarations (`local/acuitey:viewallocations`, etc.).
  - `ACU-SEC-002`: Default role capability bindings for faculty, student, and admin archetypes.
  - `ACU-SEC-003`: Privacy API and GDPR compliance provider (`classes/privacy/provider.php`).
- **Messaging Subsystem (Phase 10):**
  - `ACU-NOTIF-001`: Event message provider registration in `db/messages.php`.
  - `ACU-NOTIF-002`: Top navbar notification badge popover integration.
  - `ACU-NOTIF-003`: Direct student advising messaging drawer shortcut.
- **Automated Testing Suite (Phase 11):**
  - `ACU-QA-001`: PHPUnit test suite for core availability and audit services.
  - `ACU-QA-002`: Behat browser acceptance test scenarios.
  - `ACU-QA-003`: WCAG 2.1 Level AA automated and manual accessibility audit.
  - `ACU-QA-005`: High-concurrency performance and database query profiling (<25 queries/page).
- **Deployment Infrastructure (Phase 12):**
  - `ACU-OPS-002`: Managed database and Redis cache layer setup.
  - `ACU-OPS-003`: High-frequency Moodle cron runner configuration (1-minute intervals).
  - `ACU-OPS-004`: Automated offsite encrypted backups and uptime monitoring.
- **Security Audit (Phase 13):**
  - `ACU-UAT-002`: Security vulnerability assessment and penetration test sign-off.

---

### 2.2 CATEGORY B: UI / INFRASTRUCTURE SCAFFOLDING ONLY (14 Tasks)
These tasks proceed strictly with presentation templates, neutral layouts, and mock/simulated harnesses. They do **not** encode business logic, automated state transitions, or algorithm defaults:

- `ACU-CAT-002`: Faceted Course Catalogue Search & Renderer *(Renders catalogue grid using mock/sample metadata; permanent custom field binding blocked by DEC-013)*.
- `ACU-STU-003`: Student Faculty Support Panel Integration *(Renders neutral presentation scaffolding across support states; mentoring business logic blocked by DEC-014)*.
- `ACU-FAC-002`: Faculty Live Availability Switcher Component *(Renders manual segmented control and AJAX persistence; automated status transitions during live sessions blocked by DEC-015)*.
- `ACU-FAC-003`: Incoming Student Allocation Queue UI *(Renders queue container and card components with neutral action stubs; allocation engine blocked by DEC-001 to DEC-005)*.
- `ACU-FAC-004`: Supervisor Workload & Capacity Progress Widget *(Renders capacity gauge and ratio UI using sample data; capacity calculation model blocked by DEC-001)*.
- `ACU-FAC-005`: Assigned Students Roster Table & Direct Messaging *(Renders supervisee roster UI and core messaging shortcut; roster query scope blocked by DEC-016)*.
- `ACU-PAY-002`: Server-Side Authenticity/Signature Verification & Idempotency *(Architecture planning and simulated mock driver; live gateway verification blocked by DEC-011 and DEC-012)*.
- `ACU-PAY-004`: Payment Reconciliation & Automatic Enrolment Hook *(Standard Moodle core_payment / enrol_fee callback harness; live gateway activation blocked by DEC-011)*.
- `ACU-LTI-003`: Live Session Widget Dynamic Calendar Integration *(Upcoming clinic session card UI scaffolding linked to Moodle calendar events API)*.
- `ACU-SEC-004`: Academic Operations Admin Override Suite *(Admin UI queue scaffolding; manual intervention policies governed by DEC-006)*.
- `ACU-QA-004`: Payment Idempotency & Webhook Test Suite *(Mock/simulated gateway testing harness until DEC-011 and DEC-012 are confirmed)*.
- `ACU-OPS-001`: Production Server Stack Provisioning *(Hostinger KVM baseline infrastructure scripts; final production sizing confirmed before launch)*.
- `ACU-UAT-001`: Stakeholder Staging Deployment & Pilot Demo *(Staging environment deployment pipeline)*.
- `ACU-UAT-003`: Production Cutover & Go-Live *(Production cutover runbook and final release coordination)*.

---

### 2.3 CATEGORY C: BLOCKED BY CLIENT DECISION (11 Tasks)
These tasks involve core business logic, schema definitions, commercial integrations, or external credentials. **No production code, algorithm logic, or database schema may be created** until the client returns decisions on the indicated briefs:

| Task ID | Task Name | Blocking Decision ID | Blocking Governance Scope & Required Client Action |
| :--- | :--- | :--- | :--- |
| `ACU-BASE-003` | Moodle Course Custom Fields Taxonomy Setup | **DEC-013** | Formal sign-off on course custom fields taxonomy (`discipline_category`, `academic_level`, `term_duration`). Do not create permanent fields until approved. |
| `ACU-STU-004` | Earned Certificates Widget Implementation | **DEC-007** | Selection of certificate generation engine (Moodle Badges, `mod_customcert`, external platform, or custom PDF). Backend implementation frozen. |
| `ACU-ROUTE-001` | Plugin Database Schema (`install.xml`) | **DEC-001** | Selection of supervisor capacity data model (global ceiling vs departmental ceiling vs individual faculty profile). |
| `ACU-ROUTE-003` | Supervisor Capacity Manager Class | **DEC-001** | Definition of capacity calculation model. Must NOT assume or pre-select the individual/per-profile model before client approval. |
| `ACU-ROUTE-004` | Candidate Selector Matching Engine | **DEC-004** | Definition of candidate ordering logic. Must NOT choose least-utilized, round-robin, expertise-first, or combined score until client approval. |
| `ACU-ROUTE-005` | Allocation State Machine & Reassignment Workflow | **DEC-003, DEC-005, DEC-014** | Definition of reassignment destination (DEC-003), maximum retry threshold (DEC-005), and mentoring workflow scope (DEC-014). Zero automated routing or escalation logic until approved. |
| `ACU-ROUTE-006` | Asynchronous Offer Dispatch & Expiry Background Tasks | **DEC-002** | Definition of offer expiration policy. Must NOT hard-code 2h, 4h, 24h, or cron expiry behavior before client approval. |
| `ACU-PAY-001` | Razorpay Gateway Plugin Scaffolding | **DEC-011** | Confirmation of required production payment gateway providers (Razorpay, PhonePe, dual, etc.). |
| `ACU-PAY-003` | PhonePe Gateway Plugin Development | **DEC-011, DEC-012** | Confirmation of PhonePe gateway requirement and provisioning of merchant sandbox credentials. |
| `ACU-LTI-001` | Moodle External Tool (`mod_lti`) Config | **DEC-008** | Provisioning of institutional Zoom account tier and LTI Pro marketplace credentials. |
| `ACU-LTI-004` | Attendance & Gradebook Sync Evaluation | **DEC-009, DEC-010** | Policy confirmation on whether live session attendance (DEC-009) or participation gradebook points (DEC-010) are synchronized. |

---

## 3. Implementation Waves

The 57 tasks are sequenced into six strictly gated deployment waves. **Wave 1 is restricted primarily to pure foundation tasks that are 100% independent of all client decisions:**

```
┌────────────────────────────────────────────────────────────────────────┐
│ WAVE 1: SAFE FOUNDATION & PROJECT READINESS                            │
│ Tasks: ACU-ENV-001 to 004, ACU-BASE-001, 002, 004, ACU-THEME-001 to 005│
│ Deliverable: Running Moodle 5.2.3+ with compiled Acuitey theme tokens, │
│              brand navbar, responsive drawer, and test harness.         │
│ GUARANTEE: Zero routing algorithm logic; zero unconfirmed rules.       │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼────────────────────────────────────┐
│ WAVE 2: PUBLIC EXPERIENCE & COURSE DISCOVERY                           │
│ Tasks: ACU-CAT-001 to 005                                              │
│ Gating: ACU-CAT-002 uses mock taxonomy until DEC-013 is formalized;    │
│         ACU-BASE-003 unblocks upon DEC-013 client sign-off.            │
│ Deliverable: Frontpage hero, category chips, faceted catalogue,       │
│              course cards, and institutional footer.                   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼────────────────────────────────────┐
│ WAVE 3: STUDENT DASHBOARD & LEARNING OPERATIONS                        │
│ Tasks: ACU-STU-001 to 004, ACU-NOTIF-001 to 003                        │
│ Gating: ACU-STU-003 provides neutral scaffolding pending DEC-014;       │
│         ACU-STU-004 certificate backend frozen pending DEC-007.        │
│ Deliverable: Student dashboard (/my/), active progress cards, rubric   │
│              links, neutral support panel, and messaging drawer.       │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼────────────────────────────────────┐
│ WAVE 4: FACULTY WORKSPACE & ALLOCATION ROUTING ENGINE                  │
│ Tasks: ACU-SEC-001 to 004, ACU-FAC-001 to 005, ACU-ROUTE-001 to 007   │
│ Gating: ACU-FAC-002..005 provide UI scaffolding; routing algorithms    │
│         (ACU-ROUTE-001, 003, 004, 005, 006) unblock ONLY upon client   │
│         resolution of DEC-001, DEC-002, DEC-003, DEC-004, DEC-005.    │
│ Deliverable: Faculty operations workspace, manual availability toggle, │
│              allocation queue UI, and approved matching engine.        │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼────────────────────────────────────┐
│ WAVE 5: LIVE VIDEO CLASSROOMS & COMMERCIAL PAYMENTS                    │
│ Tasks: ACU-PAY-001 to 004, ACU-LTI-001 to 004                         │
│ Gating: Unblocks upon resolution of DEC-008 (Zoom), DEC-011 (Gateways),│
│         and DEC-012 (Merchant Credentials).                            │
│ Deliverable: Verified payment gateways, server-side signature check,   │
│              automatic enrolment hook, and Zoom LTI 1.3 Advantage SSO. │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼────────────────────────────────────┐
│ WAVE 6: TESTING, DEPLOYMENT & PRODUCTION LAUNCH                        │
│ Tasks: ACU-QA-001 to 005, ACU-OPS-001 to 004, ACU-UAT-001 to 003       │
│ Deliverable: PHPUnit/Behat pass, WCAG AA certification, KVM deployment,│
│              disaster recovery drills, security audit, and cutover.    │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Cross-Document Verification & Governance Reconciliation

### Governance Reconciliation Audit Findings:
During governance review of the initial engineering documentation, the following implementation assumptions were detected and reconciled:

1. **Routing Default Assumptions Detected & Removed:**
   - `ACU-ROUTE-003` previously assumed a "per-profile capacity model" as an implementation baseline. This contradicted `DEC-001`, which requires the client to select among global, departmental, or individual faculty capacity models. **Reconciliation:** The assumption was removed; `ACU-ROUTE-003` is classified as `BLOCKED BY CLIENT DECISION — DEC-001`.
   - `ACU-ROUTE-004` previously assumed a "least-utilized first" candidate ordering rule. This contradicted `DEC-004`, which leaves candidate prioritization open. **Reconciliation:** The assumption was removed; `ACU-ROUTE-004` is classified as `BLOCKED BY CLIENT DECISION — DEC-004`.
   - `ACU-ROUTE-006` previously assumed a "24-hour expiration window" and automated cron re-routing. This contradicted `DEC-002`, which asks the client to establish timeout policies. **Reconciliation:** The assumption was removed; `ACU-ROUTE-006` is classified as `BLOCKED BY CLIENT DECISION — DEC-002`. Generic task infrastructure may be designed, but no timeout policy may be implemented before approval.
   - `ACU-ROUTE-005` previously implied automated next-candidate rotation. **Reconciliation:** Explicitly documented that `DEC-003` (reassignment destination), `DEC-005` (maximum retry threshold), and `DEC-014` (mentoring scope) remain unresolved, and no automated rotation or escalation logic will be coded before client sign-off.
   - `ACU-FAC-002` previously lacked explicit separation from live session states. **Reconciliation:** Explicitly documented that manual availability UI remains independent and that automated transitions to "In Session" on live session launch will not be implemented pending `DEC-015`.
   - `ACU-STU-004` previously assumed standard PDF certificate generation. **Reconciliation:** The certificate backend was reclassified as `BLOCKED / DEFERRED BY CLIENT DECISION — DEC-007`, allowing only a neutral UI placeholder widget in the Student Dashboard.
   - `ACU-BASE-003` remains strictly `BLOCKED BY CLIENT DECISION — DEC-013`. Theme components must use mock/sample metadata only.

2. **Authoritative Status of Client Decisions:**
   - All 16 decision briefs (`DEC-001` through `DEC-016`) in [`ACUITEY-OPEN-DECISIONS.md`](file:///C:/Users/Atul/Desktop/moodle/docs/implementation/ACUITEY-OPEN-DECISIONS.md) and [`ACUITEY-CLIENT-DECISION-PACK.md`](file:///C:/Users/Atul/Desktop/moodle/docs/implementation/ACUITEY-CLIENT-DECISION-PACK.md) remain strictly authoritative and open.
   - No client decision has been silently or prematurely selected by engineering.
   - All recommendations or suggestive tags (such as `(Recommended standard)`) have been eliminated from decision briefs to preserve 100% neutral decision support for the client.

3. **Payment Security Harmonization:**
   - All payment verification references across all specifications strictly enforce:
     > *"gateway-specific server-side authenticity/signature verification"*
   - Pre-selection of specific gateway algorithms or premature requirement of production credentials has been eliminated.

4. **Zero Production Code Commitment:**
   - Zero production Moodle code (`theme_acuitey`, `local_acuitey`, PHP files, database schema, payment plugins, or routing algorithms) has been created.
   - Moodle core files remain 100% untouched.

---

## 5. Immediate Next Actions

1. **Deliver Client Decision Pack:** Transmit [`ACUITEY-CLIENT-DECISION-PACK.md`](file:///C:/Users/Atul/Desktop/moodle/docs/implementation/ACUITEY-CLIENT-DECISION-PACK.md) to stakeholders with immediate focus on **DEC-013 (Curriculum Taxonomy)** to unblock `ACU-BASE-003`.
2. **Authorize Safe Wave 1:** Once stakeholder approval of this kickoff plan is confirmed, initiate **Wave 1 (12 Pure Foundation Tasks)**:
   - `ACU-ENV-001`, `ACU-ENV-002`, `ACU-ENV-003`, `ACU-ENV-004`
   - `ACU-BASE-001`, `ACU-BASE-002`, `ACU-BASE-004`
   - `ACU-THEME-001`, `ACU-THEME-002`, `ACU-THEME-003`, `ACU-THEME-004`, `ACU-THEME-005`
