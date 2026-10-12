const fs = require('fs');
const path = require('path');

const archDir = path.join(process.cwd(), 'docs', 'architecture');
const svgs = JSON.parse(fs.readFileSync(path.join(archDir, 'extracted_svgs.json'), 'utf-8'));

const pages = [
  // Page 1: Cover Page
  `
  <div class="page cover-page">
    <div class="cover-content">
      <div class="cover-brand">
        <span class="brand-badge">ACUITEY SOLUTIONS • ENTERPRISE ARCHITECTURE</span>
      </div>
      <div class="cover-title-group">
        <h1 class="cover-title">Acuitey Solutions LMS</h1>
        <h2 class="cover-subtitle">Initial System Design & Workflow Architecture</h2>
        <div class="cover-rule"></div>
        <p class="cover-desc">High-Concurrency Open Architecture, Automated "Ola/Uber-Style" Student-to-Faculty Dynamic Routing Engine, Native Moodle Core Extension Framework, and Enterprise Cloud Infrastructure.</p>
      </div>
      <div class="cover-meta">
        <div class="meta-item">
          <span class="meta-label">DOCUMENT TYPE</span>
          <span class="meta-val">System Architecture Review</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">TARGET PLATFORM</span>
          <span class="meta-val">Moodle LMS 5.2.3+ (Build 20260916)</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">INFRASTRUCTURE</span>
          <span class="meta-val">Hostinger KVM • PostgreSQL 16 • Redis 7</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">DATE & VERSION</span>
          <span class="meta-val">September 2026 • Version 1.0.0</span>
        </div>
      </div>
    </div>
  </div>
  `,

  // Page 2: Executive Architecture Overview
  `
  <div class="page">
    <div class="page-header">
      <span class="header-title">Acuitey Solutions LMS — Initial System Design</span>
      <span class="header-section">Section 01: Executive Architecture Overview</span>
    </div>
    <div class="page-body">
      <h2>1. Executive Architecture Overview</h2>
      <p class="intro-p">The Acuitey Solutions Learning Management System (LMS) is architected upon <strong>Moodle LMS 5.2.3+ (Branch 502)</strong>, providing an open, secure, and horizontally scalable digital learning ecosystem. The platform uniquely pairs Moodle's enterprise course management and assessment engine with Acuitey's proprietary <em>Automated Dynamic Faculty Routing System</em>.</p>
      
      <div class="diagram-wrapper">
        ${svgs['01-system-architecture.html']}
      </div>

      <div class="grid-3">
        <div class="summary-box">
          <h4>Moodle Core Untouched</h4>
          <p>Zero core modifications. The entire upstream Moodle 5.2 code remains 100% standard and directly upgradeable with zero merge friction.</p>
        </div>
        <div class="summary-box">
          <h4>Dynamic Faculty Allocation</h4>
          <p>Intelligent Ola/Uber-style algorithm dynamically evaluates specialization, real-time availability, and active workload to match students with instructors.</p>
        </div>
        <div class="summary-box">
          <h4>Proposed Cloud Topology</h4>
          <p>Proposed Cloudflare Edge perimeter, Hostinger KVM (recommended Ubuntu LTS), Nginx, PHP-FPM OPcache, Redis (configuration to be finalized), and managed PostgreSQL.</p>
        </div>
      </div>
    </div>
    <div class="page-footer">
      <span>CONFIDENTIAL — ACUITEY SOLUTIONS</span>
      <span>Page 2</span>
    </div>
  </div>
  `,

  // Page 3: Architecture Principles & Governance
  `
  <div class="page">
    <div class="page-header">
      <span class="header-title">Acuitey Solutions LMS — Initial System Design</span>
      <span class="header-section">Section 02: Architecture Principles</span>
    </div>
    <div class="page-body">
      <h2>2. Architecture Principles & Governance</h2>
      <p class="intro-p">To guarantee continuous maintainability, data integrity, and compliance across multi-year institutional lifecycles, four architectural pillars govern all engineering decisions:</p>

      <div class="principle-card">
        <div class="principle-num">01</div>
        <div class="principle-body">
          <h3>Moodle Core Remains 100% Untouched and Directly Upgradeable</h3>
          <p>Under no circumstances are Moodle core application files in <code>/lib</code>, <code>/course</code>, <code>/user</code>, <code>/enrol</code>, or <code>/admin</code> altered. Moodle security patches and upstream point releases are consumed directly from official git tags without bespoke regression testing of overridden core routines.</p>
        </div>
      </div>

      <div class="principle-card">
        <div class="principle-num">02</div>
        <div class="principle-body">
          <h3>Strict Encapsulation Within Standard Extension Subsystems</h3>
          <p>All custom Acuitey business logic is housed within supported Moodle extension hooks: the primary orchestrator resides in <code>local/acuitey</code> (<code>local_acuitey</code>), payment gateways in <code>payment/gateway/</code>, and UX customizations within <code>theme/acuitey</code>. Custom tables utilize Moodle's XMLDB database abstraction (<code>mdl_local_acuitey_*</code>).</p>
        </div>
      </div>

      <div class="principle-card">
        <div class="principle-num">03</div>
        <div class="principle-body">
          <h3>Avoidance of Unnecessary Third-Party Plugins</h3>
          <p>Third-party community plugins introduce severe supply chain risks, database bloat, and upgrade incompatibilities. Acuitey mandates native Moodle capability utilization or direct custom development in <code>local_acuitey</code>, eliminating brittle external dependencies.</p>
        </div>
      </div>

      <div class="principle-card">
        <div class="principle-num">04</div>
        <div class="principle-body">
          <h3>Asynchronous, Event-Driven & Stateless Scalability</h3>
          <p>Compute-heavy tasks—including multi-criteria faculty ranking, email dispatching, report compilation, and routing retries—are handled asynchronously through Moodle’s unified Event-Observer architecture (<code>db/events.php</code>) and ad-hoc task workers (<code>\\core\\task\\adhoc_task</code>), preventing HTTP-FPM request timeouts.</p>
        </div>
      </div>

      <div class="highlight-quote">
        "Custom Acuitey functionality resides exclusively in controlled extensions. Moodle core files remain pristine, preserving long-term upgradeability and total system stability."
      </div>
    </div>
    <div class="page-footer">
      <span>CONFIDENTIAL — ACUITEY SOLUTIONS</span>
      <span>Page 3</span>
    </div>
  </div>
  `,

  // Page 4: Student User Journey
  `
  <div class="page">
    <div class="page-header">
      <span class="header-title">Acuitey Solutions LMS — Initial System Design</span>
      <span class="header-section">Section 03: Student User Journey</span>
    </div>
    <div class="page-body">
      <h2>3. End-to-End Student User Journey</h2>
      <p class="intro-p">The student user journey is designed for zero-friction exploration, rapid self-service enrolment, intelligent instructor allocation, interactive real-time learning, and automated certification.</p>

      <div class="diagram-wrapper">
        ${svgs['02-student-journey.html']}
      </div>

      <div class="grid-2">
        <div class="summary-box">
          <h4>Enrolment & Onboarding</h4>
          <p>Students browse categorised curricula. Free courses grant immediate access via <code>enrol_self</code>. Paid enrolments initiate secure server-side orders via <code>core_payment</code>, instantly redirecting to dashboard upon server-side gateway-specific verification.</p>
        </div>
        <div class="summary-box">
          <h4>Dynamic Mentorship & Certification</h4>
          <p>Course entry triggers dynamic faculty routing. Students launch Zoom sessions via authenticated LTI 1.3 Advantage, submit assessments, track grade progress, and receive verifiable digital PDF completion certificates.</p>
        </div>
      </div>
    </div>
    <div class="page-footer">
      <span>CONFIDENTIAL — ACUITEY SOLUTIONS</span>
      <span>Page 4</span>
    </div>
  </div>
  `,

  // Page 5: Automated Faculty Routing Engine (Architecture)
  `
  <div class="page">
    <div class="page-header">
      <span class="header-title">Acuitey Solutions LMS — Initial System Design</span>
      <span class="header-section">Section 04: Faculty Routing Engine</span>
    </div>
    <div class="page-body">
      <h2>4. Automated Student-to-Faculty Routing Engine</h2>
      <p class="intro-p">The most critical custom capability in Acuitey LMS is the <strong>Automated "Ola/Uber-Style" Student-to-Faculty Dynamic Routing Engine</strong>. Rather than relying on static teacher course assignments, the system balances real-time pedagogical demand with instructor availability and workload capacity.</p>

      <div class="diagram-wrapper">
        ${svgs['03-faculty-routing.html']}
      </div>

      <div class="callout-banner">
        <strong>Dual Pipeline Execution:</strong> The routing engine operates an immediate synchronous evaluation pipeline for real-time requests, backed by a persistent <em>Pending Queue & Scheduled Retry Engine</em> for surge capacity management and administrative SLA escalation.
      </div>
    </div>
    <div class="page-footer">
      <span>CONFIDENTIAL — ACUITEY SOLUTIONS</span>
      <span>Page 5</span>
    </div>
  </div>
  `,

  // Page 6: Routing Logic, Ranking & Fallback Mechanics
  `
  <div class="page">
    <div class="page-header">
      <span class="header-title">Acuitey Solutions LMS — Initial System Design</span>
      <span class="header-section">Section 04: Faculty Routing Logic & Fallback</span>
    </div>
    <div class="page-body">
      <h2>4.1 Multi-Criteria Evaluation & Fallback Workflow</h2>
      <p class="intro-p">The matching engine implements multi-stage filtering, dynamic mathematical scoring, and resilient exception handling to guarantee consistent service levels.</p>

      <div class="grid-2">
        <div class="tech-card">
          <h3>Multi-Stage Filtering Criteria</h3>
          <ul>
            <li><strong>Subject Specialization:</strong> Matches requested course taxonomy against faculty competency tags stored in <code>mdl_local_acuitey_faculty_prof</code>.</li>
            <li><strong>Moodle Capability Validation:</strong> Confirms the instructor holds <code>moodle/course:update</code> and <code>local/acuitey:mentor</code> in the course context.</li>
            <li><strong>Real-Time Shift & Status:</strong> Evaluates active shift schedules and real-time online status stored in Redis cache.</li>
            <li><strong>Workload Cap Enforcement:</strong> Rejects faculty whose <code>current_workload &ge; max_workload</code> to eliminate instructor burnout.</li>
          </ul>
        </div>
        <div class="tech-card">
          <h3>Scoring & Ranking Algorithm</h3>
          <p>Eligible faculty are ranked using a multi-factor weighted equation:</p>
          <div class="code-snippet">
Score = (W_spec &times; S_spec) + (W_load &times; S_load) + 
        (W_perf &times; S_perf) + (W_tz &times; S_tz)
          </div>
          <ul>
            <li><strong>S_load (Load Balance):</strong> Preferentially weights instructors with lowest active student counts.</li>
            <li><strong>S_perf (Performance SLA):</strong> Incorporates historical student ratings and feedback compliance.</li>
            <li><strong>Tie-Breaking:</strong> Round-robin rotation among equal-scoring faculty members.</li>
          </ul>
        </div>
      </div>

      <div class="tech-card" style="margin-top: 14px;">
        <h3>Resilient Fallback & Administrative Escalation Mechanism</h3>
        <p>If zero faculty members meet eligibility criteria during off-peak windows or sudden enrolment surges:</p>
        <ol style="margin-left: 20px; font-size: 11px; line-height: 1.6; color: #334155;">
          <li><strong>Pending Allocation Queue:</strong> The request is safely written to <code>mdl_local_acuitey_requests</code> with status <code>STATUS_PENDING</code>.</li>
          <li><strong>Automated Scheduled Retry Task:</strong> A background CLI task (<code>\\local_acuitey\\task\\retry_pending_routing</code>) polls pending queues based on configured retry schedules.</li>
          <li><strong>Administrative SLA Escalation:</strong> If a request remains unassigned beyond a configured threshold, the system generates an urgent notification to the Academic Administrator console for manual reassignment.</li>
          <li><strong>Complete Auditability:</strong> Every evaluation cycle, calculated score, and exception is written to <code>mdl_local_acuitey_routing_log</code>.</li>
        </ol>
      </div>
    </div>
    <div class="page-footer">
      <span>CONFIDENTIAL — ACUITEY SOLUTIONS</span>
      <span>Page 6</span>
    </div>
  </div>
  `,

  // Page 7: Moodle Extension Architecture
  `
  <div class="page">
    <div class="page-header">
      <span class="header-title">Acuitey Solutions LMS — Initial System Design</span>
      <span class="header-section">Section 05: Moodle Extension Architecture</span>
    </div>
    <div class="page-body">
      <h2>5. Moodle Extension Strategy (local_acuitey)</h2>
      <p class="intro-p">Custom Acuitey functionality interfaces cleanly with native Moodle core subsystems through official extension interfaces, events, and task managers.</p>

      <div class="diagram-wrapper">
        ${svgs['04-moodle-extension-architecture.html']}
      </div>

      <div class="grid-3">
        <div class="summary-box">
          <h4>Events & Observers</h4>
          <p>Listens to <code>\\core\\event\\user_enroled</code> via <code>db/events.php</code>, immediately invoking <code>\\local_acuitey\\observer\\routing_observer</code>.</p>
        </div>
        <div class="summary-box">
          <h4>Background Tasks</h4>
          <p>Dispatches heavy computation to <code>\\\\\core\\\\\task\\adhoc_task</code>, ensuring zero latency impact on frontend student interactions.</p>
        </div>
        <div class="summary-box">
          <h4>Native Messaging</h4>
          <p>Utilizes Moodle's <code>message_send()</code> and <code>db/messages.php</code> to deliver real-time in-app, email, and mobile push alerts.</p>
        </div>
      </div>
    </div>
    <div class="page-footer">
      <span>CONFIDENTIAL — ACUITEY SOLUTIONS</span>
      <span>Page 7</span>
    </div>
  </div>
  `,

  // Page 8: Roles & Security Perimeter
  `
  <div class="page">
    <div class="page-header">
      <span class="header-title">Acuitey Solutions LMS — Initial System Design</span>
      <span class="header-section">Section 06: Roles & Security Model</span>
    </div>
    <div class="page-body">
      <h2>6. Contextual Roles & Security Boundaries</h2>
      <p class="intro-p">Security in Acuitey LMS is governed by Moodle’s strict hierarchical Context Model, enforcing least-privilege role boundaries across student, faculty, and administrative tiers.</p>

      <div class="diagram-wrapper">
        ${svgs['05-role-security.html']}
      </div>

      <div class="grid-2">
        <div class="summary-box">
          <h4>Academic & Financial Segregation</h4>
          <p>Finance Administrators have access restricted exclusively to <code>core_payment</code> records, fee reconciliations, and payout accounts. They possess zero visibility into pedagogical assessments, course content, or student grades.</p>
        </div>
        <div class="summary-box">
          <h4>Contextual Student Privacy</h4>
          <p>Students operate strictly within enrolled Course Contexts and allocated Activity Modules. Cross-student record traversal, gradebook inspection, and routing configuration modifications are blocked at the capability layer.</p>
        </div>
      </div>
    </div>
    <div class="page-footer">
      <span>CONFIDENTIAL — ACUITEY SOLUTIONS</span>
      <span>Page 8</span>
    </div>
  </div>
  `,

  // Page 9: Payment & Enrolment Flow
  `
  <div class="page">
    <div class="page-header">
      <span class="header-title">Acuitey Solutions LMS — Initial System Design</span>
      <span class="header-section">Section 07: Payment & Enrolment Flow</span>
    </div>
    <div class="page-body">
      <h2>7. Payment Architecture & Automated Enrolment</h2>
      <p class="intro-p">Acuitey supports dual Indian payment gateways—<strong>Razorpay</strong> and <strong>PhonePe</strong>—interfaced through Moodle’s native <code>core_payment</code> abstraction with mandatory server-side signature and payment-status validation.</p>

      <div class="diagram-wrapper">
        ${svgs['06-payment-enrolment.html']}
      </div>

      <div class="grid-3">
        <div class="summary-box">
          <h4>Server-Side Secret Keys</h4>
          <p>Razorpay Key Secrets and PhonePe Salt/Merchant Keys reside strictly in encrypted database configurations on the Hostinger KVM. Client devices never receive private keys.</p>
        </div>
        <div class="summary-box">
          <h4>Gateway-Specific Verification</h4>
          <p>Enrolments occur exclusively when the server executes gateway-specific signature/authenticity checks, order amount verification, and payment status confirmation.</p>
        </div>
        <div class="summary-box">
          <h4>Idempotent Reconciliation</h4>
          <p>Transaction IDs are checked against <code>mdl_payments</code> prior to user enrolment, preventing duplicate course allocations or race conditions from webhook retries.</p>
        </div>
      </div>
    </div>
    <div class="page-footer">
      <span>CONFIDENTIAL — ACUITEY SOLUTIONS</span>
      <span>Page 9</span>
    </div>
  </div>
  `,

  // Page 10: Zoom LTI 1.3 Advantage Integration
  `
  <div class="page">
    <div class="page-header">
      <span class="header-title">Acuitey Solutions LMS — Initial System Design</span>
      <span class="header-section">Section 08: Zoom LTI Integration</span>
    </div>
    <div class="page-body">
      <h2>8. Zoom LTI 1.3 Advantage Integration</h2>
      <p class="intro-p">Interactive live learning is integrated via <strong>LTI 1.3 Advantage (IMS Global Security Framework)</strong> using Moodle’s core <code>mod_lti</code> module and Zoom LTI Pro, eliminating passwords and unauthorized access.</p>

      <div class="diagram-wrapper">
        ${svgs['07-zoom-lti.html']}
      </div>

      <div class="grid-3">
        <div class="summary-box">
          <h4>Zero Password Exposure</h4>
          <p>Students and faculty never handle meeting passwords or direct Zoom account credentials. Access is cryptographically established using asymmetric RSA keypairs.</p>
        </div>
        <div class="summary-box">
          <h4>Zoombombing Prevention</h4>
          <p>Only authenticated users with active course enrolments can generate valid LTI tokens. External or unallocated participants cannot access live sessions.</p>
        </div>
        <div class="summary-box">
          <h4>Grade & Attendance Sync</h4>
          <p>Grade and attendance synchronization may be enabled where supported by the selected Zoom LTI configuration and Acuitey’s Zoom account/licensing using LTI AGS.</p>
        </div>
      </div>
    </div>
    <div class="page-footer">
      <span>CONFIDENTIAL — ACUITEY SOLUTIONS</span>
      <span>Page 10</span>
    </div>
  </div>
  `,

  // Page 11: Production Deployment Architecture
  `
  <div class="page">
    <div class="page-header">
      <span class="header-title">Acuitey Solutions LMS — Initial System Design</span>
      <span class="header-section">Section 09: Production Deployment Architecture</span>
    </div>
    <div class="page-body">
      <h2>9. Production Infrastructure & Deployment Topology</h2>
      <p class="intro-p">The Acuitey LMS infrastructure is proposed on an enterprise-grade <strong>Hostinger KVM VPS</strong> (recommended: Ubuntu 24.04 LTS), protected by <strong>Proposed Cloudflare Edge</strong>, and backed by a proposed managed <strong>PostgreSQL / Supabase</strong> database tier (final configuration to be confirmed).</p>

      <div class="diagram-wrapper">
        ${svgs['08-deployment-architecture.html']}
      </div>

      <div class="grid-4">
        <div class="summary-box">
          <h4>Proposed Cloudflare Edge</h4>
          <p>Recommended perimeter for terminating TLS 1.3, mitigating DDoS attacks, enforcing WAF rules, and caching static assets.</p>
        </div>
        <div class="summary-box">
          <h4>Proposed Hostinger KVM</h4>
          <p>Dedicated compute running Nginx, PHP-FPM 8.2/8.3, Redis (configuration to be finalized), and CLI cron task workers.</p>
        </div>
        <div class="summary-box">
          <h4>PostgreSQL / Supabase</h4>
          <p>Managed PostgreSQL database tier (final configuration to be confirmed), connection pooling, and automated backups.</p>
        </div>
        <div class="summary-box">
          <h4>Proposed Operations</h4>
          <p>Proposed monitoring layer (Prometheus/Grafana), automated snapshots, off-site backup storage, and SSH key controls.</p>
        </div>
      </div>
    </div>
    <div class="page-footer">
      <span>CONFIDENTIAL — ACUITEY SOLUTIONS</span>
      <span>Page 11</span>
    </div>
  </div>
  `,

  // Page 12: Native Moodle vs Acuitey Custom Components
  `
  <div class="page">
    <div class="page-header">
      <span class="header-title">Acuitey Solutions LMS — Initial System Design</span>
      <span class="header-section">Section 10: Technical Component Responsibility</span>
    </div>
    <div class="page-body">
      <h2>10. Native Moodle vs. Acuitey Custom Development</h2>
      <p class="intro-p">To provide executive clarity, the following matrix delineates standard Moodle platform capabilities from custom Acuitey proprietary engineering:</p>

      <table class="matrix-table">
        <thead>
          <tr>
            <th>Functional Area</th>
            <th>Native Moodle 5.2.3+ Infrastructure</th>
            <th>Acuitey Custom Engineering</th>
            <th>Architecture Designation</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>User Authentication</strong></td>
            <td>Standard <code>auth_*</code> core plugins & manual accounts</td>
            <td>Custom profile fields & taxonomy tags</td>
            <td><span class="tag tag-moodle">Native Moodle</span></td>
          </tr>
          <tr>
            <td><strong>Role & Security RBAC</strong></td>
            <td>Contextual RBAC (System &rarr; Category &rarr; Course)</td>
            <td>Custom capability definitions in <code>db/access.php</code></td>
            <td><span class="tag tag-moodle">Native Moodle</span></td>
          </tr>
          <tr>
            <td><strong>Course Catalogue</strong></td>
            <td>Course categories, descriptions, and tags</td>
            <td>Custom responsive UI grid in <code>theme_acuitey</code></td>
            <td><span class="tag tag-hybrid">Hybrid</span></td>
          </tr>
          <tr>
            <td><strong>Enrolment Processing</strong></td>
            <td><code>enrol_manual</code>, <code>enrol_self</code>, <code>enrol_fee</code></td>
            <td>Automated event trigger invocation</td>
            <td><span class="tag tag-moodle">Native Moodle</span></td>
          </tr>
          <tr>
            <td><strong>Payment Gateway API</strong></td>
            <td>Moodle <code>core_payment</code> abstraction layer</td>
            <td>Razorpay & PhonePe gateway plugins</td>
            <td><span class="tag tag-custom">Acuitey Custom</span></td>
          </tr>
          <tr>
            <td><strong>Payment Verification</strong></td>
            <td>Transaction logging framework</td>
            <td>Server-side gateway-specific signature and status check</td>
            <td><span class="tag tag-custom">Acuitey Custom</span></td>
          </tr>
          <tr>
            <td><strong>Student Dashboard</strong></td>
            <td>Moodle <code>/my/</code> dashboard & core course blocks</td>
            <td>Personalized allocation & mentoring widgets</td>
            <td><span class="tag tag-hybrid">Hybrid</span></td>
          </tr>
          <tr>
            <td><strong>Faculty Routing Engine</strong></td>
            <td><em>Not provided in Moodle core</em></td>
            <td>Ola/Uber multi-criteria dynamic matching service</td>
            <td><span class="tag tag-custom">Acuitey Proprietary</span></td>
          </tr>
          <tr>
            <td><strong>Faculty Availability Tracking</strong></td>
            <td><em>Not provided in Moodle core</em></td>
            <td>Real-time shift schedules & Redis presence state</td>
            <td><span class="tag tag-custom">Acuitey Proprietary</span></td>
          </tr>
          <tr>
            <td><strong>Workload Balancing</strong></td>
            <td><em>Not provided in Moodle core</em></td>
            <td>Capacity counters & dynamic ranking weights</td>
            <td><span class="tag tag-custom">Acuitey Proprietary</span></td>
          </tr>
          <tr>
            <td><strong>Pending Allocation Queue</strong></td>
            <td><em>Not provided in Moodle core</em></td>
            <td>Ad-hoc background retry task & admin escalation</td>
            <td><span class="tag tag-custom">Acuitey Proprietary</span></td>
          </tr>
          <tr>
            <td><strong>Assessments & Quizzes</strong></td>
            <td>Moodle <code>mod_assign</code>, <code>mod_quiz</code>, rubrics</td>
            <td>Standard configuration & grade templates</td>
            <td><span class="tag tag-moodle">Native Moodle</span></td>
          </tr>
          <tr>
            <td><strong>Live Video Conferencing</strong></td>
            <td>Core <code>mod_lti</code> LTI 1.3 Advantage Platform</td>
            <td>Zoom LTI Pro configuration (Optional AGS sync)</td>
            <td><span class="tag tag-integ">Integration</span></td>
          </tr>
          <tr>
            <td><strong>Event Observers</strong></td>
            <td>Moodle <code>\\core\\event\\base</code> subsystem</td>
            <td>Custom routing events & listeners</td>
            <td><span class="tag tag-hybrid">Hybrid</span></td>
          </tr>
          <tr>
            <td><strong>Notification Dispatch</strong></td>
            <td>Core <code>message_send()</code> & provider framework</td>
            <td>Custom message templates in <code>db/messages.php</code></td>
            <td><span class="tag tag-hybrid">Hybrid</span></td>
          </tr>
          <tr>
            <td><strong>PDF Certificates</strong></td>
            <td>Core certificate & completion tracking</td>
            <td>Branded PDF layout & cryptographic verification</td>
            <td><span class="tag tag-moodle">Native Moodle</span></td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="page-footer">
      <span>CONFIDENTIAL — ACUITEY SOLUTIONS</span>
      <span>Page 12</span>
    </div>
  </div>
  `,

  // Page 13: Implementation Sequence & Roadmap
  `
  <div class="page">
    <div class="page-header">
      <span class="header-title">Acuitey Solutions LMS — Initial System Design</span>
      <span class="header-section">Section 11: Implementation Sequence</span>
    </div>
    <div class="page-body">
      <h2>11. Implementation Sequence & Execution Roadmap</h2>
      <p class="intro-p">The platform rollout follows a phased, 6-stage engineering sequence engineered to de-risk core dependencies, establish security baselines, and rigorously validate the dynamic routing engine prior to go-live.</p>

      <div class="timeline-container">
        <div class="timeline-step">
          <div class="step-badge">STAGE 01</div>
          <div class="step-content">
            <h4>Infrastructure Provisioning & Hardening</h4>
            <p>Deploy Hostinger KVM (Recommended Ubuntu LTS), Nginx, PHP-FPM with OPcache, local Redis. Provision PostgreSQL / Supabase with connection pooling. Configure proposed Cloudflare edge security rules.</p>
          </div>
        </div>

        <div class="timeline-step">
          <div class="step-badge">STAGE 02</div>
          <div class="step-content">
            <h4>Moodle Core Foundation & Payment Gateway Setup</h4>
            <p>Install untouched Moodle 5.2.3+ codebase. Configure MUC Redis caching and CLI cron task runner. Implement custom Razorpay and PhonePe gateway plugins with server-side gateway-specific verification.</p>
          </div>
        </div>

        <div class="timeline-step">
          <div class="step-badge">STAGE 03</div>
          <div class="step-content">
            <h4>Acuitey Routing Engine Development (local_acuitey)</h4>
            <p>Create XMLDB table schemas (<code>mdl_local_acuitey_*</code>). Implement faculty matching algorithm, availability checking, and workload balancing services. Build background retry processor and pending queue.</p>
          </div>
        </div>

        <div class="timeline-step">
          <div class="step-badge">STAGE 04</div>
          <div class="step-content">
            <h4>Zoom LTI 1.3 Advantage & Academic Workflows</h4>
            <p>Establish cryptographic OIDC/JWT handshake between Moodle <code>mod_lti</code> and Zoom LTI Pro. Configure course category taxonomies, assessment rubrics, gradebook aggregations, and Acuitey custom theme.</p>
          </div>
        </div>

        <div class="timeline-step">
          <div class="step-badge">STAGE 05</div>
          <div class="step-content">
            <h4>Reporting, Administrative Consoles & Observability</h4>
            <p>Build Academic Administrator routing control dashboards and Finance payment reconciliation tools. Deploy proposed Prometheus/Grafana monitoring dashboards for real-time infrastructure telemetry.</p>
          </div>
        </div>

        <div class="timeline-step">
          <div class="step-badge">STAGE 06</div>
          <div class="step-content">
            <h4>End-to-End Testing, Pilot Cohort & Production Go-Live</h4>
            <p>Conduct automated high-concurrency stress testing of routing algorithms. Execute end-to-end security audits. Train faculty and administrative staff. Execute production cutover and launch.</p>
          </div>
        </div>
      </div>
    </div>
    <div class="page-footer">
      <span>CONFIDENTIAL — ACUITEY SOLUTIONS</span>
      <span>Page 13</span>
    </div>
  </div>
  `,

  // Page 14: Architecture Confirmation & Design Principles
  `
  <div class="page">
    <div class="page-header">
      <span class="header-title">Acuitey Solutions LMS — Initial System Design</span>
      <span class="header-section">Section 12: Architecture Confirmation & Design Principles</span>
    </div>
    <div class="page-body">
      <h2>12. Architecture Confirmation & Design Principles</h2>
      <p class="intro-p">This architecture document confirms compliance with enterprise software engineering standards, Moodle architectural guidelines, and approved institutional design principles.</p>

      <div class="formal-cert-card">
        <div class="cert-header">
          <svg width="24" height="24" fill="none" stroke="#2563eb" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
          <h3>Approved Architectural Principles & Declarations</h3>
        </div>
        
        <div class="cert-statement">
          <p><strong>Moodle Core Integrity Statement:</strong></p>
          <blockquote>
            “The Acuitey automated student-to-faculty workflow will be implemented using Moodle's supported extension architecture. Moodle core files will not be modified for this functionality. Moodle APIs, events, capabilities, tasks and messaging mechanisms will be used where appropriate, while Acuitey-specific routing logic will remain isolated within controlled custom extensions.”
          </blockquote>
        </div>

        <div class="cert-statement" style="margin-top: 16px;">
          <p><strong>Third-Party Plugin Governance Statement:</strong></p>
          <blockquote>
            “Third-party Moodle plugins will only be introduced where they provide a justified and maintainable capability that is not appropriately delivered through Moodle native functionality or the Acuitey custom extension.”
          </blockquote>
        </div>
      </div>

      <div class="signoff-section">
        <h3>Architecture Confirmation Details</h3>
        <table class="signoff-table">
          <tr>
            <td><strong>Architecture Lead:</strong> Enterprise Solutions Architect</td>
            <td><strong>Status:</strong> Approved for Implementation Baseline</td>
          </tr>
          <tr>
            <td><strong>Target Moodle Release:</strong> 5.2.3+ (Build 20260916)</td>
            <td><strong>Proposed Operating System:</strong> Ubuntu LTS (Hostinger KVM)</td>
          </tr>
          <tr>
            <td><strong>Primary Custom Plugin:</strong> <code>local/acuitey</code></td>
            <td><strong>Review Date:</strong> September 2026</td>
          </tr>
        </table>
      </div>

      <div class="callout-banner" style="margin-top: 24px;">
        <strong>Document Status:</strong> This specification represents the agreed design principles for all Acuitey LMS engineering activities. Any subsequent modifications to core subsystems or integration boundaries require architectural review.
      </div>
    </div>
    <div class="page-footer">
      <span>CONFIDENTIAL — ACUITEY SOLUTIONS</span>
      <span>Page 14</span>
    </div>
  </div>
  `
];

const htmlTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Acuitey Solutions LMS - Initial System Design</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    @page {
      size: A4 portrait;
      margin: 0;
    }
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
      color: #0f172a;
      background: #f1f5f9;
      -webkit-font-smoothing: antialiased;
    }
    .page {
      width: 210mm;
      min-height: 285mm; max-height: 297mm;
      padding: 12mm 16mm 12mm 16mm;
      background: #ffffff;
      margin: 0;
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
      page-break-after: always;
      page-break-inside: avoid;
    }
    @media print {
      body { background: #fff; }
      .page {
        margin: 0;
        box-shadow: none;
        page-break-after: always;
        min-height: 285mm; max-height: 297mm;
        width: 210mm;
      }
    }

    /* Page Header & Footer */
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 8px;
      border-bottom: 1.5px solid #e2e8f0;
      margin-bottom: 14px;
      font-size: 8.5pt;
      color: #64748b;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.8px;
    }
    .page-header .header-title { color: #0284c7; }
    .page-footer {
      position: absolute;
      bottom: 10mm;
      left: 18mm;
      right: 18mm;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 8px;
      border-top: 1px solid #e2e8f0;
      font-size: 8pt;
      color: #94a3b8;
      font-weight: 500;
    }
    .page-body {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    /* Typography */
    h2 {
      font-size: 16pt;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.4px;
      margin-bottom: 4px;
    }
    p.intro-p {
      font-size: 9.5pt;
      line-height: 1.45;
      color: #334155;
      margin-bottom: 10px;
    }

    /* Diagram wrapper */
    .diagram-wrapper {
      width: 100%;
      background: #090d16;
      border-radius: 8px;
      padding: 10px;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
    .diagram-wrapper svg {
      width: 100%;
      height: auto;
      max-height: 110mm;
      display: block;
    }

    /* Grids & Cards */
    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }
    .grid-3 {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
    }
    .grid-4 {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 8px;
    }
    .summary-box {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 8px 10px;
    }
    .summary-box h4 {
      font-size: 9pt;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 3px;
    }
    .summary-box p {
      font-size: 8pt;
      line-height: 1.35;
      color: #475569;
    }
    .callout-banner {
      background: #f0f9ff;
      border-left: 3.5px solid #0284c7;
      padding: 8px 12px;
      font-size: 8.5pt;
      line-height: 1.4;
      color: #0369a1;
      border-radius: 0 6px 6px 0;
      margin-top: 4px;
    }

    /* Cover Page Styles */
    .cover-page {
      background: linear-gradient(135deg, #090d16 0%, #0f172a 100%);
      color: #ffffff;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 24mm 20mm;
    }
    .brand-badge {
      display: inline-block;
      font-size: 9pt;
      font-weight: 800;
      letter-spacing: 2px;
      color: #38bdf8;
      background: rgba(56, 189, 248, 0.12);
      border: 1px solid rgba(56, 189, 248, 0.3);
      padding: 6px 16px;
      border-radius: 999px;
    }
    .cover-title-group {
      margin-top: 40px;
    }
    .cover-title {
      font-size: 34pt;
      font-weight: 800;
      letter-spacing: -1px;
      color: #ffffff;
      line-height: 1.1;
      margin-bottom: 12px;
    }
    .cover-subtitle {
      font-size: 16pt;
      font-weight: 600;
      color: #94a3b8;
      line-height: 1.3;
      margin-bottom: 24px;
    }
    .cover-rule {
      width: 70px;
      height: 4px;
      background: #0284c7;
      border-radius: 2px;
      margin-bottom: 24px;
    }
    .cover-desc {
      font-size: 11pt;
      line-height: 1.6;
      color: #cbd5e1;
      max-width: 580px;
    }
    .cover-meta {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 10px;
      padding: 18px 22px;
    }
    .meta-item {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .meta-label {
      font-size: 7.5pt;
      font-weight: 700;
      letter-spacing: 1px;
      color: #64748b;
      text-transform: uppercase;
    }
    .meta-val {
      font-size: 9.5pt;
      font-weight: 600;
      color: #f1f5f9;
      font-family: 'JetBrains Mono', monospace;
    }

    /* Principle Cards */
    .principle-card {
      display: flex;
      gap: 14px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 12px 14px;
      margin-bottom: 10px;
    }
    .principle-num {
      font-size: 16pt;
      font-weight: 800;
      color: #0284c7;
      font-family: 'JetBrains Mono', monospace;
      line-height: 1;
      min-width: 30px;
    }
    .principle-body h3 {
      font-size: 10pt;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 4px;
    }
    .principle-body p {
      font-size: 8.5pt;
      line-height: 1.45;
      color: #475569;
    }
    .highlight-quote {
      margin-top: 14px;
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      border-left: 4px solid #2563eb;
      border-radius: 6px;
      padding: 12px 16px;
      font-size: 9pt;
      font-style: italic;
      color: #1e40af;
      line-height: 1.45;
    }

    /* Tech Cards & Tables */
    .tech-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 12px 14px;
    }
    .tech-card h3 {
      font-size: 9.5pt;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 6px;
    }
    .tech-card ul {
      margin-left: 16px;
      font-size: 8.5pt;
      line-height: 1.5;
      color: #334155;
    }
    .code-snippet {
      background: #0f172a;
      color: #38bdf8;
      font-family: 'JetBrains Mono', monospace;
      font-size: 8pt;
      padding: 8px 10px;
      border-radius: 5px;
      margin: 8px 0;
      white-space: pre-wrap;
    }

    /* Comparison Table */
    .matrix-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 6px;
      font-size: 7.5pt;
    }
    .matrix-table th {
      background: #0f172a;
      color: #f8fafc;
      font-weight: 700;
      text-align: left;
      padding: 7px 8px;
      border: 1px solid #1e293b;
    }
    .matrix-table td {
      padding: 5.5px 8px;
      border: 1px solid #e2e8f0;
      color: #334155;
      vertical-align: middle;
    }
    .matrix-table tr:nth-child(even) { background: #f8fafc; }
    .tag {
      display: inline-block;
      font-size: 7pt;
      font-weight: 700;
      padding: 2px 6px;
      border-radius: 4px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .tag-moodle { background: #e0f2fe; color: #0369a1; border: 1px solid #bae6fd; }
    .tag-custom { background: #fef3c7; color: #92400e; border: 1px solid #fde68a; }
    .tag-hybrid { background: #f3e8ff; color: #6b21a8; border: 1px solid #e9d5ff; }
    .tag-integ { background: #dcfce7; color: #166534; border: 1px solid #bbf7d0; }

    /* Timeline */
    .timeline-container {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-top: 6px;
    }
    .timeline-step {
      display: flex;
      gap: 12px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 8px 12px;
    }
    .step-badge {
      font-size: 7.5pt;
      font-weight: 800;
      color: #0284c7;
      background: #e0f2fe;
      border: 1px solid #bae6fd;
      padding: 3px 8px;
      border-radius: 4px;
      height: fit-content;
      font-family: 'JetBrains Mono', monospace;
      white-space: nowrap;
    }
    .step-content h4 {
      font-size: 8.5pt;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 2px;
    }
    .step-content p {
      font-size: 7.8pt;
      line-height: 1.35;
      color: #475569;
    }

    /* Cert Page */
    .formal-cert-card {
      background: #f8fafc;
      border: 1.5px solid #2563eb;
      border-radius: 8px;
      padding: 16px;
      margin-top: 10px;
    }
    .cert-header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 12px;
    }
    .cert-header h3 {
      font-size: 11pt;
      font-weight: 800;
      color: #1e3a8a;
    }
    .cert-statement blockquote {
      background: #ffffff;
      border-left: 3px solid #2563eb;
      padding: 10px 14px;
      margin-top: 6px;
      font-size: 8.5pt;
      line-height: 1.5;
      color: #1e293b;
      font-style: italic;
    }
    .signoff-table {
      width: 100%;
      margin-top: 14px;
      border-collapse: collapse;
      font-size: 8pt;
    }
    .signoff-table td {
      padding: 8px 10px;
      border: 1px solid #e2e8f0;
      background: #ffffff;
    }
  </style>
</head>
<body>
  ${pages.join('\n')}
</body>
</html>
`;

const outputPath = path.join(process.cwd(), 'docs', 'deliverables', 'report.html');
fs.writeFileSync(outputPath, htmlTemplate);
console.log('Successfully written compiled report HTML to:', outputPath);
