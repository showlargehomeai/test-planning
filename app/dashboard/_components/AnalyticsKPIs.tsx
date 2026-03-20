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

interface ProductSummary {
  total: number;
  active: number;
}

interface VendorSummary {
  total: number;
  active: number;
}

export default function AnalyticsKPIs() {
  const [data, setData] = useState<RetentionKPIData | null>(null);
  const [products, setProducts] = useState<ProductSummary | null>(null);
  const [vendors, setVendors] = useState<VendorSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/dashboard/retention", { cache: "no-store" })
        .then((r) => {
          if (!r.ok) throw new Error("API error");
          return r.json();
        })
        .then(setData)
        .catch(() => {}),
      fetch("/api/dashboard/products", { cache: "no-store" })
        .then((r) => {
          if (!r.ok) throw new Error("API error");
          return r.json();
        })
        .then((d) => setProducts({ total: d.total, active: d.active }))
        .catch(() => {}),
      fetch("/api/dashboard/vendors", { cache: "no-store" })
        .then((r) => {
          if (!r.ok) throw new Error("API error");
          return r.json();
        })
        .then((d) => setVendors({ total: d.total, active: d.active }))
        .catch(() => {}),
    ]).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
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
    <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
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
      <KPICard
        label="總商品數"
        value={products?.total ?? 0}
        unit="件"
      />
      <KPICard
        label="總供應商"
        value={vendors?.total ?? 0}
        unit="家"
      />
    </div>
  );
}
