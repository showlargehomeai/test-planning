"use client";

import { useState, useEffect, useCallback } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface TypeItem {
  type: string;
  count: number;
}

interface CategoryItem {
  category: string;
  count: number;
}

interface CategoryData {
  typeDistribution: TypeItem[];
  decorationCategories: CategoryItem[];
  kitchenCategories: CategoryItem[];
  bathroomCategories: CategoryItem[];
  updatedAt: string;
}

const TYPE_LABELS: Record<string, string> = {
  area: "面積材料",
  paint: "塗料",
  decoration: "軟裝飾",
  kitchen: "廚房設備",
  bathroom: "衛浴設備",
};

const TYPE_COLORS: Record<string, string> = {
  area: "#B45309",
  paint: "#D97706",
  decoration: "#92400E",
  kitchen: "#78716C",
  bathroom: "#57534E",
};

const BAR_COLORS = {
  decoration: "#B45309",
  kitchen: "#78716C",
  bathroom: "#57534E",
};

export default function CategoryAnalysis() {
  const [data, setData] = useState<CategoryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/dashboard/categories");
      if (!res.ok) throw new Error("Failed to fetch");
      const json = await res.json();
      setData(json);
      setError(null);
    } catch {
      setError("無法載入分類資料");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 600000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const handleRefresh = () => {
    setLoading(true);
    fetchData();
  };

  if (loading && !data) {
    return (
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 animate-pulse">
        <div className="h-5 bg-slate-100 rounded w-32 mb-3" />
        <div className="h-64 bg-slate-50 rounded-xl" />
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
        <p className="text-red-500 text-sm">{error}</p>
        <button
          onClick={handleRefresh}
          className="mt-2 text-xs text-amber-700 hover:text-amber-900 underline"
        >
          重試
        </button>
      </div>
    );
  }

  if (!data) return null;

  const pieData = data.typeDistribution.map((item) => ({
    name: TYPE_LABELS[item.type] || item.type,
    value: item.count,
    color: TYPE_COLORS[item.type] || "#A8A29E",
  }));

  const total = pieData.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-semibold text-slate-900">
            產品分類分析
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            共 {total.toLocaleString()} 件產品
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="text-xs text-slate-400 hover:text-amber-700 transition-colors disabled:opacity-50"
          title="重新整理"
        >
          {loading ? "⏳" : "🔄"} 重新整理
        </button>
      </div>

      {/* Section 1: Pie Chart */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          產品類型分佈
        </h3>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="w-full sm:w-1/2" style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={85}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  formatter={((value: any) => [
                    `${Number(value).toLocaleString()} 件`,
                    "",
                  ]) as any}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                    fontSize: "12px",
                  }}
                />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: "12px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="w-full sm:w-1/2 space-y-2">
            {pieData.map((item) => {
              const pct = total > 0 ? ((item.value / total) * 100).toFixed(1) : "0";
              return (
                <div key={item.name} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-xs text-slate-600 flex-1">
                    {item.name}
                  </span>
                  <span className="text-xs font-medium text-slate-900">
                    {item.value.toLocaleString()}
                  </span>
                  <span className="text-xs text-slate-400 w-12 text-right">
                    {pct}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Section 2: Category Breakdowns */}
      <div>
        <h3 className="text-sm font-medium text-slate-700 mb-3">
          細項分類分佈
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Decoration */}
          <CategoryBreakdown
            title="軟裝飾"
            data={data.decorationCategories}
            color={BAR_COLORS.decoration}
          />
          {/* Kitchen */}
          <CategoryBreakdown
            title="廚房設備"
            data={data.kitchenCategories}
            color={BAR_COLORS.kitchen}
          />
          {/* Bathroom */}
          <CategoryBreakdown
            title="衛浴設備"
            data={data.bathroomCategories}
            color={BAR_COLORS.bathroom}
          />
        </div>
      </div>

      {/* Updated at */}
      {data.updatedAt && (
        <p className="text-[10px] text-slate-300 text-right mt-4">
          更新於{" "}
          {new Date(data.updatedAt).toLocaleString("zh-TW", {
            timeZone: "Asia/Taipei",
          })}
        </p>
      )}
    </div>
  );
}

function CategoryBreakdown({
  title,
  data,
  color,
}: {
  title: string;
  data: CategoryItem[];
  color: string;
}) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-slate-50 rounded-xl p-3">
        <h4 className="text-xs font-medium text-slate-600 mb-2">{title}</h4>
        <p className="text-xs text-slate-400">暫無資料</p>
      </div>
    );
  }

  const maxCount = Math.max(...data.map((d) => d.count));
  const showChart = data.length <= 8;

  return (
    <div className="bg-slate-50 rounded-xl p-3">
      <h4 className="text-xs font-medium text-slate-600 mb-2">
        {title}
        <span className="text-slate-400 ml-1">
          ({data.length} 類)
        </span>
      </h4>

      {showChart ? (
        <div style={{ height: Math.max(120, data.length * 28 + 30) }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data.slice(0, 8)}
              layout="vertical"
              margin={{ top: 0, right: 30, left: 0, bottom: 0 }}
            >
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="category"
                width={80}
                tick={{ fontSize: 10, fill: "#64748b" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                formatter={(value) => [
                  `${Number(value).toLocaleString()} 件`,
                  "",
                ]}
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                  fontSize: "11px",
                }}
              />
              <Bar dataKey="count" fill={color} radius={[0, 4, 4, 0]} barSize={14} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="space-y-1.5 max-h-48 overflow-y-auto">
          {data.map((item) => (
            <div key={item.category}>
              <div className="flex justify-between text-[11px] mb-0.5">
                <span className="text-slate-600 truncate mr-2">
                  {item.category}
                </span>
                <span className="text-slate-900 font-medium flex-shrink-0">
                  {item.count.toLocaleString()}
                </span>
              </div>
              <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${(item.count / maxCount) * 100}%`,
                    backgroundColor: color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
