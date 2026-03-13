import { diffLines } from "diff";
import { getVersionContent } from "./versions";

export interface DiffResult {
  from: string;
  to: string;
  file: string;
  changes: Array<{
    type: "added" | "removed" | "unchanged";
    value: string;
    lineStart: number;
  }>;
  stats: {
    additions: number;
    deletions: number;
  };
}

export function computeDiff(
  type: "demos" | "plans",
  fromVersion: string,
  toVersion: string,
  file: string = "index.html"
): DiffResult | null {
  const fromContent = getVersionContent(type, fromVersion, file);
  const toContent = getVersionContent(type, toVersion, file);

  if (fromContent === null || toContent === null) return null;

  const diff = diffLines(fromContent, toContent);

  let lineNum = 1;
  let additions = 0;
  let deletions = 0;

  const changes = diff.map((part) => {
    const type = part.added ? "added" as const : part.removed ? "removed" as const : "unchanged" as const;
    const lineStart = lineNum;

    if (!part.removed) {
      lineNum += (part.value.match(/\n/g) || []).length;
    }

    if (part.added) additions += (part.value.match(/\n/g) || []).length;
    if (part.removed) deletions += (part.value.match(/\n/g) || []).length;

    return { type, value: part.value, lineStart };
  });

  return {
    from: fromVersion,
    to: toVersion,
    file,
    changes,
    stats: { additions, deletions },
  };
}
