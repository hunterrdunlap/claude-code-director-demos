# Vibe Coding Director Demos Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a static six-page presentation site that walks Nelnet directors through four small Claude Code recipes (Daily Brief, Personal Secretary, Stakeholder Management, Team Management), and ship the four runnable slash-command files alongside it — all hosted via GitHub Pages.

**Architecture:** Plain HTML/CSS/JS at repo root, six pages, one shared stylesheet, one tiny ES-module JS file for arrow-key navigation and clipboard-copy buttons. Each detail page links to its corresponding `recipes/*.md` slash command file (the take-home deliverable). No server, no bundler, no npm dependencies.

**Tech Stack:** HTML5, CSS3 (custom properties, grid, flexbox), vanilla JS as ES modules, Google Fonts CDN (Source Serif 4, Inter, JetBrains Mono). Hosted on GitHub Pages from `main` branch root.

**Spec:** [`../specs/2026-05-06-vibe-coding-demo-page-design.md`](../specs/2026-05-06-vibe-coding-demo-page-design.md)

---

## File structure

| Path | Responsibility |
|------|----------------|
| `index.html` | Landing page (split hero, "what you'll see today" preview, primary CTA) |
| `demos.html` | Cards page — 2×2 grid of four demo cards |
| `demos/daily-brief.html` | Detail page for Daily Brief |
| `demos/personal-secretary.html` | Detail page for Personal Secretary |
| `demos/stakeholders.html` | Detail page for Stakeholder Management |
| `demos/team.html` | Detail page for Team Management |
| `styles/main.css` | All visual rules: palette tokens, typography, layout, cards, terminal blocks, split hero, hairlines |
| `js/main.js` | ES-module entry: wires arrow-key navigation and clipboard-copy buttons |
| `assets/nelnet-wordmark.svg` | Text-only Nelnet wordmark SVG (placeholder — Hunter may swap in real logo) |
| `assets/previews/daily-brief.svg` | Mock preview of rendered Daily Brief output |
| `assets/previews/personal-secretary.svg` | Mock preview of "Today" page |
| `assets/previews/stakeholders.svg` | Mock preview of stakeholder dashboard |
| `assets/previews/team.svg` | Mock preview of team dashboard |
| `recipes/daily-brief.md` | Claude Code slash command for `/daily-brief` |
| `recipes/secretary.md` | Slash command for `/secretary` |
| `recipes/stakeholder-update.md` | Slash command for `/stakeholder-update` |
| `recipes/team-update.md` | Slash command for `/team-update` |

**Why these boundaries:**
- One stylesheet because the site is small and components share many tokens — splitting per-page would force duplication.
- One JS file because the only behaviors are progressive enhancements (arrow keys, copy buttons) that should run everywhere.
- Each page is self-contained HTML (no template engine) — duplication of the top-bar and footer markup across six pages is simpler than introducing tooling.
- Recipes live in their own folder so they can be linked directly from detail pages and copied verbatim by directors.

**Path conventions:**
- Pages at repo root use `styles/main.css` and `js/main.js`.
- Pages in `demos/` use `../styles/main.css` and `../js/main.js`.
- Recipe links from detail pages: `../recipes/<name>.md`.

**Testing approach:** Static HTML/CSS doesn't lend itself to traditional unit tests. Each visual task includes an explicit **Verify** step listing observable criteria — open the file in a browser and confirm each one. The JS is small enough that manual browser verification is sufficient and a test framework would add weight without value.

---

## Task 1: Bootstrap repo skeleton

**Files:**
- Create: `styles/main.css`
- Create: `js/main.js`
- Create: `index.html`, `demos.html`, `demos/daily-brief.html`, `demos/personal-secretary.html`, `demos/stakeholders.html`, `demos/team.html`
- Create: directories `assets/`, `assets/previews/`, `recipes/`

This task lays down the directory structure, the base CSS with palette tokens and typography, an empty JS module, and stub HTML files with the shared shell (head, top-bar, footer-nav placeholders). Subsequent tasks fill in page-specific content.

- [ ] **Step 1: Create directories and empty asset/recipe folders**

Run from the repo root:

```bash
mkdir -p demos styles js assets/previews recipes
```

Verify:

```bash
ls
# Expect to see: README.md, demos, docs, js, styles, assets, recipes (plus existing .gitignore)
```

- [ ] **Step 2: Create `styles/main.css` with palette tokens, typography, and shared layout primitives**

Create `styles/main.css`:

```css
/* ============================================================
   Tokens — provided palette plus Claude additions
   ============================================================ */
:root {
  --primary: #11891C;
  --primary-soft: #70BA44;
  --primary-bright: #AED136;
  --teal: #018181;
  --teal-soft: #6FC6A5;
  --cyan: #11AECF;
  --blue: #0E729A;
  --purple: #6867AF;
  --bg-base: #f8fafc;
  --bg-white: #ffffff;
  --text-dark: #0f172a;
  --text-main: #334155;
  --text-muted: #64748b;
  --danger: #ef4444;

  --claude-coral: #D97757;
  --claude-cream: #FAF7F2;

  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.04);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.08);
  --focus-ring: 0 0 0 3px rgba(17, 137, 28, 0.35);

  --font-serif: "Source Serif 4", Georgia, serif;
  --font-sans: "Inter", system-ui, -apple-system, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, monospace;
}

/* ============================================================
   Reset
   ============================================================ */
*, *::before, *::after { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body {
  margin: 0;
  font-family: var(--font-sans);
  font-size: 16px;
  line-height: 1.55;
  color: var(--text-main);
  background: var(--bg-base);
}

img, svg { max-width: 100%; display: block; }
a { color: var(--blue); text-decoration: none; }
a:hover { color: var(--teal); text-decoration: underline; }

h1, h2, h3 {
  font-family: var(--font-serif);
  color: var(--text-dark);
  margin: 0 0 0.5em;
  line-height: 1.2;
}
h1 { font-size: clamp(2rem, 4vw, 3rem); font-weight: 700; }
h2 { font-size: clamp(1.4rem, 2.5vw, 1.875rem); font-weight: 600; }
h3 { font-size: 1.125rem; font-weight: 600; }

/* ============================================================
   Layout primitives
   ============================================================ */
.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  background: var(--bg-white);
  border-bottom: 1px solid #e2e8f0;
}

.topbar .brand { display: flex; align-items: center; gap: 0.75rem; font-weight: 600; color: var(--text-dark); }
.topbar .brand img { height: 24px; }

.topbar nav { display: flex; gap: 1.5rem; align-items: center; }
.topbar nav a { font-size: 0.95rem; color: var(--text-main); }

.hairline {
  border: 0;
  height: 1px;
  background: linear-gradient(to right, var(--cyan), var(--claude-coral));
  margin: 3rem 0;
}

.cta-btn {
  display: inline-block;
  padding: 0.875rem 1.5rem;
  background: var(--claude-coral);
  color: #fff;
  border-radius: 0.5rem;
  font-weight: 600;
  font-family: var(--font-sans);
  border: 0;
  cursor: pointer;
  box-shadow: var(--shadow-sm);
  transition: transform 0.1s, box-shadow 0.1s;
}
.cta-btn:hover { transform: translateY(-1px); box-shadow: var(--shadow-md); color: #fff; text-decoration: none; }
.cta-btn:focus-visible { outline: 0; box-shadow: var(--focus-ring); }

.page-footer-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 3rem 0 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e2e8f0;
}
.page-footer-nav a {
  font-weight: 500;
  color: var(--text-main);
}
.page-footer-nav a:hover { color: var(--primary); text-decoration: none; }
```

- [ ] **Step 3: Create `js/main.js` as an empty ES module placeholder**

Create `js/main.js`:

```javascript
// Entry module — populated in Task 6 with arrow-key nav and clipboard copy.
// Kept empty so each page can <script type="module"> safely.
export {};
```

- [ ] **Step 4: Create `index.html` stub**

Create `index.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vibe Coding for Directors</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Source+Serif+4:wght@400;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="styles/main.css">
</head>
<body data-page="index">
  <header class="topbar">
    <div class="brand">
      <img src="assets/nelnet-wordmark.svg" alt="Nelnet" onerror="this.replaceWith(Object.assign(document.createElement('span'),{textContent:'Nelnet · NFS'}));">
    </div>
    <nav>
      <a href="demos.html" class="nav-next" data-key-next>Skip to demos →</a>
    </nav>
  </header>
  <main class="container">
    <h1>Vibe Coding for Directors</h1>
    <p>Coming soon (Task 2).</p>
  </main>
  <script type="module" src="js/main.js"></script>
</body>
</html>
```

- [ ] **Step 5: Create `demos.html` stub**

Create `demos.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Demos · Vibe Coding for Directors</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Source+Serif+4:wght@400;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="styles/main.css">
</head>
<body data-page="demos">
  <header class="topbar">
    <div class="brand">
      <img src="assets/nelnet-wordmark.svg" alt="Nelnet" onerror="this.replaceWith(Object.assign(document.createElement('span'),{textContent:'Nelnet · NFS'}));">
    </div>
    <nav>
      <a href="index.html" class="nav-prev" data-key-prev>← back</a>
      <a href="demos/daily-brief.html" class="nav-next" data-key-next>next →</a>
    </nav>
  </header>
  <main class="container">
    <h1>Pick a demo</h1>
    <p>Coming soon (Task 3).</p>
  </main>
  <script type="module" src="js/main.js"></script>
</body>
</html>
```

- [ ] **Step 6: Create the four detail page stubs**

Create `demos/daily-brief.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Daily Brief · Vibe Coding for Directors</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Source+Serif+4:wght@400;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../styles/main.css">
</head>
<body data-page="daily-brief">
  <header class="topbar">
    <div class="brand">
      <img src="../assets/nelnet-wordmark.svg" alt="Nelnet" onerror="this.replaceWith(Object.assign(document.createElement('span'),{textContent:'Nelnet · NFS'}));">
    </div>
    <nav>
      <a href="../demos.html" class="nav-prev" data-key-prev>← demos</a>
      <a href="personal-secretary.html" class="nav-next" data-key-next>next →</a>
    </nav>
  </header>
  <main class="container">
    <h1>📰 Daily Brief</h1>
    <p>Coming soon (Task 4).</p>
  </main>
  <script type="module" src="../js/main.js"></script>
</body>
</html>
```

Create `demos/personal-secretary.html` (same shell, prev=daily-brief, next=stakeholders, title="Personal Secretary", icon "📅"):

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Personal Secretary · Vibe Coding for Directors</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Source+Serif+4:wght@400;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../styles/main.css">
</head>
<body data-page="personal-secretary">
  <header class="topbar">
    <div class="brand">
      <img src="../assets/nelnet-wordmark.svg" alt="Nelnet" onerror="this.replaceWith(Object.assign(document.createElement('span'),{textContent:'Nelnet · NFS'}));">
    </div>
    <nav>
      <a href="../demos.html" class="nav-prev">← demos</a>
      <a href="daily-brief.html" data-key-prev>prev</a>
      <a href="stakeholders.html" class="nav-next" data-key-next>next →</a>
    </nav>
  </header>
  <main class="container">
    <h1>📅 Personal Secretary</h1>
    <p>Coming soon (Task 5).</p>
  </main>
  <script type="module" src="../js/main.js"></script>
