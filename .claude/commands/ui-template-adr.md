# UI Template ADR

Create a UI Specifications Architecture Decision Record (ADR) by gathering requirements from the user, analyzing the project context, and generating a comprehensive UI design document — similar to a professional UI spec used for building frontends.

**IMPORTANT: This command is interactive. Ask the user questions to understand their project, aesthetic preferences, pages, and components before generating the ADR. Once you have enough information, generate the full ADR without further pauses.**

## Usage

```
/ui-template-adr [optional project or feature description]
```

Examples:
```
/ui-template-adr
/ui-template-adr A dashboard for managing IoT devices
/ui-template-adr E-commerce storefront with product catalog and checkout
/ui-template-adr Admin panel for a SaaS analytics platform
```

## Instructions for Claude

When this command is invoked, follow these steps in order.

---

### Step 1: Determine the Project Context

**If an argument is provided** (text after `/ui-template-adr`), use it as the starting context.

**If no argument is provided**, use `AskUserQuestion` to ask:
- "What kind of application UI do you want to design?"
- Provide example options like:
  - "Web application dashboard" — "Admin panels, analytics dashboards, SaaS tools"
  - "Consumer-facing website" — "Landing pages, e-commerce, portfolios, blogs"
  - "Developer/pro tool" — "IDEs, DAWs, monitoring tools, data platforms"

Regardless of whether an argument was provided, proceed to Step 2 to gather more details.

---

### Step 2: Gather UI Requirements (Interactive)

Ask the user a series of questions using `AskUserQuestion`. Ask **up to 4 questions at a time** (the tool limit). You may need multiple rounds depending on answers.

#### Round 1: Core Identity

Ask these questions together:

1. **Design aesthetic** — "What visual style fits your application?"
   - Options:
     - "Minimal & Clean" — "Lots of whitespace, simple typography, muted colors (e.g., Linear, Notion)"
     - "Studio/Professional" — "Dark, dense, functional — like pro audio/video tools (e.g., Figma, DAWs)"
     - "Vibrant & Modern" — "Bold colors, gradients, playful elements (e.g., Vercel, Stripe)"
     - "Enterprise/Corporate" — "Structured, data-heavy, formal (e.g., Salesforce, Jira)"

2. **Color scheme preference** — "What color direction do you prefer?"
   - Options:
     - "Dark-first" — "Dark backgrounds, light text — reduces eye strain, modern feel"
     - "Light-first" — "White/light backgrounds, dark text — traditional, high readability"
     - "Both (dark/light toggle)" — "Support both themes with a toggle switch"

3. **Primary accent color** — "What accent color should define the brand?"
   - Options:
     - "Blue" — "Trust, professionalism (e.g., #3b82f6)"
     - "Cyan/Teal" — "Technical, modern (e.g., #22d3ee)"
     - "Purple/Violet" — "Creative, premium (e.g., #8b5cf6)"
     - "Green" — "Growth, success, nature (e.g., #22c55e)"

4. **Layout type** — "What navigation pattern works best?"
   - Options:
     - "Top navigation bar" — "Horizontal tabs, maximizes vertical space — good for content-focused apps"
     - "Side navigation (sidebar)" — "Vertical menu on the left — good for apps with many sections"
     - "Top nav + sidebar" — "Top for global nav, sidebar for section sub-nav — good for complex apps"

#### Round 2: Pages & Features

Based on the project description and Round 1 answers, ask:

1. **Core pages** — "What are the main pages/sections of your application?" (multiSelect: true)
   - Generate 4 context-relevant options based on the project description
   - The user can also type custom pages

2. **Key UI components** — "Which specialized components does your app need?" (multiSelect: true)
   - Generate 4 context-relevant options (e.g., "Data tables with sorting/filtering", "Charts & visualizations", "Form wizards/multi-step forms", "Real-time notifications")

3. **Responsive requirements** — "What devices should this support?"
   - Options:
     - "Desktop-first" — "Optimized for desktop, basic mobile support"
     - "Mobile-first" — "Optimized for mobile, scales up to desktop"
     - "Fully responsive" — "Equal priority for mobile, tablet, and desktop"

4. **Any specific UI inspiration?** — "Are there any apps or websites whose design you'd like to draw inspiration from?"
   - Options:
     - "No specific inspiration" — "Design from scratch based on the chosen aesthetic"
     - "I have references" — "I'll describe specific apps or share URLs"

**If the user selects "I have references"**, ask a follow-up for them to describe or name the references.

#### Round 3 (Optional): Additional Details

Only ask this round if the project is complex (many pages, specialized domain). Ask about:

1. **Data density** — "How information-dense should the UI be?"
   - "Spacious" — "One primary action per screen, generous whitespace"
   - "Balanced" — "Moderate density, clear visual hierarchy"
   - "Dense/Pro" — "Information-rich, multiple panels, power-user oriented"

2. **Key interactions** — "What interactive patterns are most important?" (multiSelect: true)
   - Generate context-relevant options (e.g., "Drag and drop", "Real-time updates", "Inline editing", "Keyboard shortcuts")

