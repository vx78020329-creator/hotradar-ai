"use client";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useTrend } from "@/hooks/use-api";
import { mockEvents } from "@/lib/mock-data";
import { TrendChart } from "@/components/shared/trend-chart";
import { EventCard } from "@/components/shared/event-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, TrendingUp, TrendingDown, Brain, Target, Calendar } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function TrendDetailPage() {
  const params = useParams();
  const { data: trend, isLoading } = useTrend(params.id as string);

  if (isLoading) {
    return (<div className="space-y-6"><Skeleton className="h-8 w-32" /><Skeleton className="h-12 w-3/4" /><Skeleton className="h-80 w-full" /></div>);
  }

  if (!trend) {
    return (<div className="text-center py-20"><p className="text-[var(--muted-foreground)]">趋势未找到</p><Link href="/trends"><Button variant="ghost" className="mt-4">返回趋势列表</Button></Link></div>);
  }

  const relatedEvents = mockEvents.filter((e) => trend.relatedEvents.includes(e.id));

  return (
    <div className="space-y-6">
      <Link href="/trends" className="inline-flex items-center gap-2 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
        <ArrowLeft className="h-4 w-4" /> 返回趋势列表
      </Link>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 space-y-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              {trend.direction === "up" ? <TrendingUp className="h-5 w-5 text-[var(--success)]" /> : <TrendingDown className="h-5 w-5 text-[var(--destructive)]" />}
              <Badge variant="secondary">{trend.category}</Badge>
            </div>
            <h1 className="text-3xl font-bold mb-2">{trend.nameZh}</h1>
            <p className="text-[var(--muted-foreground)]">{trend.descriptionZh}</p>
          </div>

          <Card>
            <CardHeader><CardTitle>历史趋势数据</CardTitle></CardHeader>
            <CardContent><TrendChart data={trend.historicalData.map((d) => ({ date: d.date, score: d.value }))} height={300} /></CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Brain className="h-5 w-5 text-[var(--primary)]" />AI 预测</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trend.predictions.map((pred, i) => (
                  <div key={i} className="p-4 rounded-lg bg-[var(--secondary)]/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{pred.label}</span>
                      <span className="text-xs text-[var(--muted-foreground)]">{formatDate(pred.date)}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Progress value={pred.value} className="flex-1" />
                      <span className="text-sm font-semibold">{pred.value}%</span>
                    </div>
                    <p className="text-xs text-[var(--muted-foreground)] mt-2">置信度: {pred.confidence}%</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {relatedEvents.length > 0 && (
            <div>
              <h2 className="text-xl font-bold mb-4">关联事件</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{relatedEvents.map((e) => (<EventCard key={e.id} event={e} />))}</div>
            </div>
          )}
        </div>

        <div className="w-full lg:w-80 space-y-4">
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-sm text-[var(--muted-foreground)] mb-2">趋势强度</p>
              <div className="text-4xl font-bold text-[var(--primary)] mb-2">{trend.strength}</div>
              <Progress value={trend.strength} className="mb-2" />
              <p className="text-xs text-[var(--muted-foreground)]">满分 100</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-sm text-[var(--muted-foreground)] mb-2">AI 置信度</p>
              <div className="text-4xl font-bold text-[var(--success)] mb-2">{trend.confidence}%</div>
              <Progress value={trend.confidence} className="mb-2" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 space-y-3">
              <div className="flex items-center justify-between"><span className="text-sm text-[var(--muted-foreground)]">方向</span><span className="text-sm font-medium">{trend.direction === "up" ? "上升 ↑" : "下降 ↓"}</span></div>
              <div className="flex items-center justify-between"><span className="text-sm text-[var(--muted-foreground)]">创建时间</span><span className="text-sm">{formatDate(trend.createdAt)}</span></div>
              <div className="flex items-center justify-between"><span className="text-sm text-[var(--muted-foreground)]">更新时间</span><span className="text-sm">{formatDate(trend.updatedAt)}</span></div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}