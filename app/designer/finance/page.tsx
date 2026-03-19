"use client";

import { useState } from "react";
import { clsx } from "clsx";
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const monthlyData = [
  { month: "10月", revenue: 520000, cost: 340000, profit: 180000 },
  { month: "11月", revenue: 680000, cost: 420000, profit: 260000 },
  { month: "12月", revenue: 950000, cost: 580000, profit: 370000 },
  { month: "1月", revenue: 420000, cost: 280000, profit: 140000 },
  { month: "2月", revenue: 780000, cost: 490000, profit: 290000 },
  { month: "3月", revenue: 860000, cost: 510000, profit: 350000 },
];

const costBreakdown = [
  { name: "材料費", value: 215000, color: "#6366f1" },
  { name: "工資", value: 168000, color: "#8b5cf6" },
  { name: "設計軟體", value: 12000, color: "#a78bfa" },
  { name: "交通費", value: 8500, color: "#c4b5fd" },
  { name: "辦公室租金", value: 45000, color: "#818cf8" },
  { name: "其他", value: 61500, color: "#e0e7ff" },
];

const recentTransactions = [
  { id: 1, date: "2026-03-15", desc: "陳怡君 — 設計費第二期", type: "income" as const, amount: 280000, project: "大安區現代簡約宅" },
  { id: 2, date: "2026-03-14", desc: "永豐地板 — 超耐磨木地板", type: "expense" as const, amount: 112000, project: "大安區現代簡約宅" },
  { id: 3, date: "2026-03-13", desc: "王師傅工班 — 3月工資", type: "expense" as const, amount: 85000, project: "多案件" },
  { id: 4, date: "2026-03-12", desc: "林志明 — 工程款第一期", type: "income" as const, amount: 196000, project: "板橋工業風 Loft" },
  { id: 5, date: "2026-03-10", desc: "冠軍磁磚 — 六角花磚", type: "expense" as const, amount: 36000, project: "板橋工業風 Loft" },
  { id: 6, date: "2026-03-08", desc: "辦公室租金 — 3月", type: "expense" as const, amount: 45000, project: "營運費用" },
  { id: 7, date: "2026-03-05", desc: "劉雅婷 — 設計費尾款", type: "income" as const, amount: 150000, project: "中山區新古典豪宅" },
  { id: 8, date: "2026-03-03", desc: "虹牌油漆 — 乳膠漆", type: "expense" as const, amount: 17000, project: "信義區北歐親子宅" },
];

export default function FinancePage() {
  const [period, setPeriod] = useState<"month" | "quarter" | "year">("month");

  const totalRevenue = monthlyData.reduce((s, d) => s + d.revenue, 0);
  const totalCost = monthlyData.reduce((s, d) => s + d.cost, 0);
  const totalProfit = totalRevenue - totalCost;
  const profitMargin = ((totalProfit / totalRevenue) * 100).toFixed(1);

  const currentMonth = monthlyData[monthlyData.length - 1];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">📊 收支管理與利潤分析</h1>
          <p className="text-sm text-slate-500 mt-1">追蹤收入、支出與利潤表現</p>
        </div>
        <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
          {(["month", "quarter", "year"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={clsx("px-3 py-1.5 rounded-md text-sm font-medium", period === p ? "bg-white shadow-sm text-slate-900" : "text-slate-500")}
            >
              {p === "month" ? "本月" : p === "quarter" ? "本季" : "全年"}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5">
          <p className="text-xs text-slate-500 mb-1">本月營收</p>
          <p className="text-xl sm:text-2xl font-bold text-indigo-600">NT$ {currentMonth.revenue.toLocaleString()}</p>
          <p className="text-xs text-emerald-600 mt-1">↑ 10.3% vs 上月</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5">
          <p className="text-xs text-slate-500 mb-1">本月支出</p>
          <p className="text-xl sm:text-2xl font-bold text-red-500">NT$ {currentMonth.cost.toLocaleString()}</p>
          <p className="text-xs text-red-500 mt-1">↑ 4.1% vs 上月</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5">
          <p className="text-xs text-slate-500 mb-1">本月利潤</p>
          <p className="text-xl sm:text-2xl font-bold text-emerald-600">NT$ {currentMonth.profit.toLocaleString()}</p>
          <p className="text-xs text-emerald-600 mt-1">↑ 20.7% vs 上月</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5">
          <p className="text-xs text-slate-500 mb-1">利潤率</p>
          <p className="text-xl sm:text-2xl font-bold text-violet-600">{profitMargin}%</p>
          <p className="text-xs text-emerald-600 mt-1">高於行業平均 28%</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Revenue vs Cost Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-4 sm:p-5">
          <h2 className="text-sm font-semibold text-slate-700 mb-4">收支趨勢（近 6 個月）</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} width={50} tickFormatter={(v) => `${(v / 10000).toFixed(0)}萬`} />
              <Tooltip
                formatter={(v, name) => [`NT$ ${Number(v).toLocaleString()}`, name === "revenue" ? "營收" : name === "cost" ? "支出" : "利潤"]}
                contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0" }}
              />
              <Bar dataKey="revenue" fill="#818cf8" radius={[4, 4, 0, 0]} name="revenue" />
              <Bar dataKey="cost" fill="#fca5a5" radius={[4, 4, 0, 0]} name="cost" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Cost Breakdown Pie */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5">
          <h2 className="text-sm font-semibold text-slate-700 mb-4">本月支出分佈</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={costBreakdown} dataKey="value" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2}>
                {costBreakdown.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => `NT$ ${Number(v).toLocaleString()}`} contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0" }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-1 mt-2">
            {costBreakdown.map((item) => (
              <div key={item.name} className="flex items-center gap-1.5 text-xs">
                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-slate-600 truncate">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Profit Trend */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5">
        <h2 className="text-sm font-semibold text-slate-700 mb-4">利潤趨勢</h2>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={monthlyData}>
            <defs>
              <linearGradient id="gradProfit" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} />
            <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} width={50} tickFormatter={(v) => `${(v / 10000).toFixed(0)}萬`} />
            <Tooltip formatter={(v) => [`NT$ ${Number(v).toLocaleString()}`, "利潤"]} contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0" }} />
            <Area type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={2} fill="url(#gradProfit)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-4 sm:px-5 py-4 border-b border-slate-100">
          <h2 className="text-sm font-semibold text-slate-700">最近交易記錄</h2>
        </div>
        <div className="divide-y divide-slate-100">
          {recentTransactions.map((tx) => (
            <div key={tx.id} className="px-4 sm:px-5 py-3 flex items-center justify-between hover:bg-slate-50/50">
              <div className="flex items-center gap-3 min-w-0">
                <div className={clsx(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0",
                  tx.type === "income" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"
                )}>
                  {tx.type === "income" ? "↓" : "↑"}
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-slate-900 font-medium truncate">{tx.desc}</p>
                  <p className="text-xs text-slate-400">{tx.date} · {tx.project}</p>
                </div>
              </div>
              <span className={clsx(
                "text-sm font-semibold shrink-0 ml-3",
                tx.type === "income" ? "text-emerald-600" : "text-red-500"
              )}>
                {tx.type === "income" ? "+" : "-"} NT$ {tx.amount.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
