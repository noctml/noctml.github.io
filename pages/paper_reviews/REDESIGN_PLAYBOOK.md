# Paper Review Redesign Playbook

이 문서는 Notion에서 가져온 “논문 번역/해석 글”을 “내가 이해한 논문의 지도”로 바꾸기 위한 실행 기준이다. 초기 기준은 ORB-SLAM2에서 시작했지만, 현재 active reference는 DROID-W다. 각 논문마다 원 논문 PDF를 먼저 읽고 구조, 강조, 도식, 토글 기준을 다시 잡되, 최종 gate는 DROID-W의 질문 중심 구조와 UI 안정성을 기준으로 통과시킨다.

핵심 목표는 정보 손실을 줄이는 데서 끝나지 않고, 독자가 먼저 봐야 할 정보의 순서를 바꾸는 것이다. 기존 그림, 수식, 상세 해석은 보존하고, 긴 설명은 표형 요약과 접힌 보충 설명으로 재배치한다.

## 0. 시작 전 필수 원칙

- 새 논문 페이지를 개편하기 전에는 반드시 사용자에게 원 논문 PDF를 요청한다.
- PDF 없이 contribution, evaluation, limitation을 확정하지 않는다.
- PDF를 받은 뒤 원문 섹션 순서로 source map을 만든다. 단, 최종 페이지 순서는 원문 목차가 아니라 `Problem -> Mechanism -> Evidence -> Usage / Limits`의 독자 질문 순서를 우선한다.
- 기존 정리의 해석이 원 논문 의도와 다르거나 문맥상 부자연스러우면 수정한다. 정보 보존은 “틀린 해석을 그대로 남기는 것”이 아니다.
- 기존 정리의 bold, 형광펜, 밑줄, 색상 강조는 모두 참고 자료로만 본다. 최종 강조는 원 논문의 구조, 반복되는 claim, method/evaluation 흐름을 기준으로 다시 선정한다.
- 기존 HTML에서 사용자가 넣어 둔 그림, 수식, YouTube/embed, comments, 개인 메모를 삭제하지 않는다.
- 원 논문 PDF에 있다는 이유만으로 사용자가 넣지 않은 figure/table 이미지를 새로 추가하지 않는다. 특히 supplementary material의 figure/table은 기본적으로 이미지 삽입 대상이 아니며, 필요하면 텍스트 요약이나 검증 메모에만 남긴다.
- 별도 supplementary material이 공식으로 제공되는 논문은 appendix-only 결과를 블로그 안에 별도 `추가 결과` 토글로 반복 보관하지 않는다. 본문 이해에 필요한 보조 수식, Jacobian, notation은 보존하되, supplementary-only figure/table은 report에 `omitted intentionally`로 기록하는 것을 우선한다.
- appendix/supplementary 수식도 “논문 본문 claim을 이해하는 데 필요한가”를 먼저 판단한다. VGGT-SLAM의 appendix-only SL(4) Lie algebra basis처럼 본문 흐름에 직접 기여하지 않는 보조 수식은 페이지에 넣지 않고, 필요하면 검증 기록에만 남긴다.
- 먼저 상단 TL;DR을 새로 만들고, 그 다음 기존 본문을 `논문 상세 정리` 아래에서 질문 중심 구조로 재배치한다. 원문 섹션명은 source 보존과 검증을 위한 기준이지, 화면 순서를 강제하는 기준이 아니다.
- DROID-W를 active reference로 삼되, ORB-SLAM2에서 안정화한 paired figure, 원본 KaTeX 복원, equation caption baseline, 한글 caption 정리 규칙은 이미 이 문서의 Unit 7 QA 기준으로 흡수해 적용한다.
- 모든 unit gate에서는 DROID-W 페이지를 기준으로 현재 페이지가 같은 완성도인지 refinement한다. 다른 reference page는 문제 원인 파악이 필요할 때만 historical reference로 확인한다.
- 한/영 전환은 기본 산출물에 포함한다. 별도 파일 이동보다 같은 페이지 안에서 KO/EN이 치환되는 방식을 우선한다.

## 1. Reference Goal

초기 ORB-SLAM2 페이지에서 확정하고, 이후 DROID-W에서 질문 중심 구조로 강화한 방향은 다음과 같다.

| 기준 | 적용 방식 |
| --- | --- |
| 글의 성격 | 원문 순서 번역이 아니라 “이 논문을 이해하기 위한 지도” |
| 정보 보존 | 기존 본문을 버리지 않고 `논문 상세 정리` 아래에 보존 |
| 정보 우선순위 | 상단에서 문제의식, contribution, 핵심 구조/관계, insight를 먼저 제시 |
| 긴 설명 처리 | 반복 문단은 표, 세부 배경은 토글, 핵심 수식은 펼침 |
| 시각화 | 별도 이미지 생성보다 HTML/CSS 도식과 summary table 우선. 도식 유형은 논문 성격에 맞춤 |
| 독자 확인 | 필요한 섹션에만 따뜻한 노란색 `정리 노트`, `Result Brief`, `Claim-Evidence Brief` 등을 추가. TL;DR과 개인 메모에는 불필요한 노란 note를 만들지 않음 |

ORB-SLAM2의 해석 기준 예시는 다음과 같다.

- ORB-SLAM2는 “monocular ORB-SLAM을 stereo/RGB-D까지 확장한 시스템”으로만 읽으면 부족하다.
- 더 중요한 관점은 `keyframe`, `local BA`, `covisibility graph`, `loop closing`, `Full BA`가 어떻게 실시간성과 전역 일관성을 나눠 담당하는지다.
- 따라서 상단 요약은 sensor 지원보다 “실시간성은 빠른 feature가 아니라 최적화 범위를 나누는 설계의 결과”라는 insight를 중심에 둔다.

## 2. Page Structure

모든 개편 페이지는 “논문 목차”가 아니라 “독자가 알고 싶은 질문”을 기준으로 재구성한다. 원문 순서는 PDF 대조와 정보 보존을 위한 source map으로 유지하되, 화면의 기본 흐름은 아래 순서를 따른다.

1. Header
2. Compact paper identity
3. `핵심 요약` TL;DR
4. 논문 유형에 맞는 HTML/CSS visual summary
5. `논문 상세 정리`
6. `Problem`: 어떤 문제를 제기하는가
7. `Mechanism`: 그 문제를 어떤 방법론으로 푸는가
8. `Evidence`: 무엇으로 평가하고 어떤 근거가 있는가
9. `Usage / Limits`: 언제 쓰기 좋고 어디서 약한가
10. 개인 `느낀점 / 향후 계획`
11. 오른쪽 책갈피
12. Comments

권장 재구성 mapping:

| 독자 질문 | 통합할 원문 구간 | 화면에서 답해야 할 내용 |
| --- | --- | --- |
| 이 논문은 어떤 문제를 보나? | Abstract, Introduction, Related Work, Conclusion 일부 | 기존 가정, 실패 상황, 기존 연구의 빈틈, 논문이 문제를 재정의한 방식 |
| 어떻게 푸나? | Method/System/Theory, 핵심 수식, implementation detail | 입력, state, objective/update, module 역할, design choice, 기존 방법과의 차이 |
| 어떻게 평가하나? | Experiments, dataset/metric/baseline, ablation | task, dataset, metric, baseline, 대표 정량/정성 근거, 특이 결과 |
| 언제 쓰면 좋은가? | Conclusion, Limitation, Failure case, Ablation | 이상적인 적용 조건, 약한 조건, 필요한 가정, 후속 연구 방향 |

예외:

- Survey/taxonomy 논문은 `Problem -> Taxonomy -> Trade-off -> Usage` 흐름이 더 자연스럽다.
- Dataset/resource 논문은 `Gap -> Dataset construction -> Supported tasks -> Evidence -> Usage` 흐름이 더 자연스럽다.
- 수식 중심 theory paper는 `Assumption -> Objective -> Derivation -> Evidence -> Limitation` 흐름이 더 자연스럽다.

### Paper Type Routing

개편 전에 논문 유형을 먼저 정한다. ORB-SLAM2와 같은 품질을 목표로 하되, 모든 논문에 sequential pipeline을 강제하지 않는다.

| 논문 유형 | 상단 visual summary | brief 유형 | 주의점 |
| --- | --- | --- | --- |
| System / pipeline paper | 단계형 flow diagram | Result Brief | 단계 사이 arrow와 실행 순서를 명확히 표시 |
| Method / theory paper | objective/assumption/derivation map | Claim-Evidence Brief | 수식 흐름과 가정, 최적화 대상을 먼저 설명 |
| Representation / scene graph paper | hierarchy/relationship diagram | Structure Brief | entity, relation, layer, query 가능성을 중심으로 구성 |
| Dataset / resource paper | data schema / collection-to-use map | Dataset Brief 또는 Use-case Brief | pipeline보다 데이터 구성, annotation, 활용 시나리오를 우선 |
| Benchmark / evaluation paper | task-metric-result map | Evaluation Brief | dataset별 수치보다 claim과 evidence 연결을 먼저 제시 |
| Survey / taxonomy paper | taxonomy grid / comparison matrix | Taxonomy Brief | 긴 연구 나열을 분류 기준과 차이점 중심으로 묶음 |

판단 기준:

- 순차 처리 단계가 논문의 핵심이면 flow diagram을 사용한다.
- 계층, 관계, 표상 구조가 핵심이면 relationship/hierarchy diagram을 사용한다.
- dataset이나 benchmark가 핵심이면 schema, metric, evidence map을 사용한다.
- 논문 유형이 애매하면 PDF의 figure 1과 contribution 문장을 기준으로 visual summary을 결정한다.

### Header

- 좌측 상단에는 홈으로 돌아가는 프로필 아이콘 버튼을 둔다.
- 상단 brand text는 개인 이름보다 `Paper Reviews`가 어울린다.
- theme toggle은 유지한다.
- 언어 토글은 개편 기본 절차에 포함한다. 별도 `index.en.html`로 이동시키기보다 같은 페이지 안에서 KO/EN이 치환되는 방식을 우선한다.

### Compact Paper Identity

긴 공식 논문 제목을 큰 H1로 쓰지 않는다. 공식 제목은 줄바꿈되면 첫 화면이 무거워지므로 작은 회색 meta text로 둔다. ORB-SLAM2와 DROID-SLAM 개편 후의 최종 기준은 “상단의 큰 제목을 없애고, 공식 논문 제목만 작게 게시”하는 쪽이다.

권장 구조:

```html
<header class="paper-identity">
  <p class="paper-title-meta">DROID-SLAM: Deep Visual SLAM for Monocular, Stereo, and RGB-D Cameras</p>
</header>
```

적용 기준:

- `.paper-title-meta`: 공식 논문 제목, venue/year, PDF 링크 같은 출처성 정보. 작고 회색.
- `.paper-reading-title`: 기본으로 쓰지 않는다. 사용자가 별도 읽기 제목을 원할 때만 짧게 추가한다.
- 공식 논문 제목이 길면 절대 hero-scale H1로 올리지 않는다.
- `PAPER MAP` 같은 별도 영문 label은 두지 않는다. 첫 섹션 제목은 바로 `핵심 요약`으로 시작한다.
- ORB-SLAM2 예시: `ORB-SLAM2: Open-Source SLAM for Monocular, Stereo, and RGB-D Cameras`만 작게 표시.
- DROID-SLAM 예시: `DROID-SLAM: Deep Visual SLAM for Monocular, Stereo, and RGB-D Cameras`만 작게 표시.

## 3. 핵심 요약 Section

`핵심 요약`은 독자가 3분 안에 논문의 지형을 잡는 TL;DR 구간이다. 길게 설명하지 않고, “무엇을 해결했는가 -> 어떤 구조로 해결했는가 -> 무엇을 봐야 하는가” 순서로 둔다.

필수 구성:

| 블록 | 목적 | 작성 방식 |
| --- | --- | --- |
| 한 문장 요약 | 논문이 해결한 문제를 한 번에 제시 | `이 논문은 A를 B 방식으로 해결한다` 형태 |
| Contribution grid | 핵심 기여 3-5개 | `Contribution 01`처럼 번호화, 본문은 짧은 요약체 |
| Insight box | 내가 얻은 관점 | 단순 재진술보다 “이렇게 읽으면 이해된다”를 제시 |
| Visual map | 논문 핵심 구조 | 논문 유형에 따라 flow, hierarchy, relationship, schema, claim-evidence map 중 선택 |
| Compare grid | modality/module/dataset 비교 | 논문 성격에 맞게 3-4개 축으로 비교 |
| TL;DR cue | 핵심 요약의 첫 좌표를 잡음 | `문제 / 해결 / 근거`처럼 2-3개 짧은 chip으로만 사용 |

Minimal description 기준:

- 장문 description을 추가하지 않는다. 카드나 grid가 너무 건조하면 `왜 중요?`, `어떻게 푸나?`, `무엇을 봐야 하나?`처럼 짧은 소제목과 한 줄 보조문만 추가한다.
- 한 카드 안의 보조문은 1문장, 18-28단어 수준을 넘지 않는다. 한국어도 한 줄에서 두 줄 정도로 끝낸다.
- `TL;DR` 구간은 독자를 설득하는 글이 아니라 독자가 아래 상세 구간을 읽을 좌표를 잡는 장치다.
- 긴 배경 설명, 예외 조건, 수식 해석은 TL;DR이 아니라 `Problem`, `Mechanism`, `Evidence`, `Usage / Limits`로 보낸다.
- TL;DR의 visual block은 “요약표만 있는 느낌”을 피하기 위해 각 block마다 매우 짧은 heading/subheading을 둘 수 있지만, paragraph를 여러 개 쌓지 않는다.
- DROID-W 기준처럼 `문제 / 해결 / 근거` cue를 둘 때는 각 chip이 한 줄 또는 아주 짧은 두 줄 안에 끝나야 한다. cue가 줄바꿈으로 흔들리면 본문으로 내려보낸다.
- `처리 흐름`, `접근 방식 비교`처럼 visual block 앞의 minimal subheading은 `.map-subsection-title`로 분리한다. 단, 이 subheading은 장식이 아니라 바로 아래 도식이 무엇을 보여주는지 말해야 한다.

표 내부 문장 스타일:

- `~다`보다 요약체를 사용한다.
- 의미가 유지되면 `~함`도 생략한다.
- 좋은 예: `오차 축소`, `scale drift 감소`, `metric scale 제공`, `pose/depth 공동 최적화`.
- 필요한 경우만 `처리함`, `사용함`, `가능함`처럼 마무리한다.
- 피할 예: `오차를 축소함`, `최적화함`, `의존함`, `제공함`처럼 명사형만으로 충분한 표현.
- 표의 행은 항상 같은 의미 단위여야 한다. 예를 들어 dataset 표에서 `sensor/GT 구성`과 `Downtown sequences`, `YouTube videos`를 같은 첫 번째 열에 섞지 않는다. sensor/GT는 별도 column이나 별도 setup 표로 분리한다.
- 화면에 보이는 제목은 논문이 전달하려는 내용을 직접 말해야 한다. `~ ledger`, `~ 읽는 법`, `~ roadmap`처럼 내부 작업 이름이나 임의의 안내문 느낌이 나는 표현은 사용하지 않는다.

## 4. Visual Summary Rule

visual summary는 논문의 핵심을 그림처럼 읽게 만드는 장치다. 단, sequential pipeline이 없는 논문에 억지로 flow arrow를 넣지 않는다.

선택 기준:

| 유형 | 사용할 도식 | 예시 |
| --- | --- | --- |
| 순차 처리 구조 | `.flow-diagram` | input -> feature -> optimization -> output |
| 계층/관계 구조 | `.relation-diagram` 또는 `.layer-diagram` | object-room-building, node-edge-camera |
| 수식/최적화 구조 | objective diagram | variables -> loss -> solver -> output |
| dataset/resource 구조 | schema diagram | source -> annotation -> split -> use case |
| 평가 중심 구조 | claim/evidence summary | claim -> metric -> dataset -> evidence |

### Reader Convenience Visual Patterns

표는 안정적이지만 모든 구간에 표만 쓰면 페이지가 건조해진다. 아래 패턴을 논문 성격에 맞게 선택한다.

| 패턴 | 적합한 상황 | 구성 |
| --- | --- | --- |
| Problem Ladder | 문제 제기가 단계적으로 쌓일 때 | 기존 가정 -> 실패 상황 -> 논문의 재정의 -> 해결 방향 |
| Design Choice Box | 논문이 A 대신 B를 선택한 이유가 중요할 때 | 선택지, 버린 이유, 채택 이유, 효과 |
| Method Stepper | 알고리즘/update 순서가 핵심일 때 | 입력, state update, loss/objective, output |
| Claim-Evidence Pair | 결과표/그림이 특정 claim을 지지할 때 | claim, evidence item, 읽는 포인트 |
| Task Evaluation Matrix | 여러 task를 평가할 때 | task, dataset, metric, baseline, 대표 결과 |
| Evaluation Evidence Panel | core evaluation과 supporting evidence가 섞일 때 | 핵심 평가, 보조 근거를 별도 table block으로 분리 |
| When to Use / Avoid | 적용 조건과 한계를 빠르게 보여줄 때 | 잘 맞는 상황, 약한 상황, 필요한 가정 |
| Failure Mode Card | limitation이나 실패 조건이 중요한 논문일 때 | 실패 조건, 원인, 완화 가능성 |
| Relation / Hierarchy Diagram | scene graph, representation, taxonomy 논문 | layer/entity/relation/query 관계 |

선택 기준:

- 비교 축이 명확하면 표를 쓴다.
- 시간/절차 흐름이 핵심이면 stepper나 flow를 쓴다.
- 원인과 결과가 누적되면 ladder를 쓴다.
- 적용 조건을 빠르게 판단하게 하려면 `When to Use / Avoid`를 쓴다.
- claim과 figure/table을 연결해야 하면 `Claim-Evidence Pair`를 쓴다.
- DROID-W처럼 평가가 tracking, qualitative reconstruction, runtime, ablation, custom dataset으로 갈라지면 `Core evaluation`과 `Supporting evidence`를 먼저 분리한다. runtime/ablation/dataset contribution은 task가 아니라 보조 근거로 다룬다.
- 단순 장식용 card는 만들지 않는다. card는 정보의 역할이 서로 분명히 다를 때만 쓴다.

### Sequential Flow Diagram

ORB-SLAM2처럼 단계 사이가 실제로 이어져 보여야 한다. DROID-SLAM에서 화살표가 빠지면 “카드 나열”처럼 보여 pipeline 이해가 떨어진다.

권장 HTML:

```html
<div class="flow-diagram" aria-label="DROID-SLAM pipeline">
  <div class="flow-step"><span>01</span><strong>Video Input</strong><p>monocular/stereo/RGB-D frame 입력</p></div>
  <div class="flow-step"><span>02</span><strong>Feature Encoder</strong><p>context와 correlation feature 추출</p></div>
  <div class="flow-step"><span>03</span><strong>Frame Graph</strong><p>연결 frame pair 구성</p></div>
  <div class="flow-step"><span>04</span><strong>Update Operator</strong><p>flow revision과 confidence 예측</p></div>
  <div class="flow-step"><span>05</span><strong>DBA Layer</strong><p>pose와 inverse depth 공동 업데이트</p></div>
  <div class="flow-step"><span>06</span><strong>Trajectory / Mapping</strong><p>frontend/backend에서 실시간 추적과 보정</p></div>
</div>
```

핵심 CSS 규칙:

```css
.flow-diagram {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 8px;
}

.flow-step {
  position: relative;
  min-height: 112px;
  border: 1px solid var(--line);
  border-radius: 8px;
}

.flow-step:not(:last-child)::after {
  content: ">";
  position: absolute;
  right: -8px;
  top: 50%;
  transform: translate(50%, -50%);
  color: var(--muted);
  font-weight: 800;
}
```

주의:

- 별도의 `.flow-arrow` 요소를 HTML에 넣지 말고, ORB처럼 `.flow-step::after`로 통일한다.
- 모바일에서는 `grid-template-columns: 1fr` 또는 `repeat(2, 1fr)`로 바꾸고, arrow가 겹치면 숨기거나 아래 방향으로 바꾼다.
- 단계 수가 7개 이상이면 카드 높이를 줄이기보다 단계명을 합친다. 예를 들어 DROID는 `Frontend/Backend`를 별도 카드로 늘리기보다 `Trajectory / Mapping`으로 묶을 수 있다.
- sequential pipeline이 논문 핵심이 아니면 이 규칙을 적용하지 않는다. 대신 위의 paper type에 맞는 visual summary를 만든다.

## 5. 논문 상세 정리

상단 요약 뒤에는 기존 내용을 `논문 상세 정리` 아래에 둔다. 다만 내부 흐름은 원문 목차를 그대로 반복하지 않고, 독자가 실제로 궁금해하는 질문 순서로 재배치한다.

권장 구조:

```html
<section class="deep-dive" aria-labelledby="deep-dive-title">
  <h2 id="deep-dive-title">논문 상세 정리</h2>
  <p class="deep-dive-note">
    아래부터는 기존 논문 내용을 최대한 담은 상세 해석이다. 핵심 흐름에서 벗어나는 배경지식, notation, 부가 자료는 접어두었다.
  </p>
  <div class="deep-dive-body">
    <div class="deep-dive-content is-collapsed" id="deepDiveContent">
      ...
    </div>
    <div class="deep-dive-more is-visible" id="deepDiveRevealWrap">
      <button class="deep-dive-more-btn" id="deepDiveReveal" type="button">더보기</button>
    </div>
  </div>
</section>
```

Deep Dive UX 기준:

- `논문 상세 정리` h2 자체는 ORB-SLAM2/DROID-SLAM처럼 담백하게 둔다. 이미 `.deep-dive` 상단 구분선이 있으므로 h2에 별도 회색 블록 배경이나 상하 라인을 과하게 추가하지 않는다.
- `더보기` 버튼은 Abstract 초반-중반을 가리는 위치에 둔다.
- blur 위쪽은 자연스럽게 강하고, 버튼 아래쪽 blur는 위쪽보다 약하게 둔다.
- collapsed 상태의 가려진 텍스트는 드래그되지 않게 `user-select: none`을 둔다.
- blur가 좌우 margin에서 잘려 보이지 않도록 `.deep-dive-body`는 `margin-inline: -24px`, `padding-inline: 24px`처럼 확장한다.
- Comments와 Deep Dive 사이 여백이 과하게 벌어지지 않도록 collapsed 높이와 bottom mask를 같이 조절한다.

상세 정리 내부 권장 흐름:

| 화면 섹션 | 역할 | 원문에서 끌어올 내용 |
| --- | --- | --- |
| `Problem` | 논문이 제기한 문제와 기존 방법의 빈틈을 먼저 보여줌 | Abstract, Introduction, Related Work, Conclusion의 문제 재진술 |
| `Mechanism` | 제안 방법이 어떤 state/objective/module로 문제를 푸는지 가장 자세히 설명 | Method/System/Theory, 핵심 수식, pipeline/system figure |
| `Evidence` | 평가 설계와 결과를 task 중심으로 묶음 | Experiments, dataset, metric, baseline, ablation, 정성 figure |
| `Usage / Limits` | 독자가 “언제 쓰면 좋은가”를 판단하게 함 | Limitation, Conclusion, failure case, ablation insight |
| `느낀점 / 향후 계획` | 개인 해석과 다음 행동을 논문 claim과 분리 | 기존 개인 메모 |

