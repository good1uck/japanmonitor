# Japan Monitor

> **言語 / Language / 语言 / 언어**: [English](README.md) | [中文](README.zh.md) | [日本語](README.ja.md) | [한국어](README.ko.md)

**リアルタイム日本情報ダッシュボード** — AI駆動のニュース集約、地域安全保障監視、日本とアジア太平洋地域に焦点を当てたインフラ追跡。

[![GitHub stars](https://img.shields.io/github/stars/good1uck/japanmonitor?style=social)](https://github.com/good1uck/japanmonitor/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/good1uck/japanmonitor?style=social)](https://github.com/good1uck/japanmonitor/network/members)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

---

## なぜJapan Monitorなのか？

| 問題 | 解決策 |
|---------|----------|
| 日本のニュースが複数のソースに分散 | 日本特化フィードを持つ**統一ダッシュボード** |
| 地域安全保障の文脈がない | 日本のホットスポットと地域緊張を示す**インタラクティブマップ** |
| 情報過多 | 日本の動向に関する**AI合成ブリーフ** |
| 地域脅威監視 | 尖閣諸島、北朝鮮、台湾海峡の**リアルタイム追跡** |
| 経済指標 | **日経225、JPY、日銀**監視とマーケットシグナル |

---

## 主な機能

### 日本特化インテリジェンス
- **10の主要ホットスポット** — 東京、沖縄、尖閣諸島、台湾海峡、北朝鮮、北方領土など
- **地域安全保障監視** — 日中関係、北朝鮮の脅威、台湾有事
- **防衛追跡** — 自衛隊、在日米軍、地域軍事活動
- **経済ダッシュボード** — 日経225、JPY/USD、日本銀行政策、東京証券取引所

### インタラクティブ地域マップ
- **日本中心のレイヤー** — 領土紛争、米軍基地、戦略的航路
- **スマートクラスタリング** — 地域イベントをインテリジェントにグループ化
- **地域プリセット** — 日本焦点、東アジア、インド太平洋ビュー
- **時間フィルタリング** — 1時間、6時間、24時間、48時間、7日間のイベントウィンドウ

### AI駆動分析
- **日本ブリーフ** — 主要な展開のLLM合成要約
- **脅威分類** — LLMオーバーライド付きの即時キーワード検出
- **地域収束** — ニュース、軍事活動、経済シグナルの相関
- **安定性指数** — 日本と地域安全保障のリアルタイム評価

### リアルタイムデータソース
- **日本メディア** — NHK World、ジャパンタイムズ、日経アジア、共同通信、朝日新聞
- **防衛と安全保障** — 自衛隊更新、在日米軍、地域軍事追跡
- **経済** — 日本銀行、日経225、JPY監視
- **地域** — 日中、日韓、台湾海峡、日露関係
- **災害監視** — 地震、津波、台風、福島更新

---

## 仕組み

### 脅威分類パイプライン

すべてのニュース項目は2段階の分類パイプラインを通過します：

1. **キーワード分類器**（即時）— 重大度レベル（クリティカル→高→中→低→情報）とカテゴリ（紛争、テロ、サイバー、災害など）で整理された約120の脅威キーワードに対してパターンマッチング。信頼度スコアで即座に返します。
2. **LLM分類器**（非同期）— 温度0でGroqのLlama 3.1 8Bを呼び出すVercel Edge関数を介してバックグラウンドで起動。結果はRedisにキャッシュされ（24時間TTL）、見出しハッシュでキー付けされます。LLM結果が到着すると、信頼度が高い場合にのみキーワード結果を上書きします。

このハイブリッドアプローチは、UIがAIを待つことでブロックされることがないことを意味します — ユーザーはキーワード結果を即座に見て、LLMリファインメントは数秒以内に到着し、すべての後続訪問者のために永続化されます。

### 国家不安定指数 (CII)

各監視国はリアルタイム不安定性スコア（0-100）を受け取ります。計算元：

| 構成要素 | 重み | 詳細 |
|-----------|--------|---------|
| **ベースラインリスク** | 40% | 構造的脆弱性を反映する国ごとの事前設定 |
| **騒乱イベント** | 20% | 民主主義国の抗議は対数的にスコア付け（定期的な抗議はトリガーしない）、権威主義国は線形にスコア付け（すべての抗議が重要）。死傷者とインターネット停止でブーストされます |
| **安全保障活動** | 20% | 軍用機（3ポイント）+ 艦船（5ポイント）自国軍から + 外国軍事プレゼンス（重み2倍）|
| **情報速度** | 20% | イベント重大度乗数で重み付けされたニュース言及頻度、高流量国にログスケール |

ホットスポット近接性、焦点の緊急性、紛争地域フロア（例：ウクライナは≥55に固定、シリアは≥50）に追加ブーストが適用されます。

---

## クイックスタート

```bash
# クローンして実行
git clone https://github.com/good1uck/japanmonitor.git
cd japanmonitor
npm install
npm run dev
```

[http://localhost:5173](http://localhost:5173)を開く

### 環境変数（オプション）

ダッシュボードはAPIキーなしで動作します — 未設定のサービスのパネルは単に表示されません。完全な機能を使用するには、サンプルファイルをコピーして必要なキーを入力してください：

```bash
cp .env.example .env.local
```

`.env.example`ファイルは、説明と登録リンクを含むすべての変数を文書化し、デプロイメントターゲット（Vercel vs Railway）ごとに整理されています。主要なグループ：

| グループ | 変数 | 無料枠 |
|-------|-----------|-----------|
| **AI** | `GROQ_API_KEY`, `OPENROUTER_API_KEY` | 14,400リクエスト/日（Groq）、50/日（OpenRouter）|
| **キャッシュ** | `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | 10Kコマンド/日 |
| **市場** | `FINNHUB_API_KEY`, `FRED_API_KEY`, `EIA_API_KEY` | すべて無料枠 |
| **追跡** | `WINGBITS_API_KEY`, `AISSTREAM_API_KEY` | 無料 |
| **地政学** | `ACLED_ACCESS_TOKEN`, `CLOUDFLARE_API_TOKEN`, `NASA_FIRMS_API_KEY` | 研究者向け無料 |
| **リレー** | `WS_RELAY_URL`, `VITE_WS_RELAY_URL`, `OPENSKY_CLIENT_ID/SECRET` | セルフホスト |

登録リンク付きの完全なリストについては、[`.env.example`](./.env.example)を参照してください。

---

## 技術スタック

| カテゴリ | 技術 |
|----------|--------------|
| **フロントエンド** | TypeScript, Vite, deck.gl (WebGL), MapLibre GL |
| **AI/ML** | Groq (Llama 3.1 8B), OpenRouter（フォールバック）, Transformers.js（ブラウザ側T5、NER、埋め込み）|
| **キャッシュ** | Redis (Upstash) — インメモリ + Redis + アップストリームを含む3層キャッシュ、クロスユーザーAI重複排除 |
| **地政学API** | OpenSky, GDELT, ACLED, UCDP, HAPI, USGS, NASA FIRMS, Polymarket, Cloudflare Radar |
| **市場API** | Yahoo Finance（株式、外国為替、暗号）, CoinGecko（ステーブルコイン）, mempool.space（BTCハッシュレート）, alternative.me（恐怖と貪欲）|
| **経済API** | FRED（連邦準備）, EIA（エネルギー）, Finnhub（株価）|
| **デプロイメント** | Vercel Edge Functions（45+エンドポイント）+ Railway（WebSocketリレー）|
| **データ** | 100+ RSSフィード、ADS-Bトランスポンダー、AIS海事データ、VIIRS衛星画像 |

---

## ドキュメント

アルゴリズム、データソース、システムアーキテクチャを含む完全なドキュメント：

**[docs/DOCUMENTATION.md](./docs/DOCUMENTATION.md)**

主要セクション：
- [シグナルインテリジェンス](./docs/DOCUMENTATION.md#signal-intelligence)
- [国家不安定指数](./docs/DOCUMENTATION.md#country-instability-index-cii)
- [軍事追跡](./docs/DOCUMENTATION.md#military-tracking)
- [インフラ分析](./docs/DOCUMENTATION.md#infrastructure-cascade-analysis)
- [API依存関係](./docs/DOCUMENTATION.md#api-dependencies)

---

## デプロイメント

### Vercel（推奨）

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fgood1uck%2Fjapanmonitor)

1. 上のボタンをクリック
2. 環境変数を設定（オプション — `.env.example`を参照）
3. デプロイ完了

### ローカル開発

```bash
npm install
npm run dev
```

### Railway（WebSocketリレー）

リアルタイムWebSocket機能（AIS、軍事追跡）を使用する場合は、リレーサーバーをデプロイしてください：

```bash
cd scripts
railway up
```

---

## ライセンス

MIT License - 詳細は[LICENSE](LICENSE)を参照

---

## 貢献

貢献を歓迎します！問題やプルリクエストをお気軽に提出してください。

---

## 謝辞

[WorldMonitor](https://github.com/koala73/worldmonitor)をベースに構築され、日本情報とアジア太平洋地域の安全保障監視に特化しています。

---

**免責事項**：このプロジェクトは教育および研究目的のみです。すべてのデータは公開されているソースから取得されています。
