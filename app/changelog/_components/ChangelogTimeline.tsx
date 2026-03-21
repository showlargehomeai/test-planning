"use client";

import { useState, useEffect } from "react";
import DiffViewer from "../../components/DiffViewer";

interface ChangeSummary {
  overview: string;
  changes: {
    type: "feature" | "improvement" | "breaking";
    text: string;
  }[];
  businessGoal: string;
  techNotes?: string;
}

interface VersionEntry {
  version: string;
  timestamp: string;
  description: string;
  author: string;
  files: string[];
  summary?: ChangeSummary;
}

const BADGE_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  feature: { bg: "bg-blue-50", text: "text-blue-700", label: "新功能" },
  improvement: { bg: "bg-green-50", text: "text-green-700", label: "改善" },
  breaking: { bg: "bg-red-50", text: "text-red-700", label: "重大變更" },
};

function formatDate(timestamp: string): string {
  const d = new Date(timestamp);
  return d.toLocaleDateString("zh-TW", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatTime(timestamp: string): string {
  const d = new Date(timestamp);
  return d.toLocaleTimeString("zh-TW", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ChangelogTimeline() {
  const [type, setType] = useState<"demos" | "plans" | "releases">("releases");
  const [versions, setVersions] = useState<VersionEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedDiff, setExpandedDiff] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/versions?type=${type}`)
      .then((r) => r.json())
      .then((data: VersionEntry[]) => {
        setVersions([...data].reverse());
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [type]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (versions.length === 0) {
    return (
      <div className="text-center py-20 text-slate-400">
        <p className="text-lg">尚無版本紀錄</p>
      </div>
    );
  }

  return (
    <div>
      {/* Type tabs */}
      <div className="flex gap-2 mb-8">
        <button
          onClick={() => setType("releases")}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
            type === "releases"
              ? "bg-indigo-600 text-white shadow-sm"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          🚀 平台版本
        </button>
        <button
          onClick={() => setType("demos")}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
            type === "demos"
              ? "bg-indigo-600 text-white shadow-sm"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          🎨 展示版本
        </button>
        <button
          onClick={() => setType("plans")}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
            type === "plans"
              ? "bg-indigo-600 text-white shadow-sm"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          📋 計畫版本
        </button>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-4 md:left-6 top-0 bottom-0 w-0.5 bg-slate-200" />

        <div className="space-y-8">
          {versions.map((v, idx) => {
            const isLatest = idx === 0;
            const summary = v.summary;

            return (
              <div key={v.version} className="relative pl-12 md:pl-16">
                {/* Timeline dot */}
                <div
                  className={`absolute left-2.5 md:left-4.5 top-6 w-3 h-3 rounded-full border-2 ${
                    isLatest
                      ? "bg-indigo-600 border-indigo-600"
                      : "bg-white border-slate-300"
                  }`}
                />

                {/* Card */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  {/* Card header */}
                  <div className="p-5 md:p-6">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <span className="font-mono text-sm font-bold bg-slate-100 text-slate-800 px-3 py-1 rounded-lg">
                        {v.version}
                      </span>
                      {isLatest && (
                        <span className="text-xs font-medium bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full">
                          最新版本
                        </span>
                      )}
                      <span className="text-xs text-slate-500">
                        {formatDate(v.timestamp)} {formatTime(v.timestamp)}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        {v.author}
                      </span>
                    </div>

                    <h3 className="text-base md:text-lg font-semibold text-slate-900 mb-2">
                      {v.description}
                    </h3>

                    {summary && (
                      <>
                        {/* Overview */}
                        <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                          {summary.overview}
                        </p>

                        {/* Changes list */}
                        <div className="space-y-2 mb-4">
                          {summary.changes.map((change, ci) => {
                            const badge = BADGE_STYLES[change.type] || BADGE_STYLES.feature;
                            return (
                              <div key={ci} className="flex items-start gap-2">
                                <span
                                  className={`shrink-0 text-xs font-medium px-2 py-0.5 rounded ${badge.bg} ${badge.text}`}
                                >
                                  {badge.label}
                                </span>
                                <span className="text-sm text-slate-700 leading-relaxed">
                                  {change.text}
                                </span>
                              </div>
                            );
                          })}
                        </div>

                        {/* Business goal */}
                        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-3">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-amber-600 text-sm">🎯</span>
                            <span className="text-xs font-semibold text-amber-800">
                              商業目標
                            </span>
                          </div>
                          <p className="text-sm text-amber-900 leading-relaxed">
                            {summary.businessGoal}
                          </p>
                        </div>

                        {/* Tech notes */}
                        {summary.techNotes && (
                          <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-slate-500 text-sm">⚙️</span>
                              <span className="text-xs font-semibold text-slate-600">
                                技術備註
                              </span>
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed">
                              {summary.techNotes}
                            </p>
                          </div>
                        )}
                      </>
                    )}

                    {!summary && (
                      <p className="text-sm text-slate-400 italic">
                        此版本尚無變更摘要
                      </p>
                    )}
                  </div>

                  {/* Diff toggle */}
                  {idx < versions.length - 1 && (
                    <div className="border-t border-slate-100 px-5 md:px-6 py-3">
                      <button
                        onClick={() =>
                          setExpandedDiff(
                            expandedDiff === v.version ? null : v.version
                          )
                        }
                        className="flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-indigo-600 transition-colors"
                      >
                        <svg
                          className={`w-4 h-4 transition-transform ${
                            expandedDiff === v.version ? "rotate-90" : ""
                          }`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                        {expandedDiff === v.version
                          ? "收起原始碼差異"
                          : "查看原始碼差異"}
                      </button>
                    </div>
                  )}

                  {/* Inline DiffViewer */}
                  {expandedDiff === v.version && idx < versions.length - 1 && (
                    <div className="border-t border-slate-200 h-[500px]">
                      <DiffViewer />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
