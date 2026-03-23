"use client";

import { useState } from "react";
import { clsx } from "clsx";

// ============================================================
// 供應商端 — 需求池瀏覽 + 搶單
// 對應後端：GET /api/v1/requirements/pool + POST /requirements/{id}/contact
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
}

const materialTypeLabels: Record<string, { label: string; color: string }> = {
  material: { label: "純材料", color: "bg-blue-50 text-blue-700 border-blue-200" },
  with_labor: { label: "連工帶料", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  labor_only: { label: "純工資", color: "bg-amber-50 text-amber-700 border-amber-200" },
  to_discuss: { label: "待討論", color: "bg-slate-100 text-slate-600 border-slate-200" },
};

const mockPool: PoolRequirement[] = [
  {
    id: "REQ-001", title: "客廳 60x60 石英磚 35坪",
    description: "霧面止滑 R10，需含鋪貼工資，含收邊和踢腳板。現場有電梯可搬運。業主偏好冠軍磁磚或白馬磁磚。",
    materialType: "with_labor", materialName: "石英磚", city: "台北市", district: "大安區",
    budgetMin: 120000, budgetMax: 180000, contactCount: 4, deadline: "2026-04-01",
    createdAt: "2026-03-18", projectName: "住宅室內裝修", projectType: "住宅",
    alreadyContacted: false, locationNote: "信義路四段，12F，有管理員",
  },
  {
    id: "REQ-002", title: "主臥+次臥超耐磨木地板 16坪",
    description: "EGGER 或同等級，卡扣式安裝，含踢腳板。需先到場丈量確認。AC4 以上等級，E1 低甲醛。",
    materialType: "with_labor", materialName: "超耐磨木地板", city: "台北市", district: "大安區",
    budgetMin: 50000, budgetMax: 80000, contactCount: 2, deadline: "2026-04-10",
    createdAt: "2026-03-20", projectName: "住宅室內裝修", projectType: "住宅",
    alreadyContacted: true, locationNote: "信義路四段，12F",
  },
  {
    id: "REQ-003", title: "浴室防水工程 2間",
    description: "彈性水泥防水，地面全做+壁面150cm，需通過48hr蓄水試驗，含保固5年。浴室各約2坪。",
    materialType: "labor_only", materialName: "防水工程", city: "台北市", district: "大安區",
    budgetMin: 12000, budgetMax: 20000, contactCount: 3, deadline: "2026-04-05",
    createdAt: "2026-03-19", projectName: "住宅室內裝修", projectType: "住宅",
    alreadyContacted: false, locationNote: "信義路四段，12F",
  },
  {
    id: "REQ-004", title: "天花板平釘+間接照明 25坪",
    description: "矽酸鈣板9mm輕鋼架，含間接照明溝槽預留。注意：3F無電梯，樓梯搬運。需配合水電師傅埋線。",
    materialType: "with_labor", materialName: "天花板工程", city: "新北市", district: "板橋區",
    budgetMin: 80000, budgetMax: 130000, contactCount: 1, deadline: "2026-04-15",
    createdAt: "2026-03-22", projectName: "商業空間裝修", projectType: "商空",
    alreadyContacted: false, locationNote: "文化路，3F樓梯搬運",
  },
  {
    id: "REQ-005", title: "全室油漆 45坪（2底3面）",
    description: "得利竹炭或虹牌同等級，含批土整平。壁癌區域需先處理（約3處）。顏色：白色為主，主牆莫蘭迪灰。",
    materialType: "with_labor", materialName: "乳膠漆工程", city: "台北市", district: "大安區",
    budgetMin: 70000, budgetMax: 100000, contactCount: 2, deadline: "2026-04-20",
    createdAt: "2026-03-22", projectName: "住宅室內裝修", projectType: "住宅",
    alreadyContacted: false, locationNote: "信義路四段，12F",
  },
  {
    id: "REQ-006", title: "TOTO 免治馬桶+壁掛馬桶 報價",
    description: "指定 TCF-6631T + CW-162，含隱藏水箱安裝配管。需確認現場水壓是否足夠。",
    materialType: "material", materialName: "衛浴設備", city: "台北市", district: "大安區",
    budgetMin: 40000, budgetMax: 50000, contactCount: 2, deadline: "2026-04-20",
    createdAt: "2026-03-21", projectName: "住宅室內裝修", projectType: "住宅",
    alreadyContacted: false, locationNote: "信義路四段，12F",
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
            <div className="flex justify-between"><span className="text-slate-500">預算範圍</span><span className="font-medium">NT$ {req.budgetMin.toLocaleString()} ~ {req.budgetMax.toLocaleString()}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">截止日期</span><span>{req.deadline}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">已有聯繫</span><span>{req.contactCount} 家</span></div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">您的訊息（選填）</label>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              rows={3}
              placeholder="自我介紹、相關經驗、初步報價範圍..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none resize-none"
            />
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800">
            💡 聯繫後將開啟與設計師的專屬聊天室，可以進一步討論細節和報價。
          </div>
        </div>
        <div className="p-5 border-t border-slate-200 flex gap-3">
          <button onClick={onClose} className="px-4 py-2.5 rounded-lg border border-slate-300 text-sm font-medium text-slate-600 hover:bg-slate-50">取消</button>
          <div className="flex-1" />
          <button onClick={() => onContact(req.id, message)} className="px-6 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700">📩 送出聯繫</button>
        </div>
      </div>
    </div>
  );
}

export default function SupplierRequirementsPage() {
  const [pool, setPool] = useState(mockPool);
  const [contactingReq, setContactingReq] = useState<PoolRequirement | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [filterType, setFilterType] = useState("all");
  const [filterCity, setFilterCity] = useState("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = pool
    .filter(r => filterType === "all" || r.materialType === filterType)
    .filter(r => filterCity === "all" || r.city === filterCity);

  const handleContact = (id: string, msg: string) => {
    setPool(prev => prev.map(r => r.id === id ? { ...r, alreadyContacted: true, contactCount: r.contactCount + 1 } : r));
    setContactingReq(null);
    setToast("✅ 已送出聯繫，聊天室已開啟！");
    setTimeout(() => setToast(null), 3000);
  };

  const cities = [...new Set(pool.map(r => r.city))];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      {contactingReq && <ContactModal req={contactingReq} onClose={() => setContactingReq(null)} onContact={handleContact} />}
      {toast && <div className="fixed top-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium">{toast}</div>}

      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">🏪 需求池</h1>
        <p className="text-sm text-slate-500 mt-1">瀏覽設計師發布的需求，主動聯繫搶單</p>
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
      <div className="flex flex-wrap gap-2">
        <select value={filterType} onChange={e => setFilterType(e.target.value)} className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 bg-white">
          <option value="all">所有類型</option>
          {Object.entries(materialTypeLabels).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
        <select value={filterCity} onChange={e => setFilterCity(e.target.value)} className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 bg-white">
          <option value="all">所有地區</option>
          {cities.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <span className="text-xs text-slate-400 self-center ml-2">{filtered.length} 筆需求</span>
      </div>

      {/* Requirements */}
      <div className="space-y-3">
        {filtered.map(req => (
          <div key={req.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-sm transition-shadow">
            <div className="p-5">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className={clsx("text-[10px] px-2 py-0.5 rounded-full border", materialTypeLabels[req.materialType]?.color)}>{materialTypeLabels[req.materialType]?.label}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">{req.projectType}</span>
                    <span className="text-[10px] text-slate-400">📍 {req.city} {req.district}</span>
                    {req.alreadyContacted && <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600">✓ 已聯繫</span>}
                  </div>
                  <h3 className="font-semibold text-slate-900">{req.title}</h3>
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{req.description}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-lg font-bold text-emerald-600">
                    {req.budgetMax > 0 ? `${(req.budgetMax / 10000).toFixed(0)}萬` : "議價"}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    {req.budgetMin > 0 && `${(req.budgetMin / 10000).toFixed(0)}~${(req.budgetMax / 10000).toFixed(0)}萬`}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span>👥 {req.contactCount} 家聯繫</span>
                  <span>⏰ 截止 {req.deadline}</span>
                  <button onClick={() => setExpanded(expanded === req.id ? null : req.id)} className="text-indigo-600 hover:text-indigo-800 font-medium">
                    {expanded === req.id ? "收起 ▲" : "詳情 ▼"}
                  </button>
                </div>
                {!req.alreadyContacted ? (
                  <button onClick={() => setContactingReq(req)} className="px-4 py-2 text-xs font-medium rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors">
                    📩 我要搶單
                  </button>
                ) : (
                  <button className="px-4 py-2 text-xs font-medium rounded-lg bg-indigo-100 text-indigo-600 cursor-default">
                    💬 聊天室已開啟
                  </button>
                )}
              </div>

              {expanded === req.id && (
                <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                  <div><span className="text-slate-400">材料名稱：</span><span className="text-slate-700">{req.materialName}</span></div>
                  <div><span className="text-slate-400">專案類型：</span><span className="text-slate-700">{req.projectType}</span></div>
                  <div><span className="text-slate-400">現場位置：</span><span className="text-slate-700">{req.locationNote}</span></div>
                  <div><span className="text-slate-400">發布日期：</span><span className="text-slate-700">{req.createdAt}</span></div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
