"use client";

import { useState } from "react";

interface WorkRecord {
  id: number;
  date: string;
  project: string;
  trade: string;
  task: string;
  workers: string[];
  progress: number;
  photos: string[];
  materials: { name: string; qty: string; unit: string }[];
  notes: string;
  status: "completed" | "in-progress" | "issue";
}

const tradeColors: Record<string, string> = {
  泥作: "bg-orange-100 text-orange-700",
  水電: "bg-blue-100 text-blue-700",
  木工: "bg-yellow-100 text-yellow-800",
  油漆: "bg-green-100 text-green-700",
  鋁窗: "bg-purple-100 text-purple-700",
  拆除: "bg-red-100 text-red-700",
};

const statusMap = {
  completed: { label: "已完成", color: "bg-green-50 text-green-700" },
  "in-progress": { label: "進行中", color: "bg-amber-50 text-amber-700" },
  issue: { label: "有問題", color: "bg-red-50 text-red-700" },
};

const mockRecords: WorkRecord[] = [
  {
    id: 1,
    date: "2026-03-21",
    project: "大安區林宅翻新",
    trade: "泥作",
    task: "浴室磁磚鋪設",
    workers: ["陳師傅", "小林"],
    progress: 80,
    photos: ["bathroom_tile_1.jpg", "bathroom_tile_2.jpg", "bathroom_tile_3.jpg"],
    materials: [
      { name: "30x60 灰色磁磚", qty: "12", unit: "坪" },
      { name: "益膠泥", qty: "8", unit: "包" },
      { name: "填縫劑", qty: "3", unit: "包" },
    ],
    notes: "主牆面已完成，明日續做地板磁磚。客戶確認對花方式。",
    status: "in-progress",
  },
  {
    id: 2,
    date: "2026-03-21",
    project: "信義區張宅廚房改造",
    trade: "水電",
    task: "廚房配管完成",
    workers: ["張師傅"],
    progress: 100,
    photos: ["kitchen_pipe_1.jpg", "kitchen_pipe_2.jpg"],
    materials: [
      { name: "PVC 管 4分", qty: "15", unit: "支" },
      { name: "彎頭", qty: "8", unit: "個" },
      { name: "止水帶", qty: "2", unit: "卷" },
    ],
    notes: "冷熱水管路完成配管，已測試水壓正常。瓦斯管明日配。",
    status: "completed",
  },
  {
    id: 3,
    date: "2026-03-21",
    project: "中山區陳宅浴室翻修",
    trade: "鋁窗",
    task: "鋁窗安裝驗收",
    workers: ["李師傅"],
    progress: 100,
    photos: ["window_install_1.jpg"],
    materials: [
      { name: "氣密窗 120x150", qty: "2", unit: "樘" },
      { name: "矽利康", qty: "4", unit: "條" },
    ],
    notes: "兩樘氣密窗安裝完成，業主驗收通過。密合度良好，無滲水。",
    status: "completed",
  },
  {
    id: 4,
    date: "2026-03-21",
    project: "內湖區黃宅陽台外推",
    trade: "泥作",
    task: "外牆防水施作",
    workers: ["陳師傅", "阿國"],
    progress: 60,
    photos: ["waterproof_1.jpg", "waterproof_2.jpg"],
    materials: [
      { name: "彈性水泥", qty: "5", unit: "桶" },
      { name: "防水毯", qty: "10", unit: "碼" },
      { name: "底漆", qty: "2", unit: "桶" },
    ],
    notes: "第一層防水塗佈完成，需等 24 小時乾燥後上第二層。角落加強處理。",
    status: "in-progress",
  },
  {
    id: 5,
    date: "2026-03-20",
    project: "松山區吳宅全室裝潢",
    trade: "拆除",
    task: "隔間拆除",
    workers: ["阿國", "小林"],
    progress: 100,
    photos: ["demolish_1.jpg", "demolish_2.jpg", "demolish_3.jpg", "demolish_4.jpg"],
    materials: [
      { name: "廢棄物清運", qty: "2", unit: "車" },
    ],
    notes: "客廳與書房隔間牆拆除完成。發現牆內有暗管，已與水電師傅確認無使用中管路。清運完畢。",
    status: "completed",
  },
  {
    id: 6,
    date: "2026-03-20",
    project: "大安區林宅翻新",
    trade: "油漆",
    task: "油漆底漆",
    workers: ["劉師傅"],
    progress: 100,
    photos: ["paint_primer_1.jpg"],
    materials: [
      { name: "虹牌底漆", qty: "3", unit: "加侖" },
      { name: "砂紙 #240", qty: "10", unit: "張" },
    ],
    notes: "全室底漆第一遍完成。部分牆面有裂縫，已用AB膠修補後上漆。",
    status: "completed",
  },
];

