"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

const StrategicAudit = dynamic(() => import("./_components/StrategicAudit"), { ssr: false });
const AnalyticsKPIs = dynamic(() => import("./_components/AnalyticsKPIs"), { ssr: false });
const UserGrowth = dynamic(() => import("./_components/UserGrowth"), { ssr: false });
const ProductGrowth = dynamic(() => import("./_components/ProductGrowth"), { ssr: false });
const VendorGrowth = dynamic(() => import("./_components/VendorGrowth"), { ssr: false });
const BrandGrowth = dynamic(() => import("./_components/BrandGrowth"), { ssr: false });
const VendorActivity = dynamic(() => import("./_components/VendorActivity"), { ssr: false });
const CategoryAnalysis = dynamic(() => import("./_components/CategoryAnalysis"), { ssr: false });
const CatalogGrowth = dynamic(() => import("./_components/CatalogGrowth"), { ssr: false });
const RetentionChart = dynamic(() => import("./_components/RetentionChart"), { ssr: false });

function KPISkeleton() {
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

function ChartSkeleton() {
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

export default function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
          戰情室
        </h1>
        <p className="text-sm text-slate-500">
          即時數據分析 — LargeHome（資料來源：PostgreSQL 真實用戶數據）
        </p>
      </div>

      <Suspense fallback={<ChartSkeleton />}>
        <StrategicAudit compact />
      </Suspense>

      <Suspense fallback={<KPISkeleton />}>
        <AnalyticsKPIs />
      </Suspense>

      <Suspense fallback={<ChartSkeleton />}>
        <UserGrowth />
      </Suspense>

      <Suspense fallback={<ChartSkeleton />}>
        <ProductGrowth />
      </Suspense>

      <Suspense fallback={<ChartSkeleton />}>
        <VendorGrowth />
      </Suspense>

      <Suspense fallback={<ChartSkeleton />}>
        <BrandGrowth />
      </Suspense>

      <Suspense fallback={<ChartSkeleton />}>
        <VendorActivity />
      </Suspense>

      <Suspense fallback={<ChartSkeleton />}>
        <CategoryAnalysis />
      </Suspense>

      <Suspense fallback={<ChartSkeleton />}>
        <CatalogGrowth />
      </Suspense>

      <Suspense fallback={<ChartSkeleton />}>
        <RetentionChart />
      </Suspense>
    </div>
  );
}
