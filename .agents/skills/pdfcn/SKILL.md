---
name: pdfcn
description: Design, build, and customize editorial PDF documents in React using pdfcn components and blocks built on Takumi and Forme. Use for creating invoices, reports, certificates, receipts, tickets, data tables, and structured documents.
license: MIT
metadata:
  version: "1.0.0"
---

# pdfcn: PDF Components & Blocks for React

`pdfcn` is an open-source, customizable PDF component ecosystem built for React on top of **Takumi** and **Forme**, following the `shadcn/ui` registry architecture.

## Supported Renderers

`pdfcn` supports two modern PDF rendering engines:

1. **Takumi** (`@pdfcn/takumi/*`): High-performance layout engine with SVG & WebAssembly rendering.
2. **Forme** (`@pdfcn/forme/*`): React-first PDF primitives built on `@formepdf/react`.

---

## 1. Registry Setup

To use `@pdfcn` in a React project, add the registry to `components.json`:

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "registries": {
    "@pdfcn": "https://pdfcn.dev/r/{name}.json"
  }
}
```

---

## 2. Component Installation

Install individual components using the `shadcn` CLI:

### Takumi Components
```bash
# Core primitives
npx shadcn@latest add @pdfcn/takumi/text
npx shadcn@latest add @pdfcn/takumi/heading
npx shadcn@latest add @pdfcn/takumi/table
npx shadcn@latest add @pdfcn/takumi/card
npx shadcn@latest add @pdfcn/takumi/data-table
npx shadcn@latest add @pdfcn/takumi/qrcode
npx shadcn@latest add @pdfcn/takumi/signature
npx shadcn@latest add @pdfcn/takumi/page-header
npx shadcn@latest add @pdfcn/takumi/page-footer
npx shadcn@latest add @pdfcn/takumi/page-number
```

### Forme Components
```bash
# Core primitives
npx shadcn@latest add @pdfcn/forme/text
npx shadcn@latest add @pdfcn/forme/heading
npx shadcn@latest add @pdfcn/forme/table
npx shadcn@latest add @pdfcn/forme/card
npx shadcn@latest add @pdfcn/forme/data-table
npx shadcn@latest add @pdfcn/forme/qrcode
npx shadcn@latest add @pdfcn/forme/signature
npx shadcn@latest add @pdfcn/forme/page-header
npx shadcn@latest add @pdfcn/forme/page-footer
npx shadcn@latest add @pdfcn/forme/page-number
```

---

## 3. Prebuilt Blocks & Document Templates

Install entire production-ready document layouts:

| Document Type | Takumi Command | Forme Command |
| :--- | :--- | :--- |
| **Minimal Invoice** | `npx shadcn@latest add @pdfcn/takumi/invoice-minimal` | `npx shadcn@latest add @pdfcn/forme/invoice-minimal` |
| **Modern Invoice** | `npx shadcn@latest add @pdfcn/takumi/invoice-modern` | `npx shadcn@latest add @pdfcn/forme/invoice-modern` |
| **Corporate Invoice** | `npx shadcn@latest add @pdfcn/takumi/invoice-corporate` | `npx shadcn@latest add @pdfcn/forme/invoice-corporate` |
| **Financial Report** | `npx shadcn@latest add @pdfcn/takumi/report-financial` | `npx shadcn@latest add @pdfcn/forme/report-financial` |
| **Operations Report** | `npx shadcn@latest add @pdfcn/takumi/report-operations` | `npx shadcn@latest add @pdfcn/forme/report-operations` |
| **Gift Certificate** | `npx shadcn@latest add @pdfcn/takumi/gift-certificate` | `npx shadcn@latest add @pdfcn/forme/gift-certificate` |
| **Event Ticket** | `npx shadcn@latest add @pdfcn/takumi/event-ticket` | `npx shadcn@latest add @pdfcn/forme/event-ticket` |
| **Shipping Label** | `npx shadcn@latest add @pdfcn/takumi/shipping-label` | `npx shadcn@latest add @pdfcn/forme/shipping-label` |
| **Medical Intake Form**| `npx shadcn@latest add @pdfcn/takumi/medical-intake-form` | `npx shadcn@latest add @pdfcn/forme/medical-intake-form` |

---

## 4. Usage Pattern

```tsx
import { Document, Page } from "@/components/pdf/pdf-primitives";
import { PdfcnThemeProvider } from "@/components/pdf/theme-provider";
import { Heading } from "@/components/pdf/heading";
import { Text } from "@/components/pdf/text";
import { Table } from "@/components/pdf/table";
import { PageHeader } from "@/components/pdf/page-header";
import { PageFooter } from "@/components/pdf/page-footer";

export function StudentReport({ studentName, courses }: StudentReportProps) {
  return (
    <Document>
      <Page size="A4">
        <PdfcnThemeProvider theme="modern">
          <PageHeader title="Moodle Learning Management System" />
          
          <Heading level={1}>Academic Transcript</Heading>
          <Text variant="muted">Student: {studentName}</Text>
          
          <Table>
            {/* Table rows */}
          </Table>

          <PageFooter />
        </PdfcnThemeProvider>
      </Page>
    </Document>
  );
}
```

---

## 5. Themes

`pdfcn` provides curated theme palettes:
- `minimal`, `modern`, `corporate`, `executive`, `professional`
- `blueprint`, `elegant`, `forest`, `vivid`

---

## 6. Local References & Source Files

* Component & Block Docs: `.agents/skills/pdfcn/references/`
* Full Component TypeScript Source: `.agents/skills/pdfcn/registry/`
* Registry Manifest: `.agents/skills/pdfcn/registry/registry.json`