원문 섹션 처리 원칙:

- `Abstract`, `Introduction`, `Related Work`, `Conclusion`은 무조건 각각 긴 독립 section으로 유지하지 않는다. 문제 제기와 연구 위치를 만드는 데 필요한 문장만 `Problem`으로 통합한다.
- `Method/System/Theory`는 가장 자세히 다룬다. 문제 정의와 직접 연결되는 설계 선택, 수식, update, module 역할을 충분히 설명한다.
- `Experiments`는 dataset 순서보다 task 순서로 재정리한다. dataset은 task를 검증하는 수단으로 배치한다.
- 원문 전문 해석을 보존해야 하는 경우에도 화면 앞쪽은 질문 중심으로 재구성하고, 세부 원문식 설명은 토글이나 보존 block으로 둔다.

## 6. Question-Centered 변환 기준

### Problem Setting

목표:

- 독자가 먼저 “이 논문이 어떤 문제를 제기하는가”를 이해하게 한다.
- `Abstract`, `Introduction`, `Related Work`, `Conclusion`의 문제 재진술을 하나의 문제 설정으로 통합한다.
- 원문 순서로 문단을 붙이지 말고 `기존 가정 -> 실패 상황 -> 기존 접근의 한계 -> 논문의 재정의` 순서로 정리한다.

권장 구조:

| 블록 | 내용 | 표현 방식 |
| --- | --- | --- |
| 기존 가정 | 기존 방법이 암묵적으로 기대하는 조건 | 1-2문장 prose |
| 실패 상황 | 그 조건이 깨지는 scene/task | compact table 또는 checklist |
| 기존 접근 | Related Work 계열과 한계 | taxonomy table 또는 card |
| 논문의 재정의 | 이 논문이 문제를 어떻게 바꾸어 보는가 | 강조 문장 + 짧은 note |

작성 기준:

- Abstract의 한 문장 요약은 TL;DR과 중복되면 반복하지 않는다. 대신 Problem section에서는 “왜 이 문제가 어려운가”를 설명한다.
- Related Work는 citation list로 길게 노출하지 않는다. `문헌군 -> 남는 한계 -> 이 논문 연결점` 구조를 먼저 보이고, 세부 연구 나열은 toggle로 접는다.
- Conclusion에 limitation이나 future direction이 있으면 Problem에 일부 끌어와도 되지만, 공식 한계는 마지막 `Usage / Limits`에서 다시 정리한다.
- Problem section은 method보다 길어지면 안 된다. 독자가 방법론을 읽을 준비를 하는 구간이지, 모든 배경을 해설하는 구간이 아니다.

예시:

| 논문 | Problem section에서 먼저 말할 것 |
| --- | --- |
| ORB-SLAM2 | monocular scale drift와 sensor별 metric scale 문제, 실시간 back-end 설계 필요성 |
| DROID-SLAM | dense correspondence 기반 SLAM의 robustness/generalization 문제 |
| DROID-W | dynamic object가 rigid correspondence residual을 왜곡하고, segmentation prior만으로는 in-the-wild 조건을 다루기 어려움 |
| Scene graph 계열 | geometry, semantics, relation, query를 따로 저장하면 downstream reasoning이 어려움 |

### Mechanism / Method

목표:

- 독자가 “앞에서 정의한 문제를 이 논문이 어떻게 푸는가”를 가장 자세히 이해하게 한다.
- 입력, state variable, objective/update, module 역할, design choice를 문제 해결 흐름과 연결한다.
- 긴 component 설명은 `문제 -> 설계 선택 -> 핵심 수식/모듈 -> 효과` 순서로 둔다.

Method는 개편 페이지에서 가장 높은 정보 밀도를 가져도 되는 구간이다. 다만 단순 module 나열이 아니라 각 module이 어떤 failure mode를 줄이는지 설명해야 한다.

권장 구조:

| 블록 | 답해야 할 질문 | 표현 방식 |
| --- | --- | --- |
| Input / State | 무엇을 입력받고 무엇을 추정하는가 | compact table |
| Core Mechanism | 문제를 푸는 핵심 update/objective는 무엇인가 | 수식 + 짧은 해석 |
| Design Choice | 왜 이 방식을 택했는가 | compare grid 또는 decision box |
| System Operation | 실제 pipeline에서 어떻게 돌아가는가 | flow / stepper / module table |
| Failure Handling | 어떤 예외나 불안정성을 줄이는가 | note 또는 checklist |

ORB-SLAM2 기준:

| 변환 대상 | 적용 방식 |
| --- | --- |
| `구성` 문단 | `System Thread Summary` 표로 변환 |
| Tracking/Local Mapping/Loop Closing | 역할, 키워드, 읽는 포인트를 3열 이상으로 정리 |
| pipeline figure | 그림 앞에 `이 그림에서 볼 것` guide box 추가 |
| covisibility graph / MST / Essential Graph | `Graph Structures` 표로 묶음 |
| ORB feature 설명 | `ORB Feature Choice` 표로 묶음 |
| bootstrapping / projection notation | 세부식은 toggle |

DROID-SLAM에 바로 적용할 기준:

| 변환 대상 | 적용 방식 |
| --- | --- |
| RAFT와 차이 | `RAFT -> DROID` 비교 표 |
| recurrent update | `무엇을 예측하고 무엇을 최적화하나` 표 |
| DBA layer | 핵심 objective와 pose/depth update는 펼침 |
| frame graph / frontend / backend | `System Thread Summary` 표 |
| initialization 조건 | toggle 또는 compact table |
| jacobian 세부식 | appendix toggle |

DROID-W처럼 수식이 방법론의 핵심인 경우:

- `Core Equations` 같은 별도 장부형 섹션을 만들지 않는다.
- 수식은 해당 mechanism을 설명하는 문단 바로 아래에 배치한다.
- 각 수식은 `이 문제 -> 이 식 -> 그래서 무엇이 달라지는가` 순서로 해석한다.
- 보조 수식은 토글로 접되, method 본문을 읽으면 핵심 방법론은 이해되어야 한다.
- DROID-W 기준의 좋은 흐름은 `DROID-SLAM 베이스라인 -> uncertainty-aware BA -> uncertainty optimization -> SLAM operation`처럼 문제 해결 단계가 이어지는 것이다.
- `baseline`은 한국어 문맥에서 `기준선`보다 `베이스라인`이 자연스러우면 그대로 쓴다. 독자가 해당 분야에서 익숙하게 쓰는 용어를 우선한다.
- method figure는 caption 제목 줄을 먼저 굵게 두고, 설명이 필요할 때만 다음 줄에 짧은 note를 둔다. PDF에 근거 없는 `볼 점`, `강조` 문구는 만들지 않는다.

### Equations

목표:

- 핵심 수식은 논문의 중심이므로 펼쳐 둔다.
- notation과 projection 세부식은 보충으로 접는다.
- 수식은 의미만 보존하는 것이 아니라 가능한 한 원문의 형태까지 보존한다. 특히 `bmatrix/pmatrix`, piecewise/cases, align, multi-line derivation, summation 범위, norm subscript, overbar/dot notation은 구조 자체가 설명이므로 한 줄 텍스트로 납작하게 요약하지 않는다.
- 기존 개편 전 페이지에 Notion/KaTeX로 렌더된 수식 블록이 있으면 그것을 최우선으로 재사용한다. 새로 HTML 수식을 손으로 재구성하는 것은 원본 블록이 없거나 깨진 경우의 fallback이다.
- 원본 KaTeX 블록을 현재 `figure.equation` 안에 넣을 때는 바깥 카드/태그가 수식을 다시 압축하지 않도록 `.equation-main-original`, `.original-equation-part`, `.original-equation-stack` 같은 wrapper만 추가한다.
- 원본 수식 안에 이미 `(7)`, `(10)` 같은 번호가 보이면 바깥 `.equation-tag`는 숨긴다. 원본에 번호가 없을 때만 현재 페이지의 tag를 유지한다.
- 단, DROID-W의 `(4)(5)`, `(7)(8)` 또는 Chamelion의 `(8)(9)`처럼 Notion/KaTeX multi-part block의 내부 tag가 중앙으로 쏠리면 수식 본문을 다시 만들지 않는다. 원본 KaTeX body는 보존하고, 해당 figure에만 right-side `equation-tag-gutter`를 추가해 번호 위치만 보정한다.
- Chamelion처럼 원본 수식에 tag가 없거나 커스텀 fallback 수식인 경우에도 단일 numbered equation `(1)`, `(6)`, `(7)`은 `.equation-tag-gutter-stack`을 사용할 수 있다. 이때 번호는 block 수식의 tag처럼 오른쪽 끝 레일에 두고, 바깥 `.equation-tag`는 숨긴다.
- multi-line equation을 줄별로 나눠 `(2)`, `(3)`처럼 표시해야 하면 `.equation-katex-row-tags`와 `.katex-row-tag`를 쓰되, tag는 수식 바로 옆이 아니라 equation render의 오른쪽 끝에 정렬한다. 필요하면 `margin-right`로 4-8px 정도 안쪽으로 당긴다.
- `equation-tag-gutter`는 수식 번호 보정용 fallback이다. KaTeX와 비슷한 진한 본문색, `KaTeX_Main`/serif 계열, 약 `1.1rem` 크기를 사용하고 border/background를 넣지 않는다.
- gutter를 쓰는 경우에는 해당 figure 내부의 `.katex-html .tag`만 숨긴다. 페이지 전체 tag를 숨기면 다른 정상 수식 번호까지 사라질 수 있다.
- ORB-SLAM2처럼 정상적인 원본 KaTeX block이 남아 있는 경우에는 block equation 전체를 원본 렌더로 되돌리는 것을 우선한다. 특히 fraction, projection function, BA objective처럼 수식 형태가 중요한 block은 커스텀 HTML로 다시 만들지 않는다.
- equation figure의 caption 안에 inline 수식이 들어가면 본문 inline chip이나 table token과 다른 baseline scope가 필요할 수 있다. `figure.equation figcaption .inline-equation-token`처럼 caption 전용 selector로 조정하고, 표 내부 `.math-token`까지 영향을 주지 않는지 확인한다.
- 수식 설명 caption의 inline token은 읽기 보조용이므로 과한 chip 간격/색상 변경보다 본문 텍스트와 높이가 맞는 것을 우선한다.

처리 기준:

| 수식 종류 | 처리 |
| --- | --- |
| 핵심 objective/loss | 본문에 펼침 |
| 핵심 error term | 본문에 펼침 |
| notation table | toggle 또는 summary table |
| projection/inverse projection 세부식 | toggle |
| Jacobian/derivative | appendix toggle |

ORB-SLAM2 예시:

- BA objective와 reprojection error는 펼친다.
- projection function, camera notation, close/far point notation은 toggle로 접는다.

DROID-SLAM 예시:

- Dense BA objective, flow revision, confidence/weight 역할은 펼친다.
- SE(3) update, Jacobian derivation, appendix의 dense BA derivative는 toggle로 접는다.
- normal equation처럼 행렬 형태로 제시된 수식은 `B E; E^T C` 같은 평문 압축 대신 행렬 블록 형태를 유지한다. 브라우저에서 KaTeX를 안정적으로 쓸 수 없으면 HTML/CSS matrix layout으로라도 원문 구조를 복원한다.

Khronos처럼 수식이 많은 논문 기준:

- 먼저 PDF의 numbered equation을 모두 세어 `수식 처리표`를 만든다.
- `수식 처리표`는 내부 검증 산출물이다. 페이지 화면에는 `Core Equations`, `Equation Ledger`, `수식 목록` 같은 별도 장부형 제목으로 노출하지 않고, 가능하면 Method/Theory 흐름 안에 자연스럽게 통합한다.
- Method 섹션은 “어떤 문제를 어떤 수식/업데이트로 푸는가”를 가장 자세히 설명하는 구간이다. 핵심 수식은 별도 목록으로 분리하기보다 problem -> equation -> interpretation 순서로 본문에 배치한다.
- 각 수식은 `본문 펼침`, `토글 보존`, `의도적 제외` 중 하나로 분류한다. 의도적 제외는 매우 드물어야 하며 이유를 기록한다.
- notation, factorization, optimization, metric 수식은 핵심 흐름 밖이라도 삭제하지 않는다. 본문 흐름을 끊으면 수식별 토글 안에 보존한다.
- 논문 번호가 붙은 block equation은 화면에서도 `(17)`처럼 tag가 보여야 한다. source comment나 hidden annotation에만 번호가 남으면 실패다.
- PDF/Notion 변환 중 생기는 `Zbar`, `Ybar`, `Phibar`, `Rdot`, `Ndot` 같은 임시 표기는 실제 overbar/dot/subscript/superscript 표기로 바로잡는다.
- PDF에서 여러 줄로 정렬된 수식은 가능하면 여러 줄로 남긴다. 단일 줄로 합치면 행렬 곱, Schur complement, chain rule, factorization의 읽는 순서가 흐려지는 경우가 많다.
- 개편 전 정리 페이지의 수식이 가장 안정적으로 렌더링되어 있었다면, PDF와 대조한 뒤 그 HTML/KaTeX 형태를 그대로 가져온다. “요약식 페이지”라는 이유로 원본 수식을 더 단순한 커스텀 span 조합으로 바꾸지 않는다.

Inline 수식:

- 본문 글자와 섞인 수식은 `.notion-text-equation-token` 또는 `.equation-chip-group`으로 chip처럼 구분한다.
- inline 수식 토큰의 테마는 페이지 전체에서 하나로 통일한다. DROID-W 기준은 노란 note theme과 분리되는 중립 회색 chip이며, `.inline-math`, `.notion-text-equation-token`, `.math-token`, `.model-token`, `.equation-chip-part`가 서로 다른 색으로 보이면 실패다.
- comma-separated equation은 쉼표를 없애지 말고, comma를 별도 `.equation-chip-comma`로 유지한다.
- chip baseline 값은 숫자를 그대로 복사하지 않는다. DROID-W/Chamelion/VGGT처럼 page마다 token 구조가 다르므로, 본문 글자와의 높이, 같은 줄의 KaTeX token과 manual token의 상대 높이를 실제 브라우저에서 확인해 조정한다.
- 색은 강한 강조색보다 연한 warm gray/gold 계열을 사용한다.
- `\frac`가 포함된 수식은 slash text로 납작하게 보이지 않아야 한다. 원본 KaTeX가 있으면 원본 fraction rendering을 가져오고, inline 보조 notation만 남은 경우에도 stacked fraction 형태로 표현한다.
- 아래첨자/위첨자가 있는 inline 수식은 `inline-flex`가 script 위치를 납작하게 만들 수 있으므로 실제 브라우저에서 확인한다. 필요하면 `inline-block`과 `sub/sup`의 `vertical-align`을 따로 둔다.
- 쉼표로 분리되는 inline notation은 수식 chip 사이의 쉼표를 반드시 보존한다. 쉼표가 사라지면 논문 원문의 notation grouping이 바뀌어 보인다.
- VGGT처럼 한 문장 안에 KaTeX 렌더 토큰(`.notion-text-equation-token`)과 손으로 만든 토큰(`.inline-math`)이 섞이면, 두 token의 intrinsic height/baseline이 달라져 줄바꿈마다 수식이 위아래로 흔들려 보일 수 있다. 이 경우 한쪽만 보정하지 말고 공통 wrapper height와 baseline을 먼저 맞춘 뒤, manual token에만 아주 작은 `transform` 보정을 둔다.
- mixed inline token 보정은 두 가지를 모두 통과해야 한다. 첫째, 같은 줄의 KaTeX token과 manual token 중심이 맞아야 한다. 둘째, token 묶음 전체가 본문 글자 기준으로 아래로 처지거나 위로 뜨지 않아야 한다. “수식끼리만 정렬”되고 “문장 전체에서 아래로 처짐”이면 실패다.
- selector 우선순위를 반드시 확인한다. `.post-body p > ...` 규칙을 추가해도 기존 `.post-body :is(p, li, ...) > ...` 규칙이 더 높은 specificity로 이기면 실제 computed style은 바뀌지 않는다. 브라우저에서 matched rule과 computed `vertical-align`, `transform`을 확인하고, 필요하면 같은 specificity 이상의 selector로 덮어쓴다.
- 본문 inline, table/brief token, equation caption token은 서로 다른 baseline scope다. 본문 수식을 내리거나 올리는 규칙이 표 내부 `.math-token`이나 caption token에 번지면 DynaSLAM/ORB-SLAM2에서처럼 다른 위치가 다시 깨진다.
- CSS/JS를 수정한 뒤에는 해당 page의 `styles.css?v=...`, `script.js?v=...` query를 갱신한다. 캐시 때문에 이전 baseline이 남아 있으면 수정이 된 것처럼 보이지 않거나, 반대로 옛 문제를 새 문제로 오해하게 된다.

### Evidence / Evaluation

목표:

- dataset별 긴 문단을 “어떤 task/claim을 검증하는 평가인가” 중심으로 바꾼다.
- 수치 자체보다 수치가 논문의 주장과 어떻게 연결되는지를 먼저 보여준다.
- 논문이 dataset/evaluation 중심이 아니라면 `Result Brief`를 억지로 만들지 않고 `Claim-Evidence Brief`, `Structure Brief`, `Use-case Brief`로 바꾼다.

권장 구조:

1. `Evaluation Setup` 또는 `Claim-Evidence Setup`
2. task-metric-baseline table
3. task별 `Result Brief` 또는 논문 유형별 brief
4. 기존 표/그림
5. 상세 해석 문단
6. 필요 시 부가 조건 toggle

Task 중심 평가 정리 기준:

- dataset을 첫 번째 분류축으로 두지 않는다. 먼저 `tracking`, `mapping/reconstruction`, `segmentation`, `change detection`, `runtime`, `ablation`처럼 논문이 검증하는 task를 잡는다.
- 각 task 안에서 dataset, metric, baseline, 대표 결과를 묶는다.
- 하나의 task에 정량/정성 평가가 모두 있으면 기본적으로 대표 정량 1개와 대표 정성 1개만 화면에 크게 둔다.
- 추가 결과는 claim이 바뀌거나 특이한 실패/성공 사례를 보여줄 때만 추가한다.
- dataset/resource 논문처럼 dataset 자체가 contribution이면 dataset을 중심축으로 둘 수 있다. 이때도 row는 `자료군`, `수집/annotation`, `지원 task`, `평가 의미`처럼 같은 의미 단위로 유지한다.
- benchmark 논문은 `task -> metric -> dataset -> best/interesting result -> implication` 순서가 기본이다.

Result Brief 예시:

```html
<section class="result-brief" aria-labelledby="kitti-brief-title">
  <div class="result-brief-head">
    <span class="section-chip" id="kitti-brief-title">KITTI Result Brief</span>
    <p>이 결과가 어떤 주장과 연결되는지 먼저 쓴다.</p>
  </div>
  <div class="result-brief-grid">
    <article><strong>평가 조건</strong><ul class="brief-list"><li>...</li></ul></article>
    <article><strong>주요 결과</strong><p>...</p></article>
    <article><strong>예외 해석</strong><ul class="brief-list"><li>...</li></ul></article>
    <article><strong>해석 포인트</strong><p>...</p></article>
  </div>
</section>
```

ORB-SLAM2 기준:

| Evidence item | Brief에서 먼저 말할 것 |
| --- | --- |
| KITTI | stereo metric scale로 monocular scale drift 감소 |
| EuRoC | MAV의 빠른 움직임/모션 블러에서 stereo 안정성 |
| TUM RGB-D | BA 기반 localization이 dense reconstruction 품질에 주는 영향 |
| Timing | 실시간성은 ORB extraction만이 아니라 graph density/local BA 범위의 결과 |

DROID-SLAM 기준: benchmark별 수치 나열보다 어떤 task를 검증하는지 먼저 둔다.

| Evidence item | Brief에서 먼저 말할 것 |
| --- | --- |
| TartanAir | synthetic hard benchmark에서 accuracy와 robustness 동시 확인 |
| EuRoC | synthetic monocular 학습 후 real MAV 환경 generalization |
| TUM-RGBD | rolling shutter/motion blur/heavy rotation에서 catastrophic failure 감소 |
| ETH3D | RGB-D constraint를 optimization objective에 추가했을 때의 일반화 |
| Timing/Memory | 정확도뿐 아니라 GPU memory와 backend feature storage가 병목 |

DROID-W 기준: dynamic/in-the-wild SLAM처럼 실험 축이 여러 역할로 갈라지는 경우, `Core evaluation`과 `Supporting evidence`를 분리한다.

| Evidence group | 포함할 것 | 주의점 |
| --- | --- | --- |
| Core evaluation | tracking robustness, qualitative geometry처럼 논문 핵심 claim을 직접 검증하는 결과 | 대표 정량/정성 근거를 먼저 보여준다 |
| Supporting evidence | runtime, ablation, custom dataset contribution처럼 설계 주장을 보조하는 결과 | `task`라고 부르지 않고 보조 근거로 둔다 |
| Dataset detail | sensor/GT 구성, split, reference trajectory 조건 | 핵심 평가표에 섞지 말고 toggle이나 별도 setup table로 분리 |

DROID-W에서 확인한 평가 작성 기준:

- `Dataset`처럼 너무 넓은 label보다 `Custom Dataset`, `Runtime`, `Ablation`처럼 evidence axis를 명확히 쓴다.
- dataset 이름과 sensor/GT 구성은 같은 열에 섞지 않는다. `DROID-W Downtown`, `YouTube videos`는 dataset group이고, sensor/GT는 포함 내용 또는 setup column이다.
- image/table caption은 모든 이미지와 표에서 제목 줄을 `<span class="caption-main">...</span>`으로 굵게 표시한다. 설명이 필요한 경우에만 `<span class="caption-note">...</span>`를 다음 줄에 둔다. equation figure caption은 수식 설명 스타일을 유지해도 된다.
- caption note는 PDF 본문이 해당 결과를 어떻게 해석하는지 근거가 있을 때만 추가한다. Chamelion처럼 논문 본문이 각 figure/table의 역할을 실제로 해석한다면, `caption-main`은 번호/제목, `caption-note`는 해당 claim-evidence 해석 1문장으로 구성한다. 임의의 `Focus`, `강조`, 작업 중 조언은 페이지 본문에 남기지 않는다.
- Fig. 1a/Fig. 1b처럼 원래 나란히 읽히도록 만든 paired figure는 같은 row에 두고, 세로 크기가 어긋나지 않도록 이미지 높이와 object-fit을 맞춘다. 다른 이어붙인 figure/table 묶음도 같은 원칙을 적용한다.
- 제목이 비어 있는 기존 그림/표는 PDF caption을 기준으로 번호와 제목을 붙인다. 단, 설명 문장은 논문 본문에서 해당 결과를 해석한 근거가 있을 때만 추가한다.
- 한글 panel의 caption이 완전한 영어 문장으로 남지 않게 한다. `trajectory`, `ground truth`, `RMSE`, `thread`처럼 분야에서 자연스러운 용어는 남길 수 있지만, 문장 구조는 한글 독자가 읽기 자연스럽게 바꾼다.

