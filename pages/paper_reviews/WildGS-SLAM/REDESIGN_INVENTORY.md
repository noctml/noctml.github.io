# WildGS-SLAM Redesign Inventory

## Source
- Paper PDF: `/Users/song-useog/Desktop/Portfolio/git_papers/WildGS-SLAM- Monocular Gaussian Splatting SLAM in Dynamic Environments.pdf`
- Reference page style: DROID-W / CUT3R question-flow redesign pattern
- Page path: `/Users/song-useog/Desktop/Portfolio/github/pages/paper_reviews/WildGS-SLAM/index.html`

## Preserved Visual Assets
- Figure 1. WildGS-SLAM overview
- Figure 2. System Overview
- Table 1. Tracking Performance on Wild-SLAM MoCap Dataset
- Table 2. Novel View Synthesis Evaluation on Wild-SLAM MoCap Dataset
- Figure 3. Input View Synthesis Results on Wild-SLAM MoCap Dataset
- Figure 4. Novel View Synthesis Results on Wild-SLAM MoCap Dataset
- Figure 5. Input View Synthesis Results on Wild-SLAM iPhone Dataset
- Table 3. Tracking Performance on Bonn RGB-D Dynamic Dataset
- Figure 6. View Synthesis Results on Bonn RGB-D Dynamic Dataset
- Table 4. Tracking Performance on TUM RGB-D Dataset
- Table 5. WildGS-SLAM Ablation Study

## Preserved Equations
- (1) Projected Gaussian opacity
- (2) Rendered color and depth alpha blending
- (3) Depth L1 loss
- (4) Uncertainty loss
- (5) Uncertainty/depth guided DBA objective
- (6) Rendering loss
- (7) Color loss

All equations are rendered through KaTeX in both Korean and English panels and keep the original paper tags.

## Redesign Decisions
- Top page uses compact paper-title metadata, not a large title block.
- TL;DR follows the DROID-W pattern: Problem / Solution / Evidence cue chips, contribution cards, insight box, flow diagram, and approach comparison.
- Detailed notes are reorganized by reader question:
  - Problem: why dynamic distractors matter
  - Mechanism: how uncertainty enters tracking and mapping
  - Evidence: what tasks validate the method
  - Usage / Limits: when to use or avoid this method
- Related Work and implementation/baseline details are folded into focused supplement toggles.
- Personal sections are placeholders because the original page did not include authored notes:
  - Korean: `(진행중...)`
  - English: `(In progress...)`

## Verification Notes
- Static checks:
  - `node --check pages/paper_reviews/WildGS-SLAM/script.js`
  - `git diff --check -- pages/paper_reviews/WildGS-SLAM`
- Asset check:
  - 11 unique content images preserved
  - 22 content image references across Korean and English panels
  - no missing content image paths
- Equation check:
  - 7 equation tags in Korean panel
  - 7 equation tags in English panel
  - rendered browser tags: `(1)` through `(7)`
- Browser check:
  - no page-wide horizontal overflow
  - no clipped TL;DR cards, summary table cells, or caption text detected
  - "더보기 / Read More" reveal works
  - Korean-to-English language switch shows English content without visible Korean residue in the main article text