---

### Step 3: Explore the Codebase

Before writing, explore the project to understand what already exists:

1. **Check for existing ADRs** — Read filenames in `architecture/` directory to determine the next ADR number and avoid contradictions
2. **Check for existing frontend** — Look for `package.json`, framework configs (Next.js, Vite, etc.), existing components
3. **Check for existing backend/API** — Look for API routes, models, services that the UI will interact with
4. **Check for existing design tokens** — Look for CSS variables, Tailwind config, theme files

Use this context to make the ADR concrete and grounded in the actual project.

---

### Step 4: Determine the Next ADR Number

1. Read all filenames in `architecture/` directory
2. Extract the numeric prefix from each file (e.g., `0002` from `0002-ui-specifications.md`)
3. Find the highest number
4. Increment by 1, zero-padded to 4 digits

---

### Step 5: Generate the UI Specifications ADR

Write the ADR using the template below. Fill in every section based on the gathered requirements and codebase exploration. **Be specific and concrete — use actual CSS values, real component names, and detailed layouts.**

#### Template

```markdown
# ADR-{NUMBER}: UI Specifications

## Status
Proposed ({YYYY-MM-DD})

## Context
This document defines the UI specifications for the {project name} application frontend{, based on any relevant prior ADRs}.

{1-2 paragraphs explaining what the application is, who uses it, and why these UI decisions matter.}

---

## Design Direction

### Aesthetic: "{Aesthetic Name}"
{1-2 sentences describing the overall visual feel, what it's inspired by, and why it's appropriate for this application.}

### Design Principles
1. **{Principle 1}**: {Why this matters for the application}
2. **{Principle 2}**: {Why this matters}
3. **{Principle 3}**: {Why this matters}
4. **{Principle 4}**: {Why this matters}

### Color Palette
```css
:root {
  /* Base */
  --bg-primary: {value};        /* {description} */
  --bg-secondary: {value};      /* {description} */
  --bg-tertiary: {value};       /* {description} */
  --bg-hover: {value};          /* {description} */

  /* Borders */
  --border-subtle: {value};
  --border-default: {value};

  /* Text */
  --text-primary: {value};
  --text-secondary: {value};
  --text-muted: {value};

  /* Accent */
  --accent-primary: {value};    /* {color name + weight} */
  --accent-secondary: {value};  /* {color name + weight} */
  --accent-muted: {value};      /* {color name + weight} */

  /* Semantic */
  --success: {value};           /* {use case} */
  --warning: {value};           /* {use case} */
  --error: {value};             /* {use case} */
  --info: {value};              /* {use case} */

  /* {Any domain-specific colors, e.g., waveform gradient, status colors} */
}
```

### Typography
```css
/* Primary font and rationale */
--font-primary: '{Font}', {fallbacks};

/* Monospace font (if applicable) */
--font-mono: '{Font}', {fallbacks};

/* Scale */
--text-xs: 0.75rem;    /* 12px - {use case} */
--text-sm: 0.875rem;   /* 14px - {use case} */
--text-base: 1rem;     /* 16px - {use case} */
--text-lg: 1.125rem;   /* 18px - {use case} */
--text-xl: 1.25rem;    /* 20px - {use case} */
--text-2xl: 1.5rem;    /* 24px - {use case} */
```

---

## Layout Structure

### Shell Layout
```
{ASCII diagram of the overall app shell — navigation, content area, status bars, sidebars.
Use box-drawing characters: ┌ ─ ┐ │ └ ┘ ├ ┤ ┬ ┴}
```

{Brief description of each shell region: what it contains, whether it's fixed/scrollable, etc.}

---

## Page Specifications

{For EACH page the user specified, include a full specification block:}

### {N}. {Page Name} (`/{route}`)

**Purpose**: {What this page does}

**Layout**:
```
{Detailed ASCII diagram showing the page structure.
Show panels, cards, lists, buttons, inputs, and data areas.
Use box-drawing characters for structure.
Include placeholder content to illustrate what goes where.}
```

**Components**:
- `{ComponentName}`: {What it does}
- `{ComponentName}`: {What it does}

**States**:
- {State 1} ({description of appearance/behavior})
- {State 2} ({description})

{Include real-time features, WebSocket interactions, or special behaviors if applicable.}

---

{Repeat the page specification block for each page.}

---

## Shared Components

{For each major reusable component, provide a TypeScript interface:}

### {Category} Components

#### `{ComponentName}`
```typescript
interface {ComponentName}Props {
  {prop}: {type};
  {prop}?: {type};
  {callback}?: ({params}) => void;
}
```

{Repeat for each shared component. Group by category (e.g., "Data Display", "Forms", "Navigation", "Feedback").}

---

## Animation & Interaction

### Micro-interactions
- **{Element}**: {Animation description with duration and easing}
- **{Element}**: {Animation description}

### Page Transitions
- **{Transition type}**: {Animation description with duration}

### Loading States
- **{Scenario}**: {Loading pattern to use}

---

## Responsive Behavior

### Breakpoints
```css
--breakpoint-sm: {value};   /* {device} */
--breakpoint-md: {value};   /* {device} */
--breakpoint-lg: {value};   /* {device} */
--breakpoint-xl: {value};   /* {device} */
```

### Mobile Adaptations (< {breakpoint})
{Bullet list of how each major layout element adapts on mobile.}

---

## Accessibility

### Requirements
{Bullet list of accessibility requirements: keyboard navigation, ARIA labels, focus states, reduced motion, screen reader considerations.}

### Color Contrast
{Specific contrast ratio requirements for text, interactive elements, and status indicators.}

---

## Implementation Priority

### Phase 1 (MVP)
{Numbered list of the most essential UI elements to build first.}

### Phase 2 (Core)
{Numbered list of the next batch of UI elements.}

### Phase 3 (Advanced)
{Numbered list of advanced/polish UI elements.}

---

## File Structure

```
{Recommended frontend file/folder structure.
Include:
- App routes/pages
- Component directories (grouped by domain)
- Shared UI components directory
- Hooks directory
- Stores/state management
- Lib/utils
- Styles}
```

## Consequences

### Positive
- {Benefit 1}
- {Benefit 2}
- {Benefit 3}

### Negative
- {Trade-off 1}
- {Trade-off 2}

### Trade-offs
- {Design trade-off with rationale}
```

