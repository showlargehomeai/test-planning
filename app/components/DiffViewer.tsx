"use client";

import { useState, useEffect, useMemo } from "react";
import { clsx } from "clsx";

interface VersionEntry {
  version: string;
  timestamp: string;
  description: string;
  author: string;
  files: string[];
}

interface DiffChange {
  type: "added" | "removed" | "unchanged";
  value: string;
  lineStart: number;
}

interface DiffResult {
  from: string;
  to: string;
  file: string;
  changes: DiffChange[];
  stats: { additions: number; deletions: number };
}

export default function DiffViewer() {
  const [type, setType] = useState<"demos" | "plans">("demos");
  const [versions, setVersions] = useState<VersionEntry[]>([]);
  const [fromVersion, setFromVersion] = useState("");
  const [toVersion, setToVersion] = useState("");
  const [diff, setDiff] = useState<DiffResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<"diff" | "sideBySide">("diff");

  useEffect(() => {
    fetch(`/api/versions?type=${type}`)
      .then((r) => r.json())
      .then((data: VersionEntry[]) => {
        setVersions(data);
        if (data.length >= 2) {
          setFromVersion(data[data.length - 2].version);
          setToVersion(data[data.length - 1].version);
        } else if (data.length === 1) {
          setFromVersion(data[0].version);
          setToVersion(data[0].version);
        }
      });
  }, [type]);

  useEffect(() => {
    if (!fromVersion || !toVersion || fromVersion === toVersion) {
      setDiff(null);
      return;
    }
    setLoading(true);
    fetch(`/api/diff?type=${type}&from=${fromVersion}&to=${toVersion}`)
      .then((r) => r.json())
      .then((data: DiffResult) => {
        setDiff(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [type, fromVersion, toVersion]);

  const timeline = useMemo(() => {
    return [...versions].reverse();
  }, [versions]);

  return (
    <div className="flex h-full">
      {/* Sidebar: version timeline */}
      <div className="w-80 border-r border-slate-200 bg-slate-50 overflow-y-auto">
        <div className="p-4">
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setType("demos")}
              className={clsx(
                "flex-1 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                type === "demos"
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-slate-600 border border-slate-300 hover:bg-slate-100"
              )}
            >
              Demos
            </button>
            <button
              onClick={() => setType("plans")}
              className={clsx(
                "flex-1 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                type === "plans"
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-slate-600 border border-slate-300 hover:bg-slate-100"
              )}
            >
              Plans
            </button>
          </div>

          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
            Version Timeline
          </h3>

          {timeline.length === 0 && (
            <p className="text-sm text-slate-400">No versions yet</p>
          )}

          <div className="space-y-1">
            {timeline.map((v, i) => (
              <button
                key={v.version}
                onClick={() => {
                  if (i < timeline.length - 1) {
                    setFromVersion(timeline[i + 1].version);
                    setToVersion(v.version);
                  }
                }}
                className={clsx(
                  "w-full text-left p-3 rounded-lg transition-colors",
                  toVersion === v.version
                    ? "bg-indigo-50 border border-indigo-200"
                    : "hover:bg-white"
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-mono font-medium text-slate-900">
                    {v.version}
                  </span>
                  <span className="text-xs text-slate-500">
                    {new Date(v.timestamp).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                  {v.description}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main area: diff view */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center gap-4 p-4 bg-white border-b border-slate-200">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-slate-500">Comparing</span>
            <span className="font-mono font-medium bg-red-50 text-red-700 px-2 py-0.5 rounded">
              {fromVersion || "—"}
            </span>
            <span className="text-slate-400">→</span>
            <span className="font-mono font-medium bg-green-50 text-green-700 px-2 py-0.5 rounded">
              {toVersion || "—"}
            </span>
          </div>

          {diff && (
            <div className="flex items-center gap-3 text-xs">
              <span className="text-green-600 font-medium">
                +{diff.stats.additions} additions
              </span>
              <span className="text-red-600 font-medium">
                -{diff.stats.deletions} deletions
              </span>
            </div>
          )}

          <div className="ml-auto flex gap-1">
            <button
              onClick={() => setViewMode("diff")}
              className={clsx(
                "px-3 py-1 rounded text-xs font-medium",
                viewMode === "diff"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600"
              )}
            >
              Unified Diff
            </button>
            <button
              onClick={() => setViewMode("sideBySide")}
              className={clsx(
                "px-3 py-1 rounded text-xs font-medium",
                viewMode === "sideBySide"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600"
              )}
            >
              Side by Side
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          {loading && (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full" />
            </div>
          )}

          {!loading && !diff && fromVersion && toVersion && fromVersion !== toVersion && (
            <div className="flex items-center justify-center h-full text-slate-400">
              Could not compute diff
            </div>
          )}

          {!loading && fromVersion === toVersion && (
            <div className="flex items-center justify-center h-full text-slate-400">
              Select two different versions to compare
            </div>
          )}

          {!loading && diff && viewMode === "diff" && (
            <div className="font-mono text-xs leading-5">
              {diff.changes.map((change, i) => (
                <div
                  key={i}
                  className={clsx(
                    "px-4 whitespace-pre-wrap",
                    change.type === "added" && "bg-green-50 text-green-800",
                    change.type === "removed" && "bg-red-50 text-red-800",
                    change.type === "unchanged" && "text-slate-600"
                  )}
                >
                  {change.type === "added" && "+ "}
                  {change.type === "removed" && "- "}
                  {change.type === "unchanged" && "  "}
                  {change.value}
                </div>
              ))}
            </div>
          )}

          {!loading && diff && viewMode === "sideBySide" && (
            <div className="grid grid-cols-2 h-full">
              <div className="border-r border-slate-200">
                <div className="bg-red-50 px-4 py-2 border-b border-slate-200 text-xs font-medium text-red-700">
                  {fromVersion}
                </div>
                <iframe
                  src={`/api/content/${type}/${fromVersion}/index.html`}
                  className="w-full h-full border-0"
                  title="Previous version"
                  sandbox="allow-scripts allow-same-origin"
                />
              </div>
              <div>
                <div className="bg-green-50 px-4 py-2 border-b border-slate-200 text-xs font-medium text-green-700">
                  {toVersion}
                </div>
                <iframe
                  src={`/api/content/${type}/${toVersion}/index.html`}
                  className="w-full h-full border-0"
                  title="Current version"
                  sandbox="allow-scripts allow-same-origin"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
