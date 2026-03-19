/**
 * GitHub-backed ideas storage
 * Uses GitHub API to read/write ideas.json directly in the repo.
 * This ensures data persists across Vercel deployments.
 */

const GITHUB_TOKEN = process.env.GITHUB_TOKEN!;
const GITHUB_REPO = process.env.GITHUB_REPO || "showlargehomeai/test-planning";
const IDEAS_FILE_PATH = "content/ideas/ideas.json";

interface GitHubFileResponse {
  content: string;
  sha: string;
  encoding: string;
}

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

async function githubFetch(endpoint: string, options?: RequestInit) {
  const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}${endpoint}`, {
    ...options,
    headers: {
      Authorization: `token ${GITHUB_TOKEN}`,
      Accept: "application/vnd.github.v3+json",
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });
  return res;
}

/** Read ideas.json from GitHub (returns ideas + sha for update) */
async function getFileFromGitHub(): Promise<{ ideas: Idea[]; sha: string }> {
  const res = await githubFetch(`/contents/${IDEAS_FILE_PATH}`);
  if (!res.ok) {
    if (res.status === 404) return { ideas: [], sha: "" };
    throw new Error(`GitHub API error: ${res.status}`);
  }
  const data: GitHubFileResponse = await res.json();
  const decoded = Buffer.from(data.content, "base64").toString("utf-8");
  const ideas = JSON.parse(decoded);
  return { ideas: Array.isArray(ideas) ? ideas : [], sha: data.sha };
}

/** Write ideas.json back to GitHub via commit */
async function writeFileToGitHub(ideas: Idea[], sha: string, message: string): Promise<void> {
  const content = Buffer.from(JSON.stringify(ideas, null, 2), "utf-8").toString("base64");
  const res = await githubFetch(`/contents/${IDEAS_FILE_PATH}`, {
    method: "PUT",
    body: JSON.stringify({
      message,
      content,
      sha: sha || undefined,
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`GitHub write error: ${res.status} - ${err}`);
  }
}

/** Get all ideas from GitHub */
export async function getIdeasFromGitHub(): Promise<Idea[]> {
  const { ideas } = await getFileFromGitHub();
  return ideas;
}

/** Filter ideas */
export async function filterIdeasFromGitHub(params: {
  category?: string;
  priority?: string;
  tag?: string;
  search?: string;
  status?: string;
}): Promise<Idea[]> {
  let ideas = await getIdeasFromGitHub();

  if (params.category) ideas = ideas.filter((i) => i.category === params.category);
  if (params.priority) ideas = ideas.filter((i) => i.priority === params.priority);
  if (params.tag) ideas = ideas.filter((i) => i.tags.includes(params.tag!));
  if (params.status) ideas = ideas.filter((i) => i.status === params.status);
  if (params.search) {
    const q = params.search.toLowerCase();
    ideas = ideas.filter(
      (i) => i.title.toLowerCase().includes(q) || i.description.toLowerCase().includes(q)
    );
  }

  return ideas;
}

/** Add a new idea via GitHub commit */
export async function addIdeaToGitHub(
  idea: Omit<Idea, "id" | "timestamp">
): Promise<Idea> {
  const { ideas, sha } = await getFileFromGitHub();

  const newIdea: Idea = {
    ...idea,
    id: `idea-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    timestamp: new Date().toISOString(),
  };

  ideas.push(newIdea);
  await writeFileToGitHub(ideas, sha, `新增點子: ${newIdea.title}`);
  return newIdea;
}
