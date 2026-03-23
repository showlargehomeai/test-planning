"use client";

import { useState } from "react";
import { clsx } from "clsx";

// ============================================================
// Types — 對齊後端 RfqRequirement + RfqProjectMaterial + RfqQuote
// ============================================================

type MaterialType = "material" | "with_labor" | "labor_only" | "to_discuss";

interface RfqItem {
  id: number;
  name: string;
  spec: string;
  quantity: number;
  unit: string;
  zone: string;
  materialType: MaterialType;
  deadline: string;
  note: string;
}

interface Vendor {
  id: number;
  name: string;
  type: string;
  rating: number;
  responseRate: string;
  tags: string[];
}

interface QuoteFromVendor {
  vendorId: number;
  vendorName: string;
  items: {
    rfqItemId: number;
    unitPrice: number;
    subtotal: number;
    note: string;
    deliveryDays: number;
    warranty: string;
  }[];
  totalAmount: number;
  discount: number;
  finalAmount: number;
  validUntil: string;
  deliveryDays: number;
  warranty: string;
  paymentTerms: string;
  submittedAt: string;
}

type RfqStatus = "draft" | "sent" | "quoting" | "comparing" | "awarded" | "closed";

interface Rfq {
  id: string;
  projectName: string;
  clientName: string;
  status: RfqStatus;
  items: RfqItem[];
  vendors: number[];
  quotes: QuoteFromVendor[];
  createdAt: string;
  deadline: string;
  siteAddress: string;
  siteConditions: string[];
}

// ============================================================
// Mock Data
// ============================================================

const materialTypeLabels: Record<MaterialType, string> = {
  material: "純材料",
  with_labor: "連工帶料",
  labor_only: "純工資",
  to_discuss: "待討論",
};

const materialTypeColors: Record<MaterialType, string> = {
  material: "bg-blue-50 text-blue-700",
  with_labor: "bg-emerald-50 text-emerald-700",
  labor_only: "bg-amber-50 text-amber-700",
  to_discuss: "bg-slate-100 text-slate-600",
};

const zones = ["客廳", "主臥", "次臥", "廚房", "浴室", "書房", "玄關", "陽台", "公共區域"];
const units = ["式", "坪", "米", "才", "片", "組", "台", "個", "樘", "套"];

const mockVendors: Vendor[] = [
  { id: 1, name: "冠軍磁磚", type: "建材商", rating: 4.8, responseRate: "95%", tags: ["磁磚", "石材"] },
  { id: 2, name: "EGGER 台灣代理", type: "建材商", rating: 4.7, responseRate: "90%", tags: ["木地板"] },
  { id: 3, name: "王師傅木工班", type: "工班", rating: 4.9, responseRate: "88%", tags: ["木作", "天花板"] },
  { id: 4, name: "張師傅泥作班", type: "工班", rating: 4.6, responseRate: "92%", tags: ["泥作", "防水"] },
  { id: 5, name: "TOTO 衛浴經銷", type: "建材商", rating: 4.8, responseRate: "85%", tags: ["衛浴"] },
  { id: 6, name: "陳師傅水電班", type: "工班", rating: 4.5, responseRate: "90%", tags: ["水電", "弱電"] },
  { id: 7, name: "虹牌油漆經銷", type: "建材商", rating: 4.4, responseRate: "93%", tags: ["油漆"] },
  { id: 8, name: "李師傅油漆班", type: "工班", rating: 4.7, responseRate: "87%", tags: ["油漆", "防水漆"] },
];

