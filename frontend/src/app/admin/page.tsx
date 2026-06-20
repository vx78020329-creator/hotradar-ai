"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/shared/stat-card";
import { Database, Users, Bot, Activity, Server, AlertTriangle } from "lucide-react";
import Link from "next/link";

const adminLinks = [
  { href: "/admin/sources", label: "数据源", icon: Database, count: 42, status: "正常" },
  { href: "/admin/events", label: "事件管理", icon: Activity, count: 1284, status: "正常" },
  { href: "/admin/agents", label: "AI 代理", icon: Bot, count: 8, status: "2个告警" },
  { href: "/admin/users", label: "用户管理", icon: Users, count: 15420, status: "正常" },
  { href: "/admin/logs", label: "系统日志", icon: Server, count: 0, status: "正常" },
  { href: "/admin/system", label: "系统监控", icon: Activity, count: 0, status: "正常" },
];

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <div><h1 className="text-3xl font-bold">管理后台</h1><p className="text-[var(--muted-foreground)] mt-1">系统管理和监控</p></div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="总用户" value={15420} icon={<Users className="h-5 w-5" />} trend={5.2} />
        <StatCard label="数据源" value={42} icon={<Database className="h-5 w-5" />} />
        <StatCard label="活跃代理" value={8} icon={<Bot className="h-5 w-5" />} />
        <StatCard label="今日请求" value={284000} icon={<Activity className="h-5 w-5" />} trend={12.8} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {adminLinks.map((link) => (
          <Link key={link.href} href={link.href}>
            <Card className="hover:border-[var(--primary)]/50 transition-all cursor-pointer">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <link.icon className="h-6 w-6 text-[var(--primary)]" />
                  <Badge variant={link.status === "正常" ? "success" : "warning"}>{link.status}</Badge>
                </div>
                <h3 className="font-semibold">{link.label}</h3>
                <p className="text-sm text-[var(--muted-foreground)]">{link.count.toLocaleString()} 项</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
