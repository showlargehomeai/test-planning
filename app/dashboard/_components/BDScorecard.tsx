"use client";

import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { Vendor, BD, Stage } from "./bd-types";

interface BDScorecardProps {
  vendors: Vendor[];
  bds: BD[];
  stages: Stage[];
}

function getStatusColor(rate: number) {
  if (rate >= 80)
    return {
      bg: "bg-emerald-100",
      text: "text-emerald-700",
      dot: "bg-emerald-500",
      label: "優",
    };
  if (rate >= 50)
    return {
      bg: "bg-amber-100",
      text: "text-amber-700",
      dot: "bg-amber-500",
      label: "中",
    };
  return {
    bg: "bg-rose-100",
    text: "text-rose-700",
    dot: "bg-rose-500",
    label: "待改善",
  };
}

function getBarFill(rate: number) {
  if (rate >= 80) return "#10b981";
  if (rate >= 50) return "#f59e0b";
  return "#f43f5e";
}

export default function BDScorecard({
  vendors,
  bds,
  stages,
}: BDScorecardProps) {
  const lastStageId = stages[stages.length - 1]?.id;

  const bdStats = useMemo(() => {
    const now = Date.now();
    const oneWeekMs = 7 * 24 * 60 * 60 * 1000;
    const thisWeekStart = now - oneWeekMs;
    const lastWeekStart = now - 2 * oneWeekMs;

    return bds
      .map((bd) => {
        const bdVendors = vendors.filter((v) => v.bdId === bd.id);
        const completedVendors = bdVendors.filter(
          (v) => v.stage === lastStageId
        );
        const completedCount = completedVendors.length;
        const inProgressCount = bdVendors.filter(
          (v) => v.stage !== lastStageId
        ).length;
        const totalCount = bdVendors.length;
        const completionRate =
          totalCount > 0
            ? Math.round((completedCount / totalCount) * 100)
            : 0;

        // Average onboarding days — use completed vendors if available, otherwise all
        const targetVendors =
          completedCount > 0 ? completedVendors : bdVendors;
        const avgDays =
          targetVendors.length > 0
            ? Math.round(
                targetVendors.reduce((sum, v) => {
                  return (
                    sum +
                    Math.floor(
                      (now - new Date(v.startDate).getTime()) /
                        (1000 * 60 * 60 * 24)
                    )
                  );
                }, 0) / targetVendors.length
              )
            : 0;

        // Weekly trend based on start date of completed vendors
        const thisWeekCompleted = completedVendors.filter(
          (v) => new Date(v.startDate).getTime() >= thisWeekStart
        ).length;
        const lastWeekCompleted = completedVendors.filter((v) => {
          const t = new Date(v.startDate).getTime();
          return t >= lastWeekStart && t < thisWeekStart;
        }).length;
        const weeklyDelta = thisWeekCompleted - lastWeekCompleted;

        return {
          bd,
          totalCount,
          completedCount,
          inProgressCount,
          completionRate,
          avgDays,
          thisWeekCompleted,
          lastWeekCompleted,
          weeklyDelta,
        };
      })
      .sort((a, b) => b.completionRate - a.completionRate);
  }, [vendors, bds, lastStageId]);

  const chartData = bdStats.map((stat) => ({
    name: stat.bd.name,
    completionRate: stat.completionRate,
    fill: getBarFill(stat.completionRate),
  }));

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-slate-700">BD 績效報表</h3>

      {/* Ranking Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {bdStats.map((stat, index) => {
          const status = getStatusColor(stat.completionRate);
          return (
            <div
              key={stat.bd.id}
              className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 relative overflow-hidden"
            >
              {/* Rank badge */}
              <div
                className={`absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                  index === 0
                    ? "bg-amber-100 text-amber-600"
                    : index === 1
                      ? "bg-slate-100 text-slate-500"
                      : index === 2
                        ? "bg-orange-100 text-orange-600"
                        : "bg-slate-50 text-slate-400"
                }`}
              >
                #{index + 1}
              </div>

              {/* BD Info */}
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm font-bold shrink-0">
                  {stat.bd.avatar}
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-800">
                    {stat.bd.name}
                  </div>
                  <div
                    className={`inline-flex items-center gap-1 mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-medium ${status.bg} ${status.text}`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${status.dot}`}
                    />
                    {status.label}
                  </div>
                </div>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-slate-50 rounded-lg px-2.5 py-2">
                  <div className="text-[10px] text-slate-400">完成廠商</div>
                  <div className="text-base font-bold text-emerald-600">
                    {stat.completedCount}
                  </div>
                </div>
                <div className="bg-slate-50 rounded-lg px-2.5 py-2">
                  <div className="text-[10px] text-slate-400">進行中</div>
                  <div className="text-base font-bold text-blue-600">
                    {stat.inProgressCount}
                  </div>
                </div>
                <div className="bg-slate-50 rounded-lg px-2.5 py-2">
                  <div className="text-[10px] text-slate-400">平均天數</div>
                  <div className="text-base font-bold text-slate-700">
                    {stat.avgDays}{" "}
                    <span className="text-[10px] font-normal text-slate-400">
                      天
                    </span>
                  </div>
                </div>
                <div className="bg-slate-50 rounded-lg px-2.5 py-2">
                  <div className="text-[10px] text-slate-400">完成率</div>
                  <div className="text-base font-bold text-indigo-600">
                    {stat.completionRate}%
                  </div>
                </div>
              </div>

              {/* Weekly trend */}
              <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 bg-slate-50 rounded-lg px-2.5 py-1.5">
                <span>本週 vs 上週</span>
                <span className="flex items-center gap-1 font-medium">
                  <span>
                    {stat.thisWeekCompleted} vs {stat.lastWeekCompleted}
                  </span>
                  {stat.weeklyDelta > 0 && (
                    <span className="text-emerald-600">
                      +{stat.weeklyDelta}
                    </span>
                  )}
                  {stat.weeklyDelta < 0 && (
                    <span className="text-rose-500">{stat.weeklyDelta}</span>
                  )}
                  {stat.weeklyDelta === 0 && (
                    <span className="text-slate-400">&mdash;</span>
                  )}
                </span>
              </div>

              {/* Completion progress bar */}
              <div className="mt-2 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    stat.completionRate >= 80
                      ? "bg-emerald-400"
                      : stat.completionRate >= 50
                        ? "bg-amber-400"
                        : "bg-rose-400"
                  }`}
                  style={{ width: `${stat.completionRate}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Bar Chart */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-100">
        <h4 className="text-sm font-semibold text-slate-700 mb-4">
          完成率對比
        </h4>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 5, right: 10, left: -10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: "#94a3b8" }}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fontSize: 10, fill: "#94a3b8" }}
                tickFormatter={(v: number) => `${v}%`}
              />
              <Tooltip
                formatter={(value) => [`${value}%`, "完成率"]}
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="completionRate" radius={[4, 4, 0, 0]} maxBarSize={48}>
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        {/* Legend */}
        <div className="flex items-center justify-center gap-4 mt-3 text-[11px] text-slate-500">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" /> &ge;80%
            優
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-sm bg-amber-500" /> 50-80% 中
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-sm bg-rose-500" /> &lt;50%
            待改善
          </span>
        </div>
      </div>
    </div>
  );
}
