"use client";

import { useState } from "react";
import { clsx } from "clsx";

// ============================================================
// 統一需求池 — 設計/工程/建材 三大類
// ============================================================

type RequirementCategory = "design" | "construction" | "material";
type MaterialType = "material" | "with_labor" | "labor_only" | "to_discuss";

interface Requirement {
  id: string;
  category: RequirementCategory;
  title: string;
  description: string;
  materialType: MaterialType;
  tags: string[];
  city: string;
  district: string;
  budgetMin: number;
  budgetMax: number;
  contactCount: number;
  deadline: string;
  createdAt: string;
  projectName: string;
  projectType: string;
  publisherName: string;
  publisherRole: string;
  publisherAvatar: string;
  alreadyContacted: boolean;
  image: string;
  images: string[];
}

const categoryConfig: Record<RequirementCategory, { label: string; color: string; icon: string; bg: string }> = {
  design: { label: "設計規劃", color: "text-violet-700", icon: "🎨", bg: "bg-violet-100" },
  construction: { label: "工程施工", color: "text-amber-700", icon: "👷", bg: "bg-amber-100" },
  material: { label: "建材採購", color: "text-emerald-700", icon: "🧱", bg: "bg-emerald-100" },
};

const materialTypeLabels: Record<MaterialType, { label: string; color: string }> = {
  material: { label: "純材料", color: "bg-blue-100 text-blue-700" },
  with_labor: { label: "連工帶料", color: "bg-emerald-100 text-emerald-700" },
  labor_only: { label: "純工資", color: "bg-amber-100 text-amber-700" },
  to_discuss: { label: "待討論", color: "bg-slate-100 text-slate-600" },
};

