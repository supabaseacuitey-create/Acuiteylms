# Acuitey Solutions LMS — Design System Specification

**Target Platform:** Moodle LMS 5.2.3+ (Boost Child Theme: `theme_acuitey`)  
**Design Philosophy:** Academic Rigor, Operational Clarity, Sovereign Simplicity  
**Distinct Brand Identity:** Acuitey Solutions Higher Education & Corporate Upskilling  
**Document Classification:** Definitive Design System & UI Specification  
**Status:** Canonical Source of Truth  

---

## 1. Visual Principles & Brand Direction

Acuitey Solutions is a mission-critical learning management system for higher education institutions, corporate universities, and regulated enterprise upskilling. Its visual architecture adheres to five foundational tenets:

1. **Restrained Academic Authority (No Generic SaaS, No Consumer Playfulness):**  
   Acuitey rejects the saturated color floods, playful rounded geometry, and gamified animations of consumer learning apps (Duolingo, Airbnb). It equally rejects the monochromatic dark-mode dev-tool tropes of Silicon Valley startups (Linear, Vercel). The interface projects scholarly dignity, institutional governance, and high-concurrency reliability.

2. **Strict Elimination of Visual Slop:**  
   - **Zero Gradients:** Surfaces are crisp, flat, and solid. No multi-stop gradients or glossy overlays.
   - **Zero Rainbow Dashboards:** Metric tiles, status badges, and cards do not cycle through multiple colors. Accent colors are strictly reserved for functional states.
   - **Zero Heavy Drop Shadows:** Depth is articulated through precision hairlines (`1px solid var(--border)`). Elevation shadows are restricted to temporary floating overlays (dropdowns, dialogs).

3. **Moodle Boost Architecture Native (theme_acuitey):**  
   Every component is engineered to map directly to Moodle’s native server-side Mustache templating and Boost child-theme SCSS structure. No Single Page Application (SPA) anti-patterns that require replacing Moodle’s core page controller or routing engine.

4. **Data Integrity & Disclosure Rigor:**  
   Placeholder values, counts, and ratings must always carry explicit `[SAMPLE DATA]` disclaimers in mockups and prototypes. Visual design must never invent unverified business metrics, accreditations, response SLAs, or partner claims.

5. **Accessibility-Centric (WCAG 2.1 AA Compliant):**  
   Contrast ratios exceed 4.5:1 for body copy and 7:1 for headings. Focus states are tactile and visible. Information is never conveyed through color alone.

---

## 2. Design Tokens

### 2.1 Color Palette

The palette is anchored in deep academic navy, clean stone neutrals, and restrained functional accents:

```css
:root {
  /* Brand Canvas & Surface Neutrals */
  --acuitey-bg-canvas: #F9FAFB;        /* Academic stone canvas (Gray 50) */
  --acuitey-bg-surface: #FFFFFF;       /* Pure white container / card fill */
  --acuitey-bg-subtle: #F3F4F6;        /* Subdued table headers, metadata bars (Gray 100) */
  --acuitey-bg-muted: #E5E7EB;         /* Inactive hover states, divider backgrounds (Gray 200) */

  /* Hairlines & Structural Borders */
  --acuitey-border-hairline: #E5E7EB;  /* Default container / card border (Gray 200) */
  --acuitey-border-subtle: #D1D5DB;    /* Form borders, table row dividers (Gray 300) */
  --acuitey-border-strong: #9CA3AF;    /* Active input focus perimeter (Gray 400) */

  /* Text & Hierarchical Copy */
  --acuitey-text-primary: #0F172A;     /* Primary headings, titles, active copy (Slate 900) */
  --acuitey-text-secondary: #334155;   /* Body paragraphs, section intros (Slate 700) */
  --acuitey-text-muted: #64748B;       /* Secondary captions, timestamps, labels (Slate 500) */
  --acuitey-text-disabled: #94A3B8;    /* Inactive controls, placeholder text (Slate 400) */

  /* Brand Anchors & Primary Interaction */
  --acuitey-navy-900: #0C192C;         /* Primary brand anchor (Oxford Deep Navy) */
  --acuitey-navy-800: #13243D;         /* Brand hover state */
  --acuitey-cobalt-700: #1D4ED8;       /* Primary interactive blue for buttons & links */
  --acuitey-cobalt-800: #1E40AF;       /* Interactive hover state */
  --acuitey-cobalt-50: #EFF6FF;        /* Subtle interactive selection tint */

  /* Functional Status Accents (Restrained & Semantic) */
  /* Success / Enrolled / Active / Completed */
  --acuitey-status-success-fg: #065F46;     /* Emerald 800 */
  --acuitey-status-success-bg: #ECFDF5;     /* Emerald 50 */
  --acuitey-status-success-border: #A7F3D0; /* Emerald 200 */

  /* Warning / Time-sensitive State */
  --acuitey-status-warning-fg: #92400E;     /* Amber 800 */
  --acuitey-status-warning-bg: #FFFBEB;     /* Amber 50 */
  --acuitey-status-warning-border: #FDE68A; /* Amber 200 */

  /* Critical / Overdue / System Alert */
  --acuitey-status-danger-fg: #991B1B;      /* Red 800 */
  --acuitey-status-danger-bg: #FEF2F2;      /* Red 50 */
  --acuitey-status-danger-border: #FECACA;  /* Red 200 */

  /* Neutral Status / Archived / Drafting */
  --acuitey-status-neutral-fg: #374151;     /* Gray 700 */
  --acuitey-status-neutral-bg: #F3F4F6;     /* Gray 100 */
  --acuitey-status-neutral-border: #D1D5DB; /* Gray 300 */
}
```

