"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";

const sections = [
  {
    title: "協作總覽",
    items: [
      { name: "協作首頁", href: "/collaboration", icon: "🏠", exact: true },
    ],
  },
  {
    title: "進行中專案",
    items: [
      { name: "王宅翻新案", href: "/collaboration/proj-001", icon: "🏗️" },
      { name: "李宅新建案", href: "/collaboration/proj-002", icon: "🏠" },
      { name: "陳氏辦公室", href: "/collaboration/proj-003", icon: "🏢" },
      { name: "張宅裝修案", href: "/collaboration/proj-004", icon: "🔨" },
    ],
  },
  {
    title: "工具",
    items: [
      { name: "通知中心", href: "/collaboration/notifications", icon: "🔔" },
      { name: "共享文件庫", href: "/collaboration/files", icon: "📂" },
    ],
  },
];

function isItemActive(pathname: string, href: string, exact?: boolean) {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(href + "/");
}

export default function CollaborationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const currentItem =
    sections
      .flatMap((s) => s.items)
      .find((i) => isItemActive(pathname, i.href, (i as { exact?: boolean }).exact)) ??
    sections[0].items[0];

  return (
    <div className="flex h-full">
      {/* Mobile dropdown trigger */}
      <div className="md:hidden fixed top-16 left-0 right-0 z-40 bg-white border-b border-slate-200 px-4 py-2">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="w-full flex items-center justify-between px-4 py-3 bg-violet-50 rounded-lg text-sm font-medium text-violet-700 min-h-[44px]"
        >
          <span>
            {currentItem.icon} {currentItem.name}
          </span>
          <svg
            className={clsx("w-5 h-5 transition-transform", sidebarOpen && "rotate-180")}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {sidebarOpen && (
          <div className="absolute left-0 right-0 top-full bg-white border-b border-slate-200 shadow-lg max-h-[60vh] overflow-y-auto">
            <div className="px-4 py-2 space-y-3">
              {sections.map((section) => (
                <div key={section.title}>
                  <p className="text-xs font-semibold text-violet-400 uppercase tracking-wider px-3 py-1">
                    {section.title}
                  </p>
                  {section.items.map((item) => {
                    const active = isItemActive(pathname, item.href, (item as { exact?: boolean }).exact);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className={clsx(
                          "flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors",
                          active
                            ? "bg-violet-50 text-violet-700"
                            : "text-slate-600 hover:bg-slate-50"
                        )}
                      >
                        <span>{item.icon}</span>
                        {item.name}
                      </Link>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-56 lg:w-64 border-r border-violet-100 bg-violet-50/30 overflow-y-auto shrink-0">
        <div className="p-4 space-y-5">
          <div className="px-3 pb-2 border-b border-violet-200">
            <h2 className="text-sm font-bold text-violet-800">跨角色協作中心</h2>
            <p className="text-xs text-violet-500 mt-0.5">設計師 / 建材商 / 工班</p>
          </div>
          {sections.map((section) => (
            <div key={section.title}>
              <p className="text-xs font-semibold text-violet-400 uppercase tracking-wider px-3 mb-1">
                {section.title}
              </p>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const active = isItemActive(pathname, item.href, (item as { exact?: boolean }).exact);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={clsx(
                        "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                        active
                          ? "bg-violet-100 text-violet-700"
                          : "text-slate-600 hover:text-violet-900 hover:bg-violet-50"
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
      </aside>

      {/* Main content */}
      <div className="flex-1 min-w-0 overflow-y-auto pt-[60px] md:pt-0">
        {children}
      </div>
    </div>
  );
}
