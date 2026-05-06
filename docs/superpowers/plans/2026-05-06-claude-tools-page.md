# Tools Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a new `tools.html` page that introduces Claude Code's eight core capabilities as named, scrollable tool sections sitting between the landing page and the demos cards page. Replace the meta line on each detail page with a "Built from" chip row that maps demos to specific tools.

**Architecture:** One new HTML file at the repo root, ~200 lines of CSS appended to the existing stylesheet, surgical nav-href updates on `index.html` and `demos.html`, and small replacements on each of the four detail pages. No new JS — the existing arrow-key navigation already targets `data-key-next` / `data-key-prev`.

**Tech Stack:** HTML5, CSS3 with the existing palette tokens, vanilla JS already in place.

**Spec:** [`../specs/2026-05-06-claude-tools-page-design.md`](../specs/2026-05-06-claude-tools-page-design.md)

---

## File structure

| Path | Action | Responsibility |
|---|---|---|
| `tools.html` | NEW | The tools page: hero, 4×2 grid of tiles, eight editorial scroll sections, closing CTA |
| `styles/main.css` | MODIFY | Append rules for `.tools-hero`, `.tools-grid`, `.tool-tile*`, `.tool-section`, `.built-from`, `.tool-chip*` |
| `index.html` | MODIFY | Update primary CTA href and text; update topbar `data-key-next` href |
| `demos.html` | MODIFY | Update topbar `data-key-prev` href from `index.html` to `tools.html` |
| `demos/daily-brief.html` | MODIFY | Replace `Tools: Claude Code · Node.js` meta line with the "Built from" chip row |
| `demos/personal-secretary.html` | MODIFY | Replace meta line with chip row |
| `demos/stakeholders.html` | MODIFY | Replace meta line with chip row |
| `demos/team.html` | MODIFY | Replace meta line with chip row |

**Boundaries:**
- The tools page lives at the repo root (peer of `index.html`, `demos.html`). It uses root-relative paths for `styles/main.css`, `js/main.js`, `assets/nelnet-wordmark.svg`.
- All new CSS lands in `styles/main.css` — there's no per-page stylesheet.
- The "Built from" chip CSS lives alongside the tools-page CSS (logical grouping) but the chip elements only appear on detail pages.

**Testing:** Same pragmatic approach as the prior plans — each visual task includes an explicit Verify step listing observable criteria (curl + grep, browser spot-check) instead of unit tests against static HTML.

---

## Task 1: Build `tools.html` and tools-page CSS

**Files:**
- Create: `tools.html`
- Modify: `styles/main.css` (append)

This task creates the entire tools page in one shot and adds all related CSS (including the `.built-from` / `.tool-chip` rules used by Task 3). The page won't be linked from any other page until Task 2 — that's intentional so this task is independently verifiable.

- [ ] **Step 1: Define verification criteria**

When done, opening `tools.html` (directly or via `python3 -m http.server`):

1. Topbar renders with the Nelnet wordmark and two nav links: "← back" (to `index.html`, with `data-key-prev`) and "next →" (to `demos.html`, with `data-key-next`).
2. Hero displays the headline "An agent in your terminal" in serif and the lead paragraph below.
3. A heading "What's in the toolbox" precedes a 4×2 grid of eight tool tiles. Each tile shows: emoji icon, bold name, light-gray one-line description.
4. Tile order: 📁 Files & commands · 🌐 Web fetch · 📅 Microsoft 365 · 🧠 Persistent memory · ⚡ Custom commands · 🔌 More connectors · 🤝 Sub-agents · 🪝 Hooks.
5. Clicking a tile scrolls smoothly to the matching `<article id="...">` section below.
6. A horizontal `<hr class="hairline">` separates the grid from the editorial scroll.
7. Eight `<article class="tool-section">` blocks follow, each with anchor `id`, an H2 (icon + name), and 1–2 paragraphs of prose verbatim from the spec.
8. A closing coral CTA button reads "See how this all comes together →" and links to `demos.html`.
9. Layout: 4-column grid on desktop, 2 columns at 960px, 1 column at 560px and below.
10. Right-arrow key navigates to `demos.html`; left-arrow returns to `index.html`.

- [ ] **Step 2: Create `tools.html`**