Result Detail / Evidence Detail 기준:

- 평가 section을 높은 수준의 한 문장 요약으로만 끝내지 않는다.
- PDF의 표/그림이 논문 claim을 지지하는 핵심 근거라면, 원 숫자를 모두 복제하지 않더라도 `어떤 표/그림이 어떤 주장을 검증하는지`를 compact table로 정리한다.
- 사용자가 기존 페이지에 넣지 않은 supplementary figure/table 이미지는 compact table이나 문장 요약으로 대체한다. 별도 supplementary material이 명확하면 그 결과를 위한 독립 토글은 만들지 않고, 핵심 결론만 검증 메모에 기록한다.
- Khronos처럼 Table I-III, Figure 7-9가 각각 다른 evidence axis를 담당하면 `Result Detail` 표를 둔다.
- 표/그림별 해석은 `claim -> evidence -> 읽는 포인트` 순서로 쓴다.
- 중요한 수치가 claim 해석에 직접 필요하면 보존하고, 부가 수치는 토글로 보낸다.

표상/데이터셋/벤치마크 논문 대체 기준:

| 논문 유형 | Brief에서 먼저 말할 것 |
| --- | --- |
| Representation / scene graph | 구조가 어떤 entity/relation/query를 가능하게 하는가 |
| Dataset / resource | 데이터 구성, annotation, split, 활용 시나리오가 무엇인가 |
| Benchmark / evaluation | 어떤 claim을 어떤 metric/dataset이 지지하거나 반박하는가 |
| Survey / taxonomy | 연구들을 나누는 기준과 각 계열의 trade-off가 무엇인가 |

### Usage / Limits / Conclusion / 느낀점

목표:

- 논문의 주장 재확인과 내가 얻은 관점을 분리한다.
- 개인적인 느낀점은 유지하되, 논문 설명과 섞이지 않게 둔다.
- 독자가 “어떤 문제에 이 방법을 적용하면 좋은가”와 “어떤 조건에서 조심해야 하는가”를 빠르게 판단하게 한다.

처리:

- Usage / Limits는 evaluation 뒤에 짧게 둔다. `잘 맞는 상황`, `약한 상황`, `필요한 입력/가정`, `후속 연구 방향`을 2-4개 bullet 또는 compact table로 정리한다.
- Conclusion은 3문장 이내로 요약한 뒤 기존 해석을 보존한다.
- 원 논문에 Conclusion이 있으면 짧더라도 누락하지 않는다. 평가 뒤에서 바로 개인 느낀점으로 넘어가면 논문 공식 주장과 개인 해석이 섞여 보일 수 있다.
- Conclusion은 `논문이 최종적으로 주장한 것`, 느낀점은 `내가 읽고 얻은 관점`, 향후 계획은 `내가 다음에 해볼 것`으로 역할을 분리한다.
- 느낀점과 향후 계획은 기본적으로 별도 마지막 section의 문단형 글로 유지한다. 노란 `정리 노트`, result brief, 표/card UI로 바꾸지 않는다.
- 향후 계획이 너무 길면 bullet로 압축할 수 있지만, 독자에게 보여줄 개인적 사고 흐름은 문단으로 남기는 쪽을 우선한다.

Usage / Limits 표 예시:

| 항목 | 정리할 내용 |
| --- | --- |
| 잘 맞는 문제 | 논문의 가정과 입력 조건이 충족되는 task |
| 약한 조건 | initialization, dynamic object, lighting, scale, compute 등 실패 가능 조건 |
| 필요한 자원 | sensor, GT, training data, GPU, calibration, prior model |
| 다음 질문 | 후속 연구나 내가 프로젝트에 적용할 때 확인할 점 |

## 6.1 Tone Normalization Rule

Notion 독서 메모에는 이해를 돕기 위해 친근한 표현이나 임시 제목이 들어갈 수 있다. 개편된 논문 페이지에서는 이러한 표현을 그대로 노출하지 않는다.

정리 기준:

- `우리는 이런걸 만들었어요`, `찾아보니 이런게 있더라구요`, `대단해요`, `이런 환경에서 진행했어요`처럼 구어체/메모체로 적힌 문구는 PDF의 실제 section 의도에 맞춰 공식적인 라벨로 바꾼다.
- 예: `우리는 이런걸 만들었어요` -> `제안하는 시스템`, `찾아보니 이런게 있더라구요` -> `기반 데이터 구조`, `이런 환경에서 진행했어요` -> `실험 환경`.
- 이모지, 감탄 부호, 과한 평가 표현은 개인 느낀점이 아닌 논문 설명 영역에서는 제거한다.
- 기존 메모의 친근한 톤이 의미를 잘 잡고 있더라도, 최종 화면에서는 논문 claim, method role, evaluation condition을 드러내는 제목으로 다시 쓴다.
- 개인적인 해석 톤은 `느낀점` 또는 `향후 계획`에만 남긴다.

검증:

- [ ] deep dive의 blockquote/보조 제목에 구어체 문구가 남아 있지 않은가?
- [ ] PDF section 의도와 맞지 않는 임시 제목을 그대로 쓰지 않았는가?
- [ ] 개인적 감상과 논문 주장 설명이 제목/톤에서 분리되어 있는가?

## 7. Table / Visual Summary Rule

문단이 깊게 들어가거나 같은 문법이 반복되면 표, 카드, 체크리스트, ladder 중 가장 자연스러운 시각 요약으로 바꾼다.

중요한 기준은 “문장을 없애는 것”이 아니라 “반복되는 구조를 눈으로 먼저 보이게 만드는 것”이다. 표는 비교 축이 명확할 때만 쓰고, 순서/조건/종류/검증 항목처럼 나열 자체가 핵심인 경우에는 visual summary block을 우선한다.

표로 바꿀 대상:

- 구성 요소 설명
- graph 구조 설명
- module별 역할
- dataset별 결과
- metric 정의
- contribution 나열
- ablation 결과
- 장점/한계 비교

표보다 visual summary가 나은 대상:

- `(1)(2)(3)` 또는 `(a)(b)(c)`처럼 원문이 종류를 나누는 구간
- Notion `bulleted-list`, `numbered-list`가 중첩되어 문단처럼 쌓인 구간
- constraint, criterion, checklist, task, use case처럼 항목 간 비교보다 항목 자체의 역할이 중요한 구간
- layer/hierarchy처럼 위계가 중요한 구간
- 같은 문법이 반복되지만 표의 행/열로 넣으면 오히려 의미가 딱딱해지는 구간

선택 기준:

| 원본 패턴 | 우선 표현 | 예시 |
| --- | --- | --- |
| `(1)(2)` constraint | two-card visual summary | Framing / multi-view consistency |
| `(a)(b)(c)` task 또는 user study 단계 | checklist rows | label 확인, mask quality 확인, mask correction |
| hierarchy/layer | ladder rows 또는 compact card stack | building -> room -> object -> camera |
| evaluation variant | lanes/cards 또는 table | 2D task / 3D task / relationship task |
| contribution 또는 use case 나열 | card grid | unified semantics, camera grounding, query support |

3D_SG에서 확정한 local CSS 패턴:

```css
.visual-summary
.visual-summary-soft
.visual-card-grid
.visual-card-grid-three
.visual-card-grid-four
.visual-card
.visual-card-badge
.visual-list
.visual-list-row
```

작성 규칙:

- visual block 앞뒤에는 짧은 설명 문장을 남겨 논문 흐름이 끊기지 않게 한다.
- visual block이 기존 bullet을 대체했다면 같은 내용을 raw list로 다시 반복하지 않는다.
- 정보 손실이 걱정되면 긴 원문식 설명은 toggle 내부로 옮기고, 본문에는 요약 block만 둔다.
- 표가 이미 내용을 요약했다면 바로 뒤의 반복 문단은 압축하거나 제거한다.
- 남겨야 하는 Notion bullet/numbered list도 bare list로 방치하지 말고 card-like list 스타일을 적용한다.
- toggle 내부라도 3단 이상 중첩된 bullet은 그대로 방치하지 않는다. 앞에 card/checklist/ladder summary를 두고, raw list는 보충 자료로만 보이게 한다.
- 실험 조건처럼 “재현성 확인용 항목”은 table보다 checklist summary가 자연스러운 경우가 많다.
- 관련 연구처럼 “계열별 흐름”이 중요한 구간은 taxonomy table 또는 compact card stack을 먼저 둔다.
- 원문에 명시된 subsection이 아니더라도, 독자 이해에 필요한 분해 단위가 있으면 보조 라벨을 만든다. 단, 이 라벨은 paper section heading처럼 크게 보이지 않게 하고, “해석용 독서 보조 라벨”임이 드러나는 회색 둥근 직사각형으로 둔다.
- `closed-set/open-set`, `geometry/semantics`, `method/baseline/gap`, `input/state/output`처럼 개념이 둘 이상으로 갈라지는 장문은 먼저 scope table 또는 compact compare block으로 분리한다.
- KO/EN 버전 모두 같은 수준의 구조와 밀도로 반영한다.

권장 HTML:

```html
<section class="summary-panel" aria-labelledby="system-map-title">
  <div class="summary-head">
    <span class="section-chip" id="system-thread-title">System Thread Summary</span>
    <p>이 표를 보기 전에 잡아야 할 한 문장 관점.</p>
  </div>
  <div class="summary-table-wrap">
    <table class="summary-table">
      <thead>
        <tr><th>구성</th><th>무엇을 담당하나</th><th>핵심 키워드</th><th>읽는 포인트</th></tr>
      </thead>
      <tbody>
        <tr>
          <td><p class="summary-term">Tracking</p><p class="summary-key">front-end</p></td>
          <td><ul class="summary-list"><li>현재 frame pose 추정</li><li>motion-only BA 적용</li></ul></td>
          <td><ul class="summary-list"><li>feature matching</li><li>reprojection error</li></ul></td>
          <td>매 frame pose를 빠르게 잡는 단계</td>
        </tr>
      </tbody>
    </table>
  </div>
</section>
```

작성 규칙:

- 표의 첫 열은 keyword 중심.
- 두 번째 열은 역할.
- 세 번째 열은 논문 키워드.
- 마지막 열은 독자가 어떻게 읽어야 하는지.
- 긴 문장은 bullet로 쪼갠다.
- 표 내부 본문은 제목보다 작게 둔다.

### Visual Conversion Decision Tree

긴 문단을 만났을 때는 아래 순서로 판단한다.

1. 비교 축이 분명한가? 예: method/baseline/gap, dataset/metric/result, closed-set/open-set. 그러면 `summary-table`.
2. 순서가 핵심인가? 예: update step, annotation process, robot pipeline. 그러면 `flow-diagram`, `visual-list-row`, `supplement-stepper`.
3. 계층이 핵심인가? 예: building-room-object, mesh-place-room, geometry-semantics-language. 그러면 `ladder`, `relation-diagram`, `visual-card stack`.
4. 항목의 역할만 빠르게 봐야 하는가? 예: contribution, use case, failure mode. 그러면 `visual-card-grid`.
5. 원문 보존이 필요한가? 그러면 본문에는 summary block을 두고, 상세 원문은 `supplement-toggle` 내부에 보존한다.

주의:

- 단순히 “글이 길다”는 이유만으로 표를 만들지 않는다. 표는 비교 축이 있을 때 가장 자연스럽다.
- 반대로 `(1)(2)(3)`, `(a)(b)(c)`, 깊은 bullet이 있으면 raw 문단으로 방치하지 않는다.
- visual block을 넣은 뒤에도 앞뒤에 흐름을 잇는 1-2문장 prose를 남긴다.

## 8. Toggle Rule

토글은 “덜 중요해서 숨긴다”가 아니라 “흐름 밖 정보를 접어둔다”는 의미다.

토글로 접을 것:

- Related Work 세부 연구 나열
- notation 정의
- projection/Jacobian 세부식
- dataset 촬영 조건
- appendix additional results
- 본문 흐름을 끊는 참고 이미지
- 이미 표로 요약한 뒤 남는 원문식 긴 설명

토글 UI 기준:

- 닫힌 상태의 존재감은 낮게 둔다.
- summary 글자도 옅게 둔다.
- 펼친 내부 본문은 옅게 만들지 않는다.
- 펼친 내용은 좌우 margin을 줘서 summary 선에 너무 붙지 않게 한다.
- 토글 제목에는 `자세히 보기`, `세부식 보기`, `부가 조건 보기`처럼 역할을 명확히 쓴다.
- 토글 내부도 raw archive처럼 두지 않는다. 펼쳤을 때 첫 화면에 `보충 구조 요약`, `taxonomy table`, `수식 역할 요약`, `setup checklist` 중 하나를 먼저 두고, 긴 원문식 메모는 그 뒤에 보존한다.
- 토글 내용이 길면 가장 아래쪽 우측에 `접기 / Close section` 버튼을 둔다. 버튼은 토글 내부 배경과 어울리는 작은 pill로 만들고, 클릭 시 해당 summary 근처로 자연스럽게 돌아가게 한다.
- Related Works 토글은 citation list를 그대로 두기보다 `geometric mapping`, `probabilistic semantics`, `open-dictionary semantics` 같은 taxonomy를 먼저 보여준다.
- Method/notation 토글은 수식 원문보다 먼저 “어떤 state variable을 업데이트하는가”를 나타내는 수식 역할 요약을 둔다.

Contained toggle focus 기준:

- 토글을 열면 화면 전체가 움직이는 긴 `<details>`가 아니라, topbar 바로 아래에 고정 높이의 focused panel처럼 보여야 한다.
- 열린 토글에는 `.is-focused-supplement`를 붙이고, body에는 `.supplement-focus-active`, root에는 필요 시 `.supplement-scroll-lock`을 붙인다.
- panel top은 topbar 높이를 반영한 `--supplement-panel-top`, 폭은 원래 details의 `left/width`를 반영한 `--supplement-panel-left`, `--supplement-panel-width`로 잡는다.
- 토글 위치가 페이지 아래쪽이어도 panel height는 일정해야 한다. 현재 viewport에서 남은 높이로 계산하면 아래쪽 토글이 작게 뜨므로, topbar 기준 `availableHeight = viewportHeight - panelTop - bottomInset` 방식으로 계산한다.
- 열릴 때 `details.scrollTop = 0`으로 내부 스크롤을 맨 위에 둔다.
- 내부 scroll은 details panel 하나에만 생겨야 한다. `.appendix-details`에 별도 `overflow-y:auto`를 주지 않는다.
- 내부 스크롤 위치를 보여주는 indicator는 details의 `scrollTop/clientHeight/scrollHeight` 기준으로 계산한다.
- `접기 / Close section` 버튼은 `.supplement-close-row` 안의 오른쪽에 두고 scrollbar와 겹치지 않게 padding-right를 확보한다.
- 닫을 때는 토글 summary가 topbar 바로 아래로 오도록 `scrollIntoView`와 임시 `scroll-margin-top`을 사용한다.
- 긴 토글은 lazy body를 써도 되지만, placeholder가 오래 보이거나 이미지 로딩 때문에 panel 높이가 흔들리면 안 된다.
- 토글 내부 이미지에는 `loading="lazy"`를 적용하되, 열림 직후 panel 크기 계산은 이미지 로드 여부와 독립적으로 안정적이어야 한다.
- 긴 수식 토글은 마지막 수식 설명이 close bar 또는 하단 blur에 가려지기 쉽다. focused panel의 bottom padding은 충분히 크게 두고, equation stack에는 필요하면 추가 bottom buffer를 둔다.
- CSS/JS를 고친 뒤에도 브라우저가 이전 토글 동작을 유지하면 stylesheet/script query version을 갱신한다.

권장 CSS 핵심:

```css
.post-body details.supplement-toggle {
  border-color: color-mix(in srgb, var(--muted) 10%, var(--line));
  background: color-mix(in srgb, var(--panel2) 34%, transparent);
}

.post-body details.supplement-toggle:not([open]) > summary {
  color: color-mix(in srgb, var(--muted) 92%, var(--text));
}

.post-body details[open] > :is(p, ul, ol, figure, table, blockquote, h3, h4),
.post-body details[open] > div[style*="display:contents"] > :is(p, ul, ol, figure, table, blockquote, h3, h4) {
  margin-left: 18px;
  margin-right: 18px;
  max-width: calc(100% - 36px);
}
```

토글 QA에서 실제로 봐야 할 증상:

- 아래쪽 토글을 열었을 때 panel이 작게 뜨면 `availableHeight` 계산이 현재 details 위치에 의존하는지 확인한다.
- 내부 스크롤바가 2개면 `details`와 `.appendix-details` 양쪽에 overflow가 걸린 것이다.
- close bar 아래로 뒤쪽 본문이 보이면 focused panel의 bottom padding과 close row 배경이 부족한 것이다.
- 토글 마지막 문단이나 마지막 수식 설명이 close bar에 살짝 가리면 bottom padding이 부족한 것이다. long/수식 토글은 바닥까지 스크롤한 상태를 반드시 확인한다.
- 접은 뒤 위치가 어긋나면 close handler에서 열린 위치가 아니라 닫힌 summary 기준으로 다시 정렬해야 한다.

## 9. Section Note / Brief Theme

노란색 계열은 “섹션별 정리 노트” 역할에만 사용한다.

용도:

- 섹션 끝에서 사용자가 본인의 이해를 확인하게 함.
- 평가 결과에서 dataset별 메시지를 빠르게 잡게 함.
- 논문 전체 insight를 따뜻하게 강조함.

사용 금지:

- 단순 subsection 제목.
- 일반 강조.
- toggle summary.
- 모든 표의 기본 테마.

범위:

- 여기서 말하는 노란 theme은 `section-note`, `result-brief`, `claim/structure/use-case brief`처럼 넓은 배경을 가진 정리 블록을 의미한다.
- inline equation chip처럼 본문 안에서 작은 토큰을 구분하기 위한 매우 옅은 warm tint는 note/brief theme으로 보지 않는다. 단, 노란 정리 노트처럼 보일 정도로 면적과 채도를 키우지 않는다.

글꼴:

- 한글: `Noto Serif KR`
- 영어: `EB Garamond`
- 너무 장식적인 fantasy font는 본문 가독성을 해치므로 사용하지 않는다.

내용 크기:

- `section-note-label`, `result-brief .section-chip`, 기타 brief chip: 제목 역할.
- 본문 p, li는 제목보다 작게.
- bullet이 있든 없든 같은 크기 규칙을 적용한다.

권장 typography 기준:

| 요소 | 기준 |
| --- | --- |
| 본문 문단 | 페이지 기본 본문 크기 유지 |
| `summary-table td`, `summary-table li` | 본문보다 약간 작게 |
| `section-note p`, `section-note li` | note label보다 작고, bullet 유무와 무관하게 동일 크기 |
| `result-brief-head p`, `result-brief article p/li` | brief chip보다 작고 서로 동일 크기 |
| `details > summary` | 주변 본문보다 작고 옅게, 대략 13px / 1.45 계열 |
| 오른쪽 bookmark major/minor | major는 약 12px, minor는 약 11.5px 계열 |

검증은 눈대중만으로 끝내지 말고 실제 computed style로 확인한다. KO/EN 전환 후 같은 요소의 `font-size`, `line-height`, `font-weight`가 달라지면 수정한다.

## 10. Heading Theme

중제목과 소제목은 검정-회색 계열의 미니멀/모던 톤으로 통일한다.

기준:

- 일반 `h2`: 큰 section 구분. 필요하면 소제목보다 조금 더 진한 회색계 배경을 사용할 수 있다.
- 단, `논문 상세 정리`의 `.deep-dive > h2`는 예외다. 이미 `.deep-dive` 상단 구분선이 있으므로 ORB-SLAM2/DROID-SLAM처럼 별도 배경 없이 담백하게 둔다.
- `h3`: 논문 원문의 section heading. block형으로 넓게 펼침.
- `blockquote`: `A. Tracking`, `B. System Bootstrapping` 같은 subsection. 가로 길이는 본문 폭 전체에 맞춘다.
- 본문 흐름 중간의 보조 소제목은 pill이 아니라 모서리가 둥근 직사각형 라벨로 둔다. 예: DROID-SLAM의 `Feature Extraction`, `Correlation Pyramid`, 3D_SG의 `Scene Graph`, `Multi-view consistency`.
- pill 형태의 `section-chip`은 summary panel, visual summary, result brief처럼 “박스 내부 제목”에만 사용한다.
- heading width를 글자 수에 맞게 줄이지 않는다.
- `Place Recognition Module`, `B. System Bootstrapping`, `Motion-only BA`처럼 성격이 비슷한 제목은 같은 UI 체계를 사용한다.
- heading 자체에 노란 note theme을 쓰지 않는다.

보조 소제목 라벨 CSS 기준:

```css
.section-chip-row,
.post-body .deep-dive p:has(> mark.highlight-gray_background:only-child){
  display: flex;
  align-items: center;
  margin: 28px 0 10px;
  padding-top: 16px;
  border-top: 1px solid color-mix(in srgb, var(--muted) 13%, transparent);
}

.section-chip-row .section-chip,
.post-body .deep-dive p > mark.highlight-gray_background:only-child{
  min-height: 30px;
  padding: 6px 11px;
  border: 1px solid color-mix(in srgb, var(--text) 10%, var(--line));
  border-left: 3px solid color-mix(in srgb, var(--text) 28%, var(--line));
  border-radius: 8px;
  background: color-mix(in srgb, var(--panel) 78%, transparent);
  color: color-mix(in srgb, var(--text) 72%, var(--muted));
  font-size: 12.5px;
  font-weight: 780;
  line-height: 1.3;
}
```

## 11. Emphasis Rule

강조는 논문을 다 읽고 핵심 문맥을 잡은 뒤 최소한으로 적용한다.

강조는 “보기 예쁘게 만드는 장식”이 아니라, 독자가 논문의 구조를 오해하지 않도록 돕는 reading aid다. 따라서 PDF를 읽기 전에는 강조를 확정하지 않는다.

기존 Notion/HTML에 들어간 bold, 형광펜, 밑줄, 색상 표시는 최종 기준이 아니다. 모두 임시 독서 흔적으로 보고, 원 논문이 실제로 강조하는 문제의식, contribution, method dependency, evaluation claim을 기준으로 다시 고른다. 기존 강조가 PDF 문맥과 맞지 않으면 과감히 제거하거나 다른 표현으로 옮긴다.

해석도 마찬가지다. 기존 문장이 자세하더라도 원 논문의 의도와 다르게 읽히거나, section 흐름상 conclusion을 앞당겨 말하거나, 실험 결과를 과장하면 수정한다. 이때 원문 그림/수식/세부 설명은 가능한 보존하되, 해석 문장의 방향은 PDF 기준으로 바로잡는다.

### PDF-Based Emphasis Pass

강조 후보는 반드시 원 논문 PDF에서 먼저 뽑는다.

작업 순서:

1. PDF의 `Abstract`, `Introduction`, `Method/System`, `Experiments`, `Conclusion`에서 반복 등장하는 핵심 mechanism과 claim을 표시한다.
2. 각 후보가 `논문 전체 기여`, `기존 방법과의 차이`, `실험 결과 해석`, `failure mode`, `limitation` 중 어디에 해당하는지 분류한다.
3. 기존 Notion 정리의 bold/형광펜/밑줄은 일단 모두 무시하고, PDF 기반 후보만으로 강조 초안을 만든다.
4. 기존 강조 중 PDF 기반 후보와 겹치는 것만 다시 살린다.
5. PDF 근거가 약한 임의 강조는 제거한다.
6. 최종 화면에서는 한 문단에 1-2개 이하의 강조만 남긴다.

권장 기록 형식:

| 후보 키워드 | PDF 근거 위치 | 강조 이유 | 최종 처리 |
| --- | --- | --- | --- |
| `local BA` | Method/System | 실시간성과 정확도 trade-off를 설명하는 핵심 mechanism | `<strong>` 유지 |
| `catastrophic failure` | Introduction/Evaluation | DROID-SLAM의 robustness claim 해석에 필요 | result brief와 본문에서만 강조 |
| `multi-view consistency` | Method/Evaluation | 3D label correction의 핵심 장치 | flow와 method summary에서 강조 |

강조 금지:

- PDF에 없는 해석을 핵심 claim처럼 굵게 표시하지 않는다.
- 단순히 자주 등장한다는 이유만으로 모든 technical term을 강조하지 않는다.
- 표 제목, section chip, result brief 제목에 이미 들어간 단어를 본문에서 반복 강조하지 않는다.
- 사용자가 임의 강조를 요청하더라도, PDF 문맥상 핵심이 아니면 줄이거나 제거한다.
- 기존 정리에 형광펜이 있다는 이유만으로 그대로 유지하지 않는다.

강조할 것:

- 논문 전체 기여를 관통하는 mechanism.
- 기존 방법과 갈라지는 핵심 차이.
- 평가 결과를 해석하는 데 필요한 failure mode.
- 독자가 놓치면 구조를 오해하는 용어.

강조하지 않을 것:

- 이미 표 제목에 들어간 단어.
- 단순 번역어.
- 반복되는 일반 명사.
- 모든 등장 키워드.

### Color Word Emphasis

ORB-SLAM2처럼 본문에서 색을 직접 설명하는 경우, 색상 단어는 해당 색으로 자연스럽게 강조할 수 있다. 단, 과한 형광펜처럼 보이면 안 되며, 문장 안에 조용히 녹아들어야 한다.

적용 대상:

- Figure나 legend를 설명하면서 `파란색`, `빨간색`, `초록색`, `노란색`, `회색`처럼 색상 자체가 독해 단서인 경우.
- “파란 선은 camera trajectory, 빨간 점은 keyframe”처럼 그림을 따라 읽는 데 필요한 경우.
- 원 논문 figure caption이나 본문에서 색상을 구분 기준으로 사용한 경우.

적용하지 않을 대상:

- 색상이 비유적으로 쓰인 표현.
- UI theme을 설명하는 내부 문장.
- 이미 그림 바로 아래 caption에서 충분히 설명한 색상.
- 색상 단어가 너무 자주 반복되어 본문이 산만해지는 경우.

권장 HTML:

```html
<span class="color-word color-blue">파란색</span>
<span class="color-word color-red">빨간색</span>
<span class="color-word color-green">초록색</span>
<span class="color-word color-yellow">노란색</span>
<span class="color-word color-gray">회색</span>
```

권장 CSS:

```css
.color-word{
  font-weight: 760;
}

.color-blue{ color: #2563eb; }
.color-red{ color: #dc2626; }
.color-green{ color: #16a34a; }
.color-yellow{ color: #b7791f; }
.color-gray{ color: #64748b; }
```

주의:

- 색상 강조는 text color만 바꾸고 background highlight는 사용하지 않는다.
- dark theme에서도 읽히도록 너무 밝거나 채도가 높은 색은 피한다.
- 한 문단에 여러 색상 단어가 나오면 필요한 색상 단어에만 적용한다.
- 색상 강조는 PDF/figure를 이해하기 위한 보조 장치이지, 핵심 키워드 강조를 대체하지 않는다.

ORB-SLAM2 핵심 강조 후보:

- `metric scale`
- `scale drift`
- `keyframe`
- `local BA`
- `covisibility graph`
- `loop closing`
- `map reuse`
- `Full BA`

DROID-SLAM 핵심 강조 후보:

- `Dense Bundle Adjustment(DBA) layer`
- `recurrent update`
- `flow revision`
- `pose와 inverse depth 공동 최적화`
- `frame graph`
- `catastrophic failure`
- `cross-dataset generalization`
- `test-time sensor constraint`

## 12. Right Bookmark Rule

오른쪽 책갈피는 현재 읽는 section을 실시간으로 알려주는 보조 내비게이션이다.

기준:

- 위치는 오른쪽 sidebar.
- 왼쪽 프로필 메뉴는 제거하고, 본문은 약간 왼쪽으로 당긴다.
- 본문 왼쪽 여백은 완전히 없애지 않는다.
- bookmark는 `.paper-map h2`, `.deep-dive > h2`, `.deep-dive h3[id]`, `.deep-dive blockquote[id]` 기준으로 만든다.
- 클릭 시 heading 자체로 이동해야 하며, 그 아래 첫 subsection으로 어긋나면 안 된다.
- active 상태는 배경/좌측 선/색상으로 표시하고, font-size나 font-weight 변화로 레이아웃이 흔들리게 하지 않는다.
- active item이 sidebar 안에서 보이지 않게 되면 `scrollIntoView({ block: "nearest" })`로 따라오게 한다.
- 상단 책갈피는 두지 않는다.

## 13. Link Preview Rule

GitHub, project page, paper PDF 링크는 단순 텍스트 링크보다 preview card가 좋다. 다만 preview card는 논문 이해나 구현 재현에 실제로 도움이 될 때만 둔다. 논문 자체의 공식 repository가 없고 관련 codebase만 있을 때는 `Related GitHub`처럼 관계를 명확히 표시한다.

권장:

```html
<a class="link-preview" href="https://github.com/princeton-vl/DROID-SLAM" target="_blank" rel="noopener">
  <span class="link-preview-icon">GitHub</span>
  <span>
    <strong>DROID-SLAM Project Repository</strong>
    <small>Code, setup guide, pretrained checkpoints</small>
  </span>
</a>
```

기준:

- Notion embed처럼 제목, 설명, host를 카드 안에 둔다.
- 외부 링크는 `target="_blank" rel="noopener"`를 사용한다.
- preview card는 주요 링크에만 사용하고, 본문 중 모든 링크를 카드로 바꾸지 않는다.
- 상단 paper identity 근처에는 link preview를 기본으로 두지 않는다. 공식 논문 제목과 핵심 요약이 먼저 보여야 하며, `Official Repository` 카드가 첫 화면의 밀도를 흐리면 제거한다.
- code/project 링크가 논문 이해에 필수라면 `핵심 요약` 아래가 아니라 관련 method, implementation, appendix 구간에 배치한다.

배치 판단:

| 상황 | 처리 |
| --- | --- |
| 논문 공식 repository가 method 재현에 중요 | `핵심 요약` 끝 또는 method 구현 구간에 preview card |
| 관련 codebase이지만 논문 공식 repo가 아님 | `Related GitHub`로 표시하고 관계를 설명 |
| 첫 화면 밀도를 흐림 | 상단에서는 제거하고 implementation/appendix 구간으로 이동 |
| 논문 이해와 직접 관련이 낮음 | 일반 링크 또는 생략 |

## 14. Language Toggle / English QA

언어 토글은 개편 기본 범위에 포함한다. 사용자가 “같은 사이트 안에서 바뀌는 느낌”을 선호하므로, 별도 `index.en.html` 이동 방식보다 현재 페이지 안에서 치환하는 방식을 우선한다.

### 구현 기준

- 버튼은 `<button id="langBtn" type="button">`으로 유지한다.
- 언어 상태는 `document.documentElement.lang`, `document.documentElement.dataset.pageLang`, `#langBtn.dataset.lang` 세 곳이 함께 바뀌어야 한다.
- 원문 HTML은 한국어로 유지할 수 있지만, 영어 모드에서는 visible text 기준 한글 잔여가 없어야 한다.
- 번역 대상이 `<strong>`, KaTeX, table, details 안에서 여러 text node로 쪼개지면 text replacement보다 container 단위 `richTranslations`를 우선한다.
- 한국어 원문 복구를 위해 `dataset.i18nKo` 또는 `WeakMap`에 원문을 저장한다.
- JS를 수정한 뒤에는 `script.js?v=...` query를 갱신해 브라우저 캐시가 이전 번역 코드를 잡지 않게 한다.
- Giscus처럼 외부 script는 `data-lang` 변경만으로 즉시 재렌더링되지 않을 수 있으므로, 본문 언어 QA와 분리해서 본다.
- KO/EN을 별도 panel로 구성할 때 같은 그림을 다시 넣으면, 한국어 원문에만 있던 `style="width:..."`가 영어 panel에는 빠지기 쉽다. 동일 이미지의 렌더링 폭은 CSS의 `img[src*="media_xxx"] { max-width: min(100%, Npx); }`로 맞춘다.
- 같은 이미지가 KO/EN panel에 중복될 때는 두 언어의 rendered width가 같아야 한다. 한국어 panel에만 inline width가 있으면 영어 panel 이미지가 컨테이너 폭까지 커질 수 있으므로, CSS max-width와 함께 `src -> width` 동기화 로직을 둔다.
- width sync는 모든 `[data-lang-panel] img` 또는 `[data-lang-block] img`를 돌며, inline width가 있는 원본 이미지를 `src` 기준으로 기록하고, width가 없는 동일 이미지에 `style.width`와 `style.maxWidth`를 채우는 방식이 안정적이다.
- 단, 원본 폭이 비정상적으로 큰 경우를 막기 위해 0보다 크고 900px 이하인 값만 sync 대상으로 삼는다.
- KO/EN 전환 후 `section-chip`, `subsection-label`, `summary-table td`, `section-note/result-brief` 본문, `details > summary`의 font-size/line-height가 서로 달라지지 않는지 실제 computed style로 확인한다.

### Selector Hygiene

Notion export의 id는 숫자로 시작하는 경우가 많다. CSS selector에서 숫자로 시작하는 id를 `#2d0f...` 형태로 쓰면 invalid selector가 되므로 반드시 attribute selector를 사용한다.

좋은 예:

```js
["[id=\"2d0f65f1-13f4-8028-aa6f-f85e802b222a\"]", "English text..."]
```

피할 예:

```js
["#2d0f65f1-13f4-8028-aa6f-f85e802b222a", "English text..."]
```

주의:

- `querySelectorAll()`을 `try/catch`로 감싸면 invalid selector가 조용히 무시될 수 있다.
- ORB-SLAM2는 `[id="..."]`를 사용해 정상 동작했지만, DROID-SLAM은 `#숫자ID` 때문에 버튼은 EN으로 바뀌고 본문은 한국어로 남는 문제가 생겼다.
- 새 페이지에 언어 토글을 넣기 전 `rg -n '\["#[^" ]+' pages/paper_reviews/<PAGE>/script.js`로 위험 selector를 검사한다.

### English QA Checklist

- [ ] 영어 버튼 클릭 후 `document.documentElement.lang === "en"`인가?
- [ ] `#langBtn.dataset.lang === "en"`인가?
- [ ] Abstract 첫 문단이 영어로 바뀌는가?
- [ ] Introduction 첫 문단이 영어로 바뀌는가?
- [ ] details 내부, table 내부, note/brief 내부에도 한글이 남지 않는가?
- [ ] 본문 scope 기준 `/[가-힣]/` scan 결과가 0인가? 단, Giscus/comments 같은 외부 영역은 별도 검사로 분리한다.
- [ ] 다시 KO로 눌렀을 때 원문 한국어가 정상 복구되는가?
- [ ] `node --check pages/paper_reviews/<PAGE>/script.js`가 통과하는가?
- [ ] `git diff --check`가 통과하는가?

검증용 브라우저 콘솔 스니펫:

```js
(() => {
  const samples = [];
  let count = 0;
  document.querySelectorAll(".post-body *, .paper-map *, .section-bookmark *").forEach((el) => {
    const style = getComputedStyle(el);
    if (style.display === "none" || style.visibility === "hidden") return;
    Array.from(el.childNodes).forEach((node) => {
      if (node.nodeType !== Node.TEXT_NODE) return;
      const text = node.nodeValue.replace(/\s+/g, " ").trim();
      if (!/[가-힣]/.test(text)) return;
      count += 1;
      if (samples.length < 20) samples.push(text);
    });
  });
  return { count, samples };
})();
```

## 15. 10-Unit Component Workflow

새 페이지 개편은 “몇 개 큰 덩어리를 한 번에 바꾸고 나중에 검증”하는 방식으로 진행하지 않는다. DROID-W 페이지에서 정리한 최적 단위는 `9개 구성 요소 작업 + 1개 최종 DROID-W 회귀 검증`이다. 각 unit은 작업과 gate를 함께 가진다. gate가 통과되지 않으면 다음 unit으로 넘어가지 않는다.

이 구조의 목적은 문맥 판단을 끊지 않으면서도, DROID-SLAM과 SLIM-VDB에서 반복된 `토글`, `한/영 전환`, `이미지 크기`, `수식`, `typography`, `과도한 요약` 문제를 한 단계 안에 섞지 않는 것이다.

### Mandatory Reference Refinement Stop Rule

새 논문 페이지는 “일단 변환 후 나중에 다듬기” 방식으로 완료하지 않는다. DROID-W를 active reference로 고정하고, 각 unit마다 DROID-W보다 낮아 보이는 부분을 즉시 refinement한다.

DROID-W는 복붙 템플릿이 아니라 완성도 기준이다. representation/resource, dataset, theory paper처럼 논문 유형이 다르면 DROID-W와 다른 visual block을 써도 된다. 다만 gate마다 `논문 유형이 달라서 다른 것인지`, `완성도가 낮아서 다른 것인지`를 구분하고, UI/interaction/검증 품질은 DROID-W 기준으로 맞춘다.

다음 중 하나라도 해당하면 현재 unit은 통과가 아니다.

- 원 논문 PDF와 충돌하는 contribution, method, evaluation, limitation 해석이 남아 있다.
- 기존 그림, 수식, embed, comments, 개인 메모가 의도치 않게 사라졌다.
- 긴 문단이 raw하게 방치되었거나, 반대로 요약이 과해져 논문의 흐름이 끊겼다.
- 내부 작업용 제목, 구어체 메모, artificial `~ Map` label이 화면에 남아 있다.
- 토글, 수식, 이미지, 더보기 blur, 책갈피, KO/EN 전환 중 하나라도 DROID-W보다 낮은 품질로 동작한다.
- 사용자가 DROID-W 페이지와 비교했을 때 “아직 덜 다듬어졌다”고 느낄 만한 구간이 남아 있다.

각 unit gate 기록에는 최소한 다음 다섯 줄을 남긴다.

- `PDF 기준 확인`
- `보존된 기존 자산`
- `DROID-W와 비교한 결과`
- `발견한 문제`
- `바로 수정한 refinement`

### Overview

| Unit | 구성 요소 | 주요 작업 | Gate 통과 조건 |
| --- | --- | --- | --- |
| 1 | PDF / Existing Inventory | 원 논문과 기존 HTML의 주장, 자산, 강조, 번역 단위 목록화 | source map과 preservation inventory가 완성됨 |
| 2 | Reader-Question Architecture | 논문 유형, DROID-W active reference, `Problem -> Mechanism -> Evidence -> Usage` 흐름 설계 | 독자 질문 순서가 PDF claim과 맞음 |
| 3 | Top TL;DR | compact title, 핵심 요약, contribution, insight, visual summary, minimal description | 첫 화면에서 3분 안에 논문 지형이 잡힘 |
| 4 | Detailed Reading Skeleton | 기존 본문을 `논문 상세 정리` 아래 질문 중심 위계로 재배치 | 원문 자산은 보존되고 화면 흐름은 question-centered |
| 5 | Problem / Mechanism Conversion | 문제 설정과 방법론을 장문 나열이 아니라 설계 선택 중심으로 변환 | method가 가장 자세하고 문제 해결 논리가 선명함 |
| 6 | Toggle Internal Structuring | Related Work, notation, appendix 토글 내부를 요약표/card/stepper로 정리 | 토글 내부도 독립적으로 읽히는 structured supplement가 됨 |
| 7 | Equation / Image / Asset Preservation | 원본 KaTeX, inline math, equation caption, paired figure, caption, image width, lightbox, embed, comments 보존 | 수식/이미지/자산이 KO/EN과 desktop/mobile에서 안정적 |
| 8 | Task-Based Evidence / Usage | task 중심 평가, result/claim brief, usage/limits, 느낀점/향후 계획 정리 | 결과 해석, 적용 조건, 개인 메모의 역할이 구분됨 |
| 9 | UI / Interaction / KO-EN | heading, bookmark, 더보기 blur, contained toggle, theme, typography, 언어 전환 | 실제 브라우저 상호작용과 KO/EN parity 통과 |
| 10 | Final DROID-W Regression | DROID-W active reference와 최종 비교, static/code/browser QA | 모든 level을 통과하고 산출물 완료 가능 |

### Unit 1. PDF / Existing Inventory

작업:

- 사용자에게 원 논문 PDF를 요청하고 받은 뒤 시작한다.
- PDF에서 `Abstract`, `Introduction`, `Method/System`, `Experiments`, `Conclusion`, `Appendix`의 핵심 주장과 근거를 뽑되, 최종 화면에서 `Problem`, `Mechanism`, `Evidence`, `Usage / Limits` 중 어디로 이동할지 함께 기록한다.
- 공식 제목, venue/year, project/GitHub/PDF 링크를 확인한다.
- 기존 HTML에서 이미지, 수식, YouTube/embed, link preview, comments, 개인 메모를 inventory로 만든다.
- 수식이 많은 논문은 PDF의 numbered equation을 전부 세어 `수식 처리표`를 만든다.
- 기존 정리의 bold, 형광펜, 밑줄, 색상 강조는 모두 임시 흔적으로 보고 PDF 기반 강조 후보를 새로 만든다.
- 기존 해석이 원 논문 의도와 다르거나 문맥상 부자연스러우면 수정 후보로 표시한다.
- KO/EN translation unit 후보를 미리 기록한다. heading, table, details, note/brief, bookmark는 누락되기 쉬운 단위다.

Gate:

- [ ] PDF 없이 contribution, evaluation, limitation을 확정하지 않았는가?
- [ ] thesis, contribution, method, evaluation, limitation 요약이 PDF와 충돌하지 않는가?
- [ ] 기존 주요 이미지, 수식, embed, comments, 개인 메모 위치를 파악했는가?
- [ ] numbered equation이 있는 논문이라면 각 수식의 최종 위치가 `본문`, `토글`, `의도적 제외`로 기록되었는가?
- [ ] PDF 기반 강조 후보와 기존 강조 제거 후보를 분리했는가?
- [ ] TL;DR로 올릴 정보, 질문 중심 상세 정리로 보낼 정보, 토글로 보존할 정보를 나눴는가?
- [ ] KO/EN translation unit 목록에 heading/table/details/note/bookmark가 포함되었는가?

실패 시:

- PDF를 다시 읽고 source map을 보강한다.
- 보존 대상이 불확실하면 HTML 구조를 크게 바꾸지 않는다.

### Unit 2. Reader-Question Architecture

작업:

- 논문 유형을 먼저 정한다. 예: system/pipeline, method/theory, representation, dataset/resource, benchmark, survey.
- DROID-W를 active reference로 고정한다.
- 전체 흐름을 `compact paper identity -> 핵심 요약 -> visual summary -> Problem -> Mechanism -> Evidence -> Usage / Limits -> 느낀점/향후 계획 -> comments`로 설계한다.
- 원문 섹션은 source map으로만 유지하고, 화면 section은 독자 질문에 답하는 단위로 만든다.
- 어떤 section을 표, card, checklist, ladder, toggle, 펼친 수식으로 처리할지 초안을 만든다.
- official repository나 project page가 논문 이해에 실제로 필요한지 판단한다.

Gate:

- [ ] 논문 유형과 visual summary 유형이 PDF의 Figure 1, contribution, method 흐름과 맞는가?
- [ ] DROID-W active reference를 기록했는가?
- [ ] DROID-W를 복붙하지 않고 논문 고유 구조를 살렸는가?
- [ ] `Problem -> Mechanism -> Evidence -> Usage / Limits` 흐름으로 독자 질문에 답하는가?
- [ ] 장문/나열/수식/평가/토글 후보가 질문 단위 section별로 표시되었는가?
- [ ] `Official Repository` 같은 link preview가 첫 화면 밀도를 흐릴 위험을 점검했는가?

실패 시:

- Paper Type Routing으로 돌아가 visual summary와 brief 유형을 다시 정한다.
- DROID-W와 다르게 보이는 이유가 논문 성격 때문인지 완성도 문제인지 기록한다.

### Unit 3. Top TL;DR

작업:

- 공식 논문 제목은 큰 H1이 아니라 작은 회색 `.paper-title-meta`로 둔다.
- 첫 section은 별도 `PAPER MAP` label 없이 바로 `핵심 요약`으로 시작한다.
- 한 문장 요약, contribution 3-5개, insight box를 만든다.
- 카드/표가 너무 건조하면 짧은 소제목과 한 줄 보조문만 추가한다. 장문 description은 아래 상세 정리로 보낸다.
- 논문 유형에 맞는 visual summary를 넣는다. 순차 처리 논문만 `.flow-diagram`을 사용한다.
- 필요하면 compare grid, relation diagram, hierarchy diagram, claim-evidence map을 넣는다.
- project/GitHub link preview는 핵심 흐름을 돕는 경우에만 배치한다.

Gate:

- [ ] 공식 논문 제목을 hero-scale H1로 쓰지 않았는가?
- [ ] contribution이 PDF 기준 3-5개로 압축되었는가?
- [ ] TL;DR 보조 설명이 한 줄 단위이고 장문 paragraph로 늘어나지 않았는가?
- [ ] insight가 논문 내용을 단순 반복하지 않고 읽는 관점을 제시하는가?
- [ ] sequential paper라면 arrow가 이어져 보이고, non-sequential paper라면 적절한 대체 도식을 썼는가?
- [ ] artificial `~ Map` 제목이나 내부 작업용 label이 남아 있지 않은가?
- [ ] DROID-W와 비교해 top area의 밀도, 여백, visual summary 완성도가 같은 수준인가?

실패 시:

- contribution 수, insight 길이, visual summary 유형을 다시 조정한다.
- 상단이 너무 무겁거나 반대로 논문 흐름을 못 잡으면 Unit 2로 돌아간다.

### Unit 4. Detailed Reading Skeleton

작업:

- 기존 상세 해석을 삭제하지 않고 `논문 상세 정리` 아래로 재배치한다.
- `Abstract`, `Introduction`, `Related Work`, `Method/System`, `Evaluation`, `Conclusion`, `느낀점`, `향후 계획` 같은 원문 흐름은 source map으로 유지하되, 화면은 `Problem`, `Mechanism`, `Evidence`, `Usage / Limits` 흐름으로 재배치한다.
- 화면에 노출되는 `.deep-dive h3[id]`는 원문 목차명 그대로 두지 않는다. `Abstract`, `Introduction`, `Related Work`, `Method`, `Experiments`, `Conclusion`은 source map 이름이고, 실제 h3는 `Problem Snapshot`, `Problem Context`, `Gap`, `Mechanism`, `Mechanism Detail`, `Evidence`, `Usage / Limits`, `Paper Conclusion`처럼 독자 질문에 답하는 제목으로 바꾼다.
- heading만 질문형으로 바꾸고 본문은 `초록은`, `Introduction은`, `Method는`, `Experiments는`처럼 원문 순서를 설명하는 상태로 두면 실패다. Abstract/Introduction/Related Work는 `Problem`으로 통합하고, Method/System/Map Update/수식은 `Mechanism`으로 묶으며, Experiments/Ablation/Runtime/Robustness는 `Evidence` 안에서 core/supporting evidence로 재배치한다.
- `논문 상세 정리` h2는 ORB-SLAM2/DROID-SLAM처럼 담백하게 두고, 상단 구분선으로만 분리한다.
- 논문 원문 section heading, 질문 중심 heading, 독자용 보조 라벨의 위계를 정한다.
- Notion 메모체/구어체 blockquote와 임시 제목을 PDF 기반 공식 라벨로 정규화한다.
- 더보기 blur와 collapsed 영역의 기준 위치를 잡는다.

Gate:

- [ ] 기존 본문이 `논문 상세 정리` 아래에 보존되었는가?
- [ ] `Problem`, `Mechanism`, `Evidence`, `Usage / Limits` heading 위계가 DROID-W와 같은 가족처럼 보이는가?
- [ ] 원문 섹션 순서로만 나열되어 독자 질문에 답하지 못하는 구조가 남아 있지 않은가?
- [ ] 오른쪽 책갈피에 `Abstract`, `Introduction`, `Related Work`, `Method`, `Experiments`, `Conclusion` 같은 원문 목차형 중제목이 그대로 노출되지 않는가?
- [ ] h3만 바뀌고 본문 첫 문장이 `초록은`, `Introduction은`, `Method는`, `실험은` 같은 source-section 해설체로 남아 있지 않은가?
- [ ] `논문 상세 정리` h2가 과한 회색 블록으로 튀지 않는가?
- [ ] deep dive 설명 문구가 “기존 논문 내용을 최대한 담은 상세 해석” 기준을 따르는가?
- [ ] 구어체/메모체 제목이 설명 영역에 남아 있지 않은가?
- [ ] 더보기 blur가 Abstract 근처에서 자연스럽게 시작되는가?

실패 시:

- 먼저 heading 위계와 deep dive skeleton을 바로잡은 뒤 내용 변환으로 넘어간다.

### Unit 5. Problem / Mechanism Conversion

작업:

- Introduction, Related Work, Conclusion의 문제 제기 문장을 `Problem`으로 통합한다.
- Method/System/Theory를 `Mechanism`으로 재구성하고, 가장 자세한 설명 밀도를 준다.
- 각 method block은 `어떤 문제 -> 어떤 설계 선택 -> 어떤 수식/모듈 -> 어떤 효과` 순서로 쓴다.
- 반복 문단, 깊은 indentation, `(1)(2)(3)`, `(a)(b)(c)`, 중첩 bullet을 찾는다.
- 비교 축이 분명하면 `summary-table`로, 순서가 중요하면 stepper/list-row로, 계층이 중요하면 ladder/relation diagram으로 바꾼다.
- 항목의 역할만 빠르게 보면 되는 구간은 visual card grid로 만든다.
- visual block 앞뒤에는 흐름을 잇는 1-2문장 prose를 남긴다.
- 표 내부는 요약체를 쓰되, 본문 문단은 자연스러운 완전한 문장으로 유지한다.
- 느낀점/향후 계획은 표/card로 바꾸지 않고 문단형을 기본으로 둔다.

Gate:

- [ ] Problem section이 기존 가정, 실패 상황, 기존 접근의 한계, 논문의 재정의를 보여주는가?
- [ ] Mechanism section이 페이지에서 가장 자세하고, 문제 해결 흐름과 직접 연결되는가?
- [ ] method 수식/모듈이 별도 장부처럼 분리되지 않고 해당 설명 흐름 안에 들어가 있는가?
- [ ] 3단 이상 nested bullet 앞에 table/card/checklist/ladder summary가 있는가?
- [ ] 표가 필요한 구간과 card/checklist/ladder가 더 자연스러운 구간을 구분했는가?
- [ ] visual summary 뒤에 같은 내용을 raw list로 반복하지 않았는가?
- [ ] 요약이 과해져 section 사이 흐름이 끊기지 않았는가?
- [ ] 표 내부는 요약체, 본문은 자연스러운 문장이라는 톤이 지켜졌는가?
- [ ] DROID-W와 비교해 읽기 밀도와 visual block 대비가 맞는가?

실패 시:

- 장문을 모두 표로 밀어 넣지 말고, prose와 visual block의 비율을 다시 맞춘다.
- 정보 손실이 걱정되면 상세 설명을 Unit 6의 toggle 내부로 보존한다.
- method가 얕게 보이면 evaluation이나 TL;DR보다 먼저 Mechanism을 보강한다.

### Unit 6. Toggle Internal Structuring

작업:

- Related Work, notation, projection/Jacobian, dataset 조건, appendix, 참고 이미지를 `supplement-toggle`로 접는다.
- 토글 summary는 작고 옅게 두되, 내부 본문은 정상 대비로 유지한다.
- 토글 내부 첫 화면에는 보충 구조 요약, taxonomy table, 수식 역할 요약, setup checklist 중 하나를 둔다.
- 긴 raw content는 `.appendix-details` 안에 보존하되, 내부에도 heading, table, card, stepper를 적용한다.
- 가장 아래쪽 우측에 `접기 / Close section` 버튼을 둔다.
- contained toggle focus 기준을 적용한다. topbar 바로 아래 일정한 panel, 내부 scroll 하나, close 후 summary 위치 정렬이 기본이다.
- 수식이 많은 토글은 마지막 설명이 close row에 가리지 않도록 충분한 bottom buffer를 둔다.

Gate:

- [ ] 토글 내부가 raw archive처럼 보이지 않고 구조화되어 있는가?
- [ ] 토글을 열면 topbar 바로 아래 일정한 크기의 panel로 뜨는가?
- [ ] 페이지 아래쪽 토글도 panel height가 달라지지 않는가?
- [ ] 내부 scroll은 하나만 보이는가?
- [ ] close bar와 토글 끝 사이로 뒤쪽 본문이 보이지 않는가?
- [ ] 마지막 문단/수식 설명이 close row와 하단 blur에 가리지 않는가?
- [ ] `접기 / Close section` 버튼이 오른쪽에 있고 scrollbar와 겹치지 않는가?
- [ ] 접은 뒤 현재 위치가 토글 시작점으로 정렬되는가?
- [ ] 토글 내부의 heading/table/card 글자 크기가 DROID-W와 같은 수준인가?

실패 시:

- 토글 내용보다 먼저 CSS/JS panel behavior를 고친다.
- 내부 content가 너무 raw하면 Unit 5로 돌아가 summary block을 만든다.

### Unit 7. Equation / Image / Asset Preservation

작업:

- 핵심 objective/loss/error 수식은 펼쳐 두고, notation/세부식/Jacobian은 toggle로 접는다.
- numbered equation이 많은 논문은 수식 처리표를 기준으로 누락 여부를 확인한다.
- KaTeX block뿐 아니라 table cell, brief, card, model variant 안의 수식도 확인한다.
- 개편 전 페이지에 존재하던 Notion/KaTeX 수식 블록은 PDF 대조 후 원본 형태 그대로 재사용한다. 기존 블록을 찾을 수 없을 때만 새 KaTeX/HTML 수식을 만든다.
- 원본 수식 블록을 가져온 경우에는 wrapper CSS로 현재 카드 폭에 맞추고, 원본 번호와 바깥 equation tag가 중복되지 않게 처리한다.
- inline 수식은 chip/token으로 구분하고, comma-separated notation은 쉼표를 보존한다.
- 행렬, cases, aligned equation, multi-line derivation은 원문 형태를 우선한다. “요약식 구성” 때문에 수식을 한 줄로 압축해 구조를 잃으면 실패로 본다.
- subscript, superscript, overbar, dot notation은 PDF 표기와 대조한다.
- `||x||`, `\sum`, `\int`, 큰 괄호, norm subscript처럼 크기와 위치가 의미를 주는 기호는 DROID-W 페이지와 같은 크기/간격을 쓰도록 보정한다. sigma의 위/아래 limit이 본문 글자처럼 옆으로 붙거나 norm bar가 너무 작게 보이면 실패로 본다.
- numbered block equation은 화면에 equation tag가 보이게 한다.
- single-number equation도 바깥 tag가 흐트러지거나 수식 body 폭에 밀리면 `.equation-tag-gutter-stack`으로 오른쪽 끝 tag를 만든다. 단, 정상 KaTeX 내부 tag가 이미 오른쪽에 안정적으로 보이면 그대로 둔다.
- multi-number equation에서 KaTeX 내부 tag가 중앙으로 쏠리면 원본 수식 body는 보존하고 right gutter stack으로 번호만 보정한다.
- row별 번호가 필요한 multi-line equation은 `.katex-row-tag`를 줄별로 붙이되, 수식 바로 옆이 아니라 render 오른쪽 끝에 정렬한다.
- image/table caption은 제목 줄을 `caption-main`으로 굵게 통일하고, 설명 줄이 있으면 `caption-note`로 분리한다. equation figure caption은 별도 수식 설명 스타일을 허용한다.
- paired figure/table은 의도적으로 붙여 둔 관계를 보존한다. 같은 묶음 안의 이미지 높이와 caption 폭이 크게 어긋나면 실패로 본다.
- 한글 panel의 image/table/equation caption이 완전한 영어 설명문으로 남지 않았는지 확인한다. 기술 용어를 남기는 것과 영어 문장을 방치하는 것은 구분한다.
- 기존 사용자가 넣은 이미지 width를 보존한다. KO/EN panel에 같은 이미지가 중복되면 rendered width가 같아야 한다.
- 새 figure/table 이미지는 `기존 asset의 caption-source mismatch 수정`, `main paper의 핵심 도식/표가 없으면 설명이 크게 왜곡되는 경우`, `사용자가 명시적으로 원한 경우`에만 추가한다.
- supplementary material의 figure/table 이미지는 기본적으로 추가하지 않는다. 별도 supplementary material이 공식으로 있으면 appendix-only 결과 토글도 만들지 않는 것을 기본으로 하고, 필요한 내용은 `Supplementary note`, `Ablation note`, `Residual evidence` 또는 verification report로만 정리한다. 단, supplementary 수식/Jacobian/notation이 main method 이해에 직접 필요하면 수식 토글로 보존한다.
- appendix-only 수식은 numbered equation이라고 해도 자동 보존 대상이 아니다. 본문 method/evaluation을 따라가는 데 필요하지 않으면 `omitted intentionally`로 처리하고, 본문에는 끌어오지 않는다.
- 영어 panel에 inline width가 빠져 이미지가 커지는 경우 CSS max-width와 `src -> width` sync를 적용한다.
- 페이지별 CSS를 수정했으면 `styles.css?v=...` query를 갱신해 브라우저 캐시가 이전 수식/이미지 스타일을 계속 쓰지 않게 한다.
- image lightbox, YouTube/embed, comments가 유지되는지 확인한다.

Gate:

- [ ] `.katex-error`가 없는가?
- [ ] 수식 처리표의 모든 수식이 본문/토글/의도적 제외 중 하나로 처리되었는가?
- [ ] 기존 Notion/KaTeX 수식 블록이 있는 수식은 새로 재작성하지 않고 원본 형태를 재사용했는가?
- [ ] 원본 수식 내부 번호와 바깥 equation tag가 중복 표시되지 않는가?
- [ ] single-number equation의 tag도 오른쪽 끝에 안정적으로 보이는가?
- [ ] multi-number equation의 번호가 중앙으로 쏠리지 않고 오른쪽 gutter나 원본 tag 위치에 안정적으로 보이는가?
- [ ] equation figure 뒤에 stray text node, 예를 들어 `</figure>>`에서 생긴 `>` 같은 오타가 남아 있지 않은가?
- [ ] table/brief/card 안의 notation이 plain text로 깨져 보이지 않는가?
- [ ] subscript/superscript/overbar/dot notation이 PDF와 다르게 flatten되지 않았는가?
- [ ] numbered block equation의 tag가 화면에 보이는가?
- [ ] inline 수식 baseline이 본문과 맞고 쉼표가 보존되는가?
- [ ] 기존 주요 이미지가 모두 남아 있고 과하게 커지지 않았는가?
- [ ] 모든 image/table caption의 제목 줄이 `caption-main` 등으로 일관되게 굵게 표시되는가?
- [ ] caption note가 PDF 근거 없이 임의 해석이나 작업 조언을 담고 있지 않은가?
- [ ] paired figure/table이 의도된 row 구성과 같은 높이감으로 유지되는가?
- [ ] 한글 panel caption에 완전한 영어 설명문이 남아 있지 않은가?
- [ ] 사용자가 넣지 않은 supplementary figure/table 이미지가 불필요하게 추가되지 않았는가?
- [ ] 새로 추가한 figure/table 이미지가 있다면 `왜 이미지로 필요한지`가 명확한가?
- [ ] KO/EN 전환 후 같은 이미지의 렌더링 폭이 달라지지 않는가?
- [ ] 긴 block equation과 큰 이미지가 desktop/mobile에서 overflow를 만들지 않는가?
- [ ] lightbox, embed, comments가 정상 동작하는가?

실패 시:

- block 수식은 먼저 개편 전 원본 KaTeX 블록을 복원한다. 원본 블록이 없거나 실제로 깨진 경우에만 KaTeX, math-token, model-token 중 가장 안정적인 표현을 다시 선택한다.
- 이미지 문제는 inline width, image-specific max-width, width sync 순서로 고친다.

### Unit 8. Task-Based Evidence / Usage

작업:

- evaluation은 `task/evidence setup -> metric/baseline table -> task별 result/claim brief -> 대표 정량/정성 그림/표 -> 상세 해석` 순서로 정리한다.
- dataset별로 먼저 나열하지 않는다. dataset은 task를 검증하는 수단으로 배치한다.
- 하나의 task에 정량/정성 결과가 모두 있으면 기본적으로 대표 정량 1개와 대표 정성 1개를 먼저 보여준다.
- dataset별 brief 또는 claim-evidence brief를 써야 한다면 해당 그림/표/해석과 같은 구역 안에 둔다.
- `Core evaluation`과 `Supporting evidence`가 섞이면 DROID-W처럼 table block을 분리한다. runtime, ablation, custom dataset contribution은 핵심 task와 같은 표에 억지로 넣지 않는다.
- PDF의 표/그림이 중요한 claim evidence라면 `Result Detail` 또는 `Evidence Detail` compact table을 추가한다.
- supplementary table/figure은 기존 페이지에 사용자가 넣어 둔 자료가 아니라면 이미지로 추가하지 않는다. main result를 보완하는 의미만 짧게 적고, 자세한 이미지는 원 논문/supplementary에서 확인 가능한 것으로 둔다.
- evaluation 뒤에는 `Usage / Limits`를 짧게 추가해 이상적인 적용 상황, 약한 조건, 필요한 입력/가정, 후속 질문을 정리한다.
- 노란 theme은 section note, result/claim/structure/use-case brief에만 사용한다.
- brief chip과 note label은 warm yellow 계열로 통일하고, 본문 p/li는 제목보다 작게 둔다.
- 느낀점과 향후 계획은 시각 카드/표가 아니라 문단형 글로 유지한다.
- 원본에 느낀점/향후 계획 내용이 없으면 새 개인 감상을 만들지 말고 `(진행중...)` / `(In progress...)`으로 둔다.
- 평가 수치, dataset split, resolution, baseline, metric은 PDF와 다시 대조한다.
- Conclusion section이 있는 논문은 평가 뒤에 간결하게 보존한 뒤 개인 느낀점으로 넘어간다.

Gate:

- [ ] 평가 요약이 PDF의 claim/evidence와 충돌하지 않는가?
- [ ] 평가 구성이 dataset 나열이 아니라 task/claim 중심으로 정리되었는가?
- [ ] 각 task에 dataset, metric, baseline, 대표 결과가 연결되어 있는가?
- [ ] core evaluation과 supporting evidence가 필요한 경우 같은 표 안에 구겨 넣지 않고 별도 block으로 분리되었는가?
- [ ] dataset group, sensor/GT 구성, 평가 역할이 서로 다른 열 또는 서로 다른 table/toggle로 분리되었는가?
- [ ] 정량/정성 결과가 과하게 많이 붙지 않고 대표 근거 위주로 제시되는가?
- [ ] brief와 관련 그림/표/해석이 같은 구분선 안에서 이어지는가?
- [ ] 노란 theme이 단순 subsection 제목이나 일반 강조에 쓰이지 않았는가?
- [ ] brief/note의 p와 li 글자 크기가 언어별로 달라지지 않는가?
- [ ] 느낀점/향후 계획이 논문 설명과 섞이지 않고 문단형으로 남아 있는가?
- [ ] 기존 원본에 개인 메모가 없던 느낀점/향후 계획을 새로 지어내지 않았는가?
- [ ] 표나 brief가 수치보다 “이 결과가 어떤 주장을 지지하는가”를 먼저 보여주는가?
- [ ] 중요한 표/그림이 단순 언급으로 끝나지 않고 claim-evidence 연결로 정리되었는가?
- [ ] `Usage / Limits`가 잘 맞는 상황, 약한 조건, 필요한 가정을 최소한으로 정리하는가?
- [ ] Conclusion이 누락되지 않고 개인 느낀점과 분리되었는가?

실패 시:

- 수치 나열이 길면 claim/evidence 관계를 먼저 재정리한다.
- 노란 theme이 과하면 note/brief의 범위를 줄인다.

### Unit 9. UI / Interaction / KO-EN

작업:

- heading, subsection label, section chip, summary panel, note/brief, toggle, bookmark의 typography를 맞춘다.
- 오른쪽 책갈피를 section heading에 정확히 연결하고, active 상태가 흔들리지 않게 한다.
- active bookmark가 sidebar 내부에서 보이도록 `scrollIntoView({ block: "nearest" })`를 적용한다.
- 더보기 blur는 새로고침/언어 전환/bookmark 이동에서 button과 mask 상태가 함께 동기화되어야 한다.
- KO/EN 전환은 같은 페이지 안에서 처리한다. heading, table, details, note/brief, bookmark까지 모두 바뀌어야 한다.
- 숫자로 시작하는 Notion id는 `#id` selector가 아니라 `[id="..."]` selector를 사용한다.
- JS 변경 시 `script.js?v=...` cache key를 갱신한다.

Gate:

- [ ] desktop/mobile에서 text overlap, horizontal overflow, card/table 깨짐이 없는가?
- [ ] 오른쪽 책갈피 클릭 위치가 정확하고 active item이 흔들리지 않는가?
- [ ] 더보기 blur와 버튼이 새로고침, 언어 전환, bookmark 이동 뒤에도 함께 사라지거나 유지되는가?
- [ ] contained toggle, close alignment, internal scroll indicator가 정상 동작하는가?
- [ ] KO/EN 전환 후 `.post-body`, `.paper-map`, `.section-bookmark` scope에 한글 잔여가 없는가?
- [ ] KO/EN의 이미지 크기, font-size, line-height, theme이 computed style 기준으로 일관적인가?
- [ ] `node --check pages/paper_reviews/<PAGE>/script.js`와 `git diff --check`가 통과하는가?

실패 시:

- language selector 오류와 browser cache 문제를 먼저 확인한다.
- UI 문제가 특정 언어에서만 발생하면 KO/EN panel 구조와 duplicated asset width를 비교한다.

### Unit 10. Final DROID-W Reference Regression

최종 검증은 가장 엄격하게 진행한다. 현재 workflow의 active reference는 DROID-W 페이지 하나로 둔다. ORB-SLAM2, DROID-SLAM, 3D_SG, 3D_DSG, SLIM-VDB, Khronos는 historical reference로만 남기고, gate 통과 여부는 DROID-W 페이지와 비교해 결정한다. 단, ORB-SLAM2에서 문서화된 paired figure, 원본 KaTeX 복원, equation caption baseline, 한글 caption 정리 규칙은 이미 이 playbook의 세부 QA 기준으로 흡수되었으므로 별도 페이지를 열지 않아도 적용한다.

DROID-W active reference:

- 페이지: `pages/paper_reviews/DROID-W/index.html`
- CSS: `pages/paper_reviews/DROID-W/styles.css`
- 기준 URL: `http://127.0.0.1:<PORT>/pages/paper_reviews/DROID-W/index.html`
- 비교 대상: TL;DR cue, map subsection title, flow/compare grid, Problem Ladder, Design Choice, Method Step Block, Evaluation Evidence Panel, Usage Fit Box, contained toggle, right bookmark, KO/EN toggle, equation tag gutter, image/table caption.

Final gate:

- [ ] PDF 기준 thesis, contribution, method, evaluation, limitation 해석이 정확한가?
- [ ] 기존 상세 해석, 이미지, 수식, embed, comments, 개인 메모가 필요한 위치에 보존되었는가?
- [ ] DROID-W처럼 `핵심 요약 -> visual summary -> 논문 상세 정리 -> Problem -> Mechanism -> Evidence -> Usage / Limits -> 개인 메모 -> comments` 흐름이 자연스러운가?
- [ ] 장문과 중첩 bullet이 table/card/checklist/ladder/toggle로 충분히 정리되었는가?
- [ ] 반대로 표와 요약이 너무 많아 글의 호흡이 사라지지 않았는가?
- [ ] heading, rectangular label, section chip, note/brief, summary panel, toggle의 시각 언어가 DROID-W와 같은 가족처럼 보이는가?
- [ ] 노란 theme은 note/brief에만 쓰이고, 느낀점/향후 계획은 문단형으로 유지되는가?
- [ ] 기존 개인 메모가 없던 section은 임의의 감상/계획으로 채우지 않고 `(진행중...)` / `(In progress...)` placeholder로 처리했는가?
- [ ] 수식, 이미지, lightbox, comments, external link preview가 정상 동작하는가?
- [ ] 원본 KaTeX block, equation caption token, paired figure, 한글 caption 규칙이 Unit 7 기준대로 적용되었는가?
- [ ] 번호 있는 수식 처리표, notation toggle, conclusion, result detail이 필요한 논문에서 빠지지 않았는가?
- [ ] KO/EN 전환 후 text, bookmark, image width, typography가 일관적인가?
- [ ] 토글 panel, 더보기 blur, 오른쪽 책갈피가 desktop/mobile에서 안정적인가?
- [ ] `node --check`, `git diff --check`, browser desktop/mobile spot check를 통과했는가?

실패 시:

- 문제가 생긴 unit으로 되돌아간다. 예: 장문 변환 문제는 Unit 5, 토글 문제는 Unit 6, 수식/이미지는 Unit 7, 언어/UI 문제는 Unit 9.
- DROID-W와 맞추려다 논문 흐름이 망가졌다면 DROID-W의 “구조 원칙”만 남기고 PDF 흐름을 우선한다. 다만 UI/검증 기준은 계속 DROID-W와 대조한다.
- 모든 gate가 통과되기 전에는 다음 논문 페이지로 넘어가지 않는다.

최종 보고에는 수정 요약, 통과한 gate, 남은 리스크를 짧게 남긴다.

## 16. DROID-SLAM Lessons Learned

DROID-SLAM은 ORB-SLAM2 reference를 다른 논문에 확장하면서 생긴 첫 번째 실제 stress test였다. 다음 페이지부터는 아래 문제를 재발 방지 체크리스트로 사용한다.

| 겪은 문제 | 원인 | 다음 적용 기준 |
| --- | --- |
| 최상단 제목이 과하게 큼 | 긴 paper title을 hero처럼 사용 | 공식 paper title은 항상 작은 회색 meta text. 별도 읽기 제목은 선택 사항 |
| sequential flow diagram이 카드 나열처럼 보임 | ORB의 arrow pseudo-element를 재사용하지 않음 | 순차 구조일 때만 `.flow-step:not(:last-child)::after`를 기본 패턴으로 사용 |
| toggle open 내용이 왼쪽에 붙어 보임 | summary와 내부 content margin이 같은 선에 붙음 | open content에는 `appendix-details` 또는 details open margin rule 적용 |
| contribution/detail toggle만 유독 어색함 | 특정 toggle 내부 wrapper가 다른 appendix toggle과 달랐음 | 같은 역할의 toggle은 같은 wrapper 구조와 padding을 쓴다 |
| 소제목보다 내용이 먼저 보이는 느낌 | 보조 라벨과 문단 간 구분선/간격이 부족 | 세부 subsection은 위쪽 separator와 둥근 직사각형 보조 라벨을 먼저 두고 본문을 배치 |
| 단독 보조 라벨과 박스 내부 chip이 같은 UI로 보임 | `section-chip`을 모든 곳에 pill로 사용 | 본문 흐름의 단독 보조 라벨은 둥근 직사각형, summary/brief 내부 chip은 pill로 구분 |
| `논문 상세 정리` 제목이 과하게 무거움 | h2에도 block형 회색 배경과 상하 라인을 추가 | Deep Dive h2는 ORB/DROID처럼 담백하게 두고, 실제 section h3만 block형 회색 테마 적용 |
| 평가 Brief와 내용이 따로 노는 느낌 | brief와 dataset/evidence 본문을 다른 시각 구역처럼 배치 | brief, 그림/표, 해석 문단은 같은 구분선 안에서 이어지게 구성 |
| 표 내부 bullet 크기가 언어별로 달라짐 | note/brief의 p와 li에 다른 font-size 적용 | 노란 theme의 `p`, `li`, table body text는 같은 작은 크기 규칙 사용 |
| inline 수식이 아래로 처짐 | KaTeX inline token baseline이 본문과 맞지 않음 | chip 스타일 조정 후 실제 브라우저에서 baseline 확인 |
| 쉼표가 포함된 inline 수식이 부자연스러움 | comma-separated equation을 통째 chip으로 처리하거나 쉼표 누락 | 쉼표는 `.equation-chip-comma`로 보존하고 수식 토큰만 분리 |
| 영어 모드에서 한글이 남음 | 숫자로 시작하는 Notion id를 `#id` selector로 사용 | 모든 id 기반 rich translation은 `[id="..."]` selector 사용 |
| 영어 버튼은 EN인데 본문은 한글 | selector 오류를 `try/catch`가 삼켜서 실패가 보이지 않음 | 버튼 상태, Abstract/Introduction 본문, visible Korean scan을 함께 검증 |
| 수정했는데 브라우저가 예전 동작 유지 | 캐시된 `script.js` 로드 | JS 수정 후 `script.js?v=...` query 갱신 |

DROID-SLAM에서 확인한 확장 원칙:

1. ORB-SLAM2를 그대로 복사하지 말고, 논문 구조에 맞게 `핵심 요약 -> visual summary -> evidence/evaluation brief -> 논문 상세 정리`의 역할만 재사용한다.
2. Visual SLAM 계열이라도 ORB-SLAM2는 graph/keyframe/local BA 중심, DROID-SLAM은 recurrent update/DBA/generalization 중심으로 강조축이 달라져야 한다.
3. 원문 수치가 많을수록 문단을 줄이는 것이 아니라, `주장 -> 근거 수치 -> 읽는 포인트` 표로 바꾼다.
4. appendix와 ablation은 정보 손실 없이 접되, 핵심 설계 선택을 이해하는 데 필요한 ablation은 brief나 summary panel로 먼저 끌어올린다.
5. 언어 전환은 마지막에 붙이는 기능이 아니라, 구조 개편 뒤 visible text와 selector 안정성까지 검증해야 하는 별도 QA 단계다.

## 17. Reference Refinement Checklist

다음 논문 페이지를 개편할 때는 Unit 10 이전에도 수시로 아래 checklist를 사용한다. 이 checklist는 “사용자가 보기 좋은가”보다 더 엄격한 기준으로, DROID-W 페이지와 같은 완성도에 도달했는지 확인하기 위한 것이다.

### A. Active Reference 고정

- active reference는 항상 DROID-W다.
- 다른 개편 페이지는 gate 통과 기준으로 쓰지 않는다.
- 단, ORB-SLAM2에서 최종 안정화한 paired figure, 원본 KaTeX 복원, equation caption baseline, 한글 caption 정리 규칙은 이 문서의 Unit 7 QA 항목으로 흡수했으므로 모든 새 페이지에 적용한다.
- scene graph, dataset, survey, task paper처럼 DROID-W와 논문 유형이 달라도 UI/interaction/검증 기준은 DROID-W와 맞춘다. 단, 내용 흐름은 원 논문 PDF를 우선한다.
- reference 기록은 한 줄이면 충분하다. 예: `Active reference: DROID-W(question-centered structure, equation gutter, evidence split 기준)`.

### B. DROID-W 대조 방식

개편 중 10개 unit gate마다 DROID-W 페이지를 대조한다. 각 대조는 “확인만 하고 넘어가기”가 아니라, 부족한 부분을 바로 고치는 refinement pass다.

| 시점 | 비교 대상 | 반드시 확인할 것 |
| --- | --- | --- |
| Unit 1 | source inventory | PDF 기반 주장 지도, 보존 inventory, translation unit 목록 |
| Unit 2 | DROID-W / IA | paper type, DROID-W active reference 기록, section 흐름, compact title 정책 |
| Unit 3 | top summary | TL;DR cue, 공식 제목 크기, contribution 카드 수, visual summary 유형/밀도, insight box 밀도 |
| Unit 4 | deep dive skeleton | `논문 상세 정리`, heading 위계, collapsed blur, 메모체 제목 정규화 |
| Unit 5 | content conversion | 장문, 중첩 bullet, 표/card/checklist/ladder 비율, prose 연결감 |
| Unit 6 | toggle structure | 보충 구조 요약, taxonomy/수식 역할/실험 설정 요약, contained panel, close alignment |
| Unit 7 | equation / asset | 원본 KaTeX body 보존, equation tag gutter, equation caption baseline, inline chip, paired figure, image/table caption, KO caption, image width, lightbox, embed/comments |
| Unit 8 | evaluation / notes | core/supporting evidence split, result/claim brief, 평가 그림/표 연결, 느낀점/향후 계획 문단 유지 |
| Unit 9 | UI / language | 오른쪽 책갈피, 더보기 blur, contained toggle, KO/EN text/image/typography parity |
| Unit 10 | final regression | DROID-W와 전체 완성도, 정보 보존, 문장 흐름, static/browser QA |

각 대조 후 기록:

- `DROID-W와 맞는 부분`
- `DROID-W보다 부족한 부분`
- `수정한 refinement`
- `다음 unit으로 넘어가도 되는 이유`

### C. DROID-W보다 낮아 보이면 바로 멈추는 항목

- 상단 요약이 DROID-W보다 훨씬 길거나, 반대로 논문 흐름을 설명하지 못할 만큼 짧다.
- section별 summary panel이 논문 이해를 돕지 않고 단순 표 나열처럼 보인다.
- result/claim/structure/use-case brief가 관련 그림/표와 다른 구역처럼 떨어져 있다.
- toggle을 펼쳤을 때 내부 margin, 글자 크기, 색상 톤이 DROID-W보다 어색하다.
- section chip이나 heading이 논문 소제목보다 튀거나, 소제목의 위계가 흐려진다.
- 영어 전환 후 DROID-W에서는 바뀌는 수준의 본문이 현재 페이지에서는 한국어로 남는다.
- 수식/이미지/lightbox/comments처럼 기존 자산 보존이 DROID-W보다 불안하다.
- 10개 unit gate 중 하나라도 DROID-W 대조 기록 없이 넘어갔다.

### D. 3D Scene Graph Rollback Lesson

3D Scene Graph 페이지는 DROID-SLAM reference를 따라가려다가 원 논문 성격과 맞지 않는 수준까지 요약이 강해졌고, 결국 원본으로 되돌렸다. 이 사례에서 얻은 기준은 다음과 같다.

- DROID-W 구조를 적용하기 전에 해당 논문이 `system pipeline paper`, `dataset/resource paper`, `task/evaluation paper`, `theory/method paper` 중 어디에 가까운지 먼저 정한다.
- dataset/resource paper는 DROID-SLAM식 system flow를 강하게 밀어붙이면 정보가 납작해질 수 있다.
- 표형 요약은 모든 문단의 대체물이 아니다. 개념의 흐름을 설명하는 문단은 짧게라도 남겨야 한다.
- 초안용 제목 표현는 편하지만, 최종 화면에는 논문 문맥에 맞는 자연스러운 제목으로 바꾼다.
- 개편 결과가 DROID-W와 다르게 보인다면 “스타일이 부족한지”와 “논문 성격이 달라서 구조가 달라야 하는지”를 분리해서 판단한다.
- 원본 복구는 실패가 아니라 gate가 제대로 작동했다는 신호다. 복구 후 playbook을 보완하고 다음 적용 전에 reference refinement checklist를 더 엄격히 사용한다.

### E. 3D Scene Graph Visual Summary Lesson

3D Scene Graph를 다시 개편하면서 확인한 점은, 긴 문단을 줄인다고 해서 모든 나열을 표로 밀어 넣으면 안 된다는 것이다. 이 논문은 scene graph의 계층, relation, task, verification처럼 “종류와 단계”가 많은 글이라서 표보다 card/checklist/ladder가 더 자연스러운 구간이 많았다.

다음 페이지부터는 아래 기준을 적용한다.

- `(1)(2)(3)`, `(a)(b)(c)`, 글머리 기호처럼 원문이 항목을 나누는 부분은 먼저 visual summary 후보로 표시한다.
- 항목 간 비교 축이 명확하면 table, 항목의 역할이나 순서가 중요하면 card/checklist/ladder를 사용한다.
- visual summary를 넣은 뒤에도 흐름 설명 문장을 1-2문장 남긴다. 3D_SG에서 과도하게 요약했을 때 글의 연결감이 약해졌기 때문이다.
- visual summary로 대체한 raw list는 반복해서 남기지 않는다. 단, 상세 조건이 필요하면 supplement toggle로 보존한다.
- dataset/resource/scene graph 계열 논문에서는 `layer`, `relationship`, `criteria`, `task`, `evaluation lane`을 우선 시각화 후보로 본다.
- KO/EN 전환 QA는 visual summary 내부까지 포함한다. 카드/체크리스트는 table보다 번역 누락이 생기기 쉬우므로 visible Korean scan으로 확인한다.
- `Official Repository` 같은 link preview는 상단에서 논문 identity를 방해하면 제거한다. 핵심 흐름에 직접 기여하지 않는 링크 카드는 method/appendix 구간으로 내린다.

## 18. SLIM-VDB Lessons Learned

SLIM-VDB 개편에서는 Notion식 메모 표현, 남아 있는 형광펜, 깊은 글머리 목록, 그리고 원문 수치 검증이 함께 문제로 드러났다. 다음 논문부터는 아래 항목을 별도 refinement pass로 둔다.

| 겪은 문제 | 원인 | 다음 적용 기준 |
| --- | --- | --- |
| `우리는 이런걸 만들었어요`, `찾아보니 이런게 있더라구요` 같은 제목이 화면에 남음 | Notion 정리 당시의 친근한 메모 제목을 그대로 보존 | deep dive의 blockquote/보조 제목은 PDF section 의도에 맞춰 `제안하는 시스템`, `기반 데이터 구조`, `실험 환경`처럼 공식 라벨로 정규화 |
| 정확한 구어체만 제거하고 비슷한 메모체가 남음 | exact phrase scan만 수행 | exact scan 뒤에 semantic scan을 추가한다. `요?`, `!`, `..`, `대단`, `찾아보니`, `돌리기`, `비등비등`, `확인할 수 있다`처럼 화면 톤을 흐리는 표현을 한 번 더 검토 |
| 원본 Notion 내용에 실험 조건 오류가 남음 | 정보 보존을 우선하면서 PDF 수치 재검증이 약함 | 실험 조건, dataset split, resolution, baseline, metric은 반드시 PDF와 대조한다. 기존 정리가 틀리면 정보 보존보다 원문 정확성을 우선 |
| `SceneNet closed/open-set resolution`이 원문과 다르게 남음 | 상세 리스트를 원문 그대로 두고 요약만 수정 | summary panel을 고친 뒤에도 raw list를 다시 훑는다. 요약과 raw detail이 충돌하면 raw detail까지 수정 |
| 중첩 글머리 목록이 길게 이어짐 | raw list 보존만으로 정보 손실을 막으려 함 | 3단 이상 중첩 목록은 먼저 card/checklist/ladder/table 중 하나로 요약한다. raw list가 필요하면 보충 detail로 남기되, 독자가 summary만 읽어도 조건을 이해해야 함 |
| 실험 조건 글머리가 평가 흐름을 끊음 | hardware/dataset/baseline/metric이 같은 위계로 나열됨 | `Experiment Setup Checklist`, `Evaluation Data Checklist`처럼 재현성과 fairness를 확인하는 checklist 요약을 앞에 둔다 |
| Notion 형광펜이 소제목처럼 남음 | highlight background를 inline 강조로만 처리 | 본문 흐름의 standalone highlight는 pill이 아니라 모서리 둥근 직사각형 라벨로 통일한다. 박스 내부의 짧은 chip과 형태를 구분 |
| `World map의 역할`부터 `이전 연구들`처럼 서로 다른 개념이 한 흐름에 길게 붙음 | 원문 subsection이 아니라는 이유로 독자용 분해 라벨을 만들지 않음 | PDF 논리에 맞는 보조 라벨을 추가한다. 예: `World map의 역할`, `Semantic scope`, `Volumetric backend`, `이전 연구의 병목`. 원문 제목이 아니므로 회색 둥근 직사각형 라벨과 compact table로 처리 |
| PDF 추출 도구가 환경마다 다름 | `pdftotext`가 없을 수 있음 | `pdftotext`가 없으면 bundled Python의 `pypdf`로 원문을 추출해 claim/evaluation 수치를 확인한다 |

SLIM-VDB 이후 추가 QA:

- [ ] friendly exact phrase scan을 수행했는가?
- [ ] semantic tone scan으로 메모체/구어체/임시 제목을 다시 확인했는가?
- [ ] 실험 조건 표와 raw detail의 수치가 서로 충돌하지 않는가?
- [ ] PDF의 resolution, dataset split, baseline, metric을 최소 한 번 이상 직접 대조했는가?
- [ ] 3단 이상 중첩 list 앞에 visual summary가 있는가?
- [ ] 개념이 둘 이상으로 갈라지는 장문은 보조 라벨/table/card로 먼저 분리했는가?
- [ ] 원문에 없는 보조 라벨이 paper section heading처럼 과하게 보이지 않는가?
- [ ] raw list를 남긴 경우, 정보 보존 목적이 분명하고 summary와 중복/충돌하지 않는가?
- [ ] 남은 `mark.highlight_*_background`가 둥근 직사각형 라벨 또는 자연스러운 inline 강조로 보이는가?

## 18.1 3D Dynamic Scene Graph Lessons Learned

3D_DSG는 scene graph 계열이지만 3D_SG보다 robotics/actionability 성격이 강하다. 따라서 static representation 설명을 그대로 반복하기보다 layer, dynamic agent, SPIN engine, query/action use case를 분리해야 한다.

| 겪은 문제 | 원인 | 다음 적용 기준 |
| --- | --- | --- |
| 다이어그램 순서가 거꾸로 보임 | hierarchy layer를 논문 순서와 화면 독해 순서 중 어디에 맞출지 정하지 않음 | layer diagram은 독자가 위에서 아래로 읽는 순서와 논문 의미가 충돌하지 않게 번호/화살표/설명을 명확히 둔다 |
| `containment / abstraction` 같은 용어가 갑자기 튀어 보임 | relation label을 논문 맥락 없이 도식에 바로 넣음 | 도식 용어는 앞뒤 문장 또는 tooltip-like caption으로 먼저 설명한다 |
| 노란 brief 제목이 흰색에 가까워짐 | result brief chip과 section note label의 색상 체계가 분리됨 | `section-note-label`과 `result-brief .section-chip`은 같은 warm yellow chip 계열로 통일한다 |
| 첨부 그림이 과하게 커짐 | Notion export의 이미지 width를 무시하고 공통 max-width만 적용 | 기존 그림의 의도된 크기를 보존하고, 필요한 이미지만 논문별 CSS에서 max-width를 조정한다 |
| 느낀점/향후 계획이 표로 바뀌어 개인 메모 흐름이 약해짐 | 모든 구간을 시각화 대상으로 처리 | 느낀점/향후 계획은 문단형 글을 기본으로 유지하고, 표/card는 쓰지 않는다 |

3D_DSG 이후 추가 QA:

- [ ] hierarchy diagram의 번호와 시각적 읽기 방향이 일치하는가?
- [ ] layer/relation 용어가 도식만 보고도 이해되거나, 바로 앞뒤 문장에서 설명되는가?
- [ ] dynamic agent, place, object, room/building abstraction이 납작하게 합쳐지지 않았는가?
- [ ] result/claim brief chip이 DROID-W 기준의 warm chip 계열과 같은가?
- [ ] 기존 그림의 width/비율이 개편 전보다 과하게 커지지 않았는가?
- [ ] 느낀점/향후 계획이 문단형 개인 메모로 남아 있는가?

## 19. DROID-W-Primary Regression Update

ORB-SLAM2, DROID-SLAM, 3D Scene Graph, 3D Dynamic Scene Graph, SLIM-VDB, Khronos, DROID-W까지 개편한 뒤의 최신 기준은 DROID-W 페이지다. 앞으로의 검증은 여러 reference를 동시에 대조하지 않고, DROID-W를 active reference로만 사용한다. 다른 페이지들은 어떤 문제가 있었는지 알려주는 historical reference이며, gate 통과 여부를 결정하지 않는다.

### Historical Reference Library

| Reference | 주로 참고할 때 | 가져올 기준 |
| --- | --- | --- |
| ORB-SLAM2 | 기본 테마, heading, deep dive, 책갈피, 더보기 blur, inline 수식 chip, paired figure, equation caption baseline | 전체 시각 완성도와 읽기 밀도, 원본 KaTeX/caption refinement |
| DROID-SLAM | method/evaluation이 강한 system paper | method flow, result brief, resource trade-off 설명 |
| DROID-W | dynamic/in-the-wild SLAM처럼 문제 재정의와 평가 축 분리가 중요한 system paper | TL;DR cue, Problem Ladder, Design Choice, Method-first 수식 배치, Evaluation Evidence split, equation tag gutter, caption-main 규칙 |
| 3D_SG | representation/resource/relationship paper | 계층, 관계, task를 표/card/ladder로 나누는 방식 |
| 3D_DSG | dynamic scene / robotics abstraction paper | layer, agent, place, object, actionability를 구분하는 방식 |
| SLIM-VDB | probabilistic mapping, notation, toggle-heavy paper | 수식 역할 요약, notation 표, 토글 내부 구조, runtime/memory/evaluation 균형 |
| Khronos | formula-heavy method/theory paper | 번호 있는 수식 처리표, 수식 토글, result/evidence detail, Conclusion 분리 |

적용 규칙:

- active verification reference는 DROID-W 하나다.
- 다른 reference는 특정 오류의 배경을 이해할 때만 본다. 예: formula-heavy page에서 Khronos lessons를 읽을 수는 있지만, 최종 gate는 DROID-W checklist로 통과시킨다.
- ORB-SLAM2에서 안정화된 paired figure, 원본 KaTeX, equation caption, 한글 caption 규칙은 reference page를 다시 열어 비교하는 대상이 아니라 이 문서에 흡수된 QA 항목으로 적용한다.
- 새 페이지가 DROID-W와 다른 구조를 쓰는 것은 허용한다. 다만 “논문 유형이 달라서 다른 것인지”, “완성도가 낮아서 다른 것인지”를 gate마다 기록하고, UI/interaction/verification은 DROID-W 기준으로 맞춘다.

### Revised 10-Unit Gate

여러 reference 페이지 이후의 기준은 기존 `10-Step Gated Workflow`가 아니라 `10-Unit Component Workflow`다. 모든 unit은 작업과 gate를 함께 가지며, formula, prose, reference-set regression을 각 gate 안에서 확인한다.

| Unit | 이름 | 추가된 통과 기준 |
| --- | --- | --- |
| 1 | PDF / Existing Inventory | PDF claim/evaluation뿐 아니라 기존 표 안 수식, 번호 있는 수식 처리표, 모델명 위첨자, color-word, link preview, 토글 내부 자산까지 inventory |
| 2 | Reader-Question Architecture | DROID-W를 active reference로 고정하고, `Problem -> Mechanism -> Evidence -> Usage` 흐름 기록 |
| 3 | Top TL;DR | artificial `~ Map` 제목 금지, 공식 제목은 compact meta, minimal description은 짧은 소제목/한 줄 보조문으로 제한 |
| 4 | Detailed Reading Skeleton | 질문 중심 heading 위계, collapsed blur, 메모체 제목 정규화, 기존 본문 보존 뼈대 검증 |
| 5 | Problem / Mechanism Conversion | Problem은 통합하고 Method는 가장 자세히 다루며, 긴 문단은 table/card/checklist/ladder와 prose로 균형 조정 |
| 6 | Toggle Internal Structuring | raw detail을 그대로 두지 않고 보충 구조 요약/table/card/stepper를 먼저 배치 |
| 7 | Equation / Image / Asset Preservation | KaTeX block뿐 아니라 numbered equation tag, multi-equation gutter, equation caption baseline, paired figure, caption-main, table cell, card, result brief, sub/sup/overbar, model name superscript, KO/EN image width까지 확인 |
| 8 | Task-Based Evidence / Usage | dataset 나열 대신 task/claim 중심 평가, core/supporting evidence 분리, 대표 정량/정성 근거, Usage/Limits, Conclusion 보존, 느낀점/향후 계획 문단형 유지 |
| 9 | UI / Interaction / KO-EN | KO/EN 전환이 heading/table/details/bookmark/note/brief 내부까지 적용, typography와 contained toggle 검증 |
| 10 | Final DROID-W Regression | DROID-W와 비교해 theme, typography, toggle, formula, prose flow, information preservation을 최종 점검 |

