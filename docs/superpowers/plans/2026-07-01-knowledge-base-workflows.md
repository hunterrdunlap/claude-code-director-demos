# Knowledge Base Workflows Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a "Knowledge Base Workflows" demo track (one landing page + three sub-demos + three recipe files) to the demo site, mirroring the existing Long-Context track.

**Architecture:** Hand-authored static HTML pages that reuse `styles/main.css` and `js/main.js` unchanged. The landing page (`demos/knowledge-base.html`) models on `demos/long-context.html`; each sub-demo models on `demos/document-digest.html` (generic-only — no `data-tabs`). Three recipe markdown files model on `recipes/organize-files.md`. Two existing pages (`demos.html`, `index.html`) gain a card and a chip.

**Tech Stack:** Static HTML5, the existing `main.css` class vocabulary, `main.js` (copy buttons, tab handling, keyboard nav). No build step; pages open from `file://` or when served.

## Global Constraints

- **No changes to `styles/main.css` or `js/main.js`.** Reuse existing classes only.
- **Generic-only:** no second example tab; do NOT use the `data-tabs` component.
- **Built-from chips** on every track page: `📁 Files & commands` → `../tools.html#files-and-commands`, `🧠 Persistent memory` → `../tools.html#persistent-memory`.
- **Escape HTML entities** in all prompt/terminal blocks: `&amp;` for `&`, `&lt;`/`&gt;` for `<`/`>`. (PARA folder names like `<ProjectName>` MUST be escaped.)
- **Copy buttons:** every `.prompt-block` and `.terminal` starts with `<button class="copy-btn ..." data-copy-from="parent-pre" type="button" aria-label="...">📋 Copy</button>`. Prompt blocks use `copy-btn--light`; terminals use plain `copy-btn`.
- **Head block** identical to other demo pages (same 4 font/preconnect links + `<link rel="stylesheet" href="../styles/main.css">`), and `<script src="../js/main.js"></script>` before `</body>`.
- **Every page** has both a `header.topbar > nav` (prev/next) and a `nav.page-footer-nav` (prev/next) with matching targets and `data-key-prev`/`data-key-next` attributes.
- **`data-page`** attribute on `<body>` = the file's basename (e.g. `data-page="kb-team-wiki"`).
- **Absolute date context:** today is 2026-07-01; any example dates should be internally consistent and plausible.

## Nav chain (verbatim targets)

- `knowledge-base.html`: prev `../demos.html`, next `kb-personal-vault.html`
- `kb-personal-vault.html`: prev `knowledge-base.html`, next `kb-team-wiki.html`
- `kb-team-wiki.html`: prev `kb-personal-vault.html`, next `kb-distilled-wiki.html`
- `kb-distilled-wiki.html`: prev `kb-team-wiki.html`, next `../demos.html`

---

## Task 1: Landing page (`demos/knowledge-base.html`)

**Files:**
- Create: `demos/knowledge-base.html`
- Reference (read for structure, do not edit): `demos/long-context.html`

**Interfaces:**
- Produces: the file `demos/knowledge-base.html`, linked to by Task 5's card in `demos.html` and chip in `index.html`. Its three `.card` links point to `kb-personal-vault.html`, `kb-team-wiki.html`, `kb-distilled-wiki.html` (created in Tasks 2–4).

- [ ] **Step 1: Author the page**

Copy the exact skeleton of `demos/long-context.html` (head, topbar, detail-header, sections, footer nav, script). Replace content as follows.

- `<body data-page="knowledge-base">`
- Topbar nav: `<a href="../demos.html" class="nav-prev" data-key-prev>← demos</a>` and `<a href="kb-personal-vault.html" class="nav-next" data-key-next>next →</a>`
- `<title>Knowledge Base Workflows · Vibe Coding with Claude Code</title>`
- detail-header:

```html
<header class="detail-header">
  <h1>🧠 Knowledge Base Workflows</h1>
  <div class="built-from">
    <span class="built-from__label">Built from</span>
    <a class="tool-chip" href="../tools.html#files-and-commands"><span class="tool-chip__icon">📁</span> Files &amp; commands</a>
    <a class="tool-chip" href="../tools.html#persistent-memory"><span class="tool-chip__icon">🧠</span> Persistent memory</a>
  </div>
</header>
```

- Section 1 — intro:

```html
<section class="detail-section">
  <h2>When your work outlives any single chat</h2>
  <p>Notes, sources, decisions, project history — knowledge accumulates faster than any one conversation can hold, and it needs to still be there next week. The fix isn't a database. It's a folder of plain markdown files, structured so Claude can reason over all of it. Three workflows, each a different shape of that same idea. Each works wherever you run Claude.</p>
</section>
```

- Section 2 — the engine:

```html
<section class="detail-section">
  <h2>What makes it work: files + a CLAUDE.md schema</h2>
  <p>No vector database, no embeddings, no retrieval pipeline. The knowledge lives in <strong>plain markdown files you own</strong>, and a <strong><code>CLAUDE.md</code></strong> at the root teaches Claude how they're organized — the folders, the naming, the rules for where things go. So when you ask a question, Claude reads the actual files and answers from them, and every answer traces back to a file you can open and check. Unlike a black-box RAG index, you can read the whole thing in any text editor, and it travels with you in git. <a href="../tools.html#persistent-memory">More on persistent memory →</a></p>
</section>
```

- `<hr class="hairline">`
- Section 3 — the three cards:

```html
<section class="detail-section">
  <h2>The three workflows</h2>
  <p>They line up by who they're for — one person, a team, or a pile of raw sources you need to make sense of. Same engine, three shapes.</p>
  <div class="cards">
    <a class="card" href="kb-personal-vault.html">
      <div class="card__strip"></div>
      <div class="card__body">
        <div class="card__icon">📓</div>
        <h2>Personal Vault</h2>
        <p>A PARA folder structure for your own notes, tasks, and project logs — ask it to prep you, capture, or report status.</p>
        <div class="card__tags">
          <span class="tag">One person</span>
          <span class="tag">PARA</span>
        </div>
      </div>
      <div class="card__accent"></div>
    </a>
    <a class="card" href="kb-team-wiki.html">
      <div class="card__strip"></div>
      <div class="card__body">
        <div class="card__icon">👥</div>
        <h2>Team Wiki</h2>
        <p>Docs-as-code, shared in git. Raw sources in, authored wiki pages out, with an index Claude keeps current.</p>
        <div class="card__tags">
          <span class="tag">A team</span>
          <span class="tag">Docs-as-code</span>
        </div>
      </div>
      <div class="card__accent"></div>
    </a>
    <a class="card" href="kb-distilled-wiki.html">
      <div class="card__strip"></div>
      <div class="card__body">
        <div class="card__icon">🔮</div>
        <h2>Distilled Wiki</h2>
        <p>Drop raw sources in a folder; Claude distills them into short, cross-linked wiki pages you can browse and query.</p>
        <div class="card__tags">
          <span class="tag">Any sources</span>
          <span class="tag">Auto-linked</span>
        </div>
      </div>
      <div class="card__accent"></div>
    </a>
  </div>
  <p>Pick by audience: <strong>Personal Vault</strong> for your own work, <strong>Team Wiki</strong> when a group edits together, <strong>Distilled Wiki</strong> when you have a stack of sources and want them turned into something browsable.</p>
</section>
```

- Footer nav:

```html
<nav class="page-footer-nav">
  <a href="../demos.html" data-key-prev>← demos</a>
  <a href="kb-personal-vault.html" data-key-next>Personal Vault →</a>
</nav>
```

- [ ] **Step 2: Verify structure**

Run:
```bash
cd /Users/hdunlap/Repos/claude-code-director-demos
grep -c 'class="card"' demos/knowledge-base.html   # expect 3
grep -o 'href="kb-[a-z-]*\.html"' demos/knowledge-base.html | sort -u   # expect the 3 sub-demo links
grep -c 'data-page="knowledge-base"' demos/knowledge-base.html   # expect 1
grep -c 'main.css\|main.js' demos/knowledge-base.html   # expect 2
```
Expected: 3 cards; the three `kb-*.html` links present; page/asset lines present.

- [ ] **Step 3: Render in a browser**

Open `demos/knowledge-base.html` and confirm it visually matches `demos/long-context.html` (topbar, header with two chips, two intro sections, hairline, three-card grid, footer nav). Note: the three card links 404 until Tasks 2–4 exist — that is expected at this point.

- [ ] **Step 4: Commit**

```bash
git add demos/knowledge-base.html
git commit -m "feat(kb): add Knowledge Base Workflows landing page

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 2: Personal Vault sub-demo + recipe

**Files:**
- Create: `demos/kb-personal-vault.html`
- Create: `recipes/kb-personal-vault.md`
- Reference: `demos/document-digest.html` (structure), `recipes/organize-files.md` (recipe format), `/Users/hdunlap/Repos/obsidian-private-notes/CLAUDE.md` (source of truth for PARA structure)

**Interfaces:**
- Consumes: prev nav from `knowledge-base.html`.
- Produces: `demos/kb-personal-vault.html` (next → `kb-team-wiki.html`); recipe at `recipes/kb-personal-vault.md` referenced from the page.

- [ ] **Step 1: Author the HTML page**

Model section-for-section on `demos/document-digest.html`, generic-only (NO `data-tabs`). Key content:

- `<body data-page="kb-personal-vault">`, title `Personal Vault · Vibe Coding with Claude Code`
- Topbar nav: prev `knowledge-base.html` (label `← Knowledge Base`), next `kb-team-wiki.html`
- detail-header: `<h1>📓 Personal Vault</h1>` + the two standard built-from chips (Files & commands, Persistent memory)
- **What you'll do:** one paste sets up a PARA vault — Inbox, Projects, Areas, Resources, Archive — with a `CLAUDE.md` that teaches Claude the capture rule (actionable → a task file, information → a log). After that you talk to it: capture notes, get prepped for a meeting, ask for status. `.preview-frame` placeholder text: `A folder of markdown you talk to — "capture these notes", "prep me for the NFS project", "what's open this week".`
- **What you'll need** (`.needs-list`): Claude Code or Claude Cowork; an empty folder for the vault; git optional but recommended for sync/history.
- **Set it up** — the scaffold prompt (`.prompt-block`, `copy-btn--light`):

```
Set up a personal knowledge vault in this folder using the PARA method. Create this structure and nothing else yet:

- 01_INBOX/           (a Capture.md for raw, untriaged notes)
- 02_PROJECTS/        (active work — one folder per project)
- 03_AREAS/           (ongoing responsibilities)
- 04_RESOURCES/       (reference material)
- 05_ARCHIVE/         (finished or dormant work)
- TEMPLATES/          (a Project template: README.md, Tasks.md, Log.md)
- CLAUDE.md           (the guide below)

Write CLAUDE.md so a future Claude session knows how to work here. It must state:
- The PARA folders above and what each holds.
- Each project folder under 02_PROJECTS/ has three files: README.md (a charter — purpose, goals, stakeholders — plus a short current-status block), Tasks.md (a checklist), and Log.md (reverse-chronological, newest entry on top, dated headers).
- The capture rule: if something is actionable it goes in a Tasks.md; if it's information it goes in a Log.md.
- Common requests and how to handle them: "capture these notes" (route to the right project's Log.md and pull any action items into Tasks.md), "prep me for [project]" (read that project's README, Tasks, and latest Log entries and summarize), "what's the status of [project]".

Then create one starter project — 02_PROJECTS/Example-Project/ — from the template so I can see the shape. Show me the finished tree when you're done.
```

Follow with a `.terminal` preview (plain `copy-btn`) — the scaffold Claude builds:

```
Creating PARA vault …
  01_INBOX/Capture.md
  02_PROJECTS/Example-Project/{README.md, Tasks.md, Log.md}
  03_AREAS/  04_RESOURCES/  05_ARCHIVE/
  TEMPLATES/Project/{README.md, Tasks.md, Log.md}
  CLAUDE.md  — PARA guide + capture rule + common requests
Vault ready. Add a project with: "start a project called <name>"
```

- **Then use it day to day** — three short `.prompt-block`s, each with a one-line lead-in:
  1. Lead-in "Capture, and let Claude file it:" — prompt: `Capture this: had a call with the NFS team — we're moving the data-automation cutover to next month, and I need to send Brandon the revised timeline by Friday. File it in the right project.`
  2. Lead-in "Get prepped before a meeting:" — prompt: `Prep me for the NFS project. Read its README, open tasks, and the last few log entries, then give me status, what's blocking, and three talking points.`
  3. Lead-in "Check the week:" — prompt: `Across all projects, what tasks are open and due this week? Group them by project.`

- A `details.reveal` — summary `What a project README.md looks like`, body intro `Charter on top (why it exists), a short status block below:`, then a `.terminal.terminal--file` with `data-file-path="02_PROJECTS/NFS/README.md"`:

```
# NFS — Nelnet Financial Services

## Purpose
Modernize NFS data automation and credit modeling so reporting is faster and auditable.

## Goals
- Automate the monthly data pull (no manual steps). 
- Stand up a credit model refresh on a repeatable schedule.

## Stakeholders
- Owner: Hunter. Sponsor: Brandon. Informed: NFS leadership.

---

## Status
- Phase: Build. Last updated: 2026-06-28.
- Current focus: data-automation cutover; timeline revision owed to Brandon.
```
Close the reveal with `<p class="copy-source-link">Reusable recipe lives at <a href="../recipes/kb-personal-vault.md">recipes/kb-personal-vault.md</a>.</p>`

- **Make it reusable:** paragraph pointing to `recipes/kb-personal-vault.md`, noting it can be saved as a Cowork skill or a `/setup-vault` command.
- **Why it matters:** the payoff — a personal vault means Claude starts every session already knowing your projects; the structure is what makes "prep me" and "what's open" work without re-explaining anything. It's all plain files, so it's yours and portable.
- Footer nav: prev `knowledge-base.html` (`← Knowledge Base`), next `kb-team-wiki.html` (`Team Wiki →`).

- [ ] **Step 2: Author the recipe** (`recipes/kb-personal-vault.md`)

