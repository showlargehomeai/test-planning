"use client";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex items-center justify-center h-full px-4">
      <div className="max-w-md w-full bg-white rounded-2xl p-8 shadow-sm border border-rose-100 text-center">
        <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-6 h-6 text-rose-500"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
            />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-slate-900 mb-2">
          戰情室載入失敗
        </h2>
        <p className="text-sm text-slate-500 mb-4">
          {error.message || "發生未預期的錯誤，請稍後再試。"}
        </p>
        <button
          onClick={reset}
          className="px-4 py-2 rounded-xl text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
        >
          重試
        </button>
      </div>
    </div>
  );
}
