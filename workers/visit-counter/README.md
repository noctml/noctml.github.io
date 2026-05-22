# Visit Counter Worker

GitHub Pages처럼 정적 호스팅되는 메인 페이지에서 `오늘 / 어제` 방문자수를 보여주기 위한 Cloudflare Worker입니다.

## 동작 방식

- `POST /visit`: Asia/Seoul 기준 오늘 방문자를 기록하고 `today`, `yesterday`를 반환합니다.
- `GET /stats`: 카운트 증가 없이 `today`, `yesterday`만 반환합니다.
- IP, User-Agent, Accept-Language는 원문 저장하지 않고 날짜별 hash로만 저장합니다.
- 같은 브라우저/환경의 사용자는 하루에 한 번만 카운트됩니다.

## Cloudflare 설정

```bash
cd workers/visit-counter
npx wrangler login
```

```bash
npx wrangler d1 create wooseok_visit_counter
```

출력되는 `database_id`를 `wrangler.toml`의 `REPLACE_WITH_CLOUDFLARE_D1_DATABASE_ID`에 넣습니다.

```bash
npx wrangler d1 execute wooseok_visit_counter --remote --file=./schema.sql
npx wrangler secret put VISITOR_SALT
npx wrangler deploy
```

`VISITOR_SALT`에는 임의의 긴 문자열을 넣으면 됩니다.

## 메인 페이지 연결

배포 후 Worker URL이 예를 들어 아래처럼 나왔다면:

```text
https://wooseok-visit-counter.YOUR_SUBDOMAIN.workers.dev
```

메인 `index.html`의 `<meta name="visit-counter-endpoint" ...>`를 아래처럼 수정합니다.

```html
<meta name="visit-counter-endpoint" content="https://wooseok-visit-counter.YOUR_SUBDOMAIN.workers.dev" />
```

프론트엔드는 자동으로 `/visit`을 붙여 호출합니다.

## 운영 메모

- 실제 사이트 도메인이 정해지면 `wrangler.toml`의 `ALLOWED_ORIGINS`에 추가하세요.
- Cloudflare Worker 무료 플랜에서도 개인 블로그 방문자수 정도는 충분합니다.
- 더 엄격한 bot filtering이 필요해지면 `request.cf.botManagement` 또는 Turnstile을 추가할 수 있습니다.