Match `recipes/organize-files.md` format exactly (YAML frontmatter `description:`, then Persistent inputs / What to do (numbered) / Customization knobs / Notes):

```markdown
---
description: Set up and maintain a PARA personal knowledge vault — Inbox/Projects/Areas/Resources/Archive with per-project README+Tasks+Log — governed by a CLAUDE.md, so "capture", "prep me", and "status" just work.
---

You maintain a personal knowledge vault organized with the PARA method. You
create the structure on first run, then route new information and answer
questions against it. Everything is plain markdown.

## Persistent inputs

- The current working directory — an empty folder (first run) or an existing
  vault with a CLAUDE.md at the root (subsequent runs).

## What to do

1. **On first run, scaffold.** Create the PARA folders (`01_INBOX/`,
   `02_PROJECTS/`, `03_AREAS/`, `04_RESOURCES/`, `05_ARCHIVE/`), a `TEMPLATES/`
   project template (README.md, Tasks.md, Log.md), and a root `CLAUDE.md` that
   documents the structure, the capture rule, and the common requests below.
   Seed one example project so the shape is visible.
2. **Capture.** For "capture this …": decide which project it belongs to
   (Operations if general), append a dated entry to that project's `Log.md`
   (newest on top), and pull any action items into its `Tasks.md`.
3. **Prep.** For "prep me for [project]": read the project's `README.md`,
   `Tasks.md`, and the most recent `Log.md` entries; summarize status, blockers,
   and suggested talking points.
4. **Status.** For "status of [project]" or "what's open this week": read the
   relevant `Tasks.md` files and report, grouped by project.

## Customization knobs

- Folder names / numbering scheme — adjust to taste, but keep them in `CLAUDE.md`.
- Task format (priority markers, dates) — match whatever `CLAUDE.md` defines.
- Add area/resource conventions as the vault grows.

## Notes

- The capture rule is the whole game: actionable → `Tasks.md`, information →
  `Log.md`. Keep it stated plainly in `CLAUDE.md`.
- Never invent status. If a project file doesn't say it, say it's unknown.
- Preserve a project README's charter section; only update the status block
  unless the purpose actually changed.
```

- [ ] **Step 3: Verify structure**

Run:
```bash
cd /Users/hdunlap/Repos/claude-code-director-demos
grep -c 'data-page="kb-personal-vault"' demos/kb-personal-vault.html   # expect 1
grep -c 'data-tabs' demos/kb-personal-vault.html   # expect 0 (generic-only)
grep -c 'copy-btn' demos/kb-personal-vault.html    # expect >= 5 (1 scaffold + 3 daily + 1 reveal)
grep -o 'href="kb-team-wiki.html"' demos/kb-personal-vault.html | head -1   # next-link present
grep -c 'recipes/kb-personal-vault.md' demos/kb-personal-vault.html   # expect >= 1
test -f recipes/kb-personal-vault.md && echo "recipe exists"
```
Expected: page flag 1; no `data-tabs`; ≥5 copy buttons; next link present; recipe referenced and file exists.

- [ ] **Step 4: Render in a browser**

Open `demos/kb-personal-vault.html`. Confirm: header + two chips; the "Set it up" prompt with a working 📋 Copy button (click → "Copied"); three daily prompts; the reveal expands to show the README; footer nav. Structure matches `document-digest.html`.

- [ ] **Step 5: Commit**

```bash
git add demos/kb-personal-vault.html recipes/kb-personal-vault.md
git commit -m "feat(kb): add Personal Vault sub-demo + recipe

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 3: Team Wiki sub-demo + recipe

**Files:**
- Create: `demos/kb-team-wiki.html`
- Create: `recipes/kb-team-wiki.md`
- Reference: `demos/document-digest.html`, `recipes/organize-files.md`

**Interfaces:**
- Consumes: prev nav from `kb-personal-vault.html`.
- Produces: `demos/kb-team-wiki.html` (next → `kb-distilled-wiki.html`); recipe at `recipes/kb-team-wiki.md`.

- [ ] **Step 1: Author the HTML page**

Generic-only, modeled on `document-digest.html`. Key content:

- `<body data-page="kb-team-wiki">`, title `Team Wiki · Vibe Coding with Claude Code`
- Topbar nav: prev `kb-personal-vault.html` (`← Personal Vault`), next `kb-distilled-wiki.html`
- detail-header: `<h1>👥 Team Wiki</h1>` + the two standard built-from chips
- **What you'll do:** set up a docs-as-code wiki a whole team shares in git — original sources land in `raw/` and are never edited; Claude writes clean `wiki/` pages from them and keeps an `index.md` current; a `CLAUDE.md` schema keeps everyone's pages consistent. `.preview-frame`: `A git repo where raw/ holds sources untouched, wiki/ holds authored pages, and index.md always lists what's there.`
- **What you'll need** (`.needs-list`): Claude Code or Cowork; a git repository the team can clone; a source or two to seed it (PDF, doc, or notes).
- **Set it up** — scaffold prompt (`.prompt-block`, `copy-btn--light`):

