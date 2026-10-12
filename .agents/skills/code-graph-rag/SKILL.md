---
name: code-graph-rag
description: Codebase RAG using multi-language Tree-sitter parsing and graph analysis. Use to build knowledge graphs, trace call hierarchies, find dead code, locate duplicated code, inspect structural AST deltas, and run RAG queries on the codebase.
license: MIT
---

# Code-Graph-RAG (`cgr`)

Code-Graph-RAG parses code using Tree-sitter, builds a knowledge graph of its structure in Memgraph (or offline protobuf index), and lets you query, trace, edit, and optimize code.

The CLI binary is installed in this project at:
`.\.venv\Scripts\cgr.exe`

## Core Workflows

### 1. Offline Indexing (No Docker/Database required)
Generate an offline protobuf index for this repository without needing a running database:
```powershell
.\.venv\Scripts\cgr.exe index -o ./cgr-index --repo-path .
```

### 2. Dead Code Detection
Detect unreachable functions and methods from entry points:
```powershell
.\.venv\Scripts\cgr.exe dead-code --repo-path .
```

### 3. Duplicate Code Detection
Find duplicate logic and copy-paste code patterns across the codebase:
```powershell
.\.venv\Scripts\cgr.exe duplicates --repo-path .
```

### 4. Interactive Assistant & Graph Ingestion (With Memgraph)
When Docker and Memgraph are running:
```powershell
# Start shared Memgraph + Qdrant stack
.\.venv\Scripts\cgr.exe daemon up

# Parse and open interactive assistant
.\.venv\Scripts\cgr.exe start --repo-path . --update-graph
```

### 5. Check Structural Deltas Against Git Ref
```powershell
.\.venv\Scripts\cgr.exe check --repo-path .
```

### 6. MCP Server
Code-Graph-RAG is configured as an MCP server in `.agents/mcp_config.json`:
```powershell
.\.venv\Scripts\cgr.exe mcp-server
```
Tools provided via MCP:
- `resolve`: Resolve names and locations to qualified symbols.
- `definition`: Inspect definitions, line spans, docstrings, and source.
- `callers` / `callees`: Trace call graphs deterministically.
- `implementors` / `overrides` / `importers`: Type hierarchy and module dependency analysis.
- `query_code_graph`: Natural language code graph queries.
- `ask_agent`: High-level reasoning across graph context.
- `find_duplicate_code`: AST-level clone detection.
- `surgical_replace_code`: AST-preserving precise code edits.
