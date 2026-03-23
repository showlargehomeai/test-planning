"use client";

import { useState } from "react";
import { clsx } from "clsx";

// ============================================================
// 驗收流程知識庫
// ============================================================

type TradeKey = "demolition" | "waterproof" | "plumbing" | "masonry" | "woodwork" | "paint" | "cabinet" | "equipment" | "final";

interface CheckItem {
  item: string;
  standard: string;
  method: string;
  commonDefect: string;
  tip: string;
}

interface InspectionPhase {
  key: TradeKey;
  name: string;
  icon: string;
  color: string;
  bgColor: string;
  timing: string;
  description: string;
  participants: string[];
  documents: string[];
  checkItems: CheckItem[];
  paymentNote: string;
}

const phases: InspectionPhase[] = [
  {
    key: "demolition", name: "拆除工程", icon: "🔨", color: "text-red-700", bgColor: "bg-red-50",
    timing: "拆除完成後、其他工種進場前",
    description: "確認所有該拆的都拆了，不該拆的沒被破壞。管線是否斷乾淨，廢料是否清運完畢。",
    participants: ["設計師", "拆除工班", "業主（選擇性）"],
    documents: ["拆除前照片", "拆除後照片", "廢料清運單"],
    checkItems: [
      { item: "拆除範圍正確", standard: "與圖面標示一致", method: "對照設計圖逐區確認", commonDefect: "多拆（拆到不該拆的結構牆）", tip: "拆除前先在現場用噴漆標記範圍" },
      { item: "管線斷開處理", standard: "水電管線封口完整，無漏水漏電", method: "檢查所有截斷處", commonDefect: "水管未封好導致滲水", tip: "拆除前先請水電師傅斷水斷電" },
      { item: "結構安全", standard: "未損壞承重牆、梁柱", method: "目視檢查結構面", commonDefect: "拆除時不慎破壞結構", tip: "不確定的牆先請結構技師確認" },
      { item: "廢料清運", standard: "現場清空，可進行下一工種", method: "現場巡視", commonDefect: "角落殘留廢料碎片", tip: "要求拆除班用大型太空袋裝走" },
      { item: "鄰損檢查", standard: "無影響鄰居牆面/管線", method: "檢查公共區域和鄰居側", commonDefect: "震動導致鄰居牆面裂縫", tip: "拆除前先拍鄰居側照片存證" },
    ],
    paymentNote: "拆除完成+廢料清運後支付 100% 尾款",
  },
  {
    key: "waterproof", name: "防水工程", icon: "💧", color: "text-blue-700", bgColor: "bg-blue-50",
    timing: "泥作前、管線配好後",
    description: "這是最重要的隱蔽工程之一。做不好，封起來後要挖開重做，成本翻倍。",
    participants: ["設計師", "防水/泥作工班", "業主（強烈建議到場）"],
    documents: ["蓄水試驗照片", "防水施作過程照", "蓄水試驗簽認單"],
    checkItems: [
      { item: "防水層塗佈範圍", standard: "浴室：地面全做 + 壁面至少 150cm；陽台：地面全做", method: "目視確認塗佈範圍", commonDefect: "壁面高度不足，淋浴區積水滲透", tip: "淋浴區建議做到天花板" },
      { item: "防水層厚度", standard: "至少 2 道，轉角加強 3 道", method: "觀察塗佈遍數紀錄", commonDefect: "只刷一道就封起來", tip: "要求工班拍每一道施工照" },
      { item: "蓄水試驗", standard: "蓄水 3cm 高，48 小時無滲漏", method: "48hr 後到場檢查樓下天花板", commonDefect: "24hr 就急著放水", tip: "蓄水期間一定要到樓下確認" },
      { item: "排水洩水坡度", standard: "地面洩水坡度 ≥ 1/100", method: "倒水測試流向", commonDefect: "積水在角落不流向排水口", tip: "試水時觀察 10 分鐘水流方向" },
      { item: "管線穿越處", standard: "管線穿過防水層處需特別加強", method: "檢查管線周圍密封", commonDefect: "管線旁邊是最常漏水的地方", tip: "管線穿越處至少加做 3 道防水" },
    ],
    paymentNote: "蓄水試驗通過後支付。建議保留 10% 至泥作完成",
  },
  {
    key: "plumbing", name: "水電工程", icon: "🔌", color: "text-yellow-700", bgColor: "bg-yellow-50",
    timing: "封板/封牆前（隱蔽工程驗收）",
    description: "水電是封在牆壁和天花板裡面的，封起來就看不到了。所以一定要在封板前驗收。",
    participants: ["設計師", "水電工班", "業主（建議到場）"],
    documents: ["配管路徑照片", "電箱配線照", "水壓測試紀錄"],
    checkItems: [
      { item: "開關插座位置", standard: "與圖面標示一致，高度符合使用需求", method: "逐一對照圖面+現場標記", commonDefect: "被家具擋住、高度不對", tip: "先把家具位置標在地上再確認" },
      { item: "冷熱水管配置", standard: "左熱右冷，管線無交叉", method: "現場辨認管線顏色/標記", commonDefect: "冷熱水接反", tip: "紅管=熱水，藍管=冷水" },
      { item: "排水管路暢通", standard: "倒水測試排水順暢", method: "每個排水口倒水測試", commonDefect: "施工碎屑堵塞管路", tip: "封板前逐一倒水測試" },
      { item: "線路負載規劃", standard: "高功率電器獨立迴路", method: "確認電箱迴路分配", commonDefect: "冷氣/電熱水器沒有專用迴路", tip: "冷氣、烤箱、電熱水器必須獨立迴路" },
      { item: "接地線", standard: "所有插座含接地", method: "檢查三孔插座接地", commonDefect: "有三孔插座但沒接接地線", tip: "用三用電錶測試接地" },
      { item: "水壓測試", standard: "加壓至 10kg/cm² 維持 30 分鐘不漏", method: "使用加壓機器", commonDefect: "焊接處慢漏", tip: "一定要做加壓測試，不能只用肉眼看" },
    ],
    paymentNote: "隱蔽工程驗收通過後支付該階段款項",
  },
  {
    key: "masonry", name: "泥作工程", icon: "🧱", color: "text-orange-700", bgColor: "bg-orange-50",
    timing: "磁磚/石材鋪設完成後",
    description: "泥作完成後很難改，所以驗收一定要仔細。重點是平整度、對縫、空鼓。",
    participants: ["設計師", "泥作工班", "業主"],
    documents: ["完工照片", "空鼓檢測紀錄", "平整度檢測紀錄"],
    checkItems: [
      { item: "平整度", standard: "2m 靠尺落差 ≤ 2mm", method: "用 2m 鋁合金靠尺檢測", commonDefect: "大面積起伏不平", tip: "從不同角度側光看會更明顯" },
      { item: "空鼓檢查", standard: "敲擊無空心聲（允許角落 3cm 範圍）", method: "用空鼓錘逐片敲擊", commonDefect: "大面積空鼓，容易日後翹起", tip: "整面牆/地板都要敲，不能只敲幾片" },
      { item: "磁磚對縫", standard: "十字縫寬度一致，偏差 ≤ 0.5mm", method: "目視+卡尺量測", commonDefect: "對縫歪斜、寬窄不一", tip: "用十字定位器可以確保精度" },
      { item: "收邊完整", standard: "陽角/陰角收邊平整無毛邊", method: "手摸+目視", commonDefect: "收邊粗糙割手", tip: "陽角建議用不鏽鋼收邊條" },
      { item: "洩水坡度", standard: "浴室/陽台地面向排水口傾斜", method: "倒水測試", commonDefect: "反向積水", tip: "完工後一定要做倒水測試" },
      { item: "填縫完成", standard: "填縫均勻飽滿、顏色一致", method: "目視", commonDefect: "填縫不均、顏色不勻", tip: "填縫要等磁磚完全乾固後再做" },
    ],
    paymentNote: "泥作完工驗收通過後支付。保留 5% 至油漆完成",
  },
  {
    key: "woodwork", name: "木作工程", icon: "🪵", color: "text-amber-800", bgColor: "bg-amber-50",
    timing: "分兩次：骨架完成（中驗）+ 全部完成（終驗）",
    description: "木作佔裝修比重最大，驗收分骨架和面材兩階段。骨架封板前一定要驗。",
    participants: ["設計師", "木作工班", "業主"],
    documents: ["骨架照片", "完工照片", "五金安裝紀錄"],
    checkItems: [
      { item: "骨架間距（中驗）", standard: "輕鋼架/角材間距 ≤ 30cm", method: "量測間距", commonDefect: "間距太大，日後天花板下陷", tip: "封板前一定要拍骨架照片留存" },
      { item: "水平垂直", standard: "天花板水平 ≤ 1mm/m，牆面垂直 ≤ 2mm/m", method: "雷射水平儀", commonDefect: "目視看不出，但裝完燈具就歪了", tip: "一定要用雷射水平，不要靠肉眼" },
      { item: "櫃體尺寸", standard: "與圖面誤差 ≤ 2mm", method: "量測對照圖面", commonDefect: "深度或寬度不夠", tip: "丈量時要考慮面材厚度" },
      { item: "門片/抽屜開合", standard: "順暢開合無異音", method: "實際開關測試", commonDefect: "門片對不齊、抽屜卡住", tip: "每個門片抽屜都要開關 3 次以上" },
      { item: "五金品牌", standard: "與報價單指定品牌一致", method: "檢查五金品牌標記", commonDefect: "偷換次級品牌", tip: "BLUM 鉸鏈有雷射刻印，可辨真偽" },
      { item: "板材封邊", standard: "封邊膠均勻無氣泡、無脫落", method: "手摸邊緣", commonDefect: "封邊不牢固，日後起翹", tip: "特別注意潮濕區域的封邊" },
    ],
    paymentNote: "骨架驗收付 30%，面材完成驗收付 50%，保留 20% 至全案完工",
  },
  {
    key: "paint", name: "油漆工程", icon: "🎨", color: "text-indigo-700", bgColor: "bg-indigo-50",
    timing: "油漆完成後、家具進場前",
    description: "油漆是最後看到的面子工程，直接影響整體觀感。光線角度不同看到的問題也不同。",
    participants: ["設計師", "油漆工班", "業主"],
    documents: ["完工照片（不同光線）", "色號確認單"],
    checkItems: [
      { item: "批土平整", standard: "側光照射無明顯凹凸", method: "用手電筒側光照射牆面", commonDefect: "批土沒磨平就上漆", tip: "驗收時帶手電筒，斜 45 度照" },
      { item: "漆面均勻", standard: "無刷痕、無流淌、無色差", method: "自然光+側光觀察", commonDefect: "厚薄不均、交界處色差", tip: "同面牆一定要同一批漆一次完成" },
      { item: "遍數足夠", standard: "底漆 2 道 + 面漆 2-3 道", method: "確認施工紀錄", commonDefect: "少刷一道省工", tip: "不同底色的漆可以辨別遍數" },
      { item: "顏色正確", standard: "與色卡一致（大面積可能偏差 5%）", method: "色卡對比", commonDefect: "調色不準、批次色差", tip: "大面積前先做 1m² 試色確認" },
      { item: "保護工作", standard: "門框/窗框/地面無沾漆", method: "檢查非施作區域", commonDefect: "沾到木作面板或五金", tip: "施工前養生膠帶保護要到位" },
    ],
    paymentNote: "全部完成+清潔後支付",
  },
  {
    key: "cabinet", name: "系統櫃/廚具", icon: "🗄️", color: "text-teal-700", bgColor: "bg-teal-50",
    timing: "安裝完成後",
    description: "系統櫃和廚具是工廠製作現場安裝，重點在尺寸精度和五金品質。",
    participants: ["設計師", "系統櫃廠商", "業主"],
    documents: ["安裝完工照片", "五金保固書", "材質證明"],
    checkItems: [
      { item: "尺寸符合", standard: "與丈量尺寸誤差 ≤ 1mm", method: "量測", commonDefect: "現場牆面不直導致縫隙", tip: "收邊條可以修飾小縫隙" },
      { item: "門片對齊", standard: "相鄰門片縫隙均等", method: "目視", commonDefect: "門片高低不齊", tip: "鉸鏈可以三向微調" },
      { item: "抽屜滑軌", standard: "全展開順暢、緩衝有效", method: "開合測試", commonDefect: "滑軌不順暢", tip: "BLUM TANDEMBOX 有自對齊功能" },
      { item: "檯面接縫", standard: "接縫平整、膠水無溢出", method: "手摸+目視", commonDefect: "接縫處高低差", tip: "人造石檯面接縫應幾乎不可見" },
    ],
    paymentNote: "安裝完成驗收後支付尾款。保固依原廠規定",
  },
  {
    key: "equipment", name: "設備安裝", icon: "🚿", color: "text-cyan-700", bgColor: "bg-cyan-50",
    timing: "各設備安裝完成後",
    description: "衛浴設備、廚房設備、空調等的安裝驗收。重點在功能測試。",
    participants: ["設計師", "設備廠商/水電工班", "業主"],
    documents: ["設備型錄", "保固書", "操作說明"],
    checkItems: [
      { item: "品牌型號正確", standard: "與訂購單一致", method: "核對型號銘牌", commonDefect: "送錯型號", tip: "開箱時立即核對" },
      { item: "功能測試", standard: "所有功能正常運作", method: "逐項功能測試", commonDefect: "某些功能故障", tip: "馬桶沖水、免治座所有按鈕都要試" },
      { item: "安裝牢固", standard: "無晃動、無漏水", method: "搖晃測試+觀察接縫", commonDefect: "底座沒打矽利康", tip: "馬桶底部和洗手台底部要確認密封" },
      { item: "配件齊全", standard: "所有配件/耗材/說明書齊全", method: "清點", commonDefect: "遙控器、說明書遺失", tip: "配件清單拍照存檔" },
    ],
    paymentNote: "安裝完成+功能測試通過後支付",
  },
  {
    key: "final", name: "完工總驗收", icon: "✅", color: "text-emerald-700", bgColor: "bg-emerald-50",
    timing: "所有工程完成、清潔完畢後",
    description: "最終驗收。逐區逐項走一遍，列出所有缺失清單，限期改善後才能支付尾款。",
    participants: ["設計師", "所有相關工班", "業主（必須到場）"],
    documents: ["缺失清單", "各工種保固書", "竣工照片", "維護手冊"],
    checkItems: [
      { item: "逐區走驗", standard: "每個房間從天花板→牆面→地面→門窗逐項檢查", method: "帶缺失清單逐區走", commonDefect: "只看大面，忽略角落細節", tip: "帶手電筒、拍照手機、便利貼" },
      { item: "開關/插座測試", standard: "全部通電且對應正確", method: "逐一開關測試", commonDefect: "開關對應錯誤的燈", tip: "標記每個開關控制的對象" },
      { item: "門窗開關", standard: "順暢開關、密合無縫", method: "每扇門窗開關測試", commonDefect: "門片刮地板", tip: "注意門的上下左右縫隙是否均等" },
      { item: "清潔完成", standard: "無灰塵、無殘膠、無保護膜殘留", method: "目視", commonDefect: "窗框殘膠、地板灰塵", tip: "要求做深層清潔才算完工" },
      { item: "保固文件", standard: "收齊所有工種保固書", method: "清點", commonDefect: "口頭承諾但沒有書面", tip: "沒有書面保固 = 沒有保固" },
      { item: "鑰匙/遙控移交", standard: "所有鑰匙、遙控器移交完畢", method: "清點", commonDefect: "備用鑰匙忘記交", tip: "列清單一一確認" },
    ],
    paymentNote: "缺失全部改善完成後支付最終尾款。保留 5% 保固保留款（依合約）",
  },
];

