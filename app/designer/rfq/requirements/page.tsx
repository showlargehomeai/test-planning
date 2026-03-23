"use client";

import { useState } from "react";
import { clsx } from "clsx";

// ============================================================
// 設計師端 — 需求池管理（Instagram 風格）
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

const materialTypeLabels: Record<string, { label: string; color: string }> = {
  material: { label: "純材料", color: "bg-blue-100 text-blue-700" },
  with_labor: { label: "連工帶料", color: "bg-emerald-100 text-emerald-700" },
  labor_only: { label: "純工資", color: "bg-amber-100 text-amber-700" },
  to_discuss: { label: "待討論", color: "bg-slate-100 text-slate-600" },
};

const statusLabels: Record<string, { label: string; color: string; dot: string }> = {
  published: { label: "公開中", color: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-500" },
  in_progress: { label: "洽談中", color: "bg-amber-100 text-amber-700", dot: "bg-amber-500" },
  closed: { label: "已結案", color: "bg-slate-100 text-slate-500", dot: "bg-slate-400" },
};

const mockRequirements: Requirement[] = [
  {
    id: "REQ-001", title: "客廳 60x60 石英磚 35坪", description: "霧面止滑 R10，需含鋪貼工資，含收邊和踢腳板。現場有電梯可搬運。",
    materialType: "with_labor", materialName: "石英磚", zone: "客廳", budgetMin: 120000, budgetMax: 180000,
    deadline: "2026-04-01", publishType: "public", contactCount: 4, status: "published",
    createdAt: "3 天前", projectName: "大安區現代簡約宅", city: "台北市",
    images: ["https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=600&q=80", "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80"],
  },
  {
    id: "REQ-002", title: "主臥+次臥木地板 16坪", description: "EGGER 或同等級超耐磨，卡扣式，含踢腳板安裝。需先到場丈量。",
    materialType: "with_labor", materialName: "超耐磨木地板", zone: "主臥", budgetMin: 50000, budgetMax: 80000,
    deadline: "2026-04-10", publishType: "public", contactCount: 2, status: "published",
    createdAt: "1 天前", projectName: "大安區現代簡約宅", city: "台北市",
    images: ["https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=600&q=80"],
  },
  {
    id: "REQ-003", title: "浴室防水工程 2間", description: "彈性水泥防水，地面+壁面150cm，需通過48hr蓄水試驗。",
    materialType: "labor_only", materialName: "防水工程", zone: "浴室", budgetMin: 12000, budgetMax: 20000,
    deadline: "2026-04-05", publishType: "public", contactCount: 3, status: "published",
    createdAt: "2 天前", projectName: "大安區現代簡約宅", city: "台北市",
    images: ["https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600&q=80", "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=600&q=80"],
  },
  {
    id: "REQ-004", title: "天花板平釘+間接照明 25坪", description: "矽酸鈣板9mm，輕鋼架，含間接照明溝槽預留。",
    materialType: "with_labor", materialName: "天花板工程", zone: "公共區域", budgetMin: 80000, budgetMax: 130000,
    deadline: "2026-04-15", publishType: "public", contactCount: 1, status: "published",
    createdAt: "剛剛", projectName: "板橋工業風 Loft", city: "新北市",
    images: ["https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=600&q=80", "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=600&q=80"],
  },
  {
    id: "REQ-005", title: "TOTO 免治+壁掛馬桶", description: "指定 TCF-6631T + CW-162，含隱藏水箱安裝配管。需確認水壓。",
    materialType: "material", materialName: "衛浴設備", zone: "浴室", budgetMin: 40000, budgetMax: 50000,
    deadline: "2026-04-20", publishType: "direct", contactCount: 2, status: "in_progress",
    createdAt: "昨天", projectName: "大安區現代簡約宅", city: "台北市",
    images: ["https://images.unsplash.com/photo-1564540586988-aa4e53c3d799?w=600&q=80"],
  },
];

/* ── 新增需求 Modal ── */
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

  // 預設圖片（依 zone）
  const zoneImages: Record<string, string> = {
    "客廳": "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=600&q=80",
    "主臥": "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=600&q=80",
    "廚房": "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80",
    "浴室": "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600&q=80",
    "書房": "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&q=80",
    "公共區域": "https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=600&q=80",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">📢 發布需求</h2>
            <p className="text-xs text-slate-500 mt-0.5">發布到需求池，讓供應商主動報價</p>
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
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} placeholder="規格、施工條件、搬運..." className={inputCls + " resize-none"} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">材料/工程</label>
              <input value={materialName} onChange={e => setMaterialName(e.target.value)} placeholder="石英磚" className={inputCls} />
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
              <label className="block text-sm font-medium text-slate-700 mb-1">專案</label>
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
              <label className="block text-sm font-medium text-slate-700 mb-1">預算下限</label>
              <input type="number" value={budgetMin} onChange={e => setBudgetMin(e.target.value)} placeholder="NT$" className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">預算上限</label>
              <input type="number" value={budgetMax} onChange={e => setBudgetMax(e.target.value)} placeholder="NT$" className={inputCls} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">發布方式</label>
            <div className="flex gap-2">
              <button onClick={() => setPublishType("public")} className={clsx("flex-1 p-3 rounded-xl border-2 text-left", publishType === "public" ? "border-indigo-500 bg-indigo-50" : "border-slate-200")}>
                <p className="text-sm font-medium">🌐 公開</p>
                <p className="text-[10px] text-slate-500">所有供應商可見</p>
              </button>
              <button onClick={() => setPublishType("direct")} className={clsx("flex-1 p-3 rounded-xl border-2 text-left", publishType === "direct" ? "border-indigo-500 bg-indigo-50" : "border-slate-200")}>
                <p className="text-sm font-medium">🎯 指定</p>
                <p className="text-[10px] text-slate-500">只發給選定對象</p>
              </button>
            </div>
          </div>
        </div>
        <div className="p-5 border-t border-slate-200 flex gap-3">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 rounded-lg border border-slate-300 text-sm font-medium text-slate-600">取消</button>
          <button onClick={() => {
            if (!title.trim()) { setErrors({ title: "必填" }); return; }
            onCreate({
              id: `REQ-${String(Math.floor(Math.random() * 900) + 100)}`,
              title, description, materialType, materialName, zone,
              budgetMin: Number(budgetMin) || 0, budgetMax: Number(budgetMax) || 0,
              deadline: deadline || "—", publishType, contactCount: 0, status: "published",
              createdAt: "剛剛", projectName, city: "台北市",
              images: [zoneImages[zone] || zoneImages["客廳"]],
            });
          }} className="flex-1 px-4 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700">📢 發布</button>
        </div>
      </div>
    </div>
  );
}

