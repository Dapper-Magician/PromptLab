# PromptLab: A Living Development Context & Strategic Guide (v3)

## 1. Meta-Context & Guiding Principles

### 1.1. Document Purpose: The Single Source of Truth
This document's primary function is to serve as a **lossless to near-lossless contextual knowledge base and memory store** for the entirety of the PromptLab project. It is a living charter, not a static summary. It must be updated continuously and comprehensively after each development session. Upon reading, any developer (human or AI) must have a complete, nuanced, and actionable understanding of the project's vision, history, technical architecture, current status, and future trajectory, leaving next to no questions unanswered. Anathema to this purpose is any simplification, truncation, or summarization that results in the loss of pertinent information or context.

### 1.2. The North Star: The IDE for Prompt Engineering
The ultimate, unwavering goal is to architect and build PromptLab into a **state-of-the-art, personal Prompt Engineering Integrated Development Environment (IDE)**. This is the project's "North Star." Every feature, design choice, and technical implementation must be evaluated against this standard of excellence. The guiding analogy is to create the **"VSCode equivalent for Prompt Engineers,"** implying a cohesive, integrated environment that supports the full workflow of prompt creation, testing, debugging, versioning, and management, rather than a simple collection of disparate tools.

### 1.3. The Original Vision: The Manus Prompt
The original vision document (`promptlab-orig-vision-notes.md`) is the foundational and constitutional charter for this project. It is the primary source for all feature requirements and design philosophies.

*   **Standing Directive:** Before the design or implementation of any major new feature, the original vision document will be reviewed to ensure perfect alignment with its intent.

### 1.4. The Development Methodology
To ensure all new implementations are cohesive and sophisticated, we will adhere to the following five-phase development process for every significant feature:

1.  **Phase I: Conceptualization & Vision Alignment:** Review the original vision document and this `GEMINI.md` file to establish the feature's core purpose.
2.  **Phase II: Architectural Design:** Propose a detailed technical architecture (data models, API endpoints, frontend components).
3.  **Phase III: UI/UX Design Specification:** Create a detailed, text-based "paper prototype" of the UI/UX for review and approval.
4.  **Phase IV: Implementation:** Execute development based on the approved designs.
5.  **Phase V: Verification & Refinement:** Thoroughly test, debug, and apply aesthetic/UX polish.

## 2. Full Technical Specification & Current State (As of September 27, 2025)

*   **Status:** **Stable.** The application is fully operational with core CRUD functionality, robust error handling, a themeing system, and an MVP of the Testing Workbench. All critical build, proxy, and runtime errors have been resolved.
*   **Stack:**
    *   **Backend:**
        *   **Framework:** Flask `3.0.0` - Serves the RESTful API and the frontend application.
        *   **Database:** SQLite via Flask-SQLAlchemy `3.1.1` and SQLAlchemy `2.0.43`. Provides the object-relational mapping (ORM) for all data persistence.
        *   **CORS:** Flask-CORS `4.0.0` - Manages cross-origin requests between the frontend and backend during development.
        *   **Environment:** Python `3.13` running in a `venv` virtual environment to manage dependencies.
    *   **Frontend:**
        *   **Framework:** React `18.2.0` with Vite `5.0.0` - Provides the core component-based UI and a fast development server.
        *   **UI Library:** `shadcn/ui` - A component library built on Radix UI primitives and styled with Tailwind CSS, providing the core UI elements like `Button`, `Card`, `Select`, etc.
        *   **Styling:** Tailwind CSS `3.3.5` with `postcss` `8.4.31` for utility-first CSS.
        *   **Notifications:** `sonner` - A non-blocking "toast" notification library for user feedback.
        *   **Routing:** `react-router-dom` `6.20.1` - Manages all client-side navigation.
        *   **Icons:** `lucide-react` `0.294.0` - Provides the clean, modern icon set used throughout the application.

## 3. Project History & Key Decisions Log

*   **Session 1: Stabilization.**
    *   **Initial State:** Non-functional codebase with missing dependencies, entry points, and correct file structures. Suffered from multiple build and runtime errors.
    *   **Key Actions:** Re-structured entire project into conventional `/src` directories for frontend and backend; created all necessary configuration files (`package.json`, `vite.config.js`, etc.); installed all dependencies; initialized `shadcn/ui`; created missing database models; resolved Python/SQLAlchemy version conflicts; configured Vite proxy.
    *   **Outcome:** A fully stable, runnable application.
*   **Session 2: Core Experience Implementation.**
    *   **Key Actions:** Implemented global error handling with `sonner` toasts. Implemented a persistent light/dark theme system with a `ThemeProvider`. Built the MVP of the Testing Workbench, replacing the placeholder with a functional UI connected to the backend.
    *   **Outcome:** Core user experience dramatically improved. The application is now robust and provides a foundation for its primary "IDE" features.

