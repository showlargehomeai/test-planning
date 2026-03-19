"use client";

import { useState, useEffect } from "react";
import KPICard from "./KPICard";

interface RetentionKPIData {
  dau: number;
  dauTrend: number;
  wau: number;
  wauTrend: number;
  mau: number;
  mauTrend: number;
}

export default function AnalyticsKPIs() {
  const [data, setData] = useState<RetentionKPIData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/retention", { cache: "no-store" })
      .then((r) => {
        if (!r.ok) throw new Error("API error");
        return r.json();
      })
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 animate-pulse"
          >
            <div className="h-4 bg-slate-100 rounded w-16 mb-3" />
            <div className="h-8 bg-slate-100 rounded w-24" />
          </div>
        ))}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center text-sm text-rose-500 py-4">
        KPI 資料載入失敗
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <KPICard
        label="DAU (日活躍用戶)"
        value={data.dau}
        unit="人"
        trend={data.dauTrend}
      />
      <KPICard
        label="WAU (週活躍用戶)"
        value={data.wau}
        unit="人"
        trend={data.wauTrend}
      />
      <KPICard
        label="MAU (月活躍用戶)"
        value={data.mau}
        unit="人"
        trend={data.mauTrend}
      />
    </div>
  );
}
