"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SearchBar } from "@/components/shared/search-bar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Radar, Bell, User, Menu } from "lucide-react";
import { useAppStore } from "@/store/app-store";

const navLinks = [
  { href: "/", label: "首页" },
  { href: "/events", label: "热点事件" },
  { href: "/trends", label: "趋势分析" },
  { href: "/companies", label: "AI 公司" },
  { href: "/reports", label: "研究报告" },
  { href: "/insights", label: "AI 洞察" },
  { href: "/finance", label: "投资影响" },
];

export function Navbar() {
  const pathname = usePathname();
  const toggleSidebar = useAppStore((s) => s.toggleSidebar);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-4 lg:px-8">
        <div className="flex items-center gap-6">
          <button onClick={toggleSidebar} className="lg:hidden p-2 hover:bg-[var(--secondary)] rounded-lg cursor-pointer">
            <Menu className="h-5 w-5" />
          </button>
          <Link href="/" className="flex items-center gap-2.5">
            <div className="relative">
              <Radar className="h-7 w-7 text-[var(--primary)]" />
              <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-[var(--heat)] animate-pulse" />
            </div>
            <span className="text-lg font-bold tracking-tight">
              Hot<span className="text-[var(--primary)]">Radar</span> AI
            </span>
          </Link>
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                  pathname === link.href
                    ? "text-[var(--foreground)] bg-[var(--secondary)]"
                    : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--secondary)]/50"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <SearchBar className="hidden md:block w-64" />
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[var(--destructive)]" />
          </Button>
          <Link href="/dashboard">
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
