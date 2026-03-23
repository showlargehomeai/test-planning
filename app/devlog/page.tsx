import { readFileSync } from "fs";
import path from "path";

interface DevlogEntry {
  id: string;
  date: string;
  feature: string;
  page: string;
  status: string;
  what: string;
  backend_table: string;
  backend_api: string;
  backend_gap: string;
  roles: string;
  conflict: string;
  next_step: string;
}

export const metadata = {
  title: "Dev Log — LargeHome",
  description: "開發紀錄：功能、後端對應、串接計畫",
};

export default function DevlogPage() {
  let entries: DevlogEntry[] = [];
  try {
    const raw = readFileSync(path.join(process.cwd(), "content/devlog/entries.json"), "utf-8");
    entries = JSON.parse(raw);
  } catch {
    entries = [];
  }

  const mockCount = entries.filter(e => e.status === "mock").length;
  const doneCount = entries.filter(e => e.status === "done").length;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Dev Log</h1>
        <p className="text-slate-500 text-sm mt-1">功能開發紀錄 · 後端對應 · 串接計畫</p>
        <div className="flex gap-2 mt-3">
          <span className="text-xs px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 font-medium">{mockCount} Mock</span>
          <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 font-medium">{doneCount} Done</span>
          <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-500">{entries.length} total</span>
        </div>
      </div>

      {/* Entries */}
      <div className="space-y-4">
        {entries.map((e) => (
          <div key={e.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-sm transition-shadow">
            {/* Title bar */}
            <div className="px-5 py-3 border-b border-slate-100 flex items-center gap-3">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${e.status === "mock" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"}`}>
                {e.status === "mock" ? "MOCK" : "DONE"}
              </span>
              <span className="font-semibold text-slate-900 text-sm">{e.feature}</span>
              <code className="text-[10px] text-slate-400 ml-auto">{e.page}</code>
              <span className="text-[10px] text-slate-400">{e.date}</span>
            </div>

            {/* Content - compact table */}
            <div className="px-5 py-3 text-xs space-y-2">
              <p className="text-slate-600">{e.what}</p>
              
              <div className="grid grid-cols-[80px_1fr] gap-x-3 gap-y-1.5 pt-2 border-t border-slate-50">
                <span className="text-slate-400 font-medium">後端 Table</span>
                <span className={e.backend_table.includes("無") ? "text-red-500" : "text-slate-700"}>{e.backend_table}</span>
                
                <span className="text-slate-400 font-medium">後端 API</span>
                <span className={e.backend_api.includes("無") ? "text-red-500" : "text-slate-700"}>{e.backend_api}</span>
                
                <span className="text-slate-400 font-medium">Gap</span>
                <span className="text-amber-700">{e.backend_gap}</span>
                
                <span className="text-slate-400 font-medium">角色</span>
                <span className="text-slate-600">{e.roles}</span>
                
                <span className="text-slate-400 font-medium">衝突</span>
                <span className={e.conflict.startsWith("無") ? "text-emerald-600" : "text-red-600"}>{e.conflict}</span>
                
                <span className="text-slate-400 font-medium">下一步</span>
                <span className="text-indigo-600 font-medium">{e.next_step}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