## 4. Master Feature Compendium & Blueprints

This section is the unabridged realization of the project vision, documenting every major feature.

### 4.1. The Testing Workbench
*   **Core Vision (from `promptlab-orig-vision-notes.md`):** "A testing workbench which can spawn multiple tabs with a single chat entry field which allows multiple simultaneous streaming conversations with different models (or the same model) for testing, with token counts. There also is a tab that works as a browser that specifically leads to the web platforms of Chatgpt, Claude, Google Ai Studio, Groq, and Llama... the point is to see how prompts react side by side."
*   **Philosophical Goal (IDE Analogy):** This is the **Debugger** for prompts.
*   **Current Status:** **MVP Complete.** A single-panel chat interface is functional and correctly saves test sessions to the backend. Prompt selection is operational. AI responses are currently mocked.
*   **Detailed Roadmap:**
    1.  **UI Overhaul:** Redesign the main panel to support a resizable, multi-column grid for side-by-side model comparison.
    2.  **Advanced Configuration:** Enhance the sidebar with collapsible sections for multi-selecting models and setting global/per-model parameters (temperature, etc.).
    3.  **Live API Integration:** Implement logic for streaming API calls to external models, with a secure system for managing API keys.
    4.  **Rich Response Metadata:** Augment each AI response with a footer displaying token counts, response time, and estimated cost.

### 4.2. The Prompt Versioning System
*   **Core Vision (from `promptlab-orig-vision-notes.md`):** "It also has versioning control... an extensive design step which covers baseline architecture + design, advanced implementation, refinements and heightened quality of life features (such as automatic version naming which can be manually edited amongst a plethora of other features, of course) will be imperative..."
*   **Philosophical Goal (IDE Analogy):** This is the **Integrated Source Control** (like Git), providing history, comparison, and revert capabilities directly within the editor.
*   **Current Status:** **Dormant.** The backend data model (`parent_id` relationship) and API endpoint (`/api/prompts/<id>/versions`) exist. The UI has zero awareness of this feature.
*   **Development Note:** This feature is of paramount importance and **must** undergo our full, formal **Development Methodology**, starting with an extensive design phase.

### 4.3. Espanso-like Text Expansion
*   **Core Vision (from `promptlab-orig-vision-notes.md`):** "It has an Espanso like feature that allows designated custom inputs to automatically transform thus allowing quick shortcuts for faster input, whether single lines, full prompts, icons or emojis..."
*   **Philosophical Goal (IDE Analogy):** This is the **Code Snippets and Autocompletion** feature, tailored for prompt engineering.
*   **Current Status:** **Concept Only.**

### 4.4. AI-Powered Conversation Analysis
*   **Core Vision (from `promptlab-orig-vision-notes.md`):** "...a feature that easily allows the conversation to be analyzed by AI... to structure a report and even have inbuilt function calls that perform operations that can calculate costs... calculate context drift and semantic drift..."
*   **Philosophical Goal (IDE Analogy):** This is the **Static Analysis and AI-Assisted Debugging** tool.
*   **Current Status:** **Dormant.** The backend has a placeholder analysis endpoint.

### 4.5. Advanced Command Palette
*   **Core Vision (from `promptlab-orig-vision-notes.md`):** "a stateful multi-section Command Palette that can allow stored prompts to be selected and sent to a side display connected to the Command Palette (CP) so that the User can continually search for prompts, select them, and then continue to search..."
*   **Philosophical Goal (IDE Analogy):** This is the **Integrated Terminal & Command Interface**.
*   **Current Status:** **Under-realized.** The current implementation is a basic search-and-select modal.

### 4.6. Full Feature List from Vision Document
This list captures all other concepts to ensure nothing is lost. All are currently **Concept Only.**
*   **Data Portability & Integrations:** Connections to Git/GitHub, Google Drive, Notion, Evernote, Obsidian.
*   **Customizable Clipboard:** A UI element to store and manage multiple lines or snippets from various prompts.
*   **Dynamic Sidebar:** A customizable sidebar area for frequently used prompts.
*   **Message "Scooping":** A UX feature to instantly save any chat message as a new prompt.
*   **Multi-Turn Automated Testing:** A system to script and automate full conversations for consistency testing.
*   **Benchmark Platform:** A library of pre-built test suites to rigorously evaluate models.
*   **Data & Analytics Dashboard:** A full-featured reporting and data visualization page.
*   **AI-Powered Template Autofill:** Using an AI call to intelligently fill in the variables in a `PromptTemplate`.

---
This document will be our guide.