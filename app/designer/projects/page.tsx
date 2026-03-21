"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { clsx } from "clsx";

// ============================================================
// Types
// ============================================================

interface Project {
  id: number;
  title: string;
  client: string;
  budget: string;
  area: string;
  progress: number;
  status: "pending" | "inProgress" | "review" | "completed";
  nextMilestone: string;
  deadline: string;
  style: string;
  region: string;
  startDate: string;
  estimatedCompletion: string;
  teamSize: number;
  priority: "high" | "medium" | "low";
  avatar: string;
  description: string;
  contractSigned: boolean;
  designApproved: boolean;
  constructionStarted: boolean;
}

type TaskCategory = "泥作" | "水電" | "木作" | "油漆" | "設備" | "其他";

interface GanttTask {
  id: string;
  name: string;
  category: TaskCategory;
  startWeek: number;
  duration: number;
  progress: number;
  assignee: string;
  notes: string;
}

interface GanttProject {
  id: string;
  name: string;
  client: string;
  tasks: GanttTask[];
}

type CostCategory = "材料費" | "工資" | "設計費" | "其他";

interface CostTransaction {
  id: string;
  date: string;
  item: string;
  category: CostCategory;
  amount: number; // positive = income, negative = expense
}

interface ProjectCost {
  id: string;
  name: string;
  client: string;
  totalBudget: number;
  transactions: CostTransaction[];
}

// ============================================================
// Config
// ============================================================

const statusConfig = {
  pending: { label: "待確認", color: "text-amber-700 bg-amber-50 border-amber-200", dotColor: "bg-amber-500" },
  inProgress: { label: "進行中", color: "text-blue-700 bg-blue-50 border-blue-200", dotColor: "bg-blue-500" },
  review: { label: "驗收中", color: "text-purple-700 bg-purple-50 border-purple-200", dotColor: "bg-purple-500" },
  completed: { label: "已完工", color: "text-emerald-700 bg-emerald-50 border-emerald-200", dotColor: "bg-emerald-500" },
};

const priorityConfig = {
  high: { label: "高", color: "text-red-700 bg-red-50" },
  medium: { label: "中", color: "text-yellow-700 bg-yellow-50" },
  low: { label: "低", color: "text-gray-700 bg-gray-50" },
};

const categoryColorMap: Record<TaskCategory, { bg: string; bgLight: string; label: string }> = {
  泥作: { bg: "bg-orange-500", bgLight: "bg-orange-200", label: "橘" },
  水電: { bg: "bg-blue-500", bgLight: "bg-blue-200", label: "藍" },
  木作: { bg: "bg-yellow-500", bgLight: "bg-yellow-200", label: "黃" },
  油漆: { bg: "bg-green-500", bgLight: "bg-green-200", label: "綠" },
  設備: { bg: "bg-purple-500", bgLight: "bg-purple-200", label: "紫" },
  其他: { bg: "bg-slate-500", bgLight: "bg-slate-200", label: "灰" },
};

const costCategoryColors: Record<CostCategory, string> = {
  材料費: "bg-indigo-500",
  工資: "bg-blue-500",
  設計費: "bg-purple-500",
  其他: "bg-slate-400",
};

// ============================================================
// Mock Data — Kanban
// ============================================================

const mockProjects: Project[] = [
  {
    id: 1, title: "陽明山景觀豪宅", client: "王董事長", budget: "800萬", area: "80坪",
    progress: 25, status: "pending", nextMilestone: "設計提案確認", deadline: "2026-04-15",
    style: "現代簡約", region: "台北市士林區", startDate: "2026-03-01", estimatedCompletion: "2026-08-30",
    teamSize: 3, priority: "high", avatar: "bg-gradient-to-br from-emerald-400 to-teal-500",
    description: "山景第一排豪宅，要求極簡風格配合自然景觀",
    contractSigned: true, designApproved: false, constructionStarted: false,
  },
  {
    id: 2, title: "信義區辦公室改裝", client: "創新科技股份有限公司", budget: "450萬", area: "120坪",
    progress: 65, status: "inProgress", nextMilestone: "水電配線完成", deadline: "2026-05-20",
    style: "工業風", region: "台北市信義區", startDate: "2026-02-10", estimatedCompletion: "2026-06-15",
    teamSize: 5, priority: "medium", avatar: "bg-gradient-to-br from-blue-400 to-indigo-500",
    description: "新創公司總部，需要開放式協作空間",
    contractSigned: true, designApproved: true, constructionStarted: true,
  },
  {
    id: 3, title: "三房兩廳居家空間", client: "林小姐", budget: "180萬", area: "35坪",
    progress: 90, status: "review", nextMilestone: "業主驗收", deadline: "2026-04-01",
    style: "北歐風", region: "新北市板橋區", startDate: "2026-01-15", estimatedCompletion: "2026-04-05",
    teamSize: 2, priority: "high", avatar: "bg-gradient-to-br from-pink-400 to-rose-500",
    description: "年輕夫妻的第一個家，溫馨舒適為主",
    contractSigned: true, designApproved: true, constructionStarted: true,
  },
  {
    id: 4, title: "老宅翻新專案", client: "張先生", budget: "320萬", area: "40坪",
    progress: 100, status: "completed", nextMilestone: "已完工", deadline: "2026-03-15",
    style: "混搭風", region: "台中市西屯區", startDate: "2025-12-01", estimatedCompletion: "2026-03-15",
    teamSize: 4, priority: "medium", avatar: "bg-gradient-to-br from-violet-400 to-purple-500",
    description: "40年老宅重新改造，融合古典與現代元素",
    contractSigned: true, designApproved: true, constructionStarted: true,
  },
  {
    id: 5, title: "咖啡廳商空設計", client: "BREW咖啡", budget: "280萬", area: "25坪",
    progress: 45, status: "inProgress", nextMilestone: "吧台施工", deadline: "2026-05-10",
    style: "工業風", region: "台北市大同區", startDate: "2026-02-20", estimatedCompletion: "2026-05-25",
    teamSize: 3, priority: "medium", avatar: "bg-gradient-to-br from-amber-400 to-orange-500",
    description: "文青咖啡廳，營造溫暖工業氛圍",
    contractSigned: true, designApproved: true, constructionStarted: false,
  },
  {
    id: 6, title: "小坪數套房改造", client: "陳同學", budget: "85萬", area: "12坪",
    progress: 15, status: "pending", nextMilestone: "合約簽署", deadline: "2026-06-30",
    style: "日式無印", region: "台北市中正區", startDate: "2026-03-15", estimatedCompletion: "2026-07-15",
    teamSize: 1, priority: "low", avatar: "bg-gradient-to-br from-cyan-400 to-blue-500",
    description: "學生套房，機能性收納為重點",
    contractSigned: false, designApproved: false, constructionStarted: false,
  },
];

