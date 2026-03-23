"use client";

import { useState } from "react";
import { clsx } from "clsx";

// ============================================================
// 三方協作檢討 + 三方驗收流程
// 後端對應：site_inspections, disputes, sop_checklists, warranties, homeowner_reviews
// ============================================================

type Party = "designer" | "crew" | "supplier" | "homeowner";
type InspectionStatus = "pending" | "passed" | "failed" | "partial";

interface ReviewItem {
  id: number;
  category: string;
  item: string;
  standard: string;
  designerCheck: InspectionStatus;
  crewCheck: InspectionStatus;
  homeownerCheck: InspectionStatus;
  photo: boolean;
  note: string;
}

interface Defect {
  id: number;
  item: string;
  description: string;
  reportedBy: Party;
  assignedTo: Party;
  severity: "critical" | "major" | "minor";
  status: "open" | "fixing" | "fixed" | "verified";
  deadline: string;
  photos: number;
}

interface ReviewSession {
  id: string;
  projectName: string;
  clientName: string;
  phase: string;
  date: string;
  status: "scheduled" | "in_progress" | "completed" | "needs_action";
  items: ReviewItem[];
  defects: Defect[];
  participants: { name: string; role: Party; attended: boolean }[];
  summary: string;
}

const partyLabels: Record<Party, { label: string; color: string; icon: string }> = {
  designer: { label: "設計師", color: "bg-indigo-50 text-indigo-700", icon: "🎨" },
  crew: { label: "工班", color: "bg-amber-50 text-amber-700", icon: "👷" },
  supplier: { label: "建材商", color: "bg-emerald-50 text-emerald-700", icon: "🏭" },
  homeowner: { label: "業主", color: "bg-violet-50 text-violet-700", icon: "🏠" },
};

const severityConfig = {
  critical: { label: "嚴重", color: "bg-red-100 text-red-700" },
  major: { label: "一般", color: "bg-amber-100 text-amber-700" },
  minor: { label: "輕微", color: "bg-slate-100 text-slate-600" },
};

const defectStatusConfig = {
  open: { label: "待處理", color: "bg-red-50 text-red-700" },
  fixing: { label: "修復中", color: "bg-amber-50 text-amber-700" },
  fixed: { label: "已修復", color: "bg-blue-50 text-blue-700" },
  verified: { label: "已確認", color: "bg-emerald-50 text-emerald-700" },
};

const inspectionIcons: Record<InspectionStatus, string> = {
  pending: "⬜", passed: "✅", failed: "❌", partial: "⚠️",
};

