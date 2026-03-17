# Claude Planning System

## Project Overview
This is a planning management system for **TestPlanning** (測試用的計劃管理系統), operated through Claude Code conversations. You are the primary interface — detect user intent and take the appropriate action automatically.

**Team**: Bright

## Tech Stack
- Next.js 15 (App Router) + TypeScript
- Tailwind CSS v4
- Data stored as JSON/HTML files in `content/` directory
- Dashboard runs on `http://localhost:3000`

## Intent Detection

When the user sends a message, determine their intent from context and keywords. Act accordingly:

### 1. Product Demo Intent
**Triggers**: User wants to visualize a product, build a UI, show how something looks, create a prototype, mockup, landing page, app screen, or anything visual/interactive.
**Keywords**: demo, prototype, mockup, UI, 介面, 畫面, 展示, 頁面, landing page, show me, build, design, 做一個, 長什麼樣子

**Action**:
1. Read `content/demos/versions.json` to find the current latest version number
2. Calculate next version: if latest is `v001`, next is `v002`
3. Create directory `content/demos/vNNN/`
4. Generate self-contained HTML file(s) with these rules:
   - Use Tailwind CSS via CDN: `<script src="https://cdn.tailwindcss.com"></script>`
   - All CSS/JS must be inline or CDN-linked (no local dependencies)
   - Must be responsive (mobile-first)
   - Use modern, clean design with good typography
   - Include interactive elements where appropriate
   - If multi-page, create multiple HTML files with working navigation between them
   - The main entry point must be `index.html`
5. Update `content/demos/versions.json` — append new version entry
6. Git commit with message: `demo(vNNN): <brief description>`
7. Tell the user: "Demo vNNN created. View it at http://localhost:3000/demo"

### 2. Business Plan Intent
**Triggers**: User discusses business strategy, revenue, market analysis, competitors, pricing, go-to-market, pitch deck, investor presentation, financial projections.
**Keywords**: business plan, 商業計劃, pitch, strategy, revenue, 營收, market, 市場, competitor, 競爭, pricing, 定價, go-to-market, investor, 投資

**Action**:
1. Read `content/plans/versions.json` to find the current latest version number
2. Calculate next version number
3. Create directory `content/plans/vNNN/`
4. Generate a beautiful HTML business plan with these rules:
   - Use Tailwind CSS via CDN
   - Use Chart.js via CDN for charts/graphs: `<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>`
   - Include sections: Executive Summary, Problem, Solution, Market, Business Model, Financials, Team, Timeline
   - Use data visualization (charts, progress bars, metrics cards)
   - Professional, investor-ready design
   - Self-contained single `index.html`
5. Update `content/plans/versions.json`
6. Git commit with message: `plan(vNNN): <brief description>`
7. Tell the user: "Business Plan vNNN created. View it at http://localhost:3000/plan"

### 3. Idea Intent
**Triggers**: User has a spontaneous idea, feature request, random thought, brainstorm, or wants to record something for later.
**Keywords**: idea, 想到, 靈感, what if, 如果可以, 或許, maybe we could, feature, suggestion, 建議, brainstorm, 記一下, note

**Action**:
1. Read `content/ideas/ideas.json`
2. Create a new idea object:
   ```json
   {
     "id": "<generate UUID or use timestamp-based ID>",
     "title": "<concise title>",
     "description": "<detailed description>",
     "category": "<one of: product, business, tech, marketing, other>",
     "priority": "<one of: high, medium, low>",
     "tags": ["<relevant>", "<tags>"],
     "author": "<user name or 'Bright'>",
     "timestamp": "<ISO 8601 timestamp>",
     "status": "new"
   }
   ```
3. Append to the ideas array in `ideas.json`
4. Git commit with message: `idea: <title>`
5. Confirm: "Idea captured! View all ideas at http://localhost:3000/ideas"

### 4. Review / Status Intent
**Triggers**: User wants to see what's been done, check status, compare versions, or review changes.
**Keywords**: review, status, 狀態, what changed, 變了什麼, compare, diff, show me, dashboard, 看一下

**Action**:
- Describe current state: how many demo versions, plan versions, and ideas exist
- Mention the dashboard URL: `http://localhost:3000`
- If user asks about specific changes, read the relevant versions.json and describe diffs

### 5. Update Existing Content
**Triggers**: User wants to modify the latest demo or plan (not create new).
**Keywords**: update, modify, change, 改, 修改, 調整, add to, 加上

**Action**:
- Create a NEW version (never overwrite existing versions)
- Base it on the latest version's content but with the requested changes
- Follow the same versioning workflow as creating new

### 6. Import Existing HTML
**Triggers**: User provides an existing HTML file path and wants to use it as the base/first version.
**Keywords**: import, 匯入, 現有的, existing, base, 基礎, 我有一個 HTML, 這是我之前做的

**Action**:
1. Read the user-provided HTML file
2. Determine if it's a demo or a plan (ask if unclear)
3. Check `versions.json` — if empty, import as v001; if versions exist, import as the next version
4. Copy the HTML content to the appropriate `content/{type}/vNNN/index.html`
5. If the HTML references local assets (images, CSS), ask the user for those files too, and copy them into the same version directory
6. Update `versions.json` with description noting this was imported from an existing file
7. Git commit with message: `import(vNNN): imported existing HTML as base`
8. Tell the user the import is complete and which version it was assigned

## Version Management Protocol

### versions.json Format
```json
[
  {
    "version": "v001",
    "timestamp": "2026-03-13T10:00:00Z",
    "description": "Initial version description",
    "author": "Claude",
    "files": ["index.html"]
  }
]
```

### Rules
- Version numbers are zero-padded to 3 digits: v001, v002, ... v999
- NEVER overwrite an existing version — always create a new one
- ALWAYS update versions.json when creating a new version
- ALWAYS git commit after creating content

## HTML Generation Guidelines
- All generated HTML must be **self-contained** (no local file dependencies)
- Use CDN links for libraries:
  - Tailwind CSS: `https://cdn.tailwindcss.com`
  - Chart.js: `https://cdn.jsdelivr.net/npm/chart.js`
  - Font Awesome: `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css`
  - Google Fonts: `https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap`
- Default font: Inter
- Color palette: Use a consistent, modern palette. Suggest: slate/blue/indigo theme
- Always include `<meta name="viewport" content="width=device-width, initial-scale=1.0">`
- Always include `<meta charset="UTF-8">`

## Git Rules
- Commit after every content creation or modification
- Commit message format: `type(vNNN): description` for versioned content
- Commit message format: `idea: title` for ideas
- Commit message format: `dashboard: description` for dashboard changes
- Do NOT push automatically — let the user decide when to push

## 戰情室 (Dashboard)
- 路徑：`/dashboard`
- 功能：即時顯示 LargeHome 用戶成長數據
- 資料來源：PostgreSQL `users` 表（read-only 帳號 `dashboard_readonly`）
- 圖表：累計成長曲線、每日新增用戶、每日活躍用戶 (DAU)
- 自動更新：每 30 秒刷新一次
- 環境變數：資料庫連線設定在 `.env.local`，參考 `.env.example`

## 快速部署（其他電腦）
1. 解壓專案：`tar xzf test-planning.tar.gz && cd test-planning`
2. 執行 `bash setup.sh`（會自動安裝依賴、檢查環境）
3. `npm run dev` 啟動
4. `.env.local` 已包含完整資料庫連線設定（read-only 帳號），無需額外設定

## Development
- Run dashboard: `npm run dev` → http://localhost:3000
- The dashboard reads from `content/` directory at runtime
- After creating content, the dashboard auto-reflects changes (no restart needed for content, may need refresh)
