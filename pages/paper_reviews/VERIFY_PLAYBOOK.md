# Paper Review Verification Playbook

이 문서는 이미 개편된 논문 페이지를 원 논문 PDF와 다시 대조하기 위한 검증 전용 파이프라인이다. 목적은 새 구조를 더 꾸미는 것이 아니라, 내용 정확성, 수식 보존, 그림/표 대응, 한/영 일관성, UI 회귀를 하나씩 확인하는 것이다.

## 0. Scope

- 이 playbook은 `REDESIGN_PLAYBOOK.md` 이후의 사후 검증에만 사용한다.
- 검증 중 발견된 문제는 필요한 범위에서만 수정한다. 새로운 요약 구조나 시각 요소를 크게 추가하는 작업은 별도 redesign task로 분리한다.
- 각 논문은 반드시 원 논문 PDF를 옆에 두고 검증한다.
- PDF와 페이지 내용이 충돌하면 PDF가 우선이다.
- 기존 페이지의 bold, highlight, 보조 문구, insight는 모두 재검증 대상이다. PDF 근거가 약하면 제거하거나 낮은 강조로 바꾼다.
- 기존 페이지에 사용자가 넣지 않은 figure/table 이미지를 새로 추가하는 것은 기본 동작이 아니다. 특히 supplementary material의 figure/table은 원칙적으로 이미지 삽입 대신 텍스트 요약 또는 report 기록으로 처리한다. 공식 supplementary material이 별도로 있는 경우 appendix-only 결과를 위한 별도 토글도 만들지 않는 것을 우선한다.
- 한 번에 여러 페이지를 동시에 수정하지 않는다. 한 페이지가 final gate를 통과한 뒤 다음 페이지로 넘어간다.

## 1. Severity

| Level | 의미 | 처리 |
| --- | --- | --- |
| P0 | 논문 의도와 반대이거나 핵심 claim/equation이 틀림 | 즉시 수정, 다음 gate 진행 금지 |
| P1 | 핵심 내용 누락, 수식 tag/notation 오류, figure-caption 불일치 | 해당 섹션 수정 후 같은 gate 재검증 |
| P2 | 문장 어색함, 요약이 과도하거나 장황함, Related Work/토글 밀도 부족 | 가능하면 즉시 수정, 기록 후 final gate에서 재확인 |
| P3 | 미세한 UI/문체/간격 문제 | 같은 페이지 수정 묶음에서 처리 |

## 2. Semi-Automatic Loop

각 페이지는 아래 순서로 진행한다.

1. `VERIFY_QUEUE.md`에서 현재 페이지를 `in_progress`로 둔다.
2. 자동 스캔을 실행한다.

```bash
node scripts/verify-paper-review.mjs DynaSLAM
```

3. 스캔 결과를 `pages/paper_reviews/_verification_reports/<PAGE>_YYYYMMDD.md`에 기록한다.
4. PDF를 보면서 gate 1-6을 순서대로 채운다.
5. 문제가 있으면 해당 페이지 파일만 수정한다.
6. 자동 스캔과 브라우저 확인을 다시 실행한다.
7. final gate가 통과하면 queue status를 `done`으로 바꾸고 다음 페이지로 이동한다.

자동 스캔은 보조 도구일 뿐이다. PDF 의미 검증, figure/table claim 대응, 실험 수치 확인은 사람이 직접 확인해야 한다.

## 3. Gate 1: Source Binding

목표: 검증 대상 page와 PDF가 정확히 연결되어 있는지 확인한다.

확인 항목:

- 공식 논문 제목, 저자/연도/venue 또는 arXiv 정보가 page의 meta title과 크게 어긋나지 않는가?
- page path와 PDF path가 `VERIFY_QUEUE.md`에 정확히 기록되어 있는가?
- PDF의 section 구조가 page의 `논문 상세 정리` section과 대응되는가?
- official project/GitHub/PDF link가 있으면 실제 논문과 관련이 명확한가?

