"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";

const navGroups = [
  {
    label: "總覽",
    items: [
      { name: "首頁", href: "/", icon: "🏠" },
      { name: "戰情室", href: "/dashboard", icon: "📈" },
    ],
  },
  {
    label: "三角色平台",
    items: [
      { name: "設計師", href: "/designer", icon: "🛠️" },
      { name: "建材商", href: "/supplier", icon: "🏭" },
      { name: "工班", href: "/contractor", icon: "🔨" },
      { name: "協作中心", href: "/collaboration", icon: "🤝" },
    ],
  },
  {
    label: "商業策略",
    items: [
      { name: "BD 策略", href: "/bd-strategy", icon: "🚀" },
      { name: "商業計畫", href: "/plan", icon: "📊" },
      { name: "產品 Demo", href: "/demo", icon: "🎨" },
    ],
  },
  {
    label: "其他",
    items: [
      { name: "更新日誌", href: "/changelog", icon: "📝" },
      { name: "點子牆", href: "/ideas", icon: "💡" },
    ],
  },
];

// Flatten for mobile and active check
const allItems = navGroups.flatMap((g) => g.items);

function DropdownGroup({
  label,
  items,
  pathname,
}: {
  label: string;
  items: typeof allItems;
  pathname: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const hasActive = items.some(
    (i) => pathname === i.href || (i.href !== "/" && pathname.startsWith(i.href + "/"))
  );

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={clsx(
          "flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all",
          hasActive
            ? "text-indigo-700 bg-indigo-50"
            : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
        )}
      >
        {label}
        <svg
          className={clsx("w-3.5 h-3.5 transition-transform", open && "rotate-180")}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50">
          {items.map((item) => {
            const isActive =
              pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href + "/"));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={clsx(
                  "flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <span>{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function TabNavigation() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Find current page name for mobile header
  const currentPage = allItems.find(
    (i) => pathname === i.href || (i.href !== "/" && pathname.startsWith(i.href + "/"))
  );

  return (
    <nav className="border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
              L
            </div>
            <span className="text-base font-bold text-slate-800 hidden sm:block">
              LargeHome AI
            </span>
          </Link>

          {/* Desktop nav - grouped dropdowns */}
          <div className="hidden lg:flex items-center gap-1">
            {navGroups.map((group) => (
              <DropdownGroup
                key={group.label}
                label={group.label}
                items={group.items}
                pathname={pathname}
              />
            ))}
          </div>

          {/* Desktop quick links for most used */}
          <div className="hidden md:flex lg:hidden items-center gap-1">
            {[
              { name: "戰情室", href: "/dashboard", icon: "📈" },
              { name: "設計師", href: "/designer", icon: "🛠️" },
              { name: "BD策略", href: "/bd-strategy", icon: "🚀" },
            ].map((tab) => {
              const isActive = pathname === tab.href || pathname.startsWith(tab.href + "/");
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={clsx(
                    "px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
                    isActive ? "bg-indigo-50 text-indigo-700" : "text-slate-500 hover:text-slate-800"
                  )}
                >
                  <span className="mr-1">{tab.icon}</span>
                  {tab.name}
                </Link>
              );
            })}
          </div>

          {/* Mobile: current page + hamburger */}
          <div className="flex items-center gap-2 lg:hidden">
            {currentPage && (
              <span className="text-sm font-medium text-slate-500">
                {currentPage.icon} {currentPage.name}
              </span>
            )}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="flex items-center justify-center w-10 h-10 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
              aria-label="開啟選單"
            >
              {mobileOpen ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu - grouped */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white/95 backdrop-blur-md max-h-[70vh] overflow-y-auto">
          <div className="px-4 py-3 space-y-4">
            {navGroups.map((group) => (
              <div key={group.label}>
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-1">
                  {group.label}
                </p>
                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const isActive =
                      pathname === item.href ||
                      (item.href !== "/" && pathname.startsWith(item.href + "/"));
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={clsx(
                          "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                          isActive
                            ? "bg-indigo-50 text-indigo-700"
                            : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                        )}
                      >
                        <span className="text-base">{item.icon}</span>
                        {item.name}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
