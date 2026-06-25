# Long-Context Workflows Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reframe the "Legal Team" section of the static presentation site into a generic, surface-agnostic "Long-Context Workflows" section: a lean hub plus three workflow pages (Digest / Organize / Draft), each with a `Generic | Legal` tab where the generic example interviews the user first.

**Architecture:** Static HTML pages under `demos/`, sharing `styles/main.css` and `js/main.js`. No build step, no framework. A new tab component (a small CSS block + a delegated JS click handler, mirroring the existing copy-button pattern) toggles the two example panels in place. Legal example content is preserved from the current pages; generic content is new.

**Tech Stack:** Hand-written HTML5, vanilla CSS (custom-property tokens), vanilla ES-module JS. Markdown recipes under `recipes/`.

## Verification environment (read first)

- This shell lacks many coreutils (`sed`, `wc`, `head`, `sort`, `tr` are NOT on PATH). Use **`grep`** (works), **`grep -c`** for counts, and **zsh builtins / parameter expansion / arrays** (`${(f)...}`, `${#arr}`, `${var%%...}`). Avoid `sed/awk/wc/head/sort/tr`.
- Any `git` command that touches the network (`push`) needs the Bash tool's `dangerouslyDisableSandbox: true`. Local `git` (add/commit/mv/rm/status) works sandboxed.
- There is no automated test runner. "Tests" here are (a) `grep`-based structural assertions that must pass, and (b) explicit **open-in-browser** checks for visual/interactive behavior (tabs, copy buttons). Do the browser check before each commit that changes interactive markup.
- Work on branch `claude/legal-team-section` (continues the existing PR). Confirm with `git branch --show-current` before starting.

## Global Constraints

- Reuse existing CSS classes; the ONLY new CSS is the `.tabs` block (Task 1). No other restyling; do not touch other demos' styling.
- Copy buttons must use: `class="copy-btn"` (+ `copy-btn--light` on `.prompt-block`), and either `data-copy="literal"` or `data-copy-from="parent-pre"`, plus `type="button"`, an `aria-label`, and the literal label `📋 Copy`.
- Every page: unique `data-page` on `<body>`; keep the Nelnet wordmark `<img ... onerror="...">` fallback verbatim; demo pages use `../` asset paths and `<script type="module" src="../js/main.js"></script>`.
- Nav: `data-key-prev` / `data-key-next` on topbar (and footer) anchors; the four-page chain is `demos → long-context → document-digest → organize-files → draft-from-files → demos`, reciprocal.
- Generic examples are surface-neutral ("paste into Claude"); legal examples stay Cowork-framed.
- No data-handling, privilege, or licensing-tier content anywhere (deleted, not relocated).
- Title format: `<Page> · Vibe Coding with Claude Code` (middle-dot `·`).

## File Structure

- `js/main.js` — MODIFY: add tab toggle handler + an `onKey` guard so arrow-key page nav is suppressed while a tab is focused.
- `styles/main.css` — MODIFY: append the `.tabs` component block.
- `recipes/document-digest.md` — MODIFY: generalize (interview-first, neutral verification line).
- `recipes/organize-case-file.md` → `recipes/organize-files.md` — RENAME + generalize (no fixed taxonomy; Claude asks how to group).
- `recipes/draft-from-case-file.md` → `recipes/draft-from-files.md` — RENAME + generalize.
- `demos/legal-overview.html` → `demos/long-context.html` — RENAME + rewrite (lean hub).
- `demos/document-digest.html` — MODIFY: add `Generic | Legal` tabs; update nav.
- `demos/organize-case-file.html` → `demos/organize-files.html` — RENAME + add tabs; update nav, chips, recipe links.
- `demos/draft-from-case-file.html` → `demos/draft-from-files.html` — RENAME + add tabs; update nav, recipe links.
- `demos/legal-data-handling.html` — DELETE.
- `index.html` — MODIFY: chip label/href + "How this works" bullet.
- `demos.html` — MODIFY: card + `cards-intro`.

---

### Task 1: Shared tab component (CSS + JS)

**Files:**
- Modify: `styles/main.css` (append at end)
- Modify: `js/main.js` (append tab handler; edit `onKey`)

**Interfaces:**
- Produces: tab markup contract used by Tasks 4–6 — a `.tabs` container holding a `.tabs__list[role=tablist]` of `.tabs__tab[data-tab=KEY]` buttons and sibling `.tabs__panel[data-panel=KEY]` elements; the active tab has `.is-active` + `aria-selected="true"`, the active panel has `.is-active` and is not `hidden`. Clicking a tab (or Enter/Space on it) shows the matching panel.

- [ ] **Step 1: Append the `.tabs` CSS block to `styles/main.css`**

```css

/* ============================================================
   Tabs (example switcher)
   ============================================================ */
.tabs { margin: 1.25rem 0; }
.tabs__list {
  display: flex;
  gap: 0.25rem;
  border-bottom: 1px solid #e2e8f0;
  margin-bottom: 1.25rem;
}
.tabs__tab {
  appearance: none;
  background: transparent;
  border: 0;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  padding: 0.5rem 0.9rem;
  font-family: var(--font-sans);
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-muted);
  cursor: pointer;
  transition: color 0.15s, border-color 0.15s;
}
.tabs__tab:hover { color: var(--text-dark); }
.tabs__tab.is-active { color: var(--claude-coral); border-bottom-color: var(--claude-coral); }
.tabs__tab:focus-visible { outline: 0; box-shadow: var(--focus-ring); border-radius: 0.25rem; }
.tabs__panel[hidden] { display: none; }
```

- [ ] **Step 2: Add the tab handler to `js/main.js`** (append after the copy-button section, before nothing else depends on it)

