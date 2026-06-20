"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { HeatBadge } from "@/components/shared/heat-badge";
import { StatusIndicator } from "@/components/shared/status-indicator";
import { mockEvents } from "@/lib/mock-data";
import { Search, Plus, Trash2, Edit } from "lucide-react";

export default function AdminEventsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-3xl font-bold">事件管理</h1><p className="text-[var(--muted-foreground)] mt-1">管理所有 AI 热点事件</p></div>
        <Button className="gap-2"><Plus className="h-4 w-4" /> 新建事件</Button>
      </div>
      <div className="relative max-w-md"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)]" /><Input placeholder="搜索事件..." className="pl-10" /></div>
      <div className="space-y-3">
        {mockEvents.map((event) => (
          <Card key={event.id}>
            <CardContent className="p-4 flex items-center gap-4">
              <StatusIndicator status={event.status} showLabel={false} />
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">{event.titleZh}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs">{event.category}</Badge>
                  <span className="text-xs text-[var(--muted-foreground)]">{event.views.toLocaleString()} 浏览</span>
                </div>
              </div>
              <HeatBadge score={event.heatScore} size="sm" />
              <div className="flex gap-1">
                <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-[var(--destructive)]" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
