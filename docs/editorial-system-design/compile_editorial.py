import os
import re

DIAGRAMS_DIR = "docs/editorial-system-design/diagrams"
OUTPUT_HTML = "docs/editorial-system-design/index.html"

pages_config = [
    {
        "file": "01-system-architecture.html",
        "eyebrow": "ACUITEY SOLUTIONS LMS · SYSTEM DESIGN ARCHITECTURE",
        "title": "Enterprise System Architecture &amp; Topology",
        "subtitle": "High-concurrency open architecture, native Moodle core extension framework, and proposed cloud topology.",
        "page_num": "01",
        "page_str": "PAGE 01 OF 09"
    },
    {
        "file": "02-student-experience.html",
        "eyebrow": "ACUITEY SOLUTIONS LMS · LEARNER EXPERIENCE",
        "title": "Student User Journey &amp; Attainment Lifecycle",
        "subtitle": "Nine-stage progressive lifecycle from public catalog discovery to automated digital certification.",
        "page_num": "02",
        "page_str": "PAGE 02 OF 09"
    },
    {
        "file": "03-faculty-routing.html",
        "eyebrow": "ACUITEY SOLUTIONS LMS · CORE ROUTING ENGINE",
        "title": "Automated Dynamic Faculty Routing Engine",
        "subtitle": "Multi-factor concurrent evaluation pipeline: specialization, capability, availability, workload, and fallback.",
        "page_num": "03",
        "page_str": "PAGE 03 OF 09"
    },
    {
        "file": "04-moodle-extension-architecture.html",
        "eyebrow": "ACUITEY SOLUTIONS LMS · PLATFORM ARCHITECTURE",
        "title": "Moodle Extension Architecture &amp; Subsystem Boundary",
        "subtitle": "Strict isolation of custom Acuitey logic within local_acuitey; Moodle 5.2 core code remains 100% untouched.",
        "page_num": "04",
        "page_str": "PAGE 04 OF 09"
    },
    {
        "file": "05-role-security.html",
        "eyebrow": "ACUITEY SOLUTIONS LMS · SECURITY &amp; GOVERNANCE",
        "title": "Role &amp; Security Model (Least Privilege Perimeter)",
        "subtitle": "Spatial access control and capability matrix across five user personas and seven protected resource domains.",
        "page_num": "05",
        "page_str": "PAGE 05 OF 09"
    },
    {
        "file": "06-payment-enrolment.html",
        "eyebrow": "ACUITEY SOLUTIONS LMS · COMMERCE INTEGRATION",
        "title": "Dual Payment Gateway Architecture &amp; Enrolment Flow",
        "subtitle": "Razorpay and PhonePe integration via core_payment with mandatory server-side signature and status verification.",
        "page_num": "06",
        "page_str": "PAGE 06 OF 09"
    },
    {
        "file": "07-zoom-lti.html",
        "eyebrow": "ACUITEY SOLUTIONS LMS · SYNCHRONOUS COLLABORATION",
        "title": "Zoom LTI 1.3 Advantage Integration Architecture",
        "subtitle": "Cryptographic OIDC handshake, NRPS roster provisioning, and conditional attendance synchronization.",
        "page_num": "07",
        "page_str": "PAGE 07 OF 09"
    },
    {
        "file": "08-deployment-architecture.html",
        "eyebrow": "ACUITEY SOLUTIONS LMS · INFRASTRUCTURE TOPOLOGY",
        "title": "Proposed Production Deployment &amp; Infrastructure Topology",
        "subtitle": "Proposed Cloudflare Edge, Hostinger KVM, managed PostgreSQL, Redis cache, and telemetry layers.",
        "page_num": "08",
        "page_str": "PAGE 08 OF 09"
    },
    {
        "file": "09-implementation-roadmap.html",
        "eyebrow": "ACUITEY SOLUTIONS LMS · ROADMAP &amp; GOVERNANCE",
        "title": "Implementation Roadmap &amp; Architecture Confirmation",
        "subtitle": "Eight-stage engineering delivery roadmap and formally confirmed institutional architecture declarations.",
        "page_num": "09",
        "page_str": "PAGE 09 OF 09"
    }
]

