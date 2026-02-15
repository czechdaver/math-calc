# Gemini & Antigravity Navigation Map

> **Purpose:** This document serves as the central navigation hub for Gemini and Antigravity agents working on the **MathCalc Pro** project. It maps all key documentation and context files to ensure efficient context retrieval and adherence to project standards.

## 🧭 Master Navigation

### 👑 Core Instructions (READ FIRST)

- **[`CLAUDE.md`](./CLAUDE.md)** – **MASTER INSTRUCTION FILE**.
    - *Contains:* Project identity, monetization strategy (CRITICAL), monetization rules, technical stack, language strategy, folder structure, core tech patterns, and AI instructions.
    - *Action:* **Read this first** before starting any task to align with the project's strict business and technical goals.

### 📜 Key Documentation (`docs/`)

The `docs/` directory contains detailed specifications and guides. `docs/README.md` is the human-readable index.

#### 🏗️ Architecture & Planning
- **[`docs/target-architecture.md`](docs/target-architecture.md)** – The blueprint for the desired state of the application. Use this to guide refactoring and new feature implementation.
- **[`docs/architecture.md`](docs/architecture.md)** – Current architectural documentation.
- **[`docs/code-analysis.md`](docs/code-analysis.md)** – Deep dive into the codebase state, useful for understanding legacy vs. new patterns.
- **[`docs/DEFINITION_OF_DONE.md`](docs/DEFINITION_OF_DONE.md)** – **CHECKLIST**. The strict criteria for declaring a task "done". Referenced heavily in `CLAUDE.md`.

#### 🛠️ Development & Implementation
- **[`docs/calculator-template.md`](docs/calculator-template.md)** – Template for creating new calculators. Follow this exactly.
- **[`docs/refactoring-tracker.md`](docs/refactoring-tracker.md)** – Tracks progress of refactoring legacy calculators to the new `SimpleCalculatorLayout` pattern.
- **[`docs/refactoring-guide.md`](docs/refactoring-guide.md)** – Step-by-step guide on how to refactor.
- **[`docs/development/`](docs/development/)** – General development guides and troubleshooting.
- **[`docs/getting-started/`](docs/getting-started/)** – Installation and setup.

#### 🎨 Design & UX
- **[`docs/design/`](docs/design/)** – Style guides, layouts, and UI component definitions.

#### 📚 Reference & Requirements
- **[`docs/requirements/`](docs/requirements/)** – Business and technical specifications.
- **[`docs/reference/`](docs/reference/)** – Coding standards, testing guides, and API docs.

---

## 🤖 Rules for Reading & Context Retrieval

1.  **Always Start with `CLAUDE.md`**: It is the source of truth for *strategy* and *priorities* (especially monetization and SEO).
2.  **Consult `DEFINITION_OF_DONE.md`** before finishing any task to ensure all criteria (SEO, styles, functionality) are met.
3.  **For Refactoring**: Cross-reference `docs/target-architecture.md` (goal) with `docs/refactoring-tracker.md` (status) and `docs/code-analysis.md` (context).
4.  **For New Features**: Use `docs/calculator-template.md` as the boilerplate.
5.  **Localization**: `CLAUDE.md` contains the specific rules for the 5 supported languages (cs, en, sk, pl, hu). Do not guess; follow the defined strategy.
6.  **Navigation**: Use this file (`gemini.md`) to quickly find the specific detailed documentation you need without traversing the whole tree every time.
