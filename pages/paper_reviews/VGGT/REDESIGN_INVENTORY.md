# VGGT Redesign Inventory

## Source

- Page: `pages/paper_reviews/VGGT/index.html`
- PDF: `/Users/song-useog/Desktop/Portfolio/git_papers/VGGT.pdf`
- Checkpoint: `pages/paper_reviews/_redesign_checkpoints/VGGT_legacy_20260520/`

## Legacy Counts

- Images: 14
- Block equation figures: 5
- Inline equation tokens: 133
- Legacy details: 0
- Major legacy headings: Abstract, Introduction, Related Work, Method, Experiments, Discussions, Conclusion, Appendix

## PDF Structure

- Abstract
- 1. Introduction
- 2. Related Work
- 3. Method
- 3.1 Problem definition and notation
- 3.2 Feature Backbone
- 3.3 Prediction heads
- 3.4 Training
- 4. Experiments
- 4.1 Camera Pose Estimation
- 4.2 Multi-view Depth Estimation
- 4.3 Point Map Estimation
- 4.4 Image Matching
- 4.5 Ablation Studies
- 4.6 Finetuning for Downstream Tasks
- 5. Discussions
- 6. Conclusions

## Redesign Decisions

- Treat VGGT as a 3D foundation model page rather than a SLAM-system page.
- Organize the top summary around unified 3D outputs, alternating attention, feed-forward speed, and downstream transfer.
- Remove the raw detailed-note drawer after confirming core camera/depth/point-map/track definitions and evaluation details are represented in the main flow.
- Keep equations in the main body role-oriented: input-output definition and multi-task loss.
- Convert task-heavy experiment sections into brief grids and tables by output type.
- Keep discussion/conclusion as prose, especially limitations and the relationship between neural-first prediction and optional BA.

## DROID-W Reference Pass 2026-05-22

- Added compact TL;DR cue chips for `Problem / Solution / Evidence`.
- Added explicit subsection labels for the top processing flow and approach comparison.
- Preserved the original KaTeX-style equation blocks for the input-output definition and multi-task loss.
- Wrapped image/table captions with `caption-main`; Korean captions are Korean-first while keeping technical terms.
- Moved PDF discussion limitations into a dedicated `Discussion / Limitations` section.
- Applied the queue personal-note policy: KO `(진행중...)`, EN `(In progress...)`.
- Synced supplement open/scroll-indicator timing with the DROID-W fixed-panel behavior.

## 2026-05-22 DROID-W-Primary Refinement

- Updated stylesheet/script cache keys to `vggt-refine-20260522`.
- Strengthened figure/table caption title lines to match the DROID-W / Chamelion caption hierarchy.
- Added the DROID-W / Chamelion fallback CSS rules for:
  - method-step style blocks,
  - table-contained math tokens,
  - equation tag gutter fallback.
- Static gate passed:
  - `node --check pages/paper_reviews/VGGT/script.js`
  - `git diff --check -- pages/paper_reviews/VGGT/index.html pages/paper_reviews/VGGT/styles.css pages/paper_reviews/VGGT/script.js pages/paper_reviews/VGGT/REDESIGN_INVENTORY.md`
- Browser gate:
  - `styles.css?v=vggt-refine-20260522` loaded.
  - `script.js?v=vggt-refine-20260522` loaded.
  - KaTeX errors: `0`.
  - Equation figures: `4`.
  - Image/table figures: `30`.
  - Figure/table title-line captions: `30`.
  - Captions missing `.caption-main`: `0`.
  - Supplement toggles: `4`.
  - Deep-dive reveal button visible.
  - Oversized rendered images: `0`.
  - Standalone stray `>` lines: `0`.
