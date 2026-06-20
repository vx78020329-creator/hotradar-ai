"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Plus, Shield, User } from "lucide-react";

const users = [
  { id: 1, name: "张三", email: "zhangsan@example.com", plan: "Pro", status: "active", joined: "2026-01-15", lastActive: "2 分钟前" },
  { id: 2, name: "李四", email: "lisi@example.com", plan: "Free", status: "active", joined: "2026-03-22", lastActive: "1 小时前" },
  { id: 3, name: "王五", email: "wangwu@company.com", plan: "Enterprise", status: "active", joined: "2025-11-08", lastActive: "5 分钟前" },
  { id: 4, name: "赵六", email: "zhaoliu@startup.io", plan: "Pro", status: "active", joined: "2026-02-14", lastActive: "30 分钟前" },
  { id: 5, name: "John Doe", email: "john@tech.com", plan: "Free", status: "inactive", joined: "2026-04-01", lastActive: "3 天前" },
  { id: 6, name: "Alice Smith", email: "alice@ai.com", plan: "Enterprise", status: "active", joined: "2025-09-20", lastActive: "10 分钟前" },
];

const planColors: Record<string, "default" | "secondary" | "warning"> = {
  Free: "secondary",
  Pro: "default",
  Enterprise: "warning",
};

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-3xl font-bold">用户管理</h1><p className="text-[var(--muted-foreground)] mt-1">管理平台用户</p></div>
        <Button className="gap-2"><Plus className="h-4 w-4" /> 添加用户</Button>
      </div>
      <div className="relative max-w-md"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)]" /><Input placeholder="搜索用户..." className="pl-10" /></div>
      <div className="space-y-3">
        {users.map((user) => (
          <Card key={user.id}>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-[var(--secondary)] flex items-center justify-center"><User className="h-5 w-5 text-[var(--muted-foreground)]" /></div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold">{user.name}</span>
                  <Badge variant={planColors[user.plan]}>{user.plan}</Badge>
                  {user.status === "inactive" && <Badge variant="destructive">未活跃</Badge>}
                </div>
                <p className="text-xs text-[var(--muted-foreground)]">{user.email}</p>
              </div>
              <div className="text-right shrink-0 text-xs text-[var(--muted-foreground)]">
                <p>加入: {user.joined}</p>
                <p>最后活跃: {user.lastActive}</p>
              </div>
              <Button variant="ghost" size="sm">管理</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
