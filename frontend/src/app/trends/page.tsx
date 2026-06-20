"use client";
import { useTrends } from "@/hooks/use-api";
import { TrendChart } from "@/components/shared/trend-chart";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, TrendingDown, ArrowRight, Brain } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function TrendsPage() {
  const { data: trends, isLoading } = useTrends();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">趋势分析</h1>
        <p className="text-[var(--muted-foreground)] mt-1">AI 驱动的趋势预测与深度分析</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (<Skeleton key={i} className="h-80 w-full" />))}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {trends?.map((trend) => (
            <Link key={trend.id} href={`/trends/${trend.id}`}>
              <Card className="h-full hover:border-[var(--primary)]/50 transition-all cursor-pointer group">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        {trend.direction === "up" ? (
                          <TrendingUp className="h-4 w-4 text-[var(--success)]" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-[var(--destructive)]" />
                        )}
                        <Badge variant="secondary">{trend.category}</Badge>
                      </div>
                      <CardTitle className="group-hover:text-[var(--primary)] transition-colors">{trend.nameZh}</CardTitle>
                      <p className="text-sm text-[var(--muted-foreground)] mt-1">{trend.descriptionZh}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-[var(--primary)]">{trend.strength}</div>
                      <div className="text-xs text-[var(--muted-foreground)]">强度指数</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <TrendChart data={trend.historicalData.map((d) => ({ date: d.date, score: d.value }))} height={150} />
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-[var(--border)]">
                    <div className="flex items-center gap-2">
                      <Brain className="h-3 w-3 text-[var(--muted-foreground)]" />
                      <span className="text-xs text-[var(--muted-foreground)]">置信度 {trend.confidence}%</span>
                    </div>
                    <span className="text-xs text-[var(--primary)] group-hover:underline">查看详情 →</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