### 2.2 Typography Scale

- **Primary UI & Academic Prose:** `Inter`, `-apple-system`, `BlinkMacSystemFont`, `"Segoe UI"`, `Roboto`, `sans-serif`
- **Numerical Telemetry, Timers, Course Codes & Tables:** `ui-monospace`, `"JetBrains Mono"`, `"SFMono-Regular"`, `Menlo`, `monospace` (enforcing `font-variant-numeric: tabular-nums`)

| Scale Token | Size | Line Height | Weight | Letter Spacing | Purpose |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `--font-display` | `36px` (`2.25rem`) | `44px` | `700` | `-0.025em` | Homepage hero headlines |
| `--font-h1` | `28px` (`1.75rem`) | `36px` | `700` | `-0.02em` | Major page titles (Catalogue, Dashboard) |
| `--font-h2` | `20px` (`1.25rem`) | `28px` | `600` | `-0.015em` | Section headers, card block titles |
| `--font-h3` | `16px` (`1.0rem`) | `24px` | `600` | `-0.01em` | Course titles, modal headers |
| `--font-body` | `14px` (`0.875rem`) | `22px` | `400` | `0` | Standard body copy, descriptions |
| `--font-body-medium`| `14px` (`0.875rem`) | `22px` | `500` | `0` | Emphasized body, list items, input text |
| `--font-caption` | `12px` (`0.75rem`) | `16px` | `500` | `0.01em` | Metadata rows, timestamps, hints |
| `--font-micro` | `11px` (`0.6875rem`) | `14px` | `600` | `0.08em` | All-caps category tags, table headers |

*Rule:* Any selector setting `text-transform: uppercase` MUST enforce `letter-spacing: 0.08em` minimum to prevent cramped type.

### 2.3 Spacing Scale (4px/8px Baseline)

- `--space-1`: `4px`
- `--space-2`: `8px`
- `--space-3`: `12px`
- `--space-4`: `16px` (Standard inner padding)
- `--space-5`: `20px`
- `--space-6`: `24px` (Card padding, grid gutter)
- `--space-8`: `32px` (Section padding)
- `--space-12`: `48px` (Page region margin)
- `--space-16`: `64px` (Hero padding)

### 2.4 Radii & Borders

- `--radius-badge`: `3px` (Status badges, course code pills)
- `--radius-control`: `5px` (Buttons, search inputs, dropdown selects)
- `--radius-card`: `6px` (Course cards, dashboard widgets, content blocks)
- `--radius-modal`: `8px` (Dialogs, flyout drawers)

*Elevation Guideline:* Standard in-flow components have zero drop-shadow (`box-shadow: none`) and rely exclusively on a hairline border `1px solid var(--acuitey-border-hairline)`. Dropdown menus and modals utilize a restrained ambient blur: `0 4px 12px rgba(12, 25, 44, 0.08)`.

---

## 3. Core Component Library

