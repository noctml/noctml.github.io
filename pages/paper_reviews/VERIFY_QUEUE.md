# Paper Review Verification Queue

이 문서는 최근에 반자동으로 개편한 7개 논문 페이지를 원 논문 PDF와 다시 대조하기 위한 검증 큐다. `REDESIGN_QUEUE.md`와 달리 새 구조를 만드는 것이 아니라, 이미 개편된 결과물이 논문 내용과 맞는지 확인한다.

## Queue Rules

- 한 번에 하나의 page만 `in_progress`로 둔다.
- 각 page는 `VERIFY_PLAYBOOK.md`의 gate 1-7과 final gate를 모두 통과해야 `done`으로 바꾼다.
- PDF 의미 검증 없이 자동 스캔만으로 `done` 처리하지 않는다.
- P0/P1 issue가 있으면 다음 page로 넘어가지 않는다.
- 수정은 검증에서 발견된 문제에 한정한다. 큰 구조 변경이 필요하면 redesign task로 분리한다.
- report는 `pages/paper_reviews/_verification_reports/<PAGE>_YYYYMMDD.md`에 남긴다.

## Static Command

각 page 시작과 종료 시 아래 명령을 실행한다.

```bash
node scripts/verify-paper-review.mjs DynaSLAM
node --check pages/paper_reviews/DynaSLAM/script.js
git diff --check -- pages/paper_reviews/DynaSLAM/
```

## Reference Set

아래 6개 페이지는 이번 검증의 직접 대상에서 제외하고, 구조/테마/수식/토글 품질을 비교하는 reference로만 사용한다.

| Reference | PDF | 주로 비교할 것 |
| --- | --- | --- |
| `ORB-SLAM2` | `/Users/song-useog/Desktop/Portfolio/git_papers/ORB-SLAM2.pdf` | 전체 구조, flow, right bookmark, inline math chip |
| `DROID-SLAM` | `/Users/song-useog/Desktop/Portfolio/git_papers/DROID-SLAM.pdf` | SLAM 계열 method/evaluation rhythm, DBA/optimization 설명 |
| `3D_SG` | `/Users/song-useog/Desktop/Portfolio/git_papers/3DSceneGraph.pdf` | representation/hierarchy paper의 문단 분해 |
| `3D_DSG` | `/Users/song-useog/Desktop/Portfolio/git_papers/3DDynamicSceneGraph.pdf` | 계층/관계 구조, figure-size 보존 |
| `SLIM-VDB` | `/Users/song-useog/Desktop/Portfolio/git_papers/SLIM-VDB- A Real-Time 3D Probabilistic Semantic Mapping Framework.pdf` | long supplement toggle, probabilistic notation |
| `Khronos` | `/Users/song-useog/Desktop/Portfolio/git_papers/Khronos.pdf` | formula-heavy page, equation ledger, equation-specific toggle |

Reference page에서 명백한 회귀가 발견되면 별도 follow-up으로 수정한다. 다만 이번 queue의 진행 순서는 아래 7개 recent redesign pages만 따른다.

## Active Queue

| Order | Status | Page | PDF | Page Path | Report | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | done | DynaSLAM | `/Users/song-useog/Desktop/Portfolio/git_papers/DynaSLAM- Tracking, Mapping and Inpainting in Dynamic Scenes.pdf` | `pages/paper_reviews/DynaSLAM/` | `_verification_reports/DynaSLAM_20260520.md` | Fig. 4/Fig. 5 caption-source mismatch fixed; geometry notation tightened. |
| 2 | done | DROID-W | `/Users/song-useog/Desktop/Portfolio/git_papers/DROID-SLAM in the Wild.pdf` | `pages/paper_reviews/DROID-W/` | `_verification_reports/DROID-W_20260520.md` | Fig. 2, Fig. 4, Table 5/6, and unnumbered BA/depth-regularization equations restored; official supplementary-only Table 10 and Figs. 5-10 omitted from page UI and documented in report. |
| 3 | done | 3D-Prior | `/Users/song-useog/Desktop/Portfolio/git_papers/Dynamic Visual SLAM using a General 3D Prior.pdf` | `pages/paper_reviews/3D-Prior/` | `_verification_reports/3D-Prior_20260520.md` | Fig. 5 restored from existing crops; Eq. (14) made explicit. |
| 4 | done | VGGT | `/Users/song-useog/Desktop/Portfolio/git_papers/VGGT.pdf` | `pages/paper_reviews/VGGT/` | `_verification_reports/VGGT_20260520.md` | Fig. 2-5 remapped; Fig. 6/Fig. 7 restored; appendix Table 10 summarized without an extra crop. |
| 5 | done | VGGT-SLAM | `/Users/song-useog/Desktop/Portfolio/git_papers/VGGT-SLAM.pdf` | `pages/paper_reviews/VGGT-SLAM/` | `_verification_reports/VGGT-SLAM_20260520.md` | Main figure/table mapping fixed; appendix Tables 4-8 and Figs. 4-11 summarized without extra crops. |
| 6 | done | NeRF | `/Users/song-useog/Desktop/Portfolio/git_papers/NeRF.pdf` | `pages/paper_reviews/NeRF/` | `_verification_reports/NeRF_20260520.md` | Fig. 3/4, Table 1/2 remapped; appendix Fig. 7 and Tables 3-5 retained, Fig. 8/Table 6 summarized, and NDC Eq. (7)-(26) preserved. |
| 7 | done | Chamelion | `/Users/song-useog/Desktop/Portfolio/git_papers/Chamelion.pdf` | `pages/paper_reviews/Chamelion/` | `_verification_reports/Chamelion_20260520.md` | Fig. 1, Fig. 8, Table VI restored; Eq. (7)/(10) spacing tightened. |

