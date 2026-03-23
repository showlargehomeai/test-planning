import { readFileSync } from "fs";
import path from "path";

interface DevlogEntry {
  id: string;
  date: string;
  feature: string;
  page: string;
  type: string;
  status: string;
  summary: string;
  frontend: {
    changes: string[];
    files: string[];
  };
  backend: {
    existingSchema?: Record<string, unknown>;
    gaps: string[];
    integrationPlan: string;
  };
  roleAccess: Record<string, string>;
  conflicts: string;
  viability: string;
}

export const metadata = {
  title: "開發日誌 — TestPlanning",
  description: "功能開發追蹤、前後端設計驗證",
};

export default function DevlogPage() {
  let entries: DevlogEntry[] = [];
  try {
    const raw = readFileSync(path.join(process.cwd(), "content/devlog/entries.json"), "utf-8");
    entries = JSON.parse(raw);
  } catch {
    entries = [];
  }

  const statusColors: Record<string, string> = {
    "frontend-only": "bg-amber-50 text-amber-700 border-amber-200",
    "integrated": "bg-emerald-50 text-emerald-700 border-emerald-200",
    "planned": "bg-blue-50 text-blue-700 border-blue-200",
    "deprecated": "bg-red-50 text-red-700 border-red-200",
  };

  const statusLabels: Record<string, string> = {
    "frontend-only": "前端 Mock",
    "integrated": "已串接後端",
    "planned": "規劃中",
    "deprecated": "已棄用",
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">🛠️ 開發日誌（Dev Log）</h1>
        <p className="text-sm text-slate-500 mt-1">
          每次功能開發的完整紀錄：前後端變化、Schema 驗證、角色權限、衝突檢查、可行性分析
        </p>
        <div className="flex gap-3 mt-3 flex-wrap">
          <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-600">
            共 {entries.length} 筆紀錄
          </span>
          <span className="text-xs px-2 py-1 rounded-full bg-amber-50 text-amber-600 border border-amber-200">
            前端 Mock: {entries.filter(e => e.status === "frontend-only").length}
          </span>
          <span className="text-xs px-2 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
            已串接: {entries.filter(e => e.status === "integrated").length}
          </span>
        </div>
      </div>

      {entries.map((entry) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const schema = entry.backend?.existingSchema as any;
        return (
          <div key={entry.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="p-5 border-b border-slate-100">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-slate-400">{entry.id}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${statusColors[entry.status] || "bg-slate-100 text-slate-600"}`}>
                      {statusLabels[entry.status] || entry.status}
                    </span>
                    <span className="text-xs text-slate-400">{entry.date}</span>
                  </div>
                  <h2 className="text-lg font-bold text-slate-900">{entry.feature}</h2>
                  <p className="text-sm text-slate-500 mt-0.5">頁面：<code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs">{entry.page}</code></p>
                </div>
              </div>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">{entry.summary}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
              {/* Frontend */}
              <div className="p-5">
                <h3 className="text-sm font-semibold text-blue-700 mb-2">🖥️ 前端變更</h3>
                <div className="space-y-1.5 mb-3">
                  {entry.frontend.changes.map((c, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-xs text-slate-600">
                      <span className="text-blue-400 shrink-0 mt-0.5">•</span>
                      <span>{c}</span>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-1">
                  {entry.frontend.files.map((f, i) => (
                    <code key={i} className="text-[10px] px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded">{f}</code>
                  ))}
                </div>
              </div>

              {/* Backend */}
              <div className="p-5">
                <h3 className="text-sm font-semibold text-purple-700 mb-2">⚙️ 後端分析</h3>
                {schema && (
                  <div className="bg-purple-50 rounded-lg p-3 mb-3 text-xs">
                    <p className="font-medium text-purple-800 mb-1">現有 Schema:</p>
                    {schema.table && <p className="text-purple-600">Table: <code className="bg-white px-1 rounded">{String(schema.table)}</code></p>}
                    {schema.service && <p className="text-purple-600">Service: <code className="bg-white px-1 rounded">{String(schema.service)}</code></p>}
                    {schema.api && <p className="text-purple-600">API: <code className="bg-white px-1 rounded">{String(schema.api)}</code></p>}
                    {schema.note && <p className="text-purple-600 mt-1 italic">{String(schema.note)}</p>}
                    {Array.isArray(schema.fields) && (
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {(schema.fields as string[]).slice(0, 6).map((f, i) => (
                          <code key={i} className="text-[10px] px-1 py-0.5 bg-white text-purple-700 rounded border border-purple-200">{f}</code>
                        ))}
                        {(schema.fields as string[]).length > 6 && <span className="text-[10px] text-purple-400">+{(schema.fields as string[]).length - 6} more</span>}
                      </div>
                    )}
                  </div>
                )}
                <p className="text-xs font-medium text-red-600 mb-1">⚠️ Gaps:</p>
                <div className="space-y-1 mb-3">
                  {entry.backend.gaps.map((g, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-xs text-slate-600">
                      <span className="text-red-400 shrink-0 mt-0.5">!</span>
                      <span>{g}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs font-medium text-emerald-600 mb-1">🔗 串接計畫:</p>
                <p className="text-xs text-slate-600 leading-relaxed">{entry.backend.integrationPlan}</p>
              </div>
            </div>

            {/* Footer: Role Access + Conflicts + Viability */}
            <div className="p-5 bg-slate-50 border-t border-slate-100 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Roles */}
                <div>
                  <p className="text-xs font-semibold text-slate-700 mb-1.5">👤 角色權限</p>
                  <div className="space-y-1">
                    {Object.entries(entry.roleAccess).map(([role, access]) => (
                      <div key={role} className="flex items-start gap-1.5 text-xs">
                        <span className="font-medium text-slate-600 w-16 shrink-0">{role}:</span>
                        <span className="text-slate-500">{access}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Conflicts */}
                <div>
                  <p className="text-xs font-semibold text-slate-700 mb-1.5">💥 衝突檢查</p>
                  <p className="text-xs text-slate-600 leading-relaxed">{entry.conflicts}</p>
                </div>
                {/* Viability */}
                <div>
                  <p className="text-xs font-semibold text-slate-700 mb-1.5">✅ 可行性</p>
                  <p className="text-xs text-slate-600 leading-relaxed">{entry.viability}</p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
