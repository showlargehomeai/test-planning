import { NextRequest, NextResponse } from "next/server";
import { computeDiff } from "@/app/lib/diff";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const type = params.get("type") as "demos" | "plans";
  const from = params.get("from");
  const to = params.get("to");
  const file = params.get("file") || "index.html";

  if (!type || !from || !to) {
    return NextResponse.json(
      { error: "type, from, and to are required" },
      { status: 400 }
    );
  }

  if (type !== "demos" && type !== "plans") {
    return NextResponse.json(
      { error: 'type must be "demos" or "plans"' },
      { status: 400 }
    );
  }

  const diff = computeDiff(type, from, to, file);

  if (!diff) {
    return NextResponse.json({ error: "Version not found" }, { status: 404 });
  }

  return NextResponse.json(diff);
}
