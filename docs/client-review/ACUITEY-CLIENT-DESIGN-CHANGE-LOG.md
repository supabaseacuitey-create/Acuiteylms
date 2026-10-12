# Acuitey LMS — Client Design & Architecture Change Log

**Target Platform:** Moodle LMS 5.2.3+  
**Review Target:** [`Acuitey-LMS-Initial-System-Design-Editorial.pdf`](file:///C:/Users/Atul/Desktop/moodle/docs/deliverables/Acuitey-LMS-Initial-System-Design-Editorial.pdf)  
**Parent Tracker:** [`ACUITEY-SYSTEM-DESIGN-REVIEW-TRACKER.md`](file:///C:/Users/Atul/Desktop/moodle/docs/client-review/ACUITEY-SYSTEM-DESIGN-REVIEW-TRACKER.md)  
**Document Classification:** Change Request & Modification Governance Register  
**Gate Reference:** `GATE-01 — CLIENT SYSTEM DESIGN APPROVAL`  

---

## 1. Change Governance Rules

> [!IMPORTANT]
> 1. **Zero Automatic Changes:** No architectural, prototype, or WBS modification will be made automatically. All client feedback, suggestions, and critiques must first be recorded in this Change Log.
> 2. **Cross-Artifact Impact Assessment:** For every recorded change, engineering must identify the affected architecture area, affected prototype, affected WBS task, and any related decision ID (`DEC-*`).
> 3. **Approval Gating:** Changes classified as `PROPOSED` or `UNDER REVIEW` must receive formal stakeholder agreement before the design baseline is updated.
> 4. **Production Code Freeze:** No production code (`theme/acuitey`, `local/acuitey`, database schema, or PHP files) may be written while change requests are under review.

---

## 2. Change Log Register

| Change ID | Date | Client Comment | Affected Architecture Area | Affected Prototype | Affected WBS Task | Decision Required | Action | Status |
| :---: | :---: | :--- | :--- | :--- | :--- | :---: | :--- | :---: |
| **ACU-CR-001** | 2026-09-24 | Deploy LMS on Acuitey branded subdomain (`portal.acuiteysolutions.com` OR `academy.acuiteysolutions.com`) linked via "Portal Login" on main website. | Deployment / DNS / Access Architecture | None (LMS internal flows unaffected) | `ACU-BASE-001`, `ACU-OPS-001`, `ACU-UAT-003` | `DEC-017` | Update system design docs, topology diagrams, Nginx/TLS rules, and add DEC-017. | `INCORPORATED IN DESIGN` |
| *CHG-002* | *Pending Review* | *Awaiting additional client review comments on System Design PDF.* | *To be determined* | *To be determined* | *To be determined* | *DEC-* | *Record client comment and analyze architectural impact.* | `LOGGED` |

---

## 3. Detailed Change Records

### [Change ID: ACU-CR-001] — Branded Subdomain Deployment & Corporate Site Navigation
- **Date Received:** 2026-09-24
- **Submitted By:** Greeshma / Acuitey Solutions
- **Client Comment / Requirement:**
  > "The Moodle LMS must not be built on a separate standalone domain or isolated external link. It must be deployed natively on the Acuitey branded domain as a secure subdomain mapping directly to either portal.acuiteysolutions.com or academy.acuiteysolutions.com. The main website navigation will contain a 'Portal Login' button pointing directly to this subdomain. Architectural data flows and server access rules must reflect this native subdomain structure from day one."
- **Affected Architecture Domain:** Deployment / DNS / Access Architecture / Corporate Website Linkage
- **Affected Interactive Prototype(s):** None (Main website navigation links to LMS subdomain; internal LMS prototypes use relative paths)
- **Affected Implementation WBS Task(s):** `ACU-BASE-001` (wwwroot configuration), `ACU-OPS-001` (Virtual host setup), `ACU-UAT-003` (DNS cutover)
- **Related Decision Brief:** `DEC-017` (LMS Production Subdomain Selection)
- **Final Hostname Status:** **CLIENT FINAL HOSTNAME CONFIRMATION REQUIRED** (portal.acuiteysolutions.com vs academy.acuiteysolutions.com)
- **Proposed Technical / Design Action:**
  1. Revise System Design PDF and Markdown architecture to position Moodle on an Acuitey branded subdomain under `*.acuiteysolutions.com`.
  2. Document corporate website (`www.acuiteysolutions.com`) navigation button "Portal Login" linking directly to the chosen HTTPS subdomain.
  3. Formalize DNS, TLS, Nginx virtual host, host-scoped session cookies, and proposed Cloudflare reverse proxy edge rules.
  4. Register `DEC-017` in the Open Decisions Log and Client Decision Pack.
- **Moodle Feasibility & Core Integrity Assessment:** Standard Moodle architecture supports custom subdomains via `$CFG->wwwroot` with 100% native compatibility. Requires zero core hacks.
- **Status:** **AGREED WITH CLIENT**
- **Implementation Status:** **INCORPORATED IN DESIGN** (Editorial Baseline & PDF Deliverable Updated)

---

## 3. Status Definitions

- **`LOGGED`:** The client comment or requested change has been recorded in this register; impact analysis underway.
- **`UNDER REVIEW`:** Engineering and design teams are evaluating architectural feasibility, Moodle core integrity, and WBS impact.
- **`AGREED WITH CLIENT`:** Client leadership and engineering have aligned on the required adjustment and implementation approach.
- **`INCORPORATED IN DESIGN`:** The change has been updated in the design specifications, architecture documentation, or interactive prototypes.
- **`DEFERRED`:** The item has been formally deferred by agreement to a post-launch phase (e.g. Phase 2 enhancements).
- **`REJECTED`:** The item was evaluated and withdrawn after discussion with client leadership (rationale documented).

---

## 4. Change Entry Template

When client feedback is received from the review of `Acuitey-LMS-Initial-System-Design-Editorial.pdf`, use the following standard entry template to log each item:

```markdown
### [Change ID: CHG-XXX] — [Short Descriptive Title]
- **Date Received:** YYYY-MM-DD
- **Submitted By:** [Client Name / Role]
- **Client Comment / Requirement:**
  > "[Verbatim or summarized client feedback]"
- **Affected Architecture Domain:** [e.g. Course Taxonomy / Allocation Routing / Payment Gateway / LTI Telemetry]
- **Affected Interactive Prototype(s):** [e.g. homepage.html / course-catalogue.html / student-dashboard.html / faculty-dashboard.html / None]
- **Affected Implementation WBS Task(s):** [e.g. ACU-BASE-003, ACU-ROUTE-004, etc.]
- **Related Decision Brief:** [e.g. DEC-001, DEC-013, or New Decision ID]
- **Proposed Technical / Design Action:** [Describe exact modification to documents, templates, or schemas]
- **Moodle Feasibility & Core Integrity Assessment:** [Confirm change requires zero Moodle core modifications]
- **Status:** [LOGGED / UNDER REVIEW / AGREED WITH CLIENT / INCORPORATED IN DESIGN / DEFERRED / REJECTED]
```
