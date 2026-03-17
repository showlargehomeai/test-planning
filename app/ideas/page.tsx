"use client";

import { useState, useEffect, useCallback } from "react";
import IdeaCard from "../components/IdeaCard";
import IdeaForm from "../components/IdeaForm";

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

export default function IdeasPage() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [search, setSearch] = useState("");

  const loadIdeas = useCallback(() => {
    const params = new URLSearchParams();
    if (categoryFilter) params.set("category", categoryFilter);
    if (priorityFilter) params.set("priority", priorityFilter);
    if (search) params.set("search", search);

    fetch(`/api/ideas?${params.toString()}`)
      .then((r) => r.json())
      .then((data) => setIdeas(Array.isArray(data) ? data : []));
  }, [categoryFilter, priorityFilter, search]);

  useEffect(() => {
    loadIdeas();
  }, [loadIdeas]);

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">點子牆</h1>
            <p className="text-sm text-slate-500 mt-1">
              已收集 {ideas.length} 個點子
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors min-h-[44px] shrink-0"
          >
            + 新增點子
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜尋點子..."
            className="border border-slate-300 rounded-lg px-3 py-2.5 text-sm w-full sm:w-64 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[44px]"
          />
          <div className="flex gap-3">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[44px] flex-1 sm:flex-initial"
            >
              <option value="">所有分類</option>
              <option value="product">產品</option>
              <option value="business">商業</option>
              <option value="tech">技術</option>
              <option value="marketing">行銷</option>
              <option value="other">其他</option>
            </select>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[44px] flex-1 sm:flex-initial"
            >
              <option value="">所有優先級</option>
              <option value="high">高</option>
              <option value="medium">中</option>
              <option value="low">低</option>
            </select>
          </div>
        </div>

        {/* Ideas Grid */}
        {ideas.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <span className="text-6xl mb-4">💡</span>
            <p className="text-lg font-medium">尚無點子</p>
            <p className="text-sm mt-2">
              點擊「+ 新增點子」或告訴 Claude 你的想法
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {ideas.map((idea) => (
              <IdeaCard key={idea.id} idea={idea} />
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showForm && (
        <IdeaForm onClose={() => setShowForm(false)} onSubmit={loadIdeas} />
      )}
    </div>
  );
}
