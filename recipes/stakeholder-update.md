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
