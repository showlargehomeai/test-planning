import { NextResponse } from "next/server";
import { getJsonFromGitHub } from "@/app/lib/github-dashboard";

export async function GET() {
  try {
    const { data } = await getJsonFromGitHub(
      "content/dashboard/okr.json"
    );
    return NextResponse.json(data);
  } catch (error) {
    console.error("OKR fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch OKR data" },
      { status: 500 }
    );
  }
}
