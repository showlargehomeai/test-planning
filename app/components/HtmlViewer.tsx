"use client";

import { useState, useEffect } from "react";
import { clsx } from "clsx";

interface VersionEntry {
  version: string;
  timestamp: string;
  description: string;
  author: string;
  files: string[];
}

export default function HtmlViewer({ type }: { type: "demos" | "plans" }) {
  const [versions, setVersions] = useState<VersionEntry[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<string>("index.html");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/versions?type=${type}`)
      .then((r) => r.json())
      .then((data: VersionEntry[]) => {
        setVersions(data);
        if (data.length > 0) {
          const latest = data[data.length - 1];
          setSelectedVersion(latest.version);
          setSelectedFile(latest.files?.[0] || "index.html");
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [type]);

  const currentVersion = versions.find((v) => v.version === selectedVersion);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (versions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-slate-500">
        <span className="text-6xl mb-4">{type === "demos" ? "🎨" : "📊"}</span>
        <p className="text-lg font-medium">No {type === "demos" ? "demos" : "plans"} yet</p>
        <p className="text-sm mt-2">
          Talk to Claude to create your first {type === "demos" ? "demo" : "business plan"}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center gap-4 p-4 bg-slate-50 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-slate-700">Version:</label>
          <select
            value={selectedVersion}
            onChange={(e) => {
              setSelectedVersion(e.target.value);
              const v = versions.find((v) => v.version === e.target.value);
              setSelectedFile(v?.files?.[0] || "index.html");
            }}
            className="border border-slate-300 rounded-md px-3 py-1.5 text-sm bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            {versions.map((v) => (
              <option key={v.version} value={v.version}>
                {v.version} — {v.description}
              </option>
            ))}
          </select>
        </div>

        {currentVersion && currentVersion.files.length > 1 && (
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-slate-700">Page:</label>
            <select
              value={selectedFile}
              onChange={(e) => setSelectedFile(e.target.value)}
              className="border border-slate-300 rounded-md px-3 py-1.5 text-sm bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              {currentVersion.files.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>
        )}

        {currentVersion && (
          <div className="ml-auto text-xs text-slate-500">
            {new Date(currentVersion.timestamp).toLocaleString()} by{" "}
            {currentVersion.author}
          </div>
        )}
      </div>

      {/* iframe */}
      <div className="flex-1 min-h-0">
        <iframe
          key={`${selectedVersion}-${selectedFile}`}
          src={`/api/content/${type}/${selectedVersion}/${selectedFile}`}
          className="w-full h-full border-0"
          title={`${type} viewer`}
          sandbox="allow-scripts allow-same-origin"
        />
      </div>
    </div>
  );
}
