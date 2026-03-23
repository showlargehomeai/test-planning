"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";

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
    label: "設計師",
    items: [
      { name: "工作台", href: "/designer" },
      { name: "業主媒合", href: "/designer/matching" },
      { name: "客戶 CRM", href: "/designer/crm" },
      { name: "專案追蹤", href: "/designer/projects" },
      { name: "AI 渲染", href: "/designer/rendering" },
      { name: "智慧報價", href: "/designer/quotation" },
      { name: "建材資料庫", href: "/designer/materials" },
      { name: "工程看板", href: "/designer/kanban" },
      { name: "RFQ 詢價", href: "/designer/rfq" },
    ],
  },
  {
    label: "建材商",
    items: [
      { name: "工作台", href: "/supplier" },
      { name: "產品目錄", href: "/supplier/catalog" },
      { name: "訂單追蹤", href: "/supplier/orders" },
      { name: "報價管理", href: "/supplier/quotes" },
      { name: "需求池", href: "/supplier/requirements" },
    ],
  },
  {
    label: "工班",
    items: [
      { name: "工作台", href: "/contractor" },
      { name: "排程日曆", href: "/contractor/schedule" },
      { name: "施工紀錄", href: "/contractor/records" },
      { name: "班底管理", href: "/contractor/team" },
      { name: "需求池", href: "/contractor/requirements" },
    ],
  },
  {
    label: "策略",
    items: [
      { name: "BD 策略", href: "/bd-strategy" },
      { name: "商業計畫", href: "/plan" },
      { name: "產品 Demo", href: "/demo" },
      { name: "協作中心", href: "/collaboration" },
      { name: "需求市場", href: "/marketplace" },
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
      <Link href="/" onClick={onNavigate} className="flex items-center gap-2.5 px-5 h-[56px] border-b border-slate-100 shrink-0">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-sm font-bold text-white shadow-sm">
          L
        </div>
        <div className="leading-tight">
          <span className="text-[14px] font-bold text-slate-800 block">LargeHome</span>
          <span className="text-[10px] text-slate-400 -mt-0.5 block">AI 管理中心</span>
        </div>
      </Link>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400/70 px-2.5 mb-1">
              {group.label}
            </p>
            <div className="space-y-[1px]">
              {group.items.map((item) => {
                const active = checkActive(pathname, item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onNavigate}
                    className={clsx(
                      "flex items-center gap-2.5 px-2.5 py-[6px] rounded-lg text-[13px] transition-all",
                      active
                        ? "bg-blue-50 text-blue-700 font-semibold"
                        : "text-slate-500 hover:text-slate-700 hover:bg-slate-50 font-medium"
                    )}
                  >
                    <span className={clsx(
                      "w-[5px] h-[5px] rounded-full shrink-0",
                      active ? "bg-blue-500" : "bg-slate-200"
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
      <div className="px-5 py-3 border-t border-slate-100 text-[10px] text-slate-300 shrink-0">
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
      {/* Mobile top bar */}
      <header className="lg:hidden sticky top-0 z-40 bg-white border-b border-slate-100">
        <div className="flex items-center justify-between h-12 px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-[11px] font-bold">L</div>
            <span className="text-[13px] font-bold text-slate-800">LargeHome</span>
          </Link>
          <div className="flex items-center gap-2">
            {currentPage && <span className="text-[11px] text-slate-400 hidden sm:block">{currentPage.name}</span>}
            <button onClick={() => setMobileOpen(true)} className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-50" aria-label="選單">
              <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute top-0 left-0 w-[250px] h-full bg-white shadow-xl flex flex-col">
            <button onClick={() => setMobileOpen(false)} className="absolute top-3.5 right-3 w-7 h-7 flex items-center justify-center rounded-lg text-slate-300 hover:text-slate-500 hover:bg-slate-50">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <SidebarContent pathname={pathname} onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-[220px] bg-white border-r border-slate-100 shrink-0 h-screen sticky top-0">
        <SidebarContent pathname={pathname} />
      </aside>
    </>
  );
}
