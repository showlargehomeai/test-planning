"use client";

import { useState } from "react";
import { clsx } from "clsx";

type OrderStatus = "待確認" | "備貨中" | "已出貨" | "已完成";

type Order = {
  id: string;
  designer: string;
  project: string;
  items: { name: string; qty: number; unit: string; price: number }[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  deliveryAddress: string;
  note: string;
};

const statusSteps: OrderStatus[] = ["待確認", "備貨中", "已出貨", "已完成"];

const statusConfig: Record<OrderStatus, { bg: string; text: string; dot: string }> = {
  "待確認": { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-400" },
  "備貨中": { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-400" },
  "已出貨": { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-400" },
  "已完成": { bg: "bg-slate-50", text: "text-slate-500", dot: "bg-slate-400" },
};

const mockOrders: Order[] = [
  {
    id: "ORD-20260321-001", designer: "王美玲設計師", project: "信義區豪宅案",
    items: [
      { name: "冠軍磁磚 60x60 霧面米白", qty: 200, unit: "片", price: 180 },
      { name: "冠軍磁磚 木紋磚 20x120", qty: 80, unit: "片", price: 220 },
    ],
    totalAmount: 53600, status: "待確認", createdAt: "2026-03-21 09:15", updatedAt: "2026-03-21 09:15",
    deliveryAddress: "台北市信義區松仁路100號", note: "請於週五前送達，管委會收貨時間 09:00-17:00"
  },
  {
    id: "ORD-20260320-003", designer: "李建宏設計師", project: "內湖科技園區辦公室",
    items: [
      { name: "EGGER 超耐磨地板 淺橡木", qty: 45, unit: "坪", price: 3200 },
      { name: "BLUM 隱藏式鉸鏈", qty: 120, unit: "個", price: 180 },
    ],
    totalAmount: 165600, status: "備貨中", createdAt: "2026-03-20 14:30", updatedAt: "2026-03-21 08:00",
    deliveryAddress: "台北市內湖區瑞光路288號3F", note: "地板需同一批號，鉸鏈請附安裝說明"
  },
  {
    id: "ORD-20260319-007", designer: "陳雅琪設計師", project: "大安區老屋翻新",
    items: [
      { name: "TOTO 免治馬桶座 瞬熱型", qty: 2, unit: "台", price: 18500 },
      { name: "凱撒淋浴花灑組 恆溫型", qty: 2, unit: "組", price: 12800 },
      { name: "和成浴室櫃組 80cm", qty: 2, unit: "組", price: 15600 },
    ],
    totalAmount: 93800, status: "已出貨", createdAt: "2026-03-19 10:00", updatedAt: "2026-03-21 06:30",
    deliveryAddress: "台北市大安區仁愛路四段50巷12號", note: "衛浴設備請分批配送，馬桶座優先"
  },
  {
    id: "ORD-20260318-002", designer: "張志偉設計師", project: "新店住宅案",
    items: [
      { name: "虹牌乳膠漆 純淨白 5加侖", qty: 8, unit: "桶", price: 3800 },
      { name: "得利全效乳膠漆 1加侖", qty: 4, unit: "罐", price: 1650 },
    ],
    totalAmount: 37000, status: "已完成", createdAt: "2026-03-18 16:45", updatedAt: "2026-03-20 14:00",
    deliveryAddress: "新北市新店區中正路200號", note: ""
  },
  {
    id: "ORD-20260321-005", designer: "林佳慧設計師", project: "松山區商辦裝修",
    items: [
      { name: "SPC石塑地板 橡木色", qty: 65, unit: "坪", price: 2800 },
    ],
    totalAmount: 182000, status: "待確認", createdAt: "2026-03-21 11:20", updatedAt: "2026-03-21 11:20",
    deliveryAddress: "台北市松山區南京東路五段88號10F", note: "請提供樣品先行確認色號"
  },
  {
    id: "ORD-20260317-011", designer: "黃志明設計師", project: "中山區餐廳設計",
    items: [
      { name: "六角花磚 莫蘭迪灰", qty: 150, unit: "片", price: 280 },
      { name: "大理石紋薄板 120x240", qty: 20, unit: "片", price: 850 },
      { name: "門把手 霧黑圓管", qty: 15, unit: "支", price: 280 },
    ],
    totalAmount: 63200, status: "已出貨", createdAt: "2026-03-17 09:00", updatedAt: "2026-03-20 16:00",
    deliveryAddress: "台北市中山區中山北路二段65號", note: "花磚多備 5% 損耗"
  },
];

const filterTabs: { label: string; value: OrderStatus | "all" }[] = [
  { label: "全部", value: "all" },
  { label: "待確認", value: "待確認" },
  { label: "備貨中", value: "備貨中" },
  { label: "已出貨", value: "已出貨" },
  { label: "已完成", value: "已完成" },
];

export default function OrdersPage() {
  const [activeFilter, setActiveFilter] = useState<OrderStatus | "all">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const filtered = mockOrders
    .filter((o) => activeFilter === "all" || o.status === activeFilter)
    .filter((o) => !search || o.id.includes(search) || o.designer.includes(search) || o.project.includes(search));

  const countByStatus = (status: OrderStatus | "all") =>
    status === "all" ? mockOrders.length : mockOrders.filter((o) => o.status === status).length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">訂單追蹤</h1>
        <p className="text-sm text-slate-500 mt-1">管理所有訂單狀態，即時追蹤出貨進度</p>
      </div>

      {/* Status summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {statusSteps.map((status) => {
          const config = statusConfig[status];
          const count = countByStatus(status);
          return (
            <button
              key={status}
              onClick={() => setActiveFilter(status)}
              className={clsx(
                "p-3 sm:p-4 rounded-xl border text-left transition-all",
                activeFilter === status ? "border-emerald-300 ring-2 ring-emerald-100" : "border-slate-200 hover:border-slate-300"
              )}
            >
              <div className="flex items-center gap-2">
                <span className={clsx("w-2 h-2 rounded-full", config.dot)} />
                <span className="text-sm font-medium text-slate-600">{status}</span>
              </div>
              <p className="text-2xl font-bold text-slate-900 mt-1">{count}</p>
            </button>
          );
        })}
      </div>

      {/* Search */}
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="搜尋訂單編號、設計師、專案..."
        className="border border-slate-300 rounded-lg px-3 py-2.5 text-sm w-full sm:w-80 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 min-h-[44px]"
      />

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {filterTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveFilter(tab.value)}
            className={clsx(
              "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
              activeFilter === tab.value
                ? "bg-emerald-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            )}
          >
            {tab.label} ({countByStatus(tab.value)})
          </button>
        ))}
      </div>

      {/* Order cards */}
      <div className="space-y-3">
        {filtered.map((order) => {
          const config = statusConfig[order.status];
          const stepIndex = statusSteps.indexOf(order.status);

          return (
            <div key={order.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-4 sm:p-5">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold text-slate-900">{order.id}</span>
                    <span className={clsx("text-xs px-2.5 py-0.5 rounded-full font-medium", config.bg, config.text)}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-lg font-bold text-emerald-600">NT$ {order.totalAmount.toLocaleString()}</p>
                </div>

                {/* Info */}
                <div className="mt-2 space-y-1">
                  <p className="text-sm text-slate-700">{order.designer} — {order.project}</p>
                  <p className="text-xs text-slate-400">建立：{order.createdAt} ｜ 更新：{order.updatedAt}</p>
                </div>

                {/* Progress bar */}
                <div className="mt-4 flex items-center gap-1">
                  {statusSteps.map((step, idx) => (
                    <div key={step} className="flex-1 flex items-center gap-1">
                      <div className={clsx(
                        "h-1.5 flex-1 rounded-full",
                        idx <= stepIndex ? "bg-emerald-500" : "bg-slate-200"
                      )} />
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-1">
                  {statusSteps.map((step, idx) => (
                    <span key={step} className={clsx("text-[10px]", idx <= stepIndex ? "text-emerald-600 font-medium" : "text-slate-300")}>
                      {step}
                    </span>
                  ))}
                </div>

                {/* Expand */}
                <button
                  onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
                  className="text-xs text-emerald-600 hover:text-emerald-700 font-medium mt-3"
                >
                  {expandedId === order.id ? "收起明細 ▲" : "查看明細 ▼"}
                </button>

                {expandedId === order.id && (
                  <div className="mt-3 pt-3 border-t border-slate-100 space-y-3">
                    {/* Items table */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-left text-xs text-slate-400 border-b border-slate-100">
                            <th className="pb-2 font-medium">品項</th>
                            <th className="pb-2 font-medium text-right">數量</th>
                            <th className="pb-2 font-medium text-right">單價</th>
                            <th className="pb-2 font-medium text-right">小計</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {order.items.map((item, idx) => (
                            <tr key={idx}>
                              <td className="py-2 text-slate-700">{item.name}</td>
                              <td className="py-2 text-right text-slate-600">{item.qty} {item.unit}</td>
                              <td className="py-2 text-right text-slate-600">NT$ {item.price.toLocaleString()}</td>
                              <td className="py-2 text-right font-medium text-slate-900">NT$ {(item.qty * item.price).toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Delivery info */}
                    <div className="space-y-1.5">
                      <div>
                        <p className="text-xs font-medium text-slate-400">配送地址</p>
                        <p className="text-sm text-slate-700">{order.deliveryAddress}</p>
                      </div>
                      {order.note && (
                        <div>
                          <p className="text-xs font-medium text-slate-400">備註</p>
                          <p className="text-sm text-slate-700">{order.note}</p>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2">
                      {order.status === "待確認" && (
                        <>
                          <button className="px-3 py-1.5 text-xs font-medium rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors">
                            確認接單
                          </button>
                          <button className="px-3 py-1.5 text-xs font-medium rounded-lg border border-red-300 text-red-600 hover:bg-red-50 transition-colors">
                            拒絕訂單
                          </button>
                        </>
                      )}
                      {order.status === "備貨中" && (
                        <button className="px-3 py-1.5 text-xs font-medium rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors">
                          標記已出貨
                        </button>
                      )}
                      {order.status === "已出貨" && (
                        <button className="px-3 py-1.5 text-xs font-medium rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors">
                          確認完成
                        </button>
                      )}
                      <button className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50 transition-colors">
                        列印出貨單
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
          <p className="text-lg">沒有符合條件的訂單</p>
          <p className="text-sm mt-1">請嘗試其他篩選條件</p>
        </div>
      )}
    </div>
  );
}
