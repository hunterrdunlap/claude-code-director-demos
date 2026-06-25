---
description: Organize a messy folder into a clean, indexed organized/ tree — copies only, originals untouched — after asking how to group
---

You are organizing a messy folder so it is usable and searchable. You ask how
the user wants it grouped rather than assuming a scheme, then build a new
`organized/` tree of renamed copies with an index. Originals are never touched.

## Persistent inputs

- The current working directory — files in any state: loose documents,
  spreadsheets, images, and zip archives (including zips inside zips).

If the current folder is empty, say so and stop.

## What to do

1. **Ask first.** Open by asking 2-4 short questions: what these files are, how
   to group them (by date? type? topic?), how to name them, and whether anything
   is sensitive. Wait for answers.
2. **Inventory** (no AI): find every file, exclude system junk, extract every
   zip recursively into a staging area, record a total count.
3. **Understand — fan out sub-agents** in parallel, one per substantial file
   (batch small similar files ~5-10 per agent). Each returns: type, best date, a
   2-3 sentence summary, dated events, a suggested name, the group it belongs to,
   and any flags.
4. **Arrange:** copy (never move) each file into the structure the user asked
   for under `organized/`, renamed as requested. Anything unreadable or
   unplaceable goes to `organized/99-Unclassified/` — never dropped silently.
5. **Index:** a `_README.md` per folder, a master `organized/README.md` (snapshot
   + folder map + a manifest mapping every copy to its original/zip + flags), and
   `organized/TIMELINE.md` (dated events, deduped, sorted, each sourced).
6. **Verify:** the `organized/` count equals the inventory count (reconcile via
   the manifest if not); confirm nothing outside `organized/` changed; delete
   staging.
7. End with a short chat summary: inventory vs. organized count, files routed to
   `99-Unclassified/`, and any flags.

## Customization knobs

- Grouping scheme and naming — set by the user's answers in step 1.
- Sub-agent batching (~5-10 small files per agent) — tune for folder size.

## Notes

- **Copy, never move.** The only write zone is `organized/`.
- **Every file is accounted for** — nothing dropped silently.
- **Extract every zip**, even if contents "look like duplicates" — note the
  duplicates in the README.
- Verification is exact, not "roughly equal."
- If an `organized/` folder already exists, ask before replacing it.
- For litigation case files specifically, the `organize-for-me` skill applies a
  fixed legal taxonomy — use it instead of this generic recipe when relevant.
