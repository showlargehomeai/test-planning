import { readFileSync, writeFileSync, existsSync } from "fs";
import path from "path";

export interface Idea {
  id: string;
  title: string;
  description: string;
  category: "product" | "business" | "tech" | "marketing" | "other";
  priority: "high" | "medium" | "low";
  tags: string[];
  author: string;
  timestamp: string;
  status: "new" | "in-progress" | "done" | "archived";
}

const IDEAS_PATH = path.join(process.cwd(), "content", "ideas", "ideas.json");

export function getIdeas(): Idea[] {
  if (!existsSync(IDEAS_PATH)) return [];
  const raw = readFileSync(IDEAS_PATH, "utf-8");
  const parsed = JSON.parse(raw);
  return Array.isArray(parsed) ? parsed : [];
}

export function addIdea(idea: Omit<Idea, "id" | "timestamp">): Idea {
  const ideas = getIdeas();
  const newIdea: Idea = {
    ...idea,
    id: `idea-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    timestamp: new Date().toISOString(),
  };
  ideas.push(newIdea);
  writeFileSync(IDEAS_PATH, JSON.stringify(ideas, null, 2), "utf-8");
  return newIdea;
}

export function filterIdeas(params: {
  category?: string;
  priority?: string;
  tag?: string;
  search?: string;
  status?: string;
}): Idea[] {
  let ideas = getIdeas();

  if (params.category) {
    ideas = ideas.filter((i) => i.category === params.category);
  }
  if (params.priority) {
    ideas = ideas.filter((i) => i.priority === params.priority);
  }
  if (params.tag) {
    ideas = ideas.filter((i) => i.tags.includes(params.tag!));
  }
  if (params.status) {
    ideas = ideas.filter((i) => i.status === params.status);
  }
  if (params.search) {
    const q = params.search.toLowerCase();
    ideas = ideas.filter(
      (i) =>
        i.title.toLowerCase().includes(q) ||
        i.description.toLowerCase().includes(q)
    );
  }

  return ideas;
}
