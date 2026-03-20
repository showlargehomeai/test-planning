import { Suspense } from "react";
import StrategicAudit from "../_components/StrategicAudit";

function AuditSkeleton() {
  return (
    <div className="space-y-6">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 animate-pulse"
        >
          <div className="h-6 bg-slate-100 rounded w-48 mb-4" />
          <div className="space-y-3">
            <div className="h-16 bg-slate-50 rounded-xl" />
            <div className="h-32 bg-slate-50 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function AuditPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      <Suspense fallback={<AuditSkeleton />}>
        <StrategicAudit />
      </Suspense>
    </div>
  );
}
