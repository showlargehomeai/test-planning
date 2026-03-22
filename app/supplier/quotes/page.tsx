"use client";

import { useState } from "react";
import { clsx } from "clsx";

type QuoteStatus = "草稿" | "已送出" | "已接受" | "已拒絕" | "已過期";

type QuoteItem = {
  name: string;
  brand: string;
  qty: number;
  unit: string;
  unitPrice: number;
  discount: number;
};

type Quote = {
  id: string;
  designer: string;
  project: string;
  items: QuoteItem[];
  totalAmount: number;
  discountedTotal: number;
  status: QuoteStatus;
  createdAt: string;
  validUntil: string;
  note: string;
};

const statusConfig: Record<QuoteStatus, { bg: string; text: string }> = {
  "草稿": { bg: "bg-slate-50", text: "text-slate-600" },
  "已送出": { bg: "bg-blue-50", text: "text-blue-700" },
  "已接受": { bg: "bg-emerald-50", text: "text-emerald-700" },
  "已拒絕": { bg: "bg-red-50", text: "text-red-600" },
  "已過期": { bg: "bg-gray-50", text: "text-gray-400" },
};

const mockQuotes: Quote[] = [
  {
    id: "QT-0085", designer: "王美玲設計師", project: "信義區豪宅案",
    items: [
      { name: "冠軍磁磚 60x60 霧面米白", brand: "冠軍磁磚", qty: 300, unit: "片", unitPrice: 180, discount: 0.92 },
      { name: "冠軍磁磚 木紋磚 20x120", brand: "冠軍磁磚", qty: 150, unit: "片", unitPrice: 220, discount: 0.90 },
      { name: "BLUM 隱藏式鉸鏈", brand: "BLUM", qty: 200, unit: "個", unitPrice: 180, discount: 0.85 },
    ],
    totalAmount: 122400, discountedTotal: 109440, status: "已接受",
    createdAt: "2026-03-15", validUntil: "2026-03-30", note: "大量採購折扣已套用，含運費"
  },
  {
    id: "QT-0087", designer: "李建宏設計師", project: "內湖科技園區辦公室",
    items: [
      { name: "EGGER 超耐磨地板 淺橡木", brand: "EGGER", qty: 120, unit: "坪", unitPrice: 3200, discount: 0.88 },
      { name: "BLUM 抽屜滑軌 全開式", brand: "BLUM", qty: 80, unit: "對", unitPrice: 420, discount: 0.90 },
    ],
    totalAmount: 417600, discountedTotal: 368160, status: "已送出",
    createdAt: "2026-03-18", validUntil: "2026-04-02", note: "地板含施工指導，滑軌可分批出貨"
  },
  {
    id: "QT-0089", designer: "林佳慧設計師", project: "松山區商辦裝修",
    items: [
      { name: "SPC石塑地板 橡木色", brand: "富銘地板", qty: 200, unit: "坪", unitPrice: 2800, discount: 0.90 },
      { name: "門把手 霧黑圓管", brand: "LIAN LONG", qty: 60, unit: "支", unitPrice: 280, discount: 0.85 },
      { name: "虹牌乳膠漆 純淨白 5加侖", brand: "虹牌", qty: 15, unit: "桶", unitPrice: 3800, discount: 0.92 },
    ],
    totalAmount: 631280, discountedTotal: 571080, status: "草稿",
    createdAt: "2026-03-20", validUntil: "2026-04-05", note: ""
  },
  {
    id: "QT-0090", designer: "黃志明設計師", project: "中山區餐廳設計",
    items: [
      { name: "六角花磚 莫蘭迪灰", brand: "冠軍磁磚", qty: 400, unit: "片", unitPrice: 280, discount: 0.88 },
      { name: "大理石紋薄板 120x240", brand: "白馬磁磚", qty: 30, unit: "片", unitPrice: 850, discount: 0.90 },
      { name: "TOTO 壁掛式馬桶", brand: "TOTO", qty: 4, unit: "台", unitPrice: 24000, discount: 0.95 },
    ],
    totalAmount: 233700, discountedTotal: 210960, status: "已送出",
    createdAt: "2026-03-19", validUntil: "2026-04-03", note: "花磚多備10%損耗量已含，馬桶需預訂約2週"
  },
  {
    id: "QT-0082", designer: "吳佩蓉設計師", project: "板橋新建案公設",
    items: [
      { name: "冠軍磁磚 60x60 霧面米白", brand: "冠軍磁磚", qty: 800, unit: "片", unitPrice: 180, discount: 0.82 },
      { name: "TOTO 免治馬桶座 瞬熱型", brand: "TOTO", qty: 12, unit: "台", unitPrice: 18500, discount: 0.88 },
    ],
    totalAmount: 366000, discountedTotal: 313440, status: "已拒絕",
    createdAt: "2026-03-10", validUntil: "2026-03-25", note: "客戶要求更低折扣，已拒絕"
  },
  {
    id: "QT-0078", designer: "陳雅琪設計師", project: "大安區老屋翻新",
    items: [
      { name: "得利全效乳膠漆 1加侖", brand: "得利", qty: 20, unit: "罐", unitPrice: 1650, discount: 0.90 },
    ],
    totalAmount: 33000, discountedTotal: 29700, status: "已過期",
    createdAt: "2026-02-28", validUntil: "2026-03-15", note: "報價已過期，客戶未回覆"
  },
];

