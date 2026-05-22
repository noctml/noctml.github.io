# 10-Page Paper Review Redesign Queue

이 큐는 `ORB-SLAM2`, `DROID-W`, `DynaSLAM`을 제외한 10개 논문 페이지를 한 페이지씩 다시 개편하기 위한 반자동 진행표다. 한 번에 여러 페이지를 동시에 수정하지 않고, 현재 row 하나가 gate를 통과하면 다음 row로 넘어간다.

## Scope

- 제외: `ORB-SLAM2`, `DROID-W`, `DynaSLAM`
- active reference: `DROID-W`
- absorbed reference QA: `ORB-SLAM2`의 paired figure, 원본 KaTeX 복원, equation caption baseline, 한글 caption 정리 규칙
- recent regression lessons: `DynaSLAM`의 table math-token baseline 분리, 빈 개인 메모 placeholder 처리
- workflow: `REDESIGN_PLAYBOOK.md`의 10-Unit Component Workflow
- 검증 단위: page 하나당 `inventory -> implementation -> static QA -> browser QA -> final DROID-W-primary regression`

## Personal Note Policy

`느낀점`과 `향후 계획`은 아래 2개 대상 페이지에서만 기존 내용을 참고한다.

- `DROID-SLAM`
- `3D_SG`

`ORB-SLAM2`는 개인 메모 보존 reference지만 이번 10-page queue의 작업 대상이 아니다. 나머지 8개 대상 페이지는 기존 내용이 있더라도 새 개편본에서는 개인 메모를 확장하거나 재해석하지 않는다.

- 한글: `(진행중...)`
- 영어: `(In progress...)`

이 정책은 논문 내용 요약을 줄이라는 뜻이 아니다. `Problem`, `Mechanism`, `Evidence`, `Usage / Limits`, `Conclusion`은 PDF를 기준으로 충분히 정리하되, 개인 감상/계획 section만 placeholder로 둔다.

## Queue Rules

- 동시에 `in_progress`는 하나만 허용한다.
- 새 페이지 시작 전 `node scripts/paper-redesign-next.mjs`로 다음 target을 확인한다.
- 사용자의 시작 사인이 있으면 `node scripts/paper-redesign-next.mjs --start-next`로 첫 pending row를 `in_progress`로 바꾼 뒤 그 페이지 하나만 작업한다.
- 각 페이지는 개편 전 PDF, 기존 HTML, asset, figure/table, equation, personal-note policy를 inventory에 기록한다.
- 사용자가 넣지 않은 supplementary figure/table 이미지는 기본 추가하지 않는다.
- equation은 원본 KaTeX block을 우선 보존하고, tag 위치만 필요한 만큼 보정한다.
- equation caption 내부 inline 수식은 caption 전용 baseline scope로 검증한다.
- 본문 inline 수식과 table/brief 내부 `.math-token` baseline은 별도 scope로 검증한다.
- paired figure/table은 의도된 row 구성과 같은 높이감을 유지한다.
- 한글 caption은 완전한 영어 설명문으로 남기지 않는다. technical term은 필요한 만큼만 유지한다.
- `DROID-W`와 비슷하게 보이게 만드는 것이 목적이 아니라, DROID-W 수준의 구조/검증 품질에 도달하는 것이 목적이다.
- page 하나가 final gate를 통과하기 전까지 다음 page의 HTML/CSS/JS를 수정하지 않는다.

## Active Queue

| Order | Status | Page | PDF | Page Path | Personal Note Policy | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | done | DROID-SLAM | `/Users/song-useog/Desktop/Portfolio/git_papers/DROID-SLAM.pdf` | `pages/paper_reviews/DROID-SLAM/` | preserve existing | Refresh to DROID-W-primary workflow while preserving existing personal notes. |
| 2 | done | 3D_SG | `/Users/song-useog/Desktop/Portfolio/git_papers/3DSceneGraph.pdf` | `pages/paper_reviews/3D_SG/` | preserve existing | Refresh representation paper structure while preserving existing personal notes. |
| 3 | done | 3D_DSG | `/Users/song-useog/Desktop/Portfolio/git_papers/3DDynamicSceneGraph.pdf` | `pages/paper_reviews/3D_DSG/` | placeholder | Use `(진행중...)` / `(In progress...)`. |
| 4 | done | SLIM-VDB | `/Users/song-useog/Desktop/Portfolio/git_papers/SLIM-VDB- A Real-Time 3D Probabilistic Semantic Mapping Framework.pdf` | `pages/paper_reviews/SLIM-VDB/` | placeholder | Use `(진행중...)` / `(In progress...)`. |
| 5 | done | Khronos | `/Users/song-useog/Desktop/Portfolio/git_papers/Khronos.pdf` | `pages/paper_reviews/Khronos/` | placeholder | Formula-heavy page; use equation ledger only as internal inventory, not visible page title. |
| 6 | done | 3D-Prior | `/Users/song-useog/Desktop/Portfolio/git_papers/Dynamic Visual SLAM using a General 3D Prior.pdf` | `pages/paper_reviews/3D-Prior/` | placeholder | Use `(진행중...)` / `(In progress...)`. |
| 7 | done | VGGT | `/Users/song-useog/Desktop/Portfolio/git_papers/VGGT.pdf` | `pages/paper_reviews/VGGT/` | placeholder | Use `(진행중...)` / `(In progress...)`. |
| 8 | done | VGGT-SLAM | `/Users/song-useog/Desktop/Portfolio/git_papers/VGGT-SLAM.pdf` | `pages/paper_reviews/VGGT-SLAM/` | placeholder | Use `(진행중...)` / `(In progress...)`. |
| 9 | done | NeRF | `/Users/song-useog/Desktop/Portfolio/git_papers/NeRF.pdf` | `pages/paper_reviews/NeRF/` | placeholder | Formula-heavy rendering page; preserve original equation shapes. |
| 10 | done | Chamelion | `/Users/song-useog/Desktop/Portfolio/git_papers/Chamelion.pdf` | `pages/paper_reviews/Chamelion/` | placeholder | Use `(진행중...)` / `(In progress...)`. |

## Per-Page Gate Template

각 페이지 완료 후 아래 형식으로 completion log를 추가한다.

```text
### <Page>
- Status:
- PDF checked:
- Inventory:
- Personal note policy:
- Unit 1-10 gates:
- Static checks:
- Browser checks:
- Formula/table math baseline:
- Equation caption baseline:
- Paired figure/table check:
- Image/table source check:
- KO/EN check:
- DROID-W-primary regression:
- Residual risk:
```

## Start Commands

```bash
node scripts/paper-redesign-next.mjs
node scripts/paper-redesign-next.mjs --start-next
```

첫 번째 명령은 현재 큐에서 가장 먼저 남은 page, PDF, page path, 개인 메모 정책을 출력한다. 두 번째 명령은 `in_progress`가 없을 때 첫 pending page를 `in_progress`로 바꾼다.
