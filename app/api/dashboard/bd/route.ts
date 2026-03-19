import { NextResponse } from "next/server";
import { getJsonFromGitHub } from "@/app/lib/github-dashboard";

export async function GET() {
  try {
    const { data } = await getJsonFromGitHub(
      "content/dashboard/vendors.json"
    );
    return NextResponse.json(data);
  } catch (error) {
    console.error("BD fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch BD data" },
      { status: 500 }
    );
  }
}