const filterOptions: { label: string; value: QuoteStatus | "all" }[] = [
  { label: "全部", value: "all" },
  { label: "草稿", value: "草稿" },
  { label: "已送出", value: "已送出" },
  { label: "已接受", value: "已接受" },
  { label: "已拒絕", value: "已拒絕" },
  { label: "已過期", value: "已過期" },
];

export default function QuotesPage() {
  const [activeFilter, setActiveFilter] = useState<QuoteStatus | "all">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [showNewQuote, setShowNewQuote] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  };

  const filtered = mockQuotes
    .filter((q) => activeFilter === "all" || q.status === activeFilter)
    .filter((q) => !search || q.id.includes(search) || q.designer.includes(search) || q.project.includes(search));

  const countByStatus = (status: QuoteStatus | "all") =>
    status === "all" ? mockQuotes.length : mockQuotes.filter((q) => q.status === status).length;

  const totalAccepted = mockQuotes.filter((q) => q.status === "已接受").reduce((sum, q) => sum + q.discountedTotal, 0);
  const totalPending = mockQuotes.filter((q) => q.status === "已送出").reduce((sum, q) => sum + q.discountedTotal, 0);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium">
          ✓ {toast}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">報價管理</h1>
          <p className="text-sm text-slate-500 mt-1">建立報價單、追蹤報價狀態</p>
        </div>
        <button
          onClick={() => setShowNewQuote(!showNewQuote)}
          className="px-4 py-2.5 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors shrink-0"
        >
          + 建立新報價
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500">已成交報價金額</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">NT$ {totalAccepted.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500">待回覆報價金額</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">NT$ {totalPending.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500">成交率</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">
            {mockQuotes.length > 0 ? Math.round((mockQuotes.filter((q) => q.status === "已接受").length / mockQuotes.filter((q) => q.status !== "草稿").length) * 100) : 0}%
          </p>
        </div>
      </div>

      {/* New Quote Form (toggle) */}
      {showNewQuote && (
        <div className="bg-white rounded-xl border-2 border-emerald-200 p-5 space-y-4">
          <h2 className="font-semibold text-slate-900">建立新報價單</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-600">設計師</label>
              <select className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 min-h-[44px]">
                <option>選擇設計師...</option>
                <option>王美玲設計師</option>
                <option>李建宏設計師</option>
                <option>陳雅琪設計師</option>
                <option>張志偉設計師</option>
                <option>林佳慧設計師</option>
                <option>黃志明設計師</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-600">專案名稱</label>
              <input type="text" placeholder="輸入專案名稱..." className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 min-h-[44px]" />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-600">報價品項</label>
            <div className="mt-2 border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 text-left text-xs text-slate-500">
                    <th className="px-3 py-2 font-medium">品項名稱</th>
                    <th className="px-3 py-2 font-medium text-right">數量</th>
                    <th className="px-3 py-2 font-medium text-right">單價</th>
                    <th className="px-3 py-2 font-medium text-right">折扣</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-slate-100">
                    <td className="px-3 py-2">
                      <select className="w-full border border-slate-200 rounded px-2 py-1.5 text-sm min-h-[36px]">
                        <option>選擇產品...</option>
                        <option>冠軍磁磚 60x60 霧面米白</option>
                        <option>EGGER 超耐磨地板 淺橡木</option>
                        <option>TOTO 免治馬桶座 瞬熱型</option>
                      </select>
                    </td>
                    <td className="px-3 py-2"><input type="number" placeholder="0" className="w-20 border border-slate-200 rounded px-2 py-1.5 text-sm text-right min-h-[36px]" /></td>
                    <td className="px-3 py-2 text-right text-slate-400">自動帶入</td>
                    <td className="px-3 py-2"><input type="number" placeholder="95" className="w-16 border border-slate-200 rounded px-2 py-1.5 text-sm text-right min-h-[36px]" />%</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <button onClick={() => showToast("已新增一個品項列")} className="mt-2 text-xs text-emerald-600 hover:text-emerald-700 font-medium">+ 新增品項</button>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-600">備註</label>
            <textarea rows={2} placeholder="報價備註、特殊條件..." className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" />
          </div>

          <div className="flex gap-2">
            <button onClick={() => { showToast("報價已儲存為草稿"); setShowNewQuote(false); }} className="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors">
              儲存為草稿
            </button>
            <button onClick={() => { showToast("報價已送出"); setShowNewQuote(false); }} className="px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors">
              送出報價
            </button>
            <button onClick={() => setShowNewQuote(false)} className="px-4 py-2 border border-slate-300 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors">
              取消
            </button>
          </div>
        </div>
      )}

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="搜尋報價編號、設計師、專案..."
          className="border border-slate-300 rounded-lg px-3 py-2.5 text-sm w-full sm:w-80 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 min-h-[44px]"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {filterOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setActiveFilter(opt.value)}
            className={clsx(
              "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
              activeFilter === opt.value
                ? "bg-emerald-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            )}
          >
            {opt.label} ({countByStatus(opt.value)})
          </button>
        ))}
      </div>

      {/* Quote cards */}
      <div className="space-y-3">
        {filtered.map((quote) => {
          const config = statusConfig[quote.status];
          const savingsPercent = Math.round((1 - quote.discountedTotal / quote.totalAmount) * 100);

          return (
            <div key={quote.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-4 sm:p-5">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold text-slate-900">{quote.id}</span>
                    <span className={clsx("text-xs px-2.5 py-0.5 rounded-full font-medium", config.bg, config.text)}>
                      {quote.status}
                    </span>
                    <span className="text-xs text-slate-400">有效至 {quote.validUntil}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-emerald-600">NT$ {quote.discountedTotal.toLocaleString()}</p>
                    {savingsPercent > 0 && (
                      <p className="text-xs text-slate-400">
                        原價 NT$ {quote.totalAmount.toLocaleString()}（省 {savingsPercent}%）
                      </p>
                    )}
                  </div>
                </div>

                {/* Info */}
                <div className="mt-2">
                  <p className="text-sm text-slate-700">{quote.designer} — {quote.project}</p>
                  <p className="text-xs text-slate-400 mt-0.5">建立日期：{quote.createdAt} ｜ {quote.items.length} 項品項</p>
                </div>

                {/* Expand */}
                <button
                  onClick={() => setExpandedId(expandedId === quote.id ? null : quote.id)}
                  className="text-xs text-emerald-600 hover:text-emerald-700 font-medium mt-3"
                >
                  {expandedId === quote.id ? "收起明細 ▲" : "查看明細 ▼"}
                </button>

                {expandedId === quote.id && (
                  <div className="mt-3 pt-3 border-t border-slate-100 space-y-3">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-left text-xs text-slate-400 border-b border-slate-100">
                            <th className="pb-2 font-medium">品項</th>
                            <th className="pb-2 font-medium">品牌</th>
                            <th className="pb-2 font-medium text-right">數量</th>
                            <th className="pb-2 font-medium text-right">單價</th>
                            <th className="pb-2 font-medium text-right">折扣</th>
                            <th className="pb-2 font-medium text-right">小計</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {quote.items.map((item, idx) => (
                            <tr key={idx}>
                              <td className="py-2 text-slate-700">{item.name}</td>
                              <td className="py-2 text-slate-500">{item.brand}</td>
                              <td className="py-2 text-right text-slate-600">{item.qty} {item.unit}</td>
                              <td className="py-2 text-right text-slate-600">NT$ {item.unitPrice.toLocaleString()}</td>
                              <td className="py-2 text-right text-emerald-600">{Math.round(item.discount * 100)}%</td>
                              <td className="py-2 text-right font-medium text-slate-900">
                                NT$ {Math.round(item.qty * item.unitPrice * item.discount).toLocaleString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {quote.note && (
                      <div>
                        <p className="text-xs font-medium text-slate-400">備註</p>
                        <p className="text-sm text-slate-700">{quote.note}</p>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2">
                      {quote.status === "草稿" && (
                        <>
                          <button onClick={() => showToast(`報價 ${quote.id} 已送出`)} className="px-3 py-1.5 text-xs font-medium rounded-lg bg-teal-600 text-white hover:bg-teal-700 transition-colors">
                            送出報價
                          </button>
                          <button onClick={() => showToast(`正在編輯報價 ${quote.id}`)} className="px-3 py-1.5 text-xs font-medium rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors">
                            編輯
                          </button>
                        </>
                      )}
                      {quote.status === "已送出" && (
                        <button onClick={() => showToast(`報價 ${quote.id} 已撤回`)} className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50 transition-colors">
                          撤回報價
                        </button>
                      )}
                      <button onClick={() => showToast(`報價 ${quote.id} 已複製`)} className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50 transition-colors">
                        複製報價
                      </button>
                      <button onClick={() => showToast(`報價 ${quote.id} PDF 匯出中...`)} className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50 transition-colors">
                        匯出 PDF
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-slate-400">
          <p className="text-lg">沒有符合條件的報價單</p>
          <p className="text-sm mt-1">請嘗試其他篩選條件</p>
        </div>
      )}
    </div>
  );
}
