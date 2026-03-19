interface KPICardProps {
  label: string;
  value: number | string;
  target?: number;
  unit?: string;
  trend?: number;
  status?: "on-track" | "at-risk" | "behind";
}

const statusConfig = {
  "on-track": {
    dot: "bg-emerald-500",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    label: "進度正常",
  },
  "at-risk": {
    dot: "bg-amber-500",
    bg: "bg-amber-50",
    text: "text-amber-700",
    label: "需關注",
  },
  behind: {
    dot: "bg-rose-500",
    bg: "bg-rose-50",
    text: "text-rose-700",
    label: "落後",
  },
} as const;

export default function KPICard({
  label,
  value,
  target,
  unit,
  trend,
  status,
}: KPICardProps) {
  const progress =
    target && typeof value === "number"
      ? Math.min(Math.round((value / target) * 100), 100)
      : null;

  const statusStyle = status ? statusConfig[status] : null;

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-100 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{label}</p>
        {statusStyle && (
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`}
            />
            {statusStyle.label}
          </span>
        )}
      </div>

      <div className="flex items-baseline gap-1.5">
        <span className="text-2xl sm:text-3xl font-bold text-slate-900">
          {typeof value === "number" ? value.toLocaleString() : value}
        </span>
        {unit && <span className="text-sm text-slate-400">{unit}</span>}
        {trend !== undefined && (
          <span
            className={`ml-auto text-sm font-medium ${
              trend >= 0 ? "text-emerald-600" : "text-rose-600"
            }`}
          >
            {trend >= 0 ? "\u2191" : "\u2193"}
            {Math.abs(trend)}%
          </span>
        )}
      </div>

      {progress !== null && target && (
        <div className="mt-1">
          <div className="flex justify-between text-xs text-slate-400 mb-1">
            <span>
              {typeof value === "number" ? value.toLocaleString() : value} /{" "}
              {target.toLocaleString()}
            </span>
            <span>{progress}%</span>
          </div>
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                progress >= 70
                  ? "bg-emerald-500"
                  : progress >= 40
                    ? "bg-amber-500"
                    : "bg-rose-500"
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
