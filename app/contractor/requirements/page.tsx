"use client";

import { useState } from "react";
import { clsx } from "clsx";

// ============================================================
// 供應商端 — 需求池（Instagram 風格）
// 對應後端：GET /api/v1/requirements/pool
// ============================================================

interface PoolRequirement {
  id: string;
  title: string;
  description: string;
  materialType: string;
  materialName: string;
  city: string;
  district: string;
  budgetMin: number;
  budgetMax: number;
  contactCount: number;
  deadline: string;
  createdAt: string;
  projectName: string;
  projectType: string;
  alreadyContacted: boolean;
  locationNote: string;
  designerName: string;
  designerAvatar: string;
  images: string[];
}

const materialTypeLabels: Record<string, { label: string; color: string }> = {
  material: { label: "純材料", color: "bg-blue-100 text-blue-700" },
  with_labor: { label: "連工帶料", color: "bg-emerald-100 text-emerald-700" },
  labor_only: { label: "純工資", color: "bg-amber-100 text-amber-700" },
  to_discuss: { label: "待討論", color: "bg-slate-100 text-slate-600" },
};

// 用 Unsplash 室內設計照片模擬需求圖片
const mockPool: PoolRequirement[] = [
  {
    id: "REQ-001", title: "客廳 60x60 石英磚 35坪",
    description: "霧面止滑 R10，需含鋪貼工資。現場有電梯，偏好冠軍磁磚或白馬磁磚。含收邊和踢腳板。",
    materialType: "with_labor", materialName: "石英磚", city: "台北市", district: "大安區",
    budgetMin: 120000, budgetMax: 180000, contactCount: 4, deadline: "2026-04-01",
    createdAt: "3 天前", projectName: "大安區現代簡約宅", projectType: "住宅",
    alreadyContacted: false, locationNote: "信義路四段，12F，有管理員",
    designerName: "張明哲設計師", designerAvatar: "🎨",
    images: [
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=600&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80",
    ],
  },
  {
    id: "REQ-002", title: "主臥+次臥超耐磨木地板 16坪",
    description: "EGGER 或同等級，卡扣式，AC4 以上，E1 低甲醛。含踢腳板安裝，需先到場丈量。",
    materialType: "with_labor", materialName: "超耐磨木地板", city: "台北市", district: "大安區",
    budgetMin: 50000, budgetMax: 80000, contactCount: 2, deadline: "2026-04-10",
    createdAt: "1 天前", projectName: "大安區現代簡約宅", projectType: "住宅",
    alreadyContacted: true, locationNote: "信義路四段，12F",
    designerName: "張明哲設計師", designerAvatar: "🎨",
    images: [
      "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=600&q=80",
    ],
  },
  {
    id: "REQ-003", title: "浴室防水工程 2間",
    description: "彈性水泥防水，地面+壁面150cm，需通過48hr蓄水試驗。浴室各約2坪，含5年保固。",
    materialType: "labor_only", materialName: "防水工程", city: "台北市", district: "大安區",
    budgetMin: 12000, budgetMax: 20000, contactCount: 3, deadline: "2026-04-05",
    createdAt: "2 天前", projectName: "大安區現代簡約宅", projectType: "住宅",
    alreadyContacted: false, locationNote: "信義路四段，12F",
    designerName: "張明哲設計師", designerAvatar: "🎨",
    images: [
      "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600&q=80",
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=600&q=80",
    ],
  },
  {
    id: "REQ-004", title: "天花板平釘+間接照明 25坪",
    description: "矽酸鈣板9mm輕鋼架，含間接照明溝槽。3F無電梯樓梯搬運，需配合水電埋線。",
    materialType: "with_labor", materialName: "天花板工程", city: "新北市", district: "板橋區",
    budgetMin: 80000, budgetMax: 130000, contactCount: 1, deadline: "2026-04-15",
    createdAt: "剛剛", projectName: "板橋工業風 Loft", projectType: "商空",
    alreadyContacted: false, locationNote: "文化路，3F樓梯搬運",
    designerName: "李芳瑜設計師", designerAvatar: "👩‍🎨",
    images: [
      "https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=600&q=80",
      "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=600&q=80",
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80",
    ],
  },
  {
    id: "REQ-005", title: "全室油漆 45坪（2底3面）",
    description: "得利竹炭或虹牌，含批土整平。壁癌3處需先處理。白色為主，主牆莫蘭迪灰。",
    materialType: "with_labor", materialName: "乳膠漆工程", city: "台北市", district: "大安區",
    budgetMin: 70000, budgetMax: 100000, contactCount: 2, deadline: "2026-04-20",
    createdAt: "5 小時前", projectName: "大安區現代簡約宅", projectType: "住宅",
    alreadyContacted: false, locationNote: "信義路四段，12F",
    designerName: "張明哲設計師", designerAvatar: "🎨",
    images: [
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80",
    ],
  },
  {
    id: "REQ-006", title: "TOTO 免治+壁掛馬桶",
    description: "指定 TCF-6631T + CW-162，含隱藏水箱安裝配管。需確認水壓。",
    materialType: "material", materialName: "衛浴設備", city: "台北市", district: "大安區",
    budgetMin: 40000, budgetMax: 50000, contactCount: 2, deadline: "2026-04-20",
    createdAt: "昨天", projectName: "大安區現代簡約宅", projectType: "住宅",
    alreadyContacted: false, locationNote: "信義路四段，12F",
    designerName: "張明哲設計師", designerAvatar: "🎨",
    images: [
      "https://images.unsplash.com/photo-1564540586988-aa4e53c3d799?w=600&q=80",
      "https://images.unsplash.com/photo-1600566752229-250ed79470f8?w=600&q=80",
    ],
  },
];

