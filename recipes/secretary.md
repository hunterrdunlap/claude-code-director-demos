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
