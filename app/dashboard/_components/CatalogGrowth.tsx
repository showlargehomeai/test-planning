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

interface CatalogData {
  total: number;
  today: number;
  thisWeek: number;
  thisMonth: number;
  avgPerWeek: number;
  daily: { date: string; count: number }[];
  cumulative: { date: string; cumulative: number }[];
  topVendors: { name: string; count: number }[];
  updatedAt: string;
}

type TimeRange = "7d" | "30d" | "90d";

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

const ROSE_SHADES = [
  "#e11d48",
  "#f43f5e",
  "#fb7185",
  "#fda4af",
  "#fecdd3",
  "#ffe4e6",
  "#fecdd3",
  "#fda4af",
  "#fb7185",
  "#f43f5e",
];

export default function CatalogGrowth() {
  const [data, setData] = useState<CatalogData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [range, setRange] = useState<TimeRange>("90d");

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/dashboard/catalogs", { cache: "no-store" });
      if (!res.ok) throw new Error("API error");
      const json = await res.json();
      setData(json);
      setError(null);
    } catch {
      setError("無法載入目錄資料");
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
        <div className="h-5 bg-rose-100 rounded w-32 animate-pulse" />
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-rose-50 rounded-xl animate-pulse" />
          ))}
        </div>
        <div className="h-48 bg-rose-50 rounded-xl animate-pulse" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-rose-100 text-center lg:col-span-2">
        <p className="text-rose-500 text-sm">{error || "目錄資料載入失敗"}</p>
        <button
          onClick={fetchData}
          className="mt-2 text-xs text-rose-600 hover:underline"
        >
          重試
        </button>
      </div>
    );
  }

  const stats = [
    { label: "總目錄數", value: data.total, color: "text-rose-600" },
    { label: "今日新增", value: data.today, color: "text-pink-600" },
    { label: "本週新增", value: data.thisWeek, color: "text-rose-500" },
    { label: "本月新增", value: data.thisMonth, color: "text-pink-500" },
    { label: "週均上傳", value: data.avgPerWeek, color: "text-rose-400" },
  ];

  const rangeDays = range === "7d" ? 7 : range === "30d" ? 30 : 90;
  const filteredDaily = data.daily.slice(-rangeDays);
  const filteredCumulative = data.cumulative.slice(-rangeDays);

  const maxVendorCount =
    data.topVendors.length > 0 ? data.topVendors[0].count : 1;

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-100 lg:col-span-2 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-slate-700">📁 目錄上傳趨勢</h2>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-0.5 bg-slate-100 rounded-lg p-0.5">
            {(["7d", "30d", "90d"] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-2 py-1 rounded-md text-[10px] font-medium transition-colors ${
                  range === r
                    ? "bg-white text-rose-700 shadow-sm"
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
                ? "bg-rose-50 text-rose-700 border border-rose-200"
                : "bg-slate-50 text-slate-500 border border-slate-200"
            }`}
          >
            {autoRefresh ? "自動 10min" : "已暫停"}
          </button>
          <button
            onClick={fetchData}
            className="px-2 py-1 rounded-lg text-[10px] font-medium bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition-colors"
          >
            重整
          </button>
          <span className="text-[10px] text-slate-400">
            {new Date(data.updatedAt).toLocaleTimeString("zh-TW")}
          </span>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {stats.map((s) => (
          <div
            key={s.label}
            className="p-2 rounded-xl bg-rose-50/50 border border-rose-100"
          >
            <p className="text-[10px] text-slate-400">{s.label}</p>
            <p className={`text-lg font-bold ${s.color}`}>
              {typeof s.value === "number"
                ? s.value % 1 === 0
                  ? s.value.toLocaleString()
                  : s.value.toFixed(1)
                : s.value}
            </p>
          </div>
        ))}
      </div>

      {/* Cumulative Growth Area Chart */}
      <div>
        <p className="text-xs text-slate-500 mb-2">累計成長 ({range})</p>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={filteredCumulative}>
            <defs>
              <linearGradient id="gradCatalogCum" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#e11d48" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#e11d48" stopOpacity={0} />
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
              formatter={(v) => [`${v} 筆`, "累計目錄"]}
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid #fecdd3",
                fontSize: "12px",
              }}
            />
            <Area
              type="monotone"
              dataKey="cumulative"
              stroke="#e11d48"
              strokeWidth={2}
              fill="url(#gradCatalogCum)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Daily Uploads & Top Vendors Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Daily Uploads Bar Chart */}
        <div>
          <p className="text-xs text-slate-500 mb-2">每日上傳 ({range})</p>
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
                formatter={(v) => [`${v} 筆`, "上傳"]}
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #fecdd3",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="count" fill="#fb7185" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Vendors Horizontal Bar */}
        <div>
          <p className="text-xs text-slate-500 mb-2">Top 上傳供應商</p>
          <div className="space-y-1.5 max-h-[160px] overflow-y-auto">
            {data.topVendors.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">
                暫無資料
              </p>
            ) : (
              data.topVendors.map((v, i) => (
                <div key={v.name} className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-500 w-24 truncate shrink-0 text-right">
                    {v.name}
                  </span>
                  <div className="flex-1 h-5 bg-rose-50 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${(v.count / maxVendorCount) * 100}%`,
                        backgroundColor: ROSE_SHADES[i % ROSE_SHADES.length],
                      }}
                    />
                  </div>
                  <span className="text-[10px] font-semibold text-rose-600 w-8 text-right">
                    {v.count}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