const mockRfqs: Rfq[] = [
  {
    id: "RFQ-2026-001",
    projectName: "大安區現代簡約宅",
    clientName: "陳怡君",
    status: "comparing",
    createdAt: "2026-03-18",
    deadline: "2026-03-25",
    siteAddress: "台北市大安區信義路四段 XX 號 12F",
    siteConditions: ["有電梯", "可週一至六施工", "需大樓施工申請", "B1 卸貨區"],
    items: [
      { id: 1, name: "客廳地磚", spec: "霧面石英磚 60x60cm, 止滑 R10", quantity: 35, unit: "坪", zone: "客廳", materialType: "with_labor", deadline: "2026-04-10", note: "含收邊" },
      { id: 2, name: "主臥木地板", spec: "EGGER EPL-039 淺橡木 8mm", quantity: 8, unit: "坪", zone: "主臥", materialType: "with_labor", deadline: "2026-04-15", note: "卡扣式，含踢腳板" },
      { id: 3, name: "浴室防水", spec: "彈性水泥防水，含壁面 150cm", quantity: 4, unit: "坪", zone: "浴室", materialType: "labor_only", deadline: "2026-04-05", note: "需通過蓄水試驗" },
      { id: 4, name: "全室油漆", spec: "得利竹炭淨味乳膠漆，2底3面", quantity: 45, unit: "坪", zone: "公共區域", materialType: "with_labor", deadline: "2026-04-20", note: "批土整平另計" },
    ],
    vendors: [1, 3, 4, 8],
    quotes: [
      {
        vendorId: 3, vendorName: "王師傅木工班",
        items: [
          { rfqItemId: 2, unitPrice: 3800, subtotal: 30400, note: "含踢腳板收邊", deliveryDays: 5, warranty: "1年" },
        ],
        totalAmount: 30400, discount: 0, finalAmount: 30400,
        validUntil: "2026-04-01", deliveryDays: 5, warranty: "1年",
        paymentTerms: "30/40/30", submittedAt: "2026-03-20",
      },
      {
        vendorId: 4, vendorName: "張師傅泥作班",
        items: [
          { rfqItemId: 1, unitPrice: 4200, subtotal: 147000, note: "含磁磚材料+鋪貼", deliveryDays: 7, warranty: "2年" },
          { rfqItemId: 3, unitPrice: 3500, subtotal: 14000, note: "含蓄水試驗", deliveryDays: 3, warranty: "5年" },
        ],
        totalAmount: 161000, discount: 5000, finalAmount: 156000,
        validUntil: "2026-04-01", deliveryDays: 7, warranty: "2-5年",
        paymentTerms: "20/30/30/20", submittedAt: "2026-03-21",
      },
      {
        vendorId: 8, vendorName: "李師傅油漆班",
        items: [
          { rfqItemId: 4, unitPrice: 1800, subtotal: 81000, note: "含批土，不含壁癌處理", deliveryDays: 10, warranty: "1年" },
        ],
        totalAmount: 81000, discount: 0, finalAmount: 81000,
        validUntil: "2026-03-30", deliveryDays: 10, warranty: "1年",
        paymentTerms: "30/40/30", submittedAt: "2026-03-22",
      },
    ],
  },
  {
    id: "RFQ-2026-002",
    projectName: "板橋工業風 Loft",
    clientName: "林志明",
    status: "sent",
    createdAt: "2026-03-22",
    deadline: "2026-03-29",
    siteAddress: "新北市板橋區文化路 XX 號 3F",
    siteConditions: ["無電梯（3F 樓梯搬運）", "週一至五施工", "需鄰居同意書"],
    items: [
      { id: 5, name: "天花板平釘", spec: "矽酸鈣板 9mm，輕鋼架骨架", quantity: 25, unit: "坪", zone: "公共區域", materialType: "with_labor", deadline: "2026-04-10", note: "含間接照明溝槽" },
      { id: 6, name: "木作櫃體", spec: "系統板材，含五金（BLUM鉸鏈+滑軌）", quantity: 3, unit: "組", zone: "客廳", materialType: "with_labor", deadline: "2026-04-20", note: "現場丈量" },
    ],
    vendors: [3],
    quotes: [],
  },
];

const statusConfig: Record<RfqStatus, { label: string; color: string }> = {
  draft: { label: "草稿", color: "bg-slate-100 text-slate-600" },
  sent: { label: "已發送", color: "bg-blue-50 text-blue-700" },
  quoting: { label: "報價中", color: "bg-amber-50 text-amber-700" },
  comparing: { label: "比價中", color: "bg-purple-50 text-purple-700" },
  awarded: { label: "已決標", color: "bg-emerald-50 text-emerald-700" },
  closed: { label: "已結案", color: "bg-slate-100 text-slate-500" },
};

// ============================================================
// Components
// ============================================================