/* ── 搶單 Modal ── */
function ContactModal({ req, onClose, onContact }: { req: PoolRequirement; onClose: () => void; onContact: (id: string, msg: string) => void }) {
  const [message, setMessage] = useState("");
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="p-5 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-900">📩 聯繫設計師</h2>
          <p className="text-sm text-slate-500 mt-0.5">{req.title}</p>
        </div>
        <div className="p-5 space-y-4">
          <div className="bg-slate-50 rounded-lg p-3 text-xs space-y-1">
            <div className="flex justify-between"><span className="text-slate-500">預算</span><span className="font-medium">NT$ {req.budgetMin.toLocaleString()} ~ {req.budgetMax.toLocaleString()}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">截止</span><span>{req.deadline}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">競爭</span><span>{req.contactCount} 家已聯繫</span></div>
          </div>
          <textarea value={message} onChange={e => setMessage(e.target.value)} rows={3} placeholder="自我介紹、經驗、初步報價..." className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none resize-none" />
          <p className="text-[10px] text-slate-400">💡 聯繫後將開啟專屬聊天室</p>
        </div>
        <div className="p-5 border-t border-slate-200 flex gap-3">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 rounded-lg border border-slate-300 text-sm font-medium text-slate-600">取消</button>
          <button onClick={() => onContact(req.id, message)} className="flex-1 px-4 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700">📩 送出</button>
        </div>
      </div>
    </div>
  );
}