const mockRequirements: Requirement[] = [
  // 設計規劃需求（業主找設計師）
  {
    id: "MKT-001", category: "design", title: "30坪新成屋 現代簡約風格設計",
    description: "三房兩廳新成屋，偏好現代簡約風格，預算含設計+施工約 300 萬。需要全室設計+3D效果圖+施工監造。",
    materialType: "to_discuss", tags: ["住宅設計", "新成屋", "現代簡約"], city: "台北市", district: "大安區",
    budgetMin: 2500000, budgetMax: 3500000, contactCount: 6, deadline: "2026-04-15",
    createdAt: "2 小時前", projectName: "大安區新成屋", projectType: "住宅",
    publisherName: "陳怡君", publisherRole: "業主", publisherAvatar: "🏠",
    alreadyContacted: false,
    image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=600&q=80", "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80"],
  },
  {
    id: "MKT-002", category: "design", title: "咖啡廳商空設計 40坪",
    description: "工業風咖啡廳，需含吧台設計、座位規劃、燈光設計。預計 5 月開工。",
    materialType: "to_discuss", tags: ["商空設計", "餐飲", "工業風"], city: "台北市", district: "松山區",
    budgetMin: 1500000, budgetMax: 2000000, contactCount: 3, deadline: "2026-04-30",
    createdAt: "昨天", projectName: "松山咖啡廳", projectType: "商空",
    publisherName: "BREW 咖啡", publisherRole: "業主", publisherAvatar: "☕",
    alreadyContacted: false,
    image: "https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=600&q=80"],
  },

  // 工程施工需求（設計師找工班）
  {
    id: "MKT-003", category: "construction", title: "客廳 60x60 石英磚鋪設 35坪",
    description: "霧面止滑 R10，含收邊和踢腳板。現場有電梯可搬運。偏好冠軍或白馬磁磚。",
    materialType: "with_labor", tags: ["泥作", "磁磚", "鋪貼"], city: "台北市", district: "大安區",
    budgetMin: 120000, budgetMax: 180000, contactCount: 4, deadline: "2026-04-01",
    createdAt: "3 天前", projectName: "大安區現代簡約宅", projectType: "住宅",
    publisherName: "張明哲設計師", publisherRole: "設計師", publisherAvatar: "🎨",
    alreadyContacted: false,
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80", "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600&q=80"],
  },
  {
    id: "MKT-004", category: "construction", title: "浴室防水工程 2間",
    description: "彈性水泥防水，地面+壁面150cm，需通過48hr蓄水試驗。含5年保固。",
    materialType: "labor_only", tags: ["防水", "泥作", "浴室"], city: "台北市", district: "大安區",
    budgetMin: 12000, budgetMax: 20000, contactCount: 3, deadline: "2026-04-05",
    createdAt: "2 天前", projectName: "大安區現代簡約宅", projectType: "住宅",
    publisherName: "張明哲設計師", publisherRole: "設計師", publisherAvatar: "🎨",
    alreadyContacted: true,
    image: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600&q=80"],
  },
  {
    id: "MKT-005", category: "construction", title: "天花板平釘+間接照明 25坪",
    description: "矽酸鈣板9mm輕鋼架。注意：3F無電梯，樓梯搬運。需配合水電。",
    materialType: "with_labor", tags: ["木作", "天花板", "間接照明"], city: "新北市", district: "板橋區",
    budgetMin: 80000, budgetMax: 130000, contactCount: 1, deadline: "2026-04-15",
    createdAt: "剛剛", projectName: "板橋工業風 Loft", projectType: "商空",
    publisherName: "李芳瑜設計師", publisherRole: "設計師", publisherAvatar: "👩‍🎨",
    alreadyContacted: false,
    image: "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=600&q=80", "https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=600&q=80"],
  },
  {
    id: "MKT-006", category: "construction", title: "全室油漆 45坪（2底3面）",
    description: "得利竹炭或虹牌，含批土。壁癌3處需先處理。白色為主，主牆莫蘭迪灰。",
    materialType: "with_labor", tags: ["油漆", "批土", "乳膠漆"], city: "台北市", district: "大安區",
    budgetMin: 70000, budgetMax: 100000, contactCount: 2, deadline: "2026-04-20",
    createdAt: "5 小時前", projectName: "大安區現代簡約宅", projectType: "住宅",
    publisherName: "張明哲設計師", publisherRole: "設計師", publisherAvatar: "🎨",
    alreadyContacted: false,
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80"],
  },

  // 建材採購需求
  {
    id: "MKT-007", category: "material", title: "EGGER 超耐磨木地板 16坪",
    description: "EPL-039 淺橡木或同等級，AC4 以上，E1 低甲醛。含踢腳板。需先提供樣品。",
    materialType: "material", tags: ["木地板", "超耐磨", "EGGER"], city: "台北市", district: "大安區",
    budgetMin: 50000, budgetMax: 80000, contactCount: 2, deadline: "2026-04-10",
    createdAt: "1 天前", projectName: "大安區現代簡約宅", projectType: "住宅",
    publisherName: "張明哲設計師", publisherRole: "設計師", publisherAvatar: "🎨",
    alreadyContacted: false,
    image: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=600&q=80"],
  },
  {
    id: "MKT-008", category: "material", title: "TOTO 免治+壁掛馬桶",
    description: "指定 TCF-6631T + CW-162，含隱藏水箱。需確認水壓相容性。",
    materialType: "material", tags: ["衛浴", "TOTO", "免治馬桶"], city: "台北市", district: "大安區",
    budgetMin: 40000, budgetMax: 50000, contactCount: 2, deadline: "2026-04-20",
    createdAt: "昨天", projectName: "大安區現代簡約宅", projectType: "住宅",
    publisherName: "張明哲設計師", publisherRole: "設計師", publisherAvatar: "🎨",
    alreadyContacted: false,
    image: "https://images.unsplash.com/photo-1564540586988-aa4e53c3d799?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1564540586988-aa4e53c3d799?w=600&q=80", "https://images.unsplash.com/photo-1600566752229-250ed79470f8?w=600&q=80"],
  },
  {
    id: "MKT-009", category: "material", title: "BLUM 五金整批採購",
    description: "隱藏式鉸鏈 x40 + 全展滑軌 x20 + 緩衝門擋 x30。需原廠證明。",
    materialType: "material", tags: ["五金", "BLUM", "鉸鏈"], city: "新北市", district: "板橋區",
    budgetMin: 25000, budgetMax: 35000, contactCount: 1, deadline: "2026-04-15",
    createdAt: "3 小時前", projectName: "板橋工業風 Loft", projectType: "商空",
    publisherName: "李芳瑜設計師", publisherRole: "設計師", publisherAvatar: "👩‍🎨",
    alreadyContacted: false,
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&q=80"],
  },
];