html_head = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Acuitey Solutions LMS - Initial System Design &amp; Architecture (Editorial Edition)</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    @page {
      size: A4 landscape;
      margin: 0;
    }
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    :root {
      --color-paper:   #F7F7F5;
      --color-ink:     #252B36;
      --color-muted:   #657080;
      --color-accent:  #EF6A3A;
      --color-link:    #315FA8;
      --font-sans:     'Geist', system-ui, -apple-system, sans-serif;
      --font-serif:    'Instrument Serif', Georgia, serif;
      --font-mono:     'Geist Mono', ui-monospace, monospace;
    }
    html, body {
      background: #EAEAE6;
      color: var(--color-ink);
      font-family: var(--font-sans);
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    .page {
      width: 297mm;
      height: 210mm;
      margin: 0 auto 20px auto;
      background: var(--color-paper);
      padding: 10mm 14mm 8mm 14mm;
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      page-break-after: always;
      page-break-inside: avoid;
      box-shadow: 0 4px 20px rgba(0,0,0,0.06);
    }
    @media print {
      body {
        background: transparent;
      }
      .page {
        margin: 0;
        box-shadow: none;
        width: 297mm;
        height: 210mm;
        page-break-after: always;
      }
    }
    /* Editorial Page Header */
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 1px solid rgba(37,43,54,0.15);
      padding-bottom: 6px;
      margin-bottom: 6px;
    }
    .header-left {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .header-eyebrow {
      font-family: var(--font-mono);
      font-size: 7.5pt;
      font-weight: 600;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      color: var(--color-muted);
    }
    .header-title-row {
      display: flex;
      align-items: baseline;
      gap: 12px;
    }
    .header-title {
      font-family: var(--font-serif);
      font-size: 19pt;
      font-weight: 400;
      color: var(--color-ink);
      line-height: 1.1;
      letter-spacing: -0.01em;
    }
    .header-subtitle {
      font-family: var(--font-sans);
      font-size: 8.5pt;
      color: var(--color-muted);
    }
    .header-right {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .header-badge {
      font-family: var(--font-mono);
      font-size: 7pt;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      padding: 3px 8px;
      border-radius: 2px;
      background: rgba(37,43,54,0.06);
      color: var(--color-ink);
      border: 0.8px solid rgba(37,43,54,0.14);
    }
    .header-section-num {
      font-family: var(--font-mono);
      font-size: 20pt;
      font-weight: 700;
      color: rgba(37,43,54,0.15);
      line-height: 1;
    }
    /* Diagram Container */
    .diagram-stage {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      min-height: 0;
    }
    .diagram-stage svg {
      width: 100%;
      height: 100%;
      max-height: 168mm;
      display: block;
    }
    /* Editorial Page Footer */
    .page-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 1px solid rgba(37,43,54,0.15);
      padding-top: 5px;
      margin-top: 4px;
      font-family: var(--font-mono);
      font-size: 7pt;
      color: var(--color-muted);
      letter-spacing: 0.08em;
    }
    .footer-left {
      color: var(--color-ink);
      font-weight: 600;
    }
    .footer-center {
      text-transform: uppercase;
    }
    .footer-right {
      color: var(--color-ink);
      font-weight: 600;
    }
  </style>
</head>
<body>
"""

pages_html = []

for cfg in pages_config:
    file_path = os.path.join(DIAGRAMS_DIR, cfg["file"])
    with open(file_path, "r", encoding="utf-8") as f:
        svg_file_content = f.read()
    
    # Extract the <svg> ... </svg> content
    match = re.search(r'<svg[\s\S]*?</svg>', svg_file_content, re.IGNORECASE)
    if not match:
        raise ValueError(f"No SVG found in {file_path}")
    svg_content = match.group(0)

    page_markup = f"""  <div class="page">
    <div class="page-header">
      <div class="header-left">
        <div class="header-eyebrow">{cfg["eyebrow"]}</div>
        <div class="header-title-row">
          <h1 class="header-title">{cfg["title"]}</h1>
          <span class="header-subtitle">{cfg["subtitle"]}</span>
        </div>
      </div>
      <div class="header-right">
        <span class="header-badge">EDITORIAL SPECIFICATION</span>
        <span class="header-section-num">{cfg["page_num"]}</span>
      </div>
    </div>
    <div class="diagram-stage">
      {svg_content}
    </div>
    <div class="page-footer">
      <span class="footer-left">ACUITEY SOLUTIONS LMS · SYSTEM DESIGN ARCHITECTURE</span>
      <span class="footer-center">MOODLE CORE UNTOUCHED · HOSTINGER KVM · SEPTEMBER 2026</span>
      <span class="footer-right">{cfg["page_str"]}</span>
    </div>
  </div>
"""
    pages_html.append(page_markup)

html_tail = """</body>
</html>
"""

full_html = html_head + "\n".join(pages_html) + html_tail

with open(OUTPUT_HTML, "w", encoding="utf-8") as f:
    f.write(full_html)

print(f"Successfully generated {OUTPUT_HTML} ({len(pages_config)} pages, {len(full_html)} bytes)")
