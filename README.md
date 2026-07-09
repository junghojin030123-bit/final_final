# 소상공인 AI 재고관리 대시보드

AI 뉴스 반영 실시간 수요예측 및 재고관리 대시보드 (Next.js 버전)

## 💰 비용 없이 체험하기 (데모 모드)

이 앱은 기본적으로 **데모 모드(ON)** 상태로 실행됩니다. 데모 모드에서는
Anthropic API를 전혀 호출하지 않고, 상품별로 미리 준비된 그럴듯한 분석
결과(조정률, 사유, 뉴스 요약)를 그대로 보여줍니다. 그래서:

- **API 키가 없어도** 바로 배포하고 시연할 수 있습니다.
- **비용이 전혀 발생하지 않습니다.**
- 발표·데모 목적이라면 이 모드만으로도 대시보드의 전체 기능(그래프, 백테스트,
  재무 임팩트, 승인/반려 워크플로 등)을 그대로 보여줄 수 있습니다.

실제 웹 검색 기반 AI 분석을 쓰고 싶다면, 우측 상단 배지 또는 설정(⚙️) 모달에서
**"실서비스 모드"**로 전환하면 됩니다. 이때부터는 `/api/forecast`를 통해 실제
Anthropic API가 호출되고 비용이 발생합니다 (아래 환경변수 설정 필요).

## 왜 구조가 이렇게 되어 있나요? (API 키 문제)

Claude.ai 아티팩트 환경에서는 API 키가 자동으로 처리되지만, 실제 웹사이트로
배포하면 브라우저가 `api.anthropic.com`을 직접 호출할 수 없고, 키를 브라우저에
두면 누구나 개발자도구로 훔쳐볼 수 있습니다.

그래서 이 프로젝트는 다음과 같은 구조를 사용합니다.

```
브라우저 → 우리 서버의 /api/forecast → Anthropic API
                   (여기서만 API 키 사용, 서버 환경변수로 관리)
```

- `components/Dashboard.jsx` : 화면(UI) 전체. 분석 버튼을 누르면 `/api/forecast`
  로만 요청을 보냅니다. Anthropic 주소나 키를 전혀 알지 못합니다.
- `app/api/forecast/route.js` : 서버에서만 실행되는 코드. 여기서
  `process.env.ANTHROPIC_API_KEY`를 읽어 Anthropic API를 대신 호출합니다.

이 방식 덕분에 API 키가 브라우저 소스코드나 네트워크 탭에 절대 노출되지 않습니다.

## 로컬에서 실행하기

```bash
npm install
cp .env.local.example .env.local
# .env.local 파일을 열어 ANTHROPIC_API_KEY=sk-ant-... 로 실제 키를 입력

npm run dev
# http://localhost:3000 접속
```

## Vercel로 배포하기 (무료, 가장 쉬운 방법)

### 🧪 데모 모드만 쓸 경우 — API 키 설정 없이 바로 배포 가능

기본값이 데모 모드(ON)이므로, **아래 3단계(API 키 등록)를 건너뛰어도 됩니다.**
발표·시연용으로는 이 방법이 가장 빠르고 간단합니다.

1. 이 폴더를 GitHub 저장소로 push 합니다.
   ```bash
   git init
   git add .
   git commit -m "소상공인 AI 재고관리 대시보드"
   git branch -M main
   git remote add origin <내 GitHub 저장소 URL>
   git push -u origin main
   ```
