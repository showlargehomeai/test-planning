"use client";

import { useState } from "react";

type PaymentStatus = "all" | "pending" | "overdue" | "paid" | "partial";

interface Payment {
  id: string;
  project: string;
  client: string;
  milestone: string;
  amount: number;
  paidAmount: number;
  dueDate: string;
  paidDate: string | null;
  status: "pending" | "overdue" | "paid" | "partial";
  method: string | null;
  invoiceNumber: string;
}

const payments: Payment[] = [
  { id: "PAY-001", project: "大安區林宅翻新", client: "林先生", milestone: "設計費 - 簽約金", amount: 120000, paidAmount: 120000, dueDate: "2026-01-15", paidDate: "2026-01-14", status: "paid", method: "銀行轉帳", invoiceNumber: "INV-2026-001" },
  { id: "PAY-002", project: "大安區林宅翻新", client: "林先生", milestone: "設計費 - 出圖款", amount: 120000, paidAmount: 120000, dueDate: "2026-02-15", paidDate: "2026-02-16", status: "paid", method: "銀行轉帳", invoiceNumber: "INV-2026-002" },
  { id: "PAY-003", project: "大安區林宅翻新", client: "林先生", milestone: "工程款 - 第一期 30%", amount: 840000, paidAmount: 840000, dueDate: "2026-02-28", paidDate: "2026-02-27", status: "paid", method: "銀行轉帳", invoiceNumber: "INV-2026-003" },
  { id: "PAY-004", project: "大安區林宅翻新", client: "林先生", milestone: "工程款 - 第二期 30%", amount: 840000, paidAmount: 500000, dueDate: "2026-03-15", paidDate: null, status: "partial", method: null, invoiceNumber: "INV-2026-004" },
  { id: "PAY-005", project: "大安區林宅翻新", client: "林先生", milestone: "工程款 - 第三期 30%", amount: 840000, paidAmount: 0, dueDate: "2026-04-15", paidDate: null, status: "pending", method: null, invoiceNumber: "INV-2026-005" },
  { id: "PAY-006", project: "大安區林宅翻新", client: "林先生", milestone: "驗收尾款 10%", amount: 280000, paidAmount: 0, dueDate: "2026-05-15", paidDate: null, status: "pending", method: null, invoiceNumber: "INV-2026-006" },
  { id: "PAY-007", project: "板橋張宅 Loft", client: "張小姐", milestone: "設計費 - 全額", amount: 180000, paidAmount: 180000, dueDate: "2026-02-01", paidDate: "2026-01-30", status: "paid", method: "LINE Pay", invoiceNumber: "INV-2026-007" },
  { id: "PAY-008", project: "板橋張宅 Loft", client: "張小姐", milestone: "工程款 - 第一期 40%", amount: 520000, paidAmount: 0, dueDate: "2026-03-10", paidDate: null, status: "overdue", method: null, invoiceNumber: "INV-2026-008" },
  { id: "PAY-009", project: "信義區豪宅案", client: "王董", milestone: "設計費 - 簽約金", amount: 350000, paidAmount: 350000, dueDate: "2026-03-01", paidDate: "2026-02-28", status: "paid", method: "銀行轉帳", invoiceNumber: "INV-2026-009" },
  { id: "PAY-010", project: "信義區豪宅案", client: "王董", milestone: "設計費 - 出圖款", amount: 350000, paidAmount: 0, dueDate: "2026-03-20", paidDate: null, status: "overdue", method: null, invoiceNumber: "INV-2026-010" },
  { id: "PAY-011", project: "中山區辦公室", client: "科技公司", milestone: "設計費 - 全額", amount: 250000, paidAmount: 250000, dueDate: "2026-03-05", paidDate: "2026-03-05", status: "paid", method: "公司匯款", invoiceNumber: "INV-2026-011" },
  { id: "PAY-012", project: "中山區辦公室", client: "科技公司", milestone: "工程款 - 第一期 50%", amount: 680000, paidAmount: 0, dueDate: "2026-04-01", paidDate: null, status: "pending", method: null, invoiceNumber: "INV-2026-012" },
];

