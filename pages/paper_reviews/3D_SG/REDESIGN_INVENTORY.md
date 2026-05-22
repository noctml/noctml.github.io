# 3D Scene Graph Redesign Inventory

## Scope

- Page: `pages/paper_reviews/3D_SG/`
- PDF: `/Users/song-useog/Desktop/Portfolio/git_papers/3DSceneGraph.pdf`
- Paper type: representation / scene graph paper.
- Reference standard: `DROID-W` question-centered readability, with ORB-SLAM2 caption and equation QA rules.
- Personal notes: preserve existing `느낀점` and `향후 계획`.

## Current Pass

- Top summary keeps the representation-first framing:
  - Problem: image-grounded semantics are viewpoint-sensitive.
  - Solution: layered graph grounded on a 3D mesh.
  - Evidence: Gibson-scale construction and relationship tasks.
- Added short TL;DR cue chips without long explanatory prose.
- Added minimal subheadings before the hierarchy diagram and representation-space comparison.
- Kept the paper-specific hierarchy/relationship diagram rather than forcing a sequential pipeline.

## Assets And Captions

- Existing figures and tables are preserved.
- Figure/table captions are split into:
  - `.caption-main`: title line.
  - `.caption-note`: PDF-backed interpretation line.
- Figure numbering follows the PDF captions, including Figure 7 for 3D mesh detection.
- Color-word emphasis for yellow/blue/red is preserved inside caption notes where it clarifies the figure.

## Formula Policy

- The page is not equation-heavy; existing inline KaTeX tokens are preserved.
- Inline equation styling follows the unified gray token style.
- No visible equation ledger is added.

## Toggle Policy

- Related-work details remain folded.
- Supplement content is structured with cards/tables rather than raw long prose only.
- No supplementary-only figure/table images were newly added.

## KO/EN Policy

- KO and EN are kept as same-page language blocks.
- Newly added TL;DR cues and visual subheadings exist in both KO and EN blocks.
- English blocks avoid Korean section-chip leakage.

## Gate Notes

- Static check required:
  - `node --check pages/paper_reviews/3D_SG/script.js`
  - `git diff --check -- pages/paper_reviews/3D_SG/index.html pages/paper_reviews/3D_SG/styles.css pages/paper_reviews/3D_SG/script.js pages/paper_reviews/3D_SG/REDESIGN_INVENTORY.md`
- Browser check required:
  - KO/EN toggle.
  - TL;DR cue chips fit without ellipsis hiding key text.
  - Captions render with main/note separation.
  - Right bookmark and deep reveal remain functional.

## 2026-05-22 DROID-W-Primary Refinement

- Kept the representation-paper structure instead of forcing DROID-W's sequential `Problem Ladder` or `method-step-block` layout. The correct visual language for this paper is relation/hierarchy/visual-summary blocks because the paper's core contribution is a 3D semantic representation.
- Added DROID-W/Chamelion-compatible CSS fallbacks for method-step blocks, table math-token baseline, and equation right-gutter tags. These are QA safety rails for future edits rather than a signal that 3D_SG should become a pipeline page.
- Updated the stylesheet cache key to `styles.css?v=3d-sg-refine-20260522`.
- Static QA passed: `node --check pages/paper_reviews/3D_SG/script.js` and `git diff --check` for the page files.
- Browser QA passed: KaTeX errors `0`, image/table captions with `caption-main` `28`, EN visible Korean leakage `0`, visible language blocks switch cleanly between KO and EN, standalone stray `>` lines `0`.
