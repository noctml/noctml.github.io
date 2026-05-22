# 11-Page Paper Review Redesign Queue

이 큐는 `DROID-W`와 `DynaSLAM`을 제외한 나머지 11개 논문 페이지를 한 페이지씩 다시 개편하기 위한 반자동 진행표다. 한 번에 여러 페이지를 동시에 수정하지 않고, 현재 row 하나가 gate를 통과하면 다음 row로 넘어간다.

## Scope

- 제외: `DROID-W`, `DynaSLAM`
- active reference: `DROID-W`
- 최근 회귀 교훈: `DynaSLAM`의 table math-token baseline 분리, 빈 개인 메모 placeholder 처리
- workflow: `REDESIGN_PLAYBOOK.md`의 10-Unit Component Workflow
- 검증 단위: page 하나당 `inventory -> implementation -> static QA -> browser QA -> final DROID-W regression`

## Personal Note Policy

`느낀점`과 `향후 계획`은 아래 3개 논문에서만 기존 내용을 참고한다.

- `ORB-SLAM2`
- `DROID-SLAM`
- `3D_SG`

나머지 8개 페이지는 기존 내용이 있더라도 새 개편본에서는 개인 메모를 확장하거나 재해석하지 않는다.

- 한글: `(진행중...)`
- 영어: `(In progress...)`

이 정책은 논문 내용 요약을 줄이라는 뜻이 아니다. `Problem`, `Mechanism`, `Evidence`, `Usage / Limits`, `Conclusion`은 PDF를 기준으로 충분히 정리하되, 개인 감상/계획 section만 placeholder로 둔다.

## Queue Rules

- 동시에 `in_progress`는 하나만 허용한다.
- 새 페이지 시작 전 `node scripts/paper-redesign-next.mjs`로 다음 target을 확인한다.
- 각 페이지는 개편 전 PDF, 기존 HTML, asset, figure/table, equation, personal-note policy를 inventory에 기록한다.
- 사용자가 넣지 않은 supplementary figure/table 이미지는 기본 추가하지 않는다.
- equation은 원본 KaTeX block을 우선 보존하고, tag 위치만 필요한 만큼 보정한다.
- 본문 inline 수식과 table/brief 내부 `.math-token` baseline은 별도 scope로 검증한다.
- `DROID-W`와 비슷하게 보이게 만드는 것이 목적이 아니라, DROID-W 수준의 구조/검증 품질에 도달하는 것이 목적이다.
- page 하나가 final gate를 통과하기 전까지 다음 page의 HTML/CSS/JS를 수정하지 않는다.

## Active Queue

| Order | Status | Page | PDF | Page Path | Personal Note Policy | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | done | ORB-SLAM2 | `/Users/song-useog/Desktop/Portfolio/git_papers/ORB-SLAM2.pdf` | `pages/paper_reviews/ORB-SLAM2/` | preserve existing | Refreshed to DROID-W workflow; preserved existing personal notes; verified language, reveal, toggle, lightbox, and equation rendering. |
| 2 | pending | DROID-SLAM | `/Users/song-useog/Desktop/Portfolio/git_papers/DROID-SLAM.pdf` | `pages/paper_reviews/DROID-SLAM/` | preserve existing | Refresh to DROID-W workflow while preserving existing personal notes. |
| 3 | pending | 3D_SG | `/Users/song-useog/Desktop/Portfolio/git_papers/3DSceneGraph.pdf` | `pages/paper_reviews/3D_SG/` | preserve existing | Refresh representation paper structure while preserving existing personal notes. |
| 4 | pending | 3D_DSG | `/Users/song-useog/Desktop/Portfolio/git_papers/3DDynamicSceneGraph.pdf` | `pages/paper_reviews/3D_DSG/` | placeholder | Use `(진행중...)` / `(In progress...)`. |
| 5 | pending | SLIM-VDB | `/Users/song-useog/Desktop/Portfolio/git_papers/SLIM-VDB- A Real-Time 3D Probabilistic Semantic Mapping Framework.pdf` | `pages/paper_reviews/SLIM-VDB/` | placeholder | Use `(진행중...)` / `(In progress...)`. |
| 6 | pending | Khronos | `/Users/song-useog/Desktop/Portfolio/git_papers/Khronos.pdf` | `pages/paper_reviews/Khronos/` | placeholder | Formula-heavy page; use equation ledger only as internal inventory, not visible page title. |
| 7 | pending | 3D-Prior | `/Users/song-useog/Desktop/Portfolio/git_papers/Dynamic Visual SLAM using a General 3D Prior.pdf` | `pages/paper_reviews/3D-Prior/` | placeholder | Use `(진행중...)` / `(In progress...)`. |
| 8 | pending | VGGT | `/Users/song-useog/Desktop/Portfolio/git_papers/VGGT.pdf` | `pages/paper_reviews/VGGT/` | placeholder | Use `(진행중...)` / `(In progress...)`. |
| 9 | pending | VGGT-SLAM | `/Users/song-useog/Desktop/Portfolio/git_papers/VGGT-SLAM.pdf` | `pages/paper_reviews/VGGT-SLAM/` | placeholder | Use `(진행중...)` / `(In progress...)`. |
| 10 | pending | NeRF | `/Users/song-useog/Desktop/Portfolio/git_papers/NeRF.pdf` | `pages/paper_reviews/NeRF/` | placeholder | Formula-heavy rendering page; preserve original equation shapes. |
| 11 | pending | Chamelion | `/Users/song-useog/Desktop/Portfolio/git_papers/Chamelion.pdf` | `pages/paper_reviews/Chamelion/` | placeholder | Use `(진행중...)` / `(In progress...)`. |

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
- Image/table source check:
- KO/EN check:
- DROID-W regression:
- Residual risk:
```

## Start Command

```bash
node scripts/paper-redesign-next.mjs
```

이 명령은 현재 큐에서 가장 먼저 남은 page, PDF, page path, 개인 메모 정책을 출력한다.
