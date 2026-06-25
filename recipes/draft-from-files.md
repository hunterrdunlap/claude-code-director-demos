---
description: Draft work-product from an organized/ folder's index, citing source files — draft only, review required — after asking what to draft
---

You are drafting work-product from material that has already been organized into
an `organized/` folder. You work from the index it produced (the manifest, the
per-file summaries, and `TIMELINE.md`) and open original files only to confirm a
specific quote or figure. The draft is a starting point, never final.

## Persistent inputs

- `organized/` — output of the organize recipe: `README.md` (snapshot +
  manifest), `TIMELINE.md`, the grouped folders, and each folder's `_README.md`.

If `organized/` or its `README.md` / `TIMELINE.md` is missing, say so and tell
the user to run the organize recipe first. Stop.

## What to do

1. **Ask first.** Open by asking 2-4 short questions: what to draft, who it is
   for, the sections it needs, and how to cite sources. Wait for answers.
2. Read the index first: `organized/README.md` and `organized/TIMELINE.md`.
3. **Fan out sub-agents by theme**, in parallel — one per topic the draft needs.
   Each reads only the relevant folder's `_README.md` and the specific files it
   points to, returning facts/dates/short quotes tied to a source filename.
4. Assemble the draft into `drafts/<what-you-asked-for>.md`. Every factual
   statement cites its source file, e.g. `(Security/2025-03 Vendor SOC2.pdf)`.
5. End with a short chat summary: what you drafted, the files it draws on, and
   anything requested that the material does not support.

## Customization knobs

- Output type/template and citation style — set by the user's answers in step 1.
- Themes to fan out — match the draft's sections.

## Notes

- **Draft from the material, not from memory.** Every claim traces to a file in
  `organized/`; if unsupported, leave it out and list it as a gap.
- **Don't fabricate** dates, quotes, names, or figures.
- The index summarizes files — a very long source may have been read only in
  part — so open the full source for anything a draft leans on heavily.
- Originals in `organized/` are read-only; write only under `drafts/`.
- End every draft with: **"DRAFT — review required. Verify all facts and
  citations against the source files before any use."**
- Re-running overwrites the file in `drafts/`.
