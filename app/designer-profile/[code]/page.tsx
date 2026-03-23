"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Star,
  MapPin,
  Calendar,
  Phone,
  Mail,
  Globe,
  Heart,
  Share2,
  MessageCircle,
  Award,
  TrendingUp,
  Users,
  Home,
  Clock,
  Camera,
  ThumbsUp,
  Eye,
  Filter
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

// 設計師資料介面
interface Designer {
  id: string;
  code: string; // SEO friendly URL code
  name: string;
  company_name?: string;
  bio: string;
  location: string;
  experience_years: number;
  specialties: string[];
  styles: string[];
  contact: {
    phone?: string;
    email?: string;
    website?: string;
    instagram?: string;
    facebook?: string;
    line_id?: string;
  };
  profile_image?: string;
  cover_image?: string;
  rating: number;
  review_count: number;
  project_count: number;
  is_certified: boolean;
  is_featured: boolean;
  awards: string[];
  certifications: string[];
  created_at: string;
  last_active: string;
}

// 作品集介面
interface Portfolio {
  id: string;
  title: string;
  description: string;
  style: string;
  area: number;
  budget: number;
  location: string;
  images: string[];
  featured_image: string;
  tags: string[];
  project_duration: number;
  completion_year: number;
  client_type: string; // residential, commercial, office
  view_count: number;
  like_count: number;
  created_at: string;
}

// 評價介面
interface Review {
  id: string;
  client_name: string;
  rating: number;
  comment: string;
  project_style: string;
  project_budget: number;
  created_at: string;
  is_verified: boolean;
  helpful_count: number;
  response?: string; // 設計師回覆
}

// Mock 設計師資料
const mockDesignerData: Designer = {
  id: "designer23",
  code: "li-hao-design",
  name: "裏好製造所",
  bio: "專注於現代簡約與混搭風格的室內設計，11年來致力於創造功能與美學並重的居住空間。擅長小坪數空間規劃與收納設計，已完成44個精選案例，深受客戶好評。",
  location: "台北市中山區",
  experience_years: 11,
  specialties: ["空間規劃", "系統櫃設計", "色彩搭配", "收納設計", "照明設計"],
  styles: ["現代風", "混搭風", "日式風", "北歐風"],
  contact: {
    phone: "02-2545-8888",
    email: "contact@lihaodesign.com",
    website: "https://lihaodesign.com",
    instagram: "@lihao_design",
    facebook: "裏好製造所",
    line_id: "@lihaodesign"
  },
  profile_image: "/images/designers/lihao-profile.jpg",
  cover_image: "/images/designers/lihao-cover.jpg",
  rating: 4.8,
  review_count: 23,
  project_count: 44,
  is_certified: true,
  is_featured: true,
  awards: ["2023年台北設計獎優選", "2022年空間設計金獎"],
  certifications: ["室內設計技術士證照", "建築物室內裝修專業技術人員"],
  created_at: "2013-03-15",
  last_active: "2024-03-22"
};

// Mock 作品集資料
const mockPortfolios: Portfolio[] = [
  {
    id: "portfolio-001",
    title: "信義區現代簡約宅",
    description: "25坪小空間的極致利用，透過開放式格局設計與純白色調，打造清新明亮的居住空間。運用系統櫃與隱藏式收納，讓每一寸空間都發揮最大效用。",
    style: "現代風",
    area: 25.5,
    budget: 950000,
    location: "台北市信義區",
    images: [
      "/images/portfolio/modern-01-1.jpg",
      "/images/portfolio/modern-01-2.jpg",
      "/images/portfolio/modern-01-3.jpg",
      "/images/portfolio/modern-01-4.jpg"
    ],
    featured_image: "/images/placeholder-modern.jpg",
    tags: ["小坪數", "開放式", "系統櫃", "收納", "採光"],
    project_duration: 45,
    completion_year: 2024,
    client_type: "residential",
    view_count: 1250,
    like_count: 89,
    created_at: "2024-01-15"
  },
  {
    id: "portfolio-002",
    title: "大安區混搭風親子宅",
    description: "40坪三房兩廳的溫馨設計，結合現代與北歐元素，以木質調與白色為主軸，搭配繽紛色彩點綴，創造適合親子共處的居家空間。",
    style: "混搭風",
    area: 40.0,
    budget: 1200000,
    location: "台北市大安區",
    images: [
      "/images/portfolio/mixed-02-1.jpg",
      "/images/portfolio/mixed-02-2.jpg",
      "/images/portfolio/mixed-02-3.jpg"
    ],
    featured_image: "/images/placeholder-mixed.jpg",
    tags: ["親子", "木質", "收納", "安全", "明亮"],
    project_duration: 60,
    completion_year: 2023,
    client_type: "residential",
    view_count: 945,
    like_count: 67,
    created_at: "2023-11-28"
  },
  {
    id: "portfolio-003",
    title: "松山區日式禪風住宅",
    description: "15坪日式極簡設計，運用榻榻米、格柵、和室拉門等元素，在有限空間中創造禪意的生活美學。",
    style: "日式風",
    area: 15.0,
    budget: 650000,
    location: "台北市松山區",
    images: [
      "/images/portfolio/japanese-03-1.jpg",
      "/images/portfolio/japanese-03-2.jpg"
    ],
    featured_image: "/images/placeholder-japanese.jpg",
    tags: ["日式", "極簡", "榻榻米", "格柵", "禪風"],
    project_duration: 35,
    completion_year: 2023,
    client_type: "residential",
    view_count: 1180,
    like_count: 94,
    created_at: "2023-08-20"
  }
];

