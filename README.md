# OW-TIER · 오버워치 여캐 이상형 월드컵

Cloudflare **Workers Static Assets + Hono API + D1** 기반의 오버워치 기본 여성 영웅(27명) 이상형 월드컵 웹 앱입니다.

## 주요 기능 (MVP)
- **기본 여성 영웅 27명 아트워크** 기반 1:1 이상형 월드컵 (8강 / 16강 / 올스타 전원 출전 + 부전승 자동 배치)
- 역할군 필터(전체·돌격·공격·지원) 및 옴닉 영웅(오리사·에코) 포함 토글
- 키보드 단축키(`←`/`→` 또는 `1`/`2`), 이전 선택 되돌리기(`Z`), 다음 매치 아트워크 프리로딩
- **Cloudflare D1 실시간 랭킹**: 누적 우승 비율, 1:1 매치 승률, 역할군 필터·검색
- **결과 공유**: 우승 결과 카드 PNG 이미지 저장(Canvas) 및 `?winner=...` 공유 링크 복사

## 로컬 실행 방법

```bash
cd ow-tier

# 1. 의존성 설치
npm install

# 2. 공식 아트워크 로컬 동기화 (이미 public/images/heroes/에 포함되어 있음)
npm run sync:artwork

# 3. 로컬 D1 마이그레이션 및 영웅 시드 적용
npm run db:migrate:local

# 4. 개발 서버 실행 (Vite + Cloudflare Worker + 로컬 D1)
npm run dev
```

## Cloudflare 프로덕션 배포

```bash
# 1. Cloudflare 로그인
npx wrangler login

# 2. 프로덕션 D1 데이터베이스 생성
npx wrangler d1 create ow-tier-db
```

생성된 `database_id`를 `wrangler.jsonc`의 `d1_databases[0].database_id`에 입력한 뒤 아래 명령을 실행합니다.

```bash
# 3. 프로덕션 HMAC 서명 시크릿 설정 (권장)
npx wrangler secret put SIGNING_SECRET

# 4. 원격 D1 마이그레이션 & 영웅 시드 적용
npm run db:migrate:remote

# 5. 빌드 및 Cloudflare Workers 배포
npm run deploy
```

## 테스트

```bash
npm test
npm run build
```
