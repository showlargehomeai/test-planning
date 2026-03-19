"use client";

import { useState } from "react";
import { clsx } from "clsx";

interface KanbanCard {
  id: number;
  title: string;
  client: string;
  progress: number;
  dueDate: string;
  assignee: string;
  priority: "high" | "medium" | "low";
  tags: string[];
}

type ColumnKey = "waiting" | "inProgress" | "review" | "completed";

const columnConfig: { key: ColumnKey; label: string; color: string; bgColor: string }[] = [
  { key: "waiting", label: "待開工", color: "text-slate-700", bgColor: "bg-slate-100" },
  { key: "inProgress", label: "進行中", color: "text-blue-700", bgColor: "bg-blue-50" },
  { key: "review", label: "驗收", color: "text-amber-700", bgColor: "bg-amber-50" },
  { key: "completed", label: "完工", color: "text-emerald-700", bgColor: "bg-emerald-50" },
];

const initialCards: Record<ColumnKey, KanbanCard[]> = {
  waiting: [
    { id: 1, title: "主臥室木作施工", client: "陳怡君", progress: 0, dueDate: "03/25", assignee: "王師傅", priority: "high", tags: ["木作"] },
    { id: 2, title: "廚房設備安裝", client: "陳怡君", progress: 0, dueDate: "03/28", assignee: "李師傅", priority: "medium", tags: ["廚具", "水電"] },
  ],
  inProgress: [
    { id: 3, title: "客廳天花板施工", client: "陳怡君", progress: 65, dueDate: "03/20", assignee: "王師傅", priority: "high", tags: ["木作", "油漆"] },
    { id: 4, title: "浴室防水＋磁磚", client: "林志明", progress: 40, dueDate: "03/22", assignee: "張師傅", priority: "high", tags: ["泥作", "防水"] },
    { id: 5, title: "全室水電配管", client: "林志明", progress: 80, dueDate: "03/19", assignee: "陳師傅", priority: "medium", tags: ["水電"] },
  ],
  review: [
    { id: 6, title: "玄關地磚鋪設", client: "王美玲", progress: 95, dueDate: "03/17", assignee: "張師傅", priority: "medium", tags: ["泥作"] },
    { id: 7, title: "書房系統櫃安裝", client: "劉雅婷", progress: 90, dueDate: "03/18", assignee: "王師傅", priority: "low", tags: ["木作"] },
  ],
  completed: [
    { id: 8, title: "全室拆除清運", client: "林志明", progress: 100, dueDate: "03/10", assignee: "工班", priority: "high", tags: ["拆除"] },
    { id: 9, title: "隔間牆砌磚", client: "王美玲", progress: 100, dueDate: "03/12", assignee: "張師傅", priority: "medium", tags: ["泥作"] },
  ],
};

const priorityColors = {
  high: "bg-red-50 text-red-700 border-red-200",
  medium: "bg-amber-50 text-amber-700 border-amber-200",
  low: "bg-slate-50 text-slate-600 border-slate-200",
};
const priorityLabels = { high: "緊急", medium: "一般", low: "低" };

export default function KanbanPage() {
  const [cards] = useState(initialCards);
  const [mobileColumn, setMobileColumn] = useState<ColumnKey>("inProgress");

  const totalTasks = Object.values(cards).flat().length;
  const completedTasks = cards.completed.length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-full mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">📋 工程進度管理看板</h1>
          <p className="text-sm text-slate-500 mt-1">
            進行中 {totalTasks - completedTasks} 項 · 已完成 {completedTasks} 項
          </p>
        </div>
        <button className="px-4 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors min-h-[44px] shrink-0">
          + 新增工項
        </button>
      </div>

      {/* Mobile column selector */}
      <div className="flex gap-1 bg-slate-100 rounded-lg p-1 md:hidden overflow-x-auto">
        {columnConfig.map((col) => (
          <button
            key={col.key}
            onClick={() => setMobileColumn(col.key)}
            className={clsx(
              "flex-1 px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors",
              mobileColumn === col.key ? "bg-white shadow-sm text-slate-900" : "text-slate-500"
            )}
          >
            {col.label}
            <span className="ml-1 text-xs text-slate-400">{cards[col.key].length}</span>
          </button>
        ))}
      </div>

      {/* Desktop: 4-column layout, Mobile: single selected column */}
      <div className="hidden md:grid md:grid-cols-4 gap-4">
        {columnConfig.map((col) => (
          <div key={col.key} className="space-y-3">
            <div className={clsx("flex items-center justify-between px-3 py-2 rounded-lg", col.bgColor)}>
              <span className={clsx("text-sm font-semibold", col.color)}>{col.label}</span>
              <span className="text-xs bg-white rounded-full px-2 py-0.5 text-slate-500 font-medium">{cards[col.key].length}</span>
            </div>
            <div className="space-y-2 min-h-[200px]">
              {cards[col.key].map((card) => (
                <CardComponent key={card.id} card={card} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Mobile: single column */}
      <div className="md:hidden space-y-2">
        {cards[mobileColumn].map((card) => (
          <CardComponent key={card.id} card={card} />
        ))}
        {cards[mobileColumn].length === 0 && (
          <div className="text-center py-8 text-slate-400 text-sm">此欄位沒有工項</div>
        )}
      </div>
    </div>
  );
}

function CardComponent({ card }: { card: KanbanCard }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-3 hover:shadow-md transition-shadow cursor-pointer">
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="text-sm font-semibold text-slate-900">{card.title}</h3>
        <span className={clsx("text-[10px] px-1.5 py-0.5 rounded-full border shrink-0", priorityColors[card.priority])}>
          {priorityLabels[card.priority]}
        </span>
      </div>

      <p className="text-xs text-slate-500 mb-2">業主：{card.client}</p>

      {/* Progress Bar */}
      {card.progress > 0 && (
        <div className="mb-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-slate-400">進度</span>
            <span className="text-[10px] font-medium text-slate-600">{card.progress}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5">
            <div
              className={clsx(
                "h-1.5 rounded-full transition-all",
                card.progress >= 90 ? "bg-emerald-500" : card.progress >= 50 ? "bg-blue-500" : "bg-amber-500"
              )}
              style={{ width: `${card.progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Tags */}
      <div className="flex flex-wrap gap-1 mb-2">
        {card.tags.map((tag) => (
          <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">{tag}</span>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-[10px] text-slate-400">
        <span>👷 {card.assignee}</span>
        <span>📅 {card.dueDate}</span>
      </div>
    </div>
  );
}