/* ── 詳情 Modal ── */
function DetailModal({ req, onClose }: { req: Requirement; onClose: () => void }) {
  const [imgIdx, setImgIdx] = useState(0);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="relative aspect-[4/3] bg-slate-900 shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={req.images[imgIdx] || req.images[0]} alt={req.title} className="w-full h-full object-cover" />
          {req.images.length > 1 && (
            <>
              <button onClick={e => { e.stopPropagation(); setImgIdx(i => (i - 1 + req.images.length) % req.images.length); }} className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 text-white rounded-full flex items-center justify-center hover:bg-black/60">‹</button>
              <button onClick={e => { e.stopPropagation(); setImgIdx(i => (i + 1) % req.images.length); }} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 text-white rounded-full flex items-center justify-center hover:bg-black/60">›</button>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {req.images.map((_, i) => <div key={i} className={clsx("w-1.5 h-1.5 rounded-full", i === imgIdx ? "bg-white" : "bg-white/40")} />)}
              </div>
            </>
          )}
          <button onClick={onClose} className="absolute top-3 right-3 w-8 h-8 bg-black/40 text-white rounded-full flex items-center justify-center hover:bg-black/60">✕</button>
          <div className="absolute top-3 left-3 flex gap-1.5">
            <span className={clsx("text-[10px] px-2 py-1 rounded-full font-medium backdrop-blur-sm", statusLabels[req.status]?.color)}>{statusLabels[req.status]?.label}</span>
            <span className={clsx("text-[10px] px-2 py-1 rounded-full backdrop-blur-sm", materialTypeLabels[req.materialType]?.color)}>{materialTypeLabels[req.materialType]?.label}</span>
          </div>
        </div>
        <div className="p-5 overflow-y-auto flex-1">
          <h2 className="text-lg font-bold text-slate-900 mb-1">{req.title}</h2>
          <p className="text-sm text-slate-600 leading-relaxed mb-4">{req.description}</p>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-[10px] text-slate-400">預算</p>
              <p className="font-semibold text-emerald-700">NT$ {req.budgetMin.toLocaleString()} ~ {req.budgetMax.toLocaleString()}</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-[10px] text-slate-400">截止</p>
              <p className="font-semibold text-slate-800">{req.deadline}</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-[10px] text-slate-400">專案</p>
              <p className="text-slate-700">{req.projectName}</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-[10px] text-slate-400">聯繫數</p>
              <p className="text-slate-700">{req.contactCount} 家</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RequirementsPage() {
  const [requirements, setRequirements] = useState(mockRequirements);
  const [showNew, setShowNew] = useState(false);
  const [detailReq, setDetailReq] = useState<Requirement | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");

  const filtered = requirements.filter(r => filter === "all" || r.status === filter);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      {showNew && <NewRequirementModal onClose={() => setShowNew(false)} onCreate={r => { setRequirements(prev => [r, ...prev]); setShowNew(false); setToast(`✅ 需求「${r.title}」已發布`); setTimeout(() => setToast(null), 3000); }} />}
      {detailReq && <DetailModal req={detailReq} onClose={() => setDetailReq(null)} />}
      {toast && <div className="fixed top-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium">{toast}</div>}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">📢 我的需求池</h1>
          <p className="text-sm text-slate-500 mt-1">管理已發布的需求，追蹤供應商回應</p>
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
        <span className="text-xs text-slate-400 self-center ml-auto">{filtered.length} 筆</span>
      </div>

      {/* Instagram Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(req => (
          <div key={req.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow group">
            {/* Header */}
            <div className="flex items-center gap-2.5 px-3.5 py-2.5">
              <div className="flex items-center gap-1">
                <div className={clsx("w-2 h-2 rounded-full", statusLabels[req.status]?.dot)} />
                <span className="text-xs font-medium text-slate-700">{statusLabels[req.status]?.label}</span>
              </div>
              <span className="text-[10px] text-slate-400 ml-auto">{req.createdAt}</span>
              <span className={clsx("text-[10px] px-1.5 py-0.5 rounded-full", materialTypeLabels[req.materialType]?.color)}>{materialTypeLabels[req.materialType]?.label}</span>
            </div>

            {/* Image */}
            <div className="relative aspect-square bg-slate-200 cursor-pointer overflow-hidden" onClick={() => setDetailReq(req)}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={req.images[0]} alt={req.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              {req.images.length > 1 && (
                <div className="absolute top-2 right-2 bg-black/50 text-white text-[10px] px-1.5 py-0.5 rounded">📷 {req.images.length}</div>
              )}
              {req.publishType === "direct" && (
                <div className="absolute top-2 left-2 bg-violet-600 text-white text-[10px] px-2 py-0.5 rounded-full">🎯 指定</div>
              )}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                <p className="text-white font-bold text-sm">
                  {req.budgetMin > 0 ? `NT$ ${req.budgetMin.toLocaleString()} ~ ${req.budgetMax.toLocaleString()}` : "預算待議"}
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="px-3.5 py-3 space-y-2">
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <span>👥 {req.contactCount} 聯繫</span>
                <span>⏰ {req.deadline}</span>
                <span className="ml-auto">📋 {req.projectName}</span>
              </div>
              <p className="text-sm font-semibold text-slate-900 line-clamp-1">{req.title}</p>
              <p className="text-xs text-slate-500 line-clamp-2">{req.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
