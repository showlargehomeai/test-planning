# 戰情室重構策略 — McKinsey Framework

## Executive Summary

LargeHome 戰情室從「僅有用戶成長監控」升級為「全方位公司經營儀表板」，涵蓋公司目標、團隊管理、業務進度、BI 分析四大支柱。

---

## 1. 問題定義（Issue Tree）

**核心問題：** 現有戰情室只有用戶成長圖表，無法回答「公司是否在正確軌道上」

**MECE 拆解：**

```
戰情室應該回答什麼？
├── 1. 公司層級：我們的北極星指標是什麼？離目標多遠？
├── 2. 團隊層級：每個團隊在做什麼？進度如何？
├── 3. 業務層級：BD/廠商 Onboarding 進度如何？
└── 4. 數據層級：用戶行為、流量、轉換告訴我們什麼？
```

---

## 2. 戰情室架構（Pyramid Structure）

### 2.1 頂層 — 公司目標儀表板 (Company OKR)
- 北極星指標（NSM）：平台活躍廠商數 × 月均交易量
- 季度 OKR 進度追蹤
- 關鍵里程碑時間軸

### 2.2 第二層 — 團隊目標與進度 (Team Tracker)
- 各團隊 OKR 對齊公司目標
- Sprint/週進度看板
- 阻礙與風險標記

### 2.3 第三層 — BD 廠商 Onboarding (BD Pipeline)
- 廠商生命週期看板（待引導 → 熟悉中 → 已上架 → 活躍）
- BD 績效排行
- 廠商健康度評分

### 2.4 第四層 — BI 數據分析 (Analytics)
- 用戶成長（現有，優化）
- 流量分析（來源、頁面、跳出率）
- 留存分析（Day1 / Day7 / Day30）
- 廠商活躍度分析
- 轉換漏斗

---

## 3. 可用 BI 分析清單

根據現有 PostgreSQL `users` 表 + 可擴展的資料：

| BI 模組 | 資料來源 | 難度 | 優先級 |
|---------|---------|------|--------|
| 用戶成長趨勢 | users.created_at | ✅ 已有 | P0 |
| DAU/WAU/MAU | users.last_login_at | ✅ 已有 | P0 |
| 用戶留存率 | users.created_at + last_login_at | 🟡 可算 | P1 |
| 新用戶來源分析 | 需加 utm/referrer 欄位 | 🔴 需開發 | P1 |
| 廠商 Onboarding 進度 | 需新表 vendors + bd_tasks | 🔴 需開發 | P1 |
| BD 績效報表 | 需新表 bd_activities | 🔴 需開發 | P2 |
| 頁面流量熱圖 | 需整合 GA / 自建 tracking | 🔴 需開發 | P2 |
| 轉換漏斗 | 需定義事件 + events 表 | 🔴 需開發 | P2 |
| 廠商活躍度評分 | vendors + products + services | 🔴 需開發 | P2 |
| 財務概覽 | 需 transactions 表 | 🔴 需開發 | P3 |

---

## 4. UI/UX 設計方向

### 設計原則（ui-ux-pro-max）
- **Dashboard-first**: 進入即看到全局，不需要點擊
- **Progressive disclosure**: 概覽 → 點擊展開細節
- **Status-at-a-glance**: 紅黃綠燈系統，一秒看出問題
- **Dark/Light**: 戰情室感，深色主題可選

### 佈局
```
┌─────────────────────────────────────────────┐
│  Company OKR Bar（橫幅：NSM + 3 個核心 KPI）  │
├──────────┬──────────┬───────────────────────┤
│ 團隊進度  │ BD Pipeline│  用戶成長（圖表）     │
│ (卡片列)  │ (看板)     │                      │
├──────────┴──────────┴───────────────────────┤
│  BI Analytics Row（留存/流量/轉換 小圖表）     │
└─────────────────────────────────────────────┘
```

---

## 5. 技術架構（nextjs-expert）

### 路由結構
```
app/dashboard/
├── page.tsx              # 主戰情室（Server Component 彙整）
├── layout.tsx            # Dashboard layout with sidebar
├── loading.tsx           # Skeleton loading
├── error.tsx             # Error boundary
├── _components/
│   ├── CompanyOKR.tsx    # 公司目標橫幅
│   ├── TeamTracker.tsx   # 團隊進度卡片
│   ├── BDPipeline.tsx    # BD 廠商看板
│   ├── UserGrowth.tsx    # 用戶成長圖表 (Client)
│   ├── RetentionChart.tsx # 留存分析 (Client)
│   ├── TrafficSource.tsx # 流量來源 (Client)
│   └── KPICard.tsx       # 通用 KPI 卡片
├── team/page.tsx         # 團隊詳情子頁
├── bd/page.tsx           # BD 管理子頁
└── analytics/page.tsx    # 完整 BI 分析子頁
```

### API Routes
```
app/api/dashboard/
├── route.ts              # 現有（優化）
├── okr/route.ts          # 公司 OKR 數據
├── team/route.ts         # 團隊進度數據
├── bd/route.ts           # BD pipeline 數據
├── retention/route.ts    # 留存分析
└── traffic/route.ts      # 流量分析
```

### 資料策略
- 短期（Phase 1）：OKR + 團隊目標用 JSON 檔（同 ideas 的 GitHub API 模式）
- 中期（Phase 2）：BD 數據用 PostgreSQL 新表
- 長期（Phase 3）：整合 GA4 API / 自建 event tracking
