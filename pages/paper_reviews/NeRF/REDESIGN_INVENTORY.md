# NeRF Redesign Inventory

## Source

- Page: `pages/paper_reviews/NeRF/index.html`
- PDF: `/Users/song-useog/Desktop/Portfolio/git_papers/NeRF.pdf`
- Checkpoint: `pages/paper_reviews/_redesign_checkpoints/NeRF_legacy_20260520/`

## Legacy Counts

- Images: 11
- Block equation figures: 7
- Inline equation tokens: 90
- Legacy details: 1
- Major legacy headings: Abstract, Introduction, Related Work, Neural Radiance Field Scene Representation, Volume Rendering, Optimization, Results, Conclusion

## PDF Structure

- Abstract
- 1. Introduction
- 2. Related Work
- 3. Neural Radiance Field Scene Representation
- 4. Volume Rendering with Radiance Fields
- 5. Optimizing a Neural Radiance Field
- 5.1 Positional encoding
- 5.2 Hierarchical volume sampling
- 5.3 Implementation details
- 6. Results
- 6.1 Datasets
- 6.2 Comparisons
- 6.3 Discussion
- 6.4 Ablation studies
- 7. Conclusion

## Redesign Decisions

- Treat NeRF as a representation/rendering paper rather than a SLAM or foundation-model page.
- Make the main reading flow: 5D radiance field -> differentiable volume rendering -> positional encoding -> hierarchical sampling -> view synthesis results.
- Remove the raw detailed-note drawer after confirming core volume-rendering, positional-encoding, sampling, and result details are represented in the main flow.
- Keep the main equations visible because they define the method: volume rendering integral, alpha compositing, positional encoding, and coarse/fine reconstruction loss.
- Keep conclusion and personal takeaway as prose, emphasizing the bridge from 2D image supervision to learned 3D representation.

## DROID-W Reference Refresh 2026-05-22

- Added the DROID-W-style TL;DR cue row: Problem / Solution / Evidence.
- Added local subsection labels before the pipeline and approach comparison so the top map does not read as disconnected blocks.
- Renamed visible `Equation Ledger` wording to user-facing supporting-equation wording; `ledger` remains internal vocabulary only.
- Preserved NeRF's original KaTeX block equations and NDC equation crops; only labels/captions were normalized.
- Wrapped image captions with `.caption-main` so figure/table titles receive the same emphasis rule as the reference pages.
- Moved paper-level discussion/future directions into `Discussion / Limitations`.
- Applied the batch personal-note rule: `느낀점` / `향후 계획` use `(진행중...)`, English uses `(In progress...)`.

## 2026-05-22 DROID-W-Primary Refinement

- Updated stylesheet/script cache keys to `nerf-refine-20260522`.
- Replaced user-facing `Preserved NDC Derivation` / `PDF-render crops` wording with neutral NDC derivation wording:
  - `NDC Derivation Notes`
  - `compact equation images`
- Strengthened figure/table caption title lines to match the DROID-W / Chamelion caption hierarchy.
- Added the DROID-W / Chamelion fallback CSS rules for:
  - method-step style blocks,
  - table-contained math tokens,
  - equation tag gutter fallback.
- Static gate passed:
  - `node --check pages/paper_reviews/NeRF/script.js`
  - `git diff --check -- pages/paper_reviews/NeRF/index.html pages/paper_reviews/NeRF/styles.css pages/paper_reviews/NeRF/script.js pages/paper_reviews/NeRF/REDESIGN_INVENTORY.md`
- Browser gate:
  - `styles.css?v=nerf-refine-20260522` loaded.
  - `script.js?v=nerf-refine-20260522` loaded.
  - KaTeX errors: `0`.
  - Equation figures: `16`.
  - Image/table figures: `22`.
  - Figure/table title-line captions: `22`.
  - Captions missing `.caption-main`: `0`.
  - Supplement toggles: `4`.
  - Deep-dive reveal button visible.
  - Oversized rendered images: `0`.
  - Standalone stray `>` lines: `0`.