```js

// ----- Tabs -----

const onTabClick = (event) => {
  const tab = event.target.closest('.tabs__tab');
  if (!tab) return;
  const tabs = tab.closest('.tabs');
  if (!tabs) return;
  const key = tab.dataset.tab;
  tabs.querySelectorAll('.tabs__tab').forEach((t) => {
    const active = t === tab;
    t.classList.toggle('is-active', active);
    t.setAttribute('aria-selected', active ? 'true' : 'false');
    t.tabIndex = active ? 0 : -1;
  });
  tabs.querySelectorAll('.tabs__panel').forEach((p) => {
    p.hidden = p.dataset.panel !== key;
    p.classList.toggle('is-active', p.dataset.panel === key);
  });
};

document.addEventListener('click', onTabClick);
```

- [ ] **Step 3: Guard the existing `onKey` so arrow keys don't navigate pages while a tab is focused**

In `js/main.js`, find the `onKey` function. After its existing `if (isTextInput(document.activeElement)) return;` line, add:

```js
  if (document.activeElement && document.activeElement.closest &&
      document.activeElement.closest('.tabs__list')) return;
```

- [ ] **Step 4: Verify the additions are present**

Run:
```bash
cd /Users/hdunlap/Repos/claude-code-director-demos
grep -c '.tabs__tab' styles/main.css
grep -c 'onTabClick' js/main.js
grep -c "closest('.tabs__list')" js/main.js
```
Expected: each prints a non-zero count (CSS ≥ 4, JS onTabClick = 2, guard = 1).

- [ ] **Step 5: Commit**

```bash
git add styles/main.css js/main.js
git commit -m "feat(tabs): add shared tab component (CSS + delegated JS)"
```

---

### Task 2: Generalize the three recipes

**Files:**
- Modify: `recipes/document-digest.md`
- Rename+modify: `recipes/organize-case-file.md` → `recipes/organize-files.md`
- Rename+modify: `recipes/draft-from-case-file.md` → `recipes/draft-from-files.md`

**Interfaces:**
- Produces: recipe paths referenced by page `copy-source-link`s in Tasks 4–6: `../recipes/document-digest.md`, `../recipes/organize-files.md`, `../recipes/draft-from-files.md`.

- [ ] **Step 1: Rename the two legal-named recipes (preserve history)**

```bash
cd /Users/hdunlap/Repos/claude-code-director-demos
git mv recipes/organize-case-file.md recipes/organize-files.md
git mv recipes/draft-from-case-file.md recipes/draft-from-files.md
```

- [ ] **Step 2: Replace `recipes/document-digest.md` with the generic version**

Overwrite the whole file with:

```markdown
---
description: Read one long document and produce a structured, page-cited summary plus a timeline, after asking what the reader needs
---

You are summarizing a single long document for someone who needs to understand
it quickly without reading every page first. They drop one document in
`inbox/`; you write a summary and a timeline to `outputs/`. This is a first-pass
reading aid, not a substitute for the reader's own review.

## Persistent inputs

- `inbox/` — a single long digital document (`.pdf` / `.docx`): the text must be
  selectable, not a scan.

If `inbox/` is empty, missing, or holds more than one document, say so and ask
which single file to summarize. Stop.

## What to do

1. **Ask first.** Open by asking 2-4 short questions: what kind of document
   this is, what the reader wants out of it, which details matter most, and what
   output format they want. Wait for answers before reading.
2. Read everything in `inbox/`. State the page count first; confirm the text is
   selectable. If it is a scan with no text layer, say so and stop.
3. If the document is long (more than ~20 pages), split it into sections and
   fan out one sub-agent per section, in parallel; each returns a section
   summary, its dated events, and any ambiguous/low-confidence passage tied to a
   page. Then meta-summarize so the middle is not lost. If short, read straight
   through.
4. Write `outputs/SUMMARY.md` in the format the reader asked for. End every
   point with its page, e.g. `(p. 14)`.
5. Write `outputs/TIMELINE.md` — every dated event, sorted, each citing its page.
6. End with a short chat summary: page count, sections read, items flagged.

## Customization knobs

- Section size (default ~15-25 pages per sub-agent) — edit in this body.
- Summary sections — driven by the reader's answers in step 1.
- Citation granularity — page-level default; switch to paragraph/line for
  transcripts.

## Notes

- Don't fabricate. If the document does not say it, do not infer it.
- Flag, don't guess: put ambiguous/low-confidence passages under an
  "Open questions" heading with the page and why.
- Keep the original in `inbox/` read-only.
- End `outputs/SUMMARY.md` with: **"First-pass summary — spot-check each point
  against the cited pages before relying on it."**
- Re-running overwrites `outputs/SUMMARY.md` and `outputs/TIMELINE.md`.
```

- [ ] **Step 3: Replace `recipes/organize-files.md` with the generic version**

Overwrite the whole file with:

```markdown
---
description: Organize a messy folder into a clean, indexed organized/ tree — copies only, originals untouched — after asking how to group
---

You are organizing a messy folder so it is usable and searchable. You ask how
the user wants it grouped rather than assuming a scheme, then build a new
`organized/` tree of renamed copies with an index. Originals are never touched.

## Persistent inputs

- The current working directory — files in any state: loose documents,
  spreadsheets, images, and zip archives (including zips inside zips).

If the current folder is empty, say so and stop.

## What to do

1. **Ask first.** Open by asking 2-4 short questions: what these files are, how
   to group them (by date? type? topic?), how to name them, and whether anything
   is sensitive. Wait for answers.
2. **Inventory** (no AI): find every file, exclude system junk, extract every
   zip recursively into a staging area, record a total count.
3. **Understand — fan out sub-agents** in parallel, one per substantial file
   (batch small similar files ~5-10 per agent). Each returns: type, best date, a
   2-3 sentence summary, dated events, a suggested name, the group it belongs to,
   and any flags.
4. **Arrange:** copy (never move) each file into the structure the user asked
   for under `organized/`, renamed as requested. Anything unreadable or
   unplaceable goes to `organized/99-Unclassified/` — never dropped silently.
5. **Index:** a `_README.md` per folder, a master `organized/README.md` (snapshot
   + folder map + a manifest mapping every copy to its original/zip + flags), and
   `organized/TIMELINE.md` (dated events, deduped, sorted, each sourced).
6. **Verify:** the `organized/` count equals the inventory count (reconcile via
   the manifest if not); confirm nothing outside `organized/` changed; delete
   staging.
7. End with a short chat summary: inventory vs. organized count, files routed to
   `99-Unclassified/`, and any flags.

## Customization knobs

- Grouping scheme and naming — set by the user's answers in step 1.
- Sub-agent batching (~5-10 small files per agent) — tune for folder size.

## Notes

- **Copy, never move.** The only write zone is `organized/`.
- **Every file is accounted for** — nothing dropped silently.
- **Extract every zip**, even if contents "look like duplicates" — note the
  duplicates in the README.
- Verification is exact, not "roughly equal."
- If an `organized/` folder already exists, ask before replacing it.
- For litigation case files specifically, the `organize-for-me` skill applies a
  fixed legal taxonomy — use it instead of this generic recipe when relevant.
```

