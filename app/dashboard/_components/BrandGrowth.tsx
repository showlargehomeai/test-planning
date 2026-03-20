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
  Cell,
} from "recharts";

interface BrandData {
  total: number;
  today: number;
  thisWeek: number;
  thisMonth: number;
  daily: { date: string; count: number }[];
  cumulative: { date: string; cumulative: number }[];
  topVendors: { name: string; brandCount: number }[];
  updatedAt: string;
}

type TimeRange = "7d" | "30d" | "90d";

const PURPLE_SHADES = [
  "#7c3aed",
  "#8b5cf6",
  "#a78bfa",
  "#c4b5fd",
  "#ddd6fe",
  "#ede9fe",
  "#7c3aed",
  "#8b5cf6",
  "#a78bfa",
  "#c4b5fd",
];

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

export default function BrandGrowth() {
  const [data, setData] = useState<BrandData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [range, setRange] = useState<TimeRange>("90d");

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/dashboard/brands", { cache: "no-store" });
      if (!res.ok) throw new Error("API error");
      const json = await res.json();
      setData(json);
      setError(null);
    } catch {
      setError("無法載入品牌資料");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(fetchData, 600000);
    return () => clearInterval(interval);
  }, [autoRefresh, fetchData]);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-100 space-y-4 lg:col-span-2">
        <div className="h-5 bg-violet-100 rounded w-32 animate-pulse" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-16 bg-violet-50 rounded-xl animate-pulse" />
          ))}
        </div>
        <div className="h-48 bg-violet-50 rounded-xl animate-pulse" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-violet-100 text-center lg:col-span-2">
        <p className="text-violet-500 text-sm">{error || "品牌資料載入失敗"}</p>
        <button
          onClick={fetchData}
          className="mt-2 text-xs text-violet-600 hover:underline"
        >
          重試
        </button>
      </div>
    );
  }

  const stats = [
    { label: "總品牌數", value: data.total, color: "text-violet-600" },
    { label: "今日新增", value: data.today, color: "text-purple-600" },
    { label: "本週新增", value: data.thisWeek, color: "text-fuchsia-600" },
    { label: "本月新增", value: data.thisMonth, color: "text-violet-500" },
  ];

  const rangeDays = range === "7d" ? 7 : range === "30d" ? 30 : 90;
  const filteredDaily = data.daily.slice(-rangeDays);
  const filteredCumulative = data.cumulative.slice(-rangeDays);

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-100 lg:col-span-2 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-slate-700">品牌成長</h2>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-0.5 bg-slate-100 rounded-lg p-0.5">
            {(["7d", "30d", "90d"] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-2 py-1 rounded-md text-[10px] font-medium transition-colors ${
                  range === r
                    ? "bg-white text-violet-700 shadow-sm"
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
                ? "bg-violet-50 text-violet-700 border border-violet-200"
                : "bg-slate-50 text-slate-500 border border-slate-200"
            }`}
          >
            {autoRefresh ? "自動 10min" : "已暫停"}
          </button>
          <button
            onClick={fetchData}
            className="px-2 py-1 rounded-lg text-[10px] font-medium bg-violet-50 text-violet-700 border border-violet-200 hover:bg-violet-100 transition-colors"
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
            className="p-2 rounded-xl bg-violet-50/50 border border-violet-100"
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
        <p className="text-xs text-slate-500 mb-2">累計品牌成長 ({range})</p>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={filteredCumulative}>
            <defs>
              <linearGradient id="gradBrandCum" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
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
              formatter={(v) => [`${v} 個`, "累計品牌"]}
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                fontSize: "12px",
              }}
            />
            <Area
              type="monotone"
              dataKey="cumulative"
              stroke="#8b5cf6"
              strokeWidth={2}
              fill="url(#gradBrandCum)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Daily Charts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Daily New */}
        <div>
          <p className="text-xs text-slate-500 mb-2">每日新增品牌 ({range})</p>
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
                formatter={(v) => [`${v} 個`, "新增"]}
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="count" fill="#a78bfa" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Vendors by Brand Count */}
        <div>
          <p className="text-xs text-slate-500 mb-2">品牌數 Top 10 廠商</p>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={data.topVendors} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis type="number" tick={{ fontSize: 10, fill: "#94a3b8" }} />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 9, fill: "#94a3b8" }}
                width={70}
              />
              <Tooltip
                formatter={(v) => [`${v} 個`, "品牌數"]}
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="brandCount" radius={[0, 3, 3, 0]}>
                {data.topVendors.map((_, index) => (
                  <Cell key={index} fill={PURPLE_SHADES[index % PURPLE_SHADES.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