// Mock review sessions
const mockSessions: ReviewSession[] = [
  {
    id: "INS-001", projectName: "大安區現代簡約宅", clientName: "陳怡君",
    phase: "泥作完工驗收", date: "2026-03-20", status: "needs_action",
    participants: [
      { name: "張明哲", role: "designer", attended: true },
      { name: "張師傅", role: "crew", attended: true },
      { name: "陳怡君", role: "homeowner", attended: true },
      { name: "冠軍磁磚", role: "supplier", attended: false },
    ],
    items: [
      { id: 1, category: "地磚", item: "平整度", standard: "2m 靠尺落差 ≤ 2mm", designerCheck: "passed", crewCheck: "passed", homeownerCheck: "passed", photo: true, note: "" },
      { id: 2, category: "地磚", item: "空鼓檢查", standard: "敲擊無空心聲", designerCheck: "passed", crewCheck: "passed", homeownerCheck: "pending", photo: true, note: "" },
      { id: 3, category: "地磚", item: "磁磚對縫", standard: "十字縫寬度一致 ±0.5mm", designerCheck: "failed", crewCheck: "partial", homeownerCheck: "pending", photo: true, note: "客廳靠窗區域對縫不齊" },
      { id: 4, category: "地磚", item: "收邊完整", standard: "陽角/陰角收邊無毛邊", designerCheck: "passed", crewCheck: "passed", homeownerCheck: "passed", photo: true, note: "" },
      { id: 5, category: "防水", item: "蓄水試驗", standard: "48hr 無滲漏", designerCheck: "passed", crewCheck: "passed", homeownerCheck: "passed", photo: true, note: "蓄水 48hr 通過" },
      { id: 6, category: "防水", item: "壁面高度", standard: "防水層 ≥ 150cm", designerCheck: "passed", crewCheck: "passed", homeownerCheck: "pending", photo: false, note: "" },
      { id: 7, category: "泥作", item: "隔間牆垂直度", standard: "2m 內落差 ≤ 3mm", designerCheck: "partial", crewCheck: "passed", homeownerCheck: "pending", photo: true, note: "書房隔間微偏，需複核" },
      { id: 8, category: "泥作", item: "批土表面", standard: "表面平整無凸起", designerCheck: "passed", crewCheck: "passed", homeownerCheck: "pending", photo: false, note: "" },
    ],
    defects: [
      { id: 1, item: "客廳地磚對縫不齊", description: "靠窗區域約 3m² 範圍十字縫偏移 2mm，需重新調整", reportedBy: "designer", assignedTo: "crew", severity: "major", status: "fixing", deadline: "2026-03-25", photos: 3 },
      { id: 2, item: "書房隔間牆微偏", description: "書房與客廳隔間牆頂部偏移約 4mm，超出標準", reportedBy: "designer", assignedTo: "crew", severity: "minor", status: "open", deadline: "2026-03-27", photos: 2 },
    ],
    summary: "泥作工程整體完成度 85%，防水通過蓄水試驗。2 項缺失待改善。",
  },
  {
    id: "INS-002", projectName: "大安區現代簡約宅", clientName: "陳怡君",
    phase: "木作中間驗收", date: "2026-03-22", status: "in_progress",
    participants: [
      { name: "張明哲", role: "designer", attended: true },
      { name: "王師傅", role: "crew", attended: true },
      { name: "陳怡君", role: "homeowner", attended: false },
    ],
    items: [
      { id: 9, category: "天花板", item: "骨架間距", standard: "30cm 間距，交叉固定", designerCheck: "passed", crewCheck: "passed", homeownerCheck: "pending", photo: true, note: "" },
      { id: 10, category: "天花板", item: "水平度", standard: "雷射水平 ≤ 1mm", designerCheck: "passed", crewCheck: "passed", homeownerCheck: "pending", photo: true, note: "" },
      { id: 11, category: "櫃體", item: "尺寸符合圖面", standard: "誤差 ≤ 2mm", designerCheck: "partial", crewCheck: "passed", homeownerCheck: "pending", photo: true, note: "主臥衣櫃深度少 5mm" },
    ],
    defects: [
      { id: 3, item: "主臥衣櫃深度不足", description: "圖面標示 60cm，實際 59.5cm，門片關閉後衣物會被壓到", reportedBy: "designer", assignedTo: "crew", severity: "major", status: "open", deadline: "2026-03-28", photos: 1 },
    ],
    summary: "木作進行中，天花板骨架完成，櫃體有 1 項尺寸偏差。",
  },
  {
    id: "INS-003", projectName: "板橋工業風 Loft", clientName: "林志明",
    phase: "隱蔽工程驗收（水電）", date: "2026-03-25", status: "scheduled",
    participants: [
      { name: "張明哲", role: "designer", attended: false },
      { name: "陳師傅", role: "crew", attended: false },
      { name: "林志明", role: "homeowner", attended: false },
    ],
    items: [],
    defects: [],
    summary: "預定 3/25 進行水電隱蔽工程驗收。",
  },
];

const sessionStatusConfig = {
  scheduled: { label: "已排程", color: "bg-blue-50 text-blue-700" },
  in_progress: { label: "進行中", color: "bg-amber-50 text-amber-700" },
  completed: { label: "已完成", color: "bg-emerald-50 text-emerald-700" },
  needs_action: { label: "待處理", color: "bg-red-50 text-red-700" },
};

