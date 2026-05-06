---
date: 2026-05-06
status: approved
owner: Hunter Dunlap
audience: Directors at Nelnet
---

# Vibe Coding for Directors — Demo Page Design

## Purpose

A small static site that acts as both a live presentation surface and a take-home reference. Frames "vibe coding" with Claude Code through four small apps directors can build themselves. Used during a director-level presentation tomorrow, then left available for directors to navigate afterward.

## Audience

Directors at Nelnet. Most are non-technical leadership. They have heard of AI, may not have used Claude Code. The site must teach the concept by showing outcomes, not code internals.

## Non-goals

- Building runnable apps for tomorrow. The page ships *recipes* (slash command files + step-by-step pages); directors can run them themselves.
- A bundler / SPA framework. Plain HTML/CSS/JS only.
- A CMS. Hand-authored pages, edited as files.
- A Node server for the presentation site. Pages are static; directors load them via GitHub Pages or by opening the HTML files directly. (The user-built *demo apps* — Daily Brief, etc. — may need their own static server, but that's per-demo, not part of this site.)

## Site structure

Three layers:

1. `/` — Landing page. The "why." Opening view during the live presentation.
2. `/demos.html` — Cards page. The "what." Four demos, one card each.
3. `/demos/<slug>.html` — Detail pages, one per demo. The "how." Same template applied four times.

URLs match files on disk (no extensionless routing) to keep the server trivial.

Right-arrow / left-arrow keys navigate forward and back across all pages, so the site doubles as a presentation deck.

## Visual system — "Split Brain" mashup

Visual metaphor: structure (Nelnet) meets vibe (Claude). The mashup is the message.

### Palette

Nelnet token palette (provided by user):

```
--primary:        #11891C
--primary-soft:   #70BA44
--primary-bright: #AED136
--teal:           #018181
--teal-soft:      #6FC6A5
--cyan:           #11AECF
--blue:           #0E729A
--purple:         #6867AF
--bg-base:        #f8fafc
--bg-white:       #ffffff
--text-dark:      #0f172a
--text-main:      #334155
--text-muted:     #64748b
--danger:         #ef4444
```

Claude additions:

```
--claude-coral:   #D97757
--claude-cream:   #FAF7F2
```

Role mapping:

- Body background: `--bg-base`
- Card background: `--bg-white`
- "Nelnet" panels (structure side of split): solid `--primary` or `--primary-soft` accents on white
- "Claude" panels (vibe side of split): `--claude-cream` background with `--claude-coral` accents
- Bridge tones: `--teal` and `--cyan` for gradient hairlines and link hovers
- Primary CTA: `--claude-coral`
- Code-block prompt glyph (`>`): `--claude-coral`
- Code-block output text: `--primary-soft`
- Section transitions: 1px gradient hairline cyan → coral

### Typography

- Headlines: `"Source Serif 4", Georgia, serif` (warm serif, Claude-leaning). Loaded via Google Fonts.
- Body / UI: `"Inter", system-ui, sans-serif`. Loaded via Google Fonts.
- Code: `"JetBrains Mono", ui-monospace, monospace`. Loaded via Google Fonts.

### Recurring motifs

- **Split seam.** A diagonal seam separates green and cream panels in the landing hero. The seam reappears as a vertical rule in card headers and a horizontal hairline in footer / section dividers.
- **Terminal blocks.** Dark slate (`--text-dark`) background, coral prompt glyph, green output text. Used for every "what you'll run" code sample.
- **Gradient hairlines.** 1px cyan-to-coral horizontal rule between major sections.

## Page layouts

### Landing — `/`

Sections, top to bottom:

1. **Top bar.** Nelnet logo (left), "Skip to demos →" link (right).
2. **Split hero.** Two diagonally-divided panels.
   - Left: green, label "STRUCTURE", copy "Director-tested workflows."
   - Right: cream, label "VIBE", copy "Claude Code, the way you'd actually want to work."
   - Tagline straddles the seam: "Vibe Coding for Directors."
   - On load, the two halves slide in from opposite sides and meet at the diagonal (~1s, then static).
3. **What you'll see today.** Row of four small preview chips, one per demo (icon + name).
4. **How this works.** Three short bullets, ~120 words total:
   - "You'll see four small apps directors can build."
   - "Each is built with a single Claude Code slash command."
   - "You can build them yourself during this session."
5. **Primary CTA.** Coral button: "See the demos →" → `/demos`.

### Demos — `/demos`

Sections, top to bottom:

1. Top bar with "← back" and "next →".
2. Heading: "Pick a demo."
3. 2×2 grid of cards (single column on screens narrower than 720px). Card content:
   - Green header strip
   - Icon + title (e.g., "📰 Daily Brief")
   - One-line value prop
   - Tag row showing input source + output type. Per demo: Daily Brief → "RSS · HTML"; Personal Secretary → "M365 · HTML"; Stakeholder Mgmt → "Markdown · HTML"; Team Mgmt → "Markdown · HTML"
   - Coral accent line at the bottom
   - Hover: lifts on `--shadow-md`; coral accent line widens
   - Whole card is clickable

No time estimates and no difficulty labels appear anywhere on the site — those are inconsistent across team members and were intentionally cut.

### Demo detail template — `/demos/<slug>`

Single template, used four times. Sections, top to bottom:

1. Top bar with "← demos" and "[prev] [next →]".
2. Demo header: icon + title; meta line shows tools only ("Tools: Claude Code · Node.js"). No time estimate. No difficulty.
3. **What you'll build.** Two-sentence pitch + one preview screenshot of the rendered artifact.
4. **What you'll need.** Bulleted prerequisites.
5. **Step 1 — Drop in the slash command.** Code block with the slash command file content. One-click Copy button labeled with the destination path (`~/.claude/commands/<name>.md`).
6. **Step 2 — Run it.** Terminal block showing the slash command (e.g., `/daily-brief`) and example successful output. Coral prompt glyph, green output. Note: this runs in the *director's own demo project* and produces an HTML file there.
7. **Step 3 — See it.** Terminal block showing how to view the rendered output. Default suggestion: `open site/index.html` (macOS) or `python3 -m http.server 8000` then `http://localhost:8000`. The presentation site itself does not need a server.
8. **Customize.** Three-bullet list of knobs (config files, thresholds, sections).
9. **Why directors care.** One paragraph framing the time saved or decisions made.
10. Footer: "[← prev demo]   [next demo →]".

Every code block has a one-click Copy button. The "Step 2 — Run it" block shows pre-rendered output so directors see what success looks like before they run.

## The four recipes

All four follow the same structural pattern:

> Read context (markdown files or M365 inputs) → fetch fresh data → render `site/index.html`.

This shared spine is the lesson the site teaches. It is called out explicitly on the landing page.

### 1. Daily Brief — `/daily-brief`

- **Inputs:** `interests.md` (free-form bullets — e.g., "Nelnet, student loan servicing, AI in finance") and `sources.md` (RSS feeds, sitemaps, URLs to crawl)
- **What it does:** fetches recent items, scores them against interests, writes a magazine-style HTML page — top story, three to four secondary stories, "also worth a look" list
- **Customize:** edit the two MD files; rerun
- **Why directors care:** walk into the day knowing what changed in your domain without doom-scrolling

### 2. Personal Secretary — `/secretary`

- **Inputs:** Microsoft 365 connector (already wired into Claude); `priorities.md` (VIPs, folders that matter)
- **What it does:** pulls today's calendar, unread email, Teams mentions; writes a "Today" page with Schedule (with prep notes per meeting), Inbox triage, Decisions needed, Loose ends
- **Customize:** time window, VIP list, sections to include
- **Why directors care:** skip the morning email shuffle

### 3. Stakeholder Management — `/stakeholder-update`

- **Inputs:** `stakeholders/<name>.md` per stakeholder, with sections: About / Last Contact / Open Items / Goals / Next Touchpoint
- **What it does:** reads all stakeholder MDs, surfaces who is stale, lists open items, builds a dashboard HTML — "needs attention now," recent contacts, open items grid, upcoming touchpoints
- **Customize:** stale threshold, MD template, sections shown
- **Why directors care:** turn relationship management from memory into a system

### 4. Team Management — `/team-update`

- **Inputs:** `team/<name>.md` per direct report (Role / Goals / Last 1:1 / Open Items / Strengths / Growth Areas) plus a `notes/` folder with recent 1:1 markdown notes
- **What it does:** same engine as stakeholder, framed for reports — team-at-a-glance, 1:1 prep cards, open commitments, growth tracker
- **Customize:** review cadence, "stale" threshold
- **Why directors care:** walk into 1:1s prepared without spending Sunday night re-reading notes

## Tech & repo layout

Lives in a standalone, public GitHub repository on the `hunterrdunlap` account: `claude-code-director-demos`. Hosted via **GitHub Pages** straight from the `main` branch root.

Production URL: `https://hunterrdunlap.github.io/claude-code-director-demos/`

```
claude-code-director-demos/
├── README.md                    # Repo intro + GH Pages link
├── index.html                   # Landing (split hero) — served at /
├── demos.html                   # 4 cards
├── demos/
│   ├── daily-brief.html
│   ├── personal-secretary.html
│   ├── stakeholders.html
│   └── team.html
├── styles/main.css              # Single shared stylesheet
├── js/main.js                   # Arrow-key nav + clipboard copy
├── assets/
│   ├── nelnet-logo.svg
│   └── previews/                # One PNG per demo (mock artifact screenshot)
├── recipes/                     # Slash command files; part of the deliverable
│   ├── daily-brief.md
│   ├── secretary.md
│   ├── stakeholder-update.md
│   └── team-update.md
└── docs/
    └── superpowers/specs/
        └── 2026-05-06-vibe-coding-demo-page-design.md
```

### Stack choices (deliberately boring)

- **No framework, no bundler, no build step, no server.** Plain HTML/CSS/JS at repo root.
- **Hosting:** GitHub Pages serving from `main` branch root. Public.
- **Local preview during authoring:** open `index.html` directly in the browser, or `python3 -m http.server 8000` from the repo root if absolute paths matter.
- **Google Fonts CDN** for Source Serif 4, Inter, JetBrains Mono.
- **Single shared `main.css`** and single shared `main.js` across all pages.

### Public-repo considerations

The repo is public so directors can browse, fork, or link freely. Consequence: the spec, recipes, and any preview screenshots are also public. Do not include real Nelnet data, internal hostnames, real stakeholder names, or anything from M365 in any committed file. Sample data only.

### The `recipes/` folder is part of the deliverable

Directors browse the GH Pages site, copy a recipe into `~/.claude/commands/`, and they are ready to run. Each detail page links directly to its source recipe (`<a href="recipes/daily-brief.md">View source</a>`).

## Live presentation flow

1. **Open `/`** — ~90 seconds on the split hero. Frame: "Vibe coding is describing what you want and letting Claude write it. Today: four small apps directors can build themselves." Right-arrow advances.
2. **`/demos`** — ~30 seconds previewing all four cards. Set expectation: deep-dive one live, others summarized at recipe level.
3. **Run Daily Brief live.** Chosen because it has no auth dependency and no M365 reliance — fastest to render. Two side-by-side windows: presentation site, Claude Code terminal. Click Copy on the slash command, paste, run `/daily-brief`, then `npm start`, refresh the rendered output in a third tab.
4. **Walk through the other three at recipe level.** Open each detail page, point at inputs and customization knobs, skip the live run.
5. **Land on `/demos` for Q&A.** Cards page anchors the "what would you build first?" conversation.

### Safety nets for the live run

- Pre-run the demo once before the meeting; leave the rendered `index.html` cached locally. If the live run flakes, fall back without anyone noticing.
- Pre-install the recipes in `~/.claude/commands/` so the demo is "type `/daily-brief`" — not "first let me copy this file."

## Open questions

- **Logo asset.** Need a Nelnet logo SVG to drop into `public/assets/nelnet-logo.svg`. Hunter to provide before implementation begins, or we use a wordmark-only treatment.
- **Preview screenshots.** Need one mock screenshot per demo. Either Hunter generates ahead of time or we author them as part of implementation using simple mock HTML rendered to PNG.

## Success criteria

- Landing → demos → detail navigation works in Chrome, Safari, Edge.
- Arrow-key navigation works on every page.
- Every code block has a working Copy button.
- Daily Brief recipe runs end-to-end on Hunter's machine before the meeting.
- Directors can leave the meeting, visit the GH Pages URL, and follow any one of the four detail pages without further explanation.
- GH Pages is live at `https://hunterrdunlap.github.io/claude-code-director-demos/` before the presentation.
