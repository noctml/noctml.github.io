# WildPose Redesign Inventory

## Source
- Paper PDF: `/Users/song-useog/Desktop/Portfolio/git_papers/WildPose- A Unified Framework for Robust Pose Estimation in the Wild.pdf`
- Reference page style: DROID-W / CUT3R question-flow pattern, with WildGS-SLAM inline KaTeX baseline polish
- Page path: `/Users/song-useog/Desktop/Portfolio/github/pages/paper_reviews/WildPose/index.html`

## Preserved Visual Assets
- Figure 1. WildPose
- Figure 2. System Overview
- Figure 3. Visualization of Motion Masks
- Figure 4. Visualization of Camera Trajectories
- Table 1. Tracking Performance on Wild-SLAM MoCap Dataset
- Table 2. Tracking Performance on Bonn RGB-D Dynamic Dataset
- Table 3. Tracking Performance on TUM RGB-D dynamic Dataset
- Table 4. Tracking Performance on Low-motion and Static benchmarks
- Table 5. Long-video Depth Estimation on Bonn RGB-D Dynamic Dataset
- Table 6. WildPose Ablation Study

No supplementary-only figures or tables were added.

## Preserved Equations
- Unnumbered geometry-induced flow
- (1) Update operator variables
- (2) Differentiable BA objective and confidence matrix
- Unnumbered dynamic-object flow with object displacement
- (3) Update-operator training loss
- (4) Motion-detector training loss
- (5) Inference BA objective with metric-depth regularization
- Unnumbered masked confidence matrix

Equation tags follow the main paper. Unnumbered equations are kept untagged.

## Redesign Decisions
- Reorganized from raw section order into reader-question order:
  - Problem: why static-world assumptions fail in the wild
  - Mechanism: how MASt3R features and motion masks enter BA
  - Evidence: which tasks validate the method
  - Usage / Limits: when the method is useful or weak
- Related Work and training/inference implementation details are folded into supplement toggles.
- TL;DR uses Problem / Solution / Evidence cues plus contribution cards, insight, flow diagram, and approach comparison.
- Personal sections are placeholders:
  - Korean: `(진행중...)`
  - English: `(In progress...)`

## Verification Notes
- Static checks:
  - `node --check pages/paper_reviews/WildPose/script.js`
  - `git diff --check -- pages/paper_reviews/WildPose`
- Asset check:
  - 10 unique content images preserved
  - 20 content image references across Korean and English panels
  - no missing content image paths
- Equation check:
  - 5 tagged equations in Korean panel
  - 5 tagged equations in English panel
  - unnumbered main-paper equations preserved without artificial tags
- Browser check:
  - no page-wide horizontal overflow
  - no broken content images
  - no clipped TL;DR cards, summary table cells, or caption text detected
  - "더보기 / Read More" reveal works and rebuilds section bookmarks
  - Korean-to-English language switch shows English content without visible Korean residue in the main article text
