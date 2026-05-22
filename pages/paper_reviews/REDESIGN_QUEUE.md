# Paper Review Redesign Queue

이 문서는 `REDESIGN_PLAYBOOK.md`를 실제 작업 큐처럼 적용하기 위한 순차 진행표다. 한 번에 여러 논문을 동시에 개편하지 않고, 아래 순서에서 `in_progress`인 한 페이지만 작업한다.

> Current 10-page refresh queue: `pages/paper_reviews/REDESIGN_BATCH_10_QUEUE.md`
> This file remains as the historical queue/log for the earlier 7-page batch.

## Queue Rules

- 동시에 `in_progress` 상태인 페이지는 하나만 둔다.
- 각 페이지는 `REDESIGN_PLAYBOOK.md`의 10-Unit Component Workflow를 모두 통과해야 `done`으로 바꾼다.
- gate가 하나라도 실패하면 다음 페이지로 넘어가지 않고 현재 페이지에서 reference refinement를 먼저 수행한다.
- 각 페이지 개편 전에는 해당 PDF와 기존 HTML의 그림, 수식, heading, toggle 후보를 먼저 inventory한다.
- PDF 기반으로 기존 정리의 해석, 강조, 형광펜, 제목을 다시 판단한다. 기존 강조표현은 최종 기준이 아니다.
- 수식이 많은 논문은 numbered equation ledger를 먼저 만든다.
- `DROID-W`, `DynaSLAM`, `3D-Prior`는 현재 Git 기준 untracked 페이지이므로, 개편 전에 현재 복원본을 별도 checkpoint로 보존해야 한다.
- 한 페이지가 `done`이 되기 전까지 다른 pending 페이지의 HTML/CSS/JS는 수정하지 않는다.

## Reference Set

아래 6개 페이지를 reference set으로 사용한다.

| Reference | 주로 비교할 것 |
| --- | --- |
| `ORB-SLAM2` | 전체 구조, 상단 요약, flow diagram, 수식 chip, 오른쪽 책갈피, toggle UX |
| `DROID-SLAM` | SLAM 계열 system/method page 구성, DBA/optimization 설명, 영어 전환 |
| `3D_SG` | representation/scene graph 계열의 visual summary와 장문 분해 |
| `3D_DSG` | 계층/관계 구조, brief chip, figure size 보존 |
| `SLIM-VDB` | 긴 supplement toggle, contained focus panel, semantic mapping 계열 정리 |
| `Khronos` | 수식 ledger, block equation tag, notation/factorization toggle 보존 |

## Active Queue

| Order | Status | Page | PDF | Page Path | Notes |
| --- | --- | --- | --- | --- | --- |
| 1 | done | DynaSLAM | `/Users/song-useog/Desktop/Portfolio/git_papers/DynaSLAM- Tracking, Mapping and Inpainting in Dynamic Scenes.pdf` | `pages/paper_reviews/DynaSLAM/` | Redesigned from checkpointed legacy page. |
| 2 | done | DROID-W | `/Users/song-useog/Desktop/Portfolio/git_papers/DROID-SLAM in the Wild.pdf` | `pages/paper_reviews/DROID-W/` | Redesigned from checkpointed legacy page. |
| 3 | done | 3D-Prior | `/Users/song-useog/Desktop/Portfolio/git_papers/Dynamic Visual SLAM using a General 3D Prior.pdf` | `pages/paper_reviews/3D-Prior/` | Redesigned from checkpointed legacy page. |
| 4 | done | VGGT | `/Users/song-useog/Desktop/Portfolio/git_papers/VGGT.pdf` | `pages/paper_reviews/VGGT/` | Redesigned from checkpointed legacy page. |
| 5 | done | VGGT-SLAM | `/Users/song-useog/Desktop/Portfolio/git_papers/VGGT-SLAM.pdf` | `pages/paper_reviews/VGGT-SLAM/` | Redesigned from checkpointed legacy page. |
| 6 | done | NeRF | `/Users/song-useog/Desktop/Portfolio/git_papers/NeRF.pdf` | `pages/paper_reviews/NeRF/` | Redesigned from checkpointed legacy page. |
| 7 | done | Chamelion | `/Users/song-useog/Desktop/Portfolio/git_papers/Chamelion.pdf` | `pages/paper_reviews/Chamelion/` | Redesigned from checkpointed legacy page. |

## Per-Page Completion Log

작업이 끝난 페이지는 아래 형식으로 기록한다.

```text
### Page
- PDF checked:
- Inventory checked:
- Unit gates passed:
- KO/EN checked:
- Formula checked:
- Image size checked:
- Toggle/focus checked:
- Browser checked:
- Reference comparison:
- Residual risk:
```

### DynaSLAM Progress