```
Set up a team knowledge wiki in this git repository, docs-as-code style. Create:

- raw/       (original sources — PDFs, docs, exports. These are never edited.)
- wiki/      (authored markdown pages, one topic per file)
- index.md   (a table of contents you keep up to date)
- CLAUDE.md  (the schema below)

Write CLAUDE.md as the rulebook for the whole team, stating:
- raw/ is immutable — sources go in, nothing gets edited there.
- Every wiki/ page starts with a short header: a one-line summary, an owner, a last-reviewed date, and a "Sources" list linking the raw/ files it draws from.
- Pages are one topic each and cross-link with [[wiki links]].
- index.md lists every wiki page grouped by section, and is updated whenever a page is added or renamed.
- The workflow for adding knowledge: drop a file in raw/, then ask Claude to "write a wiki page from raw/<file>" — Claude drafts wiki/<topic>.md with the header, cites the source, and updates index.md.

Add a wiki/_template.md showing the page header, and seed index.md with an empty section list. Show me the tree when done.
```

Follow with `.terminal` preview:

```
Scaffolding team wiki …
  raw/            (empty — drop sources here)
  wiki/_template.md   (page header: summary, owner, last-reviewed, Sources)
  index.md        (sections, no pages yet)
  CLAUDE.md       (raw/ is immutable; page header; [[links]]; index rules)
Wiki ready. Add knowledge with: "write a wiki page from raw/<file>"
```

- **Then use it day to day** — three `.prompt-block`s:
  1. Lead-in "Turn a source into a page:" — `A new file just landed in raw/ — raw/2026-vendor-msa.pdf. Write a wiki page from it: summarize the key terms in wiki/vendor-msa.md with the standard header, cite the source pages, link any related pages, and update index.md.`
  2. Lead-in "Keep the index honest:" — `Rebuild index.md from what's actually in wiki/ right now — group pages by section, and flag any page whose last-reviewed date is over six months old.`
  3. Lead-in "Answer from the wiki:" — `What do we know about our vendor renewal terms? Answer only from the wiki, and link the pages you used.`

- `details.reveal` — summary `What a wiki page looks like`, body intro `Standard header on top, every claim traceable to a source in raw/:`, `.terminal.terminal--file` with `data-file-path="wiki/vendor-msa.md"`:

```
# Vendor MSA — Key Terms

> Summary: Master services agreement with Vendor LLC; auto-renews yearly, liability capped at 12 months' fees.
> Owner: Hunter · Last reviewed: 2026-06-30
> Sources: [[raw/2026-vendor-msa.pdf]]

## Term & renewal
- Auto-renews for 12-month terms unless cancelled 60 days prior. (raw MSA, p. 8)

## Liability
- Capped at 12 months of fees; carve-out for data breach. (raw MSA, p. 11)

## Related
- [[data-processing-addendum]] · [[vendor-contacts]]
```
Close with `<p class="copy-source-link">Reusable recipe lives at <a href="../recipes/kb-team-wiki.md">recipes/kb-team-wiki.md</a>.</p>`

- **Make it reusable:** point to `recipes/kb-team-wiki.md`; note it can be a `/wiki-page` command so any teammate runs it the same way.
- **Why it matters:** the payoff — because sources stay in `raw/` and pages carry their source links, the wiki is auditable, not just tidy; the `CLAUDE.md` schema means every teammate's pages look the same and the index never drifts. It's a git repo, so it reviews and rolls back like code.
- Footer nav: prev `kb-personal-vault.html` (`← Personal Vault`), next `kb-distilled-wiki.html` (`Distilled Wiki →`).

- [ ] **Step 2: Author the recipe** (`recipes/kb-team-wiki.md`)

