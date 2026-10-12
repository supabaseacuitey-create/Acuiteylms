# Graphify Knowledge Graph in Moodle

## Overview

[Graphify](https://github.com/vitali87/code-graph-rag) (via `graphifyy`) is configured locally for this Moodle project. It creates a holistic, high-level knowledge graph capturing architecture, subsystem interactions, database schema definitions, configuration files, and documentation.

## Roles & Separation of Responsibilities

In this Moodle workspace, **Graphify** and **Code-Graph-RAG** complement each other without overlapping or conflicting:

| Capability | Tool | Purpose |
| :--- | :--- | :--- |
| **Deep PHP Code Intelligence** | **Code-Graph-RAG** (`cgr`) | Function & class symbol resolution, callers/callees tracing, AST-level dead-code and duplicate-code detection, surgical code modifications. |
| **Architectural Knowledge Graph** | **Graphify** (`graphify`) | High-level Moodle architecture, subsystem boundaries, documentation (`.md`, `.rst`, `.txt`), SQL/schema definitions, PDFs, business requirements, and multi-file relationship maps. |

---

## Output Location

Graph generation produces files in the project-local directory:
```
graphify-out/
├── graph.html          # Interactive D3 visualization of the knowledge graph
├── graph.json          # Complete GraphRAG-ready JSON dataset
└── GRAPH_REPORT.md     # Natural-language architectural report and community summaries
```

*(Note: `graphify-out/` is ignored by Git to avoid committing generated graph artifacts).*

---

## How to Build the Graph

To build the project knowledge graph using the local virtual environment:

```powershell
.\.venv\Scripts\graphify.exe .
```

To run a fast code-and-document extraction excluding heavy external folders:
```powershell
.\.venv\Scripts\graphify.exe extract .
```

---

## How to Query the Graph

When `graphify-out/graph.json` has been generated, query it directly via CLI:

* **Natural language query:**
  ```powershell
  .\.venv\Scripts\graphify.exe query "How does authentication flow in this Moodle instance?"
  ```
* **Find shortest relationship path between two concepts:**
  ```powershell
  .\.venv\Scripts\graphify.exe path "auth_plugin" "user_enrolment"
  ```
* **Explain a specific node or subsystem:**
  ```powershell
  .\.venv\Scripts\graphify.exe explain "moodle_database"
  ```

---

## How to Rebuild or Update the Graph

* **Incremental update after changes:**
  ```powershell
  .\.venv\Scripts\graphify.exe update .
  ```
* **Full re-extraction:**
  ```powershell
  .\.venv\Scripts\graphify.exe extract . --force
  ```
* **Recalculate communities only:**
  ```powershell
  .\.venv\Scripts\graphify.exe . --cluster-only
  ```
