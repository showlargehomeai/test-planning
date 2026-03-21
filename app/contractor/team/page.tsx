"use client";

import { useState } from "react";

interface TeamMember {
  id: number;
  name: string;
  nickname: string;
  trades: string[];
  phone: string;
  experience: number;
  rating: number;
  reviews: number;
  availability: Record<string, boolean>; // day of week -> available
  currentProject: string | null;
  completedProjects: number;
  avatar: string;
  note: string;
}

const tradeColors: Record<string, string> = {
  泥作: "bg-orange-100 text-orange-700",
  水電: "bg-blue-100 text-blue-700",
  木工: "bg-yellow-100 text-yellow-800",
  油漆: "bg-green-100 text-green-700",
  鋁窗: "bg-purple-100 text-purple-700",
  拆除: "bg-red-100 text-red-700",
  防水: "bg-cyan-100 text-cyan-700",
  磁磚: "bg-orange-100 text-orange-700",
};

const weekdays = ["一", "二", "三", "四", "五", "六", "日"];

const mockTeam: TeamMember[] = [
  {
    id: 1,
    name: "陳建志",
    nickname: "陳師傅",
    trades: ["泥作", "防水", "磁磚"],
    phone: "0912-345-678",
    experience: 22,
    rating: 4.9,
    reviews: 38,
    availability: { 一: true, 二: true, 三: true, 四: true, 五: true, 六: true, 日: false },
    currentProject: "大安區林宅翻新",
    completedProjects: 156,
    avatar: "👷",
    note: "台北最強泥作師傅，磁磚對花超精準。週日固定休息。",
  },
  {
    id: 2,
    name: "張志明",
    nickname: "張師傅",
    trades: ["水電"],
    phone: "0923-456-789",
    experience: 18,
    rating: 4.8,
    reviews: 29,
    availability: { 一: true, 二: true, 三: true, 四: true, 五: true, 六: false, 日: false },
    currentProject: "信義區張宅廚房改造",
    completedProjects: 120,
    avatar: "🔧",
    note: "甲級水電技術士，配管又快又乾淨。週末通常不出工。",
  },
  {
    id: 3,
    name: "吳俊傑",
    nickname: "吳師傅",
    trades: ["木工"],
    phone: "0934-567-890",
    experience: 15,
    rating: 4.7,
    reviews: 22,
    availability: { 一: true, 二: true, 三: true, 四: true, 五: true, 六: true, 日: false },
    currentProject: null,
    completedProjects: 89,
    avatar: "🪚",
    note: "天花板、櫥櫃專長。手藝細膩，收邊漂亮。",
  },
  {
    id: 4,
    name: "劉文正",
    nickname: "劉師傅",
    trades: ["油漆"],
    phone: "0945-678-901",
    experience: 20,
    rating: 4.6,
    reviews: 31,
    availability: { 一: true, 二: true, 三: true, 四: true, 五: true, 六: true, 日: true },
    currentProject: null,
    completedProjects: 200,
    avatar: "🎨",
    note: "噴漆、手刷都強。特殊色調配色經驗豐富。假日可加班。",
  },
  {
    id: 5,
    name: "李國華",
    nickname: "李師傅",
    trades: ["鋁窗"],
    phone: "0956-789-012",
    experience: 12,
    rating: 4.8,
    reviews: 18,
    availability: { 一: true, 二: true, 三: false, 四: true, 五: true, 六: true, 日: false },
    currentProject: "中山區陳宅浴室翻修",
    completedProjects: 75,
    avatar: "🪟",
    note: "氣密窗、隔音窗專家。每週三固定進貨不出工。",
  },
  {
    id: 6,
    name: "林志偉",
    nickname: "小林",
    trades: ["泥作", "拆除"],
    phone: "0967-890-123",
    experience: 5,
    rating: 4.5,
    reviews: 12,
    availability: { 一: true, 二: true, 三: true, 四: true, 五: true, 六: true, 日: true },
    currentProject: "大安區林宅翻新",
    completedProjects: 42,
    avatar: "💪",
    note: "陳師傅的徒弟，年輕肯拼。拆除和搬運也很快。",
  },
  {
    id: 7,
    name: "王國安",
    nickname: "阿國",
    trades: ["泥作", "拆除", "防水"],
    phone: "0978-901-234",
    experience: 8,
    rating: 4.6,
    reviews: 15,
    availability: { 一: true, 二: true, 三: true, 四: true, 五: true, 六: false, 日: false },
    currentProject: "內湖區黃宅陽台外推",
    completedProjects: 58,
    avatar: "🏗️",
    note: "防水工程經驗豐富。拆除現場管理能力好。",
  },
  {
    id: 8,
    name: "周家豪",
    nickname: "小周",
    trades: ["水電"],
    phone: "0989-012-345",
    experience: 3,
    rating: 4.4,
    reviews: 8,
    availability: { 一: true, 二: true, 三: true, 四: true, 五: true, 六: true, 日: false },
    currentProject: null,
    completedProjects: 25,
    avatar: "⚡",
    note: "張師傅帶出來的，配線仔細。正在考甲級證照。",
  },
  {
    id: 9,
    name: "廖振宏",
    nickname: "小廖",
    trades: ["油漆"],
    phone: "0910-123-456",
    experience: 4,
    rating: 4.5,
    reviews: 10,
    availability: { 一: true, 二: true, 三: true, 四: true, 五: true, 六: true, 日: false },
    currentProject: null,
    completedProjects: 35,
    avatar: "🖌️",
    note: "劉師傅徒弟。批土功夫好，牆面處理很平。",
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-3.5 h-3.5 ${star <= Math.round(rating) ? "text-amber-400" : "text-slate-200"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function TeamPage() {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [filterTrade, setFilterTrade] = useState<string>("all");
  const [searchText, setSearchText] = useState("");

  const allTrades = ["all", ...new Set(mockTeam.flatMap((m) => m.trades))];

  const filtered = mockTeam.filter((m) => {
    const matchTrade = filterTrade === "all" || m.trades.includes(filterTrade);
    const matchSearch =
      searchText === "" ||
      m.name.includes(searchText) ||
      m.nickname.includes(searchText) ||
      m.trades.some((t) => t.includes(searchText));
    return matchTrade && matchSearch;
  });

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">班底管理</h1>
          <p className="text-sm text-slate-500 mt-1">共 {mockTeam.length} 位師傅｜{mockTeam.filter((m) => m.currentProject).length} 位出工中</p>
        </div>
        <button className="px-4 py-2 bg-amber-500 text-white text-sm font-medium rounded-lg hover:bg-amber-600 transition-colors">
          + 新增師傅
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="搜尋師傅姓名、工種..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-300"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {allTrades.map((t) => (
            <button
              key={t}
              onClick={() => setFilterTrade(t)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                filterTrade === t
                  ? "bg-amber-500 text-white"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              {t === "all" ? "全部" : t}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Team List */}
        <div className="lg:col-span-2">
          <div className="grid sm:grid-cols-2 gap-3">
            {filtered.map((m) => (
              <button
                key={m.id}
                onClick={() => setSelectedMember(m)}
                className={`text-left p-4 rounded-xl border transition-all hover:shadow-md ${
                  selectedMember?.id === m.id
                    ? "border-amber-400 bg-amber-50 shadow-md"
                    : "border-slate-200 bg-white"
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-3xl">{m.avatar}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-slate-900">{m.name}</p>
                      <span className="text-xs text-slate-400">({m.nickname})</span>
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <StarRating rating={m.rating} />
                      <span className="text-xs text-slate-400">{m.rating}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {m.trades.map((t) => (
                        <span key={t} className={`text-xs px-1.5 py-0.5 rounded ${tradeColors[t] ?? "bg-slate-100 text-slate-600"}`}>
                          {t}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-slate-500 mt-2">
                      {m.currentProject ? (
                        <span className="text-amber-600">出工中：{m.currentProject}</span>
                      ) : (
                        <span className="text-green-600">目前有空</span>
                      )}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Member Detail */}
        <div>
          {selectedMember ? (
            <div className="bg-white rounded-xl border border-amber-100 p-5 space-y-5 sticky top-4">
              {/* Profile */}
              <div className="text-center">
                <span className="text-5xl">{selectedMember.avatar}</span>
                <h2 className="text-lg font-bold text-slate-900 mt-2">{selectedMember.name}</h2>
                <p className="text-sm text-slate-500">{selectedMember.nickname}</p>
                <div className="flex items-center justify-center gap-1 mt-1">
                  <StarRating rating={selectedMember.rating} />
                  <span className="text-sm text-amber-600 font-medium ml-1">{selectedMember.rating}</span>
                  <span className="text-xs text-slate-400">({selectedMember.reviews} 則)</span>
                </div>
              </div>

              {/* Info */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">電話</span>
                  <span className="text-slate-900 font-medium">{selectedMember.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">年資</span>
                  <span className="text-slate-900 font-medium">{selectedMember.experience} 年</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">完成案件</span>
                  <span className="text-slate-900 font-medium">{selectedMember.completedProjects} 件</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">目前專案</span>
                  <span className={selectedMember.currentProject ? "text-amber-600 font-medium" : "text-green-600 font-medium"}>
                    {selectedMember.currentProject ?? "有空"}
                  </span>
                </div>
              </div>

              {/* Trades */}
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">工種專長</p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedMember.trades.map((t) => (
                    <span key={t} className={`text-xs px-2 py-1 rounded-lg ${tradeColors[t] ?? "bg-slate-100 text-slate-600"}`}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Availability */}
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">可用日期</p>
                <div className="grid grid-cols-7 gap-1">
                  {weekdays.map((day) => (
                    <div
                      key={day}
                      className={`text-center py-2 rounded-lg text-xs font-medium ${
                        selectedMember.availability[day]
                          ? "bg-green-50 text-green-700"
                          : "bg-red-50 text-red-400"
                      }`}
                    >
                      {day}
                    </div>
                  ))}
                </div>
              </div>

              {/* Note */}
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">備註</p>
                <p className="text-sm text-slate-600 leading-relaxed">{selectedMember.note}</p>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button className="flex-1 px-3 py-2 text-sm font-medium text-amber-700 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors">
                  派工
                </button>
                <button className="flex-1 px-3 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors">
                  聯絡
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-amber-100 p-12 flex flex-col items-center justify-center text-center">
              <span className="text-4xl mb-3">👷</span>
              <p className="text-slate-500">選擇師傅查看詳情</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
