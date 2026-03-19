"use client";

import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface RetentionRow {
  week: string;
  registered: number;
  day1: number | null;
  day7: number | null;
  day30: number | null;
}

interface RetentionData {
  retention: RetentionRow[];
  updatedAt: string;
}

function formatWeek(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

export default function RetentionChart() {
  const [data, setData] = useState<RetentionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/dashboard/retention", { cache: "no-store" })
      .then((r) => {
        if (!r.ok) throw new Error("API error");
        return r.json();
      })
      .then(setData)
      .catch(() => setError("無法載入留存資料"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-100 space-y-4">
        <div className="h-5 bg-slate-100 rounded w-32 animate-pulse" />
        <div className="h-64 bg-slate-50 rounded-xl animate-pulse" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-rose-100 text-center">
        <p className="text-rose-500 text-sm">{error || "留存資料載入失敗"}</p>
      </div>
    );
  }

  const chartData = data.retention.map((r) => ({
    week: formatWeek(r.week),
    "Day 1": r.day1 ?? 0,
    "Day 7": r.day7 ?? 0,
    "Day 30": r.day30 ?? 0,
    registered: r.registered,
  }));

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-100 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-slate-700">留存率分析</h2>
        <span className="text-[10px] text-slate-400">
          按註冊週分組 · 最近 12 週
        </span>
      </div>

      {/* Custom legend */}
      <div className="flex flex-wrap gap-3 text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-indigo-500" /> Day 1 留存
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-blue-400" /> Day 7 留存
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-emerald-400" /> Day 30 留存
        </span>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={chartData} barCategoryGap="20%">
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis
            dataKey="week"
            tick={{ fontSize: 10, fill: "#94a3b8" }}
          />
          <YAxis
            tick={{ fontSize: 10, fill: "#94a3b8" }}
            width={36}
            domain={[0, 100]}
            tickFormatter={(v) => `${v}%`}
          />
          <Tooltip
            formatter={(value) => [`${value}%`, ""]}
            labelFormatter={(label) => `週起始: ${label}`}
            contentStyle={{
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
              fontSize: "12px",
            }}
          />
          <Legend wrapperStyle={{ fontSize: "11px" }} />
          <Bar dataKey="Day 1" fill="#6366f1" radius={[3, 3, 0, 0]} />
          <Bar dataKey="Day 7" fill="#60a5fa" radius={[3, 3, 0, 0]} />
          <Bar dataKey="Day 30" fill="#34d399" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>

      {/* Cohort details table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-slate-600">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="text-left py-2 font-medium text-slate-400">週</th>
              <th className="text-right py-2 font-medium text-slate-400">
                註冊數
              </th>
              <th className="text-right py-2 font-medium text-slate-400">
                Day 1
              </th>
              <th className="text-right py-2 font-medium text-slate-400">
                Day 7
              </th>
              <th className="text-right py-2 font-medium text-slate-400">
                Day 30
              </th>
            </tr>
          </thead>
          <tbody>
            {data.retention.map((r) => (
              <tr key={r.week} className="border-b border-slate-50">
                <td className="py-1.5">{formatWeek(r.week)}</td>
                <td className="text-right">{r.registered}</td>
                <td className="text-right">
                  {r.day1 !== null ? `${r.day1}%` : "—"}
                </td>
                <td className="text-right">
                  {r.day7 !== null ? `${r.day7}%` : "—"}
                </td>
                <td className="text-right">
                  {r.day30 !== null ? `${r.day30}%` : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