- [ ] **Step 4: Replace `recipes/draft-from-files.md` with the generic version**

Overwrite the whole file with:

```markdown
---
description: Draft work-product from an organized/ folder's index, citing source files — draft only, review required — after asking what to draft
---

You are drafting work-product from material that has already been organized into
an `organized/` folder. You work from the index it produced (the manifest, the
per-file summaries, and `TIMELINE.md`) and open original files only to confirm a
specific quote or figure. The draft is a starting point, never final.

## Persistent inputs

- `organized/` — output of the organize recipe: `README.md` (snapshot +
  manifest), `TIMELINE.md`, the grouped folders, and each folder's `_README.md`.

If `organized/` or its `README.md` / `TIMELINE.md` is missing, say so and tell
the user to run the organize recipe first. Stop.

## What to do

1. **Ask first.** Open by asking 2-4 short questions: what to draft, who it is
   for, the sections it needs, and how to cite sources. Wait for answers.
2. Read the index first: `organized/README.md` and `organized/TIMELINE.md`.
3. **Fan out sub-agents by theme**, in parallel — one per topic the draft needs.
   Each reads only the relevant folder's `_README.md` and the specific files it
   points to, returning facts/dates/short quotes tied to a source filename.
4. Assemble the draft into `drafts/<what-you-asked-for>.md`. Every factual
   statement cites its source file, e.g. `(Security/2025-03 Vendor SOC2.pdf)`.
5. End with a short chat summary: what you drafted, the files it draws on, and
   anything requested that the material does not support.

## Customization knobs

- Output type/template and citation style — set by the user's answers in step 1.
- Themes to fan out — match the draft's sections.

## Notes

- **Draft from the material, not from memory.** Every claim traces to a file in
  `organized/`; if unsupported, leave it out and list it as a gap.
- **Don't fabricate** dates, quotes, names, or figures.
- The index summarizes files — a very long source may have been read only in
  part — so open the full source for anything a draft leans on heavily.
- Originals in `organized/` are read-only; write only under `drafts/`.
- End every draft with: **"DRAFT — review required. Verify all facts and
  citations against the source files before any use."**
- Re-running overwrites the file in `drafts/`.
```

- [ ] **Step 5: Verify recipes**

Run:
```bash
cd /Users/hdunlap/Repos/claude-code-director-demos
ls recipes/document-digest.md recipes/organize-files.md recipes/draft-from-files.md
grep -lc 'Ask first' recipes/document-digest.md recipes/organize-files.md recipes/draft-from-files.md
grep -c 'organize-for-me' recipes/organize-files.md
```
Expected: all three files listed; "Ask first" found in each; `organize-for-me` referenced once in organize-files.md. (Old legal names `recipes/organize-case-file.md` / `draft-from-case-file.md` should no longer exist.)

- [ ] **Step 6: Commit**

```bash
git add -A recipes/
git commit -m "feat(recipes): generalize digest/organize/draft recipes (interview-first)"
```

---

### Task 3: Hub page — rename + lean rewrite

**Files:**
- Rename: `demos/legal-overview.html` → `demos/long-context.html`
- Modify: the renamed file (full content rewrite)

**Interfaces:**
- Consumes: card targets `document-digest.html`, `organize-files.html`, `draft-from-files.html` (the latter two are renamed in Tasks 5–6; links are correct once those land).
- Produces: hub at `demos/long-context.html`, `data-page="long-context"`, reachable as `../demos.html`'s next and from nav.

- [ ] **Step 1: Rename the file**

```bash
cd /Users/hdunlap/Repos/claude-code-director-demos
git mv demos/legal-overview.html demos/long-context.html
```