Create `/Users/hdunlap/Repos/claude-code-director-demos/tools.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>What's in the toolbox · Vibe Coding for Directors</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Source+Serif+4:wght@400;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="styles/main.css">
</head>
<body data-page="tools">
  <header class="topbar">
    <div class="brand">
      <img src="assets/nelnet-wordmark.svg" alt="Nelnet" onerror="this.replaceWith(Object.assign(document.createElement('span'),{textContent:'Nelnet · NFS'}));">
    </div>
    <nav>
      <a href="index.html" class="nav-prev" data-key-prev>← back</a>
      <a href="demos.html" class="nav-next" data-key-next>next →</a>
    </nav>
  </header>

  <main>
    <section class="tools-hero container">
      <h1>An agent in your terminal</h1>
      <p class="tools-hero__lead">Claude Code reads your files, runs your commands, fetches the web, talks to your business tools, and remembers what you tell it. You decide what to build; Claude composes the work using a small set of tools.</p>
    </section>

    <section class="container">
      <h2 class="tools-section-title">What's in the toolbox</h2>
      <div class="tools-grid">
        <a class="tool-tile" href="#files-and-commands">
          <div class="tool-tile__icon">📁</div>
          <div class="tool-tile__name">Files &amp; commands</div>
          <div class="tool-tile__line">Claude's hands on your computer.</div>
        </a>
        <a class="tool-tile" href="#web-fetch">
          <div class="tool-tile__icon">🌐</div>
          <div class="tool-tile__name">Web fetch</div>
          <div class="tool-tile__line">Pull anything from the open web.</div>
        </a>
        <a class="tool-tile" href="#microsoft-365">
          <div class="tool-tile__icon">📅</div>
          <div class="tool-tile__name">Microsoft 365</div>
          <div class="tool-tile__line">Your work data — calendar, email, Teams, SharePoint.</div>
        </a>
        <a class="tool-tile" href="#persistent-memory">
          <div class="tool-tile__icon">🧠</div>
          <div class="tool-tile__name">Persistent memory</div>
          <div class="tool-tile__line">Markdown files Claude reads every time.</div>
        </a>
        <a class="tool-tile" href="#custom-commands">
          <div class="tool-tile__icon">⚡</div>
          <div class="tool-tile__name">Custom commands</div>
          <div class="tool-tile__line">Package a workflow as <code>/your-command</code>.</div>
        </a>
        <a class="tool-tile" href="#more-connectors">
          <div class="tool-tile__icon">🔌</div>
          <div class="tool-tile__name">More connectors</div>
          <div class="tool-tile__line">Slack, Jira, Salesforce, Notion, databases.</div>
        </a>
        <a class="tool-tile" href="#sub-agents">
          <div class="tool-tile__icon">🤝</div>
          <div class="tool-tile__name">Sub-agents</div>
          <div class="tool-tile__line">Specialist helpers running on the side.</div>
        </a>
        <a class="tool-tile" href="#hooks">
          <div class="tool-tile__icon">🪝</div>
          <div class="tool-tile__name">Hooks</div>
          <div class="tool-tile__line">Automatic triggers and guardrails.</div>
        </a>
      </div>
    </section>

    <hr class="hairline">

    <section class="container tools-detail">
      <article class="tool-section" id="files-and-commands">
        <h2>📁 Files &amp; commands</h2>
        <p>Read and write files, run shell commands, search a project. The foundation under everything else — when Claude saves an HTML page, scaffolds a folder structure, or runs a small script, this is what it's using. Claude only does what you say; you can review every action before it lands.</p>
      </article>

      <article class="tool-section" id="web-fetch">
        <h2>🌐 Web fetch</h2>
        <p>RSS feeds, sitemaps, public articles, JSON APIs. Lets Claude bring the outside world into your work — recent news, regulatory filings, competitor blogs, public datasets. If a human can read it in a browser, Claude can fetch and summarize it.</p>
      </article>

      <article class="tool-section" id="microsoft-365">
        <h2>📅 Microsoft 365</h2>
        <p>The connector that makes Claude useful inside Nelnet specifically. Reads (and with permission, writes) across the M365 surface — your calendar, unread email, Teams mentions, SharePoint files. Today's MFA prompt is the only step between Claude and your work data.</p>
      </article>

      <article class="tool-section" id="persistent-memory">
        <h2>🧠 Persistent memory</h2>
        <p>Notes you write once that load every session. A list of your interests, a folder of stakeholder profiles, your team's growth-area notes. The longer you use Claude, the smarter your memory gets — every run can append fresh observations back into your markdown so the record deepens automatically.</p>
      </article>

      <article class="tool-section" id="custom-commands">
        <h2>⚡ Custom commands</h2>
        <p>Slash commands turn a recurring prompt into one keystroke. Once you've described what <code>/standup</code> or <code>/weekly-update</code> should do, you never have to describe it again — just type the command. Yours forever, copyable, shareable across your team.</p>
      </article>

      <article class="tool-section" id="more-connectors">
        <h2>🔌 More connectors</h2>
        <p>M365 is just one entry in the wider connector ecosystem. Most tools your team already uses have an MCP connector — Slack, Jira, Salesforce, Notion, Linear, Postgres, Snowflake. If a tool has an API and matters to your team, a connector probably exists or can be built.</p>
      </article>

      <article class="tool-section" id="sub-agents">
        <h2>🤝 Sub-agents</h2>
        <p>Spawn focused side-conversations for specific tasks — a research agent that scrapes documentation, a code-reviewer that checks PRs, a summarizer that condenses long meeting transcripts. Sub-agents keep your main session uncluttered while still doing real work behind the scenes.</p>
      </article>

      <article class="tool-section" id="hooks">
        <h2>🪝 Hooks</h2>
        <p>Wire Claude up to fire (or block) certain actions automatically. Run tests before every commit, lint after every edit, alert on sensitive data, refuse risky shell commands. Hooks turn good intentions into team policy that actually runs.</p>
      </article>
    </section>

    <section class="container cta-section">
      <a href="demos.html" class="cta-btn">See how this all comes together →</a>
    </section>
  </main>
  <script type="module" src="js/main.js"></script>
</body>
</html>
```

