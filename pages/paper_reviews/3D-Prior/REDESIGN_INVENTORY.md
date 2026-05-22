# 3D-Prior Redesign Inventory

## Source

- Page: `pages/paper_reviews/3D-Prior/index.html`
- PDF: `/Users/song-useog/Desktop/Portfolio/git_papers/Dynamic Visual SLAM using a General 3D Prior.pdf`
- Checkpoint: `pages/paper_reviews/_redesign_checkpoints/3D-Prior_legacy_20260520/`

## Legacy Counts

- Images: 12
- Block equation figures: 11
- Inline equation tokens: 88
- Legacy details: 0
- Major legacy headings: Abstract, Introduction, Related Works, Our Approach, Experiments, Conclusion, Limitation

## PDF Structure

- Abstract
- 1. Introduction
- 2. Related Work
- 3. Our Approach
- 3.1 Patch-Based Visual SLAM formulation
- 3.2 Moving Object Segmentation by `pi^3_mos`
- 3.3 System Overview
- 3.4 Depth Scale Estimation
- 3.5 Uncertainty-aware BA
- 3.6 Implementation Details
- 4. Experiments
- 4.1 Moving Object Segmentation
- 4.2 Camera Tracking
- 4.3 Video Depth Estimation
- 4.4 Ablation Study
- 5. Conclusion / Limitations

## Redesign Decisions

- Treat the paper as a hybrid-SLAM page: patch-based BA provides online consistency, feed-forward reconstruction provides moving mask and dense depth prior.
- Keep the top summary focused on `pi^3_mos`, scale alignment, and uncertainty-aware BA.
- Remove the raw detailed-note drawer after confirming core 3D-prior, scale-alignment, uncertainty-aware BA, and evaluation details are represented in the main flow.
- Keep core equations visible as role-oriented summaries; avoid leaving a second raw-note drawer that competes with the main reading path.
- Convert long dataset / metric / baseline explanations into brief grids and tables.
- Keep conclusion and personal takeaway as prose, not cards.

## DROID-W Reference Pass 2026-05-22

- Added compact TL;DR cue chips for `Problem / Solution / Evidence`.
- Added explicit subsection labels for the top flow diagram and approach comparison.
- Renamed the visible `Equation Ledger` section to user-facing supporting-equation language; `ledger` remains an internal inventory concept only.
- Wrapped image/table captions with `caption-main` and made Korean captions Korean-first while preserving technical terms.
- Preserved original KaTeX equation blocks and avoided rewriting the internal equation DOM.
- Applied the queue personal-note policy: KO `(진행중...)`, EN `(In progress...)`.
- Synced supplement open/scroll-indicator timing with the DROID-W/Khronos fixed-panel behavior.

## 2026-05-22 DROID-W-Primary Refinement

- Updated stylesheet/script cache keys to `3d-prior-refine-20260522`.
- Strengthened figure/table caption title lines to match the DROID-W / Chamelion caption hierarchy.
- Added the DROID-W / Chamelion fallback CSS rules for:
  - method-step style blocks,
  - table-contained math tokens,
  - equation tag gutter fallback.
- Static gate passed:
  - `node --check pages/paper_reviews/3D-Prior/script.js`
  - `git diff --check -- pages/paper_reviews/3D-Prior/index.html pages/paper_reviews/3D-Prior/styles.css pages/paper_reviews/3D-Prior/script.js pages/paper_reviews/3D-Prior/REDESIGN_INVENTORY.md`
- Browser gate:
  - `styles.css?v=3d-prior-refine-20260522` loaded.
  - `script.js?v=3d-prior-refine-20260522` loaded.
  - KaTeX errors: `0`.
  - Equation figures: `22`.
  - Image/table figures: `22`.
  - Figure/table title-line captions: `22`.
  - Captions missing `.caption-main`: `0`.
  - Supplement toggles: `2`.
  - Deep-dive reveal button visible.
  - Oversized rendered images: `0`.
  - Standalone stray `>` lines: `0`.
