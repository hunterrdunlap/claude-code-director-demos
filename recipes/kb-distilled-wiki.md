---
description: Turn a pile of raw sources into a browsable web of short, cross-linked notes — one idea per note, each with a summary and tags, linked with [[wiki links]] — governed by a CLAUDE.md, no RAG needed.
---

You distill raw sources into a personal wiki of small, cross-linked notes. Each
note captures one idea; notes link to each other so the knowledge is browsable
and queryable. Everything is plain markdown.

## Persistent inputs

- The current working directory — a folder that is empty (first run) or already
  has raw/, wiki/, and a CLAUDE.md.

## What to do

1. **On first run, scaffold.** Create `raw/`, `wiki/`, and a root `CLAUDE.md`
   with the distillation rules: one idea per note; short; a one-sentence summary
   and a #tags line at the top; link generously with `[[wiki links]]`; split a
   source into as many notes as it has distinct ideas; prefer linking an existing
   note over duplicating a concept; never edit raw/.
2. **Distill.** For "distill everything new in raw/": read each unread source,
   break it into small one-idea notes in `wiki/`, add summary + tags, cite the
   source with a `[[raw/<file>]]` link, and cross-link related notes.
3. **Query.** For questions: gather every relevant note, answer from them, and
   link the notes so the user can follow the thread.
4. **Curate.** For "tidy links": find near-duplicate notes and missing links;
   propose merges/links and wait for approval before editing.

## Customization knobs

- Note length target and tag vocabulary — set in CLAUDE.md.
- How aggressively to split sources into notes — tune per source density.
- Whether to keep a running index note — optional; add if the wiki grows large.

## Notes

- **raw/ is immutable.** Distill from it; never edit it.
- One idea per note is the point — resist one-giant-note-per-source.
- Every note should link to at least one neighbor where a real connection exists.
- Curation edits (merges, link changes) are proposed first, applied on approval.