- [ ] **Step 3: Append tools-page and chip CSS to `styles/main.css`**

Append at the very end of `/Users/hdunlap/Repos/claude-code-director-demos/styles/main.css`:

```css
/* ============================================================
   Tools page — hero, grid, editorial scroll
   ============================================================ */
.tools-hero {
  padding-top: 4rem;
  padding-bottom: 1rem;
  text-align: center;
}
.tools-hero h1 {
  font-size: clamp(2.5rem, 5vw, 3.5rem);
  margin-bottom: 1rem;
}
.tools-hero__lead {
  font-size: 1.125rem;
  max-width: 60ch;
  margin: 0 auto;
  color: var(--text-main);
}

.tools-section-title {
  text-align: center;
  margin: 3rem 0 1.5rem;
  color: var(--primary);
}

.tools-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin: 0 0 3rem;
}
@media (max-width: 960px) {
  .tools-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 560px) {
  .tools-grid { grid-template-columns: 1fr; }
}

.tool-tile {
  display: flex;
  flex-direction: column;
  background: var(--bg-white);
  border-radius: 0.75rem;
  padding: 1.25rem 1rem 1.1rem;
  text-decoration: none;
  color: var(--text-main);
  border: 1px solid #e2e8f0;
  transition: transform 0.1s, box-shadow 0.15s, border-color 0.15s;
  text-align: left;
}
.tool-tile:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  border-color: var(--claude-coral);
  text-decoration: none;
  color: var(--text-main);
}
.tool-tile:focus-visible {
  outline: 0;
  box-shadow: var(--focus-ring);
}
.tool-tile__icon {
  font-size: 1.75rem;
  margin-bottom: 0.5rem;
}
.tool-tile__name {
  font-weight: 600;
  color: var(--text-dark);
  font-size: 1.05rem;
  margin-bottom: 0.3rem;
}
.tool-tile__line {
  font-size: 0.85rem;
  color: var(--text-muted);
  line-height: 1.4;
}
.tool-tile__line code {
  font-size: 0.95em;
  background: rgba(15, 23, 42, 0.06);
  padding: 0.1em 0.3em;
  border-radius: 0.2rem;
}

.tools-detail { padding-bottom: 2rem; }

.tool-section {
  margin: 3rem auto;
  scroll-margin-top: 2rem;
  max-width: 70ch;
}
.tool-section h2 {
  font-size: 1.75rem;
  color: var(--primary);
  margin-bottom: 0.75rem;
}
.tool-section p {
  font-size: 1.05rem;
  line-height: 1.65;
}

/* ============================================================
   "Built from" chip row (used on detail pages — Task 3)
   ============================================================ */
.built-from {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
  margin-top: 0.75rem;
}
.built-from__label {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-right: 0.25rem;
}

.tool-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.35rem 0.8rem;
  background: var(--bg-white);
  border: 1px solid #e2e8f0;
  border-radius: 999px;
  color: var(--text-main);
  font-family: var(--font-sans);
  font-size: 0.85rem;
  font-weight: 500;
  text-decoration: none;
  transition: border-color 0.15s, transform 0.1s, color 0.15s;
}
.tool-chip:hover {
  border-color: var(--claude-coral);
  color: var(--text-dark);
  text-decoration: none;
  transform: translateY(-1px);
}
.tool-chip:focus-visible {
  outline: 0;
  box-shadow: var(--focus-ring);
}
.tool-chip__icon {
  font-size: 1rem;
}
```

