# Long-Context Workflows — section redesign

**Date:** 2026-06-24
**Status:** Approved design, pending spec review
**Branch:** `claude/legal-team-section` (continue in place; PR #not-yet-merged)

## Background

A "Legal Team" section was built for the "Vibe Coding with Claude Code"
presentation (5 pages: a hub, a data-handling slide, and three Cowork workflow
demos — Document Digest, Organize Case File, Draft from Case File). It was
framed for non-developer lawyers using Claude Cowork.

This redesign reframes that section away from "legal" and toward the underlying
capability: **handling tasks that are heavy on context** (a long document, a
big pile of files, a stack of sources to draft from). Legal becomes one of two
worked examples per workflow rather than the whole frame.

## Goals

- Reframe the section as **"Long-Context Workflows"** — surface-agnostic (the
  technique matters; it runs wherever you run Claude, Claude Code or Cowork).
- Keep the three workflows (Digest / Organize / Draft) but make each
  **generic-first with two examples** via a `Generic | Legal` tab:
  - **Generic** (default): Claude **interviews the user first** (asks 2-4
    questions), waits, then does the work. Surface-neutral.
  - **Legal**: the concrete case-file example already built (Cowork).
- **Remove** the data-handling/privilege slide entirely — all work runs on the
  protected enterprise license; there is nothing to teach there.
- **Lean opening**: the hub just frames "three things useful when your work is
  high-context" and shows them, keeping a short sub-agents note.

## Non-goals / out of scope

- No data-handling, privilege, or tier guidance anywhere (deleted, not moved).
- No restyle of the existing site; no changes to other demos.
- No new dependencies. The only new shared code is a small tab component
  (JS + CSS) described below.
- The optional `playbook-compare` demo remains out of scope.

## Information architecture

Four pages (was five). Linear ←/→ chain, hung off `demos.html` as today:

```
demos.html → long-context.html → document-digest.html → organize-files.html → draft-from-files.html → demos.html
```

### File operations

Renames (use `git mv` to preserve history):

| From | To |
| --- | --- |
| `demos/legal-overview.html` | `demos/long-context.html` |
| `demos/organize-case-file.html` | `demos/organize-files.html` |
| `demos/draft-from-case-file.html` | `demos/draft-from-files.html` |
| `recipes/organize-case-file.md` | `recipes/organize-files.md` |
| `recipes/draft-from-case-file.md` | `recipes/draft-from-files.md` |

Unchanged filenames: `demos/document-digest.html`, `recipes/document-digest.md`.

Delete: `demos/legal-data-handling.html`.

Edits to existing pages: `index.html`, `demos.html` (nav label + intro copy),
`js/main.js` (tab logic), `styles/main.css` (`.tabs` block). `tools.html`
keeps its enriched `#sub-agents` entry (no change).

## The hub — `demos/long-context.html`

Lean. Reuses the existing detail-page shell (topbar, `detail-header`,
`detail-section`, `hairline`, `cards`, `page-footer-nav`).

- `<h1>📚 Long-Context Workflows</h1>`. Title in `<title>`:
  `Long-Context Workflows · Vibe Coding with Claude Code`. `data-page="long-context"`.
- A `built-from` row ("Built from": Files & commands `#files-and-commands`,
  Sub-agents `#sub-agents`).
- **Hook** (one short section): "Some tasks bury you in material — a 90-page
  contract, a folder of 200 files, a stack of sources to draft from. Three
  workflows make that manageable."
- **Sub-agents note** (one short paragraph, keeps the efficiency emphasis):
  the engine is a team of sub-agents reading in parallel, so Claude can take in
  far more than it could in a single pass and nothing in the middle gets lost.
  Links to `../tools.html#sub-agents`.
- **Three cards** (`.cards`) → the three workflow pages: Document Digest 📄,
  Organize Files 🗂️, Draft from Files ✍️. Tags reflect generic use
  (e.g. `Sub-agents`, `Any long doc`).
- Closing line noting the workflows chain: Organize builds an index that Draft
  reads.
- No data-handling content, no surface-comparison table.
- Topbar/footer nav: prev `../demos.html`, next `document-digest.html`.

## Workflow page anatomy (applies to all three)

Generic-first. Reuses all existing classes; the only new structure is the tab
component.

1. `detail-header` — `<h1>` emoji + name; `built-from` chips:
   - Digest: Files & commands, Sub-agents.
   - Organize: Files & commands, Sub-agents, Custom commands.
   - Draft: Files & commands, Sub-agents, Persistent memory.
2. **"What you'll do"** `detail-section` — generic framing + a
   `preview-frame > preview-placeholder`.
3. **"What you'll need"** `detail-section` — generic `needs-list` (Claude Code
   or Cowork; the material; for Draft, an `organized/` folder).
4. **The tab component** (`Generic | Legal`, Generic active by default). Each
   panel contains, in order:
   - A "paste this in" prompt (`pre.prompt-block` + copy button).
   - A "What Claude does" activity log (`pre.terminal` with a `copy-btn`,
     `data-copy-from="parent-pre"`) — the generic log shows the interview step
     then the sub-agent fan-out.
   - A "What you get" `details.reveal` with a sample output
     (`pre.terminal.terminal--file` + copy button) and a `copy-source-link`.
5. **"Make it reusable"** `detail-section` — save as a Cowork skill /
   Claude Code command; link the generic recipe.
6. **"Why it matters"** `detail-section` — generic payoff (Draft keeps its
   "index may be a partial read of long docs → pull the full source" caution).
7. `page-footer-nav`.

### Tab component

**HTML** (ids are page-local, so reused across pages is fine):

```html
<div class="tabs" data-tabs>
  <div class="tabs__list" role="tablist" aria-label="Choose an example">
    <button class="tabs__tab is-active" role="tab" id="tab-generic" aria-controls="panel-generic" aria-selected="true" data-tab="generic" type="button">Generic — any long document</button>
    <button class="tabs__tab" role="tab" id="tab-legal" aria-controls="panel-legal" aria-selected="false" tabindex="-1" data-tab="legal" type="button">Legal example</button>
  </div>
  <div class="tabs__panel is-active" role="tabpanel" id="panel-generic" aria-labelledby="tab-generic" data-panel="generic"> … </div>
  <div class="tabs__panel" role="tabpanel" id="panel-legal" aria-labelledby="tab-legal" data-panel="legal" hidden> … </div>
</div>
```

Per-page generic tab label varies ("any long document" / "any folder of files"
/ "any organized material"). Legal tab label: "Legal example".

**JS** (add to `js/main.js`, same delegated pattern as copy buttons):

```js
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

Tabs are native `<button>`s, so Enter/Space activate them (fire `click`) with no
extra code. To prevent the existing ArrowLeft/ArrowRight page-navigation from
firing while a tab is focused, add a guard at the top of `onKey`:

```js
if (document.activeElement && document.activeElement.closest &&
    document.activeElement.closest('.tabs__list')) return;
```

(Arrow-key roving between tabs is an optional enhancement; not required.)

**CSS** (add to `styles/main.css`, on-brand — coral active accent):

```css
.tabs { margin: 1.25rem 0; }
.tabs__list { display: flex; gap: 0.25rem; border-bottom: 1px solid #e2e8f0; margin-bottom: 1.25rem; }
.tabs__tab {
  appearance: none; background: transparent; border: 0;
  border-bottom: 2px solid transparent; margin-bottom: -1px;
  padding: 0.5rem 0.9rem; font-family: var(--font-sans);
  font-size: 0.95rem; font-weight: 600; color: var(--text-muted);
  cursor: pointer; transition: color 0.15s, border-color 0.15s;
}
.tabs__tab:hover { color: var(--text-dark); }
.tabs__tab.is-active { color: var(--claude-coral); border-bottom-color: var(--claude-coral); }
.tabs__tab:focus-visible { outline: 0; box-shadow: var(--focus-ring); border-radius: 0.25rem; }
.tabs__panel[hidden] { display: none; }
```

## The generic prompts (interview-first)

Each opens by asking 2-4 questions, waits, then works. Ready to paste as-is.

**Digest (generic):**
> I have one long document I need to get on top of fast. Before you dig in, ask
> me 2-4 quick questions to understand what I need — what kind of document this
> is, what I'm trying to get out of it, which details matter most, and what
> format I want back. Wait for my answers.
>
> Then:
> - Read the whole document. Tell me the page count first.
> - If it's long (more than ~20 pages), read it section by section using
>   sub-agents in parallel, then combine the section summaries so nothing in
>   the middle is missed.
> - Write a structured summary in the format I asked for, plus a timeline of any
>   dated events. End every point with the page it came from, like (p. 14).
>
> Don't make anything up. If a passage is ambiguous, flag it for me to check
> rather than guessing.

**Organize (generic):**
> I have a folder of mixed files I need to make sense of. Before you start, ask
> me 2-4 questions — what these files are, how I'd like them grouped (by date?
> type? topic?), how I want them named, and whether anything is sensitive. Wait
> for my answers.
>
> Then:
> - Look at everything first, and extract any zip files (including zips inside
>   zips).
> - Read the files by fanning out sub-agents in parallel — one per file,
>   grouping small similar files — so it goes fast. For each, note its type,
>   date, a short summary, and anything odd.
> - Copy — never move — every file into the structure I asked for, under a new
>   organized/ folder, renamed clearly. Put anything you can't read or place
>   into organized/99-Unclassified/ — never drop a file silently.
> - Build an index: a short README in each folder, a master organized/README.md
>   mapping every copy back to its original, and organized/TIMELINE.md of any
>   dated events.
> - Check the counts match and confirm you didn't touch anything outside
>   organized/.
>
> Leave my originals exactly as they are. If an organized/ folder already
> exists, or anything's unclear, ask me before going ahead.

**Draft (generic):**
> I have an organized/ folder of material I want to draft from. Before you
> start, ask me 2-4 questions — what I want drafted, who it's for, the sections
> it needs, and how to cite sources. Wait for my answers.
>
> Then:
> - Read the index first (organized/README.md and organized/TIMELINE.md) to get
>   the map of the material.
> - Fan out sub-agents in parallel — one per theme the draft needs — each
>   reading only the relevant files and bringing back facts with their source.
> - Assemble the draft into drafts/. After every factual statement, cite the
>   source file it came from.
> - List anything I asked for that the material doesn't support.
>
> Every fact must come from the material — if it's not there, don't write it,
> list it as a gap. Draft only; I'll review.

Generic sample outputs use a neutral business document (e.g. a vendor master
services agreement / an RFP), not a case file.

## The legal examples (Legal tab)

Reuse the prompts, activity logs, and sample outputs already built for the
legal pages, lightly trimmed. The legal Organize tab references the existing
`organize-for-me` skill (its fixed litigation taxonomy is the legal
specialization); the legal panels keep their stronger lines (e.g. "Attorney
review required before any external use").

## Recipes (generalized)

The three recipes become the **generic, reusable** versions; legal specifics
live on the page Legal tabs.

- `recipes/document-digest.md` — generic long-document digest; opens with the
  2-4 question interview; keeps page-cite + don't-fabricate + flag-ambiguous;
  generic verification line ("spot-check the summary against the cited pages").
- `recipes/organize-files.md` — generic organize: no fixed taxonomy, Claude
  asks how to group; keeps copy-never-move, index, 99-Unclassified, exact
  count verification, chat summary.
- `recipes/draft-from-files.md` — generic draft from an `organized/` index;
  cite sources, list gaps, "Draft — review before use," partial-read caution.

Each page's generic panel `copy-source-link` points to its generic recipe. The
legal Organize panel links to the `organize-for-me` skill instead. The legal
Digest and Draft panels point to the same generic recipe (the recipe is
example-agnostic), noting it is shown here filled in for a case file.

## Nav / label changes

- `index.html`: `.preview-chips` chip "⚖️ Legal Team" → "📚 Long Context" →
  `demos/long-context.html`. Update the "How this works" bullet that mentions a
  "Legal Team track" → "a Long-Context Workflows track for document-heavy work."
- `demos.html`: the "Legal Team" card → "Long-Context Workflows" (icon 📚,
  blurb "Digest, organize, and draft when a task has a lot of context"; tags
  `Sub-agents`, `Long context`) → `demos/long-context.html`. Update the
  `cards-intro` line that mentions the "Legal Team track."

## Conventions to preserve

- Reuse existing classes; add only the `.tabs` CSS block and the tab JS.
- Copy buttons: `class="copy-btn"` + `data-copy` or `data-copy-from="parent-pre"`,
  `type="button"`, `aria-label`, literal `📋 Copy` label.
- `data-page` unique per page; keep the Nelnet wordmark `onerror` fallback.
- Demo pages use `../` asset paths and `../js/main.js`.
- `data-key-prev` / `data-key-next` on topbar (and footer) anchors; re-thread the
  four-page chain.

## Acceptance criteria

- Section renders in the existing layout; the `Generic | Legal` tab toggles the
  example in place (generic default), keyboard-operable, copy buttons work in
  both panels.
- The data-handling page is gone and unreferenced; no privilege/tier content
  remains. No broken links anywhere (renamed targets updated in nav and
  cross-links).
- Generic examples open by asking 2-4 questions and waiting; legal examples are
  preserved as the second tab.
- Nav wired from `index.html` and `demos.html` under the "Long Context" label;
  four-page ←/→ chain reciprocal.
- Each workflow page has a matching generic recipe; the legal Organize panel
  references `organize-for-me`.
- No new CSS/JS beyond the tab component; no other pages restyled; nothing
  outside the normal content/asset structure changed.
