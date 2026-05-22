# DROID-SLAM Redesign Inventory

## Scope

- Page: `pages/paper_reviews/DROID-SLAM/`
- PDF: `/Users/song-useog/Desktop/Portfolio/git_papers/DROID-SLAM.pdf`
- Reference standard: `DROID-W` question-centered structure with ORB-SLAM2 equation/caption QA lessons.
- Personal notes: preserve existing `느낀점` and `향후 계획`.

## Current Pass

- Top summary keeps a compact TL;DR and adds minimal cue chips:
  - Problem: classical SLAM robustness gap.
  - Solution: learned correspondence updates connected to recurrent DBA.
  - Evidence: TartanAir, EuRoC, TUM-RGBD, ETH3D.
- Deep section remains `논문 상세 정리`, but now starts with a problem-flow block and a design-choice block.
- Method section treats DROID-SLAM as:
  - RAFT-style correspondence signal.
  - learned update operator.
  - DBA layer converting correspondence/confidence into pose-depth updates.
  - full SLAM frontend/backend system.
- Evaluation section is read by evidence/failure mode, not by raw dataset names alone.

## Assets And Captions

- Existing images/tables are preserved.
- Captions are split into:
  - `.caption-main`: figure/table title line.
  - `.caption-note`: PDF-backed short interpretation when useful.
- Korean panel captions are Korean-first. Technical English terms remain only where natural.

## Formula Policy

- Block equations keep existing KaTeX/export structure.
- Inline equations keep the page-local gray math-token theme.
- Equation-caption/table math baselines are treated separately from body inline math.
- No visible equation ledger is added.

## Toggle Policy

- Related/appendix-style supplements remain folded.
- Toggle internals should use structured tables/cards where helpful.
- No visible labels such as `세부 참고`, `보존할 세부 내용`, or `Equation Ledger`.

## KO/EN Policy

- Newly inserted Korean labels and caption notes are registered in `script.js`.
- The fixed-point auxiliary phrase was removed in both Korean and English.
- English toggle should translate the new TL;DR cues, problem-flow block, design-choice block, and captions.

## Gate Notes

- Static check required:
  - `node --check pages/paper_reviews/DROID-SLAM/script.js`
  - `git diff --check -- pages/paper_reviews/DROID-SLAM/index.html pages/paper_reviews/DROID-SLAM/styles.css pages/paper_reviews/DROID-SLAM/script.js pages/paper_reviews/DROID-SLAM/REDESIGN_INVENTORY.md`
- Browser check required:
  - KO page: TL;DR cues, flow diagram, captions, right bookmark, deep reveal.
  - EN page: no obvious Korean leakage in refreshed blocks.
  - Toggles: focused supplement panel opens/closes and aligns below the top bar.

## 2026-05-22 DROID-W-Primary Refinement

- Added `method-step-block` hierarchy to the main method blocks: RAFT-to-DROID comparison, design choice, and training setup. This makes the mechanism section closer to DROID-W's method-first reading flow without rewriting the preserved paper notes.
- Added DROID-W/Chamelion-compatible CSS fallbacks for table math-token baseline and equation right-gutter tags. DROID-SLAM currently does not require right-gutter equation tags, but the page now has the same fallback vocabulary if a Notion/KaTeX tag drifts during later edits.
- Updated the stylesheet cache key to `styles.css?v=droid-slam-refine-20260522`.
- Static QA passed: `node --check pages/paper_reviews/DROID-SLAM/script.js` and `git diff --check` for the page files.
- Browser QA passed: KaTeX errors `0`, image/table captions with `caption-main` `8`, method-step blocks `3`, visible English Korean leakage `0`, standalone stray `>` lines `0`.
