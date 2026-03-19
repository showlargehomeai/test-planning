"use client";

import { useState } from "react";
import { clsx } from "clsx";

const categories = ["全部", "地板", "磁磚", "油漆", "壁紙", "五金", "燈具", "衛浴", "廚具"];

const mockMaterials = [
  { id: 1, name: "超耐磨木地板 — 淺橡木色", category: "地板", brand: "EGGER", origin: "奧地利", price: 3200, unit: "坪", rating: 4.8, stock: "有貨", specs: "厚度 8mm / AC4 等級 / E1 低甲醛", suppliers: ["大統建材", "永豐地板"], gradient: "from-amber-200 to-amber-400" },
  { id: 2, name: "六角花磚 — 莫蘭迪灰", category: "磁磚", brand: "冠軍磁磚", origin: "台灣", price: 180, unit: "片", rating: 4.5, stock: "有貨", specs: "20x23cm / 霧面 / 止滑 R10", suppliers: ["冠軍直營", "三洋磁磚"], gradient: "from-slate-300 to-slate-500" },
  { id: 3, name: "虹牌乳膠漆 — 純淨白", category: "油漆", brand: "虹牌", origin: "台灣", price: 850, unit: "加侖", rating: 4.6, stock: "有貨", specs: "水性環保 / 低 VOC / 防霉抗菌", suppliers: ["虹牌直營", "特力屋"], gradient: "from-gray-100 to-gray-300" },
  { id: 4, name: "北歐風格壁紙 — 森林圖騰", category: "壁紙", brand: "Sandberg", origin: "瑞典", price: 4500, unit: "捲", rating: 4.9, stock: "需預訂", specs: "53cm x 10.05m / 無紡布 / 環保印刷", suppliers: ["尚品壁紙", "歐風家飾"], gradient: "from-green-200 to-emerald-400" },
  { id: 5, name: "隱藏式把手 — 霧黑", category: "五金", brand: "BLUM", origin: "奧地利", price: 320, unit: "個", rating: 4.7, stock: "有貨", specs: "鋁合金 / 128mm 孔距 / 霧面處理", suppliers: ["BLUM 代理", "鴻記五金"], gradient: "from-slate-600 to-slate-800" },
  { id: 6, name: "軌道燈 — 可調色溫", category: "燈具", brand: "Philips", origin: "荷蘭", price: 1800, unit: "組", rating: 4.4, stock: "有貨", specs: "12W / 2700K-6500K / Ra>90 / 可調角度", suppliers: ["飛利浦直營", "燈飾王"], gradient: "from-yellow-200 to-amber-300" },
  { id: 7, name: "免治馬桶座 — 瞬熱型", category: "衛浴", brand: "TOTO", origin: "日本", price: 18500, unit: "台", rating: 4.9, stock: "有貨", specs: "瞬熱式 / 自動除菌 / 暖風乾燥 / 省電", suppliers: ["TOTO 直營", "凱撒衛浴"], gradient: "from-sky-200 to-blue-400" },
  { id: 8, name: "人造石檯面 — 雪白", category: "廚具", brand: "Corian", origin: "美國", price: 8500, unit: "才", rating: 4.6, stock: "需預訂", specs: "厚度 12mm / 無孔隙 / 可修復 / 抗菌", suppliers: ["杜邦代理", "廚具世界"], gradient: "from-gray-50 to-gray-200" },
];

export default function MaterialsPage() {
  const [category, setCategory] = useState("全部");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "price" | "rating">("rating");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const filtered = mockMaterials
    .filter((m) => category === "全部" || m.category === category)
    .filter((m) => !search || m.name.includes(search) || m.brand.includes(search))
    .sort((a, b) => sortBy === "price" ? a.price - b.price : sortBy === "rating" ? b.rating - a.rating : a.name.localeCompare(b.name));

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">🧱 建材資料庫</h1>
        <p className="text-sm text-slate-500 mt-1">搜尋比價，找到最適合的建材</p>
      </div>

      {/* Search & Sort */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="搜尋建材名稱、品牌..."
          className="border border-slate-300 rounded-lg px-3 py-2.5 text-sm w-full sm:w-72 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[44px]"
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as "name" | "price" | "rating")}
          className="border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[44px]"
        >
          <option value="rating">依評分排序</option>
          <option value="price">依價格排序</option>
          <option value="name">依名稱排序</option>
        </select>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={clsx(
              "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
              category === cat ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Materials Cards */}
      <div className="space-y-3">
        {filtered.map((mat) => (
          <div key={mat.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="flex flex-col sm:flex-row">
              {/* Image */}
              <div className={clsx("h-32 sm:h-auto sm:w-40 bg-gradient-to-br flex items-center justify-center shrink-0", mat.gradient)}>
                <span className="text-white/40 text-3xl">🧱</span>
              </div>

              {/* Info */}
              <div className="flex-1 p-4">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-slate-900">{mat.name}</h3>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">{mat.category}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">{mat.brand}</span>
                      <span className="text-xs text-slate-400">產地：{mat.origin}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xl font-bold text-indigo-600">NT$ {mat.price.toLocaleString()}</p>
                    <p className="text-xs text-slate-400">/ {mat.unit}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <span className="text-amber-400">★</span> {mat.rating}
                  </span>
                  <span className={clsx(
                    "px-2 py-0.5 rounded-full",
                    mat.stock === "有貨" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                  )}>
                    {mat.stock}
                  </span>
                </div>

                <button
                  onClick={() => setExpandedId(expandedId === mat.id ? null : mat.id)}
                  className="text-xs text-indigo-600 hover:text-indigo-700 font-medium mt-2"
                >
                  {expandedId === mat.id ? "收起詳情 ▲" : "展開詳情 ▼"}
                </button>

                {expandedId === mat.id && (
                  <div className="mt-3 pt-3 border-t border-slate-100 space-y-2">
                    <div>
                      <p className="text-xs font-medium text-slate-500">規格</p>
                      <p className="text-sm text-slate-700">{mat.specs}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-500">供應商</p>
                      <div className="flex gap-2 mt-1">
                        {mat.suppliers.map((s) => (
                          <span key={s} className="text-xs px-2 py-1 rounded-lg bg-slate-50 text-slate-600 border border-slate-200">{s}</span>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <button className="px-3 py-1.5 text-xs font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors">
                        加入報價單
                      </button>
                      <button className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50 transition-colors">
                        比價
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
