"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { clsx } from "clsx";

/* ── Mock Data ─────────────────────────────────────────────── */

const designerName = "林宥彤";

// Simulated project data (mirrors projects page)
const projectData = [
  { client: "王董事長", title: "陽明山景觀豪宅", status: "pending", deadline: "2026-04-15", progress: 25 },
  { client: "創新科技", title: "信義區辦公室改裝", status: "inProgress", deadline: "2026-05-20", progress: 65 },
  { client: "林小姐", title: "三房兩廳居家空間", status: "review", deadline: "2026-04-01", progress: 90 },
  { client: "張先生", title: "老宅翻新專案", status: "completed", deadline: "2026-03-15", progress: 100 },
  { client: "BREW咖啡", title: "咖啡廳商空設計", status: "inProgress", deadline: "2026-05-10", progress: 45 },
  { client: "陳同學", title: "小坪數套房改造", status: "pending", deadline: "2026-06-30", progress: 15 },
];

// Simulated booking data
const bookingData = [
  { name: "陳怡君", date: "2026-03-21", time: "10:00", type: "設計提案" },
  { name: "張家豪", date: "2026-03-21", time: "15:00", type: "初次諮詢" },
  { name: "劉雅婷", date: "2026-03-22", time: "10:00", type: "合約簽訂" },
];

// Simulated CRM interactions
const crmInteractions = [
  { id: 1, client: "陳怡君", avatar: "bg-gradient-to-br from-pink-400 to-rose-500", time: "10 分鐘前", action: "確認廚房磁磚顏色搭配", status: "施工中" },
  { id: 2, client: "林志明", avatar: "bg-gradient-to-br from-blue-400 to-indigo-500", time: "1 小時前", action: "水電走線驗收完成通知", status: "報價中" },
  { id: 3, client: "劉雅婷", avatar: "bg-gradient-to-br from-violet-400 to-purple-500", time: "2 小時前", action: "主臥壁紙更換為淺灰色系", status: "簽約中" },
  { id: 4, client: "王美玲", avatar: "bg-gradient-to-br from-emerald-400 to-teal-500", time: "3 小時前", action: "結案滿意度問卷已回覆", status: "已完工" },
];

const quickActions = [
  { name: "業主媒合", href: "/designer/matching", icon: "🎯", desc: "找新案源" },
  { name: "客戶管理", href: "/designer/crm", icon: "👥", desc: "客戶資料" },
  { name: "專案追蹤", href: "/designer/projects", icon: "📋", desc: "進度管理" },
  { name: "AI 出圖", href: "/designer/rendering", icon: "🎨", desc: "快速渲染" },
  { name: "智慧報價", href: "/designer/quotation", icon: "💰", desc: "產出報價" },
  { name: "工程看板", href: "/designer/kanban", icon: "📊", desc: "施工排程" },
];

/* ── Helpers ────────────────────────────────────────────────── */

function getTodayString() {
  const d = new Date();
  const weekdays = ["日", "一", "二", "三", "四", "五", "六"];
  return `${d.getFullYear()} 年 ${d.getMonth() + 1} 月 ${d.getDate()} 日（${weekdays[d.getDay()]}）`;
}

/* ── Component ─────────────────────────────────────────────── */

