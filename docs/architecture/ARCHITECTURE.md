# Acuitey Solutions LMS — Initial System Design & Architecture Specification

**Project:** Acuitey Solutions Enterprise Learning Management System  
**Base Platform:** Moodle LMS 5.2.3+ (Build: 20260916, Branch 502)  
**Deliverable Version:** 1.0.0 (Production Architecture Review)  
**Date:** September 2026  
**Document Classification:** Enterprise Architecture Specification  

---

## 1. Executive Overview

Acuitey Solutions is establishing a next-generation online higher education and corporate upskilling LMS. Built upon the battle-tested, open, and globally compliant foundation of **Moodle LMS 5.2.3+**, the Acuitey platform delivers high-concurrency course delivery, rigorous assessment management, automated payment reconciliations, and secure live web conferencing.

The defining strategic innovation of the Acuitey LMS is its proprietary **Automated "Ola/Uber-Style" Student-to-Faculty Dynamic Routing Engine**. Rather than relying on static, manual teacher-to-student course assignments, Acuitey dynamically routes student interactions, live mentoring requests, and project evaluations to qualified, available, and capacity-balanced faculty members in real time.

This document details the architectural blueprint, security perimeter, extension strategy, data topology, and operational design that together ensure enterprise-grade stability, horizontal scalability, and seamless upgradeability of the underlying Moodle core.

---

## 2. Architecture Principles

The architecture adheres to four non-negotiable architectural mandates:

1. **Moodle Core Remains 100% Untouched and Directly Upgradeable:**
   No core PHP files within the Moodle distribution (`/lib`, `/course`, `/user`, `/enrol`, `/admin`, etc.) shall ever be modified, patched, or overridden. Upgrades from Moodle 5.2 to future security and major releases must execute seamlessly via standard Git tracking or package replacement without merge conflicts.

2. **Strict Encapsulation in Supported Moodle Plugin Subsystems:**
   All proprietary Acuitey functionality resides exclusively within Moodle's supported plugin architecture:
   - Primary Business Logic: `local/acuitey/` (`local_acuitey`)
   - Payment Gateways: `payment/gateway/razorpay/` and `payment/gateway/phonepe/`
   - Custom Theme & UI: `theme/acuitey/`
   - Live Conferencing: Standard LTI 1.3 Advantage integration (`mod_lti`)

3. **Zero Unnecessary Third-Party Plugins:**
   To prevent dependency debt, performance degradation, and security vulnerabilities, third-party community plugins are strictly restricted. Custom capabilities are built natively within `local_acuitey` utilizing standard Moodle core APIs.

4. **Event-Driven, Asynchronous & Stateless Scalability:**
   Heavy computation—such as faculty scoring, metrics aggregation, scheduled retries, and transactional email dispatches—is decoupled from synchronous HTTP requests using Moodle’s unified Event-Observer subsystem (`db/events.php`) and background task runner (`\core\task\adhoc_task` and `\core\task\scheduled_task`).

---

## 3. User Model & Contextual Role Hierarchy

Moodle operates on an inheritance-based, contextual role-based access control (RBAC) model. Permissions are evaluated across strict hierarchical scopes: `System Context` $\rightarrow$ `Course Category Context` $\rightarrow$ `Course Context` $\rightarrow$ `Activity/Module Context`.

| Role | Moodle Context Level | Primary Capabilities & Governance |
| :--- | :--- | :--- |
| **Student** | Course & Activity | Access assigned course materials, submit assignments, participate in forums, launch authenticated Zoom sessions, view personal grades and certificates. Strictly isolated from other students' records and administrative controls. |
| **Faculty** | Course & Activity | Grade submissions, view allocated student rosters, host live Zoom sessions, update assignment rubrics, provide feedback. Capabilities are dynamically assigned per student allocation. |
| **Academic Administrator** | Category & Course | Curate courses, manage course categories, inspect curriculum metrics, manage faculty profiles, supervise routing queues, manually reassign students when exceptions occur. |
| **Finance Administrator** | System & Payment Account | Configure Razorpay/PhonePe payment accounts (`core_payment`), inspect fee collection logs, reconcile transaction audits, issue refunds, view revenue reporting. No access to pedagogical data. |
| **Super Administrator** | System (`context_system`) | Full site administration, server health monitoring, security configurations, database/MUC caching rules, cron scheduling, and core version upgrades. |

---

## 4. End-to-End Student Journey

The student user journey is engineered for friction-free onboarding, instantaneous course access, and structured academic progression:

1. **Discovery & Registration:** Public visitors explore the course catalogue. Self-registration is authenticated via email verification or federated identity.
2. **Course Selection & Pricing Decision:** Students select a desired curriculum. The system inspects course fee requirements:
   - **Free Course (₹0):** Handled immediately by `enrol_self`. The student is enrolled instantly.
   - **Paid Course (₹>0):** Routed to Moodle's `core_payment` gateway abstraction, selecting Razorpay or PhonePe.
3. **Server-Side Verified Payment:** Upon successful UPI/NetBanking/Card payment, the gateway webhook executes server-side gateway-specific signature and payment-status verification and invokes `enrol_fee::enrol_user()`.
4. **Instant Dashboard Access:** The student lands on their personalized dashboard (`/my/`), showing active enrolments, upcoming milestones, and course progress bars.
5. **Dynamic Faculty Allocation:** Enrolment triggers the Acuitey Routing Engine, allocating the student to an optimal faculty mentor.
6. **Live Interactive Learning:** Students launch Zoom classes directly inside Moodle via authenticated LTI 1.3 Advantage handshakes with zero password entry.
7. **Assessments & Progress Tracking:** Students complete interactive quizzes, submit project deliverables, and receive faculty feedback.
8. **Automated Certification:** Upon meeting course completion criteria, Moodle's completion engine automatically issues a cryptographically verifiable PDF certificate.

---

## 5. Automated "Ola/Uber-Style" Faculty Routing Engine

### 5.1 Business Workflow
Acuitey’s automated routing algorithm balances educational quality, faculty specialization, and instructor workload.

```
Student Interaction Triggered
           │
           ▼
Moodle Event Emitted (\local_acuitey\event\routing_requested)
           │
           ▼
\local_acuitey\observer\routing_observer::handle_request()
           │
           ▼
\local_acuitey\service\faculty_matcher::find_candidates()
           │
   ┌───────┴──────────────────────────────┐
   │ Multi-Criteria Filter & Scoring:     │
   │ 1. Subject & Specialization Match    │
   │ 2. Role & Context Capability Check   │
   │ 3. Real-Time Online/Shift Status     │
   │ 4. Workload: Active < Max Students   │
   │ 5. Performance & SLA Rating Weight   │
   └───────┬──────────────────────────────┘
           │
   ┌───────┴──────────────────────────────┐
   │ Are eligible faculty available?      │
   └───────┬──────────────────────────────┘
           ├──────────────────────────────┐
          YES                             NO
           │                              │
           ▼                              ▼
Rank & Pick Highest Scorer      Add to Pending Queue Table
           │                    (mdl_local_acuitey_requests)
           ▼                              │
Create Course Enrolment / Group           ▼
           │                    Ad-hoc Task Scheduled Retry
           ▼                    & Admin Alert if SLA Exceeded
Send Notifications via Moodle
           │
           ▼
Write Immutable Audit Log Entry
```

### 5.2 Multi-Criteria Ranking Algorithm
Eligible faculty are scored using a weighted multi-factor formula:
$$\text{Score} = (W_{\text{spec}} \times S_{\text{spec}}) + (W_{\text{load}} \times S_{\text{load}}) + (W_{\text{perf}} \times S_{\text{perf}}) + (W_{\text{tz}} \times S_{\text{tz}})$$

Where:
- **$S_{\text{spec}}$ (Specialization Match):** Direct match in faculty skill taxonomy.
- **$S_{\text{load}}$ (Workload Availability):** $\frac{\text{Max Capacity} - \text{Current Active Allocations}}{\text{Max Capacity}}$. Faculty with lower loads receive higher preference.
- **$S_{\text{perf}}$ (Performance & Feedback Score):** Historical student satisfaction rating (1.0 to 5.0 scale) and SLA completion compliance.
- **$S_{\text{tz}}$ (Time Zone & Shift Proximity):** Faculty currently logged in or scheduled within the student’s active learning window.

### 5.3 Fallback & Exception Handling
If no faculty member meets eligibility criteria (e.g., during off-hours or unexpected demand surges):
1. **Pending Allocation Queue:** The request is committed to `mdl_local_acuitey_requests` with status `STATUS_PENDING`.
2. **Automated Background Retries:** A dedicated ad-hoc/scheduled task (`\local_acuitey\task\retry_pending_routing`) polls the pending queue based on configured retry schedules.
3. **Administrative SLA Escalation:** If a request remains unassigned beyond a configured SLA threshold, the system escalates the ticket to the Academic Administrator's console for manual assignment and sends priority push/email notifications.
4. **Audit History:** Every attempt, score calculation, and manual intervention is logged in `mdl_local_acuitey_routing_log`.

