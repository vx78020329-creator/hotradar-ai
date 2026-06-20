"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/app-store";
import { Home, TrendingUp, Building2, FileText, Search, Lightbulb, BarChart3, LayoutDashboard, Settings, Shield, X } from "lucide-react";

const sidebarItems = [
  { href: "/", label: "概览", icon: Home },
  { href: "/events", label: "热点事件", icon: TrendingUp },
  { href: "/trends", label: "趋势分析", icon: BarChart3 },
  { href: "/companies", label: "AI 公司", icon: Building2 },
  { href: "/reports", label: "研究报告", icon: FileText },
  { href: "/insights", label: "AI 洞察", icon: Lightbulb },
  { href: "/search", label: "搜索", icon: Search },
];

const dashItems = [
  { href: "/dashboard", label: "控制台", icon: LayoutDashboard },
  { href: "/dashboard/settings", label: "设置", icon: Settings },
  { href: "/admin", label: "管理后台", icon: Shield },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, setSidebarOpen } = useAppStore();

  return (
    <>
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
      <aside
        className={cn(
          "fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-60 border-r border-[var(--border)] bg-[var(--sidebar-background)] transition-transform duration-200 lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col p-4">
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden absolute top-4 right-4 p-1 hover:bg-[var(--secondary)] rounded cursor-pointer">
            <X className="h-4 w-4" />
          </button>

          <nav className="space-y-1 flex-1">
            <p className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-3 px-3">导航</p>
            {sidebarItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  pathname === item.href
                    ? "bg-[var(--secondary)] text-[var(--foreground)]"
                    : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--secondary)]/50"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}

            <div className="pt-4">
              <p className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-3 px-3">工作区</p>
              {dashItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    pathname === item.href
                      ? "bg-[var(--secondary)] text-[var(--foreground)]"
                      : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--secondary)]/50"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>

          <div className="border-t border-[var(--border)] pt-4 mt-4">
            <div className="rounded-lg bg-[var(--primary)]/10 p-3">
              <p className="text-xs font-semibold text-[var(--primary)]">Pro 版</p>
              <p className="text-xs text-[var(--muted-foreground)] mt-1">解锁全部功能和实时数据</p>
              <Link href="/pricing">
                <button className="mt-2 text-xs font-medium text-[var(--primary)] hover:underline cursor-pointer">
                  查看方案 →
                </button>
              </Link>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