- Current unit: complete
- Unit 1 inventory: pass
- Unit 2-8 implementation: pass
- Unit 9-10 regression: pass
- Checkpoint: `pages/paper_reviews/_redesign_checkpoints/DynaSLAM_legacy_20260520/`
- Inventory note: `pages/paper_reviews/DynaSLAM/REDESIGN_INVENTORY.md`
- Static checks: `node --check`, `git diff --check`
- Browser checks: KO/EN language switch, right bookmark, deep-dive reveal, supplement focus panel, image width, no horizontal overflow
- Next action: start Unit 1 inventory for `DROID-W`.

### DROID-W Progress

- Current unit: complete
- Unit 1 inventory: pass
- Unit 2-8 implementation: pass
- Unit 9-10 regression: pass
- Checkpoint: `pages/paper_reviews/_redesign_checkpoints/DROID-W_legacy_20260520/`
- Inventory note: `pages/paper_reviews/DROID-W/REDESIGN_INVENTORY.md`
- Static checks: `node --check`, `git diff --check`
- Browser checks: KO/EN language switch, right bookmark, deep-dive reveal, structured supplement focus panel, image width, no horizontal overflow
- Follow-up fix: former raw-note drawer removed after core material was folded into the main body.
- Next action: start Unit 1 inventory for `3D-Prior`.

### 3D-Prior Progress

- Current unit: complete
- Unit 1 inventory: pass
- Unit 2-8 implementation: pass
- Unit 9-10 regression: pass
- Checkpoint: `pages/paper_reviews/_redesign_checkpoints/3D-Prior_legacy_20260520/`
- Inventory note: `pages/paper_reviews/3D-Prior/REDESIGN_INVENTORY.md`
- Static checks: `node --check`, `git diff --check`
- Browser checks: KO/EN language switch, right bookmark, deep-dive reveal, structured supplement focus panel, image width, no horizontal overflow
- Preservation check: former raw-note drawer removed after core material was folded into the main body.
- Next action: start Unit 1 inventory for `VGGT`.

### VGGT Progress

- Current unit: complete
- Unit 1 inventory: pass
- Unit 2-8 implementation: pass
- Unit 9-10 regression: pass
- Checkpoint: `pages/paper_reviews/_redesign_checkpoints/VGGT_legacy_20260520/`
- Inventory note: `pages/paper_reviews/VGGT/REDESIGN_INVENTORY.md`
- Static checks: `node --check`, `git diff --check`
- Browser checks: KO/EN language switch, right bookmark, deep-dive reveal, structured supplement focus panel, image width, no horizontal overflow
- Preservation check: former raw-note drawer removed after core material was folded into the main body.
- Next action: start Unit 1 inventory for `VGGT-SLAM`.

### VGGT-SLAM Progress

- Current unit: complete
- Unit 1 inventory: pass
- Unit 2-8 implementation: pass
- Unit 9-10 regression: pass
- Checkpoint: `pages/paper_reviews/_redesign_checkpoints/VGGT-SLAM_legacy_20260520/`
- Inventory note: `pages/paper_reviews/VGGT-SLAM/REDESIGN_INVENTORY.md`
- Static checks: `node --check`, `git diff --check`
- Browser checks: KO/EN language switch, right bookmark, deep-dive reveal, structured supplement focus panel, image width, no horizontal overflow
- Preservation check: former raw-note drawer removed after core material was folded into the main body.
- Source check: official repository link verified as `https://github.com/MIT-SPARK/VGGT-SLAM`.
- Next action: start Unit 1 inventory for `NeRF`.

### NeRF Progress

- Current unit: complete
- Unit 1 inventory: pass
- Unit 2-8 implementation: pass
- Unit 9-10 regression: pass
- Checkpoint: `pages/paper_reviews/_redesign_checkpoints/NeRF_legacy_20260520/`
- Inventory note: `pages/paper_reviews/NeRF/REDESIGN_INVENTORY.md`
- Static checks: `node --check`, `git diff --check`
- Browser checks: KO/EN language switch, right bookmark, deep-dive reveal, structured supplement focus panel, image width, no horizontal overflow
- Preservation check: former raw-note drawer removed after core material was folded into the main body.
- Next action: start Unit 1 inventory for `Chamelion`.

### Chamelion Progress

- Current unit: complete
- Unit 1 inventory: pass
- Unit 2-8 implementation: pass
- Unit 9-10 regression: pass
- Checkpoint: `pages/paper_reviews/_redesign_checkpoints/Chamelion_legacy_20260520/`
- Inventory note: `pages/paper_reviews/Chamelion/REDESIGN_INVENTORY.md`
- Static checks: `node --check`, `git diff --check`
- Browser checks: KO/EN language switch, right bookmark, deep-dive reveal, structured supplement focus panel, image width, no horizontal overflow
- Preservation check: raw detailed-note drawer removed after core notation, confidence target, inference threshold, training setting, and metric context were integrated into the main body.
- Source check: official project/additional-material page included as `https://chamelion-pages.github.io/`.
- Next action: queue complete unless a new paper is added.
