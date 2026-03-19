/**
 * GitHub-backed dashboard data storage
 * Uses GitHub API to read JSON files from content/dashboard/.
 * Same pattern as github-ideas.ts for Vercel stateless compatibility.
 */

const GITHUB_TOKEN = process.env.GITHUB_TOKEN!;
const GITHUB_REPO = process.env.GITHUB_REPO || "showlargehomeai/test-planning";

interface GitHubFileResponse {
  content: string;
  sha: string;
}

async function githubFetch(endpoint: string, options?: RequestInit) {
  const res = await fetch(
    `https://api.github.com/repos/${GITHUB_REPO}${endpoint}`,
    {
      ...options,
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
        ...options?.headers,
      },
    }
  );
  return res;
}

/** Read a JSON file from GitHub */
export async function getJsonFromGitHub<T>(
  filePath: string
): Promise<{ data: T; sha: string }> {
  const res = await githubFetch(`/contents/${filePath}`);
  if (!res.ok) {
    if (res.status === 404) return { data: {} as T, sha: "" };
    throw new Error(`GitHub API error: ${res.status}`);
  }
  const file: GitHubFileResponse = await res.json();
  const decoded = Buffer.from(file.content, "base64").toString("utf-8");
  return { data: JSON.parse(decoded), sha: file.sha };
}

/** Write a JSON file back to GitHub via commit */
export async function writeJsonToGitHub<T>(
  filePath: string,
  data: T,
  sha: string,
  message: string
): Promise<void> {
  const content = Buffer.from(
    JSON.stringify(data, null, 2),
    "utf-8"
  ).toString("base64");
  const res = await githubFetch(`/contents/${filePath}`, {
    method: "PUT",
    body: JSON.stringify({ message, content, sha: sha || undefined }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`GitHub write error: ${res.status} - ${err}`);
  }
}
