"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { clsx } from "clsx";

/* ── Types ── */
interface QuoteItem {
  id: number;
  category: string;
  item: string;
  spec: string;
  unit: string;
  qty: number;
  unitPrice: number;
  marketLow: number;
  marketHigh: number;
}

interface MaterialItem {
  id: number;
  name: string;
  category: string;
  brand: string;
  price: number;
  unit: string;
}

/* ── Mock: 範本分類工項 ── */
const templateItems: Record<string, QuoteItem[]> = {
  "住宅全室裝修": [
    { id: 1, category: "保護拆除", item: "室內保護工程", spec: "地板+門框+電梯保護", unit: "式", qty: 1, unitPrice: 15000, marketLow: 12000, marketHigh: 18000 },
    { id: 2, category: "保護拆除", item: "地板拆除", spec: "含廢棄物清運", unit: "坪", qty: 0, unitPrice: 1500, marketLow: 1200, marketHigh: 2000 },
    { id: 3, category: "保護拆除", item: "牆面拆除", spec: "非承重牆", unit: "面", qty: 0, unitPrice: 5000, marketLow: 4000, marketHigh: 7000 },
    { id: 4, category: "水電工程", item: "配電迴路新增", spec: "含開關插座", unit: "迴", qty: 0, unitPrice: 3500, marketLow: 3000, marketHigh: 4500 },
    { id: 5, category: "水電工程", item: "冷熱水管配置", spec: "不鏽鋼管", unit: "間", qty: 0, unitPrice: 15000, marketLow: 12000, marketHigh: 18000 },
    { id: 6, category: "水電工程", item: "糞管移位", spec: "含防水測試", unit: "間", qty: 0, unitPrice: 12000, marketLow: 10000, marketHigh: 15000 },
    { id: 7, category: "泥作工程", item: "地磚鋪設", spec: "60x60 磁磚", unit: "坪", qty: 0, unitPrice: 4500, marketLow: 3800, marketHigh: 5500 },
    { id: 8, category: "泥作工程", item: "壁磚鋪設", spec: "30x60 壁磚", unit: "坪", qty: 0, unitPrice: 5000, marketLow: 4200, marketHigh: 6000 },
    { id: 9, category: "泥作工程", item: "防水處理", spec: "浴室防水三層", unit: "間", qty: 0, unitPrice: 12000, marketLow: 10000, marketHigh: 15000 },
    { id: 10, category: "木作工程", item: "天花板", spec: "平頂矽酸鈣板", unit: "坪", qty: 0, unitPrice: 3800, marketLow: 3200, marketHigh: 4500 },
    { id: 11, category: "木作工程", item: "間接照明天花板", spec: "含燈槽", unit: "尺", qty: 0, unitPrice: 1200, marketLow: 1000, marketHigh: 1500 },
    { id: 12, category: "木作工程", item: "系統櫃", spec: "含五金配件", unit: "尺", qty: 0, unitPrice: 5200, marketLow: 4500, marketHigh: 6500 },
    { id: 13, category: "木作工程", item: "木作門片", spec: "含門框+五金", unit: "樘", qty: 0, unitPrice: 12000, marketLow: 10000, marketHigh: 16000 },
    { id: 14, category: "油漆工程", item: "全室油漆", spec: "乳膠漆兩底兩面", unit: "坪", qty: 0, unitPrice: 1200, marketLow: 900, marketHigh: 1500 },
    { id: 15, category: "油漆工程", item: "特殊漆", spec: "珪藻土/仿清水模", unit: "坪", qty: 0, unitPrice: 3500, marketLow: 2500, marketHigh: 5000 },
    { id: 16, category: "廚衛設備", item: "衛浴設備安裝", spec: "含馬桶+面盆+淋浴", unit: "間", qty: 0, unitPrice: 8000, marketLow: 6000, marketHigh: 12000 },
    { id: 17, category: "廚衛設備", item: "廚具安裝", spec: "含上下櫃+檯面", unit: "式", qty: 0, unitPrice: 5000, marketLow: 3000, marketHigh: 8000 },
    { id: 18, category: "其他", item: "冷氣安裝", spec: "壁掛分離式", unit: "台", qty: 0, unitPrice: 5000, marketLow: 4000, marketHigh: 7000 },
    { id: 19, category: "其他", item: "窗簾安裝", spec: "含軌道", unit: "窗", qty: 0, unitPrice: 3000, marketLow: 2000, marketHigh: 5000 },
    { id: 20, category: "設計監造", item: "設計費", spec: "含 3D 渲染圖", unit: "坪", qty: 0, unitPrice: 3000, marketLow: 2000, marketHigh: 6000 },
    { id: 21, category: "設計監造", item: "監造費", spec: "工地監工管理", unit: "坪", qty: 0, unitPrice: 1500, marketLow: 1000, marketHigh: 2500 },
  ],
  "局部翻新": [
    { id: 101, category: "拆除", item: "局部拆除", spec: "指定區域", unit: "式", qty: 1, unitPrice: 20000, marketLow: 15000, marketHigh: 30000 },
    { id: 102, category: "泥作", item: "磁磚修補", spec: "局部換磚", unit: "坪", qty: 0, unitPrice: 5500, marketLow: 4500, marketHigh: 7000 },
    { id: 103, category: "油漆", item: "局部粉刷", spec: "指定牆面", unit: "坪", qty: 0, unitPrice: 1000, marketLow: 800, marketHigh: 1500 },
    { id: 104, category: "木作", item: "櫃體修改", spec: "含門片更換", unit: "尺", qty: 0, unitPrice: 4800, marketLow: 4000, marketHigh: 6000 },
  ],
  "商業空間": [
    { id: 201, category: "拆除", item: "全室拆除", spec: "含清運", unit: "坪", qty: 0, unitPrice: 2000, marketLow: 1500, marketHigh: 2500 },
    { id: 202, category: "水電", item: "商用配電", spec: "三相電+獨立迴路", unit: "式", qty: 1, unitPrice: 80000, marketLow: 60000, marketHigh: 120000 },
    { id: 203, category: "裝修", item: "地坪 epoxy", spec: "商用耐磨", unit: "坪", qty: 0, unitPrice: 3000, marketLow: 2500, marketHigh: 4000 },
    { id: 204, category: "裝修", item: "玻璃隔間", spec: "含五金", unit: "面", qty: 0, unitPrice: 15000, marketLow: 12000, marketHigh: 20000 },
    { id: 205, category: "設計", item: "商空設計費", spec: "含施工圖", unit: "坪", qty: 0, unitPrice: 4000, marketLow: 3000, marketHigh: 8000 },
  ],
  "辦公室裝修": [
    { id: 301, category: "基礎", item: "地毯鋪設", spec: "方塊地毯", unit: "坪", qty: 0, unitPrice: 2500, marketLow: 2000, marketHigh: 3500 },
    { id: 302, category: "基礎", item: "輕鋼架天花板", spec: "含 LED 燈具", unit: "坪", qty: 0, unitPrice: 2800, marketLow: 2200, marketHigh: 3500 },
    { id: 303, category: "隔間", item: "輕隔間", spec: "雙面矽酸鈣板", unit: "坪", qty: 0, unitPrice: 3500, marketLow: 3000, marketHigh: 4500 },
    { id: 304, category: "設備", item: "門禁系統", spec: "含感應卡", unit: "套", qty: 0, unitPrice: 25000, marketLow: 18000, marketHigh: 35000 },
  ],
};

