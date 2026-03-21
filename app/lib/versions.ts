import { readFileSync, existsSync, readdirSync } from "fs";
import path from "path";

export interface ChangeSummary {
  overview: string;
  changes: {
    type: "feature" | "improvement" | "breaking";
    text: string;
  }[];
  businessGoal: string;
  techNotes?: string;
}

export interface VersionEntry {
  version: string;
  timestamp: string;
  description: string;
  author: string;
  files: string[];
  summary?: ChangeSummary;
}

const CONTENT_DIR = path.join(process.cwd(), "content");

export type VersionType = "demos" | "plans" | "releases";

export function getVersions(type: VersionType): VersionEntry[] {
  const filePath = path.join(CONTENT_DIR, type, "versions.json");
  if (!existsSync(filePath)) return [];
  const raw = readFileSync(filePath, "utf-8");
  return JSON.parse(raw);
}

export function getLatestVersion(type: VersionType): VersionEntry | null {
  const versions = getVersions(type);
  return versions.length > 0 ? versions[versions.length - 1] : null;
}

export function getVersionContent(
  type: VersionType,
  version: string,
  file: string = "index.html"
): string | null {
  const filePath = path.join(CONTENT_DIR, type, version, file);
  if (!existsSync(filePath)) return null;
  return readFileSync(filePath, "utf-8");
}

export function getVersionFiles(type: VersionType, version: string): string[] {
  const dirPath = path.join(CONTENT_DIR, type, version);
  if (!existsSync(dirPath)) return [];
  return readdirSync(dirPath).filter((f) => f.endsWith(".html"));
}
