"use client";

import { useState } from "react";
import { clsx } from "clsx";

const styles = ["現代簡約", "北歐風", "日式無印", "工業風", "新古典", "鄉村風", "混搭風"];
const regions = ["台北市", "新北市", "桃園市", "台中市", "台南市", "高雄市"];
const budgetRanges = ["50萬以下", "50-100萬", "100-200萬", "200-500萬", "500萬以上"];

const mockOwners = [
  { id: 1, name: "陳怡君", style: "現代簡約", budget: "150-200萬", region: "台北市大安區", area: "35坪", type: "新屋裝修", match: 96, avatar: "bg-gradient-to-br from-pink-400 to-rose-500", posted: "2 小時前", desc: "三房兩廳，希望以白色和木質為主調，注重收納功能" },
  { id: 2, name: "林志明", style: "工業風", budget: "80-120萬", region: "新北市板橋區", area: "28坪", type: "老屋翻新", match: 91, avatar: "bg-gradient-to-br from-blue-400 to-indigo-500", posted: "5 小時前", desc: "30年老公寓翻新，喜歡裸露磚牆和鐵件元素" },
  { id: 3, name: "王美玲", style: "北歐風", budget: "200-300萬", region: "台北市信義區", area: "45坪", type: "新屋裝修", match: 88, avatar: "bg-gradient-to-br from-emerald-400 to-teal-500", posted: "1 天前", desc: "新購預售屋客變，家中有兩個小孩，需要安全且溫馨的空間" },
  { id: 4, name: "張家豪", style: "日式無印", budget: "100-150萬", region: "台中市西屯區", area: "32坪", type: "局部裝修", match: 85, avatar: "bg-gradient-to-br from-amber-400 to-orange-500", posted: "1 天前", desc: "客廳和主臥室改造，偏好自然材質和簡潔線條" },
  { id: 5, name: "劉雅婷", style: "新古典", budget: "300-500萬", region: "台北市中山區", area: "60坪", type: "豪宅裝修", match: 82, avatar: "bg-gradient-to-br from-violet-400 to-purple-500", posted: "2 天前", desc: "新購豪宅裝潢，希望優雅大器風格，有獨立書房需求" },
  { id: 6, name: "蔡明宏", style: "混搭風", budget: "120-180萬", region: "桃園市中壢區", area: "40坪", type: "新屋裝修", match: 79, avatar: "bg-gradient-to-br from-cyan-400 to-blue-500", posted: "3 天前", desc: "四房格局，希望每個房間有不同主題風格" },
  { id: 7, name: "黃淑芬", style: "鄉村風", budget: "80-100萬", region: "台南市東區", area: "25坪", type: "老屋翻新", match: 76, avatar: "bg-gradient-to-br from-lime-400 to-green-500", posted: "3 天前", desc: "退休夫妻的老宅翻修，喜歡溫暖的鄉村風格" },
  { id: 8, name: "吳政達", style: "現代簡約", budget: "50-80萬", region: "高雄市左營區", area: "22坪", type: "小宅裝修", match: 73, avatar: "bg-gradient-to-br from-red-400 to-pink-500", posted: "4 天前", desc: "首購小宅，預算有限但希望有質感的居住空間" },
];

export default function MatchingPage() {
  const [styleFilter, setStyleFilter] = useState("");
  const [regionFilter, setRegionFilter] = useState("");
  const [budgetFilter, setBudgetFilter] = useState("");
  const [accepted, setAccepted] = useState<Set<number>>(new Set());

  const filtered = mockOwners.filter((o) => {
    if (styleFilter && o.style !== styleFilter) return false;
    if (regionFilter && !o.region.startsWith(regionFilter)) return false;
    return true;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">🎯 精準業主媒合系統</h1>
        <p className="text-sm text-slate-500 mt-1">根據您的風格專長、預算範圍、服務區域，智慧推薦最適合的業主</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500">待媒合業主</p>
          <p className="text-2xl font-bold text-indigo-600">{filtered.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500">本月已接案</p>
          <p className="text-2xl font-bold text-emerald-600">3</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500">平均媒合分數</p>
          <p className="text-2xl font-bold text-amber-600">84%</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500">回應率</p>
          <p className="text-2xl font-bold text-violet-600">92%</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <p className="text-sm font-semibold text-slate-700 mb-3">篩選條件</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <select value={styleFilter} onChange={(e) => setStyleFilter(e.target.value)} className="border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[44px] flex-1">
            <option value="">所有風格</option>
            {styles.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={regionFilter} onChange={(e) => setRegionFilter(e.target.value)} className="border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[44px] flex-1">
            <option value="">所有地區</option>
            {regions.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
          <select value={budgetFilter} onChange={(e) => setBudgetFilter(e.target.value)} className="border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[44px] flex-1">
            <option value="">所有預算</option>
            {budgetRanges.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
      </div>

      {/* Owner Cards */}
      <div className="space-y-4">
        {filtered.map((owner) => (
          <div key={owner.id} className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 hover:shadow-md transition-shadow">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Avatar & Match Score */}
              <div className="flex sm:flex-col items-center gap-3 sm:gap-2 sm:w-20 shrink-0">
                <div className={clsx("w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg", owner.avatar)}>
                  {owner.name[0]}
                </div>
                <div className="flex flex-col items-center">
                  <span className={clsx(
                    "text-lg font-bold",
                    owner.match >= 90 ? "text-emerald-600" : owner.match >= 80 ? "text-indigo-600" : "text-amber-600"
                  )}>
                    {owner.match}%
                  </span>
                  <span className="text-[10px] text-slate-400">媒合度</span>
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h3 className="font-semibold text-slate-900">{owner.name}</h3>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">{owner.style}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">{owner.type}</span>
                  <span className="text-xs text-slate-400 ml-auto">{owner.posted}</span>
                </div>
                <p className="text-sm text-slate-600 mb-2">{owner.desc}</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                  <span>📍 {owner.region}</span>
                  <span>📐 {owner.area}</span>
                  <span>💰 {owner.budget}</span>
                </div>
              </div>

              {/* Action */}
              <div className="flex sm:flex-col gap-2 sm:justify-center shrink-0">
                {accepted.has(owner.id) ? (
                  <span className="px-4 py-2 rounded-lg text-sm font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 text-center min-h-[44px] flex items-center justify-center">
                    ✓ 已接案
                  </span>
                ) : (
                  <>
                    <button
                      onClick={() => setAccepted((prev) => new Set(prev).add(owner.id))}
                      className="px-4 py-2 rounded-lg text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-colors min-h-[44px]"
                    >
                      接案
                    </button>
                    <button className="px-4 py-2 rounded-lg text-sm font-medium border border-slate-300 text-slate-600 hover:bg-slate-50 transition-colors min-h-[44px]">
                      詳情
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
