# OpenDesign Integration Guide

## Overview

[OpenDesign](https://github.com/nexu-io/open-design) is installed locally on Windows as a standalone design engine and local-first desktop application. It exposes an MCP (Model Context Protocol) server that connects to Antigravity without adding runtime dependencies or source code to the Moodle workspace.

---

## Tooling Architecture

- **Desktop Application**: Installed under `C:\Users\Atul\AppData\Local\Programs\Open Design\Open Design.exe`
- **CLI Executable**: `od` (mapped to `C:\Users\Atul\AppData\Local\Programs\Open Design\od.cmd` and `C:\Users\Atul\.local\bin\od.cmd`)
- **MCP Server Registration**:
  - `C:\Users\Atul\.gemini\antigravity\mcp_config.json`
  - `C:\Users\Atul\.gemini\antigravity-ide\mcp_config.json`
- **Workspace Status**: Zero runtime files inside `C:\Users\Atul\Desktop\moodle`. All existing Moodle code and project tools (`Code-Graph-RAG`, `Graphify`, `diagram-design`, `pdfcn`) remain intact and isolated.

---

## Starting OpenDesign

OpenDesign operates locally with an embedded daemon.

To start OpenDesign:
- **Desktop UI**: Launch **Open Design** from the Start Menu or run:
  ```powershell
  Start-Process "C:\Users\Atul\AppData\Local\Programs\Open Design\Open Design.exe"
  ```
- **Headless Daemon**: Run via CLI:
  ```powershell
  od --no-open
  ```
  *(Default web interface binds to `http://127.0.0.1:7456`)*

---

## How Antigravity Connects

Antigravity invokes OpenDesign via its stdio MCP server proxy:
```json
"open-design": {
  "command": "od",
  "args": [
    "mcp",
    "--daemon-url",
    "http://127.0.0.1:7456"
  ]
}
```

When connected, OpenDesign provides tools to:
- Read active design context (`get_artifact`, `get_project`, `get_file`, `search_files`, `list_files`)
- Create and modify artifacts (`create_artifact`, `write_file`)
- Commission design runs (`start_run`, `get_run`, `cancel_run`)
- Access design system specifications via MCP resources (`od://design-systems/<id>/DESIGN.md`)

---

## Verifying the Connection

1. **Verify CLI availability**:
   ```powershell
   where.exe od
   od --help
   ```

2. **Verify MCP server response**:
   Test the MCP protocol handshake via stdio:
   ```powershell
   '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"1.0.0"}}}' | od mcp --daemon-url http://127.0.0.1:7456
   ```

---

## Intended Usage for Acuitey LMS

OpenDesign is designated strictly for visual design, frontend UX exploration, and prototype generation:

### Permitted Uses
- **Acuitey LMS Homepage Concepts**: Landing page aesthetics, modern layout treatments, and branding exploration.
- **Student Dashboard Concepts**: Course overview widgets, progress indicators, upcoming deadline cards, and responsive navigation.
- **Faculty Dashboard Concepts**: Grading overview panels, student engagement analytics views, and course management layouts.
- **Course Catalogue UI**: Course card designs, search/filtering components, and course detail preview cards.
- **Moodle Theme Visual Design**: Color systems, typography scales, spacing tokens, and component styling.
- **Client-Facing Prototypes**: HTML/CSS/SVG interactive visual prototypes and design direction decks.

### Strictly Out of Scope
- Modifying Moodle core PHP files or database schemas.
- Backend routing engine or authentication logic.
- Technical architecture diagrams (handled by `diagram-design`).
- Codebase AST symbol search and deep dependency traversal (handled by `Code-Graph-RAG`).
- Structural documentation knowledge graphs (handled by `Graphify`).
- Formal editorial PDF deliverables (handled by `pdfcn`).