// ============================================================
// Mock Data — Gantt
// ============================================================

const GANTT_WEEKS = [
  "02/02", "02/09", "02/16", "02/23",
  "03/02", "03/09", "03/16", "03/23",
  "03/30", "04/06", "04/13", "04/20",
];
const TOTAL_WEEKS = GANTT_WEEKS.length;
// Today 2026-03-21: 47 days from 2026-02-02, out of 84 total days
const TODAY_PERCENT = (47 / 84) * 100;

const ganttProjects: GanttProject[] = [
  {
    id: "gp1", name: "大安區林宅翻新", client: "林先生",
    tasks: [
      { id: "t1", name: "拆除清運", category: "其他", startWeek: 1, duration: 2, progress: 100, assignee: "拆除工班", notes: "已完成，含廢棄物清運費 NT$65,000" },
      { id: "t2", name: "水電重配", category: "水電", startWeek: 2, duration: 3, progress: 100, assignee: "陳師傅", notes: "全室迴路重拉，含弱電配線" },
      { id: "t3", name: "泥作砌磚", category: "泥作", startWeek: 3, duration: 3, progress: 85, assignee: "張師傅", notes: "浴室防水已完成，磁磚鋪設進行中" },
      { id: "t4", name: "木作天花板", category: "木作", startWeek: 5, duration: 3, progress: 40, assignee: "王師傅", notes: "客廳造型天花板施工中" },
      { id: "t5", name: "木作櫃體", category: "木作", startWeek: 6, duration: 3, progress: 20, assignee: "王師傅", notes: "系統櫃已丈量完成，板材待進場" },
      { id: "t6", name: "油漆批土", category: "油漆", startWeek: 8, duration: 2, progress: 0, assignee: "李師傅", notes: "待木作完成後進場，含批土兩底三度" },
      { id: "t7", name: "設備安裝", category: "設備", startWeek: 10, duration: 1, progress: 0, assignee: "各設備商", notes: "廚具（櫻花）、衛浴（TOTO）、燈具" },
      { id: "t8", name: "清潔驗收", category: "其他", startWeek: 11, duration: 1, progress: 0, assignee: "清潔公司", notes: "細部清潔 + 業主驗收 + 修繕" },
    ],
  },
  {
    id: "gp2", name: "板橋工業風 Loft", client: "陳先生",
    tasks: [
      { id: "t9", name: "拆除工程", category: "其他", startWeek: 1, duration: 1, progress: 100, assignee: "拆除工班", notes: "局部拆除，保留原始紅磚牆面" },
      { id: "t10", name: "水電管線", category: "水電", startWeek: 2, duration: 3, progress: 90, assignee: "陳師傅", notes: "明管設計，鍍鋅管外露走工業風" },
      { id: "t11", name: "泥作地坪", category: "泥作", startWeek: 3, duration: 3, progress: 70, assignee: "張師傅", notes: "Pandomo 磐多魔地坪施作中" },
      { id: "t12", name: "鐵件焊接", category: "設備", startWeek: 5, duration: 3, progress: 30, assignee: "鐵工廠", notes: "樓梯扶手 + 隔間鐵件框架" },
      { id: "t13", name: "木作吧台", category: "木作", startWeek: 6, duration: 2, progress: 10, assignee: "王師傅", notes: "實木吧台面 + 層板架" },
      { id: "t14", name: "特殊塗料", category: "油漆", startWeek: 8, duration: 2, progress: 0, assignee: "李師傅", notes: "仿清水模塗料 + 防護漆" },
      { id: "t15", name: "燈具配件", category: "設備", startWeek: 9, duration: 2, progress: 0, assignee: "燈具商", notes: "軌道燈 + Edison 復古燈泡" },
      { id: "t16", name: "軟裝陳列", category: "其他", startWeek: 11, duration: 2, progress: 0, assignee: "設計師", notes: "傢俱配置 + 藝術品掛設" },
    ],
  },
  {
    id: "gp3", name: "信義區豪宅設計", client: "王董事長",
    tasks: [
      { id: "t17", name: "設計定案", category: "其他", startWeek: 4, duration: 2, progress: 60, assignee: "設計師", notes: "3D 渲染第二版修改中" },
      { id: "t18", name: "保護拆除", category: "其他", startWeek: 6, duration: 1, progress: 0, assignee: "拆除工班", notes: "電梯口、走廊保護工程" },
      { id: "t19", name: "空調工程", category: "水電", startWeek: 6, duration: 3, progress: 0, assignee: "冷氣商", notes: "全熱交換器 + VRV 變頻系統" },
      { id: "t20", name: "泥作石材", category: "泥作", startWeek: 7, duration: 3, progress: 0, assignee: "張師傅", notes: "義大利 Calacatta 大理石" },
      { id: "t21", name: "木作訂製", category: "木作", startWeek: 9, duration: 3, progress: 0, assignee: "木工廠", notes: "全室胡桃木實木訂製傢俱" },
      { id: "t22", name: "油漆壁紙", category: "油漆", startWeek: 10, duration: 2, progress: 0, assignee: "李師傅", notes: "進口壁紙 + 義大利藝術漆" },
    ],
  },
];

