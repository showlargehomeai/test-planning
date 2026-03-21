"use client";

import { useState } from "react";
import { clsx } from "clsx";
import Link from "next/link";

const customerTags = ["VIP", "活躍", "沉睡", "新客", "老客", "高消費", "潛在客"];
const projectStatus = ["諮詢中", "報價中", "簽約中", "施工中", "已完工", "已結案"];

const mockCustomers = [
  {
    id: 1,
    name: "陳怡君",
    phone: "0912-345-678",
    email: "yijun.chen@gmail.com",
    region: "台北市大安區",
    style: "現代簡約",
    budget: "150-200萬",
    status: "施工中",
    tags: ["VIP", "活躍"],
    avatar: "bg-gradient-to-br from-pink-400 to-rose-500",
    lastContact: "2 小時前",
    nextFollowUp: "明天 14:00",
    projectCount: 2,
    totalValue: 350,
    satisfaction: 4.8,
    notes: "對細節要求很高，喜歡北歐風家具配搭",
    timeline: [
      { type: "meeting", text: "初次見面諮詢", date: "2026-03-15", time: "14:00" },
      { type: "quote", text: "提供設計方案報價", date: "2026-03-18", time: "10:30" },
      { type: "contract", text: "簽訂設計合約", date: "2026-03-20", time: "16:00" },
    ]
  },
  {
    id: 2,
    name: "林志明",
    phone: "0923-456-789",
    email: "zhiming.lin@hotmail.com",
    region: "新北市板橋區",
    style: "工業風",
    budget: "80-120萬",
    status: "報價中",
    tags: ["新客", "潛在客"],
    avatar: "bg-gradient-to-br from-blue-400 to-indigo-500",
    lastContact: "1 天前",
    nextFollowUp: "明天 10:00",
    projectCount: 0,
    totalValue: 0,
    satisfaction: null,
    notes: "30年老公寓翻新，預算有限但要求品質",
    timeline: [
      { type: "meeting", text: "電話初步諮詢", date: "2026-03-19", time: "09:00" },
      { type: "visit", text: "現場勘查丈量", date: "2026-03-20", time: "14:00" },
    ]
  },
  {
    id: 3,
    name: "王美玲",
    phone: "0934-567-890",
    email: "meiling.wang@yahoo.com.tw",
    region: "台北市信義區",
    style: "北歐風",
    budget: "200-300萬",
    status: "已完工",
    tags: ["VIP", "高消費", "老客"],
    avatar: "bg-gradient-to-br from-emerald-400 to-teal-500",
    lastContact: "3 天前",
    nextFollowUp: null,
    projectCount: 3,
    totalValue: 720,
    satisfaction: 4.9,
    notes: "三房兩廳豪宅，有兩個小孩，注重安全環保",
    timeline: [
      { type: "meeting", text: "豪宅裝修完工驗收", date: "2026-03-18", time: "10:00" },
      { type: "feedback", text: "滿意度調查與結案", date: "2026-03-18", time: "16:00" },
    ]
  },
  {
    id: 4,
    name: "張家豪",
    phone: "0945-678-901",
    email: "jiahao.zhang@outlook.com",
    region: "台中市西屯區",
    style: "日式無印",
    budget: "100-150萬",
    status: "諮詢中",
    tags: ["新客"],
    avatar: "bg-gradient-to-br from-amber-400 to-orange-500",
    lastContact: "5 天前",
    nextFollowUp: "下週一 15:00",
    projectCount: 0,
    totalValue: 0,
    satisfaction: null,
    notes: "首次購屋，對日式風格很有興趣",
    timeline: [
      { type: "meeting", text: "線上諮詢會議", date: "2026-03-16", time: "19:00" },
    ]
  },
  {
    id: 5,
    name: "劉雅婷",
    phone: "0956-789-012",
    email: "yating.liu@icloud.com",
    region: "台北市中山區",
    style: "新古典",
    budget: "300-500萬",
    status: "簽約中",
    tags: ["VIP", "高消費"],
    avatar: "bg-gradient-to-br from-violet-400 to-purple-500",
    lastContact: "1 週前",
    nextFollowUp: "週三 11:00",
    projectCount: 1,
    totalValue: 450,
    satisfaction: 4.7,
    notes: "豪宅業主，要求高品質材料與工藝",
    timeline: [
      { type: "meeting", text: "設計方案討論", date: "2026-03-14", time: "14:30" },
      { type: "quote", text: "詳細報價單說明", date: "2026-03-17", time: "10:00" },
    ]
  },
];

