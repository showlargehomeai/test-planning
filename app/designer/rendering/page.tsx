"use client";

import { useState, useRef, useCallback } from "react";
import { clsx } from "clsx";

const renderStyles = [
  { name: "現代簡約", icon: "🏢", desc: "乾淨線條、中性色調" },
  { name: "北歐風", icon: "🌿", desc: "木質溫暖、自然光" },
  { name: "日式無印", icon: "🍵", desc: "極簡禪意、原木色" },
  { name: "工業風", icon: "🏭", desc: "水泥裸牆、金屬元素" },
  { name: "新古典", icon: "🏛️", desc: "歐式線板、優雅奢華" },
  { name: "鄉村風", icon: "🌾", desc: "磚牆木樑、溫馨手作" },
];
const rooms = ["客廳", "臥室", "廚房", "浴室", "書房", "餐廳", "玄關", "陽台"];

const mockGallery = [
  { id: 1, name: "大安區客廳_v3", style: "現代簡約", room: "客廳", date: "2026-03-15", status: "completed" },
  { id: 2, name: "板橋主臥_v2", style: "工業風", room: "臥室", date: "2026-03-14", status: "completed" },
  { id: 3, name: "信義區廚房_v1", style: "北歐風", room: "廚房", date: "2026-03-13", status: "completed" },
  { id: 4, name: "中山書房_v4", style: "新古典", room: "書房", date: "2026-03-12", status: "completed" },
  { id: 5, name: "西屯浴室_v1", style: "日式無印", room: "浴室", date: "2026-03-11", status: "completed" },
  { id: 6, name: "左營餐廳_v2", style: "鄉村風", room: "餐廳", date: "2026-03-10", status: "completed" },
];

const renderOptionGroups = [
  { label: "解析度", options: ["1024×1024", "1536×1024", "2048×2048"], default: "1536×1024" },
  { label: "渲染強度", options: ["輕微調整", "中度改造", "完全重設計"], default: "中度改造" },
];

// 根據風格產生不同的模擬色彩
const styleGradients: Record<string, string> = {
  "現代簡約": "from-slate-300 via-gray-200 to-slate-400",
  "北歐風": "from-amber-100 via-sky-100 to-emerald-100",
  "日式無印": "from-amber-200 via-orange-100 to-stone-200",
  "工業風": "from-gray-400 via-stone-500 to-zinc-600",
  "新古典": "from-amber-200 via-yellow-100 to-violet-200",
  "鄉村風": "from-green-200 via-amber-100 to-orange-200",
};

// 模擬渲染結果圖（Unsplash 室內設計照片）
const renderResultImages: Record<string, Record<string, string>> = {
  "現代簡約": {
    "客廳": "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80",
    "臥室": "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&q=80",
    "廚房": "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80",
    "浴室": "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=80",
    "書房": "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80",
    "餐廳": "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800&q=80",
    "玄關": "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
    "陽台": "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80",
  },
  "北歐風": {
    "客廳": "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80",
    "臥室": "https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?w=800&q=80",
    "廚房": "https://images.unsplash.com/photo-1556909114-44e3e70034e2?w=800&q=80",
    "浴室": "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&q=80",
    "書房": "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80",
    "餐廳": "https://images.unsplash.com/photo-1615529328331-f8917597711f?w=800&q=80",
    "玄關": "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
    "陽台": "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&q=80",
  },
  "日式無印": {
    "客廳": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
    "臥室": "https://images.unsplash.com/photo-1615529182904-14819c35db37?w=800&q=80",
    "廚房": "https://images.unsplash.com/photo-1600489000022-c2086d79f9d4?w=800&q=80",
    "浴室": "https://images.unsplash.com/photo-1600566752229-250ed79470f8?w=800&q=80",
    "書房": "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80",
    "餐廳": "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800&q=80",
    "玄關": "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
    "陽台": "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80",
  },
  "工業風": {
    "客廳": "https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800&q=80",
    "臥室": "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=800&q=80",
    "廚房": "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80",
    "浴室": "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=80",
    "書房": "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80",
    "餐廳": "https://images.unsplash.com/photo-1615529328331-f8917597711f?w=800&q=80",
    "玄關": "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
    "陽台": "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80",
  },
  "新古典": {
    "客廳": "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
    "臥室": "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&q=80",
    "廚房": "https://images.unsplash.com/photo-1556909114-44e3e70034e2?w=800&q=80",
    "浴室": "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&q=80",
    "書房": "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80",
    "餐廳": "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800&q=80",
    "玄關": "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
    "陽台": "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&q=80",
  },
  "鄉村風": {
    "客廳": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
    "臥室": "https://images.unsplash.com/photo-1615529182904-14819c35db37?w=800&q=80",
    "廚房": "https://images.unsplash.com/photo-1600489000022-c2086d79f9d4?w=800&q=80",
    "浴室": "https://images.unsplash.com/photo-1600566752229-250ed79470f8?w=800&q=80",
    "書房": "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80",
    "餐廳": "https://images.unsplash.com/photo-1615529328331-f8917597711f?w=800&q=80",
    "玄關": "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
    "陽台": "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80",
  },
};

