"use client";

import { useState } from "react";
import { clsx } from "clsx";
import Link from "next/link";
import { useParams } from "next/navigation";

const mockCustomers = [
  {
    id: 1,
    name: "陳怡君",
    phone: "0912-345-678",
    email: "yijun.chen@gmail.com",
    address: "台北市大安區忠孝東路四段123號8樓",
    region: "台北市大安區",
    style: "現代簡約",
    budget: "150-200萬",
    status: "施工中",
    tags: ["VIP", "活躍"],
    avatar: "bg-gradient-to-br from-pink-400 to-rose-500",
    joinDate: "2025-08-15",
    lastContact: "2026-03-21 10:30",
    nextFollowUp: "2026-03-22 14:00",
    projectCount: 2,
    totalValue: 350,
    satisfaction: 4.8,
    notes: "對細節要求很高，喜歡北歐風家具配搭。家中有兩個小孩，注重安全性。預算充足，願意使用高品質材料。",
    preferences: {
      budget: "充足預算，重視品質",
      style: "現代簡約混搭北歐風",
      materials: "天然木材、大理石、鐵件",
      colors: "白色、原木色、黑色點綴",
      special: "需要充足收納、兒童安全設計"
    },
    timeline: [
      { 
        id: 1,
        type: "meeting", 
        title: "初次見面諮詢", 
        description: "客戶透過朋友介紹前來，對現代簡約風格有興趣", 
        date: "2026-03-15", 
        time: "14:00",
        status: "completed",
        attendees: ["陳怡君", "陳先生"],
        location: "公司會議室"
      },
      { 
        id: 2,
        type: "visit", 
        title: "現場勘查丈量", 
        description: "實地測量35坪空間，確認格局與管線位置", 
        date: "2026-03-16", 
        time: "10:00",
        status: "completed",
        attendees: ["陳怡君"],
        location: "客戶住宅"
      },
      { 
        id: 3,
        type: "quote", 
        title: "提供設計方案報價", 
        description: "3D渲染圖、材料清單、工程報價詳細說明", 
        date: "2026-03-18", 
        time: "10:30",
        status: "completed",
        attendees: ["陳怡君", "陳先生"],
        location: "線上會議"
      },
      { 
        id: 4,
        type: "contract", 
        title: "簽訂設計合約", 
        description: "確認設計方案，簽訂合約並收取訂金", 
        date: "2026-03-20", 
        time: "16:00",
        status: "completed",
        attendees: ["陳怡君", "陳先生"],
        location: "公司會議室"
      },
      { 
        id: 5,
        type: "update", 
        title: "施工進度更新", 
        description: "水電工程完成，準備進入木作階段", 
        date: "2026-03-21", 
        time: "09:00",
        status: "completed",
        attendees: ["陳怡君"],
        location: "電話聯絡"
      },
      { 
        id: 6,
        type: "meeting", 
        title: "木作驗收會議", 
        description: "確認櫃體尺寸與門片樣式", 
        date: "2026-03-25", 
        time: "14:00",
        status: "scheduled",
        attendees: ["陳怡君", "木工師傅"],
        location: "施工現場"
      },
    ],
    projects: [
      {
        id: 1,
        name: "大安區三房兩廳全屋裝修",
        status: "施工中",
        progress: 65,
        budget: 180,
        spent: 120,
        startDate: "2026-03-20",
        expectedEnd: "2026-05-15",
        description: "35坪三房兩廳現代簡約風格裝修"
      },
      {
        id: 2,
        name: "主臥室局部改造",
        status: "已完工",
        progress: 100,
        budget: 25,
        spent: 23,
        startDate: "2025-11-01",
        expectedEnd: "2025-11-30",
        description: "主臥室衛浴重新規劃與更新"
      }
    ],
    documents: [
      { name: "設計合約", type: "pdf", size: "2.3 MB", date: "2026-03-20" },
      { name: "3D設計圖", type: "image", size: "15.7 MB", date: "2026-03-18" },
      { name: "材料清單", type: "excel", size: "1.2 MB", date: "2026-03-18" },
      { name: "施工進度照片", type: "image", size: "8.9 MB", date: "2026-03-21" },
    ]
  },
  // 可以添加更多客戶資料...
];

