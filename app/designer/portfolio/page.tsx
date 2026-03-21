"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { clsx } from "clsx";
import Link from "next/link";

const categories = ["全部", "客廳", "臥室", "廚房", "浴室", "書房", "商業空間"];

const mockProjects = [
  { id: 1, title: "大安區現代簡約宅", category: "客廳", style: "現代簡約", area: "35坪", views: 2847, likes: 156, seo: 92, gradient: "from-slate-600 to-slate-800", date: "2026-02" },
  { id: 2, title: "板橋工業風 Loft", category: "客廳", style: "工業風", area: "28坪", views: 1923, likes: 98, seo: 85, gradient: "from-amber-700 to-orange-800", date: "2026-01" },
  { id: 3, title: "信義區北歐親子宅", category: "臥室", style: "北歐風", area: "45坪", views: 3421, likes: 234, seo: 96, gradient: "from-sky-400 to-blue-600", date: "2025-12" },
  { id: 4, title: "中山區新古典豪宅", category: "客廳", style: "新古典", area: "60坪", views: 4102, likes: 312, seo: 88, gradient: "from-violet-500 to-purple-700", date: "2025-11" },
  { id: 5, title: "西屯日式無印小宅", category: "書房", style: "日式無印", area: "22坪", views: 1567, likes: 87, seo: 79, gradient: "from-emerald-500 to-teal-700", date: "2025-10" },
  { id: 6, title: "左營海景餐廳設計", category: "商業空間", style: "混搭風", area: "50坪", views: 2156, likes: 143, seo: 91, gradient: "from-cyan-500 to-blue-700", date: "2025-09" },
  { id: 7, title: "大直奢華主臥套房", category: "臥室", style: "新古典", area: "15坪", views: 1834, likes: 121, seo: 83, gradient: "from-rose-500 to-pink-700", date: "2025-08" },
  { id: 8, title: "中壢開放式廚房", category: "廚房", style: "現代簡約", area: "12坪", views: 987, likes: 56, seo: 74, gradient: "from-lime-500 to-green-700", date: "2025-07" },
  { id: 9, title: "東區溫馨浴室翻新", category: "浴室", style: "北歐風", area: "4坪", views: 756, likes: 45, seo: 68, gradient: "from-indigo-400 to-violet-600", date: "2025-06" },
];

export default function PortfolioPage() {
  const [category, setCategory] = useState("全部");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filtered = category === "全部" ? mockProjects : mockProjects.filter((p) => p.category === category);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">🖼️ 作品集線上展示</h1>
          <p className="text-sm text-slate-500 mt-1">展示您的設計作品，吸引潛在業主</p>
        </div>
        <button className="px-4 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors min-h-[44px] shrink-0">
          + 上傳作品
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500">作品總數</p>
          <p className="text-2xl font-bold text-indigo-600">{mockProjects.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500">總瀏覽數</p>
          <p className="text-2xl font-bold text-emerald-600">{mockProjects.reduce((s, p) => s + p.views, 0).toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500">總按讚數</p>
          <p className="text-2xl font-bold text-rose-600">{mockProjects.reduce((s, p) => s + p.likes, 0).toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500">平均 SEO 分數</p>
          <p className="text-2xl font-bold text-amber-600">{Math.round(mockProjects.reduce((s, p) => s + p.seo, 0) / mockProjects.length)}</p>
        </div>
      </div>

      {/* Category filter + view toggle */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={clsx(
                "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                category === cat ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
          <button onClick={() => setViewMode("grid")} className={clsx("px-3 py-1.5 rounded-md text-sm", viewMode === "grid" ? "bg-white shadow-sm text-slate-900" : "text-slate-500")}>
            ▦ 格狀
          </button>
          <button onClick={() => setViewMode("list")} className={clsx("px-3 py-1.5 rounded-md text-sm", viewMode === "list" ? "bg-white shadow-sm text-slate-900" : "text-slate-500")}>
            ☰ 列表
          </button>
        </div>
      </div>

      {/* Projects Grid */}
      <div className={clsx(
        viewMode === "grid"
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          : "space-y-3"
      )}>
        {filtered.map((project) => (
          viewMode === "grid" ? (
            <div key={project.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow group">
              {/* Image placeholder */}
              <div className={clsx("h-48 bg-gradient-to-br flex items-center justify-center relative", project.gradient)}>
                <span className="text-white/30 text-6xl font-light">🏠</span>
                <div className="absolute top-3 right-3 flex gap-1.5">
                  <span className={clsx(
                    "text-xs px-2 py-0.5 rounded-full font-medium",
                    project.seo >= 90 ? "bg-emerald-500 text-white" : project.seo >= 80 ? "bg-amber-500 text-white" : "bg-slate-500 text-white"
                  )}>
                    SEO {project.seo}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-slate-900 mb-1">{project.title}</h3>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">{project.style}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">{project.category}</span>
                  <span className="text-xs text-slate-400">{project.area}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                  <div className="flex gap-3">
                    <span>👁 {project.views.toLocaleString()}</span>
                    <span>❤️ {project.likes}</span>
                  </div>
                  <span>{project.date}</span>
                </div>
                {/* CTA Button */}
                <Link
                  href="/designer/booking"
                  className="w-full block text-center px-3 py-2 text-xs font-medium rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors"
                >
                  📅 預約諮詢
                </Link>
              </div>
            </div>
          ) : (
            <div key={project.id} className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-shadow flex gap-4 items-center">
              <div className={clsx("w-20 h-20 rounded-lg bg-gradient-to-br flex items-center justify-center shrink-0", project.gradient)}>
                <span className="text-white/40 text-2xl">🏠</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-slate-900">{project.title}</h3>
                <div className="flex flex-wrap gap-2 mt-1">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">{project.style}</span>
                  <span className="text-xs text-slate-400">{project.area} · {project.date}</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2 shrink-0">
                <div className="text-right text-xs text-slate-500 hidden sm:block">
                  <p>👁 {project.views.toLocaleString()}</p>
                  <p>❤️ {project.likes}</p>
                  <p className={clsx("font-medium", project.seo >= 90 ? "text-emerald-600" : "text-amber-600")}>SEO {project.seo}</p>
                </div>
                <Link
                  href="/designer/booking"
                  className="px-3 py-1.5 text-xs font-medium rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors"
                >
                  📅 預約諮詢
                </Link>
              </div>
            </div>
          )
        ))}
      </div>

      {/* CTA Banner */}
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl p-6 sm:p-8 text-white text-center">
        <h2 className="text-xl sm:text-2xl font-bold mb-2">想請這位設計師幫你設計？</h2>
        <p className="text-indigo-200 text-sm mb-4">立即預約免費諮詢，讓專業設計師為您量身打造理想空間</p>
        <Link
          href="/designer/booking"
          className="inline-block px-6 py-3 bg-white text-indigo-700 font-semibold rounded-xl hover:bg-indigo-50 transition-colors text-sm"
        >
          📅 立即預約諮詢
        </Link>
      </div>
    </div>
  );
}