### 3.1 Buttons
- **Primary Action:** Solid Oxford Navy (`#0C192C`), white text, 5px radius, hover to `#13243D`.
- **Secondary / Outline:** White surface with 1px border `#D1D5DB`, Slate 900 text, hover to `#F9FAFB`.
- **Action Blue:** Solid `#1D4ED8`, white text, hover to `#1E40AF` (used for primary conversion CTAs such as "Enrol Now").
- **Ghost Action:** Transparent background, Slate 700 text, hover to `#F3F4F6`.
- **Destructive:** Solid `#991B1B`, white text.

### 3.2 Form Controls & Search
- Inputs have `38px` height, `8px 12px` padding, white background, `1px solid #D1D5DB` border, and `5px` radius.
- Focus: `outline: 2px solid #1D4ED8; outline-offset: 1px; border-color: #1D4ED8;`.
- Labels: `12px`, weight `600`, color `#334155`, `margin-bottom: 6px`.

### 3.3 Course Cards
- Aspect ratio header container with solid subdued fill (`#FFFFFF` or `#F9FAFB`), containing discipline tag, duration chip, and academic level badge.
- Course Code & Title: `15px`, font-weight `600`, max 2 lines, Slate 900 (`#0F172A`).
- Synopsis: `13px`, Slate 700 (`#334155`), max 3 lines clamped.
- Faculty Supervision Row (Optional): Initials avatar (`28px` circle) + academic title when assigned. **Faculty identity is strictly optional rather than mandatory.** Courses may be:
  - *Self-paced* (no individual instructor assigned upfront)
  - *Team-taught* (departmental or faculty pool oversight)
  - *Cohort-based* (institutional group delivery)
  - *Faculty-assigned post-enrolment* (allocated dynamically via `local_acuitey` matching engine based on student workload and specialization)
- Metadata specs: Duration, live delivery format (e.g. `Live Zoom LTI` or `Asynchronous Guided`), and fee schedule track (`Standard Track`, `Executive Track`, or `FREE (enrol_self)`).
- Action footer: Direct "Inspect Syllabus" secondary button and primary action ("Enrol Now", "Start Course", or "Resume Learning").

### 3.4 Dashboard Metric Containers
- Solid white surface, `1px solid #E5E7EB`, `16px` padding.
- Metric numeral: `24px` tabular-numbers mono font, bold.
- Label: `11px` uppercase tracking `0.08em` slate-500.
- Mandatory `[SAMPLE DATA]` indicator where unverified numerical content exists.
- Strictly monochrome: No green, red, purple background flooding.

### 3.5 Status Indicators & Progress
- Progress tracks: `6px` height, background `#F3F4F6`, fill `#0C192C` (or `#1D4ED8`), radius `3px`.
- Status pills: `11px`, weight `600`, padding `2px 8px`, radius `3px`, uppercase tracking `0.08em`.
  - Enrolled/Active: `#065F46` on `#ECFDF5`, border `#A7F3D0`
  - Pending / Time-sensitive State: `#92400E` on `#FFFBEB`, border `#FDE68A`
  - Overdue/Alert: `#991B1B` on `#FEF2F2`, border `#FECACA`

### 3.6 Live Session & Faculty Allocation Components
- **Live Session Card:** Restrained card with timing badge, session title, course/cohort details, and direct "Start Live Session" / "Join Live Session" action. Technical LTI/Zoom configurations remain purely architectural and are never exposed in user-facing copy.
- **Student Allocation Queue Card:** Contains student name, course code, consultation topic, matching context (subject match, supervisor workload), proposed allocation status, and professional Accept / Request Reassignment actions. No unverified countdowns or SLA penalties.
- **Workload & Capacity Indicator:** Visual progress meter indicating active allocated students versus instructor configurable maximum capacity (marked as `[SAMPLE DATA]` in prototypes; capacity limits are configurable, never hard-coded).

---

## 4. Moodle Architecture Compatibility Matrix

All layouts map realistically to a Moodle 5.2.3+ Boost child theme (`theme_acuitey`) without architectural compromises. 

To ensure precise technical governance, the system clearly separates **existing Moodle/Boost core capabilities**, **proposed `theme_acuitey` overrides**, **proposed `local_acuitey` plugin templates**, and **standard Moodle APIs**:

### 4.1 Architectural Component Classification