```markdown
---
description: Set up and maintain a docs-as-code team wiki in git — immutable raw/ sources, authored wiki/ pages with a standard header and source links, and an index.md Claude keeps current — all governed by a CLAUDE.md schema.
---

You maintain a team knowledge wiki as code in a git repository. Sources are
immutable; wiki pages are authored from them with a consistent header and always
cite their source; the index stays current. Everything is plain markdown.

## Persistent inputs

- The current working directory — a git repo that is either empty (first run) or
  already has raw/, wiki/, index.md, and a CLAUDE.md.

## What to do

1. **On first run, scaffold.** Create `raw/`, `wiki/` (with a `_template.md`
   page header), `index.md` (empty section list), and a root `CLAUDE.md`
   documenting: raw/ is immutable; the page header (summary, owner,
   last-reviewed, Sources); one topic per page; `[[wiki links]]`; index rules.
2. **Write a page from a source.** For "write a wiki page from raw/<file>":
   read the source, draft `wiki/<topic>.md` with the standard header, summarize
   by topic, cite the source (page numbers where available), cross-link related
   pages, and add/refresh the entry in `index.md`.
3. **Maintain the index.** For "rebuild index.md": list every page in `wiki/`
   grouped by section; flag pages past their review window.
4. **Answer from the wiki.** For questions: answer only from `wiki/` content and
   link the pages used; if the wiki doesn't cover it, say so.

## Customization knobs

- Page header fields and the review window (e.g., 6 months) — set in CLAUDE.md.
- Section taxonomy for index.md — grow it as the wiki grows.
- Citation style — page numbers, section anchors, or line refs.

## Notes

- **raw/ is the only immutable zone** — never edit or delete a source; supersede
  it with a new file and note it.
- Every claim on a page must be traceable to a raw/ source. No uncited assertions.
- Update index.md in the same run as any page add/rename so it never drifts.
- Because it's a git repo, prefer small commits per page for reviewable history.
```

- [ ] **Step 3: Verify structure**

Run:
```bash
cd /Users/hdunlap/Repos/claude-code-director-demos
grep -c 'data-page="kb-team-wiki"' demos/kb-team-wiki.html   # expect 1
grep -c 'data-tabs' demos/kb-team-wiki.html   # expect 0
grep -c 'copy-btn' demos/kb-team-wiki.html    # expect >= 5
grep -o 'href="kb-distilled-wiki.html"' demos/kb-team-wiki.html | head -1
grep -c 'recipes/kb-team-wiki.md' demos/kb-team-wiki.html   # expect >= 1
test -f recipes/kb-team-wiki.md && echo "recipe exists"
```
Expected as annotated.

- [ ] **Step 4: Render in a browser**

Open `demos/kb-team-wiki.html`; confirm parity with `document-digest.html`, working copy button, reveal expands, nav correct.

- [ ] **Step 5: Commit**

```bash
git add demos/kb-team-wiki.html recipes/kb-team-wiki.md
git commit -m "feat(kb): add Team Wiki sub-demo + recipe

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 4: Distilled Wiki sub-demo + recipe

**Files:**
- Create: `demos/kb-distilled-wiki.html`
- Create: `recipes/kb-distilled-wiki.md`
- Reference: `demos/document-digest.html`, `recipes/organize-files.md`

**Interfaces:**
- Consumes: prev nav from `kb-team-wiki.html`.
- Produces: `demos/kb-distilled-wiki.html` (next → `../demos.html`); recipe at `recipes/kb-distilled-wiki.md`.

- [ ] **Step 1: Author the HTML page**

Generic-only, modeled on `document-digest.html`. Key content:

- `<body data-page="kb-distilled-wiki">`, title `Distilled Wiki · Vibe Coding with Claude Code`
- Topbar nav: prev `kb-team-wiki.html` (`← Team Wiki`), next `../demos.html` (`back to demos →`)
- detail-header: `<h1>🔮 Distilled Wiki</h1>` + the two standard built-from chips
- **What you'll do:** point Claude at a pile of raw sources; it distills them into short, cross-linked encyclopedia-style pages — one idea per page, `[[wiki links]]` between them, a one-line summary and tags on each. You end up with something browsable and queryable, not a folder of PDFs. `.preview-frame`: `Drop sources in raw/ → get wiki/ full of short, linked pages, each summarizing one idea and pointing to its neighbors.`
- Include a short callout paragraph distinguishing it from the Team Wiki: the Team Wiki is *authored deliberately, one page per source, for a group*; the Distilled Wiki is *bulk-distilled from many sources into many small linked notes, for fast personal sense-making*. Same raw/→wiki/ bones, different intent.
- **What you'll need** (`.needs-list`): Claude Code or Cowork; a folder with several sources to distill (articles, notes, exports, PDFs).
- **Set it up** — scaffold prompt (`.prompt-block`, `copy-btn--light`):

```
Set up a distilled wiki in this folder. Create raw/, wiki/, and a CLAUDE.md, then be ready to turn sources into notes.

Write CLAUDE.md stating the distillation rules:
- raw/ holds original sources; wiki/ holds short distilled notes. Never edit raw/.
- Each wiki note covers ONE idea, is short (aim for under a page), and starts with a one-sentence summary and a line of #tags.
- Notes link generously to each other with [[wiki links]] using the note's filename.
- When distilling, split a source into as many small notes as it has distinct ideas — don't create one giant note per source.
- Prefer linking to an existing note over duplicating a concept.

