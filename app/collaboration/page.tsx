"use client";

import Link from "next/link";
import { clsx } from "clsx";

/* ── Mock Data ── */

const activeProjects = [
  {
    id: "proj-001",
    name: "王宅翻新案",
    designer: "林雅婷",
    supplier: "宏達建材",
    contractor: "阿明工班",
    progress: 65,
    status: "施工中",
    lastActivity: "2 小時前",
    unread: 3,
  },
  {
    id: "proj-002",
    name: "李宅新建案",
    designer: "陳俊宏",
    supplier: "永豐建材",
    contractor: "大力工程行",
    progress: 30,
    status: "備料中",
    lastActivity: "30 分鐘前",
    unread: 7,
  },
  {
    id: "proj-003",
    name: "陳氏辦公室",
    designer: "林雅婷",
    supplier: "宏達建材",
    contractor: "順發工班",
    progress: 90,
    status: "驗收中",
    lastActivity: "1 天前",
    unread: 0,
  },
  {
    id: "proj-004",
    name: "張宅裝修案",
    designer: "王品萱",
    supplier: "全成建材",
    contractor: "阿明工班",
    progress: 10,
    status: "設計中",
    lastActivity: "5 小時前",
    unread: 1,
  },
];

const recentDiscussions = [
  {
    projectId: "proj-002",
    projectName: "李宅新建案",
    author: "大力工程行",
    role: "工班" as const,
    message: "木地板材料已到場，明天可以開始鋪設，請設計師確認起鋪方向",
    time: "30 分鐘前",
  },
  {
    projectId: "proj-001",
    projectName: "王宅翻新案",
    author: "宏達建材",
    role: "建材商" as const,
    message: "進口磁磚已到貨，共 45 箱，請安排收貨時間",
    time: "2 小時前",
  },
  {
    projectId: "proj-001",
    projectName: "王宅翻新案",
    author: "林雅婷",
    role: "設計師" as const,
    message: "廚房中島尺寸微調，已更新圖面，請工班確認",
    time: "3 小時前",
  },
  {
    projectId: "proj-004",
    projectName: "張宅裝修案",
    author: "全成建材",
    role: "建材商" as const,
    message: "義大利進口石材缺貨，替代方案報價已傳，請設計師確認",
    time: "5 小時前",
  },
];

const pendingActions = [
  { label: "確認木地板起鋪方向", project: "李宅新建案", projectId: "proj-002", urgency: "high" as const },
  { label: "安排磁磚收貨時間", project: "王宅翻新案", projectId: "proj-001", urgency: "high" as const },
  { label: "審核替代石材方案", project: "張宅裝修案", projectId: "proj-004", urgency: "medium" as const },
  { label: "確認驗收日期", project: "陳氏辦公室", projectId: "proj-003", urgency: "low" as const },
];

const onlineUsers = [
  { name: "林雅婷", role: "設計師" as const, status: "online" as const },
  { name: "大力工程行", role: "工班" as const, status: "online" as const },
  { name: "宏達建材", role: "建材商" as const, status: "online" as const },
  { name: "陳俊宏", role: "設計師" as const, status: "away" as const },
  { name: "阿明工班", role: "工班" as const, status: "offline" as const },
  { name: "永豐建材", role: "建材商" as const, status: "offline" as const },
];

const roleColor: Record<string, string> = {
  設計師: "bg-indigo-100 text-indigo-700",
  建材商: "bg-amber-100 text-amber-700",
  工班: "bg-emerald-100 text-emerald-700",
};

const statusDot: Record<string, string> = {
  online: "bg-green-400",
  away: "bg-yellow-400",
  offline: "bg-slate-300",
};

const urgencyStyle: Record<string, string> = {
  high: "border-l-red-500 bg-red-50",
  medium: "border-l-amber-500 bg-amber-50",
  low: "border-l-slate-300 bg-slate-50",
};

/* ── Page ── */

