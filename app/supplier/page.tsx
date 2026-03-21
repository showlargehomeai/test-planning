"use client";

import { useState } from "react";
import { clsx } from "clsx";

const todayOrders = [
  { id: "ORD-20260321-001", designer: "王美玲設計師", project: "信義區豪宅案", items: "冠軍磁磚 60x60 米白 x200片", amount: 36000, status: "待確認", time: "09:15" },
  { id: "ORD-20260321-002", designer: "李建宏設計師", project: "內湖科技園區辦公室", items: "EGGER 超耐磨地板 x45坪", amount: 144000, status: "備貨中", time: "10:30" },
  { id: "ORD-20260321-003", designer: "陳雅琪設計師", project: "大安區老屋翻新", items: "TOTO 免治馬桶座 x2台", amount: 37000, status: "已出貨", time: "11:45" },
  { id: "ORD-20260321-004", designer: "張志偉設計師", project: "新店住宅案", items: "虹牌乳膠漆 純淨白 x20加侖", amount: 17000, status: "待確認", time: "13:20" },
];

const hotProducts = [
  { name: "冠軍磁磚 60x60 霧面米白", category: "磁磚", sold: 1280, trend: "+12%", gradient: "from-emerald-400 to-teal-500" },
  { name: "EGGER 超耐磨木地板 淺橡木", category: "木地板", sold: 890, trend: "+8%", gradient: "from-amber-400 to-orange-500" },
  { name: "TOTO 免治馬桶座 瞬熱型", category: "衛浴", sold: 456, trend: "+23%", gradient: "from-sky-400 to-blue-500" },
  { name: "BLUM 隱藏式鉸鏈", category: "五金", sold: 2340, trend: "+5%", gradient: "from-slate-400 to-slate-600" },
  { name: "虹牌乳膠漆 低VOC系列", category: "油漆", sold: 678, trend: "+15%", gradient: "from-gray-300 to-gray-500" },
];

const pendingQuotes = [
  { id: "QT-0089", designer: "林佳慧設計師", project: "松山區商辦裝修", items: 8, amount: 285000, deadline: "2026-03-23", daysLeft: 2 },
  { id: "QT-0090", designer: "黃志明設計師", project: "中山區餐廳設計", items: 12, amount: 412000, deadline: "2026-03-24", daysLeft: 3 },
  { id: "QT-0091", designer: "吳佩蓉設計師", project: "板橋新建案公設", items: 25, amount: 1280000, deadline: "2026-03-25", daysLeft: 4 },
];

const statusColorMap: Record<string, string> = {
  "待確認": "bg-amber-50 text-amber-700 border-amber-200",
  "備貨中": "bg-blue-50 text-blue-700 border-blue-200",
  "已出貨": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "已完成": "bg-slate-50 text-slate-500 border-slate-200",
};

export default function SupplierDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState<"today" | "week" | "month">("today");

  const stats = {
    today: { orders: 4, revenue: 234000, pending: 2, shipped: 1 },
    week: { orders: 28, revenue: 1680000, pending: 5, shipped: 18 },
    month: { orders: 112, revenue: 6720000, pending: 8, shipped: 89 },
  };

  const current = stats[selectedPeriod];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">建材商儀表板</h1>
          <p className="text-sm text-slate-500 mt-1">歡迎回來，大統建材有限公司</p>
        </div>
        <div className="flex bg-slate-100 rounded-lg p-1">
          {(["today", "week", "month"] as const).map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={clsx(
                "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                selectedPeriod === period
                  ? "bg-white text-emerald-700 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              )}
            >
              {period === "today" ? "今日" : period === "week" ? "本週" : "本月"}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5">
          <p className="text-xs sm:text-sm text-slate-500">訂單數</p>
          <p className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">{current.orders}</p>
          <p className="text-xs text-emerald-600 mt-1">較昨日 +3</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5">
          <p className="text-xs sm:text-sm text-slate-500">營收</p>
          <p className="text-2xl sm:text-3xl font-bold text-emerald-600 mt-1">
            {(current.revenue / 10000).toFixed(0)}
            <span className="text-base font-normal text-slate-400 ml-1">萬</span>
          </p>
          <p className="text-xs text-emerald-600 mt-1">較昨日 +18%</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5">
          <p className="text-xs sm:text-sm text-slate-500">待處理</p>
          <p className="text-2xl sm:text-3xl font-bold text-amber-600 mt-1">{current.pending}</p>
          <p className="text-xs text-slate-400 mt-1">需盡快確認</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5">
          <p className="text-xs sm:text-sm text-slate-500">已出貨</p>
          <p className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">{current.shipped}</p>
          <p className="text-xs text-slate-400 mt-1">配送中</p>
        </div>
      </div>

      {/* Today's Orders */}
      <div className="bg-white rounded-xl border border-slate-200">
        <div className="px-4 sm:px-5 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-900">今日訂單</h2>
        </div>
        <div className="divide-y divide-slate-100">
          {todayOrders.map((order) => (
            <div key={order.id} className="px-4 sm:px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium text-slate-900">{order.id}</span>
                  <span className={clsx("text-xs px-2 py-0.5 rounded-full border", statusColorMap[order.status])}>
                    {order.status}
                  </span>
                  <span className="text-xs text-slate-400">{order.time}</span>
                </div>
                <p className="text-sm text-slate-600 mt-1">{order.designer} — {order.project}</p>
                <p className="text-xs text-slate-400 mt-0.5">{order.items}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-lg font-bold text-emerald-600">NT$ {order.amount.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Hot Products */}
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="px-4 sm:px-5 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-900">熱門品項（本月）</h2>
          </div>
          <div className="p-4 sm:p-5 space-y-3">
            {hotProducts.map((product, idx) => (
              <div key={product.name} className="flex items-center gap-3">
                <div className={clsx("w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center text-white text-xs font-bold shrink-0", product.gradient)}>
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">{product.name}</p>
                  <p className="text-xs text-slate-400">{product.category} · 已售 {product.sold.toLocaleString()} 件</p>
                </div>
                <span className="text-xs font-medium text-emerald-600 shrink-0">{product.trend}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Quotes */}
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="px-4 sm:px-5 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-900">待處理報價</h2>
          </div>
          <div className="p-4 sm:p-5 space-y-3">
            {pendingQuotes.map((quote) => (
              <div key={quote.id} className="p-3 rounded-lg border border-slate-200 hover:border-emerald-300 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-900">{quote.id}</span>
                  <span className={clsx(
                    "text-xs px-2 py-0.5 rounded-full",
                    quote.daysLeft <= 2 ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-600"
                  )}>
                    剩 {quote.daysLeft} 天
                  </span>
                </div>
                <p className="text-sm text-slate-600 mt-1">{quote.designer}</p>
                <p className="text-xs text-slate-400">{quote.project} · {quote.items} 項品項</p>
                <p className="text-sm font-semibold text-emerald-600 mt-2">NT$ {quote.amount.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