// ============================================================
// Mock Data — Cost Management
// ============================================================

const costProjects: ProjectCost[] = [
  {
    id: "cp1", name: "大安區林宅翻新", client: "林先生", totalBudget: 2800000,
    transactions: [
      { id: "ct1", date: "2026-02-01", item: "業主工程款（首期30%）", category: "其他", amount: 840000 },
      { id: "ct2", date: "2026-02-05", item: "拆除清運工資", category: "工資", amount: -65000 },
      { id: "ct3", date: "2026-02-10", item: "冠軍磁磚 — 浴室壁磚+地磚", category: "材料費", amount: -120000 },
      { id: "ct4", date: "2026-02-15", item: "水電材料（電線、管材）", category: "材料費", amount: -85000 },
      { id: "ct5", date: "2026-02-20", item: "陳師傅水電工資", category: "工資", amount: -72000 },
      { id: "ct6", date: "2026-02-25", item: "張師傅泥作工資（首期）", category: "工資", amount: -90000 },
      { id: "ct7", date: "2026-03-01", item: "業主工程款（二期20%）", category: "其他", amount: 560000 },
      { id: "ct8", date: "2026-03-05", item: "木作板材（矽酸鈣板+角材）", category: "材料費", amount: -135000 },
      { id: "ct9", date: "2026-03-10", item: "王師傅木工工資（首期）", category: "工資", amount: -110000 },
      { id: "ct10", date: "2026-03-15", item: "設計費（第二期）", category: "設計費", amount: -280000 },
    ],
  },
  {
    id: "cp2", name: "板橋工業風 Loft", client: "陳先生", totalBudget: 1960000,
    transactions: [
      { id: "ct11", date: "2026-02-01", item: "業主工程款（首期30%）", category: "其他", amount: 588000 },
      { id: "ct12", date: "2026-02-03", item: "拆除工程費", category: "工資", amount: -45000 },
      { id: "ct13", date: "2026-02-05", item: "設計費（全額）", category: "設計費", amount: -196000 },
      { id: "ct14", date: "2026-02-10", item: "水電材料（鍍鋅明管）", category: "材料費", amount: -78000 },
      { id: "ct15", date: "2026-02-18", item: "陳師傅水電工資", category: "工資", amount: -72000 },
      { id: "ct16", date: "2026-02-25", item: "磐多魔地坪材料", category: "材料費", amount: -156000 },
      { id: "ct17", date: "2026-03-01", item: "業主工程款（二期20%）", category: "其他", amount: 392000 },
      { id: "ct18", date: "2026-03-05", item: "張師傅泥作工資", category: "工資", amount: -85000 },
      { id: "ct19", date: "2026-03-08", item: "鐵件訂製（樓梯+隔間）", category: "材料費", amount: -220000 },
      { id: "ct20", date: "2026-03-12", item: "實木吧台面板材", category: "材料費", amount: -68000 },
    ],
  },
  {
    id: "cp3", name: "信義區豪宅設計", client: "王董事長", totalBudget: 5200000,
    transactions: [
      { id: "ct21", date: "2026-02-01", item: "業主設計費（首期）", category: "其他", amount: 520000 },
      { id: "ct22", date: "2026-02-15", item: "設計費（首期）", category: "設計費", amount: -260000 },
      { id: "ct23", date: "2026-03-01", item: "業主工程款（首期30%）", category: "其他", amount: 1560000 },
      { id: "ct24", date: "2026-03-01", item: "3D 渲染外包費", category: "設計費", amount: -45000 },
      { id: "ct25", date: "2026-03-10", item: "Calacatta 大理石（訂金）", category: "材料費", amount: -380000 },
      { id: "ct26", date: "2026-03-15", item: "VRV 空調系統（訂金）", category: "材料費", amount: -520000 },
      { id: "ct27", date: "2026-03-18", item: "胡桃木實木（訂金）", category: "材料費", amount: -280000 },
      { id: "ct28", date: "2026-03-20", item: "進口壁紙預訂", category: "材料費", amount: -95000 },
    ],
  },
];

