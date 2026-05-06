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
