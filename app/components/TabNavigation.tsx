"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";

/* ──────────────────────────────────────────────
   GoodData-inspired layout
   Dark sidebar (desktop) + top bar (mobile)
   ────────────────────────────────────────────── */

const navGroups = [
  {
    label: "總覽",
    items: [
      { name: "首頁", href: "/" },
      { name: "戰情室", href: "/dashboard" },
      { name: "BD 績效", href: "/dashboard/bd" },
      { name: "數據分析", href: "/dashboard/analytics" },
      { name: "戰略審計", href: "/dashboard/audit" },
    ],
  },
  {
    label: "設計師平台",
    items: [
      { name: "工作台", href: "/designer" },
      { name: "業主媒合", href: "/designer/matching" },
      { name: "客戶 CRM", href: "/designer/crm" },
      { name: "專案追蹤", href: "/designer/projects" },
      { name: "AI 渲染", href: "/designer/rendering" },
      { name: "智慧報價", href: "/designer/quotation" },
      { name: "建材資料庫", href: "/designer/materials" },
      { name: "工程看板", href: "/designer/kanban" },
    ],
  },
  {
    label: "建材商平台",
    items: [
      { name: "工作台", href: "/supplier" },
      { name: "產品目錄", href: "/supplier/catalog" },
      { name: "訂單追蹤", href: "/supplier/orders" },
      { name: "報價管理", href: "/supplier/quotes" },
    ],
  },
  {
    label: "工班平台",
    items: [
      { name: "工作台", href: "/contractor" },
      { name: "排程日曆", href: "/contractor/schedule" },
      { name: "施工紀錄", href: "/contractor/records" },
      { name: "班底管理", href: "/contractor/team" },
    ],
  },
  {
    label: "商業策略",
    items: [
      { name: "BD 策略", href: "/bd-strategy" },
      { name: "商業計畫", href: "/plan" },
      { name: "產品 Demo", href: "/demo" },
      { name: "協作中心", href: "/collaboration" },
    ],
  },
  {
    label: "其他",
    items: [
      { name: "更新日誌", href: "/changelog" },
      { name: "點子牆", href: "/ideas" },
    ],
  },
];

const allItems = navGroups.flatMap((g) => g.items);

function checkActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

function SidebarContent({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <>
      {/* Logo */}
      <Link href="/" onClick={onNavigate} className="flex items-center gap-2.5 px-5 h-14 border-b border-white/[0.06] shrink-0">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-[13px] font-bold text-white shadow-sm shadow-indigo-500/30">
          L
        </div>
        <span className="text-[15px] font-semibold tracking-tight text-white/90">LargeHome AI</span>
      </Link>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5 scrollbar-thin">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-white/25 px-2.5 mb-2">
              {group.label}
            </p>
            <div className="space-y-px">
              {group.items.map((item) => {
                const active = checkActive(pathname, item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onNavigate}
                    className={clsx(
                      "flex items-center gap-2.5 px-2.5 py-[7px] rounded-md text-[13px] transition-all",
                      active
                        ? "bg-indigo-500/20 text-indigo-300 font-semibold"
                        : "text-white/45 hover:text-white/75 hover:bg-white/[0.05] font-medium"
                    )}
                  >
                    <span className={clsx(
                      "w-[5px] h-[5px] rounded-full shrink-0 transition-colors",
                      active ? "bg-indigo-400" : "bg-white/10 group-hover:bg-white/20"
                    )} />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-white/[0.06] text-[10px] text-white/20 shrink-0">
        © 2026 LargeHome AI
      </div>
    </>
  );
}

export default function TabNavigation() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const currentPage = allItems.find((i) => checkActive(pathname, i.href));

  return (
    <>
      {/* ── Mobile/tablet top bar ── */}
      <header className="lg:hidden sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/70">
        <div className="flex items-center justify-between h-12 px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-[10px] font-bold">
              L
            </div>
            <span className="text-[13px] font-semibold text-slate-800">LargeHome AI</span>
          </Link>
          <div className="flex items-center gap-3">
            {currentPage && (
              <span className="text-[12px] text-slate-400 font-medium hidden sm:block">{currentPage.name}</span>
            )}
            <button
              onClick={() => setMobileOpen(true)}
              className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 transition"
              aria-label="選單"
            >
              <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile overlay sidebar ── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute top-0 left-0 w-[240px] h-full bg-[#14161b] flex flex-col shadow-2xl">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-md text-white/40 hover:text-white/70 hover:bg-white/10 transition"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <SidebarContent pathname={pathname} onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      {/* ── Desktop sidebar (rendered in layout via flex) ── */}
      <aside className="hidden lg:flex flex-col w-[210px] bg-[#14161b] shrink-0 h-screen sticky top-0">
        <SidebarContent pathname={pathname} />
      </aside>
    </>
  );
}