const statusConfig = {
  paid: { label: "已付款", color: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-500" },
  partial: { label: "部分付款", color: "bg-amber-100 text-amber-700", dot: "bg-amber-500" },
  pending: { label: "待付款", color: "bg-blue-100 text-blue-700", dot: "bg-blue-500" },
  overdue: { label: "逾期", color: "bg-red-100 text-red-700", dot: "bg-red-500" },
};

export default function PaymentsPage() {
  const [filter, setFilter] = useState<PaymentStatus>("all");
  const [search, setSearch] = useState("");

  const filtered = payments.filter((p) => {
    if (filter !== "all" && p.status !== filter) return false;
    if (search && !p.project.includes(search) && !p.client.includes(search) && !p.invoiceNumber.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const totalAmount = payments.reduce((s, p) => s + p.amount, 0);
  const totalPaid = payments.reduce((s, p) => s + p.paidAmount, 0);
  const totalOverdue = payments.filter((p) => p.status === "overdue").reduce((s, p) => s + (p.amount - p.paidAmount), 0);
  const totalPending = payments.filter((p) => p.status === "pending").reduce((s, p) => s + p.amount, 0);

  const fmt = (n: number) => `NT$ ${n.toLocaleString()}`;

  return (
    <div className="space-y-6">
      {/* 統計卡片 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <p className="text-xs text-slate-500">合約總額</p>
          <p className="text-xl font-bold text-slate-900 mt-1">{fmt(totalAmount)}</p>
          <p className="text-xs text-slate-400 mt-1">12 筆付款</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-emerald-200 shadow-sm">
          <p className="text-xs text-emerald-600">已收款</p>
          <p className="text-xl font-bold text-emerald-700 mt-1">{fmt(totalPaid)}</p>
          <div className="mt-2 h-1.5 bg-emerald-100 rounded-full">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(totalPaid / totalAmount) * 100}%` }} />
          </div>
          <p className="text-xs text-emerald-500 mt-1">{Math.round((totalPaid / totalAmount) * 100)}% 收款率</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-red-200 shadow-sm">
          <p className="text-xs text-red-600">逾期未收</p>
          <p className="text-xl font-bold text-red-700 mt-1">{fmt(totalOverdue)}</p>
          <p className="text-xs text-red-400 mt-1">{payments.filter((p) => p.status === "overdue").length} 筆逾期</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-blue-200 shadow-sm">
          <p className="text-xs text-blue-600">待收款</p>
          <p className="text-xl font-bold text-blue-700 mt-1">{fmt(totalPending)}</p>
          <p className="text-xs text-blue-400 mt-1">{payments.filter((p) => p.status === "pending").length} 筆待收</p>
        </div>
      </div>

      {/* 篩選 */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="搜尋專案、客戶或發票號..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <div className="flex gap-2 flex-wrap">
          {(["all", "pending", "overdue", "partial", "paid"] as PaymentStatus[]).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filter === s ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {s === "all" ? "全部" : statusConfig[s].label}
            </button>
          ))}
        </div>
      </div>

      {/* 付款列表 */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-4 py-3 font-medium text-slate-600">發票號</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">專案 / 客戶</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">里程碑</th>
                <th className="text-right px-4 py-3 font-medium text-slate-600">金額</th>
                <th className="text-right px-4 py-3 font-medium text-slate-600">已收</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">到期日</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">狀態</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">付款方式</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => {
                const cfg = statusConfig[p.status];
                const isOverdue = p.status === "overdue";
                return (
                  <tr key={p.id} className={`border-b border-slate-100 hover:bg-slate-50 ${isOverdue ? "bg-red-50/30" : ""}`}>
                    <td className="px-4 py-3 font-mono text-xs text-slate-500">{p.invoiceNumber}</td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-900">{p.project}</div>
                      <div className="text-xs text-slate-400">{p.client}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-700">{p.milestone}</td>
                    <td className="px-4 py-3 text-right font-medium text-slate-900">{fmt(p.amount)}</td>
                    <td className="px-4 py-3 text-right">
                      <span className={p.paidAmount > 0 ? "text-emerald-600 font-medium" : "text-slate-400"}>
                        {p.paidAmount > 0 ? fmt(p.paidAmount) : "—"}
                      </span>
                    </td>
                    <td className={`px-4 py-3 ${isOverdue ? "text-red-600 font-medium" : "text-slate-600"}`}>
                      {p.dueDate}
                      {isOverdue && <span className="ml-1 text-xs">⚠️</span>}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${cfg.color}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                        {cfg.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500">{p.method || "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-8 text-slate-400 text-sm">沒有符合條件的付款紀錄</div>
        )}
      </div>

      {/* 專案收款進度 */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
        <h3 className="font-semibold text-slate-900 mb-4">專案收款進度</h3>
        <div className="space-y-4">
          {["大安區林宅翻新", "板橋張宅 Loft", "信義區豪宅案", "中山區辦公室"].map((proj) => {
            const projPayments = payments.filter((p) => p.project === proj);
            const projTotal = projPayments.reduce((s, p) => s + p.amount, 0);
            const projPaid = projPayments.reduce((s, p) => s + p.paidAmount, 0);
            const pct = Math.round((projPaid / projTotal) * 100);
            const hasOverdue = projPayments.some((p) => p.status === "overdue");
            return (
              <div key={proj}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-slate-700">
                    {proj} {hasOverdue && <span className="text-red-500 text-xs ml-1">⚠️ 有逾期</span>}
                  </span>
                  <span className="text-xs text-slate-500">{fmt(projPaid)} / {fmt(projTotal)} ({pct}%)</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${hasOverdue ? "bg-red-400" : pct === 100 ? "bg-emerald-500" : "bg-indigo-500"}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
