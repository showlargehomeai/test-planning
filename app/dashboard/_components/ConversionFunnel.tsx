"use client";

const funnelData = [
  { stage: "網站訪客", value: 28500, color: "bg-indigo-500" },
  { stage: "註冊用戶", value: 4120, color: "bg-violet-500" },
  { stage: "首次媒合", value: 1856, color: "bg-blue-500" },
  { stage: "簽約合作", value: 742, color: "bg-emerald-500" },
  { stage: "完工結案", value: 386, color: "bg-amber-500" },
];

export default function ConversionFunnel() {
  const maxValue = funnelData[0].value;

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-100 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-700">轉換漏斗</h2>
        <span className="text-xs px-2 py-0.5 rounded bg-amber-100 text-amber-700 font-semibold tracking-wide">
          MOCK
        </span>
      </div>

      {/* Funnel */}
      <div className="space-y-2">
        {funnelData.map((item, idx) => {
          const widthPct = Math.max((item.value / maxValue) * 100, 12);
          const conversionRate =
            idx > 0
              ? ((item.value / funnelData[idx - 1].value) * 100).toFixed(1)
              : null;
          const overallRate =
            idx > 0
              ? ((item.value / funnelData[0].value) * 100).toFixed(1)
              : "100";

          return (
            <div key={item.stage}>
              {/* Conversion arrow */}
              {conversionRate && (
                <div className="flex items-center gap-1.5 ml-2 mb-1">
                  <svg
                    className="w-3 h-3 text-slate-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                  </svg>
                  <span className="text-[10px] font-medium text-slate-400">
                    轉換率 {conversionRate}%
                  </span>
                </div>
              )}

              {/* Bar */}
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="relative">
                    <div
                      className={`${item.color} h-10 rounded-lg flex items-center px-3 transition-all duration-500`}
                      style={{
                        width: `${widthPct}%`,
                        marginLeft: `${(100 - widthPct) / 2}%`,
                      }}
                    >
                      <span className="text-xs font-medium text-white truncate">
                        {item.stage}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="w-20 text-right shrink-0">
                  <p className="text-sm font-bold text-slate-700">
                    {item.value.toLocaleString()}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    {overallRate}%
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100">
        <div className="text-center">
          <p className="text-[10px] text-slate-400">整體轉換</p>
          <p className="text-sm font-bold text-indigo-600">
            {((funnelData[funnelData.length - 1].value / funnelData[0].value) * 100).toFixed(1)}%
          </p>
        </div>
        <div className="text-center">
          <p className="text-[10px] text-slate-400">最低環節</p>
          <p className="text-sm font-bold text-rose-600">
            {(() => {
              let min = 100;
              let minStage = "";
              for (let i = 1; i < funnelData.length; i++) {
                const rate = (funnelData[i].value / funnelData[i - 1].value) * 100;
                if (rate < min) {
                  min = rate;
                  minStage = funnelData[i].stage;
                }
              }
              return `${minStage} ${min.toFixed(0)}%`;
            })()}
          </p>
        </div>
        <div className="text-center">
          <p className="text-[10px] text-slate-400">月完工數</p>
          <p className="text-sm font-bold text-emerald-600">
            {funnelData[funnelData.length - 1].value.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
