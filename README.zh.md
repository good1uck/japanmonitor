# Japan Monitor

> **语言 / Language / 言語 / 언어**: [English](README.md) | [中文](README.zh.md) | [日本語](README.ja.md) | [한국어](README.ko.md)

**实时日本情报仪表板** — AI驱动的新闻聚合、区域安全监控和基础设施跟踪，专注于日本和亚太地区。

[![GitHub stars](https://img.shields.io/github/stars/good1uck/japanmonitor?style=social)](https://github.com/good1uck/japanmonitor/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/good1uck/japanmonitor?style=social)](https://github.com/good1uck/japanmonitor/network/members)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

---

## 为什么选择 Japan Monitor?

| 问题 | 解决方案 |
|---------|----------|
| 日本新闻分散在各个来源 | **统一的单一仪表板**，聚合日本焦点新闻源 |
| 缺乏区域安全背景 | **交互式地图**展示日本热点和区域紧张局势 |
| 信息过载 | **AI合成简报**聚焦日本发展动态 |
| 区域威胁监控 | **实时跟踪**尖阁诸岛、朝鲜、台湾海峡 |
| 经济指标 | **日经225、日元、日本银行**监控和市场信号 |

---

## 核心功能

### 日本专注情报
- **10个关键热点** — 东京、冲绳、尖阁诸岛、台湾海峡、朝鲜、北方领土等
- **区域安全监控** — 中日关系、朝鲜威胁、台湾局势
- **防务跟踪** — 自卫队、驻日美军、区域军事活动
- **经济仪表板** — 日经225、日元/美元、日本银行政策、东京证券交易所

### 交互式区域地图
- **以日本为中心的图层** — 领土争端、美军基地、战略水道
- **智能聚类** — 区域事件智能分组
- **区域预设** — 日本焦点、东亚、印太视图
- **时间过滤** — 1小时、6小时、24小时、48小时、7天事件窗口

### AI驱动分析
- **日本简报** — LLM合成的关键发展摘要
- **威胁分类** — 即时关键词检测与LLM覆盖
- **区域汇聚** — 关联新闻、军事活动和经济信号
- **稳定性指数** — 日本和区域安全的实时评估

### 实时数据源
- **日本媒体** — NHK World、日本时报、日经亚洲、共同社、朝日新闻
- **防务与安全** — 自卫队更新、驻日美军、区域军事跟踪
- **经济** — 日本银行、日经225、日元监控
- **区域** — 中日、韩日、台湾海峡、俄日关系
- **灾害监控** — 地震、海啸、台风、福岛更新

---

## 工作原理

### 威胁分类流程

每条新闻项目都经过两阶段分类流程：

1. **关键词分类器**（即时）— 对约120个威胁关键词进行模式匹配，按严重性等级（关键→高→中→低→信息）和类别（冲突、恐怖主义、网络、灾害等）组织。立即返回置信度分数。
2. **LLM分类器**（异步）— 通过Vercel Edge函数在后台调用Groq的Llama 3.1 8B，温度为0。结果缓存在Redis中（24小时TTL），按标题哈希键控。当LLM结果到达时，仅在其置信度更高时才覆盖关键词结果。

这种混合方法意味着UI永远不会因等待AI而阻塞 — 用户立即看到关键词结果，LLM优化在几秒钟内到达并为所有后续访问者持久化。

### 国家不稳定指数 (CII)

每个监控国家都会收到实时不稳定性评分（0-100），计算自：

| 组成部分 | 权重 | 详细信息 |
|-----------|--------|---------|
| **基线风险** | 40% | 每个国家预配置，反映结构性脆弱性 |
| **骚乱事件** | 20% | 民主国家的抗议活动按对数评分（常规抗议不触发），威权国家按线性评分（每次抗议都很重要）。伤亡和网络中断会提升评分 |
| **安全活动** | 20% | 军事飞行（3分）+ 船只（5分）来自自己的部队 + 外国军事存在（权重加倍）|
| **信息速度** | 20% | 新闻提及频率按事件严重性乘数加权，针对高流量国家进行对数缩放 |

对于热点邻近性、焦点紧急性和冲突区域底线（例如，乌克兰固定在≥55，叙利亚在≥50），适用额外提升。

---

## 快速开始

```bash
# 克隆并运行
git clone https://github.com/good1uck/japanmonitor.git
cd japanmonitor
npm install
npm run dev
```

打开 [http://localhost:5173](http://localhost:5173)

### 环境变量（可选）

仪表板在没有任何API密钥的情况下也能工作 — 未配置服务的面板将不会出现。要获得完整功能，请复制示例文件并填写您需要的密钥：

```bash
cp .env.example .env.local
```

`.env.example` 文件记录了每个变量，包含描述和注册链接，按部署目标（Vercel vs Railway）组织。关键组：

| 组 | 变量 | 免费层 |
|-------|-----------|-----------|
| **AI** | `GROQ_API_KEY`, `OPENROUTER_API_KEY` | 14,400 请求/天（Groq），50/天（OpenRouter）|
| **缓存** | `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | 10K 命令/天 |
| **市场** | `FINNHUB_API_KEY`, `FRED_API_KEY`, `EIA_API_KEY` | 所有免费层 |
| **跟踪** | `WINGBITS_API_KEY`, `AISSTREAM_API_KEY` | 免费 |
| **地缘政治** | `ACLED_ACCESS_TOKEN`, `CLOUDFLARE_API_TOKEN`, `NASA_FIRMS_API_KEY` | 研究人员免费 |
| **中继** | `WS_RELAY_URL`, `VITE_WS_RELAY_URL`, `OPENSKY_CLIENT_ID/SECRET` | 自托管 |

完整列表和注册链接请参见 [`.env.example`](./.env.example)。

---

## 技术栈

| 类别 | 技术 |
|----------|--------------|
| **前端** | TypeScript, Vite, deck.gl (WebGL), MapLibre GL |
| **AI/ML** | Groq (Llama 3.1 8B), OpenRouter（后备）, Transformers.js（浏览器端T5、NER、嵌入）|
| **缓存** | Redis (Upstash) — 三层缓存，包含内存 + Redis + 上游，跨用户AI去重 |
| **地缘政治API** | OpenSky, GDELT, ACLED, UCDP, HAPI, USGS, NASA FIRMS, Polymarket, Cloudflare Radar |
| **市场API** | Yahoo Finance（股票、外汇、加密货币）, CoinGecko（稳定币）, mempool.space（BTC哈希率）, alternative.me（恐惧与贪婪）|
| **经济API** | FRED（美联储）, EIA（能源）, Finnhub（股票报价）|
| **部署** | Vercel Edge Functions（45+端点）+ Railway（WebSocket中继）|
| **数据** | 100+ RSS源、ADS-B应答器、AIS海事数据、VIIRS卫星图像 |

---

## 文档

完整文档包括算法、数据源和系统架构：

**[docs/DOCUMENTATION.md](./docs/DOCUMENTATION.md)**

主要章节：
- [信号情报](./docs/DOCUMENTATION.md#signal-intelligence)
- [国家不稳定指数](./docs/DOCUMENTATION.md#country-instability-index-cii)
- [军事跟踪](./docs/DOCUMENTATION.md#military-tracking)
- [基础设施分析](./docs/DOCUMENTATION.md#infrastructure-cascade-analysis)
- [API依赖](./docs/DOCUMENTATION.md#api-dependencies)

---

## 部署

### Vercel（推荐）

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fgood1uck%2Fjapanmonitor)

1. 点击上面的按钮
2. 设置环境变量（可选 — 参见 `.env.example`）
3. 部署完成

### 本地开发

```bash
npm install
npm run dev
```

### Railway（WebSocket中继）

如果您使用实时WebSocket功能（AIS、军事跟踪），请部署中继服务器：

```bash
cd scripts
railway up
```

---

## 许可证

MIT License - 详见 [LICENSE](LICENSE)

---

## 贡献

欢迎贡献！请随时提交问题或拉取请求。

---

## 致谢

基于 [WorldMonitor](https://github.com/koala73/worldmonitor) 构建，专注于日本情报和亚太区域安全监控。

---

**免责声明**：此项目仅用于教育和研究目的。所有数据均来自公开可用来源。