Gate 통과 조건:

- [ ] PDF/page 매칭이 확실하다.
- [ ] 검증 기준으로 삼을 PDF가 하나로 고정되었다.
- [ ] page가 다루는 논문 제목이 PDF 제목과 충돌하지 않는다.

## 4. Gate 2: Claim Coverage

목표: 핵심 요약과 본문이 PDF의 주요 claim을 빠뜨리거나 왜곡하지 않았는지 확인한다.

PDF에서 먼저 뽑을 것:

| PDF 위치 | 반드시 확인할 내용 |
| --- | --- |
| Abstract | 문제, 제안 방법, 가장 큰 결과 |
| Introduction | 기존 방법의 한계, 논문이 해결하려는 gap |
| Method/System | 핵심 module, state variable, objective, pipeline |
| Experiments | dataset, metric, baseline, main result, ablation |
| Conclusion | 논문의 실제 결론과 limitation |
| Appendix / Supplement | 본문 이해에 필요한 보조 수식, 구현 조건, 핵심 claim을 바꾸는 추가 실험. 단, 사용자가 넣지 않은 supplementary figure/table 이미지는 기본적으로 추가하지 않음 |

Page에서 확인할 것:

- `핵심 요약`이 PDF의 contribution을 3-5개 안에서 정확히 담는가?
- TL;DR의 보조 설명이 짧은 소제목/한 줄 문장 수준으로 유지되고 장문 paragraph가 되지 않았는가?
- 독자용 insight가 PDF claim을 과장하지 않는가?
- `논문 상세 정리`가 원문 순서 나열이 아니라 `Problem -> Mechanism -> Evidence -> Usage / Limits` 질문 순서로 재구성되어 있는가?
- `Problem`은 Introduction/Related Work/Conclusion의 문제 제기를 통합해 기존 가정, 실패 상황, 기존 연구의 빈틈을 보여주는가?
- `Mechanism`은 가장 자세한 section이며, 어떤 문제를 어떤 method/state/objective/update로 푸는지 설명하는가?
- `Evidence`는 dataset 나열이 아니라 task/claim 중심으로 평가 설계와 결과를 연결하는가?
- `Usage / Limits`는 잘 맞는 적용 상황, 약한 조건, 필요한 가정, 후속 질문을 간략히 제시하는가?
- Related Work 토글이 너무 많이 생략되어 논문의 위치가 흐려지지 않는가?
- 느낀점/향후 계획은 개인 의견으로 분리되어 있고, 논문 claim처럼 보이지 않는가?

Gate 통과 조건:

- [ ] 핵심 contribution과 problem setting이 PDF와 일치한다.
- [ ] PDF의 main method가 page에서 충분히 설명된다.
- [ ] evaluation claim이 task, metric, dataset, baseline 근거 없이 과장되지 않는다.
- [ ] Related Work는 최소 `문헌군 -> 기존 한계 -> 이 논문 연결점` 구조를 가진다.

## 5. Gate 3: 수식 처리표

목표: 핵심 수식과 본문 이해에 필요한 notation/metric/appendix 수식이 누락되거나 깨지지 않았는지 확인한다. appendix/supplementary-only 수식은 자동 보존 대상이 아니며, 본문 claim과 직접 연결되지 않으면 의도적으로 제외한다.

검증 기준:

- numbered equation이 있는 논문은 PDF의 equation 번호를 전부 세고 page 위치를 기록한다.
- 핵심 objective/loss/update 식은 펼쳐 둔다.
- notation, projection, Jacobian, factorization, metric 같은 보조 수식은 토글 안에라도 보존한다.
- supplementary 수식은 논문 해석에 필요한 경우에만 보존한다. VGGT-SLAM appendix-only Eq. (6)처럼 본문 method/evaluation을 따라가는 데 직접 필요하지 않은 수식은 page에서 제외하고 report에 `omitted intentionally`로 남긴다.
- supplementary figure/table 이미지는 별도 기준으로 판단한다. 수식 보존 원칙을 figure/table 이미지 추가 원칙으로 확장하지 않는다.
- 행렬식, piecewise/cases, aligned derivation, multi-line factorization처럼 형태가 의미를 갖는 수식은 원문 형태를 최대한 유지한다. `bmatrix`를 한 줄 텍스트로 압축하거나, 여러 줄 유도식을 쉼표로 이어 붙여 읽는 순서를 잃으면 실패다.
- 개편 전 원본 정리 페이지에 안정적인 Notion/KaTeX 수식 블록이 있으면 그 형태를 우선 복원한다. 손으로 만든 커스텀 span 수식은 원본 블록이 없거나 PDF 대조상 수정이 필요한 경우에만 사용한다.
- 의도적으로 제외한 수식은 이유를 report에 기록한다.

수식 렌더링 체크:

- inline 수식의 `_`, `^`가 raw text로 남지 않았는가?
- subscript/superscript/overbar/dot notation이 PDF와 같은 관계로 표현되는가?
- comma-separated notation에서 쉼표가 사라지지 않았는가?
- inline 수식 chip 색상이 페이지 안에서 회색/노란색으로 섞이지 않는가? note/brief의 노란 theme과 수식 chip theme은 분리되어야 한다.
- `\frac` 수식이 slash text로 납작하게 보이지 않고, KaTeX fraction line 또는 inline stacked fraction으로 표현되는가?
- `||`, `\sum`, `\int`, 큰 괄호, norm subscript의 크기와 간격이 reference pages와 비교해 지나치게 작거나 어긋나지 않았는가?
- block equation은 너무 작은 글씨나 과한 spacing 없이 reference page와 비슷한 크기인가?
- 행렬/케이스/정렬 수식은 원문과 같은 구조로 보이는가?
- equation tag가 PDF 번호와 대응되는가?
- 원본 수식 내부에 이미 tag가 있는데 바깥 tag까지 이중으로 보이지 않는가?
- equation caption 내부 inline 수식이 본문/table token 보정의 영향을 받아 위아래로 밀리지 않았는가?
- 한 문장 안에서 KaTeX 기반 `.notion-text-equation-token`과 수동 `.inline-math`가 섞이는 경우, 같은 줄의 token center가 맞고 본문 글자 기준으로도 과하게 아래/위로 치우치지 않는가?
- inline 수식 baseline을 고친 뒤 table/brief/caption token까지 같이 움직이지 않았는가? 본문, 표, caption은 서로 다른 baseline scope로 본다.
- CSS baseline 보정이 실제 computed style에 반영되는가? 새 rule이 기존 `:is(p, li, ...)` selector specificity에 밀리면 실패다.
- 긴 수식 토글의 마지막 줄이 close bar나 blur에 가리지 않는가?
- CSS를 수정한 뒤 실제 브라우저가 새 `styles.css?v=...`를 읽고 있는가? 캐시 때문에 이전 inline 수식 높이/색상이 남으면 실패다.

Gate 통과 조건:

- [ ] 수식 처리표가 완성되었다.
- [ ] 개편 전 원본 KaTeX 블록이 있는 수식은 원본 형태를 기준으로 복원되었다.
- [ ] page의 수식 tag와 PDF equation 번호가 충돌하지 않는다.
- [ ] raw `_`, `^`, `Zbar`, `Ybar`, `Phibar`, `Rdot` 같은 임시 표기가 남지 않았다.
- [ ] equation caption 내부 수식 token은 caption 글자 높이와 맞는다.
- [ ] mixed inline 수식은 수식끼리의 center와 본문 글자 기준 baseline을 모두 통과한다.
- [ ] baseline 관련 selector와 cache query가 실제 브라우저에서 확인되었다.
- [ ] KO/EN 전환 후에도 수식이 같은 크기와 위치로 유지된다.