Don't distill anything yet — just create the structure and the CLAUDE.md, and tell me to drop sources in raw/ and say "distill".
```

Follow with `.terminal` preview:

```
Creating distilled wiki …
  raw/        (drop your sources here)
  wiki/       (distilled notes will land here)
  CLAUDE.md   (one idea per note; summary + #tags; link with [[..]])
Ready. Add sources to raw/, then say: "distill everything new in raw/"
```

- **Then use it day to day** — three `.prompt-block`s:
  1. Lead-in "Distill a fresh batch:" — `Distill everything new in raw/. Break each source into small one-idea notes in wiki/, give each a one-sentence summary and tags, and link related notes with [[wiki links]]. Tell me which notes you created and how they connect.`
  2. Lead-in "Ask across everything:" — `What do my notes say about interest-rate risk? Pull from every relevant note and link them so I can follow the thread.`
  3. Lead-in "Tidy the web of links:" — `Look over wiki/ for notes covering the same idea or missing obvious links, and suggest merges or new [[links]] — show me before changing anything.`

- `details.reveal` — summary `What a distilled note looks like`, body intro `One idea, a summary, tags, and links out to neighbors:`, `.terminal.terminal--file` with `data-file-path="wiki/duration-risk.md"`:

```
# Duration Risk

> Summary: Longer-duration assets lose more value when rates rise — the core rate-risk exposure in the portfolio.
> Tags: #risk #rates #portfolio

Duration measures price sensitivity to rate moves: a 5-year duration means
roughly a 5% price drop per 1% rate rise. It's the lever behind most of our
interest-rate exposure.

Managed by matching asset and liability duration — see [[asset-liability-matching]].
Related: [[interest-rate-risk]] · [[convexity]]

Source: [[raw/alm-primer.pdf]]
```
Close with `<p class="copy-source-link">Reusable recipe lives at <a href="../recipes/kb-distilled-wiki.md">recipes/kb-distilled-wiki.md</a>.</p>`

- **Make it reusable:** point to `recipes/kb-distilled-wiki.md`; note a `/distill` command makes it a one-liner as sources pile up.
- **Why it matters:** the payoff — a stack of sources you'll never reread becomes a web of small notes you can actually browse and query; the `[[links]]` mean asking one question surfaces the whole neighborhood of related ideas. Because Claude reads the notes directly, answers come with the exact notes behind them — no black box.
- Footer nav: prev `kb-team-wiki.html` (`← Team Wiki`), next `../demos.html` (`Back to demos →`).

- [ ] **Step 2: Author the recipe** (`recipes/kb-distilled-wiki.md`)

```markdown
---
description: Turn a pile of raw sources into a browsable web of short, cross-linked notes — one idea per note, each with a summary and tags, linked with [[wiki links]] — governed by a CLAUDE.md, no RAG needed.
---

You distill raw sources into a personal wiki of small, cross-linked notes. Each
note captures one idea; notes link to each other so the knowledge is browsable
and queryable. Everything is plain markdown.

## Persistent inputs

- The current working directory — a folder that is empty (first run) or already
  has raw/, wiki/, and a CLAUDE.md.

## What to do

1. **On first run, scaffold.** Create `raw/`, `wiki/`, and a root `CLAUDE.md`
   with the distillation rules: one idea per note; short; a one-sentence summary
   and a #tags line at the top; link generously with `[[wiki links]]`; split a
   source into as many notes as it has distinct ideas; prefer linking an existing
   note over duplicating a concept; never edit raw/.
2. **Distill.** For "distill everything new in raw/": read each unread source,
   break it into small one-idea notes in `wiki/`, add summary + tags, cite the
   source with a `[[raw/<file>]]` link, and cross-link related notes.
3. **Query.** For questions: gather every relevant note, answer from them, and
   link the notes so the user can follow the thread.
4. **Curate.** For "tidy links": find near-duplicate notes and missing links;
   propose merges/links and wait for approval before editing.

## Customization knobs

- Note length target and tag vocabulary — set in CLAUDE.md.
- How aggressively to split sources into notes — tune per source density.
- Whether to keep a running index note — optional; add if the wiki grows large.

## Notes

- **raw/ is immutable.** Distill from it; never edit it.
- One idea per note is the point — resist one-giant-note-per-source.
- Every note should link to at least one neighbor where a real connection exists.
- Curation edits (merges, link changes) are proposed first, applied on approval.
```

- [ ] **Step 3: Verify structure**

Run:
```bash
cd /Users/hdunlap/Repos/claude-code-director-demos
grep -c 'data-page="kb-distilled-wiki"' demos/kb-distilled-wiki.html   # expect 1
grep -c 'data-tabs' demos/kb-distilled-wiki.html   # expect 0
grep -c 'copy-btn' demos/kb-distilled-wiki.html    # expect >= 5
grep -o 'href="../demos.html"' demos/kb-distilled-wiki.html | head -1   # next → demos
grep -c 'recipes/kb-distilled-wiki.md' demos/kb-distilled-wiki.html   # expect >= 1
test -f recipes/kb-distilled-wiki.md && echo "recipe exists"
```
Expected as annotated.

- [ ] **Step 4: Render in a browser**

Open `demos/kb-distilled-wiki.html`; confirm parity, working copy button, reveal expands, "back to demos" nav correct.

- [ ] **Step 5: Commit**

```bash
git add demos/kb-distilled-wiki.html recipes/kb-distilled-wiki.md
git commit -m "feat(kb): add Distilled Wiki sub-demo + recipe

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 5: Wire the track into `demos.html` and `index.html`

**Files:**
- Modify: `demos.html` (add a card after the Long-Context card)
- Modify: `index.html` (add a chip to the chip row)

**Interfaces:**
- Consumes: `demos/knowledge-base.html` (Task 1) must exist.

- [ ] **Step 1: Add the card to `demos.html`**

Immediately after the closing `</a>` of the Long-Context card (the `<a class="card" href="demos/long-context.html">…</a>` block, ending near line 111), insert:

```html
      <a class="card" href="demos/knowledge-base.html">
        <div class="card__strip"></div>
        <div class="card__body">
          <div class="card__icon">🧠</div>
          <h2>Knowledge Base Workflows</h2>
          <p>Structure notes and sources as markdown Claude can reason over — personal, team, or distilled.</p>
          <div class="card__tags">
            <span class="tag">CLAUDE.md</span>
            <span class="tag">Markdown</span>
          </div>
        </div>
        <div class="card__accent"></div>
      </a>
```

- [ ] **Step 2: Update the `demos.html` intro line (optional but recommended)**

In the `.cards-intro` paragraph (line ~24), the copy says "a Long-Context Workflows track". Extend it to mention the new track so the intro matches what's on the page. Change:
`…and a Long-Context Workflows track for tasks with a lot of material to read.`
to:
`…a Long-Context Workflows track for tasks with a lot of material to read, and a Knowledge Base Workflows track for structuring notes and sources you keep coming back to.`

- [ ] **Step 3: Add the chip to `index.html`**

After the Long Context chip (line ~44: `<a class="chip" href="demos/long-context.html">…Long Context</a>`), insert:

```html
        <a class="chip" href="demos/knowledge-base.html"><span class="chip__icon">🧠</span> Knowledge Base</a>
```

- [ ] **Step 4: Verify wiring + full link integrity**

Run:
```bash
cd /Users/hdunlap/Repos/claude-code-director-demos
grep -c 'demos/knowledge-base.html' demos.html   # expect 1
grep -c 'demos/knowledge-base.html' index.html   # expect 1
# Every internal href in the new pages resolves to a real file:
for f in demos/knowledge-base.html demos/kb-personal-vault.html demos/kb-team-wiki.html demos/kb-distilled-wiki.html; do
  echo "== $f =="
  grep -oE 'href="[^"#]+\.(html|md|css)"' "$f" | sed 's/href="//;s/"//' | while read -r target; do
    resolved="demos/$target"; case "$target" in ../*) resolved="${target#../}";; esac
    if [ -e "$resolved" ]; then echo "OK   $target"; else echo "MISSING $target -> $resolved"; fi
  done
done
```
Expected: both greps 1; every link prints `OK` (no `MISSING`).

- [ ] **Step 5: Full-track browser walkthrough**

Open `demos.html`, click the new "Knowledge Base Workflows" card → landing page. Click each of the three cards → each sub-demo. Use the `next →` links to walk the whole chain (`knowledge-base → personal-vault → team-wiki → distilled-wiki → demos`) and the `← prev` links back. On each sub-demo, click one 📋 Copy button and confirm it copies. Confirm the chip on `index.html` also opens the landing page. Confirm no console errors.

- [ ] **Step 6: Commit**

```bash
git add demos.html index.html
git commit -m "feat(kb): link Knowledge Base Workflows track from demos and home

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Self-Review (completed during planning)

**Spec coverage:** landing page (Task 1), three sub-demos + recipes (Tasks 2–4), wiring into demos.html + index.html (Task 5), engine framing + built-from chips (Task 1), generic-only / no-tabs (Global Constraints + each task), nav chain (Global Constraints + Task 5 verify). All spec sections map to a task.

**Placeholder scan:** no TBD/TODO; all prompt copy, terminal previews, example files, and recipe bodies are written out in full.

**Type/consistency:** file names (`kb-personal-vault`, `kb-team-wiki`, `kb-distilled-wiki`) and their prev/next targets are consistent across the nav-chain table, each task, and Task 5's link-integrity check. Built-from chip hrefs match `tools.html` anchors verified to exist (`files-and-commands`, `persistent-memory`).