const mockHistory = [
  { id: "Q-2026-001", client: "陳怡君", project: "大安區現代簡約宅", total: 1850000, status: "已簽約", date: "2026-03-10", margin: 32 },
  { id: "Q-2026-002", client: "林志明", project: "板橋工業風 Loft", total: 980000, status: "待確認", date: "2026-03-08", margin: 28 },
  { id: "Q-2025-012", client: "王美玲", project: "信義區北歐親子宅", total: 2450000, status: "已簽約", date: "2025-12-20", margin: 35 },
  { id: "Q-2025-011", client: "張家豪", project: "西屯日式無印小宅", total: 1120000, status: "已過期", date: "2025-11-15", margin: 25 },
];

/* ── Helpers ── */
function getPriceColor(price: number, low: number, high: number) {
  const mid = (low + high) / 2;
  if (price <= low) return "text-emerald-600";
  if (price >= high) return "text-red-500";
  if (price <= mid) return "text-blue-600";
  return "text-amber-600";
}

function PriceBar({ price, low, high }: { price: number; low: number; high: number }) {
  const range = high - low || 1;
  const pos = Math.min(100, Math.max(0, ((price - low) / range) * 100));
  return (
    <div className="relative w-full h-2 bg-gradient-to-r from-emerald-200 via-amber-200 to-red-200 rounded-full mt-1">
      <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-indigo-500 rounded-full shadow-sm" style={{ left: `calc(${pos}% - 6px)` }} />
    </div>
  );
}