- [ ] **Step 4: Verify**

Start a local server and check the page:

```bash
python3 -m http.server 8000 &
curl -sS -o /dev/null -w "%{http_code}\n" http://localhost:8000/tools.html
# Expected: 200
curl -sS http://localhost:8000/tools.html | grep -c "tool-tile"
# Expected: ≥8 (one per tile, plus the class definition references)
curl -sS http://localhost:8000/tools.html | grep -c 'id="files-and-commands"\|id="web-fetch"\|id="microsoft-365"\|id="persistent-memory"\|id="custom-commands"\|id="more-connectors"\|id="sub-agents"\|id="hooks"'
# Expected: 8 — every tile has a matching scroll section
```

Open `http://localhost:8000/tools.html` in a browser. Walk through criteria 1–10 from Step 1.

Stop the server with `kill %1` (or `pkill -f "http.server 8000"`).

- [ ] **Step 5: Commit**

```bash
git add tools.html styles/main.css
git commit -m "$(cat <<'EOF'
feat: add tools page introducing Claude Code's 8 capabilities

New /tools.html page sits between landing and demos in the tour. Hero
borrows Anthropic's 'an agent in your terminal' framing; below, a 4x2
grid of tool tiles anchors into eight editorial scroll sections (Files
& commands, Web fetch, Microsoft 365, Persistent memory, Custom commands,
More connectors, Sub-agents, Hooks). Adds tools-page CSS plus the
.built-from / .tool-chip rules that Task 3 will use on detail pages.
EOF
)"
git push
```

---

## Task 2: Thread nav updates in `index.html` and `demos.html`

**Files:**
- Modify: `index.html`
- Modify: `demos.html`

Wire the new tools page into the tour: landing → tools → demos.

- [ ] **Step 1: Define verification criteria**

After this task:

1. From `index.html`, the visible CTA button reads "Start with the toolbox →" and links to `tools.html`.
2. From `index.html`, the topbar `data-key-next` link also points at `tools.html` (text stays "Skip to demos →" — but actually that's misleading now; rename to "Skip to the toolbox →").

   Actually correct: rename topbar `data-key-next` text from "Skip to demos →" to "Continue →" so it's neutral about the next destination. Keep it short.

3. From `demos.html`, the topbar `data-key-prev` link points at `tools.html` (text stays "← back" — also accurate since it's still going back one page in the tour, just to a different page).
4. Right-arrow on `index.html` lands on `tools.html` (was: `demos.html`).
5. Left-arrow on `demos.html` lands on `tools.html` (was: `index.html`).
6. The rest of the tour chain still works end-to-end.

- [ ] **Step 2: Update `index.html`**

In `/Users/hdunlap/Repos/claude-code-director-demos/index.html`, two edits:

**Edit A — topbar link (around line 18):**

Find:
```html
      <a href="demos.html" class="nav-next" data-key-next>Skip to demos →</a>
```

Replace with:
```html
      <a href="tools.html" class="nav-next" data-key-next>Continue →</a>
```

**Edit B — primary CTA (in the `cta-section` near the bottom of `<main>`):**

Find:
```html
      <a href="demos.html" class="cta-btn">See the demos →</a>
```

Replace with:
```html
      <a href="tools.html" class="cta-btn">Start with the toolbox →</a>
```

- [ ] **Step 3: Update `demos.html`**

In `/Users/hdunlap/Repos/claude-code-director-demos/demos.html`, find the topbar nav link (around line 18):

```html
      <a href="index.html" class="nav-prev" data-key-prev>← back</a>
```

Replace with:
```html
      <a href="tools.html" class="nav-prev" data-key-prev>← back</a>
```

(Only the `href` changes; the visible text "← back" stays.)

- [ ] **Step 4: Verify**

```bash
python3 -m http.server 8000 &
# Walk the chain via curl — each page should reference the next/prev correctly
curl -sS http://localhost:8000/ | grep -E 'href="tools.html".*data-key-next|href="tools.html".*cta-btn'
# Expected: at least 2 matches (topbar + CTA)
curl -sS http://localhost:8000/demos.html | grep 'href="tools.html".*data-key-prev'
# Expected: 1 match
kill %1
```

Open the live chain in a browser:
- Landing → click "Start with the toolbox →" → tools page loads
- Tools page → right-arrow key → demos page loads
- Demos page → left-arrow key → tools page loads (NOT index)
- Tools page → left-arrow key → index loads

- [ ] **Step 5: Commit**

```bash
git add index.html demos.html
git commit -m "feat(nav): thread tools.html into the tour between landing and demos"
git push
```

---

## Task 3: Replace meta lines with "Built from" chip rows on four detail pages

**Files:**
- Modify: `demos/daily-brief.html`
- Modify: `demos/personal-secretary.html`
- Modify: `demos/stakeholders.html`
- Modify: `demos/team.html`

Each detail page currently has a `<p class="detail-meta">Tools: ...</p>` line under its `<h1>`. Replace that with a horizontal chip row showing which Claude Code tools combine to make the demo. The CSS for `.built-from` and `.tool-chip` already shipped in Task 1.

- [ ] **Step 1: Define verification criteria**

After this task, on each detail page:
1. The old `<p class="detail-meta">Tools: ...</p>` line is gone.
2. A new `<div class="built-from">` element is in its place, containing a `<span class="built-from__label">Built from</span>` and several `<a class="tool-chip">` anchors.
3. Each chip's `href` is `../tools.html#<anchor>` matching one of the eight tools.
4. Per-demo chip lists match the spec exactly:
   - **Daily Brief:** Files & commands · Custom commands · Web fetch · Persistent memory
   - **Personal Secretary:** Files & commands · Custom commands · Microsoft 365 · Persistent memory
   - **Stakeholder Mgmt:** Files & commands · Custom commands · Microsoft 365 · Persistent memory
   - **Team Mgmt:** Files & commands · Custom commands · Microsoft 365 · Persistent memory
5. Clicking any chip navigates to `tools.html` and scrolls to the matching `#anchor` section.

- [ ] **Step 2: Update `demos/daily-brief.html`**

In `/Users/hdunlap/Repos/claude-code-director-demos/demos/daily-brief.html`, find the detail header block:

```html
    <header class="detail-header">
      <h1>📰 Daily Brief</h1>
      <p class="detail-meta">Tools: Claude Code · Node.js</p>
    </header>
```

Replace with:

```html
    <header class="detail-header">
      <h1>📰 Daily Brief</h1>
      <div class="built-from">
        <span class="built-from__label">Built from</span>
        <a class="tool-chip" href="../tools.html#files-and-commands"><span class="tool-chip__icon">📁</span> Files &amp; commands</a>
        <a class="tool-chip" href="../tools.html#custom-commands"><span class="tool-chip__icon">⚡</span> Custom commands</a>
        <a class="tool-chip" href="../tools.html#web-fetch"><span class="tool-chip__icon">🌐</span> Web fetch</a>
        <a class="tool-chip" href="../tools.html#persistent-memory"><span class="tool-chip__icon">🧠</span> Persistent memory</a>
      </div>
    </header>
```

- [ ] **Step 3: Update `demos/personal-secretary.html`**

Find:
```html
    <header class="detail-header">
      <h1>📅 Personal Secretary</h1>
      <p class="detail-meta">Tools: Claude Code · Microsoft 365 · Node.js</p>
    </header>
```

Replace with:
```html
    <header class="detail-header">
      <h1>📅 Personal Secretary</h1>
      <div class="built-from">
        <span class="built-from__label">Built from</span>
        <a class="tool-chip" href="../tools.html#files-and-commands"><span class="tool-chip__icon">📁</span> Files &amp; commands</a>
        <a class="tool-chip" href="../tools.html#custom-commands"><span class="tool-chip__icon">⚡</span> Custom commands</a>
        <a class="tool-chip" href="../tools.html#microsoft-365"><span class="tool-chip__icon">📅</span> Microsoft 365</a>
        <a class="tool-chip" href="../tools.html#persistent-memory"><span class="tool-chip__icon">🧠</span> Persistent memory</a>
      </div>
    </header>
```

- [ ] **Step 4: Update `demos/stakeholders.html`**

Find:
```html
    <header class="detail-header">
      <h1>🤝 Stakeholder Management</h1>
      <p class="detail-meta">Tools: Claude Code · Microsoft 365 · Node.js</p>
    </header>
```

Replace with:
```html
    <header class="detail-header">
      <h1>🤝 Stakeholder Management</h1>
      <div class="built-from">
        <span class="built-from__label">Built from</span>
        <a class="tool-chip" href="../tools.html#files-and-commands"><span class="tool-chip__icon">📁</span> Files &amp; commands</a>
        <a class="tool-chip" href="../tools.html#custom-commands"><span class="tool-chip__icon">⚡</span> Custom commands</a>
        <a class="tool-chip" href="../tools.html#microsoft-365"><span class="tool-chip__icon">📅</span> Microsoft 365</a>
        <a class="tool-chip" href="../tools.html#persistent-memory"><span class="tool-chip__icon">🧠</span> Persistent memory</a>
      </div>
    </header>
```

- [ ] **Step 5: Update `demos/team.html`**

Find:
```html
    <header class="detail-header">
      <h1>👥 Team Management</h1>
      <p class="detail-meta">Tools: Claude Code · Microsoft 365 · Node.js</p>
    </header>
```

Replace with:
```html
    <header class="detail-header">
      <h1>👥 Team Management</h1>
      <div class="built-from">
        <span class="built-from__label">Built from</span>
        <a class="tool-chip" href="../tools.html#files-and-commands"><span class="tool-chip__icon">📁</span> Files &amp; commands</a>
        <a class="tool-chip" href="../tools.html#custom-commands"><span class="tool-chip__icon">⚡</span> Custom commands</a>
        <a class="tool-chip" href="../tools.html#microsoft-365"><span class="tool-chip__icon">📅</span> Microsoft 365</a>
        <a class="tool-chip" href="../tools.html#persistent-memory"><span class="tool-chip__icon">🧠</span> Persistent memory</a>
      </div>
    </header>
```

- [ ] **Step 6: Verify**

```bash
python3 -m http.server 8000 &

# Each detail page should have a built-from row and zero detail-meta
for page in daily-brief personal-secretary stakeholders team; do
  echo "=== $page ==="
  curl -sS http://localhost:8000/demos/$page.html | grep -c 'class="built-from"'
  # Expected: 1 per page
  curl -sS http://localhost:8000/demos/$page.html | grep -c 'class="detail-meta"'
  # Expected: 0 per page
  curl -sS http://localhost:8000/demos/$page.html | grep -oE 'href="\.\./tools\.html#[a-z-]+"' | sort -u
  # Expected: 4 unique tool anchors per page (3 for personal-secretary if you didn't add memory — but the spec adds it)
done

kill %1
```

Open one detail page in a browser. Click each chip — it should navigate to `tools.html` and the page should scroll to the corresponding section anchor.

- [ ] **Step 7: Commit**

```bash
git add demos/daily-brief.html demos/personal-secretary.html demos/stakeholders.html demos/team.html
git commit -m "$(cat <<'EOF'
feat(detail): replace meta line with "Built from" chip row

Each detail page now shows which Claude Code tools combine to make that
demo, with each chip linking to the matching section on tools.html.
The old "Tools: Claude Code · Microsoft 365 · Node.js" install meta
line is dropped — install requirements already live in "What you'll need".
EOF
)"
git push
```

---

## Self-review (already performed)

**Spec coverage:**
- Tools page hero, grid, editorial scroll, closing CTA → Task 1 ✓
- Eight tool sections with verbatim prose → Task 1 (Step 2) ✓
- New CSS for `.tools-grid`, `.tool-tile`, `.tool-section`, `.built-from`, `.tool-chip` → Task 1 (Step 3) ✓
- Nav updates threading the new page into the tour → Task 2 ✓
- "Built from" chip rows on all four detail pages with correct chip lists → Task 3 ✓

**Placeholder scan:** Clean — every step has actual code or exact commands.

**Type/name consistency:** Tool anchor IDs (`files-and-commands`, `web-fetch`, `microsoft-365`, `persistent-memory`, `custom-commands`, `more-connectors`, `sub-agents`, `hooks`) used identically in tools.html (Task 1), and chip hrefs (Task 3). Class names (`tool-tile`, `tool-tile__icon`, `tool-tile__name`, `tool-tile__line`, `tool-section`, `built-from`, `built-from__label`, `tool-chip`, `tool-chip__icon`) consistent across CSS and HTML.

**Edge case:** The grid hero on `tools.html` uses BEM (`tool-tile__icon`). The chip on detail pages uses BEM too (`tool-chip__icon`). Both classes exist as separate styles in `main.css` Task 1 Step 3 — no naming collision.