### Formula QA

수식 검증은 KaTeX block만 확인하면 부족하다. SLIM-VDB에서 `D_t(x_*)`, `W_t(x_*)`, `alpha`, `m, lambda, nu, beta`, `SLIM-VDB^C`, `SLIM-VDB^O`, `SLIM-VDB*`처럼 표와 brief 안에 남은 plain text 수식이 화면에서 깨져 보이는 문제가 있었다.

Khronos처럼 numbered equation이 많은 논문에서는 더 엄격하게 확인한다. 핵심 수식이 아니더라도 notation, factorization, optimization, metric 수식은 삭제하지 않고 본문 또는 토글에 보존한다.

최근 7개 페이지 재검증에서 확인한 추가 원칙은 “새로 예쁘게 그린 수식”보다 “개편 전 원본 정리 페이지의 KaTeX 렌더 블록”이 더 안정적인 경우가 많다는 점이다. 행렬, cases, 큰 norm bar, summation limits, equation tag가 조금이라도 흔들리면 우선순위는 `PDF 대조 -> 개편 전 HTML 수식 블록 복원 -> 현재 카드 레이아웃용 wrapper/CSS 보정` 순서다.

DROID-W에서 추가로 확인한 점은 multi-line/multi-number KaTeX block의 내부 tag가 Notion export 구조 때문에 오른쪽 끝이 아니라 중앙에 붙을 수 있다는 것이다. 이 경우 수식을 다시 쓰면 분수, norm, summation, script가 더 쉽게 망가지므로 원본 KaTeX body는 그대로 두고 번호만 `equation-tag-gutter`로 빼는 쪽을 우선한다.

ORB-SLAM2에서 추가로 확인한 점은 equation caption 안의 inline 수식은 본문 inline chip과 같은 selector로 처리하면 오히려 아래로 밀릴 수 있다는 것이다. 수식 본문은 원본 KaTeX block을 우선 복원하고, caption 안의 짧은 수식 token은 `figure.equation figcaption` scope에서만 baseline을 따로 맞춘다.

VGGT에서 추가로 확인한 점은 본문 한 문장 안에 KaTeX inline token과 manual inline token이 섞이면, token끼리만 맞추는 보정이 본문 전체 기준으로는 과하게 아래로 처질 수 있다는 것이다. `g_i`는 KaTeX token이고 `D_i`, `P_i`, `T_i`는 manual token인 경우처럼 서로 다른 DOM 구조가 섞이면, 먼저 공통 wrapper의 display/line-height/min-height/vertical-align을 맞추고, manual token만 미세하게 보정한다. 단, 최종 판단은 실제 브라우저에서 같은 줄 token center와 본문 글자 baseline을 함께 보는 것이다.

VGGT에서 추가로 확인한 또 다른 점은 CSS cascade가 baseline QA의 핵심이라는 것이다. 새 규칙이 파일 아래쪽에 있어도 selector specificity가 낮으면 기존 `.post-body :is(p, li, ...) > ...` 규칙을 이기지 못할 수 있다. 수식 위치가 예상대로 바뀌지 않으면 값부터 더 키우지 말고, matched CSS rule과 computed style을 먼저 확인한다.

필수 검사:

- [ ] `.katex-error` 또는 렌더링 실패가 없는가?
- [ ] PDF의 numbered equation이 수식 처리표에 모두 기록되었는가?
- [ ] 각 numbered equation이 본문 펼침, 수식별 토글, 의도적 제외 중 하나로 처리되었는가?
- [ ] 개편 전 페이지의 원본 KaTeX 블록이 있는 수식은 그 형태를 우선 복원했는가?
- [ ] block equation의 `(17)` 같은 번호 tag가 화면에 실제로 보이는가?
- [ ] 원본 수식 내부 번호와 현재 figure의 바깥 tag가 이중으로 보이지 않는가?
- [ ] multi-number equation에서 내부 tag가 중앙으로 쏠리면 right gutter fallback으로 번호만 보정했는가?
- [ ] table cell 안의 notation이 plain text로 방치되지 않았는가?
- [ ] 쉼표로 구분되는 inline notation은 쉼표를 보존하면서 token/chip으로 나뉘는가?
- [ ] model variant의 위첨자(`^C`, `^O`, `*`)가 text 그대로 남지 않았는가?
- [ ] subscript/superscript/overbar/dot notation이 PDF와 다르게 flatten되지 않았는가?
- [ ] formula chip이 line-height와 baseline을 깨뜨리지 않는가?
- [ ] 한 문장 안에 KaTeX inline token과 manual inline token이 섞인 경우, 같은 줄에서 token center가 맞고 본문 글자 기준으로도 과하게 아래/위로 치우치지 않는가?
- [ ] inline baseline을 수정한 뒤 matched CSS rule과 computed `vertical-align`/`transform`이 의도한 규칙을 실제로 가리키는가?
- [ ] 본문 inline 수식 baseline 보정이 표/brief 내부 notation chip까지 번져서 아래로 처지지 않는가?
- [ ] 표 내부의 `.math-token`은 별도 scope에서 `display:inline-flex`, `align-items:center`, `vertical-align:middle`을 유지하는가?
- [ ] equation caption 내부 inline token은 caption 글자와 같은 높이에 있고, 본문/table token 보정과 selector가 분리되어 있는가?
- [ ] 영어/한글 전환 후에도 같은 수식 스타일이 유지되는가?

권장 처리:

- 긴 block equation은 기존 KaTeX를 보존한다. 가능하면 개편 전 HTML의 원본 KaTeX 렌더 블록을 그대로 가져온다.
- table/result brief 안의 짧은 notation은 `.math-token`, `.math-token-list`, `.model-token`처럼 가벼운 HTML 토큰으로 처리한다.
- 본문 inline 수식 위치를 맞추기 위해 `.post-body .math-token`처럼 넓은 selector를 조정했다면, 반드시 `.post-body .summary-table .math-token` 또는 해당 table scope에서 baseline을 다시 고정한다. 표 안 token은 본문 inline chip과 같은 vertical offset을 공유하면 안 된다.
- equation caption 안 token은 본문 token도 table token도 아니다. ORB-SLAM2처럼 caption 설명에 들어간 `R∈SO(3)`, `t∈R^3` 같은 짧은 수식은 caption 전용 selector로만 조정한다.
- VGGT처럼 KaTeX token과 manual token이 섞이는 문장은 QA 대상 paragraph를 직접 열어 token별 `getBoundingClientRect()` center를 비교한다. 같은 줄의 token center 차이가 눈에 띄면 manual token 보정을 조정하고, 전체 token 묶음이 본문보다 내려가 보이면 공통 `vertical-align`을 먼저 되돌린다.
- baseline 문제가 생겼을 때 값만 계속 키우지 않는다. `CSS specificity -> common wrapper alignment -> manual token local transform -> table/caption regression` 순서로 원인을 좁힌다.
- 단순 모델명은 과한 KaTeX 변환보다 model token이 더 안정적이다.
- `Zbar`, `Ybar`, `Phibar` 같은 추출 흔적은 `\bar Z`, `\bar Y`, `\bar \Phi` 또는 별도 overbar token으로 바로잡는다.
- `T^t_{WR}`처럼 위첨자/아래첨자가 섞인 기호는 plain text로 재작성하지 말고 PDF의 script 관계를 유지한다.

### Prose vs Summary Balance

사용자가 계속 강조한 방향은 “정보 손실을 최소화하되, 장문을 raw하게 방치하지 않는 것”이다. 반대로 3D_SG에서는 너무 요약되어 글의 흐름이 사라지는 문제가 있었다.

기준:

- 표 내부: `metric scale 제공`, `memory 감소`, `uncertainty 누적`처럼 요약체 허용.
- 본문 문단: 조사와 서술어를 갖춘 자연스러운 문장 사용.
- 토글 내부: raw list를 그대로 두지 말고 내부에도 작은 summary panel, table, card, stepper를 둔다.
- 느낀점/향후 계획: 시각 카드/표보다 문단형 글을 유지한다.
- 기존 페이지에 느낀점/향후 계획이 작성되어 있지 않다면 새 해석을 임의로 만들지 않는다. 한글은 `(진행중...)`, 영어는 `(In progress...)` placeholder만 둔다.
- 개인 메모체는 유지할 수 있지만, `~됌`, `구지`, `되게끔`, `찾아보니 이런게 있더라구요`처럼 화면 톤을 흐리는 표현은 공식적 문장으로 정리한다.
- 논문 PDF와 맞지 않는 기존 해석, 강조, bold, 형광펜은 보존하지 않는다. PDF 기반 재해석이 우선이다.

### Toggle QA

토글은 이제 단순 `<details>`가 아니라 집중 읽기 공간으로 다룬다.

필수 기준:

- [ ] 열었을 때 topbar 바로 아래에 일정한 크기의 contained panel로 뜨는가?
- [ ] 토글 위치가 페이지 아래쪽이어도 panel height가 달라지지 않는가?
- [ ] 내부 scroll은 하나만 보이는가?
- [ ] close bar와 토글 끝 사이로 뒤쪽 본문이 보이지 않는가?
- [ ] `접기` 버튼은 오른쪽에 있고 scrollbar와 겹치지 않는가?
- [ ] 접은 뒤 현재 위치가 토글 시작점으로 정렬되는가?
- [ ] 토글 내부에도 heading/summary/table/card 스타일이 DROID-W와 같은 수준인가?

### Final DROID-W-Primary Regression Checklist

최종 산출 전에는 새 페이지와 DROID-W 페이지만 대조한다. 다른 reference 페이지는 열지 않아도 된다. 이 checklist는 DROID-W에서 실제로 안정화된 요소, ORB-SLAM2에서 문서화된 figure/equation/caption refinement, 그리고 반복해서 오류가 났던 요소를 통과 기준으로 둔다.

- [ ] DROID-W처럼 상단 TL;DR cue가 짧고, visual block 앞에 필요한 경우만 minimal subheading이 있는가?
- [ ] DROID-W처럼 `Problem -> Mechanism -> Evidence -> Usage / Limits` 질문 흐름이 유지되는가?
- [ ] Mechanism이 가장 자세한 section이고, 핵심 수식/모듈이 별도 ledger가 아니라 설명 흐름 안에 들어 있는가?
- [ ] `Problem Ladder`, `Design Choice`, `Method Step Block`, `Evaluation Evidence Panel`, `Usage Fit Box` 중 필요한 패턴이 DROID-W와 같은 밀도와 대비로 적용되었는가?
- [ ] core evaluation과 supporting evidence가 DROID-W처럼 분리되었는가?
- [ ] dataset group, sensor/GT/setup, evaluation role이 같은 의미 축에 섞이지 않았는가?
- [ ] image/table caption 제목 줄은 `caption-main`, 설명 줄은 필요한 경우만 `caption-note`로 분리되었는가?
- [ ] paired figure/table, equation caption token, 한글 caption 정리 규칙이 Unit 7 기준대로 확인되었는가?
- [ ] multi-equation tag가 중앙으로 쏠리면 DROID-W처럼 원본 수식 body 유지 + right gutter fallback으로 번호만 보정했는가?
- [ ] PDF 원문 기준으로 잘못된 해석이나 과장된 insight가 없는가?
- [ ] 기존 이미지, 수식, embed, comments, 개인 메모가 의도치 않게 사라지지 않았는가?
- [ ] 표 안 문장은 요약체, 본문은 자연스러운 문장이라는 톤이 지켜졌는가?
- [ ] 영어 전환 후 한국어가 남지 않고, bookmark/current section label까지 같이 바뀌는가?
- [ ] KO/EN 전환 후 같은 이미지의 렌더링 폭이 달라지지 않는가?
- [ ] KO/EN 전환 후 body, heading, section chip, rectangular label, note/brief, table body, toggle summary의 computed font-size/line-height가 DROID-W와 맞는가?
- [ ] 사진 크기, 글자 크기, 회색/노란 theme, 토글 panel이 DROID-W와 같은 시각 언어로 보이는가?
- [ ] 수식 많은 논문은 수식 처리표와 실제 화면의 수식/토글을 대조했는가?
- [ ] 본문 inline equation chip과 table/brief 내부 notation chip의 baseline이 각각 자연스럽고, 한쪽 보정이 다른 쪽에 부작용을 만들지 않는가?
- [ ] Conclusion과 result/evidence detail이 KO/EN 양쪽에 함께 추가되었는가?
- [ ] `git diff --check`, script syntax check, browser desktop/mobile spot check를 통과했는가?

## 20. Khronos Lessons Learned

Khronos 개편에서는 수식이 많은 method/theory paper에서 “요약식 구성”만으로는 부족하다는 점이 드러났다. 핵심 흐름을 잡아주되, 논문의 notation과 factorization, optimization, metric 수식은 토글 안에서라도 빠짐없이 보존해야 한다.

| 겪은 문제 | 원인 | 다음 적용 기준 |
| --- | --- | --- |
| 논문에 수식이 많은데 본문에 일부만 보임 | 핵심 수식 위주로 정리하면서 notation/보조 수식의 처리 위치가 없었음 | PDF의 numbered equation을 먼저 전부 목록화하고, 각 수식의 최종 위치를 기록 |
| block equation 번호가 화면에 안 보임 | equation tag가 source annotation이나 텍스트 설명에만 남음 | numbered equation은 block 안에 `(17)`처럼 보이는 tag를 둔다 |
| inline 수식의 아래첨자/위첨자가 틀어짐 | Notion/PDF 변환 흔적을 plain text token으로 처리 | sub/sup/overbar/dot notation은 PDF와 대조하고, 필요한 CSS를 별도로 둔다 |
| `Zbar`, `Ybar`, `Phibar` 같은 표기가 남음 | 추출 텍스트를 수식 표기로 복원하지 않음 | overbar/dot/script 표기는 사람이 읽는 notation으로 정규화 |
| 긴 수식 토글 마지막 줄이 close bar에 가림 | focused toggle의 bottom padding이 부족 | long/수식 토글에는 충분한 bottom buffer를 두고 바닥까지 스크롤해 확인 |
| Factorization/Global optimization 토글도 같은 문제가 반복 | 현재 페이지의 한 토글만 수정 | 같은 패턴의 긴 토글과 다른 개편 페이지까지 함께 regression |
| 실험 결과가 너무 요약됨 | 평가 figure/table을 claim 근거로 분해하지 않음 | `Result Detail` 또는 `Evidence Detail` 표로 각 표/그림의 역할을 정리 |
| supplementary figure/table까지 모두 이미지로 복원해 페이지가 무거워짐 | `PDF에 있음`과 `블로그에 이미지로 필요함`을 구분하지 않음 | 사용자가 넣지 않은 supplementary figure/table 이미지는 기본 생략하고, 필요 시 텍스트 요약/report 기록으로 처리 |
| appendix-only 수식이 본문 핵심처럼 보임 | numbered equation이라는 이유만으로 보존 | 본문 claim/method/evaluation에 직접 필요하지 않은 appendix-only 수식은 제거하고 report에만 기록 |
| Conclusion이 개인 느낀점과 바로 이어짐 | 공식 결론 section을 짧다는 이유로 생략 | Conclusion은 짧게라도 보존하고, 개인 느낀점/향후 계획과 분리 |

Khronos식 수식 토글 분류 예시:

| Toggle 유형 | 포함할 내용 | 본문과의 관계 |
| --- | --- | --- |
| SMS notation | trajectory, object, observation, odometry 정의 | 문제 설정을 이해하는 보조 notation |
| Factorization derivation | local consistency, fragment, probabilistic decomposition | method의 수학적 전개를 보존 |
| Global optimization / change evidence | robust pose graph, TLS/GNC, ray distance, presence/absence evidence | Khronos의 long-term change reasoning 근거 |
| Metric notation | 4D metric과 metric set 정의 | evaluation 해석을 위한 보조 수식 |

Khronos 이후 추가 QA:

- [ ] PDF의 numbered equation 개수와 페이지 내 수식 처리표가 일치하는가?
- [ ] 핵심 수식은 펼쳐 있고, 보조 수식은 수식별 토글에 구조화되어 있는가?
- [ ] 모든 numbered equation tag가 화면에서 확인되는가?
- [ ] inline 수식의 subscript/superscript/overbar/dot notation이 PDF와 일치하는가?
- [ ] 수식 토글을 끝까지 스크롤했을 때 마지막 설명이 close row에 가리지 않는가?
- [ ] formula-heavy toggle을 고쳤다면 다른 긴 토글과 다른 개편 페이지에도 같은 bottom buffer 문제가 없는지 확인했는가?
- [ ] PDF의 주요 table/figure가 `Result Detail` 또는 `Evidence Detail`에서 claim-evidence 관계로 정리되었는가?
- [ ] Conclusion이 KO/EN 양쪽에서 개인 메모와 분리되어 있는가?

## 21. DROID-W Lessons Learned

DROID-W는 기존 “원문 섹션 순서 정리”에서 한 단계 더 나아가, 독자 질문 중심 구조를 실제 페이지에 적용한 기준 사례다. 이 페이지의 핵심은 `Problem -> Mechanism -> Evidence -> Usage / Limits` 흐름을 유지하면서도, 방법론은 충분히 자세하게 쓰고 평가는 task/claim 중심으로 나누는 것이다.

### DROID-W Reference Elements

| 요소 | 역할 | 다음 페이지 적용 기준 |
| --- | --- | --- |
| `tldr-cues` | 첫 화면에서 문제/해결/근거를 즉시 구분 | 각 cue는 짧은 label + 한 줄 보조문. 줄바꿈이 길어지면 본문으로 이동 |
| `map-subsection-title` | TL;DR 내부 도식의 의미를 짧게 고정 | `처리 흐름`, `접근 방식 비교`처럼 바로 아래 visual block의 역할만 말함 |
| `problem-ladder` | 문제 제기가 단계적으로 쌓이는 논문에 사용 | 기존 가정 -> 실패 상황 -> 기존 접근 한계 -> 논문의 재정의 순서 |
| `design-choice-box` | 논문이 왜 특정 설계를 택했는지 보여줌 | 버린 방향, 채택한 방향, 얻는 효과를 같은 크기의 block으로 배치 |
| `method-step-block` | 방법론의 핵심 단계와 수식을 본문 흐름 안에 배치 | 수식은 별도 ledger가 아니라 해당 설계 설명 바로 아래에 둠 |
| `evaluation-evidence-panel` | 평가 축을 core/supporting으로 분리 | tracking/qualitative는 core, runtime/ablation/custom dataset은 supporting처럼 역할을 분리 |
| `equation-tag-gutter` | multi-number 수식의 tag 위치만 보정 | 원본 KaTeX body 유지, 내부 tag만 해당 figure에서 숨김 |
| `caption-main` | 이미지/표 caption 제목 줄 통일 | 모든 image/table caption 제목은 굵게. 설명은 필요할 때만 `caption-note`. equation caption은 수식 설명 스타일 허용 |
| `usage-fit-box` | 적용 조건과 한계를 빠르게 판단 | 잘 맞는 조건, 필요한 가정, 약한 조건을 compact table로 정리 |

### DROID-W Implementation Coverage Matrix

아래 표는 DROID-W 페이지에 실제로 적용된 주요 요소를 빠짐없이 추적하기 위한 구현 inventory다. 새 페이지 검증에서는 다른 reference를 보지 않고, 아래 DROID-W 요소가 필요한 위치에 같은 역할로 들어갔는지 확인한다.

| 영역 | DROID-W 구현 요소 | 문서화/검증 기준 |
| --- | --- | --- |
| Header / Identity | compact paper title meta, `Paper Reviews` topbar, home profile icon, theme toggle, `lang-toggle` | 긴 논문 제목은 큰 H1로 올리지 않고, KO/EN과 theme 상태가 같은 페이지 안에서 유지 |
| TL;DR cue | `tldr-cues`, `cue-chip` | `문제 / 해결 / 근거` 같은 짧은 좌표만 제공. cue 안 장문 금지 |
| TL;DR cards | `paper-map`, `paper-map-head`, `map-grid`, `map-card`, `map-card-wide`, `map-label` | contribution과 한 문장 요약을 같은 계층으로 정리하고, 표 내부는 요약체 사용 |
| TL;DR visual heading | `map-subsection-title` | `처리 흐름`, `접근 방식 비교`처럼 바로 아래 visual block의 역할만 짧게 표시 |
| Visual flow | `flow-diagram`, `flow-step` | 순차 처리 구조일 때만 사용하고, 단계 사이 연결이 카드 나열처럼 보이지 않게 함 |
| Comparison visual | `compare-grid`, `compare-kicker` | baseline/approach 차이를 비교 축 중심으로 정리. 불필요한 장문 설명 금지 |
| Deep dive reveal | `deep-dive-body`, `deep-dive-more`, `deep-dive-more-btn`, collapsed blur | button/mask/revealed 상태가 새로고침, 언어 전환, bookmark 이동에서 함께 동기화 |
| Deep section skeleton | `deep-section` | KO/EN 모두 `Problem`, `Mechanism`, `Evidence`, `Usage / Limits`, 개인 메모 흐름 유지 |
| Problem framing | `problem-ladder`, `problem-ladder-grid` | 기존 가정 -> 실패 상황 -> 기존 접근 한계 -> 논문의 재정의 순서 |
| General summary | `summary-panel`, `summary-head`, `summary-table`, `summary-table-wrap`, `summary-term` | 긴 문단/나열을 먼저 구조화하되, section 사이 연결 문장은 prose로 남김 |
| Related detail | `supplement-toggle`, `supplement-structured`, `appendix-details`, `supplement-details`, `summary-panel-soft`, `supplement-card-grid`, `supplement-card-grid-four`, `supplement-card`, `supplement-badge` | Related Work나 dataset/GT 세부 조건은 토글 안에서도 table/card로 구조화 |
| Mechanism overview | `method-table`, `method-step-block` | Method가 가장 자세해야 하며, 수식과 모듈이 별도 ledger가 아니라 설명 흐름에 배치 |
| Design decision | `design-choice-box`, `design-choice-grid` | 버린 방향, 채택한 방향, 얻는 효과를 같은 크기 block으로 비교 |
| Method equations | `method-equation-cluster`, `equation`, `equation-container`, `equation-render`, `equation-main`, `equation-main-original`, `original-equation-part`, `original-equation-stack`, `has-original-equation-number`, KaTeX 내부 span(`katex-mathml`, `mathnormal`, `mathcal`, `mathbf`, `mclose` 등) | 개편 전 원본 KaTeX body를 우선 보존하고, wrapper/CSS로 현재 레이아웃에 맞춤. KaTeX 내부 class는 새로 설계하지 않고 원본 렌더 보존 대상으로 취급 |
| Equation tag fallback | `equation-tag-gutter`, `equation-tag-gutter-stack` | multi-number 수식의 tag가 중앙으로 쏠릴 때 원본 수식 body는 유지하고 번호만 right gutter로 보정 |
| Inline math | `inline-equation-token`, `notion-text-equation-token`, `math-token`, `math-token-list`, `math-token-separator` | 중립 회색 chip, 본문 baseline, 쉼표, sub/sup/frac를 실제 브라우저에서 확인. 본문 token과 표 내부 token은 baseline scope를 분리 |
| System figure | `system-overview-figure`, `image`, `caption-main`, `caption-note` | 사용자가 첨부한/기존 asset 우선. image/table caption 제목은 굵게, note는 PDF 근거 있을 때만 |
| Evidence summary | `evaluation-evidence-panel`, `evaluation-table-stack`, `evaluation-table-block`, `evaluation-table-label`, `task-evidence-table`, `summary-term-secondary` | `Core evaluation`과 `Supporting evidence`를 같은 표에 섞지 않고 block으로 분리 |
| Evidence emphasis | `evidence-focus`, `evidence-detail` | 표 안에서도 먼저 볼 claim과 보조 설명을 분리하되, 과한 강조/작업용 문구 금지 |
| Result brief | `result-brief`, `result-brief-wide`, `result-brief-head`, `result-brief-grid` | 대표 근거, mechanism brief, conclusion brief처럼 claim-evidence 연결이 필요한 곳에만 사용 |
| Evidence media cluster | `evidence-cluster`, `caption-main`, `caption-note` | figure/table은 caption 제목 줄과 설명 줄을 분리하고, PDF crop/임의 이미지 삽입을 피함 |
| Dataset contribution | `dataset-contribution`, `dataset-evidence-grid`, `dataset-evidence-grid-two`, `dataset-kicker`, `dataset-detail-toggle`, `dataset-table` | dataset group, 포함 내용, evaluation role을 같은 의미 축으로 정리. sensor/GT는 별도 column/toggle |
| Cell bullet | `compact-cell-list` | 표 내부에서도 글머리 기호가 자연스러운 경우 사용해 구겨 넣은 문장 방지 |
| Usage / limits | `usage-fit-box`, `usage-table`, `next-question-note` | 잘 맞는 조건, 필요한 가정, 약한 조건, 다음 질문을 짧게 분리 |
| Bookmark | `section-bookmark`, `bookmark-eyebrow`, `bookmark-status`, `bookmark-list` | section heading으로 정확히 이동하고 active item이 흔들리지 않으며 sidebar 안에서 보임 |
| Toggle focus | `is-focused-supplement`, `supplement-close-row`, `supplement-lazy-placeholder` | topbar 아래 fixed panel, 내부 scroll 하나, close row 하단 가림 방지, close 후 summary 위치 정렬 |
| Asset interactions | lightbox, `lb-close`, image click, comments, GitHub/project link preview | 기존 image lightbox, close button, comments, embed/link preview가 개편 뒤에도 유지 |
| Cache/versioning | `styles.css?v=...`, `script.js?v=...` | CSS/JS 수정 후 style cache query와 script cache query를 갱신. 브라우저가 이전 스타일/동작을 계속 쓰지 않게 함 |

