# Chamelion Redesign Inventory

- PDF: `/Users/song-useog/Desktop/Portfolio/git_papers/Chamelion.pdf`
- Page: `pages/paper_reviews/Chamelion/`
- Checkpoint: `pages/paper_reviews/_redesign_checkpoints/Chamelion_legacy_20260520/`
- Redesign date: 2026-05-20

## Legacy Preservation Counts

| Item | Count | Preservation strategy |
| --- | ---: | --- |
| main paper figures/tables | 16 per language | Fig. 1-9 and Table I-VII are now represented in the main flow. |
| block equation figures | 9 per language | Eq. (1)-(12) are covered; grouped formulas keep original numbering ranges such as (2)-(3), (4)-(5), and (8)-(9). |
| inline equation tokens | 97 | Core notation is integrated into summary tables with compact inline-math chips. |
| native details/toggles | 4 | Related Work and metric/robustness formulas are folded in KO/EN panels with structured internal summaries. |
| legacy h1 | 1 | Removed from visible redesigned flow; official paper title moved to compact paper identity. |

## PDF Reading Ledger

| Section | Confirmed paper intent | Redesign decision |
| --- | --- | --- |
| Abstract / Introduction | Online LiDAR change detection must distinguish true structural change from occlusion and transient dynamics. | Top summary centers on confidence-aware change detection, not simple map-scan differencing. |
| Method III-A | Composition-based augmentation creates pseudo positive/negative changes from single-session scans. | Fig. 2 and a step table explain HD removal, object DB, and scan/map paste. |
| Method III-B/C | 4D sparse CNN predicts class and cross-visibility confidence through separate heads. | Dual-head table separates class head and confidence head with feature-level rationale. |
| Method III-D | Map update uses confidence thresholds and recursive Bayesian log-odds. | Dedicated map-update section explains why low-confidence regions are not written into the map. |
| Experiments | Custom and LiSTA results evaluate scan-wise IoU and map-wise PR/RR/F1 separately. | Evaluation brief keeps dataset/metric roles explicit. |
| Ablation | Pseudo labels, dual head, feature division, HD removal, thresholds, voxel/registration sensitivity each support a specific claim. | Ablation table focuses on failure modes and design justification. |

## Verification Refinement Notes

- Fig. 1 was missing from the first redesign and has been restored from the PDF so the LD/PC/NC terminology is visually grounded before the taxonomy table.
- The former Table III image also contained Fig. 8. It has been split into separate Table III and Fig. 8 assets so captions and evidence match the PDF.
- Table VI was missing and is now included between Table V and Table VII in the ablation flow.
- Eq. (7) and Eq. (10) use a compact piecewise layout so the spacing no longer reads like a stretched line.
- 2026-05-22 reference refresh added the DROID-W-style TL;DR cue row, subsection labels before flow/comparison, `.caption-main` figure/table title emphasis, and placeholder personal notes.
- Visible helper labels were changed from generic `읽는 법` / `정리 노트` wording to section-specific labels such as `Map update 핵심` and `Ablation 핵심`.
- Personal-note policy for this batch is placeholder-only: `느낀점` / `향후 계획` use `(진행중...)`, English uses `(In progress...)`.
- 2026-05-22 DROID-W structure pass merged the detailed notes from source-section order into `Problem`, `Mechanism`, `Evidence`, and `Usage / Limits`. The old Abstract/Introduction/Method/Map Update/Experiments/Ablation/Conclusion sequence is now used only as source material, not as the visible reading order.
- 2026-05-22 caption pass added PDF-grounded caption notes to all main image/table figures in both language panels: 16 Korean notes and 16 English notes. `caption-main` holds the number/title, while `caption-note` holds the claim-evidence interpretation.
- 2026-05-22 equation tag polish moved single-number equations `(1)`, `(6)`, `(7)` and grouped equations `(2)-(3)`, `(4)-(5)`, `(8)-(9)`, `(10)` to stable right-edge gutter or row-tag layouts while preserving the existing KaTeX bodies.
- Eq. (1)'s union symbol was baseline-adjusted, row tags `(2)` and `(3)` were shifted slightly inward, and legacy embedded duplicate tags were hidden where they conflicted with the right-gutter tag.
- A stray `>` after the Eq. `(8)-(9)` figure was removed from both KO and EN panels. Final source scan reports zero `</figure>>` patterns.

## Gate Checklist

- [x] PDF consulted before writing claims.
- [x] Official source/additional-material link included from paper.
- [x] No large hero H1; compact paper identity only.
- [x] KO/EN panels included in the same page.
- [x] Core material from the previous detailed-note drawer integrated into the main body; raw drawer removed.
- [x] Related work and metric details folded into supplement toggles.
- [x] Prose is not only fragmentary; key method and conclusion sections keep explanatory sentences.
- [x] Static gate passed after final figure/table restoration.
- [x] Browser gate passed for KO/EN figure width, bookmark labels, supplement focus panel, and equation layout.
- [x] All image/table figures use `caption-main`; PDF-grounded explanation lines use `caption-note`.
- [x] Single and grouped equation tags are right-aligned without duplicated visible tags.
- [x] No stray text node remains after equation figures.
- [x] Chamelion-specific lessons were propagated to `pages/paper_reviews/REDESIGN_PLAYBOOK.md`.
