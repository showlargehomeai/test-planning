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

interface VendorData {
  total: number;
  active: number;
  verified: number;
  today: number;
  thisWeek: number;
  thisMonth: number;
  daily: { date: string; count: number }[];
  cumulative: { date: string; cumulative: number }[];
  tierDistribution: { tier: string; count: number }[];
  updatedAt: string;
}

type TimeRange = "7d" | "30d" | "90d";

const TIER_COLORS: Record<string, string> = {
  free: "#94a3b8",
  basic: "#2dd4bf",
  pro: "#0891b2",
  enterprise: "#6366f1",
  none: "#cbd5e1",
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

export default function VendorGrowth() {
  const [data, setData] = useState<VendorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [range, setRange] = useState<TimeRange>("90d");

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/dashboard/vendors", { cache: "no-store" });
      if (!res.ok) throw new Error("API error");
      const json = await res.json();
      setData(json);
      setError(null);
    } catch {
      setError("無法載入供應商資料");
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
        <p className="text-rose-500 text-sm">{error || "供應商資料載入失敗"}</p>
        <button
          onClick={fetchData}
          className="mt-2 text-xs text-teal-600 hover:underline"
        >
          重試
        </button>
      </div>
    );
  }

  const stats = [
    { label: "總供應商", value: data.total, color: "text-teal-600" },
    { label: "已啟用", value: data.active, color: "text-emerald-600" },
    { label: "已認證", value: data.verified, color: "text-cyan-600" },
    { label: "今日新增", value: data.today, color: "text-orange-600" },
    { label: "本週新增", value: data.thisWeek, color: "text-blue-600" },
    { label: "本月新增", value: data.thisMonth, color: "text-violet-600" },
  ];

  const rangeDays = range === "7d" ? 7 : range === "30d" ? 30 : 90;
  const filteredDaily = data.daily.slice(-rangeDays);
  const filteredCumulative = data.cumulative.slice(-rangeDays);

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-100 lg:col-span-2 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-slate-700">供應商成長</h2>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-0.5 bg-slate-100 rounded-lg p-0.5">
            {(["7d", "30d", "90d"] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-2 py-1 rounded-md text-[10px] font-medium transition-colors ${
                  range === r
                    ? "bg-white text-teal-700 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
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
            className="px-2 py-1 rounded-lg text-[10px] font-medium bg-teal-50 text-teal-700 border border-teal-200 hover:bg-teal-100 transition-colors"
          >
            重整
          </button>
          <span className="text-[10px] text-slate-400">
            {new Date(data.updatedAt).toLocaleTimeString("zh-TW")}
          </span>
        </div>
      </div>

      {/* Mini Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {stats.map((s) => (
          <div
            key={s.label}
            className="p-2 rounded-xl bg-slate-50/50 border border-slate-100"
          >
            <p className="text-[10px] text-slate-400">{s.label}</p>
            <p className={`text-lg font-bold ${s.color}`}>
              {s.value.toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      {/* Cumulative Growth */}
      <div>
        <p className="text-xs text-slate-500 mb-2">累計成長 ({range})</p>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={filteredCumulative}>
            <defs>
              <linearGradient id="gradVendor" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#14b8a6" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#14b8a6" stopOpacity={0} />
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
              formatter={(v) => [`${v} 家`, "累計供應商"]}
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                fontSize: "12px",
              }}
            />
            <Area
              type="monotone"
              dataKey="cumulative"
              stroke="#14b8a6"
              strokeWidth={2}
              fill="url(#gradVendor)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Daily + Tier Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Daily New */}
        <div>
          <p className="text-xs text-slate-500 mb-2">每日新增 ({range})</p>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={filteredDaily}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                tick={{ fontSize: 10, fill: "#94a3b8" }}
              />
              <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} width={30} />
              <Tooltip
                labelFormatter={(v) => `${v}`}
                formatter={(v) => [`${v} 家`, "新增"]}
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="count" fill="#5eead4" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Tier Distribution */}
        <div>
          <p className="text-xs text-slate-500 mb-2">付費方案分佈</p>
          <div className="space-y-2 pt-2">
            {data.tierDistribution.map((t) => {
              const maxCount = Math.max(
                ...data.tierDistribution.map((d) => d.count)
              );
              const pct = maxCount > 0 ? (t.count / maxCount) * 100 : 0;
              const color = TIER_COLORS[t.tier] || "#94a3b8";
              return (
                <div key={t.tier} className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-500 w-16 text-right capitalize">
                    {t.tier}
                  </span>
                  <div className="flex-1 h-5 bg-slate-50 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${pct}%`, backgroundColor: color }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-500 w-8">
                    {t.count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
