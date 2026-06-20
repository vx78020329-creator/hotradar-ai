"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Zap } from "lucide-react";
import Link from "next/link";

export default function SubscriptionPage() {
  return (
    <div className="space-y-6">
      <div><h1 className="text-3xl font-bold">订阅管理</h1><p className="text-[var(--muted-foreground)] mt-1">管理你的订阅方案</p></div>

      <Card className="border-[var(--primary)]/30">
        <CardHeader><CardTitle className="flex items-center gap-2"><Crown className="h-5 w-5 text-[var(--primary)]" />当前方案: Pro</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div><p className="text-sm text-[var(--muted-foreground)]">状态</p><Badge variant="success">活跃</Badge></div>
            <div><p className="text-sm text-[var(--muted-foreground)]">价格</p><p className="font-semibold">￥99/月</p></div>
            <div><p className="text-sm text-[var(--muted-foreground)]">下次续费</p><p className="font-semibold">2026-07-21</p></div>
            <div><p className="text-sm text-[var(--muted-foreground)]">已使用</p><p className="font-semibold">45 天</p></div>
          </div>
          <div className="flex gap-3">
            <Link href="/pricing"><Button variant="outline">升级方案</Button></Link>
            <Button variant="ghost" className="text-[var(--destructive)]">取消订阅</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Pro 版特权</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {["实时热点推送", "无限 AI 洞察", "高级数据导出", "API 访问", "优先客服", "自定义仪表盘"].map((feature) => (
              <div key={feature} className="flex items-center gap-2"><Check className="h-4 w-4 text-[var(--success)]" /><span className="text-sm">{feature}</span></div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
