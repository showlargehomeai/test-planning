"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const formatArea = (area: number) => `${area}坪`;
const formatBudget = (budget: number) => {
  if (budget >= 10000) return `${(budget / 10000).toFixed(1)}萬`;
  return `${budget.toLocaleString()}`;
};
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search,
  Filter,
  Grid3X3,
  List,
  Heart,
  MapPin,
  Calendar,
  DollarSign,
  User,
  Users,
  Star,
  Eye,
  Building2,
  Palette,
  Wrench,
  Home,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

// 案例介面定義
interface GalleryItem {
  id: string;
  title: string;
  description: string;
  style: string;
  area: number; // 坪數
  budget: number; // 預算
  location: string;
  images: string[];
  featured_image: string;
  tags: string[];
  created_at: string;
  
  // 專家資訊
  expert_type: 'designer' | 'crew';
  expert_id: string;
  expert_name: string;
  expert_avatar?: string;
  expert_rating?: number;
  expert_projects?: number;
  
  // 專案數據
  project_duration?: number; // 工期（天）
  completion_year: number;
  is_featured: boolean;
  view_count: number;
  like_count: number;
}

// Mock 資料 - 模擬真實的 designer_portfolios + crew_portfolios 整合
const mockGalleryData: GalleryItem[] = [
  {
    id: "portfolio-001",
    title: "台北信義區現代簡約住宅",
    description: "25坪小空間的極致利用，透過開放式格局設計與純白色調，打造清新明亮的居住空間。",
    style: "現代風",
    area: 25.5,
    budget: 950000,
    location: "台北市信義區",
    images: [
      "/images/gallery/modern-living-01.jpg",
      "/images/gallery/modern-living-02.jpg",
      "/images/gallery/modern-living-03.jpg"
    ],
    featured_image: "/images/gallery/modern-living-01.jpg",
    tags: ["小坪數", "開放式", "系統櫃", "收納", "採光"],
    created_at: "2024-01-15",
    expert_type: "designer",
    expert_id: "designer23",
    expert_name: "裏好製造所",
    expert_avatar: "/images/avatars/designer-23.jpg",
    expert_rating: 4.8,
    expert_projects: 44,
    project_duration: 45,
    completion_year: 2024,
    is_featured: true,
    view_count: 1250,
    like_count: 89
  },
  {
    id: "portfolio-002", 
    title: "新竹透天別墅窗簾工程",
    description: "MSBT 幔室布緹專業窗簾工程，包含客廳全遮光窗簾、臥室調光簾、書房百葉窗等完整解決方案。",
    style: "現代風",
    area: 45.0,
    budget: 180000,
    location: "新竹市東區",
    images: [
      "/images/gallery/curtain-project-01.jpg",
      "/images/gallery/curtain-project-02.jpg",
      "/images/gallery/curtain-project-03.jpg"
    ],
    featured_image: "/images/gallery/curtain-project-01.jpg",
    tags: ["窗簾", "遮光", "智能系統", "訂製"],
    created_at: "2024-02-10",
    expert_type: "crew",
    expert_id: "msbt",
    expert_name: "MSBT 幔室布緹窗飾",
    expert_avatar: "/images/avatars/crew-msbt.jpg",
    expert_rating: 4.9,
    expert_projects: 10,
    project_duration: 7,
    completion_year: 2024,
    is_featured: false,
    view_count: 680,
    like_count: 45
  },
  {
    id: "portfolio-003",
    title: "台中北歐風親子宅",
    description: "40坪三房兩廳的溫馨設計，以木質調與白色為主軸，搭配繽紛色彩點綴，創造適合親子共處的居家空間。",
    style: "北歐風",
    area: 40.0,
    budget: 1200000,
    location: "台中市西屯區",
    images: [
      "/images/gallery/nordic-family-01.jpg",
      "/images/gallery/nordic-family-02.jpg",
      "/images/gallery/nordic-family-03.jpg"
    ],
    featured_image: "/images/gallery/nordic-family-01.jpg",
    tags: ["親子", "木質", "收納", "安全", "明亮"],
    created_at: "2024-01-28",
    expert_type: "designer",
    expert_id: "designer15",
    expert_name: "森活設計",
    expert_avatar: "/images/avatars/designer-15.jpg",
    expert_rating: 4.7,
    expert_projects: 32,
    project_duration: 60,
    completion_year: 2024,
    is_featured: true,
    view_count: 945,
    like_count: 67
  },
  {
    id: "portfolio-004",
    title: "高雄工業風咖啡廳",
    description: "老屋翻新改造為特色咖啡廳，保留原始結構美感，加入現代化設備與照明，打造獨特的工業風格商空。",
    style: "工業風",
    area: 35.0,
    budget: 800000,
    location: "高雄市鹽埕區",
    images: [
      "/images/gallery/industrial-cafe-01.jpg",
      "/images/gallery/industrial-cafe-02.jpg",
      "/images/gallery/industrial-cafe-03.jpg"
    ],
    featured_image: "/images/gallery/industrial-cafe-01.jpg",
    tags: ["商業空間", "老屋翻新", "工業風", "照明", "磚牆"],
    created_at: "2024-02-05",
    expert_type: "designer",
    expert_id: "designer08",
    expert_name: "築間設計",
    expert_avatar: "/images/avatars/designer-08.jpg",
    expert_rating: 4.6,
    expert_projects: 28,
    project_duration: 90,
    completion_year: 2024,
    is_featured: false,
    view_count: 756,
    like_count: 52
  },
  {
    id: "portfolio-005",
    title: "板橋日式禪風住宅",
    description: "15坪日式極簡設計，運用榻榻米、格柵、和室拉門等元素，在有限空間中創造禪意的生活美學。",
    style: "日式風",
    area: 15.0,
    budget: 650000,
    location: "新北市板橋區",
    images: [
      "/images/gallery/japanese-zen-01.jpg",
      "/images/gallery/japanese-zen-02.jpg",
      "/images/gallery/japanese-zen-03.jpg"
    ],
    featured_image: "/images/gallery/japanese-zen-01.jpg",
    tags: ["日式", "極簡", "榻榻米", "格柵", "禪風"],
    created_at: "2024-01-20",
    expert_type: "designer",
    expert_id: "designer42",
    expert_name: "和風設計工作室",
    expert_avatar: "/images/avatars/designer-42.jpg",
    expert_rating: 4.9,
    expert_projects: 18,
    project_duration: 35,
    completion_year: 2024,
    is_featured: true,
    view_count: 1180,
    like_count: 94
  },
  {
    id: "portfolio-006",
    title: "桃園水電配管工程",
    description: "30坪住宅完整水電重配工程，包含強弱電分離、給排水管路更新、智能家居配線等專業施工。",
    style: "現代風",
    area: 30.0,
    budget: 280000,
    location: "桃園市中壢區",
    images: [
      "/images/gallery/plumbing-electrical-01.jpg",
      "/images/gallery/plumbing-electrical-02.jpg",
      "/images/gallery/plumbing-electrical-03.jpg"
    ],
    featured_image: "/images/gallery/plumbing-electrical-01.jpg",
    tags: ["水電", "配管", "智能家居", "安全", "專業"],
    created_at: "2024-02-12",
    expert_type: "crew",
    expert_id: "crew-elect-01",
    expert_name: "安心電工團隊",
    expert_avatar: "/images/avatars/crew-elect-01.jpg",
    expert_rating: 4.8,
    expert_projects: 156,
    project_duration: 14,
    completion_year: 2024,
    is_featured: false,
    view_count: 423,
    like_count: 31
  }
];

