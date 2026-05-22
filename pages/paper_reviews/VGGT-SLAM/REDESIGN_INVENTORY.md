# VGGT-SLAM Redesign Inventory

## Source

- Page: `pages/paper_reviews/VGGT-SLAM/index.html`
- PDF: `/Users/song-useog/Desktop/Portfolio/git_papers/VGGT-SLAM.pdf`
- Checkpoint: `pages/paper_reviews/_redesign_checkpoints/VGGT-SLAM_legacy_20260520/`

## Legacy Counts

- Images: 11
- Block equation figures: 9
- Inline equation tokens: 86
- Legacy details: 0
- Major legacy headings: Abstract, Introduction, Related Work, Review: VGGT, VGGT-SLAM, Experiments, Limitations, Conclusion

## PDF Structure

- Abstract
- 1. Introduction
- 2. Related Work
- 3. Review: VGGT
- 4. VGGT-SLAM
- 4.1 Incremental submap-based keyframe selection and generation
- 4.2 Local submap alignment addressing projective ambiguity
- 4.3 Loop closures
- 4.4 Backend: Nonlinear factor graph optimization on the SL(4) manifold
- 5. Experiments
- 5.1 Experimental setup
- 5.2 Pose estimation evaluation
- 5.3 Dense reconstruction evaluation
- 5.4 Qualitative results
- 5.5 Ablations
- 6. Limitations
- 7. Conclusion

## Redesign Decisions

- Treat VGGT-SLAM as a hybrid of VGGT feed-forward submaps and classical projective-geometry backend.
- Make the main reading flow: VGGT memory limit -> projective ambiguity -> SL(4) factor graph -> loop closures -> experiments.
- Remove the raw detailed-note drawer after confirming core submap, projective ambiguity, SL(4), and evaluation details are represented in the main flow.
- Keep transform-group comparison visible because it explains why `SL(4)` is not cosmetic.
- Use result briefs for pose, dense reconstruction, qualitative maps, ablations, and limitations.
- Keep conclusion and personal takeaway as prose.

## DROID-W Reference Pass 2026-05-22

- Added compact TL;DR cue chips for `Problem / Solution / Evidence`.
- Added explicit subsection labels for the top processing flow and approach comparison.
- Renamed the visible `Equation Ledger` section to user-facing supporting-equation language.
- Preserved original KaTeX equation blocks for SL(4) homography constraints, factor-graph objective, and tangent-space updates.
- Wrapped image/table captions with `caption-main`; removed the visible `supplementary note` wording from the explanatory figure caption.
- Moved limitations into a dedicated paper-content section and applied the queue personal-note policy: KO `(진행중...)`, EN `(In progress...)`.
- Synced supplement open/scroll-indicator timing with the DROID-W fixed-panel behavior.

## 2026-05-22 DROID-W-Primary Refinement

- Updated stylesheet/script cache keys to `vggt-slam-refine-20260522`.
- Strengthened figure/table caption title lines to match the DROID-W / Chamelion caption hierarchy.
- Added the DROID-W / Chamelion fallback CSS rules for:
  - method-step style blocks,
  - table-contained math tokens,
  - equation tag gutter fallback.
- Static gate passed:
  - `node --check pages/paper_reviews/VGGT-SLAM/script.js`
  - `git diff --check -- pages/paper_reviews/VGGT-SLAM/index.html pages/paper_reviews/VGGT-SLAM/styles.css pages/paper_reviews/VGGT-SLAM/script.js pages/paper_reviews/VGGT-SLAM/REDESIGN_INVENTORY.md`
- Browser gate:
  - `styles.css?v=vggt-slam-refine-20260522` loaded.
  - `script.js?v=vggt-slam-refine-20260522` loaded.
  - KaTeX errors: `0`.
  - Equation figures: `10`.
  - Image/table figures: `14`.
  - Figure/table title-line captions: `14`.
  - Captions missing `.caption-main`: `0`.
  - Supplement toggles: `2`.
  - Deep-dive reveal button visible.
  - Oversized rendered images: `0`.
  - Standalone stray `>` lines: `0`.
