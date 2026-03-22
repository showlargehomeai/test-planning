"use client";

import { useState } from "react";
import { clsx } from "clsx";

const mockReviews = [
  { id: 1, name: "陳怡君", project: "大安區現代簡約宅", rating: 5, date: "2026-03-10", content: "設計師非常專業，從溝通到完工都很順利。特別喜歡客廳的收納設計，完全符合我們家的需求。施工品質也很好，推薦給大家！", avatar: "from-pink-400 to-rose-500", replied: true, replyContent: "感謝怡君的好評！很高興收納設計符合您的需求，期待未來有機會再合作 🙏" },
  { id: 2, name: "林志明", project: "板橋工業風 Loft", rating: 5, date: "2026-02-28", content: "工業風處理得非常到位，磚牆的效果比我想像中還好。設計師很有耐心，修改了好幾版才定案，但成品真的很滿意！", avatar: "from-blue-400 to-indigo-500", replied: true, replyContent: "志明的品味很好，合作過程也非常愉快。裸露磚牆的效果確實很棒！" },
  { id: 3, name: "王美玲", project: "信義區北歐親子宅", rating: 4, date: "2026-02-15", content: "整體設計很滿意，親子空間規劃得很用心。唯一小缺點是工期比預計多了兩週，不過最後的品質是好的。", avatar: "from-emerald-400 to-teal-500", replied: false },
  { id: 4, name: "張家豪", project: "西屯日式無印小宅", rating: 5, date: "2026-01-20", content: "小坪數卻做出了很有質感的空間，日式元素運用得恰到好處。尤其喜歡臥室的隱藏式收納，太厲害了！", avatar: "from-amber-400 to-orange-500", replied: true, replyContent: "謝謝家豪！小空間的收納設計確實是我們的強項，很開心您滿意 😊" },
  { id: 5, name: "劉雅婷", project: "中山區新古典豪宅", rating: 5, date: "2025-12-30", content: "從設計到施工都非常專業，書房的設計是全家最愛的空間。設計師的美感真的很好，每個細節都到位。", avatar: "from-violet-400 to-purple-500", replied: true, replyContent: "雅婷的書房確實是這個案子的亮點，感謝信任！" },
  { id: 6, name: "蔡明宏", project: "中壢開放式廚房", rating: 3, date: "2025-11-15", content: "設計方面OK，但施工過程溝通有些落差，部分材料的顏色和當初討論的不太一樣。後來有做調整，最後結果還算滿意。", avatar: "from-cyan-400 to-blue-500", replied: true, replyContent: "感謝明宏的回饋，材料色差問題已與廠商反映並改善流程。很抱歉造成不便，我們會持續進步。" },
];

const clientOptions = [
  { name: "陳怡君", project: "大安區現代簡約宅" },
  { name: "林志明", project: "板橋工業風 Loft" },
  { name: "王美玲", project: "信義區北歐親子宅" },
  { name: "張家豪", project: "西屯日式無印小宅" },
  { name: "劉雅婷", project: "中山區新古典豪宅" },
];

function StarDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={clsx("text-lg", i <= rating ? "text-amber-400" : "text-slate-200")}>★</span>
      ))}
    </div>
  );
}