- [ ] **Step 2: Replace the entire file contents** with:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Long-Context Workflows · Vibe Coding with Claude Code</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../styles/main.css">
</head>
<body data-page="long-context">
  <header class="topbar">
    <div class="brand">
      <img src="../assets/nelnet-wordmark.svg" alt="Nelnet" onerror="this.replaceWith(Object.assign(document.createElement('span'),{textContent:'Nelnet'}));">
    </div>
    <nav>
      <a href="../demos.html" class="nav-prev" data-key-prev>← demos</a>
      <a href="document-digest.html" class="nav-next" data-key-next>next →</a>
    </nav>
  </header>
  <main class="container detail">
    <header class="detail-header">
      <h1>📚 Long-Context Workflows</h1>
      <div class="built-from">
        <span class="built-from__label">Built from</span>
        <a class="tool-chip" href="../tools.html#files-and-commands"><span class="tool-chip__icon">📁</span> Files &amp; commands</a>
        <a class="tool-chip" href="../tools.html#sub-agents"><span class="tool-chip__icon">🤝</span> Sub-agents</a>
      </div>
    </header>

    <section class="detail-section">
      <h2>When a task buries you in material</h2>
      <p>Some work is heavy on context — a 90-page contract, a folder of 200 files, a stack of sources to draft from. Three workflows make that manageable. Each works wherever you run Claude, and each takes in far more than it could in one pass.</p>
    </section>

    <section class="detail-section">
      <h2>What makes it work: sub-agents</h2>
      <p>The engine is <strong>sub-agents</strong> — a team of reading assistants. Instead of reading one giant thing front-to-back (where the middle gets lost and Claude runs out of room), Claude hands each document or section to its own assistant. They read <em>at the same time</em> and hand their notes back, so hundreds of pages or files get processed in parallel and nothing in the middle falls through. <a href="../tools.html#sub-agents">More on sub-agents →</a></p>
    </section>

    <hr class="hairline">

    <section class="detail-section">
      <h2>The three workflows</h2>
      <p>Each opens with a copy-paste block. Every page has a <strong>Generic</strong> version (Claude asks what you need first) and a <strong>Legal</strong> example.</p>
      <div class="cards">
        <a class="card" href="document-digest.html">
          <div class="card__strip"></div>
          <div class="card__body">
            <div class="card__icon">📄</div>
            <h2>Document Digest</h2>
            <p>Drop one long document, get a structured, page-cited summary and a timeline.</p>
            <div class="card__tags">
              <span class="tag">Any long doc</span>
              <span class="tag">Sub-agents</span>
            </div>
          </div>
          <div class="card__accent"></div>
        </a>
        <a class="card" href="organize-files.html">
          <div class="card__strip"></div>
          <div class="card__body">
            <div class="card__icon">🗂️</div>
            <h2>Organize Files</h2>
            <p>Point Claude at a messy folder, get an organized, indexed tree — originals untouched.</p>
            <div class="card__tags">
              <span class="tag">Any folder</span>
              <span class="tag">Sub-agents</span>
            </div>
          </div>
          <div class="card__accent"></div>
        </a>
        <a class="card" href="draft-from-files.html">
          <div class="card__strip"></div>
          <div class="card__body">
            <div class="card__icon">✍️</div>
            <h2>Draft from Files</h2>
            <p>Turn an organized index into a cited draft — every line traceable to a source.</p>
            <div class="card__tags">
              <span class="tag">Any sources</span>
              <span class="tag">Sub-agents</span>
            </div>
          </div>
          <div class="card__accent"></div>
        </a>
      </div>
      <p>They chain: <strong>organize → index → draft.</strong> Organizing builds an index (a manifest and a timeline); drafting reads that index instead of re-reading everything.</p>
    </section>

    <nav class="page-footer-nav">
      <a href="../demos.html" data-key-prev>← demos</a>
      <a href="document-digest.html" data-key-next>Document Digest →</a>
    </nav>
  </main>
  <script type="module" src="../js/main.js"></script>
</body>
</html>
```

- [ ] **Step 3: Verify the hub**

Run:
```bash
cd /Users/hdunlap/Repos/claude-code-director-demos
grep -c 'data-page="long-context"' demos/long-context.html
grep -c 'legal-data-handling\|Same engine\|When to use which' demos/long-context.html
grep -oE 'href="(document-digest|organize-files|draft-from-files)\.html"' demos/long-context.html
```
Expected: `data-page` = 1; the second grep prints `0` (no leftover legal/surface framing, no data-handling link); the third lists all three card hrefs.

- [ ] **Step 4: Browser check**

Open `demos/long-context.html` in a browser. Confirm: header renders, three cards link correctly, no broken layout. (Card targets to renamed pages resolve after Tasks 5–6.)

- [ ] **Step 5: Commit**

```bash
git add -A demos/long-context.html
git commit -m "feat(long-context): lean hub, replaces legal-overview"
```

---

### Task 4: Document Digest — add Generic | Legal tabs

**Files:**
- Modify: `demos/document-digest.html`

**Interfaces:**
- Consumes: `.tabs` contract (Task 1); `../recipes/document-digest.md` (Task 2).
- Produces: digest page with `data-page="document-digest"`, nav prev `long-context.html` / next `organize-files.html`.

- [ ] **Step 1: Update nav and intro framing**

In `demos/document-digest.html`:
- Topbar `nav-prev` href → `long-context.html` with label `← Long-Context`; `nav-next` href → `organize-files.html`.
- Footer `page-footer-nav`: prev → `long-context.html` (`← Long-Context`), next → `organize-files.html` (`Organize Files →`).
- In "What you'll need", change the link `<a href="legal-data-handling.html">Working safely with client data</a>` to plain text "Claude Code or Claude Cowork" (the data-handling page is being deleted). Keep the `inbox/` and `outputs/` bullets.
- "What you'll do" copy: make it generic (any long document, not "this is the headline of the set"). Keep the page-cite + verify framing.

- [ ] **Step 2: Wrap the two examples in the tab component**

Replace the current single example region (the `Step 2 — Paste this into Cowork` prompt block, the `What Cowork does` terminal, and the `What you get` reveal) with this structure. The **Legal panel** reuses the EXISTING legal prompt/activity-log/sample already in this file (move them in, unchanged except the closing line already says "source document"). The **Generic panel** is new:

```html
    <section class="detail-section">
      <h2>Paste this into Claude</h2>
      <p>Pick an example. The generic version asks you what you need first; the legal version is a worked case-file example.</p>
      <div class="tabs" data-tabs>
        <div class="tabs__list" role="tablist" aria-label="Choose an example">
          <button class="tabs__tab is-active" role="tab" id="tab-generic" aria-controls="panel-generic" aria-selected="true" data-tab="generic" type="button">Generic — any long document</button>
          <button class="tabs__tab" role="tab" id="tab-legal" aria-controls="panel-legal" aria-selected="false" tabindex="-1" data-tab="legal" type="button">Legal example</button>
        </div>

        <div class="tabs__panel is-active" role="tabpanel" id="panel-generic" aria-labelledby="tab-generic" data-panel="generic">
          <pre class="prompt-block"><button class="copy-btn copy-btn--light" data-copy-from="parent-pre" type="button" aria-label="Copy prompt">📋 Copy</button>I have one long document I need to get on top of fast. Before you dig in, ask me 2-4 quick questions to understand what I need — what kind of document this is, what I'm trying to get out of it, which details matter most, and what format I want back. Wait for my answers.