/* ── 新增詢價單 Modal ── */
function NewRfqModal({ onClose, onCreate }: { onClose: () => void; onCreate: (rfq: Rfq) => void }) {
  const [projectName, setProjectName] = useState("");
  const [clientName, setClientName] = useState("");
  const [siteAddress, setSiteAddress] = useState("");
  const [deadline, setDeadline] = useState("");
  const [items, setItems] = useState<RfqItem[]>([
    { id: 1, name: "", spec: "", quantity: 0, unit: "式", zone: "客廳", materialType: "with_labor", deadline: "", note: "" },
  ]);
  const [selectedVendors, setSelectedVendors] = useState<number[]>([]);
  const [step, setStep] = useState(1);
  const [conditions, setConditions] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const conditionOptions = [
    "有電梯", "無電梯", "可週一至六施工", "僅限平日施工", "需大樓施工申請",
    "需鄰居同意書", "B1 卸貨區", "路邊卸貨", "可夜間施工", "需消防申報",
  ];

  const addItem = () => setItems(prev => [...prev, {
    id: Date.now(), name: "", spec: "", quantity: 0, unit: "式",
    zone: "客廳", materialType: "with_labor" as MaterialType, deadline: "", note: "",
  }]);

  const updateItem = (id: number, field: keyof RfqItem, value: string | number) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const removeItem = (id: number) => {
    if (items.length > 1) setItems(prev => prev.filter(item => item.id !== id));
  };

  const toggleVendor = (id: number) => {
    setSelectedVendors(prev => prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id]);
  };

  const inputCls = "w-full px-2.5 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="p-5 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">📋 建立詢價單 (RFQ)</h2>
              <p className="text-sm text-slate-500 mt-0.5">步驟 {step} / 3：{step === 1 ? "專案資訊 + 工項" : step === 2 ? "選擇供應商" : "確認送出"}</p>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400">✕</button>
          </div>
          <div className="flex gap-1.5 mt-3">
            {[1, 2, 3].map(s => <div key={s} className={clsx("h-1 flex-1 rounded-full", s <= step ? "bg-indigo-500" : "bg-slate-200")} />)}
          </div>
        </div>

        <div className="p-5">
          {step === 1 && (
            <div className="space-y-4">
              {/* 專案基本資訊 */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">專案名稱 *</label>
                  <input value={projectName} onChange={e => setProjectName(e.target.value)} placeholder="例如：大安區現代簡約宅" className={inputCls} />
                  {errors.projectName && <p className="text-xs text-red-500 mt-1">{errors.projectName}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">業主 *</label>
                  <input value={clientName} onChange={e => setClientName(e.target.value)} placeholder="例如：陳怡君" className={inputCls} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">工地地址</label>
                  <input value={siteAddress} onChange={e => setSiteAddress(e.target.value)} placeholder="完整地址" className={inputCls} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">報價截止日</label>
                  <input type="date" value={deadline} onChange={e => setDeadline(e.target.value)} className={inputCls} />
                </div>
              </div>
              {/* 現場條件 */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">現場條件（勾選適用項目）</label>
                <div className="flex flex-wrap gap-1.5">
                  {conditionOptions.map(c => (
                    <button key={c} onClick={() => setConditions(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c])} className={clsx(
                      "px-2.5 py-1 rounded-lg text-xs border transition-all",
                      conditions.includes(c) ? "bg-indigo-50 text-indigo-700 border-indigo-300" : "bg-white text-slate-400 border-slate-200"
                    )}>{c}</button>
                  ))}
                </div>
              </div>

              {/* 詢價品項 */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-semibold text-slate-700">詢價品項</label>
                  <button onClick={addItem} className="text-xs text-indigo-600 hover:text-indigo-800 font-medium">+ 新增品項</button>
                </div>
                <div className="space-y-3">
                  {items.map((item, idx) => (
                    <div key={item.id} className="bg-slate-50 rounded-xl p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-slate-500">品項 {idx + 1}</span>
                        {items.length > 1 && <button onClick={() => removeItem(item.id)} className="text-xs text-red-400 hover:text-red-600">移除</button>}
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <input value={item.name} onChange={e => updateItem(item.id, "name", e.target.value)} placeholder="品項名稱 *（例如：客廳地磚）" className={inputCls} />
                        <input value={item.spec} onChange={e => updateItem(item.id, "spec", e.target.value)} placeholder="規格（例如：60x60cm 霧面石英磚）" className={inputCls} />
                      </div>
                      <div className="grid grid-cols-5 gap-2">
                        <input type="number" value={item.quantity || ""} onChange={e => updateItem(item.id, "quantity", Number(e.target.value))} placeholder="數量" className={inputCls} />
                        <select value={item.unit} onChange={e => updateItem(item.id, "unit", e.target.value)} className={inputCls + " bg-white"}>
                          {units.map(u => <option key={u} value={u}>{u}</option>)}
                        </select>
                        <select value={item.zone} onChange={e => updateItem(item.id, "zone", e.target.value)} className={inputCls + " bg-white"}>
                          {zones.map(z => <option key={z} value={z}>{z}</option>)}
                        </select>
                        <select value={item.materialType} onChange={e => updateItem(item.id, "materialType", e.target.value)} className={inputCls + " bg-white"}>
                          {Object.entries(materialTypeLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                        </select>
                        <input type="date" value={item.deadline} onChange={e => updateItem(item.id, "deadline", e.target.value)} className={inputCls} />
                      </div>
                      <input value={item.note} onChange={e => updateItem(item.id, "note", e.target.value)} placeholder="備註（含收邊、搬運條件等）" className={inputCls} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <p className="text-sm text-slate-600">選擇要發送詢價的供應商/工班（建議至少 3 家）</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {mockVendors.map(v => (
                  <button key={v.id} onClick={() => toggleVendor(v.id)} className={clsx(
                    "text-left p-4 rounded-xl border-2 transition-all",
                    selectedVendors.includes(v.id) ? "border-indigo-500 bg-indigo-50" : "border-slate-200 hover:border-slate-300"
                  )}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-sm text-slate-900">{v.name}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">{v.type}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span>⭐ {v.rating}</span>
                      <span>回覆率 {v.responseRate}</span>
                    </div>
                    <div className="flex gap-1 mt-2">
                      {v.tags.map(t => <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">{t}</span>)}
                    </div>
                  </button>
                ))}
              </div>
              <p className="text-xs text-slate-400">已選 {selectedVendors.length} 家</p>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="text-sm font-semibold text-slate-700">確認詢價單</div>
              <div className="bg-slate-50 rounded-xl p-4 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-slate-500">專案</span><span className="font-medium">{projectName} — {clientName}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">地址</span><span>{siteAddress || "—"}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">截止日</span><span>{deadline || "—"}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">品項數</span><span>{items.filter(i => i.name).length} 項</span></div>
                <div className="flex justify-between"><span className="text-slate-500">發送對象</span><span>{selectedVendors.length} 家</span></div>
              </div>
              {/* Items summary */}
              <div className="space-y-1">
                {items.filter(i => i.name).map((item, i) => (
                  <div key={item.id} className="flex items-center gap-2 text-xs bg-white rounded-lg p-2 border border-slate-100">
                    <span className="text-slate-400 w-5">{i + 1}.</span>
                    <span className="font-medium text-slate-800 flex-1">{item.name}</span>
                    <span className="text-slate-500">{item.quantity} {item.unit}</span>
                    <span className={clsx("px-1.5 py-0.5 rounded-full text-[10px]", materialTypeColors[item.materialType])}>{materialTypeLabels[item.materialType]}</span>
                    <span className="text-slate-400">{item.zone}</span>
                  </div>
                ))}
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800">
                ⚠️ 送出後，詢價單將發送給 {selectedVendors.length} 家供應商/工班，對方可在平台上回覆報價。
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-200 flex gap-3">
          {step > 1 ? (
            <button onClick={() => setStep(s => s - 1)} className="px-4 py-2.5 rounded-lg border border-slate-300 text-sm font-medium text-slate-600 hover:bg-slate-50">← 上一步</button>
          ) : (
            <button onClick={onClose} className="px-4 py-2.5 rounded-lg border border-slate-300 text-sm font-medium text-slate-600 hover:bg-slate-50">取消</button>
          )}
          <div className="flex-1" />
          {step < 3 ? (
            <button onClick={() => {
              if (step === 1) {
                const e: Record<string, string> = {};
                if (!projectName.trim()) e.projectName = "必填";
                if (items.every(i => !i.name.trim())) e.items = "至少填一項";
                setErrors(e);
                if (Object.keys(e).length > 0) return;
              }
              setStep(s => s + 1);
            }} className="px-6 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700">下一步 →</button>
          ) : (
            <button onClick={() => {
              const newRfq: Rfq = {
                id: `RFQ-2026-${String(Math.floor(Math.random() * 900) + 100)}`,
                projectName, clientName, status: "sent",
                items: items.filter(i => i.name.trim()),
                vendors: selectedVendors, quotes: [],
                createdAt: new Date().toISOString().split("T")[0],
                deadline: deadline || "—",
                siteAddress, siteConditions: conditions,
              };
              onCreate(newRfq);
            }} className="px-6 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700">📤 送出詢價單</button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── 比價分析面板 ── */
function ComparePanel({ rfq }: { rfq: Rfq }) {
  if (rfq.quotes.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
        <span className="text-4xl block mb-2">📭</span>
        <p className="text-sm text-slate-500">尚未收到報價，等待供應商回覆中...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 逐項比價表 */}
      {rfq.items.map(item => {
        const quotesForItem = rfq.quotes
          .map(q => ({ vendor: q.vendorName, vendorId: q.vendorId, ...q.items.find(qi => qi.rfqItemId === item.id) }))
          .filter(q => q.unitPrice);
        if (quotesForItem.length === 0) return null;

        const prices = quotesForItem.map(q => q.unitPrice || 0);
        const minPrice = Math.min(...prices);

        return (
          <div key={item.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <div>
                <span className="font-semibold text-sm text-slate-900">{item.name}</span>
                <span className="text-xs text-slate-500 ml-2">{item.spec}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">{item.quantity} {item.unit}</span>
                <span className={clsx("text-[10px] px-1.5 py-0.5 rounded-full", materialTypeColors[item.materialType])}>{materialTypeLabels[item.materialType]}</span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left px-4 py-2 text-xs text-slate-500 font-medium">供應商</th>
                    <th className="text-right px-4 py-2 text-xs text-slate-500 font-medium">單價</th>
                    <th className="text-right px-4 py-2 text-xs text-slate-500 font-medium">小計</th>
                    <th className="text-center px-4 py-2 text-xs text-slate-500 font-medium">交期</th>
                    <th className="text-center px-4 py-2 text-xs text-slate-500 font-medium">保固</th>
                    <th className="text-left px-4 py-2 text-xs text-slate-500 font-medium">備註</th>
                  </tr>
                </thead>
                <tbody>
                  {quotesForItem.map(q => (
                    <tr key={q.vendorId} className={clsx("border-b border-slate-50", q.unitPrice === minPrice && "bg-emerald-50/50")}>
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-1.5">
                          {q.unitPrice === minPrice && <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1 rounded">最低</span>}
                          <span className="font-medium text-slate-800">{q.vendor}</span>
                        </div>
                      </td>
                      <td className="px-4 py-2.5 text-right font-mono text-slate-800">NT$ {(q.unitPrice || 0).toLocaleString()}</td>
                      <td className="px-4 py-2.5 text-right font-mono font-semibold text-slate-900">NT$ {(q.subtotal || 0).toLocaleString()}</td>
                      <td className="px-4 py-2.5 text-center text-slate-600">{q.deliveryDays}天</td>
                      <td className="px-4 py-2.5 text-center text-slate-600">{q.warranty}</td>
                      <td className="px-4 py-2.5 text-xs text-slate-500">{q.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}

      {/* 總金額比較 */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="text-sm font-semibold text-slate-700 mb-3">💰 總金額比較</h3>
        <div className="space-y-2">
          {rfq.quotes.sort((a, b) => a.finalAmount - b.finalAmount).map((q, i) => {
            const maxAmount = Math.max(...rfq.quotes.map(q => q.finalAmount));
            return (
              <div key={q.vendorId} className="flex items-center gap-3">
                <span className={clsx("w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold", i === 0 ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500")}>{i + 1}</span>
                <span className="w-28 text-sm font-medium text-slate-800 truncate">{q.vendorName}</span>
                <div className="flex-1 h-6 bg-slate-100 rounded-full overflow-hidden relative">
                  <div className={clsx("h-full rounded-full transition-all", i === 0 ? "bg-emerald-400" : "bg-indigo-300")} style={{ width: `${(q.finalAmount / maxAmount) * 100}%` }} />
                </div>
                <span className="w-32 text-right font-mono text-sm font-semibold text-slate-900">NT$ {q.finalAmount.toLocaleString()}</span>
                <span className="text-xs text-slate-400 w-20">{q.paymentTerms}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Main Page
// ============================================================

export default function RfqPage() {
  const [rfqs, setRfqs] = useState(mockRfqs);
  const [showNewRfq, setShowNewRfq] = useState(false);
  const [selectedRfq, setSelectedRfq] = useState<string | null>(mockRfqs[0]?.id || null);
  const [toast, setToast] = useState<string | null>(null);

  const currentRfq = rfqs.find(r => r.id === selectedRfq);

  const handleCreate = (rfq: Rfq) => {
    setRfqs(prev => [rfq, ...prev]);
    setShowNewRfq(false);
    setSelectedRfq(rfq.id);
    setToast(`✅ 詢價單 ${rfq.id} 已送出給 ${rfq.vendors.length} 家供應商`);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {showNewRfq && <NewRfqModal onClose={() => setShowNewRfq(false)} onCreate={handleCreate} />}
      {toast && <div className="fixed top-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium">{toast}</div>}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">📋 RFQ 詢價管理</h1>
          <p className="text-sm text-slate-500 mt-1">建立詢價單、管理報價、比價分析 — 設計師發包核心工具</p>
        </div>
        <button onClick={() => setShowNewRfq(true)} className="px-4 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors shrink-0">
          + 建立詢價單
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500">進行中</p>
          <p className="text-2xl font-bold text-indigo-600">{rfqs.filter(r => !["closed", "draft"].includes(r.status)).length}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500">等待報價</p>
          <p className="text-2xl font-bold text-amber-600">{rfqs.filter(r => r.status === "sent" || r.status === "quoting").length}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500">比價中</p>
          <p className="text-2xl font-bold text-purple-600">{rfqs.filter(r => r.status === "comparing").length}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500">已決標</p>
          <p className="text-2xl font-bold text-emerald-600">{rfqs.filter(r => r.status === "awarded").length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: RFQ List */}
        <div className="space-y-2">
          <p className="text-sm font-semibold text-slate-700">詢價單列表</p>
          {rfqs.map(rfq => (
            <button
              key={rfq.id}
              onClick={() => setSelectedRfq(rfq.id)}
              className={clsx(
                "w-full text-left p-4 rounded-xl border-2 transition-all",
                selectedRfq === rfq.id ? "border-indigo-500 bg-indigo-50" : "border-slate-200 bg-white hover:border-slate-300"
              )}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-mono text-slate-400">{rfq.id}</span>
                <span className={clsx("text-[10px] px-2 py-0.5 rounded-full font-medium", statusConfig[rfq.status].color)}>{statusConfig[rfq.status].label}</span>
              </div>
              <p className="font-semibold text-sm text-slate-900">{rfq.projectName}</p>
              <p className="text-xs text-slate-500">{rfq.clientName} · {rfq.items.length} 項 · {rfq.quotes.length} 份報價</p>
              <p className="text-[10px] text-slate-400 mt-1">截止 {rfq.deadline}</p>
            </button>
          ))}
        </div>

        {/* Right: Detail + Compare */}
        <div className="lg:col-span-2 space-y-4">
          {currentRfq ? (
            <>
              {/* RFQ Detail Header */}
              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold text-slate-900">{currentRfq.projectName}</h2>
                      <span className={clsx("text-xs px-2 py-0.5 rounded-full", statusConfig[currentRfq.status].color)}>{statusConfig[currentRfq.status].label}</span>
                    </div>
                    <p className="text-sm text-slate-500 mt-0.5">{currentRfq.clientName} · {currentRfq.siteAddress}</p>
                  </div>
                  <span className="text-xs font-mono text-slate-400">{currentRfq.id}</span>
                </div>
                {currentRfq.siteConditions.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {currentRfq.siteConditions.map(c => <span key={c} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">{c}</span>)}
                  </div>
                )}
                {/* Items list */}
                <div className="space-y-1.5">
                  {currentRfq.items.map((item, i) => (
                    <div key={item.id} className="flex items-center gap-2 text-xs p-2 bg-slate-50 rounded-lg">
                      <span className="text-slate-400 w-4">{i + 1}</span>
                      <span className="font-medium text-slate-800 flex-1">{item.name}</span>
                      <span className="text-slate-500 hidden sm:inline">{item.spec}</span>
                      <span className="text-slate-600">{item.quantity} {item.unit}</span>
                      <span className={clsx("px-1.5 py-0.5 rounded-full text-[10px]", materialTypeColors[item.materialType])}>{materialTypeLabels[item.materialType]}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Compare Panel */}
              <ComparePanel rfq={currentRfq} />
            </>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
              <span className="text-4xl block mb-2">📋</span>
              <p className="text-sm text-slate-500">選擇左側詢價單查看詳情</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
