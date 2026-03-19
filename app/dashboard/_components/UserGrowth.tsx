"use client";

import { useState, useEffect, useCallback } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface DashboardData {
  total: number;
  today: number;
  yesterday: number;
  thisWeek: number;
  thisMonth: number;
  daily: { date: string; count: number }[];
  cumulative: { date: string; cumulative: number }[];
  dau: { date: string; count: number }[];
  updatedAt: string;
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

export default function UserGrowth() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/dashboard", { cache: "no-store" });
      if (!res.ok) throw new Error("API error");
      const json = await res.json();
      setData(json);
      setError(null);
    } catch {
      setError("無法載入用戶資料");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [autoRefresh, fetchData]);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-100 space-y-4 lg:col-span-2">
        <div className="h-5 bg-slate-100 rounded w-32 animate-pulse" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-16 bg-slate-50 rounded-xl animate-pulse" />
          ))}
        </div>
        <div className="h-48 bg-slate-50 rounded-xl animate-pulse" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-rose-100 text-center lg:col-span-2">
        <p className="text-rose-500 text-sm">{error || "用戶資料載入失敗"}</p>
        <button
          onClick={fetchData}
          className="mt-2 text-xs text-indigo-600 hover:underline"
        >
          重試
        </button>
      </div>
    );
  }

  const growthRate =
    data.yesterday > 0
      ? (((data.today - data.yesterday) / data.yesterday) * 100).toFixed(0)
      : data.today > 0
        ? "+100"
        : "0";

  const stats = [
    { label: "總用戶", value: data.total, color: "text-indigo-600" },
    {
      label: "今日新增",
      value: data.today,
      color: "text-emerald-600",
      sub: `${Number(growthRate) >= 0 ? "+" : ""}${growthRate}%`,
    },
    { label: "本週", value: data.thisWeek, color: "text-blue-600" },
    { label: "本月", value: data.thisMonth, color: "text-violet-600" },
  ];

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-100 lg:col-span-2 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-slate-700">用戶成長</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-2 py-1 rounded-lg text-[10px] font-medium transition-colors ${
              autoRefresh
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-slate-50 text-slate-500 border border-slate-200"
            }`}
          >
            {autoRefresh ? "自動 30s" : "已暫停"}
          </button>
          <button
            onClick={fetchData}
            className="px-2 py-1 rounded-lg text-[10px] font-medium bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 transition-colors"
          >
            重整
          </button>
          <span className="text-[10px] text-slate-400">
            {new Date(data.updatedAt).toLocaleTimeString("zh-TW")}
          </span>
        </div>
      </div>

      {/* Mini Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {stats.map((s) => (
          <div
            key={s.label}
            className="p-2 rounded-xl bg-slate-50/50 border border-slate-100"
          >
            <p className="text-[10px] text-slate-400">{s.label}</p>
            <p className={`text-lg font-bold ${s.color}`}>
              {s.value.toLocaleString()}
            </p>
            {"sub" in s && s.sub && (
              <p className="text-[10px] text-slate-400">{s.sub}</p>
            )}
          </div>
        ))}
      </div>

      {/* Cumulative Growth */}
      <div>
        <p className="text-xs text-slate-500 mb-2">累計成長</p>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={data.cumulative}>
            <defs>
              <linearGradient id="gradCum" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              tick={{ fontSize: 10, fill: "#94a3b8" }}
            />
            <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} width={36} />
            <Tooltip
              labelFormatter={(v) => `${v}`}
              formatter={(v) => [`${v} 人`, "累計用戶"]}
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                fontSize: "12px",
              }}
            />
            <Area
              type="monotone"
              dataKey="cumulative"
              stroke="#6366f1"
              strokeWidth={2}
              fill="url(#gradCum)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Daily Charts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Daily New */}
        <div>
          <p className="text-xs text-slate-500 mb-2">每日新增 (90天)</p>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={data.daily}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                tick={{ fontSize: 10, fill: "#94a3b8" }}
              />
              <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} width={30} />
              <Tooltip
                labelFormatter={(v) => `${v}`}
                formatter={(v) => [`${v} 人`, "新增"]}
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="count" fill="#818cf8" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* DAU */}
        <div>
          <p className="text-xs text-slate-500 mb-2">DAU (7天)</p>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={data.dau}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                tick={{ fontSize: 10, fill: "#94a3b8" }}
              />
              <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} width={30} />
              <Tooltip
                labelFormatter={(v) => `${v}`}
                formatter={(v) => [`${v} 人`, "活躍用戶"]}
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="count" fill="#34d399" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