| UI Component | Existing Moodle / Boost Baseline | Proposed Implementation Artifact | Component Architecture Tier |
| :--- | :--- | :--- | :--- |
| **Top Navbar** | `theme_boost/navbar` | `theme_acuitey/templates/navbar.mustache` | Proposed Theme Override |
| **Primary Nav Links** | `core/moremenu` | Standard Moodle Navigation API | Standard Moodle Component |
| **Left Drawer** | `theme_boost/theme_boost_drawer` | `theme_acuitey/scss/moodle/drawer.scss` | Proposed Theme SCSS |
| **Frontpage Hero & Search**| Frontpage Marketing Block | `theme_acuitey/templates/frontpage_hero.mustache` | Proposed Custom Theme Template |
| **Course Cards Grid** | `core_course/category_view` | `theme_acuitey/templates/course_card.mustache` | Proposed Theme Override |
| **Curriculum Category Chips**| Course category list | `theme_acuitey/templates/category_chips.mustache` | Proposed Custom Theme Template |
| **Course Catalogue Filter**| Course category blocks | Standard Moodle category view / custom block | Standard Moodle Block / Template |
| **Student Overview** | `block_myoverview` | `theme_acuitey/templates/block_myoverview.mustache`| Proposed Theme Override |
| **Live Classroom Card** | `mod_lti/view` | Styled via `theme_acuitey/scss` | Standard Moodle Activity Module |
| **Faculty Routing Queue** | Custom plugin page | `local_acuitey/templates/allocation_queue.mustache` | Proposed `local_acuitey` Plugin UI |
| **Faculty Workload Gauge**| Custom dashboard block | `local_acuitey/templates/faculty_capacity.mustache` | Proposed `local_acuitey` Plugin Block |
| **Enrolment Checkout** | `core_payment` gateway modal | `payment_gateway_razorpay/templates/checkout.mustache`| Proposed Payment Subsystem Plugin |
| **Footer** | `theme_boost/footer` | `theme_acuitey/templates/footer.mustache` | Proposed Theme Override |

### 4.2 Distinguishing Core vs. Proposed Artifacts
All `theme_acuitey`-specific templates are documented as **PROPOSED future implementation files** to be created during theme development, rather than existing Moodle templates.

- **Existing Moodle / Boost Concepts (Core baseline):** Core site administration hierarchy, contextual RBAC (`context_course`, `context_module`), Boost base layout and drawer architecture (`theme_boost/theme_boost_drawer`), and native enrolment drivers (`enrol_self`, `enrol_fee`).
- **Proposed `theme_acuitey` Overrides (Future Custom Theme Development):** Proposed custom child-theme Mustache templates and SCSS overrides—including `theme_acuitey/templates/frontpage_hero.mustache`, `theme_acuitey/templates/course_card.mustache`, `theme_acuitey/templates/category_chips.mustache`, `theme_acuitey/templates/navbar.mustache`, and `theme_acuitey/templates/footer.mustache`. These are proposed custom presentation templates applying Acuitey styling over Moodle markup.
- **Proposed `local_acuitey` UI (Future Custom Plugin Development):** Dedicated algorithmic UI elements (e.g. `local_acuitey/templates/allocation_queue.mustache`, `local_acuitey/templates/faculty_capacity.mustache`) for student allocation routing and live instructor load monitoring.
- **Standard Moodle APIs / Components (Standard subsystem usage):** Core Navigation API (`core/moremenu`), Course Category subsystem, Activity Module architecture (`mod_lti/view` for LTI 1.3 Advantage single-sign-on launch), and `core_payment` account abstraction.

### 4.3 Proposed Moodle Course Custom Fields
The catalogue faceted filtering model is architected around Moodle's Course Custom Fields API (`core_customfield`). The following fields are documented as **PROPOSED Moodle Course Custom Fields** rather than confirmed implementation fields:
- `discipline_category`: (Proposed Dropdown/Text) Primary academic discipline classification (e.g., Cloud Architecture, Software Engineering, Governance & AI).
- `academic_level`: (Proposed Dropdown) Curricular level (Foundational, Postgraduate, Executive Leadership).
- `term_duration`: (Proposed Text/Number) Structured curriculum timeframe (e.g., 6 Weeks, 10 Weeks, 14 Weeks, Self-Paced).

In Mustache templates (`theme_acuitey/templates/course_card.mustache`), faculty supervision metadata is rendered conditionally (`{{#hasfaculty}}...{{/hasfaculty}}`), accommodating self-paced tracks, departmental/team-taught oversight, cohort delivery, and post-enrolment faculty assignment.

---

## 5. Responsive Behavior Standards

