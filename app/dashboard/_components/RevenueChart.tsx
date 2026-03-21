"use client";

import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

type Period = "month" | "quarter" | "year";

const monthlyData = [
  { label: "10月", revenue: 180, cost: 95, profit: 85 },
  { label: "11月", revenue: 210, cost: 102, profit: 108 },
  { label: "12月", revenue: 245, cost: 110, profit: 135 },
  { label: "1月", revenue: 198, cost: 98, profit: 100 },
  { label: "2月", revenue: 230, cost: 105, profit: 125 },
  { label: "3月", revenue: 275, cost: 115, profit: 160 },
];

const quarterlyData = [
  { label: "Q2 '25", revenue: 520, cost: 280, profit: 240 },
  { label: "Q3 '25", revenue: 610, cost: 305, profit: 305 },
  { label: "Q4 '25", revenue: 635, cost: 307, profit: 328 },
  { label: "Q1 '26", revenue: 703, cost: 318, profit: 385 },
];

const yearlyData = [
  { label: "2023", revenue: 1200, cost: 850, profit: 350 },
  { label: "2024", revenue: 1980, cost: 1050, profit: 930 },
  { label: "2025", revenue: 2450, cost: 1180, profit: 1270 },
  { label: "2026(預)", revenue: 3200, cost: 1350, profit: 1850 },
];

const periodConfig: Record<Period, { data: typeof monthlyData; unit: string }> =
  {
    month: { data: monthlyData, unit: "萬" },
    quarter: { data: quarterlyData, unit: "萬" },
    year: { data: yearlyData, unit: "萬" },
  };

export default function RevenueChart() {
  const [period, setPeriod] = useState<Period>("month");
  const { data, unit } = periodConfig[period];

  const latest = data[data.length - 1];
  const prev = data[data.length - 2];
  const revenueGrowth = prev
    ? (((latest.revenue - prev.revenue) / prev.revenue) * 100).toFixed(1)
    : "0";
  const profitMargin = ((latest.profit / latest.revenue) * 100).toFixed(1);

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-100 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-slate-700">營收趨勢</h2>
          <span className="text-xs px-2 py-0.5 rounded bg-amber-100 text-amber-700 font-semibold tracking-wide">
            MOCK
          </span>
        </div>
        <div className="flex items-center gap-0.5 bg-slate-100 rounded-lg p-0.5">
          {(
            [
              ["month", "月"],
              ["quarter", "季"],
              ["year", "年"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setPeriod(key)}
              className={`px-2.5 py-1 rounded-md text-[10px] font-medium transition-colors ${
                period === key
                  ? "bg-white text-indigo-700 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-3 gap-2">
        <div className="p-2.5 rounded-xl bg-slate-50/50 border border-slate-100">
          <p className="text-[10px] text-slate-400">本期營收</p>
          <p className="text-lg font-bold text-indigo-600">
            {latest.revenue}
            <span className="text-[10px] text-slate-400 ml-0.5">{unit}</span>
          </p>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-50/50 border border-slate-100">
          <p className="text-[10px] text-slate-400">營收成長</p>
          <p
            className={`text-lg font-bold ${Number(revenueGrowth) >= 0 ? "text-emerald-600" : "text-rose-600"}`}
          >
            {Number(revenueGrowth) >= 0 ? "+" : ""}
            {revenueGrowth}%
          </p>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-50/50 border border-slate-100">
          <p className="text-[10px] text-slate-400">淨利率</p>
          <p className="text-lg font-bold text-violet-600">{profitMargin}%</p>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 10, fill: "#94a3b8" }}
          />
          <YAxis
            tick={{ fontSize: 10, fill: "#94a3b8" }}
            width={36}
            tickFormatter={(v) => `${v}`}
          />
          <Tooltip
            formatter={(v, name) => {
              const nameMap: Record<string, string> = {
                revenue: "營收",
                cost: "成本",
                profit: "淨利",
              };
              return [`${v} ${unit}`, nameMap[String(name)] || String(name)];
            }}
            contentStyle={{
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
              fontSize: "12px",
            }}
          />
          <Legend
            formatter={(value) => {
              const nameMap: Record<string, string> = {
                revenue: "營收",
                cost: "成本",
                profit: "淨利",
              };
              return nameMap[value] || value;
            }}
            wrapperStyle={{ fontSize: "11px" }}
          />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#6366f1"
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
          <Line
            type="monotone"
            dataKey="cost"
            stroke="#f43f5e"
            strokeWidth={1.5}
            strokeDasharray="4 2"
            dot={{ r: 2 }}
          />
          <Line
            type="monotone"
            dataKey="profit"
            stroke="#10b981"
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