## 6. Gate 4: Figure / Table / Caption Evidence

목표: 그림, 표, 캡션이 PDF와 의미적으로 대응되는지 확인한다.

이 gate는 자동 스캔만으로 통과할 수 없다. 특히 Notion export나 PDF crop 과정에서 `Fig. 5` 이미지가 `Fig. 4`로 잘못 붙거나, 없는 `Fig. 1`을 다른 이미지로 대체하는 오류가 쉽게 생긴다. 따라서 **caption text가 맞는지**가 아니라 **이미지 자체가 PDF의 해당 figure/table인지**를 반드시 눈으로 확인한다.

확인 항목:

- PDF의 핵심 figure/table이 page에 보존되어 있는가?
- 기존 페이지에 없던 figure/table 이미지를 새로 추가해야 하는가? `main paper 핵심 도식/표`, `caption-source mismatch 수정`, `이미지 없이 설명이 크게 왜곡되는 경우`가 아니면 추가하지 않는다.
- supplementary material의 figure/table은 기본적으로 본문 이미지로 넣지 않는다. 필요한 경우 `supplementary에서 이런 경향을 추가로 확인`처럼 요약하거나 verification report에만 기록한다.
- page의 캡션이 실제 PDF figure/table 내용과 어긋나지 않는가?
- figure/table 번호가 PDF 번호와 충돌하지 않는가?
- page 안에서 같은 figure/table이 다른 번호로 재사용되지 않았는가?
- 같은 figure/table이 불필요하게 중복 등장하지 않는가?
- PDF에 없는 figure 번호를 만들지 않았는가? 실제 asset이 없으면 다른 그림에 해당 번호를 붙이지 말고, report에 `absent / intentionally omitted`로 기록한다.
- PDF에 있는 중간 번호가 빠지지 않았는가? 예를 들어 Table V 다음에 Table VII가 바로 나오면 Table VI가 main paper의 핵심 근거인지, 사용자가 원래 넣은 자료인지, supplementary-only인지 먼저 구분한다. 핵심 근거가 아니면 복원보다 report에 `omitted intentionally`로 기록한다.
- 하나의 crop 안에 table과 figure가 함께 들어 있지 않은가? 함께 들어 있다면 caption을 합치지 말고, 가능한 경우 별도 asset으로 분리해 각 번호와 설명을 맞춘다.
- Fig. 1a/Fig. 1b처럼 나란히 읽는 paired figure가 의도와 다르게 분리되거나 높이가 크게 어긋나지 않았는가?
- figure가 너무 커지거나 작아져 reference page 대비 균형이 깨지지 않았는가?
- PDF의 vector 글자와 가는 선이 낮은 해상도의 raster crop으로 뭉개지거나 글자처럼 보이지 않게 변형되지 않았는가?
- diagram/table은 실제 desktop 표시 폭 대비 최소 3x, 사진 중심 qualitative figure는 최소 2x의 source pixel width를 확보했는가?
- 여러 정량 평가표의 외곽 폭만 같게 맞춘 결과 내부 글자 크기가 서로 크게 달라지지 않았는가?
- result table을 이미지로 넣은 경우, 주변 설명이 어떤 claim을 검증하는지 말해 주는가?
- 영어 전환 후 이미지 크기가 변하지 않는가?
- 한글 panel의 caption이 영어 설명문 그대로 남아 있지 않은가? technical term은 허용하지만 문장 구조는 한글이어야 한다.

권장 절차:

1. PDF text에서 `Fig.`, `Figure`, `Table`, `TABLE`을 모두 검색해 canonical inventory를 만든다.
2. page asset contact sheet를 만든다. 파일명, 이미지 크기, 썸네일을 같이 놓고 PDF figure/table과 직접 대조한다.
3. `node scripts/verify-paper-review.mjs <PAGE>`의 `Figure/table inventory preview`를 확인한다.
4. 각 row에 대해 `PDF item -> page filename -> caption -> visual match`를 report에 기록한다.
5. PDF crop으로 새 asset을 만들 때는 기존 asset에 같은 figure가 이미 있는지 먼저 확인한다. 기존 페이지에 없던 supplementary figure/table crop은 만들지 않는 것을 기본값으로 한다.
6. preview는 `120DPI`, 최종 crop은 `1200DPI` 원본 page render에서 만든다. 최종 PNG를 레이아웃에 맞추려고 다시 축소 저장하지 않고 CSS 표시 폭으로 조절한다.
7. crop을 추가했다면 browser의 실제 표시 크기와 lightbox에서 작은 글자, 얇은 선, 표의 마지막 row, crop 여백을 직접 확인하고, 불필요한 임시/중복 asset은 제거한다.

Gate 통과 조건:

- [ ] 핵심 figure/table 누락이 없다. 단, supplementary-only figure/table 이미지는 불필요하게 추가하지 않았다.
- [ ] caption과 주변 설명이 PDF 내용과 일치한다.
- [ ] 한글 caption은 한글 독자가 자연스럽게 읽을 수 있게 정리되어 있다.
- [ ] 각 figure/table의 source filename이 report에 기록되어 있다.
- [ ] 새로 추가한 figure/table은 `왜 이미지로 필요한지`가 report에 기록되어 있다.
- [ ] `visual match`가 확인되지 않은 figure/table이 없다.
- [ ] paired figure/table 묶음은 의도된 row 구성과 비슷한 높이감으로 보인다.
- [ ] 이미지 크기, lightbox, alt text가 desktop/mobile에서 안정적이다.
- [ ] text-heavy figure/table은 표시 폭 대비 3x 이상의 source pixel density를 가지며 글자가 잘리거나 뭉개지지 않는다.
- [ ] 사진 중심 qualitative figure도 표시 폭 대비 2x 이상의 source pixel density를 가진다.
- [ ] 표마다 내부 글자 크기가 비슷하게 읽히며, 외곽 폭 통일 때문에 특정 표만 지나치게 작거나 크게 보이지 않는다.

## 7. Gate 5: Section Flow / Prose

목표: 요약식 정리와 설명문 사이의 균형이 맞고, 화면 흐름이 원문 목차가 아니라 독자 질문 순서로 재구성되었는지 확인한다.

확인 항목:

- 너무 요약되어 문법적으로 이상한 문장이 없는가?
- 너무 장황해서 표/card/checklist/ladder로 나눌 수 있는 문단이 남아 있지 않은가?
- `Abstract -> Introduction -> Method -> Experiments`를 기계적으로 따라가는 구조가 남아 있지 않은가?
- Problem section이 너무 길어져 Method를 읽기 전에 지치게 만들지 않는가?
- Method/Mechanism section이 가장 자세하고, 수식/모듈/설계 선택이 문제 해결 흐름과 연결되어 있는가?
- Evidence section이 dataset별 나열에 그치지 않고 task/claim 중심으로 정리되어 있는가?
- Usage / Limits가 누락되어 독자가 적용 조건을 판단할 수 없는 상태가 아닌가?
- PDF의 section 의도와 맞지 않는 임시 제목이 남아 있지 않은가?
- `~Map`처럼 인공적인 라벨이 불필요하게 남아 있지 않은가?
- `세부 참고`, `보존할 세부 내용`, `pdf`처럼 제3자가 보기 어색한 내부 작업 문구가 화면에 보이지 않는가?
- 보조 문구가 논문 흐름을 끊으면 제거했는가?

Gate 통과 조건:

- [ ] 위에서 아래로 읽을 때 PDF 논리 흐름이 끊기지 않는다.
- [ ] `Problem -> Mechanism -> Evidence -> Usage / Limits` 질문 흐름이 보인다.
- [ ] 개인 해석과 논문 claim이 분리되어 있다.
- [ ] 문체가 다른 개편 페이지와 비슷한 밀도와 톤을 가진다.

## 8. Gate 6: Toggle / Supplement

목표: 토글 내부가 raw dump가 아니라 독립적으로 읽히는 보충 자료인지 확인한다.

확인 항목:

- Related Work 토글은 citation 나열 대신 taxonomy와 gap 중심인가?
- notation/equation 토글은 수식 역할 요약이나 표를 먼저 제공하는가?
- appendix/ablation 토글은 “왜 보충인지”가 보이는가?
- 토글 내부 이미지/수식/표가 왼쪽으로 치우치지 않는가?
- 토글 open 시 focus panel 크기가 위치에 따라 달라지지 않는가?
- close button이 하단 내용을 가리지 않고, 닫으면 토글 시작 위치로 돌아오는가?

Gate 통과 조건:

- [ ] 각 토글은 열지 않아도 본문 흐름이 유지되고, 열면 보충 정보가 충분하다.
- [ ] 긴 토글의 bottom buffer가 충분하다.
- [ ] 토글 내부 typography와 소제목 테마가 다른 페이지와 일관된다.

## 9. Gate 7: KO / EN / UI Regression

목표: 한글/영어 전환과 UI가 내용 검증 후에도 깨지지 않는지 확인한다.

정적 확인:

```bash
node --check pages/paper_reviews/<PAGE>/script.js
git diff --check -- pages/paper_reviews/<PAGE>/
node scripts/verify-paper-review.mjs <PAGE>
```

브라우저 확인:

- KO/EN 전환 후 heading, table, details summary, bookmark, note/brief가 모두 바뀌는가?
- 영어 모드에서 한국어가 남는 부분이 의도된 고유명사/개인 섹션 외에는 없는가?
- 오른쪽 책갈피가 현재 section을 안정적으로 표시하는가?
- 더보기 blur와 버튼이 새로고침 후에도 함께 나타나거나 함께 사라지는가?
- image width가 KO/EN 전환 후 바뀌지 않는가?
- inline math baseline이 본문 높이와 맞는가?

Gate 통과 조건:

- [ ] KO/EN 모두 같은 구조와 글자 크기를 유지한다.
- [ ] 수식, 이미지, 토글, 책갈피, lightbox가 정상 동작한다.
- [ ] 자동 스캔에서 P0/P1 후보가 없다.

## 10. Final Gate: Verification Report

최종 산출물은 수정 자체보다 report다. report에는 아래가 있어야 한다.

```md
# <PAGE> Verification Report

## Verdict
- Status: pass / needs_fix / blocked
- Date:
- PDF:
- Page:

## PDF Claim Map
- Problem:
- Contributions:
- Method:
- Evaluation:
- Conclusion / limitation:

## 수식 처리표
| PDF Eq. | Page location | Status | Notes |
| --- | --- | --- | --- |

## Figure / Table Inventory
| PDF item | Page location | Status | Notes |
| --- | --- | --- | --- |

## Issues
| Severity | Location | Problem | Fix |
| --- | --- | --- | --- |

## Gates
- Gate 1 Source Binding:
- Gate 2 Claim Coverage:
- Gate 3 수식 처리표:
- Gate 4 Figure/Table:
- Gate 5 Section Flow:
- Gate 6 Toggle:
- Gate 7 KO/EN/UI:

## Residual Risk
- None, or list remaining risks that require a follow-up pass.
```

Final gate 통과 조건:

- [ ] P0/P1 issue가 남아 있지 않다.
- [ ] P2 issue는 수정했거나 residual risk로 기록했다.
- [ ] PDF claim/equation/figure/table 대조 기록이 있다.
- [ ] 브라우저와 정적 검증 결과가 기록되어 있다.
