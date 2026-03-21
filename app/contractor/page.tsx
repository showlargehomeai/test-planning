"use client";

import { useState } from "react";

const stats = [
  { label: "本月工程數", value: "12", sub: "較上月 +3", icon: "🏗️", trend: "up" },
  { label: "進行中專案", value: "5", sub: "2 件本週完工", icon: "⚡", trend: "neutral" },
  { label: "待收款金額", value: "NT$ 487,000", sub: "3 筆待請款", icon: "💰", trend: "down" },
  { label: "評價分數", value: "4.8", sub: "共 56 則評價", icon: "⭐", trend: "up" },
];

const activeProjects = [
  {
    id: 1,
    name: "大安區林宅翻新",
    designer: "王設計師",
    progress: 65,
    trades: ["泥作", "水電"],
    deadline: "2026-04-05",
    status: "進行中",
  },
  {
    id: 2,
    name: "信義區張宅廚房改造",
    designer: "李設計師",
    progress: 30,
    trades: ["木工", "水電", "油漆"],
    deadline: "2026-04-20",
    status: "進行中",
  },
  {
    id: 3,
    name: "中山區陳宅浴室翻修",
    designer: "陳設計師",
    progress: 90,
    trades: ["泥作", "鋁窗"],
    deadline: "2026-03-25",
    status: "即將完工",
  },
  {
    id: 4,
    name: "松山區吳宅全室裝潢",
    designer: "張設計師",
    progress: 10,
    trades: ["拆除", "泥作", "水電", "木工", "油漆"],
    deadline: "2026-06-15",
    status: "剛開工",
  },
  {
    id: 5,
    name: "內湖區黃宅陽台外推",
    designer: "林設計師",
    progress: 50,
    trades: ["鋁窗", "泥作", "油漆"],
    deadline: "2026-04-10",
    status: "進行中",
  },
];

const todaySchedule = [
  { time: "08:00", project: "大安區林宅翻新", task: "浴室磁磚鋪設", trade: "泥作", workers: "陳師傅、小林" },
  { time: "08:30", project: "信義區張宅廚房改造", task: "廚房配管", trade: "水電", workers: "張師傅" },
  { time: "13:00", project: "中山區陳宅浴室翻修", task: "鋁窗安裝驗收", trade: "鋁窗", workers: "李師傅" },
  { time: "14:00", project: "內湖區黃宅陽台外推", task: "外牆防水施作", trade: "泥作", workers: "陳師傅、阿國" },
];

const tradeColors: Record<string, string> = {
  泥作: "bg-orange-100 text-orange-700",
  水電: "bg-blue-100 text-blue-700",
  木工: "bg-yellow-100 text-yellow-800",
  油漆: "bg-green-100 text-green-700",
  鋁窗: "bg-purple-100 text-purple-700",
  拆除: "bg-red-100 text-red-700",
};

export default function ContractorDashboard() {
  const [greeting] = useState(() => {
    const h = new Date().getHours();
    if (h < 12) return "早安";
    if (h < 18) return "午安";
    return "晚安";
  });

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{greeting}，阿明師傅</h1>
        <p className="text-slate-500 mt-1">今天是 2026 年 3 月 21 日（六）｜今日 4 項施工排程</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-xl border border-amber-100 p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">{s.icon}</span>
              {s.trend === "up" && <span className="text-xs text-green-600 font-medium">↑</span>}
              {s.trend === "down" && <span className="text-xs text-red-500 font-medium">↓</span>}
            </div>
            <p className="text-2xl font-bold text-slate-900">{s.value}</p>
            <p className="text-xs text-slate-500 mt-1">{s.label}</p>
            <p className="text-xs text-slate-400 mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-5 gap-6">
        {/* Today's Schedule */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-amber-100 p-5">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">今日施工排程</h2>
          <div className="space-y-3">
            {todaySchedule.map((item, idx) => (
              <div key={idx} className="flex gap-3 items-start">
                <div className="text-sm font-mono text-amber-600 font-medium w-12 shrink-0 pt-0.5">
                  {item.time}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">{item.task}</p>
                  <p className="text-xs text-slate-500 truncate">{item.project}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs px-1.5 py-0.5 rounded ${tradeColors[item.trade] ?? "bg-slate-100 text-slate-600"}`}>
                      {item.trade}
                    </span>
                    <span className="text-xs text-slate-400">{item.workers}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Projects */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-amber-100 p-5">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">進行中專案</h2>
          <div className="space-y-4">
            {activeProjects.map((p) => (
              <div key={p.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{p.name}</p>
                    <p className="text-xs text-slate-500">{p.designer}｜交期 {p.deadline}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium shrink-0 ml-2 ${
                    p.status === "即將完工"
                      ? "bg-green-50 text-green-700"
                      : p.status === "剛開工"
                        ? "bg-blue-50 text-blue-700"
                        : "bg-amber-50 text-amber-700"
                  }`}>
                    {p.status}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-slate-100 rounded-full h-2">
                    <div
                      className="bg-amber-500 h-2 rounded-full transition-all"
                      style={{ width: `${p.progress}%` }}
                    />
                  </div>
                  <span className="text-xs text-slate-500 w-8 text-right">{p.progress}%</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {p.trades.map((t) => (
                    <span key={t} className={`text-xs px-1.5 py-0.5 rounded ${tradeColors[t] ?? "bg-slate-100 text-slate-600"}`}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
