---
trigger: always_on
description: Consult the graphify knowledge graph at graphify-out/ for codebase and architecture questions.
---

## Tooling Roles: Graphify & Code-Graph-RAG

This project uses both **Code-Graph-RAG** and **Graphify**:
- **Code-Graph-RAG** (`cgr`): Primary source-code intelligence for Moodle PHP code, AST symbol lookup, callers/callees, dependency traversal, dead-code detection, and duplicate-code detection.
- **Graphify**: High-level project knowledge graph, Moodle architecture understanding, documentation, Markdown, configuration files, SQL/schema info, PDFs, API docs, and business requirements.

Rules for Graphify:
- For high-level architecture, subsystem boundaries, documentation, or conceptual questions, when `graphify-out/graph.json` exists, run `.\.venv\Scripts\graphify.exe query "<question>"`.
- Use `.\.venv\Scripts\graphify.exe path "<A>" "<B>"` for conceptual relationships and `.\.venv\Scripts\graphify.exe explain "<concept>"` for focused concepts.
- If `graphify-out/wiki/index.md` exists, navigate it for structural documentation.
- For deep code-level queries, function callers/callees, or AST analysis in PHP, use Code-Graph-RAG tools.
- After modifying files, run `.\.venv\Scripts\graphify.exe update .` to keep the knowledge graph current.
