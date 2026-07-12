# Summary HTML Paper Redesign Manual

이 문서는 `run_convert.command` 등으로 새로 생성된 “요약형 논문 HTML 페이지”를 최종 블로그용 논문 페이지로 개편할 때 사용하는 상세 절차다.

기존 `REDESIGN_PLAYBOOK.md`가 전체 철학과 reference rule을 다룬다면, 이 문서는 변환 직후의 새 HTML을 입력으로 받아 `DROID-W` 수준의 질문 중심 페이지로 다듬는 실제 작업 순서를 고정한다.

핵심 원칙은 하나다.

> 요약된 HTML은 출발점일 뿐이고, 최종 판단 기준은 반드시 원 논문 PDF다.

## 0. Scope

이 문서를 사용하는 상황:

- Notion 또는 임시 정리 파일에서 새 논문 HTML이 생성됨.
- 생성된 HTML이 이미 어느 정도 요약되어 있지만, 기존 reference 페이지와 비교하면 구조, 수식, figure/table caption, 토글, 한/영 전환, 메타 정보가 아직 정리되지 않음.
- 새 논문 페이지를 `pages/paper_reviews/<PAGE>/` 아래의 최종 블로그 페이지로 개편하려고 함.

이 문서가 직접 다루는 파일:

| 파일 | 역할 |
| --- | --- |
| `pages/paper_reviews/<PAGE>/index.html` | 본문 구조, 한/영 텍스트, figure/table/equation 배치 |
| `pages/paper_reviews/<PAGE>/styles.css` | 페이지 로컬 테마, 수식/토글/캡션/메타 카드 스타일 |
| `pages/paper_reviews/<PAGE>/script.js` | 언어 전환, 더보기, 책갈피, 토글 focus panel, lightbox |
| `pages/paper_reviews/<PAGE>/assets/` | 기존 사용자가 넣은 figure/table/media |
| `data.js` | 메인 페이지 카드 순서, group, tags, description |
| `pages/paper_reviews/<PAGE>/REDESIGN_INVENTORY.md` | 필요 시 해당 페이지 개편 기록 |

이 문서가 직접 하지 않는 것:

- 원 논문 PDF 없이 contribution/method/evaluation을 확정하지 않는다.
- 사용자가 기존 HTML에 넣지 않은 figure/table 이미지를 PDF에서 임의로 대량 crop하지 않는다.
- supplementary-only figure/table 이미지를 기본적으로 추가하지 않는다.
- 여러 논문을 동시에 개편하지 않는다. 한 페이지 final gate 통과 후 다음 페이지로 넘어간다.
- `/Users/song-useog/Desktop/CustomTools/notion_to_blog/run_convert.command`의 기본 기능을 바꾸지 않는다. 이 command는 사용자가 직접 실행하는 기존 도구로 유지한다.

## 0.1 Codex Direct-Redesign Entry

사용자가 요약형 HTML 경로만 주면, Codex는 아래 과정을 내부적으로 수행한다.

1. HTML에서 공식 논문 제목, properties table, 핵심 요약, Paper/Code 링크를 읽는다.
2. `section=paper_reviews`, `title=공식 풀제목`, `desc=핵심 한 줄`, `thumb-index=1`을 자동 결정한다.
3. 기존 `run_convert.command` 자체는 수정하지 않고, 필요하면 converter의 CLI 인자를 직접 사용해 블로그 페이지로 통합한다.
4. 통합 직후 `data.js`의 group/tags/desc를 페이지 분류 규칙에 맞게 보강한다.
5. 이어서 이 문서의 12-step workflow로 곧바로 개편한다.

권장 내부 호출 형태:

```bash
cd /Users/song-useog/Desktop/CustomTools/notion_to_blog
.venv/bin/python notion_to_blog.py \
  /path/to/SummaryPaper.html \
  --section paper_reviews \
  --title "Official Full Paper Title" \
  --desc "핵심을 짧게 요약한 한 줄 설명" \
  --thumb-index 1 \
  --update-index
```

주의:

- 사용자는 HTML 경로만 전달해도 된다. title/desc/thumb-index는 Codex가 HTML과 PDF를 읽고 결정한다.
- 이 direct-redesign entry는 workflow이며, converter command 자체의 기본 동작을 바꾸는 기능 추가가 아니다.
- output folder는 기존 converter 규칙을 따른다. 필요하면 변환 후 폴더명을 안정적인 짧은 slug로 조정하되, `data.js` href와 asset path를 함께 맞춘다.

## 1. Summary HTML에 대한 기본 태도

요약형 HTML은 “이미 정리되어 있으니 조금만 꾸미면 되는 파일”이 아니다. 오히려 다음 위험이 있다.

| 위험 | 증상 | 대응 |
| --- | --- | --- |
| 과도한 요약 | method가 핵심 수식 없이 한두 문장으로 끝남 | PDF method를 다시 읽고 mechanism을 확장 |
| 원문 순서 잔존 | `Abstract -> Introduction -> Method -> Experiments` 순서가 그대로 남음 | `Problem -> Mechanism -> Evidence -> Usage / Limits`로 재배치 |
| 임시 표현 잔존 | `~ Map`, `~ 읽는 법`, `세부 참고`, `pdf`, `보존할 세부 내용` | 제3자가 읽는 제목으로 수정 또는 제거 |
| 수식 단순화 | 원본 KaTeX 대신 손수 만든 span, slash fraction, raw `_`, `^` | 원본 KaTeX 또는 PDF 형태로 복원 |
| figure/table caption 약함 | 번호만 있고 논문에서 무엇을 검증하는지 모름 | PDF caption과 본문 해석 근거를 대조해 보강 |
| 토글 raw dump | 접힌 내부가 긴 문단/수식 나열로만 구성됨 | 내부도 taxonomy, state table, equation role map으로 구조화 |
| 영어 전환 누락 | 일부 h3, caption, 토글 summary가 한글로 남음 | visible text 기준 KO 잔여 검사 |

요약형 HTML의 문장은 다음처럼 취급한다.

- 맞는 문장: 보존하되 더 읽기 쉬운 위치로 이동한다.
- 맞지만 너무 압축된 문장: PDF method/evaluation 근거를 추가해 확장한다.
- PDF와 어긋난 문장: 과감히 고친다.
- 임시 메모체 문장: 공식적이고 독자 친화적인 표현으로 바꾼다.
- 기존 강조/형광펜: 모두 임시 독서 흔적으로 보고, PDF 기반으로 다시 선정한다.

## 2. Required Inputs

작업을 시작하기 전 반드시 확보한다.

| 입력 | 필수 여부 | 확인할 것 |
| --- | --- | --- |
| 원 논문 PDF | 필수 | 공식 제목, authors, venue/year, equation, figure/table |
| 새로 변환된 HTML | 필수 | 기존 요약, 사용자가 첨부한 이미지/수식/메모 |
| assets 폴더 | 필수 | 실제 들어 있는 figure/table/media 파일 |
| 기존 reference 페이지 | 필수 | active reference는 `DROID-W`; 수식/figure 예외는 `Chamelion`, `DUSt3R`, `ORB-SLAM2` 참고 |
| 공식 paper/project/github 링크 | 있으면 사용 | 상단 meta card에만 정리. 핵심 요약 Contribution으로 넣지 않음 |
| 기존 한 줄 설명 | 있으면 보존/수정 | `data.js`의 `desc`에 들어갈 간결한 설명 |

PDF가 없으면 다음 단계로 넘어가지 않는다.

## 3. Output Shape

최종 페이지는 아래 구조를 가진다.

1. `Paper Reviews` topbar
2. 작은 공식 논문 제목 `.paper-title-meta`
3. 상단 paper meta card
4. 옅은 `Topics` chip
5. `핵심 요약`
6. 논문 유형에 맞는 visual summary
7. `논문 상세 정리`
8. `Problem`
9. `Mechanism`
10. `Evidence`
11. `Usage / Limits`
12. `Conclusion`
13. `느낀점`
14. `향후 계획`
15. Comments

중요한 분리:

| 영역 | 목적 | 주의 |
| --- | --- | --- |
| 메인 페이지 카드 | 제목 + 한 줄 설명으로 목록 역할 | 카드 내부 해시태그는 넣지 않음 |
| 메인 페이지 그룹 필터 | 큰 카테고리 탐색 | `data.js`의 `group` 사용 |
| 상세 페이지 Topics | 보조 분류 확인 | 존재감은 낮게 유지 |
| 핵심 요약 | 3분 안에 논문 지형 파악 | 노란 정리 노트, GitHub preview, project link를 기본으로 넣지 않음 |
| 논문 상세 정리 | 실제 이해의 중심 | Method/Mechanism을 가장 자세히 |

## 4. 12-Step Workflow

각 step은 작업과 gate를 함께 가진다. Gate를 통과하지 못하면 다음 step으로 넘어가지 않는다.

### Step 1. Source Binding

목표: 새 HTML이 어떤 PDF와 연결되는지 고정한다.

작업:

- PDF 공식 제목, 저자, 기관, venue/year, accepted date 또는 arXiv 상태를 확인한다.
- official paper/page/github 링크를 확인한다.
- 새 HTML의 title, data.js title, paper meta title이 PDF와 충돌하지 않는지 확인한다.
- 같은 이름의 논문, workshop/extended version, arXiv/preprint가 섞이지 않았는지 확인한다.

Gate:

- [ ] PDF 없이 contribution/evaluation/limitation을 확정하지 않았다.
- [ ] page title과 PDF title이 같은 논문을 가리킨다.
- [ ] venue/preprint 정보가 official page와 충돌하지 않는다.
- [ ] project/page/github 링크는 논문 공식 자료인지 관계가 명확하다.

### Step 2. Asset / Equation Inventory

목표: 기존 HTML이 가진 자산을 빠짐없이 파악한다.

작업:

- HTML 안의 `figure`, `img`, `table`, `iframe`, `details`, `figure.equation`을 모두 세어 inventory를 만든다.
- PDF의 numbered equation을 모두 확인해 `본문 펼침`, `토글 보존`, `의도적 제외`로 분류한다.
- 사용자가 기존 HTML에 넣은 figure/table과 PDF figure/table 번호를 매칭한다.
- 기존 HTML에 없는 PDF figure/table은 무조건 추가하지 않는다. main paper 핵심 도식인데 없어서 설명이 크게 왜곡되는 경우만 사용자에게 알리거나 최소 추가한다.
- supplementary-only figure/table은 기본적으로 이미지로 넣지 않는다.

Gate:

- [ ] 기존 HTML의 주요 이미지/수식/embed/comments가 목록화되었다.
- [ ] PDF numbered equation 처리표가 있다.
- [ ] 각 figure/table의 source filename과 PDF 번호가 대응된다.
- [ ] 사용자가 넣지 않은 supplementary figure/table이 임의로 추가되지 않았다.

### Step 3. Paper Type Routing

목표: 논문 유형에 맞는 visual summary와 상세 구조를 정한다.

판단 기준:

| 논문 유형 | 우선 구조 | visual summary |
| --- | --- | --- |
| SLAM/System | `Problem -> Mechanism -> Evidence -> Usage` | pipeline / module relation |
| Reconstruction/Foundation Model | `Problem -> Representation/Prediction -> Recovery -> Evidence` | input-output map / task matrix |
| Rendering/3DGS/NeRF | `Problem -> Representation -> Optimization/Loss -> Evidence` | loss/objective map |
| Scene Graph/Semantic Mapping | `Problem -> State/Hierarchy -> Update/Query -> Evidence` | hierarchy / state dictionary |
| Change Detection | `Problem -> Change Type -> Detection/Update -> Evidence` | taxonomy + confidence/update flow |
| Dataset/Benchmark | `Gap -> Data Construction -> Task Coverage -> Evidence -> Usage` | dataset schema / task matrix |

Gate:

- [ ] sequential pipeline이 핵심이 아닌 논문에 억지 flow diagram을 넣지 않았다.
- [ ] DROID-W와 다른 구조라면 논문 유형상 필요한 차이인지 설명 가능하다.
- [ ] 화면의 상세 흐름은 원문 목차가 아니라 독자 질문 순서다.

### Step 4. Top Metadata Block

목표: 첫 화면에서 출처 정보를 작고 세련되게 제공한다.

구성:

- `.paper-title-meta`: 공식 논문 제목. 큰 H1로 만들지 않는다.
- `.paper-meta-card`: venue/preprint, authors, affiliations, date/accepted, links.
- `.paper-meta-links`: `Paper`, `Page`, `GitHub` 중 실제 있는 것만.
- `.paper-meta-topics`: group/tags. 존재감은 낮게 유지.

주의:

- official page가 CVPR/ICCV/ECCV 등 venue 정보를 명시하면 `arXiv preprint`로만 쓰지 않는다.
- Topics는 상세 페이지 보조 정보다. 메인 카드에는 해시태그를 넣지 않는다.
- link preview는 상단에 기본으로 넣지 않는다. 공식 repo가 method 이해에 중요할 때만 method/implementation 근처에서 다룬다.

Gate:

- [ ] official title이 줄바꿈으로 첫 화면을 압도하지 않는다.
- [ ] venue/date/authors/affiliations가 PDF 또는 official page와 충돌하지 않는다.
- [ ] Topics chip은 메타 카드보다 튀지 않는다.
- [ ] 핵심 요약에 GitHub/project preview가 과하게 들어가지 않았다.

### Step 5. 핵심 요약 Rebuild

목표: 독자가 3분 안에 논문의 지형을 잡는다.

필수 요소:

- 한 문장 요약
- `문제 / 해결 / 근거` cue
- contribution 3-5개
- 짧은 insight
- 논문 유형에 맞는 visual summary
- 필요한 경우 compact compare grid

작성 규칙:

- 장문 설명을 넣지 않는다.
- 각 block 앞에는 필요한 경우 `처리 흐름`, `접근 방식 비교`, `핵심 변수`, `평가 축` 같은 짧은 소제목만 둔다.
- `Open Source Release`는 contribution에 넣지 않는다.
- 노란 `정리 노트`는 TL;DR에 기본적으로 넣지 않는다.
- cue chip이 잘리거나 두세 줄로 늘어나면 본문으로 내린다.

Gate:

- [ ] 첫 화면에서 문제, 해결 방식, 근거가 보인다.
- [ ] 요약이 너무 건조하면 minimal subheading만 추가했고, 장문 paragraph를 넣지 않았다.
- [ ] visual summary가 논문 유형과 맞는다.
- [ ] TL;DR 내부에 불필요한 노란 note/link preview가 없다.

### Step 6. Detailed Architecture

목표: `논문 상세 정리`를 원문 목차가 아니라 질문 중심으로 재구성한다.

기본 섹션:

| 섹션 | 통합할 원문 | 반드시 답할 질문 |
| --- | --- | --- |
| `Problem` | Abstract, Introduction, Related Work, Conclusion 일부 | 왜 어려운 문제인가? 기존 접근의 빈틈은 무엇인가? |
| `Mechanism` | Method/System/Theory | 어떤 state/objective/module/update로 푸는가? |
| `Evidence` | Experiments, ablation, dataset, metric | 무엇을 어떤 기준으로 검증했는가? |
| `Usage / Limits` | Conclusion, limitation, failure case | 언제 쓰기 좋고 어디서 약한가? |
| `Conclusion` | Conclusion | 논문의 실제 결론은 무엇인가? |
| `느낀점` | 개인 메모 | 논문 claim과 분리된 개인 해석 |
| `향후 계획` | 개인 메모 | 없으면 `(진행중...)` 또는 기존 policy에 맞게 표시 |

Mechanism은 가장 자세해야 한다. 다음 질문에 답하지 못하면 요약이 과한 것이다.

- 입력은 무엇인가?
- 핵심 state variable은 무엇인가?
- 어떤 objective/loss/update를 최적화하는가?
- 기존 baseline에서 무엇을 바꿨는가?
- 각 module은 어떤 실패 모드를 줄이는가?
- 출력은 무엇이고 downstream에서 어떻게 쓰이는가?

Gate:

- [ ] `Abstract -> Introduction -> Method -> Experiments`를 그대로 반복하지 않는다.
- [ ] Method/Mechanism이 페이지에서 가장 자세하다.
- [ ] Summary HTML의 압축 때문에 핵심 method가 빠지지 않았다.
- [ ] 개인 느낌/계획은 논문 claim과 분리되어 있다.