/* ── Contact Modal ── */
function ContactModal({ req, onClose, onContact }: { req: Requirement; onClose: () => void; onContact: (id: string) => void }) {
  const [message, setMessage] = useState("");
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="p-5 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-900">📩 聯繫發布者</h2>
          <p className="text-sm text-slate-500 mt-0.5">{req.title}</p>
        </div>
        <div className="p-5 space-y-3">
          <div className="bg-slate-50 rounded-lg p-3 text-xs space-y-1">
            <div className="flex justify-between"><span className="text-slate-500">預算</span><span className="font-medium">NT$ {req.budgetMin.toLocaleString()} ~ {req.budgetMax.toLocaleString()}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">截止</span><span>{req.deadline}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">競爭</span><span>{req.contactCount} 家已聯繫</span></div>
          </div>
          <textarea value={message} onChange={e => setMessage(e.target.value)} rows={3} placeholder="自我介紹、相關經驗、初步報價..." className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none resize-none focus:ring-2 focus:ring-emerald-500" />
        </div>
        <div className="p-5 border-t border-slate-200 flex gap-3">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 rounded-lg border border-slate-300 text-sm font-medium text-slate-600">取消</button>
          <button onClick={() => onContact(req.id)} className="flex-1 px-4 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700">📩 送出</button>
        </div>
      </div>
    </div>
  );
}

