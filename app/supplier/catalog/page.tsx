"use client";

import { useState } from "react";
import { clsx } from "clsx";

type Product = {
  id: number;
  name: string;
  category: string;
  brand: string;
  model: string;
  price: number;
  unit: string;
  stock: number;
  minOrder: number;
  specs: string;
  origin: string;
  gradient: string;
};

const categories = [
  { key: "all", label: "全部", icon: "📋" },
  { key: "tile", label: "磁磚", icon: "🧱" },
  { key: "floor", label: "木地板", icon: "🪵" },
  { key: "bathroom", label: "衛浴", icon: "🚿" },
  { key: "hardware", label: "五金", icon: "🔩" },
  { key: "paint", label: "油漆", icon: "🎨" },
];

const mockProducts: Product[] = [
  // 磁磚
  { id: 1, name: "霧面拋光石英磚 60x60", category: "tile", brand: "冠軍磁磚", model: "CG-6601", price: 180, unit: "片", stock: 5200, minOrder: 50, specs: "60x60cm / 霧面 / 止滑R10 / 吸水率<0.5%", origin: "台灣", gradient: "from-slate-300 to-slate-500" },
  { id: 2, name: "木紋磁磚 20x120", category: "tile", brand: "冠軍磁磚", model: "CG-2012W", price: 220, unit: "片", stock: 3800, minOrder: 30, specs: "20x120cm / 數位噴墨 / 仿實木紋理 / 防滑", origin: "台灣", gradient: "from-amber-300 to-amber-500" },
  { id: 3, name: "六角花磚 莫蘭迪灰", category: "tile", brand: "冠軍磁磚", model: "CG-HEX03", price: 280, unit: "片", stock: 1200, minOrder: 20, specs: "20x23cm / 霧面 / 復古花色 / 適合拼貼", origin: "台灣", gradient: "from-gray-300 to-gray-500" },
  { id: 4, name: "大理石紋薄板 120x240", category: "tile", brand: "白馬磁磚", model: "BM-1224M", price: 850, unit: "片", stock: 480, minOrder: 10, specs: "120x240cm / 厚度6mm / 魚肚白紋理 / 可切割", origin: "台灣", gradient: "from-gray-100 to-gray-300" },

  // 木地板
  { id: 5, name: "超耐磨木地板 淺橡木", category: "floor", brand: "EGGER", model: "EPL-039", price: 3200, unit: "坪", stock: 320, minOrder: 5, specs: "厚度8mm / AC4等級 / E1低甲醛 / 卡扣式", origin: "奧地利", gradient: "from-amber-200 to-amber-400" },
  { id: 6, name: "超耐磨木地板 深胡桃", category: "floor", brand: "EGGER", model: "EPL-058", price: 3500, unit: "坪", stock: 180, minOrder: 5, specs: "厚度10mm / AC5等級 / E0低甲醛 / 靜音底墊", origin: "奧地利", gradient: "from-amber-600 to-amber-800" },
  { id: 7, name: "SPC石塑地板 橡木色", category: "floor", brand: "富銘地板", model: "FM-SPC08", price: 2800, unit: "坪", stock: 450, minOrder: 5, specs: "厚度5.5mm / 防水100% / IXPE底墊 / 零甲醛", origin: "台灣", gradient: "from-yellow-300 to-amber-400" },

  // 衛浴
  { id: 8, name: "免治馬桶座 瞬熱型", category: "bathroom", brand: "TOTO", model: "TCF-6631T", price: 18500, unit: "台", stock: 85, minOrder: 1, specs: "瞬熱式 / 自動除菌 / 暖風乾燥 / 省電模式", origin: "日本", gradient: "from-sky-200 to-blue-400" },
  { id: 9, name: "壁掛式馬桶", category: "bathroom", brand: "TOTO", model: "CW-162", price: 24000, unit: "台", stock: 32, minOrder: 1, specs: "隱藏水箱 / 龍捲沖水 / 智潔釉面 / 省空間", origin: "日本", gradient: "from-blue-200 to-indigo-300" },
  { id: 10, name: "淋浴花灑組 恆溫型", category: "bathroom", brand: "凱撒衛浴", model: "CS-S24T", price: 12800, unit: "組", stock: 64, minOrder: 1, specs: "恆溫閥芯 / 頂噴+手持 / 304不鏽鋼 / 防燙設計", origin: "台灣", gradient: "from-cyan-200 to-teal-400" },
  { id: 11, name: "浴室櫃組 80cm", category: "bathroom", brand: "和成 HCG", model: "BA-8205", price: 15600, unit: "組", stock: 28, minOrder: 1, specs: "PVC防水板材 / 陶瓷洗手台 / 軟關緩衝 / 含鏡櫃", origin: "台灣", gradient: "from-teal-200 to-emerald-300" },

  // 五金
  { id: 12, name: "隱藏式鉸鏈", category: "hardware", brand: "BLUM", model: "71B3550", price: 180, unit: "個", stock: 8500, minOrder: 20, specs: "110度 / 緩衝關閉 / 免工具調整 / 鍍鎳", origin: "奧地利", gradient: "from-slate-500 to-slate-700" },
  { id: 13, name: "抽屜滑軌 全開式", category: "hardware", brand: "BLUM", model: "560H5500", price: 420, unit: "對", stock: 3200, minOrder: 10, specs: "550mm / 全展開 / 承重30kg / BLUMOTION緩衝", origin: "奧地利", gradient: "from-zinc-400 to-zinc-600" },
  { id: 14, name: "門把手 霧黑圓管", category: "hardware", brand: "LIAN LONG", model: "LL-H128B", price: 280, unit: "支", stock: 1800, minOrder: 10, specs: "孔距128mm / 鋁合金 / 霧面黑 / 附螺絲", origin: "台灣", gradient: "from-gray-600 to-gray-800" },

  // 油漆
  { id: 15, name: "乳膠漆 純淨白 5加侖", category: "paint", brand: "虹牌", model: "450-001", price: 3800, unit: "桶", stock: 240, minOrder: 2, specs: "水性環保 / 低VOC / 防霉抗菌 / 可調色", origin: "台灣", gradient: "from-gray-50 to-gray-200" },
  { id: 16, name: "全效乳膠漆 1加侖", category: "paint", brand: "得利", model: "A986-WH", price: 1650, unit: "罐", stock: 380, minOrder: 2, specs: "竹炭配方 / 淨味技術 / 抗甲醛 / 防潮", origin: "台灣", gradient: "from-emerald-50 to-emerald-200" },
  { id: 17, name: "防水漆 透明彈性", category: "paint", brand: "青葉", model: "QY-WP01", price: 2200, unit: "桶", stock: 150, minOrder: 3, specs: "5加侖 / 彈性防水 / 可塗刷於潮濕面 / 耐候10年", origin: "台灣", gradient: "from-blue-100 to-blue-300" },
];

