"use client";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/shared/stat-card";
import { HeatBadge } from "@/components/shared/heat-badge";
import { mockEvents, mockReports } from "@/lib/mock-data";
import { Activity, Bookmark, FileText, Settings, Star, TrendingUp, User, Crown } from "lucide-react";
import { formatDate } from "@/lib/utils";

const dashLinks = [
  { href: "/dashboard/following", label: "关注", icon: Star, count: 12 },
  { href: "/dashboard/bookmarks", label: "收藏", icon: Bookmark, count: 28 },
  { href: "/dashboard/reports", label: "我的报告", icon: FileText, count: 5 },
  { href: "/dashboard/subscription", label: "订阅", icon: Crown },
  { href: "/dashboard/settings", label: "设置", icon: Settings },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">控制台</h1>
          <p className="text-[var(--muted-foreground)] mt-1">欢迎回来，用户</p>
        </div>
        <Badge variant="default" className="gap-1"><Crown className="h-3 w-3" /> Pro 版</Badge>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="关注事件" value={12} icon={<Star className="h-5 w-5" />} />
        <StatCard label="收藏" value={28} icon={<Bookmark className="h-5 w-5" />} />
        <StatCard label="已读报告" value={15} icon={<FileText className="h-5 w-5" />} />
        <StatCard label="本周活跃" value={7} suffix="天" icon={<Activity className="h-5 w-5" />} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {dashLinks.map((link) => (
          <Link key={link.href} href={link.href}>
            <Card className="hover:border-[var(--primary)]/50 transition-all cursor-pointer text-center">
              <CardContent className="p-4">
                <link.icon className="h-6 w-6 mx-auto mb-2 text-[var(--primary)]" />
                <p className="text-sm font-medium">{link.label}</p>
                {link.count && <p className="text-xs text-[var(--muted-foreground)]">{link.count} 项</p>}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>最近关注</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockEvents.slice(0, 4).map((event) => (
                <Link key={event.id} href={`/events/${event.id}`} className="flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--secondary)] transition-colors">
                  <HeatBadge score={event.heatScore} size="sm" showLabel={false} />
                  <span className="text-sm flex-1 truncate">{event.titleZh}</span>
                  <span className="text-xs text-[var(--muted-foreground)]">{formatDate(event.updatedAt)}</span>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>最新报告</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockReports.map((report) => (
                <Link key={report.id} href={`/reports/${report.id}`} className="flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--secondary)] transition-colors">
                  <FileText className="h-4 w-4 text-[var(--muted-foreground)]" />
                  <span className="text-sm flex-1 truncate">{report.titleZh}</span>
                  <span className="text-xs text-[var(--muted-foreground)]">{formatDate(report.publishedAt)}</span>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
