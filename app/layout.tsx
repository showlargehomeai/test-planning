import type { Metadata, Viewport } from "next";
import "./globals.css";
import TabNavigation from "./components/TabNavigation";

export const metadata: Metadata = {
  title: "TestPlanning 管理中心",
  description: "Claude 驅動的計畫管理儀表板 - 測試用的計劃管理系統",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-TW">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="h-full bg-slate-50 text-slate-900 antialiased">
        <div className="flex flex-col h-full">
          <TabNavigation />
          <main className="flex-1 min-h-0">{children}</main>
        </div>
      </body>
    </html>
  );
}