/* ── Detail Modal ── */
function DetailModal({ req, onClose, onContact }: { req: Requirement; onClose: () => void; onContact: () => void }) {
  const [imgIdx, setImgIdx] = useState(0);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="relative aspect-[4/3] bg-slate-900 shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={req.images[imgIdx]} alt={req.title} className="w-full h-full object-cover" />
          {req.images.length > 1 && (
            <>
              <button onClick={e => { e.stopPropagation(); setImgIdx(i => (i - 1 + req.images.length) % req.images.length); }} className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 text-white rounded-full flex items-center justify-center">‹</button>
              <button onClick={e => { e.stopPropagation(); setImgIdx(i => (i + 1) % req.images.length); }} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 text-white rounded-full flex items-center justify-center">›</button>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {req.images.map((_, i) => <div key={i} className={clsx("w-1.5 h-1.5 rounded-full", i === imgIdx ? "bg-white" : "bg-white/40")} />)}
              </div>
            </>
          )}
          <button onClick={onClose} className="absolute top-3 right-3 w-8 h-8 bg-black/40 text-white rounded-full flex items-center justify-center">✕</button>
          <div className="absolute top-3 left-3 flex gap-1.5">
            <span className={clsx("text-[10px] px-2 py-1 rounded-full font-medium backdrop-blur-sm", categoryConfig[req.category].bg, categoryConfig[req.category].color)}>{categoryConfig[req.category].icon} {categoryConfig[req.category].label}</span>
          </div>
        </div>
        <div className="p-5 overflow-y-auto flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-lg">{req.publisherAvatar}</div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-900">{req.publisherName}</p>
              <p className="text-xs text-slate-500">📍 {req.city} {req.district} · {req.createdAt}</p>
            </div>
            {!req.alreadyContacted ? (
              <button onClick={onContact} className="px-4 py-2 text-xs font-medium rounded-lg bg-emerald-600 text-white hover:bg-emerald-700">📩 搶單</button>
            ) : (
              <span className="px-3 py-1.5 text-xs bg-indigo-100 text-indigo-600 rounded-lg">💬 已聯繫</span>
            )}
          </div>
          <h2 className="text-lg font-bold text-slate-900 mb-1">{req.title}</h2>
          <p className="text-sm text-slate-600 leading-relaxed mb-3">{req.description}</p>
          <div className="flex flex-wrap gap-1.5 mb-4">
            {req.tags.map(t => <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">{t}</span>)}
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-slate-50 rounded-lg p-3"><p className="text-[10px] text-slate-400">預算</p><p className="font-semibold text-emerald-700">NT$ {req.budgetMin.toLocaleString()} ~ {req.budgetMax.toLocaleString()}</p></div>
            <div className="bg-slate-50 rounded-lg p-3"><p className="text-[10px] text-slate-400">截止</p><p className="font-semibold">{req.deadline}</p></div>
            <div className="bg-slate-50 rounded-lg p-3"><p className="text-[10px] text-slate-400">專案</p><p>{req.projectName}</p></div>
            <div className="bg-slate-50 rounded-lg p-3"><p className="text-[10px] text-slate-400">聯繫</p><p>{req.contactCount} 家</p></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MarketplacePage() {
  const [reqs, setReqs] = useState(mockRequirements);
  const [contactingReq, setContactingReq] = useState<Requirement | null>(null);
  const [detailReq, setDetailReq] = useState<Requirement | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // Filters
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterCity, setFilterCity] = useState("all");
  const [filterBudget, setFilterBudget] = useState("all");
  const [filterContacted, setFilterContacted] = useState("all");

  const budgetFilter = (r: Requirement) => {
    if (filterBudget === "all") return true;
    if (filterBudget === "under50k") return r.budgetMax <= 50000;
    if (filterBudget === "50k-100k") return r.budgetMax > 50000 && r.budgetMax <= 100000;
    if (filterBudget === "100k-500k") return r.budgetMax > 100000 && r.budgetMax <= 500000;
    if (filterBudget === "over500k") return r.budgetMin >= 500000;
    return true;
  };

  const filtered = reqs
    .filter(r => filterCategory === "all" || r.category === filterCategory)
    .filter(r => filterCity === "all" || r.city === filterCity)
    .filter(budgetFilter)
    .filter(r => filterContacted === "all" || (filterContacted === "available" ? !r.alreadyContacted : r.alreadyContacted));

  const handleContact = (id: string) => {
    setReqs(prev => prev.map(r => r.id === id ? { ...r, alreadyContacted: true, contactCount: r.contactCount + 1 } : r));
    setContactingReq(null);
    setDetailReq(null);
    setToast("✅ 已送出聯繫，聊天室已開啟！");
    setTimeout(() => setToast(null), 3000);
  };

  const cities = [...new Set(reqs.map(r => r.city))];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {contactingReq && <ContactModal req={contactingReq} onClose={() => setContactingReq(null)} onContact={handleContact} />}
      {detailReq && <DetailModal req={detailReq} onClose={() => setDetailReq(null)} onContact={() => { setDetailReq(null); setContactingReq(detailReq); }} />}
      {toast && <div className="fixed top-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium">{toast}</div>}

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">🏪 需求市場</h1>
        <p className="text-sm text-slate-500 mt-1">設計規劃 · 工程施工 · 建材採購 — 所有需求一站瀏覽</p>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2">
        <button onClick={() => setFilterCategory("all")} className={clsx("px-4 py-2 rounded-xl text-sm font-medium transition-all", filterCategory === "all" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600")}>
          全部 <span className="text-xs ml-1 opacity-70">{reqs.length}</span>
        </button>
        {Object.entries(categoryConfig).map(([key, cfg]) => {
          const count = reqs.filter(r => r.category === key).length;
          return (
            <button key={key} onClick={() => setFilterCategory(key)} className={clsx("px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5", filterCategory === key ? `${cfg.bg} ${cfg.color}` : "bg-slate-100 text-slate-600")}>
              <span>{cfg.icon}</span>{cfg.label} <span className="text-xs opacity-70">{count}</span>
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <select value={filterCity} onChange={e => setFilterCity(e.target.value)} className="border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white min-h-[36px]">
          <option value="all">所有地區</option>
          {cities.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={filterBudget} onChange={e => setFilterBudget(e.target.value)} className="border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white min-h-[36px]">
          <option value="all">所有預算</option>
          <option value="under50k">5萬以下</option>
          <option value="50k-100k">5-10萬</option>
          <option value="100k-500k">10-50萬</option>
          <option value="over500k">50萬以上</option>
        </select>
        <div className="flex gap-1">
          {[{ key: "all", label: "全部" }, { key: "available", label: "可搶單" }, { key: "contacted", label: "已聯繫" }].map(f => (
            <button key={f.key} onClick={() => setFilterContacted(f.key)} className={clsx("px-3 py-1.5 rounded-lg text-xs font-medium transition-colors", filterContacted === f.key ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600")}>{f.label}</button>
          ))}
        </div>
        <span className="text-xs text-slate-400 ml-auto">{filtered.length} 筆需求</span>
      </div>

      {/* Instagram Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(req => (
          <div key={req.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow group">
            {/* Header */}
            <div className="flex items-center gap-2.5 px-3.5 py-2.5">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-sm">{req.publisherAvatar}</div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-900 truncate">{req.publisherName}</p>
                <p className="text-[10px] text-slate-400">{req.publisherRole} · {req.city} {req.district}</p>
              </div>
              <span className={clsx("text-[10px] px-1.5 py-0.5 rounded-full", categoryConfig[req.category].bg, categoryConfig[req.category].color)}>{categoryConfig[req.category].icon}</span>
            </div>

            {/* Image */}
            <div className="relative aspect-square bg-slate-200 cursor-pointer overflow-hidden" onClick={() => setDetailReq(req)}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={req.image} alt={req.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              {req.images.length > 1 && <div className="absolute top-2 right-2 bg-black/50 text-white text-[10px] px-1.5 py-0.5 rounded">📷 {req.images.length}</div>}
              {req.alreadyContacted && <div className="absolute top-2 left-2 bg-indigo-600 text-white text-[10px] px-2 py-0.5 rounded-full">✓ 已聯繫</div>}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-3 pt-8">
                <p className="text-white font-bold text-sm">NT$ {req.budgetMin >= 1000000 ? `${(req.budgetMin/10000).toFixed(0)}~${(req.budgetMax/10000).toFixed(0)}萬` : `${req.budgetMin.toLocaleString()} ~ ${req.budgetMax.toLocaleString()}`}</p>
              </div>
            </div>

            {/* Content */}
            <div className="px-3.5 py-3 space-y-2">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>👥 {req.contactCount}</span>
                <span>⏰ {req.deadline}</span>
                <span className="ml-auto text-[10px] text-slate-400">{req.createdAt}</span>
              </div>
              <p className="text-sm font-semibold text-slate-900 line-clamp-1">{req.title}</p>
              <p className="text-xs text-slate-500 line-clamp-2">{req.description}</p>
              <div className="flex flex-wrap gap-1">
                {req.tags.slice(0, 3).map(t => <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">{t}</span>)}
              </div>
              {!req.alreadyContacted ? (
                <button onClick={() => setContactingReq(req)} className="w-full py-2 text-xs font-medium rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors">📩 我要搶單</button>
              ) : (
                <button className="w-full py-2 text-xs font-medium rounded-lg bg-indigo-50 text-indigo-600">💬 查看聊天室</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