Then:
- Read the whole document. Tell me the page count first.
- If it's long (more than ~20 pages), read it section by section using sub-agents in parallel, then combine the section summaries so nothing in the middle is missed.
- Write a structured summary in the format I asked for, plus a timeline of any dated events. End every point with the page it came from, like (p. 14).

Don't make anything up. If a passage is ambiguous, flag it for me to check rather than guessing.</pre>
          <p>Claude opens by interviewing you, then fans out:</p>
          <pre class="terminal" data-terminal><button class="copy-btn" data-copy-from="parent-pre" type="button" aria-label="Copy output">📋 Copy</button><code><span class="output">A few questions before I start:
  1. What kind of document is this?
  2. What do you most need from it?
  3. Which details matter most?
  4. What format do you want back?
[you answer]
Reading inbox/Vendor-MSA.pdf … 62 pages, text selectable
Long document — splitting into 5 sections
Dispatching 5 section readers in parallel … done
Combining section summaries — nothing in the middle dropped
Wrote outputs/SUMMARY.md   — every point cites a page
Wrote outputs/TIMELINE.md  — 7 dated events</span></code></pre>
          <details class="reveal">
            <summary>What outputs/SUMMARY.md looks like</summary>
            <div class="reveal__body">
              <p>Built in the format you asked for, every point tied to a page:</p>
              <pre class="terminal terminal--file" data-file-path="outputs/SUMMARY.md"><button class="copy-btn" data-copy-from="parent-pre" type="button" aria-label="Copy file content">📋 Copy</button><code># Summary — Vendor Master Services Agreement

## Document &amp; parties
- Master services agreement between Northwind Corp (Client) and Vendor LLC. (p. 1)
- Effective date: 2025-04-01. (p. 1)

## What matters most (you asked: renewal &amp; liability)
- Auto-renews for 12-month terms unless cancelled 60 days prior. (p. 8)
- Liability capped at 12 months of fees; carve-out for data breach. (p. 11)

## Deadlines &amp; dates
- Non-renewal notice due 2026-01-31. (p. 8)

## Open questions
- "Fees" is defined two ways (Order Form vs. §4) — confirm which controls. (pp. 2, 5)  [flagged]

---
First-pass summary — spot-check each point against the cited pages before relying on it.</code></pre>
              <p class="copy-source-link">Reusable recipe lives at <a href="../recipes/document-digest.md">recipes/document-digest.md</a>.</p>
            </div>
          </details>
        </div>

        <div class="tabs__panel" role="tabpanel" id="panel-legal" aria-labelledby="tab-legal" data-panel="legal" hidden>
          <!-- MOVE HERE: the existing legal prompt-block, the existing "What Cowork does" terminal,
               and the existing "What you get" reveal (sample DIGEST.md) from this file, unchanged.
               Update the reveal's copy-source-link to point to ../recipes/document-digest.md and add
               a sentence: "Same recipe, shown here filled in for a case file." -->
        </div>
      </div>
    </section>
```

- [ ] **Step 3: Verify structure**

Run:
```bash
cd /Users/hdunlap/Repos/claude-code-director-demos
grep -c 'tabs__tab' demos/document-digest.html        # expect 2
grep -c 'tabs__panel' demos/document-digest.html       # expect 2
grep -c 'legal-data-handling' demos/document-digest.html # expect 0
b=$(grep -c 'class="copy-btn' demos/document-digest.html); d=$(grep -c 'data-copy' demos/document-digest.html); echo "copy-btn=$b data-copy=$d"  # equal
for t in section pre details; do o=$(grep -c "<$t" demos/document-digest.html); c=$(grep -c "</$t>" demos/document-digest.html); echo "$t $o/$c"; done  # each pair equal
```
Expected: 2 tabs, 2 panels, 0 data-handling refs, copy-btn==data-copy, balanced tags.

- [ ] **Step 4: Browser check**

Open `demos/document-digest.html`. Confirm: Generic tab active by default; clicking "Legal example" swaps the panel; copy buttons flash "✓ Copied" in both panels; reveals expand.

- [ ] **Step 5: Commit**

```bash
git add -A demos/document-digest.html
git commit -m "feat(digest): generic+legal tabs, generic interviews first"
```

---

### Task 5: Organize — rename + Generic | Legal tabs

**Files:**
- Rename: `demos/organize-case-file.html` → `demos/organize-files.html`
- Modify: the renamed file

**Interfaces:**
- Consumes: `.tabs` (Task 1); `../recipes/organize-files.md` (Task 2); `organize-for-me` skill reference (legal panel).
- Produces: `data-page="organize-files"`, nav prev `document-digest.html` / next `draft-from-files.html`.

- [ ] **Step 1: Rename**

```bash
cd /Users/hdunlap/Repos/claude-code-director-demos
git mv demos/organize-case-file.html demos/organize-files.html
```

- [ ] **Step 2: Update shell** — `data-page="organize-files"`, title `Organize Files · …`, `<h1>🗂️ Organize Files</h1>`. Topbar/footer nav: prev `document-digest.html` (`← Document Digest`), next `draft-from-files.html` (`Draft from Files →`). In "What you'll need", drop the `legal-data-handling.html` link (plain text "Claude Code or Claude Cowork"). Keep built-from chips (Files & commands, Sub-agents, Custom commands). Keep the "This one's already a skill" section but reframe it as: the legal example uses the `organize-for-me` skill (fixed legal taxonomy); the generic version asks how you want things grouped.

- [ ] **Step 3: Wrap the two examples in tabs.** Generic panel (new) + Legal panel (move the EXISTING organize prompt/activity-log/tree/README reveal here unchanged; its reference link stays the `organize-for-me` skill / `../recipes/organize-files.md`). Generic panel:

```html
      <div class="tabs" data-tabs>
        <div class="tabs__list" role="tablist" aria-label="Choose an example">
          <button class="tabs__tab is-active" role="tab" id="tab-generic" aria-controls="panel-generic" aria-selected="true" data-tab="generic" type="button">Generic — any folder of files</button>
          <button class="tabs__tab" role="tab" id="tab-legal" aria-controls="panel-legal" aria-selected="false" tabindex="-1" data-tab="legal" type="button">Legal example</button>
        </div>

        <div class="tabs__panel is-active" role="tabpanel" id="panel-generic" aria-labelledby="tab-generic" data-panel="generic">
          <pre class="prompt-block"><button class="copy-btn copy-btn--light" data-copy-from="parent-pre" type="button" aria-label="Copy prompt">📋 Copy</button>I have a folder of mixed files I need to make sense of. Before you start, ask me 2-4 questions — what these files are, how I'd like them grouped (by date? type? topic?), how I want them named, and whether anything is sensitive. Wait for my answers.

