# PromptLab Design System
**Version 2.0 - State-of-the-Art UI/UX Framework**

## Table of Contents
1. [Design Philosophy](#design-philosophy)
2. [Inspiration & Reference Applications](#inspiration--reference-applications)
3. [Design Principles](#design-principles)
4. [Color System](#color-system)
5. [Typography](#typography)
6. [Spacing & Layout](#spacing--layout)
7. [Components](#components)
8. [Animation & Micro-interactions](#animation--micro-interactions)
9. [Accessibility](#accessibility)
10. [Dark/Light Theme Architecture](#darklight-theme-architecture)
11. [Implementation Technology Stack](#implementation-technology-stack)

---

## Design Philosophy

PromptLab is a **professional-grade IDE for prompt engineering** that combines:
- **Clarity** - Information architecture that makes complex workflows intuitive
- **Efficiency** - Keyboard-first interactions with intelligent shortcuts
- **Beauty** - Aesthetics that inspire creativity and reduce cognitive load
- **Performance** - Fluid animations and instant feedback
- **Consistency** - Unified design language across all features

**Core Metaphor:** A modern code editor meets a creative studio - technical power wrapped in an inspiring interface.

---

## Inspiration & Reference Applications

### 1. Linear (https://linear.app)
**What we learn:**
- **Command Palette Excellence** - Omnipresent ⌘K interface that handles everything
- **Subtle Animations** - Micro-interactions that feel buttery smooth
- **Muted Color Palette** - Professional grays with strategic accent colors
- **Typography Hierarchy** - Clear information architecture through font weights
- **Keyboard Navigation** - Every action accessible via keyboard
- **Status Indicators** - Elegant visual feedback for system state

**Applied to PromptLab:**
- Enhanced command palette for prompt search, creation, navigation
- Smooth transitions between list view and editor
- Professional color scheme with prompt-specific accents
- Clear visual hierarchy in prompt metadata

### 2. Raycast (https://raycast.com)
**What we learn:**
- **Speed & Performance** - Instant response to every interaction
- **Extension Architecture** - Modular design for different features
- **Contextual Actions** - Right action at the right time
- **Visual Density** - Information-rich without feeling cluttered
- **Search-First Interface** - Everything discoverable through search

**Applied to PromptLab:**
- Instant prompt search and filtering
- Modular testing workbench components
- Context-aware prompt actions (test, duplicate, version)
- Compact yet readable prompt cards
- Universal search across all content

### 3. Arc Browser (https://arc.net)
**What we learn:**
- **Sidebar Innovation** - Rethinking traditional navigation
- **Spaces/Contexts** - Organizing work into logical groupings
- **Visual Polish** - Attention to detail in every pixel
- **Gesture Support** - Natural interactions beyond clicks
- **Personality** - Professional but not sterile

**Applied to PromptLab:**
- Collapsible sidebar with categories as "spaces"
- Prompt collections and workspaces
- Polished hover states and transitions
- Smooth expand/collapse animations
- Warm, inviting color accents

### 4. Notion (https://notion.so)
**What we learn:**
- **Flexible Layouts** - Multiple views for same content (list, board, gallery)
- **Inline Editing** - Edit where you see
- **Rich Text Editing** - Markdown-style but visual
- **Database Properties** - Powerful metadata without complexity
- **Templates** - Reusable structures

**Applied to PromptLab:**
- Multiple prompt views (list, cards, table)
- Inline prompt editing in list view
- Rich markdown editor for prompts
- Prompt properties (category, tags, version)
- Template system for reusable prompts

### 5. VS Code (https://code.visualstudio.com)
**What we learn:**
- **Panel Layout** - Sidebar + Editor + Terminal/Output
- **Tab Management** - Multiple files open simultaneously
- **Extension System** - Modular feature architecture
- **Command Palette** - Central command hub
- **Status Bar** - Contextual information always visible

**Applied to PromptLab:**
- Three-panel layout: Sidebar + Editor + Testing Panel
- Multiple prompt tabs
- Modular testing integrations
- Enhanced command palette
- Status bar showing token count, model, status

### 6. Superhuman (https://superhuman.com)
**What we learn:**
- **Keyboard Shortcuts** - Every action has a shortcut
- **Speed as Feature** - Performance is user experience
- **Onboarding** - Teaching power features progressively
- **Animations** - Delightful without being distracting
- **Focus Mode** - Eliminating distractions

**Applied to PromptLab:**
- Comprehensive keyboard shortcuts
- Optimized rendering and caching
- Progressive feature disclosure
- Purposeful animations
- Distraction-free writing mode

### 7. Obsidian (https://obsidian.md)
**What we learn:**
- **Local-First Philosophy** - Data sovereignty and privacy
- **Bidirectional Linking** - Connect related content naturally
- **Graph View** - Visualize relationships between notes
- **Markdown-Native** - Plain text with powerful formatting
- **Plugin Ecosystem** - Extensible through community
- **Daily Notes** - Temporal organization pattern
- **Folder + Tag Hybrid** - Flexible organization
- **Split Panes** - Multiple notes visible simultaneously

**Applied to PromptLab:**
- Local-first data storage (SQLite, no cloud dependency)
- Link prompts together (prompt variations, related prompts)
- Visualize prompt relationships and version trees
- Markdown as primary content format
- Plugin architecture for custom integrations
- Prompt history with timeline view
- Category + tag organization system
- Split-pane editor for prompt + preview

**Coherence with other references:**
- Complements **Notion's** flexibility with local-first approach
- Enhances **VS Code's** file-based nature with backlinking
- Aligns with **Arc's** organizational philosophy (spaces = vaults)

### 8. Msty (https://msty.app)
**What we learn:**
- **Multi-Model Interface** - Seamless switching between AI providers
- **Unified Chat Experience** - Consistent UI across different models
- **Model Comparison** - Side-by-side testing capabilities
- **Provider Management** - Clean API key and settings organization
- **Chat History Persistence** - Save and recall conversations
- **Model-Specific Settings** - Per-model parameter configurations
- **Clean, Minimal UI** - Focus on the conversation
- **Local Model Support** - Integration with local LLMs

**Applied to PromptLab:**
- Multi-provider testing (OpenAI, Anthropic, Google, local)
- Unified testing interface with consistent UX
- Side-by-side model comparison in testing workbench
- Centralized API key management in settings
- Persist all test results with full history
- Per-model default parameters (temperature, max_tokens)
- Distraction-free testing mode
- Support for local model endpoints

**Coherence with other references:**
- Builds on **Raycast's** extension architecture (models as modules)
- Complements **Linear's** clean aesthetic with AI-specific UI
- Extends **VS Code's** multi-tab concept to multi-model testing

### 9. LM Studio (https://lmstudio.ai)
**What we learn:**
- **Model Management UI** - Download, organize, and run local LLMs
- **Performance Monitoring** - Token speed, memory usage, GPU stats
- **Chat Interface Design** - Clean, focused conversation UI
- **Model Parameters** - Intuitive controls for technical settings
- **Server Mode** - Run models as API endpoints
- **Format Support** - Multiple model formats (GGUF, etc.)
- **System Resource Display** - Real-time resource monitoring
- **Conversation Templates** - Reusable chat configurations

**Applied to PromptLab:**
- Model selection UI with capability indicators
- Real-time token counting and cost estimation
- Professional chat interface in testing workbench
- Advanced parameter controls (temperature, top_p, etc.)
- API mode for external integrations
- Support for various AI provider formats
- Performance metrics dashboard
- Prompt templates with parameter presets

**Coherence with other references:**
- Mirrors **VS Code's** extension marketplace (model marketplace)
- Complements **Superhuman's** performance focus with metrics
- Extends **Msty's** multi-model concept with local hosting

### 10. Atom IDE (https://atom.io - legacy)
**What we learn:**
- **Package Ecosystem** - Community-driven extensibility
- **Hackable Core** - Deep customization capabilities
- **Git Integration** - Built-in version control
- **Multiple Panes** - Flexible workspace layout
- **Teletype** - Collaborative editing (historical)
- **File Tree Sidebar** - Classic IDE navigation
- **Fuzzy Finder** - Quick file navigation
- **Themes & Syntax** - Extensive visual customization

**Applied to PromptLab:**
- Plugin system for custom AI integrations
- Deep customization of workflows and UI
- Built-in Git integration for prompt versioning
- Flexible panel arrangement (drag & drop)
- Future: Collaborative prompt editing
- Hierarchical prompt organization tree
- Fuzzy search across all prompts
- Theme marketplace for visual customization

**Coherence with other references:**
- Influenced **VS Code** (many Atom contributors moved to VS Code)
- Shares **Obsidian's** extensibility philosophy
- Complements **Cursor's** AI-first approach with classic IDE patterns

### 11. Cursor IDE (https://cursor.sh)
**What we learn:**
- **AI-Native Editing** - AI suggestions integrated naturally
- **Chat Sidebar** - Contextual AI assistance
- **Inline Diff View** - AI changes shown clearly
- **Codebase Understanding** - AI aware of project context
- **Command K Interface** - AI-powered command palette
- **Multi-File Editing** - AI can edit across files
- **Privacy Controls** - Clear data usage policies
- **Git-Aware AI** - Understands version history

**Applied to PromptLab:**
- AI-assisted prompt refinement (suggest improvements)
- Chat-based prompt generation and editing
- Visual diff for prompt versions
- Context-aware suggestions based on existing prompts
- AI-enhanced command palette (natural language)
- Bulk prompt operations with AI guidance
- Transparent AI feature flags and privacy settings
- Version-aware AI that understands prompt evolution

**Coherence with other references:**
- Extends **VS Code's** foundation with AI-first design
- Complements **Raycast's** command palette with AI
- Builds on **Linear's** subtle AI assistance philosophy
- Aligns with **Msty/LM Studio** in AI integration patterns

### 12. Google AI Studio (https://aistudio.google.com)
**What we learn:**
- **Structured Prompts** - System instructions + examples + query
- **Prompt Gallery** - Pre-built prompt templates
- **Parameter Tuning UI** - Visual controls for temperature, top_k, etc.
- **Response Comparison** - Run same prompt multiple times
- **Token Counting** - Real-time token usage display
- **Export Options** - Code generation for multiple languages
- **Safety Settings** - Content filtering controls
- **Tuning Interface** - Fine-tune models on custom data
- **Multimodal Support** - Text + image prompts

**Applied to PromptLab:**
- Structured prompt editor (system + examples + user input)
- Template gallery with categories and search
- Visual parameter controls with presets
- Multi-run testing with variance analysis
- Prominent token counter in editor and testing
- Export prompts to code (Python, JS, cURL)
- Safety and content filter settings per test
- Future: Model fine-tuning integration
- Support for image-based prompts (GPT-4V, Gemini)

**Coherence with other references:**
- Direct inspiration for prompt engineering workflows
- Complements **Notion's** template system with AI specifics
- Enhances **LM Studio's** parameter controls with presets
- Builds on **Cursor's** AI integration with dedicated prompt IDE
- Most aligned with PromptLab's core mission as a prompt engineering tool

**Unique Position:** AI Studio is the closest competitor/reference as a dedicated prompt engineering tool, making it the most important reference for core workflows while other apps inform adjacent features.

### 13. Warp Terminal (https://warp.dev)
**What we learn:**
- **Blocks-Based Output** - Terminal output organized in discrete, selectable blocks
- **Command Palette** - Natural language to command translation
- **AI Command Search** - AI helps find the right command
- **Workflows** - Save and share command sequences
- **Collaborative Features** - Share terminal sessions
- **Modern UI/UX** - GPU-accelerated rendering
- **Auto-Complete** - Context-aware command suggestions
- **Documentation Inline** - Tooltips and help integrated

**Applied to PromptLab:**
- Block-based prompt execution results (each test as discrete block)
- Natural language command search ("test this prompt with GPT-4")
- AI-assisted prompt discovery and suggestions
- Prompt workflows (chains of prompts)
- Collaborative prompt development features
- High-performance rendering of long conversations
- Smart auto-complete in prompt editor
- Inline documentation for prompt syntax

**Coherence with other references:**
- Modernizes **VS Code's** terminal concepts
- Complements **Cursor's** AI assistance with command-line intelligence
- Extends **Superhuman's** keyboard-first approach to technical workflows
- Brings terminal-style block execution to prompt testing

### 14. Quivr (https://quivr.app)
**What we learn:**
- **Second Brain Architecture** - AI-powered knowledge base
- **RAG Integration** - Retrieval-Augmented Generation for context
- **Document Ingestion** - Multiple format support (PDF, MD, TXT)
- **Vector Storage** - Semantic search across documents
- **Chat Interface** - Conversational knowledge retrieval
- **Privacy-Focused** - Self-hostable, local-first option
- **Source Attribution** - Shows which documents informed response
- **Multi-Modal Input** - Text, files, URLs

**Applied to PromptLab:**
- Prompt library as AI-accessible knowledge base
- RAG over historical prompts and test results
- Import prompts from various formats
- Semantic search using embeddings
- Chat with your prompt history
- Self-hosted with complete data control
- Attribution showing which prompts inspired suggestions
- Multi-modal prompt creation (text + images + files)

**Coherence with other references:**
- Extends **Obsidian's** knowledge graph with AI retrieval
- Complements **Cursor's** codebase understanding
- Builds on **Google AI Studio's** structured approach with context
- Aligns with **LM Studio's** local-first philosophy

### 15. Cline/Roo Coder (https://github.com/cline/cline)
**What we learn:**
- **Agentic AI Assistant** - Autonomous task completion
- **Tool Use** - AI can read files, execute commands, browse
- **Approval Workflow** - Human-in-the-loop for safety
- **Context Management** - Intelligent token budget handling
- **Task Decomposition** - Breaking complex tasks into steps
- **Memory & Persistence** - Maintains context across sessions
- **Multi-Tool Orchestration** - Coordinates multiple tools
- **Transparent Reasoning** - Shows thought process

**Applied to PromptLab:**
- Agentic prompt optimization (AI improves your prompts)
- Tool-augmented prompt testing (AI can test and iterate)
- Human approval for prompt modifications
- Smart context window management for long prompts
- Break complex prompt engineering into subtasks
- Persistent workspace memory across sessions
- Orchestrate multiple AI models in workflows
- Show AI reasoning for prompt suggestions

**Coherence with other references:**
- Takes **Cursor's** AI assistance to autonomous level
- Implements **Warp's** workflow concept with AI agents
- Extends **Google AI Studio's** parameter tuning with AI optimization
- Builds on **Quivr's** RAG with agentic capabilities
- **Meta-reference:** This is the tool building the tool!

### 16. Zed IDE (https://zed.dev)
**What we learn:**
- **Collaboration-First** - Real-time multiplayer editing
- **CRDT-Based Sync** - Conflict-free collaborative editing
- **Performance Obsessed** - Rust-based, GPU-accelerated
- **AI Native** - Built-in AI assistant from day one
- **Channel-Based Collab** - Organize collaboration spaces
- **Inline AI** - AI suggestions in editor
- **Voice Chat** - Audio while collaborating
- **Minimal, Fast UI** - No bloat, instant response

**Applied to PromptLab:**
- Real-time collaborative prompt editing
- Conflict-free prompt version merging
- Blazing-fast performance even with thousands of prompts
- AI assistant for prompt engineering built-in
- Collaboration channels for teams
- Inline AI suggestions while writing prompts
- Voice notes for prompt ideation
- Lightweight, responsive UI at all scales

**Coherence with other references:**
- Modernizes **Atom/VS Code** with collaboration
- Complements **Superhuman's** speed obsession
- Extends **Cursor's** AI features with multiplayer
- Aligns with **Warp's** modern, performant approach
- Brings **Notion's** collaboration to prompt engineering

### 17. Model Context Protocol (MCP) - Native Integration
**What this means:**
- **MCP Client** - PromptLab can connect to MCP servers
- **MCP Server Host** - PromptLab can run/host MCP servers
- **Server Inspection** - Debug and explore MCP servers
- **Server Creation** - Build custom MCP servers (agentic or manual)
- **Server Development** - IDE for MCP server development
- **Tool Discovery** - Browse and test MCP tools
- **Resource Access** - Connect to MCP resources
- **Protocol Native** - MCP as first-class citizen

**Applied to PromptLab:**
- **As MCP Client:**
  - Connect to external MCP servers (filesystem, database, APIs)
  - Use MCP tools in prompt testing workflows
  - Access MCP resources for context
  - Discover available servers and capabilities
  
- **As MCP Server Host:**
  - Run MCP servers locally within PromptLab
  - Manage server lifecycle (start, stop, restart)
  - Configure server parameters
  - View server logs and metrics
  
- **MCP Development Features:**
  - Inspect server schemas and capabilities
  - Test MCP tools interactively
  - Debug server communications
  - Create new servers (code generation)
  - Agentic server scaffolding
  - MCP server marketplace/registry

**Coherence with other references:**
- Positions PromptLab alongside **Claude Desktop, Zed, Cursor** as MCP-native
- Extends **VS Code's** extension model with MCP
- Complements **LM Studio's** server mode with standardized protocol
- Integrates **Cline's** tool use with MCP tools
- Enables **Quivr-like** RAG through MCP resources
- Creates ecosystem compatibility with modern AI tools

**Strategic Importance:** MCP integration positions PromptLab as a central hub in the emerging AI tool ecosystem, enabling interoperability with Claude Desktop, Cursor, Zed, and future MCP-compatible applications.

---

## Design Principles

### 1. **Keyboard-First, Mouse-Enhanced**
- Every action accessible via keyboard
- Mouse interactions feel natural and fluid
- Progressive disclosure of shortcuts
- Visual keyboard hint overlays

### 2. **Information Density Without Clutter**
- Show relevant information prominently
- Hide advanced options until needed
- Use visual hierarchy to guide attention
- White space as a design element

### 3. **Consistent Visual Language**
- Unified component styling
- Predictable interaction patterns
- Coherent color usage
- Systematic spacing and sizing

### 4. **Performance as Design**
- Animations complete in <300ms
- List virtualization for large datasets
- Optimistic UI updates
- Perceived performance through skeletons

### 5. **Progressive Enhancement**
- Core features work perfectly
- Advanced features enhance experience
- Graceful degradation on slower systems
- Mobile-responsive (future consideration)

### 6. **Accessibility by Default**
- WCAG 2.1 AA compliance minimum
- Keyboard navigation throughout
- Screen reader support
- High contrast mode support
- Reduced motion support

---

## Color System

### Base Palette

#### Neutral Grays (Professional Foundation)
```css
--gray-50:  #fafafa;  /* Subtle backgrounds */
--gray-100: #f5f5f5;  /* Card backgrounds */
--gray-200: #e5e5e5;  /* Borders, dividers */
--gray-300: #d4d4d4;  /* Disabled states */
--gray-400: #a3a3a3;  /* Placeholder text */
--gray-500: #737373;  /* Secondary text */
--gray-600: #525252;  /* Body text */
--gray-700: #404040;  /* Headings */
--gray-800: #262626;  /* High emphasis */
--gray-900: #171717;  /* Maximum contrast */
--gray-950: #0a0a0a;  /* Deep backgrounds */
```

#### Primary (Brand Identity - Prompt Blue)
```css
--primary-50:  #eff6ff;
--primary-100: #dbeafe;
--primary-200: #bfdbfe;
--primary-300: #93c5fd;
--primary-400: #60a5fa;
--primary-500: #3b82f6;  /* Main brand color */
--primary-600: #2563eb;  /* Hover states */
--primary-700: #1d4ed8;  /* Active states */
--primary-800: #1e40af;
--primary-900: #1e3a8a;
--primary-950: #172554;
```

#### Success (Positive Actions)
```css
--success-50:  #f0fdf4;
--success-500: #22c55e;  /* Success messages */
--success-600: #16a34a;  /* Hover */
--success-700: #15803d;  /* Active */
```

#### Warning (Caution States)
```css
--warning-50:  #fffbeb;
--warning-500: #f59e0b;  /* Warning messages */
--warning-600: #d97706;  /* Hover */
--warning-700: #b45309;  /* Active */
```

#### Danger (Destructive Actions)
```css
--danger-50:  #fef2f2;
--danger-500: #ef4444;  /* Error messages */
--danger-600: #dc2626;  /* Hover */
--danger-700: #b91c1c;  /* Active */
```

#### Accent Colors (Category/Tag Indicators)
```css
--accent-purple: #a855f7;
--accent-pink:   #ec4899;
--accent-cyan:   #06b6d4;
--accent-emerald:#10b981;
--accent-amber:  #f59e0b;
--accent-rose:   #f43f5e;
```

### Semantic Color Tokens

```css
/* Light Mode */
--bg-primary:     var(--gray-50);
--bg-secondary:   var(--gray-100);
--bg-tertiary:    var(--gray-200);
--text-primary:   var(--gray-900);
--text-secondary: var(--gray-600);
--text-tertiary:  var(--gray-500);
--border-primary: var(--gray-200);
--border-focus:   var(--primary-500);

/* Dark Mode */
--bg-primary-dark:     var(--gray-950);
--bg-secondary-dark:   var(--gray-900);
--bg-tertiary-dark:    var(--gray-800);
--text-primary-dark:   var(--gray-50);
--text-secondary-dark: var(--gray-400);
--text-tertiary-dark:  var(--gray-500);
--border-primary-dark: var(--gray-800);
--border-focus-dark:   var(--primary-400);
```

### Color Usage Guidelines

1. **Backgrounds**
   - Primary: Main canvas
   - Secondary: Cards, panels
   - Tertiary: Nested elements, code blocks

2. **Text**
   - Primary: Headings, important content
   - Secondary: Body text, descriptions
   - Tertiary: Metadata, timestamps

3. **Accents**
   - Use sparingly for calls-to-action
   - Category colors for organization
   - Status colors for feedback

4. **Borders**
   - Subtle by default (gray-200)
   - Prominent on focus (primary-500)
   - Semantic for states (success, error)

---

## Typography

### Font Stack

#### Primary Font (UI Text)
```css
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 
             'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
```

**Why Inter:**
- Designed specifically for UI
- Excellent readability at small sizes
- Wide range of weights (100-900)
- Open source and free
- Professional and modern

#### Monospace Font (Code/Prompts)
```css
--font-mono: 'JetBrains Mono', 'Fira Code', 'Monaco', 
             'Cascadia Code', 'Consolas', monospace;
```

**Why JetBrains Mono:**
- Designed for developers
- Clear character distinction (0 vs O, 1 vs l)
- Ligature support for programming
- Excellent readability
- Free and open source

### Type Scale

```css
/* Font Sizes */
--text-xs:   0.75rem;   /* 12px - Metadata, labels */
--text-sm:   0.875rem;  /* 14px - Body text, UI elements */
--text-base: 1rem;      /* 16px - Default body */
--text-lg:   1.125rem;  /* 18px - Emphasized text */
--text-xl:   1.25rem;   /* 20px - Section headings */
--text-2xl:  1.5rem;    /* 24px - Page headings */
--text-3xl:  1.875rem;  /* 30px - Hero text */
--text-4xl:  2.25rem;   /* 36px - Display */

/* Line Heights */
--leading-none:   1;
--leading-tight:  1.25;
--leading-snug:   1.375;
--leading-normal: 1.5;
--leading-relaxed:1.625;
--leading-loose:  2;

/* Font Weights */
--font-light:     300;
--font-normal:    400;
--font-medium:    500;
--font-semibold:  600;
--font-bold:      700;
--font-extrabold: 800;
```

### Typography Hierarchy

```css
/* Headings */
.heading-1 {
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
  line-height: var(--leading-tight);
  letter-spacing: -0.02em;
}

.heading-2 {
  font-size: var(--text-2xl);
  font-weight: var(--font-semibold);
  line-height: var(--leading-tight);
  letter-spacing: -0.01em;
}

.heading-3 {
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  line-height: var(--leading-snug);
}

/* Body Text */
.body-large {
  font-size: var(--text-lg);
  line-height: var(--leading-relaxed);
}

.body {
  font-size: var(--text-base);
  line-height: var(--leading-normal);
}

.body-small {
  font-size: var(--text-sm);
  line-height: var(--leading-normal);
}

/* UI Text */
.label {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  line-height: var(--leading-none);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.metadata {
  font-size: var(--text-xs);
  color: var(--text-tertiary);
  line-height: var(--leading-tight);
}

/* Code/Prompt Text */
.code {
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  line-height: var(--leading-relaxed);
}
```

---

## Spacing & Layout

### Spacing Scale (8px base unit)

```css
--space-0:   0;
--space-1:   0.25rem;  /* 4px */
--space-2:   0.5rem;   /* 8px */
--space-3:   0.75rem;  /* 12px */
--space-4:   1rem;     /* 16px */
--space-5:   1.25rem;  /* 20px */
--space-6:   1.5rem;   /* 24px */
--space-8:   2rem;     /* 32px */
--space-10:  2.5rem;   /* 40px */
--space-12:  3rem;     /* 48px */
--space-16:  4rem;     /* 64px */
--space-20:  5rem;     /* 80px */
--space-24:  6rem;     /* 96px */
```

### Layout Grid

```css
/* Container Widths */
--container-sm:  640px;
--container-md:  768px;
--container-lg:  1024px;
--container-xl:  1280px;
--container-2xl: 1536px;

/* Sidebar Width */
--sidebar-width-collapsed: 4rem;   /* 64px */
--sidebar-width-expanded:  16rem;  /* 256px */

/* Panel Widths */
--panel-min-width: 20rem;  /* 320px */
--panel-max-width: 40rem;  /* 640px */
```

### Layout Patterns

#### Three-Panel Layout (IDE Style)
```
┌─────────────┬──────────────────────────┬─────────────┐
│             │                          │             │
│  Sidebar    │    Main Editor Area      │   Testing   │
│  (256px)    │    (Flexible)            │   Panel     │
│             │                          │   (400px)   │
│  - Prompts  │  - Prompt Editor         │  - Config   │
│  - Tags     │  - Metadata              │  - Chat     │
│  - Search   │  - Preview               │  - Results  │
│             │                          │             │
└─────────────┴──────────────────────────┴─────────────┘
```

#### Component Spacing Hierarchy
1. **Sections** - `space-12` to `space-16` (48-64px)
2. **Groups** - `space-6` to `space-8` (24-32px)
3. **Elements** - `space-4` (16px)
4. **Inline Items** - `space-2` to `space-3` (8-12px)
5. **Tight Groups** - `space-1` (4px)

---

## Components

### Component Categories

#### 1. **Navigation Components**
- Sidebar (collapsible)
- Command Palette (modal)
- Breadcrumbs
- Tabs
- Navigation Pills

#### 2. **Data Display Components**
- Prompt Cards
- Prompt List Items
- Category Badges
- Tag Pills
- Version History Timeline
- Test Result Cards
- Analytics Charts

#### 3. **Input Components**
- Text Input
- Text Area (Prompt Editor)
- Select Dropdown
- Multi-select (Tags)
- Date Picker
- Toggle Switch
- Checkbox
- Radio Group

#### 4. **Action Components**
- Primary Button
- Secondary Button
- Ghost Button
- Icon Button
- Split Button (with dropdown)
- Floating Action Button

#### 5. **Feedback Components**
- Toast Notifications
- Alert Banners
- Progress Bars
- Loading Skeletons
- Empty States
- Error States

#### 6. **Overlay Components**
- Modal Dialog
- Drawer (Slide-out panel)
- Popover
- Tooltip
- Context Menu

### Component Design Specifications

#### Button Variants

```css
/* Primary Button */
.button-primary {
  background: var(--primary-600);
  color: white;
  padding: var(--space-2) var(--space-4);
  border-radius: 0.375rem; /* 6px */
  font-weight: var(--font-medium);
  transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);
}

.button-primary:hover {
  background: var(--primary-700);
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
}

.button-primary:active {
  background: var(--primary-800);
  transform: translateY(0);
}

/* Secondary Button */
.button-secondary {
  background: transparent;
  color: var(--text-primary);
  border: 1px solid var(--border-primary);
  padding: var(--space-2) var(--space-4);
  border-radius: 0.375rem;
}

/* Ghost Button */
.button-ghost {
  background: transparent;
  color: var(--text-secondary);
  padding: var(--space-2) var(--space-4);
}

.button-ghost:hover {
  background: var(--bg-secondary);
  color: var(--text-primary);
}
```

#### Card Component

```css
.card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: 0.5rem; /* 8px */
  padding: var(--space-4);
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
}

.card:hover {
  border-color: var(--border-focus);
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1),
              0 2px 4px -2px rgb(0 0 0 / 0.1);
  transform: translateY(-2px);
}

.card-clickable {
  cursor: pointer;
}

.card-selected {
  border-color: var(--primary-500);
  background: var(--primary-50);
}
```

#### Input Component

```css
.input {
  width: 100%;
  padding: var(--space-2) var(--space-3);
  border: 1px solid var(--border-primary);
  border-radius: 0.375rem;
  background: var(--bg-primary);
  color: var(--text-primary);
  font-size: var(--text-sm);
  transition: border-color 150ms;
}

.input:focus {
  outline: none;
  border-color: var(--border-focus);
  box-shadow: 0 0 0 3px var(--primary-500) / 0.1);
}

.input::placeholder {
  color: var(--text-tertiary);
}

.input:disabled {
  background: var(--bg-tertiary);
  color: var(--text-tertiary);
  cursor: not-allowed;
}
```

---

## Animation & Micro-interactions

### Animation Principles

1. **Purposeful** - Animations guide attention and provide feedback
2. **Subtle** - Smooth but not distracting
3. **Fast** - Complete within 150-300ms
4. **Consistent** - Same timing functions throughout
5. **Respectful** - Honor prefers-reduced-motion

### Easing Functions

```css
/* Use these timing functions for consistency */
--ease-in:      cubic-bezier(0.4, 0, 1, 1);
--ease-out:     cubic-bezier(0, 0, 0.2, 1);
--ease-in-out:  cubic-bezier(0.4, 0, 0.2, 1);
--ease-spring:  cubic-bezier(0.34, 1.56, 0.64, 1);
```

### Animation Durations

```css
--duration-fast:   150ms;  /* Hover states, subtle feedback */
--duration-base:   200ms;  /* Standard transitions */
--duration-slow:   300ms;  /* Page transitions, modals */
--duration-slower: 500ms;  /* Elaborate animations */
```

### Micro-interaction Catalog

#### 1. **Button Press**
```css
.button:active {
  transform: scale(0.98);
  transition: transform 100ms var(--ease-in-out);
}
```

#### 2. **Card Hover**
```css
.card {
  transition: transform var(--duration-base) var(--ease-out),
              box-shadow var(--duration-base) var(--ease-out);
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
}
```

#### 3. **List Item Selection**
```css
.list-item {
  position: relative;
  transition: background var(--duration-fast) var(--ease-out);
}

.list-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: var(--primary-500);
  transform: scaleY(0);
  transition: transform var(--duration-base) var(--ease-spring);
}

.list-item.selected::before {
  transform: scaleY(1);
}
```

#### 4. **Modal/Dialog Entry**
```css
@keyframes modal-enter {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.modal {
  animation: modal-enter var(--duration-slow) var(--ease-out);
}
```

#### 5. **Loading Skeleton Pulse**
```css
@keyframes skeleton-pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.skeleton {
  animation: skeleton-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
```

#### 6. **Success Checkmark**
```css
@keyframes checkmark-draw {
  to {
    stroke-dashoffset: 0;
  }
}

.checkmark {
  stroke-dasharray: 52.91;
  stroke-dashoffset: 52.91;
  animation: checkmark-draw 0.4s ease-out forwards;
}
```

#### 7. **Toast Slide-in**
```css
@keyframes toast-enter-right {
  from {
    transform: translateX(calc(100% + var(--space-6)));
  }
  to {
    transform: translateX(0);
  }
}

.toast {
  animation: toast-enter-right var(--duration-slow) var(--ease-out);
}
```

### Framer Motion Implementation

When implementing with Framer Motion:

```jsx
// Page transition
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

// Stagger children
const listVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

// Spring animations for natural feel
<motion.div
  animate={{ scale: 1 }}
  whileHover={{ scale: 1.05 }}
  transition={{ type: "spring", stiffness: 400, damping: 10 }}
/>
```

---

## Accessibility

### WCAG 2.1 AA Compliance

#### Color Contrast Requirements
- **Normal text (< 18px):** Minimum 4.5:1 contrast ratio
- **Large text (≥ 18px or 14px bold):** Minimum 3:1 contrast ratio
- **UI components & graphics:** Minimum 3:1 contrast ratio

#### Keyboard Navigation
- All interactive elements must be keyboard accessible
- Focus indicators clearly visible (3px outline)
- Logical tab order throughout interface
- Skip links for main content areas
- Escape key closes modals/dialogs

#### Screen Reader Support
- Semantic HTML elements
- ARIA labels for icon-only buttons
- ARIA live regions for dynamic content
- ARIA expanded/collapsed for toggles
- Alt text for informative images

#### Focus Management
```css
/* Visible focus indicator */
*:focus-visible {
  outline: 3px solid var(--primary-500);
  outline-offset: 2px;
  border-radius: 0.25rem;
}

/* Never remove focus outlines completely */
*:focus:not(:focus-visible) {
  outline: none;
}
```

#### Reduced Motion Support
```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

#### Accessible Form Labels
```jsx
// Always associate labels with inputs
<label htmlFor="prompt-title">
  Prompt Title
</label>
<input 
  id="prompt-title"
  type="text"
  aria-required="true"
  aria-describedby="title-hint"
/>
<span id="title-hint" className="metadata">
  A descriptive name for your prompt
</span>
```

---

## Dark/Light Theme Architecture

### Theme System Structure

```css
/* Root color variables that change based on theme */
:root {
  /* Light mode (default) */
  color-scheme: light;
  --bg-primary: var(--gray-50);
  --bg-secondary: var(--gray-100);
  --bg-tertiary: var(--gray-200);
  --text-primary: var(--gray-900);
  --text-secondary: var(--gray-600);
  --text-tertiary: var(--gray-500);
  --border-primary: var(--gray-200);
  --border-secondary: var(--gray-300);
  --shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
}

/* Dark mode */
:root[data-theme="dark"] {
  color-scheme: dark;
  --bg-primary: var(--gray-950);
  --bg-secondary: var(--gray-900);
  --bg-tertiary: var(--gray-800);
  --text-primary: var(--gray-50);
  --text-secondary: var(--gray-400);
  --text-tertiary: var(--gray-500);
  --border-primary: var(--gray-800);
  --border-secondary: var(--gray-700);
  --shadow: 0 1px 3px 0 rgb(0 0 0 / 0.4);
}

/* System preference detection */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    /* Apply dark theme variables */
  }
}
```

### Theme Toggle Implementation

```jsx
// Theme context and hook
const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved || 'system';
  });

  useEffect(() => {
    const root = document.documentElement;
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
    
    const effectiveTheme = theme === 'system' ? systemTheme : theme;
    root.setAttribute('data-theme', effectiveTheme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
```

### Theme-Aware Components

Components should use semantic tokens rather than direct colors:

```jsx
// ✅ Good - Uses semantic tokens
<div style={{
  background: 'var(--bg-secondary)',
  color: 'var(--text-primary)',
  border: '1px solid var(--border-primary)'
}}>

// ❌ Bad - Uses absolute colors
<div style={{
  background: '#f5f5f5',
  color: '#171717',
  border: '1px solid #e5e5e5'
}}>
```

### Special Considerations for Dark Mode

1. **Reduce Pure White/Black**
   - Use gray-50 instead of #ffffff in dark mode
   - Use gray-950 instead of #000000 in light mode

2. **Adjust Shadows**
   - Lighter, more subtle shadows in dark mode
   - Slightly stronger shadows in light mode

3. **Image/Media Handling**
   - Slight opacity reduction on images in dark mode
   - Use SVG with currentColor for icons

4. **Code Syntax Highlighting**
   - Different color schemes for light/dark
   - Maintain contrast ratios in both

---

## Implementation Technology Stack

### Core Technologies

#### UI Framework: **Radix UI + Tailwind CSS**
- **Radix UI** - Unstyled, accessible component primitives
- **Tailwind CSS** - Utility-first CSS framework
- **CVA** (Class Variance Authority) - Component variant management
- **tailwind-merge** - Merge Tailwind classes intelligently

#### Animation: **Framer Motion**
- Declarative animations
- Spring physics
- Gesture support
- SVG animations
- Exit animations

#### Charts: **Recharts**
- React-first charting library
- Declarative API
- Responsive by default
- Customizable styling

### Additional Libraries

```json
{
  "dependencies": {
    "@radix-ui/react-dialog": "^1.1.15",
    "@radix-ui/react-dropdown-menu": "^2.1.16",
    "@radix-ui/react-select": "^2.2.6",
    "@radix-ui/react-tabs": "^1.1.13",
    "@radix-ui/react-switch": "^1.2.6",
    "@radix-ui/react-toast": "^1.2.16",
    "@radix-ui/react-tooltip": "^1.1.16",
    "framer-motion": "^11.0.0",
    "recharts": "^2.12.0",
    "class-variance-authority": "^0.7.1",
    "tailwind-merge": "^2.6.0",
    "react-icons": "^5.0.0",
    "@tanstack/react-query": "^5.0.0"
  }
}
```

### Design Tokens in Tailwind Config

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        // All design system colors here
      },
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
        mono: ['JetBrains Mono', ...defaultTheme.fontFamily.mono],
      },
      spacing: {
        // 8px base spacing scale
      },
      animation: {
        'fade-in': 'fadeIn 200ms ease-out',
        'slide-in': 'slideIn 300ms ease-out',
        'scale-in': 'scaleIn 200ms ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/forms'),
  ],
};
```

---

## Summary

This design system establishes the foundation for transforming PromptLab into a world-class prompt engineering IDE. It draws inspiration from the best products in the industry while maintaining a unique identity tailored to prompt engineering workflows.

**Key Outcomes:**
- Professional, muted color palette with strategic accents
- Clear typographic hierarchy using Inter and JetBrains Mono
- Systematic spacing based on 8px grid
- Comprehensive component library with consistent styling
- Smooth, purposeful animations under 300ms
- WCAG 2.1 AA accessible throughout
- Flexible dark/light theme architecture
- Modern technology stack optimized for performance

**Implementation Priority:**
1. Set up design tokens in Tailwind config
2. Implement core components (Button, Card, Input)
3. Build layout structure (Sidebar, Main, Panel)
4. Add Framer Motion animations
5. Implement theme system
6. Add accessibility features
7. Fine-tune micro-interactions

This design system will be referenced throughout Phase 3 (UI/UX Implementation) to ensure consistency and quality in every component and interaction.