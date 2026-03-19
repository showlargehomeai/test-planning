export default function DashboardLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Header skeleton */}
      <div className="space-y-2">
        <div className="h-7 bg-slate-200 rounded-lg w-32 animate-pulse" />
        <div className="h-4 bg-slate-100 rounded w-56 animate-pulse" />
      </div>

      {/* OKR Bar skeleton */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-slate-100 animate-pulse">
        <div className="h-5 bg-slate-100 rounded w-48 mb-4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-slate-50 rounded-xl" />
          ))}
        </div>
      </div>

      {/* Bottom grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Team */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 animate-pulse">
          <div className="h-5 bg-slate-100 rounded w-24 mb-3" />
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-slate-50 rounded-xl" />
            ))}
          </div>
        </div>

        {/* BD */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 animate-pulse">
          <div className="h-5 bg-slate-100 rounded w-24 mb-3" />
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-8 bg-slate-50 rounded-lg" />
            ))}
          </div>
        </div>

        {/* User Growth */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 lg:col-span-2 animate-pulse">
          <div className="h-5 bg-slate-100 rounded w-32 mb-3" />
          <div className="grid grid-cols-4 gap-2 mb-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-14 bg-slate-50 rounded-xl" />
            ))}
          </div>
          <div className="h-48 bg-slate-50 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