// 原始空間照片（before）
const beforeImages: Record<string, string> = {
  "客廳": "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
  "臥室": "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=800&q=80",
  "廚房": "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=60",
  "浴室": "https://images.unsplash.com/photo-1564540586988-aa4e53c3d799?w=800&q=80",
  "書房": "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80",
  "餐廳": "https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?w=800&q=80",
  "玄關": "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&q=80",
  "陽台": "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=60",
};

export default function RenderingPage() {
  const [selectedStyle, setSelectedStyle] = useState("現代簡約");
  const [selectedRoom, setSelectedRoom] = useState("客廳");
  const [isRendering, setIsRendering] = useState(false);
  const [progress, setProgress] = useState(0);
  const [renderPhase, setRenderPhase] = useState("");
  const [showBefore, setShowBefore] = useState(true);
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: string } | null>(null);
  const [renderCompleted, setRenderCompleted] = useState(false);
  const [resolution, setResolution] = useState("1536×1024");
  const [strength, setStrength] = useState("中度改造");
  const [gallery, setGallery] = useState(mockGallery);
  const [toast, setToast] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [prompt, setPrompt] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const sizeKB = (file.size / 1024).toFixed(0);
      const sizeMB = (file.size / 1024 / 1024).toFixed(1);
      setUploadedFile({
        name: file.name,
        size: file.size > 1024 * 1024 ? `${sizeMB} MB` : `${sizeKB} KB`,
      });
      setRenderCompleted(false);
      setProgress(0);
      setToast(`✅ 已上傳：${file.name}`);
      setTimeout(() => setToast(null), 2000);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && (file.type.startsWith("image/") || file.type === "application/pdf")) {
      const sizeMB = (file.size / 1024 / 1024).toFixed(1);
      setUploadedFile({ name: file.name, size: `${sizeMB} MB` });
      setRenderCompleted(false);
      setProgress(0);
      setToast(`✅ 已上傳：${file.name}`);
      setTimeout(() => setToast(null), 2000);
    }
  }, []);

  const phases = [
    { at: 5, text: "🔍 分析空間結構..." },
    { at: 20, text: "🧱 識別牆面/地板/天花板..." },
    { at: 40, text: `🎨 套用${selectedStyle}風格材質...` },
    { at: 60, text: "💡 計算光照與陰影..." },
    { at: 75, text: "🪑 擺放家具與裝飾..." },
    { at: 90, text: "✨ 後製處理與細節優化..." },
    { at: 98, text: "📦 輸出高解析度圖片..." },
  ];

  const startRendering = () => {
    if (!uploadedFile) {
      setToast("⚠️ 請先上傳圖片");
      setTimeout(() => setToast(null), 2000);
      return;
    }
    setIsRendering(true);
    setProgress(0);
    setRenderCompleted(false);
    setShowBefore(true);
    setRenderPhase(phases[0].text);

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 2 + Math.random() * 5;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
        setIsRendering(false);
        setRenderCompleted(true);
        setShowBefore(false);
        setRenderPhase("✅ 渲染完成！");

        // 加入 gallery
        const newItem = {
          id: Date.now(),
          name: `${selectedRoom}_${selectedStyle}_v1`,
          style: selectedStyle,
          room: selectedRoom,
          date: new Date().toISOString().split("T")[0],
          status: "completed",
        };
        setGallery(prev => [newItem, ...prev]);
      }

      setProgress(currentProgress);
      // 更新階段文字
      for (let i = phases.length - 1; i >= 0; i--) {
        if (currentProgress >= phases[i].at) {
          setRenderPhase(phases[i].text);
          break;
        }
      }
    }, 300);
  };

  const handleDownload = () => {
    setToast("📥 高解析度圖片已下載");
    setTimeout(() => setToast(null), 2000);
  };

  const handleShareToClient = () => {
    setToast("📤 已分享給客戶，等待回饋");
    setTimeout(() => setToast(null), 2000);
  };

  const handleReRender = () => {
    setRenderCompleted(false);
    setProgress(0);
    startRendering();
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium animate-pulse">
          {toast}
        </div>
      )}

      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">🎨 3D/AI 快速渲染出圖</h1>
        <p className="text-sm text-slate-500 mt-1">上傳平面圖或照片，AI 自動生成 3D 效果圖</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500">本月渲染數</p>
          <p className="text-2xl font-bold text-indigo-600">{24 + gallery.length - mockGallery.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500">平均渲染時間</p>
          <p className="text-2xl font-bold text-emerald-600">45s</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500">剩餘配額</p>
          <p className="text-2xl font-bold text-amber-600">{76 - (gallery.length - mockGallery.length)}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500">客戶滿意度</p>
          <p className="text-2xl font-bold text-violet-600">94%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Upload & Settings */}
        <div className="space-y-4">
          {/* Upload Area */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h2 className="text-sm font-semibold text-slate-700 mb-3">📤 上傳圖片</h2>
            <input ref={fileInputRef} type="file" accept="image/*,.pdf" className="hidden" onChange={handleFileUpload} />
            {!uploadedFile ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={e => e.preventDefault()}
                onDrop={handleDrop}
                className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-indigo-400 hover:bg-indigo-50/30 transition-all cursor-pointer"
              >
                <div className="text-4xl mb-2">📤</div>
                <p className="text-sm text-slate-600 font-medium">拖曳檔案至此或點擊上傳</p>
                <p className="text-xs text-slate-400 mt-1">支援 JPG, PNG, PDF 格式，最大 20MB</p>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-4 bg-indigo-50 rounded-xl border border-indigo-200">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center text-xl">🖼️</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">{uploadedFile.name}</p>
                  <p className="text-xs text-slate-500">{uploadedFile.size}</p>
                </div>
                <button onClick={() => { setUploadedFile(null); setRenderCompleted(false); setProgress(0); }} className="text-xs text-red-500 hover:text-red-700 px-2 py-1 rounded hover:bg-red-50">移除</button>
                <button onClick={() => fileInputRef.current?.click()} className="text-xs text-indigo-600 hover:text-indigo-800 px-2 py-1 rounded hover:bg-indigo-100">換圖</button>
              </div>
            )}
          </div>

          {/* Style Selector */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h2 className="text-sm font-semibold text-slate-700 mb-3">🎨 渲染風格</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {renderStyles.map((style) => (
                <button
                  key={style.name}
                  onClick={() => setSelectedStyle(style.name)}
                  className={clsx(
                    "py-2.5 px-3 rounded-lg text-left transition-all border",
                    selectedStyle === style.name
                      ? "bg-indigo-50 border-indigo-300 ring-2 ring-indigo-200"
                      : "bg-slate-50 border-slate-200 hover:border-slate-300"
                  )}
                >
                  <span className="text-lg">{style.icon}</span>
                  <p className={clsx("text-sm font-medium mt-0.5", selectedStyle === style.name ? "text-indigo-700" : "text-slate-700")}>{style.name}</p>
                  <p className="text-[10px] text-slate-400">{style.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Room Selector */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h2 className="text-sm font-semibold text-slate-700 mb-3">🏠 空間類型</h2>
            <div className="grid grid-cols-4 gap-2">
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

          {/* Advanced Options */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <button onClick={() => setShowAdvanced(!showAdvanced)} className="flex items-center justify-between w-full">
              <h2 className="text-sm font-semibold text-slate-700">⚙️ 進階設定</h2>
              <span className="text-slate-400 text-sm">{showAdvanced ? "▲" : "▼"}</span>
            </button>
            {showAdvanced && (
              <div className="mt-3 space-y-3">
                {/* Resolution */}
                <div>
                  <label className="text-xs text-slate-500 mb-1.5 block">輸出解析度</label>
                  <div className="flex gap-1.5">
                    {renderOptionGroups[0].options.map(opt => (
                      <button key={opt} onClick={() => setResolution(opt)} className={clsx(
                        "flex-1 px-2 py-1.5 rounded-lg text-xs font-medium border transition-all",
                        resolution === opt ? "bg-indigo-50 text-indigo-700 border-indigo-300" : "border-slate-200 text-slate-500"
                      )}>{opt}</button>
                    ))}
                  </div>
                </div>
                {/* Strength */}
                <div>
                  <label className="text-xs text-slate-500 mb-1.5 block">渲染強度</label>
                  <div className="flex gap-1.5">
                    {renderOptionGroups[1].options.map(opt => (
                      <button key={opt} onClick={() => setStrength(opt)} className={clsx(
                        "flex-1 px-2 py-1.5 rounded-lg text-xs font-medium border transition-all",
                        strength === opt ? "bg-indigo-50 text-indigo-700 border-indigo-300" : "border-slate-200 text-slate-500"
                      )}>{opt}</button>
                    ))}
                  </div>
                </div>
                {/* Prompt */}
                <div>
                  <label className="text-xs text-slate-500 mb-1.5 block">自訂描述（選填）</label>
                  <textarea
                    value={prompt}
                    onChange={e => setPrompt(e.target.value)}
                    rows={2}
                    placeholder="例如：白色大理石地板、落地窗自然光、深色木質家具..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Render Button */}
          <button
            onClick={startRendering}
            disabled={isRendering}
            className={clsx(
              "w-full py-3.5 rounded-xl text-sm font-semibold transition-all min-h-[48px]",
              isRendering
                ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                : uploadedFile
                  ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg"
                  : "bg-slate-300 text-slate-500 cursor-not-allowed"
            )}
          >
            {isRendering ? `⏳ ${renderPhase}` : uploadedFile ? "🚀 開始 AI 渲染" : "📤 請先上傳圖片"}
          </button>

          {/* Progress Bar */}
          {(isRendering || renderCompleted) && (
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700">{renderPhase}</span>
                <span className="text-sm font-bold text-indigo-600">{Math.min(100, Math.round(progress))}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3">
                <div
                  className={clsx(
                    "h-3 rounded-full transition-all duration-300",
                    renderCompleted ? "bg-emerald-500" : "bg-indigo-500"
                  )}
                  style={{ width: `${Math.min(100, progress)}%` }}
                />
              </div>
              {renderCompleted && (
                <div className="flex gap-2 mt-3">
                  <button onClick={handleDownload} className="flex-1 px-3 py-2 text-xs font-medium rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors">📥 下載高解析圖</button>
                  <button onClick={handleShareToClient} className="flex-1 px-3 py-2 text-xs font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors">📤 分享給客戶</button>
                  <button onClick={handleReRender} className="px-3 py-2 text-xs font-medium rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50 transition-colors">🔄 重新渲染</button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: Preview & Gallery */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-slate-700">👁️ 預覽</h2>
              <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
                <button
                  onClick={() => setShowBefore(true)}
                  className={clsx("px-3 py-1 rounded-md text-xs font-medium transition-colors", showBefore ? "bg-white shadow-sm text-slate-900" : "text-slate-500")}
                >
                  原圖
                </button>
                <button
                  onClick={() => setShowBefore(false)}
                  className={clsx("px-3 py-1 rounded-md text-xs font-medium transition-colors", !showBefore ? "bg-white shadow-sm text-slate-900" : "text-slate-500")}
                >
                  渲染圖
                </button>
              </div>
            </div>
            <div className="aspect-video rounded-xl relative overflow-hidden transition-all duration-500 bg-slate-200">
              {showBefore ? (
                uploadedFile ? (
                  /* 上傳後顯示模擬原圖 */
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={beforeImages[selectedRoom] || beforeImages["客廳"]} alt="原始空間" className="w-full h-full object-cover" />
                    <div className="absolute top-2 left-2 bg-black/50 text-white text-[10px] px-2 py-1 rounded-full">📐 原圖</div>
                    <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2.5 py-1 rounded-lg">{uploadedFile.name}</div>
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-200 to-slate-300">
                    <div className="text-center">
                      <span className="text-5xl block mb-2">📐</span>
                      <p className="text-sm text-slate-500">尚未上傳圖片</p>
                    </div>
                  </div>
                )
              ) : renderCompleted ? (
                /* 渲染完成：顯示對應風格+空間的模擬渲染圖 */
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={renderResultImages[selectedStyle]?.[selectedRoom] || renderResultImages["現代簡約"]["客廳"]} alt={`${selectedStyle} ${selectedRoom} 渲染圖`} className="w-full h-full object-cover" />
                  <div className="absolute top-2 left-2 bg-emerald-600 text-white text-[10px] px-2 py-1 rounded-full">✨ AI 渲染</div>
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                    <p className="text-white text-sm font-medium">{selectedStyle} · {selectedRoom}</p>
                    <p className="text-white/70 text-xs">{resolution} · {strength}</p>
                    {prompt && <p className="text-white/50 text-[10px] mt-0.5">「{prompt}」</p>}
                  </div>
                </>
              ) : isRendering ? (
                /* 渲染中：漸進式顯示 */
                <div className="w-full h-full relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={renderResultImages[selectedStyle]?.[selectedRoom] || renderResultImages["現代簡約"]["客廳"]} alt="渲染中" className="w-full h-full object-cover transition-all duration-1000" style={{ opacity: Math.min(progress / 100, 0.9), filter: `blur(${Math.max(0, 10 - progress / 10)}px)` }} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-black/60 backdrop-blur-sm rounded-2xl px-6 py-4 text-center">
                      <div className="w-10 h-10 border-3 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-2" />
                      <p className="text-white text-sm font-medium">{renderPhase}</p>
                      <p className="text-white/60 text-xs mt-1">{Math.min(100, Math.round(progress))}%</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-200 to-slate-300">
                  <div className="text-center">
                    <span className="text-5xl block mb-2">🎨</span>
                    <p className="text-sm text-slate-400">渲染結果將顯示在此</p>
                  </div>
                </div>
              )}
            </div>

            {/* Render settings summary */}
            {(renderCompleted || isRendering) && (
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="text-[10px] px-2 py-1 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-200">{selectedStyle}</span>
                <span className="text-[10px] px-2 py-1 rounded-full bg-slate-50 text-slate-600 border border-slate-200">{selectedRoom}</span>
                <span className="text-[10px] px-2 py-1 rounded-full bg-slate-50 text-slate-600 border border-slate-200">{resolution}</span>
                <span className="text-[10px] px-2 py-1 rounded-full bg-slate-50 text-slate-600 border border-slate-200">{strength}</span>
              </div>
            )}
          </div>

          {/* Gallery */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-slate-700">📂 歷史渲染記錄</h2>
              <span className="text-xs text-slate-400">{gallery.length} 筆</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {gallery.slice(0, 9).map((item) => {
                const imgUrl = renderResultImages[item.style]?.[item.room] || renderResultImages["現代簡約"]["客廳"];
                return (
                  <div key={item.id} className="group cursor-pointer">
                    <div className="aspect-video rounded-lg relative overflow-hidden bg-slate-200">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={imgUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                        <span className="text-white opacity-0 group-hover:opacity-100 text-xs font-medium transition-opacity bg-black/40 px-3 py-1.5 rounded-full">查看大圖</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-700 mt-1.5 font-medium truncate">{item.name}</p>
                    <p className="text-[10px] text-slate-400">{item.style} · {item.date}</p>
                  </div>
                );
              })}
            </div>
            {gallery.length > 9 && (
              <button className="w-full mt-3 py-2 text-xs text-indigo-600 font-medium hover:bg-indigo-50 rounded-lg transition-colors">
                查看全部 {gallery.length} 筆記錄 →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
