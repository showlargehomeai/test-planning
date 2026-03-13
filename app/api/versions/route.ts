import { NextRequest, NextResponse } from "next/server";
import { getVersions } from "@/app/lib/versions";

export async function GET(request: NextRequest) {
  const type = request.nextUrl.searchParams.get("type");

  if (type !== "demos" && type !== "plans") {
    return NextResponse.json(
      { error: 'type must be "demos" or "plans"' },
      { status: 400 }
    );
  }

  const versions = getVersions(type);
  return NextResponse.json(versions);
}
