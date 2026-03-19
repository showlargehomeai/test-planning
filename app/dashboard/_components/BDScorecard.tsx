"use client";

import type { Vendor, BD, Stage } from "./bd-types";

interface BDScorecardProps {
  vendors: Vendor[];
  bds: BD[];
  stages: Stage[];
}

export default function BDScorecard({ vendors, bds, stages }: BDScorecardProps) {
  const lastStageId = stages[stages.length - 1]?.id;

  const bdStats = bds
    .map((bd) => {
      const bdVendors = vendors.filter((v) => v.bdId === bd.id);
      const completedCount = bdVendors.filter(
        (v) => v.stage === lastStageId
      ).length;
      const totalCount = bdVendors.length;
      const completionRate =
        totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

      const avgDays =
        totalCount > 0
          ? Math.round(
              bdVendors.reduce((sum, v) => {
                return (
                  sum +
                  Math.floor(
                    (Date.now() - new Date(v.startDate).getTime()) /
                      (1000 * 60 * 60 * 24)
                  )
                );
              }, 0) / totalCount
            )
          : 0;

      return { bd, totalCount, completedCount, completionRate, avgDays };
    })
    .sort((a, b) => b.completionRate - a.completionRate);

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-100">
      <h3 className="text-sm font-semibold text-slate-700 mb-3">
        BD 績效排行
      </h3>
      <div className="space-y-3">
        {bdStats.map((stat, index) => (
          <div key={stat.bd.id} className="flex items-center gap-3">
            {/* Rank */}
            <span
              className={`text-lg font-bold w-6 text-center ${
                index === 0
                  ? "text-amber-500"
                  : index === 1
                    ? "text-slate-400"
                    : "text-amber-700"
              }`}
            >
              {index + 1}
            </span>

            {/* Avatar */}
            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold shrink-0">
              {stat.bd.avatar}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">
                  {stat.bd.name}
                </span>
                <span className="text-xs font-semibold text-indigo-600">
                  {stat.completionRate}%
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                <span>{stat.totalCount} 廠商</span>
                <span>{stat.completedCount} 完成</span>
                <span>平均 {stat.avgDays} 天</span>
              </div>
              {/* Mini progress bar */}
              <div className="mt-1 h-1 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    stat.completionRate >= 50
                      ? "bg-emerald-400"
                      : stat.completionRate >= 25
                        ? "bg-amber-400"
                        : "bg-rose-400"
                  }`}
                  style={{ width: `${stat.completionRate}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
