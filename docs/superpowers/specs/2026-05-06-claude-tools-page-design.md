---
date: 2026-05-06
status: approved
owner: Hunter Dunlap
audience: Directors at Nelnet
relates-to: docs/superpowers/specs/2026-05-06-vibe-coding-demo-page-design.md
---

# "What's in the toolbox" — Tools Page Design

## Purpose

A new page sitting between the landing hero and the demos cards page that introduces Claude Code's core capabilities as discrete tools. Directors should walk away understanding the building blocks Claude Code offers, so when they hit the demos page, they recognize that each demo is just a particular composition of these tools.

The page also becomes the third leg of the live presentation flow:
1. Landing hero — frame the talk
2. **Tools page — the toolbox tour** (NEW)
3. Demos cards — the four demos
4. Demo details — deep-dive

## Audience and tone

Same as the rest of the site: director-level, mostly non-technical. Anthropic-credentialed framing on the headline, plain-English everywhere else. No jargon without translation.

## Non-goals

- A reference manual for every Claude Code feature.
- Per-tool tutorials. Each tool gets one paragraph of context, not a how-to.
- Cross-references to specific demos on the tools page itself. Directors learn the tools as fundamentals first; the per-demo composition view lives on each demo's detail page.

## Site flow updates

The single-line sequence becomes:

```
/  →  /tools.html  →  /demos.html  →  /demos/<slug>.html
```

Required nav touch-ups in the existing site:

- **`index.html`:** the topbar `data-key-next` link and the primary CTA button both change `href="demos.html"` → `href="tools.html"`. CTA text becomes **"Start with the toolbox →"** (was "See the demos →").
- **`demos.html`:** topbar `data-key-prev` link changes from `index.html` to `tools.html` (text stays "← back").
- **The four detail pages** are unchanged at the nav level — their footer-nav `data-key-prev` for daily-brief still points back to `../demos.html`, which is correct.

Arrow keys continue to thread through the longer chain.

## Page anatomy (`/tools.html`)

Top to bottom:

1. **Top bar.** Same shared topbar as every other page. Brand wordmark on the left. Nav: `← back` (to index.html, with `data-key-prev`) and `next →` (to demos.html, with `data-key-next`).
2. **Hero.** Large serif headline, plain-English subhead.
3. **Tools grid.** 4×2 grid of tool tiles. Each tile is an `<a>` anchoring to the matching scroll section below. Card content: icon + name + one-line description.
4. **Editorial scroll.** Eight sections, one per tool. Each section has an anchor `id` matching the tile link, an icon-prefixed `<h2>`, two to three paragraphs of prose, and an optional small example block.
5. **Closing CTA.** Coral button: "See how this all comes together →" linking to `/demos.html`.

The grid hero IS the live presentation slide — Hunter walks the room across all 8 tools in 60 seconds. The editorial scroll exists for take-home depth.

### Hero copy

```
An agent in your terminal

Claude Code reads your files, runs your commands, fetches the web,
talks to your business tools, and remembers what you tell it.
You decide what to build; Claude composes the work using a small
set of tools.
```

The headline (**An agent in your terminal**) borrows directly from Anthropic's docs framing for credibility. The subhead is plain English.

### The eight tools

Each tile renders: emoji icon, name, one-line description. The scroll section below each tile lives at the matching anchor.

#### Used in the four demos

1. **Files & commands** — anchor `#files-and-commands` — icon 📁
   - **Card line:** "Claude's hands on your computer."
   - **Scroll prose:** Read and write files, run shell commands, search a project. The foundation under everything else — when Claude saves an HTML page, scaffolds a folder structure, or runs a small script, this is what it's using. Claude only does what you say; you can review every action before it lands.

2. **Web fetch** — anchor `#web-fetch` — icon 🌐
   - **Card line:** "Pull anything from the open web."
   - **Scroll prose:** RSS feeds, sitemaps, public articles, JSON APIs. Lets Claude bring the outside world into your work — recent news, regulatory filings, competitor blogs, public datasets. If a human can read it in a browser, Claude can fetch and summarize it.

3. **Microsoft 365** — anchor `#microsoft-365` — icon 📅
   - **Card line:** "Your work data — calendar, email, Teams, SharePoint."
   - **Scroll prose:** The connector that makes Claude useful inside Nelnet specifically. Reads (and with permission, writes) across the M365 surface — your calendar, unread email, Teams mentions, SharePoint files. Today's MFA prompt is the only step between Claude and your work data.

4. **Persistent memory** — anchor `#persistent-memory` — icon 🧠
   - **Card line:** "Markdown files Claude reads every time."
   - **Scroll prose:** Notes you write once that load every session. A list of your interests, a folder of stakeholder profiles, your team's growth-area notes. The longer you use Claude, the smarter your memory gets — every run can append fresh observations back into your markdown so the record deepens automatically.

5. **Custom commands** — anchor `#custom-commands` — icon ⚡
   - **Card line:** "Package a workflow as `/your-command`."
   - **Scroll prose:** Slash commands turn a recurring prompt into one keystroke. Once you've described what `/standup` or `/weekly-update` should do, you never have to describe it again — just type the command. Yours forever, copyable, shareable across your team.

#### What else is possible (not in today's demos)

