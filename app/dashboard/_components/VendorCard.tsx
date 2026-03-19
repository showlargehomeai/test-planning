"use client";

import type { Vendor, BD, Stage } from "./bd-types";

interface VendorCardProps {
  vendor: Vendor;
  bd: BD;
  stages: Stage[];
  onStageChange: (vendorId: string, newStage: string) => void;
  disabled?: boolean;
}

const stageColorMap: Record<string, string> = {
  slate: "border-slate-200",
  blue: "border-blue-200",
  amber: "border-amber-200",
  indigo: "border-indigo-200",
  emerald: "border-emerald-200",
};

export default function VendorCard({
  vendor,
  bd,
  stages,
  onStageChange,
  disabled,
}: VendorCardProps) {
  const currentStageIndex = stages.findIndex((s) => s.id === vendor.stage);
  const currentStage = stages[currentStageIndex];
  const borderColor = stageColorMap[currentStage?.color || "slate"];

  const daysElapsed = Math.floor(
    (Date.now() - new Date(vendor.startDate).getTime()) / (1000 * 60 * 60 * 24)
  );

  const progress =
    stages.length > 1
      ? Math.round((currentStageIndex / (stages.length - 1)) * 100)
      : 0;

  const canGoBack = currentStageIndex > 0;
  const canGoForward = currentStageIndex < stages.length - 1;

  return (
    <div
      className={`bg-white rounded-xl p-3 shadow-sm border ${borderColor} hover:shadow-md transition-shadow ${
        disabled ? "opacity-60 pointer-events-none" : ""
      }`}
    >
      {/* Header: Company name + days */}
      <div className="flex items-start justify-between mb-2">
        <h4 className="text-sm font-semibold text-slate-800 leading-tight">
          {vendor.name}
        </h4>
        <span className="text-xs text-slate-400 whitespace-nowrap ml-2">
          {daysElapsed}天
        </span>
      </div>

      {/* BD info */}
      <div className="flex items-center gap-2 mb-2">
        <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-bold shrink-0">
          {bd.avatar}
        </div>
        <span className="text-xs text-slate-500">{bd.name}</span>
      </div>

      {/* Progress bar */}
      <div className="mb-2">
        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${
              progress >= 100
                ? "bg-emerald-400"
                : progress >= 50
                  ? "bg-indigo-400"
                  : "bg-blue-400"
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Product/Service counts */}
      <div className="flex items-center gap-3 mb-2 text-xs text-slate-500">
        <span>產品 {vendor.productCount}</span>
        <span>服務 {vendor.serviceCount}</span>
      </div>

      {/* Stage navigation buttons */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
        <button
          onClick={() =>
            canGoBack &&
            onStageChange(vendor.id, stages[currentStageIndex - 1].id)
          }
          disabled={!canGoBack || disabled}
          title={canGoBack ? `退回: ${stages[currentStageIndex - 1].label}` : ""}
          className="text-xs px-2 py-1 rounded border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
        >
          ←
        </button>
        <span className="text-[10px] text-slate-300">
          {currentStageIndex + 1}/{stages.length}
        </span>
        <button
          onClick={() =>
            canGoForward &&
            onStageChange(vendor.id, stages[currentStageIndex + 1].id)
          }
          disabled={!canGoForward || disabled}
          title={
            canGoForward ? `推進: ${stages[currentStageIndex + 1].label}` : ""
          }
          className="text-xs px-2 py-1 rounded border border-indigo-200 text-indigo-500 hover:text-indigo-700 hover:bg-indigo-50 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
        >
          →
        </button>
      </div>
    </div>
  );
}
