"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, TrendingUp, TrendingDown, Minus, Brain, Target, Calendar } from "lucide-react";

const API_BASE = "https://aihot-v2-production.up.railway.app/api";

interface TrendData {
  id: number;
  topic: string;
  category: string;
  current_score: number;
  predicted_score: number;
  confidence: number;
  timeframe?: string;
  created_at: string;
}

function formatDate(dateStr?: string) {
  if (!dateStr) return "";
  try {
    return new Date(dateStr).toLocaleDateString("zh-CN", {
      year: "numeric", month: "2-digit", day: "2-digit",
    });
  } catch {
    return dateStr;
  }
}

export default function TrendDetailPage() {
  const params = useParams();
  const [trend, setTrend] = useState<TrendData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params.id) return;
    fetch(`${API_BASE}/trends/${params.id}`)
      .then((r) => r.json())
      .then((json) => setTrend(json.data || json))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }

  if (!trend) {
    return (
      <div className="text-center py-20">
        <p className="text-[var(--muted-foreground)]">趋势未找到</p>
        <Link href="/trends">
          <Button variant="ghost" className="mt-4">返回趋势列表</Button>
        </Link>
      </div>
    );
  }

  const direction =
    trend.predicted_score > trend.current_score * 1.05
      ? "rising"
      : trend.predicted_score < trend.current_score * 0.95
      ? "declining"
      : "stable";
  const changePercent =
    trend.current_score > 0
      ? Math.round(
          ((trend.predicted_score - trend.current_score) / trend.current_score) * 100
        )
      : 0;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Link
        href="/trends"
        className="inline-flex items-center gap-2 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> 返回趋势列表
      </Link>

      <div>
        <div className="flex items-center gap-3 mb-3">
          {direction === "rising" ? (
            <TrendingUp className="h-5 w-5 text-green-500" />
          ) : direction === "declining" ? (
            <TrendingDown className="h-5 w-5 text-red-500" />
          ) : (
            <Minus className="h-5 w-5 text-yellow-500" />
          )}
          <Badge variant="secondary">{trend.category}</Badge>
          <span
            className={
              direction === "rising"
                ? "text-green-500 font-medium"
                : direction === "declining"
                ? "text-red-500 font-medium"
                : "text-yellow-500 font-medium"
            }
          >
            {direction === "rising" ? "上升趋势" : direction === "declining" ? "下降趋势" : "保持稳定"}
          </span>
        </div>
        <h1 className="text-3xl font-bold mb-2">{trend.topic}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-sm text-[var(--muted-foreground)] mb-2">当前热度</p>
            <div className="text-4xl font-bold text-[var(--primary)]">{trend.current_score}</div>
            <div className="mt-2 h-2 rounded-full bg-[var(--secondary)] overflow-hidden">
              <div
                className="h-full bg-[var(--primary)] rounded-full"
                style={{ width: `${Math.min(100, trend.current_score)}%` }}
              />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-sm text-[var(--muted-foreground)] mb-2">预测热度 ({trend.timeframe || "30d"})</p>
            <div className="text-4xl font-bold text-green-500">{trend.predicted_score}</div>
            <p className="text-sm text-[var(--muted-foreground)] mt-1">
              {changePercent > 0 ? "+" : ""}
              {changePercent}%
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-sm text-[var(--muted-foreground)] mb-2">置信度</p>
            <div className="text-4xl font-bold text-[var(--success)]">{trend.confidence}%</div>
            <div className="mt-2 h-2 rounded-full bg-[var(--secondary)] overflow-hidden">
              <div
                className="h-full bg-[var(--success)] rounded-full"
                style={{ width: `${trend.confidence}%` }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-[var(--primary)]" />
            AI 趋势分析
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-invert max-w-none">
            <p className="text-[var(--muted-foreground)] leading-relaxed">
              <strong>{trend.topic}</strong> 在 {trend.category} 领域的当前热度为{" "}
              <strong>{trend.current_score}</strong>，预计在未来 {trend.timeframe || "30天"} 内将达到{" "}
              <strong>{trend.predicted_score}</strong>。
            </p>
            <p className="text-[var(--muted-foreground)] leading-relaxed mt-4">
              基于 HotRadar AI 的实时数据分析，该趋势的置信度为 {trend.confidence}%。
              {direction === "rising"
                ? "该领域正在快速升温，建议密切关注相关动态。"
                : direction === "declining"
                ? "该领域热度有所下降，但仍需关注潜在变化。"
                : "该领域保持稳定发展态势。"}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--muted-foreground)]">分类</span>
            <span className="text-sm font-medium">{trend.category}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--muted-foreground)]">预测周期</span>
            <span className="text-sm font-medium">{trend.timeframe || "30天"}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--muted-foreground)]">创建时间</span>
            <span className="text-sm">{formatDate(trend.created_at)}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
