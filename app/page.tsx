"use client";

import Link from "next/link";

const sections = [
  {
    title: "總覽與數據",
    desc: "平台即時數據、戰略審計、BD 績效",
    accent: "bg-indigo-500",
    items: [
      { name: "戰情室", href: "/dashboard", desc: "即時數據儀表板" },
      { name: "BD 績效", href: "/dashboard/bd", desc: "業務開發追蹤" },
      { name: "數據分析", href: "/dashboard/analytics", desc: "深度洞察" },
      { name: "戰略審計", href: "/dashboard/audit", desc: "CTO 審計報告" },
    ],
  },
  {
    title: "設計師平台",
    desc: "全流程工作加速器",
    accent: "bg-violet-500",
    items: [
      { name: "工作台", href: "/designer", desc: "個人儀表板" },
      { name: "業主媒合", href: "/designer/matching", desc: "智慧推薦" },
      { name: "客戶 CRM", href: "/designer/crm", desc: "關係管理" },
      { name: "專案追蹤", href: "/designer/projects", desc: "看板管理" },
      { name: "AI 渲染", href: "/designer/rendering", desc: "出圖工具" },
      { name: "智慧報價", href: "/designer/quotation", desc: "自動計算" },
      { name: "建材資料庫", href: "/designer/materials", desc: "搜尋比價" },
      { name: "工程看板", href: "/designer/kanban", desc: "施工進度" },
      { name: "RFQ 詢價", href: "/designer/rfq", desc: "發包比價" },
      { name: "作品集", href: "/designer/portfolio", desc: "展示作品" },
      { name: "合約簽章", href: "/designer/contracts", desc: "電子合約" },
      { name: "諮詢預約", href: "/designer/booking", desc: "預約管理" },
      { name: "收支分析", href: "/designer/finance", desc: "財務報表" },
      { name: "評價口碑", href: "/designer/reviews", desc: "客戶評價" },
    ],
  },
  {
    title: "建材商平台",
    desc: "產品管理、訂單、報價",
    accent: "bg-emerald-500",
    items: [
      { name: "工作台", href: "/supplier", desc: "營運儀表板" },
      { name: "產品目錄", href: "/supplier/catalog", desc: "分類庫存" },
      { name: "訂單追蹤", href: "/supplier/orders", desc: "出貨管理" },
      { name: "報價管理", href: "/supplier/quotes", desc: "報價追蹤" },
    ],
  },
  {
    title: "工班平台",
    desc: "排程、紀錄、班底",
    accent: "bg-amber-500",
    items: [
      { name: "工作台", href: "/contractor", desc: "工程概覽" },
      { name: "排程日曆", href: "/contractor/schedule", desc: "施工排程" },
      { name: "施工紀錄", href: "/contractor/records", desc: "進度回報" },
      { name: "班底管理", href: "/contractor/team", desc: "師傅名冊" },
      { name: "請款管理", href: "/contractor/billing", desc: "工程請款" },
    ],
  },
  {
    title: "商業策略",
    desc: "BD 規劃、計畫、Demo",
    accent: "bg-rose-500",
    items: [
      { name: "BD 整體策略", href: "/bd-strategy", desc: "2026 發展方針" },
      { name: "200BD 計畫", href: "/bd-strategy/200bd", desc: "全台擴張" },
      { name: "商業計畫", href: "/plan", desc: "完整計畫書" },
      { name: "產品 Demo", href: "/demo", desc: "產品展示" },
    ],
  },
  {
    title: "協作與記錄",
    desc: "協作、日誌、提案",
    accent: "bg-sky-500",
    items: [
      { name: "協作中心", href: "/collaboration", desc: "三方空間" },
      { name: "更新日誌", href: "/changelog", desc: "版本紀錄" },
      { name: "點子牆", href: "/ideas", desc: "功能提案" },
    ],
  },
];

const totalPages = sections.reduce((s, g) => s + g.items.length, 0);

export default function HomePage() {
  return (
    <div className="min-h-full">
      {/* Header area */}
      <div className="px-6 sm:px-8 lg:px-10 pt-8 pb-6 border-b border-slate-200/60 bg-white">
        <div className="max-w-6xl">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">管理中心</h1>
          <p className="text-sm text-slate-500 mt-1">
            室內設計產業 AI 平台 — {totalPages} 個功能模組，連結設計師 × 工班 × 建材商
          </p>
          {/* Quick stats */}
          <div className="flex flex-wrap gap-6 mt-5">
            {[
              { label: "功能頁面", value: totalPages, color: "text-blue-600" },
              { label: "角色平台", value: 3, color: "text-blue-600" },
              { label: "功能模組", value: sections.length, color: "text-blue-600" },
            ].map((s) => (
              <div key={s.label} className="flex items-baseline gap-2">
                <span className={`text-2xl font-bold ${s.color}`}>{s.value}</span>
                <span className="text-sm text-slate-400">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 sm:px-8 lg:px-10 py-8 max-w-6xl space-y-10">
        {sections.map((section) => (
          <div key={section.title}>
            <div className="flex items-center gap-2.5 mb-4">
              <div className={`w-1 h-5 rounded-full ${section.accent}`} />
              <div>
                <h2 className="text-[15px] font-semibold text-slate-800">{section.title}</h2>
                <p className="text-[12px] text-slate-400">{section.desc}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5">
              {section.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group bg-white rounded-lg border border-slate-200/80 px-4 py-3.5 hover:shadow-sm hover:border-slate-300 transition-all"
                >
                  <h3 className="text-[13px] font-semibold text-slate-700 group-hover:text-indigo-600 transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">{item.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
