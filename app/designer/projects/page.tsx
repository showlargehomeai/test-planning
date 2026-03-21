"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { clsx } from "clsx";

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

const mockProjects: Project[] = [
  {
    id: 1,
    title: "陽明山景觀豪宅",
    client: "王董事長",
    budget: "800萬",
    area: "80坪",
    progress: 25,
    status: "pending",
    nextMilestone: "設計提案確認",
    deadline: "2026-04-15",
    style: "現代簡約",
    region: "台北市士林區",
    startDate: "2026-03-01",
    estimatedCompletion: "2026-08-30",
    teamSize: 3,
    priority: "high",
    avatar: "bg-gradient-to-br from-emerald-400 to-teal-500",
    description: "山景第一排豪宅，要求極簡風格配合自然景觀",
    contractSigned: true,
    designApproved: false,
    constructionStarted: false,
  },
  {
    id: 2,
    title: "信義區辦公室改裝",
    client: "創新科技股份有限公司",
    budget: "450萬",
    area: "120坪",
    progress: 65,
    status: "inProgress",
    nextMilestone: "水電配線完成",
    deadline: "2026-05-20",
    style: "工業風",
    region: "台北市信義區",
    startDate: "2026-02-10",
    estimatedCompletion: "2026-06-15",
    teamSize: 5,
    priority: "medium",
    avatar: "bg-gradient-to-br from-blue-400 to-indigo-500",
    description: "新創公司總部，需要開放式協作空間",
    contractSigned: true,
    designApproved: true,
    constructionStarted: true,
  },
  {
    id: 3,
    title: "三房兩廳居家空間",
    client: "林小姐",
    budget: "180萬",
    area: "35坪",
    progress: 90,
    status: "review",
    nextMilestone: "業主驗收",
    deadline: "2026-04-01",
    style: "北歐風",
    region: "新北市板橋區",
    startDate: "2026-01-15",
    estimatedCompletion: "2026-04-05",
    teamSize: 2,
    priority: "high",
    avatar: "bg-gradient-to-br from-pink-400 to-rose-500",
    description: "年輕夫妻的第一個家，溫馨舒適為主",
    contractSigned: true,
    designApproved: true,
    constructionStarted: true,
  },
  {
    id: 4,
    title: "老宅翻新專案",
    client: "張先生",
    budget: "320萬",
    area: "40坪",
    progress: 100,
    status: "completed",
    nextMilestone: "已完工",
    deadline: "2026-03-15",
    style: "混搭風",
    region: "台中市西屯區",
    startDate: "2025-12-01",
    estimatedCompletion: "2026-03-15",
    teamSize: 4,
    priority: "medium",
    avatar: "bg-gradient-to-br from-violet-400 to-purple-500",
    description: "40年老宅重新改造，融合古典與現代元素",
    contractSigned: true,
    designApproved: true,
    constructionStarted: true,
  },
  {
    id: 5,
    title: "咖啡廳商空設計",
    client: "BREW咖啡",
    budget: "280萬",
    area: "25坪",
    progress: 45,
    status: "inProgress",
    nextMilestone: "吧台施工",
    deadline: "2026-05-10",
    style: "工業風",
    region: "台北市大同區",
    startDate: "2026-02-20",
    estimatedCompletion: "2026-05-25",
    teamSize: 3,
    priority: "medium",
    avatar: "bg-gradient-to-br from-amber-400 to-orange-500",
    description: "文青咖啡廳，營造溫暖工業氛圍",
    contractSigned: true,
    designApproved: true,
    constructionStarted: false,
  },
  {
    id: 6,
    title: "小坪數套房改造",
    client: "陳同學",
    budget: "85萬",
    area: "12坪",
    progress: 15,
    status: "pending",
    nextMilestone: "合約簽署",
    deadline: "2026-06-30",
    style: "日式無印",
    region: "台北市中正區",
    startDate: "2026-03-15",
    estimatedCompletion: "2026-07-15",
    teamSize: 1,
    priority: "low",
    avatar: "bg-gradient-to-br from-cyan-400 to-blue-500",
    description: "學生套房，機能性收納為重點",
    contractSigned: false,
    designApproved: false,
    constructionStarted: false,
  },
];