2. [vercel.com](https://vercel.com) 에 GitHub 계정으로 로그인 후 **New Project**
   → 방금 만든 저장소 선택 → Import.
3. **(선택)** 실제 웹 검색 기반 AI 분석까지 쓰고 싶다면 **Environment Variables**에
   다음을 추가합니다. 데모 모드만 쓸 거라면 이 단계는 건너뛰어도 됩니다.
   - Key: `ANTHROPIC_API_KEY`
   - Value: 실제 Anthropic API 키 (`sk-ant-...`)
4. **Deploy** 클릭 → 몇 분 뒤 `https://프로젝트명.vercel.app` 주소가 발급됩니다.
5. 이후 GitHub에 코드를 push할 때마다 Vercel이 자동으로 재배포합니다.

> API 키를 설정하지 않고 배포해도 사이트는 정상 작동합니다. 데모 모드에서는
> `/api/forecast`를 아예 호출하지 않기 때문입니다. 누군가 "실서비스 모드"로
> 전환해 분석을 시도하면, 서버가 "ANTHROPIC_API_KEY가 설정되어 있지 않습니다"라는
> 안내 메시지만 보여줄 뿐 사이트가 중단되지는 않습니다.
>
> API 키는 3단계에서 Vercel 대시보드에만 입력하면 되고, 코드 어디에도 직접
> 적지 않습니다. `.env.local`은 `.gitignore`에 포함되어 있어 실수로 GitHub에
> 올라가지 않습니다.

## PWA (홈 화면에 앱으로 설치)

이 프로젝트는 PWA(Progressive Web App)로 구성되어 있어, 배포 후 휴대폰이나 PC에서
"앱처럼" 설치할 수 있습니다.

- **Android / Chrome / Edge**: 사이트 접속 시 헤더의 **⬇️ 앱 설치** 버튼이 자동으로
  나타납니다. 클릭하면 홈 화면에 아이콘이 생기고, 이후 아이콘을 눌러 열면 주소창 없이
  독립된 앱처럼 실행됩니다.
- **iPhone / Safari**: iOS는 자동 설치 버튼(`beforeinstallprompt`)을 지원하지 않습니다.
  공유 버튼(⬆️) → **홈 화면에 추가**를 눌러 수동으로 설치해야 합니다. (앱 내 설정 모달에도
  동일 안내가 있습니다.)
- **PC(데스크톱)**: Chrome 주소창 오른쪽의 설치 아이콘을 눌러 데스크톱 앱처럼 설치할 수
  있습니다.

구성 파일:
- `public/manifest.json` — 앱 이름, 아이콘, 테마 색상 등 설치 메타데이터
- `public/sw.js` — 서비스 워커. 앱 화면(껍데기)을 캐싱해 오프라인에서도 열리게 하되,
  `/api/forecast`(뉴스 분석) 요청은 캐싱하지 않아 항상 최신 데이터를 받아옵니다.
- `public/icons/` — 192×192, 512×512, Apple Touch 아이콘

> ⚠️ PWA 설치 프롬프트는 **HTTPS 환경(Vercel 배포 주소)** 에서만 정상 동작합니다.
> `localhost`에서는 대부분의 브라우저가 예외로 허용해 개발 중에도 테스트할 수 있습니다.



```
webapp/
├─ app/
│  ├─ api/forecast/route.js   ← 백엔드 프록시 (API 키 서버 보관)
│  ├─ layout.jsx               ← PWA 메타데이터 + 서비스 워커 등록
│  ├─ page.jsx                ← Dashboard 컴포넌트 렌더링
│  └─ globals.css
├─ components/
│  └─ Dashboard.jsx           ← 대시보드 UI 전체 (앱 설치 버튼 포함)
├─ public/
│  ├─ manifest.json           ← PWA 설치 메타데이터
│  ├─ sw.js                   ← 서비스 워커 (오프라인 앱 셸)
│  └─ icons/                  ← 192/512/Apple 아이콘
├─ package.json
├─ tailwind.config.js
├─ postcss.config.mjs
├─ next.config.mjs
└─ .env.local.example
```

## 참고 사항

- Mock 판매 데이터는 `components/Dashboard.jsx` 상단 `PRODUCTS` 배열에 있습니다.
  실제 데이터로 교체하려면 이 배열의 형식(name, sku, inventory, unitCost, price,
  leadTime, keyword, sales)에 맞춰 값을 채우면 됩니다.
- 웹 검색 도구(`web_search_20250305`) 사용량에 따라 Anthropic API 과금이
  발생할 수 있습니다. 트래픽이 많아질 경우 `/api/forecast`에 요청 빈도 제한
  (rate limiting)을 추가하는 것을 권장합니다.
- 프로덕션에서는 `ANTHROPIC_API_KEY`를 절대 코드에 하드코딩하지 말고 항상
  환경변수로만 관리하세요.
