import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import TabNavigation from "./components/TabNavigation";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "LargeHome AI 管理中心",
    template: "%s — LargeHome AI",
  },
  description: "室內設計產業全方位 AI 平台 — 連結設計師、工班、建材商",
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
    <html lang="zh-TW" className={inter.variable}>
      <body className="h-screen bg-[#f7f8fa] text-slate-900 antialiased font-sans overflow-hidden">
        <div className="flex h-full">
          <TabNavigation />
          <main className="flex-1 min-w-0 overflow-y-auto">{children}</main>
        </div>
      </body>
    </html>
  );
}
