import { readFileSync } from "fs";
import path from "path";

export const metadata = {
  title: "2026 BD 整體發展策略 — LargeHome AI",
  description: "綜合 200BD 全台擴張計畫 × BD 角色規劃方案",
};

export default function BdStrategyPage() {
  const html = readFileSync(
    path.join(process.cwd(), "content/bd-strategy-2026.html"),
    "utf-8"
  );
  return (
    <div
      className="min-h-screen"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
