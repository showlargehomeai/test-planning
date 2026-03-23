"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";

const sections = [
  {
    title: "工程管理",
    items: [
      { name: "工程日曆", href: "/contractor/schedule", icon: "📅" },
      { name: "施工紀錄", href: "/contractor/records", icon: "📋" },
    ],
  },
  {
    title: "接案",
    items: [
      { name: "需求池", href: "/contractor/requirements", icon: "🏪" },
    ],
  },
  {
    title: "團隊與財務",
    items: [
      { name: "班底管理", href: "/contractor/team", icon: "👷" },
      { name: "請款管理", href: "/contractor/billing", icon: "💰" },
    ],
  },
];

export default function ContractorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const currentItem =
    sections.flatMap((s) => s.items).find((i) => pathname.startsWith(i.href)) ??
    sections[0].items[0];

  return (
    <div className="flex h-full">
      {/* Mobile dropdown trigger */}
      <div className="md:hidden fixed top-16 left-0 right-0 z-40 bg-white border-b border-slate-200 px-4 py-2">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="w-full flex items-center justify-between px-4 py-3 bg-amber-50 rounded-lg text-sm font-medium text-amber-800 min-h-[44px]"
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
                  <p className="text-xs font-semibold text-amber-500 uppercase tracking-wider px-3 py-1">
                    {section.title}
                  </p>
                  {section.items.map((item) => {
                    const isActive = pathname.startsWith(item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className={clsx(
                          "flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors",
                          isActive
                            ? "bg-amber-50 text-amber-800"
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
      <aside className="hidden md:flex flex-col w-56 lg:w-64 border-r border-amber-100 bg-amber-50/30 overflow-y-auto shrink-0">
        <div className="p-4 space-y-5">
          {sections.map((section) => (
            <div key={section.title}>
              <p className="text-xs font-semibold text-amber-500 uppercase tracking-wider px-3 mb-1">
                {section.title}
              </p>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const isActive = pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={clsx(
                        "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                        isActive
                          ? "bg-amber-100 text-amber-900"
                          : "text-slate-600 hover:text-slate-900 hover:bg-amber-50"
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
