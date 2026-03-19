import Link from "next/link";
import BDKanban from "../_components/BDKanban";

export const metadata = {
  title: "BD 廠商管理 — TestPlanning",
  description: "廠商 Onboarding 看板",
};

export default function BDPage() {
  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            BD 廠商管理
          </h1>
          <p className="text-sm text-slate-500">
            廠商 Onboarding 看板 — Kanban View
          </p>
        </div>
        <Link
          href="/dashboard"
          className="text-sm text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          ← 返回戰情室
        </Link>
      </div>
      <BDKanban />
    </div>
  );
}
