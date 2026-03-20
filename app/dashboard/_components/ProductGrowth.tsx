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

interface ProductData {
  total: number;
  active: number;
  today: number;
  thisWeek: number;
  thisMonth: number;
  daily: { date: string; count: number }[];
  cumulative: { date: string; cumulative: number }[];
  typeBreakdown: { type: string; label: string; count: number }[];
  updatedAt: string;
}

type TimeRange = "7d" | "30d" | "90d";

const TYPE_COLORS = ["#f59e0b", "#f97316", "#ef4444", "#ec4899", "#8b5cf6"];

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

export default function ProductGrowth() {
  const [data, setData] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [range, setRange] = useState<TimeRange>("90d");

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/dashboard/products", { cache: "no-store" });
      if (!res.ok) throw new Error("API error");
      const json = await res.json();
      setData(json);
      setError(null);
    } catch {
      setError("無法載入商品資料");
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
        <p className="text-rose-500 text-sm">{error || "商品資料載入失敗"}</p>
        <button
          onClick={fetchData}
          className="mt-2 text-xs text-amber-600 hover:underline"
        >
          重試
        </button>
      </div>
    );
  }

  const stats = [
    { label: "總商品", value: data.total, color: "text-amber-600" },
    { label: "上架中", value: data.active, color: "text-emerald-600" },
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
        <h2 className="text-sm font-semibold text-slate-700">商品成長</h2>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-0.5 bg-slate-100 rounded-lg p-0.5">
            {(["7d", "30d", "90d"] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-2 py-1 rounded-md text-[10px] font-medium transition-colors ${
                  range === r
                    ? "bg-white text-amber-700 shadow-sm"
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
            className="px-2 py-1 rounded-lg text-[10px] font-medium bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition-colors"
          >
            重整
          </button>
          <span className="text-[10px] text-slate-400">
            {new Date(data.updatedAt).toLocaleTimeString("zh-TW")}
          </span>
        </div>
      </div>

      {/* Mini Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
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
              <linearGradient id="gradProduct" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
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
              formatter={(v) => [`${v} 件`, "累計商品"]}
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                fontSize: "12px",
              }}
            />
            <Area
              type="monotone"
              dataKey="cumulative"
              stroke="#f59e0b"
              strokeWidth={2}
              fill="url(#gradProduct)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Daily + Type Breakdown Grid */}
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
                formatter={(v) => [`${v} 件`, "新增"]}
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="count" fill="#fbbf24" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Type Breakdown */}
        <div>
          <p className="text-xs text-slate-500 mb-2">商品類型分佈</p>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart
              data={data.typeBreakdown}
              layout="vertical"
              margin={{ left: 10, right: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis type="number" tick={{ fontSize: 10, fill: "#94a3b8" }} />
              <YAxis
                type="category"
                dataKey="label"
                tick={{ fontSize: 10, fill: "#94a3b8" }}
                width={60}
              />
              <Tooltip
                formatter={(v) => [`${v} 件`, "數量"]}
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="count" radius={[0, 3, 3, 0]}>
                {data.typeBreakdown.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={TYPE_COLORS[index % TYPE_COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