---

## 6. Moodle Extension Architecture (`local_acuitey`)

The Acuitey subsystem is isolated inside `local/acuitey/`, following Moodle's strict component structure:

```
local/acuitey/
├── version.php               # Plugin metadata, version (2026092300), requires Moodle 5.2+
├── db/
│   ├── install.xml           # XMLDB table schemas (5 custom tables)
│   ├── upgrade.php           # Safe schema upgrade migrations
│   ├── events.php            # Observers for core and custom events
│   ├── tasks.php             # Scheduled and ad-hoc task definitions
│   ├── messages.php          # Message provider configurations for notifications
│   ├── access.php           # Custom capabilities (local/acuitey:manage, local/acuitey:view)
│   └── services.php         # External REST web services definitions
├── classes/
│   ├── service/
│   │   ├── routing_service.php      # Main orchestration coordinator
│   │   ├── faculty_matcher.php      # Scoring and ranking algorithms
│   │   ├── availability_service.php # Redis + DB real-time shift checking
│   │   ├── workload_service.php     # Concurrency and active student counters
│   │   └── metrics_service.php      # SLA and reporting calculations
│   ├── task/
│   │   ├── retry_pending_routing.php # Scheduled retry task
│   │   └── process_allocation.php   # Asynchronous ad-hoc routing task
│   ├── event/
│   │   ├── routing_requested.php    # Extends \core\event\base
│   │   ├── faculty_assigned.php     # Extends \core\event\base
│   │   └── routing_failed.php       # Extends \core\event\base
│   └── observer/
│       └── routing_observer.php     # Listens to course enrolment & support triggers
└── lang/en/local_acuitey.php # Localized UI strings
```

---

## 7. Data Architecture & Custom Database Schemas

All Acuitey database tables are managed via Moodle’s XMLDB layer, prefixed with `mdl_local_acuitey_`:

### 1. `mdl_local_acuitey_requests`
Tracks every student routing interaction from initiation to completion.
- `id` (BIGINT, Primary Key)
- `userid` (BIGINT, Foreign Key to `mdl_user`)
- `courseid` (BIGINT, Foreign Key to `mdl_course`)
- `request_type` (VARCHAR(50): live_mentoring, evaluation, query)
- `status` (VARCHAR(30): pending, assigned, completed, escalated, cancelled)
- `allocated_faculty_id` (BIGINT, Nullable, Foreign Key to `mdl_user`)
- `priority` (INT, default 1)
- `sla_deadline` (BIGINT, Unix timestamp)
- `timecreated`, `timemodified`

### 2. `mdl_local_acuitey_faculty_prof`
Maintains instructor profile attributes, capacity limits, and specialization taxonomies.
- `id` (BIGINT, Primary Key)
- `faculty_id` (BIGINT, Foreign Key to `mdl_user`)
- `specializations` (TEXT, JSON array of subject codes)
- `max_workload` (INT, maximum active concurrent students)
- `current_workload` (INT, real-time active counter)
- `performance_score` (DECIMAL(4,2), e.g., 4.85)
- `is_accepting_students` (TINYINT(1), manual or automatic toggle)
- `shift_start`, `shift_end` (VARCHAR(10))

### 3. `mdl_local_acuitey_assignments`
Records active student-to-faculty relationships and linked Zoom sessions.
- `id` (BIGINT, Primary Key)
- `request_id` (BIGINT, Foreign Key to `mdl_local_acuitey_requests`)
- `student_id` (BIGINT, Foreign Key to `mdl_user`)
- `faculty_id` (BIGINT, Foreign Key to `mdl_user`)
- `course_id` (BIGINT, Foreign Key to `mdl_course`)
- `group_id` (BIGINT, Foreign Key to `mdl_groups`)
- `zoom_meeting_id` (VARCHAR(100), Nullable)
- `status` (VARCHAR(30): active, completed, terminated)
- `timeassigned`, `timecompleted`

### 4. `mdl_local_acuitey_routing_log`
Immutable historical record of every routing calculation for auditability and algorithmic tuning.
- `id` (BIGINT, Primary Key)
- `request_id` (BIGINT)
- `candidate_pool_size` (INT)
- `candidates_evaluated` (TEXT, JSON containing candidate IDs and sub-scores)
- `chosen_faculty_id` (BIGINT)
- `execution_time_ms` (INT)
- `timecreated` (BIGINT)

