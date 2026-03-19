"use client";

import { useState, useEffect } from "react";

interface VendorData {
  stages: {
    id: string;
    label: string;
    count: number;
    color: string;
  }[];
  total: number;
  updatedAt: string;
}

const colorMap: Record<string, { bg: string; text: string; bar: string }> = {
  slate: { bg: "bg-slate-50", text: "text-slate-600", bar: "bg-slate-400" },
  blue: { bg: "bg-blue-50", text: "text-blue-600", bar: "bg-blue-400" },
  amber: { bg: "bg-amber-50", text: "text-amber-600", bar: "bg-amber-400" },
  indigo: { bg: "bg-indigo-50", text: "text-indigo-600", bar: "bg-indigo-400" },
  emerald: { bg: "bg-emerald-50", text: "text-emerald-600", bar: "bg-emerald-400" },
};

export default function BDPipeline() {
  const [data, setData] = useState<VendorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/dashboard/bd")
      .then((res) => {
        if (!res.ok) throw new Error("API error");
        return res.json();
      })
      .then((json) => {
        setData(json);
        setError(null);
      })
      .catch(() => setError("無法載入 BD 資料"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-100 space-y-3">
        <div className="h-5 bg-slate-100 rounded w-24 animate-pulse" />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-8 bg-slate-50 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-rose-100 text-center">
        <p className="text-rose-500 text-sm">{error || "BD 資料載入失敗"}</p>
      </div>
    );
  }

  if (data.stages.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 text-center">
        <p className="text-slate-400 text-sm">尚無廠商資料</p>
      </div>
    );
  }

  const maxCount = Math.max(...data.stages.map((s) => s.count));

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-100">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-slate-700">BD 廠商管道</h2>
        <span className="text-xs text-slate-400">
          共 {data.total} 家
        </span>
      </div>

      <div className="space-y-2">
        {data.stages.map((stage) => {
          const colors = colorMap[stage.color] || colorMap.slate;
          const pct = maxCount > 0 ? (stage.count / maxCount) * 100 : 0;

          return (
            <div key={stage.id} className="flex items-center gap-3">
              <span className="text-xs text-slate-500 w-14 shrink-0 text-right">
                {stage.label}
              </span>
              <div className="flex-1 h-6 bg-slate-50 rounded-lg overflow-hidden relative">
                <div
                  className={`h-full rounded-lg ${colors.bar} transition-all`}
                  style={{ width: `${pct}%`, minWidth: stage.count > 0 ? "24px" : "0" }}
                />
              </div>
              <span
                className={`text-sm font-semibold w-8 text-right ${colors.text}`}
              >
                {stage.count}
              </span>
            </div>
          );
        })}
      </div>

      {/* Funnel summary */}
      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs text-slate-400">轉換率</span>
        <span className="text-xs font-medium text-indigo-600">
          {data.stages.length >= 2
            ? `${Math.round(
                (data.stages[data.stages.length - 1].count /
                  data.stages[0].count) *
                  100
              )}%`
            : "—"}
          <span className="text-slate-400 ml-1">
            ({data.stages[0]?.label} → {data.stages[data.stages.length - 1]?.label})
          </span>
        </span>
      </div>
    </div>
  );
}
