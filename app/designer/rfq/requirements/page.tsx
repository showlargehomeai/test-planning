"use client";

import { useState } from "react";
import { clsx } from "clsx";

// ============================================================
// 需求池 — 設計師發布需求，供應商可瀏覽
// 對應後端：POST /api/v1/projects/{id}/requirements
// ============================================================

type PublishType = "public" | "direct";

interface Requirement {
  id: string;
  title: string;
  description: string;
  materialType: string;
  materialName: string;
  zone: string;
  budgetMin: number;
  budgetMax: number;
  deadline: string;
  publishType: PublishType;
  contactCount: number;
  status: "published" | "in_progress" | "closed";
  createdAt: string;
  projectName: string;
  city: string;
  images: string[];
}

const mockRequirements: Requirement[] = [
  {
    id: "REQ-001", title: "客廳 60x60 石英磚 35坪", description: "霧面止滑 R10，需含鋪貼工資，含收邊和踢腳板。現場有電梯可搬運。",
    materialType: "with_labor", materialName: "石英磚", zone: "客廳", budgetMin: 120000, budgetMax: 180000,
    deadline: "2026-04-01", publishType: "public", contactCount: 4, status: "published",
    createdAt: "2026-03-18", projectName: "大安區現代簡約宅", city: "台北市", images: [],
  },
  {
    id: "REQ-002", title: "主臥+次臥木地板 16坪", description: "EGGER 或同等級超耐磨，卡扣式，含踢腳板安裝。需先到場丈量。",
    materialType: "with_labor", materialName: "超耐磨木地板", zone: "主臥", budgetMin: 50000, budgetMax: 80000,
    deadline: "2026-04-10", publishType: "public", contactCount: 2, status: "published",
    createdAt: "2026-03-20", projectName: "大安區現代簡約宅", city: "台北市", images: [],
  },
  {
    id: "REQ-003", title: "浴室防水工程 2間", description: "彈性水泥防水，地面+壁面150cm，需通過48hr蓄水試驗。",
    materialType: "labor_only", materialName: "防水工程", zone: "浴室", budgetMin: 12000, budgetMax: 20000,
    deadline: "2026-04-05", publishType: "public", contactCount: 3, status: "published",
    createdAt: "2026-03-19", projectName: "大安區現代簡約宅", city: "台北市", images: [],
  },
  {
    id: "REQ-004", title: "天花板平釘+間接照明 25坪", description: "矽酸鈣板9mm，輕鋼架，含間接照明溝槽。樓梯搬運（3F無電梯）。",
    materialType: "with_labor", materialName: "天花板工程", zone: "公共區域", budgetMin: 80000, budgetMax: 130000,
    deadline: "2026-04-15", publishType: "public", contactCount: 1, status: "published",
    createdAt: "2026-03-22", projectName: "板橋工業風 Loft", city: "新北市", images: [],
  },
  {
    id: "REQ-005", title: "TOTO 免治馬桶+壁掛馬桶 各1組", description: "指定 TOTO TCF-6631T + CW-162，含安裝配管，需確認水壓。",
    materialType: "material", materialName: "衛浴設備", zone: "浴室", budgetMin: 40000, budgetMax: 50000,
    deadline: "2026-04-20", publishType: "direct", contactCount: 2, status: "in_progress",
    createdAt: "2026-03-21", projectName: "大安區現代簡約宅", city: "台北市", images: [],
  },
];

const materialTypeLabels: Record<string, { label: string; color: string }> = {
  material: { label: "純材料", color: "bg-blue-50 text-blue-700" },
  with_labor: { label: "連工帶料", color: "bg-emerald-50 text-emerald-700" },
  labor_only: { label: "純工資", color: "bg-amber-50 text-amber-700" },
  to_discuss: { label: "待討論", color: "bg-slate-100 text-slate-600" },
};

const statusLabels: Record<string, { label: string; color: string }> = {
  published: { label: "公開中", color: "bg-emerald-50 text-emerald-700" },
  in_progress: { label: "洽談中", color: "bg-amber-50 text-amber-700" },
  closed: { label: "已結案", color: "bg-slate-100 text-slate-500" },
};

