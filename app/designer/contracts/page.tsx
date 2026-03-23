"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { clsx } from "clsx";

const mockTemplates = [
  { id: 1, name: "住宅室內設計合約", desc: "標準住宅裝修設計合約，含設計費、施工費、保固條款", pages: 12, lastUpdated: "2026-03-01", popular: true },
  { id: 2, name: "商業空間設計合約", desc: "適用於商辦、店面、餐廳等商業空間裝修", pages: 15, lastUpdated: "2026-02-15", popular: true },
  { id: 3, name: "設計顧問諮詢合約", desc: "純設計諮詢服務，不含施工監造", pages: 6, lastUpdated: "2026-01-20", popular: false },
  { id: 4, name: "工程施工承攬合約", desc: "純施工承攬，含工期、付款方式、保固條款", pages: 14, lastUpdated: "2025-12-10", popular: true },
  { id: 5, name: "追加工程變更合約", desc: "施工中追加或變更工程項目的補充合約", pages: 4, lastUpdated: "2025-11-15", popular: false },
  { id: 6, name: "保密協議 (NDA)", desc: "保護雙方商業機密與設計方案", pages: 3, lastUpdated: "2025-10-01", popular: false },
];

const mockContracts = [
  { id: "C-2026-001", template: "住宅室內設計合約", client: "陳怡君", project: "大安區現代簡約宅", total: "NT$ 1,850,000", status: "signed" as const, signedDate: "2026-03-10", signers: [{ name: "陳怡君", signed: true }, { name: "設計師 張明哲", signed: true }] },
  { id: "C-2026-002", template: "工程施工承攬合約", client: "林志明", project: "板橋工業風 Loft", total: "NT$ 980,000", status: "pending" as const, signedDate: null, signers: [{ name: "林志明", signed: false }, { name: "設計師 張明哲", signed: true }] },
  { id: "C-2026-003", template: "設計顧問諮詢合約", client: "王美玲", project: "信義區北歐親子宅", total: "NT$ 150,000", status: "draft" as const, signedDate: null, signers: [{ name: "王美玲", signed: false }, { name: "設計師 張明哲", signed: false }] },
  { id: "C-2025-010", template: "住宅室內設計合約", client: "劉雅婷", project: "中山區新古典豪宅", total: "NT$ 3,200,000", status: "signed" as const, signedDate: "2025-12-28", signers: [{ name: "劉雅婷", signed: true }, { name: "設計師 張明哲", signed: true }] },
];

const statusConfig = {
  signed: { label: "已簽署", color: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: "✓" },
  pending: { label: "待簽署", color: "bg-amber-50 text-amber-700 border-amber-200", icon: "⏳" },
  draft: { label: "草稿", color: "bg-slate-100 text-slate-500 border-slate-200", icon: "📝" },
};