export default function DesignerDashboard() {
  // Dynamic todos derived from projects and bookings
  const dynamicTodos = [
    // From projects — pending items
    ...projectData
      .filter((p) => p.status !== "completed")
      .map((p, i) => ({
        id: i + 1,
        text: `${p.client} ${p.title} — ${p.status === "review" ? "安排驗收" : p.status === "pending" ? "確認設計提案" : "追蹤施工進度"}`,
        time: p.deadline,
        done: false,
      })),
    // From bookings — today's appointments
    ...bookingData
      .filter((b) => b.date === "2026-03-21")
      .map((b, i) => ({
        id: 100 + i,
        text: `${b.name} — ${b.type}`,
        time: b.time,
        done: false,
      })),
  ].slice(0, 6);

  const [todos, setTodos] = useState(dynamicTodos);

  const toggleTodo = (id: number) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  const completedCount = todos.filter((t) => t.done).length;

  // Dynamic KPI values
  const activeProjects = projectData.filter((p) => p.status !== "completed").length;
  const pendingBookings = bookingData.length;

  const kpiCards = [
    { label: "進行中專案", value: String(activeProjects), unit: "件", change: "+2", up: true, color: "text-indigo-600", bg: "bg-indigo-50", icon: "📋" },
    { label: "本月營收", value: "182", unit: "萬", change: "+23%", up: true, color: "text-emerald-600", bg: "bg-emerald-50", icon: "💰" },
    { label: "待處理預約", value: String(pendingBookings), unit: "件", change: "+1", up: true, color: "text-amber-600", bg: "bg-amber-50", icon: "📅" },
    { label: "客戶評分", value: "4.8", unit: "/5", change: "+0.1", up: true, color: "text-violet-600", bg: "bg-violet-50", icon: "⭐" },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      {/* ── Welcome Banner ──────────────────────────────── */}
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl p-5 sm:p-8 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-indigo-200 text-sm">早安，</p>
            <h1 className="text-2xl sm:text-3xl font-bold mt-1">{designerName} 設計師</h1>
            <p className="text-indigo-200 text-sm mt-2 flex items-center gap-2">
              <span>☀️</span>
              <span>{getTodayString()} · 台北 26°C 晴</span>
            </p>
          </div>
          <div className="flex items-center gap-4 text-center">
            <div className="bg-white/15 backdrop-blur rounded-xl px-5 py-3">
              <p className="text-2xl font-bold">{completedCount}/{todos.length}</p>
              <p className="text-xs text-indigo-200">今日完成</p>
            </div>
            <div className="bg-white/15 backdrop-blur rounded-xl px-5 py-3">
              <p className="text-2xl font-bold">{pendingBookings}</p>
              <p className="text-xs text-indigo-200">待處理</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── KPI Cards ───────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpiCards.map((kpi) => (
          <div key={kpi.label} className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-slate-500">{kpi.label}</p>
              <span className={clsx("w-8 h-8 rounded-lg flex items-center justify-center text-sm", kpi.bg)}>
                {kpi.icon}
              </span>
            </div>
            <div className="flex items-baseline gap-1">
              <p className={clsx("text-2xl font-bold", kpi.color)}>{kpi.value}</p>
              <span className="text-sm text-slate-400">{kpi.unit}</span>
            </div>
            <p className={clsx("text-xs mt-1", kpi.up ? "text-emerald-600" : "text-red-500")}>
              {kpi.up ? "↑" : "↓"} {kpi.change} vs 上月
            </p>
          </div>
        ))}
      </div>

      {/* ── Middle: Todos + CRM Interactions ──────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Todos (from Projects & Bookings) */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-900">📝 今日待辦</h2>
            <span className="text-xs text-slate-400">{completedCount}/{todos.length} 已完成</span>
          </div>
          <div className="space-y-2">
            {todos.map((todo) => (
              <label
                key={todo.id}
                className={clsx(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors",
                  todo.done ? "bg-slate-50" : "hover:bg-slate-50"
                )}
              >
                <input
                  type="checkbox"
                  checked={todo.done}
                  onChange={() => toggleTodo(todo.id)}
                  className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 shrink-0"
                />
                <span className={clsx("text-sm flex-1 min-w-0", todo.done ? "text-slate-400 line-through" : "text-slate-700")}>
                  {todo.text}
                </span>
                <span className="text-xs text-slate-400 shrink-0">{todo.time}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Recent CRM Interactions */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-900">💬 最近 CRM 互動</h2>
            <Link href="/designer/crm" className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">
              查看全部
            </Link>
          </div>
          <div className="space-y-3">
            {crmInteractions.map((interaction) => (
              <div key={interaction.id} className="flex gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
                <div className={clsx("w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0", interaction.avatar)}>
                  {interaction.client[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-medium text-slate-900">{interaction.client}</span>
                    <span className={clsx(
                      "text-[10px] px-1.5 py-0.5 rounded-full font-medium",
                      interaction.status === "施工中" ? "bg-indigo-50 text-indigo-700" :
                      interaction.status === "已完工" ? "bg-emerald-50 text-emerald-700" :
                      interaction.status === "報價中" ? "bg-amber-50 text-amber-700" :
                      interaction.status === "簽約中" ? "bg-violet-50 text-violet-700" :
                      "bg-slate-50 text-slate-600"
                    )}>
                      {interaction.status}
                    </span>
                    <span className="text-[10px] text-slate-400 ml-auto">{interaction.time}</span>
                  </div>
                  <p className="text-xs text-slate-500 truncate">{interaction.action}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Quick Actions ───────────────────────────────── */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h2 className="text-sm font-semibold text-slate-900 mb-4">⚡ 快速操作</h2>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {quickActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-indigo-50 transition-colors group"
            >
              <span className="w-12 h-12 rounded-xl bg-slate-100 group-hover:bg-indigo-100 flex items-center justify-center text-2xl transition-colors">
                {action.icon}
              </span>
              <span className="text-sm font-medium text-slate-700 group-hover:text-indigo-700 transition-colors">
                {action.name}
              </span>
              <span className="text-[10px] text-slate-400">{action.desc}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Project Status Overview ──────────────────── */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-slate-900">📊 專案概覽</h2>
          <Link href="/designer/projects" className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">
            查看全部
          </Link>
        </div>
        <div className="space-y-3">
          {projectData.filter((p) => p.status !== "completed").map((project, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-medium text-slate-900 truncate">{project.title}</p>
                  <span className={clsx(
                    "text-[10px] px-1.5 py-0.5 rounded-full font-medium shrink-0",
                    project.status === "inProgress" ? "bg-blue-50 text-blue-700" :
                    project.status === "review" ? "bg-purple-50 text-purple-700" :
                    "bg-amber-50 text-amber-700"
                  )}>
                    {project.status === "inProgress" ? "進行中" : project.status === "review" ? "驗收中" : "待確認"}
                  </span>
                </div>
                <p className="text-xs text-slate-400">{project.client} · 截止 {project.deadline}</p>
              </div>
              <div className="w-24 shrink-0">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-400">進度</span>
                  <span className="font-medium text-slate-600">{project.progress}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5">
                  <div
                    className={clsx(
                      "h-1.5 rounded-full",
                      project.progress >= 80 ? "bg-emerald-500" : project.progress >= 50 ? "bg-blue-500" : "bg-amber-500"
                    )}
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