/* ── 建立需求 Modal ── */
function NewRequirementModal({ onClose, onCreate }: { onClose: () => void; onCreate: (r: Requirement) => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [materialName, setMaterialName] = useState("");
  const [materialType, setMaterialType] = useState("with_labor");
  const [zone, setZone] = useState("客廳");
  const [budgetMin, setBudgetMin] = useState("");
  const [budgetMax, setBudgetMax] = useState("");
  const [deadline, setDeadline] = useState("");
  const [publishType, setPublishType] = useState<PublishType>("public");
  const [projectName, setProjectName] = useState("大安區現代簡約宅");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const zones = ["客廳", "主臥", "次臥", "廚房", "浴室", "書房", "玄關", "陽台", "公共區域"];
  const projects = ["大安區現代簡約宅", "板橋工業風 Loft", "信義區辦公室改裝"];
  const inputCls = "w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">📢 發布需求</h2>
            <p className="text-xs text-slate-500 mt-0.5">發布到需求池，讓供應商/工班主動報價</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400">✕</button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">需求標題 *</label>
            <input value={title} onChange={e => { setTitle(e.target.value); setErrors(er => ({ ...er, title: "" })); }} placeholder="例如：客廳 60x60 石英磚 35坪" className={inputCls} />
            {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">詳細描述</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} placeholder="規格要求、施工條件、搬運條件..." className={inputCls + " resize-none"} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">材料/工程名稱</label>
              <input value={materialName} onChange={e => setMaterialName(e.target.value)} placeholder="例如：石英磚" className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">發包類型</label>
              <select value={materialType} onChange={e => setMaterialType(e.target.value)} className={inputCls + " bg-white"}>
                {Object.entries(materialTypeLabels).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">所屬專案</label>
              <select value={projectName} onChange={e => setProjectName(e.target.value)} className={inputCls + " bg-white"}>
                {projects.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">區域</label>
              <select value={zone} onChange={e => setZone(e.target.value)} className={inputCls + " bg-white"}>
                {zones.map(z => <option key={z} value={z}>{z}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">截止日</label>
              <input type="date" value={deadline} onChange={e => setDeadline(e.target.value)} className={inputCls} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">預算下限 (NT$)</label>
              <input type="number" value={budgetMin} onChange={e => setBudgetMin(e.target.value)} placeholder="0" className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">預算上限 (NT$)</label>
              <input type="number" value={budgetMax} onChange={e => setBudgetMax(e.target.value)} placeholder="0" className={inputCls} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">發布方式</label>
            <div className="flex gap-2">
              <button onClick={() => setPublishType("public")} className={clsx("flex-1 p-3 rounded-xl border-2 text-left transition-all", publishType === "public" ? "border-indigo-500 bg-indigo-50" : "border-slate-200")}>
                <p className="text-sm font-medium text-slate-800">🌐 公開發布</p>
                <p className="text-[10px] text-slate-500 mt-0.5">所有符合條件的供應商都能看到</p>
              </button>
              <button onClick={() => setPublishType("direct")} className={clsx("flex-1 p-3 rounded-xl border-2 text-left transition-all", publishType === "direct" ? "border-indigo-500 bg-indigo-50" : "border-slate-200")}>
                <p className="text-sm font-medium text-slate-800">🎯 指定發送</p>
                <p className="text-[10px] text-slate-500 mt-0.5">只發給你選定的供應商/工班</p>
              </button>
            </div>
          </div>
        </div>
        <div className="p-5 border-t border-slate-200 flex gap-3">
          <button onClick={onClose} className="px-4 py-2.5 rounded-lg border border-slate-300 text-sm font-medium text-slate-600 hover:bg-slate-50">取消</button>
          <div className="flex-1" />
          <button onClick={() => {
            if (!title.trim()) { setErrors({ title: "必填" }); return; }
            onCreate({
              id: `REQ-${String(Math.floor(Math.random() * 900) + 100)}`,
              title, description, materialType, materialName, zone,
              budgetMin: Number(budgetMin) || 0, budgetMax: Number(budgetMax) || 0,
              deadline: deadline || "—", publishType, contactCount: 0, status: "published",
              createdAt: new Date().toISOString().split("T")[0], projectName, city: "台北市", images: [],
            });
          }} className="px-6 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700">📢 發布需求</button>
        </div>
      </div>
    </div>
  );
}

export default function RequirementsPage() {
  const [requirements, setRequirements] = useState(mockRequirements);
  const [showNew, setShowNew] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");

  const filtered = requirements.filter(r => filter === "all" || r.status === filter);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      {showNew && <NewRequirementModal onClose={() => setShowNew(false)} onCreate={r => { setRequirements(prev => [r, ...prev]); setShowNew(false); setToast(`✅ 需求「${r.title}」已發布到需求池`); setTimeout(() => setToast(null), 3000); }} />}
      {toast && <div className="fixed top-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium">{toast}</div>}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">📢 需求池管理</h1>
          <p className="text-sm text-slate-500 mt-1">發布需求讓供應商/工班主動報價，管理洽談進度</p>
        </div>
        <button onClick={() => setShowNew(true)} className="px-4 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors shrink-0">
          + 發布需求
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500">公開中</p>
          <p className="text-2xl font-bold text-emerald-600">{requirements.filter(r => r.status === "published").length}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500">洽談中</p>
          <p className="text-2xl font-bold text-amber-600">{requirements.filter(r => r.status === "in_progress").length}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500">累計聯繫</p>
          <p className="text-2xl font-bold text-indigo-600">{requirements.reduce((s, r) => s + r.contactCount, 0)}</p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-1.5">
        {[{ key: "all", label: "全部" }, { key: "published", label: "公開中" }, { key: "in_progress", label: "洽談中" }, { key: "closed", label: "已結案" }].map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)} className={clsx("px-3 py-1.5 rounded-lg text-sm font-medium transition-colors", filter === f.key ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600")}>{f.label}</button>
        ))}
      </div>

      {/* Requirements List */}
      <div className="space-y-3">
        {filtered.map(req => (
          <div key={req.id} className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-sm transition-shadow">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono text-slate-400">{req.id}</span>
                  <span className={clsx("text-[10px] px-2 py-0.5 rounded-full", statusLabels[req.status].color)}>{statusLabels[req.status].label}</span>
                  <span className={clsx("text-[10px] px-2 py-0.5 rounded-full", materialTypeLabels[req.materialType]?.color)}>{materialTypeLabels[req.materialType]?.label}</span>
                  {req.publishType === "direct" && <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-50 text-violet-700">🎯 指定</span>}
                </div>
                <h3 className="font-semibold text-slate-900">{req.title}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{req.description}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-bold text-indigo-600">
                  {req.budgetMin > 0 ? `NT$ ${req.budgetMin.toLocaleString()} ~ ${req.budgetMax.toLocaleString()}` : "預算待議"}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">截止 {req.deadline}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-500 pt-2 border-t border-slate-100">
              <span>📋 {req.projectName}</span>
              <span>📍 {req.city}</span>
              <span>🏠 {req.zone}</span>
              <span className="ml-auto">👥 {req.contactCount} 家已聯繫</span>
              <span>{req.createdAt}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