Then:
- Look at everything first, and extract any zip files (including zips inside zips).
- Read the files by fanning out sub-agents in parallel — one per file, grouping small similar files — so it goes fast. For each, note its type, date, a short summary, and anything odd.
- Copy — never move — every file into the structure I asked for, under a new organized/ folder, renamed clearly. Put anything you can't read or place into organized/99-Unclassified/ — never drop a file silently.
- Build an index: a short README in each folder, a master organized/README.md mapping every copy back to its original, and organized/TIMELINE.md of any dated events.
- Check the counts match and confirm you didn't touch anything outside organized/.

Leave my originals exactly as they are. If an organized/ folder already exists, or anything's unclear, ask me before going ahead.</pre>
          <p>Claude interviews you, then fans out a reader per file:</p>
          <pre class="terminal" data-terminal><button class="copy-btn" data-copy-from="parent-pre" type="button" aria-label="Copy output">📋 Copy</button><code><span class="output">A few questions before I start:
  1. What are these files?
  2. Group by date, type, or topic?
  3. How should I name them?
  4. Anything sensitive to flag?
[you answer: group by topic; name "YYYY-MM Title"]
Inventory: 84 files (12 inside 2 zips — extracted)
Reading by fanning out 14 sub-agents in parallel … done
Copying into organized/ by topic (originals untouched)
Wrote folder READMEs + organized/README.md + organized/TIMELINE.md
✓ 84 files in organized/ == 84 inventoried
✓ nothing outside organized/ changed
⚠ 1 file → 99-Unclassified (password-protected)</span></code></pre>
          <details class="reveal">
            <summary>What organized/README.md looks like</summary>
            <div class="reveal__body">
              <p>The master index — grouped the way you asked, every copy traced to its origin:</p>
              <pre class="terminal terminal--file" data-file-path="organized/README.md"><button class="copy-btn" data-copy-from="parent-pre" type="button" aria-label="Copy file content">📋 Copy</button><code># Index — Q2 Vendor Evaluation

## Snapshot
84 files on the Q2 vendor evaluation, grouped by topic as requested.

## Folder map
- Pricing/        — quotes, rate cards
- Security/       — SOC 2 reports, questionnaires
- Contracts/      — MSAs, order forms
- Correspondence/ — email threads
- 99-Unclassified — 1 file (password-protected)

## Manifest (excerpt)
| Organized file | Original source |
| --- | --- |
| Security/2025-03 Vendor SOC2.pdf | downloads/soc2_final(2).pdf |
| Pricing/2025-02 Rate Card.xlsx | zips/pricing.zip → ratecard.xlsx |

## Flags
- 1 password-protected file routed to 99-Unclassified.</code></pre>
              <p class="copy-source-link">Reusable recipe lives at <a href="../recipes/organize-files.md">recipes/organize-files.md</a>.</p>
            </div>
          </details>
        </div>

        <div class="tabs__panel" role="tabpanel" id="panel-legal" aria-labelledby="tab-legal" data-panel="legal" hidden>
          <!-- MOVE HERE: the existing legal organize prompt-block, the "What Cowork does" Phase 1-4
               terminal, the organized/ tree terminal, and the organized/README.md reveal from this
               file, unchanged. Keep the legal reveal's copy-source-link, and add: "For case files the
               organize-for-me skill applies a fixed legal taxonomy." -->
        </div>
      </div>