export default function RecordsPage() {
  const [selectedRecord, setSelectedRecord] = useState<WorkRecord | null>(null);
  const [filterTrade, setFilterTrade] = useState<string>("all");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [progressInput, setProgressInput] = useState(0);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  };

  const trades = ["all", ...Object.keys(tradeColors)];
  const filtered = filterTrade === "all" ? mockRecords : mockRecords.filter((r) => r.trade === filterTrade);

  const todayRecords = filtered.filter((r) => r.date === "2026-03-21");
  const pastRecords = filtered.filter((r) => r.date !== "2026-03-21");

  const openRecord = (record: WorkRecord) => {
    setSelectedRecord(record);
    setProgressInput(record.progress);
    setNewNote(record.notes);
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium">
          ✓ {toast}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">施工紀錄</h1>
          <p className="text-sm text-slate-500 mt-1">記錄每日施工進度、照片與材料用量</p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="px-4 py-2 bg-amber-500 text-white text-sm font-medium rounded-lg hover:bg-amber-600 transition-colors"
        >
          + 新增紀錄
        </button>
      </div>

      {/* Trade Filter */}
      <div className="flex flex-wrap gap-2">
        {trades.map((t) => (
          <button
            key={t}
            onClick={() => setFilterTrade(t)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              filterTrade === t
                ? "bg-amber-500 text-white"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            {t === "all" ? "全部工種" : t}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Records List */}
        <div className="lg:col-span-2 space-y-4">
          {/* Today */}
          {todayRecords.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-amber-700 mb-2">今日施工 ({todayRecords.length})</h2>
              <div className="space-y-2">
                {todayRecords.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => openRecord(r)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      selectedRecord?.id === r.id
                        ? "border-amber-400 bg-amber-50"
                        : "border-slate-200 bg-white hover:border-amber-200"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs px-1.5 py-0.5 rounded ${tradeColors[r.trade] ?? "bg-slate-100 text-slate-600"}`}>
                        {r.trade}
                      </span>
                      <span className={`text-xs px-1.5 py-0.5 rounded ${statusMap[r.status].color}`}>
                        {statusMap[r.status].label}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-slate-900">{r.task}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{r.project}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex-1 bg-slate-100 rounded-full h-1.5">
                        <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: `${r.progress}%` }} />
                      </div>
                      <span className="text-xs text-slate-400">{r.progress}%</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Past */}
          {pastRecords.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-slate-500 mb-2">過往紀錄</h2>
              <div className="space-y-2">
                {pastRecords.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => openRecord(r)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      selectedRecord?.id === r.id
                        ? "border-amber-400 bg-amber-50"
                        : "border-slate-200 bg-white hover:border-amber-200"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-slate-400">{r.date}</span>
                      <span className={`text-xs px-1.5 py-0.5 rounded ${tradeColors[r.trade] ?? "bg-slate-100 text-slate-600"}`}>
                        {r.trade}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-slate-900">{r.task}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{r.project}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Record Detail */}
        <div className="lg:col-span-3">
          {selectedRecord ? (
            <div className="bg-white rounded-xl border border-amber-100 p-5 space-y-5">
              {/* Header */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs px-2 py-0.5 rounded ${tradeColors[selectedRecord.trade] ?? "bg-slate-100 text-slate-600"}`}>
                    {selectedRecord.trade}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded ${statusMap[selectedRecord.status].color}`}>
                    {statusMap[selectedRecord.status].label}
                  </span>
                  <span className="text-xs text-slate-400 ml-auto">{selectedRecord.date}</span>
                </div>
                <h2 className="text-lg font-semibold text-slate-900">{selectedRecord.task}</h2>
                <p className="text-sm text-slate-500">{selectedRecord.project}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {selectedRecord.workers.map((w) => (
                    <span key={w} className="text-xs bg-slate-100 px-2 py-0.5 rounded-full text-slate-600">
                      {w}
                    </span>
                  ))}
                </div>
              </div>

              {/* Progress */}
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-2">進度回報</label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={progressInput}
                    onChange={(e) => setProgressInput(Number(e.target.value))}
                    className="flex-1 accent-amber-500"
                  />
                  <span className="text-sm font-semibold text-amber-700 w-10 text-right">{progressInput}%</span>
                </div>
              </div>

              {/* Photos */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-slate-700">施工照片</label>
                  <button onClick={() => showToast("照片上傳功能已開啟")} className="text-xs text-amber-600 hover:text-amber-800 font-medium">+ 上傳照片</button>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {selectedRecord.photos.map((photo, idx) => (
                    <div
                      key={idx}
                      className="aspect-square bg-slate-100 rounded-lg flex items-center justify-center border-2 border-dashed border-slate-200 hover:border-amber-300 transition-colors cursor-pointer"
                    >
                      <div className="text-center">
                        <span className="text-2xl">📷</span>
                        <p className="text-[10px] text-slate-400 mt-1 px-1 truncate">{photo}</p>
                      </div>
                    </div>
                  ))}
                  <button onClick={() => showToast("照片上傳功能已開啟")} className="aspect-square bg-amber-50 rounded-lg flex items-center justify-center border-2 border-dashed border-amber-200 hover:border-amber-400 transition-colors">
                    <div className="text-center">
                      <span className="text-xl text-amber-400">+</span>
                      <p className="text-[10px] text-amber-500 mt-1">新增</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Materials */}
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-2">材料用量</label>
                <div className="bg-slate-50 rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left text-xs font-medium text-slate-500 px-3 py-2">材料名稱</th>
                        <th className="text-right text-xs font-medium text-slate-500 px-3 py-2">數量</th>
                        <th className="text-right text-xs font-medium text-slate-500 px-3 py-2">單位</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedRecord.materials.map((m, idx) => (
                        <tr key={idx} className="border-b border-slate-100 last:border-0">
                          <td className="px-3 py-2 text-slate-700">{m.name}</td>
                          <td className="px-3 py-2 text-right text-slate-900 font-medium">{m.qty}</td>
                          <td className="px-3 py-2 text-right text-slate-500">{m.unit}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-2">今日施工摘要</label>
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-300 resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2">
                <button onClick={() => setSelectedRecord(null)} className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors">
                  取消
                </button>
                <button onClick={() => showToast("施工紀錄已儲存")} className="px-4 py-2 text-sm font-medium text-white bg-amber-500 rounded-lg hover:bg-amber-600 transition-colors">
                  儲存紀錄
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-amber-100 p-12 flex flex-col items-center justify-center text-center">
              <span className="text-4xl mb-3">📋</span>
              <p className="text-slate-500">選擇左側紀錄查看詳情</p>
              <p className="text-xs text-slate-400 mt-1">或點擊「新增紀錄」建立新的施工紀錄</p>
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">新增施工紀錄</h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">專案</label>
                <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-300">
                  <option>大安區林宅翻新</option>
                  <option>信義區張宅廚房改造</option>
                  <option>中山區陳宅浴室翻修</option>
                  <option>松山區吳宅全室裝潢</option>
                  <option>內湖區黃宅陽台外推</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">工種</label>
                <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-300">
                  <option>泥作</option>
                  <option>水電</option>
                  <option>木工</option>
                  <option>油漆</option>
                  <option>鋁窗</option>
                  <option>拆除</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">施工項目</label>
                <input
                  type="text"
                  placeholder="例：浴室磁磚鋪設"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">施工照片</label>
                <div className="border-2 border-dashed border-slate-200 rounded-lg p-8 text-center hover:border-amber-300 transition-colors cursor-pointer">
                  <span className="text-3xl">📸</span>
                  <p className="text-sm text-slate-500 mt-2">點擊或拖曳上傳照片</p>
                  <p className="text-xs text-slate-400 mt-1">支援 JPG、PNG，最多 10 張</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">施工摘要</label>
                <textarea
                  rows={2}
                  placeholder="描述今日施工情況..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
              >
                取消
              </button>
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 text-sm font-medium text-white bg-amber-500 rounded-lg hover:bg-amber-600 transition-colors"
              >
                儲存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
