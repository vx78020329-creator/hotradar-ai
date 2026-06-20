"use client";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, TrendingDown, Minus, Brain, Target } from "lucide-react";

const API_BASE = "https://aihot-v2-production.up.railway.app/api";

interface TrendItem {
  id: number;
  topic: string;
  category: string;
  current_score: number;
  predicted_score: number;
  confidence: number;
  timeframe?: string;
  created_at: string;
}

function getDirection(current: number, predicted: number) {
  if (predicted > current * 1.05) return "rising";
  if (predicted < current * 0.95) return "declining";
  return "stable";
}

function DirectionIcon({ direction }: { direction: string }) {
  if (direction === "rising") return <TrendingUp className="h-4 w-4 text-green-500" />;
  if (direction === "declining") return <TrendingDown className="h-4 w-4 text-red-500" />;
  return <Minus className="h-4 w-4 text-yellow-500" />;
}

function DirectionLabel({ direction }: { direction: string }) {
  if (direction === "rising") return <span className="text-green-500 text-sm font-medium">上升趋势</span>;
  if (direction === "declining") return <span className="text-red-500 text-sm font-medium">下降趋势</span>;
  return <span className="text-yellow-500 text-sm font-medium">保持稳定</span>;
}

export default function TrendsPage() {
  const [trends, setTrends] = useState<TrendItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [forecasts, setForecasts] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE}/trends`).then(r => r.json()),
      fetch(`${API_BASE}/trends/forecast`).then(r => r.json()),
    ])
      .then(([trendsJson, forecastJson]) => {
        setTrends(trendsJson.data || []);
        setForecasts(forecastJson.data || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">趋势分析</h1>
        <p className="text-[var(--muted-foreground)] mt-1">AI 驱动的趋势预测与深度分析</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      ) : trends.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Brain className="h-12 w-12 mx-auto mb-4 text-[var(--muted-foreground)]" />
            <h3 className="text-lg font-semibold mb-2">暂无趋势数据</h3>
            <p className="text-[var(--muted-foreground)]">趋势分析正在生成中，请稍后刷新查看</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Trend Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {trends.map((trend) => {
              const direction = getDirection(trend.current_score, trend.predicted_score);
              const changePercent = trend.current_score > 0
                ? Math.round(((trend.predicted_score - trend.current_score) / trend.current_score) * 100)
                : 0;

              return (
                <Card key={trend.id} className="hover:border-[var(--primary)]/50 transition-all">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <DirectionIcon direction={direction} />
                          <Badge variant="secondary">{trend.category}</Badge>
                          <DirectionLabel direction={direction} />
                        </div>
                        <CardTitle>{trend.topic}</CardTitle>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-[var(--primary)]">{trend.current_score}</div>
                        <div className="text-xs text-[var(--muted-foreground)]">当前热度</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Score bar */}
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-xs text-[var(--muted-foreground)] mb-1">
                          <span>当前热度</span>
                          <span>{trend.current_score}</span>
                        </div>
                        <div className="h-2 rounded-full bg-[var(--secondary)] overflow-hidden">
                          <div
                            className="h-full bg-[var(--primary)] rounded-full transition-all"
                            style={{ width: `${Math.min(100, trend.current_score)}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs text-[var(--muted-foreground)] mb-1">
                          <span>预测热度 ({trend.timeframe || "30d"})</span>
                          <span>{trend.predicted_score} ({changePercent > 0 ? "+" : ""}{changePercent}%)</span>
                        </div>
                        <div className="h-2 rounded-full bg-[var(--secondary)] overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              direction === "rising" ? "bg-green-500" : direction === "declining" ? "bg-red-500" : "bg-yellow-500"
                            }`}
                            style={{ width: `${Math.min(100, trend.predicted_score)}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-[var(--border)]">
                      <div className="flex items-center gap-2">
                        <Target className="h-3 w-3 text-[var(--muted-foreground)]" />
                        <span className="text-xs text-[var(--muted-foreground)]">置信度 {trend.confidence}%</span>
                      </div>
                      <span className="text-xs text-[var(--muted-foreground)]">
                        {trend.timeframe || "30天"} 预测
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Forecasts Section */}
          {forecasts.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-[var(--primary)]" />
                  AI 趋势预测
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {forecasts.map((f: any, i: number) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-[var(--secondary)]/30">
                      <div className="flex-1">
                        <p className="font-medium">{f.topic}</p>
                        <p className="text-xs text-[var(--muted-foreground)] mt-1">{f.rationale}</p>
                      </div>
                      <div className="text-right ml-4">
                        <DirectionIcon direction={f.direction} />
                        <p className="text-xs text-[var(--muted-foreground)] mt-1">
                          7d: {f.predicted_7d} | 30d: {f.predicted_30d}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
