"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { clsx } from "clsx";

/* ── Mock Data ── */

type Role = "設計師" | "建材商" | "工班";

interface ChatMessage {
  id: number;
  author: string;
  role: Role;
  message: string;
  time: string;
  type: "text" | "file" | "material-confirm";
}

interface SharedFile {
  name: string;
  uploader: string;
  role: Role;
  date: string;
  size: string;
}

interface Milestone {
  name: string;
  status: "done" | "active" | "pending";
  date: string;
}

interface MaterialItem {
  name: string;
  spec: string;
  quantity: string;
  status: "confirmed" | "pending" | "rejected";
  supplier: string;
}

interface ProjectDetail {
  name: string;
  designer: string;
  supplier: string;
  contractor: string;
  progress: number;
  status: string;
  chat: ChatMessage[];
  files: SharedFile[];
  milestones: Milestone[];
  materials: MaterialItem[];
}

const projects: Record<string, ProjectDetail> = {
  "proj-001": {
    name: "王宅翻新案",
    designer: "林雅婷",
    supplier: "宏達建材",
    contractor: "阿明工班",
    progress: 65,
    status: "施工中",
    chat: [
      { id: 1, author: "林雅婷", role: "設計師", message: "廚房中島尺寸已從 180cm 調整為 200cm，更新的施工圖已上傳，請工班確認可行性", time: "今天 09:30", type: "text" },
      { id: 2, author: "阿明工班", role: "工班", message: "收到！200cm 沒問題，但水電走線需要重拉，預計多半天工時", time: "今天 10:15", type: "text" },
      { id: 3, author: "宏達建材", role: "建材商", message: "進口磁磚已到貨，共 45 箱，請安排收貨時間", time: "今天 11:00", type: "text" },
      { id: 4, author: "宏達建材", role: "建材商", message: "📎 磁磚出貨單.pdf (2.1MB)", time: "今天 11:02", type: "file" },
      { id: 5, author: "林雅婷", role: "設計師", message: "好的，明天下午可以安排收貨嗎？阿明你那邊方便接嗎？", time: "今天 11:30", type: "text" },
      { id: 6, author: "阿明工班", role: "工班", message: "明天下午 OK，我會安排人在場", time: "今天 11:45", type: "text" },
    ],
    files: [
      { name: "廚房施工圖_v3.dwg", uploader: "林雅婷", role: "設計師", date: "2026-03-21", size: "4.5MB" },
      { name: "磁磚出貨單.pdf", uploader: "宏達建材", role: "建材商", date: "2026-03-21", size: "2.1MB" },
      { name: "水電配置圖.pdf", uploader: "阿明工班", role: "工班", date: "2026-03-19", size: "1.8MB" },
      { name: "客廳3D渲染圖.jpg", uploader: "林雅婷", role: "設計師", date: "2026-03-18", size: "8.2MB" },
    ],
    milestones: [
      { name: "拆除工程", status: "done", date: "2026-02-15" },
      { name: "水電配置", status: "done", date: "2026-03-01" },
      { name: "泥作工程", status: "active", date: "2026-03-20" },
      { name: "木作工程", status: "pending", date: "2026-04-05" },
      { name: "油漆收尾", status: "pending", date: "2026-04-20" },
      { name: "驗收交屋", status: "pending", date: "2026-05-01" },
    ],
    materials: [
      { name: "義大利進口磁磚", spec: "60x60cm 霧面灰", quantity: "45 箱", status: "confirmed", supplier: "宏達建材" },
      { name: "超耐磨木地板", spec: "橡木紋 8mm", quantity: "35 坪", status: "confirmed", supplier: "宏達建材" },
      { name: "廚房人造石檯面", spec: "白色 2cm 厚", quantity: "1 組", status: "pending", supplier: "宏達建材" },
      { name: "衛浴五金組", spec: "霧黑系列", quantity: "2 組", status: "pending", supplier: "宏達建材" },
    ],
  },
  "proj-002": {
    name: "李宅新建案",
    designer: "陳俊宏",
    supplier: "永豐建材",
    contractor: "大力工程行",
    progress: 30,
    status: "備料中",
    chat: [
      { id: 1, author: "大力工程行", role: "工班", message: "木地板材料已到場，明天可以開始鋪設，請設計師確認起鋪方向", time: "今天 14:30", type: "text" },
      { id: 2, author: "陳俊宏", role: "設計師", message: "收到，我看一下圖面確認起鋪位置", time: "今天 14:45", type: "text" },
      { id: 3, author: "永豐建材", role: "建材商", message: "衛浴設備下週三到貨，需要提前預留安裝空間", time: "今天 15:00", type: "text" },
      { id: 4, author: "陳俊宏", role: "設計師", message: "已標註預留空間在圖面上，請工班配合", time: "今天 15:30", type: "text" },
    ],
    files: [
      { name: "全區平面圖_v2.dwg", uploader: "陳俊宏", role: "設計師", date: "2026-03-20", size: "6.3MB" },
      { name: "木地板鋪設計畫.pdf", uploader: "大力工程行", role: "工班", date: "2026-03-21", size: "1.2MB" },
    ],
    milestones: [
      { name: "基礎工程", status: "done", date: "2026-02-28" },
      { name: "結構工程", status: "done", date: "2026-03-10" },
      { name: "室內裝修", status: "active", date: "2026-03-20" },
      { name: "設備安裝", status: "pending", date: "2026-04-10" },
      { name: "驗收交屋", status: "pending", date: "2026-04-30" },
    ],
    materials: [
      { name: "超耐磨木地板", spec: "淺色橡木 12mm", quantity: "60 坪", status: "confirmed", supplier: "永豐建材" },
      { name: "TOTO 衛浴組", spec: "免治馬桶+臉盆", quantity: "3 組", status: "pending", supplier: "永豐建材" },
      { name: "系統櫃板材", spec: "白橡木紋 18mm", quantity: "120 才", status: "confirmed", supplier: "永豐建材" },
    ],
  },
  "proj-003": {
    name: "陳氏辦公室",
    designer: "林雅婷",
    supplier: "宏達建材",
    contractor: "順發工班",
    progress: 90,
    status: "驗收中",
    chat: [
      { id: 1, author: "林雅婷", role: "設計師", message: "最後驗收項目清單已整理完成，請各位確認", time: "昨天 16:00", type: "text" },
      { id: 2, author: "順發工班", role: "工班", message: "收到，所有項目都已完成，等候驗收", time: "昨天 17:00", type: "text" },
      { id: 3, author: "宏達建材", role: "建材商", message: "備品已送達，含多出的地磚和油漆各一組", time: "今天 09:00", type: "text" },
    ],
    files: [
      { name: "驗收清單.xlsx", uploader: "林雅婷", role: "設計師", date: "2026-03-20", size: "0.5MB" },
      { name: "完工照片集.zip", uploader: "順發工班", role: "工班", date: "2026-03-20", size: "45MB" },
    ],
    milestones: [
      { name: "拆除清場", status: "done", date: "2026-01-20" },
      { name: "隔間水電", status: "done", date: "2026-02-10" },
      { name: "裝修工程", status: "done", date: "2026-03-05" },
      { name: "清潔收尾", status: "done", date: "2026-03-15" },
      { name: "業主驗收", status: "active", date: "2026-03-22" },
    ],
    materials: [
      { name: "OA 高架地板", spec: "60x60cm", quantity: "200 片", status: "confirmed", supplier: "宏達建材" },
      { name: "輕鋼架天花板", spec: "60x60cm 礦纖板", quantity: "150 片", status: "confirmed", supplier: "宏達建材" },
    ],
  },
  "proj-004": {
    name: "張宅裝修案",
    designer: "王品萱",
    supplier: "全成建材",
    contractor: "阿明工班",
    progress: 10,
    status: "設計中",
    chat: [
      { id: 1, author: "王品萱", role: "設計師", message: "初步設計已完成，請建材商提供石材報價", time: "今天 08:00", type: "text" },
      { id: 2, author: "全成建材", role: "建材商", message: "義大利進口石材目前缺貨，建議替代方案：西班牙同色系石材，價格便宜 20%", time: "今天 10:00", type: "text" },
      { id: 3, author: "全成建材", role: "建材商", message: "📎 替代石材方案報價單.pdf (1.5MB)", time: "今天 10:05", type: "file" },
      { id: 4, author: "王品萱", role: "設計師", message: "我先看看樣品再決定，可以寄樣品過來嗎？", time: "今天 10:30", type: "text" },
    ],
    files: [
      { name: "初步設計圖.pdf", uploader: "王品萱", role: "設計師", date: "2026-03-21", size: "3.2MB" },
      { name: "替代石材方案報價單.pdf", uploader: "全成建材", role: "建材商", date: "2026-03-21", size: "1.5MB" },
    ],
    milestones: [
      { name: "需求確認", status: "done", date: "2026-03-10" },
      { name: "設計規劃", status: "active", date: "2026-03-21" },
      { name: "材料確認", status: "pending", date: "2026-04-01" },
      { name: "施工階段", status: "pending", date: "2026-04-15" },
      { name: "驗收交屋", status: "pending", date: "2026-05-15" },
    ],
    materials: [
      { name: "進口大理石", spec: "卡拉拉白 20mm", quantity: "15 坪", status: "rejected", supplier: "全成建材" },
      { name: "西班牙石材（替代）", spec: "雪白灰 20mm", quantity: "15 坪", status: "pending", supplier: "全成建材" },
      { name: "實木皮板", spec: "胡桃木 3mm", quantity: "40 才", status: "pending", supplier: "全成建材" },
    ],
  },
};

