# SLIM-VDB Redesign Inventory

## Scope

- Page: `pages/paper_reviews/SLIM-VDB/`
- PDF: `/Users/song-useog/Desktop/Portfolio/git_papers/SLIM-VDB- A Real-Time 3D Probabilistic Semantic Mapping Framework.pdf`
- Paper type: semantic mapping system / probabilistic method.
- Reference standard: `DROID-W` question-centered readability with formula-heavy-page caution.
- Personal notes: placeholder only.

## Current Pass

- Added compact TL;DR cues:
  - Problem: semantic map cost and uncertainty.
  - Solution: OpenVDB plus Bayesian fusion.
  - Evidence: runtime/memory and closed/open-set evaluations.
- Added minimal subheadings before the processing flow and semantic-scope comparison.
- Preserved equation-heavy method structure and existing toggle panels.

## Assets And Captions

- Existing figures/tables are preserved.
- All figure/table captions now expose `.caption-main` for consistent title-line styling.
- No new supplementary-only images were added.

## Formula Policy

- Formula DOM was not rewritten in this pass.
- Existing block equations and inline math remain under the page-local equation normalization.
- Formula-heavy pages require a separate equation rendering check before final completion.

## Toggle Policy

- Existing focused supplement panels remain unchanged.
- Notation / Bayesian update details stay folded but structured.
- Extra bottom buffer for long toggle content remains part of the expected UI.

## KO/EN Policy

- Same-page `data-ko` / `data-en` translation remains.
- Newly added cue and subheading elements include matching KO/EN attributes.
- `느낀점` / `향후 계획` follow batch policy:
  - KO: `(진행중...)`
  - EN: `(In progress...)`

## Gate Notes

- Static check required:
  - `node --check pages/paper_reviews/SLIM-VDB/script.js`
  - `git diff --check -- pages/paper_reviews/SLIM-VDB/index.html pages/paper_reviews/SLIM-VDB/styles.css pages/paper_reviews/SLIM-VDB/script.js pages/paper_reviews/SLIM-VDB/REDESIGN_INVENTORY.md`
- Browser check required:
  - KO/EN toggle.
  - Cue chips and captions render correctly.
  - Long toggles open in the fixed focus panel without double scrollbars.
  - Block equations remain visible and aligned.

## 2026-05-22 DROID-W-Primary Refinement

- Removed guide-like labels from the method supplement:
  - `수식 로드맵` -> `수식 흐름`
  - `View equation-level reading guide` -> `View notation and Bayesian updates`
  - `Equation roadmap` -> `Equation Flow`
- Replaced the English phrase `positioning map` with `positioning frame` to avoid artificial `~ Map` wording.
- Added the DROID-W / Chamelion fallback CSS rules for:
  - method-step style blocks,
  - table-contained math tokens,
  - equation tag gutter fallback.
- Updated stylesheet/script cache keys to `slim-vdb-refine-20260522`.
- Static gate passed:
  - `node --check pages/paper_reviews/SLIM-VDB/script.js`
  - `git diff --check -- pages/paper_reviews/SLIM-VDB/index.html pages/paper_reviews/SLIM-VDB/styles.css pages/paper_reviews/SLIM-VDB/script.js pages/paper_reviews/SLIM-VDB/REDESIGN_INVENTORY.md`
- Browser gate:
  - `styles.css?v=slim-vdb-refine-20260522` loaded.
  - `script.js?v=slim-vdb-refine-20260522` loaded.
  - KaTeX errors: `0`.
  - Figure/table title-line captions: `14`.
  - Captions missing `.caption-main`: `0`.
  - Supplement toggles: `6`.
  - Deep-dive reveal button visible.
  - Standalone stray `>` lines: `0`.
  - Oversized inline image widths after page normalization: `0`.