function SignatureModal({ contract, onClose, onSign }: { contract: typeof mockContracts[0]; onClose: () => void; onSign: (id: string) => void }) {
  const [drawing, setDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const canvasRef = useState<HTMLCanvasElement | null>(null);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setDrawing(true);
    const canvas = e.currentTarget;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawing) return;
    const canvas = e.currentTarget;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#1e293b";
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
    setHasSignature(true);
  };

  const handleMouseUp = () => setDrawing(false);

  const clearSignature = (e: React.MouseEvent) => {
    e.preventDefault();
    const canvas = document.getElementById("sig-canvas") as HTMLCanvasElement;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
      setHasSignature(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="p-5 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-900">📝 電子簽章</h2>
          <p className="text-sm text-slate-500 mt-1">{contract.id} — {contract.client}</p>
        </div>
        
        {/* 合約摘要 */}
        <div className="p-5 space-y-3">
          <div className="bg-slate-50 rounded-lg p-4 text-sm space-y-2">
            <div className="flex justify-between"><span className="text-slate-500">專案</span><span className="font-medium">{contract.project}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">合約類型</span><span>{contract.template}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">合約金額</span><span className="font-bold text-indigo-600">{contract.total}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">簽署方</span><span>{contract.signers.map(s => s.name).join("、")}</span></div>
          </div>

          {/* 條款確認 */}
          <div className="bg-amber-50 rounded-lg p-3 border border-amber-200">
            <label className="flex items-start gap-2 cursor-pointer">
              <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-1 rounded border-slate-300" />
              <span className="text-xs text-amber-800">我已詳閱並同意合約所有條款，包含設計服務範圍、付款方式、工期、保固條款及爭議處理機制。</span>
            </label>
          </div>

          {/* 簽名板 */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-slate-700">手寫簽名</span>
              <button onClick={clearSignature} className="text-xs text-slate-400 hover:text-slate-600">清除重簽</button>
            </div>
            <canvas
              id="sig-canvas"
              width={420}
              height={120}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              className="w-full border-2 border-dashed border-slate-300 rounded-lg cursor-crosshair bg-white touch-none"
              style={{ height: 120 }}
            />
            <p className="text-xs text-slate-400 mt-1">在上方區域用滑鼠簽名</p>
          </div>

          {/* 時間戳 */}
          <div className="text-xs text-slate-400 bg-slate-50 rounded-lg p-3 font-mono">
            簽署時間：{new Date().toLocaleString("zh-TW", { timeZone: "Asia/Taipei" })}
            <br />IP 位址：192.168.x.x（模擬）
            <br />裝置：Web Browser
          </div>
        </div>

        <div className="p-5 border-t border-slate-200 flex gap-3">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 rounded-lg border border-slate-300 text-sm font-medium text-slate-600 hover:bg-slate-50">取消</button>
          <button
            onClick={() => { if (agreed && hasSignature) onSign(contract.id); }}
            disabled={!agreed || !hasSignature}
            className={clsx(
              "flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
              agreed && hasSignature ? "bg-indigo-600 text-white hover:bg-indigo-700" : "bg-slate-200 text-slate-400 cursor-not-allowed"
            )}
          >
            ✍️ 確認簽署
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── 建立新合約 Modal ── */
interface NewContractForm {
  template: string;
  client: string;
  project: string;
  total: string;
  startDate: string;
  endDate: string;
  designFee: string;
  constructionFee: string;
  warrantyMonths: string;
  paymentTerms: string;
  notes: string;
}

const emptyForm: NewContractForm = {
  template: "",
  client: "",
  project: "",
  total: "",
  startDate: "",
  endDate: "",
  designFee: "",
  constructionFee: "",
  warrantyMonths: "12",
  paymentTerms: "3-3-3-1",
  notes: "",
};

const paymentOptions = [
  { value: "3-3-3-1", label: "30/30/30/10（簽約/開工/中期/驗收）" },
  { value: "5-3-2", label: "50/30/20（簽約/中期/驗收）" },
  { value: "4-3-3", label: "40/30/30（簽約/中期/驗收）" },
  { value: "custom", label: "自訂付款方式" },
];

function NewContractModal({
  templates,
  onClose,
  onCreate,
  prefill,
}: {
  templates: typeof mockTemplates;
  onClose: () => void;
  onCreate: (form: NewContractForm) => void;
  prefill?: Partial<NewContractForm>;
}) {
  const [form, setForm] = useState<NewContractForm>({ ...emptyForm, ...prefill });
  const [step, setStep] = useState(1); // 1: 基本資訊, 2: 金額與付款, 3: 確認
  const [errors, setErrors] = useState<Partial<Record<keyof NewContractForm, string>>>({});

  const update = (field: keyof NewContractForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const validateStep1 = () => {
    const e: typeof errors = {};
    if (!form.template) e.template = "請選擇合約範本";
    if (!form.client.trim()) e.client = "請輸入客戶名稱";
    if (!form.project.trim()) e.project = "請輸入專案名稱";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    const e: typeof errors = {};
    if (!form.total || Number(form.total) <= 0) e.total = "請輸入合約總金額";
    if (!form.startDate) e.startDate = "請選擇預計開工日";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) setStep(3);
  };

  const handleBack = () => setStep(s => Math.max(1, s - 1));

  const selectedTemplate = templates.find(t => t.name === form.template);

  // 自動計算總金額
  const autoTotal = (Number(form.designFee) || 0) + (Number(form.constructionFee) || 0);
  const displayTotal = form.total ? Number(form.total) : autoTotal;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="p-5 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">📝 建立新合約</h2>
              <p className="text-sm text-slate-500 mt-0.5">步驟 {step} / 3</p>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400">✕</button>
          </div>
          {/* Progress bar */}
          <div className="flex gap-1.5 mt-3">
            {[1, 2, 3].map(s => (
              <div key={s} className={clsx("h-1 flex-1 rounded-full transition-colors", s <= step ? "bg-indigo-500" : "bg-slate-200")} />
            ))}
          </div>
        </div>

        <div className="p-5 space-y-4">
          {step === 1 && (
            <>
              <div className="text-sm font-semibold text-slate-700 mb-2">基本資訊</div>
              {/* 合約範本 */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">合約範本 *</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {templates.map(t => (
                    <button
                      key={t.id}
                      onClick={() => update("template", t.name)}
                      className={clsx(
                        "text-left p-3 rounded-lg border-2 transition-all text-sm",
                        form.template === t.name
                          ? "border-indigo-500 bg-indigo-50"
                          : "border-slate-200 hover:border-slate-300"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-slate-800">{t.name}</span>
                        {t.popular && <span className="text-[10px] px-1.5 py-0.5 bg-amber-50 text-amber-600 rounded-full">熱門</span>}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{t.desc}</p>
                    </button>
                  ))}
                </div>
                {errors.template && <p className="text-xs text-red-500 mt-1">{errors.template}</p>}
              </div>
              {/* 客戶名稱 */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">客戶名稱 *</label>
                <input
                  value={form.client}
                  onChange={e => update("client", e.target.value)}
                  placeholder="例如：陳怡君"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                />
                {errors.client && <p className="text-xs text-red-500 mt-1">{errors.client}</p>}
              </div>
              {/* 專案名稱 */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">專案名稱 *</label>
                <input
                  value={form.project}
                  onChange={e => update("project", e.target.value)}
                  placeholder="例如：大安區現代簡約宅"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                />
                {errors.project && <p className="text-xs text-red-500 mt-1">{errors.project}</p>}
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="text-sm font-semibold text-slate-700 mb-2">金額與付款方式</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">設計費 (NT$)</label>
                  <input
                    type="number"
                    value={form.designFee}
                    onChange={e => {
                      update("designFee", e.target.value);
                      if (!form.total || form.total === String(autoTotal)) {
                        const newTotal = (Number(e.target.value) || 0) + (Number(form.constructionFee) || 0);
                        update("total", String(newTotal));
                      }
                    }}
                    placeholder="0"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">施工費 (NT$)</label>
                  <input
                    type="number"
                    value={form.constructionFee}
                    onChange={e => {
                      update("constructionFee", e.target.value);
                      if (!form.total || form.total === String(autoTotal)) {
                        const newTotal = (Number(form.designFee) || 0) + (Number(e.target.value) || 0);
                        update("total", String(newTotal));
                      }
                    }}
                    placeholder="0"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">合約總金額 (NT$) *</label>
                <input
                  type="number"
                  value={form.total}
                  onChange={e => update("total", e.target.value)}
                  placeholder="自動加總或手動輸入"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none font-bold text-indigo-700"
                />
                {errors.total && <p className="text-xs text-red-500 mt-1">{errors.total}</p>}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">預計開工日 *</label>
                  <input
                    type="date"
                    value={form.startDate}
                    onChange={e => update("startDate", e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  />
                  {errors.startDate && <p className="text-xs text-red-500 mt-1">{errors.startDate}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">預計完工日</label>
                  <input
                    type="date"
                    value={form.endDate}
                    onChange={e => update("endDate", e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">付款方式</label>
                <select
                  value={form.paymentTerms}
                  onChange={e => update("paymentTerms", e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white"
                >
                  {paymentOptions.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">保固期（月）</label>
                  <input
                    type="number"
                    value={form.warrantyMonths}
                    onChange={e => update("warrantyMonths", e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">備註</label>
                <textarea
                  value={form.notes}
                  onChange={e => update("notes", e.target.value)}
                  rows={2}
                  placeholder="特殊條款或備註事項..."
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"
                />
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="text-sm font-semibold text-slate-700 mb-2">確認合約資訊</div>
              <div className="bg-slate-50 rounded-xl p-5 space-y-3 text-sm">
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">合約範本</span>
                  <span className="font-medium text-slate-800">{form.template}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">客戶</span>
                  <span className="font-medium text-slate-800">{form.client}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">專案</span>
                  <span className="font-medium text-slate-800">{form.project}</span>
                </div>
                {form.designFee && (
                  <div className="flex justify-between border-b border-slate-200 pb-2">
                    <span className="text-slate-500">設計費</span>
                    <span>NT$ {Number(form.designFee).toLocaleString()}</span>
                  </div>
                )}
                {form.constructionFee && (
                  <div className="flex justify-between border-b border-slate-200 pb-2">
                    <span className="text-slate-500">施工費</span>
                    <span>NT$ {Number(form.constructionFee).toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">合約總金額</span>
                  <span className="font-bold text-indigo-600 text-base">NT$ {displayTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">工期</span>
                  <span>{form.startDate || "—"} ～ {form.endDate || "—"}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">付款方式</span>
                  <span>{paymentOptions.find(o => o.value === form.paymentTerms)?.label}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">保固期</span>
                  <span>{form.warrantyMonths} 個月</span>
                </div>
                {form.notes && (
                  <div className="pt-2 border-t border-slate-200">
                    <span className="text-slate-500">備註：</span>
                    <p className="text-slate-700 mt-1">{form.notes}</p>
                  </div>
                )}
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800">
                ⚠️ 確認建立後，合約將以「草稿」狀態保存。你可以在送出簽署前隨時編輯。
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-200 flex gap-3">
          {step > 1 ? (
            <button onClick={handleBack} className="px-4 py-2.5 rounded-lg border border-slate-300 text-sm font-medium text-slate-600 hover:bg-slate-50">
              ← 上一步
            </button>
          ) : (
            <button onClick={onClose} className="px-4 py-2.5 rounded-lg border border-slate-300 text-sm font-medium text-slate-600 hover:bg-slate-50">
              取消
            </button>
          )}
          <div className="flex-1" />
          {step < 3 ? (
            <button onClick={handleNext} className="px-6 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors">
              下一步 →
            </button>
          ) : (
            <button
              onClick={() => onCreate(form)}
              className="px-6 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors"
            >
              ✅ 確認建立合約
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function ContractsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromQuote = searchParams.get("fromQuote");
  const fromClient = searchParams.get("client");
  const fromTotal = searchParams.get("total");

  const [tab, setTab] = useState<"templates" | "contracts">("contracts");
  const [previewTemplate, setPreviewTemplate] = useState<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [signingContract, setSigningContract] = useState<string | null>(null);
  const [contracts, setContracts] = useState(mockContracts);
  const [showNewContract, setShowNewContract] = useState(false);

  const hasPreFill = fromQuote && fromClient && fromTotal;

  const handleCreateContract = (form: NewContractForm) => {
    const newId = `C-2026-${String(contracts.length + 1).padStart(3, "0")}`;
    const newContract = {
      id: newId,
      template: form.template,
      client: form.client,
      project: form.project,
      total: `NT$ ${Number(form.total).toLocaleString()}`,
      status: "draft" as const,
      signedDate: null,
      signers: [
        { name: form.client, signed: false },
        { name: "設計師 張明哲", signed: false },
      ],
    };
    setContracts(prev => [newContract, ...prev]);
    setShowNewContract(false);
    setTab("contracts");
    setToast(`✅ 合約 ${newId} 已建立！`);
    setTimeout(() => setToast(null), 3000);
  };

  const handleSyncToFinance = (contractId: string) => {
    setToast("合約已同步至收支系統");
    setTimeout(() => {
      setToast(null);
      router.push("/designer/finance");
    }, 1500);
  };

  const handleSign = (contractId: string) => {
    setContracts(prev => prev.map(c => 
      c.id === contractId 
        ? { ...c, status: "signed" as const, signedDate: new Date().toISOString().split("T")[0], signers: c.signers.map(s => ({ ...s, signed: true })) }
        : c
    ));
    setSigningContract(null);
    setToast("✅ 合約簽署完成！已記錄電子簽章。");
    setTimeout(() => setToast(null), 3000);
  };

  const handleSendReminder = (contractId: string) => {
    setToast("📩 已發送簽署提醒通知給客戶");
    setTimeout(() => setToast(null), 2000);
  };

  const handleSendForSigning = (contractId: string) => {
    setContracts(prev => prev.map(c =>
      c.id === contractId ? { ...c, status: "pending" as const, signedDate: null } : c
    ));
    setToast("📤 合約已送出，等待客戶簽署");
    setTimeout(() => setToast(null), 2000);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      {/* New Contract Modal */}
      {showNewContract && (
        <NewContractModal
          templates={mockTemplates}
          onClose={() => setShowNewContract(false)}
          onCreate={handleCreateContract}
          prefill={hasPreFill ? { client: fromClient, total: fromTotal, project: "" } : undefined}
        />
      )}

      {/* Signature Modal */}
      {signingContract && (() => {
        const c = contracts.find(x => x.id === signingContract);
        return c ? <SignatureModal contract={c} onClose={() => setSigningContract(null)} onSign={handleSign} /> : null;
      })()}

      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium">
          ✓ {toast}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">📝 合約範本庫與電子簽章</h1>
          <p className="text-sm text-slate-500 mt-1">管理合約範本、建立與追蹤電子簽章</p>
        </div>
        <button onClick={() => setShowNewContract(true)} className="px-4 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors min-h-[44px] shrink-0">
          + 建立新合約
        </button>
      </div>

      {/* Pre-filled Contract from Quotation */}
      {hasPreFill && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-5">
          <div className="flex items-start gap-3">
            <span className="text-2xl">📋</span>
            <div className="flex-1">
              <h3 className="font-semibold text-indigo-900 mb-1">從報價單自動帶入</h3>
              <p className="text-sm text-indigo-700 mb-3">以下合約資訊已根據報價單 {fromQuote} 預先填入</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-white rounded-lg p-3">
                  <p className="text-xs text-slate-500">報價單編號</p>
                  <p className="text-sm font-semibold text-slate-900">{fromQuote}</p>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <p className="text-xs text-slate-500">客戶</p>
                  <p className="text-sm font-semibold text-slate-900">{fromClient}</p>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <p className="text-xs text-slate-500">合約金額</p>
                  <p className="text-sm font-semibold text-indigo-600">NT$ {Number(fromTotal).toLocaleString()}</p>
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                <button onClick={() => setShowNewContract(true)} className="px-4 py-2 text-sm font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors">
                  確認建立合約
                </button>
                <button
                  onClick={() => router.push("/designer/contracts")}
                  className="px-4 py-2 text-sm font-medium rounded-lg border border-indigo-300 text-indigo-700 hover:bg-indigo-100 transition-colors"
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500">合約範本</p>
          <p className="text-2xl font-bold text-indigo-600">{mockTemplates.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500">已簽署</p>
          <p className="text-2xl font-bold text-emerald-600">{contracts.filter((c) => c.status === "signed").length}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500">待簽署</p>
          <p className="text-2xl font-bold text-amber-600">{contracts.filter((c) => c.status === "pending").length}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500">草稿中</p>
          <p className="text-2xl font-bold text-slate-500">{contracts.filter((c) => c.status === "draft").length}</p>
        </div>
      </div>

      {/* Tab toggle */}
      <div className="flex gap-1 bg-slate-100 rounded-lg p-1 w-fit">
        <button onClick={() => setTab("contracts")} className={clsx("px-4 py-2 rounded-md text-sm font-medium", tab === "contracts" ? "bg-white shadow-sm text-slate-900" : "text-slate-500")}>
          📄 我的合約
        </button>
        <button onClick={() => setTab("templates")} className={clsx("px-4 py-2 rounded-md text-sm font-medium", tab === "templates" ? "bg-white shadow-sm text-slate-900" : "text-slate-500")}>
          📋 範本庫
        </button>
      </div>

      {tab === "contracts" ? (
        <div className="space-y-4">
          {contracts.map((contract) => {
            const cfg = statusConfig[contract.status];
            return (
              <div key={contract.id} className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-slate-400">{contract.id}</span>
                      <span className={clsx("text-xs px-2 py-0.5 rounded-full border", cfg.color)}>
                        {cfg.icon} {cfg.label}
                      </span>
                    </div>
                    <h3 className="font-semibold text-slate-900">{contract.client} — {contract.project}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{contract.template}</p>
                  </div>
                  <p className="text-lg font-bold text-indigo-600 shrink-0">{contract.total}</p>
                </div>

                {/* Signers */}
                <div className="flex flex-wrap gap-3 mb-3">
                  {contract.signers.map((signer) => (
                    <div key={signer.name} className="flex items-center gap-2">
                      <span className={clsx(
                        "w-6 h-6 rounded-full flex items-center justify-center text-xs",
                        signer.signed ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-400"
                      )}>
                        {signer.signed ? "✓" : "·"}
                      </span>
                      <span className="text-sm text-slate-600">{signer.name}</span>
                    </div>
                  ))}
                </div>

                {/* Signed state */}
                {contract.status === "signed" && (
                  <>
                    <div className="bg-slate-50 rounded-lg p-3 flex items-center gap-3">
                      <div className="w-20 h-10 border-2 border-dashed border-slate-300 rounded flex items-center justify-center">
                        <span className="text-xs italic text-slate-400 font-serif">簽名</span>
                      </div>
                      <div className="text-xs text-slate-500">
                        <p>電子簽章完成</p>
                        <p>簽署日期：{contract.signedDate}</p>
                      </div>
                    </div>
                    {/* Sync to Finance button */}
                    <div className="mt-3">
                      <button
                        onClick={() => handleSyncToFinance(contract.id)}
                        className="px-4 py-2 text-sm font-medium rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
                      >
                        📊 同步至收支
                      </button>
                    </div>
                  </>
                )}

                {contract.status === "pending" && (
                  <div className="flex gap-2 mt-2">
                    <button onClick={() => handleSendReminder(contract.id)} className="px-3 py-1.5 text-xs font-medium rounded-lg bg-amber-500 text-white hover:bg-amber-600 transition-colors">
                      📩 發送簽署提醒
                    </button>
                    <button onClick={() => setSigningContract(contract.id)} className="px-3 py-1.5 text-xs font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors">
                      ✍️ 立即簽署
                    </button>
                  </div>
                )}

                {contract.status === "draft" && (
                  <div className="flex gap-2 mt-2">
                    <button onClick={() => setSigningContract(contract.id)} className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50 transition-colors">
                      👁️ 預覽合約
                    </button>
                    <button onClick={() => handleSendForSigning(contract.id)} className="px-3 py-1.5 text-xs font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors">
                      📤 送出簽署
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockTemplates.map((template) => (
            <div key={template.id} className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 text-lg">
                  📄
                </div>
                {template.popular && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">熱門</span>
                )}
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">{template.name}</h3>
              <p className="text-xs text-slate-500 mb-3 line-clamp-2">{template.desc}</p>
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>{template.pages} 頁</span>
                <span>更新：{template.lastUpdated}</span>
              </div>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => setPreviewTemplate(previewTemplate === template.id ? null : template.id)}
                  className="flex-1 px-3 py-2 text-xs font-medium rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50 transition-colors min-h-[36px]"
                >
                  預覽
                </button>
                <button onClick={() => { setShowNewContract(true); setTimeout(() => { /* template will be prefilled via modal */ }, 0); setTab("contracts"); }} className="flex-1 px-3 py-2 text-xs font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors min-h-[36px]">
                  使用範本
                </button>
              </div>

              {previewTemplate === template.id && (
                <div className="mt-3 pt-3 border-t border-slate-100">
                  <div className="bg-slate-50 rounded-lg p-4 space-y-2 text-xs text-slate-600">
                    <p className="font-medium text-slate-700">合約大綱：</p>
                    <p>一、雙方基本資料</p>
                    <p>二、設計服務範圍與內容</p>
                    <p>三、工程期限與進度</p>
                    <p>四、報價與付款方式</p>
                    <p>五、變更追加條款</p>
                    <p>六、保固與售後服務</p>
                    <p>七、違約責任</p>
                    <p>八、爭議處理</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ContractsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400">載入中...</div>}>
      <ContractsContent />
    </Suspense>
  );
}

// Note: SignatureModal is rendered inside ContractsContent
