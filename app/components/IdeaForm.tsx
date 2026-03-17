"use client";

import { useState } from "react";

interface IdeaFormProps {
  onClose: () => void;
  onSubmit: () => void;
}

export default function IdeaForm({ onClose, onSubmit }: IdeaFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("other");
  const [priority, setPriority] = useState("medium");
  const [tags, setTags] = useState("");
  const [author, setAuthor] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    try {
      await fetch("/api/ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          category,
          priority,
          tags: tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
          author: author || "匿名",
        }),
      });

      onSubmit();
      onClose();
    } catch {
      alert("提交點子失敗");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 sm:p-4">
      <div className="bg-white w-full h-full sm:h-auto sm:rounded-2xl sm:shadow-xl sm:max-w-lg flex flex-col">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-200 shrink-0">
          <h2 className="text-lg font-semibold text-slate-900">新增點子</h2>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-11 h-11 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 text-xl leading-none"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 flex-1 overflow-y-auto">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              標題 *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="你的點子是什麼？"
              className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              描述 *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={3}
              placeholder="詳細描述這個點子..."
              className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                分類
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="product">產品</option>
                <option value="business">商業</option>
                <option value="tech">技術</option>
                <option value="marketing">行銷</option>
                <option value="other">其他</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                優先級
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="high">高</option>
                <option value="medium">中</option>
                <option value="low">低</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              標籤（以逗號分隔）
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="mvp, ux, v2..."
              className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              作者
            </label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="你的名字（選填）"
              className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors min-h-[44px]"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={submitting || !title || !description}
              className="px-4 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
            >
              {submitting ? "儲存中..." : "儲存點子"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