const monthlySummary = [
  { month: "1月", income: 0, expense: 0 },
  { month: "2月", income: 1948000, expense: 989000 },
  { month: "3月", income: 2512000, expense: 2536000 },
  { month: "4月", income: 1680000, expense: 1350000 },
];

// ============================================================
// Main Component
// ============================================================

type TabKey = "kanban" | "gantt" | "cost";

const tabs: { key: TabKey; label: string; icon: string }[] = [
  { key: "kanban", label: "看板", icon: "📋" },
  { key: "gantt", label: "甘特圖", icon: "📊" },
  { key: "cost", label: "成本管理", icon: "💰" },
];

function ProjectsContent() {
  const searchParams = useSearchParams();
  const newProjectClient = searchParams.get("newProject");

  const [activeTab, setActiveTab] = useState<TabKey>("kanban");
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (newProjectClient) {
      const alreadyExists = projects.some((p) => p.client === newProjectClient);
      if (!alreadyExists) {
        const newProject: Project = {
          id: Date.now(), title: `${newProjectClient} 的新專案`, client: newProjectClient,
          budget: "待定", area: "待定", progress: 0, status: "pending",
          nextMilestone: "初步設計提案", deadline: "待定", style: "待定", region: "待定",
          startDate: new Date().toISOString().split("T")[0], estimatedCompletion: "待定",
          teamSize: 1, priority: "medium", avatar: "bg-gradient-to-br from-indigo-400 to-indigo-600",
          description: `來自 CRM 建立的新專案 — ${newProjectClient}`,
          contractSigned: false, designApproved: false, constructionStarted: false,
        };
        setProjects((prev) => [newProject, ...prev]);
        setToast(`已為 ${newProjectClient} 建立新專案`);
        setTimeout(() => setToast(null), 3000);
      }
    }
  }, [newProjectClient]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium">
          ✓ {toast}
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">📋 專案進度追蹤</h1>
        <p className="text-sm text-slate-500 mt-1">看板管理、甘特圖排程、成本追蹤 — 一站掌控所有專案</p>
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-1 bg-slate-100 rounded-xl p-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={clsx(
              "flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-medium transition-all",
              activeTab === tab.key
                ? "bg-white shadow-sm text-slate-900"
                : "text-slate-500 hover:text-slate-700"
            )}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "kanban" && <KanbanTab projects={projects} setProjects={setProjects} />}
      {activeTab === "gantt" && <GanttTab />}
      {activeTab === "cost" && <CostTab />}
    </div>
  );
}

// ============================================================
// Tab 1: Kanban (Existing)
// ============================================================