### 5. `mdl_local_acuitey_config`
System-wide configuration parameters for routing weights and thresholds.
- `id` (BIGINT, Primary Key)
- `config_key` (VARCHAR(100), Unique)
- `config_value` (TEXT)
- `timemodified` (BIGINT)

---

## 8. Payment Gateway Integration Architecture

### 8.1 Unified Moodle `core_payment` Abstraction
Moodle 5.2 provides a centralized payment subsystem (`core_payment`). When a course requires payment, Moodle's `enrol_fee` plugin queries `core_payment` to retrieve active payment accounts and supported gateways.

```
Student Clicks Enrol
        │
        ▼
Moodle Core (enrol_fee)
        │
        ▼
core_payment::get_payment_gateways()
        │
   ┌────┴────────────────────────┐
   ▼                             ▼
pg_razorpay                  pg_phonepe
(Server-Side API)            (Server-Side API)
   │                             │
   └─────────────┬───────────────┘
                 │
                 ▼
Generates Order ID & Cryptographic Nonce
                 │
                 ▼
Student Completes UPI / Card Checkout
                 │
                 ▼
Direct Server Webhook from Payment Gateway
                 │
                 ▼
Server-Side Gateway-Specific Verification
(Signature, Payment-Status, Amount, Idempotency)
                 │
         ┌───────┴───────┐
       VALID          INVALID
         │               │
         ▼               ▼
enrol_fee::enrol_user()  Log Security Alert & Drop
Course Access Granted
```

### 8.2 Strict Server-Side Security Isolation
1. **Secret Keys Held Exclusively on Server:** Razorpay Key Secret and PhonePe Salt/Merchant Keys reside in protected Moodle database records (`mdl_config_plugins`) on the Hostinger KVM. They are never sent to the student client browser.
2. **Server-Side Gateway-Specific Verification:**
   - **Signature/Authenticity Validation:** Verifies the authenticity of incoming webhook/callback payloads using gateway-specific verification algorithms.
   - **Payment-Status Verification:** Confirms captured status directly with the gateway before granting access.
   - **Amount & Order Validation:** Validates currency and fee amounts against course records in `enrol_fee`.
   - **Duplicate / Idempotency Protection:** Incoming webhooks verify `mdl_payments` before enrolment to guarantee that duplicate webhooks or network retries never cause double-allocation.

---

## 9. Zoom LTI 1.3 Advantage Integration

Live web conferencing is integrated via **LTI 1.3 Advantage (IMS Global Security Framework)** utilizing Moodle's core `mod_lti` module and Zoom LTI Pro.

### 9.1 OpenID Connect (OIDC) Handshake Sequence
1. **Initiation:** An authenticated student or instructor clicks the Zoom class activity in their Moodle course.
2. **OIDC Third-Party Login:** Moodle (`mod_lti`) initiates an OIDC authorization request to Zoom LTI Pro containing client credentials, redirect URI, and cryptographic state.
3. **Authentication Response:** Zoom redirects the browser back to Moodle’s platform authentication endpoint.
4. **JWT Assembly & RSA Signing:** Moodle builds a signed JSON Web Token (JWT) containing IMS standard claims:
   - `sub`: Pseudonymized Moodle user identifier
   - `https://purl.imsglobal.org/spec/lti/claim/roles`: User’s contextual role (Instructor vs Learner)
   - `https://purl.imsglobal.org/spec/lti/claim/context`: Course ID and category metadata
   - The token is signed using Moodle's private RSA key from its internal JWKS keystore.
5. **Form POST Launch:** The browser automatically POSTs the signed `id_token` to Zoom Cloud.
6. **Token Verification & Room Assignment:** Zoom validates the token against Moodle’s public JWKS endpoint, sets instructor privileges (host vs participant), and establishes an encrypted WebRTC video conference.

### 9.2 Security & Privacy Guarantees
- **No Password Exposure:** Users never see or manage meeting passwords or Zoom credentials.
- **Zoombombing Prevention:** Only users with valid, verified enrolments in the Moodle course context can generate a valid LTI launch token.
- **Grade & Attendance Sync:** Grade and attendance synchronization may be enabled where supported by the selected Zoom LTI configuration and Acuitey’s Zoom account/licensing using LTI Assignment and Grade Services (AGS).

---

## 10. Production Infrastructure & Deployment Topology
The Acuitey LMS infrastructure is proposed on an enterprise-grade **Hostinger KVM VPS** (recommended: Ubuntu 24.04 LTS), protected behind **Proposed Cloudflare Edge**, and backed by a proposed managed **PostgreSQL / Supabase** database tier (final configuration to be confirmed).

