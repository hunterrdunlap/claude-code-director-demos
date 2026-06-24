---
description: Organize a messy case-file folder into a clean, indexed organized/ tree using the organize-for-me skill — copies only, originals untouched
---

You are organizing a messy case-file directory for an attorney so it is usable
and searchable before any real work begins. This recipe drives the
`organize-for-me` skill; it does not reinvent its logic. Run it from inside the
folder you want organized.

## What this uses

- The **`organize-for-me`** skill (invoke it as `/organize-for-me`, or just ask
  Claude to organize the folder). The skill owns the taxonomy, the safety
  rules, and the sub-agent fan-out. If the skill is installed, prefer invoking
  it directly; the steps below are the plain-language description of what it
  does and the guardrails it must keep.

## Persistent inputs

- The current working directory — a folder of case files in any state: loose
  PDFs and Word docs, statements, correspondence, ACDVs, and zip archives
  (including zips inside zips).

If the current folder is empty, say so and stop.

## What to do

1. **Inventory** (no AI). Find every file, exclude system junk, and extract
   every zip recursively into a staging area. Record a total file count to
   verify against at the end.
2. **Understand — fan out sub-agents.** Dispatch one lightweight sub-agent per
   substantial document, in parallel (group many small similar files ~5-10 per
   agent). Each returns structured notes for one file: document type, best
   date, a 2-3 sentence summary, the dated events it contains, a suggested
   name, its taxonomy category, and any flags (exposed personal info, missing
   pages, oddities). This is why a folder of hundreds of files gets read at
   once instead of one-at-a-time — and why the main session never runs out of
   room.
3. **Arrange.** Copy (never move) each file into a fixed, numbered taxonomy
   under `organized/`, renamed `YYYY-MM-DD Description.ext`. Anything
   unplaceable, unreadable, or password-protected goes to
   `organized/99-Unclassified/` — never silently dropped.
4. **Document & index.** Write a `_README.md` in each folder, a master
   `organized/README.md` (case snapshot + folder map + a manifest table mapping
   every new file back to its original path / zip + all flags), and
   `organized/TIMELINE.md` (every dated event, merged, deduped, sorted, each
   citing its source document). This manifest + timeline is the index the
   drafting recipe reads later.
5. **Verify.** The file count in `organized/` must equal the inventory count;
   reconcile against the manifest if not. Confirm nothing outside `organized/`
   changed. Delete the staging area.
6. End with a short chat summary: inventory vs. organized file count, how many
   files were routed to `99-Unclassified/`, and any flags raised.

## Customization knobs

- The taxonomy lives in the skill's `references/taxonomy.md` — adjust it there,
  not per run, so the structure stays predictable across cases.
- Sub-agent batching (~5-10 small files per agent) — tune for very large or
  very small folders.

## Notes

- **Copy, never move.** The original folder layout is itself evidence; it is
  never renamed, moved, or deleted. The only write zone is `organized/`.
- **Every file is accounted for.** Nothing is dropped silently.
- **Extract every zip**, even when the contents "look like duplicates" — note
  the duplicates in the README instead of skipping.
- Verification is exact, not "roughly equal."
- Re-running asks before replacing an existing `organized/` folder.
