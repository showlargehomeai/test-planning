import { Suspense } from "react";
import AnalyticsKPIs from "./_components/AnalyticsKPIs";
import UserGrowth from "./_components/UserGrowth";
import RetentionChart from "./_components/RetentionChart";

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
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
          戰情室
        </h1>
        <p className="text-sm text-slate-500">
          即時數據分析 — LargeHome（資料來源：PostgreSQL 真實用戶數據）
        </p>
      </div>

      {/* KPI Row: DAU / WAU / MAU */}
      <Suspense fallback={<KPISkeleton />}>
        <AnalyticsKPIs />
      </Suspense>

      {/* User Growth with Time Range Switch */}
      <Suspense fallback={<ChartSkeleton />}>
        <UserGrowth />
      </Suspense>

      {/* Retention Chart */}
      <Suspense fallback={<ChartSkeleton />}>
        <RetentionChart />
      </Suspense>
    </div>
  );
}
