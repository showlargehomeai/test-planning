"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { clsx } from "clsx";

interface QuoteItem {
  id: number;
  category: string;
  item: string;
  spec: string;
  unit: string;
  qty: number;
  unitPrice: number;
}

interface MaterialItem {
  id: number;
  name: string;
  category: string;
  brand: string;
  price: number;
  unit: string;
}

const templates = ["住宅全室裝修", "局部翻新", "商業空間", "辦公室裝修"];

const mockItems: QuoteItem[] = [
  { id: 1, category: "拆除工程", item: "地板拆除", spec: "含廢棄物清運", unit: "坪", qty: 35, unitPrice: 1500 },
  { id: 2, category: "拆除工程", item: "牆面拆除", spec: "非承重牆", unit: "面", qty: 3, unitPrice: 5000 },
  { id: 3, category: "水電工程", item: "配電迴路", spec: "含開關插座", unit: "迴", qty: 12, unitPrice: 3500 },
  { id: 4, category: "水電工程", item: "冷熱水管配置", spec: "不鏽鋼管", unit: "間", qty: 2, unitPrice: 15000 },
  { id: 5, category: "泥作工程", item: "地磚鋪設", spec: "60x60 磁磚", unit: "坪", qty: 20, unitPrice: 4500 },
  { id: 6, category: "泥作工程", item: "防水處理", spec: "浴室防水三層", unit: "間", qty: 2, unitPrice: 12000 },
  { id: 7, category: "木作工程", item: "天花板", spec: "平頂矽酸鈣板", unit: "坪", qty: 35, unitPrice: 3800 },
  { id: 8, category: "木作工程", item: "系統櫃", spec: "含五金配件", unit: "尺", qty: 24, unitPrice: 5200 },
  { id: 9, category: "油漆工程", item: "全室油漆", spec: "虹牌乳膠漆兩底兩面", unit: "坪", qty: 35, unitPrice: 1200 },
  { id: 10, category: "設計費", item: "設計費", spec: "含 3D 渲染圖", unit: "坪", qty: 35, unitPrice: 3000 },
];

const mockHistory = [
  { id: "Q-2026-001", client: "陳怡君", project: "大安區現代簡約宅", total: 1850000, status: "已簽約", date: "2026-03-10" },
  { id: "Q-2026-002", client: "林志明", project: "板橋工業風 Loft", total: 980000, status: "待確認", date: "2026-03-08" },
  { id: "Q-2025-012", client: "王美玲", project: "信義區北歐親子宅", total: 2450000, status: "已簽約", date: "2025-12-20" },
  { id: "Q-2025-011", client: "張家豪", project: "西屯日式無印小宅", total: 1120000, status: "已過期", date: "2025-11-15" },
];

