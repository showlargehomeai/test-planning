"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";

const subTabs = [
  { name: "總覽", href: "/dashboard", icon: "🏠" },
  { name: "BD 管理", href: "/dashboard/bd", icon: "🤝" },
  { name: "數據分析", href: "/dashboard/analytics", icon: "📊" },
];

export default function DashboardNav() {
  const pathname = usePathname();

  return (
    <div className="border-b border-slate-200 bg-white/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-1 h-12 overflow-x-auto scrollbar-hide">
          {subTabs.map((tab) => {
            const isActive =
              tab.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(tab.href);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={clsx(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap transition-colors",
                  isActive
                    ? "bg-indigo-100 text-indigo-700"
                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                )}
              >
                <span>{tab.icon}</span>
                {tab.name}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