</body>
</html>
```

Create `demos/stakeholders.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Stakeholder Management · Vibe Coding for Directors</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Source+Serif+4:wght@400;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../styles/main.css">
</head>
<body data-page="stakeholders">
  <header class="topbar">
    <div class="brand">
      <img src="../assets/nelnet-wordmark.svg" alt="Nelnet" onerror="this.replaceWith(Object.assign(document.createElement('span'),{textContent:'Nelnet · NFS'}));">
    </div>
    <nav>
      <a href="../demos.html" class="nav-prev">← demos</a>
      <a href="personal-secretary.html" data-key-prev>prev</a>
      <a href="team.html" class="nav-next" data-key-next>next →</a>
    </nav>
  </header>
  <main class="container">
    <h1>🤝 Stakeholder Management</h1>
    <p>Coming soon (Task 5).</p>
  </main>
  <script type="module" src="../js/main.js"></script>
</body>
</html>
```

Create `demos/team.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Team Management · Vibe Coding for Directors</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Source+Serif+4:wght@400;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../styles/main.css">
</head>
<body data-page="team">
  <header class="topbar">
    <div class="brand">
      <img src="../assets/nelnet-wordmark.svg" alt="Nelnet" onerror="this.replaceWith(Object.assign(document.createElement('span'),{textContent:'Nelnet · NFS'}));">
    </div>
    <nav>
      <a href="../demos.html" class="nav-prev">← demos</a>
      <a href="stakeholders.html" data-key-prev>prev</a>
      <a href="../demos.html" class="nav-next" data-key-next>back to demos →</a>
    </nav>
  </header>
  <main class="container">
    <h1>👥 Team Management</h1>
    <p>Coming soon (Task 5).</p>
  </main>
  <script type="module" src="../js/main.js"></script>
</body>
</html>
```

- [ ] **Step 7: Verify in the browser**

Open `index.html` in your browser (double-click, or `open index.html` on macOS).

Verify all of:
- The page renders without console errors
- The Inter font is loading (body text is sans-serif, not the browser default Times)
- The Source Serif 4 font is loading (the `<h1>` "Vibe Coding for Directors" renders in a serif)
- The top bar shows "Nelnet · NFS" text fallback (since the SVG doesn't exist yet) and the "Skip to demos →" link
- Clicking "Skip to demos →" loads `demos.html`
- From `demos.html`, clicking "next →" loads `demos/daily-brief.html`
- From any detail page, the "← demos" link returns you to `demos.html`

- [ ] **Step 8: Commit**

```bash
git add styles/ js/ index.html demos.html demos/
git commit -m "$(cat <<'EOF'
chore: bootstrap site skeleton with palette, typography, and stub pages

Adds the six-page shell — landing, cards, four detail pages — wired
together with hardcoded prev/next links so navigation works without JS.
Single shared stylesheet seeded with the user's palette tokens, typography,
and layout primitives. JS module is an empty placeholder for Task 6.
EOF
)"
git push
```

---

## Task 2: Landing page (`index.html`)

**Files:**
- Modify: `index.html`
- Modify: `styles/main.css` (append landing-specific styles)

Replace the placeholder `<main>` with the split hero, "what you'll see today" preview row, "how this works" bullets, and the primary CTA.

- [ ] **Step 1: Define the verification criteria for the landing page**

Before writing code, list what we expect to see when this task is done:

1. The hero is visually split into two halves with a diagonal seam.
2. The left half is solid green (`--primary` or `--primary-soft`); right half is cream (`--claude-cream`).
3. The tagline "Vibe Coding for Directors" sits across the seam, large, in serif.
4. Below the hero, a "What you'll see today" row shows four small chips — 📰 Daily Brief, 📅 Personal Secretary, 🤝 Stakeholders, 👥 Team Mgmt.
5. A "How this works" section shows three bullets.
6. A coral CTA button reads "See the demos →" and links to `demos.html`.
7. The whole layout is responsive — at narrow widths (<720px), the split hero stacks vertically.

- [ ] **Step 2: Replace `<main>` content in `index.html`**

In `index.html`, replace the entire `<main class="container">…</main>` block with:

```html
  <main>
    <section class="split-hero">
      <div class="split-hero__panel split-hero__panel--structure">
        <span class="split-hero__label">STRUCTURE</span>
        <p class="split-hero__copy">Director-tested workflows.</p>
      </div>
      <div class="split-hero__panel split-hero__panel--vibe">
        <span class="split-hero__label">VIBE</span>
        <p class="split-hero__copy">Claude Code, the way you'd actually want to work.</p>
      </div>
      <h1 class="split-hero__tagline">
        Vibe Coding<br>for Directors
      </h1>
    </section>

    <section class="container preview-row">
      <h2>What you'll see today</h2>
      <div class="preview-chips">
        <a class="chip" href="demos/daily-brief.html"><span class="chip__icon">📰</span> Daily Brief</a>
        <a class="chip" href="demos/personal-secretary.html"><span class="chip__icon">📅</span> Personal Secretary</a>
        <a class="chip" href="demos/stakeholders.html"><span class="chip__icon">🤝</span> Stakeholders</a>
        <a class="chip" href="demos/team.html"><span class="chip__icon">👥</span> Team Mgmt</a>
      </div>
    </section>

    <hr class="hairline">

    <section class="container how-it-works">
      <h2>How this works</h2>
      <ul class="how-bullets">
        <li>You'll see four small apps directors can build.</li>
        <li>Each is built with a single Claude Code slash command.</li>
        <li>You can build them yourself during this session.</li>
      </ul>
    </section>

    <section class="container cta-section">
      <a href="demos.html" class="cta-btn">See the demos →</a>
    </section>
  </main>
```

- [ ] **Step 3: Append landing-specific styles to `styles/main.css`**

Append the following at the end of `styles/main.css`:

```css
/* ============================================================
   Landing page — split hero
   ============================================================ */
.split-hero {
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 70vh;
  overflow: hidden;
  isolation: isolate;
}

.split-hero__panel {
  padding: 4rem 3rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  position: relative;
}

.split-hero__panel--structure {
  background: var(--primary);
  color: var(--bg-white);
  /* Diagonal cut on the right edge */
  clip-path: polygon(0 0, 100% 0, calc(100% - 80px) 100%, 0 100%);
  z-index: 2;
}

.split-hero__panel--vibe {
  background: var(--claude-cream);
  color: var(--text-dark);
  /* Diagonal cut on the left edge — overlaps with structure panel */
  clip-path: polygon(80px 0, 100% 0, 100% 100%, 0 100%);
  margin-left: -80px;
  padding-left: calc(3rem + 80px);
  z-index: 1;
}

.split-hero__label {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  opacity: 0.7;
  margin-bottom: 0.75rem;
}

.split-hero__copy {
  font-family: var(--font-serif);
  font-size: 1.25rem;
  margin: 0;
  max-width: 22ch;
  line-height: 1.4;
}

.split-hero__tagline {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  font-weight: 700;
  text-align: center;
  color: var(--text-dark);
  pointer-events: none;
  z-index: 3;
  margin: 0;
  /* The tagline sits over both panels — give it a soft cream backing for legibility */
  background: linear-gradient(
    to right,
    rgba(255,255,255,0.85) 0%,
    rgba(255,255,255,0.95) 50%,
    rgba(250,247,242,0.85) 100%
  );
  background-clip: text;
  -webkit-background-clip: text;
  /* Fallback: don't actually clip — leave a subtle drop shadow for legibility */
  text-shadow: 0 1px 2px rgba(0,0,0,0.08);
}

@media (max-width: 720px) {
  .split-hero { grid-template-columns: 1fr; min-height: auto; }
  .split-hero__panel--structure {
    clip-path: polygon(0 0, 100% 0, 100% calc(100% - 40px), 0 100%);
    padding-bottom: 5rem;
  }
  .split-hero__panel--vibe {
    clip-path: polygon(0 40px, 100% 0, 100% 100%, 0 100%);
    margin-left: 0;
    margin-top: -40px;
    padding-left: 3rem;
    padding-top: 4rem;
  }
  .split-hero__tagline { font-size: 2rem; }
}

/* ============================================================
   Landing — preview chips
   ============================================================ */
.preview-row { padding-top: 3rem; }

.preview-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 1rem;
}

.chip {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1rem;
  background: var(--bg-white);
  border: 1px solid #e2e8f0;
  border-radius: 999px;
  color: var(--text-main);
  font-weight: 500;
  font-size: 0.95rem;
  transition: border-color 0.15s, transform 0.1s;
}
.chip:hover {
  border-color: var(--claude-coral);
  color: var(--text-dark);
  text-decoration: none;
  transform: translateY(-1px);
}
.chip__icon { font-size: 1.1rem; }

/* ============================================================
   Landing — how this works
   ============================================================ */
.how-bullets {
  list-style: none;
  padding: 0;
  margin: 1rem 0 0;
  display: grid;
  gap: 0.5rem;
  font-size: 1.05rem;
  max-width: 60ch;
}
.how-bullets li {
  position: relative;
  padding-left: 1.5rem;
}
.how-bullets li::before {
  content: "→";
  position: absolute;
  left: 0;
  color: var(--claude-coral);
  font-weight: 700;
}

