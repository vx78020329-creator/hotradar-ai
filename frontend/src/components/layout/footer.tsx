import Link from "next/link";
import { Radar } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--background)]">
      <div className="mx-auto max-w-[1600px] px-4 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Radar className="h-6 w-6 text-[var(--primary)]" />
              <span className="text-lg font-bold">HotRadar AI</span>
            </Link>
            <p className="text-sm text-[var(--muted-foreground)] max-w-xs">
              全球 AI 热点发现平台。用 AI 发现趋势，而不是等待新闻。
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4">产品</h4>
            <div className="space-y-3">
              {["热点事件", "趋势分析", "AI 公司", "研究报告", "AI 洞察"].map((item) => (
                <Link key={item} href="/events" className="block text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
                  {item}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4">公司</h4>
            <div className="space-y-3">
              {["关于我们", "定价", "博客", "联系我们", "职业"].map((item) => (
                <Link key={item} href="/about" className="block text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
                  {item}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4">法律</h4>
            <div className="space-y-3">
              {["服务条款", "隐私政策", "Cookie 政策", "API 使用条款"].map((item) => (
                <span key={item} className="block text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors cursor-pointer">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-[var(--muted-foreground)]">
            ? 2026 HotRadar AI. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-[var(--muted-foreground)]">Powered by AI</span>
            <span className="flex items-center gap-1.5 text-xs text-[var(--success)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--success)] animate-pulse" />
              系统正常
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