const roleColor: Record<Role, string> = {
  設計師: "bg-indigo-100 text-indigo-700",
  建材商: "bg-amber-100 text-amber-700",
  工班: "bg-emerald-100 text-emerald-700",
};

const roleBubble: Record<Role, string> = {
  設計師: "bg-indigo-50 border-indigo-200",
  建材商: "bg-amber-50 border-amber-200",
  工班: "bg-emerald-50 border-emerald-200",
};

const materialStatus: Record<string, { label: string; style: string }> = {
  confirmed: { label: "已確認", style: "bg-green-100 text-green-700" },
  pending: { label: "待確認", style: "bg-amber-100 text-amber-700" },
  rejected: { label: "已退回", style: "bg-red-100 text-red-700" },
};

const milestoneIcon: Record<string, string> = {
  done: "bg-green-500",
  active: "bg-violet-500 animate-pulse",
  pending: "bg-slate-300",
};

type Tab = "chat" | "files" | "progress" | "materials";

/* ── Page ── */

export default function ProjectCollaboration() {
  const params = useParams();
  const projectId = params.projectId as string;
  const project = projects[projectId];

  const [activeTab, setActiveTab] = useState<Tab>("chat");
  const [newMessage, setNewMessage] = useState("");

  if (!project) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="text-center">
          <p className="text-4xl mb-4">🔍</p>
          <h2 className="text-xl font-bold text-slate-900 mb-2">找不到專案</h2>
          <p className="text-slate-500 mb-4">此專案不存在或已被移除</p>
          <Link href="/collaboration" className="text-violet-600 hover:text-violet-700 font-medium">
            返回協作中心
          </Link>
        </div>
      </div>
    );
  }

  const tabs: { key: Tab; label: string; icon: string; count?: number }[] = [
    { key: "chat", label: "討論串", icon: "💬", count: project.chat.length },
    { key: "files", label: "共享文件", icon: "📁", count: project.files.length },
    { key: "progress", label: "進度同步", icon: "📊" },
    { key: "materials", label: "材料確認", icon: "🧱", count: project.materials.filter((m) => m.status === "pending").length },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Project Header */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Link href="/collaboration" className="text-violet-500 hover:text-violet-600 text-sm">
                ← 返回
              </Link>
            </div>
            <h1 className="text-xl font-bold text-slate-900">{project.name}</h1>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className={clsx("text-xs px-2 py-0.5 rounded-full", roleColor["設計師"])}>
                🎨 {project.designer}
              </span>
              <span className={clsx("text-xs px-2 py-0.5 rounded-full", roleColor["建材商"])}>
                🧱 {project.supplier}
              </span>
              <span className={clsx("text-xs px-2 py-0.5 rounded-full", roleColor["工班"])}>
                🔧 {project.contractor}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-violet-100 text-violet-700">
                {project.status}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs text-slate-500">整體進度</p>
              <p className="text-lg font-bold text-violet-600">{project.progress}%</p>
            </div>
            <div className="w-16 h-16 relative">
              <svg className="w-16 h-16 -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#8b5cf6"
                  strokeWidth="3"
                  strokeDasharray={`${project.progress}, 100`}
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mt-4 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={clsx(
                "flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap",
                activeTab === tab.key
                  ? "bg-violet-100 text-violet-700"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
              )}
            >
              <span>{tab.icon}</span>
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span className={clsx(
                  "text-xs px-1.5 py-0.5 rounded-full",
                  activeTab === tab.key ? "bg-violet-200 text-violet-800" : "bg-slate-200 text-slate-600"
                )}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === "chat" && (
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              {project.chat.map((msg) => (
                <div key={msg.id} className="flex gap-3">
                  <div className={clsx(
                    "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0",
                    roleColor[msg.role]
                  )}>
                    {msg.author[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-slate-900">{msg.author}</span>
                      <span className={clsx("text-xs px-1.5 py-0.5 rounded-full", roleColor[msg.role])}>
                        {msg.role}
                      </span>
                      <span className="text-xs text-slate-400">{msg.time}</span>
                    </div>
                    <div className={clsx(
                      "inline-block px-4 py-2.5 rounded-2xl rounded-tl-sm border text-sm text-slate-800 max-w-full sm:max-w-[80%]",
                      roleBubble[msg.role]
                    )}>
                      {msg.message}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="border-t border-slate-200 bg-white p-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="輸入訊息..."
                  className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                />
                <button className="px-4 py-2.5 bg-violet-600 text-white rounded-xl text-sm font-medium hover:bg-violet-700 transition-colors shrink-0">
                  發送
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "files" && (
          <div className="p-4 sm:p-6">
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    <th className="text-left px-4 py-3 font-medium text-slate-600">檔案名稱</th>
                    <th className="text-left px-4 py-3 font-medium text-slate-600 hidden sm:table-cell">上傳者</th>
                    <th className="text-left px-4 py-3 font-medium text-slate-600 hidden md:table-cell">日期</th>
                    <th className="text-right px-4 py-3 font-medium text-slate-600">大小</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {project.files.map((f, i) => (
                    <tr key={i} className="hover:bg-violet-50/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">
                            {f.name.endsWith(".pdf") ? "📄" : f.name.endsWith(".dwg") ? "📐" : f.name.endsWith(".jpg") || f.name.endsWith(".png") ? "🖼️" : f.name.endsWith(".zip") ? "📦" : f.name.endsWith(".xlsx") ? "📊" : "📎"}
                          </span>
                          <span className="font-medium text-slate-800 truncate">{f.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <span className={clsx("text-xs px-2 py-0.5 rounded-full", roleColor[f.role])}>
                          {f.uploader}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-500 hidden md:table-cell">{f.date}</td>
                      <td className="px-4 py-3 text-right text-slate-500">{f.size}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "progress" && (
          <div className="p-4 sm:p-6 space-y-6">
            {/* Progress Bar */}
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="font-semibold text-slate-900 mb-3">整體進度</h3>
              <div className="flex items-center gap-3 mb-2">
                <div className="flex-1 h-4 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full transition-all"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
                <span className="text-lg font-bold text-violet-600">{project.progress}%</span>
              </div>
            </div>

            {/* Milestones */}
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="font-semibold text-slate-900 mb-4">里程碑</h3>
              <div className="space-y-0">
                {project.milestones.map((m, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={clsx("w-4 h-4 rounded-full shrink-0 mt-0.5", milestoneIcon[m.status])} />
                      {i < project.milestones.length - 1 && (
                        <div className={clsx("w-0.5 flex-1 my-1", m.status === "done" ? "bg-green-300" : "bg-slate-200")} />
                      )}
                    </div>
                    <div className="pb-6">
                      <p className={clsx(
                        "text-sm font-medium",
                        m.status === "done" ? "text-green-700" : m.status === "active" ? "text-violet-700" : "text-slate-500"
                      )}>
                        {m.name}
                        {m.status === "active" && (
                          <span className="ml-2 text-xs bg-violet-100 text-violet-600 px-2 py-0.5 rounded-full">進行中</span>
                        )}
                        {m.status === "done" && (
                          <span className="ml-2 text-xs">✅</span>
                        )}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">{m.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "materials" && (
          <div className="p-4 sm:p-6">
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50">
                      <th className="text-left px-4 py-3 font-medium text-slate-600">材料名稱</th>
                      <th className="text-left px-4 py-3 font-medium text-slate-600 hidden sm:table-cell">規格</th>
                      <th className="text-left px-4 py-3 font-medium text-slate-600 hidden md:table-cell">數量</th>
                      <th className="text-left px-4 py-3 font-medium text-slate-600 hidden lg:table-cell">供應商</th>
                      <th className="text-center px-4 py-3 font-medium text-slate-600">狀態</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {project.materials.map((m, i) => (
                      <tr key={i} className="hover:bg-violet-50/50 transition-colors">
                        <td className="px-4 py-3 font-medium text-slate-800">{m.name}</td>
                        <td className="px-4 py-3 text-slate-500 hidden sm:table-cell">{m.spec}</td>
                        <td className="px-4 py-3 text-slate-500 hidden md:table-cell">{m.quantity}</td>
                        <td className="px-4 py-3 text-slate-500 hidden lg:table-cell">{m.supplier}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={clsx("text-xs px-2 py-1 rounded-full font-medium", materialStatus[m.status].style)}>
                            {materialStatus[m.status].label}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
