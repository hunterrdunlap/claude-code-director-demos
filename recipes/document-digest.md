---
description: Read one long legal document and produce a page-cited digest plus a chronology, flagging anything that needs a human
---

You are building a structured digest of a single long legal document for an
attorney who needs to understand it quickly without reading every page first.
The attorney drops one document in `inbox/`; you write a digest and a timeline
to `outputs/`. This is a first-pass reading aid, **not** legal advice and not a
substitute for the attorney's own review.

## Persistent inputs

- `inbox/` — a single long digital document: a contract, deposition
  transcript, brief, or regulatory filing, as a digital PDF or Word file
  (`.pdf` / `.docx`). "Digital" means the text is selectable, not a scan.

If `inbox/` is empty, missing, or holds more than one document, say so in chat,
ask the attorney which single file to digest, and stop. Do not guess.

## What to do

1. Read everything in `inbox/`. State the page count first, and confirm the
   text is selectable. If it looks like a scanned image with no text layer,
   say so and stop — flag it for OCR rather than guessing at the contents.
2. **For a long document, fan out sub-agents.** Split the document into
   sections (by heading, article, or ~15-25 page chunks). Dispatch one
   sub-agent per section, in parallel, each returning: a section summary, the
   dated events it contains, and any clause or passage that is unusual,
   ambiguous, or low-confidence — each tied to the page it came from. Then make
   a second pass over the section summaries (meta-summarization) so nothing in
   the middle is lost. Reading the whole thing in a single pass risks dropping
   the middle; the fan-out does not.
3. Synthesize one digest. Write `outputs/DIGEST.md` with these sections:
   - **Document & parties** — what it is, who the parties are, effective date.
   - **Key terms & obligations** — who must do what, by when.
   - **Deadlines & dates** — every date that carries a consequence.
   - **Risks & unusual clauses** — anything one-sided, non-standard, or
     surprising.
   - **Open questions** — what a human needs to resolve or look at next.
   End every bullet with a page cite, e.g. `(p. 14)`. If a claim spans pages,
   cite the range.
4. Write `outputs/TIMELINE.md` — every dated event from the document, sorted
   chronologically, each line citing its page.
5. End with a short chat summary: page count, how many sections you read, and
   the count of items flagged for attorney review.

## Customization knobs

- Section size (default ~15-25 pages or one heading per sub-agent) — edit in
  this body for denser or lighter documents.
- Digest sections — add or drop sections to match the document type (e.g. a
  "Damages" section for a complaint).
- Citation granularity — page-level by default; switch to paragraph or line
  numbers for transcripts.

## Notes

- **Don't fabricate.** If the document does not say something, do not infer it.
- **Flag, don't guess.** When a passage is ambiguous or you are low-confidence,
  add it to "Open questions" with its page and say why — never paper over it.
- Quote sparingly and only to anchor a point; summarize in plain language
  otherwise.
- Keep the original in `inbox/` read-only — never modify or move it.
- End `outputs/DIGEST.md` with the line: **"Attorney review required before any
  external use. Verify every citation against the source document."**
- Re-running overwrites `outputs/DIGEST.md` and `outputs/TIMELINE.md`.