- **Desktop (1440px):** Max container width `1440px`. Grid gutters `24px`. Full multi-column dashboard with main workspace (`1fr`) and right contextual block region (`340px–360px`).
- **Tablet (1024px):** Navigation drawer collapses to off-canvas slide-out menu. Grid cards scale to 2-column. Right block regions stack neatly below primary workflow.
- **Mobile (390px):** Single-column vertical stacking. Minimum touch targets `44px x 44px`. All form controls and search buttons expand to `100%` width. Zero horizontal overflow.

---

## 6. Accessibility Checklist

- [x] Text color contrast meets WCAG 2.1 AA (Body text `#334155` on `#FFFFFF` = 7.1:1; Headings `#0F172A` on `#FFFFFF` = 15.6:1).
- [x] Focus indicators are explicit with `2px solid #1D4ED8` and `1px` offset.
- [x] All uppercase labels enforce `letter-spacing: 0.08em` for reading clarity.
- [x] Form controls feature explicit `aria-label` or `<label>` elements.
- [x] Color is never used as the sole indicator of state (badges include text labels and borders).

---

## 7. Design System Governance & Certainty Classification

To maintain strict operational rigor, all elements of the Acuitey LMS design system are governed by four distinct levels of certainty:

### 7.1 CONFIRMED DESIGN RULES (Approved Canonical Standards)
- **Palette:** Oxford Navy (`#0C192C`), Action Cobalt (`#1D4ED8`), Slate/Stone canvas neutrals (`#F9FAFB`, `#FFFFFF`, `#F3F4F6`), and hairline borders (`#E5E7EB`).
- **Surface Styling:** Zero multi-stop gradients, zero rainbow KPI cards, zero heavy drop shadows. Surfaces remain solid with subtle 1px border articulation.
- **Typography:** `Inter` for all UI text, `JetBrains Mono` for course codes, timestamps, queue counts, and tabular numerals. Minimum `letter-spacing: 0.08em` on all uppercase selectors.
- **Moodle Architecture Alignment:** Zero Moodle core modifications, no client-side SPA replacements, Boost child theme structure (`theme_acuitey`), and supported plugin boundary (`local_acuitey`).
- **Responsive Standards:** 1440px desktop, 1024px tablet, and 390px mobile with minimum 44px practical touch targets.

### 7.2 PROPOSED IMPLEMENTATION (Architectural Recommendations Pending Build Phase)
- **Theme Templates:** `theme_acuitey/templates/` (`frontpage_hero.mustache`, `course_card.mustache`, `student_dashboard.mustache`, `faculty_dashboard.mustache`, etc.).
- **Plugin Templates:** `local_acuitey/templates/` (`allocation_queue.mustache`, `allocation_request.mustache`, `faculty_availability.mustache`, `assigned_students.mustache`, `reassignment_dialog.mustache`).
- **Course Custom Fields:** `discipline_category`, `academic_level`, `term_duration` via Moodle `core_customfield`.
- **Proposed Workflow States:** `Waiting for Faculty`, `Offered to Faculty`, `Accepted`, `Assigned`, `Reassignment Requested`, `Escalated for Manual Review`, `Closed / Completed`.
- **Proposed Capabilities:** `local/acuitey:viewallocations`, `local/acuitey:acceptallocation`, `local/acuitey:requestreassignment`, `local/acuitey:viewassignedstudents`, `local/acuitey:updateavailability`.

### 7.3 SAMPLE DATA (Prototype-Only Demonstrations)
- Numerical metrics, student rosters, faculty rosters, supervisor workload figures (e.g. `14 / 20 Allocated Students`), timestamps, and announcement banners.
- Must always carry an explicit `[SAMPLE DATA]` or `[PROTOTYPE SAMPLE DATA]` label in user-facing mockups.

### 7.4 CLIENT CONFIRMATION REQUIRED (Open Business & Technical Decisions)
1. **Supervisor Capacity Rules:** Whether capacity ceilings are set globally, per academic department, or individually per faculty member.
2. **Offer Expiry & Reassignment:** Duration for candidate response before expiration, candidate selection ordering, and maximum reassignments before academic administrator escalation.
3. **Certificate Generation:** Technical subsystem choice (Moodle core badges, `mod_customcert`, or external credentialing service).
4. **Live Video Conferencing:** Zoom LTI 1.3 account licensing, single sign-on parameters, and whether attendance logging is supported by the provisioned account.
5. **Payment Gateway Integration:** Payment gateway merchant accounts (Razorpay, PhonePe, Stripe) and commercial fee schedules.