function QuotationContent() {
  const router = useRouter();
  const [items, setItems] = useState(mockItems);
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);
  const [discount, setDiscount] = useState(0);
  const [tab, setTab] = useState<"builder" | "history">("builder");
  const [materialItems, setMaterialItems] = useState<MaterialItem[]>([]);
  const [clientName, setClientName] = useState("新客戶");

  // Load materials from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("quotation_materials");
      if (saved) {
        const materials: MaterialItem[] = JSON.parse(saved);
        setMaterialItems(materials);
      }
    } catch {}
  }, []);

  const subtotal = items.reduce((sum, item) => sum + item.qty * item.unitPrice, 0);
  const materialTotal = materialItems.reduce((sum, m) => sum + m.price, 0);
  const combinedSubtotal = subtotal + materialTotal;
  const discountAmount = combinedSubtotal * (discount / 100);
  const total = combinedSubtotal - discountAmount;

  const grouped = items.reduce<Record<string, QuoteItem[]>>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  const updateQty = (id: number, qty: number) => {
    setItems(items.map((i) => (i.id === id ? { ...i, qty: Math.max(0, qty) } : i)));
  };

  const removeMaterial = (id: number) => {
    const updated = materialItems.filter((m) => m.id !== id);
    setMaterialItems(updated);
    localStorage.setItem("quotation_materials", JSON.stringify(updated));
  };

  const handleConvertToContract = () => {
    const quoteId = `Q-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 999) + 1).padStart(3, "0")}`;
    router.push(`/designer/contracts?fromQuote=${encodeURIComponent(quoteId)}&client=${encodeURIComponent(clientName)}&total=${total}`);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">💰 智慧報價系統</h1>
          <p className="text-sm text-slate-500 mt-1">快速建立專業報價單</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleConvertToContract}
            className="px-4 py-2.5 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors min-h-[44px]"
          >
            📝 轉為合約
          </button>
          <button className="px-4 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors min-h-[44px]">
            📤 匯出 PDF
          </button>
          <button className="px-4 py-2.5 border border-slate-300 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors min-h-[44px]">
            📋 複製報價
          </button>
        </div>
      </div>

      {/* Tab toggle */}
      <div className="flex gap-1 bg-slate-100 rounded-lg p-1 w-fit">
        <button onClick={() => setTab("builder")} className={clsx("px-4 py-2 rounded-md text-sm font-medium", tab === "builder" ? "bg-white shadow-sm text-slate-900" : "text-slate-500")}>
          📝 報價建立
        </button>
        <button onClick={() => setTab("history")} className={clsx("px-4 py-2 rounded-md text-sm font-medium", tab === "history" ? "bg-white shadow-sm text-slate-900" : "text-slate-500")}>
          📂 歷史報價
        </button>
      </div>

      {tab === "builder" ? (
        <>
          {/* Client Name */}
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <p className="text-sm font-semibold text-slate-700 mb-3">客戶資訊</p>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="客戶名稱"
              className="border border-slate-300 rounded-lg px-3 py-2.5 text-sm w-full sm:w-64 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[44px]"
            />
          </div>

          {/* Template selector */}
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <p className="text-sm font-semibold text-slate-700 mb-3">報價範本</p>
            <div className="flex flex-wrap gap-2">
              {templates.map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedTemplate(t)}
                  className={clsx(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                    selectedTemplate === t ? "bg-indigo-600 text-white" : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Materials from localStorage */}
          {materialItems.length > 0 && (
            <div className="bg-white rounded-xl border border-emerald-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-emerald-700">🧱 從建材庫加入的項目</p>
                <span className="text-xs text-emerald-600">{materialItems.length} 項</span>
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
                      <button onClick={() => removeMaterial(mat.id)} className="text-xs text-red-500 hover:text-red-700">移除</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quote Items */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left px-4 py-3 font-semibold text-slate-700">項目</th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-700 hidden sm:table-cell">規格</th>
                    <th className="text-center px-4 py-3 font-semibold text-slate-700 w-20">數量</th>
                    <th className="text-right px-4 py-3 font-semibold text-slate-700 w-28">單價</th>
                    <th className="text-right px-4 py-3 font-semibold text-slate-700 w-32">小計</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(grouped).map(([category, categoryItems]) => (
                    <React.Fragment key={category}>
                      <tr>
                        <td colSpan={5} className="px-4 py-2 bg-slate-50/50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          {category}
                        </td>
                      </tr>
                      {categoryItems.map((item) => (
                        <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                          <td className="px-4 py-3">
                            <p className="font-medium text-slate-900">{item.item}</p>
                            <p className="text-xs text-slate-400 sm:hidden">{item.spec}</p>
                          </td>
                          <td className="px-4 py-3 text-slate-500 hidden sm:table-cell">{item.spec}</td>
                          <td className="px-4 py-3 text-center">
                            <input
                              type="number"
                              value={item.qty}
                              onChange={(e) => updateQty(item.id, Number(e.target.value))}
                              className="w-16 text-center border border-slate-200 rounded px-1 py-1 text-sm"
                            />
                            <span className="text-xs text-slate-400 ml-1">{item.unit}</span>
                          </td>
                          <td className="px-4 py-3 text-right text-slate-700">{item.unitPrice.toLocaleString()}</td>
                          <td className="px-4 py-3 text-right font-medium text-slate-900">{(item.qty * item.unitPrice).toLocaleString()}</td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="border-t border-slate-200 p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">工程小計</span>
                <span className="text-slate-700">NT$ {subtotal.toLocaleString()}</span>
              </div>
              {materialTotal > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">建材小計</span>
                  <span className="text-emerald-700">NT$ {materialTotal.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">折扣</span>
                  <input
                    type="number"
                    value={discount}
                    onChange={(e) => setDiscount(Math.max(0, Math.min(100, Number(e.target.value))))}
                    className="w-16 text-center border border-slate-200 rounded px-1 py-1 text-sm"
                  />
                  <span className="text-xs text-slate-400">%</span>
                </div>
                <span className="text-red-600">- NT$ {discountAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t border-slate-200 pt-2">
                <span className="text-slate-900">總計</span>
                <span className="text-indigo-600">NT$ {total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* History Tab */
        <div className="space-y-3">
          {mockHistory.map((q) => (
            <div key={q.id} className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-mono text-slate-400">{q.id}</span>
                  <span className={clsx(
                    "text-xs px-2 py-0.5 rounded-full",
                    q.status === "已簽約" ? "bg-emerald-50 text-emerald-700" :
                    q.status === "待確認" ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-500"
                  )}>
                    {q.status}
                  </span>
                </div>
                <p className="font-semibold text-slate-900">{q.client} — {q.project}</p>
                <p className="text-xs text-slate-400">{q.date}</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-indigo-600">NT$ {q.total.toLocaleString()}</p>
                <div className="flex gap-2 mt-1 justify-end">
                  <button className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">查看報價單 →</button>
                  {q.status === "待確認" && (
                    <button
                      onClick={() => router.push(`/designer/contracts?fromQuote=${encodeURIComponent(q.id)}&client=${encodeURIComponent(q.client)}&total=${q.total}`)}
                      className="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
                    >
                      轉為合約 →
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
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