export default function ReviewsPage() {
  const [filter, setFilter] = useState<number>(0);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteClient, setInviteClient] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const [replyingId, setReplyingId] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");

  const avgRating = (mockReviews.reduce((s, r) => s + r.rating, 0) / mockReviews.length).toFixed(1);
  const responseRate = Math.round((mockReviews.filter((r) => r.replied).length / mockReviews.length) * 100);
  const filtered = filter === 0 ? mockReviews : mockReviews.filter((r) => r.rating === filter);

  const handleSendInvite = () => {
    if (!inviteClient) return;
    const client = clientOptions.find((c) => c.name === inviteClient);
    setToast(`已發送評價邀請給 ${client?.name}（${client?.project}）`);
    setShowInviteForm(false);
    setInviteClient("");
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium">
          ✓ {toast}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">⭐ 業主評價與口碑系統</h1>
          <p className="text-sm text-slate-500 mt-1">管理您的評價，建立良好口碑</p>
        </div>
        <button
          onClick={() => setShowInviteForm(!showInviteForm)}
          className="px-4 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors min-h-[44px] shrink-0"
        >
          {showInviteForm ? "✕ 取消" : "📩 邀請業主評價"}
        </button>
      </div>

      {/* Invite Form */}
      {showInviteForm && (
        <div className="bg-white rounded-xl border border-indigo-200 p-5">
          <h3 className="font-semibold text-slate-900 mb-4">邀請業主評價</h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-slate-500 block mb-1">選擇業主 / 專案</label>
              <select
                value={inviteClient}
                onChange={(e) => setInviteClient(e.target.value)}
                className="border border-slate-300 rounded-lg px-3 py-2.5 text-sm w-full sm:w-96 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[44px]"
              >
                <option value="">請選擇業主</option>
                {clientOptions.map((c) => (
                  <option key={c.name} value={c.name}>{c.name} — {c.project}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSendInvite}
                disabled={!inviteClient}
                className="px-4 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed min-h-[44px]"
              >
                發送邀請
              </button>
              <button
                onClick={() => setShowInviteForm(false)}
                className="px-4 py-2.5 border border-slate-300 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors min-h-[44px]"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Score Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 text-center">
          <p className="text-5xl font-bold text-indigo-600 mb-1">{avgRating}</p>
          <StarDisplay rating={Math.round(Number(avgRating))} />
          <p className="text-sm text-slate-500 mt-2">{mockReviews.length} 則評價</p>
        </div>

        {/* Rating Distribution */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <p className="text-sm font-semibold text-slate-700 mb-3">評分分佈</p>
          {[5, 4, 3, 2, 1].map((star) => {
            const count = mockReviews.filter((r) => r.rating === star).length;
            const pct = (count / mockReviews.length) * 100;
            return (
              <div key={star} className="flex items-center gap-2 mb-1.5">
                <span className="text-xs text-slate-500 w-4">{star}★</span>
                <div className="flex-1 bg-slate-100 rounded-full h-2">
                  <div className="bg-amber-400 rounded-full h-2 transition-all" style={{ width: `${pct}%` }} />
                </div>
                <span className="text-xs text-slate-400 w-6 text-right">{count}</span>
              </div>
            );
          })}
        </div>

        {/* Trust Badges */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
          <p className="text-sm font-semibold text-slate-700">信譽徽章</p>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <span className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">✓</span>
              <span className="text-slate-700">回覆率 {responseRate}%</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">🏆</span>
              <span className="text-slate-700">年度優質設計師</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">⭐</span>
              <span className="text-slate-700">五星好評率 67%</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="w-8 h-8 rounded-full bg-violet-50 flex items-center justify-center text-violet-600">🔒</span>
              <span className="text-slate-700">身份已驗證</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-2">
        {[0, 5, 4, 3, 2, 1].map((star) => (
          <button
            key={star}
            onClick={() => setFilter(star)}
            className={clsx(
              "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
              filter === star ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            )}
          >
            {star === 0 ? "全部" : `${star} ★`}
          </button>
        ))}
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filtered.map((review) => (
          <div key={review.id} className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5">
            <div className="flex items-start gap-3">
              <div className={clsx("w-10 h-10 rounded-full bg-gradient-to-br flex items-center justify-center text-white font-bold shrink-0", review.avatar)}>
                {review.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="font-semibold text-slate-900">{review.name}</span>
                  <StarDisplay rating={review.rating} />
                  <span className="text-xs text-slate-400">{review.date}</span>
                </div>
                <p className="text-xs text-indigo-600 mb-2">{review.project}</p>
                <p className="text-sm text-slate-700">{review.content}</p>

                {review.replied && review.replyContent && (
                  <div className="mt-3 ml-4 pl-4 border-l-2 border-indigo-200 bg-indigo-50/50 rounded-r-lg p-3">
                    <p className="text-xs font-medium text-indigo-700 mb-1">設計師回覆</p>
                    <p className="text-sm text-slate-600">{review.replyContent}</p>
                  </div>
                )}

                {!review.replied && (
                  <>
                    <button onClick={() => setReplyingId(replyingId === review.id ? null : review.id)} className="mt-3 text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                      💬 回覆此評價
                    </button>
                    {replyingId === review.id && (
                      <div className="mt-2 space-y-2">
                        <textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="輸入回覆..."
                          rows={2}
                          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        <button
                          onClick={() => { setToast(`已回覆 ${review.name} 的評價`); setReplyingId(null); setReplyText(""); setTimeout(() => setToast(null), 2000); }}
                          className="px-3 py-1.5 text-xs font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                        >
                          送出回覆
                        </button>
                      </div>
                    )}
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