.cta-section {
  margin: 3rem auto 5rem;
  text-align: center;
}
```

- [ ] **Step 4: Verify in the browser**

Open `index.html`. Walk through each criterion from Step 1:

1. ✅ Hero is split with a diagonal seam (left has a slope on its right edge, right has a slope on its left edge, and they overlap)
2. ✅ Left is green, right is cream
3. ✅ Tagline "Vibe Coding for Directors" sits across the middle in serif
4. ✅ "What you'll see today" row shows four chips with icons and they're clickable
5. ✅ "How this works" shows three bullets with coral arrow markers
6. ✅ Coral "See the demos →" button is centered; click → goes to `demos.html`
7. ✅ Resize browser to <720px — hero stacks vertically with the diagonal seam preserved

- [ ] **Step 5: Commit**

```bash
git add index.html styles/main.css
git commit -m "feat: build landing page with split hero and preview chips"
git push
```

---

## Task 3: Demos cards page (`demos.html`)

**Files:**
- Modify: `demos.html`
- Modify: `styles/main.css` (append cards styles)

Replace the placeholder content with a 2×2 grid of four demo cards.

- [ ] **Step 1: Define verification criteria**

1. The page heading reads "Pick a demo".
2. A 2×2 grid (single column on narrow screens) shows four cards: Daily Brief, Personal Secretary, Stakeholder Management, Team Management.
3. Each card has: a green header strip, an icon, a title, a one-line value prop, a tag row, and a coral accent line at the bottom.
4. Tag rows: Daily Brief = "RSS · HTML"; Personal Secretary = "M365 · HTML"; Stakeholders = "Markdown · M365 · HTML"; Team = "Markdown · M365 · HTML".
5. Hover: card lifts (subtle shadow) and the coral accent line widens.
6. Whole card is clickable — clicking anywhere on a card navigates to its detail page.

- [ ] **Step 2: Replace the `<main>` content in `demos.html`**

Replace the entire `<main class="container">…</main>` block with:

```html
  <main class="container">
    <h1>Pick a demo</h1>
    <p class="cards-intro">Four small projects. Each is built with a single Claude Code slash command.</p>

    <div class="cards">
      <a class="card" href="demos/daily-brief.html">
        <div class="card__strip"></div>
        <div class="card__body">
          <div class="card__icon">📰</div>
          <h2>Daily Brief</h2>
          <p>Curated morning read from your interests.</p>
          <div class="card__tags">
            <span class="tag">RSS</span>
            <span class="tag">HTML</span>
          </div>
        </div>
        <div class="card__accent"></div>
      </a>

      <a class="card" href="demos/personal-secretary.html">
        <div class="card__strip"></div>
        <div class="card__body">
          <div class="card__icon">📅</div>
          <h2>Personal Secretary</h2>
          <p>Your day, summarized from M365.</p>
          <div class="card__tags">
            <span class="tag">M365</span>
            <span class="tag">HTML</span>
          </div>
        </div>
        <div class="card__accent"></div>
      </a>

      <a class="card" href="demos/stakeholders.html">
        <div class="card__strip"></div>
        <div class="card__body">
          <div class="card__icon">🤝</div>
          <h2>Stakeholder Management</h2>
          <p>Markdown-driven relationship dashboard.</p>
          <div class="card__tags">
            <span class="tag">Markdown</span>
            <span class="tag">M365</span>
            <span class="tag">HTML</span>
          </div>
        </div>
        <div class="card__accent"></div>
      </a>

      <a class="card" href="demos/team.html">
        <div class="card__strip"></div>
        <div class="card__body">
          <div class="card__icon">👥</div>
          <h2>Team Management</h2>
          <p>1:1 prep + status rollup from notes.</p>
          <div class="card__tags">
            <span class="tag">Markdown</span>
            <span class="tag">M365</span>
            <span class="tag">HTML</span>
          </div>
        </div>
        <div class="card__accent"></div>
      </a>
    </div>
  </main>
```

- [ ] **Step 3: Append cards styles to `styles/main.css`**

```css
/* ============================================================
   Demos cards
   ============================================================ */
.cards-intro {
  font-size: 1.1rem;
  color: var(--text-muted);
  margin-bottom: 2rem;
}

.cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin: 2rem 0 4rem;
}

@media (max-width: 720px) {
  .cards { grid-template-columns: 1fr; }
}

.card {
  display: flex;
  flex-direction: column;
  background: var(--bg-white);
  border-radius: 0.75rem;
  overflow: hidden;
  color: var(--text-main);
  box-shadow: var(--shadow-sm);
  transition: box-shadow 0.15s, transform 0.15s;
  text-decoration: none;
}
.card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-3px);
  text-decoration: none;
  color: var(--text-main);
}
.card:focus-visible { outline: 0; box-shadow: var(--focus-ring); }

.card__strip {
  height: 6px;
  background: var(--primary);
}

.card__body { padding: 1.5rem 1.5rem 1rem; flex-grow: 1; }

.card__icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.card__body h2 {
  margin: 0 0 0.5rem;
  font-size: 1.4rem;
}

.card__body p { margin: 0 0 1rem; color: var(--text-main); }

.card__tags {
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
  margin-top: auto;
}

.tag {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  background: var(--bg-base);
  color: var(--text-muted);
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
}

.card__accent {
  height: 3px;
  background: var(--claude-coral);
  width: 30%;
  transition: width 0.2s ease-out;
}
.card:hover .card__accent { width: 100%; }
```

- [ ] **Step 4: Verify in the browser**

Open `demos.html`. Verify each criterion from Step 1, in particular:
- All four cards are visible and form a 2×2 grid
- Hovering a card lifts it, and the bottom coral accent line widens from ~30% to full width
- Clicking each card lands on its respective detail page
- Resize to narrow width: cards stack to single column

- [ ] **Step 5: Commit**

```bash
git add demos.html styles/main.css
git commit -m "feat: build demos cards page with 2x2 grid"
git push
```

---

## Task 4: Demo detail template + Daily Brief page

**Files:**
- Modify: `demos/daily-brief.html`
- Modify: `styles/main.css` (append detail-page styles)

Build out one fully-realized detail page for Daily Brief. Tasks 5 will copy this structure for the other three demos.

- [ ] **Step 1: Define verification criteria**

1. Demo header shows the icon, title, and a meta line "Tools: Claude Code · Node.js" — no time estimate, no difficulty.
2. "What you'll build" section has a paragraph and a preview placeholder area (image will be added in Task 8).
3. "What you'll need" section lists prerequisites as a bulleted list.
4. Three numbered steps: "Drop in the slash command", "Run it", "See it" — each with a styled terminal/code block.
5. Code blocks have a copy button visible in the top-right corner (the button is non-functional until Task 6).
6. Terminal output uses coral `>` prompt and green output text.
7. "Customize" section is a bulleted list.
8. "Why directors care" is a single paragraph.
9. Footer has "← Demos" and "Personal Secretary →" links.

- [ ] **Step 2: Replace `<main>` content in `demos/daily-brief.html`**

```html
  <main class="container detail">
    <header class="detail-header">
      <h1>📰 Daily Brief</h1>
      <p class="detail-meta">Tools: Claude Code · Node.js</p>
    </header>

    <section class="detail-section">
      <h2>What you'll build</h2>
      <p>A magazine-style HTML page that pulls fresh items from RSS feeds and websites you care about, scores them against your stated interests, and presents a top story plus three to four secondary reads. Refresh by re-running the slash command — the page updates in place.</p>
      <div class="preview-frame">
        <img src="../assets/previews/daily-brief.svg" alt="Mock preview of the rendered Daily Brief page" onerror="this.replaceWith(Object.assign(document.createElement('div'),{textContent:'(preview screenshot — added in Task 8)',className:'preview-placeholder'}));">
      </div>
    </section>

    <hr class="hairline">

    <section class="detail-section">
      <h2>What you'll need</h2>
      <ul class="needs-list">
        <li>Claude Code installed and signed in</li>
        <li>A folder you don't mind cluttering (e.g., <code>~/projects/daily-brief</code>)</li>
        <li>Two short markdown files: <code>interests.md</code> and <code>sources.md</code> (the recipe will create them if missing)</li>
      </ul>
    </section>

    <hr class="hairline">

    <section class="detail-section">
      <h2>Step 1 — Drop in the slash command</h2>
      <p>Save this file at <code>~/.claude/commands/daily-brief.md</code>:</p>
      <pre class="terminal terminal--file" data-file-path="~/.claude/commands/daily-brief.md">
<button class="copy-btn" data-copy-from="next-pre" type="button" aria-label="Copy to clipboard">📋 Copy</button>
<code>---
description: Build a daily brief from RSS sources matched to your interests
---

You are building a daily brief HTML page for a director who wants to start
their day informed about specific topics.

INPUTS
- interests.md (in cwd) — bullet list of topics
- sources.md (in cwd) — list of RSS feeds and URLs

WHAT TO DO
1. If interests.md or sources.md is missing, create a sensible starter file
   and tell the user to edit it.
2. Fetch each source. Extract recent items (last 48h preferred).
3. Score each item against the interests file. Rank.
4. Write site/index.html — magazine layout with one top story,
   three to four secondary stories, and an "also worth a look" list.
5. Write site/styles.css if it does not exist.

OUTPUT
- site/index.html
- site/styles.css (one-time)
- A short summary in chat: how many items considered, top stories chosen.</code></pre>
      <p class="copy-source-link">The version above is the slash command body in compact form. The full recipe with notes and customization knobs lives in <a href="../recipes/daily-brief.md">recipes/daily-brief.md</a> — when in doubt, copy from there.</p>
    </section>

    <section class="detail-section">
      <h2>Step 2 — Run it</h2>
      <p>From your project folder, in Claude Code:</p>
      <pre class="terminal" data-terminal>
<button class="copy-btn" data-copy="/daily-brief" type="button" aria-label="Copy command">📋 Copy</button>
<code><span class="prompt">&gt;</span> <span class="cmd">/daily-brief</span>
<span class="output">✓ Read interests.md (8 topics)
✓ Read sources.md (12 feeds)
✓ Fetched 47 fresh items
✓ Scored and ranked
✓ Wrote site/index.html
✓ Top story: "How loan servicers are using AI in 2026"</span></code></pre>
    </section>

    <section class="detail-section">
      <h2>Step 3 — See it</h2>
      <p>Open the rendered page. Either of these works:</p>
      <pre class="terminal" data-terminal>
<button class="copy-btn" data-copy="open site/index.html" type="button" aria-label="Copy command">📋 Copy</button>
<code><span class="prompt">&gt;</span> <span class="cmd">open site/index.html</span></code></pre>
      <p>Or if you want a real local server (so relative URLs and JSON requests work):</p>
      <pre class="terminal" data-terminal>
<button class="copy-btn" data-copy="cd site && python3 -m http.server 8000" type="button" aria-label="Copy command">📋 Copy</button>
<code><span class="prompt">&gt;</span> <span class="cmd">cd site &amp;&amp; python3 -m http.server 8000</span>
<span class="output">Serving HTTP on 0.0.0.0 port 8000 ...</span></code></pre>
    </section>

    <hr class="hairline">

    <section class="detail-section">
      <h2>Customize</h2>
      <ul class="needs-list">
        <li><strong>Interests.</strong> Edit <code>interests.md</code> — bullet list, free-form. Example: "AI in financial services", "loan servicing regulation".</li>
        <li><strong>Sources.</strong> Edit <code>sources.md</code> — RSS URLs, news sitemaps, even plain article URLs. Mix as you like.</li>
        <li><strong>Layout.</strong> Tweak the prompt body to change section headings or add a "personal note" block at the top.</li>
      </ul>
    </section>

    <section class="detail-section">
      <h2>Why directors care</h2>
      <p>Walk into the day knowing what shifted in your domain — without doom-scrolling. The MD-file approach means your interests evolve with you: change a bullet, rerun, and your morning read changes shape immediately.</p>
    </section>

    <nav class="page-footer-nav">
      <a href="../demos.html">← demos</a>
      <a href="personal-secretary.html" data-key-next>Personal Secretary →</a>
    </nav>
  </main>
