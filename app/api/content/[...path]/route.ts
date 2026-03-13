import { NextRequest, NextResponse } from "next/server";
import { readFileSync, existsSync } from "fs";
import path from "path";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const segments = (await params).path;
  const filePath = path.join(process.cwd(), "content", ...segments);

  // Security: prevent path traversal
  const resolved = path.resolve(filePath);
  const contentDir = path.resolve(path.join(process.cwd(), "content"));
  if (!resolved.startsWith(contentDir)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (!existsSync(resolved)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const content = readFileSync(resolved, "utf-8");
  const ext = path.extname(resolved);

  const contentTypes: Record<string, string> = {
    ".html": "text/html",
    ".css": "text/css",
    ".js": "application/javascript",
    ".json": "application/json",
    ".svg": "image/svg+xml",
    ".png": "image/png",
    ".jpg": "image/jpeg",
  };

  return new NextResponse(content, {
    headers: {
      "Content-Type": contentTypes[ext] || "text/plain",
    },
  });
}
