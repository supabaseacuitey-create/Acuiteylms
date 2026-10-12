# Acuitey LMS — Client Open Decisions & Architectural Governance Log

**Target Platform:** Moodle LMS 5.2.3+  
**Source of Truth:** [`ACUITEY-DESIGN.md`](file:///C:/Users/Atul/Desktop/moodle/docs/design/ACUITEY-DESIGN.md) & [`FINAL-DESIGN-REVIEW.md`](file:///C:/Users/Atul/Desktop/moodle/docs/design/FINAL-DESIGN-REVIEW.md)  
**Document Classification:** Strategic Decision Briefs & Implementation Blockers  
**Status:** Active Governance Document — Requires Formal Client Confirmation  

---

## Executive Overview

To prevent building speculative, incorrect, or brittle business logic into the Acuitey platform, the design system and architecture have explicitly isolated all unconfirmed business rules into this **Open Decisions Log**.

Every decision brief outlines the question, available options with objective trade-offs, technical impact, blocking status, and the recommended implementation stage. **Antigravity and the engineering team will not choose on behalf of the client; explicit client sign-off is required.**

---

## Decision Matrix Summary

| Decision ID | Domain | Strategic Question | Blocking Status | Implementation Stage |
| :--- | :--- | :--- | :--- | :--- |
| **DEC-001** | Routing / Capacity | Supervisor Capacity Ceiling Definition | **BLOCKING (Phase 6)** | Phase 6 (`local_acuitey`) |
| **DEC-002** | Routing Engine | Allocation Offer Expiry & Timeout Duration | Non-blocking for UI; **BLOCKING (Phase 6)** | Phase 6 (`local_acuitey`) |
| **DEC-003** | Routing Engine | Reassignment Target & Escalation Pathway | **BLOCKING (Phase 6)** | Phase 6 (`local_acuitey`) |
| **DEC-004** | Routing Engine | Candidate Prioritization & Ordering Logic | Non-blocking for UI; **BLOCKING (Phase 6)** | Phase 6 (`local_acuitey`) |
| **DEC-005** | Routing Engine | Maximum Reassignment Threshold | Non-blocking for UI; **BLOCKING (Phase 6)** | Phase 6 (`local_acuitey`) |
| **DEC-006** | Operations | Academic Operations Manual Review Criteria | Non-blocking (Phase 6) | Phase 6 / Phase 9 |
| **DEC-007** | Pedagogy | Academic Certificate Generation Subsystem | Non-blocking (Phase 4); **BLOCKING (Phase 13)** | Phase 4 / Phase 11 |
| **DEC-008** | Infrastructure | Zoom Account Tier & LTI 1.3 Capabilities | Non-blocking for UI; **BLOCKING (Phase 8)** | Phase 8 (Zoom / LTI) |
| **DEC-009** | Telemetry | Live Session Attendance Synchronization | Non-blocking (Optional) | Phase 8 (Zoom / LTI) |
| **DEC-010** | Assessment | Live Session Gradebook Synchronization | Non-blocking (Optional) | Phase 8 (Zoom / LTI) |
| **DEC-011** | Commerce | Active Payment Gateway Selection | Non-blocking for UI; **BLOCKING (Phase 7)** | Phase 7 (Payments) |
| **DEC-012** | Security | Merchant Credentials & Webhook Endpoints | **BLOCKING (Phase 7)** | Phase 7 (Payments) |
| **DEC-013** | Curriculum | Course Custom Fields Taxonomy Formalization | Non-blocking for UI; **BLOCKING (Phase 1)** | Phase 1 (Moodle Base) |
| **DEC-014** | Pedagogy | Consultation & Mentoring Workflow Scope | Non-blocking for UI; **BLOCKING (Phase 6)** | Phase 6 (`local_acuitey`) |
| **DEC-015** | UX / Telemetry | Faculty Availability During Scheduled Live Sessions | Non-blocking (Phase 5/6) | Phase 5 / Phase 6 |
| **DEC-016** | Assessment | Faculty Grading Queue Roster Scope | Non-blocking (Phase 5) | Phase 5 (Faculty Workspace) |
| **DEC-017** | Infrastructure / Deployment | LMS Production Subdomain Selection | Non-blocking for design/local; **BLOCKING (Phase 12/13)** | Phase 12 / Phase 13 |

---

## Detailed Decision Briefs

### DEC-001: Supervisor Capacity Ceiling Definition
- **Context:** The Faculty Dashboard prototype demonstrates a capacity gauge showing active supervisee load against a maximum capacity (e.g. `14 / 20 Allocated Students [SAMPLE DATA]`). The business rule governing how capacity limits are established must be formalized.
- **Question:** How should supervisor capacity limits be defined and administered across the institution?
- **Available Options:**
  - **Option A (Global Ceiling):** A single institutional threshold (e.g., maximum 25 active students per faculty member) applied system-wide.
  - **Option B (Departmental / Category Ceiling):** Capacity ceilings configured per academic discipline or Moodle course category (e.g., Cloud Architecture = 15; Foundations = 35).
  - **Option C (Individual Faculty Profile Ceiling):** Configurable per individual faculty user profile by Academic Operations, accommodating varying faculty FTE and contract terms.
- **Technical & Architectural Impact:** Option A requires a single admin setting (`$CFG->local_acuitey_max_capacity`); Option B requires category metadata fields; Option C requires a custom table (`mdl_local_acuitey_faculty_cap`) and an admin management interface.
- **Blocking Status:** **BLOCKING for Phase 6 (`local_acuitey` data model).**
- **Recommended Stage:** Phase 6.

---

### DEC-002: Allocation Offer Expiry & Timeout Duration
- **Context:** When the routing engine identifies an eligible supervisor and offers a student request (`OFFERED TO FACULTY`), the offer cannot remain in an open state indefinitely if a faculty member is away.
- **Question:** What is the policy and time duration for unresponded allocation offers before the offer expires and routes to the next candidate?
- **Available Options:**
  - **Option A (Fixed Short Timeout):** e.g., 2 hours during operational working hours; automatically expires to next candidate.
  - **Option B (Fixed Standard Window):** e.g., 24 hours elapsed time before automatic expiration.
  - **Option C (No Automatic Timeout):** Offers remain until explicitly accepted or reassigned, with an admin alert after a threshold duration.
- **Technical & Architectural Impact:** Options A & B require a Moodle scheduled background task (`offer_expiry_cron.php`) running every 5–15 minutes inspecting `expiry_time`. Option C requires no automated transition task.
- **Blocking Status:** Non-blocking for prototype UI; **BLOCKING for Phase 6 routing task implementation.**
- **Recommended Stage:** Phase 6.

---

### DEC-003: Reassignment Target & Escalation Pathway
- **Context:** When a faculty member selects "Unable to Accept / Request Reassignment", the workflow must determine the subsequent destination of the request.
- **Question:** When an offered allocation is declined, where should the request immediately route?
- **Available Options:**
  - **Option A (Automated Pool Rotation):** Automatically evaluate the remaining candidate pool and immediately offer the request to the next highest-priority eligible faculty member.
  - **Option B (Immediate Academic Admin Escalation):** Move the request immediately to `STATUS_ESCALATED` for manual review and allocation by an Academic Operations Coordinator.
  - **Option C (Hybrid):** Automatically re-route up to *N* times (see DEC-005); escalate to Academic Admin only if all candidates decline or threshold is reached.
- **Technical & Architectural Impact:** Determines state transition flow in `allocation_service::request_reassignment()`. Option C provides the highest operational resilience.
- **Blocking Status:** **BLOCKING for Phase 6 routing state machine.**
- **Recommended Stage:** Phase 6.

---

### DEC-004: Candidate Prioritization & Ordering Logic
- **Context:** Multiple faculty members may be qualified, available, and have capacity for an incoming student request.
- **Question:** What deterministic ordering logic should govern which candidate receives the initial offer?
- **Available Options:**
  - **Option A (Least Utilized First):** Order candidate faculty by lowest current capacity utilization ratio (`active_load / max_capacity`) to distribute load evenly.
  - **Option B (Strict Round-Robin):** Cycle sequentially through qualified faculty members regardless of individual workload variance.
  - **Option C (Specialization Hierarchy):** Match based on fine-grained discipline tag weighting, falling back to utilization ratio.
- **Technical & Architectural Impact:** Dictates the sorting algorithm within `classes/service/candidate_selector.php`.
- **Blocking Status:** Non-blocking for UI; **BLOCKING for Phase 6 algorithm implementation.**
- **Recommended Stage:** Phase 6.

---

### DEC-005: Maximum Reassignment Threshold
- **Context:** A request that is repeatedly declined by faculty candidates could get stuck in an endless loop without safeguards.
- **Question:** How many reassignments or candidate declines are permitted before a request is automatically escalated for manual intervention?
- **Available Options:**
  - **Option A:** Maximum 2 reassignments.
  - **Option B:** Maximum 3 reassignments.
  - **Option C:** Pool Exhaustion (escalate only when zero qualified, available faculty remain).
- **Technical & Architectural Impact:** Evaluated in `allocation_service` via `$request->reassignment_count >= $limit`.
- **Blocking Status:** Non-blocking for UI; **BLOCKING for Phase 6 error handling.**
- **Recommended Stage:** Phase 6.

---

### DEC-006: Academic Operations Manual Review Criteria
- **Context:** When a request is escalated (`STATUS_ESCALATED`), Academic Operations Coordinators require tools to resolve it.
- **Question:** What intervention capabilities should Academic Operations Coordinators possess?
- **Available Options:**
  - **Option A (Direct Force Assignment):** Admin can assign any faculty member directly, bypassing live availability and capacity checks.
  - **Option B (Queue Reprioritization):** Admin modifies request metadata or discipline tags and returns the request to the automated candidate pool.
  - **Option C (Both A & B):** Comprehensive administrative override suite.
- **Technical & Architectural Impact:** Determines UI actions rendered in the proposed Academic Operations administrative queue.
- **Blocking Status:** Non-blocking for initial phase; required for Phase 6 admin controls.
- **Recommended Stage:** Phase 6 / Phase 9.

---

### DEC-007: Academic Certificate Generation Subsystem
- **Context:** The Student Dashboard prototype displays an "Earned Certificates" module. Factual claims of cryptographic verification keys were removed during the final review.
- **Question:** Which technical subsystem should generate and issue completion certificates?
- **Available Options:**
  - **Option A (Moodle Native Badges):** Standard Moodle Core Open Badges subsystem with Mozilla/1EdTech standard verification metadata.
  - **Option B (Moodle `mod_customcert` Plugin):** Dedicated community-standard PDF certificate generation plugin with unique verifiable QR code verification links.
  - **Option C (External Credentialing API):** Integration with an external digital credential provider (e.g. Credly or Accredible) triggered via Moodle completion webhooks.
- **Technical & Architectural Impact:** Option A requires zero additional plugins. Option B requires installing `mod_customcert`. Option C requires custom API integration in `local_acuitey`.
- **Blocking Status:** Non-blocking for prototype UI; **BLOCKING for production certification build (Phase 11/13).**
- **Recommended Stage:** Phase 4 / Phase 11.

---

### DEC-008: Zoom Account Tier & LTI 1.3 Feature Capabilities
- **Context:** Live sessions are designed to launch seamlessly via Moodle's native LTI module (`mod_lti`).
- **Question:** What Zoom account tier and licensing model is provisioned by Acuitey Solutions?
- **Available Options:**
  - **Option A (Zoom for Education / Business with LTI Pro App):** Full LTI 1.3 Advantage integration configured in Zoom App Marketplace.
  - **Option B (Standard Zoom API Integration):** Requires server-to-server OAuth credentials rather than LTI 1.3.
- **Technical & Architectural Impact:** Determines whether setup is 100% native Moodle `mod_lti` configuration (Option A) or requires custom API glue.
- **Blocking Status:** **BLOCKING for Phase 8 (Zoom / LTI Integration).**
- **Recommended Stage:** Phase 8.

---

### DEC-009: Live Session Attendance Synchronization
- **Context:** Factual claims of "automatic attendance logging" were removed from prototype user copy.
- **Question:** Should student participation in live Zoom sessions automatically mark course completion or log attendance?
- **Available Options:**
  - **Option A (Manual Attendance / Completion):** Faculty manually grades or verifies participation within Moodle activity rubrics.
  - **Option B (Automated Webhook Attendance Sync):** Zoom webhook listener receives meeting attendance records and marks attendance in Moodle `mod_attendance` or core completion.
- **Technical & Architectural Impact:** Option B requires an external webhook receiver script and Zoom meeting participant reconciliation logic.
- **Blocking Status:** Non-blocking (Optional enhancement).
- **Recommended Stage:** Phase 8.

---

### DEC-010: Live Session Gradebook Synchronization
- **Context:** LTI Assignment and Grade Services (AGS) allows LTI tools to write grades directly into Moodle's gradebook.
- **Question:** Should attendance or live clinic participation carry automated gradebook points?
- **Available Options:**
  - **Option A (Ungraded Activity):** Live clinics are structured as participatory milestones without automatic gradebook impact.
  - **Option B (Automated Grade Allocation):** Full attendance awards 100% activity grade via LTI AGS.
- **Technical & Architectural Impact:** Configuration within Moodle `mod_lti` activity settings.
- **Blocking Status:** Non-blocking.
- **Recommended Stage:** Phase 8.

---

### DEC-011: Active Payment Gateway Selection
- **Context:** The catalogue and enrolment architecture map to Moodle's `core_payment` subsystem.
- **Question:** Which commercial payment gateways must be enabled for production go-live?
- **Available Options:**
  - **Option A (Razorpay Only):** Fast deployment; covers Indian UPI, NetBanking, and credit/debit cards.
  - **Option B (PhonePe Only):** Direct PhonePe PG integration.
  - **Option C (Dual Razorpay + PhonePe):** Both gateways enabled concurrently within Moodle `core_payment`, giving students payment choice.
  - **Option D (Razorpay + Stripe):** Covers Indian domestic transactions (Razorpay) and international currencies (Stripe).
- **Technical & Architectural Impact:** Determines which payment gateway plugins (`payment/gateway/*`) must be developed and validated in Phase 7.
- **Blocking Status:** **BLOCKING for Phase 7 (Payments).**
- **Recommended Stage:** Phase 7.

---

### DEC-012: Merchant Account Credentials & Webhook Endpoints
- **Context:** Payment reconciliation requires secure API keys and webhook signing secrets.
- **Question:** Are merchant accounts and API credentials provisioned for sandbox/staging testing?
- **Available Options:**
  - **Option A:** Client provides sandbox API credentials for selected gateways immediately.
  - **Option B:** Development proceeds against simulated gateway mock drivers until staging keys are provisioned.
- **Technical & Architectural Impact:** Option B allows theme and routing development to proceed unhindered, deferring live gateway reconciliation testing to Phase 7.
- **Blocking Status:** **BLOCKING for live transaction testing in Phase 7.**
- **Recommended Stage:** Phase 7.

---

### DEC-013: Moodle Course Custom Fields Taxonomy Formalization
- **Context:** Catalogue faceted filtering and metadata cards rely on Moodle's Course Custom Fields API (`core_customfield`).
- **Question:** Are the proposed custom fields approved as the definitive institutional taxonomy?
  - `discipline_category` (Dropdown: Cloud Architecture, Distributed Systems, Data Governance, Systems Foundations)
  - `academic_level` (Dropdown: Foundational, Postgraduate, Executive Leadership)
  - `term_duration` (Text: 6 Weeks, 10 Weeks, 14 Weeks, Self-Paced)
- **Available Options:**
  - **Option A (Approve Proposed Taxonomy):** Adopt the three proposed fields as defined.
  - **Option B (Refine Taxonomy):** Client provides updated field lists, categories, or additional metadata attributes.
- **Technical & Architectural Impact:** Configured in Moodle Site Administration (`core_customfield`) during Phase 1.
- **Blocking Status:** **BLOCKING for Phase 1 base configuration.**
- **Recommended Stage:** Phase 1.

---

### DEC-014: Consultation & Mentoring Workflow Scope
- **Context:** The student support panel in `student-dashboard.html` models four distinct mentoring states: Assigned Supervisor, Mentor Allocated Post-Enrolment, Shared Faculty Pool, and Self-Paced.
- **Question:** Does student-to-faculty allocation occur once at initial course enrolment, or are separate ad-hoc consultations routed per milestone/lab?
- **Available Options:**
  - **Option A (Enrolment-Level Supervision):** A student is assigned one supervisor for the entire course term.
  - **Option B (Milestone-Level Consultation Routing):** Students submit consultation requests per deliverable or lab, which are dynamically routed to available faculty on-demand.
  - **Option C (Hybrid):** Primary supervisor assigned at enrolment; ad-hoc clinic consultations routed on-demand when primary is unavailable.
- **Technical & Architectural Impact:** Fundamental to the trigger architecture in `local_acuitey/classes/event/`.
- **Blocking Status:** **BLOCKING for Phase 6 routing triggers.**
- **Recommended Stage:** Phase 6.

---

### DEC-015: Faculty Live Availability Behavior During Scheduled Live Sessions
- **Context:** When a faculty member launches a live session from their workspace, their availability state affects incoming request routing.
- **Question:** Should starting a live session automatically toggle faculty availability to `In Session`?
- **Available Options:**
  - **Option A (Automatic State Switch):** Clicking "Start Live Session" calls `availability_manager::set_status($USER->id, 'in_session')`; toggles back to `available` upon session end.
  - **Option B (Manual Toggle Only):** Faculty member retains manual control over their operational availability state at all times.
- **Technical & Architectural Impact:** Option A requires an event observer listening to `\mod_lti\event\course_module_viewed` or launch callback.
- **Blocking Status:** Non-blocking.
- **Recommended Stage:** Phase 5 / Phase 6.

---

### DEC-016: Faculty Grading Queue Roster Scope
- **Context:** The Faculty Dashboard displays a "Pending Assessments" grading queue.
- **Question:** Should the grading queue display submissions exclusively from students assigned to that supervisor, or across the entire enrolled course cohort?
- **Available Options:**
  - **Option A (Assigned Supervisees Only):** Filtered strictly by Moodle group membership representing assigned students.
  - **Option B (Course-Wide Cohort):** Displays all pending submissions across enrolled courses where the faculty has `mod/assign:grade` capability.
- **Technical & Architectural Impact:** Governs whether grading queries join on `mdl_local_acuitey_assignment` groups or query standard Moodle enrolment rosters.
- **Blocking Status:** Non-blocking.
- **Recommended Stage:** Phase 5.

---

### DEC-017: LMS Production Subdomain Selection
- **Context:** Acuitey leadership has mandated that the production Moodle LMS must be hosted natively on an Acuitey branded secure subdomain linked from the primary corporate website (`www.acuiteysolutions.com`) via a "Portal Login" navigation button.
- **Question:** Which canonical hostname should be used for the production LMS?
- **Available Options:**
  - **Option A:** `portal.acuiteysolutions.com`
  - **Option B:** `academy.acuiteysolutions.com`
- **Technical & Architectural Impact:**
  - DNS A/AAAA or CNAME record binding in Acuitey's DNS zone
  - TLS certificate generation & renewal
  - Moodle canonical URL configuration (`$CFG->wwwroot`)
  - Web server virtual host routing (`server_name` in Nginx)
  - Proposed Cloudflare Edge proxy & WAF configuration
  - Production uptime & health check monitoring endpoints
  - User notification & transactional email link generation
  - External OAuth / LTI 1.3 / Zoom launch & redirect URIs
  - Commercial payment gateway webhook / return callbacks (Razorpay, PhonePe)
- **Blocking Status:** Non-blocking for UI design and local development; **BLOCKING BEFORE INFRASTRUCTURE PRODUCTION CONFIGURATION (Phases 12 & 13)**.
- **Recommended Stage:** Phase 12 (Deployment & Ops).
