"use client";

import { useState, useEffect, useRef } from "react";

interface Metrics {
  activeUsers: number;
  onlineDesigners: number;
  onlineWorkers: number;
  onlineVendors: number;
  requestsPerMin: number;
  avgResponseMs: number;
}

function jitter(base: number, range: number) {
  return Math.max(0, base + Math.round((Math.random() - 0.5) * 2 * range));
}

export default function RealtimeMetrics() {
  const [metrics, setMetrics] = useState<Metrics>({
    activeUsers: 1247,
    onlineDesigners: 89,
    onlineWorkers: 156,
    onlineVendors: 63,
    requestsPerMin: 342,
    avgResponseMs: 128,
  });
  const [sparkData, setSparkData] = useState<number[]>(() =>
    Array.from({ length: 30 }, () => jitter(1247, 80))
  );
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) => ({
        activeUsers: jitter(prev.activeUsers, 15),
        onlineDesigners: jitter(prev.onlineDesigners, 5),
        onlineWorkers: jitter(prev.onlineWorkers, 8),
        onlineVendors: jitter(prev.onlineVendors, 4),
        requestsPerMin: jitter(prev.requestsPerMin, 20),
        avgResponseMs: jitter(prev.avgResponseMs, 12),
      }));
      setSparkData((prev) => {
        const next = [...prev.slice(1), jitter(prev[prev.length - 1], 30)];
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Draw sparkline on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const min = Math.min(...sparkData);
    const max = Math.max(...sparkData);
    const range = max - min || 1;

    // Gradient fill
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, "rgba(99,102,241,0.2)");
    grad.addColorStop(1, "rgba(99,102,241,0)");

    ctx.beginPath();
    sparkData.forEach((v, i) => {
      const x = (i / (sparkData.length - 1)) * w;
      const y = h - ((v - min) / range) * (h - 4) - 2;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = "#6366f1";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Fill area
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();
  }, [sparkData]);

  const cards: { label: string; value: number; icon: string; color: string }[] =
    [
      {
        label: "活躍用戶",
        value: metrics.activeUsers,
        icon: "👥",
        color: "text-indigo-600",
      },
      {
        label: "在線設計師",
        value: metrics.onlineDesigners,
        icon: "🎨",
        color: "text-violet-600",
      },
      {
        label: "在線工班",
        value: metrics.onlineWorkers,
        icon: "🔧",
        color: "text-emerald-600",
      },
      {
        label: "在線建材商",
        value: metrics.onlineVendors,
        icon: "🏗️",
        color: "text-amber-600",
      },
    ];

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-100 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-slate-700">即時監控</h2>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-[10px] text-slate-400">每秒更新</span>
        </div>
        <span className="text-xs px-2 py-0.5 rounded bg-amber-100 text-amber-700 font-semibold tracking-wide">
          MOCK
        </span>
      </div>

      {/* Realtime cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {cards.map((c) => (
          <div
            key={c.label}
            className="p-2.5 rounded-xl bg-slate-50/50 border border-slate-100"
          >
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-sm">{c.icon}</span>
              <p className="text-[10px] text-slate-400">{c.label}</p>
            </div>
            <p className={`text-lg font-bold tabular-nums ${c.color}`}>
              {c.value.toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      {/* Sparkline + system metrics */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 p-3 rounded-xl bg-slate-50/50 border border-slate-100">
          <p className="text-[10px] text-slate-400 mb-1">
            活躍用戶趨勢（過去 30 秒）
          </p>
          <canvas
            ref={canvasRef}
            width={300}
            height={60}
            className="w-full h-[60px]"
          />
        </div>
        <div className="flex flex-row sm:flex-col gap-2 sm:w-36">
          <div className="flex-1 p-2.5 rounded-xl bg-slate-50/50 border border-slate-100">
            <p className="text-[10px] text-slate-400">請求/分鐘</p>
            <p className="text-base font-bold text-slate-700 tabular-nums">
              {metrics.requestsPerMin}
            </p>
          </div>
          <div className="flex-1 p-2.5 rounded-xl bg-slate-50/50 border border-slate-100">
            <p className="text-[10px] text-slate-400">平均回應</p>
            <p className="text-base font-bold text-slate-700 tabular-nums">
              {metrics.avgResponseMs}
              <span className="text-[10px] text-slate-400 ml-0.5">ms</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
