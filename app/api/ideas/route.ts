import { NextRequest, NextResponse } from "next/server";
import { filterIdeasFromGitHub, addIdeaToGitHub } from "@/app/lib/github-ideas";

export async function GET(request: NextRequest) {
  try {
    const params = Object.fromEntries(request.nextUrl.searchParams.entries());
    const ideas = await filterIdeasFromGitHub(params);
    return NextResponse.json(ideas);
  } catch (err) {
    console.error("GET /api/ideas error:", err);
    return NextResponse.json({ error: "Failed to fetch ideas" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.title || !body.description) {
      return NextResponse.json(
        { error: "title and description are required" },
        { status: 400 }
      );
    }

    const idea = await addIdeaToGitHub({
      title: body.title,
      description: body.description,
      category: body.category || "other",
      priority: body.priority || "medium",
      tags: body.tags || [],
      author: body.author || "匿名",
      status: "new",
    });

    return NextResponse.json(idea, { status: 201 });
  } catch (err) {
    console.error("POST /api/ideas error:", err);
    return NextResponse.json({ error: "Failed to save idea" }, { status: 500 });
  }
}
