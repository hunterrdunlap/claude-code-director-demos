# Knowledge Base Workflows — Demo Track Design

**Date:** 2026-07-01
**Author:** Hunter Dunlap (with Claude)
**Status:** Approved for implementation

## Purpose

Add a new demo track — **Knowledge Base Workflows** — to the "Vibe Coding with
Claude Code" demo site. It mirrors the existing **Long-Context Workflows** track:
a landing page that frames a shared theme and its underlying "engine," then three
sub-demo cards, each a self-contained walkthrough with copy-paste prompts.

The track evaluates three genuinely distinct ways to structure a knowledge base
that Claude can reason over. It is presented as **three parallel recipes** (like
long-context), not a scored comparison.

## The shared engine

Where the long-context track's engine is *sub-agents*, this track's engine is:

> **Plain markdown + a `CLAUDE.md` schema.** No RAG, no vector database, no
> embeddings. Claude reads your files directly, and a `CLAUDE.md` teaches it how
> your knowledge is organized — so every answer is grounded in a file you can
> open and check. Your knowledge stays in files you own, readable without any
> special tool.

Built-from tool chips on every page in the track:
`📁 Files & commands` (`tools.html#files-and-commands`) and
`🧠 Persistent memory` (`tools.html#persistent-memory`).

## The three workflows

The through-line is scale of audience: **one person → a team → a pile of raw
sources.** Same engine, three shapes.

1. **📓 Personal Vault** — PARA structure (`01_INBOX` / `02_PROJECTS` /
   `03_AREAS` / `04_RESOURCES` / `05_ARCHIVE`), with per-project
   `README` + `Tasks` + `Log`. Daily use: "prep me for X," "capture these notes,"
   "what's the status of Y." Grounded in the user's `obsidian-private-notes` repo.

2. **👥 Team Wiki** — docs-as-code, shared in git. `raw/` immutable sources →
   `wiki/` authored pages → an auto-maintained `index.md`, governed by a
   `CLAUDE.md` schema so the whole team writes consistently. Grounded in the
   Nelnet GitLab `claude-code-wiki-template` (auth-gated; reconstructed from the
   docs-as-code pattern).

3. **🔮 Distilled Wiki** — drop raw sources into `raw/`; Claude distills them into
   short, cross-linked `wiki/` pages using `[[wiki links]]`, plus an index.
   The "throw in sources, get an encyclopedia" pattern (the Karpathy-inspired
   LLM Wiki). Grounded in the LLM Wiki pattern found online.

## Page inventory

New files:

- `demos/knowledge-base.html` — landing page (models on `demos/long-context.html`)
- `demos/kb-personal-vault.html` — sub-demo 1
- `demos/kb-team-wiki.html` — sub-demo 2
- `demos/kb-distilled-wiki.html` — sub-demo 3
- `recipes/kb-personal-vault.md` — reusable recipe
- `recipes/kb-team-wiki.md` — reusable recipe
- `recipes/kb-distilled-wiki.md` — reusable recipe

Edited files:

- `demos.html` — add a "Knowledge Base Workflows" card after the Long-Context card
- `index.html` — add a chip to the chip row

No changes to `styles/main.css` or `js/main.js` — all pages reuse existing
classes and behaviors. Because the demos are **generic-only** (no second example
tab), the `data-tabs` component is not used.

## Landing page structure (`demos/knowledge-base.html`)

Follows `demos/long-context.html` section-for-section:

1. `topbar` with brand + nav (`← demos` / `next →` → `kb-personal-vault.html`).
2. `detail-header`: `🧠 Knowledge Base Workflows` + built-from chips
   (Files & commands, Persistent memory).
3. **When your work outlives any single chat** — intro: knowledge accumulates
   (notes, sources, project history) faster than any one conversation can hold.
   Three ways to structure it so Claude can reason over it. Each is just files.
4. **What makes it work: files + a `CLAUDE.md` schema** — the engine narrative
   above, with the explicit RAG/vector-DB contrast and the "files you own" point.
   Links to `tools.html#persistent-memory`.
