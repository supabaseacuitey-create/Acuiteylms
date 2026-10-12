# Acuitey LMS — Business & Workflow Decisions Required Before Implementation

**Target Platform:** Moodle LMS 5.2.3+  
**Source of Truth:** [`ACUITEY-DESIGN.md`](file:///C:/Users/Atul/Desktop/moodle/docs/design/ACUITEY-DESIGN.md) & [`FINAL-DESIGN-REVIEW.md`](file:///C:/Users/Atul/Desktop/moodle/docs/design/FINAL-DESIGN-REVIEW.md)  
**Document Classification:** Client Executive Decision Pack  
**Status:** Ready for Client Review & Sign-Off  

---

## Executive Summary for Acuitey Leadership

The user interface design system, interactive prototypes, and system architecture for the **Acuitey Solutions Enterprise LMS** have been completed and validated.

### Key Architectural Commitments:
1. **Moodle Core Integrity:** 100% untouched. Upgrades from Moodle 5.2 to future releases will execute seamlessly.
2. **Work Underway:** Over **70% of engineering tasks (40 out of 57 tasks)** are fully defined and can proceed immediately without waiting for business decisions.
3. **Targeted Approvals Needed:** Specific institutional business rules (e.g. course metadata, supervisor workloads, payment gateways) require client confirmation before their specific modules are programmed.

This document presents the **16 open business decisions** in non-technical language. You do not need to understand PHP, database schemas, or internal APIs. Each decision is categorized by urgency and includes practical options with a simple response form for email or meeting review.

---

## Urgency Classification Overview

```
┌────────────────────────────────────────────────────────────────────────┐
│ TIER A: REQUIRED NOW                                                   │
│ Affects initial course catalog setup (Phase 1).                        │
│ • DEC-013: Course Information & Filtering Taxonomy                     │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼────────────────────────────────────┐
│ TIER B: REQUIRED BEFORE ROUTING DEVELOPMENT                            │
│ Affects automated student-to-faculty routing and capacity (Phase 6).  │
│ • DEC-001: Supervisor Capacity Ceilings                                │
│ • DEC-002: Offer Response Time & Expiration                            │
│ • DEC-003: Reassignment Destination Pathway                           │
│ • DEC-004: Faculty Matching & Selection Order                          │
│ • DEC-005: Maximum Reassignment Limit                                  │
│ • DEC-006: Academic Operations Manual Overrides                        │
│ • DEC-014: Student Support & Mentoring Scope                           │
│ • DEC-015: Faculty Status During Live Sessions                         │
│ • DEC-016: Faculty Grading Queue Roster Scope                          │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼────────────────────────────────────┐
│ TIER C: REQUIRED BEFORE PAYMENT, ZOOM & PRODUCTION DOMAIN              │
│ Affects merchant accounts, Zoom, and DNS configuration.                │
│ • DEC-011: Active Payment Gateways (Razorpay / PhonePe)                │
│ • DEC-012: Merchant Sandbox Credentials & Technical Setup             │
│ • DEC-008: Zoom Account Tier & LTI Setup                               │
│ • DEC-009: Live Class Attendance Tracking Policy                       │
│ • DEC-010: Live Class Gradebook Policy                                 │
│ • DEC-017: LMS Production Subdomain (portal vs academy)                │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼────────────────────────────────────┐
│ TIER D: CAN BE CONFIRMED LATER (Phase 2 / Post-Launch Features)        │
│ Affects certificate generation technology.                             │
│ • DEC-007: Completion Certificate Subsystem                            │
└────────────────────────────────────────────────────────────────────────┘
```

---

## TIER A: REQUIRED NOW (Immediate Impact)

### DEC-013: Course Information & Curriculum Discovery Taxonomy
- **Question:** What information should every course display so learners can search, filter, and discover curriculums?
- **Context:** The prototype demonstrates three primary filters: Academic Discipline, Curricular Level, and Term Duration. Confirming this ensures courses are configured correctly in Moodle from day one.
- **Proposed Baseline Options:**
  - **Discipline / Category:** Cloud Systems Architecture, Distributed Software Engineering, Data Governance & AI Ethics, Systems Foundations.
  - **Academic Level:** Foundational, Postgraduate, Executive Leadership.
  - **Term Duration:** 6-Week Focused Term, 10-Week Modular Term, 14-Week Comprehensive, Self-Paced.
  - **Delivery Format:** Interactive Live Sessions, Self-Paced Guided Study.
  - **Fee Schedule:** Free / Open Access, Standard Fee Track, Executive Fee Track.
- **Client Choices:**
  - **Option A:** Approve the proposed categories and filter attributes as shown above.
  - **Option B:** Modify or add specific institutional disciplines, levels, or durations (please specify in comments).

```
Decision ID: DEC-013 (Curriculum Taxonomy)
Client Selection: [   ] Option A (Approved as proposed)   [   ] Option B (Modified taxonomy)
Comments: ____________________________________________________________________________________
```

---

## TIER B: REQUIRED BEFORE ROUTING DEVELOPMENT

*These decisions govern the automated student-to-faculty allocation engine (`local_acuitey`). They can be finalized while early theme and catalog development proceeds.*

### DEC-001: Supervisor Capacity Ceilings
- **Question:** How should the maximum number of assigned students be set for faculty members?
- **Options:**
  - **Option A (Fixed Institutional Limit):** The same maximum student capacity (e.g. 25 active students) applies to all faculty across the institution.
  - **Option B (Departmental Limits):** Different capacity limits configured per academic discipline (e.g. Engineering = 15 students; General Foundations = 35 students).
  - **Option C (Individual Faculty Profiles):** Academic administrators configure capacity individually per faculty member based on their contract terms and FTE.
- **Operational Impact:** Option C offers the highest flexibility for universities with mixed adjunct and full-time faculty; Option A is the simplest to administer.

```
Decision ID: DEC-001 (Supervisor Capacity)
Client Selection: [   ] Option A (Fixed Global)   [   ] Option B (By Department)   [   ] Option C (Individual Profile)
Comments: ____________________________________________________________________________________
```

---

### DEC-002: Allocation Offer Response Window
- **Question:** How long should a faculty member have to accept an incoming student allocation before the offer expires and routes to another instructor?
- **Options:**
  - **Option A (Fast Operational Window):** 2 to 4 working hours during business hours; automatically re-routes if unacknowledged.
  - **Option B (Standard Business Window):** 24 hours elapsed time before automatic re-routing.
  - **Option C (No Automatic Expiration):** The request stays in the instructor's queue until explicitly accepted or declined; alert sent to Academic Admin after 24 hours.

```
Decision ID: DEC-002 (Offer Expiration)
Client Selection: [   ] Option A (2–4 hours)   [   ] Option B (24 hours)   [   ] Option C (Manual / Admin Alert)
Comments: ____________________________________________________________________________________
```

---

### DEC-003: Reassignment Destination Pathway
- **Question:** When a faculty member clicks *"Unable to Accept / Request Reassignment"*, where should the request immediately go?
- **Options:**
  - **Option A (Automated Retry):** Automatically offer the student to the next eligible, available faculty member in the pool.
  - **Option B (Immediate Admin Review):** Send the request directly to an Academic Operations Coordinator for manual review and assignment.
  - **Option C (Hybrid Automated + Escalation):** Automatically try up to *N* eligible faculty candidates; escalate to Academic Admin only if all decline or threshold is reached.

```
Decision ID: DEC-003 (Reassignment Pathway)
Client Selection: [   ] Option A (Automated Retry)   [   ] Option B (Admin Review)   [   ] Option C (Hybrid Retry + Admin)
Comments: ____________________________________________________________________________________
```

---

### DEC-004: Faculty Candidate Matching Priority
- **Question:** When several faculty members are eligible and available, who should receive the offer first?
- **Options:**
  - **Option A (Lowest Workload First):** Offer to the qualified faculty member with the lowest current student count to balance workloads evenly.
  - **Option B (Sequential Round-Robin):** Cycle sequentially through faculty members so all receive equal opportunities.
  - **Option C (Specialization Hierarchy):** Prioritize instructors whose fine-grained specialty tags most closely match the student's project topic.

```
Decision ID: DEC-004 (Candidate Matching Priority)
Client Selection: [   ] Option A (Lowest Workload)   [   ] Option B (Round-Robin)   [   ] Option C (Specialization Match)
Comments: ____________________________________________________________________________________
```

---

### DEC-005: Maximum Reassignment Attempts
- **Question:** How many times can a student request be declined by faculty before an automatic escalation alert is sent to Academic Administration?
- **Options:**
  - **Option A:** Maximum 2 declines.
  - **Option B:** Maximum 3 declines.
  - **Option C:** Pool Exhaustion (escalate only when zero qualified faculty remain).

```
Decision ID: DEC-005 (Maximum Reassignment Limit)
Client Selection: [   ] Option A (2 declines)   [   ] Option B (3 declines)   [   ] Option C (Pool Exhaustion)
Comments: ____________________________________________________________________________________
```

---

### DEC-006: Academic Operations Manual Overrides
- **Question:** What actions should Academic Operations Coordinators be able to take when managing the allocation queue?
- **Options:**
  - **Option A (Force Assignment):** Directly assign a student to any faculty member, overriding live availability and capacity.
  - **Option B (Queue Reset):** Adjust the student's requested topic and return the request to the automated candidate pool.
  - **Option C (Both A & B):** Full administrative override suite.

```
Decision ID: DEC-006 (Admin Override Suite)
Client Selection: [   ] Option A (Force Assign)   [   ] Option B (Queue Reset)   [   ] Option C (Full Suite)
Comments: ____________________________________________________________________________________
```

---

### DEC-014: Student Mentoring & Consultation Scope
- **Question:** At what point in the academic journey does faculty allocation occur?
- **Options:**
  - **Option A (Term-Level Supervision):** A student is assigned one supervisor for the entire course upon enrolment.
  - **Option B (On-Demand Milestone Clinics):** Students submit consultation requests per deliverable/lab, routed dynamically to available faculty on-demand.
  - **Option C (Hybrid):** Primary supervisor assigned at enrolment; ad-hoc milestone consultations routed on-demand when the primary supervisor is unavailable.

```
Decision ID: DEC-014 (Mentoring Scope)
Client Selection: [   ] Option A (Term Supervision)   [   ] Option B (On-Demand Clinics)   [   ] Option C (Hybrid Model)
Comments: ____________________________________________________________________________________
```

---

### DEC-015: Faculty Availability During Scheduled Live Sessions
- **Question:** When a faculty member starts a live classroom session, should their live availability status automatically switch?
- **Options:**
  - **Option A (Automatic):** Clicking *"Start Live Session"* automatically switches faculty status to `In Session` (pausing new offers) and switches back when concluded.
  - **Option B (Manual Control):** Faculty members retain manual control over their availability toggles at all times.

```
Decision ID: DEC-015 (Live Session Status Switch)
Client Selection: [   ] Option A (Automatic Status Switch)   [   ] Option B (Manual Control)
Comments: ____________________________________________________________________________________
```

---

### DEC-016: Faculty Grading Queue Scope
- **Question:** What submissions should appear in an instructor's grading dashboard?
- **Options:**
  - **Option A (Assigned Supervisees Only):** Instructors grade only deliverables submitted by students assigned to their mentorship roster.
  - **Option B (Entire Course Cohort):** Instructors view and grade submissions from all enrolled students across their assigned course sections.

```
Decision ID: DEC-016 (Grading Queue Scope)
Client Selection: [   ] Option A (Assigned Supervisees Only)   [   ] Option B (Entire Course Cohort)
Comments: ____________________________________________________________________________________
```

---

## TIER C: REQUIRED BEFORE PAYMENT & LIVE CLASSROOMS

*These decisions govern merchant integrations and Zoom account capabilities (Phases 7 & 8).*

### DEC-011: Active Payment Gateways
- **Question:** Which commercial payment gateways must be enabled for course fee checkouts at initial go-live?
- **Options:**
  - **Option A:** Razorpay only (covers Indian UPI, NetBanking, and credit/debit cards).
  - **Option B:** PhonePe only.
  - **Option C:** Dual Gateway (both Razorpay and PhonePe enabled side-by-side).
  - **Option D:** Razorpay + Stripe (for domestic INR and international currency processing).

```
Decision ID: DEC-011 (Payment Gateways)
Client Selection: [   ] Option A (Razorpay)   [   ] Option B (PhonePe)   [   ] Option C (Dual Razorpay + PhonePe)   [   ] Option D (Razorpay + Stripe)
Comments: ____________________________________________________________________________________
```

---

### DEC-012: Merchant Sandbox Credentials & Technical Setup
- **Question:** When can technical sandbox API credentials and webhook access be provisioned for engineering integration?
- **Notes:**
  - Verification mandates: Moodle will execute **gateway-specific server-side authenticity and signature verification** to prevent payment tampering.
  - **Do NOT send credentials in this document.** Credentials will be requested via secure channel prior to Phase 7.
- **Client Confirmation:**
  - **Option A:** Merchant sandbox credentials are ready to be provided when Phase 7 begins.
  - **Option B:** We require assistance setting up merchant gateway developer accounts.

```
Decision ID: DEC-012 (Merchant Setup Readiness)
Client Selection: [   ] Option A (Credentials Ready for Phase 7)   [   ] Option B (Assistance Required)
Comments: ____________________________________________________________________________________
```

---

### DEC-008: Zoom Account Tier & LTI Setup
- **Question:** What Zoom account tier is provisioned for institutional live classrooms?
- **Context:** Acuitey connects to Zoom using Moodle's native LTI 1.3 Advantage module (`mod_lti`), which provides seamless single sign-on without meeting passwords.
- **Options:**
  - **Option A (Zoom for Education / Business):** Standard Zoom institutional account with Zoom LTI Pro Marketplace app support.
  - **Option B (API-Only Integration):** Server-to-server OAuth credentials.

```
Decision ID: DEC-008 (Zoom Account Tier)
Client Selection: [   ] Option A (Zoom Education / LTI Pro)   [   ] Option B (API-Only OAuth)
Comments: ____________________________________________________________________________________
```

---

### DEC-009: Live Class Attendance Synchronization
- **Question:** Should student participation in live Zoom classes automatically record attendance and course completion?
- **Important Note:** *Automated attendance synchronization is subject to institutional Zoom licensing, API account tier, and configuration capabilities.*
- **Options:**
  - **Option A (Manual Attendance / Participation):** Faculty manually records participation or grades milestone deliverables.
  - **Option B (Automated Zoom Webhook Attendance):** System automatically reconciles Zoom attendee logs with Moodle completion criteria (requires Zoom webhook support).

```
Decision ID: DEC-009 (Live Attendance Tracking)
Client Selection: [   ] Option A (Manual / Milestone-based)   [   ] Option B (Automated Zoom Sync)
Comments: ____________________________________________________________________________________
```

---

### DEC-010: Live Class Gradebook Policy
- **Question:** Should attending a live clinic automatically award points in the course gradebook?
- **Options:**
  - **Option A (Ungraded Activity):** Live clinics are structured as participatory milestone events without automatic gradebook impact.
  - **Option B (Graded Attendance):** Attending the live session automatically awards activity completion points in the Moodle gradebook.

```
Decision ID: DEC-010 (Live Session Grading)
Client Selection: [   ] Option A (Ungraded Milestone)   [   ] Option B (Graded Attendance)
Comments: ____________________________________________________________________________________
```

---

### DEC-017: Production LMS Subdomain Selection
- **Question:** Which web address (hostname) should be used for the production Acuitey LMS?
- **Context:** Acuitey leadership has mandated that the LMS must run natively on an Acuitey-branded secure subdomain linked from the primary corporate website (`www.acuiteysolutions.com`) via a "Portal Login" navigation button.
- **Options:**
  - **Option A:** `portal.acuiteysolutions.com` (Standard enterprise portal naming)
  - **Option B:** `academy.acuiteysolutions.com` (Academic / education brand naming)
- **Technical & Operational Impact:** Dictates DNS record setup, valid TLS certificates with modern TLS configuration, web server virtual host routing, proposed Cloudflare Edge rules, and callback URLs for Zoom and payment gateways.

```
Decision ID: DEC-017 (Production LMS Subdomain)
Client Selection: [   ] Option A (portal.acuiteysolutions.com)   [   ] Option B (academy.acuiteysolutions.com)
Comments: ____________________________________________________________________________________
```

---

## TIER D: CAN BE CONFIRMED LATER (Phase 2 / Post-Launch Features)

### DEC-007: Completion Certificate Subsystem
- **Question:** Which technical system should generate completion certificates when students finish a course?
- **Context:** The Student Dashboard currently renders a clean *"View Certificate"* button with sample data. Visual design is 100% decoupled from backend certificate technology.
- **Options:**
  - **Option A (Moodle Native Badges):** Core Moodle Open Badges with verifiable metadata (zero extra plugins).
  - **Option B (Moodle Certificate Plugin):** PDF certificate generation with unique QR verification codes (`mod_customcert`).
  - **Option C (External Credential Platform):** Third-party digital badge service (e.g. Credly or Accredible).
  - **Option D (Phase-2 Feature):** Defer automated certificate issuance until post-launch release.

```
Decision ID: DEC-007 (Certificate Technology)
Client Selection: [   ] Option A (Moodle Badges)   [   ] Option B (Moodle PDF Certs)   [   ] Option C (External Credential)   [   ] Option D (Phase-2 Deferral)
Comments: ____________________________________________________________________________________
```

---

## Summary Decision Response Sheet (For Email / Executive Sign-Off)

To approve, simply copy and paste this response block:

```text
ACUITEY LMS — CLIENT DECISION RESPONSE SUMMARY
Date: ________________________
Approver Name & Title: __________________________________________________

TIER A (REQUIRED NOW):
DEC-013 (Curriculum Taxonomy): [  ] Option A (Proposed)  [  ] Option B (Custom)

TIER B (ROUTING & CAPACITY):
DEC-001 (Capacity Model):     [  ] A (Global)    [  ] B (Department)  [  ] C (Individual)
DEC-002 (Offer Expiration):   [  ] A (2-4 hrs)   [  ] B (24 hrs)      [  ] C (Admin Alert)
DEC-003 (Reassignment):       [  ] A (Auto)      [  ] B (Admin)       [  ] C (Hybrid)
DEC-004 (Candidate Priority): [  ] A (Workload)  [  ] B (Round-Robin) [  ] C (Specialty)
DEC-005 (Max Declines):       [  ] A (2)         [  ] B (3)           [  ] C (Exhaustion)
DEC-006 (Admin Override):     [  ] A (Force)     [  ] B (Reset)       [  ] C (Full Suite)
DEC-014 (Mentoring Scope):    [  ] A (Term)      [  ] B (On-Demand)   [  ] C (Hybrid)
DEC-015 (Live Status Switch): [  ] A (Automatic) [  ] B (Manual)
DEC-016 (Grading Scope):      [  ] A (Supervisees) [  ] B (Entire Cohort)

TIER C (PAYMENTS, ZOOM & DOMAIN):
DEC-011 (Payment Gateways):   [  ] A (Razorpay)  [  ] B (PhonePe)     [  ] C (Dual)  [  ] D (+Stripe)
DEC-012 (Merchant Sandbox):   [  ] A (Ready)     [  ] B (Need Setup Help)
DEC-008 (Zoom Account):       [  ] A (LTI Pro)   [  ] B (API OAuth)
DEC-009 (Attendance Sync):    [  ] A (Manual)    [  ] B (Automated)
DEC-010 (Gradebook Sync):     [  ] A (Ungraded)  [  ] B (Graded)
DEC-017 (LMS Subdomain):      [  ] A (portal.acuiteysolutions.com)   [  ] B (academy.acuiteysolutions.com)

TIER D (CERTIFICATES):
DEC-007 (Certificate Tech):   [  ] A (Badges)    [  ] B (PDF Plugin)  [  ] C (External) [  ] D (Phase 2)
```