### DROID-W에서 겪은 문제와 방지 기준

| 겪은 문제 | 원인 | 다음 적용 기준 |
| --- | --- | --- |
| TL;DR의 `문제/해결/근거` cue가 줄바꿈으로 어색함 | cue 안에 설명을 너무 많이 넣음 | cue는 좌표만 제공하고, 설명은 Problem/Mechanism/Evidence로 이동 |
| `논문 상세 정리` h3가 `Abstract/Introduction/Method`로 남음 | 상단 TL;DR만 바꾸고 deep dive heading pass를 빠뜨림 | 화면 h3와 오른쪽 책갈피는 원문 목차명이 아니라 `Problem Snapshot/Context`, `Gap`, `Mechanism`, `Evidence`, `Usage / Limits` 질문형 제목으로 바꾼다 |
| h3만 질문형이고 본문은 여전히 원문 목차 순서 | 의미 재배치 없이 제목만 치환 | DROID-W처럼 Abstract/Introduction/Related Work를 `Problem`, Method/수식/Update를 `Mechanism`, Experiments/Ablation을 `Evidence`, Conclusion/Limitation을 `Usage / Limits`로 실제 병합한다 |
| `Problem Ladder`와 `Design Choice`가 배경에 묻힘 | visual block의 border/contrast가 약함 | ladder/card/checklist는 주변 배경과 분리되는 얕은 border와 padding을 둔다 |
| 방법론이 요약표처럼 보임 | 수식과 핵심 update를 별도 목록으로 분리 | Method는 가장 자세한 구간이다. 문제 -> 설계 선택 -> 수식/update -> 효과 순서로 prose와 수식을 함께 둔다 |
| `Equation Ledger`, `~ 읽는 법` 같은 내부 작업명이 화면에 남음 | 검증용 구조를 사용자-facing 제목으로 사용 | 화면 제목은 논문이 전달하려는 내용을 말한다. 내부 inventory/ledger는 문서나 report에만 둔다 |
| dataset 이름과 sensor/GT 구성이 한 표 축에 섞임 | 서로 다른 의미 단위를 같은 row label로 배치 | dataset group, sensor/GT, evaluation role은 다른 column 또는 다른 table/toggle로 분리 |
| runtime/ablation/dataset contribution을 task처럼 다룸 | 평가 축과 보조 근거를 구분하지 않음 | `Core evaluation`과 `Supporting evidence`를 분리한다 |
| 사용자가 첨부한 Fig. 2와 페이지 이미지가 달라 보임 | PDF crop 또는 생성된 듯한 asset을 섞음 | 기존/사용자 첨부 asset을 우선하고, 새 crop은 main paper 필수 자산일 때만 사용. 의심되면 사용자에게 알림 |
| caption의 `Focus`, `강조` 문구가 과해짐 | PDF 근거보다 작성 중 해석을 붙임 | 논문 본문이 해당 결과를 해석한 경우에만 caption-note를 둔다 |
| `(4)(5)`, `(7)(8)`, `(8)(9)` 수식 번호가 중앙으로 쏠림 | Notion/KaTeX multi-part block 내부 tag 위치가 레이아웃과 충돌 | 원본 수식 body를 재작성하지 않고 right gutter stack으로 번호만 보정 |
| 단일 수식 번호가 block 수식처럼 오른쪽 끝에 붙지 않음 | 바깥 `.equation-tag`가 grid 폭/스크롤과 충돌 | Chamelion처럼 단일 numbered equation에도 `equation-tag-gutter-stack`을 적용하고 `.equation-tag`는 숨김 |
| 수식 figure 아래에 `>` 같은 stray 문자가 보임 | 자동 치환 중 `</figure>>`가 남음 | equation figure 직후 text node를 스캔하고, 특히 multi-equation figure 다음 형제에 stray text가 없는지 확인 |
| 표 내부 수식 token이 아래로 처짐 | 본문 inline 수식 baseline을 고치기 위한 `.post-body .math-token` 규칙이 표 내부까지 덮어씀 | table scope에서 `.summary-table .math-token` baseline을 별도 고정하고, 브라우저 computed style로 `vertical-align: middle`을 확인 |
| equation caption의 inline 수식이 아래로 처짐 | 본문/table 수식 보정 selector가 caption 맥락을 고려하지 않음 | `figure.equation figcaption` scope에서만 baseline을 별도 조정하고, 본문/table token은 건드리지 않는다 |
| VGGT 본문에서 `g_i`, `D_i`, `P_i`, `T_i` 위치가 줄마다 흔들림 | KaTeX token과 manual inline token이 같은 문장에 섞였고, 각 token의 intrinsic baseline이 달랐음 | mixed token 문장은 공통 wrapper baseline을 먼저 맞추고 manual token만 미세 보정한다. 같은 줄 token center와 본문 글자 기준 위치를 모두 확인 |
| inline 수식 전체가 아래로 처짐 | token끼리의 center만 맞추고 본문 baseline과의 관계를 보지 않음 | “수식끼리 정렬”과 “본문과 정렬”을 별도 gate로 본다. 전체가 처지면 공통 `vertical-align`을 올리고, manual token local transform만 남긴다 |
| CSS를 바꿨는데 화면 값이 그대로임 | 새 selector가 기존 `:is(p, li, ...)` selector의 specificity를 이기지 못함 또는 cache query가 갱신되지 않음 | 브라우저 matched rule/computed style을 확인하고, 같은 specificity 이상의 selector로 override한 뒤 `styles.css?v=...`를 갱신한다 |
| 원본 KaTeX가 살아 있는 수식을 커스텀 HTML로 다시 만듦 | 카드형 레이아웃에 맞추려다 fraction/projection 형태가 흐트러짐 | ORB-SLAM2처럼 원본 KaTeX block을 우선 복원하고 wrapper/CSS만 조정한다 |
| Fig. 1a/Fig. 1b 같은 paired figure가 세로로 분리되거나 높이가 어긋남 | 이미지별 width만 맞추고 묶음 관계를 보존하지 않음 | 의도적으로 이어붙인 figure는 같은 row, 같은 높이감, 같은 caption hierarchy로 유지한다 |
| 한글 페이지 caption이 영어 설명문으로 남음 | figure/table 제목을 PDF에서 가져온 뒤 language panel별 문장 정리를 생략 | KO caption은 한글 문장으로 바꾸고, 필요한 technical term만 영어로 남긴다 |
| 느낀점이 없던 페이지에 새 감상이 생김 | 비어 있던 개인 section을 논문 해석으로 채움 | 원본에 개인 메모가 없으면 한글 `(진행중...)`, 영어 `(In progress...)` placeholder만 둔다 |
| 영어 버전에서 한글이 남음 | rich HTML 번역, hidden panel, bookmark label을 함께 검사하지 않음 | KO/EN 전환 후 `.post-body`, bookmark, details, caption, note/brief까지 visible Korean scan |

### DROID-W 이후 추가 QA

- [ ] TL;DR cue가 `문제 / 해결 / 근거`처럼 짧고 안정적으로 보이는가?
- [ ] visual block마다 너무 긴 description 대신 짧은 subheading이 있는가?
- [ ] Problem section이 `기존 가정 -> 실패 상황 -> 기존 접근 한계 -> 논문의 재정의`로 읽히는가?
- [ ] Mechanism section이 페이지에서 가장 자세하고, 수식과 module 설명이 method 흐름 안에 있는가?
- [ ] core evaluation과 supporting evidence가 분리되어 있는가?
- [ ] dataset group과 sensor/GT/setup 정보가 같은 의미 축에 섞이지 않았는가?
- [ ] 모든 image/table caption 제목 줄이 `caption-main`으로 통일되었는가?
- [ ] caption note가 PDF 근거 없는 임의 해석이나 작업 조언을 담지 않는가?
- [ ] multi-equation tag가 중앙으로 쏠리지 않는가? 쏠리면 원본 수식 body 유지 + right gutter fallback으로만 보정했는가?
- [ ] 본문 문장 안에서 KaTeX token과 manual token이 섞이는 경우, 수식끼리와 본문 글자 기준 baseline이 모두 자연스러운가?
- [ ] baseline 관련 selector가 실제 computed style에 반영되는가? cache query도 갱신되었는가?
- [ ] 표/brief 내부 `.math-token`이 본문 inline chip처럼 아래로 처지지 않고 cell text와 같은 높이에 놓이는가?
- [ ] equation caption 안의 inline 수식이 본문 글자 높이와 맞고, caption 전용 scope로만 보정되었는가?
- [ ] paired figure가 한 줄 구성과 같은 높이감을 유지하는가?
- [ ] 한글 caption이 영어 문장으로 남지 않았는가?
- [ ] 원본에 없던 느낀점/향후 계획이 새로 작성되지 않았는가?
- [ ] KO/EN 전환 후 caption, details, bookmark, note/brief까지 한글 잔여가 없는가?

### DROID-W-Primary Frequent Error Sweep

이 sweep은 최종 보고 직전에 한 번 더 실행한다. 다른 reference page를 열 필요 없이 DROID-W와 현재 대상 페이지만 비교한다. ORB-SLAM2에서 안정화된 수식 caption, paired figure, 한글 caption 규칙은 아래 표에 문서화되어 있으므로 별도 reference를 열지 않고도 함께 확인한다.

| 점검 영역 | 자주 난 오류 | 통과 기준 |
| --- | --- | --- |
| TL;DR cue | cue 안 문장이 길어 줄바꿈이 생김 | `문제 / 해결 / 근거` 같은 짧은 좌표만 남기고 설명은 상세 section으로 이동 |
| Minimal subheading | `~ Map`, `~ 읽는 법`, `~ ledger` 같은 내부 제목이 화면에 남음 | `처리 흐름`, `접근 방식 비교`처럼 독자에게 보이는 기능만 말함 |
| Problem 흐름 | Related Work 세부가 Problem 본문을 잠식 | Problem은 실패 가정과 논문 재정의만 먼저 제시, 세부 문헌군은 toggle |
| Mechanism 깊이 | 방법론이 요약표 수준으로 얕아짐 | Mechanism이 가장 자세하고, 핵심 수식/모듈/설계 선택이 문제 해결 흐름과 연결 |
| 수식 block | KaTeX body를 재작성하다가 분수, norm, sigma, script가 깨짐 | 개편 전 원본 KaTeX body를 우선 복원하고 wrapper/CSS만 보정 |
| 수식 번호 | single/multi-equation tag가 중앙으로 쏠리거나 오른쪽 끝에 붙지 않음 | 해당 figure에만 `equation-tag-gutter`/`equation-tag-gutter-stack` 적용, 내부 `.katex-html .tag`나 바깥 `.equation-tag`만 숨김 |
| inline 수식 | chip baseline, 색상, 쉼표, sub/sup가 제각각 | DROID-W inline token과 같은 색/높이/쉼표 보존. raw TeX 노출 없음 |
| mixed inline 수식 | KaTeX token과 manual token이 섞여 같은 문장 안에서 위아래로 흔들림 | VGGT처럼 token별 center를 측정하고, 공통 wrapper baseline + manual token local transform으로 맞춤. 본문 글자 기준으로 처지면 실패 |
| inline CSS cascade | 보정값을 넣었는데 computed style이 기존 값으로 남음 | matched rule과 specificity를 확인. 새 rule이 기존 `:is(p, li, ...)` selector를 이기게 만들고 cache query 갱신 |
| table 수식 | 본문 inline 수식 보정이 표 내부 `.math-token`까지 적용되어 아래로 쏠림 | table/brief scope에서 별도 baseline rule을 둔다. computed style은 `display:inline-flex`, `vertical-align:middle` |
| equation caption 수식 | caption 안 inline token만 아래로 밀림 | ORB-SLAM2처럼 `figure.equation figcaption` 전용 baseline rule로 보정하고 table/body 수식에는 영향 없음 |
| image/table caption | 제목과 설명이 한 줄에 붙거나, 임의 `Focus`가 들어감 | image/table 제목은 `caption-main`, 설명은 PDF 근거가 있을 때만 `caption-note` |
| KO caption | 한글 panel에서 caption 설명이 영어 문장 그대로 남음 | 기술 용어는 유지 가능하지만 문장 구조는 한글로 정리 |
| paired figure | Fig. 1a/1b처럼 나란히 읽어야 하는 그림이 분리됨 | 같은 row와 같은 높이감 유지, 기존 의도적 figure pair도 함께 점검 |
| asset source | 사용자가 준 그림 대신 PDF crop/생성 느낌 이미지가 들어감 | 기존 asset 또는 사용자가 첨부한 asset 우선. 새 crop은 main paper 필수일 때만 사용 |
| 평가 구조 | runtime/ablation/dataset을 task와 같은 표에 섞음 | `Core evaluation`과 `Supporting evidence` table block 분리 |
| 평가표 overflow | Evidence table의 `min-width`가 좁은 viewport에서 살짝 넘침 | DROID-W처럼 table wrapper는 줄바꿈을 허용하고, `activeTableOverflow`가 0인지 브라우저에서 확인 |
| dataset table | dataset 이름, sensor, GT, benchmark 역할이 같은 열에 섞임 | dataset group / 포함 내용 / evaluation role을 별도 column으로 분리 |
| figure/table 크기 | KO/EN 전환 후 이미지 폭이 달라짐 | 같은 asset은 KO/EN에서 rendered width 동일 |
| KO/EN 전환 | hidden panel, caption, bookmark, details에 한글 잔여 | visible scan과 DOM scan 모두 통과 |
| right bookmark | 클릭 위치가 section 시작점과 어긋남 | DROID-W처럼 section heading에 정확히 이동하고 active item이 흔들리지 않음 |
| 더보기 blur | 버튼만 뜨거나 mask만 사라짐 | button/mask/revealed 상태가 새로고침, 언어 전환, bookmark 이동에서 동기화 |
| contained toggle | 아래쪽 토글일수록 panel height가 작아짐 | topbar 아래 고정 높이 panel, 내부 scroll 하나, close 후 summary 위치 정렬 |
| close row | `접기` 아래 여백으로 뒤 내용이 보임 | close bar가 panel 하단을 덮고, 마지막 문단은 bottom buffer로 가리지 않음 |
| 톤 | 사용자에게 한 조언이나 작업 메모가 본문에 남음 | 화면 텍스트는 논문 내용과 독자 안내만 포함 |
| 개인 메모 | 기존에 쓰지 않은 느낀점/향후 계획을 새로 작성 | 원본 내용이 없으면 placeholder만 사용하고, 논문 claim/해석을 개인 감상으로 꾸며 넣지 않음 |

권장 자동/수동 점검:

- HTML/CSS/JS static: `git diff --check`, `node --check pages/paper_reviews/<PAGE>/script.js`
- DOM count: `.tldr-cues`, `.cue-chip`, `.map-subsection-title`, `.flow-diagram`, `.compare-grid`, `.problem-ladder`, `.design-choice-box`, `.method-step-block`, `.method-equation-cluster`, `.evaluation-evidence-panel`, `.evaluation-table-label`, `.evidence-focus`, `.evidence-detail`, `.result-brief`, `.dataset-evidence-grid`, `.usage-fit-box`, `.caption-main`, `figure.equation-tag-gutter`, `.equation-tag-gutter-stack`
- browser computed: `.katex-error === 0`, image/table caption missing count `0`, prohibited visible terms `0`, active table overflow `0`, equation gutter style matches DROID-W, table `.math-token` baseline stays middle, mixed inline token centers are aligned, intended baseline selector is the computed winner
- visual spot: TL;DR, Mechanism 수식 구간, Evidence table overflow, contained toggle, KO/EN 전환 후 같은 위치
- content spot: PDF abstract/contribution/method/evaluation/conclusion과 page section이 서로 모순되지 않는지 확인

### VGGT Inline Math Baseline Lessons

VGGT에서 마지막으로 확인한 문제는 수식 자체가 깨진 것이 아니라 inline token의 baseline 계층이 섞인 문제였다. `(I_i)^N_{i=1}`와 `g_i`는 KaTeX 기반 `.notion-text-equation-token`이고, `D_i`, `P_i`, `T_i`는 수동 HTML `.inline-math`였기 때문에 같은 문장에서도 token 높이와 script 위치가 달랐다.

이 문제는 다음 순서로 처리한다.

1. 대상 문장을 찾고 token 종류를 분리한다. 같은 문장 안의 `.notion-text-equation-token`, `.inline-math`, `.math-token`, `.model-token`, `.equation-chip-part`를 모두 확인한다.
2. 같은 줄에 있는 KaTeX token과 manual token의 bounding box center를 비교한다. 한쪽이 2-4px 이상 다르면 눈으로도 흔들려 보일 가능성이 높다.
3. 공통 wrapper는 `display:inline-flex`, `align-items:center`, `line-height:1`, 적절한 `min-height`로 맞춘다. 단, 공통 `vertical-align`은 본문 글자 기준 위치를 정하는 값이므로 과하게 음수로 두지 않는다.
4. manual token만 KaTeX보다 높거나 낮으면 `.inline-math`에만 작은 `transform: translateY(...)`를 둔다. 이때 KaTeX token에도 같은 transform을 주면 전체 문장이 내려가거나 올라간다.
5. 조정 뒤에는 두 개를 따로 본다. `수식끼리 center가 맞는가`와 `본문 글자 기준으로 수식 묶음이 자연스러운가`가 모두 통과해야 한다.
6. computed style이 의도한 값을 쓰는지 확인한다. 기존 넓은 selector가 새 규칙보다 specificity가 높으면 파일 아래에 있어도 새 규칙이 지지 않는다.
7. CSS를 수정했으면 HTML의 `styles.css?v=...`를 갱신한다. 캐시가 남으면 같은 오류를 계속 보는 것처럼 보인다.
8. 같은 보정이 table, summary panel, equation caption까지 번지지 않았는지 확인한다. table token은 `vertical-align:middle`, caption token은 caption 전용 scope가 기준이다.

VGGT식 inline 수식 QA는 앞으로 “수식 렌더링이 되는가”에서 끝나면 안 된다. 수식이 보이더라도 baseline, script, comma, 색상, cache, selector 우선순위까지 확인해야 최종 통과다.

## 22. 10-Page Batch Policy

현재 batch는 `ORB-SLAM2`, `DROID-W`, `DynaSLAM`을 제외한 10개 page를 대상으로 한다. 진행표는 `REDESIGN_BATCH_10_QUEUE.md`가 기준이며, `node scripts/paper-redesign-next.mjs`로 다음 target을 확인한다.

Personal note 예외:

- 이번 10-page batch에서 기존 `느낀점` / `향후 계획` 내용을 참고할 수 있는 대상 page는 `DROID-SLAM`, `3D_SG`뿐이다.
- `ORB-SLAM2`는 개인 메모 보존 reference지만 이번 queue의 직접 작업 대상이 아니다.
- 나머지 batch 대상 page는 기존에 내용이 있더라도 개인 메모를 새로 정리하지 않는다.
- placeholder는 한글 `(진행중...)`, 영어 `(In progress...)`로 통일한다.
- 이 규칙은 `Conclusion`, `Usage / Limits`, `Evidence`를 줄이라는 뜻이 아니다. 논문 공식 내용은 PDF 기준으로 충분히 정리하고, 개인 감상/계획 section만 placeholder로 둔다.

Batch execution rule:

- `ORB-SLAM2`는 이번 batch에서 수정하지 않는다. 다만 paired figure, 원본 KaTeX 복원, equation caption baseline, 한글 caption 정리 규칙은 Unit 7 QA로 적용한다.
- `DROID-W`는 active reference로만 사용하고, 직접 수정 대상에서 제외한다.
- `DynaSLAM`은 이번 batch의 직접 수정 대상에서 제외하지만, table `.math-token` baseline 분리와 빈 개인 메모 처리 교훈은 적용한다.
- 사용자의 시작 사인이 있으면 `node scripts/paper-redesign-next.mjs --start-next`로 첫 pending row를 `in_progress`로 올린 뒤 해당 page 하나만 작업한다.
- 한 page가 Unit 1-10과 final DROID-W regression을 통과하기 전까지 다음 page HTML/CSS/JS는 수정하지 않는다.
- 각 page completion log에는 personal note policy가 `preserve existing`인지 `placeholder`인지 반드시 기록한다.
