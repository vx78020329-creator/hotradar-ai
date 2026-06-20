import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "HotRadar AI - 全球 AI 热点发现平台",
    template: "%s | HotRadar AI",
  },
  description: "用 AI 发现全球 AI 热点趋势，而不是等待新闻。实时追踪 LLM、机器人、AI 芯片、自动驾驶等领域最新动态。",
  keywords: ["AI", "人工智能", "热点", "趋势", "LLM", "机器人", "AI芯片", "自动驾驶"],
  authors: [{ name: "HotRadar AI" }],
  openGraph: {
    type: "website",
    locale: "zh_CN",
    siteName: "HotRadar AI",
    title: "HotRadar AI - 全球 AI 热点发现平台",
    description: "用 AI 发现全球 AI 热点趋势",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen bg-[var(--background)] font-['Inter',sans-serif] antialiased">
        <Providers>
          <div className="flex flex-col min-h-screen">
            <AppShell>
              {children}
            </AppShell>
          </div>
        </Providers>
      </body>
    </html>
  );
}

import { Providers } from "./providers";
import { AppShell } from "@/components/layout/app-shell";