/* ── Auto-fill by area ── */
function AreaAutoFill({ onApply }: { onApply: (area: number, rooms: number, bathrooms: number) => void }) {
  const [area, setArea] = useState(35);
  const [rooms, setRooms] = useState(3);
  const [bathrooms, setBathrooms] = useState(2);

  return (
    <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl border border-indigo-200 p-5">
      <h3 className="text-sm font-semibold text-indigo-900 mb-3">⚡ 智慧填入 — 輸入坪數自動計算</h3>
      <div className="flex flex-wrap gap-4 items-end">
        <div>
          <label className="text-xs text-slate-500 block mb-1">室內坪數</label>
          <div className="flex items-center gap-1">
            <input type="number" value={area} onChange={(e) => setArea(Number(e.target.value))} className="w-20 border border-slate-300 rounded-lg px-2 py-2 text-sm text-center" />
            <span className="text-sm text-slate-500">坪</span>
          </div>
        </div>
        <div>
          <label className="text-xs text-slate-500 block mb-1">房間數</label>
          <input type="number" value={rooms} onChange={(e) => setRooms(Number(e.target.value))} className="w-16 border border-slate-300 rounded-lg px-2 py-2 text-sm text-center" />
        </div>
        <div>
          <label className="text-xs text-slate-500 block mb-1">衛浴數</label>
          <input type="number" value={bathrooms} onChange={(e) => setBathrooms(Number(e.target.value))} className="w-16 border border-slate-300 rounded-lg px-2 py-2 text-sm text-center" />
        </div>
        <button onClick={() => onApply(area, rooms, bathrooms)} className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors">
          🧮 自動計算數量
        </button>
      </div>
      <p className="text-xs text-indigo-600 mt-2">系統會根據坪數自動計算各工項數量，您可再手動微調</p>
    </div>
  );
}

