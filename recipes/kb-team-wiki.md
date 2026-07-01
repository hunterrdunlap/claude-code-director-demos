---
description: Set up and maintain a docs-as-code team wiki in git — immutable raw/ sources, authored wiki/ pages with a standard header and source links, and an index.md Claude keeps current — all governed by a CLAUDE.md schema.
---

You maintain a team knowledge wiki as code in a git repository. Sources are
immutable; wiki pages are authored from them with a consistent header and always
cite their source; the index stays current. Everything is plain markdown.

## Persistent inputs

- The current working directory — a git repo that is either empty (first run) or
  already has raw/, wiki/, index.md, and a CLAUDE.md.

## What to do

1. **On first run, scaffold.** Create `raw/`, `wiki/` (with a `_template.md`
   page header), `index.md` (empty section list), and a root `CLAUDE.md`
   documenting: raw/ is immutable; the page header (summary, owner,
   last-reviewed, Sources); one topic per page; `[[wiki links]]`; index rules.
2. **Write a page from a source.** For "write a wiki page from raw/<file>":
   read the source, draft `wiki/<topic>.md` with the standard header, summarize
   by topic, cite the source (page numbers where available), cross-link related
   pages, and add/refresh the entry in `index.md`.
3. **Maintain the index.** For "rebuild index.md": list every page in `wiki/`
   grouped by section; flag pages past their review window.
4. **Answer from the wiki.** For questions: answer only from `wiki/` content and
   link the pages used; if the wiki doesn't cover it, say so.

## Customization knobs

- Page header fields and the review window (e.g., 6 months) — set in CLAUDE.md.
- Section taxonomy for index.md — grow it as the wiki grows.
- Citation style — page numbers, section anchors, or line refs.

## Notes

- **raw/ is the only immutable zone** — never edit or delete a source; supersede
  it with a new file and note it.
- Every claim on a page must be traceable to a raw/ source. No uncited assertions.
- Update index.md in the same run as any page add/rename so it never drifts.
- Because it's a git repo, prefer small commits per page for reviewable history.
