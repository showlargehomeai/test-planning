"use client";

import { useState } from "react";
import { clsx } from "clsx";

export default function DemoPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [activeRole, setActiveRole] = useState<"designer" | "contractor" | "supplier">("designer");

  const ecosystemStats = [
    { label: "活躍設計師", value: "2,847", change: "+23%", icon: "🎨" },
    { label: "註冊工班", value: "1,563", change: "+18%", icon: "👷" },
    { label: "建材供應商", value: "892", change: "+31%", icon: "🏗️" },
    { label: "月活躍專案", value: "4,291", change: "+42%", icon: "📋" }
  ];

  const collaborationFlow = [
    {
      step: 1,
      role: "業主",
      action: "發布需求",
      detail: "上傳空間照片、預算範圍、風格偏好",
      output: "精準需求單"
    },
    {
      step: 2,
      role: "設計師",
      action: "智慧媒合",
      detail: "AI 分析過往案例，推薦最適合的設計師",
      output: "設計提案"
    },
    {
      step: 3,
      role: "工班",
      action: "施工協作",
      detail: "平台自動匹配技能、時程、評價最佳的工班",
      output: "施工排程"
    },
    {
      step: 4,
      role: "建材商",
      action: "供應鏈整合",
      detail: "即時報價、庫存查詢、物流追蹤一站完成",
      output: "材料到場"
    }
  ];

  const roleCapabilities = {
    designer: {
      title: "設計師生態",
      subtitle: "從接案到交付的全流程賦能",
      features: [
        {
          category: "接案獲客",
          items: [
            { name: "AI 業主媒合", desc: "智慧推薦匹配度 >90% 的潛在客戶" },
            { name: "作品集展示", desc: "專業作品集，提升品牌形象" },
            { name: "客戶關係管理", desc: "完整客戶生命週期追蹤" }
          ]
        },
        {
          category: "設計效率",
          items: [
            { name: "智慧報價系統", desc: "基於歷史數據自動生成精準報價" },
            { name: "3D 渲染工具", desc: "快速產出專業級效果圖" },
            { name: "建材資料庫", desc: "10萬+ 建材即時價格比較" }
          ]
        },
        {
          category: "協作管理",
          items: [
            { name: "工班媒合", desc: "平台認證工班，品質有保障" },
            { name: "進度追蹤", desc: "即時掌握施工進度和品質" },
            { name: "財務管理", desc: "收支分析、發票開立、稅務規劃" }
          ]
        }
      ]
    },
    contractor: {
      title: "工班生態",
      subtitle: "專業技能變現，穩定案源供應",
      features: [
        {
          category: "案源穩定",
          items: [
            { name: "智慧派工", desc: "根據技能、地點、時間自動媒合" },
            { name: "評價體系", desc: "建立專業口碑，提升接案競爭力" },
            { name: "技能認證", desc: "平台認證證書，增加客戶信任" }
          ]
        },
        {
          category: "效率提升",
          items: [
            { name: "數位工具", desc: "施工進度回報、品質檢核數位化" },
            { name: "材料管理", desc: "與建材商直連，降低採購成本" },
            { name: "排程優化", desc: "AI 排程避免空檔，提升產能" }
          ]
        },
        {
          category: "收入保障",
          items: [
            { name: "快速收款", desc: "平台擔保，完工即收款" },
            { name: "保險保障", desc: "施工意外險，降低營運風險" },
            { name: "技能培訓", desc: "持續學習新技術，提升單價" }
          ]
        }
      ]
    },
    supplier: {
      title: "建材商生態",
      subtitle: "擴大銷售通路，降低庫存風險",
      features: [
        {
          category: "銷售擴張",
          items: [
            { name: "多元通路", desc: "直接觸達設計師和工班客群" },
            { name: "產品展示", desc: "3D 展間，沉浸式產品體驗" },
            { name: "精準推薦", desc: "基於專案需求智慧推薦產品" }
          ]
        },
        {
          category: "營運優化",
          items: [
            { name: "庫存管理", desc: "需求預測，優化庫存結構" },
            { name: "物流整合", desc: "統一配送，降低物流成本" },
            { name: "金流服務", desc: "帳期管理、應收帳款保障" }
          ]
        },
        {
          category: "數據洞察",
          items: [
            { name: "市場分析", desc: "即時掌握產品熱度和價格趨勢" },
            { name: "客戶畫像", desc: "了解終端使用者偏好" },
            { name: "競品監控", desc: "競爭對手價格和庫存分析" }
          ]
        }
      ]
    }
  };

  const networkEffects = [
    {
      title: "更多設計師 → 更多案例數據",
      desc: "AI 媒合和報價系統越來越精準",
      impact: "+35% 媒合成功率"
    },
    {
      title: "更多工班 → 更快匹配速度",
      desc: "縮短專案啟動時間，提升客戶滿意度", 
      impact: "-40% 平均等待時間"
    },
    {
      title: "更多建材商 → 更好價格競爭",
      desc: "降低項目成本，增加利潤空間",
      impact: "-15% 建材採購成本"
    },
    {
      title: "更多專案 → 更強議價能力",
      desc: "批量採購優勢，回饋生態參與者",
      impact: "+20% 整體利潤率"
    }
  ];

  const competitiveAdvantages = [
    {
      category: "技術領先",
      points: [
        "AI 驅動的智慧媒合，匹配成功率 >90%",
        "3D 建模與 AR 預覽，降低溝通成本",
        "IoT 施工監控，即時品質管控"
      ]
    },
    {
      category: "生態完整",
      points: [
        "三角色閉環，解決行業所有痛點",
        "垂直整合供應鏈，降低 20% 成本", 
        "一站式服務，客戶黏性強"
      ]
    },
    {
      category: "數據壁壘",
      points: [
        "累積 50萬+ 專案數據，建立護城河",
        "預測型分析，降低項目風險",
        "動態定價，最大化平台收益"
      ]
    }
  ];

  return (
    <div className="min-h-full bg-slate-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              LargeHome
            </h1>
            <p className="text-xl sm:text-2xl mb-4 text-blue-100">
              設計師 × 工班 × 建材商
            </p>
            <p className="text-lg sm:text-xl mb-8 text-blue-200 max-w-3xl mx-auto">
              台灣首個裝修行業三角色協作生態平台，用 AI 和數據驅動裝修產業數位轉型
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 max-w-4xl mx-auto">
              {ecosystemStats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl mb-2">{stat.icon}</div>
                  <div className="text-2xl sm:text-3xl font-bold">{stat.value}</div>
                  <div className="text-sm text-blue-200">{stat.label}</div>
                  <div className="text-xs text-green-300">{stat.change}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {[
              { id: "overview", label: "生態概覽", icon: "🌐" },
              { id: "collaboration", label: "協作流程", icon: "🤝" },
              { id: "ecosystem", label: "三角色能力", icon: "⚡" },
              { id: "network", label: "網路效應", icon: "📈" },
              { id: "competitive", label: "競爭優勢", icon: "🏆" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={clsx(
                  "flex items-center gap-2 py-4 px-6 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                  activeTab === tab.id
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                )}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        
        {/* Overview */}
        {activeTab === "overview" && (
          <div className="space-y-12">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                一個平台，解決整個裝修生態的痛點
              </h2>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                傳統裝修行業資訊不對稱、協作效率低、成本控制難。LargeHome 透過數位化和 AI 技術，
                建立設計師、工班、建材商三方協作生態，提升 40% 項目效率，降低 20% 整體成本。
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
                  <span className="text-3xl">🎨</span>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">設計師生態</h3>
                <p className="text-slate-600 mb-6">
                  從接案、設計到交付的全流程數位化工具，提升設計效率和客戶滿意度
                </p>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-indigo-400 rounded-full mr-3"></span>
                    AI 智慧媒合系統
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-indigo-400 rounded-full mr-3"></span>
                    3D 渲染與 VR 預覽
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-indigo-400 rounded-full mr-3"></span>
                    智慧報價與合約管理
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-6">
                  <span className="text-3xl">👷</span>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">工班生態</h3>
                <p className="text-slate-600 mb-6">
                  穩定案源、技能認證、數位化施工管理，讓專業技能獲得應有價值
                </p>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-orange-400 rounded-full mr-3"></span>
                    技能媒合與評價體系
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-orange-400 rounded-full mr-3"></span>
                    數位化進度追蹤
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-orange-400 rounded-full mr-3"></span>
                    快速收款與保險保障
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                  <span className="text-3xl">🏗️</span>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">建材商生態</h3>
                <p className="text-slate-600 mb-6">
                  直連終端客戶、智慧庫存管理、數據驅動的銷售策略優化
                </p>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                    多元銷售通路整合
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                    需求預測與庫存優化
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                    數據洞察與市場分析
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Collaboration Flow */}
        {activeTab === "collaboration" && (
          <div className="space-y-12">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                四步驟無縫協作流程
              </h2>
              <p className="text-lg text-slate-600">
                從需求發布到專案交付，每一步都有數據和 AI 的加持
              </p>
            </div>

            <div className="relative">
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-400 via-orange-400 via-green-400 to-blue-400 transform -translate-y-1/2"></div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
                {collaborationFlow.map((step, index) => (
                  <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold mr-4">
                        {step.step}
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">{step.role}</h3>
                        <p className="text-sm text-indigo-600 font-medium">{step.action}</p>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 mb-4">{step.detail}</p>
                    <div className="bg-slate-50 rounded-lg p-3">
                      <span className="text-xs font-medium text-slate-500">產出:</span>
                      <p className="text-sm font-medium text-slate-900">{step.output}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-slate-900 mb-4">協作效率提升</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-indigo-600">-60%</div>
                  <p className="text-sm text-slate-600">溝通時間</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-indigo-600">+40%</div>
                  <p className="text-sm text-slate-600">項目效率</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-indigo-600">-25%</div>
                  <p className="text-sm text-slate-600">變更次數</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-indigo-600">+90%</div>
                  <p className="text-sm text-slate-600">客戶滿意度</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Ecosystem Capabilities */}
        {activeTab === "ecosystem" && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                三角色深度賦能
              </h2>
              <p className="text-lg text-slate-600">
                針對每個角色的特定需求，提供專業化工具和服務
              </p>
            </div>

            <div className="flex justify-center">
              <div className="flex bg-slate-100 rounded-xl p-1">
                {Object.entries(roleCapabilities).map(([key, role]) => (
                  <button
                    key={key}
                    onClick={() => setActiveRole(key as "designer" | "contractor" | "supplier")}
                    className={clsx(
                      "px-6 py-3 rounded-lg font-medium transition-all",
                      activeRole === key
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    )}
                  >
                    {role.title}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                  {roleCapabilities[activeRole].title}
                </h3>
                <p className="text-lg text-slate-600">
                  {roleCapabilities[activeRole].subtitle}
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {roleCapabilities[activeRole].features.map((category, index) => (
                  <div key={index}>
                    <h4 className="text-lg font-semibold text-slate-900 mb-4">
                      {category.category}
                    </h4>
                    <div className="space-y-4">
                      {category.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="border-l-4 border-indigo-200 pl-4">
                          <h5 className="font-medium text-slate-900">{item.name}</h5>
                          <p className="text-sm text-slate-600 mt-1">{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Network Effects */}
        {activeTab === "network" && (
          <div className="space-y-12">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                強大的網路效應
              </h2>
              <p className="text-lg text-slate-600">
                每增加一個參與者，整個生態系統都會變得更強大
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {networkEffects.map((effect, index) => (
                <div key={index} className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">{effect.title}</h3>
                  <p className="text-slate-600 mb-6">{effect.desc}</p>
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4">
                    <span className="text-lg font-bold text-green-700">{effect.impact}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6">生態循環效應</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-semibold mb-4">供給側增強</h4>
                  <ul className="space-y-2 text-blue-100">
                    <li>• 更多專業設計師加入</li>
                    <li>• 工班服務品質提升</li>
                    <li>• 建材商產品更豐富</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-4">需求側擴張</h4>
                  <ul className="space-y-2 text-blue-100">
                    <li>• 服務品質吸引更多業主</li>
                    <li>• 口碑推薦擴大市場</li>
                    <li>• 數據洞察驅動創新</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Competitive Advantages */}
        {activeTab === "competitive" && (
          <div className="space-y-12">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                建立行業護城河
              </h2>
              <p className="text-lg text-slate-600">
                技術領先、生態完整、數據壁壘構成三重競爭優勢
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {competitiveAdvantages.map((advantage, index) => (
                <div key={index} className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
                  <h3 className="text-xl font-bold text-slate-900 mb-6">{advantage.category}</h3>
                  <ul className="space-y-4">
                    {advantage.points.map((point, pointIndex) => (
                      <li key={pointIndex} className="flex items-start">
                        <span className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                          ✓
                        </span>
                        <span className="text-slate-700">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="bg-slate-900 text-white rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6">市場機會</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-400 mb-2">$580億</div>
                  <p className="text-slate-300">台灣裝修市場年產值</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-400 mb-2">3.2%</div>
                  <p className="text-slate-300">目前數位化滲透率</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-400 mb-2">$18億</div>
                  <p className="text-slate-300">預估平台 GMV 潛力</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}