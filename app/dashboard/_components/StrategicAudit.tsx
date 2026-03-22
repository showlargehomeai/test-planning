"use client";

import { useEffect, useState, useCallback } from "react";
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

/* ── Types ── */
interface AuditData {
  auditId: string;
  timestamp: string;
  round: number;
  company: {
    currentHeadcount: number;
    targetHeadcount: number;
    currentMRR: string;
    targetMRR_M12: string;
    currentClients: number;
    targetClients_M12: number;
    bdCurrent: number;
    bdTarget: number;
    croStatus: string;
    fundingStatus: string;
    phase: string;
  };
  taiwan: {
    overallReadiness: number;
    modules: {
      name: string;
      status: string;
      completion: number;
      priority: string;
    }[];
  };
  japan: {
    overallReadiness: number;
    blockers: string[];
    phases: {
      phase: string;
      target: string;
      readiness: number;
      status: string;
    }[];
  };
  infrastructure: {
    items: {
      name: string;
      status: string;
      health: string;
    }[];
  };
  bd_expansion: {
    plan: string;
    totalInvestment: string;
    phases: {
      name: string;
      months: string;
      status: string;
      keyAction: string;
    }[];
    gates: {
      gate: string;
      deadline: string;
      condition: string;
      status: string;
    }[];
  };
  mckinsey_recommendations: {
    priority: string;
    action: string;
    category: string;
  }[];
  nextAuditAt: string;
}

/* ── Color helpers ── */
const STATUS_COLOR: Record<string, string> = {
  production: "#10b981",
  prototype: "#f59e0b",
  not_started: "#ef4444",
};

const HEALTH_COLOR: Record<string, string> = {
  green: "#10b981",
  yellow: "#f59e0b",
  red: "#ef4444",
};

const PRIORITY_BADGE: Record<string, { bg: string; text: string }> = {
  CRITICAL: { bg: "bg-red-100", text: "text-red-700" },
  HIGH: { bg: "bg-amber-100", text: "text-amber-700" },
  MEDIUM: { bg: "bg-blue-100", text: "text-blue-700" },
};

/* ── Sub-components ── */

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
      {children}
    </h2>
  );
}

function ProgressBar({
  value,
  max,
  color = "#6366f1",
}: {
  value: number;
  max: number;
  color?: string;
}) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="w-full bg-slate-100 rounded-full h-2.5">
      <div
        className="h-2.5 rounded-full transition-all duration-500"
        style={{ width: `${pct}%`, backgroundColor: color }}
      />
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const labels: Record<string, string> = {
    production: "上線",
    prototype: "原型",
    not_started: "未開始",
  };
  const colors: Record<string, string> = {
    production: "bg-emerald-100 text-emerald-700",
    prototype: "bg-amber-100 text-amber-700",
    not_started: "bg-red-100 text-red-700",
  };
  return (
    <span
      className={`text-xs font-medium px-2 py-0.5 rounded-full ${colors[status] || "bg-slate-100 text-slate-600"}`}
    >
      {labels[status] || status}
    </span>
  );
}