export default function CustomerDetailPage() {
  const params = useParams();
  const customerId = parseInt(params.id as string);
  const customer = mockCustomers.find(c => c.id === customerId);

  const [activeTab, setActiveTab] = useState("overview");
  const [newNote, setNewNote] = useState("");

  if (!customer) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-xl font-bold text-slate-900 mb-2">客戶不存在</h1>
        <Link href="/designer/crm" className="text-indigo-600 hover:text-indigo-700">
          ← 返回客戶列表
        </Link>
      </div>
    );
  }

  const tabs = [
    { id: "overview", name: "概覽", icon: "👤" },
    { id: "projects", name: "專案", icon: "🏠" },
    { id: "timeline", name: "時間軸", icon: "📅" },
    { id: "documents", name: "文件", icon: "📄" },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link 
            href="/designer/crm"
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            ← 返回列表
          </Link>
          <div className="flex items-center gap-3">
            <div className={clsx("w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg", customer.avatar)}>
              {customer.name[0]}
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{customer.name}</h1>
              <div className="flex flex-wrap gap-1 mt-1">
                {customer.tags.map((tag) => (
                  <span 
                    key={tag} 
                    className={clsx(
                      "text-xs px-2 py-0.5 rounded-full font-medium",
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
          </div>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors">
            安排會議
          </button>
          <button className="px-4 py-2 border border-slate-300 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors">
            發送訊息
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="flex space-x-6 sm:space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={clsx(
                "pb-2 px-1 border-b-2 text-sm font-medium transition-colors whitespace-nowrap",
                activeTab === tab.id
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
              )}
            >
              {tab.icon} {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Basic Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Info */}
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">聯絡資訊</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700">手機號碼</label>
                  <p className="text-sm text-slate-900 mt-1">{customer.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">電子信箱</label>
                  <p className="text-sm text-slate-900 mt-1">{customer.email}</p>
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm font-medium text-slate-700">地址</label>
                  <p className="text-sm text-slate-900 mt-1">{customer.address}</p>
                </div>
              </div>
            </div>

            {/* Preferences */}
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">設計偏好</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700">預算範圍</label>
                  <p className="text-sm text-slate-900 mt-1">{customer.preferences.budget}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">設計風格</label>
                  <p className="text-sm text-slate-900 mt-1">{customer.preferences.style}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">偏好材料</label>
                  <p className="text-sm text-slate-900 mt-1">{customer.preferences.materials}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">色彩偏好</label>
                  <p className="text-sm text-slate-900 mt-1">{customer.preferences.colors}</p>
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm font-medium text-slate-700">特殊需求</label>
                  <p className="text-sm text-slate-900 mt-1">{customer.preferences.special}</p>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">客戶備註</h3>
              <div className="bg-slate-50 rounded-lg p-4 mb-4">
                <p className="text-sm text-slate-700">{customer.notes}</p>
              </div>
              <div className="space-y-3">
                <textarea
                  placeholder="新增備註..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  rows={3}
                />
                <button 
                  className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                  onClick={() => setNewNote("")}
                >
                  儲存備註
                </button>
              </div>
            </div>
          </div>

          {/* Stats Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">客戶統計</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">成為客戶</span>
                  <span className="text-sm font-medium text-slate-900">{customer.joinDate}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">專案總數</span>
                  <span className="text-sm font-medium text-slate-900">{customer.projectCount} 個</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">消費總額</span>
                  <span className="text-sm font-medium text-slate-900">{customer.totalValue} 萬</span>
                </div>
                {customer.satisfaction && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">滿意度</span>
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-medium text-slate-900">{customer.satisfaction}</span>
                      {[1,2,3,4,5].map((star) => (
                        <span key={star} className={clsx("text-xs", star <= customer.satisfaction! ? "text-amber-400" : "text-slate-300")}>⭐</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Status */}
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">目前狀態</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-slate-700">專案狀態</label>
                  <span className={clsx(
                    "block text-sm px-3 py-2 rounded-lg mt-1 font-medium",
                    customer.status === "施工中" ? "bg-indigo-50 text-indigo-700" :
                    customer.status === "已完工" ? "bg-emerald-50 text-emerald-700" :
                    customer.status === "報價中" ? "bg-amber-50 text-amber-700" :
                    "bg-slate-50 text-slate-600"
                  )}>
                    {customer.status}
                  </span>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">最後聯絡</label>
                  <p className="text-sm text-slate-900 mt-1">{customer.lastContact}</p>
                </div>
                {customer.nextFollowUp && (
                  <div>
                    <label className="text-sm font-medium text-slate-700">下次追蹤</label>
                    <p className="text-sm text-slate-900 mt-1">{customer.nextFollowUp}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "projects" && (
        <div className="space-y-4">
          {customer.projects.map((project) => (
            <div key={project.id} className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">{project.name}</h3>
                  <p className="text-sm text-slate-600 mb-3">{project.description}</p>
                  
                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-slate-700">進度</span>
                      <span className="text-sm text-slate-600">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div 
                        className="bg-indigo-600 h-2 rounded-full transition-all"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                    <span>💰 預算：{project.budget}萬 / 已花：{project.spent}萬</span>
                    <span>📅 期間：{project.startDate} ~ {project.expectedEnd}</span>
                  </div>
                </div>

                <div className="shrink-0">
                  <span className={clsx(
                    "inline-block px-3 py-1 rounded-full text-xs font-medium",
                    project.status === "施工中" ? "bg-indigo-50 text-indigo-700" :
                    project.status === "已完工" ? "bg-emerald-50 text-emerald-700" :
                    "bg-slate-50 text-slate-600"
                  )}>
                    {project.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "timeline" && (
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="space-y-6">
            {customer.timeline.map((event, index) => (
              <div key={event.id} className="flex gap-4">
                <div className="shrink-0">
                  <div className={clsx(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm",
                    event.status === "completed" ? "bg-emerald-100 text-emerald-700" : "bg-indigo-100 text-indigo-700"
                  )}>
                    {event.type === "meeting" ? "📅" :
                     event.type === "quote" ? "💰" :
                     event.type === "contract" ? "📝" :
                     event.type === "visit" ? "🏠" :
                     event.type === "update" ? "📞" :
                     "💬"}
                  </div>
                  {index < customer.timeline.length - 1 && (
                    <div className="w-0.5 bg-slate-200 h-12 ml-3.5 mt-2" />
                  )}
                </div>
                <div className="flex-1 pb-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-2">
                    <h4 className="font-medium text-slate-900">{event.title}</h4>
                    <div className="flex items-center gap-2">
                      <span className={clsx(
                        "text-xs px-2 py-0.5 rounded-full font-medium",
                        event.status === "completed" ? "bg-emerald-50 text-emerald-700" : 
                        event.status === "scheduled" ? "bg-indigo-50 text-indigo-700" :
                        "bg-slate-50 text-slate-600"
                      )}>
                        {event.status === "completed" ? "已完成" :
                         event.status === "scheduled" ? "已安排" : "進行中"}
                      </span>
                      <span className="text-sm text-slate-500">{event.date} {event.time}</span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 mb-2">{event.description}</p>
                  <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                    <span>👥 參與者：{event.attendees.join(", ")}</span>
                    <span>📍 地點：{event.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "documents" && (
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-slate-900">相關文件</h3>
            <button className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors">
              上傳文件
            </button>
          </div>
          
          <div className="space-y-3">
            {customer.documents.map((doc, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={clsx(
                    "w-8 h-8 rounded flex items-center justify-center text-xs font-medium",
                    doc.type === "pdf" ? "bg-red-100 text-red-700" :
                    doc.type === "image" ? "bg-emerald-100 text-emerald-700" :
                    doc.type === "excel" ? "bg-indigo-100 text-indigo-700" :
                    "bg-slate-100 text-slate-700"
                  )}>
                    {doc.type === "pdf" ? "📄" :
                     doc.type === "image" ? "🖼️" :
                     doc.type === "excel" ? "📊" : "📄"}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{doc.name}</p>
                    <div className="flex gap-3 text-xs text-slate-500">
                      <span>{doc.size}</span>
                      <span>{doc.date}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="text-indigo-600 hover:text-indigo-700 text-sm">下載</button>
                  <button className="text-slate-500 hover:text-slate-700 text-sm">預覽</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}