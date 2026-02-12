# Japan Monitor

> **언어 / Language / 语言 / 言語**: [English](README.md) | [中文](README.zh.md) | [日本語](README.ja.md) | [한국어](README.ko.md)

**실시간 일본 정보 대시보드** — AI 기반 뉴스 수집, 지역 안보 모니터링 및 일본과 아시아-태평양 지역에 초점을 맞춘 인프라 추적.

[![GitHub stars](https://img.shields.io/github/stars/good1uck/japanmonitor?style=social)](https://github.com/good1uck/japanmonitor/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/good1uck/japanmonitor?style=social)](https://github.com/good1uck/japanmonitor/network/members)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

---

## 왜 Japan Monitor인가?

| 문제 | 해결책 |
|---------|----------|
| 여러 출처에 흩어진 일본 뉴스 | 일본 중심 피드를 가진 **통합 단일 대시보드** |
| 지역 안보 맥락 부재 | 일본 핫스팟과 지역 긴장을 보여주는 **인터랙티브 맵** |
| 정보 과부하 | 일본 발전에 대한 **AI 합성 브리핑** |
| 지역 위협 모니터링 | 센카쿠, 북한, 대만 해협의 **실시간 추적** |
| 경제 지표 | **니케이 225, JPY, BOJ** 모니터링 및 시장 신호 |

---

## 주요 기능

### 일본 중심 정보
- **10개 주요 핫스팟** — 도쿄, 오키나와, 센카쿠 제도, 대만 해협, 북한, 북방 영토 등
- **지역 안보 모니터링** — 중일 관계, 북한 위협, 대만 상황
- **방위 추적** — 자위대, 주일미군, 지역 군사 활동
- **경제 대시보드** — 니케이 225, JPY/USD, 일본은행 정책, 도쿄 증권거래소

### 인터랙티브 지역 지도
- **일본 중심 레이어** — 영토 분쟁, 미군 기지, 전략적 수로
- **스마트 클러스터링** — 지역 이벤트를 지능적으로 그룹화
- **지역 프리셋** — 일본 중심, 동아시아, 인도-태평양 뷰
- **시간 필터링** — 1시간, 6시간, 24시간, 48시간, 7일 이벤트 윈도우

### AI 기반 분석
- **일본 브리핑** — 주요 발전 사항의 LLM 합성 요약
- **위협 분류** — LLM 재정의를 포함한 즉각적인 키워드 탐지
- **지역 수렴** — 뉴스, 군사 활동 및 경제 신호의 상관 관계
- **안정성 지수** — 일본 및 지역 안보의 실시간 평가

### 실시간 데이터 소스
- **일본 미디어** — NHK World, 재팬 타임스, 니케이 아시아, 교도 통신, 아사히 신문
- **방위 및 안보** — 자위대 업데이트, 주일미군, 지역 군사 추적
- **경제** — 일본은행, 니케이 225, JPY 모니터링
- **지역** — 중일, 한일, 대만 해협, 러일 관계
- **재해 모니터링** — 지진, 쓰나미, 태풍, 후쿠시마 업데이트

---

## 작동 원리

### 위협 분류 파이프라인

모든 뉴스 항목은 2단계 분류 파이프라인을 거칩니다:

1. **키워드 분류기**(즉시) — 심각도 등급(중요→높음→중간→낮음→정보)과 범주(갈등, 테러, 사이버, 재해 등)로 구성된 약 120개의 위협 키워드에 대해 패턴 매칭. 신뢰도 점수와 함께 즉시 반환합니다.
2. **LLM 분류기**(비동기) — 온도 0에서 Groq의 Llama 3.1 8B를 호출하는 Vercel Edge 함수를 통해 백그라운드에서 실행. 결과는 Redis에 캐시되며(24시간 TTL) 헤드라인 해시로 키가 지정됩니다. LLM 결과가 도착하면 신뢰도가 높을 때만 키워드 결과를 재정의합니다.

이 하이브리드 접근 방식은 UI가 AI를 기다리느라 차단되지 않음을 의미합니다 — 사용자는 키워드 결과를 즉시 보고 LLM 개선 사항이 몇 초 내에 도착하여 모든 후속 방문자를 위해 지속됩니다.

### 국가 불안정 지수 (CII)

각 모니터링 국가는 다음에서 계산된 실시간 불안정성 점수(0-100)를 받습니다:

| 구성 요소 | 가중치 | 세부 사항 |
|-----------|--------|---------|
| **기본 위험** | 40% | 구조적 취약성을 반영하는 국가별 사전 구성 |
| **소요 사태** | 20% | 민주주의 국가의 시위는 로그 척도로 점수화(일상적인 시위는 트리거하지 않음), 권위주의 국가는 선형으로 점수화(모든 시위가 중요함). 사상자 및 인터넷 차단으로 부스트됨 |
| **안보 활동** | 20% | 군용기(3포인트) + 선박(5포인트) 자국 군대로부터 + 외국 군사 존재(가중치 2배)|
| **정보 속도** | 20% | 이벤트 심각도 승수로 가중치가 부여된 뉴스 언급 빈도, 고유량 국가에 대해 로그 척도 |

핫스팟 근접성, 초점 긴급성 및 분쟁 지역 하한선(예: 우크라이나는 ≥55에 고정, 시리아는 ≥50)에 추가 부스트가 적용됩니다.

---

## 빠른 시작

```bash
# 클론 및 실행
git clone https://github.com/good1uck/japanmonitor.git
cd japanmonitor
npm install
npm run dev
```

[http://localhost:5173](http://localhost:5173) 열기

### 환경 변수(선택 사항)

대시보드는 API 키 없이도 작동합니다 — 구성되지 않은 서비스의 패널은 단순히 표시되지 않습니다. 전체 기능을 사용하려면 예제 파일을 복사하고 필요한 키를 입력하세요:

```bash
cp .env.example .env.local
```

`.env.example` 파일은 설명 및 등록 링크와 함께 모든 변수를 문서화하고 배포 대상(Vercel vs Railway)별로 구성됩니다. 주요 그룹:

| 그룹 | 변수 | 무료 티어 |
|-------|-----------|-----------|
| **AI** | `GROQ_API_KEY`, `OPENROUTER_API_KEY` | 14,400 요청/일(Groq), 50/일(OpenRouter) |
| **캐시** | `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | 10K 명령/일 |
| **시장** | `FINNHUB_API_KEY`, `FRED_API_KEY`, `EIA_API_KEY` | 모두 무료 티어 |
| **추적** | `WINGBITS_API_KEY`, `AISSTREAM_API_KEY` | 무료 |
| **지정학** | `ACLED_ACCESS_TOKEN`, `CLOUDFLARE_API_TOKEN`, `NASA_FIRMS_API_KEY` | 연구자용 무료 |
| **릴레이** | `WS_RELAY_URL`, `VITE_WS_RELAY_URL`, `OPENSKY_CLIENT_ID/SECRET` | 셀프 호스팅 |

등록 링크가 포함된 전체 목록은 [`.env.example`](./.env.example)을 참조하세요.

---

## 기술 스택

| 카테고리 | 기술 |
|----------|--------------|
| **프론트엔드** | TypeScript, Vite, deck.gl (WebGL), MapLibre GL |
| **AI/ML** | Groq (Llama 3.1 8B), OpenRouter(폴백), Transformers.js(브라우저 측 T5, NER, 임베딩) |
| **캐싱** | Redis (Upstash) — 메모리 + Redis + 업스트림을 포함한 3계층 캐시, 크로스 사용자 AI 중복 제거 |
| **지정학 API** | OpenSky, GDELT, ACLED, UCDP, HAPI, USGS, NASA FIRMS, Polymarket, Cloudflare Radar |
| **시장 API** | Yahoo Finance(주식, 외환, 암호화폐), CoinGecko(스테이블코인), mempool.space(BTC 해시레이트), alternative.me(공포와 탐욕) |
| **경제 API** | FRED(연방준비제도), EIA(에너지), Finnhub(주가) |
| **배포** | Vercel Edge Functions(45+ 엔드포인트) + Railway(WebSocket 릴레이) |
| **데이터** | 100+ RSS 피드, ADS-B 트랜스폰더, AIS 해사 데이터, VIIRS 위성 이미지 |

---

## 문서

알고리즘, 데이터 소스 및 시스템 아키텍처를 포함한 전체 문서:

**[docs/DOCUMENTATION.md](./docs/DOCUMENTATION.md)**

주요 섹션:
- [신호 정보](./docs/DOCUMENTATION.md#signal-intelligence)
- [국가 불안정 지수](./docs/DOCUMENTATION.md#country-instability-index-cii)
- [군사 추적](./docs/DOCUMENTATION.md#military-tracking)
- [인프라 분석](./docs/DOCUMENTATION.md#infrastructure-cascade-analysis)
- [API 종속성](./docs/DOCUMENTATION.md#api-dependencies)

---

## 배포

### Vercel(권장)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fgood1uck%2Fjapanmonitor)

1. 위의 버튼 클릭
2. 환경 변수 설정(선택 사항 — `.env.example` 참조)
3. 배포 완료

### 로컬 개발

```bash
npm install
npm run dev
```

### Railway(WebSocket 릴레이)

실시간 WebSocket 기능(AIS, 군사 추적)을 사용하는 경우 릴레이 서버를 배포하세요:

```bash
cd scripts
railway up
```

---

## 라이선스

MIT License - 자세한 내용은 [LICENSE](LICENSE) 참조

---

## 기여

기여를 환영합니다! 이슈 또는 풀 리퀘스트를 자유롭게 제출하세요.

---

## 감사의 말

[WorldMonitor](https://github.com/koala73/worldmonitor)를 기반으로 구축되었으며, 일본 정보 및 아시아-태평양 지역 안보 모니터링에 전문화되었습니다.

---

**면책 조항**: 이 프로젝트는 교육 및 연구 목적으로만 사용됩니다. 모든 데이터는 공개적으로 사용 가능한 소스에서 가져옵니다.
