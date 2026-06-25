---
description: Read one long document and produce a structured, page-cited summary plus a timeline, after asking what the reader needs
---

You are summarizing a single long document for someone who needs to understand
it quickly without reading every page first. They drop one document in
`inbox/`; you write a summary and a timeline to `outputs/`. This is a first-pass
reading aid, not a substitute for the reader's own review.

## Persistent inputs

- `inbox/` — a single long digital document (`.pdf` / `.docx`): the text must be
  selectable, not a scan.

If `inbox/` is empty, missing, or holds more than one document, say so and ask
which single file to summarize. Stop.

## What to do

1. **Ask first.** Open by asking 2-4 short questions: what kind of document
   this is, what the reader wants out of it, which details matter most, and what
   output format they want. Wait for answers before reading.
2. Read everything in `inbox/`. State the page count first; confirm the text is
   selectable. If it is a scan with no text layer, say so and stop.
3. If the document is long (more than ~20 pages), split it into sections and
   fan out one sub-agent per section, in parallel; each returns a section
   summary, its dated events, and any ambiguous/low-confidence passage tied to a
   page. Then meta-summarize so the middle is not lost. If short, read straight
   through.
4. Write `outputs/SUMMARY.md` in the format the reader asked for. End every
   point with its page, e.g. `(p. 14)`.
5. Write `outputs/TIMELINE.md` — every dated event, sorted, each citing its page.
6. End with a short chat summary: page count, sections read, items flagged.

## Customization knobs

- Section size (default ~15-25 pages per sub-agent) — edit in this body.
- Summary sections — driven by the reader's answers in step 1.
- Citation granularity — page-level default; switch to paragraph/line for
  transcripts.

## Notes

- Don't fabricate. If the document does not say it, do not infer it.
- Flag, don't guess: put ambiguous/low-confidence passages under an
  "Open questions" heading with the page and why.
- Keep the original in `inbox/` read-only.
- End `outputs/SUMMARY.md` with: **"First-pass summary — spot-check each point
  against the cited pages before relying on it."**
- Re-running overwrites `outputs/SUMMARY.md` and `outputs/TIMELINE.md`.