6. **More connectors** — anchor `#more-connectors` — icon 🔌
   - **Card line:** "Slack, Jira, Salesforce, Notion, databases."
   - **Scroll prose:** M365 is just one entry in the wider connector ecosystem. Most tools your team already uses have an MCP connector — Slack, Jira, Salesforce, Notion, Linear, Postgres, Snowflake. If a tool has an API and matters to your team, a connector probably exists or can be built.

7. **Sub-agents** — anchor `#sub-agents` — icon 🤝
   - **Card line:** "Specialist helpers running on the side."
   - **Scroll prose:** Spawn focused side-conversations for specific tasks — a research agent that scrapes documentation, a code-reviewer that checks PRs, a summarizer that condenses long meeting transcripts. Sub-agents keep your main session uncluttered while still doing real work behind the scenes.

8. **Hooks** — anchor `#hooks` — icon 🪝
   - **Card line:** "Automatic triggers and guardrails."
   - **Scroll prose:** Wire Claude up to fire (or block) certain actions automatically. Run tests before every commit, lint after every edit, alert on sensitive data, refuse risky shell commands. Hooks turn good intentions into team policy that actually runs.

### Closing CTA

```
[ See how this all comes together → ]
```

Coral button. Links to `/demos.html`.

## "Built from" panel on detail pages

Each of the four detail pages gets a new horizontal chip row right under the page header, replacing the current `Tools: Claude Code · Microsoft 365 · Node.js` meta line.

The replaced meta line was a "what to install" note. That info moves into the existing **What you'll need** section on each page, where prerequisites already live.

The new "Built from" row shows which Claude Code tools combine to make this demo. Each chip is a clickable `<a>` that anchors to the matching tools-page section.

### Per-demo chip lists

| Demo | Chips (in order) |
|---|---|
| **Daily Brief** | 📁 Files & commands · ⚡ Custom commands · 🌐 Web fetch · 🧠 Persistent memory |
| **Personal Secretary** | 📁 Files & commands · ⚡ Custom commands · 📅 Microsoft 365 · 🧠 Persistent memory |
| **Stakeholder Mgmt** | 📁 Files & commands · ⚡ Custom commands · 📅 Microsoft 365 · 🧠 Persistent memory |
| **Team Mgmt** | 📁 Files & commands · ⚡ Custom commands · 📅 Microsoft 365 · 🧠 Persistent memory |

`Files & commands` and `Custom commands` appear on every demo — that repetition reinforces them as the universal foundation.

### HTML shape (per chip)

```html
<a class="tool-chip" href="../tools.html#files-and-commands">
  <span class="tool-chip__icon">📁</span> Files &amp; commands
</a>
```

Wrapped in a `<div class="built-from">` row.

## Visual system

Reuses everything from the existing CSS — palette tokens, typography, hairlines, hero treatment. New CSS additions:

- `.tools-grid` — CSS grid, 4 columns desktop / 2 columns ≤960px / 1 column ≤560px
- `.tool-tile` — card-like, similar visual language to existing `.chip` and `.card` but distinct (block-level, larger, anchor-link)
- `.tool-section` — editorial-scroll section, generous padding, scroll-margin-top so anchored navigation lands cleanly below the topbar
- `.tool-section h2` — icon + text inline, color `--primary`, larger than detail page h2
- `.built-from` — horizontal flex row, wraps on narrow viewports
- `.tool-chip` — small inline pill, light background, hover lifts and accent-colors

No new framework. No build step. CSS appended to the existing `styles/main.css`.

## Tech & file changes

Files added:
- `tools.html` (new page at repo root)

Files modified:
- `styles/main.css` (append new selectors)
- `index.html` (CTA href + topbar `data-key-next` href + CTA text)
- `demos.html` (topbar `data-key-prev` href)
- `demos/daily-brief.html` (replace meta line with "Built from" chips)
- `demos/personal-secretary.html` (replace meta line with "Built from" chips)
- `demos/stakeholders.html` (replace meta line with "Built from" chips)
- `demos/team.html` (replace meta line with "Built from" chips)

No JS changes — the existing arrow-key navigation already works against `data-key-next` / `data-key-prev`.

## Live presentation flow update

Tomorrow's flow becomes:

1. **`/`** — frame "vibe coding" (~90s).
2. **`/tools.html`** — toolbox tour (~3 min). Walk the grid hero in 60s. Linger on the 4-5 tools the demos use; gloss the "what else is possible" trio.
3. **`/demos.html`** — preview the four demos (~30s).
4. **Live demo** — Daily Brief walkthrough.
5. **Other detail pages at recipe level** — point to "Built from" chips so directors see the composition.
6. **Land on `/demos.html` for Q&A.**

## Open questions

None. The spec is self-contained.

## Success criteria

- `tools.html` renders cleanly on Chrome, Safari, Edge.
- Tools grid is 4×2 on desktop, 2×4 on tablet, 1×8 on mobile.
- Clicking any tool tile smoothly scrolls to the matching `#anchor` section.
- Each chip on each detail page links correctly to its tool anchor.
- Arrow-key navigation walks `index → tools → demos → daily-brief → … → team` and back.
- The Anthropic-attributed hero phrase ("an agent in your terminal") appears verbatim on the page.
- Detail pages no longer show the old "Tools: Claude Code · Microsoft 365 · Node.js" meta line; install requirements live in "What you'll need" only.