export default function InspectionKnowledgePage() {
  const [selectedPhase, setSelectedPhase] = useState<TradeKey>("demolition");
  const [expandedItem, setExpandedItem] = useState<number | null>(null);

  const current = phases.find(p => p.key === selectedPhase)!;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">📚 驗收流程知識庫</h1>
        <p className="text-sm text-slate-500 mt-1">9 大工種驗收標準 · 檢查方法 · 常見缺失 · 實戰技巧</p>
      </div>

      {/* Phase selector — 橫向捲動 */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
        {phases.map(p => (
          <button key={p.key} onClick={() => { setSelectedPhase(p.key); setExpandedItem(null); }} className={clsx(
            "flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all shrink-0",
            selectedPhase === p.key ? `${p.bgColor} ${p.color} ring-2 ring-offset-1 ring-slate-300` : "bg-slate-100 text-slate-600"
          )}>
            <span>{p.icon}</span>{p.name}
          </button>
        ))}
      </div>

      {/* Phase detail */}
      <div className="space-y-4">
        {/* Header card */}
        <div className={clsx("rounded-2xl p-6", current.bgColor)}>
          <div className="flex items-start gap-4">
            <span className="text-4xl">{current.icon}</span>
            <div className="flex-1">
              <h2 className={clsx("text-xl font-bold", current.color)}>{current.name}</h2>
              <p className="text-sm text-slate-700 mt-1 leading-relaxed">{current.description}</p>
              <div className="flex flex-wrap gap-4 mt-3 text-xs">
                <div>
                  <span className="text-slate-500">⏰ 驗收時機：</span>
                  <span className="font-medium text-slate-800">{current.timing}</span>
                </div>
                <div>
                  <span className="text-slate-500">👥 參與人員：</span>
                  <span className="font-medium text-slate-800">{current.participants.join("、")}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {current.documents.map(d => (
                  <span key={d} className="text-[10px] px-2 py-0.5 rounded-full bg-white/70 text-slate-600">📄 {d}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Check items */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-slate-700">檢查項目（{current.checkItems.length} 項）</h3>
          {current.checkItems.map((item, idx) => (
            <div key={idx} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <button
                onClick={() => setExpandedItem(expandedItem === idx ? null : idx)}
                className="w-full text-left px-5 py-3.5 flex items-center gap-3"
              >
                <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500 shrink-0">{idx + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-slate-900">{item.item}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{item.standard}</p>
                </div>
                <span className="text-slate-400 text-sm">{expandedItem === idx ? "▲" : "▼"}</span>
              </button>
              {expandedItem === idx && (
                <div className="px-5 pb-4 space-y-3 border-t border-slate-100 pt-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="bg-blue-50 rounded-lg p-3">
                      <p className="text-[10px] font-semibold text-blue-600 mb-1">🔍 檢查方法</p>
                      <p className="text-xs text-slate-700">{item.method}</p>
                    </div>
                    <div className="bg-red-50 rounded-lg p-3">
                      <p className="text-[10px] font-semibold text-red-600 mb-1">⚠️ 常見缺失</p>
                      <p className="text-xs text-slate-700">{item.commonDefect}</p>
                    </div>
                    <div className="bg-emerald-50 rounded-lg p-3">
                      <p className="text-[10px] font-semibold text-emerald-600 mb-1">💡 實戰技巧</p>
                      <p className="text-xs text-slate-700">{item.tip}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Payment note */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <span className="text-lg">💰</span>
          <div>
            <p className="text-sm font-semibold text-amber-900">付款節點</p>
            <p className="text-xs text-amber-800 mt-0.5">{current.paymentNote}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
