import { NextRequest, NextResponse } from "next/server";
import { filterIdeas, addIdea } from "@/app/lib/ideas";

export async function GET(request: NextRequest) {
  const params = Object.fromEntries(request.nextUrl.searchParams.entries());
  const ideas = filterIdeas(params);
  return NextResponse.json(ideas);
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

    const idea = addIdea({
      title: body.title,
      description: body.description,
      category: body.category || "other",
      priority: body.priority || "medium",
      tags: body.tags || [],
      author: body.author || "Anonymous",
      status: "new",
    });

    return NextResponse.json(idea, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