```
                      INTERNET / CLIENTS
                              │
                              ▼
           Proposed Cloudflare WAF / DDoS & CDN Edge (TLS 1.3)
                              │
               [Strict Origin Connection]
                              │
                              ▼
        PROPOSED HOSTINGER KVM VPS (Ubuntu LTS Recommended)
   ┌─────────────────────────────────────────────────────┐
   │ UFW Firewall (Port 443 restricted to Cloudflare IPs) │
   │                                                     │
   │  Nginx 1.26+ (Reverse Proxy & HTTP/2 Static Cache)   │
   │      │                                              │
   │      ▼                                              │
   │  PHP-FPM 8.2 / 8.3 (OPcache + JIT Recommended)      │
   │      │                                              │
   │      ├── Moodle Core 5.2.3+ (/var/www/html/moodle)  │
   │      └── Acuitey Extension (/local/acuitey)        │
   │                                                     │
   │  Redis (MUC Cache - Deployment to be finalized)     │
   │  CLI Cron Worker (cron.php & adhoc_task.php)        │
   │  Moodledata (/var/moodledata - Outside Webroot)     │
   └──────────────────────────┬──────────────────────────┘
                              │
            [Proposed TLS Connection]
                              │
                              ▼
      Proposed PostgreSQL Database Tier (Supabase / Managed)
      (PgBouncer Connection Pooling • Multi-AZ Backups Proposed)
```

### 10.1 Key Infrastructure Specifications (Proposed / Subject to Final Configuration)
- **Compute Tier (Proposed):** Hostinger KVM 4 or KVM 8 (4–8 vCPUs, 16–32 GB RAM, High-Speed NVMe Storage).
- **Web Server (Recommended):** Nginx 1.26+ configured with `X-Accel-Redirect` for secure, offloaded file serving directly from `/var/moodledata`.
- **PHP Runtime (Recommended):** PHP 8.2 or 8.3 FPM with OPcache JIT and optimized worker pool sizing (`pm = dynamic`).
- **Caching Layer (Configuration to be Finalized):** Redis deployed as Moodle’s Universal Cache (MUC) store for session state, course definitions, and real-time faculty availability flags.
- **Database Layer (Configuration to be Confirmed):** Managed PostgreSQL (or Supabase) configured with connection pooling to handle high-concurrency connection spikes without resource exhaustion.

---

## 11. Monitoring, Disaster Recovery & Operational Reliability

### 11.1 Proposed Real-Time Observability
- **System Metrics (Proposed):** Prometheus Node Exporter tracking CPU utilization, RAM pressure, disk I/O, and network bandwidth, visualized through Grafana dashboards (subject to final monitoring stack selection).
- **PHP-FPM & Nginx Telemetry:** Monitoring of active worker processes, request latency, and HTTP error ratios.
- **Database Telemetry:** Monitoring connection pool utilization and query latency in PostgreSQL.

### 11.2 Disaster Recovery & Backup Plan (Proposed)
- **Database Backups:** Continuous Point-In-Time Recovery (PITR) supplemented by automated daily full database dumps.
- **Moodledata Asset Backups:** Incremental backups of `/var/moodledata` synchronized to an encrypted, off-site cloud storage bucket (e.g. S3 / Cloudflare R2).
- **Hostinger Snapshots:** Automated weekly image snapshots before scheduled maintenance windows.
- **RTO / RPO Targets:** Recovery Time Objective (RTO) $< 1$ hour; Recovery Point Objective (RPO) $< 15$ minutes (targets subject to final infrastructure agreement).

---

## 12. Native Moodle vs. Acuitey Custom Components

To provide executive clarity, the following table delineates native Moodle infrastructure from custom Acuitey engineering:

