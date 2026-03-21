import { NextRequest, NextResponse } from "next/server";
import { getVersions } from "@/app/lib/versions";

export async function GET(request: NextRequest) {
  const type = request.nextUrl.searchParams.get("type");

  if (type !== "demos" && type !== "plans" && type !== "releases") {
    return NextResponse.json(
      { error: 'type must be "demos", "plans", or "releases"' },
      { status: 400 }
    );
  }

  const versions = getVersions(type);
  return NextResponse.json(versions);
}
