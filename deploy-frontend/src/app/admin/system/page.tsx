"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Server, Cpu, HardDrive, Wifi, Database, Activity } from "lucide-react";

const metrics = [
  { label: "CPU 使用率", value: 42, icon: Cpu, status: "正常" },
  { label: "内存使用率", value: 68, icon: Server, status: "正常" },
  { label: "磁盘使用率", value: 55, icon: HardDrive, status: "正常" },
  { label: "网络带宽", value: 34, icon: Wifi, status: "正常" },
  { label: "数据库连接", value: 45, icon: Database, status: "正常" },
  { label: "API 响应时间", value: 28, icon: Activity, status: "正常" },
];

export default function AdminSystemPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-3xl font-bold">系统监控</h1><p className="text-[var(--muted-foreground)] mt-1">实时系统状态监控</p></div>
        <Badge variant="success" className="gap-1"><span className="h-2 w-2 rounded-full bg-[var(--success)] animate-pulse" />系统正常</Badge>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((metric) => (
          <Card key={metric.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2"><metric.icon className="h-4 w-4 text-[var(--primary)]" />{metric.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl font-bold">{metric.value}%</span>
                <Badge variant="success">{metric.status}</Badge>
              </div>
              <Progress value={metric.value} />
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader><CardTitle>服务状态</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {["API 网关", "数据采集", "AI 引擎", "推送服务", "数据库", "缓存服务", "搜索引擎", "文件存储"].map((service) => (
              <div key={service} className="flex items-center gap-2 p-3 rounded-lg bg-[var(--secondary)]/30">
                <span className="h-2 w-2 rounded-full bg-[var(--success)]" />
                <span className="text-sm">{service}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