function KanbanTab({
  projects,
  setProjects,
}: {
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
}) {
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterPriority, setFilterPriority] = useState<string>("");
  const [draggedProject, setDraggedProject] = useState<Project | null>(null);

  const filteredProjects = projects.filter((project) => {
    if (filterStatus && project.status !== filterStatus) return false;
    if (filterPriority && project.priority !== filterPriority) return false;
    return true;
  });

  const projectsByStatus = {
    pending: filteredProjects.filter((p) => p.status === "pending"),
    inProgress: filteredProjects.filter((p) => p.status === "inProgress"),
    review: filteredProjects.filter((p) => p.status === "review"),
    completed: filteredProjects.filter((p) => p.status === "completed"),
  };

  const handleDragStart = (project: Project) => setDraggedProject(project);
  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
  const handleDrop = (e: React.DragEvent, newStatus: Project["status"]) => {
    e.preventDefault();
    if (draggedProject && draggedProject.status !== newStatus) {
      setProjects((prev) =>
        prev.map((p) => (p.id === draggedProject.id ? { ...p, status: newStatus } : p))
      );
    }
    setDraggedProject(null);
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "bg-emerald-500";
    if (progress >= 50) return "bg-blue-500";
    if (progress >= 25) return "bg-amber-500";
    return "bg-red-500";
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500">總專案數</p>
          <p className="text-2xl font-bold text-slate-900">{projects.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500">進行中</p>
          <p className="text-2xl font-bold text-blue-600">{projectsByStatus.inProgress.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500">待確認</p>
          <p className="text-2xl font-bold text-amber-600">{projectsByStatus.pending.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500">總合約金額</p>
          <p className="text-2xl font-bold text-emerald-600">2113萬</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <p className="text-sm font-semibold text-slate-700 mb-3">篩選條件</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[44px] flex-1"
          >
            <option value="">所有狀態</option>
            <option value="pending">待確認</option>
            <option value="inProgress">進行中</option>
            <option value="review">驗收中</option>
            <option value="completed">已完工</option>
          </select>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[44px] flex-1"
          >
            <option value="">所有優先級</option>
            <option value="high">高優先級</option>
            <option value="medium">中優先級</option>
            <option value="low">低優先級</option>
          </select>
          <button className="px-4 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors min-h-[44px]">
            新增專案
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {Object.entries(projectsByStatus).map(([status, statusProjects]) => (
          <div
            key={status}
            className="bg-slate-50 rounded-xl p-4 min-h-[600px]"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, status as Project["status"])}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className={clsx("w-2 h-2 rounded-full", statusConfig[status as keyof typeof statusConfig].dotColor)} />
              <h3 className="font-semibold text-slate-900">{statusConfig[status as keyof typeof statusConfig].label}</h3>
              <span className="ml-auto text-xs bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full">
                {statusProjects.length}
              </span>
            </div>
            <div className="space-y-3">
              {statusProjects.map((project) => (
                <div
                  key={project.id}
                  draggable
                  onDragStart={() => handleDragStart(project)}
                  className="bg-white rounded-lg border border-slate-200 p-4 cursor-move hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={clsx("w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold", project.avatar)}>
                        {project.client[0]}
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-slate-900 line-clamp-1">{project.title}</h4>
                        <p className="text-xs text-slate-500">{project.client}</p>
                      </div>
                    </div>
                    <span className={clsx("text-xs px-2 py-0.5 rounded-full font-medium", priorityConfig[project.priority].color)}>
                      {priorityConfig[project.priority].label}
                    </span>
                  </div>
                  <div className="space-y-2 mb-3">
                    <div className="flex justify-between text-xs text-slate-600">
                      <span>💰 {project.budget}</span>
                      <span>📐 {project.area}</span>
                    </div>
                    <div className="flex justify-between text-xs text-slate-600">
                      <span>🏷️ {project.style}</span>
                      <span>👥 {project.teamSize}人</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-600">進度</span>
                      <span className="font-semibold text-slate-900">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div
                        className={clsx("h-2 rounded-full transition-all", getProgressColor(project.progress))}
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-100">
                    <p className="text-xs text-slate-500 mb-1">下個里程碑</p>
                    <p className="text-sm font-medium text-slate-900">{project.nextMilestone}</p>
                    <p className="text-xs text-slate-500 mt-1">⏰ {project.deadline}</p>
                  </div>
                  <div className="flex gap-1 mt-3 pt-3 border-t border-slate-100">
                    <div className={clsx("w-3 h-3 rounded-full", project.contractSigned ? "bg-emerald-400" : "bg-slate-200")} title="合約簽署" />
                    <div className={clsx("w-3 h-3 rounded-full", project.designApproved ? "bg-blue-400" : "bg-slate-200")} title="設計確認" />
                    <div className={clsx("w-3 h-3 rounded-full", project.constructionStarted ? "bg-orange-400" : "bg-slate-200")} title="施工開始" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// Tab 2: Gantt Chart
// ============================================================

function GanttTab() {
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set(["gp1", "gp2", "gp3"]));
  const [selectedTask, setSelectedTask] = useState<GanttTask | null>(null);

  const toggleProject = (id: string) => {
    setExpandedProjects((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const getProjectSpan = (tasks: GanttTask[]) => {
    const start = Math.min(...tasks.map((t) => t.startWeek));
    const end = Math.max(...tasks.map((t) => t.startWeek + t.duration));
    const avgProgress = Math.round(tasks.reduce((s, t) => s + t.progress, 0) / tasks.length);
    return { start, end, duration: end - start, avgProgress };
  };

  // Build flat row list for synchronized rendering
  type GanttRow =
    | { type: "project"; project: GanttProject; span: ReturnType<typeof getProjectSpan> }
    | { type: "task"; task: GanttTask; projectId: string };

  const rows: GanttRow[] = [];
  ganttProjects.forEach((gp) => {
    const span = getProjectSpan(gp.tasks);
    rows.push({ type: "project", project: gp, span });
    if (expandedProjects.has(gp.id)) {
      gp.tasks.forEach((t) => rows.push({ type: "task", task: t, projectId: gp.id }));
    }
  });

  return (
    <div className="space-y-4">
      {/* Legend */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <p className="text-sm font-semibold text-slate-700 mb-2">工種圖例</p>
        <div className="flex flex-wrap gap-3">
          {(Object.entries(categoryColorMap) as [TaskCategory, typeof categoryColorMap[TaskCategory]][]).map(([cat, cfg]) => (
            <div key={cat} className="flex items-center gap-1.5">
              <div className={clsx("w-4 h-3 rounded-sm", cfg.bg)} />
              <span className="text-xs text-slate-600">{cat}</span>
            </div>
          ))}
          <div className="flex items-center gap-1.5 ml-4">
            <div className="w-4 h-0 border-t-2 border-dashed border-red-500" />
            <span className="text-xs text-red-600 font-medium">今日</span>
          </div>
        </div>
      </div>

      {/* Gantt Chart */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="flex">
          {/* Left Column — Names */}
          <div className="w-44 sm:w-52 shrink-0 border-r border-slate-200 bg-slate-50">
            {/* Header */}
            <div className="h-10 flex items-center px-3 border-b border-slate-200">
              <span className="text-xs font-semibold text-slate-500">專案 / 工項</span>
            </div>
            {/* Rows */}
            {rows.map((row, i) => (
              <div
                key={i}
                className={clsx(
                  "h-10 flex items-center border-b border-slate-100",
                  row.type === "project" ? "px-3 cursor-pointer hover:bg-slate-100" : "px-3 pl-8"
                )}
                onClick={() => row.type === "project" && toggleProject(row.project.id)}
              >
                {row.type === "project" ? (
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="text-xs text-slate-400">{expandedProjects.has(row.project.id) ? "▼" : "▶"}</span>
                    <span className="text-sm font-semibold text-slate-900 truncate">{row.project.name}</span>
                  </div>
                ) : (
                  <span className="text-xs text-slate-600 truncate">{row.task.name}</span>
                )}
              </div>
            ))}
          </div>

          {/* Right Column — Timeline */}
          <div className="flex-1 overflow-x-auto">
            <div className="min-w-[720px] relative">
              {/* Week Headers */}
              <div className="h-10 flex border-b border-slate-200">
                {GANTT_WEEKS.map((w, i) => (
                  <div
                    key={i}
                    className="flex-1 flex items-center justify-center text-xs text-slate-400 border-r border-slate-100"
                  >
                    {w}
                  </div>
                ))}
              </div>

              {/* Task Rows */}
              {rows.map((row, i) => (
                <div key={i} className="h-10 relative border-b border-slate-100">
                  {/* Week grid lines */}
                  <div className="absolute inset-0 flex">
                    {GANTT_WEEKS.map((_, wi) => (
                      <div key={wi} className="flex-1 border-r border-slate-50" />
                    ))}
                  </div>

                  {row.type === "project" ? (
                    // Project summary bar
                    <div
                      className="absolute top-2 h-6 rounded-md bg-slate-300/60 border border-slate-300 flex items-center overflow-hidden"
                      style={{
                        left: `${((row.span.start - 1) / TOTAL_WEEKS) * 100}%`,
                        width: `${(row.span.duration / TOTAL_WEEKS) * 100}%`,
                      }}
                    >
                      <div
                        className="absolute inset-y-0 left-0 bg-indigo-400/40 rounded-l-md"
                        style={{ width: `${row.span.avgProgress}%` }}
                      />
                      <span className="relative z-10 text-[10px] font-medium text-slate-700 px-2 truncate">
                        {row.project.client} — {row.span.avgProgress}%
                      </span>
                    </div>
                  ) : (
                    // Task bar
                    <div
                      className={clsx(
                        "absolute top-1.5 h-7 rounded cursor-pointer transition-all overflow-hidden",
                        selectedTask?.id === row.task.id ? "ring-2 ring-indigo-500 ring-offset-1" : "hover:brightness-110"
                      )}
                      style={{
                        left: `${((row.task.startWeek - 1) / TOTAL_WEEKS) * 100}%`,
                        width: `${(row.task.duration / TOTAL_WEEKS) * 100}%`,
                      }}
                      onClick={() => setSelectedTask(selectedTask?.id === row.task.id ? null : row.task)}
                    >
                      {/* Light background */}
                      <div className={clsx("absolute inset-0", categoryColorMap[row.task.category].bgLight)} />
                      {/* Progress fill */}
                      <div
                        className={clsx("absolute inset-y-0 left-0", categoryColorMap[row.task.category].bg)}
                        style={{ width: `${row.task.progress}%` }}
                      />
                      {/* Label */}
                      <span className="relative z-10 text-[10px] font-medium text-slate-800 px-1.5 leading-7 truncate block">
                        {row.task.name} {row.task.progress > 0 ? `${row.task.progress}%` : ""}
                      </span>
                    </div>
                  )}
                </div>
              ))}

              {/* Today Line */}
              <div
                className="absolute top-0 bottom-0 w-0 border-l-2 border-dashed border-red-500 z-10 pointer-events-none"
                style={{ left: `${TODAY_PERCENT}%` }}
              >
                <div className="absolute -top-0 -left-3 bg-red-500 text-white text-[9px] px-1 rounded-b font-medium">
                  今日
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Task Detail */}
      {selectedTask && (
        <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-900">工項詳情</h3>
            <button
              onClick={() => setSelectedTask(null)}
              className="text-slate-400 hover:text-slate-600 text-lg leading-none"
            >
              ×
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-slate-500 mb-1">工項名稱</p>
              <p className="text-sm font-semibold text-slate-900">{selectedTask.name}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">工種</p>
              <div className="flex items-center gap-1.5">
                <div className={clsx("w-3 h-3 rounded-sm", categoryColorMap[selectedTask.category].bg)} />
                <span className="text-sm font-medium text-slate-900">{selectedTask.category}</span>
              </div>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">負責工班</p>
              <p className="text-sm font-medium text-slate-900">👷 {selectedTask.assignee}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">進度</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-slate-100 rounded-full h-2">
                  <div
                    className={clsx("h-2 rounded-full", categoryColorMap[selectedTask.category].bg)}
                    style={{ width: `${selectedTask.progress}%` }}
                  />
                </div>
                <span className="text-sm font-bold text-slate-900">{selectedTask.progress}%</span>
              </div>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100">
            <p className="text-xs text-slate-500 mb-1">備註</p>
            <p className="text-sm text-slate-700">{selectedTask.notes}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// Tab 3: Cost Management
// ============================================================

function CostTab() {
  const [expandedProject, setExpandedProject] = useState<string | null>("cp1");

  // Helpers
  const getExpenses = (txs: CostTransaction[]) => txs.filter((t) => t.amount < 0);
  const getIncome = (txs: CostTransaction[]) => txs.filter((t) => t.amount > 0);
  const sumAmount = (txs: CostTransaction[]) => txs.reduce((s, t) => s + t.amount, 0);

  const getCategoryBreakdown = (txs: CostTransaction[]) => {
    const expenses = getExpenses(txs);
    const cats: Record<CostCategory, number> = { 材料費: 0, 工資: 0, 設計費: 0, 其他: 0 };
    expenses.forEach((t) => {
      if (t.category in cats) cats[t.category] += Math.abs(t.amount);
    });
    return cats;
  };

  // Summary KPIs
  const totalBudget = costProjects.reduce((s, p) => s + p.totalBudget, 0);
  const totalExpense = costProjects.reduce((s, p) => s + Math.abs(sumAmount(getExpenses(p.transactions))), 0);
  const totalIncome = costProjects.reduce((s, p) => s + sumAmount(getIncome(p.transactions)), 0);
  const balance = totalIncome - totalExpense;

  // Monthly chart max value
  const maxMonthly = Math.max(...monthlySummary.map((m) => Math.max(m.income, m.expense)), 1);

  return (
    <div className="space-y-4">
      {/* Summary KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500 mb-1">總預算</p>
          <p className="text-xl font-bold text-slate-900">NT$ {(totalBudget / 10000).toFixed(0)}萬</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500 mb-1">已支出</p>
          <p className="text-xl font-bold text-red-500">NT$ {(totalExpense / 10000).toFixed(0)}萬</p>
          <p className="text-xs text-slate-400 mt-1">{((totalExpense / totalBudget) * 100).toFixed(1)}% of 預算</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500 mb-1">已收款</p>
          <p className="text-xl font-bold text-emerald-600">NT$ {(totalIncome / 10000).toFixed(0)}萬</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500 mb-1">現金結餘</p>
          <p className={clsx("text-xl font-bold", balance >= 0 ? "text-emerald-600" : "text-red-500")}>
            NT$ {balance >= 0 ? "+" : ""}{(balance / 10000).toFixed(0)}萬
          </p>
        </div>
      </div>

      {/* Project Cost Cards */}
      {costProjects.map((project) => {
        const expenses = getExpenses(project.transactions);
        const income = getIncome(project.transactions);
        const totalSpent = Math.abs(sumAmount(expenses));
        const totalReceived = sumAmount(income);
        const spentPercent = Math.min((totalSpent / project.totalBudget) * 100, 100);
        const catBreakdown = getCategoryBreakdown(project.transactions);
        const catTotal = Object.values(catBreakdown).reduce((s, v) => s + v, 0) || 1;
        const isExpanded = expandedProject === project.id;

        // Running balance for transactions (sorted by date)
        const sortedTx = [...project.transactions].sort((a, b) => a.date.localeCompare(b.date));
        let runningBalance = 0;
        const txWithBalance = sortedTx.map((tx) => {
          runningBalance += tx.amount;
          return { ...tx, balance: runningBalance };
        });

        return (
          <div key={project.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            {/* Project Header */}
            <div
              className="p-4 sm:p-5 cursor-pointer hover:bg-slate-50/50 transition-colors"
              onClick={() => setExpandedProject(isExpanded ? null : project.id)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 text-sm">{isExpanded ? "▼" : "▶"}</span>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{project.name}</h3>
                    <p className="text-xs text-slate-500">{project.client}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-900">NT$ {project.totalBudget.toLocaleString()}</p>
                  <p className="text-xs text-slate-500">總預算</p>
                </div>
              </div>

              {/* Budget Progress */}
              <div className="mb-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-600">已支出 NT$ {totalSpent.toLocaleString()}</span>
                  <span className={clsx("font-semibold", spentPercent > 90 ? "text-red-600" : spentPercent > 70 ? "text-amber-600" : "text-emerald-600")}>
                    {spentPercent.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3">
                  <div
                    className={clsx(
                      "h-3 rounded-full transition-all",
                      spentPercent > 90 ? "bg-red-500" : spentPercent > 70 ? "bg-amber-500" : "bg-emerald-500"
                    )}
                    style={{ width: `${spentPercent}%` }}
                  />
                </div>
              </div>

              {/* Category Breakdown Bar */}
              <div className="flex gap-0.5 h-2 rounded-full overflow-hidden bg-slate-100">
                {(Object.entries(catBreakdown) as [CostCategory, number][]).map(([cat, val]) =>
                  val > 0 ? (
                    <div
                      key={cat}
                      className={clsx("h-full", costCategoryColors[cat])}
                      style={{ width: `${(val / catTotal) * 100}%` }}
                      title={`${cat}: NT$ ${val.toLocaleString()}`}
                    />
                  ) : null
                )}
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                {(Object.entries(catBreakdown) as [CostCategory, number][]).map(([cat, val]) => (
                  <div key={cat} className="flex items-center gap-1 text-xs text-slate-600">
                    <div className={clsx("w-2 h-2 rounded-full", costCategoryColors[cat])} />
                    <span>{cat}</span>
                    <span className="font-medium text-slate-800">NT$ {val.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Expanded: Transaction Table */}
            {isExpanded && (
              <div className="border-t border-slate-200">
                <div className="px-4 sm:px-5 py-3 bg-slate-50/50">
                  <p className="text-xs font-semibold text-slate-500">進出帳記錄</p>
                </div>
                {/* Table Header */}
                <div className="hidden sm:grid grid-cols-12 gap-2 px-4 sm:px-5 py-2 text-xs font-semibold text-slate-400 border-b border-slate-100">
                  <div className="col-span-2">日期</div>
                  <div className="col-span-4">項目</div>
                  <div className="col-span-2">類別</div>
                  <div className="col-span-2 text-right">金額</div>
                  <div className="col-span-2 text-right">餘額</div>
                </div>
                {/* Rows */}
                <div className="divide-y divide-slate-100">
                  {txWithBalance.map((tx) => (
                    <div key={tx.id} className="px-4 sm:px-5 py-3 hover:bg-slate-50/50">
                      {/* Desktop row */}
                      <div className="hidden sm:grid grid-cols-12 gap-2 items-center">
                        <div className="col-span-2 text-xs text-slate-500">{tx.date}</div>
                        <div className="col-span-4 text-sm text-slate-900 truncate">{tx.item}</div>
                        <div className="col-span-2">
                          <span className={clsx("text-xs px-2 py-0.5 rounded-full text-white", costCategoryColors[tx.category])}>
                            {tx.category}
                          </span>
                        </div>
                        <div className={clsx("col-span-2 text-sm font-semibold text-right", tx.amount > 0 ? "text-emerald-600" : "text-red-500")}>
                          {tx.amount > 0 ? "+" : ""}NT$ {Math.abs(tx.amount).toLocaleString()}
                        </div>
                        <div className={clsx("col-span-2 text-sm font-medium text-right", tx.balance >= 0 ? "text-slate-700" : "text-red-500")}>
                          NT$ {tx.balance.toLocaleString()}
                        </div>
                      </div>
                      {/* Mobile row */}
                      <div className="sm:hidden space-y-1">
                        <div className="flex justify-between items-start">
                          <div className="min-w-0">
                            <p className="text-sm text-slate-900 truncate">{tx.item}</p>
                            <p className="text-xs text-slate-400">{tx.date} · {tx.category}</p>
                          </div>
                          <span className={clsx("text-sm font-semibold shrink-0 ml-2", tx.amount > 0 ? "text-emerald-600" : "text-red-500")}>
                            {tx.amount > 0 ? "+" : ""}NT$ {Math.abs(tx.amount).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 text-right">餘額: NT$ {tx.balance.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Summary */}
                <div className="px-4 sm:px-5 py-3 bg-slate-50 border-t border-slate-200">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">收入合計</span>
                    <span className="font-semibold text-emerald-600">+NT$ {totalReceived.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-slate-600">支出合計</span>
                    <span className="font-semibold text-red-500">-NT$ {totalSpent.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1 pt-1 border-t border-slate-200">
                    <span className="font-semibold text-slate-700">結餘</span>
                    <span className={clsx("font-bold", (totalReceived - totalSpent) >= 0 ? "text-emerald-600" : "text-red-500")}>
                      NT$ {(totalReceived - totalSpent).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Monthly Summary Bar Chart */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5">
        <h3 className="text-sm font-semibold text-slate-700 mb-1">月度收支匯總</h3>
        <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-emerald-400" />
            <span>收入</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-red-400" />
            <span>支出</span>
          </div>
        </div>

        <div className="flex items-end gap-3 sm:gap-6" style={{ height: "180px" }}>
          {monthlySummary.map((m) => (
            <div key={m.month} className="flex-1 flex flex-col items-center gap-1 h-full">
              {/* Bars container */}
              <div className="flex-1 w-full flex gap-1 items-end">
                {/* Income bar */}
                <div className="flex-1 flex flex-col items-center justify-end">
                  {m.income > 0 && (
                    <span className="text-[10px] text-emerald-600 font-medium mb-0.5">
                      {(m.income / 10000).toFixed(0)}萬
                    </span>
                  )}
                  <div
                    className="w-full bg-emerald-400 rounded-t-md transition-all"
                    style={{ height: `${(m.income / maxMonthly) * 140}px` }}
                  />
                </div>
                {/* Expense bar */}
                <div className="flex-1 flex flex-col items-center justify-end">
                  {m.expense > 0 && (
                    <span className="text-[10px] text-red-500 font-medium mb-0.5">
                      {(m.expense / 10000).toFixed(0)}萬
                    </span>
                  )}
                  <div
                    className="w-full bg-red-400 rounded-t-md transition-all"
                    style={{ height: `${(m.expense / maxMonthly) * 140}px` }}
                  />
                </div>
              </div>
              {/* Month label */}
              <span className="text-xs text-slate-500 font-medium">{m.month}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Page Wrapper
// ============================================================

export default function ProjectsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400">載入中...</div>}>
      <ProjectsContent />
    </Suspense>
  );
}
