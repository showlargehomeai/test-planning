"use client";

import { useState } from "react";

type Severity = "critical" | "warning" | "info";

interface Alert {
  id: string;
  severity: Severity;
  title: string;
  message: string;
  time: string;
}

const severityConfig: Record<
  Severity,
  { bg: string; border: string; dot: string; text: string; label: string }
> = {
  critical: {
    bg: "bg-rose-50",
    border: "border-rose-200",
    dot: "bg-rose-500",
    text: "text-rose-700",
    label: "嚴重",
  },
  warning: {
    bg: "bg-amber-50",
    border: "border-amber-200",
    dot: "bg-amber-500",
    text: "text-amber-700",
    label: "警告",
  },
  info: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    dot: "bg-blue-500",
    text: "text-blue-700",
    label: "資訊",
  },
};

const mockAlerts: Alert[] = [
  {
    id: "a1",
    severity: "critical",
    title: "工班回覆率下降",
    message: "過去 24 小時工班媒合回覆率降至 62%，低於 75% 門檻值",
    time: "10 分鐘前",
  },
  {
    id: "a2",
    severity: "warning",
    title: "建材商上架速度趨緩",
    message: "本週新建材商上架數僅 8 家，低於週均 15 家",
    time: "1 小時前",
  },
  {
    id: "a3",
    severity: "warning",
    title: "設計師首次媒合等待時間過長",
    message: "平均首次媒合等待時間達 4.2 天，目標為 2 天內",
    time: "3 小時前",
  },
  {
    id: "a4",
    severity: "info",
    title: "月營收目標達成 87%",
    message: "距月底剩 10 天，目前營收 240 萬 / 目標 275 萬",
    time: "6 小時前",
  },
  {
    id: "a5",
    severity: "info",
    title: "系統健康度正常",
    message: "API 平均回應 128ms，錯誤率 0.12%，CPU 42%，記憶體 67%",
    time: "即時",
  },
];

const systemHealth = {
  api: { label: "API 回應", value: "128ms", status: "good" as const },
  error: { label: "錯誤率", value: "0.12%", status: "good" as const },
  cpu: { label: "CPU", value: "42%", status: "good" as const },
  memory: { label: "記憶體", value: "67%", status: "warning" as const },
};

export default function AlertPanel() {
  const [filter, setFilter] = useState<Severity | "all">("all");

  const filtered =
    filter === "all"
      ? mockAlerts
      : mockAlerts.filter((a) => a.severity === filter);

  const counts = {
    critical: mockAlerts.filter((a) => a.severity === "critical").length,
    warning: mockAlerts.filter((a) => a.severity === "warning").length,
    info: mockAlerts.filter((a) => a.severity === "info").length,
  };

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-100 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-slate-700">警示面板</h2>
          {counts.critical > 0 && (
            <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
              {counts.critical}
            </span>
          )}
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-amber-100 text-amber-700 font-semibold tracking-wide">
          MOCK
        </span>
      </div>

      {/* System Health */}
      <div className="grid grid-cols-4 gap-2">
        {Object.values(systemHealth).map((h) => (
          <div
            key={h.label}
            className="p-2 rounded-xl bg-slate-50/50 border border-slate-100 text-center"
          >
            <p className="text-[10px] text-slate-400">{h.label}</p>
            <p
              className={`text-sm font-bold ${
                h.status === "good" ? "text-emerald-600" : "text-amber-600"
              }`}
            >
              {h.value}
            </p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex items-center gap-1">
        {(
          [
            ["all", "全部", null],
            ["critical", "嚴重", counts.critical],
            ["warning", "警告", counts.warning],
            ["info", "資訊", counts.info],
          ] as const
        ).map(([key, label, count]) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-2 py-1 rounded-md text-[10px] font-medium transition-colors ${
              filter === key
                ? "bg-slate-800 text-white"
                : "bg-slate-100 text-slate-500 hover:text-slate-700"
            }`}
          >
            {label}
            {count !== null && count > 0 && (
              <span className="ml-1">{count}</span>
            )}
          </button>
        ))}
      </div>

      {/* Alerts list */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {filtered.map((alert) => {
          const cfg = severityConfig[alert.severity];
          return (
            <div
              key={alert.id}
              className={`p-3 rounded-xl border ${cfg.bg} ${cfg.border}`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 ${cfg.dot} ${alert.severity === "critical" ? "animate-pulse" : ""}`}
                  />
                  <p className={`text-xs font-semibold ${cfg.text}`}>
                    {alert.title}
                  </p>
                </div>
                <span className="text-[10px] text-slate-400 whitespace-nowrap shrink-0">
                  {alert.time}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 mt-1 ml-3.5">
                {alert.message}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
