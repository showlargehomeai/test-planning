import ChangelogTimeline from "./_components/ChangelogTimeline";

export default function ChangeLogPage() {
  return (
    <div className="min-h-full bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
            📋 更新日誌
          </h1>
          <p className="text-sm text-slate-500">
            追蹤每個版本的變更紀錄、商業目標與技術備註
          </p>
        </div>

        <ChangelogTimeline />
      </div>
    </div>
  );
}
