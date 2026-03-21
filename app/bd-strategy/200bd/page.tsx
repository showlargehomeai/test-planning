import { readFileSync } from "fs";
import path from "path";

export const metadata = {
  title: "200BD 全台擴張計畫 v2 — LargeHome AI",
  description: "一年內 200 BD 搶佔全台灣市場",
};

export default function BD200Page() {
  const html = readFileSync(
    path.join(process.env.HOME || "", "Desktop/200bd-taiwan-expansion-v2.html"),
    "utf-8"
  );
  return (
    <div
      className="min-h-screen"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