```

- [ ] **Step 3: Append detail-page styles to `styles/main.css`**

```css
/* ============================================================
   Detail page — header, sections, lists
   ============================================================ */
.detail { padding-top: 2rem; padding-bottom: 3rem; }

.detail-header { margin-bottom: 2.5rem; }
.detail-header h1 { font-size: 2.5rem; margin-bottom: 0.25rem; }
.detail-meta {
  font-family: var(--font-mono);
  font-size: 0.85rem;
  color: var(--text-muted);
  margin: 0;
}

.detail-section { margin: 2rem 0; }
.detail-section h2 {
  font-size: 1.5rem;
  color: var(--primary);
}
.detail-section p { max-width: 70ch; }

.needs-list {
  list-style: none;
  padding: 0;
  margin: 1rem 0 0;
  display: grid;
  gap: 0.6rem;
  max-width: 70ch;
}
.needs-list li {
  position: relative;
  padding-left: 1.5rem;
}
.needs-list li::before {
  content: "•";
  position: absolute;
  left: 0;
  color: var(--primary);
  font-weight: 700;
}

code {
  font-family: var(--font-mono);
  font-size: 0.9em;
  background: rgba(15, 23, 42, 0.06);
  padding: 0.1em 0.4em;
  border-radius: 0.25rem;
}

