---
description: Draft legal work-product (chronology, issue summary, demand-letter draft) from an organized/ case file's index, citing source documents — attorney review required
---

You are drafting a piece of legal work-product for an attorney from a case file
that has already been organized by the `organize-for-me` skill. You work from
the index it produced — the manifest, the per-document summaries, and
`TIMELINE.md` — and only open original documents when you need to confirm a
specific quote or figure. The draft is a starting point for the attorney, never
a final or filed document.

## Persistent inputs

- `organized/` — the output of the organize-case-file recipe, containing
  `README.md` (case snapshot + manifest), `TIMELINE.md`, the numbered taxonomy
  folders, and each folder's `_README.md`.

If `organized/` or its `README.md` / `TIMELINE.md` is missing, say so and tell
the attorney to run the organize-case-file recipe first, then stop.

## What to do

1. Ask the attorney **what to draft** if they have not said: a chronology, an
   issue/dispute summary, a demand-letter draft, a fact section, or a document
   request. If the request is ambiguous, ask one or two follow-up questions
   rather than guessing.
2. Read the index first: `organized/README.md` (manifest + snapshot) and
   `organized/TIMELINE.md`. Treat these as the map of the case.
3. **Fan out sub-agents to gather support, in parallel** — one per theme the
   draft needs (e.g. payment history, dispute and credit-reporting events,
   communications, account identifiers). Each sub-agent reads only the relevant
   folder's `_README.md` and the specific source documents it points to, and
   returns the facts, dates, and short quotes for its theme — each tied to a
   source filename. Because the index already says where everything is, the
   sub-agents go straight to the right documents instead of re-reading the
   whole file.
4. Assemble the draft into `drafts/<what-you-asked-for>.md`. Every factual
   statement cites its source document (the organized filename), e.g.
   `(03-Disputes-and-Credit-Reporting/2025-02-14 ACDV Response.pdf)`.
5. End with a short chat summary: what you drafted, which documents it draws on,
   and a list of anything you could not support from the file.

## Customization knobs

- Output type and template — edit the section outline for the document you are
  drafting (chronology vs. demand letter vs. issue summary).
- Themes to fan out — add or remove the topics sub-agents gather, to match the
  matter.
- Citation style — organized-filename by default; switch to Bates numbers if
  the file uses them.

## Notes

- **Draft from the file, not from memory.** Every factual claim must trace to a
  document in `organized/`. If the file does not support a statement, leave it
  out and list it as a gap.
- **Don't fabricate** dates, quotes, parties, or figures. When a sub-agent
  cannot confirm something, the draft says so rather than guessing.
- Verify any quote or figure against the cited source before relying on it.
- The index summarizes each document — a very long source file may have been
  read only in part — so for any document a draft leans on heavily, open the
  full source and confirm.
- The originals in `organized/` are read-only; this recipe only writes under
  `drafts/`.
- End every draft with: **"DRAFT — attorney review required. Verify all facts
  and citations against the source documents before any use or filing."**
- Re-running overwrites the file in `drafts/`.
