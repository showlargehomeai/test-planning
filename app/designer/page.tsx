"use client";

import { useState } from "react";
import Link from "next/link";
import { clsx } from "clsx";

/* ── Mock Data ─────────────────────────────────────────────── */

const designerName = "林宥彤";

const todayTodos = [
  { id: 1, text: "陳怡君 大安區案場 — 施工進度巡檢", time: "09:30", done: false },
  { id: 2, text: "林志明 板橋老屋 — 3D 設計圖定稿確認", time: "11:00", done: false },
  { id: 3, text: "劉雅婷 中山豪宅 — 建材樣品比對會議", time: "14:00", done: false },
  { id: 4, text: "張家豪 日式案 — 線上報價說明", time: "15:30", done: false },
  { id: 5, text: "上傳本週作品集更新至平台", time: "17:00", done: false },
  { id: 6, text: "回覆王美玲的結案滿意度問卷", time: "18:00", done: false },
];

const kpiCards = [
  { label: "本月接案數", value: "7", unit: "件", change: "+2", up: true, color: "text-indigo-600", bg: "bg-indigo-50", icon: "📋" },
  { label: "本月營收", value: "182", unit: "萬", change: "+23%", up: true, color: "text-emerald-600", bg: "bg-emerald-50", icon: "💰" },
  { label: "媒合成功率", value: "84", unit: "%", change: "+5%", up: true, color: "text-amber-600", bg: "bg-amber-50", icon: "🎯" },
  { label: "客戶評分", value: "4.8", unit: "/5", change: "+0.1", up: true, color: "text-violet-600", bg: "bg-violet-50", icon: "⭐" },
];

const recentMessages = [
  { id: 1, sender: "陳怡君", role: "業主", avatar: "bg-gradient-to-br from-pink-400 to-rose-500", time: "10 分鐘前", preview: "林設計師您好，廚房磁磚我選好了，想跟您確認一下顏色搭配..." },
  { id: 2, sender: "王師傅", role: "工班", avatar: "bg-gradient-to-br from-blue-400 to-indigo-500", time: "1 小時前", preview: "林小姐，板橋案的水電走線已完成，麻煩您抽空驗收一下。" },
  { id: 3, sender: "大成建材", role: "建材商", avatar: "bg-gradient-to-br from-emerald-400 to-teal-500", time: "2 小時前", preview: "您訂的義大利進口磁磚已到貨，預計明天可以配送到工地。" },
  { id: 4, sender: "劉雅婷", role: "業主", avatar: "bg-gradient-to-br from-violet-400 to-purple-500", time: "3 小時前", preview: "設計師，主臥的壁紙我想改成淺灰色系，可以幫我出個效果圖嗎？" },
];

const quickActions = [
  { name: "業主媒合", href: "/designer/matching", icon: "🎯", desc: "找新案源" },
  { name: "客戶管理", href: "/designer/crm", icon: "👥", desc: "客戶資料" },
  { name: "專案追蹤", href: "/designer/projects", icon: "📋", desc: "進度管理" },
  { name: "AI 出圖", href: "/designer/rendering", icon: "🎨", desc: "快速渲染" },
  { name: "智慧報價", href: "/designer/quotation", icon: "💰", desc: "產出報價" },
  { name: "工程看板", href: "/designer/kanban", icon: "📊", desc: "施工排程" },
];

const activityFeed = [
  { id: 1, time: "今天 09:15", icon: "✅", iconBg: "bg-emerald-100 text-emerald-700", text: "陳怡君案 — 客廳天花板施工完成" },
  { id: 2, time: "今天 08:40", icon: "📦", iconBg: "bg-blue-100 text-blue-700", text: "板橋林志明案 — 進口木地板到貨入庫" },
  { id: 3, time: "昨天 17:20", icon: "📝", iconBg: "bg-violet-100 text-violet-700", text: "劉雅婷 中山豪宅 — 合約修訂完成，等待簽章" },
  { id: 4, time: "昨天 14:00", icon: "💬", iconBg: "bg-amber-100 text-amber-700", text: "張家豪來電諮詢日式風格玄關設計細節" },
  { id: 5, time: "前天 11:30", icon: "⭐", iconBg: "bg-pink-100 text-pink-700", text: "王美玲完成結案評價 — 5 星好評！" },
];

/* ── Helpers ────────────────────────────────────────────────── */

function getTodayString() {
  const d = new Date();
  const weekdays = ["日", "一", "二", "三", "四", "五", "六"];
  return `${d.getFullYear()} 年 ${d.getMonth() + 1} 月 ${d.getDate()} 日（${weekdays[d.getDay()]}）`;
}

/* ── Component ─────────────────────────────────────────────── */

export default function DesignerDashboard() {
  const [todos, setTodos] = useState(todayTodos);

  const toggleTodo = (id: number) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  const completedCount = todos.filter((t) => t.done).length;

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
              <span>{getTodayString()} ・ 台北 26°C 晴</span>
            </p>
          </div>
          <div className="flex items-center gap-4 text-center">
            <div className="bg-white/15 backdrop-blur rounded-xl px-5 py-3">
              <p className="text-2xl font-bold">{completedCount}/{todos.length}</p>
              <p className="text-xs text-indigo-200">今日完成</p>
            </div>
            <div className="bg-white/15 backdrop-blur rounded-xl px-5 py-3">
              <p className="text-2xl font-bold">3</p>
              <p className="text-xs text-indigo-200">待回覆</p>
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

      {/* ── Middle: Todos + Messages ────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Todos */}
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

        {/* Recent Messages */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-900">💬 近期訊息</h2>
            <button className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">查看全部</button>
          </div>
          <div className="space-y-3">
            {recentMessages.map((msg) => (
              <div key={msg.id} className="flex gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
                <div className={clsx("w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0", msg.avatar)}>
                  {msg.sender[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-medium text-slate-900">{msg.sender}</span>
                    <span className={clsx(
                      "text-[10px] px-1.5 py-0.5 rounded-full font-medium",
                      msg.role === "業主" ? "bg-indigo-50 text-indigo-700" :
                      msg.role === "工班" ? "bg-amber-50 text-amber-700" :
                      "bg-emerald-50 text-emerald-700"
                    )}>
                      {msg.role}
                    </span>
                    <span className="text-[10px] text-slate-400 ml-auto">{msg.time}</span>
                  </div>
                  <p className="text-xs text-slate-500 truncate">{msg.preview}</p>
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

      {/* ── Activity Feed ───────────────────────────────── */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h2 className="text-sm font-semibold text-slate-900 mb-4">🕐 最近活動</h2>
        <div className="space-y-0">
          {activityFeed.map((activity, index) => (
            <div key={activity.id} className="flex gap-4 relative">
              {/* Timeline line */}
              {index < activityFeed.length - 1 && (
                <div className="absolute left-[15px] top-9 bottom-0 w-px bg-slate-200" />
              )}
              {/* Icon */}
              <div className={clsx("w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0 z-10", activity.iconBg)}>
                {activity.icon}
              </div>
              {/* Content */}
              <div className="flex-1 min-w-0 pb-5">
                <p className="text-sm text-slate-700">{activity.text}</p>
                <p className="text-xs text-slate-400 mt-0.5">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
