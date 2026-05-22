# Khronos Redesign Inventory

- Batch target: Khronos
- PDF: /Users/song-useog/Desktop/Portfolio/git_papers/Khronos.pdf
- Reference: DROID-W active reference + ORB-SLAM2 equation/caption refinement rules
- Personal note policy: placeholder only, because this page is not one of the allowed preserve-existing personal-note pages for the current batch.

## Preserved Assets

- Image figures: 2
  - 1. Khronos system overview
  - 2. Khronos system overview
- Equation figures: 42
  - 1. Object state equation
  - 2. Observation equation
  - 3. MAP objective equation
  - 4. Robot trajectory equation
  - 5. Object history equation
  - 6. Odometry measurement equation
  - 7. Local consistency equation
  - 8. Equation 13 local global split
  - 9. Equation 16 system factorization
  - 10. Object local consistency equation
  - 11. Fragment state equation
  - 12. SMS factorization equation 11
  - 13. SMS factorization equation 12
  - 14. Global estimation split equation 14
  - 15. Association factorization equation 15
  - 16. Equation 16 local estimation focus
  - 17. Equation 16 SLAM focus
  - 18. Robust pose graph optimization objective
  - 19. Weighted norm equation
  - 20. Ray evidence distance equations
  - 21. 4D metric equation
  - 22. Metric set equation
  - 23. Object state equation
  - 24. MAP objective equation
  - 25. Robot trajectory equation
  - 26. Object history equation
  - 27. Odometry measurement equation
  - 28. Equation 13 local global split
  - 29. Equation 16 system factorization
  - 30. Object local consistency equation
  - 31. Fragment state equation
  - 32. SMS factorization equation 11
  - 33. SMS factorization equation 12
  - 34. Global estimation split equation 14
  - 35. Association factorization equation 15
  - 36. Equation 16 local estimation focus
  - 37. Equation 16 SLAM focus
  - 38. Robust pose graph optimization objective
  - 39. Weighted norm equation
  - 40. Ray evidence distance equations
  - 41. 4D metric equation
  - 42. Metric set equation
- Supplement toggles: 11
  - 1. Related Works 배경 정리 보기
  - 2. SMS notation 보조 수식 보기
  - 3. Factorization 전개 수식 보기
  - 4. Khronos 모듈 세부 보기
  - 5. Global optimization / change evidence 수식 보기
  - 6. 평가 지표 보조 수식 보기
  - 7. View related-work background
  - 8. View SMS notation equations
  - 9. View factorization derivation equations
  - 10. View global optimization and change-evidence equations
  - 11. View metric notation equations

## DROID-W Alignment Pass

- Added compact TL;DR cue chips for problem / solution / evidence.
- Added short visual headings before the pipeline and temporal-target comparison blocks.
- Removed the top-summary note block so the first section stays compact.
- Converted image/table captions to caption-main title lines.
- Replaced personal notes with placeholders: KO `(진행중...)`, EN `(In progress...)`.
- Kept equation-heavy content in the method/evaluation flow or structured toggles; no visible equation ledger title is exposed.

## Gate Notes

- Block equations use existing KaTeX markup and Khronos-specific equation CSS.
- Multi-line numbered equations should be checked visually after opening the relevant equation toggles.
- English/Korean panels share the same image width and caption hierarchy.

## 2026-05-22 DROID-W-Primary Refinement

- Kept the formula-heavy structure intact and did not introduce an equation ledger.
- Updated stylesheet/script cache keys to `khronos-refine-20260522`.
- Strengthened figure caption title lines to match the DROID-W / Chamelion caption hierarchy.
- Added the DROID-W / Chamelion fallback CSS rules for:
  - method-step style blocks,
  - table-contained math tokens,
  - equation tag gutter fallback.
- Static gate passed:
  - `node --check pages/paper_reviews/Khronos/script.js`
  - `git diff --check -- pages/paper_reviews/Khronos/index.html pages/paper_reviews/Khronos/styles.css pages/paper_reviews/Khronos/script.js pages/paper_reviews/Khronos/REDESIGN_INVENTORY.md`
- Browser gate:
  - `styles.css?v=khronos-refine-20260522` loaded.
  - `script.js?v=khronos-refine-20260522` loaded.
  - KaTeX errors: `0`.
  - Equation figures: `42`.
  - Image figures: `2`.
  - Figure/table title-line captions: `2`.
  - Captions missing `.caption-main`: `0`.
  - Supplement toggles: `11`.
  - Deep-dive reveal button visible.
  - Standalone stray `>` lines: `0`.