// 篩選選項
const styleOptions = ["全部", "現代風", "北歐風", "工業風", "日式風", "美式風", "鄉村風", "混搭風"];
const areaRanges = [
  { label: "全部", value: "all" },
  { label: "15坪以下", value: "0-15" },
  { label: "15-30坪", value: "15-30" },
  { label: "30-50坪", value: "30-50" },
  { label: "50坪以上", value: "50+" }
];
const budgetRanges = [
  { label: "全部", value: "all" },
  { label: "50萬以下", value: "0-500000" },
  { label: "50-100萬", value: "500000-1000000" },
  { label: "100-150萬", value: "1000000-1500000" },
  { label: "150萬以上", value: "1500000+" }
];
const locationOptions = ["全部", "台北市", "新北市", "桃園市", "台中市", "台南市", "高雄市", "其他"];
const sortOptions = [
  { label: "最新發佈", value: "newest" },
  { label: "最多瀏覽", value: "popular" },
  { label: "最多收藏", value: "liked" },
  { label: "預算由低到高", value: "budget_asc" },
  { label: "坪數由小到大", value: "area_asc" }
];

export default function GalleryPage() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 篩選狀態
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("全部");
  const [selectedArea, setSelectedArea] = useState("all");
  const [selectedBudget, setSelectedBudget] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("全部");
  const [selectedExpertType, setSelectedExpertType] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  
  // UI 狀態
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // 初始化資料
  useEffect(() => {
    const fetchGalleryData = async () => {
      try {
        setLoading(true);
        // 模擬 API 呼叫延遲
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setGalleryItems(mockGalleryData);
        setFilteredItems(mockGalleryData);
      } catch (err) {
        console.error('Failed to fetch gallery data:', err);
        setError('載入案例資料失敗，請稍後重試');
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryData();
  }, []);

  // 篩選和排序邏輯
  useEffect(() => {
    let filtered = [...galleryItems];

    // 搜尋過濾
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
        item.expert_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 風格過濾
    if (selectedStyle !== "全部") {
      filtered = filtered.filter(item => item.style === selectedStyle);
    }

    // 坪數過濾
    if (selectedArea !== "all") {
      const [min, max] = selectedArea === "50+" 
        ? [50, Infinity] 
        : selectedArea.split('-').map(Number);
      filtered = filtered.filter(item => 
        item.area >= min && (max ? item.area <= max : true)
      );
    }

    // 預算過濾
    if (selectedBudget !== "all") {
      if (selectedBudget === "1500000+") {
        filtered = filtered.filter(item => item.budget >= 1500000);
      } else {
        const [min, max] = selectedBudget.split('-').map(Number);
        filtered = filtered.filter(item => 
          item.budget >= min && item.budget <= max
        );
      }
    }

    // 地區過濾
    if (selectedLocation !== "全部") {
      filtered = filtered.filter(item => 
        item.location.includes(selectedLocation)
      );
    }

    // 專家類型過濾
    if (selectedExpertType !== "all") {
      filtered = filtered.filter(item => item.expert_type === selectedExpertType);
    }

    // 排序
    switch (sortBy) {
      case "newest":
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case "popular":
        filtered.sort((a, b) => b.view_count - a.view_count);
        break;
      case "liked":
        filtered.sort((a, b) => b.like_count - a.like_count);
        break;
      case "budget_asc":
        filtered.sort((a, b) => a.budget - b.budget);
        break;
      case "area_asc":
        filtered.sort((a, b) => a.area - b.area);
        break;
    }

    setFilteredItems(filtered);
    setCurrentPage(1); // 重設到第一頁
  }, [galleryItems, searchTerm, selectedStyle, selectedArea, selectedBudget, selectedLocation, selectedExpertType, sortBy]);

  // 分頁資料
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = filteredItems.slice(startIndex, startIndex + itemsPerPage);

  // 統計數據
  const stats = {
    total: galleryItems.length,
    designers: galleryItems.filter(item => item.expert_type === 'designer').length,
    crews: galleryItems.filter(item => item.expert_type === 'crew').length,
    featured: galleryItems.filter(item => item.is_featured).length
  };

  // 格式化函數
  // moved to module scope

  // moved to module scope

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-12 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm h-80"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">載入失敗</h2>
          <p className="text-gray-600">{error}</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="mt-4"
          >
            重新載入
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">案例 Gallery</h1>
              <p className="text-gray-600 mt-2">
                瀏覽 {stats.total} 個精選案例 — 設計師作品 {stats.designers} 個，工班案例 {stats.crews} 個
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="text-blue-600">
                {stats.featured} 個精選案例
              </Badge>
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* 搜尋和快速篩選 */}
          <div className="flex flex-wrap items-center gap-4 mt-6">
            <div className="relative flex-1 min-w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="搜尋案例、風格、標籤或專家名稱..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button 
              variant="outline"
              onClick={() => setFiltersVisible(!filtersVisible)}
              className="gap-2"
            >
              <Filter className="w-4 h-4" />
              進階篩選
              {filtersVisible ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </div>

          {/* 進階篩選面板 */}
          {filtersVisible && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">設計風格</label>
                  <Select value={selectedStyle} onValueChange={setSelectedStyle}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {styleOptions.map((style) => (
                        <SelectItem key={style} value={style}>{style}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">坪數範圍</label>
                  <Select value={selectedArea} onValueChange={setSelectedArea}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {areaRanges.map((range) => (
                        <SelectItem key={range.value} value={range.value}>
                          {range.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">預算範圍</label>
                  <Select value={selectedBudget} onValueChange={setSelectedBudget}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {budgetRanges.map((range) => (
                        <SelectItem key={range.value} value={range.value}>
                          {range.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">地區</label>
                  <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {locationOptions.map((location) => (
                        <SelectItem key={location} value={location}>{location}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">專家類型</label>
                  <Select value={selectedExpertType} onValueChange={setSelectedExpertType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部</SelectItem>
                      <SelectItem value="designer">設計師</SelectItem>
                      <SelectItem value="crew">工班</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* 清除篩選 */}
              <div className="flex justify-end mt-4">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedStyle("全部");
                    setSelectedArea("all");
                    setSelectedBudget("all");
                    setSelectedLocation("全部");
                    setSelectedExpertType("all");
                    setSortBy("newest");
                  }}
                >
                  清除所有篩選
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 內容區 */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* 結果資訊 */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            找到 {filteredItems.length} 個案例
            {searchTerm && (
              <span className="ml-2 text-blue-600">
                包含 "{searchTerm}"
              </span>
            )}
          </p>
          
          {/* Tabs 切換 */}
          <Tabs value={selectedExpertType} onValueChange={setSelectedExpertType}>
            <TabsList>
              <TabsTrigger value="all" className="gap-2">
                <Building2 className="w-4 h-4" />
                全部 ({filteredItems.length})
              </TabsTrigger>
              <TabsTrigger value="designer" className="gap-2">
                <Palette className="w-4 h-4" />
                設計師 ({filteredItems.filter(item => item.expert_type === 'designer').length})
              </TabsTrigger>
              <TabsTrigger value="crew" className="gap-2">
                <Wrench className="w-4 h-4" />
                工班 ({filteredItems.filter(item => item.expert_type === 'crew').length})
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* 案例展示 */}
        {paginatedItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🏠</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">找不到符合條件的案例</h3>
            <p className="text-gray-600">請調整篩選條件或使用其他關鍵字搜尋</p>
          </div>
        ) : (
          <>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedItems.map((item) => (
                  <GalleryCard key={item.id} item={item} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {paginatedItems.map((item) => (
                  <GalleryListItem key={item.id} item={item} />
                ))}
              </div>
            )}

            {/* 分頁控制 */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  上一頁
                </Button>
                
                <div className="flex items-center gap-1">
                  {[...Array(Math.min(totalPages, 5))].map((_, index) => {
                    const page = index + 1;
                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </Button>
                    );
                  })}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  下一頁
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// 卡片元件
function GalleryCard({ item }: { item: GalleryItem }) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
      <div className="relative h-48 bg-gray-100">
        <Image
          src={item.featured_image}
          alt={item.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {item.is_featured && (
          <Badge className="absolute top-3 left-3 bg-yellow-500">
            精選案例
          </Badge>
        )}
        <div className="absolute top-3 right-3 flex gap-2">
          <Badge variant="secondary" className="text-xs">
            {item.style}
          </Badge>
        </div>
        
        {/* 互動按鈕 */}
        <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button size="sm" variant="secondary" className="w-8 h-8 p-0">
            <Heart className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="secondary" className="w-8 h-8 p-0">
            <Eye className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900 line-clamp-1">{item.title}</h3>
        </div>
        
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">{item.description}</p>

        {/* 專案資訊 */}
        <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
          <div className="flex items-center gap-1 text-gray-600">
            <Home className="w-4 h-4" />
            <span>{formatArea(item.area)}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-600">
            <DollarSign className="w-4 h-4" />
            <span>{formatBudget(item.budget)}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-600">
            <MapPin className="w-4 h-4" />
            <span className="truncate">{item.location}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>{item.completion_year}</span>
          </div>
        </div>

        {/* 專家資訊 */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2">
            {item.expert_type === 'designer' ? (
              <User className="w-4 h-4 text-blue-500" />
            ) : (
              <Users className="w-4 h-4 text-green-500" />
            )}
            <span className="text-sm font-medium text-gray-900">
              {item.expert_name}
            </span>
          </div>
          
          {item.expert_rating && (
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{item.expert_rating}</span>
            </div>
          )}
        </div>

        {/* 標籤 */}
        {item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {item.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {item.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{item.tags.length - 3}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// 列表項元件
function GalleryListItem({ item }: { item: GalleryItem }) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        <div className="flex">
          <div className="relative w-48 h-32 bg-gray-100 flex-shrink-0">
            <Image
              src={item.featured_image}
              alt={item.title}
              fill
              className="object-cover"
            />
            {item.is_featured && (
              <Badge className="absolute top-2 left-2 bg-yellow-500 text-xs">
                精選
              </Badge>
            )}
          </div>
          
          <div className="flex-1 p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>
                
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  <span className="flex items-center gap-1">
                    <Home className="w-4 h-4" />
                    {formatArea(item.area)}
                  </span>
                  <span className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    {formatBudget(item.budget)}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {item.location}
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    {item.style}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {item.expert_type === 'designer' ? (
                      <User className="w-4 h-4 text-blue-500" />
                    ) : (
                      <Users className="w-4 h-4 text-green-500" />
                    )}
                    <span className="text-sm font-medium text-gray-900">
                      {item.expert_name}
                    </span>
                    {item.expert_rating && (
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">{item.expert_rating}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {item.view_count}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      {item.like_count}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}