function Countdown({ target }: { target: string }) {
  const [remaining, setRemaining] = useState("");
  useEffect(() => {
    const tick = () => {
      const diff = new Date(target).getTime() - Date.now();
      if (diff <= 0) {
        setRemaining("已到期");
        return;
      }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setRemaining(`${h}h ${m}m ${s}s`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);
  return <span className="font-mono text-indigo-600 text-sm">{remaining}</span>;
}

/* ── Readiness Gauge ── */
function ReadinessGauge({ value, label }: { value: number; label: string }) {
  const color =
    value >= 70 ? "#10b981" : value >= 40 ? "#f59e0b" : "#ef4444";
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-28 h-28">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          <circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="10"
          />
          <circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={`${(value / 100) * 264} 264`}
            className="transition-all duration-700"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold" style={{ color }}>
            {value}%
          </span>
        </div>
      </div>
      <span className="text-sm text-slate-500 mt-1">{label}</span>
    </div>
  );
}

/* ── Main Component ── */
export default function StrategicAudit({ compact = false }: { compact?: boolean }) {
  const [data, setData] = useState<AuditData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/dashboard/strategic-audit", {
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Failed to fetch");
      const json = await res.json();
      setData(json);
      setError(null);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const id = setInterval(fetchData, 600000); // 10 min
    return () => clearInterval(id);
  }, [fetchData]);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 animate-pulse">
        <div className="h-6 bg-slate-100 rounded w-48 mb-4" />
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 bg-slate-50 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-red-200">
        <p className="text-red-600">⚠️ 無法載入審計資料: {error}</p>
      </div>
    );
  }

  const { company, taiwan, japan, infrastructure, bd_expansion, mckinsey_recommendations } = data || {};

  // Guard: if audit data schema changed (cron may update), show formatted view
  if (!taiwan?.modules || !company) {
    const status = data?.executionStatus;
    const statusSummary = typeof status === 'string' ? status : status?.summary || '';
    const achievements: string[] = typeof status === 'object' && status?.achievements ? status.achievements : [];
    const systemHealth: Record<string, string> = typeof status === 'object' && status?.systemHealth ? status.systemHealth : {};
    const actions: Array<{action: string; priority: string; details: string}> = Array.isArray(data?.businessActionPlan) ? data.businessActionPlan : [];
    const metrics = data?.businessMetrics || {};

    return (
      <div className="space-y-4">
        {/* Header */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">🎯 戰略審計 Round {data?.round || '?'}</h2>
              <p className="text-sm text-slate-500">{data?.timestamp ? new Date(data.timestamp).toLocaleString('zh-TW') : ''}</p>
              {data?.perspective && <p className="text-xs text-indigo-600 mt-1">{data.perspective}</p>}
            </div>
            {data?.developmentStatus && (
              <span className="text-xs px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 font-medium">
                {typeof data.developmentStatus === 'string' ? data.developmentStatus.slice(0, 40) : ''}
              </span>
            )}
          </div>

          {/* Summary */}
          {statusSummary && (
            <p className="text-sm text-slate-700 leading-relaxed">{statusSummary}</p>
          )}
        </div>

        {/* Achievements */}
        {achievements.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">✅ 達成項目</h3>
            <div className="space-y-2">
              {achievements.map((a: string, i: number) => (
                <div key={i} className="flex items-start gap-2 text-sm text-slate-700">
                  <span className="text-emerald-500 mt-0.5 shrink-0">●</span>
                  <span>{a}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* System Health */}
        {Object.keys(systemHealth).length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">🔧 系統狀態</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {Object.entries(systemHealth).map(([key, val]) => (
                <div key={key} className="bg-slate-50 rounded-lg p-3">
                  <p className="text-xs text-slate-500 mb-1">{key}</p>
                  <p className="text-sm font-medium text-slate-800">{val}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Business Metrics */}
        {Object.keys(metrics).length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">📊 關鍵指標</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {Object.entries(metrics).map(([key, val]) => (
                <div key={key} className="bg-indigo-50 rounded-lg p-3">
                  <p className="text-xs text-indigo-500 mb-1">{key}</p>
                  <p className="text-sm font-medium text-indigo-800">{typeof val === 'string' ? val : JSON.stringify(val)}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Critical Recommendation */}
        {data?.criticalRecommendation && (
          <div className="bg-amber-50 rounded-2xl p-6 shadow-sm border border-amber-200">
            <h3 className="text-sm font-semibold text-amber-900 mb-2">⚠️ 關鍵建議</h3>
            <p className="text-sm text-amber-800 leading-relaxed">
              {typeof data.criticalRecommendation === 'string' ? data.criticalRecommendation : JSON.stringify(data.criticalRecommendation)}
            </p>
          </div>
        )}

        {/* Action Plan */}
        {actions.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">📋 行動計畫</h3>
            <div className="space-y-3">
              {actions.map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium shrink-0 ${
                    item.priority?.includes('URGENT') ? 'bg-red-100 text-red-700' :
                    item.priority?.includes('HIGH') ? 'bg-amber-100 text-amber-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {item.priority || 'N/A'}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{item.action}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{item.details}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Strategic Milestone */}
        {data?.strategicMilestone && (
          <div className="bg-gradient-to-r from-indigo-50 to-violet-50 rounded-2xl p-6 shadow-sm border border-indigo-100">
            <h3 className="text-sm font-semibold text-indigo-900 mb-2">🏆 戰略里程碑</h3>
            <p className="text-sm text-indigo-800 leading-relaxed">
              {typeof data.strategicMilestone === 'string' ? data.strategicMilestone : JSON.stringify(data.strategicMilestone)}
            </p>
          </div>
        )}

        {/* Next Round */}
        {data?.nextRoundStrategy && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h3 className="text-sm font-semibold text-slate-900 mb-2">🔜 下一輪策略</h3>
            <p className="text-sm text-slate-700 leading-relaxed">
              {typeof data.nextRoundStrategy === 'string' ? data.nextRoundStrategy : JSON.stringify(data.nextRoundStrategy)}
            </p>
          </div>
        )}
      </div>
    );
  }

  /* Group Taiwan modules by priority */
  if (!taiwan?.modules) return null;
  const priorityGroups: Record<string, typeof taiwan.modules> = {};
  for (const m of taiwan.modules) {
    const key = m.priority;
    if (!priorityGroups[key]) priorityGroups[key] = [];
    priorityGroups[key].push(m);
  }
  const priorityOrder = ["P0", "P1", "P1-JP", "P2", "done"];

  /* Infrastructure counts */
  const infraCounts = { green: 0, yellow: 0, red: 0 };
  for (const item of infrastructure.items) {
    infraCounts[item.health as keyof typeof infraCounts]++;
  }

  /* Chart data for Taiwan modules */
  const chartData = taiwan.modules
    .slice()
    .sort((a, b) => a.completion - b.completion)
    .map((m) => ({
      name: m.name,
      completion: m.completion,
      status: m.status,
    }));

  const cardClass = "bg-white rounded-2xl p-5 shadow-sm border border-slate-100";
  const gap = compact ? "space-y-4" : "space-y-6";

  return (
    <div className={gap}>
      {/* ── Header ── */}
      <div className={`${cardClass} bg-gradient-to-r from-slate-50 to-indigo-50`}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🎯</span>
              <h1 className="text-xl font-bold text-slate-900">戰略審計報告</h1>
              <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-medium">
                Round {data.round}
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              {data.auditId} ·{" "}
              {new Date(data.timestamp).toLocaleString("zh-TW")}
            </p>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="flex flex-col items-end">
              <span className="text-slate-400">下次審計</span>
              <Countdown target={data.nextAuditAt} />
            </div>
            <span className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-medium">
              {company.phase}
            </span>
          </div>
        </div>
      </div>

      {/* ── Section 1: 公司成長概覽 ── */}
      <div className={cardClass}>
        <SectionTitle>
          <span>📈</span> 公司成長概覽
        </SectionTitle>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Headcount */}
          <div className="bg-slate-50 rounded-xl p-4">
            <p className="text-xs text-slate-400 mb-1">人數</p>
            <p className="text-2xl font-bold text-slate-800">
              {company.currentHeadcount}
              <span className="text-sm text-slate-400 font-normal">
                {" "}
                → {company.targetHeadcount}
              </span>
            </p>
            <ProgressBar
              value={company.currentHeadcount}
              max={company.targetHeadcount}
              color="#6366f1"
            />
            <p className="text-xs text-slate-400 mt-1">
              {((company.currentHeadcount / company.targetHeadcount) * 100).toFixed(1)}%
            </p>
          </div>
          {/* MRR */}
          <div className="bg-slate-50 rounded-xl p-4">
            <p className="text-xs text-slate-400 mb-1">MRR</p>
            <p className="text-2xl font-bold text-slate-800">
              {company.currentMRR}
              <span className="text-sm text-slate-400 font-normal">
                {" "}
                → {company.targetMRR_M12}
              </span>
            </p>
            <ProgressBar value={1250} max={7724} color="#10b981" />
            <p className="text-xs text-slate-400 mt-1">16.2%</p>
          </div>
          {/* Clients */}
          <div className="bg-slate-50 rounded-xl p-4">
            <p className="text-xs text-slate-400 mb-1">客戶數</p>
            <p className="text-2xl font-bold text-slate-800">
              {company.currentClients}
              <span className="text-sm text-slate-400 font-normal">
                {" "}
                → {company.targetClients_M12.toLocaleString()}
              </span>
            </p>
            <ProgressBar
              value={company.currentClients}
              max={company.targetClients_M12}
              color="#f59e0b"
            />
            <p className="text-xs text-slate-400 mt-1">
              {((company.currentClients / company.targetClients_M12) * 100).toFixed(1)}%
            </p>
          </div>
          {/* BD */}
          <div className="bg-slate-50 rounded-xl p-4">
            <p className="text-xs text-slate-400 mb-1">BD 人數</p>
            <p className="text-2xl font-bold text-slate-800">
              {company.bdCurrent}
              <span className="text-sm text-slate-400 font-normal">
                {" "}
                → {company.bdTarget}
              </span>
            </p>
            <ProgressBar
              value={company.bdCurrent}
              max={company.bdTarget}
              color="#ef4444"
            />
            <p className="text-xs text-slate-400 mt-1">
              {((company.bdCurrent / company.bdTarget) * 100).toFixed(1)}%
            </p>
          </div>
        </div>
        {/* Status badges */}
        <div className="flex gap-3 flex-wrap">
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
            CRO: {company.croStatus}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
            融資: {company.fundingStatus}
          </span>
        </div>
      </div>

      {/* ── Section 2: 台灣站功能就緒度 ── */}
      <div className={cardClass}>
        <SectionTitle>
          <span>🇹🇼</span> 台灣站功能就緒度
        </SectionTitle>
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left: Gauge + Module List */}
          <div className="lg:w-1/2 space-y-4">
            <div className="flex justify-center">
              <ReadinessGauge value={taiwan.overallReadiness} label="整體就緒度" />
            </div>
            {priorityOrder.map((priority) => {
              const modules = priorityGroups[priority];
              if (!modules) return null;
              const priorityLabel =
                priority === "done"
                  ? "✅ 已上線"
                  : priority === "P1-JP"
                    ? "🇯🇵 P1-JP"
                    : `🔴 ${priority}`;
              return (
                <div key={priority}>
                  <p className="text-sm font-semibold text-slate-600 mb-2">
                    {priorityLabel}
                  </p>
                  <div className="space-y-2">
                    {modules.map((m) => (
                      <div
                        key={m.name}
                        className="flex items-center gap-3 text-sm"
                      >
                        <span className="w-24 truncate text-slate-700 font-medium">
                          {m.name}
                        </span>
                        <StatusBadge status={m.status} />
                        <div className="flex-1">
                          <ProgressBar
                            value={m.completion}
                            max={100}
                            color={STATUS_COLOR[m.status] || "#94a3b8"}
                          />
                        </div>
                        <span className="text-xs text-slate-400 w-10 text-right">
                          {m.completion}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          {/* Right: Bar Chart */}
          <div className="lg:w-1/2">
            <p className="text-sm font-medium text-slate-500 mb-2">
              功能完成度排序
            </p>
            <ResponsiveContainer width="100%" height={450}>
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{ top: 0, right: 20, bottom: 0, left: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={90}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip
                  formatter={(value) => [`${value}%`, "完成度"]}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                  }}
                />
                <Bar dataKey="completion" radius={[0, 4, 4, 0]}>
                  {chartData.map((entry, i) => (
                    <Cell
                      key={i}
                      fill={STATUS_COLOR[entry.status] || "#94a3b8"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ── Section 3: 日本站就緒度 ── */}
      <div className={cardClass}>
        <SectionTitle>
          <span>🇯🇵</span> 日本站就緒度
        </SectionTitle>
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="flex flex-col items-center sm:items-start">
            <ReadinessGauge value={japan.overallReadiness} label="整體就緒度" />
          </div>
          <div className="flex-1 space-y-4">
            {/* Blockers */}
            <div>
              <p className="text-sm font-semibold text-red-600 mb-2">
                🚧 關鍵阻塞
              </p>
              <div className="flex flex-wrap gap-2">
                {japan.blockers.map((b) => (
                  <span
                    key={b}
                    className="px-2.5 py-1 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200"
                  >
                    {b}
                  </span>
                ))}
              </div>
            </div>
            {/* Phase Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {japan.phases.map((p) => {
                const light =
                  p.status === "not_started"
                    ? "#ef4444"
                    : p.status === "blocked_by_infra"
                      ? "#f59e0b"
                      : p.status === "prototype_only"
                        ? "#f59e0b"
                        : "#10b981";
                return (
                  <div
                    key={p.phase}
                    className="bg-slate-50 rounded-xl p-4 border border-slate-200"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: light }}
                      />
                      <span className="text-sm font-semibold text-slate-700">
                        {p.phase}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mb-1">{p.target}</p>
                    <p className="text-xl font-bold text-slate-800">
                      {p.readiness}%
                    </p>
                    <ProgressBar value={p.readiness} max={100} color={light} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── Section 4: 基礎設施健康度 ── */}
      <div className={cardClass}>
        <SectionTitle>
          <span>🏗️</span> 基礎設施健康度
        </SectionTitle>
        {/* Summary counts */}
        <div className="flex gap-4 mb-4 text-sm">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            {infraCounts.green} 正常
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-500" />
            {infraCounts.yellow} 注意
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500" />
            {infraCounts.red} 缺失
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {infrastructure.items.map((item) => (
            <div
              key={item.name}
              className="flex items-center gap-2.5 bg-slate-50 rounded-xl p-3 border border-slate-200"
            >
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{
                  backgroundColor: HEALTH_COLOR[item.health] || "#94a3b8",
                }}
              />
              <div>
                <p className="text-sm font-medium text-slate-700">
                  {item.name}
                </p>
                <p className="text-xs text-slate-400">
                  {item.status === "production" ? "運行中" : "未建立"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Section 5: BD 擴張進度 ── */}
      <div className={cardClass}>
        <SectionTitle>
          <span>🚀</span> BD 擴張進度
        </SectionTitle>
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Timeline */}
          <div className="lg:w-2/3">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm text-slate-500">
                計畫：{bd_expansion.plan}
              </span>
              <span className="text-sm font-semibold text-indigo-600">
                投資：{bd_expansion.totalInvestment}
              </span>
            </div>
            <div className="space-y-3">
              {bd_expansion.phases.map((p) => {
                const isActive = p.status === "active";
                return (
                  <div
                    key={p.name}
                    className={`flex items-start gap-3 p-3 rounded-xl border ${
                      isActive
                        ? "bg-indigo-50 border-indigo-300"
                        : "bg-slate-50 border-slate-200"
                    }`}
                  >
                    <div
                      className={`w-3 h-3 rounded-full mt-1 flex-shrink-0 ${
                        isActive
                          ? "bg-indigo-500 animate-pulse"
                          : p.status === "pending"
                            ? "bg-amber-400"
                            : "bg-slate-300"
                      }`}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-700">
                          {p.name}
                        </span>
                        <span className="text-xs text-slate-400">
                          {p.months}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {p.keyAction}
                      </p>
                    </div>
                    {isActive && (
                      <span className="text-xs bg-indigo-600 text-white px-2 py-0.5 rounded-full">
                        進行中
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          {/* Gates */}
          <div className="lg:w-1/3">
            <p className="text-sm font-semibold text-slate-600 mb-3">
              🚦 Go/No-Go Gates
            </p>
            <div className="space-y-3">
              {bd_expansion.gates.map((g) => (
                <div
                  key={g.gate}
                  className="bg-slate-50 rounded-xl p-3 border border-slate-200"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold text-slate-700">
                      {g.gate}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        g.status === "pending"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {g.status === "pending" ? "待驗證" : "未來"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    {g.deadline} · {g.condition}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Section 6: 麥肯錫建議 ── */}
      <div className={cardClass}>
        <SectionTitle>
          <span>💼</span> 麥肯錫建議
        </SectionTitle>
        <div className="space-y-3">
          {mckinsey_recommendations.map((rec, i) => {
            const badge = PRIORITY_BADGE[rec.priority] || {
              bg: "bg-slate-100",
              text: "text-slate-600",
            };
            return (
              <div
                key={i}
                className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200"
              >
                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0 ${badge.bg} ${badge.text}`}
                >
                  {rec.priority}
                </span>
                <div className="flex-1">
                  <p className="text-sm text-slate-700">{rec.action}</p>
                </div>
                <span className="text-xs bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full flex-shrink-0">
                  {rec.category}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
