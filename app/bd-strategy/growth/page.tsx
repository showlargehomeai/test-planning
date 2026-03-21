import { readFileSync } from "fs";
import path from "path";

export const metadata = {
  title: "流量快速增長計畫 — LargeHome AI",
  description: "功能面 × 行銷面 × 內容面 — 90 天衝刺計畫",
};

export default function GrowthPage() {
  const html = readFileSync(
    path.join(process.cwd(), "content/growth-plan-2026.html"),
    "utf-8"
  );
  return (
    <div className="min-h-screen" dangerouslySetInnerHTML={{ __html: html }} />
  );
}