| Functional Area | Native Moodle 5.2 | Acuitey Custom Extension | Architecture Designation |
| :--- | :---: | :---: | :--- |
| **User Authentication** | Core `auth_*` plugins | Custom profile attributes | **Native Moodle** |
| **Role & Permission RBAC** | Core Context RBAC | Custom capabilities | **Native Moodle** |
| **Course Catalogue** | Core Course Category Tree | Custom UI Layout & Theme | **Hybrid** |
| **Enrolment Handshake** | `enrol_manual`, `enrol_self` | — | **Native Moodle** |
| **Payment Gateway Routing** | `core_payment` abstraction | Razorpay & PhonePe Gateways | **Custom Extension** |
| **Server Payment Verification** | Webhook handler | Gateway-specific signature & status check | **Custom Extension** |
| **Student Dashboard** | Core `/my/` dashboard | Personalized course widgets | **Hybrid** |
| **Faculty Routing Engine** | *Not provided in Moodle* | Multi-factor matching engine | **Acuitey Proprietary** |
| **Faculty Workload Balancing** | *Not provided in Moodle* | Real-time capacity tracker | **Acuitey Proprietary** |
| **Pending Allocation Queue** | *Not provided in Moodle* | Ad-hoc task retry & SLA alert | **Acuitey Proprietary** |
| **Assessment & Rubrics** | Core `mod_assign`, `mod_quiz`| — | **Native Moodle** |
| **Gradebook & Completion** | Core Gradebook & Tracking | Automated progression logic | **Native Moodle** |
| **Live Conferencing** | `mod_lti` LTI 1.3 Platform | Zoom LTI Pro configuration | **Integration** |
| **Event Dispatches** | `\core\event\base` | Acuitey routing events | **Hybrid** |
| **Messaging & Notifications**| Core `message_send()` | Custom notification templates | **Hybrid** |
| **PDF Certificates** | Core Certificate subsystem | Branded Acuitey templates | **Native Moodle** |

---

## 13. Implementation Roadmap

The implementation is structured into six disciplined phases to ensure systematic verification:

```
Month 1: Infrastructure & Hardening
  ├── Provision Hostinger KVM (Recommended: Ubuntu 24.04 LTS, Nginx, PHP 8.2, Redis)
  ├── Configure Managed PostgreSQL (Supabase / Managed) with connection pooling
  └── Enforce Proposed Cloudflare Edge WAF, SSL Strict, and firewall rules

Month 2: Moodle Core Foundation & Payment Setup
  ├── Deploy clean, untouched Moodle 5.2.3+ codebase
  ├── Configure MUC Redis caching and CLI cron task runner
  └── Implement and test Razorpay & PhonePe payment gateway plugins

Month 3: Acuitey Routing Engine (`local_acuitey`)
  ├── Build XMLDB table schemas and migration scripts
  ├── Implement faculty matching algorithm and scoring services
  ├── Implement ad-hoc background task processor and pending queue
  └── Conduct high-volume simulated concurrency stress testing

Month 4: Zoom LTI 1.3 & Academic Workflows
  ├── Establish cryptographic LTI 1.3 Advantage handshake with Zoom LTI Pro
  ├── Configure course templates, assessment rubrics, and gradebook
  └── Deploy Acuitey custom branded theme (`theme_acuitey`)

Month 5: Reporting, Analytics & Observability
  ├── Build administrative routing oversight consoles
  ├── Deploy proposed Prometheus/Grafana infrastructure monitoring
  └── Conduct end-to-end security penetration and load testing

Month 6: User Acceptance Testing (UAT) & Production Launch
  ├── Conduct pilot cohort training with faculty and administrators
  ├── Finalize disaster recovery and backup runbooks
  └── Production Go-Live
```

---

## 14. Architecture Confirmation & Design Principles

### 14.1 Moodle Core Integrity Statement
> **"The Acuitey automated student-to-faculty workflow will be implemented using Moodle's supported extension architecture. Moodle core files will not be modified for this functionality. Moodle APIs, events, capabilities, tasks and messaging mechanisms will be used where appropriate, while Acuitey-specific routing logic will remain isolated within controlled custom extensions."**

### 14.2 Plugin Governance Statement
> **"Third-party Moodle plugins will only be introduced where they provide a justified and maintainable capability that is not appropriately delivered through Moodle native functionality or the Acuitey custom extension."**

---

## 15. Key Assumptions & Items for Confirmation

Prior to commencing Phase 2 development, the following architectural items must be formally confirmed with Acuitey management:

1. **Routing Trigger:**  
   To be confirmed whether faculty allocation occurs after enrolment, first learning activity, or an explicit mentoring/support request.

2. **Faculty Capacity:**  
   Maximum concurrent workload and workload weighting to be confirmed by Acuitey.

3. **Routing Escalation:**  
   Pending-request retry interval and administrator escalation SLA to be confirmed during business-rule finalization.

4. **Payment Configuration:**  
   Confirm whether Razorpay and PhonePe will both be offered simultaneously and obtain the required production merchant/API credentials.

5. **Zoom Configuration:**  
   Confirm Acuitey’s Zoom account/licensing and the LTI Pro functions enabled for the account.
