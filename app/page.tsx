"use client";

import Link from "next/link";
import { useState } from "react";

const sections = [
  {
    category: "🎯 產品展示",
    color: "from-indigo-500 to-blue-600",
    items: [
      { name: "產品 Demo", href: "/demo", icon: "🎨", desc: "LargeHome AI 產品展示頁面" },
      { name: "商業計畫", href: "/plan", icon: "📊", desc: "完整商業計畫書與市場分析" },
      { name: "更新日誌", href: "/changelog", icon: "📝", desc: "版本更新與功能變更紀錄" },
      { name: "點子牆", href: "/ideas", icon: "💡", desc: "功能需求與創意提案" },
    ],
  },
  {
    category: "🛠️ 設計師平台",
    color: "from-indigo-500 to-violet-600",
    items: [
      { name: "設計師工作台", href: "/designer", icon: "🏠", desc: "設計師個人儀表板與今日待辦" },
      { name: "業主媒合", href: "/designer/matching", icon: "🎯", desc: "智慧推薦最適合的業主" },
      { name: "客戶管理 CRM", href: "/designer/crm", icon: "👥", desc: "客戶列表、互動紀錄、標籤" },
      { name: "專案追蹤", href: "/designer/projects", icon: "📋", desc: "看板式專案進度管理" },
      { name: "作品集", href: "/designer/portfolio", icon: "🖼️", desc: "設計作品展示" },
      { name: "AI 渲染", href: "/designer/rendering", icon: "🎨", desc: "AI 出圖工具" },
      { name: "智慧報價", href: "/designer/quotation", icon: "💰", desc: "自動報價計算" },
      { name: "建材資料庫", href: "/designer/materials", icon: "🧱", desc: "建材搜尋與比價" },
      { name: "工程看板", href: "/designer/kanban", icon: "📌", desc: "施工進度看板" },
      { name: "合約簽章", href: "/designer/contracts", icon: "📝", desc: "電子合約管理" },
      { name: "諮詢預約", href: "/designer/booking", icon: "📅", desc: "預約管理系統" },
      { name: "收支分析", href: "/designer/finance", icon: "📊", desc: "財務報表與分析" },
      { name: "評價口碑", href: "/designer/reviews", icon: "⭐", desc: "客戶評價管理" },
    ],
  },
  {
    category: "🏭 建材商平台",
    color: "from-emerald-500 to-teal-600",
    items: [
      { name: "建材商工作台", href: "/supplier", icon: "🏭", desc: "建材商儀表板與營運數據" },
      { name: "產品目錄", href: "/supplier/catalog", icon: "📦", desc: "建材產品分類與庫存" },
      { name: "訂單追蹤", href: "/supplier/orders", icon: "🚚", desc: "訂單狀態與出貨管理" },
      { name: "報價管理", href: "/supplier/quotes", icon: "💲", desc: "報價單建立與追蹤" },
    ],
  },
  {
    category: "🔨 工班平台",
    color: "from-amber-500 to-orange-600",
    items: [
      { name: "工班工作台", href: "/contractor", icon: "🔨", desc: "工班儀表板與工程概覽" },
      { name: "排程日曆", href: "/contractor/schedule", icon: "📅", desc: "施工排程與日曆管理" },
      { name: "施工紀錄", href: "/contractor/records", icon: "📸", desc: "施工照片與進度回報" },
      { name: "班底管理", href: "/contractor/team", icon: "👷", desc: "師傅名冊與工種管理" },
      { name: "請款管理", href: "/contractor/billing", icon: "💳", desc: "工程請款與對帳" },
    ],
  },
  {
    category: "📑 策略文件",
    color: "from-rose-500 to-pink-600",
    items: [
      { name: "2026 BD 整體發展策略", href: "/bd-strategy", icon: "🚀", desc: "200BD 全台擴張 × BD 角色規劃綜合方案" },
      { name: "200BD 全台擴張計畫 v2", href: "/bd-strategy/200bd", icon: "⚡", desc: "12 個月 25→400 人閃電擴張作戰計畫" },
    ],
  },
  {
    category: "🤝 協作與管理",
    color: "from-violet-500 to-purple-600",
    items: [
      { name: "協作中心", href: "/collaboration", icon: "🤝", desc: "三方角色即時協作空間" },
      { name: "戰情室", href: "/dashboard", icon: "📈", desc: "全平台數據儀表板" },
      { name: "BD 績效", href: "/dashboard/bd", icon: "🎯", desc: "業務開發追蹤" },
      { name: "數據分析", href: "/dashboard/analytics", icon: "📊", desc: "深度數據分析" },
      { name: "戰略審計", href: "/dashboard/audit", icon: "🔍", desc: "CTO 戰略審計報告" },
    ],
  },
];

export default function HomePage() {
  const totalPages = sections.reduce((sum, s) => sum + s.items.length, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Hero */}
      <div className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">LargeHome AI 管理中心</h1>
          <p className="text-indigo-100 text-lg mb-6">室內設計產業全方位 AI 平台 — 連結設計師、工班、建材商</p>
          <div className="flex flex-wrap gap-4">
            <div className="bg-white/10 backdrop-blur rounded-xl px-4 py-2">
              <span className="text-2xl font-bold">{totalPages}</span>
              <span className="text-indigo-200 ml-2">個功能頁面</span>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl px-4 py-2">
              <span className="text-2xl font-bold">3</span>
              <span className="text-indigo-200 ml-2">大角色平台</span>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl px-4 py-2">
              <span className="text-2xl font-bold">5</span>
              <span className="text-indigo-200 ml-2">大功能模組</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {sections.map((section) => (
          <div key={section.category}>
            <div className="flex items-center gap-3 mb-4">
              <div className={`h-1 w-8 rounded-full bg-gradient-to-r ${section.color}`} />
              <h2 className="text-xl font-bold text-slate-800">{section.category}</h2>
              <span className="text-sm text-slate-400">{section.items.length} 項</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {section.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group bg-white rounded-xl border border-slate-200 p-4 hover:shadow-lg hover:border-indigo-200 hover:-translate-y-0.5 transition-all duration-200"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{item.icon}</span>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {item.name}
                      </h3>
                      <p className="text-sm text-slate-500 mt-0.5">{item.desc}</p>
                      <p className="text-xs text-slate-400 mt-1 font-mono">{item.href}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="border-t border-slate-200 bg-white mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-sm text-slate-400">
          LargeHome AI © 2026 — 室內設計產業 AI 平台
        </div>
      </div>
    </div>
  );
}
