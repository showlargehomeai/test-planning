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

function StatCard({
  label,
  value,
  sub,
  color,
}: {
  label: string;
  value: number;
  sub?: string;
  color: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-slate-100">
      <p className="text-sm text-slate-500 mb-1">{label}</p>
      <p className={`text-2xl sm:text-3xl font-bold ${color}`}>
        {value.toLocaleString()}
      </p>
      {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
    </div>
  );
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

export default function DashboardPage() {
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
      setError("無法載入資料");
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
      <div className="flex items-center justify-center h-full">
        <div className="text-slate-400 text-lg">載入中...</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-red-500">{error || "發生錯誤"}</div>
      </div>
    );
  }

  const growthRate =
    data.yesterday > 0
      ? (((data.today - data.yesterday) / data.yesterday) * 100).toFixed(0)
      : data.today > 0
        ? "+100"
        : "0";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">戰情室</h1>
          <p className="text-sm text-slate-500">
            即時用戶成長監控 — LargeHome
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-3 py-2 sm:py-1.5 rounded-lg text-xs font-medium transition-colors min-h-[44px] sm:min-h-0 ${
              autoRefresh
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-slate-50 text-slate-500 border border-slate-200"
            }`}
          >
            {autoRefresh ? "自動更新中 (30s)" : "自動更新已暫停"}
          </button>
          <button
            onClick={fetchData}
            className="px-3 py-2 sm:py-1.5 rounded-lg text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 transition-colors min-h-[44px] sm:min-h-0"
          >
            手動重整
          </button>
          <span className="text-xs text-slate-400 w-full sm:w-auto">
            更新於 {new Date(data.updatedAt).toLocaleTimeString("zh-TW")}
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          label="總用戶數"
          value={data.total}
          color="text-indigo-600"
        />
        <StatCard
          label="今日新增"
          value={data.today}
          sub={`較昨日 ${Number(growthRate) >= 0 ? "+" : ""}${growthRate}%`}
          color="text-emerald-600"
        />
        <StatCard
          label="本週新增"
          value={data.thisWeek}
          color="text-blue-600"
        />
        <StatCard
          label="本月新增"
          value={data.thisMonth}
          color="text-violet-600"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* 累計成長曲線 */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-slate-100">
          <h2 className="text-sm font-semibold text-slate-700 mb-4">
            用戶累計成長
          </h2>
          <ResponsiveContainer width="100%" height={250}>
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
                tick={{ fontSize: 11, fill: "#94a3b8" }}
              />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} width={40} />
              <Tooltip
                labelFormatter={(v) => `${v}`}
                formatter={(v) => [`${v} 人`, "累計用戶"]}
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
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

        {/* 每日新增 */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-slate-100">
          <h2 className="text-sm font-semibold text-slate-700 mb-4">
            每日新增用戶 (近 90 天)
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data.daily}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                tick={{ fontSize: 11, fill: "#94a3b8" }}
              />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} width={40} />
              <Tooltip
                labelFormatter={(v) => `${v}`}
                formatter={(v) => [`${v} 人`, "新增"]}
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                }}
              />
              <Bar dataKey="count" fill="#818cf8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* DAU */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-slate-100 lg:col-span-2">
          <h2 className="text-sm font-semibold text-slate-700 mb-4">
            每日活躍用戶 (近 7 天)
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data.dau}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                tick={{ fontSize: 11, fill: "#94a3b8" }}
              />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} width={40} />
              <Tooltip
                labelFormatter={(v) => `${v}`}
                formatter={(v) => [`${v} 人`, "活躍用戶"]}
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                }}
              />
              <Bar dataKey="count" fill="#34d399" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
