"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { clsx } from "clsx";

const mockTemplates = [
  {
    id: 1, name: "住宅室內設計合約", desc: "標準住宅裝修設計合約，含設計費、施工費、保固條款", pages: 12, lastUpdated: "2026-03-01", popular: true,
    sections: [
      { title: "第一條 雙方基本資料", clauses: ["甲方（委託人）：姓名、身分證字號、聯絡電話、通訊地址", "乙方（設計師/公司）：公司名稱、統一編號、負責人、營業地址", "施工地址：___縣市___區___路___號___樓"] },
      { title: "第二條 設計服務範圍", clauses: ["丈量現場並繪製現況圖", "提供平面配置圖、立面圖、3D 效果圖（含 ___次修改）", "材料建議與色彩計畫", "施工圖繪製（含水電配置、天花板、櫃體詳圖）", "協助建材挑選與廠商議價", "施工期間現場監造（每週至少 ___次）"] },
      { title: "第三條 工程期限", clauses: ["設計階段：自簽約日起 ___個工作日內完成設計定稿", "施工階段：自開工日起 ___個日曆天內完工", "因天災、不可抗力或甲方變更設計導致延遲，工期順延，不計入違約", "每日延遲罰款：工程總價之萬分之___（上限總價 ___%）"] },
      { title: "第四條 報價與付款方式", clauses: ["設計費：NT$ ___元（含稅）", "工程總價：NT$ ___元（含稅），依報價單明細", "付款期程：\n  ① 簽約金 ___%，簽約時支付\n  ② 開工款 ___%，開工日支付\n  ③ 中期款 ___%，木作/泥作完成時支付\n  ④ 驗收款 ___%，驗收完成後 ___日內支付", "追加工程需另行報價，經雙方書面同意後始得施作"] },
      { title: "第五條 材料與施工規範", clauses: ["乙方依報價單所列品牌、型號施作，如需替代須經甲方書面同意", "施工依據 CNS 國家標準及相關法規", "廢棄物清運由乙方負責，保持工地整潔", "隱蔽工程（水電管線、防水層等）施作前通知甲方確認"] },
      { title: "第六條 變更追加條款", clauses: ["甲方如需變更設計或追加工程，應以書面提出", "乙方於 ___個工作日內提供變更報價單", "變更經雙方簽認後始得執行，工期相應調整", "未經書面同意之變更，乙方不得請求額外費用"] },
      { title: "第七條 驗收", clauses: ["完工後乙方通知甲方進行驗收，甲方應於 ___日內完成", "驗收缺失由乙方於 ___日內改善完成", "甲方逾期未驗收且未提出書面異議，視為驗收通過", "驗收通過後，甲方支付尾款，乙方交付保固書"] },
      { title: "第八條 保固與售後服務", clauses: ["結構工程保固 ___年（自驗收日起算）", "防水工程保固 ___年", "設備（含水電、空調）保固 ___年", "保固期內非人為損壞，乙方免費維修", "保固期外提供有償維修服務，工資另計"] },
      { title: "第九條 違約責任", clauses: ["任一方違約，應賠償他方因此所受之損害", "乙方無正當理由遲延完工，每逾 ___日賠償工程總價萬分之___", "甲方無正當理由遲延付款，每逾 ___日加計年利率 ___%之遲延利息", "乙方施工品質不符約定，經通知限期改善仍未改善者，甲方得解除合約"] },
      { title: "第十條 爭議處理", clauses: ["雙方因本合約發生爭議，應先以協商方式解決", "協商不成，得向___（地方法院/仲裁機構）提請調解或訴訟", "本合約適用中華民國法律"] },
      { title: "第十一條 其他約定", clauses: ["本合約一式兩份，雙方各執一份，具同等效力", "未盡事宜依民法及相關法令辦理", "本合約附件（報價單、設計圖面）為合約之一部分"] },
    ],
  },
  {
    id: 2, name: "商業空間設計合約", desc: "適用於商辦、店面、餐廳等商業空間裝修", pages: 15, lastUpdated: "2026-02-15", popular: true,
    sections: [
      { title: "第一條 雙方基本資料", clauses: ["甲方（委託人/公司）：公司名稱、統一編號、代表人、聯絡人", "乙方（設計公司）：公司名稱、統一編號、負責設計師", "施工地址及營業用途：___"] },
      { title: "第二條 設計服務範圍", clauses: ["商業空間規劃（含動線設計、坪效分析）", "品牌視覺整合（CI 配色、招牌設計建議）", "消防法規及無障礙設施規劃", "機電設備配置（含商用廚房、POS 系統管線預留）", "施工圖及 3D 透視圖（含 ___次修改）", "施工監造及廠商協調"] },
      { title: "第三條 工程期限與里程碑", clauses: ["概念設計階段：___個工作日", "細部設計階段：___個工作日", "施工階段：___個日曆天", "里程碑審查：每階段完成需經甲方書面確認方進入下一階段", "延遲罰則：每日工程總價萬分之___（營業損失另計）"] },
      { title: "第四條 費用與付款", clauses: ["設計費：NT$ ___元", "工程總價：NT$ ___元（依報價單）", "付款分 ___期，依工程進度請款", "發票開立方式：___（含稅/未稅）"] },
      { title: "第五條 營業許可與法規", clauses: ["乙方確保設計符合建築法、消防法、衛生法規", "甲方負責申請營業登記及相關許可", "因法規變更導致設計修改，費用由雙方協商分擔"] },
      { title: "第六條 保固與維護", clauses: ["工程保固 ___年", "商用設備保固依原廠規定", "乙方提供 ___年內優惠維護方案"] },
      { title: "第七條 保密條款", clauses: ["雙方對合約內容及商業資訊負保密義務", "未經對方書面同意，不得向第三方揭露"] },
      { title: "第八條 違約與爭議處理", clauses: ["違約損害賠償依實際損失計算", "爭議先協商，不成向___管轄法院提訴"] },
    ],
  },
  {
    id: 3, name: "設計顧問諮詢合約", desc: "純設計諮詢服務，不含施工監造", pages: 6, lastUpdated: "2026-01-20", popular: false,
    sections: [
      { title: "第一條 服務內容", clauses: ["現場丈量與空間評估（___次）", "風格諮詢與色彩建議", "平面配置方案（___套）", "材料建議清單與估價參考", "不含施工圖繪製、施工監造及廠商協調"] },
      { title: "第二條 諮詢費用", clauses: ["諮詢費：NT$ ___元（依坪數計算，每坪 NT$ ___元）", "簽約時一次付清", "後續如轉為完整設計合約，諮詢費可全額折抵設計費"] },
      { title: "第三條 交付物", clauses: ["平面配置圖（PDF 及 CAD 格式）", "風格意象簡報", "材料建議書（含品牌、型號、參考價格）", "交付期限：自丈量日起 ___個工作日"] },
      { title: "第四條 智慧財產權", clauses: ["設計方案著作權歸乙方所有", "甲方取得非專屬使用授權，限於本案使用", "甲方不得將設計方案轉讓第三方或用於其他案件"] },
      { title: "第五條 免責聲明", clauses: ["乙方僅提供設計建議，不保證施工品質", "甲方自行發包施工之結果，乙方不負責任"] },
    ],
  },
  {
    id: 4, name: "工程施工承攬合約", desc: "純施工承攬，含工期、付款方式、保固條款", pages: 14, lastUpdated: "2025-12-10", popular: true,
    sections: [
      { title: "第一條 工程概要", clauses: ["工程名稱：___", "工程地點：___", "工程內容：依附件報價單及施工圖說"] },
      { title: "第二條 承攬金額", clauses: ["總價承攬：NT$ ___元（含稅）", "本合約為總價承攬，除經書面同意之追加減帳外，不得調整", "單價分析表詳見附件"] },
      { title: "第三條 工期", clauses: ["開工日期：___年___月___日", "完工日期：___年___月___日（共___個日曆天）", "每日逾期罰款：總價萬分之___", "因天候、不可抗力或業主因素延遲，工期順延"] },
      { title: "第四條 付款辦法", clauses: ["依工程進度分期請款：\n  ① 簽約 ___%\n  ② 拆除完成 ___%\n  ③ 水電粗工完成 ___%\n  ④ 泥作完成 ___%\n  ⑤ 木作完成 ___%\n  ⑥ 油漆完成 ___%\n  ⑦ 驗收完成 ___%", "每期請款附工程進度照片及簽認單"] },
      { title: "第五條 材料規範", clauses: ["依報價單指定品牌型號施作", "替代材料需經業主書面同意", "乙方提供材料進場證明（出貨單/發票）", "剩餘材料歸業主所有"] },
      { title: "第六條 施工管理", clauses: ["乙方指派工地主任 ___先生/小姐駐場管理", "每日施工日報表", "隱蔽工程拍照存檔，完工交付紀錄光碟", "施工時段：週一至週六 08:00-18:00（國定假日除外）"] },
      { title: "第七條 安全衛生", clauses: ["乙方負責工地安全，投保勞工保險及營造綜合保險", "鄰損責任由乙方負責", "施工人員佩戴安全裝備"] },
      { title: "第八條 驗收", clauses: ["分項驗收：各工種完成後進行", "總驗收：全部工程完成後 ___日內", "缺失改善期限：___日", "驗收紀錄雙方各執一份"] },
      { title: "第九條 保固", clauses: ["結構及防水：___年", "水電及機電設備：___年", "木作及油漆：___年", "保固起算日：驗收合格日"] },
      { title: "第十條 違約與解約", clauses: ["乙方施工不當，經通知限期改善仍未改善，甲方得終止合約", "甲方無故終止合約，已施作部分仍應付款", "違約金：總價 ___%"] },
    ],
  },
  {
    id: 5, name: "追加工程變更合約", desc: "施工中追加或變更工程項目的補充合約", pages: 4, lastUpdated: "2025-11-15", popular: false,
    sections: [
      { title: "第一條 原合約資訊", clauses: ["原合約編號：___", "原合約日期：___年___月___日", "原合約金額：NT$ ___元"] },
      { title: "第二條 變更內容", clauses: ["追加項目明細：（詳見附件報價單）", "刪減項目明細：（詳見附件報價單）", "變更原因說明：___"] },
      { title: "第三條 金額調整", clauses: ["追加金額：NT$ +___元", "刪減金額：NT$ -___元", "淨調整金額：NT$ ___元", "調整後合約總金額：NT$ ___元"] },
      { title: "第四條 工期調整", clauses: ["因本次變更，工期延長 ___個日曆天", "調整後完工日期：___年___月___日"] },
      { title: "第五條 效力", clauses: ["本補充合約為原合約之一部分", "未變更之條款仍依原合約執行", "本補充合約一式兩份，雙方各執一份"] },
    ],
  },
  {
    id: 6, name: "保密協議 (NDA)", desc: "保護雙方商業機密與設計方案", pages: 3, lastUpdated: "2025-10-01", popular: false,
    sections: [
      { title: "第一條 保密資訊定義", clauses: ["設計圖面、效果圖、施工圖等設計成果", "報價單、成本分析、利潤結構等商業資訊", "客戶名單、專案資訊、合作廠商資料", "雙方會議紀錄、電子郵件、通訊內容", "標記為「機密」或按性質應屬機密之一切資訊"] },
      { title: "第二條 保密義務", clauses: ["接收方應以與自身機密資訊同等之注意保護揭露方之機密資訊", "未經揭露方書面同意，不得向任何第三方揭露", "僅限於履行合約所必要之範圍內使用", "接收方之員工及分包商須受同等保密約束"] },
      { title: "第三條 例外情形", clauses: ["接收前已為公眾所知悉之資訊", "非因接收方之過失而成為公開資訊", "接收方可證明係自行獨立開發", "依法律或法院命令必須揭露者（但應事先通知揭露方）"] },
      { title: "第四條 期限與終止", clauses: ["本協議自簽署日起生效", "保密義務存續期間：合約終止後 ___年", "任一方得以 ___日前書面通知終止本協議", "終止後應歸還或銷毀所有機密資料"] },
      { title: "第五條 違約賠償", clauses: ["違反保密義務之一方應賠償他方所受之一切損害", "違約金：NT$ ___元或實際損害金額（以較高者為準）", "揭露方得請求法院核發禁制令"] },
    ],
  },
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
                  <div className="bg-slate-50 rounded-lg p-4 space-y-4 text-xs text-slate-600 max-h-[400px] overflow-y-auto">
                    <div className="text-center border-b border-slate-200 pb-3 mb-3">
                      <p className="font-bold text-sm text-slate-800">{template.name}</p>
                      <p className="text-[10px] text-slate-400 mt-1">範本編號 TPL-{String(template.id).padStart(3, "0")} · {template.pages} 頁 · 最後更新 {template.lastUpdated}</p>
                    </div>
                    {template.sections.map((section, si) => (
                      <div key={si}>
                        <p className="font-semibold text-slate-700 mb-1.5">{section.title}</p>
                        <div className="space-y-1 pl-3">
                          {section.clauses.map((clause, ci) => (
                            <div key={ci} className="flex items-start gap-1.5">
                              <span className="text-slate-400 shrink-0 mt-0.5">•</span>
                              <p className="text-slate-600 whitespace-pre-line">{clause}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                    <div className="border-t border-slate-200 pt-3 mt-3 text-center">
                      <p className="text-[10px] text-slate-400">— 合約範本結束 · 共 {template.sections.length} 條 · {template.sections.reduce((sum, s) => sum + s.clauses.length, 0)} 款 —</p>
                    </div>
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
