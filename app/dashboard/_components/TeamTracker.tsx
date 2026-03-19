"use client";

import { useState, useEffect } from "react";

interface TeamData {
  id: string;
  name: string;
  lead: string;
  goal: string;
  progress: number;
  status: "on-track" | "at-risk" | "behind";
  milestones: { label: string; done: boolean }[];
}

const statusConfig = {
  "on-track": { dot: "bg-emerald-500", text: "text-emerald-700", bg: "bg-emerald-50" },
  "at-risk": { dot: "bg-amber-500", text: "text-amber-700", bg: "bg-amber-50" },
  behind: { dot: "bg-rose-500", text: "text-rose-700", bg: "bg-rose-50" },
} as const;

export default function TeamTracker() {
  const [teams, setTeams] = useState<TeamData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/dashboard/team")
      .then((res) => {
        if (!res.ok) throw new Error("API error");
        return res.json();
      })
      .then((json) => {
        setTeams(Array.isArray(json) ? json : []);
        setError(null);
      })
      .catch(() => setError("無法載入團隊資料"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-100 space-y-3">
        <div className="h-5 bg-slate-100 rounded w-24 animate-pulse" />
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-20 bg-slate-50 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-rose-100 text-center">
        <p className="text-rose-500 text-sm">{error}</p>
      </div>
    );
  }

  if (teams.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 text-center">
        <p className="text-slate-400 text-sm">尚無團隊資料</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-100">
      <h2 className="text-sm font-semibold text-slate-700 mb-3">團隊進度</h2>
      <div className="space-y-3">
        {teams.map((team) => {
          const style = statusConfig[team.status];
          return (
            <div
              key={team.id}
              className="p-3 rounded-xl bg-slate-50/50 border border-slate-100"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-slate-800">
                    {team.name}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium ${style.bg} ${style.text}`}
                  >
                    <span className={`w-1 h-1 rounded-full ${style.dot}`} />
                    {team.status === "on-track"
                      ? "正常"
                      : team.status === "at-risk"
                        ? "注意"
                        : "落後"}
                  </span>
                </div>
                <span className="text-xs text-slate-400">{team.lead}</span>
              </div>

              <p className="text-xs text-slate-500 mb-2 truncate">
                {team.goal}
              </p>

              {/* Progress bar */}
              <div className="flex items-center gap-2 mb-2">
                <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      team.progress >= 70
                        ? "bg-emerald-500"
                        : team.progress >= 40
                          ? "bg-amber-500"
                          : "bg-rose-500"
                    }`}
                    style={{ width: `${team.progress}%` }}
                  />
                </div>
                <span className="text-xs font-medium text-slate-500 w-8 text-right">
                  {team.progress}%
                </span>
              </div>

              {/* Milestones */}
              <div className="flex gap-1.5 flex-wrap">
                {team.milestones.map((m, i) => (
                  <span
                    key={i}
                    className={`text-[10px] px-1.5 py-0.5 rounded ${
                      m.done
                        ? "bg-emerald-50 text-emerald-600 line-through"
                        : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    {m.label}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
