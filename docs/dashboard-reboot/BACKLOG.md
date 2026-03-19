# 戰情室重構 Backlog

## Phase 1 — 核心框架 + OKR（Sprint 1-2）

### TASK-001: Dashboard 佈局重構
- **描述**: 重構 dashboard/page.tsx，從單一頁面改為模組化 Server Component 架構
- **技能**: nextjs-expert + ui-ux-pro-max
- **交付物**:
  - dashboard/layout.tsx（專用 layout）
  - dashboard/loading.tsx（skeleton loading）
  - dashboard/error.tsx（error boundary）
  - dashboard/page.tsx（主頁彙整，Suspense 包裹各區塊）
  - 設計 tokens（color/spacing/typography for dashboard）
- **驗收**: 頁面載入有 skeleton，各區塊獨立 loading，錯誤不影響其他區塊

### TASK-002: Company OKR 橫幅元件
- **描述**: 頂部公司目標儀表，顯示北極星指標 + 3 個核心 KPI + 季度進度
- **技能**: ui-ux-pro-max（設計）+ nextjs-expert（實作）
- **交付物**:
  - _components/CompanyOKR.tsx
  - _components/KPICard.tsx（通用 KPI 卡片，支援趨勢箭頭、進度條）
  - content/dashboard/okr.json（OKR 資料，GitHub API 可編輯）
  - api/dashboard/okr/route.ts
- **驗收**: 顯示 OKR 進度百分比，紅黃綠狀態燈，可透過 JSON 更新目標

### TASK-003: 團隊目標與進度卡片
- **描述**: 各團隊（產品/工程/BD/行銷）的目標對齊與進度追蹤
- **技能**: ui-ux-pro-max + nextjs-expert
- **交付物**:
  - _components/TeamTracker.tsx
  - content/dashboard/teams.json
  - api/dashboard/team/route.ts
- **驗收**: 每個團隊一張卡片，顯示目標、進度、阻礙事項、負責人

---

## Phase 2 — BD Pipeline + 優化分析（Sprint 3-4）

### TASK-004: BD 廠商 Onboarding 看板
- **描述**: Kanban 風格看板，追蹤廠商生命週期
- **技能**: ui-ux-pro-max（UX flow）+ nextjs-expert
- **交付物**:
  - _components/BDPipeline.tsx（看板元件）
  - _components/VendorCard.tsx（廠商卡片：名稱、BD 負責人、狀態、天數）
  - content/dashboard/vendors.json（初期用 JSON）
  - api/dashboard/bd/route.ts
  - dashboard/bd/page.tsx（BD 管理詳細頁）
- **驗收**: 5 欄看板（待引導→熟悉中→已上架產品→已上架服務→完成），可拖拉，顯示各階段廠商數

### TASK-005: 用戶成長圖表升級
- **描述**: 優化現有圖表，新增留存分析、WAU/MAU
- **技能**: ui-ux-pro-max + nextjs-expert
- **交付物**:
  - _components/UserGrowth.tsx（重構，從 page.tsx 抽出）
  - _components/RetentionChart.tsx（留存率矩陣 / 曲線）
  - api/dashboard/retention/route.ts（D1/D7/D30 留存 SQL）
  - 新增 WAU/MAU KPI 卡片
- **驗收**: 留存率可視化，WAU/MAU 數值，時間範圍可切換（7d/30d/90d）

### TASK-006: BD 績效報表
- **描述**: 每位 BD 的廠商管理績效面板
- **技能**: ui-ux-pro-max + nextjs-expert
- **交付物**:
  - _components/BDScorecard.tsx
  - BD 排行榜（完成廠商數、平均 onboarding 天數、延遲率）
- **驗收**: 可看到每位 BD 的績效概覽

---

## Phase 3 — 進階 BI（Sprint 5+）

### TASK-007: 流量來源分析
- **描述**: 用戶從哪裡來（直接/搜尋/社群/推薦）
- **技能**: ui-ux-pro-max + nextjs-expert
- **交付物**:
  - _components/TrafficSource.tsx（圓餅圖 + 表格）
  - 整合 GA4 API 或自建 UTM tracking
- **驗收**: 可看到各來源的用戶佔比和趨勢

### TASK-008: 轉換漏斗
- **描述**: 訪客 → 註冊 → 首次使用 → 活躍用戶 的轉換率
- **技能**: ui-ux-pro-max + nextjs-expert
- **交付物**:
  - _components/ConversionFunnel.tsx（漏斗圖）
  - 需定義 event tracking schema
- **驗收**: 可視化漏斗，顯示各步驟流失率

### TASK-009: 廠商活躍度評分
- **描述**: 為每個廠商計算健康度分數（產品數、更新頻率、回應率）
- **技能**: ui-ux-pro-max + nextjs-expert
- **交付物**:
  - _components/VendorHealth.tsx
  - 評分演算法 + 熱圖
- **驗收**: 廠商列表有活躍度分數，可排序篩選

---

## 任務分派策略

所有任務由 coding agent 執行，強制使用：
1. **nextjs-expert** — App Router、Server Components、TypeScript 規範
2. **ui-ux-pro-max** — 設計系統 tokens、UX flow、無障礙標準

### 執行順序
TASK-001 → TASK-002 + TASK-003（可並行）→ TASK-004 → TASK-005 + TASK-006（可並行）→ Phase 3
