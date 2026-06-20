"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bot, Play, Pause, RefreshCw, AlertTriangle } from "lucide-react";

const agents = [
  { id: 1, name: "热点发现代理", type: "discovery", status: "running", tasks: 1284, uptime: "99.8%", lastAction: "扫描 HN 热帖" },
  { id: 2, name: "趋势分析代理", type: "analysis", status: "running", tasks: 856, uptime: "99.5%", lastAction: "计算热度指数" },
  { id: 3, name: "报告生成代理", type: "reporting", status: "running", tasks: 347, uptime: "99.9%", lastAction: "生成日报" },
  { id: 4, name: "数据采集代理", type: "collection", status: "warning", tasks: 2156, uptime: "95.2%", lastAction: "Twitter API 限流" },
  { id: 5, name: "AI 分析代理", type: "ai", status: "running", tasks: 924, uptime: "99.7%", lastAction: "生成事件洞察" },
  { id: 6, name: "通知推送代理", type: "notification", status: "running", tasks: 5620, uptime: "99.9%", lastAction: "推送热点提醒" },
  { id: 7, name: "知识图谱代理", type: "knowledge", status: "stopped", tasks: 156, uptime: "88.5%", lastAction: "更新实体关系" },
  { id: 8, name: "数据清洗代理", type: "cleanup", status: "running", tasks: 3200, uptime: "99.6%", lastAction: "去重处理" },
];

const statusColors: Record<string, "default" | "success" | "warning" | "destructive"> = {
  running: "success",
  warning: "warning",
  stopped: "destructive",
};

export default function AdminAgentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-3xl font-bold">AI 代理管理</h1><p className="text-[var(--muted-foreground)] mt-1">监控和管理 AI 代理</p></div>
        <Button variant="outline" className="gap-2"><RefreshCw className="h-4 w-4" /> 刷新状态</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {agents.map((agent) => (
          <Card key={agent.id} className={agent.status === "warning" ? "border-[var(--warning)]/50" : ""}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2"><Bot className="h-4 w-4" />{agent.name}</CardTitle>
                <Badge variant={statusColors[agent.status]}>{agent.status === "running" ? "运行中" : agent.status === "warning" ? "告警" : "已停止"}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                <div><p className="text-[var(--muted-foreground)]">任务数</p><p className="font-semibold">{agent.tasks.toLocaleString()}</p></div>
                <div><p className="text-[var(--muted-foreground)]">可用率</p><p className="font-semibold">{agent.uptime}</p></div>
              </div>
              <p className="text-xs text-[var(--muted-foreground)] mb-3">最近: {agent.lastAction}</p>
              <div className="flex gap-2">
                {agent.status === "stopped" ? (
                  <Button size="sm" variant="outline" className="gap-1"><Play className="h-3 w-3" /> 启动</Button>
                ) : (
                  <Button size="sm" variant="outline" className="gap-1"><Pause className="h-3 w-3" /> 暂停</Button>
                )}
                <Button size="sm" variant="ghost"><RefreshCw className="h-3 w-3" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
