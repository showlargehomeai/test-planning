import { clsx } from "clsx";

interface Idea {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  tags: string[];
  author: string;
  timestamp: string;
  status: string;
}

const priorityColors: Record<string, string> = {
  high: "bg-red-100 text-red-700",
  medium: "bg-amber-100 text-amber-700",
  low: "bg-green-100 text-green-700",
};

const categoryColors: Record<string, string> = {
  product: "bg-indigo-100 text-indigo-700",
  business: "bg-purple-100 text-purple-700",
  tech: "bg-cyan-100 text-cyan-700",
  marketing: "bg-pink-100 text-pink-700",
  other: "bg-slate-100 text-slate-700",
};

export default function IdeaCard({ idea }: { idea: Idea }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-semibold text-slate-900 text-sm leading-tight">
          {idea.title}
        </h3>
        <span
          className={clsx(
            "shrink-0 text-xs font-medium px-2 py-0.5 rounded-full",
            priorityColors[idea.priority] || priorityColors.medium
          )}
        >
          {idea.priority}
        </span>
      </div>

      <p className="text-sm text-slate-600 mt-2 line-clamp-3">
        {idea.description}
      </p>

      <div className="flex flex-wrap gap-1.5 mt-3">
        <span
          className={clsx(
            "text-xs px-2 py-0.5 rounded-full font-medium",
            categoryColors[idea.category] || categoryColors.other
          )}
        >
          {idea.category}
        </span>
        {idea.tags.map((tag) => (
          <span
            key={tag}
            className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600"
          >
            #{tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
        <span className="text-xs text-slate-400">
          {new Date(idea.timestamp).toLocaleDateString()}
        </span>
        <span className="text-xs text-slate-500">{idea.author}</span>
      </div>
    </div>
  );
}
