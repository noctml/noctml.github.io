# DynaSLAM Redesign Inventory

Status: Unit 1 inventory started  
PDF: `/Users/song-useog/Desktop/Portfolio/git_papers/DynaSLAM- Tracking, Mapping and Inpainting in Dynamic Scenes.pdf`  
Page: `pages/paper_reviews/DynaSLAM/`

## Baseline Checkpoint

Current restored legacy page is checkpointed at:

`pages/paper_reviews/_redesign_checkpoints/DynaSLAM_legacy_20260520/`

Files:

- `index.html`
- `styles.css`
- `script.js`

## Current Page Inventory

| Item | Count / State |
| --- | --- |
| HTML size | 63,652 bytes |
| CSS size | 26,895 bytes |
| JS size | 2,695 bytes |
| figures | 12 |
| images | 14 |
| block equations | 0 |
| inline equation tokens | 20 |
| native details/toggles | 0 |
| current layout | legacy Notion-export style |

Current blockquote/section labels:

- `키워드`
- `요약`
- `관련 연구`
- `시스템`
- `Segmentation Potentially Dynamic object`
- `Low-Cost Tracking`
- `Mask R-CNN Segmentation & Multi-view Geometry`
- `Tracking & Mapping`
- `Background Inpainting`
- `평가`
- `Timing Analysis`
- `인사이트 & 느낀점`

## PDF Structure

PDF pages: 8

Detected paper sections:

- `I. INTRODUCTION`
- `II. RELATED WORK`
- `III. SYSTEM DESCRIPTION`
- `A. Segmentation of Potentially Dynamic Content using a CNN`
- `B. Low-Cost Tracking`
- `C. Segmentation of Dynamic Content using Mask R-CNN and Multi-view Geometry`
- `D. Tracking and Mapping`
- `E. Background Inpainting`
- `IV. EXPERIMENTAL RESULTS`
- `A. TUM Dataset`
- `B. KITTI Dataset`
- `C. Timing Analysis`
- `V. CONCLUSIONS`

Detected figures/tables:

- Fig. 1: RGB-D case overview and static-map output
- Fig. 2: proposed pipeline block diagram
- Fig. 3: multi-view geometry depth-change test
- Fig. 4: geometry/deep learning/combined dynamic-object segmentation comparison
- Fig. 5: qualitative input/output with background inpainting
- Fig. 6: RGB-D DynaSLAM (N+G+BI) block diagram
- Fig. 7: TUM `fr3/walking_xyz` trajectory comparison
- Table I: DynaSLAM RGB-D variants
- Table II: DynaSLAM vs ORB-SLAM2 for RGB-D
- Table III: comparison with dynamic-scene RGB-D SLAM systems
- Table IV: monocular ORB-SLAM vs DynaSLAM
- Table V: stereo DynaSLAM vs ORB-SLAM2
- Table VI: monocular ATE comparison
- Table VII: average computational time

## Paper Type

Type: system / pipeline paper.

Reference priority:

1. `ORB-SLAM2`: Visual SLAM system layout, sensor-mode comparison, evaluation brief.
2. `DROID-SLAM`: SLAM method page rhythm, compact paper identity, KO/EN replacement.
3. `Khronos`: equation/notation preservation, though DynaSLAM has fewer equations.

## Redesign Direction

Main reading thesis:

DynaSLAM should be read as an ORB-SLAM2-based dynamic-scene extension that separates two problems:

1. prevent dynamic-object features from corrupting tracking/mapping;
2. reconstruct reusable static background where dynamic objects occluded the scene.

The page should not over-emphasize “we made it” style notes. It should use the PDF’s official framing:

- scene rigidity assumption limits visual SLAM in populated real-world scenes;
- DynaSLAM adds dynamic object detection and background inpainting to ORB-SLAM2;
- detection uses deep learning, multi-view geometry, or both;
- RGB-D supports background inpainting and static map reuse;
- gains are strongest in highly dynamic scenarios, while speed trade-offs remain important.

## Candidate Conversion Plan

### Top Summary

- Compact paper title only, no large H1.
- `핵심 요약`
- Contribution grid:
  - ORB-SLAM2 기반 dynamic SLAM extension
  - CNN-based a priori dynamic object segmentation
  - RGB-D multi-view geometry dynamic segmentation
  - static-map construction and background inpainting
  - accuracy/speed trade-off evaluation
- Visual summary:
  - sensor-mode flow: Monocular/Stereo path vs RGB-D path
  - dynamic content handling ladder: detect -> exclude from tracking/mapping -> inpaint background -> static map reuse
- Insight:
  - DynaSLAM’s key idea is not just masking moving objects; it separates tracking reliability from long-term map usability.

### Deep Dive

Preservation pass: the former raw-note drawer has been removed after its core details were represented in the visible `논문 상세 정리` flow:

- Related Work: toggle with taxonomy summary first.
- System Description: keep core sections expanded, convert `Mono/Stereo/RGB-D` and module roles to summary tables/cards.
- Mask R-CNN + Multi-view Geometry: keep Fig. 3/Fig. 4 near the explanation and preserve inline notation.
- Background Inpainting: keep as prose, not a yellow note/table.
- Evaluation: use Result Brief by dataset/claim, then preserve existing figures/tables.
- Timing Analysis: compact table/card around speed bottlenecks.
- 느낀점/향후 계획: original page did not contain meaningful personal notes, so keep placeholders only: `(작성중...)` / `(Writing...)`.
- Table math tokens: geometry notation table uses table-scoped `.math-token` baseline, separate from body inline equation chip offset.

### Toggle Candidates

- Related Work detailed list
- Multi-view geometry notation and threshold details
- TUM/KITTI dataset condition details
- Extra comparison tables if they interrupt flow

## Unit 1 Gate Result

Gate status: pass for setup/inventory.

- PDF exists and is readable with bundled `pypdf`.
- Existing page exists and has been checkpointed.
- Figure and equation counts were captured.
- Paper type and reference set were selected.
- Next unit should perform content architecture, not CSS/JS polishing yet.
