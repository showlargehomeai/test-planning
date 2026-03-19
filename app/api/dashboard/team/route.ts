import { NextResponse } from "next/server";
import { getJsonFromGitHub } from "@/app/lib/github-dashboard";

export async function GET() {
  try {
    const { data } = await getJsonFromGitHub(
      "content/dashboard/teams.json"
    );
    return NextResponse.json(data);
  } catch (error) {
    console.error("Team fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch team data" },
      { status: 500 }
    );
  }
}
