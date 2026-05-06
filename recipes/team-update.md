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