// Mock 評價資料
const mockReviews: Review[] = [
  {
    id: "review-001",
    client_name: "陳小姐",
    rating: 5,
    comment: "裏好製造所的設計師非常專業，從初期的需求討論到最終完工，每個細節都處理得很棒。空間規劃超出我的預期，收納功能也設計得很實用。施工期間的溝通也很順暢，真的很推薦！",
    project_style: "現代風",
    project_budget: 950000,
    created_at: "2024-02-15",
    is_verified: true,
    helpful_count: 12,
    response: "謝謝陳小姐的肯定！很高興能為您打造理想的居住空間，未來如有任何需求都歡迎聯繫我們。"
  },
  {
    id: "review-002", 
    client_name: "王先生",
    rating: 4,
    comment: "設計風格很符合我們家的需求，小朋友也很喜歡新的空間。設計師在安全性方面考慮得很周到，工期也如期完成。唯一小建議是希望在材質選擇上能有更多選項。",
    project_style: "混搭風",
    project_budget: 1200000,
    created_at: "2024-01-08",
    is_verified: true,
    helpful_count: 8,
    response: "謝謝王先生的建議，我們會在未來的專案中提供更多材質選擇。很開心小朋友喜歡新空間！"
  },
  {
    id: "review-003",
    client_name: "李太太",
    rating: 5,
    comment: "從來沒想過15坪可以設計得這麼有質感！設計師的日式風格掌握得很到位，每個角落都充滿禪意。朋友來都讚不絕口，真的很感謝專業的設計團隊。",
    project_style: "日式風",
    project_budget: 650000,
    created_at: "2023-12-20",
    is_verified: true,
    helpful_count: 15
  }
];