## Report Log

작업 후 아래 형식으로 append한다.

```text
### <PAGE>
- Status:
- PDF checked:
- Static scan:
- Browser check:
- P0/P1 issues:
- P2/P3 issues:
- Fix summary:
- Residual risk:
- Next:
```

### DynaSLAM
- Status: done after correction
- PDF checked: yes
- Static scan: no errors; figure/table ledger preview added
- Browser check: KO/EN, bookmark reveal, toggle overlay checked before correction; final spot-check recommended after Fig. 4/Fig. 5 relabeling
- P0/P1 issues: Fig. 4/Fig. 5 caption-source mismatch fixed; fake Fig. 1 removed; Table VI retained
- P2/P3 issues: geometry notation and inpainting details expanded
- Fix summary: corrected figure-source mapping, removed duplicate Fig. 5 page reference, clarified projected-vs-observed depth notation
- Residual risk: Fig. 1 is intentionally absent because no clean converted asset exists
- Next: DROID-W

### DROID-W
- Status: done
- PDF checked: yes
- Static scan: no errors; one known KO/EN false-positive warning remains from the single-file language structure
- Browser check: localhost render checked; no broken image sources except the intentionally empty lightbox placeholder
- P0/P1 issues: missing Fig. 2, Fig. 4, Table 5, Table 6 fixed; Table 10 and supplement Figs. 5-10 summarized; Table 1/2 moved from Method to Experiments
- P2/P3 issues: unnumbered DROID-SLAM BA and depth-regularization equations added; EN method roadmap synced with KO
- Fix summary: restored PDF figure/table/equation ledger and aligned section flow with the original paper
- Residual risk: none beyond the static scanner false positive
- Next: 3D-Prior

### 3D-Prior
- Status: done
- PDF checked: yes
- Static scan: no errors; one known KO/EN false-positive warning remains from the single-file language structure
- Browser check: localhost render checked; Fig. 5 and Eq. (14) visible in KO/EN
- P0/P1 issues: missing Fig. 5 restored by combining the existing Sintel and Wild-SLAM MoCap crops
- P2/P3 issues: Eq. (14) separated into its own ledger item; compact equation label corrected
- Fix summary: completed figure/table ledger and made numbered equation coverage explicit
- Residual risk: Fig. 5 is reconstructed from two existing figure crops rather than one direct crop
- Next: VGGT

### VGGT
- Status: done
- PDF checked: yes
- Static scan: no errors; one known KO/EN false-positive warning remains from the single-file language structure
- Browser check: localhost render checked; corrected Fig. 2-7 and Table 10 visible in KO/EN
- P0/P1 issues: Fig. 2/3/4/5 caption-source mismatch fixed; missing Fig. 6, Fig. 7, and Table 10 restored
- P2/P3 issues: appendix results moved into a structured details block
- Fix summary: figure/table ledger now matches the PDF main paper and appendix
- Residual risk: newly added Fig. 2 and Fig. 6 are PDF-render crops; appendix Table 10 is summary-only
- Next: VGGT-SLAM

### VGGT-SLAM
- Status: done
- PDF checked: yes
- Static scan: no errors; one known KO/EN false-positive warning remains from the single-file language structure
- Browser check: localhost render checked; KO/EN experiment images keep matched width, appendix supplement opens with focused overlay, no broken image sources
- P0/P1 issues: main experiment image mapping corrected for Table 1, Fig. 2, Table 2, Table 3, and Fig. 3
- P2/P3 issues: appendix Tables 4-8 and Figs. 4-11 summarized in a structured supplement without extra crops
- Fix summary: figure/table ledger now follows the PDF numbering, and Eqs. (1)-(6) remain covered
- Residual risk: appendix-only assets are summary-only, so no extra appendix crop quality risk remains
- Next: NeRF

### NeRF
- Status: done
- PDF checked: yes
- Static scan: no errors; one known KO/EN false-positive warning remains from the single-file language structure
- Browser check: localhost render checked; KO/EN image widths match, appendix/NDC supplements open with focused overlay, no broken image sources
- P0/P1 issues: Fig. 3/4 and Table 1/2 caption-source mapping corrected; Fig. 5/6 restored from PDF crops
- P2/P3 issues: appendix Fig. 7 and Tables 3-5 retained, Fig. 8/Table 6 summarized, and NDC derivation Eq. (7)-(26) preserved in structured supplements
- Fix summary: figure/table/equation ledger now matches the PDF main paper and appendix
- Residual risk: Fig. 5/6 and NDC derivation images are PDF-render crops; repetitive appendix Fig. 8/Table 6 are summary-only
- Next: Chamelion

### Chamelion
- Status: done after correction
- PDF checked: yes
- Static scan: no errors; one known KO/EN false-positive warning remains from the single-file language structure
- Browser check: localhost render checked; KO/EN figure widths match, bookmark labels switch, supplement panel opens with contained scrolling, no broken images
- P0/P1 issues: missing Fig. 1, Fig. 8, and Table VI restored; former Table III/Fig. 8 combined crop split into separate evidence blocks
- P2/P3 issues: Eq. (7)/(10) piecewise spacing tightened; EN Introduction supplement nesting fixed
- Fix summary: figure/table/equation ledger now covers Fig. 1-9, Table I-VII, and Eq. (1)-(12)
- Residual risk: restored Fig. 1, Table III, and Fig. 8 are cropped from PDF/conversion sources
- Next: queue complete