---

### Step 6: Writing Rules

Follow these rules when generating the ADR content:

1. **Every page must have an ASCII layout diagram.** These are critical for communicating the UI structure. Use box-drawing characters (`┌ ─ ┐ │ └ ┘ ├ ┤ ┬ ┴ ┼`) and include realistic placeholder content.

2. **Color values must be real hex codes.** Don't use placeholders — generate a cohesive, usable color palette based on the user's preferences.

3. **Component interfaces must be valid TypeScript.** Use proper types, optional properties (`?`), and callback signatures.

4. **File structure must match the detected framework.** If the project uses Next.js, use App Router conventions. If Vite + React, use standard React conventions. If no frontend exists yet, recommend Next.js App Router as default.

5. **Be opinionated.** This is a design spec — make concrete decisions. Don't say "could use X or Y" — pick one and explain why.

6. **Reference existing code when applicable.** If the project already has components, styles, or patterns, reference and build on them.

7. **Implementation phases should be practical.** Phase 1 should produce a usable (if minimal) UI. Each phase should build meaningfully on the last.

8. **Write for the `/create-prd-from-adr` pipeline.** The ADR will be consumed by the PRD generator. Ensure it contains enough detail to generate actionable implementation tasks.

---

### Step 7: Save and Present Summary

1. **Generate the filename:** `architecture/{NUMBER}-ui-specifications.md`
   - If a more specific name is appropriate (e.g., `0003-admin-dashboard-ui.md`), use it
   - Keep it kebab-case, 3-5 words

2. **Write the file** to `architecture/{filename}`

3. **Show a summary in the chat:**

   ```
   ## ADR-{NUMBER}: UI Specifications

   **File:** `architecture/{filename}`
   **Aesthetic:** {Chosen aesthetic name}
   **Color Scheme:** {Dark/Light/Both} with {accent color} accent
   **Pages:** {Count} pages specified

   ### Pages
   - {List each page with route}

   ### Design Highlights
   - {2-3 key design decisions}

   ### Implementation Phases
   - **Phase 1 (MVP):** {Brief summary}
   - **Phase 2 (Core):** {Brief summary}
   - **Phase 3 (Advanced):** {Brief summary}
   ```

4. **Ask to implement:** After showing the summary, use `AskUserQuestion` to ask:
   - Question: "Would you like to proceed with this UI specification?"
   - Options:
     - "Yes, create PRD and implement" — "Generate a PRD from this ADR and start implementing the UI"
     - "Yes, create PRD only" — "Generate a PRD with implementation tasks, but don't start building yet"
     - "No, just keep the ADR" — "The spec is saved, you can implement later with /create-prd-from-adr"

5. **Handle the response:**
   - If "Yes, create PRD and implement": Invoke `/create-prd-from-adr` with the ADR file path, and after the PRD is created, invoke `/implement-prd`
   - If "Yes, create PRD only": Invoke `/create-prd-from-adr` with the ADR file path
   - If "No, just keep the ADR": Acknowledge and finish

---

## Tips for High-Quality Output

- **Study real applications** in the same domain for layout inspiration
- **Use consistent spacing** in ASCII diagrams — alignment matters for readability
- **Include empty/error/loading states** for key pages — these are often overlooked
- **Think about data flow** — which components fetch data, which receive props
- **Consider the first-run experience** — what does a new user see with no data?

## Related Commands

- `/create-prd-from-adr` — Convert this ADR into a PRD with actionable tasks
- `/implement-prd` — Implement tasks from a PRD one by one
- `/create-adr` — Create a general-purpose ADR (not UI-specific)
