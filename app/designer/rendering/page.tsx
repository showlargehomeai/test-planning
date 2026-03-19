"use client";

import { useState } from "react";
import { clsx } from "clsx";

const renderStyles = ["現代簡約", "北歐風", "日式無印", "工業風", "新古典", "鄉村風"];
const rooms = ["客廳", "臥室", "廚房", "浴室", "書房", "餐廳"];

const mockGallery = [
  { id: 1, name: "大安區客廳_v3", style: "現代簡約", room: "客廳", date: "2026-03-15", status: "completed", gradient: "from-slate-500 to-slate-700" },
  { id: 2, name: "板橋主臥_v2", style: "工業風", room: "臥室", date: "2026-03-14", status: "completed", gradient: "from-amber-600 to-orange-700" },
  { id: 3, name: "信義區廚房_v1", style: "北歐風", room: "廚房", date: "2026-03-13", status: "completed", gradient: "from-sky-500 to-blue-600" },
  { id: 4, name: "中山書房_v4", style: "新古典", room: "書房", date: "2026-03-12", status: "completed", gradient: "from-violet-500 to-purple-600" },
  { id: 5, name: "西屯浴室_v1", style: "日式無印", room: "浴室", date: "2026-03-11", status: "completed", gradient: "from-emerald-500 to-teal-600" },
  { id: 6, name: "左營餐廳_v2", style: "混搭風", room: "餐廳", date: "2026-03-10", status: "completed", gradient: "from-cyan-500 to-blue-600" },
];

export default function RenderingPage() {
  const [selectedStyle, setSelectedStyle] = useState("現代簡約");
  const [selectedRoom, setSelectedRoom] = useState("客廳");
  const [isRendering, setIsRendering] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showBefore, setShowBefore] = useState(true);

  const startRendering = () => {
    setIsRendering(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsRendering(false);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 400);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">🎨 3D/AI 快速渲染出圖</h1>
        <p className="text-sm text-slate-500 mt-1">上傳平面圖或照片，AI 自動生成 3D 效果圖</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500">本月渲染數</p>
          <p className="text-2xl font-bold text-indigo-600">24</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500">平均渲染時間</p>
          <p className="text-2xl font-bold text-emerald-600">45s</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500">剩餘配額</p>
          <p className="text-2xl font-bold text-amber-600">76</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500">客戶滿意度</p>
          <p className="text-2xl font-bold text-violet-600">94%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload & Settings */}
        <div className="space-y-4">
          {/* Upload Area */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h2 className="text-sm font-semibold text-slate-700 mb-3">上傳圖片</h2>
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-indigo-400 transition-colors cursor-pointer">
              <div className="text-4xl mb-2">📤</div>
              <p className="text-sm text-slate-600 font-medium">拖曳檔案至此或點擊上傳</p>
              <p className="text-xs text-slate-400 mt-1">支援 JPG, PNG, PDF 格式，最大 20MB</p>
            </div>
          </div>

          {/* Style Selector */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h2 className="text-sm font-semibold text-slate-700 mb-3">渲染風格</h2>
            <div className="grid grid-cols-3 gap-2">
              {renderStyles.map((style) => (
                <button
                  key={style}
                  onClick={() => setSelectedStyle(style)}
                  className={clsx(
                    "py-2 px-3 rounded-lg text-sm font-medium transition-all",
                    selectedStyle === style
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                  )}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          {/* Room Selector */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h2 className="text-sm font-semibold text-slate-700 mb-3">空間類型</h2>
            <div className="grid grid-cols-3 gap-2">
              {rooms.map((room) => (
                <button
                  key={room}
                  onClick={() => setSelectedRoom(room)}
                  className={clsx(
                    "py-2 px-3 rounded-lg text-sm font-medium transition-all",
                    selectedRoom === room
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                  )}
                >
                  {room}
                </button>
              ))}
            </div>
          </div>

          {/* Render Button */}
          <button
            onClick={startRendering}
            disabled={isRendering}
            className={clsx(
              "w-full py-3 rounded-xl text-sm font-semibold transition-all min-h-[48px]",
              isRendering
                ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm"
            )}
          >
            {isRendering ? "渲染中..." : "🚀 開始 AI 渲染"}
          </button>

          {/* Progress Bar */}
          {(isRendering || progress >= 100) && (
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700">渲染進度</span>
                <span className="text-sm font-bold text-indigo-600">{Math.min(100, Math.round(progress))}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3">
                <div
                  className={clsx(
                    "h-3 rounded-full transition-all duration-500",
                    progress >= 100 ? "bg-emerald-500" : "bg-indigo-500"
                  )}
                  style={{ width: `${Math.min(100, progress)}%` }}
                />
              </div>
              {progress >= 100 && (
                <p className="text-xs text-emerald-600 mt-2 font-medium">✓ 渲染完成！</p>
              )}
            </div>
          )}
        </div>

        {/* Preview Area */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-slate-700">預覽</h2>
              <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
                <button
                  onClick={() => setShowBefore(true)}
                  className={clsx("px-3 py-1 rounded-md text-xs font-medium", showBefore ? "bg-white shadow-sm text-slate-900" : "text-slate-500")}
                >
                  原圖
                </button>
                <button
                  onClick={() => setShowBefore(false)}
                  className={clsx("px-3 py-1 rounded-md text-xs font-medium", !showBefore ? "bg-white shadow-sm text-slate-900" : "text-slate-500")}
                >
                  渲染圖
                </button>
              </div>
            </div>
            <div className={clsx(
              "aspect-video rounded-xl flex items-center justify-center",
              showBefore
                ? "bg-gradient-to-br from-slate-200 to-slate-300"
                : "bg-gradient-to-br from-indigo-200 to-violet-300"
            )}>
              <div className="text-center">
                <span className="text-5xl block mb-2">{showBefore ? "📐" : "🏠"}</span>
                <p className="text-sm text-slate-500">{showBefore ? "平面圖 / 原始照片" : `${selectedStyle} · ${selectedRoom}`}</p>
              </div>
            </div>
          </div>

          {/* Gallery */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h2 className="text-sm font-semibold text-slate-700 mb-3">歷史渲染記錄</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {mockGallery.map((item) => (
                <div key={item.id} className="group cursor-pointer">
                  <div className={clsx("aspect-video rounded-lg bg-gradient-to-br flex items-center justify-center relative overflow-hidden", item.gradient)}>
                    <span className="text-white/30 text-2xl">🏠</span>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <span className="text-white opacity-0 group-hover:opacity-100 text-xs font-medium transition-opacity">查看</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-700 mt-1.5 font-medium truncate">{item.name}</p>
                  <p className="text-[10px] text-slate-400">{item.style} · {item.date}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
