"use client";

import { useState, useEffect } from "react";
import KPICard from "./KPICard";

interface OKRData {
  quarter: string;
  nsm: {
    label: string;
    title: string;
    current: number;
    target: number;
    unit: string;
  };
  kpis: {
    id: string;
    title: string;
    current: number;
    target: number;
    unit: string;
    status: "on-track" | "at-risk" | "behind";
  }[];
  updatedAt: string;
}

export default function CompanyOKR() {
  const [data, setData] = useState<OKRData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/dashboard/okr")
      .then((res) => {
        if (!res.ok) throw new Error("API error");
        return res.json();
      })
      .then((json) => {
        setData(json);
        setError(null);
      })
      .catch(() => setError("無法載入 OKR 資料"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-slate-100">
        <div className="animate-pulse space-y-4">
          <div className="h-5 bg-slate-100 rounded w-48" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-slate-50 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-rose-100 text-center">
        <p className="text-rose-500 text-sm">{error || "OKR 資料載入失敗"}</p>
      </div>
    );
  }

  const nsmProgress = Math.round((data.nsm.current / data.nsm.target) * 100);

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-slate-100">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-semibold text-slate-700">
            公司 OKR
          </h2>
          <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 font-medium">
            {data.quarter}
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 font-semibold tracking-wide">
            MOCK
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
            {data.nsm.title}
          </span>
          <span className="font-semibold text-indigo-600">
            {data.nsm.current.toLocaleString()} / {data.nsm.target.toLocaleString()} {data.nsm.unit}
          </span>
          <span className="text-slate-300">({nsmProgress}%)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {data.kpis.map((kpi) => (
          <KPICard
            key={kpi.id}
            label={kpi.title}
            value={kpi.current}
            target={kpi.target}
            unit={kpi.unit}
            status={kpi.status}
          />
        ))}
      </div>
    </div>
  );
}