.preview-frame {
  margin: 1.5rem 0;
  background: var(--bg-white);
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  padding: 1rem;
  box-shadow: var(--shadow-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
}
.preview-placeholder {
  color: var(--text-muted);
  font-style: italic;
  font-size: 0.95rem;
}

/* ============================================================
   Terminal / code blocks
   ============================================================ */
.terminal {
  position: relative;
  background: var(--text-dark);
  color: #e2e8f0;
  border-radius: 0.5rem;
  padding: 1.25rem 1.25rem 1rem;
  margin: 1rem 0;
  overflow-x: auto;
  font-family: var(--font-mono);
  font-size: 0.85rem;
  line-height: 1.6;
}

.terminal code {
  background: transparent;
  padding: 0;
  color: inherit;
  white-space: pre;
}

.terminal .prompt { color: var(--claude-coral); font-weight: 700; user-select: none; }
.terminal .cmd { color: #e2e8f0; }
.terminal .output { color: var(--primary-soft); }

.terminal--file {
  background: #1e293b;
  font-size: 0.8rem;
}
.terminal--file::before {
  content: attr(data-file-path);
  display: block;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-bottom: 0.75rem;
  padding-bottom: 0.5rem;
  padding-right: 90px; /* keep clear of the absolute-positioned copy button */
  border-bottom: 1px solid rgba(255,255,255,0.1);
}

.copy-btn {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  font-family: var(--font-sans);
  font-size: 0.75rem;
  background: rgba(255,255,255,0.08);
  color: #e2e8f0;
  border: 1px solid rgba(255,255,255,0.15);
  padding: 0.3rem 0.6rem;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
}
.copy-btn:hover { background: rgba(255,255,255,0.15); border-color: var(--claude-coral); }
.copy-btn.copied { background: var(--primary); border-color: var(--primary); }
.copy-btn:focus-visible { outline: 0; box-shadow: var(--focus-ring); }

.copy-source-link {
  font-size: 0.875rem;
  color: var(--text-muted);
  margin-top: 0.5rem;
}
```

- [ ] **Step 4: Verify in the browser**

Open `demos/daily-brief.html`. Verify:
- All sections from Step 1 render correctly
- Code/terminal blocks have dark backgrounds, coral `>` prompts, green output text
- Copy buttons are visible (clicking does nothing yet — wired in Task 6)
- The "View source" link below the file block points to `../recipes/daily-brief.md`
- Preview frame shows the placeholder text "(preview screenshot — added in Task 8)" because the SVG doesn't exist yet
- Footer nav has working "← demos" and "Personal Secretary →" links

- [ ] **Step 5: Commit**

```bash
git add demos/daily-brief.html styles/main.css
git commit -m "feat: build detail page template with daily brief content"
git push
```

---

## Task 5: Three remaining detail pages

**Files:**
- Modify: `demos/personal-secretary.html`
- Modify: `demos/stakeholders.html`
- Modify: `demos/team.html`

Apply the same template from Task 4 to the other three demos with their specific content.

- [ ] **Step 1: Define verification criteria**

Each of the three pages has the same structural elements as Daily Brief (detail header, what you'll build + preview frame, what you'll need, three steps, customize, why directors care, footer nav) — but with content tailored to that demo. The footer prev/next links chain correctly:
- `personal-secretary.html`: prev = daily-brief, next = stakeholders
- `stakeholders.html`: prev = personal-secretary, next = team
- `team.html`: prev = stakeholders, next = back to demos.html

- [ ] **Step 2: Replace `<main>` content in `demos/personal-secretary.html`**

```html
  <main class="container detail">
    <header class="detail-header">
      <h1>📅 Personal Secretary</h1>
      <p class="detail-meta">Tools: Claude Code · Microsoft 365 · Node.js</p>
    </header>

    <section class="detail-section">
      <h2>What you'll build</h2>
      <p>A "Today" page that pulls your calendar, recent unread email, and Teams mentions from Microsoft 365, then writes a single HTML page with prep notes for each meeting, an inbox triage section, decisions you owe people, and loose ends. Run it in the morning; refresh as the day shifts.</p>
      <div class="preview-frame">
        <img src="../assets/previews/personal-secretary.svg" alt="Mock preview of the rendered Today page" onerror="this.replaceWith(Object.assign(document.createElement('div'),{textContent:'(preview screenshot — added in Task 8)',className:'preview-placeholder'}));">
      </div>
    </section>

    <hr class="hairline">

    <section class="detail-section">
      <h2>What you'll need</h2>
      <ul class="needs-list">
        <li>Claude Code installed</li>
        <li>The Microsoft 365 connector authenticated in Claude (Outlook + Teams + Calendar scopes)</li>
        <li>A short <code>priorities.md</code> file naming VIPs and which folders matter to you</li>
      </ul>
    </section>

    <hr class="hairline">

    <section class="detail-section">
      <h2>Step 1 — Drop in the slash command</h2>
      <p>Save this file at <code>~/.claude/commands/secretary.md</code>:</p>
      <pre class="terminal terminal--file" data-file-path="~/.claude/commands/secretary.md">
<button class="copy-btn" data-copy-from="next-pre" type="button" aria-label="Copy to clipboard">📋 Copy</button>
<code>---
description: Build a "Today" page from M365 calendar, email, and Teams
---

You are building a daily summary HTML page for a director who wants to walk
into the day with a clear plan.

INPUTS
- priorities.md (in cwd) — VIPs, folders, what counts as "high priority"
- Microsoft 365 connector — calendar (today), unread email (last 24h),
  Teams mentions (last 24h)

WHAT TO DO
1. Read priorities.md. If missing, create a starter and ask the user to edit.
2. Fetch today's calendar events (start/end, attendees, subject, body).
3. Fetch unread email — group by sender, flag VIPs.
4. Fetch Teams @mentions and DMs.
5. For each calendar event, look at email/teams threads with the same
   attendees and summarize "what's relevant for prep."
6. Write site/index.html with sections:
   - Schedule (chronological, with prep notes per meeting)
   - Inbox triage (flagged emails to read/respond to)
   - Decisions needed (questions awaiting your answer)
   - Loose ends (commitments you made but haven't closed out)

OUTPUT
- site/index.html
- site/styles.css (one-time)
- A short summary in chat.</code></pre>
      <p class="copy-source-link">The version above is the slash command body in compact form. The full recipe with notes and customization knobs lives in <a href="../recipes/secretary.md">recipes/secretary.md</a> — when in doubt, copy from there.</p>
    </section>

    <section class="detail-section">
      <h2>Step 2 — Run it</h2>
      <pre class="terminal" data-terminal>
<button class="copy-btn" data-copy="/secretary" type="button" aria-label="Copy command">📋 Copy</button>
<code><span class="prompt">&gt;</span> <span class="cmd">/secretary</span>
<span class="output">✓ Read priorities.md
✓ Fetched 6 calendar events
✓ Fetched 23 unread emails (4 from VIPs)
✓ Fetched 11 Teams mentions
✓ Wrote site/index.html
✓ 3 decisions awaiting your reply</span></code></pre>
    </section>

    <section class="detail-section">
      <h2>Step 3 — See it</h2>
      <pre class="terminal" data-terminal>
<button class="copy-btn" data-copy="open site/index.html" type="button" aria-label="Copy command">📋 Copy</button>
<code><span class="prompt">&gt;</span> <span class="cmd">open site/index.html</span></code></pre>
    </section>

    <hr class="hairline">

    <section class="detail-section">
      <h2>Customize</h2>
      <ul class="needs-list">
        <li><strong>Time window.</strong> "Today" defaults to your work hours; widen or narrow in <code>priorities.md</code>.</li>
        <li><strong>VIPs.</strong> Listed names always rise to the top of inbox triage.</li>
        <li><strong>Sections.</strong> Drop or reorder the four sections by editing the slash command body.</li>
      </ul>
    </section>

    <section class="detail-section">
      <h2>Why directors care</h2>
      <p>Skip the morning email shuffle. Walk into your first meeting already knowing what each attendee has been writing about and what you owe them.</p>
    </section>

    <nav class="page-footer-nav">
      <a href="daily-brief.html" data-key-prev>← Daily Brief</a>
      <a href="stakeholders.html" data-key-next>Stakeholders →</a>
    </nav>
  </main>
```

- [ ] **Step 3: Replace `<main>` content in `demos/stakeholders.html`**

```html
  <main class="container detail">
    <header class="detail-header">
      <h1>🤝 Stakeholder Management</h1>
      <p class="detail-meta">Tools: Claude Code · Microsoft 365 · Node.js</p>
    </header>

    <section class="detail-section">
      <h2>What you'll build</h2>
      <p>A self-deepening relationship dashboard. Each stakeholder is a markdown file (About, Last Contact, Open Items, Goals, Next Touchpoint). The slash command reads all of them, layers in fresh M365 activity (emails, calendar, Teams), and renders a dashboard — who's stale, who has open items waiting, who you exchanged messages with this week. After rendering, it appends today's observations back into each stakeholder's MD file, so your context grows every time you run it.</p>
      <div class="preview-frame">
        <img src="../assets/previews/stakeholders.svg" alt="Mock preview of the stakeholder dashboard" onerror="this.replaceWith(Object.assign(document.createElement('div'),{textContent:'(preview screenshot — added in Task 8)',className:'preview-placeholder'}));">
      </div>
    </section>

    <hr class="hairline">

    <section class="detail-section">
      <h2>What you'll need</h2>
      <ul class="needs-list">
        <li>Claude Code installed</li>
        <li>The Microsoft 365 connector authenticated</li>
        <li>A <code>stakeholders/</code> folder with one <code>&lt;name&gt;.md</code> file per stakeholder (the recipe will scaffold one if the folder is empty)</li>
      </ul>
    </section>

    <hr class="hairline">

    <section class="detail-section">
      <h2>Step 1 — Drop in the slash command</h2>
      <p>Save this file at <code>~/.claude/commands/stakeholder-update.md</code>:</p>
      <pre class="terminal terminal--file" data-file-path="~/.claude/commands/stakeholder-update.md">
<button class="copy-btn" data-copy-from="next-pre" type="button" aria-label="Copy to clipboard">📋 Copy</button>
<code>---
description: Update stakeholder dashboard from MD files + M365 activity
---

You are building a relationship dashboard for a director who manages a list
of internal and external stakeholders.

PERSISTENT MEMORY
- stakeholders/&lt;name&gt;.md — one file per stakeholder. Sections:
  About, Last Contact, Open Items, Goals, Next Touchpoint.
  These files start light and accumulate over time.

LIVE SIGNAL
- Microsoft 365 connector — emails to/from each stakeholder, calendar invites
  involving them, Teams chats. Default lookback: 14 days.

WHAT TO DO
1. Read every file in stakeholders/. If empty, scaffold one example file
   and ask the user to fill it in.
2. For each stakeholder, query M365 for activity in the lookback window.
3. Cross-reference: which open items match recent messages? Whose
   "Last Contact" is older than the stale threshold (default 30 days)?
4. Write site/index.html — dashboard with:
   - "Needs attention now" (stale + open items)
   - "Recent contacts" (chronological)
   - "Open items grid" (item × stakeholder)
   - "Upcoming touchpoints"
5. AFTER rendering, append a dated observation entry into each stakeholder's
   MD file: e.g. "2026-05-06: 3 emails exchanged, calendar invite for next Tue"
   (under a "Recent activity" section, creating it if missing).

OUTPUT
- site/index.html, site/styles.css (one-time)
- Updated stakeholders/&lt;name&gt;.md files
- A short summary in chat: who needs attention, what was appended.</code></pre>
      <p class="copy-source-link">The version above is the slash command body in compact form. The full recipe with notes and customization knobs lives in <a href="../recipes/stakeholder-update.md">recipes/stakeholder-update.md</a> — when in doubt, copy from there.</p>
    </section>

    <section class="detail-section">
      <h2>Step 2 — Run it</h2>
      <pre class="terminal" data-terminal>
<button class="copy-btn" data-copy="/stakeholder-update" type="button" aria-label="Copy command">📋 Copy</button>
<code><span class="prompt">&gt;</span> <span class="cmd">/stakeholder-update</span>
<span class="output">✓ Read 12 stakeholder files
✓ Fetched M365 activity (last 14 days)
✓ 3 stakeholders flagged stale
✓ 7 open items match recent threads
✓ Wrote site/index.html
✓ Appended activity to 9 MD files</span></code></pre>
    </section>

    <section class="detail-section">
      <h2>Step 3 — See it</h2>
      <pre class="terminal" data-terminal>
<button class="copy-btn" data-copy="open site/index.html" type="button" aria-label="Copy command">📋 Copy</button>
<code><span class="prompt">&gt;</span> <span class="cmd">open site/index.html</span></code></pre>
    </section>

    <hr class="hairline">

    <section class="detail-section">
      <h2>Customize</h2>
      <ul class="needs-list">
        <li><strong>Stale threshold.</strong> Default 30 days; tune in the slash command body.</li>
        <li><strong>Lookback window.</strong> 14 days by default; widen for slower-moving relationships.</li>
        <li><strong>Write-back.</strong> Tweak what observations get appended back into the MD files (or turn it off for read-only mode).</li>
      </ul>
    </section>

    <section class="detail-section">
      <h2>Why directors care</h2>
      <p>Persistent markdown context plus live M365 signal turns relationship management from a memory game into a self-updating system. The MD files are yours forever — even if you stop using the slash command, the record stays.</p>
    </section>

    <nav class="page-footer-nav">
      <a href="personal-secretary.html" data-key-prev>← Personal Secretary</a>
      <a href="team.html" data-key-next>Team Management →</a>
    </nav>
  </main>
```

- [ ] **Step 4: Replace `<main>` content in `demos/team.html`**

```html
  <main class="container detail">
    <header class="detail-header">
      <h1>👥 Team Management</h1>
      <p class="detail-meta">Tools: Claude Code · Microsoft 365 · Node.js</p>
    </header>

    <section class="detail-section">
      <h2>What you'll build</h2>
      <p>The same engine as the stakeholder dashboard, framed for direct reports. Each team member is a markdown file (Role, Goals, Last 1:1, Open Items, Strengths, Growth Areas). A <code>notes/</code> folder holds your 1:1 notes. The slash command reads all of it, pulls fresh M365 activity (1:1 invites, mentions, emails), and renders a team-at-a-glance plus 1:1 prep cards. Like the stakeholder recipe, it writes activity summaries back into each report's MD so the record deepens automatically.</p>
      <div class="preview-frame">
        <img src="../assets/previews/team.svg" alt="Mock preview of the team management dashboard" onerror="this.replaceWith(Object.assign(document.createElement('div'),{textContent:'(preview screenshot — added in Task 8)',className:'preview-placeholder'}));">
      </div>
    </section>

    <hr class="hairline">

    <section class="detail-section">
      <h2>What you'll need</h2>
      <ul class="needs-list">
        <li>Claude Code installed</li>
        <li>The Microsoft 365 connector authenticated</li>
        <li>A <code>team/</code> folder with <code>&lt;name&gt;.md</code> per direct report, plus a <code>notes/</code> folder for 1:1 notes (recipe will scaffold)</li>
      </ul>
    </section>

    <hr class="hairline">

    <section class="detail-section">
      <h2>Step 1 — Drop in the slash command</h2>
      <p>Save this file at <code>~/.claude/commands/team-update.md</code>:</p>
      <pre class="terminal terminal--file" data-file-path="~/.claude/commands/team-update.md">
<button class="copy-btn" data-copy-from="next-pre" type="button" aria-label="Copy to clipboard">📋 Copy</button>
<code>---
description: Update team dashboard from MD files + 1:1 notes + M365 activity
---

You are building a team-management dashboard for a director who manages
direct reports.

PERSISTENT MEMORY
- team/&lt;name&gt;.md — one file per direct report. Sections:
  Role, Goals, Last 1:1, Open Items, Strengths, Growth Areas.
- notes/ — markdown notes from recent 1:1s (filename: YYYY-MM-DD-name.md).
Both compound over time.

LIVE SIGNAL
- Microsoft 365 connector — recent 1:1 invites and acceptance, Teams
  mentions/DMs, emails, calendar density per person.
  Default lookback: 14 days.

WHAT TO DO
1. Read every team/&lt;name&gt;.md. Read every file in notes/.
2. For each direct report, fetch M365 activity in the lookback window.
3. Build the dashboard:
   - Team-at-a-glance (status: on track / needs attention / blocked)
   - 1:1 prep cards (per report: what to revisit since last meeting)
   - Open commitments (who owes whom what, by when)
   - Growth tracker (recent progress against each report's growth areas)
4. AFTER rendering, append a dated activity summary into each report's MD
   under a "Recent activity" section. Examples of what to include:
   "1:1 held 2026-05-04 — discussed onboarding plan", "no DMs in 14 days".
5. Write site/index.html.

OUTPUT
- site/index.html, site/styles.css (one-time)
- Updated team/&lt;name&gt;.md files
- A short summary in chat.</code></pre>
      <p class="copy-source-link">The version above is the slash command body in compact form. The full recipe with notes and customization knobs lives in <a href="../recipes/team-update.md">recipes/team-update.md</a> — when in doubt, copy from there.</p>
    </section>

    <section class="detail-section">
      <h2>Step 2 — Run it</h2>
      <pre class="terminal" data-terminal>
<button class="copy-btn" data-copy="/team-update" type="button" aria-label="Copy command">📋 Copy</button>
<code><span class="prompt">&gt;</span> <span class="cmd">/team-update</span>
<span class="output">✓ Read 6 team files + 14 1:1 notes
✓ Fetched M365 activity (last 14 days)
✓ 1 report flagged blocked (no DMs, missed 1:1)
✓ 5 open commitments due this week
✓ Wrote site/index.html
✓ Appended activity to 6 MD files</span></code></pre>
    </section>

    <section class="detail-section">
      <h2>Step 3 — See it</h2>
      <pre class="terminal" data-terminal>
<button class="copy-btn" data-copy="open site/index.html" type="button" aria-label="Copy command">📋 Copy</button>
<code><span class="prompt">&gt;</span> <span class="cmd">open site/index.html</span></code></pre>
    </section>

    <hr class="hairline">

    <section class="detail-section">
      <h2>Customize</h2>
      <ul class="needs-list">
        <li><strong>Review cadence.</strong> Default expects weekly 1:1s; tune the "stale" rule in the slash command body.</li>
        <li><strong>Lookback window.</strong> 14 days by default — adjust for sparser remote teams.</li>
        <li><strong>Sections written back.</strong> Decide whether to log low-signal activity ("no DMs in N days") or only meaningful events.</li>
      </ul>
    </section>

    <section class="detail-section">
      <h2>Why directors care</h2>
      <p>Walk into 1:1s prepared without re-reading every chat thread. The markdown record of each direct report deepens automatically every time you run it — useful at review time, useful when you transition a report to another manager, useful when memory inevitably fails.</p>
    </section>

    <nav class="page-footer-nav">
      <a href="stakeholders.html" data-key-prev>← Stakeholders</a>
      <a href="../demos.html" data-key-next>Back to demos →</a>
    </nav>
  </main>
```

- [ ] **Step 5: Verify in the browser**

For each of the three pages:
- Open it in the browser
- Confirm the icon, title, and meta line are correct
- Walk through every section — content reads correctly, no missing values
- Click the "View source" link — should land on a 404 for now (recipes are added in Task 7); that's expected
- Click the prev/next links in the footer — they chain correctly across all four detail pages

- [ ] **Step 6: Commit**

```bash
git add demos/personal-secretary.html demos/stakeholders.html demos/team.html
git commit -m "feat: build personal secretary, stakeholders, and team detail pages"
git push
```

---

## Task 6: Wire arrow-key navigation and clipboard-copy buttons

**Files:**
- Modify: `js/main.js`

The navigation links are already wired with `data-key-prev` and `data-key-next` attributes from Task 1 + 4 + 5. This task adds the JS that listens for ← and → keys and triggers those links, plus the click handler for `.copy-btn` elements.

- [ ] **Step 1: Define verification criteria**

1. On any page, pressing `→` (right arrow) navigates to the next page (the link with `data-key-next`).
2. On any page, pressing `←` (left arrow) navigates to the previous page.
3. Arrow keys are ignored when focus is in a text input or a contenteditable element (none on this site, but defensive).
4. Clicking any `.copy-btn` copies the right text:
   - If it has `data-copy="..."`, the literal value is copied.
   - If it has `data-copy-from="next-pre"`, the text content of the next `<pre>` element (excluding the button itself) is copied.
5. After clicking, the copy button briefly shows "✓ Copied" (the `.copied` class is added for ~1.2s).

- [ ] **Step 2: Replace the contents of `js/main.js`**

```javascript
// Wires arrow-key navigation across pages and clipboard-copy buttons.
// Loaded as a module on every page in the site.

const isTextInput = (el) =>
  el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable);

const navigate = (selector) => {
  const link = document.querySelector(selector);
  if (link && link.href) window.location.href = link.href;
};

const onKey = (event) => {
  if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
  if (isTextInput(document.activeElement)) return;
  if (event.key === 'ArrowRight') navigate('[data-key-next]');
  if (event.key === 'ArrowLeft') navigate('[data-key-prev]');
};

document.addEventListener('keydown', onKey);

// ----- Copy buttons -----

const copyTextFromButton = (btn) => {
  if (btn.dataset.copy) return btn.dataset.copy;
  if (btn.dataset.copyFrom === 'next-pre') {
    // The button is inside a <pre>; copy the <pre>'s text content but
    // strip the button's own label.
    const pre = btn.closest('pre');
    if (!pre) return '';
    const clone = pre.cloneNode(true);
    clone.querySelectorAll('.copy-btn').forEach((b) => b.remove());
    return clone.textContent.trim();
  }
  return '';
};

const flashCopied = (btn) => {
  const original = btn.textContent;
  btn.classList.add('copied');
  btn.textContent = '✓ Copied';
  setTimeout(() => {
    btn.classList.remove('copied');
    btn.textContent = original;
  }, 1200);
};

const onCopyClick = async (event) => {
  const btn = event.target.closest('.copy-btn');
  if (!btn) return;
  event.preventDefault();
  const text = copyTextFromButton(btn);
  if (!text) return;
  try {
    await navigator.clipboard.writeText(text);
    flashCopied(btn);
  } catch (err) {
    console.error('Copy failed:', err);
  }
};

document.addEventListener('click', onCopyClick);
```

- [ ] **Step 3: Verify in the browser**

Open `index.html`. Walk through each criterion from Step 1:

1. Press `→`: lands on `demos.html`. From there, `→` lands on `demos/daily-brief.html`. Continue through all four detail pages and back.
2. Press `←` from any page: walks back the chain.
3. Click a Copy button on `demos/daily-brief.html`:
   - The "📋 Copy" button next to the slash command file → the entire file content is copied (paste somewhere to verify).
   - The "📋 Copy" button next to the `> /daily-brief` block → just `/daily-brief` is copied.
4. After clicking, the button briefly shows "✓ Copied" with a green background, then reverts.

Note: `navigator.clipboard.writeText` may require HTTPS or `localhost`. If you're testing via `file://` and clipboard fails, run `python3 -m http.server 8000` from the repo root and visit `http://localhost:8000/`.

- [ ] **Step 4: Commit**

```bash
git add js/main.js
git commit -m "feat: arrow-key nav and clipboard-copy buttons"
git push
```

---

## Task 7: Author the four slash command recipe files

**Files:**
- Create: `recipes/daily-brief.md`
- Create: `recipes/secretary.md`
- Create: `recipes/stakeholder-update.md`
- Create: `recipes/team-update.md`

These are real, runnable Claude Code custom slash command files. The detail pages link to them via the "View source" link.

- [ ] **Step 1: Create `recipes/daily-brief.md`**

```markdown
---
description: Build a daily brief HTML page from RSS sources matched to your interests
---

You are building a daily brief HTML page for a director who wants to start
their day informed about specific topics they care about.

## Persistent inputs (in current working directory)

- `interests.md` — bullet list of topics the user cares about. Free-form.
- `sources.md` — list of RSS feeds, news sitemaps, or plain article URLs.
  One per line. Comments allowed with `#`.

If either file is missing, create a sensible starter with example bullets,
write a one-line note in the chat asking the user to edit it, and stop.

## What to do

1. Read `interests.md` and `sources.md`.
2. For each source, fetch fresh items (last 48 hours preferred). Use the
   WebFetch tool. Be patient; some feeds are slow.
3. For each item, generate a relevance score against the interests file.
   Score from 0 (irrelevant) to 10 (perfect match). Discard anything below 4.
4. Rank surviving items by score. Pick the top 1 as the "top story",
   the next 3-4 as "secondary", and the next 5-7 as "also worth a look".
5. Write `site/index.html`. Layout:
   - Header: "Daily Brief — {today's date}"
   - Top story: large headline, source name, 2-3 sentence summary, link
   - Secondary stories: medium headline, source, 1-2 sentence summary, link
   - Also worth a look: simple list of headlines + source + link
6. Write `site/styles.css` if missing. Use a clean magazine-style design
   — serif headlines, generous whitespace.
7. End with a short chat summary: how many items considered, top stories
   chosen, any sources that failed to fetch.

## Customization knobs

- Edit `interests.md` to change what's surfaced.
- Edit `sources.md` to add/remove feeds.
- Tweak the scoring threshold (currently 4) by editing this command body.
- Add a "personal note" section at the top of `site/index.html` if you want
  a place for human-written framing.

## Notes

- Be honest in chat output if a source fails — name it and continue.
- Don't fabricate items. If nothing scores above the threshold, write a
  brief page saying "slow news day" and list what you considered.
- Re-running the command should overwrite `site/index.html`.
```

- [ ] **Step 2: Create `recipes/secretary.md`**

```markdown
---
description: Build a "Today" page from M365 calendar, email, and Teams activity
---

You are building a daily summary HTML page for a director who wants to walk
into the day with a clear plan.

## Persistent inputs

- `priorities.md` (in cwd) — VIPs (named people whose messages always rise
  to the top), folder names that matter, and what counts as "high priority"
  in this user's role.

If `priorities.md` is missing, create a starter, ask the user to edit, stop.

## Live signal

Use the Microsoft 365 connector:

- Calendar: today's events (subject, start/end, attendees, body, location)
- Email: unread from the last 24 hours
- Teams: @mentions and direct messages from the last 24 hours

## What to do

1. Read `priorities.md`.
2. Fetch today's calendar events.
3. Fetch unread email; group by sender; flag VIPs.
4. Fetch Teams mentions and DMs.
5. For each calendar event, look at recent email/Teams threads with the
   same attendees. Summarize "what's relevant for prep" in 1-2 sentences.
6. Write `site/index.html` with these sections, in this order:
   - **Schedule** — chronological event list. Each event shows: time,
     attendees, subject, your prep notes, a link if there's a meeting URL.
   - **Inbox triage** — VIP emails first, then high-priority by folder,
     then others. Each row: sender, subject, 1-line summary, age.
   - **Decisions needed** — questions awaiting your reply (extracted from
     emails/teams). Each row: who's waiting, what they're asking, age.
   - **Loose ends** — commitments you made (in emails/Teams) but haven't
     closed out. Each row: who you owe, what you said, age.
7. Write `site/styles.css` if missing — clean dashboard look.
8. End with a short chat summary.

## Customization knobs

- Time window: default is your work-hour calendar; widen via `priorities.md`.
- VIPs: listed names always rise to the top of inbox triage.
- Sections: drop or reorder by editing the section list above.

## Notes

- Don't include the body of any email verbatim — summarize.
- If M365 is unauthenticated, prompt the user to authenticate and stop.
- Re-running overwrites `site/index.html`.
```

- [ ] **Step 3: Create `recipes/stakeholder-update.md`**

```markdown
---
description: Update stakeholder dashboard from MD files plus M365 activity, and write observations back to the MD files
---

You are building a relationship dashboard for a director who manages a list
of internal and external stakeholders. The dashboard combines persistent
markdown context with live M365 activity, and writes observations back into
the markdown so the record deepens with every run.

## Persistent memory

`stakeholders/<name>.md` — one file per stakeholder. Each file has these
sections (create them if missing during scaffold):

- **About** — role, organization, how you know them
- **Last Contact** — date and one-line summary
- **Open Items** — bulleted list, each with a date and the item
- **Goals** — what they're trying to accomplish (yours + theirs)
- **Next Touchpoint** — when you plan to reach out next, and why

If the `stakeholders/` folder is empty, scaffold one example file
(`stakeholders/example.md`) with the section template, write a one-line
chat note asking the user to fill it in, and stop.

## Live signal (Microsoft 365 connector)

For each stakeholder (matched by email or name):

- Recent emails to/from them
- Calendar invites involving them
- Teams DMs and group chats

Default lookback: **14 days**. Adjust by editing this body.

## What to do

1. Read every file in `stakeholders/`.
2. For each stakeholder, query M365 for activity in the lookback window.
3. Cross-reference:
   - Which open items match recent thread subjects?
   - Whose `Last Contact` is older than the stale threshold (default 30 days)?
   - Who's been on your calendar this week?
4. Write `site/index.html` — dashboard with these sections:
   - **Needs attention now** — stale + open items + nothing on calendar
   - **Recent contacts** — chronological, last 14 days
   - **Open items grid** — rows are items, columns are stakeholders, cells
     are status (open / closed / in motion)
   - **Upcoming touchpoints** — from each MD's "Next Touchpoint" field
5. Write `site/styles.css` if missing.
6. **Write back to MD.** For each stakeholder with non-zero activity in the
   window, append a dated entry under a "Recent activity" section in their
   MD file. Example:
   ```
   ## Recent activity
   - 2026-05-06: 3 emails exchanged re: Q3 plan; calendar invite for next Tue
   ```
   Create the section if missing. Don't duplicate today's entry on rerun.
7. End with a short chat summary: who needs attention, what was appended.

## Customization knobs

- Stale threshold (default 30 days) — edit in this body.
- Lookback window (default 14 days) — edit in this body.
- MD section template — edit the scaffold above.
- Write-back: comment out step 6 to run read-only.

## Notes

- Match stakeholders by email address when present; fall back to name.
- Don't include private email content in the rendered HTML — summarize.
- If two MD files match the same person (e.g., one personal email, one work),
  treat them as one stakeholder.
- Re-running overwrites `site/index.html` and appends to MDs (idempotent
  per-day).
```

- [ ] **Step 4: Create `recipes/team-update.md`**

```markdown
---
description: Update team dashboard from MD files, 1:1 notes, and M365 activity, and write observations back to MD files
---

You are building a team-management dashboard for a director who manages
direct reports. Same shape as the stakeholder recipe, framed for reports.

## Persistent memory

`team/<name>.md` — one file per direct report. Sections:

- **Role** — title, scope, how long they've been on the team
- **Goals** — current quarter / cycle goals
- **Last 1:1** — date and key topics
- **Open Items** — bulleted, each with a date
- **Strengths** — what they consistently do well
- **Growth Areas** — where they're stretching

`notes/` — markdown files of 1:1 notes. Filename convention:
`YYYY-MM-DD-firstname.md`. Free-form body.

If `team/` is empty, scaffold one example, ask user to fill, stop.

## Live signal (Microsoft 365 connector)

For each report:

- 1:1 invites (held? rescheduled? declined?)
- Teams mentions and DMs
- Emails to/from
- Calendar density (busy day? full of back-to-back?)

Default lookback: **14 days**.

## What to do

1. Read every `team/<name>.md`. Read every file in `notes/`.
2. For each report, fetch M365 activity in the lookback window.
3. Build the dashboard:
   - **Team-at-a-glance** — table with status per report:
     - On track (regular 1:1s, healthy DM volume, goals progressing)
     - Needs attention (slipped 1:1, sparse contact, blocked open items)
     - Blocked (overdue commitments, stale goals)
   - **1:1 prep cards** — one per report. Each card: last 1:1 date, what
     they discussed, what's changed since (from emails / mentions / open
     items), suggested topics for next 1:1.
   - **Open commitments** — who owes whom what, by when, age.
   - **Growth tracker** — for each report, recent progress against their
     listed Growth Areas (extracted from 1:1 notes and M365).
4. **Write back to MD.** Append a dated activity summary into each report's
   MD under "Recent activity". Examples:
   ```
   - 2026-05-06: 1:1 held; discussed onboarding plan
   - 2026-05-06: 0 DMs in 14 days, calendar mostly empty
   ```
   Don't duplicate the same day's entry on rerun.
5. Write `site/index.html` and `site/styles.css` (if missing).
6. End with a short chat summary.

## Customization knobs

- Review cadence (default weekly 1:1s) — edit "stale" rules in this body.
- Lookback window (default 14 days).
- Activity verbosity — choose whether to log low-signal events
  ("no DMs in 14 days") or only meaningful events.

## Notes

- Match reports by email (Microsoft 365 attendee email) or by name.
- Don't include private 1:1 content in the rendered HTML — summarize at
  the level you'd be comfortable showing your peer manager.
- Re-running overwrites `site/index.html` and appends to MDs (idempotent
  per-day).
```

- [ ] **Step 5: Verify**

From each of the four detail pages, click the "View source" link. Each should now load the corresponding `recipes/*.md` file in the browser as raw markdown text (or rendered, depending on your browser).

Verify the file content is what you wrote.

- [ ] **Step 6: Commit**

```bash
git add recipes/
git commit -m "feat: add four slash command recipes (the take-home deliverable)"
git push
```

---

## Task 8: Mock preview SVGs and Nelnet wordmark

**Files:**
- Create: `assets/nelnet-wordmark.svg`
- Create: `assets/previews/daily-brief.svg`
- Create: `assets/previews/personal-secretary.svg`
- Create: `assets/previews/stakeholders.svg`
- Create: `assets/previews/team.svg`

The HTML pages already reference these assets and gracefully fall back to text if missing. This task adds the actual SVGs.

- [ ] **Step 1: Create `assets/nelnet-wordmark.svg`**

A simple text-based wordmark. Hunter can swap in the real Nelnet logo later if available.

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 28" role="img" aria-label="Nelnet">
  <text x="0" y="20" font-family="'Source Serif 4', Georgia, serif" font-size="20" font-weight="700" fill="#11891C">Nelnet</text>
  <text x="78" y="20" font-family="'Inter', sans-serif" font-size="13" font-weight="500" fill="#64748b">· NFS</text>
</svg>
```

- [ ] **Step 2: Create `assets/previews/daily-brief.svg` (magazine layout mock)**

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 360" role="img" aria-label="Daily Brief preview">
  <rect width="600" height="360" fill="#FAF7F2" rx="8"/>
  <text x="32" y="40" font-family="'Source Serif 4', Georgia, serif" font-size="22" font-weight="700" fill="#0f172a">Daily Brief — May 6, 2026</text>
  <line x1="32" y1="56" x2="568" y2="56" stroke="#e2e8f0"/>

  <!-- Top story -->
  <text x="32" y="92" font-family="'Source Serif 4', serif" font-size="18" font-weight="700" fill="#11891C">Top Story</text>
  <rect x="32" y="104" width="320" height="100" fill="#fff" stroke="#e2e8f0" rx="4"/>
  <text x="44" y="128" font-family="'Source Serif 4', serif" font-size="15" font-weight="700" fill="#0f172a">How loan servicers are using AI in 2026</text>
  <text x="44" y="148" font-family="'Inter', sans-serif" font-size="11" fill="#64748b">Reuters · 4h ago</text>
  <text x="44" y="170" font-family="'Inter', sans-serif" font-size="11" fill="#334155">A look at how three major servicers</text>
  <text x="44" y="184" font-family="'Inter', sans-serif" font-size="11" fill="#334155">are deploying LLMs in customer ops…</text>

  <!-- Secondary -->
  <text x="372" y="92" font-family="'Source Serif 4', serif" font-size="14" font-weight="700" fill="#11891C">Secondary</text>
  <rect x="372" y="104" width="196" height="44" fill="#fff" stroke="#e2e8f0" rx="4"/>
  <text x="380" y="124" font-family="'Source Serif 4', serif" font-size="11" font-weight="700" fill="#0f172a">CFPB issues new guidance…</text>
  <text x="380" y="138" font-family="'Inter', sans-serif" font-size="9" fill="#64748b">CFPB.gov · 7h</text>
  <rect x="372" y="156" width="196" height="44" fill="#fff" stroke="#e2e8f0" rx="4"/>
  <text x="380" y="176" font-family="'Source Serif 4', serif" font-size="11" font-weight="700" fill="#0f172a">Banking quarterly earnings preview</text>
  <text x="380" y="190" font-family="'Inter', sans-serif" font-size="9" fill="#64748b">WSJ · 1d</text>
  <rect x="372" y="208" width="196" height="44" fill="#fff" stroke="#e2e8f0" rx="4"/>
  <text x="380" y="228" font-family="'Source Serif 4', serif" font-size="11" font-weight="700" fill="#0f172a">Student loan forgiveness ruling</text>
  <text x="380" y="242" font-family="'Inter', sans-serif" font-size="9" fill="#64748b">NYT · 1d</text>

  <!-- Also worth a look -->
  <text x="32" y="240" font-family="'Source Serif 4', serif" font-size="14" font-weight="700" fill="#11891C">Also worth a look</text>
  <text x="32" y="262" font-family="'Inter', sans-serif" font-size="11" fill="#334155">→ Treasury yields tick up on Fed signal</text>
  <text x="32" y="282" font-family="'Inter', sans-serif" font-size="11" fill="#334155">→ Three fintechs raise Series B</text>
  <text x="32" y="302" font-family="'Inter', sans-serif" font-size="11" fill="#334155">→ New IRS rules for refinanced loans</text>

  <!-- Coral footer accent -->
  <rect x="0" y="354" width="600" height="6" fill="#D97757"/>
</svg>
```

- [ ] **Step 3: Create `assets/previews/personal-secretary.svg` (Today page mock)**

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 360" role="img" aria-label="Personal Secretary preview">
  <rect width="600" height="360" fill="#f8fafc" rx="8"/>
  <text x="32" y="40" font-family="'Source Serif 4', Georgia, serif" font-size="22" font-weight="700" fill="#0f172a">Today — Tuesday, May 6</text>

  <!-- Schedule -->
  <text x="32" y="80" font-family="'Source Serif 4', serif" font-size="14" font-weight="700" fill="#11891C">Schedule</text>
  <rect x="32" y="92" width="260" height="44" fill="#fff" stroke="#e2e8f0" rx="4"/>
  <text x="44" y="112" font-family="'Inter', sans-serif" font-size="11" font-weight="600" fill="#0f172a">9:00 — Director sync</text>
  <text x="44" y="128" font-family="'Inter', sans-serif" font-size="10" fill="#64748b">5 attendees · prep: Q3 plan</text>
  <rect x="32" y="144" width="260" height="44" fill="#fff" stroke="#e2e8f0" rx="4"/>
  <text x="44" y="164" font-family="'Inter', sans-serif" font-size="11" font-weight="600" fill="#0f172a">10:30 — 1:1 with Sara</text>
  <text x="44" y="180" font-family="'Inter', sans-serif" font-size="10" fill="#64748b">prep: onboarding update</text>
  <rect x="32" y="196" width="260" height="44" fill="#fff" stroke="#e2e8f0" rx="4"/>
  <text x="44" y="216" font-family="'Inter', sans-serif" font-size="11" font-weight="600" fill="#0f172a">2:00 — Vendor review</text>
  <text x="44" y="232" font-family="'Inter', sans-serif" font-size="10" fill="#64748b">prep: contract amendments</text>

  <!-- Inbox triage / Decisions -->
  <text x="312" y="80" font-family="'Source Serif 4', serif" font-size="14" font-weight="700" fill="#11891C">Inbox triage</text>
  <rect x="312" y="92" width="256" height="36" fill="#fff" stroke="#D97757" stroke-width="1.5" rx="4"/>
  <text x="320" y="112" font-family="'Inter', sans-serif" font-size="11" font-weight="600" fill="#0f172a">VIP · CFO re: Q2 budget</text>
  <text x="320" y="124" font-family="'Inter', sans-serif" font-size="9" fill="#64748b">awaiting your reply · 4h</text>
  <rect x="312" y="136" width="256" height="36" fill="#fff" stroke="#e2e8f0" rx="4"/>
  <text x="320" y="156" font-family="'Inter', sans-serif" font-size="11" font-weight="600" fill="#0f172a">Marcus · vendor proposal</text>
  <text x="320" y="168" font-family="'Inter', sans-serif" font-size="9" fill="#64748b">FYI · 1d</text>

  <text x="312" y="200" font-family="'Source Serif 4', serif" font-size="14" font-weight="700" fill="#11891C">Decisions needed</text>
  <text x="312" y="220" font-family="'Inter', sans-serif" font-size="11" fill="#334155">→ Approve hire for senior PM role</text>
  <text x="312" y="236" font-family="'Inter', sans-serif" font-size="11" fill="#334155">→ Sign off on incident report</text>

  <rect x="0" y="354" width="600" height="6" fill="#D97757"/>
</svg>
```

- [ ] **Step 4: Create `assets/previews/stakeholders.svg` (dashboard mock)**

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 360" role="img" aria-label="Stakeholder dashboard preview">
  <rect width="600" height="360" fill="#f8fafc" rx="8"/>
  <text x="32" y="40" font-family="'Source Serif 4', Georgia, serif" font-size="22" font-weight="700" fill="#0f172a">Stakeholder Dashboard</text>

  <text x="32" y="76" font-family="'Source Serif 4', serif" font-size="13" font-weight="700" fill="#D97757">Needs attention now</text>
  <rect x="32" y="86" width="170" height="60" fill="#fff" stroke="#e2e8f0" rx="4"/>
  <text x="42" y="106" font-family="'Inter', sans-serif" font-size="11" font-weight="600" fill="#0f172a">Jane Park · 38d stale</text>
  <text x="42" y="122" font-family="'Inter', sans-serif" font-size="10" fill="#64748b">2 open items</text>
  <text x="42" y="138" font-family="'Inter', sans-serif" font-size="10" fill="#64748b">Last: Q1 review</text>

  <rect x="212" y="86" width="170" height="60" fill="#fff" stroke="#e2e8f0" rx="4"/>
  <text x="222" y="106" font-family="'Inter', sans-serif" font-size="11" font-weight="600" fill="#0f172a">Marcus Lee · 45d stale</text>
  <text x="222" y="122" font-family="'Inter', sans-serif" font-size="10" fill="#64748b">1 open item</text>
  <text x="222" y="138" font-family="'Inter', sans-serif" font-size="10" fill="#64748b">Last: Vendor intro</text>

  <rect x="392" y="86" width="170" height="60" fill="#fff" stroke="#e2e8f0" rx="4"/>
  <text x="402" y="106" font-family="'Inter', sans-serif" font-size="11" font-weight="600" fill="#0f172a">Priya Shah · 51d stale</text>
  <text x="402" y="122" font-family="'Inter', sans-serif" font-size="10" fill="#64748b">3 open items</text>
  <text x="402" y="138" font-family="'Inter', sans-serif" font-size="10" fill="#64748b">Last: Compliance sync</text>

  <text x="32" y="180" font-family="'Source Serif 4', serif" font-size="13" font-weight="700" fill="#11891C">Recent contacts (14d)</text>
  <rect x="32" y="190" width="536" height="22" fill="#fff" stroke="#e2e8f0" rx="3"/>
  <text x="42" y="206" font-family="'Inter', sans-serif" font-size="10" fill="#334155">May 4 · Avery Chen · 2 emails · re: budget alignment</text>
  <rect x="32" y="214" width="536" height="22" fill="#fff" stroke="#e2e8f0" rx="3"/>
  <text x="42" y="230" font-family="'Inter', sans-serif" font-size="10" fill="#334155">May 3 · Jordan Mills · calendar invite · re: Q3 planning</text>
  <rect x="32" y="238" width="536" height="22" fill="#fff" stroke="#e2e8f0" rx="3"/>
  <text x="42" y="254" font-family="'Inter', sans-serif" font-size="10" fill="#334155">May 2 · Sara Patel · Teams DM · re: onboarding plan</text>

  <text x="32" y="290" font-family="'Source Serif 4', serif" font-size="13" font-weight="700" fill="#11891C">Open items grid</text>
  <rect x="32" y="300" width="536" height="40" fill="#fff" stroke="#e2e8f0" rx="3"/>
  <text x="42" y="316" font-family="'JetBrains Mono', monospace" font-size="9" fill="#64748b">Item                    Jane    Marcus    Avery    Priya</text>
  <text x="42" y="332" font-family="'JetBrains Mono', monospace" font-size="9" fill="#334155">Q3 plan sign-off        ●       ○         ●        ○</text>

  <rect x="0" y="354" width="600" height="6" fill="#D97757"/>
</svg>
```

- [ ] **Step 5: Create `assets/previews/team.svg` (team dashboard mock)**

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 360" role="img" aria-label="Team dashboard preview">
  <rect width="600" height="360" fill="#f8fafc" rx="8"/>
  <text x="32" y="40" font-family="'Source Serif 4', Georgia, serif" font-size="22" font-weight="700" fill="#0f172a">Team Dashboard</text>

  <text x="32" y="76" font-family="'Source Serif 4', serif" font-size="13" font-weight="700" fill="#11891C">Team at a glance</text>
  <rect x="32" y="86" width="536" height="22" fill="#fff" stroke="#e2e8f0" rx="3"/>
  <text x="42" y="102" font-family="'Inter', sans-serif" font-size="10" font-weight="600" fill="#334155">Sara Patel</text>
  <text x="200" y="102" font-family="'Inter', sans-serif" font-size="10" fill="#11891C">● on track</text>
  <text x="320" y="102" font-family="'Inter', sans-serif" font-size="10" fill="#64748b">last 1:1 May 4</text>

  <rect x="32" y="110" width="536" height="22" fill="#fff" stroke="#e2e8f0" rx="3"/>
  <text x="42" y="126" font-family="'Inter', sans-serif" font-size="10" font-weight="600" fill="#334155">Marcus Lee</text>
  <text x="200" y="126" font-family="'Inter', sans-serif" font-size="10" fill="#D97757">● needs attention</text>
  <text x="320" y="126" font-family="'Inter', sans-serif" font-size="10" fill="#64748b">last 1:1 Apr 22</text>

  <rect x="32" y="134" width="536" height="22" fill="#fff" stroke="#e2e8f0" rx="3"/>
  <text x="42" y="150" font-family="'Inter', sans-serif" font-size="10" font-weight="600" fill="#334155">Avery Chen</text>
  <text x="200" y="150" font-family="'Inter', sans-serif" font-size="10" fill="#11891C">● on track</text>
  <text x="320" y="150" font-family="'Inter', sans-serif" font-size="10" fill="#64748b">last 1:1 May 5</text>

  <rect x="32" y="158" width="536" height="22" fill="#fff" stroke="#e2e8f0" rx="3"/>
  <text x="42" y="174" font-family="'Inter', sans-serif" font-size="10" font-weight="600" fill="#334155">Priya Shah</text>
  <text x="200" y="174" font-family="'Inter', sans-serif" font-size="10" fill="#ef4444">● blocked</text>
  <text x="320" y="174" font-family="'Inter', sans-serif" font-size="10" fill="#64748b">no DMs in 14d</text>

  <text x="32" y="220" font-family="'Source Serif 4', serif" font-size="13" font-weight="700" fill="#11891C">1:1 prep — Marcus Lee</text>
  <rect x="32" y="230" width="536" height="100" fill="#fff" stroke="#e2e8f0" rx="4"/>
  <text x="42" y="248" font-family="'Inter', sans-serif" font-size="10" fill="#64748b">Last 1:1: Apr 22 · discussed scope creep on Project X</text>
  <text x="42" y="266" font-family="'Inter', sans-serif" font-size="10" font-weight="600" fill="#334155">What's changed:</text>
  <text x="42" y="282" font-family="'Inter', sans-serif" font-size="10" fill="#334155">→ shipped 2 PRs to Project X (Apr 28, May 3)</text>
  <text x="42" y="298" font-family="'Inter', sans-serif" font-size="10" fill="#334155">→ flagged blocker re: API access in Teams (May 1)</text>
  <text x="42" y="314" font-family="'Inter', sans-serif" font-size="10" fill="#334155">→ 0 mentions in #design channel since last 1:1</text>

  <rect x="0" y="354" width="600" height="6" fill="#D97757"/>
</svg>
```

- [ ] **Step 6: Verify in the browser**

Open `index.html`. The top bar should now show a styled "Nelnet · NFS" wordmark from the SVG.

Open each detail page. The preview frame should now show the corresponding mock SVG (no more "(preview screenshot — added in Task 8)" text).

- [ ] **Step 7: Commit**

```bash
git add assets/
git commit -m "feat: add Nelnet wordmark and four mock preview SVGs"
git push
```

---

## Task 9: Final smoke check + GitHub Pages verification

**Files:** None modified (verification only).

- [ ] **Step 1: Local smoke check from a fresh server**

Run a local HTTP server to test the site exactly as GitHub Pages will serve it:

```bash
python3 -m http.server 8000
```

Open http://localhost:8000/ and walk through the entire site:

1. ✅ Landing page renders correctly with the split hero
2. ✅ Click "See the demos →" → lands on `demos.html`
3. ✅ Each card hovers correctly (lifts, accent line widens)
4. ✅ Click each card → lands on its detail page
5. ✅ On each detail page:
   - All sections render
   - Preview SVG is visible
   - Each Copy button copies the right thing (paste in a text editor to verify)
   - "View source" link opens the corresponding `recipes/*.md`
6. ✅ Arrow keys (← →) navigate forward and back across all six pages
7. ✅ Resize the browser to mobile width — split hero stacks, cards become single column

Stop the server with Ctrl+C.

- [ ] **Step 2: Verify GitHub Pages build**

Wait ~1-2 minutes after the last push for GitHub Pages to rebuild, then check the live URL:

```bash
gh api /repos/hunterrdunlap/claude-code-director-demos/pages | grep -E '"status"|"html_url"'
```

Expected: `"status":"built"` and the html_url printed.

Open https://hunterrdunlap.github.io/claude-code-director-demos/ and walk through the same smoke check from Step 1.

- [ ] **Step 3: Final visual polish pass**

Things to check that are easy to miss:
- All four detail pages have working Copy buttons on every code block
- The Source Serif 4 / Inter / JetBrains Mono fonts all loaded (no system-font fallback)
- Focus rings appear when tabbing through links and buttons (keyboard accessibility)
- The Nelnet wordmark appears in every page's top bar

Fix anything that looks off. If you make changes, commit them with a clear message:

```bash
git add <files>
git commit -m "fix: <specific issue>"
git push
```

- [ ] **Step 4: No commit if nothing changed**

If the smoke check passed clean, this task is done with no commit.

---

## Self-review (already performed)

**Spec coverage:** Every spec section maps to a task — visual system → Task 1 (CSS tokens) + 2/3/4 (components); page layouts → Tasks 2/3/4/5; recipes → Task 7; tech & repo layout → Tasks 1 + 9; presentation flow is presentation-time, not implementation.

**Placeholder scan:** Clean — no TBDs, no "implement later", no "similar to Task N" without code.

**Type/name consistency:** File paths match across all tasks. Slash command names match (`/daily-brief`, `/secretary`, `/stakeholder-update`, `/team-update`). Recipe filenames match (`daily-brief.md`, `secretary.md`, `stakeholder-update.md`, `team-update.md`). CSS class names consistent across files (`.split-hero`, `.card`, `.terminal`, `.copy-btn`).

**Open spec questions covered:** "Logo asset" → Task 8 ships a text-wordmark SVG with a note Hunter can swap in a real logo. "Preview screenshots" → Task 8 hand-authors mock SVGs.
