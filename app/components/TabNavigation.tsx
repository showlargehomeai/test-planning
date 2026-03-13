"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";

const tabs = [
  { name: "Demo", href: "/demo", icon: "🎨" },
  { name: "Business Plan", href: "/plan", icon: "📊" },
  { name: "Change Log", href: "/changelog", icon: "📝" },
  { name: "Idea Wall", href: "/ideas", icon: "💡" },
];

export default function TabNavigation() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-slate-200 bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-slate-900">TestPlanning Hub</span>
          </div>
          <div className="flex space-x-1">
            {tabs.map((tab) => {
              const isActive =
                pathname === tab.href || pathname.startsWith(tab.href + "/");
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={clsx(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  )}
                >
                  <span className="mr-1.5">{tab.icon}</span>
                  {tab.name}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
