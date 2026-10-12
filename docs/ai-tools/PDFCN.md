# pdfcn Integration Guide

## Overview

[pdfcn](https://github.com/shadcn-labs/pdfcn) is installed project-locally in this workspace. It provides customizable React PDF components and production-ready document blocks built on **Takumi** and **Forme**.

## Project Locations

- **Agent Skill**: [`.agents/skills/pdfcn/SKILL.md`](file:///c:/Users/Atul/Desktop/moodle/.agents/skills/pdfcn/SKILL.md)
- **Local Registry Components**: [`.agents/skills/pdfcn/registry/`](file:///c:/Users/Atul/Desktop/moodle/.agents/skills/pdfcn/registry)
- **Component & Block Docs**: [`.agents/skills/pdfcn/references/`](file:///c:/Users/Atul/Desktop/moodle/.agents/skills/pdfcn/references)
- **Registry Publisher Skill**: [`.agents/skills/launch-shadcn-registry/SKILL.md`](file:///c:/Users/Atul/Desktop/moodle/.agents/skills/launch-shadcn-registry/SKILL.md)

---

## Supported Renderers

- **Takumi**: High performance layout engine with SVG & WebAssembly rendering.
- **Forme**: Native React layout primitives based on `@formepdf/react`.

---

## Quick Installation of Components

When working with React in this project, configure `components.json`:
```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "registries": {
    "@pdfcn": "https://pdfcn.dev/r/{name}.json"
  }
}
```

Add components or blocks using standard `shadcn` commands:
```bash
# Add a Takumi Minimal Invoice Block
npx shadcn@latest add @pdfcn/takumi/invoice-minimal

# Add a Forme Certificate Block
npx shadcn@latest add @pdfcn/forme/gift-certificate

# Add Individual Primitives
npx shadcn@latest add @pdfcn/takumi/table
npx shadcn@latest add @pdfcn/takumi/qrcode
```
