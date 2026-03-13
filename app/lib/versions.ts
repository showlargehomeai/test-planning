import { readFileSync, existsSync, readdirSync } from "fs";
import path from "path";

export interface VersionEntry {
  version: string;
  timestamp: string;
  description: string;
  author: string;
  files: string[];
}

const CONTENT_DIR = path.join(process.cwd(), "content");

export function getVersions(type: "demos" | "plans"): VersionEntry[] {
  const filePath = path.join(CONTENT_DIR, type, "versions.json");
  if (!existsSync(filePath)) return [];
  const raw = readFileSync(filePath, "utf-8");
  return JSON.parse(raw);
}

export function getLatestVersion(type: "demos" | "plans"): VersionEntry | null {
  const versions = getVersions(type);
  return versions.length > 0 ? versions[versions.length - 1] : null;
}

export function getVersionContent(
  type: "demos" | "plans",
  version: string,
  file: string = "index.html"
): string | null {
  const filePath = path.join(CONTENT_DIR, type, version, file);
  if (!existsSync(filePath)) return null;
  return readFileSync(filePath, "utf-8");
}

export function getVersionFiles(type: "demos" | "plans", version: string): string[] {
  const dirPath = path.join(CONTENT_DIR, type, version);
  if (!existsSync(dirPath)) return [];
  return readdirSync(dirPath).filter((f) => f.endsWith(".html"));
}