/* ── 詳情 Modal (Instagram 風格展開) ── */
function DetailModal({ req, onClose, onContact }: { req: PoolRequirement; onClose: () => void; onContact: () => void }) {
  const [imgIdx, setImgIdx] = useState(0);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
        {/* Image carousel */}
        <div className="relative aspect-[4/3] bg-slate-900 shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={req.images[imgIdx] || req.images[0]} alt={req.title} className="w-full h-full object-cover" />
          {req.images.length > 1 && (
            <>
              <button onClick={(e) => { e.stopPropagation(); setImgIdx(i => (i - 1 + req.images.length) % req.images.length); }} className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 text-white rounded-full flex items-center justify-center text-sm hover:bg-black/60">‹</button>
              <button onClick={(e) => { e.stopPropagation(); setImgIdx(i => (i + 1) % req.images.length); }} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 text-white rounded-full flex items-center justify-center text-sm hover:bg-black/60">›</button>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {req.images.map((_, i) => <div key={i} className={clsx("w-1.5 h-1.5 rounded-full", i === imgIdx ? "bg-white" : "bg-white/40")} />)}
              </div>
            </>
          )}
          <button onClick={onClose} className="absolute top-3 right-3 w-8 h-8 bg-black/40 text-white rounded-full flex items-center justify-center hover:bg-black/60">✕</button>
          <div className="absolute top-3 left-3 flex gap-1.5">
            <span className={clsx("text-[10px] px-2 py-1 rounded-full font-medium backdrop-blur-sm", materialTypeLabels[req.materialType]?.color)}>{materialTypeLabels[req.materialType]?.label}</span>
            <span className="text-[10px] px-2 py-1 rounded-full bg-black/40 text-white backdrop-blur-sm">{req.projectType}</span>
          </div>
        </div>
        {/* Content */}
        <div className="p-5 overflow-y-auto flex-1">
          {/* Designer header */}
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-lg">{req.designerAvatar}</div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-900">{req.designerName}</p>
              <p className="text-xs text-slate-500">📍 {req.city} {req.district} · {req.createdAt}</p>
            </div>
            {!req.alreadyContacted ? (
              <button onClick={onContact} className="px-4 py-2 text-xs font-medium rounded-lg bg-emerald-600 text-white hover:bg-emerald-700">📩 搶單</button>
            ) : (
              <span className="px-3 py-1.5 text-xs bg-indigo-100 text-indigo-600 rounded-lg">💬 已聯繫</span>
            )}
          </div>
          {/* Title & description */}
          <h2 className="text-lg font-bold text-slate-900 mb-1">{req.title}</h2>
          <p className="text-sm text-slate-600 leading-relaxed mb-4">{req.description}</p>
          {/* Info grid */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-[10px] text-slate-400 mb-0.5">預算範圍</p>
              <p className="font-semibold text-emerald-700">NT$ {req.budgetMin.toLocaleString()} ~ {req.budgetMax.toLocaleString()}</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-[10px] text-slate-400 mb-0.5">截止日期</p>
              <p className="font-semibold text-slate-800">{req.deadline}</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-[10px] text-slate-400 mb-0.5">現場位置</p>
              <p className="text-slate-700">{req.locationNote}</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-[10px] text-slate-400 mb-0.5">已聯繫</p>
              <p className="text-slate-700">{req.contactCount} 家供應商/工班</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SupplierRequirementsPage() {
  const [pool, setPool] = useState(mockPool);
  const [contactingReq, setContactingReq] = useState<PoolRequirement | null>(null);
  const [detailReq, setDetailReq] = useState<PoolRequirement | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [filterType, setFilterType] = useState("all");
  const [filterContacted, setFilterContacted] = useState("all");
  const [filterCity, setFilterCity] = useState("all");
  const [filterBudget, setFilterBudget] = useState("all");

  const budgetFilter = (r: PoolRequirement) => {
    if (filterBudget === "all") return true;
    if (filterBudget === "under50k") return r.budgetMax <= 50000;
    if (filterBudget === "50k-100k") return r.budgetMin >= 50000 && r.budgetMax <= 100000;
    if (filterBudget === "100k-200k") return r.budgetMin >= 100000 && r.budgetMax <= 200000;
    if (filterBudget === "over200k") return r.budgetMin >= 200000;
    return true;
  };

  const filtered = pool
    .filter(r => filterType === "all" || r.materialType === filterType)
    .filter(r => filterCity === "all" || r.city === filterCity)
    .filter(budgetFilter)
    .filter(r => filterContacted === "all" || (filterContacted === "available" ? !r.alreadyContacted : r.alreadyContacted));

  const handleContact = (id: string) => {
    setPool(prev => prev.map(r => r.id === id ? { ...r, alreadyContacted: true, contactCount: r.contactCount + 1 } : r));
    setContactingReq(null);
    setDetailReq(null);
    setToast("✅ 已送出聯繫，聊天室已開啟！");
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      {contactingReq && <ContactModal req={contactingReq} onClose={() => setContactingReq(null)} onContact={(id) => handleContact(id)} />}
      {detailReq && <DetailModal req={detailReq} onClose={() => setDetailReq(null)} onContact={() => { setDetailReq(null); setContactingReq(detailReq); }} />}
      {toast && <div className="fixed top-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium">{toast}</div>}

      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">🏪 工程需求池</h1>
        <p className="text-sm text-slate-500 mt-1">瀏覽設計師發布的工程需求，主動搶單接案</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500">可搶單</p>
          <p className="text-2xl font-bold text-emerald-600">{pool.filter(r => !r.alreadyContacted).length}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500">已聯繫</p>
          <p className="text-2xl font-bold text-indigo-600">{pool.filter(r => r.alreadyContacted).length}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500">總需求</p>
          <p className="text-2xl font-bold text-slate-700">{pool.length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <select value={filterType} onChange={e => setFilterType(e.target.value)} className="border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white min-h-[36px]">
          <option value="all">所有類型</option>
          {Object.entries(materialTypeLabels).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
        <select value={filterCity} onChange={e => setFilterCity(e.target.value)} className="border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white min-h-[36px]">
          <option value="all">所有地區</option>
          {[...new Set(pool.map(r => r.city))].map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={filterBudget} onChange={e => setFilterBudget(e.target.value)} className="border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white min-h-[36px]">
          <option value="all">所有預算</option>
          <option value="under50k">5萬以下</option>
          <option value="50k-100k">5-10萬</option>
          <option value="100k-200k">10-20萬</option>
          <option value="over200k">20萬以上</option>
        </select>
        <div className="flex gap-1">
          {[{ key: "all", label: "全部" }, { key: "available", label: "可搶單" }, { key: "contacted", label: "已聯繫" }].map(f => (
            <button key={f.key} onClick={() => setFilterContacted(f.key)} className={clsx("px-3 py-1.5 rounded-lg text-xs font-medium transition-colors", filterContacted === f.key ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-600")}>{f.label}</button>
          ))}
        </div>
        <span className="text-xs text-slate-400 ml-auto">{filtered.length} 筆需求</span>
      </div>

      {/* Instagram-style Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(req => (
          <div key={req.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow group">
            {/* Designer header (like IG) */}
            <div className="flex items-center gap-2.5 px-3.5 py-2.5">
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-sm">{req.designerAvatar}</div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-900 truncate">{req.designerName}</p>
                <p className="text-[10px] text-slate-400">📍 {req.city} {req.district}</p>
              </div>
              <span className={clsx("text-[10px] px-1.5 py-0.5 rounded-full", materialTypeLabels[req.materialType]?.color)}>{materialTypeLabels[req.materialType]?.label}</span>
            </div>

            {/* Image (like IG post) */}
            <div className="relative aspect-square bg-slate-200 cursor-pointer overflow-hidden" onClick={() => setDetailReq(req)}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={req.images[0]} alt={req.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              {req.images.length > 1 && (
                <div className="absolute top-2 right-2 bg-black/50 text-white text-[10px] px-1.5 py-0.5 rounded">📷 {req.images.length}</div>
              )}
              {req.alreadyContacted && (
                <div className="absolute top-2 left-2 bg-indigo-600 text-white text-[10px] px-2 py-0.5 rounded-full">✓ 已聯繫</div>
              )}
              {/* Budget overlay */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                <p className="text-white font-bold text-sm">NT$ {req.budgetMin.toLocaleString()} ~ {req.budgetMax.toLocaleString()}</p>
              </div>
            </div>

            {/* Content (like IG caption) */}
            <div className="px-3.5 py-3 space-y-2">
              {/* Action bar (like IG likes/comments) */}
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-500">👥 {req.contactCount} 聯繫</span>
                <span className="text-xs text-slate-500">⏰ {req.deadline}</span>
                <span className="text-[10px] text-slate-400 ml-auto">{req.createdAt}</span>
              </div>

              {/* Title & description */}
              <div>
                <p className="text-sm font-semibold text-slate-900 line-clamp-1">{req.title}</p>
                <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">{req.description}</p>
              </div>

              {/* CTA button */}
              {!req.alreadyContacted ? (
                <button onClick={() => setContactingReq(req)} className="w-full py-2 text-xs font-medium rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors">
                  📩 我要搶單
                </button>
              ) : (
                <button className="w-full py-2 text-xs font-medium rounded-lg bg-indigo-50 text-indigo-600">
                  💬 查看聊天室
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
