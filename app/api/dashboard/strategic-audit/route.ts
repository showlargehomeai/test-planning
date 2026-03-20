import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "content", "audits", "latest.json");
    const raw = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(raw);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Strategic audit read error:", error);
    return NextResponse.json(
      { error: "Failed to load audit data" },
      { status: 500 }
    );
  }
}
