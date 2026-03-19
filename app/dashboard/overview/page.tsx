import { Suspense } from "react";
import CompanyOKR from "../_components/CompanyOKR";
import TeamTracker from "../_components/TeamTracker";
import BDPipeline from "../_components/BDPipeline";
import UserGrowth from "../_components/UserGrowth";

function SectionSkeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-100 animate-pulse ${className}`}
    >
      <div className="h-5 bg-slate-100 rounded w-24 mb-3" />
      <div className="space-y-3">
        <div className="h-16 bg-slate-50 rounded-xl" />
        <div className="h-16 bg-slate-50 rounded-xl" />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            營運總覽
          </h1>
          <span className="text-xs px-2 py-0.5 rounded bg-amber-100 text-amber-700 font-semibold tracking-wide">
            MOCK DATA
          </span>
        </div>
        <p className="text-sm text-slate-500">
          公司 OKR / 團隊進度 / BD 管道 — 以下為模擬數據，待真實資料對接後移除標籤
        </p>
      </div>

      {/* Company OKR Bar */}
      <Suspense
        fallback={
          <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-slate-100 animate-pulse">
            <div className="h-5 bg-slate-100 rounded w-48 mb-4" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-24 bg-slate-50 rounded-xl" />
              ))}
            </div>
          </div>
        }
      >
        <CompanyOKR />
      </Suspense>

      {/* Bottom Grid: Teams | BD | User Growth */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Suspense fallback={<SectionSkeleton />}>
          <TeamTracker />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <BDPipeline />
        </Suspense>
        <Suspense
          fallback={<SectionSkeleton className="lg:col-span-2" />}
        >
          <UserGrowth />
        </Suspense>
      </div>
    </div>
  );
}