### Step 7. Visual Conversion

목표: 긴 문단과 번호/글머리 나열을 시각적으로 읽히게 바꾼다.

선택 규칙:

| 상황 | 추천 표현 |
| --- | --- |
| 문제가 단계적으로 쌓임 | Problem Ladder |
| 설계 선택이 중요함 | Design Choice Box |
| 알고리즘 순서가 중요함 | Method Stepper |
| state/notation이 많음 | State Dictionary |
| 여러 종류로 분류됨 | Taxonomy Card / Compact Grid |
| task별 평가 | Task Evaluation Matrix |
| 핵심 결과와 보조 근거가 섞임 | Core Evaluation / Supporting Evidence 분리 |
| 적용 조건 판단 | When to Use / Avoid |

주의:

- 표 안 첫 번째 열에는 같은 종류의 항목만 넣는다. Dataset 이름과 sensor/GT 구성 같은 다른 층위를 섞지 않는다.
- 표 내부 문장은 `~다`보다 요약체를 사용한다. 단, 의미가 어색하면 완전한 문장도 허용한다.
- 카드/박스가 너무 많으면 오히려 산만하다. 비슷한 반복 문법을 줄이는 곳에만 쓴다.
- `~ Map`, `~ 읽는 법`, `~ ledger` 같은 내부 작업명은 화면 제목으로 쓰지 않는다.

Gate:

- [ ] 긴 나열이 raw paragraph로 방치되지 않았다.
- [ ] 표/card/ladder가 정보 층위를 섞지 않는다.
- [ ] 너무 요약되어 문법적으로 부자연스러운 부분은 문장형 설명으로 보강했다.
- [ ] visual block은 논문을 이해시키는 역할이 있고 장식용이 아니다.

### Step 8. Equations / Notation

목표: 수식 의미뿐 아니라 원문 형태를 보존한다.

처리 원칙:

- 기존 변환 전/요약 전 HTML에 안정적인 KaTeX block이 있으면 최우선으로 재사용한다.
- `bmatrix`, `cases`, `align`, `sum`, `frac`, norm, dot/bar notation은 형태 자체가 의미다.
- 핵심 objective/loss/update는 펼쳐 둔다.
- notation, metric, derivation, auxiliary equation은 본문 흐름을 끊으면 토글로 접는다.
- appendix/supplementary-only 수식은 본문 claim 이해에 필요한 경우만 보존한다.

수식 렌더링 규칙:

- raw `_`, `^`, `\frac` text가 보이면 실패다.
- inline 수식은 회색 계열의 중립 theme로 통일한다.
- note/brief의 노란 theme가 inline 수식에 번지면 실패다.
- 본문 inline, table token, equation caption token, toggle 내부 token은 서로 다른 baseline scope다.
- baseline 보정은 실제 브라우저에서 확인한다. CSS 숫자를 다른 페이지에서 그대로 복사하지 않는다.
- comma-separated notation은 쉼표를 수식 chip 밖에 보존한다.
- block equation tag는 PDF 번호와 대응되어야 한다.
- 원본 KaTeX 내부에 이미 tag가 있으면 바깥 tag를 중복으로 보이지 않게 한다.
- tag가 중앙으로 쏠리는 multi-part equation은 수식 body를 다시 만들지 말고 right-side gutter로 번호 위치만 보정한다.

Gate:

- [ ] PDF numbered equation 처리표가 page와 대응된다.
- [ ] 핵심 수식이 삭제되거나 지나치게 단순화되지 않았다.
- [ ] inline 수식이 본문/표/노란 note/토글/caption에서 각각 위아래로 쏠리지 않는다.
- [ ] block equation tag가 오른쪽 끝 또는 원본 KaTeX 위치에 자연스럽게 보인다.
- [ ] KO/EN 전환 후 수식 크기와 위치가 유지된다.

### Step 9. Figure / Table / Caption

목표: figure/table이 PDF의 실제 근거와 맞게 보인다.

caption 규칙:

```html
<figcaption>
  <span class="caption-main">Figure 2. System Overview.</span>
  <span class="caption-note">논문 본문에서 실제로 설명한 claim/evidence가 있을 때만 1문장 추가.</span>
</figcaption>
```

규칙:

- `caption-main`은 번호와 제목을 담고 굵게 표시한다.
- `caption-note`는 PDF 본문이 해당 figure/table을 어떻게 해석하는지 근거가 있을 때만 넣는다.
- 근거 없는 `볼 점`, `강조`, 작업 중 조언은 넣지 않는다.
- 한글 panel에 영어 caption 문장이 그대로 남지 않게 한다.
- figure/table title과 note는 각각 독립적으로 중앙 배치하되, 줄바꿈이 일어나면 두 번째 줄이 첫 줄 시작점과 맞게 정렬한다.
- paired figure는 의도적으로 나란히 붙이고 세로 높이감을 맞춘다.
- image size는 기존 첨부 크기를 존중한다. 영어 전환 후 이미지가 커지면 CSS max-width 동기화가 실패한 것이다.

원본 추출과 화질 규칙:

- PDF의 vector figure/table을 브라우저 screenshot이나 기존 저해상도 PNG 확대본으로 대체하지 않는다.
- 위치 확인용 preview만 `120DPI`로 만들고, 최종 asset은 원본 PDF 페이지에서 `1200DPI`로 다시 render한 뒤 crop한다. 파일 크기 제약이 명확한 예외만 `600DPI`를 허용하고 이유를 기록한다.
- 최종 crop은 caption, 본문, page number를 제외한 `figure_only` 또는 `table_only` 범위로 만들며, 글자·선·표의 마지막 row가 crop 경계에 닿지 않도록 작은 safety margin을 둔다.
- 투명 PDF render는 흰 배경으로 flatten한 뒤 RGB PNG로 저장한다. JPEG 재압축은 사진 중심 qualitative figure에만 허용한다.
- **추출 크기와 표시 크기를 분리한다.** 고해상도 PNG 자체는 줄이지 않고, HTML/CSS의 `width`, `max-width`, figure size class로 화면 폭만 조절한다.
- 글자와 가는 선이 있는 diagram/table은 source pixel width가 실제 desktop 표시 폭의 최소 `3배`가 되게 한다. 사진 중심 qualitative figure도 최소 `2배`를 유지한다.
- 여러 평가표의 외곽 폭을 기계적으로 같게 맞추지 않는다. 내부 글자 크기가 비슷하게 보이도록 text density가 높은 표는 표시 폭을 넓히고, sparse한 표는 좁힌다.
- 기존 asset의 글자가 이미 뭉개졌다면 CSS sharpening이나 확대를 시도하지 않고 원본 PDF에서 다시 추출한다.
- 교체 파일은 `<Paper>_Figure2_figure_only_1200dpi.png`처럼 source와 DPI가 드러나는 새 이름을 쓰고 HTML 참조를 갱신한다. 같은 파일명 덮어쓰기로 브라우저 cache가 남지 않게 한다.

Gate:

- [ ] 이미지 자체가 PDF의 해당 figure/table과 맞다.
- [ ] 같은 figure/table이 다른 번호로 중복되지 않는다.
- [ ] 사용자가 넣지 않은 supplementary figure/table이 임의로 추가되지 않았다.
- [ ] caption note는 PDF 근거가 있을 때만 있다.
- [ ] table/figure 크기가 reference page 대비 과하거나 작지 않다.
- [ ] diagram/table의 작은 글자와 가는 선이 실제 표시 폭 및 lightbox에서 선명하다.
- [ ] text-heavy asset은 표시 폭 대비 최소 3x, 사진 중심 asset은 최소 2x source pixel density를 가진다.
- [ ] 저해상도 crop을 단순 확대하거나 브라우저 screenshot으로 대체한 asset이 없다.

### Step 10. Toggles / Supplement Panels

목표: 흐름 밖 정보는 접되, 펼쳤을 때도 완성된 보충 자료처럼 읽히게 한다.

토글로 접을 것:

- Related Work 세부 분류
- notation / 보조 수식
- dataset/implementation 세부 조건
- ablation 세부 결과
- appendix-level derivation
- 이미 본문 표로 요약한 뒤 남는 긴 설명

토글로 접지 말 것:

- 핵심 problem statement
- 핵심 method update/objective
- 대표 evaluation claim
- conclusion에서 논문이 실제로 말하는 한계