export default function ReviewPage() {
  const [sessions] = useState(mockSessions);
  const [selectedId, setSelectedId] = useState(mockSessions[0].id);
  const [tab, setTab] = useState<"checklist" | "defects" | "feedback">("checklist");
  const [toast, setToast] = useState<string | null>(null);

  const current = sessions.find(s => s.id === selectedId);

  const passRate = current?.items.length
    ? Math.round(current.items.filter(i => i.designerCheck === "passed" && i.crewCheck === "passed").length / current.items.length * 100)
    : 0;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {toast && <div className="fixed top-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium">{toast}</div>}

      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">🔍 三方檢討與驗收</h1>
        <p className="text-sm text-slate-500 mt-1">設計師 × 工班 × 業主 — 協作驗收、缺失追蹤、改善管理</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500">待處理驗收</p>
          <p className="text-2xl font-bold text-red-600">{sessions.filter(s => s.status === "needs_action").length}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500">進行中</p>
          <p className="text-2xl font-bold text-amber-600">{sessions.filter(s => s.status === "in_progress").length}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500">未結缺失</p>
          <p className="text-2xl font-bold text-orange-600">{sessions.reduce((s, r) => s + r.defects.filter(d => d.status !== "verified").length, 0)}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500">通過率</p>
          <p className="text-2xl font-bold text-emerald-600">{passRate}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left: Session List */}
        <div className="space-y-2">
          <p className="text-sm font-semibold text-slate-700">驗收場次</p>
          {sessions.map(s => (
            <button key={s.id} onClick={() => setSelectedId(s.id)} className={clsx(
              "w-full text-left p-3 rounded-xl border-2 transition-all",
              selectedId === s.id ? "border-indigo-500 bg-indigo-50" : "border-slate-200 bg-white hover:border-slate-300"
            )}>
              <div className="flex items-center gap-2 mb-1">
                <span className={clsx("text-[10px] px-2 py-0.5 rounded-full", sessionStatusConfig[s.status].color)}>{sessionStatusConfig[s.status].label}</span>
                <span className="text-[10px] text-slate-400">{s.date}</span>
              </div>
              <p className="text-sm font-semibold text-slate-900">{s.phase}</p>
              <p className="text-xs text-slate-500">{s.projectName} · {s.clientName}</p>
              {s.defects.length > 0 && (
                <p className="text-[10px] text-red-500 mt-1">⚠️ {s.defects.filter(d => d.status !== "verified").length} 項缺失未結</p>
              )}
            </button>
          ))}
        </div>

        {/* Right: Detail */}
        <div className="lg:col-span-3 space-y-4">
          {current ? (
            <>
              {/* Header */}
              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="text-lg font-bold text-slate-900">{current.phase}</h2>
                      <span className={clsx("text-xs px-2 py-0.5 rounded-full", sessionStatusConfig[current.status].color)}>{sessionStatusConfig[current.status].label}</span>
                    </div>
                    <p className="text-sm text-slate-500">{current.projectName} · {current.clientName} · {current.date}</p>
                  </div>
                  <span className="text-xs font-mono text-slate-400">{current.id}</span>
                </div>
                {/* Participants */}
                <div className="flex flex-wrap gap-2">
                  {current.participants.map(p => (
                    <div key={p.name} className={clsx("flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs", p.attended ? partyLabels[p.role].color : "bg-slate-100 text-slate-400")}>
                      <span>{partyLabels[p.role].icon}</span>
                      <span>{p.name}</span>
                      {!p.attended && <span className="text-[10px]">（未到）</span>}
                    </div>
                  ))}
                </div>
                {current.summary && <p className="text-sm text-slate-600 mt-3 bg-slate-50 rounded-lg p-3">{current.summary}</p>}
              </div>

              {/* Tabs */}
              <div className="flex gap-1 bg-slate-100 rounded-lg p-1 w-fit">
                {[
                  { key: "checklist" as const, label: "📋 驗收清單", count: current.items.length },
                  { key: "defects" as const, label: "⚠️ 缺失追蹤", count: current.defects.length },
                  { key: "feedback" as const, label: "💬 三方回饋", count: 0 },
                ].map(t => (
                  <button key={t.key} onClick={() => setTab(t.key)} className={clsx(
                    "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    tab === t.key ? "bg-white shadow-sm text-slate-900" : "text-slate-500"
                  )}>{t.label} {t.count > 0 && <span className="text-xs ml-1 text-slate-400">({t.count})</span>}</button>
                ))}
              </div>

              {/* Checklist Tab */}
              {tab === "checklist" && (
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                  {current.items.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 text-sm">尚未建立驗收清單</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="text-left px-4 py-2.5 text-xs text-slate-500 font-medium w-20">分類</th>
                            <th className="text-left px-4 py-2.5 text-xs text-slate-500 font-medium">檢查項目</th>
                            <th className="text-left px-4 py-2.5 text-xs text-slate-500 font-medium hidden sm:table-cell">驗收標準</th>
                            <th className="text-center px-2 py-2.5 text-xs text-slate-500 font-medium w-16">🎨</th>
                            <th className="text-center px-2 py-2.5 text-xs text-slate-500 font-medium w-16">👷</th>
                            <th className="text-center px-2 py-2.5 text-xs text-slate-500 font-medium w-16">🏠</th>
                            <th className="text-center px-2 py-2.5 text-xs text-slate-500 font-medium w-10">📷</th>
                          </tr>
                        </thead>
                        <tbody>
                          {current.items.map(item => {
                            const allPassed = item.designerCheck === "passed" && item.crewCheck === "passed" && item.homeownerCheck === "passed";
                            const hasFail = item.designerCheck === "failed" || item.crewCheck === "failed" || item.homeownerCheck === "failed";
                            return (
                              <tr key={item.id} className={clsx("border-b border-slate-50", hasFail && "bg-red-50/30", allPassed && "bg-emerald-50/30")}>
                                <td className="px-4 py-2.5 text-xs text-slate-500">{item.category}</td>
                                <td className="px-4 py-2.5">
                                  <p className="font-medium text-slate-800">{item.item}</p>
                                  {item.note && <p className="text-[10px] text-slate-400 mt-0.5">{item.note}</p>}
                                </td>
                                <td className="px-4 py-2.5 text-xs text-slate-500 hidden sm:table-cell">{item.standard}</td>
                                <td className="text-center px-2 py-2.5 text-base cursor-pointer" onClick={() => { setToast("設計師驗收已更新"); setTimeout(() => setToast(null), 1500); }}>{inspectionIcons[item.designerCheck]}</td>
                                <td className="text-center px-2 py-2.5 text-base cursor-pointer" onClick={() => { setToast("工班驗收已更新"); setTimeout(() => setToast(null), 1500); }}>{inspectionIcons[item.crewCheck]}</td>
                                <td className="text-center px-2 py-2.5 text-base cursor-pointer" onClick={() => { setToast("業主驗收已更新"); setTimeout(() => setToast(null), 1500); }}>{inspectionIcons[item.homeownerCheck]}</td>
                                <td className="text-center px-2 py-2.5 text-sm">{item.photo ? "📷" : "—"}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* Defects Tab */}
              {tab === "defects" && (
                <div className="space-y-3">
                  {current.defects.length === 0 ? (
                    <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-400 text-sm">🎉 無缺失記錄</div>
                  ) : current.defects.map(defect => (
                    <div key={defect.id} className="bg-white rounded-xl border border-slate-200 p-4">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className={clsx("text-[10px] px-2 py-0.5 rounded-full", severityConfig[defect.severity].color)}>{severityConfig[defect.severity].label}</span>
                            <span className={clsx("text-[10px] px-2 py-0.5 rounded-full", defectStatusConfig[defect.status].color)}>{defectStatusConfig[defect.status].label}</span>
                          </div>
                          <h3 className="font-semibold text-slate-900 text-sm">{defect.item}</h3>
                          <p className="text-xs text-slate-500 mt-0.5">{defect.description}</p>
                        </div>
                        <div className="text-right shrink-0 text-xs">
                          <p className="text-slate-400">⏰ {defect.deadline}</p>
                          {defect.photos > 0 && <p className="text-slate-400">📷 {defect.photos} 張</p>}
                        </div>
                      </div>
                      <div className="flex items-center gap-4 pt-2 border-t border-slate-100 text-xs">
                        <span className="text-slate-500">回報：<span className={clsx("px-1.5 py-0.5 rounded-full ml-0.5", partyLabels[defect.reportedBy].color)}>{partyLabels[defect.reportedBy].label}</span></span>
                        <span className="text-slate-500">負責：<span className={clsx("px-1.5 py-0.5 rounded-full ml-0.5", partyLabels[defect.assignedTo].color)}>{partyLabels[defect.assignedTo].label}</span></span>
                        {defect.status === "open" && (
                          <button onClick={() => { setToast("已通知工班處理缺失"); setTimeout(() => setToast(null), 2000); }} className="ml-auto px-3 py-1.5 text-xs font-medium rounded-lg bg-amber-500 text-white hover:bg-amber-600">催促改善</button>
                        )}
                        {defect.status === "fixed" && (
                          <button onClick={() => { setToast("缺失已確認完成"); setTimeout(() => setToast(null), 2000); }} className="ml-auto px-3 py-1.5 text-xs font-medium rounded-lg bg-emerald-600 text-white hover:bg-emerald-700">確認通過</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Feedback Tab */}
              {tab === "feedback" && (
                <div className="space-y-4">
                  <div className="bg-white rounded-xl border border-slate-200 p-5">
                    <h3 className="text-sm font-semibold text-slate-700 mb-3">三方回饋紀錄</h3>
                    {[
                      { role: "designer" as Party, name: "張明哲", feedback: "泥作整體品質不錯，但對縫精度需要加強。防水工程通過測試，可以進入下階段。建議下次施工前先做放樣確認。", time: "2026-03-20 15:30", rating: 4 },
                      { role: "crew" as Party, name: "張師傅", feedback: "客廳靠窗區域因原有地面不平，導致對縫困難。已安排返工修正。隔間牆偏移是因為原始結構不正，會做調整。", time: "2026-03-20 16:00", rating: 0 },
                      { role: "homeowner" as Party, name: "陳怡君", feedback: "整體滿意，希望缺失能在期限內改好。浴室防水做得很好，蓄水測試沒問題。", time: "2026-03-20 18:30", rating: 4 },
                    ].map((fb, i) => (
                      <div key={i} className="flex gap-3 py-3 border-b border-slate-100 last:border-0">
                        <div className={clsx("w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0", partyLabels[fb.role].color)}>
                          {partyLabels[fb.role].icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium text-slate-800">{fb.name}</span>
                            <span className={clsx("text-[10px] px-1.5 py-0.5 rounded-full", partyLabels[fb.role].color)}>{partyLabels[fb.role].label}</span>
                            <span className="text-[10px] text-slate-400 ml-auto">{fb.time}</span>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed">{fb.feedback}</p>
                          {fb.rating > 0 && <p className="text-xs text-amber-500 mt-1">{"⭐".repeat(fb.rating)}{"☆".repeat(5 - fb.rating)}</p>}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Improvement Action Items */}
                  <div className="bg-white rounded-xl border border-slate-200 p-5">
                    <h3 className="text-sm font-semibold text-slate-700 mb-3">📋 改善行動項目</h3>
                    <div className="space-y-2">
                      {[
                        { action: "客廳地磚對縫返工", owner: "張師傅（泥作）", deadline: "03/25", status: "進行中" },
                        { action: "書房隔間牆調整", owner: "張師傅（泥作）", deadline: "03/27", status: "待處理" },
                        { action: "下次施工前做放樣確認", owner: "張明哲（設計師）", deadline: "每次開工前", status: "制度化" },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3 text-xs bg-slate-50 rounded-lg p-3">
                          <span className="text-slate-400 w-4">{i + 1}.</span>
                          <span className="flex-1 font-medium text-slate-800">{item.action}</span>
                          <span className="text-slate-500">{item.owner}</span>
                          <span className="text-slate-500">{item.deadline}</span>
                          <span className={clsx("px-2 py-0.5 rounded-full text-[10px]",
                            item.status === "進行中" ? "bg-amber-50 text-amber-700" :
                            item.status === "制度化" ? "bg-indigo-50 text-indigo-700" : "bg-red-50 text-red-700"
                          )}>{item.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
              <span className="text-4xl block mb-2">🔍</span>
              <p className="text-sm text-slate-500">選擇左側驗收場次查看詳情</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
