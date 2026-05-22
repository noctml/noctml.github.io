# Chamelion Verification Report

- Date: 2026-05-20
- Page: `pages/paper_reviews/Chamelion/`
- PDF: `/Users/song-useog/Desktop/Portfolio/git_papers/Chamelion.pdf`
- Status: done after correction

## PDF Ledger Check

| Item | Result |
| --- | --- |
| Figures | Fig. 1-9 covered in KO/EN. Fig. 1 restored; Fig. 8 split out from the former Table III crop. |
| Tables | Table I-VII covered in KO/EN. Table VI restored between Table V and Table VII. |
| Equations | Eq. (1)-(12) covered. Grouped equation blocks preserve original numbering ranges. |
| Related Work | Dataset generation and LiDAR change-detection families preserved in a structured supplement. |
| Evaluation claims | Custom/LiSTA, voxel/registration robustness, HD removal, runtime, supervision, dual-head, and threshold ablations checked against the PDF flow. |

## Fixes Applied

- Restored missing Fig. 1 from the PDF so the LD / PC / NC explanation has visual grounding.
- Split the combined Table III / Fig. 8 asset into `media_table3_hd_removal.png` and `media_fig8_hd_removal.png`.
- Restored missing Table VI for LiSTA manual-vs-pseudo supervision.
- Adjusted piecewise equation CSS for Eq. (7) and Eq. (10), reducing stretched spacing while preserving tags.
- Fixed the English Introduction structure so the Related Work supplement is not nested inside the taxonomy summary panel.

## Gates

- Static scan: `node scripts/verify-paper-review.mjs Chamelion` passed with no errors; remaining warning is the known single-file KO/EN false positive.
- JS syntax: `node --check pages/paper_reviews/Chamelion/script.js` passed.
- Browser: KO and EN panels checked on localhost. Figure widths match, no missing images, bookmark labels switch to English, and a supplement panel opens at the topbar offset with contained scrolling.

## Residual Risk

- Fig. 1, Table III, and Fig. 8 are regenerated/cropped from available PDF or converted assets rather than coming from pre-existing Notion image exports.
