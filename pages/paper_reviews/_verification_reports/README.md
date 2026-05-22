# Verification Reports

이 폴더는 `VERIFY_PLAYBOOK.md`를 따라 page별 검증 결과를 남기는 곳이다.

파일명:

```text
<PAGE>_YYYYMMDD.md
```

권장 시작 명령:

```bash
node scripts/verify-paper-review.mjs <PAGE>
```

Report는 자동 스캔 결과만 붙여 넣지 말고, PDF를 직접 대조한 판단을 함께 남긴다.

## Template

```md
# <PAGE> Verification Report

## Verdict
- Status: pass / needs_fix / blocked
- Date:
- PDF:
- Page:

## Static Scan
- Command:
- Result:

## PDF Claim Map
- Problem:
- Contributions:
- Method:
- Evaluation:
- Conclusion / limitation:

## Equation Ledger
| PDF Eq. | Page location | Status | Notes |
| --- | --- | --- | --- |

## Figure / Table Ledger
| PDF item | Page source file | Page location | Visual match | Status | Notes |
| --- | --- | --- | --- | --- | --- |

## Related Work / Supplement Check
- Related Work coverage:
- Notation/equation toggles:
- Appendix/ablation preservation:

## Issues
| Severity | Location | Problem | Fix |
| --- | --- | --- | --- |

## Gates
- Gate 1 Source Binding:
- Gate 2 Claim Coverage:
- Gate 3 Equation Ledger:
- Gate 4 Figure/Table:
- Gate 5 Section Flow:
- Gate 6 Toggle:
- Gate 7 KO/EN/UI:

## Browser Check
- URL:
- KO/EN:
- Math:
- Image size:
- Toggle:
- Bookmark:

## Residual Risk
- 
```
