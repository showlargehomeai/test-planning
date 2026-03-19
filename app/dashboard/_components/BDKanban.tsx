"use client";

import { useState, useEffect, useCallback } from "react";
import VendorCard from "./VendorCard";
import BDScorecard from "./BDScorecard";
import type { VendorsData } from "./bd-types";

const columnColorMap: Record<string, { header: string; count: string }> = {
  slate: {
    header: "bg-slate-100 text-slate-700",
    count: "bg-slate-200 text-slate-600",
  },
  blue: {
    header: "bg-blue-100 text-blue-700",
    count: "bg-blue-200 text-blue-600",
  },
  amber: {
    header: "bg-amber-100 text-amber-700",
    count: "bg-amber-200 text-amber-600",
  },
  indigo: {
    header: "bg-indigo-100 text-indigo-700",
    count: "bg-indigo-200 text-indigo-600",
  },
  emerald: {
    header: "bg-emerald-100 text-emerald-700",
    count: "bg-emerald-200 text-emerald-600",
  },
};

export default function BDKanban() {
  const [data, setData] = useState<VendorsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);
  const [selectedBd, setSelectedBd] = useState<string>("all");

  useEffect(() => {
    fetch("/api/dashboard/bd")
      .then((res) => {
        if (!res.ok) throw new Error("API error");
        return res.json();
      })
      .then((json: VendorsData) => {
        setData(json);
        setError(null);
      })
      .catch(() => setError("無法載入 BD 資料"))
      .finally(() => setLoading(false));
  }, []);

  const handleStageChange = useCallback(
    async (vendorId: string, newStage: string) => {
      if (!data || updating) return;

      setUpdating(vendorId);
      const previousVendors = [...data.vendors];

      // Optimistic update
      setData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          vendors: prev.vendors.map((v) =>
            v.id === vendorId ? { ...v, stage: newStage } : v
          ),
          updatedAt: new Date().toISOString(),
        };
      });

      try {
        const res = await fetch("/api/dashboard/bd", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ vendorId, newStage }),
        });
        if (!res.ok) throw new Error("Update failed");
      } catch {
        // Rollback on failure
        setData((prev) =>
          prev ? { ...prev, vendors: previousVendors } : prev
        );
        setError("更新失敗，請重試");
        setTimeout(() => setError(null), 3000);
      } finally {
        setUpdating(null);
      }
    },
    [data, updating]
  );

  // Loading skeleton
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex gap-2">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-8 bg-slate-100 rounded-full w-20 animate-pulse"
            />
          ))}
        </div>
        <div className="flex gap-4 overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="min-w-[240px] flex-1">
              <div className="h-10 bg-slate-100 rounded-lg animate-pulse mb-3" />
              <div className="space-y-3">
                {[...Array(2)].map((_, j) => (
                  <div
                    key={j}
                    className="h-36 bg-slate-50 rounded-xl animate-pulse border border-slate-100"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="h-48 bg-white rounded-2xl animate-pulse border border-slate-100" />
      </div>
    );
  }

  if ((error && !data) || !data) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-rose-100 text-center">
        <p className="text-rose-500 text-sm">{error || "BD 資料載入失敗"}</p>
      </div>
    );
  }

  const { stages, vendors, bds } = data;
  const bdMap = Object.fromEntries(bds.map((b) => [b.id, b]));
  const filteredVendors =
    selectedBd === "all"
      ? vendors
      : vendors.filter((v) => v.bdId === selectedBd);

  const completedCount = vendors.filter(
    (v) => v.stage === stages[stages.length - 1]?.id
  ).length;
  const completionRate =
    vendors.length > 0 ? Math.round((completedCount / vendors.length) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Error toast */}
      {error && (
        <div className="bg-rose-50 border border-rose-200 rounded-lg px-4 py-2 text-sm text-rose-600">
          {error}
        </div>
      )}

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl p-3 border border-slate-100 shadow-sm">
          <div className="text-xs text-slate-400">總廠商</div>
          <div className="text-xl font-bold text-slate-800">
            {vendors.length}
          </div>
        </div>
        <div className="bg-white rounded-xl p-3 border border-slate-100 shadow-sm">
          <div className="text-xs text-slate-400">已完成</div>
          <div className="text-xl font-bold text-emerald-600">
            {completedCount}
          </div>
        </div>
        <div className="bg-white rounded-xl p-3 border border-slate-100 shadow-sm">
          <div className="text-xs text-slate-400">完成率</div>
          <div className="text-xl font-bold text-indigo-600">
            {completionRate}%
          </div>
        </div>
        <div className="bg-white rounded-xl p-3 border border-slate-100 shadow-sm">
          <div className="text-xs text-slate-400">BD 人數</div>
          <div className="text-xl font-bold text-slate-800">{bds.length}</div>
        </div>
      </div>

      {/* BD filter */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => setSelectedBd("all")}
          className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
            selectedBd === "all"
              ? "bg-indigo-600 text-white border-indigo-600"
              : "border-slate-200 text-slate-600 hover:bg-slate-50"
          }`}
        >
          全部
        </button>
        {bds.map((bd) => (
          <button
            key={bd.id}
            onClick={() => setSelectedBd(bd.id)}
            className={`text-xs px-3 py-1.5 rounded-full border flex items-center gap-1.5 transition-colors ${
              selectedBd === bd.id
                ? "bg-indigo-600 text-white border-indigo-600"
                : "border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            <span
              className={`w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold ${
                selectedBd === bd.id
                  ? "bg-white/20"
                  : "bg-indigo-100 text-indigo-600"
              }`}
            >
              {bd.avatar}
            </span>
            {bd.name}
          </button>
        ))}
      </div>

      {/* Kanban board */}
      <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
        {stages.map((stage) => {
          const stageVendors = filteredVendors.filter(
            (v) => v.stage === stage.id
          );
          const colors = columnColorMap[stage.color] || columnColorMap.slate;

          return (
            <div key={stage.id} className="min-w-[240px] sm:min-w-[260px] flex-1">
              {/* Column header */}
              <div
                className={`rounded-lg px-3 py-2 mb-3 flex items-center justify-between ${colors.header}`}
              >
                <span className="text-sm font-semibold">{stage.label}</span>
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded-full ${colors.count}`}
                >
                  {stageVendors.length}
                </span>
              </div>

              {/* Vendor cards */}
              <div className="space-y-3">
                {stageVendors.map((vendor) => (
                  <VendorCard
                    key={vendor.id}
                    vendor={vendor}
                    bd={
                      bdMap[vendor.bdId] || {
                        id: "",
                        name: "未知",
                        avatar: "?",
                      }
                    }
                    stages={stages}
                    onStageChange={handleStageChange}
                    disabled={updating === vendor.id}
                  />
                ))}
                {stageVendors.length === 0 && (
                  <div className="text-center py-8 text-xs text-slate-300 border border-dashed border-slate-200 rounded-xl">
                    無廠商
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* BD Scorecard */}
      <BDScorecard vendors={vendors} bds={bds} stages={stages} />
    </div>
  );
}