export default function CollaborationHome() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">跨角色協作中心</h1>
        <p className="text-sm text-slate-500 mt-1">
          設計師、建材商、工班三方即時溝通與進度同步
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "進行中專案", value: "4", accent: "text-violet-600" },
          { label: "未讀訊息", value: "11", accent: "text-red-600" },
          { label: "待處理事項", value: "4", accent: "text-amber-600" },
          { label: "在線成員", value: "3", accent: "text-green-600" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-slate-200 p-4">
            <p className="text-xs text-slate-500">{s.label}</p>
            <p className={clsx("text-2xl font-bold mt-1", s.accent)}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left column: Active projects + Pending */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Projects */}
          <section className="bg-white rounded-xl border border-slate-200">
            <div className="px-5 py-4 border-b border-slate-100">
              <h2 className="font-semibold text-slate-900">活躍專案</h2>
            </div>
            <div className="divide-y divide-slate-100">
              {activeProjects.map((p) => (
                <Link
                  key={p.id}
                  href={`/collaboration/${p.id}`}
                  className="block px-5 py-4 hover:bg-violet-50/50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-900">{p.name}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-violet-100 text-violet-700">
                        {p.status}
                      </span>
                      {p.unread > 0 && (
                        <span className="text-xs px-1.5 py-0.5 rounded-full bg-red-500 text-white font-medium">
                          {p.unread}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-400">{p.lastActivity}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs mb-2">
                    <span className={clsx("px-2 py-0.5 rounded-full", roleColor["設計師"])}>
                      {p.designer}
                    </span>
                    <span className={clsx("px-2 py-0.5 rounded-full", roleColor["建材商"])}>
                      {p.supplier}
                    </span>
                    <span className={clsx("px-2 py-0.5 rounded-full", roleColor["工班"])}>
                      {p.contractor}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-violet-500 rounded-full transition-all"
                        style={{ width: `${p.progress}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-slate-500 w-10 text-right">
                      {p.progress}%
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Pending Actions */}
          <section className="bg-white rounded-xl border border-slate-200">
            <div className="px-5 py-4 border-b border-slate-100">
              <h2 className="font-semibold text-slate-900">待處理事項</h2>
            </div>
            <div className="divide-y divide-slate-100">
              {pendingActions.map((a, i) => (
                <Link
                  key={i}
                  href={`/collaboration/${a.projectId}`}
                  className={clsx(
                    "block px-5 py-3 border-l-4 hover:brightness-95 transition",
                    urgencyStyle[a.urgency]
                  )}
                >
                  <p className="text-sm font-medium text-slate-800">{a.label}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{a.project}</p>
                </Link>
              ))}
            </div>
          </section>
        </div>

        {/* Right column: Discussions + Online */}
        <div className="space-y-6">
          {/* Recent Discussions */}
          <section className="bg-white rounded-xl border border-slate-200">
            <div className="px-5 py-4 border-b border-slate-100">
              <h2 className="font-semibold text-slate-900">最新討論</h2>
            </div>
            <div className="divide-y divide-slate-100">
              {recentDiscussions.map((d, i) => (
                <Link
                  key={i}
                  href={`/collaboration/${d.projectId}`}
                  className="block px-5 py-3 hover:bg-violet-50/50 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className={clsx("text-xs px-2 py-0.5 rounded-full", roleColor[d.role])}>
                      {d.author}
                    </span>
                    <span className="text-xs text-slate-400">{d.time}</span>
                  </div>
                  <p className="text-sm text-slate-700 line-clamp-2">{d.message}</p>
                  <p className="text-xs text-violet-500 mt-1">{d.projectName}</p>
                </Link>
              ))}
            </div>
          </section>

          {/* Online Status */}
          <section className="bg-white rounded-xl border border-slate-200">
            <div className="px-5 py-4 border-b border-slate-100">
              <h2 className="font-semibold text-slate-900">在線狀態</h2>
            </div>
            <div className="px-5 py-3 space-y-3">
              {onlineUsers.map((u) => (
                <div key={u.name} className="flex items-center gap-3">
                  <span className={clsx("w-2.5 h-2.5 rounded-full shrink-0", statusDot[u.status])} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-700 truncate">{u.name}</p>
                  </div>
                  <span className={clsx("text-xs px-2 py-0.5 rounded-full shrink-0", roleColor[u.role])}>
                    {u.role}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
