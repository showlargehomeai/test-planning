export default function BDLoading() {
  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Header skeleton */}
      <div>
        <div className="h-7 bg-slate-200 rounded w-40 animate-pulse" />
        <div className="h-4 bg-slate-100 rounded w-56 mt-2 animate-pulse" />
      </div>

      {/* Stats skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl p-3 border border-slate-100 animate-pulse"
          >
            <div className="h-3 bg-slate-100 rounded w-12 mb-2" />
            <div className="h-6 bg-slate-200 rounded w-10" />
          </div>
        ))}
      </div>

      {/* Filter bar skeleton */}
      <div className="flex gap-2">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-8 bg-slate-100 rounded-full w-20 animate-pulse"
          />
        ))}
      </div>

      {/* Kanban columns skeleton */}
      <div className="flex gap-4 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="min-w-[240px] flex-1">
            <div className="h-10 bg-slate-100 rounded-lg animate-pulse mb-3" />
            <div className="space-y-3">
              {[...Array(2)].map((_, j) => (
                <div
                  key={j}
                  className="h-36 bg-slate-50 rounded-xl animate-pulse border border-slate-100"
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Scorecard skeleton */}
      <div className="bg-white rounded-2xl p-5 border border-slate-100 animate-pulse">
        <div className="h-5 bg-slate-100 rounded w-28 mb-4" />
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-12 bg-slate-50 rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}
