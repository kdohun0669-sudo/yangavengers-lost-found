# 양벤져스 분실물 센터

교내 분실물을 쉽게 신고하고 찾을 수 있는 MVP 웹사이트입니다.

## 로컬 실행

```bash
npm install
npm run db:setup
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 을 엽니다.

## 테스트 계정

| 역할 | 학번 | 비밀번호 |
|------|------|----------|
| 학생회 관리자 | `10101` | `admin1234` |
| 일반 학생 (데모) | `10215` | `test1234` |

## Vercel + Turso 배포

### 1. Turso DB 만들기

1. [https://turso.tech](https://turso.tech) → GitHub 로그인
2. **Create Database** → 이름 예: `yangavengers-lost-found`
3. Region: **Tokyo (nrt)** 권장
4. DB 클릭 → **Database URL** 복사 (`libsql://...`)
5. **Create Token** → Auth Token 복사

### 2. Vercel 환경 변수 설정

Vercel 프로젝트 → **Settings → Environment Variables**:

| Name | Value |
|------|-------|
| `TURSO_DATABASE_URL` | `libsql://xxx.turso.io` |
| `TURSO_AUTH_TOKEN` | Turso 토큰 |
| `AUTH_SECRET` | 아무 긴 랜덤 문자열 |

### 3. Turso에 테이블 + 시드 데이터 넣기

로컬 `.env`에 Turso 값을 추가한 뒤:

```bash
npm run db:seed:turso
```

### 4. GitHub push → Vercel 자동 재배포

```bash
git add .
git commit -m "Add Turso database support"
git push
```

## 주요 기능

- 학번(5자리) + 비밀번호 가입/로그인
- 분실 / 습득 등록 (사진 선택, 4가지 분류)
- 검색 · 필터 · 상세 보기
- 매칭 요청 → 학생회 카카오톡 중개
- 학생회 관리자: 상태 변경, 숨김, 작성자/요청자 카톡 ID 확인
- 완료 후 7일 뒤 일반 목록에서 비공개

## 기술 스택

- Next.js 15 (App Router)
- Tailwind CSS 4
- Prisma + SQLite (로컬) / Turso (배포)
- JWT 세션 쿠키

## 학번 형식

5자리 숫자 = 학년(1) + 반(2) + 번호(2)  
예: `10215` → 1학년 2반 15번
