import { readFileSync } from "fs";
import path from "path";

export const metadata = {
  title: "200BD 全台擴張計畫 v2 — LargeHome AI",
  description: "一年內 200 BD 搶佔全台灣市場",
};

export default function BD200Page() {
  let html: string;
  try {
    html = readFileSync(
      path.join(process.cwd(), "content/bd/200bd-taiwan-expansion-v2.html"),
      "utf-8"
    );
  } catch {
    html = "<div style='padding:2rem;text-align:center;color:#666;'>200BD 計畫文件載入中...</div>";
  }
  return (
    <div
      className="min-h-screen"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
