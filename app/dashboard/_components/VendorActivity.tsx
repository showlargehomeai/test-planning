"use client";

import { useState, useEffect, useCallback } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface VendorActivityData {
  vendors: {
    id: string;
    name: string;
    lastLoginAt: string | null;
    activityLevel: "active" | "moderate" | "inactive";
  }[];
  topUpdaters: {
    id: string;
    name: string;
    productsUpdated: number;
  }[];
  summary: {
    active_7d: number;
    active_30d: number;
    inactive: number;
  };
  updatedAt: string;
}

const ACTIVITY_COLORS = {
  active: "#22c55e",
  moderate: "#f59e0b",
  inactive: "#ef4444",
};

export default function VendorActivity() {
  const [data, setData] = useState<VendorActivityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/dashboard/vendor-activity");
      if (!res.ok) throw new Error("Failed to fetch");
      const json = await res.json();
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 600000);
    return () => clearInterval(interval);
  }, [fetchData]);

  if (loading && !data) {
    return (
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-100 animate-pulse">
        <div className="h-5 bg-slate-100 rounded w-32 mb-3" />
        <div className="space-y-3">
          <div className="h-16 bg-slate-50 rounded-xl" />
          <div className="h-48 bg-slate-50 rounded-xl" />
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-red-100">
        <p className="text-red-500 text-sm">載入廠商活躍度失敗：{error}</p>
        <button
          onClick={fetchData}
          className="mt-2 text-xs text-blue-600 hover:underline"
        >
          重試
        </button>
      </div>
    );
  }

  if (!data) return null;

  const pieData = [
    { name: "7日活躍", value: data.summary.active_7d, color: ACTIVITY_COLORS.active },
    {
      name: "30日活躍",
      value: data.summary.active_30d - data.summary.active_7d,
      color: ACTIVITY_COLORS.moderate,
    },
    { name: "不活躍", value: data.summary.inactive, color: ACTIVITY_COLORS.inactive },
  ].filter((d) => d.value > 0);

  const barData = data.topUpdaters.filter((u) => u.productsUpdated > 0);

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base sm:text-lg font-semibold text-slate-900">
          🔥 廠商活躍度
        </h2>
        <button
          onClick={fetchData}
          disabled={loading}
          className="text-xs text-slate-500 hover:text-slate-700 disabled:opacity-50 transition-colors"
        >
          {loading ? "更新中…" : "🔄 重新整理"}
        </button>
      </div>

      {/* Section 1: Summary Badges */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-5">
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-center">
          <div className="text-xs text-emerald-600 font-medium">7日活躍</div>
          <div className="text-xl sm:text-2xl font-bold text-emerald-700 mt-1">
            {data.summary.active_7d}
          </div>
        </div>
        <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-center">
          <div className="text-xs text-amber-600 font-medium">30日活躍</div>
          <div className="text-xl sm:text-2xl font-bold text-amber-700 mt-1">
            {data.summary.active_30d}
          </div>
        </div>
        <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-center">
          <div className="text-xs text-red-600 font-medium">不活躍</div>
          <div className="text-xl sm:text-2xl font-bold text-red-700 mt-1">
            {data.summary.inactive}
          </div>
        </div>
      </div>

      {/* Section 2 & 3: Charts side by side on desktop, stacked on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Bar Chart: Top Updaters */}
        <div className="lg:col-span-2">
          <h3 className="text-sm font-medium text-slate-700 mb-2">
            近30日商品更新 Top 20
          </h3>
          {barData.length > 0 ? (
            <div className="h-[300px] sm:h-[360px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={barData}
                  layout="vertical"
                  margin={{ top: 0, right: 20, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={100}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid #e2e8f0",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                      fontSize: "12px",
                    }}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    formatter={((value: any) => [`${value} 件`, "更新商品數"]) as any}
                  />
                  <Bar
                    dataKey="productsUpdated"
                    fill="#6366f1"
                    radius={[0, 6, 6, 0]}
                    maxBarSize={24}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-slate-400 text-sm">
              近30日無商品更新紀錄
            </div>
          )}
        </div>

        {/* Pie Chart: Distribution */}
        <div>
          <h3 className="text-sm font-medium text-slate-700 mb-2">
            活躍度分布
          </h3>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    fontSize: "12px",
                  }}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  formatter={((value: any) => [`${value} 家`, ""]) as any}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {/* Legend */}
          <div className="flex flex-wrap justify-center gap-3 mt-1">
            {pieData.map((entry) => (
              <div key={entry.name} className="flex items-center gap-1.5 text-xs text-slate-600">
                <span
                  className="inline-block w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                {entry.name} ({entry.value})
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Last updated */}
      <div className="mt-3 text-right text-xs text-slate-400">
        更新時間：{new Date(data.updatedAt).toLocaleString("zh-TW")}
      </div>
    </div>
  );
}
