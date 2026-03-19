export default function AnalyticsLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Header skeleton */}
      <div className="space-y-2">
        <div className="h-7 bg-slate-200 rounded-lg w-32 animate-pulse" />
        <div className="h-4 bg-slate-100 rounded w-56 animate-pulse" />
      </div>

      {/* KPI Row skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 animate-pulse"
          >
            <div className="h-4 bg-slate-100 rounded w-16 mb-3" />
            <div className="h-8 bg-slate-100 rounded w-24" />
          </div>
        ))}
      </div>

      {/* User Growth skeleton */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 animate-pulse">
        <div className="h-5 bg-slate-100 rounded w-32 mb-3" />
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-14 bg-slate-50 rounded-xl" />
          ))}
        </div>
        <div className="h-48 bg-slate-50 rounded-xl" />
      </div>

      {/* Retention Chart skeleton */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 animate-pulse">
        <div className="h-5 bg-slate-100 rounded w-32 mb-3" />
        <div className="h-64 bg-slate-50 rounded-xl" />
      </div>
    </div>
  );
}