export default function CRMPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<number | null>(null);

  const filtered = mockCustomers.filter((c) => {
    if (searchTerm && !c.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !c.phone.includes(searchTerm) && !c.email.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    if (statusFilter && c.status !== statusFilter) return false;
    if (tagFilter && !c.tags.includes(tagFilter)) return false;
    return true;
  });

  const selectedCustomerData = mockCustomers.find(c => c.id === selectedCustomer);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">👥 客戶關係管理</h1>
        <p className="text-sm text-slate-500 mt-1">管理客戶資料、追蹤互動紀錄、掌握專案進度</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500">總客戶數</p>
          <p className="text-2xl font-bold text-indigo-600">{mockCustomers.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500">進行中專案</p>
          <p className="text-2xl font-bold text-emerald-600">
            {mockCustomers.filter(c => ["諮詢中", "報價中", "簽約中", "施工中"].includes(c.status)).length}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500">VIP 客戶</p>
          <p className="text-2xl font-bold text-amber-600">
            {mockCustomers.filter(c => c.tags.includes("VIP")).length}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500">平均滿意度</p>
          <p className="text-2xl font-bold text-violet-600">
            {(mockCustomers.filter(c => c.satisfaction).reduce((acc, c) => acc + (c.satisfaction || 0), 0) / 
              mockCustomers.filter(c => c.satisfaction).length).toFixed(1)}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <p className="text-sm font-semibold text-slate-700 mb-3">篩選與搜尋</p>
        <div className="flex flex-col lg:flex-row gap-3">
          <input
            type="text"
            placeholder="搜尋客戶姓名、電話、信箱..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[44px] flex-1"
          />
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)} 
            className="border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[44px] w-full lg:w-40"
          >
            <option value="">所有狀態</option>
            {projectStatus.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select 
            value={tagFilter} 
            onChange={(e) => setTagFilter(e.target.value)} 
            className="border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[44px] w-full lg:w-40"
          >
            <option value="">所有標籤</option>
            {customerTags.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer List */}
        <div className="lg:col-span-2 space-y-4">
          {filtered.map((customer) => (
            <div 
              key={customer.id} 
              className={clsx(
                "bg-white rounded-xl border p-4 sm:p-5 hover:shadow-md transition-all cursor-pointer",
                selectedCustomer === customer.id ? "border-indigo-500 shadow-md" : "border-slate-200"
              )}
              onClick={() => setSelectedCustomer(customer.id)}
            >
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Avatar & Basic Info */}
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className={clsx("w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg", customer.avatar)}>
                    {customer.name[0]}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-slate-900">{customer.name}</h3>
                      <div className="flex flex-wrap gap-1">
                        {customer.tags.map((tag) => (
                          <span 
                            key={tag} 
                            className={clsx(
                              "text-[10px] px-1.5 py-0.5 rounded-full font-medium",
                              tag === "VIP" ? "bg-amber-50 text-amber-700" :
                              tag === "活躍" ? "bg-emerald-50 text-emerald-700" :
                              tag === "高消費" ? "bg-violet-50 text-violet-700" :
                              "bg-slate-50 text-slate-600"
                            )}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                      <span>📱 {customer.phone}</span>
                      <span>📍 {customer.region}</span>
                      <span>🎨 {customer.style}</span>
                    </div>
                  </div>
                </div>

                {/* Status & Actions */}
                <div className="flex sm:flex-col gap-2 sm:items-end shrink-0">
                  <span className={clsx(
                    "text-xs px-2 py-1 rounded-full font-medium text-center",
                    customer.status === "施工中" ? "bg-indigo-50 text-indigo-700" :
                    customer.status === "已完工" ? "bg-emerald-50 text-emerald-700" :
                    customer.status === "報價中" ? "bg-amber-50 text-amber-700" :
                    customer.status === "簽約中" ? "bg-violet-50 text-violet-700" :
                    "bg-slate-50 text-slate-600"
                  )}>
                    {customer.status}
                  </span>
                  <div className="text-xs text-slate-400 text-right">
                    <p>最後聯絡：{customer.lastContact}</p>
                    {customer.nextFollowUp && <p>下次追蹤：{customer.nextFollowUp}</p>}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Customer Detail Panel */}
        <div className="lg:col-span-1">
          {selectedCustomerData ? (
            <div className="bg-white rounded-xl border border-slate-200 p-5 sticky top-6">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center gap-3">
                  <div className={clsx("w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg", selectedCustomerData.avatar)}>
                    {selectedCustomerData.name[0]}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{selectedCustomerData.name}</h3>
                    <p className="text-sm text-slate-500">{selectedCustomerData.email}</p>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 rounded-lg p-3">
                    <p className="text-xs text-slate-500">專案數</p>
                    <p className="text-lg font-bold text-slate-900">{selectedCustomerData.projectCount}</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3">
                    <p className="text-xs text-slate-500">總金額</p>
                    <p className="text-lg font-bold text-slate-900">{selectedCustomerData.totalValue}萬</p>
                  </div>
                  {selectedCustomerData.satisfaction && (
                    <>
                      <div className="bg-slate-50 rounded-lg p-3 col-span-2">
                        <p className="text-xs text-slate-500">滿意度</p>
                        <div className="flex items-center gap-2">
                          <p className="text-lg font-bold text-slate-900">{selectedCustomerData.satisfaction}</p>
                          <div className="flex">
                            {[1,2,3,4,5].map((star) => (
                              <span key={star} className={clsx("text-sm", star <= selectedCustomerData.satisfaction! ? "text-amber-400" : "text-slate-300")}>⭐</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Notes */}
                <div>
                  <p className="text-sm font-medium text-slate-700 mb-2">客戶備註</p>
                  <p className="text-sm text-slate-600 bg-slate-50 rounded-lg p-3">{selectedCustomerData.notes}</p>
                </div>

                {/* Timeline */}
                <div>
                  <p className="text-sm font-medium text-slate-700 mb-2">互動時間軸</p>
                  <div className="space-y-3">
                    {selectedCustomerData.timeline.map((event, index) => (
                      <div key={index} className="flex gap-3">
                        <div className={clsx(
                          "w-6 h-6 rounded-full flex items-center justify-center text-xs",
                          event.type === "meeting" ? "bg-indigo-100 text-indigo-700" :
                          event.type === "quote" ? "bg-amber-100 text-amber-700" :
                          event.type === "contract" ? "bg-emerald-100 text-emerald-700" :
                          event.type === "visit" ? "bg-violet-100 text-violet-700" :
                          "bg-slate-100 text-slate-700"
                        )}>
                          {event.type === "meeting" ? "📅" :
                           event.type === "quote" ? "💰" :
                           event.type === "contract" ? "📝" :
                           event.type === "visit" ? "🏠" :
                           "💬"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900">{event.text}</p>
                          <p className="text-xs text-slate-500">{event.date} {event.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <Link
                    href={`/designer/crm/${selectedCustomerData.id}`}
                    className="w-full px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors text-center block"
                  >
                    查看完整詳情
                  </Link>
                  <button className="w-full px-4 py-2 border border-slate-300 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors">
                    安排會議
                  </button>
                  <button className="w-full px-4 py-2 border border-slate-300 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors">
                    發送訊息
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">👥</span>
              </div>
              <h3 className="font-medium text-slate-900 mb-1">選擇客戶</h3>
              <p className="text-sm text-slate-500">點擊左側客戶卡片查看詳細資訊</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}