export default function CatalogPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "price-asc" | "price-desc" | "stock">("name");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [editingStock, setEditingStock] = useState<number | null>(null);
  const [editingPrice, setEditingPrice] = useState<number | null>(null);

  const filtered = mockProducts
    .filter((p) => activeCategory === "all" || p.category === activeCategory)
    .filter((p) => !search || p.name.includes(search) || p.brand.includes(search) || p.model.includes(search))
    .sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "stock") return b.stock - a.stock;
      return a.name.localeCompare(b.name);
    });

  const categoryCount = (key: string) =>
    key === "all" ? mockProducts.length : mockProducts.filter((p) => p.category === key).length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">產品目錄</h1>
          <p className="text-sm text-slate-500 mt-1">管理您的建材商品，共 {mockProducts.length} 項產品</p>
        </div>
        <button className="px-4 py-2.5 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors shrink-0">
          + 新增產品
        </button>
      </div>

      {/* Search & Sort */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="搜尋產品名稱、品牌、型號..."
          className="border border-slate-300 rounded-lg px-3 py-2.5 text-sm w-full sm:w-80 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 min-h-[44px]"
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 min-h-[44px]"
        >
          <option value="name">依名稱排序</option>
          <option value="price-asc">價格低→高</option>
          <option value="price-desc">價格高→低</option>
          <option value="stock">依庫存排序</option>
        </select>
      </div>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className={clsx(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
              activeCategory === cat.key
                ? "bg-emerald-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            )}
          >
            <span>{cat.icon}</span>
            {cat.label}
            <span className={clsx(
              "text-xs ml-1 px-1.5 py-0.5 rounded-full",
              activeCategory === cat.key ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-500"
            )}>
              {categoryCount(cat.key)}
            </span>
          </button>
        ))}
      </div>

      {/* Product Cards */}
      <div className="space-y-3">
        {filtered.map((product) => (
          <div key={product.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="flex flex-col sm:flex-row">
              {/* Image placeholder */}
              <div className={clsx("h-32 sm:h-auto sm:w-40 bg-gradient-to-br flex items-center justify-center shrink-0", product.gradient)}>
                <span className="text-white/50 text-3xl">
                  {product.category === "tile" ? "🧱" : product.category === "floor" ? "🪵" : product.category === "bathroom" ? "🚿" : product.category === "hardware" ? "🔩" : "🎨"}
                </span>
              </div>

              {/* Info */}
              <div className="flex-1 p-4">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-slate-900">{product.name}</h3>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">{product.brand}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">{product.model}</span>
                      <span className="text-xs text-slate-400">產地：{product.origin}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xl font-bold text-emerald-600">
                      NT$ {product.price.toLocaleString()}
                    </p>
                    <p className="text-xs text-slate-400">/ {product.unit}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-slate-500">
                  <span className={clsx(
                    "px-2 py-0.5 rounded-full",
                    product.stock > 100 ? "bg-emerald-50 text-emerald-700" : product.stock > 20 ? "bg-amber-50 text-amber-700" : "bg-red-50 text-red-700"
                  )}>
                    庫存 {product.stock.toLocaleString()} {product.unit}
                  </span>
                  <span className="text-slate-400">最低訂量 {product.minOrder} {product.unit}</span>
                </div>

                <button
                  onClick={() => setExpandedId(expandedId === product.id ? null : product.id)}
                  className="text-xs text-emerald-600 hover:text-emerald-700 font-medium mt-2"
                >
                  {expandedId === product.id ? "收起詳情 ▲" : "展開詳情 ▼"}
                </button>

                {expandedId === product.id && (
                  <div className="mt-3 pt-3 border-t border-slate-100 space-y-3">
                    <div>
                      <p className="text-xs font-medium text-slate-500">規格說明</p>
                      <p className="text-sm text-slate-700">{product.specs}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setEditingPrice(editingPrice === product.id ? null : product.id)}
                        className="px-3 py-1.5 text-xs font-medium rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
                      >
                        調整價格
                      </button>
                      <button
                        onClick={() => setEditingStock(editingStock === product.id ? null : product.id)}
                        className="px-3 py-1.5 text-xs font-medium rounded-lg border border-emerald-300 text-emerald-700 hover:bg-emerald-50 transition-colors"
                      >
                        更新庫存
                      </button>
                      <button className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50 transition-colors">
                        編輯產品
                      </button>
                    </div>
                    {editingPrice === product.id && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-500">新價格：NT$</span>
                        <input type="number" defaultValue={product.price} className="border border-slate-300 rounded-lg px-3 py-1.5 text-sm w-32 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" />
                        <button className="px-3 py-1.5 text-xs font-medium rounded-lg bg-emerald-600 text-white hover:bg-emerald-700">確認</button>
                      </div>
                    )}
                    {editingStock === product.id && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-500">新庫存：</span>
                        <input type="number" defaultValue={product.stock} className="border border-slate-300 rounded-lg px-3 py-1.5 text-sm w-32 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" />
                        <span className="text-sm text-slate-400">{product.unit}</span>
                        <button className="px-3 py-1.5 text-xs font-medium rounded-lg bg-emerald-600 text-white hover:bg-emerald-700">確認</button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-slate-400">
          <p className="text-lg">找不到符合條件的產品</p>
          <p className="text-sm mt-1">請嘗試其他搜尋條件或分類</p>
        </div>
      )}
    </div>
  );
}