export default function DesignerProfilePage() {
  const params = useParams();
  const designerCode = params.code as string;
  
  const [designer, setDesigner] = useState<Designer | null>(null);
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Tab 狀態
  const [activeTab, setActiveTab] = useState("portfolios");
  const [portfolioFilter, setPortfolioFilter] = useState("all");

  // 初始化資料
  useEffect(() => {
    const fetchDesignerData = async () => {
      try {
        setLoading(true);
        
        // 模擬 API 呼叫
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (designerCode === "li-hao-design") {
          setDesigner(mockDesignerData);
          setPortfolios(mockPortfolios);
          setReviews(mockReviews);
        } else {
          throw new Error("設計師不存在");
        }
      } catch (err) {
        console.error('Failed to fetch designer data:', err);
        setError('載入設計師資料失敗');
      } finally {
        setLoading(false);
      }
    };

    if (designerCode) {
      fetchDesignerData();
    }
  }, [designerCode]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="animate-pulse">
          {/* Cover skeleton */}
          <div className="h-64 bg-gray-200"></div>
          {/* Content skeleton */}
          <div className="max-w-6xl mx-auto px-6 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
              <div className="space-y-4">
                <div className="h-48 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !designer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">載入失敗</h2>
          <p className="text-gray-600">{error || "找不到該設計師"}</p>
        </div>
      </div>
    );
  }

  // 篩選作品集
  const filteredPortfolios = portfolios.filter(portfolio => {
    if (portfolioFilter === "all") return true;
    return portfolio.style === portfolioFilter;
  });

  const formatBudget = (budget: number) => {
    if (budget >= 10000) {
      return `${(budget / 10000).toFixed(1)}萬`;
    }
    return `${budget.toLocaleString()}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cover Image */}
      <div 
        className="h-64 bg-gradient-to-r from-blue-500 to-purple-600 relative"
        style={{ 
          background: designer.cover_image 
            ? `url(${designer.cover_image})` 
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="absolute bottom-6 left-6 text-white">
          <h1 className="text-3xl font-bold">{designer.name}</h1>
          <p className="text-lg opacity-90">{designer.company_name}</p>
        </div>
        
        {/* Action buttons */}
        <div className="absolute bottom-6 right-6 flex gap-3">
          <Button variant="secondary" size="sm" className="gap-2">
            <Share2 className="w-4 h-4" />
            分享
          </Button>
          <Button variant="secondary" size="sm" className="gap-2">
            <Heart className="w-4 h-4" />
            收藏
          </Button>
          <Button className="gap-2">
            <MessageCircle className="w-4 h-4" />
            諮詢
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Basic Info */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-gray-600">
                      {designer.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-2xl font-bold text-gray-900">{designer.name}</h2>
                      {designer.is_certified && (
                        <Badge className="bg-blue-500 gap-1">
                          <Award className="w-3 h-3" />
                          認證設計師
                        </Badge>
                      )}
                      {designer.is_featured && (
                        <Badge className="bg-yellow-500">精選設計師</Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{designer.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{designer.experience_years} 年經驗</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{designer.rating}</span>
                        <span className="text-gray-400">({designer.review_count} 評價)</span>
                      </div>
                    </div>

                    <p className="text-gray-700 leading-relaxed">{designer.bio}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{designer.project_count}</div>
                  <div className="text-sm text-gray-600">完成專案</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">{designer.review_count}</div>
                  <div className="text-sm text-gray-600">客戶評價</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">{designer.rating}</div>
                  <div className="text-sm text-gray-600">平均評分</div>
                </CardContent>
              </Card>
            </div>

            {/* Main Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-3 w-full mb-6">
                <TabsTrigger value="portfolios" className="gap-2">
                  <Camera className="w-4 h-4" />
                  作品集 ({portfolios.length})
                </TabsTrigger>
                <TabsTrigger value="reviews" className="gap-2">
                  <Star className="w-4 h-4" />
                  評價 ({reviews.length})
                </TabsTrigger>
                <TabsTrigger value="about" className="gap-2">
                  <Users className="w-4 h-4" />
                  關於我們
                </TabsTrigger>
              </TabsList>

              <TabsContent value="portfolios">
                {/* Portfolio filters */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">篩選風格：</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge 
                      variant={portfolioFilter === "all" ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => setPortfolioFilter("all")}
                    >
                      全部 ({portfolios.length})
                    </Badge>
                    {designer.styles.map(style => {
                      const count = portfolios.filter(p => p.style === style).length;
                      if (count === 0) return null;
                      return (
                        <Badge 
                          key={style}
                          variant={portfolioFilter === style ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => setPortfolioFilter(style)}
                        >
                          {style} ({count})
                        </Badge>
                      );
                    })}
                  </div>
                </div>

                {/* Portfolio grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredPortfolios.map((portfolio) => (
                    <PortfolioCard key={portfolio.id} portfolio={portfolio} />
                  ))}
                </div>

                {filteredPortfolios.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-gray-400 text-6xl mb-4">📷</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">沒有符合條件的作品</h3>
                    <p className="text-gray-600">請選擇其他風格篩選</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="reviews">
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="about">
                <div className="space-y-6">
                  {/* Specialties */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">專業領域</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {designer.specialties.map((specialty) => (
                          <Badge key={specialty} variant="secondary">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Certifications & Awards */}
                  {(designer.certifications.length > 0 || designer.awards.length > 0) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {designer.certifications.length > 0 && (
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                              <Award className="w-5 h-5" />
                              專業證照
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ul className="space-y-2">
                              {designer.certifications.map((cert, index) => (
                                <li key={index} className="text-sm text-gray-700">• {cert}</li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                      )}

                      {designer.awards.length > 0 && (
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                              <TrendingUp className="w-5 h-5" />
                              獲獎紀錄
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ul className="space-y-2">
                              {designer.awards.map((award, index) => (
                                <li key={index} className="text-sm text-gray-700">• {award}</li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">聯絡資訊</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {designer.contact.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{designer.contact.phone}</span>
                  </div>
                )}
                {designer.contact.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{designer.contact.email}</span>
                  </div>
                )}
                {designer.contact.website && (
                  <div className="flex items-center gap-3">
                    <Globe className="w-4 h-4 text-gray-500" />
                    <Link href={designer.contact.website} target="_blank" className="text-sm text-blue-600 hover:underline">
                      官方網站
                    </Link>
                  </div>
                )}
                {designer.contact.line_id && (
                  <div className="flex items-center gap-3">
                    <MessageCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">{designer.contact.line_id}</span>
                  </div>
                )}

                <div className="pt-4 border-t">
                  <Button className="w-full gap-2">
                    <MessageCircle className="w-4 h-4" />
                    立即諮詢
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">快速資訊</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">設計經驗</span>
                  <span className="text-sm font-medium">{designer.experience_years} 年</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">完成專案</span>
                  <span className="text-sm font-medium">{designer.project_count} 個</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">平均評分</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{designer.rating}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">最後活動</span>
                  <span className="text-sm font-medium">2 天前</span>
                </div>
              </CardContent>
            </Card>

            {/* Design Styles */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">設計風格</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {designer.styles.map((style) => (
                    <Badge key={style} variant="outline">
                      {style}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

// 作品集卡片元件
function PortfolioCard({ portfolio }: { portfolio: Portfolio }) {
  const formatBudget = (budget: number) => {
    if (budget >= 10000) {
      return `${(budget / 10000).toFixed(1)}萬`;
    }
    return `${budget.toLocaleString()}`;
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
      <div className="relative h-48 bg-gray-100">
        <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
          <span className="text-gray-500 text-sm">作品圖片</span>
        </div>
        <div className="absolute top-3 left-3">
          <Badge variant="secondary" className="text-xs">
            {portfolio.style}
          </Badge>
        </div>
        
        <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
            <Eye className="w-3 h-3" />
            {portfolio.view_count}
          </div>
          <div className="bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
            <Heart className="w-3 h-3" />
            {portfolio.like_count}
          </div>
        </div>
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">{portfolio.title}</h3>
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">{portfolio.description}</p>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-1 text-gray-600">
            <Home className="w-4 h-4" />
            <span>{portfolio.area} 坪</span>
          </div>
          <div className="flex items-center gap-1 text-gray-600">
            <Clock className="w-4 h-4" />
            <span>{portfolio.project_duration} 天</span>
          </div>
          <div className="flex items-center gap-1 text-gray-600">
            <MapPin className="w-4 h-4" />
            <span className="truncate">{portfolio.location}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>{portfolio.completion_year}</span>
          </div>
        </div>

        {portfolio.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {portfolio.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {portfolio.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{portfolio.tags.length - 3}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// 評價卡片元件
function ReviewCard({ review }: { review: Review }) {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-gray-600">
              {review.client_name.charAt(0)}
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-medium text-gray-900">{review.client_name}</h4>
              {review.is_verified && (
                <Badge variant="secondary" className="text-xs">已驗證</Badge>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i}
                    className={cn("w-4 h-4", 
                      i < review.rating 
                        ? "fill-yellow-400 text-yellow-400" 
                        : "text-gray-300"
                    )}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">
                {review.project_style} • {Math.round(review.project_budget / 10000)}萬
              </span>
            </div>
          </div>
        </div>
        <span className="text-sm text-gray-500">
          {new Date(review.created_at).toLocaleDateString('zh-TW')}
        </span>
      </div>

      <p className="text-gray-700 leading-relaxed mb-4">{review.comment}</p>

      {review.response && (
        <div className="bg-blue-50 border-l-4 border-blue-200 p-4 mt-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium text-blue-800">設計師回覆</span>
          </div>
          <p className="text-blue-700 text-sm">{review.response}</p>
        </div>
      )}

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
        <Button variant="ghost" size="sm" className="gap-2 text-gray-500">
          <ThumbsUp className="w-4 h-4" />
          有幫助 ({review.helpful_count})
        </Button>
      </div>
    </Card>
  );
}