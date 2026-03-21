"use client";

import Link from "next/link";

const sections = [
  {
    category: "總覽與數據",
    desc: "全平台即時數據、戰略審計、BD 績效追蹤",
    color: "from-indigo-500 to-blue-600",
    accent: "indigo",
    items: [
      { name: "戰情室", href: "/dashboard", icon: "📈", desc: "即時數據儀表板" },
      { name: "BD 績效", href: "/dashboard/bd", icon: "🎯", desc: "業務開發追蹤" },
      { name: "數據分析", href: "/dashboard/analytics", icon: "📊", desc: "深度數據洞察" },
      { name: "戰略審計", href: "/dashboard/audit", icon: "🔍", desc: "CTO 審計報告" },
    ],
  },
  {
    category: "設計師平台",
    desc: "設計師全流程工作加速器 — 接案、管理、出圖、報價",
    color: "from-violet-500 to-purple-600",
    accent: "violet",
    items: [
      { name: "工作台", href: "/designer", icon: "🏠", desc: "個人儀表板" },
      { name: "業主媒合", href: "/designer/matching", icon: "🎯", desc: "智慧推薦業主" },
      { name: "客戶 CRM", href: "/designer/crm", icon: "👥", desc: "客戶關係管理" },
      { name: "專案追蹤", href: "/designer/projects", icon: "📋", desc: "看板進度管理" },
      { name: "AI 渲染", href: "/designer/rendering", icon: "🎨", desc: "AI 出圖工具" },
      { name: "智慧報價", href: "/designer/quotation", icon: "💰", desc: "自動報價計算" },
      { name: "建材資料庫", href: "/designer/materials", icon: "🧱", desc: "建材搜尋比價" },
      { name: "工程看板", href: "/designer/kanban", icon: "📌", desc: "施工進度" },
      { name: "作品集", href: "/designer/portfolio", icon: "🖼️", desc: "作品展示" },
      { name: "合約簽章", href: "/designer/contracts", icon: "📝", desc: "電子合約" },
      { name: "諮詢預約", href: "/designer/booking", icon: "📅", desc: "預約管理" },
      { name: "收支分析", href: "/designer/finance", icon: "💳", desc: "財務報表" },
      { name: "評價口碑", href: "/designer/reviews", icon: "⭐", desc: "客戶評價" },
    ],
  },
  {
    category: "建材商平台",
    desc: "建材商產品管理、訂單追蹤、報價系統",
    color: "from-emerald-500 to-teal-600",
    accent: "emerald",
    items: [
      { name: "工作台", href: "/supplier", icon: "🏭", desc: "營運儀表板" },
      { name: "產品目錄", href: "/supplier/catalog", icon: "📦", desc: "產品分類庫存" },
      { name: "訂單追蹤", href: "/supplier/orders", icon: "🚚", desc: "出貨管理" },
      { name: "報價管理", href: "/supplier/quotes", icon: "💲", desc: "報價單追蹤" },
    ],
  },
  {
    category: "工班平台",
    desc: "工班排程、施工紀錄、班底管理",
    color: "from-amber-500 to-orange-600",
    accent: "amber",
    items: [
      { name: "工作台", href: "/contractor", icon: "🔨", desc: "工程概覽" },
      { name: "排程日曆", href: "/contractor/schedule", icon: "📅", desc: "施工排程" },
      { name: "施工紀錄", href: "/contractor/records", icon: "📸", desc: "進度回報" },
      { name: "班底管理", href: "/contractor/team", icon: "👷", desc: "師傅名冊" },
      { name: "請款管理", href: "/contractor/billing", icon: "💳", desc: "工程請款" },
    ],
  },
  {
    category: "商業策略",
    desc: "BD 發展規劃、商業計畫、產品展示",
    color: "from-rose-500 to-pink-600",
    accent: "rose",
    items: [
      { name: "BD 整體策略", href: "/bd-strategy", icon: "🚀", desc: "2026 發展方針" },
      { name: "200BD 計畫", href: "/bd-strategy/200bd", icon: "⚡", desc: "全台擴張作戰" },
      { name: "商業計畫", href: "/plan", icon: "📊", desc: "完整計畫書" },
      { name: "產品 Demo", href: "/demo", icon: "🎨", desc: "產品展示" },
    ],
  },
  {
    category: "協作與記錄",
    desc: "三方協作空間、更新日誌、功能提案",
    color: "from-sky-500 to-cyan-600",
    accent: "sky",
    items: [
      { name: "協作中心", href: "/collaboration", icon: "🤝", desc: "三方協作空間" },
      { name: "更新日誌", href: "/changelog", icon: "📝", desc: "版本紀錄" },
      { name: "點子牆", href: "/ideas", icon: "💡", desc: "功能提案" },
    ],
  },
];

const totalPages = sections.reduce((s, g) => s + g.items.length, 0);

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImEiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+PHBhdGggZD0iTTAgMGg2MHY2MEgweiIgZmlsbD0ibm9uZSIvPjxjaXJjbGUgY3g9IjMwIiBjeT0iMzAiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wOCkiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjYSkiLz48L3N2Zz4=')] opacity-40" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/15 backdrop-blur rounded-2xl flex items-center justify-center text-2xl">🏠</div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">LargeHome AI</h1>
              <p className="text-indigo-200 text-sm">室內設計產業全方位 AI 平台</p>
            </div>
          </div>
          <p className="text-indigo-100 text-base sm:text-lg max-w-xl mt-2 mb-8">
            連結設計師、工班、建材商 — 讓裝修產業裡的每個人，工作變快、賺更多
          </p>
          <div className="flex flex-wrap gap-3">
            {[
              { label: "功能頁面", value: totalPages },
              { label: "角色平台", value: 3 },
              { label: "功能模組", value: sections.length },
            ].map((s) => (
              <div key={s.label} className="bg-white/10 backdrop-blur-sm rounded-xl px-5 py-3 border border-white/10">
                <span className="text-2xl font-bold text-white">{s.value}</span>
                <span className="text-indigo-200 text-sm ml-2">{s.label}</span>
              </div>
            ))}
          </div>

          {/* Quick access */}
          <div className="flex flex-wrap gap-2 mt-8">
            {[
              { name: "戰情室", href: "/dashboard", icon: "📈" },
              { name: "BD 策略", href: "/bd-strategy", icon: "🚀" },
              { name: "設計師工具", href: "/designer", icon: "🛠️" },
            ].map((q) => (
              <Link
                key={q.href}
                href={q.href}
                className="bg-white/15 hover:bg-white/25 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm font-medium transition-all border border-white/10"
              >
                {q.icon} {q.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {sections.map((section) => (
          <div key={section.category}>
            <div className="flex items-start gap-3 mb-5">
              <div className={`h-10 w-1.5 rounded-full bg-gradient-to-b ${section.color} shrink-0 mt-0.5`} />
              <div>
                <h2 className="text-lg font-bold text-slate-800">{section.category}</h2>
                <p className="text-sm text-slate-400 mt-0.5">{section.desc}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {section.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group bg-white rounded-xl border border-slate-200/80 p-4 hover:shadow-md hover:border-slate-300 hover:-translate-y-0.5 transition-all duration-200"
                >
                  <span className="text-2xl block mb-2">{item.icon}</span>
                  <h3 className="text-sm font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{item.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200/60 bg-white/50 mt-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-xs text-slate-400">
          LargeHome AI © 2026 — 室內設計產業 AI 平台 · 連結設計師 × 工班 × 建材商
        </div>
      </footer>
    </div>
  );
}
