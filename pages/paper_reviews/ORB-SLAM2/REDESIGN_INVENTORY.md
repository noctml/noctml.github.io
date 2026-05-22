# ORB-SLAM2 Redesign Inventory

## Status
- Batch queue status: `done`
- Reference workflow: DROID-W question-centered structure
- PDF: `/Users/song-useog/Desktop/Portfolio/git_papers/ORB-SLAM2.pdf`
- Personal notes: preserved because ORB-SLAM2 is one of the exception pages

## Applied Structure
- Top summary: problem / solution / evidence cue chips, contribution cards, processing flow, sensor comparison, insight brief, official GitHub preview.
- Detailed notes:
  - Problem: monocular scale drift, stereo/RGB-D motivation, related-work context.
  - Mechanism: system threads, input preprocessing, keypoint types, BA objectives, graph structures, localization mode.
  - Evidence: KITTI, EuRoC, TUM RGB-D, timing results, open-source reproducibility.
  - Usage / Limits: suitable conditions, weak conditions, and follow-up question.
  - Takeaway / Future Work: original personal notes preserved and translated.

## Preserved Assets
- Main paper figures: stereo/RGB-D examples, system overview, input preprocessing, KITTI, EuRoC, TUM, timing results.
- Supporting original-note figures: BA intuition, local keypoint matching, projection/reprojection explanation, close/far point example.
- Repository support screenshots: dataset instructions and calibration files.
- Paired figures such as Fig. 1a / Fig. 1b are kept side-by-side with matched visual height.
- Figure/table captions use Korean sentence structure in the Korean panel. Technical terms such as trajectory, ground truth, RMSE, thread are kept only where they read naturally in the SLAM context.

## Equation Coverage
- Eq. (1): RGB-D depth to virtual right coordinate.
- Eq. (2): motion-only BA objective.
- Eq. (3): monocular and rectified stereo projection functions.
- Eq. (4): local BA objective and reprojection residual.
- All four core block equations are restored with original KaTeX rendering rather than custom rebuilt HTML.
- Inline equation tokens are kept in the unified gray theme and raw TeX was checked not to appear in visible text.
- Equation-caption inline tokens use a caption-scoped baseline rule so figure captions do not inherit body/table math-token offsets.

## Verification Notes
- `node --check pages/paper_reviews/ORB-SLAM2/script.js`: pass.
- `git diff --check` for ORB-SLAM2 and queue files: pass.
- Browser QA:
  - KO/EN button toggles visible language panels and bookmark labels.
  - `더보기` / `Read More` reveal works.
  - Supplement toggles open as focused panels with close button and scroll lock.
  - Image lightbox opens and closes.
  - No DROID-SLAM fragment remains in the ORB-SLAM2 page.
  - Korean panel captions no longer contain fully English explanatory sentences.
  - Equation captions were checked after baseline adjustment.
