"use client";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useEvent } from "@/hooks/use-api";
import { mockEvents } from "@/lib/mock-data";
import { HeatBadge } from "@/components/shared/heat-badge";
import { TrendChart } from "@/components/shared/trend-chart";
import { StatusIndicator } from "@/components/shared/status-indicator";
import { EventCard } from "@/components/shared/event-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, ExternalLink, Share2, Eye, Clock, Brain, Link2 } from "lucide-react";
import { formatDate, formatNumber } from "@/lib/utils";

export default function EventDetailPage() {
  const params = useParams();
  const { data: event, isLoading } = useEvent(params.id as string);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-12 w-3/4" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4"><Skeleton className="h-64 w-full" /><Skeleton className="h-32 w-full" /></div>
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="text-center py-20">
        <p className="text-[var(--muted-foreground)]">事件未找到</p>
        <Link href="/events"><Button variant="ghost" className="mt-4">返回事件列表</Button></Link>
      </div>
    );
  }

  const relatedEvents = mockEvents.filter((e) => event.relatedEvents.includes(e.id));

  return (
    <div className="space-y-6">
      <Link href="/events" className="inline-flex items-center gap-2 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
        <ArrowLeft className="h-4 w-4" /> 返回事件列表
      </Link>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 space-y-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <StatusIndicator status={event.status} />
              <Badge variant="secondary">{event.category.replace("-", " ")}</Badge>
            </div>
            <h1 className="text-3xl font-bold mb-2">{event.titleZh}</h1>
            <p className="text-[var(--muted-foreground)]">{event.title}</p>
          </div>
          <div className="flex items-center gap-4 text-sm text-[var(--muted-foreground)]">
            <span className="flex items-center gap-1"><Eye className="h-4 w-4" /> {formatNumber(event.views)} 浏览</span>
            <span className="flex items-center gap-1"><Share2 className="h-4 w-4" /> {formatNumber(event.shares)} 分享</span>
            <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {formatDate(event.updatedAt)}</span>
          </div>
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Brain className="h-5 w-5 text-[var(--primary)]" />AI 分析</CardTitle></CardHeader>
            <CardContent><p className="text-[var(--muted-foreground)] leading-relaxed">{event.aiAnalysis}</p></CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>热度趋势</CardTitle></CardHeader>
            <CardContent><TrendChart data={event.heatHistory} height={250} /></CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>详细描述</CardTitle></CardHeader>
            <CardContent><p className="text-[var(--muted-foreground)] leading-relaxed">{event.descriptionZh}</p></CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Link2 className="h-5 w-5" />信息来源</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {event.sources.map((source, i) => (
                  <a key={i} href={source.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 rounded-lg bg-[var(--secondary)]/50 hover:bg-[var(--secondary)] transition-colors">
                    <div><p className="text-sm font-medium">{source.name}</p><p className="text-xs text-[var(--muted-foreground)]">{source.type} · {formatDate(source.publishedAt)}</p></div>
                    <ExternalLink className="h-4 w-4 text-[var(--muted-foreground)]" />
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
          {relatedEvents.length > 0 && (
            <div>
              <h2 className="text-xl font-bold mb-4">相关事件</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{relatedEvents.map((e) => (<EventCard key={e.id} event={e} />))}</div>
            </div>
          )}
        </div>
        <div className="w-full lg:w-80 space-y-4">
          <Card><CardContent className="p-6 text-center"><p className="text-sm text-[var(--muted-foreground)] mb-2">当前热度</p><HeatBadge score={event.heatScore} size="lg" /></CardContent></Card>
          <Card><CardContent className="p-6"><p className="text-sm font-semibold mb-3">标签</p><div className="flex flex-wrap gap-2">{event.tags.map((tag) => (<Badge key={tag} variant="secondary">{tag}</Badge>))}</div></CardContent></Card>
          <Card><CardContent className="p-6"><p className="text-sm font-semibold mb-3">关联公司</p><div className="space-y-2">{event.companies.map((company) => (<Link key={company} href="/companies" className="flex items-center gap-2 p-2 rounded-lg hover:bg-[var(--secondary)] transition-colors"><span className="text-sm">{company}</span></Link>))}</div></CardContent></Card>
          <Card><CardContent className="p-6"><p className="text-sm font-semibold mb-3">操作</p><div className="space-y-2"><Button variant="outline" className="w-full justify-start gap-2"><Share2 className="h-4 w-4" /> 分享事件</Button><Button variant="outline" className="w-full justify-start gap-2"><Eye className="h-4 w-4" /> 关注事件</Button></div></CardContent></Card>
        </div>
      </div>
    </div>
  );
}