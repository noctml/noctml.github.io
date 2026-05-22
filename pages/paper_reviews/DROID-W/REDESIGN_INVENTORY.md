# DROID-W Redesign Inventory

Status: Unit 1 inventory started  
PDF: `/Users/song-useog/Desktop/Portfolio/git_papers/DROID-SLAM in the Wild.pdf`  
Page: `pages/paper_reviews/DROID-W/`

## Baseline Checkpoint

Current restored legacy page is checkpointed at:

`pages/paper_reviews/_redesign_checkpoints/DROID-W_legacy_20260520/`

## Current Page Inventory

| Item | Count / State |
| --- | --- |
| figures | 26 |
| images | 14 |
| block equations | 14 |
| inline equation tokens | 43 |
| native details/toggles | 0 |
| current layout | legacy Notion-export style |

Current blockquote/section labels:

- `요약`
- `Introduction`
- `Related Works`
- `Proposed Method`
- `Experiment`
- `Ablation Study`
- `Conclusion`
- `Limitation`
- `DROID-W dataset`
- `YouTube Videos`
- `Uncertainty Optimization and Jacobians`
- `Additional Experiments`

## PDF Structure

PDF pages: 17

Detected paper sections:

- `1. Introduction`
- `2. Related Works`
- `3. Proposed Method`
- `3.1. Preliminaries`
- `3.2. Uncertainty-aware Bundle Adjustment`
- `3.3. Uncertainty Optimization`
- `3.4. SLAM System`
- `4. Experiments`
- `4.1. Experimental Results`
- `4.2. Ablation Study`
- `5. Conclusion`
- Supplementary sections around dataset, Jacobians, uncertainty estimation, point cloud reconstruction, additional ablation

Detected figures/tables:

- Fig. 2-10 in extracted PDF text
- Table 1-10, including Bonn/TUM/DyCheck/DROID-W tracking, runtime, ablation, dataset overview, YouTube video overview, FAST-LIVO2 GT check

## Paper Type

Type: system / method paper for dynamic SLAM.

Reference priority:

1. `DROID-SLAM`: inherited DBA/system framing.
2. `DynaSLAM`: dynamic-scene SLAM comparison and segmentation/motion handling.
3. `Khronos`: equation/toggle preservation because this page contains many block equations and Jacobian details.

## Redesign Direction

Main reading thesis:

DROID-W should be read as a DROID-SLAM extension for truly in-the-wild dynamic RGB SLAM. Its key move is uncertainty-aware BA: uncertain/dynamic pixels should contribute less to optimization, while camera pose, geometry, and uncertainty are iteratively refined together.

The page should avoid treating the method as just “DROID-SLAM + dynamic mask.” The PDF emphasizes:

- dynamic/static inconsistencies are estimated from multi-view feature inconsistency;
- uncertainty is embedded inside differentiable BA;
- the system jointly updates dynamic uncertainty, camera pose, and scene geometry;
- in-the-wild RGB sequences introduce reflections, shadows, small moving objects, exposure issues, and long outdoor trajectories;
- the DROID-W dataset itself is part of the contribution.

## Unit 1 Gate Result

Gate status: pass for setup/inventory.

- PDF exists and is readable with bundled `pypdf`.
- Existing page exists and has been checkpointed.
- Figure/equation counts were captured.
- Paper type and reference set were selected.
