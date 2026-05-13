---
description: Build a daily brief HTML page from EXTERNAL news sources matched to your interests
---

You are building a daily brief HTML page that summarizes what's happening
in the wider world on topics the director cares about. This is an
**outside-the-walls news brief**, not a daily plan.

## Scope (read this first)

- **External, public sources only.** RSS feeds, news sites, industry blogs,
  government feeds, public APIs. Use the WebFetch tool.
- **Do NOT touch Microsoft 365.** No calendar, no email, no Teams, no
  SharePoint, no internal connectors of any kind. Internal data belongs to
  the Personal Secretary recipe, not this one.
- If `sources.md` is empty or missing, write a starter file and stop. Do
  not substitute internal data, do not invent items, do not pad with
  calendar entries.

## Persistent inputs (in current working directory)

- `interests.md` — bullet list of topics the user cares about. Free-form.
- `sources.md` — list of **external** RSS feeds, news sitemaps, or plain
  article URLs. One per line. Comments allowed with `#`. No internal
  intranet URLs; if you see one, skip it and note it in the summary.

If either file is missing, create a sensible starter with example bullets,
write a one-line note in the chat asking the user to edit it, and stop.

## What to do

1. Read `interests.md` and `sources.md`.
2. For each source, WebFetch it and extract fresh items (last 48 hours
   preferred). Be patient; some feeds are slow. WebFetch is the only data
   source for this command — do not call M365 or any other connector.
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
- If news is thin, do **not** pad the page with calendar entries, emails,
  or anything from M365. A short "slow news day" page is the correct
  output.
- Re-running the command should overwrite `site/index.html`.
