"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Brain, Sparkles, Target, TrendingUp, Zap, Shield, ExternalLink } from "lucide-react";

const API_BASE = "https://aihot-v2-production.up.railway.app/api";

const categoryIcons: Record<string, any> = {
  "LLM": Brain,
  "Computer Vision": Sparkles,
  "Robotics": Target,
  "AI Research": TrendingUp,
  "AI Product": Zap,
  "AI Safety": Shield,
  "AI Policy": Shield,
  "AI Startup": TrendingUp,
  "AI Chips": Zap,
  "AI Finance": TrendingUp,
  "AI Healthcare": Target,
  "AI Regulation": Shield,
};

const categoryColors: Record<string, string> = {
  "LLM": "text-[var(--primary)]",
  "Computer Vision": "text-purple-400",
  "Robotics": "text-cyan-400",
  "AI Research": "text-[var(--success)]",
  "AI Product": "text-[var(--heat)]",
  "AI Safety": "text-[var(--warning)]",
  "AI Policy": "text-yellow-400",
  "AI Startup": "text-green-400",
  "AI Chips": "text-orange-400",
  "AI Finance": "text-blue-400",
  "AI Healthcare": "text-pink-400",
  "AI Regulation": "text-red-400",
};

interface ApiEvent {
  id: number;
  title: string;
  summary: string;
  content?: string;
  heat_score: number;
  trend_score: number;
  category: string;
  status: string;
  source_url: string;
  created_at: string;
}

export default function InsightsPage() {
  const [events, setEvents] = useState<ApiEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/events?limit=20&sort_by=heat_score&sort_order=desc`)
      .then((r) => r.json())
      .then((json) => setEvents(json.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">AI 热点洞察</h1>
        <p className="text-[var(--muted-foreground)] mt-1">
          基于实时数据的 AI 行业深度分析与趋势预测
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      ) : events.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Brain className="h-12 w-12 mx-auto mb-4 text-[var(--muted-foreground)]" />
            <h3 className="text-lg font-semibold mb-2">暂无洞察数据</h3>
            <p className="text-[var(--muted-foreground)]">数据采集进行中，请稍后查看</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((event) => {
            const Icon = categoryIcons[event.category] || Brain;
            const color = categoryColors[event.category] || "text-[var(--primary)]";
            const confidence = Math.min(95, Math.round(event.heat_score));

            return (
              <Link key={event.id} href={`/events/${event.id}`}>
                <Card className="h-full hover:border-[var(--primary)]/50 transition-all cursor-pointer group">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3 mb-3">
                      <Icon className={"h-5 w-5 mt-0.5 " + color} />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="secondary" className="text-xs">
                            {event.category}
                          </Badge>
                          <Badge
                            variant={
                              event.status === "exploding"
                                ? "destructive"
                                : event.status === "rising"
                                ? "default"
                                : "secondary"
                            }
                            className="text-xs"
                          >
                            {event.status}
                          </Badge>
                        </div>
                        <h3 className="font-semibold group-hover:text-[var(--primary)] transition-colors">
                          {event.title}
                        </h3>
                      </div>
                    </div>
                    <p className="text-sm text-[var(--muted-foreground)] mb-4 leading-relaxed line-clamp-3">
                      {event.summary}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-16 rounded-full bg-[var(--secondary)] overflow-hidden">
                          <div
                            className="h-full bg-[var(--primary)] rounded-full"
                            style={{ width: confidence + "%" }}
                          />
                        </div>
                        <span className="text-xs text-[var(--muted-foreground)]">
                          热度 {event.heat_score}
                        </span>
                      </div>
                      <span className="text-xs text-[var(--muted-foreground)]">
                        {new Date(event.created_at).toLocaleDateString("zh-CN")}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
