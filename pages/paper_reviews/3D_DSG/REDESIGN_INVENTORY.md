# 3D Dynamic Scene Graphs Redesign Inventory

## Scope

- Page: `pages/paper_reviews/3D_DSG/`
- PDF: `/Users/song-useog/Desktop/Portfolio/git_papers/3DDynamicSceneGraph.pdf`
- Paper type: dynamic representation / robotics spatial perception system.
- Reference standard: `DROID-W` question-centered readability with 3D_SG representation-page visual style.
- Personal notes: placeholder only.

## Current Pass

- Added compact TL;DR cues:
  - Problem: gap between SLAM maps and task-level action.
  - Solution: layered dynamic scene graph with agents.
  - Evidence: SPIN and uHumans evaluation.
- Kept the hierarchy diagram rather than forcing a sequential flow as the top visual.
- Added minimal subheadings before the layer hierarchy and representation comparison.
- Preserved SPIN pipeline and existing figures.

## Assets And Captions

- Existing figures/tables are preserved.
- All figure/table captions now expose `.caption-main` so title lines are visually separated and consistent.
- No new supplementary-only images were added.

## Formula Policy

- No block equations are present in this page.
- Existing inline math/token styling remains under the unified gray equation theme.

## Toggle Policy

- Related-work supplement remains folded.
- Toggle focus panel behavior is expected to follow existing page-local script.

## KO/EN Policy

- Same-page KO/EN blocks are preserved.
- TL;DR cues and visual subheadings exist in both language blocks.
- `느낀점` / `향후 계획` follow batch policy:
  - KO: `(진행중...)`
  - EN: `(In progress...)`

## Gate Notes

- Static check required:
  - `node --check pages/paper_reviews/3D_DSG/script.js`
  - `git diff --check -- pages/paper_reviews/3D_DSG/index.html pages/paper_reviews/3D_DSG/styles.css pages/paper_reviews/3D_DSG/script.js pages/paper_reviews/3D_DSG/REDESIGN_INVENTORY.md`
- Browser check required:
  - KO/EN toggle.
  - Cue chips fit without hiding key text.
  - Captions render with bold title line.
  - Personal-note placeholders visible in both languages.

## 2026-05-22 DROID-W-Primary Refinement

- Kept the dynamic-representation structure instead of forcing a sequential Problem Ladder.
  - Reason: this paper's core is the layered 3D Dynamic Scene Graph representation and SPIN construction pipeline, not a single optimization loop.
- Replaced guide-like user-facing labels with paper-centered labels:
  - `Abstract Reading Guide` -> `Abstract Core`
- Added the DROID-W / Chamelion fallback CSS rules for:
  - method-step style blocks,
  - table-contained math tokens,
  - equation tag gutter fallback.
- Updated stylesheet cache key to `styles.css?v=3d-dsg-refine-20260522`.
- Static gate passed:
  - `node --check pages/paper_reviews/3D_DSG/script.js`
  - `git diff --check -- pages/paper_reviews/3D_DSG/index.html pages/paper_reviews/3D_DSG/styles.css pages/paper_reviews/3D_DSG/script.js pages/paper_reviews/3D_DSG/REDESIGN_INVENTORY.md`
- Browser gate:
  - `styles.css?v=3d-dsg-refine-20260522` loaded.
  - KaTeX errors: `0`.
  - Figure/table title-line captions: `42`.
  - Captions missing `.caption-main`: `0`.
  - Standalone stray `>` lines: `0`.