/* ── Main ── */
function QuotationContent() {
  const router = useRouter();
  const [selectedTemplate, setSelectedTemplate] = useState("住宅全室裝修");
  const [items, setItems] = useState<QuoteItem[]>(templateItems["住宅全室裝修"]);
  const [discount, setDiscount] = useState(0);
  const [tab, setTab] = useState<"builder" | "history" | "analysis">("builder");
  const [materialItems, setMaterialItems] = useState<MaterialItem[]>([]);
  const [clientName, setClientName] = useState("");
  const [projectName, setProjectName] = useState("");
  const [showMarketPrice, setShowMarketPrice] = useState(true);
  const [designFeeRate, setDesignFeeRate] = useState(3000);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  };

  useEffect(() => {
    try {
      const saved = localStorage.getItem("quotation_materials");
      if (saved) setMaterialItems(JSON.parse(saved));
    } catch {}
  }, []);

  // Switch template
  const handleTemplateChange = (t: string) => {
    setSelectedTemplate(t);
    setItems(templateItems[t] || []);
  };

  // Auto-fill quantities by area
  const handleAutoFill = (area: number, rooms: number, bathrooms: number) => {
    setItems((prev) =>
      prev.map((item) => {
        let qty = item.qty;
        if (item.item.includes("地板拆除") || item.item.includes("地磚鋪設") || item.item.includes("天花板") || item.item.includes("全室油漆")) qty = area;
        if (item.item.includes("壁磚")) qty = Math.round(bathrooms * 3.5);
        if (item.item.includes("防水") || item.item.includes("衛浴")) qty = bathrooms;
        if (item.item.includes("配電迴路")) qty = Math.round(area * 0.4);
        if (item.item.includes("冷熱水管") || item.item.includes("糞管")) qty = bathrooms;
        if (item.item.includes("系統櫃")) qty = Math.round(area * 0.8);
        if (item.item.includes("門片")) qty = rooms + bathrooms;
        if (item.item.includes("間接照明")) qty = Math.round(area * 1.2);
        if (item.item.includes("冷氣")) qty = rooms + 1;
        if (item.item.includes("窗簾")) qty = rooms + 1;
        if (item.item.includes("設計費") || item.item.includes("監造費")) qty = area;
        if (item.item.includes("牆面拆除")) qty = Math.max(1, rooms - 1);
        if (item.item.includes("廚具")) qty = 1;
        return { ...item, qty };
      })
    );
  };

  const activeItems = items.filter((i) => i.qty > 0);
  const subtotal = activeItems.reduce((sum, item) => sum + item.qty * item.unitPrice, 0);
  const marketLowTotal = activeItems.reduce((sum, item) => sum + item.qty * item.marketLow, 0);
  const marketHighTotal = activeItems.reduce((sum, item) => sum + item.qty * item.marketHigh, 0);
  const materialTotal = materialItems.reduce((sum, m) => sum + m.price, 0);
  const combinedSubtotal = subtotal + materialTotal;
  const discountAmount = combinedSubtotal * (discount / 100);
  const total = combinedSubtotal - discountAmount;
  const costEstimate = activeItems.reduce((sum, item) => sum + item.qty * item.marketLow * 0.7, 0);
  const profitEstimate = total - costEstimate - materialTotal;
  const profitMargin = total > 0 ? Math.round((profitEstimate / total) * 100) : 0;

  const grouped = items.reduce<Record<string, QuoteItem[]>>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  const updateQty = (id: number, qty: number) => {
    setItems(items.map((i) => (i.id === id ? { ...i, qty: Math.max(0, qty) } : i)));
  };

  const updatePrice = (id: number, unitPrice: number) => {
    setItems(items.map((i) => (i.id === id ? { ...i, unitPrice: Math.max(0, unitPrice) } : i)));
  };

  const removeMaterial = (id: number) => {
    const updated = materialItems.filter((m) => m.id !== id);
    setMaterialItems(updated);
    localStorage.setItem("quotation_materials", JSON.stringify(updated));
  };

  const handleConvertToContract = () => {
    const quoteId = `Q-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 999) + 1).padStart(3, "0")}`;
    router.push(`/designer/contracts?fromQuote=${encodeURIComponent(quoteId)}&client=${encodeURIComponent(clientName || "新客戶")}&total=${total}`);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-5">
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium">
          ✓ {toast}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">💰 智慧報價系統</h1>
          <p className="text-sm text-slate-500 mt-1">輸入坪數自動算量 · 市場行情比對 · 利潤即時分析</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={handleConvertToContract} className="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors">📝 轉為合約</button>
          <button onClick={() => showToast("報價 PDF 匯出中...")} className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors">📤 匯出 PDF</button>
          <button onClick={() => showToast("報價單已複製")} className="px-4 py-2 border border-slate-300 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors">📋 複製</button>
        </div>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500">報價總額</p>
          <p className="text-xl font-bold text-indigo-600">NT$ {total.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500">市場低價</p>
          <p className="text-xl font-bold text-emerald-600">NT$ {marketLowTotal.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500">市場高價</p>
          <p className="text-xl font-bold text-red-500">NT$ {marketHighTotal.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500">預估利潤</p>
          <p className={clsx("text-xl font-bold", profitEstimate > 0 ? "text-emerald-600" : "text-red-500")}>NT$ {profitEstimate.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500">利潤率</p>
          <p className={clsx("text-xl font-bold", profitMargin >= 25 ? "text-emerald-600" : profitMargin >= 15 ? "text-amber-600" : "text-red-500")}>{profitMargin}%</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 rounded-lg p-1 w-fit">
        {(["builder", "history", "analysis"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={clsx("px-4 py-2 rounded-md text-sm font-medium", tab === t ? "bg-white shadow-sm text-slate-900" : "text-slate-500")}>
            {t === "builder" ? "📝 建立報價" : t === "history" ? "📂 歷史報價" : "📊 利潤分析"}
          </button>
        ))}
      </div>

      {tab === "builder" && (
        <>
          {/* Client + Project info */}
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-slate-500 block mb-1">客戶名稱</label>
                <input type="text" value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="例：陳先生" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="text-xs text-slate-500 block mb-1">專案名稱</label>
                <input type="text" value={projectName} onChange={(e) => setProjectName(e.target.value)} placeholder="例：大安區 35 坪現代宅" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="text-xs text-slate-500 block mb-1">報價範本</label>
                <select value={selectedTemplate} onChange={(e) => handleTemplateChange(e.target.value)} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm">
                  {Object.keys(templateItems).map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Auto-fill */}
          <AreaAutoFill onApply={handleAutoFill} />

          {/* Toggle */}
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={showMarketPrice} onChange={(e) => setShowMarketPrice(e.target.checked)} className="rounded border-slate-300 text-indigo-600" />
              <span className="text-sm text-slate-600">顯示市場行情比對</span>
            </label>
          </div>

          {/* Materials from localStorage */}
          {materialItems.length > 0 && (
            <div className="bg-white rounded-xl border border-emerald-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-emerald-700">🧱 從建材庫加入的項目</p>
                <span className="text-xs text-emerald-600">{materialItems.length} 項 · NT$ {materialTotal.toLocaleString()}</span>
              </div>
              <div className="space-y-2">
                {materialItems.map((mat) => (
                  <div key={mat.id} className="flex items-center justify-between bg-emerald-50 rounded-lg px-3 py-2">
                    <div>
                      <p className="text-sm font-medium text-slate-900">{mat.name}</p>
                      <p className="text-xs text-slate-500">{mat.brand} · {mat.category}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-emerald-700">NT$ {mat.price.toLocaleString()}/{mat.unit}</span>
                      <button onClick={() => removeMaterial(mat.id)} className="text-xs text-red-500 hover:text-red-700">✕</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quote Table */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left px-4 py-3 font-semibold text-slate-700">工項</th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-700 hidden md:table-cell">規格說明</th>
                    <th className="text-center px-3 py-3 font-semibold text-slate-700 w-24">數量</th>
                    <th className="text-right px-3 py-3 font-semibold text-slate-700 w-28">單價</th>
                    {showMarketPrice && <th className="text-center px-3 py-3 font-semibold text-slate-700 w-32 hidden lg:table-cell">行情範圍</th>}
                    <th className="text-right px-4 py-3 font-semibold text-slate-700 w-32">小計</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(grouped).map(([category, categoryItems]) => (
                    <React.Fragment key={category}>
                      <tr>
                        <td colSpan={showMarketPrice ? 6 : 5} className="px-4 py-2 bg-slate-50/80 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          {category}
                          <span className="ml-2 text-slate-400 normal-case">
                            小計 NT$ {categoryItems.reduce((s, i) => s + i.qty * i.unitPrice, 0).toLocaleString()}
                          </span>
                        </td>
                      </tr>
                      {categoryItems.map((item) => (
                        <tr key={item.id} className={clsx("border-b border-slate-50 hover:bg-slate-50/50", item.qty === 0 && "opacity-40")}>
                          <td className="px-4 py-2.5">
                            <p className="font-medium text-slate-900 text-[13px]">{item.item}</p>
                            <p className="text-xs text-slate-400 md:hidden">{item.spec}</p>
                          </td>
                          <td className="px-4 py-2.5 text-slate-500 text-xs hidden md:table-cell">{item.spec}</td>
                          <td className="px-3 py-2.5 text-center">
                            <input type="number" value={item.qty} onChange={(e) => updateQty(item.id, Number(e.target.value))} className="w-14 text-center border border-slate-200 rounded px-1 py-1 text-sm" />
                            <span className="text-[10px] text-slate-400 ml-1">{item.unit}</span>
                          </td>
                          <td className="px-3 py-2.5 text-right">
                            <input type="number" value={item.unitPrice} onChange={(e) => updatePrice(item.id, Number(e.target.value))} className={clsx("w-20 text-right border border-slate-200 rounded px-1 py-1 text-sm", getPriceColor(item.unitPrice, item.marketLow, item.marketHigh))} />
                          </td>
                          {showMarketPrice && (
                            <td className="px-3 py-2.5 hidden lg:table-cell">
                              <div className="text-[10px] text-slate-400 flex justify-between">
                                <span>{item.marketLow.toLocaleString()}</span>
                                <span>{item.marketHigh.toLocaleString()}</span>
                              </div>
                              <PriceBar price={item.unitPrice} low={item.marketLow} high={item.marketHigh} />
                            </td>
                          )}
                          <td className="px-4 py-2.5 text-right font-medium text-slate-900">{item.qty > 0 ? (item.qty * item.unitPrice).toLocaleString() : "—"}</td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="border-t border-slate-200 p-4 space-y-2">
              <div className="flex justify-between text-sm"><span className="text-slate-500">工程小計（{activeItems.length} 項）</span><span className="text-slate-700">NT$ {subtotal.toLocaleString()}</span></div>
              {materialTotal > 0 && <div className="flex justify-between text-sm"><span className="text-slate-500">建材小計</span><span className="text-emerald-700">NT$ {materialTotal.toLocaleString()}</span></div>}
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">折扣</span>
                  <input type="number" value={discount} onChange={(e) => setDiscount(Math.max(0, Math.min(100, Number(e.target.value))))} className="w-14 text-center border border-slate-200 rounded px-1 py-1 text-sm" />
                  <span className="text-xs text-slate-400">%</span>
                </div>
                {discountAmount > 0 && <span className="text-red-600">- NT$ {discountAmount.toLocaleString()}</span>}
              </div>
              <div className="flex justify-between text-lg font-bold border-t border-slate-200 pt-3">
                <span className="text-slate-900">報價總額</span>
                <span className="text-indigo-600">NT$ {total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>市場行情範圍</span>
                <span>NT$ {marketLowTotal.toLocaleString()} ~ NT$ {marketHighTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </>
      )}

      {tab === "history" && (
        <div className="space-y-3">
          {mockHistory.map((q) => (
            <div key={q.id} className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-mono text-slate-400">{q.id}</span>
                  <span className={clsx("text-xs px-2 py-0.5 rounded-full", q.status === "已簽約" ? "bg-emerald-50 text-emerald-700" : q.status === "待確認" ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-500")}>{q.status}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">利潤率 {q.margin}%</span>
                </div>
                <p className="font-semibold text-slate-900">{q.client} — {q.project}</p>
                <p className="text-xs text-slate-400">{q.date}</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-indigo-600">NT$ {q.total.toLocaleString()}</p>
                <div className="flex gap-2 mt-1 justify-end">
                  <button onClick={() => showToast(`正在載入報價 ${q.id}`)} className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">查看 →</button>
                  {q.status === "待確認" && (
                    <button onClick={() => router.push(`/designer/contracts?fromQuote=${encodeURIComponent(q.id)}&client=${encodeURIComponent(q.client)}&total=${q.total}`)} className="text-xs text-emerald-600 hover:text-emerald-700 font-medium">轉為合約 →</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "analysis" && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">📊 報價 vs 市場行情分析</h3>
            <div className="space-y-3">
              {activeItems.map((item) => {
                const yourPrice = item.unitPrice;
                const marketMid = (item.marketLow + item.marketHigh) / 2;
                const diff = Math.round(((yourPrice - marketMid) / marketMid) * 100);
                return (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="w-48 truncate text-sm text-slate-700">{item.item}</div>
                    <div className="flex-1">
                      <PriceBar price={yourPrice} low={item.marketLow} high={item.marketHigh} />
                    </div>
                    <div className={clsx("text-xs font-medium w-20 text-right", diff > 10 ? "text-red-500" : diff < -10 ? "text-emerald-600" : "text-slate-500")}>
                      {diff > 0 ? `+${diff}%` : `${diff}%`} vs 市場
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <p className="text-xs text-slate-500 mb-1">高於市場均價的項目</p>
              <p className="text-2xl font-bold text-red-500">{activeItems.filter((i) => i.unitPrice > (i.marketLow + i.marketHigh) / 2 * 1.1).length} 項</p>
              <p className="text-xs text-slate-400 mt-1">可能需要向客戶解釋</p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <p className="text-xs text-slate-500 mb-1">低於市場均價的項目</p>
              <p className="text-2xl font-bold text-emerald-600">{activeItems.filter((i) => i.unitPrice < (i.marketLow + i.marketHigh) / 2 * 0.9).length} 項</p>
              <p className="text-xs text-slate-400 mt-1">有競爭力的定價</p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <p className="text-xs text-slate-500 mb-1">整體利潤健康度</p>
              <p className={clsx("text-2xl font-bold", profitMargin >= 25 ? "text-emerald-600" : profitMargin >= 15 ? "text-amber-600" : "text-red-500")}>
                {profitMargin >= 25 ? "🟢 健康" : profitMargin >= 15 ? "🟡 注意" : "🔴 偏低"}
              </p>
              <p className="text-xs text-slate-400 mt-1">建議利潤率 ≥ 25%</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function QuotationPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400">載入中...</div>}>
      <QuotationContent />
    </Suspense>
  );
}