5. `hr.hairline`.
6. **The three workflows** — a `.cards` grid of three `.card` links
   (Personal Vault / Team Wiki / Distilled Wiki), each with icon, title, one-line
   description, and two `.tag`s. Closing line on how to choose: one person vs. a
   team vs. distilling a pile of sources.
7. `page-footer-nav` (`← demos` / `Personal Vault →`).

## Sub-demo structure (each of the three)

Follows `demos/document-digest.html` anatomy, generic-only:

1. `topbar` + nav (prev/next within the track; see nav chain below).
2. `detail-header`: emoji + title + built-from chips.
3. **What you'll do** — plain-language outcome + a `.preview-frame` placeholder
   describing the end state (e.g., the vault/wiki you can talk to).
4. `hr.hairline`.
5. **What you'll need** — `.needs-list`: Claude Code or Cowork, a folder, git
   optional/required as appropriate.
6. `hr.hairline`.
7. **Set it up** — one `.prompt-block` copy-paste prompt that scaffolds the
   structure (folders + `CLAUDE.md` + templates + starter index), followed by a
   `.terminal` preview of the scaffold Claude builds.
8. **Then use it day to day** — 2–3 short `.prompt-block`s for the recurring
   operations (capture / ask / update), each with a one-line lead-in.
9. A `details.reveal` showing an example generated file (a project `README`,
   a `wiki/` page, or the `index.md`) in a `.terminal.terminal--file`.
10. **Make it reusable** — point to the recipe file / a slash command.
11. **Why it matters** — the payoff paragraph.
12. `page-footer-nav`.

### Per-demo content specifics

- **Personal Vault:** scaffold = PARA folders + a `CLAUDE.md` modeled on the
  obsidian vault's (capture rule: actionable→Tasks, info→Log; README =
  charter + status). Daily-use prompts: capture meeting notes, "prep me for
  [project]," add a task. Reveal: a project `README.md`.
- **Team Wiki:** scaffold = `raw/`, `wiki/`, `index.md`, `CLAUDE.md` schema +
  a page template; note git-shared. Daily-use prompts: add a source to `raw/`
  and write its wiki page, update the index, answer a question with page links.
  Reveal: a `wiki/` page with a source citation + the `index.md`.
- **Distilled Wiki:** scaffold = `raw/`, `wiki/`, `CLAUDE.md` (distillation
  rules: short focused pages, `[[wiki links]]`, one sentence summary + tags per
  page). Daily-use prompts: "distill everything new in raw/," "what do we know
  about X," reorganize/link. Reveal: a distilled `wiki/` page with `[[links]]`.

## Recipe files

Match the format of `recipes/organize-files.md`: YAML frontmatter with a
`description:` line, then a body with **Persistent inputs**, **What to do**
(numbered), **Customization knobs**, and **Notes**. One per sub-demo, referenced
from that demo's "Make it reusable" section and the output reveal.

## Navigation chain

The new track is self-contained and does not disturb the existing long-context
chain:

- `knowledge-base.html`: prev `../demos.html`, next `kb-personal-vault.html`
- `kb-personal-vault.html`: prev `knowledge-base.html`, next `kb-team-wiki.html`
- `kb-team-wiki.html`: prev `kb-personal-vault.html`, next `kb-distilled-wiki.html`
- `kb-distilled-wiki.html`: prev `kb-team-wiki.html`, next `../demos.html`

`demos.html` gains a card linking to `knowledge-base.html`; `index.html` gains a
chip linking to `demos/knowledge-base.html`.

## Success criteria

- Clicking the "Knowledge Base Workflows" card on `demos.html` opens a landing
  page consistent in look and structure with the long-context landing page.
- Each of the three sub-demos has a working copy button, a scaffold prompt, daily
  prompts, an output reveal, and a recipe link — matching document-digest depth.
- Prev/next nav and keyboard nav work across the four new pages.
- No changes required to CSS or JS; pages render correctly from `file://` and
  when served.

## Out of scope

- No scored/interactive comparison matrix (chosen: three parallel recipes).
- No second example tab (chosen: generic-only).
- No live/working knowledge base is created in this repo — the demos teach the
  reader to build one in their own folder.