```

- [ ] **Step 4: Verify**

Run:
```bash
cd /Users/hdunlap/Repos/claude-code-director-demos
ls demos/organize-files.html
grep -c 'data-page="organize-files"' demos/organize-files.html      # 1
grep -c 'tabs__panel' demos/organize-files.html                      # 2
grep -c 'legal-data-handling\|organize-case-file' demos/organize-files.html  # 0
b=$(grep -c 'class="copy-btn' demos/organize-files.html); d=$(grep -c 'data-copy' demos/organize-files.html); echo "$b/$d"  # equal
```
Expected: file exists, data-page 1, 2 panels, 0 stale refs, copy-btn==data-copy.

- [ ] **Step 5: Browser check** — open `demos/organize-files.html`; tabs toggle; copy buttons work in both panels.

- [ ] **Step 6: Commit**

```bash
git add -A demos/organize-files.html
git commit -m "feat(organize): rename to organize-files + generic/legal tabs"
```

---

### Task 6: Draft — rename + Generic | Legal tabs

**Files:**
- Rename: `demos/draft-from-case-file.html` → `demos/draft-from-files.html`
- Modify: the renamed file

**Interfaces:**
- Consumes: `.tabs` (Task 1); `../recipes/draft-from-files.md` (Task 2).
- Produces: `data-page="draft-from-files"`, nav prev `organize-files.html` / next `../demos.html`.

- [ ] **Step 1: Rename**

```bash
cd /Users/hdunlap/Repos/claude-code-director-demos
git mv demos/draft-from-case-file.html demos/draft-from-files.html
```

- [ ] **Step 2: Update shell** — `data-page="draft-from-files"`, title `Draft from Files · …`, `<h1>✍️ Draft from Files</h1>`. Topbar/footer nav: prev `organize-files.html` (`← Organize Files`), next `../demos.html` (`back to demos →` / `Back to demos →`). Built-from chips unchanged (Files & commands, Sub-agents, Persistent memory). In "What you'll need", change the Organize link to `organize-files.html` and drop any `legal-data-handling.html` link. Keep the "index may be a partial read of long docs → pull the full source" caution in "Why it matters".

- [ ] **Step 3: Wrap the two examples in tabs.** Generic panel (new) + Legal panel (move EXISTING draft prompt/activity-log/sample-chronology reveal here unchanged; reference link `../recipes/draft-from-files.md`). Generic panel:

```html
      <div class="tabs" data-tabs>
        <div class="tabs__list" role="tablist" aria-label="Choose an example">
          <button class="tabs__tab is-active" role="tab" id="tab-generic" aria-controls="panel-generic" aria-selected="true" data-tab="generic" type="button">Generic — any organized material</button>
          <button class="tabs__tab" role="tab" id="tab-legal" aria-controls="panel-legal" aria-selected="false" tabindex="-1" data-tab="legal" type="button">Legal example</button>
        </div>

        <div class="tabs__panel is-active" role="tabpanel" id="panel-generic" aria-labelledby="tab-generic" data-panel="generic">
          <pre class="prompt-block"><button class="copy-btn copy-btn--light" data-copy-from="parent-pre" type="button" aria-label="Copy prompt">📋 Copy</button>I have an organized/ folder of material I want to draft from. Before you start, ask me 2-4 questions — what I want drafted, who it's for, the sections it needs, and how to cite sources. Wait for my answers.

Then:
- Read the index first (organized/README.md and organized/TIMELINE.md) to get the map of the material.
- Fan out sub-agents in parallel — one per theme the draft needs — each reading only the relevant files and bringing back facts with their source.
- Assemble the draft into drafts/. After every factual statement, cite the source file it came from.
- List anything I asked for that the material doesn't support.

Every fact must come from the material — if it's not there, don't write it, list it as a gap. Draft only; I'll review.</pre>
          <p>Claude interviews you, then gathers support by theme:</p>
          <pre class="terminal" data-terminal><button class="copy-btn" data-copy-from="parent-pre" type="button" aria-label="Copy output">📋 Copy</button><code><span class="output">A few questions before I start:
  1. What do you want drafted?
  2. Who's it for?
  3. What sections does it need?
  4. How should I cite sources?
[you answer: vendor-evaluation memo for the steering committee]
Reading the index: organized/README.md + organized/TIMELINE.md
Fanning out sub-agents by theme, in parallel:
  ├─ pricing ........... 6 facts
  ├─ security .......... 9 facts
  └─ contract terms .... 5 facts
Assembling drafts/vendor-evaluation-memo.md — every line cites a source file
⚠ 1 requested point unsupported by the material — listed as a gap</span></code></pre>
          <details class="reveal">
            <summary>What drafts/vendor-evaluation-memo.md looks like</summary>
            <div class="reveal__body">
              <p>Sourced line by line, with gaps called out:</p>
              <pre class="terminal terminal--file" data-file-path="drafts/vendor-evaluation-memo.md"><button class="copy-btn" data-copy-from="parent-pre" type="button" aria-label="Copy file content">📋 Copy</button><code># Vendor Evaluation Memo — Q2

## Pricing
- Vendor LLC quoted $120k/yr on a 12-month auto-renew. (Pricing/2025-02 Rate Card.xlsx)

## Security
- SOC 2 Type II current through 2025-12. (Security/2025-03 Vendor SOC2.pdf)

## Contract terms
- Liability capped at 12 months of fees. (Contracts/2025-04 Vendor MSA.pdf)

## Open gaps
- No customer reference checks on file. [requested, not found]

---
DRAFT — review required. Verify all facts and citations against the source files before any use.</code></pre>
              <p class="copy-source-link">Reusable recipe lives at <a href="../recipes/draft-from-files.md">recipes/draft-from-files.md</a>.</p>
            </div>
          </details>
        </div>

        <div class="tabs__panel" role="tabpanel" id="panel-legal" aria-labelledby="tab-legal" data-panel="legal" hidden>
          <!-- MOVE HERE: the existing legal draft prompt-block, "What Cowork does" terminal, and the
               drafts/chronology.md reveal from this file, unchanged. Update its copy-source-link to
               ../recipes/draft-from-files.md and add: "Same recipe, shown filled in for a case file." -->
        </div>
      </div>
```

- [ ] **Step 4: Verify**

Run:
```bash
cd /Users/hdunlap/Repos/claude-code-director-demos
ls demos/draft-from-files.html
grep -c 'data-page="draft-from-files"' demos/draft-from-files.html   # 1
grep -c 'tabs__panel' demos/draft-from-files.html                     # 2
grep -c 'draft-from-case-file\|legal-data-handling' demos/draft-from-files.html  # 0
b=$(grep -c 'class="copy-btn' demos/draft-from-files.html); d=$(grep -c 'data-copy' demos/draft-from-files.html); echo "$b/$d"  # equal
```

- [ ] **Step 5: Browser check** — open `demos/draft-from-files.html`; tabs toggle; copy buttons work.

- [ ] **Step 6: Commit**

```bash
git add -A demos/draft-from-files.html
git commit -m "feat(draft): rename to draft-from-files + generic/legal tabs"
```

---

### Task 7: Delete data-handling, rewire nav, final site sweep

**Files:**
- Delete: `demos/legal-data-handling.html`
- Modify: `index.html`, `demos.html`

**Interfaces:**
- Consumes: `demos/long-context.html` (Task 3) as the section entry point.

- [ ] **Step 1: Delete the data-handling page**

```bash
cd /Users/hdunlap/Repos/claude-code-director-demos
git rm demos/legal-data-handling.html
```

- [ ] **Step 2: Update `index.html`**

- Change the chip: `<a class="chip" href="demos/legal-overview.html"><span class="chip__icon">⚖️</span> Legal Team</a>` → `<a class="chip" href="demos/long-context.html"><span class="chip__icon">📚</span> Long Context</a>`.
- Change the "How this works" bullet that mentions "Legal Team track" → `<li>You'll see four small apps directors can build, a skeleton for your own idea, and a Long-Context Workflows track for document-heavy work.</li>`