토글 내부 구조:

1. 짧은 구조 요약
2. taxonomy/state/equation role table
3. 필요한 figure/equation
4. 긴 설명 또는 원문식 보존 내용
5. 우측 하단 `접기 / Close section`

UI 규칙:

- 토글을 열면 topbar 바로 아래에서 일정 높이의 focused panel처럼 떠야 한다.
- 아래쪽 토글을 열어도 panel 높이가 작아지면 실패다.
- 토글 내부는 자체 스크롤만 움직이고 배경 페이지는 흔들리지 않아야 한다.
- 하단 close bar가 마지막 문장/수식을 가리면 bottom padding을 늘린다.
- 토글 summary와 내부 heading 테마가 본문 heading과 혼동되지 않아야 한다.
- 연속 토글이 3개 이상 나오면 문맥상 하나로 묶거나 일부 핵심을 본문으로 통합할지 검토한다.

Gate:

- [ ] 토글 내부가 raw dump가 아니다.
- [ ] 열림/닫힘/scroll/close 위치가 안정적이다.
- [ ] 긴 수식이나 마지막 caption이 close bar에 가리지 않는다.
- [ ] 토글로 접은 내용 때문에 본문 핵심 이해가 깨지지 않는다.

### Step 11. Language / Bookmark / Deep Reveal

목표: 한 페이지 안에서 KO/EN이 자연스럽게 전환되고, 읽기 흐름이 안정적이다.

언어 전환:

- 같은 페이지 안에서 KO/EN 치환을 우선한다.
- 영어 모드 visible text에 한글이 남지 않아야 한다.
- h2/h3, summary, button, caption, figure note, table header, bookmark text까지 모두 전환한다.
- KO/EN panel에서 같은 이미지 크기가 유지되어야 한다.

책갈피:

- 오른쪽 책갈피는 현재 중제목을 표시하되 노란 active highlight를 과하게 쓰지 않는다.
- `더보기`로 가려진 `논문 상세 정리` 구간은 책갈피에서도 자연스럽게 hidden 처리하거나, 클릭 시 reveal과 scroll이 동시에 맞아야 한다.
- 책갈피 클릭 시 section top이 topbar 뒤에 숨지 않아야 한다.

더보기:

- `논문 상세 정리`는 초반 blur와 `더보기 / Read More` 버튼으로 접는다.
- 버튼만 뜨고 blur가 사라지는 상태가 있으면 실패다.
- 책갈피 이동으로 collapsed 영역 아래로 갈 때 blur와 버튼이 같이 해제되어야 한다.

Gate:

- [ ] 영어 모드에서 한글 잔여가 없다.
- [ ] 책갈피가 현재 section을 정확히 따라간다.
- [ ] 더보기 blur/button/reveal 상태가 서로 어긋나지 않는다.
- [ ] KO/EN에서 글자 크기와 이미지 크기가 일관된다.

### Step 12. Final Regression

목표: 새 페이지가 단독으로도 안정적이고, 기존 reference 페이지와 품질 차이가 크지 않은지 확인한다.

정적 검사:

```bash
node --check pages/paper_reviews/<PAGE>/script.js
git diff --check -- pages/paper_reviews/<PAGE>/index.html pages/paper_reviews/<PAGE>/styles.css pages/paper_reviews/<PAGE>/script.js data.js
```

브라우저 검사:

- desktop width
- mobile width
- light/dark/dark-gray theme
- KO/EN 전환
- 더보기 reveal
- 토글 열기/닫기
- 책갈피 클릭
- 이미지 lightbox
- 긴 수식 overflow
- table cell text clipping

내용 검사:

- PDF abstract/contribution/method/evaluation/conclusion과 충돌하지 않는가?
- 핵심 method가 충분히 자세한가?
- figure/table caption이 실제 PDF와 맞는가?
- 수식 notation이 빠지지 않았는가?
- Related Work가 너무 많이 생략되지 않았는가?
- summary HTML의 부자연스러운 메모체가 남지 않았는가?

Gate:

- [ ] DROID-W와 비교해 구조/수식/토글/캡션/한영 전환 품질이 크게 낮지 않다.
- [ ] “요약형 HTML을 예쁘게 꾸민 페이지”가 아니라 “논문을 처음 보는 독자가 문제-방법-근거-한계를 따라갈 수 있는 페이지”다.
- [ ] 최종 변경 범위가 해당 논문 페이지, 필요한 data.js entry, 필요한 문서 업데이트로 제한되어 있다.

## 5. Common Red Flags

새 요약 HTML 개편에서 특히 자주 발생하는 문제다.

| Red flag | 왜 문제인가 | 수정 방향 |
| --- | --- | --- |
| `Equation Ledger` 같은 화면 제목 | 내부 검증 산출물처럼 보임 | Method 흐름 안에 자연스럽게 통합 |
| `Dataset 읽는 법` | 제목이 독자 질문보다 내부 안내문에 가까움 | `Dataset / GT 구성`, `Evaluation Setup`처럼 직접 표현 |
| Method가 짧고 Evaluation이 김 | 논문 이해의 중심이 빠짐 | Mechanism을 state/objective/module 중심으로 확장 |
| runtime/ablation/dataset을 task와 섞음 | 평가 구조가 혼란스러움 | `Core evaluation`과 `Supporting evidence` 분리 |
| table 첫 열에 서로 다른 층위가 섞임 | 표가 구겨 넣은 느낌이 됨 | dataset, sensor, GT, metric을 별도 열/표로 분리 |
| figure caption이 모두 번호만 있음 | 결과가 어떤 claim을 지지하는지 모름 | PDF 본문 근거가 있는 note만 추가 |
| caption note에 임의 해석이 있음 | 논문 claim을 과장할 수 있음 | PDF 근거 없는 note 제거 |
| inline 수식 위치가 영역마다 다름 | 수식이 문장에 붙지 않고 떠 보임 | 본문/table/brief/caption/toggle scope 분리 |
| Topics가 너무 강함 | 상단 meta가 복잡해짐 | 작은 보조 chip으로 낮춤 |
| 메인 카드 안 tag 표시 | 목록이 답답해짐 | 메인에서는 group filter만, 상세에서 Topics만 |
| Open Source Release를 contribution으로 둠 | 방법론 기여와 혼동 | meta/link 또는 implementation 보충으로 이동 |
| 느낀점/향후 계획을 노란 note/card로 만듦 | 개인 메모가 논문 claim처럼 보임 | 일반 문단 유지 |

## 6. Minimal Implementation Checklist

새 페이지마다 아래 순서로 실제 작업한다.

1. PDF 요청 및 source binding
2. existing HTML/asset/equation inventory 작성
3. 논문 유형 결정
4. 상단 meta card 정리
5. `data.js`에 `group`, `tags`, `desc`, 최신 순서 반영
6. `핵심 요약` 재작성
7. `논문 상세 정리`를 질문 중심으로 재배치
8. Mechanism을 PDF 기준으로 충분히 확장
9. 수식/notation 원본 KaTeX 복원
10. figure/table caption 보강
11. 토글 내부 구조화
12. KO/EN 전환 적용
13. right bookmark / 더보기 / 토글 focus panel 확인
14. desktop/mobile/theme/browser QA
15. final regression 통과 후 다음 페이지로 이동

## 7. Done Definition

새 요약 HTML 페이지 개편은 아래를 모두 만족해야 끝난다.

- PDF의 핵심 problem, method, evaluation, conclusion이 페이지에서 자연스럽게 이어진다.
- `핵심 요약`은 짧고, `Mechanism`은 충분히 자세하다.
- 원문 순서 번역이 아니라 독자 질문 순서로 읽힌다.
- 수식은 원문 형태와 tag가 보존된다.
- figure/table은 PDF와 이미지/번호/caption이 맞는다.
- 토글 내부도 구조화되어 있다.
- KO/EN 전환에서 한글 잔여, 이미지 크기 변화, 책갈피 불일치가 없다.
- 메인 페이지 카드에는 해시태그를 넣지 않고, 상세 페이지 Topics만 보조적으로 사용한다.
- 사용자가 넣지 않은 supplementary figure/table 이미지를 불필요하게 추가하지 않는다.
- 최종 결과가 DROID-W reference와 비교해 품질 차이가 크지 않다.