const statusConfig = {
  pending: {
    label: "待確認",
    color: "text-amber-700 bg-amber-50 border-amber-200",
    dotColor: "bg-amber-500",
  },
  inProgress: {
    label: "進行中",
    color: "text-blue-700 bg-blue-50 border-blue-200",
    dotColor: "bg-blue-500",
  },
  review: {
    label: "驗收中",
    color: "text-purple-700 bg-purple-50 border-purple-200",
    dotColor: "bg-purple-500",
  },
  completed: {
    label: "已完工",
    color: "text-emerald-700 bg-emerald-50 border-emerald-200",
    dotColor: "bg-emerald-500",
  },
};

const priorityConfig = {
  high: { label: "高", color: "text-red-700 bg-red-50" },
  medium: { label: "中", color: "text-yellow-700 bg-yellow-50" },
  low: { label: "低", color: "text-gray-700 bg-gray-50" },
};

function ProjectsContent() {
  const searchParams = useSearchParams();
  const newProjectClient = searchParams.get("newProject");

  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterPriority, setFilterPriority] = useState<string>("");
  const [draggedProject, setDraggedProject] = useState<Project | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // Auto-create project from CRM query param
  useEffect(() => {
    if (newProjectClient) {
      const alreadyExists = projects.some((p) => p.client === newProjectClient);
      if (!alreadyExists) {
        const newProject: Project = {
          id: Date.now(),
          title: `${newProjectClient} 的新專案`,
          client: newProjectClient,
          budget: "待定",
          area: "待定",
          progress: 0,
          status: "pending",
          nextMilestone: "初步設計提案",
          deadline: "待定",
          style: "待定",
          region: "待定",
          startDate: new Date().toISOString().split("T")[0],
          estimatedCompletion: "待定",
          teamSize: 1,
          priority: "medium",
          avatar: "bg-gradient-to-br from-indigo-400 to-indigo-600",
          description: `來自 CRM 建立的新專案 — ${newProjectClient}`,
          contractSigned: false,
          designApproved: false,
          constructionStarted: false,
        };
        setProjects((prev) => [newProject, ...prev]);
        setToast(`已為 ${newProjectClient} 建立新專案`);
        setTimeout(() => setToast(null), 3000);
      }
    }
  }, [newProjectClient]);

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

  const handleDragStart = (project: Project) => {
    setDraggedProject(project);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, newStatus: Project["status"]) => {
    e.preventDefault();
    if (draggedProject && draggedProject.status !== newStatus) {
      setProjects((prev) =>
        prev.map((p) =>
          p.id === draggedProject.id ? { ...p, status: newStatus } : p
        )
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
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium">
          ✓ {toast}
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">📋 專案進度追蹤</h1>
        <p className="text-sm text-slate-500 mt-1">看板式專案管理，拖拉卡片切換狀態，掌握所有專案進度</p>
      </div>

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
            {/* Column Header */}
            <div className="flex items-center gap-2 mb-4">
              <div className={clsx("w-2 h-2 rounded-full", statusConfig[status as keyof typeof statusConfig].dotColor)} />
              <h3 className="font-semibold text-slate-900">{statusConfig[status as keyof typeof statusConfig].label}</h3>
              <span className="ml-auto text-xs bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full">
                {statusProjects.length}
              </span>
            </div>

            {/* Project Cards */}
            <div className="space-y-3">
              {statusProjects.map((project) => (
                <div
                  key={project.id}
                  draggable
                  onDragStart={() => handleDragStart(project)}
                  className="bg-white rounded-lg border border-slate-200 p-4 cursor-move hover:shadow-md transition-shadow"
                >
                  {/* Card Header */}
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

                  {/* Project Info */}
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

                  {/* Progress */}
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

                  {/* Next Milestone */}
                  <div className="mt-3 pt-3 border-t border-slate-100">
                    <p className="text-xs text-slate-500 mb-1">下個里程碑</p>
                    <p className="text-sm font-medium text-slate-900">{project.nextMilestone}</p>
                    <p className="text-xs text-slate-500 mt-1">⏰ {project.deadline}</p>
                  </div>

                  {/* Status Indicators */}
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

export default function ProjectsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400">載入中...</div>}>
      <ProjectsContent />
    </Suspense>
  );
}
