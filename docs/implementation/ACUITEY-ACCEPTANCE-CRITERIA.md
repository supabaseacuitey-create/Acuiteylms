# Acuitey LMS — Measurable Acceptance Criteria Specification

**Target Platform:** Moodle LMS 5.2.3+  
**Source of Truth:** [`ACUITEY-DESIGN.md`](file:///C:/Users/Atul/Desktop/moodle/docs/design/ACUITEY-DESIGN.md) & [`FINAL-DESIGN-REVIEW.md`](file:///C:/Users/Atul/Desktop/moodle/docs/design/FINAL-DESIGN-REVIEW.md)  
**Document Classification:** Testable Quality Assurance & Behavioral Verification Criteria  
**Status:** Approved for Implementation Readiness & Automated QA Scenarios  

---

## 1. Homepage & Educational Marketing

### AC-HOME-001: Frontpage Presentation & Hero Fidelity
- **Given** an unauthenticated visitor navigates to the LMS root URL (`/`),
- **When** the page renders,
- **Then** the header displays the approved Acuitey brand mark (`AS`), title, and navigation links (`Curriculums`, `Student View`, `Faculty Workspace`),
- **And** the hero headline reads *"Academic Rigor & High-Impact Enterprise Learning"*,
- **And** zero unverified claims regarding *"accredited"*, *"regulated"*, or *"cryptographic certification"* are present,
- **And** four educational value indicators (*"Structured Learning Paths"*, *"Dedicated Faculty Mentorship"*, *"Interactive Live Sessions"*, *"Rigorous Academic Assessments"*) are displayed,
- **And** zero multi-stop gradients or rainbow cards are rendered.

### AC-HOME-002: Discipline Search & Category Filtering
- **Given** a prospective student searches on the homepage search panel,
- **When** the user inputs a search keyword or selects a discipline category,
- **Then** submitting the form redirects to the Course Catalogue (`/course/index.php`) with matching search query parameters populated,
- **And** the category chips display active states corresponding to the selected discipline.

---

## 2. Course Catalogue & Faceted Filtering

### AC-CAT-001: Faceted Filtering Execution
- **Given** a user is viewing the Course Catalogue,
- **When** the user toggles faceted filters (Academic Level, Enrolment Fee Schedule, Term Duration, Delivery Mode),
- **Then** the curriculum card grid dynamically filters to show only matching courses without full-page reloads,
- **And** the results count label updates accurately (e.g. *"Showing X Available Curriculums"*),
- **And** no internal Moodle technical codes (`core_payment`, `enrol_self`, `mod_lti`) are exposed in the filter options.

### AC-CAT-002: Conditional Faculty Supervision Row
- **Given** course catalogue cards are rendered,
- **When** a course has assigned faculty members,
- **Then** the card renders the faculty avatar and title,
- **When** a course is self-paced or has post-enrolment allocation,
- **Then** the card gracefully omits the individual instructor avatar and renders the appropriate structural label (*"Mentor allocated post-enrolment"* or *"Shared Academic Support"*),
- **And** zero layout breakage or empty whitespace holes occur.

### AC-CAT-003: Enrolment Fee Schedule Transparency
- **Given** course cards are displayed in the catalogue,
- **When** viewing the fee schedule spec on each card,
- **Then** free courses display *"Free / Open Access"*,
- **And** fee-based courses display neutral track tiers (*"Standard Track"* or *"Executive Track"*),
- **And** any displayed placeholder fees carry explicit `[SAMPLE DATA]` disclaimers.

---

## 3. Student Dashboard & Academic Progress

### AC-STU-001: Active Courses & Progress Hierarchy
- **Given** an authenticated student lands on the Student Dashboard (`/my/`),
- **When** the dashboard renders,
- **Then** Active Courses & Progress appears at the top of the main operational column,
- **And** each enrolled course card displays the course code, title, milestone progress bar, and completion percentage in tabular monospace font,
- **And** the Next Recommended Deliverable displays the activity title, due date, and an *"Inspect Rubric"* button linked directly to the Moodle assignment rubric.

### AC-STU-002: Student Live Classroom Launcher
- **Given** an enrolled student has an upcoming live session,
- **When** viewing the Live Session widget in the contextual sidebar,
- **Then** the widget displays the course title, session topic, and schedule,
- **And** the primary CTA reads *"Join Live Session"*,
- **When** the student clicks *"Join Live Session"*,
- **Then** an authenticated LTI 1.3 launch request is initiated to the Zoom tool, opening the session without prompting for meeting IDs or passwords.

### AC-STU-003: Earned Certificates Module
- **Given** a student has completed all course completion criteria,
- **When** viewing the Certificates widget,
- **Then** the earned certificate appears with status *"COMPLETED • CERTIFICATE AVAILABLE"*,
- **And** clicking *"View Certificate"* opens the generated certificate document,
- **And** zero unverified claims of *"cryptographic verification keys for employer audit"* are displayed.

### AC-STU-004: Empty Enrolment State
- **Given** a newly registered student with zero active course enrolments,
- **When** viewing the dashboard,
- **Then** an accessible empty state panel renders with an icon, title *"No Active Course Enrolments"*, description, and a direct CTA button *"Explore Course Catalogue"*.

---

## 4. Faculty Operations Workspace

### AC-FAC-001: Operational Workspace Layout & Hierarchy
- **Given** an authenticated faculty member accesses the Faculty Workspace,
- **When** the dashboard renders,
- **Then** the primary visual priority is given to the **Incoming Student Allocation Queue**,
- **And** the secondary column presents the **Current Load & Capacity** progress gauge and **Today's Live Session** launcher,
- **And** the bottom regions display **Assigned Students** and **Pending Assessments**,
- **And** the interface avoids generic SaaS KPI flooding.

### AC-FAC-002: Pending Assessments Grading Queue
- **Given** students have submitted assignments in courses taught by the faculty member,
- **When** viewing the Pending Assessments panel,
- **Then** pending items show student name, course, activity title, submission timestamp, and grading status,
- **And** clicking *"Grade Submission"* links directly to Moodle's native assignment grading interface (`mod_assign`).

---

## 5. Faculty Live Availability Control

### AC-AVAIL-001: Availability State Switching & Persistence
- **Given** an authenticated faculty member in the Faculty Workspace,
- **When** the faculty member clicks on an availability state (`Available`, `In Session`, `Unavailable`, `Offline`),
- **Then** the active segmented button updates instantly with an accessible visual state,
- **And** an asynchronous request persists the new state in `mdl_local_acuitey_faculty_avail`,
- **And** a clear descriptive message indicates whether the faculty member is eligible for new student allocations,
- **And** the status is conveyed via both explicit text and status dot (never color alone).

### AC-AVAIL-002: Availability Eligibility Gate
- **Given** a faculty member is marked as `Unavailable` or `Offline`,
- **When** the routing engine evaluates candidate supervisors for an incoming student request,
- **Then** the candidate selector automatically filters out that faculty member,
- **And** zero new allocation offers are presented to them while in an unavailable state.

---

## 6. Student Allocation Queue & Offer Lifecycle

### AC-QUEUE-001: Allocation Request Queue Presentation
- **Given** an eligible, available faculty member with capacity,
- **When** an incoming student supervision request is offered to them,
- **Then** the request appears prominently in their Incoming Student Allocation Queue with status *"OFFERED TO FACULTY"*,
- **And** the request displays student name, course code, consultation/milestone topic, elapsed time, subject match context, and workload feasibility,
- **And** no unverified algorithmic scores (e.g. *"93% Match Score"*) or SLA countdowns are exposed.

### AC-QUEUE-002: Empty Queue State
- **Given** a faculty member with zero pending incoming requests,
- **When** viewing the allocation queue region,
- **Then** an empty queue panel displays a clean icon and explanatory message: *"Your allocation queue is clear. New student requests will appear here when routed to you."*

---

## 7. Allocation Acceptance & Supervision Binding

### AC-ACCEPT-001: Allocation Acceptance Execution
- **Given** a pending allocation offer in a faculty member's queue,
- **When** the faculty member clicks *"Accept Allocation"*,
- **Then** an asynchronous request transitions the request state to `STATUS_ACCEPTED`,
- **And** an active record is created in `mdl_local_acuitey_assignment`,
- **And** the student is added to the faculty member's Assigned Students roster,
- **And** the request card is removed from the active queue with an accessible confirmation notice,
- **And** an immutable audit entry is logged in `mdl_local_acuitey_audit_log`.

---

## 8. Reassignment Request & Candidate Rotation

### AC-REASSIGN-001: Reassignment Request Execution
- **Given** an offered allocation request in a faculty member's queue,
- **When** the faculty member clicks *"Unable to Accept / Request Reassignment"*,
- **Then** an accessible reassignment modal opens requesting an operational reason (e.g. specialization mismatch, scheduling conflict),
- **When** confirmed,
- **Then** the request transitions to `STATUS_REASSIGN_REQUESTED`,
- **And** the request is removed from the declining faculty member's queue,
- **And** the routing engine dispatches the request to the next eligible candidate or escalates to Academic Operations per configured policy,
- **And** the declining faculty member's decision is permanently logged in the audit trail.

---

## 9. Supervisor Capacity Monitoring & Eligibility

### AC-CAP-001: Capacity Gauge Accuracy
- **Given** a faculty member with an active supervisee load,
- **When** viewing the Current Load & Capacity widget,
- **Then** the display accurately reflects the active count versus configured limit (e.g. `14 / 20 Allocated Students [SAMPLE DATA]`),
- **And** the progress track fill percentage accurately represents `(active_load / max_capacity) * 100`.

### AC-CAP-002: Capacity Eligibility Gating
- **Given** a faculty member whose active supervisee load equals or exceeds their configured maximum capacity,
- **When** the routing engine evaluates candidate supervisors for new requests,
- **Then** the candidate selector excludes the faculty member from automated routing offers (unless administrative overflow override is enabled),
- **And** the capacity copy notes that capacity is utilized by the allocation workflow.

---

## 10. Contextual Notifications & Messaging

### AC-NOTIF-001: Operational Notification Dispatch
- **Given** a student request is offered to a faculty member,
- **When** the offer is dispatched,
- **Then** a Moodle notification is created via `core_message` notifying the faculty member of a pending supervision offer,
- **And** the notification badge count updates in the top navigation bar.

### AC-NOTIF-002: Direct Messaging Access
- **Given** a faculty member viewing the Assigned Students table,
- **When** the faculty member clicks *"Message"* next to a student record,
- **Then** Moodle's native messaging drawer opens directly focused on the conversation thread with that student.

---

## 11. Enrolment Checkout & Payment Reconciliation

### AC-PAY-001: Gateway Order Creation
- **Given** a student selects a fee-based curriculum,
- **When** the student clicks *"Enrol Now"*,
- **Then** Moodle's `core_payment` modal opens presenting enabled gateways (Razorpay, PhonePe),
- **And** selecting a gateway initiates a server-side order creation call to the gateway API with the correct fee amount and currency (`INR`).

### AC-PAY-002: Server-Side Signature Verification & Idempotent Enrolment
- **Given** a student successfully authorizes payment at the gateway,
- **When** the gateway returns the transaction callback or webhook,
- **Then** the Moodle payment gateway driver performs gateway-specific server-side cryptographic signature verification,
- **And** verifies that the transaction ID has not been previously processed (idempotency check),
- **And** verifies the paid amount matches the Moodle order record,
- **And** invokes `enrol_fee::enrol_user()` to grant instant course access,
- **And** redirects the student to their dashboard displaying the new active enrolment.

### AC-PAY-003: Webhook Replay & Duplicate Rejection
- **Given** an already processed payment transaction,
- **When** a duplicate webhook callback is received,
- **Then** the payment handler detects the existing transaction reference,
- **And** returns an HTTP `200 OK` without creating duplicate enrolments or modifying audit logs.

---

## 12. Authenticated Live Video Session Launch

### AC-LTI-001: Seamless LTI 1.3 Advantage Launch
- **Given** an authenticated student or faculty member in a course with an upcoming live session,
- **When** the user clicks *"Join Live Session"* or *"Start Live Session"*,
- **Then** Moodle initiates an OIDC authentication handshake via `mod_lti`,
- **And** transmits the user's role (`Learner` or `Instructor`) and course context securely to Zoom,
- **And** launches the conference room directly without prompting for meeting passcodes or credentials.

---

## 13. Contextual Roles & Capability Enforcement

### AC-SEC-001: Student Data Privacy & Isolation
- **Given** an authenticated student,
- **When** navigating the LMS,
- **Then** the student can view only their own course progress, rubrics, and feedback,
- **And** cannot view other students' records or administrative allocation queues.

### AC-SEC-002: Faculty Roster Scoping
- **Given** an authenticated faculty member,
- **When** viewing Assigned Students,
- **Then** the table renders only students assigned to that faculty member's supervision,
- **And** global institutional student rosters remain completely inaccessible.

---

## 14. WCAG 2.1 Level AA Accessibility Standards

### AC-A11Y-001: Color Contrast & Typography
- **Given** any page in the LMS,
- **When** evaluated using automated WCAG AA contrast analyzers,
- **Then** all body copy exceeds `4.5:1` contrast against its background,
- **And** all headings and interactive triggers exceed `7.0:1` contrast,
- **And** all uppercase text elements enforce minimum `letter-spacing: 0.08em`.

### AC-A11Y-002: Keyboard Navigation & Focus Ring
- **Given** a keyboard-only user navigating with the `Tab` key,
- **When** focusing on any interactive element (buttons, links, form inputs, toggles),
- **Then** a visible, tactile focus ring (`outline: 2px solid #1D4ED8; outline-offset: 1px`) appears,
- **And** focus order follows logical visual layout without keyboard traps.

---

## 15. Application Security & Defense-in-Depth

### AC-SEC-003: CSRF & Session Security
- **Given** any state-modifying action (accepting allocation, toggling availability, submitting assignments),
- **When** the request is transmitted,
- **Then** Moodle verifies a valid session key (`sesskey()`),
- **And** rejects any request lacking a valid session token with an access denied error.

### AC-SEC-004: Strict Input Cleaning & SQL Parameterization
- **Given** all user inputs and query parameters,
- **When** processed by `local_acuitey` or `theme_acuitey`,
- **Then** parameters are sanitized via `clean_param()`,
- **And** all database operations utilize Moodle's parameterized `$DB` methods (`get_records_sql`, `insert_record`),
- **And** raw string concatenation into SQL queries is strictly prohibited.

---

## 16. High-Concurrency Performance & Page Latency

### AC-PERF-001: Dashboard Load Time
- **Given** a standard production environment (Ubuntu, Nginx, PHP-FPM, Redis MUC),
- **When** a user requests the Student or Faculty Dashboard under normal concurrency (up to 500 concurrent sessions),
- **Then** the Time to First Byte (TTFB) remains under `250ms`,
- **And** the total page rendering time completes in under `800ms`,
- **And** database queries per dashboard page view do not exceed 25 queries.

---

## 17. Mobile & Responsive Layout Fidelity

### AC-RESP-001: Mobile Touch Targets & No Horizontal Overflow
- **Given** any screen viewed on a mobile device (viewport width `390px`),
- **When** rendered,
- **Then** zero horizontal scrollbars or clipped text containers exist,
- **And** all interactive touch targets (buttons, segmented toggles, filter chips) provide a minimum practical hit area of `44px x 44px`,
- **And** multi-column tables gracefully adapt into stacked mobile cards.