- [ ] **Step 3: Update `demos.html`**

- Update the `cards-intro` line: replace "and a Legal Team track for document-heavy work without a terminal" with "and a Long-Context Workflows track for tasks with a lot of material to read."
- Replace the Legal Team card with:

```html
      <a class="card" href="demos/long-context.html">
        <div class="card__strip"></div>
        <div class="card__body">
          <div class="card__icon">📚</div>
          <h2>Long-Context Workflows</h2>
          <p>Digest, organize, and draft when a task has a lot of material.</p>
          <div class="card__tags">
            <span class="tag">Sub-agents</span>
            <span class="tag">Long context</span>
          </div>
        </div>
        <div class="card__accent"></div>
      </a>
```

- [ ] **Step 4: Full-site link + reference sweep**

Run (sandbox off so loops work; pure grep + zsh):
```bash
cd /Users/hdunlap/Repos/claude-code-director-demos
echo "=== no stale names anywhere ==="
grep -rn 'legal-overview\|legal-data-handling\|organize-case-file\|draft-from-case-file\|Legal Team' index.html demos.html demos/*.html recipes/*.md || echo "  clean ✓"
echo "=== resolve all local links in the 4 section pages ==="
pages=(demos/long-context.html demos/document-digest.html demos/organize-files.html demos/draft-from-files.html)
for page in $pages; do
  dir=${page:h}
  for m in ${(f)"$(grep -oE '(href|src)="[^\"]+"' $page)"}; do
    val=${m#*\"}; val=${val%\"}
    case "$val" in http*|\#*) continue;; esac
    p=${val%%\#*}
    [[ -f "$dir/$p" ]] || echo "  BROKEN: $page -> $val"
  done
done
echo "  (no BROKEN lines = OK)"
```
Expected: first grep prints `clean ✓` (use `dangerouslyDisableSandbox` so the `||` runs; if any hits appear, fix them); no BROKEN lines.

- [ ] **Step 5: Prev/next chain check**

```bash
cd /Users/hdunlap/Repos/claude-code-director-demos
pages=(demos/long-context.html demos/document-digest.html demos/organize-files.html demos/draft-from-files.html)
for page in $pages; do
  nm=(${(f)"$(grep -oE 'href="[^\"]+"[^>]*data-key-next' $page)"})
  pm=(${(f)"$(grep -oE 'href="[^\"]+"[^>]*data-key-prev' $page)"})
  nh=${nm[1]#*href=\"}; nh=${nh%%\"*}; ph=${pm[1]#*href=\"}; ph=${ph%%\"*}
  printf "%-28s prev=%-22s next=%s\n" "${page:t}" "$ph" "$nh"
done
```
Expected chain: long-context (prev ../demos.html, next document-digest.html) → document-digest (prev long-context.html, next organize-files.html) → organize-files (prev document-digest.html, next draft-from-files.html) → draft-from-files (prev organize-files.html, next ../demos.html).

- [ ] **Step 6: Browser check** — from `index.html`, click the "Long Context" chip → hub → walk all three workflow pages via the cards and ←/→; toggle tabs and copy buttons on each.

- [ ] **Step 7: Commit**

```bash
git add -A index.html demos.html
git add -A   # stage the deletion
git commit -m "feat(nav): retitle section to Long Context; remove data-handling slide"
```

- [ ] **Step 8: Push the branch**

Use `dangerouslyDisableSandbox: true`:
```bash
cd /Users/hdunlap/Repos/claude-code-director-demos
git push
```

---

## Self-Review

**Spec coverage:**
- Reframe to "Long-Context Workflows" → Tasks 3 (hub), 7 (nav labels). ✓
- Surface-agnostic generic / Cowork legal → Tasks 4–6 generic prompts (surface-neutral) + moved legal panels. ✓
- `Generic | Legal` tab, generic default → Task 1 (component) + Tasks 4–6 (usage). ✓
- Generic interviews first → generic prompts + activity logs in Tasks 4–6. ✓
- Remove data-handling slide entirely → Task 7 (delete) + Tasks 3–6 (drop inbound links). ✓
- Lean hub w/ sub-agents note → Task 3. ✓
- Renames (pages + recipes) → Tasks 2, 3, 5, 6. ✓
- Recipes generalized; legal Organize → skill → Task 2. ✓
- New tab CSS/JS only; no other restyle → Task 1; constraints enforced in verifies. ✓
- Nav from index.html + demos.html under "Long Context" → Task 7. ✓
- Four-page reciprocal chain → Task 7 Step 5. ✓

**Placeholder scan:** The only `<!-- MOVE HERE -->` comments instruct moving EXISTING, committed content (present in the repo at the named file) into the legal panel — not undefined future content. All new content (prompts, logs, samples, recipes, CSS, JS) is shown in full. No TBD/TODO.

**Type/name consistency:** Tab markup contract (`.tabs`, `.tabs__list`, `.tabs__tab[data-tab]`, `.tabs__panel[data-panel]`, `is-active`, `hidden`) is identical in Task 1 (definition) and Tasks 4–6 (usage). Recipe paths (`organize-files.md`, `draft-from-files.md`, `document-digest.md`) consistent across Tasks 2, 4–6. Page slugs / `data-page` consistent with filenames.
