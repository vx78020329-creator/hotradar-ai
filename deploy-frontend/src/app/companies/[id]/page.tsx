"use client";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useCompany } from "@/hooks/use-api";
import { mockEvents } from "@/lib/mock-data";
import { HeatBadge } from "@/components/shared/heat-badge";
import { EventCard } from "@/components/shared/event-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Brain, Globe, MapPin, Calendar, TrendingUp, TrendingDown, ExternalLink } from "lucide-react";
import { formatDate, formatNumber } from "@/lib/utils";

export default function CompanyDetailPage() {
  const params = useParams();
  const { data: company, isLoading } = useCompany(params.id as string);

  if (isLoading) {
    return (<div className="space-y-6"><Skeleton className="h-8 w-32" /><Skeleton className="h-48 w-full" /><Skeleton className="h-64 w-full" /></div>);
  }

  if (!company) {
    return (<div className="text-center py-20"><p className="text-[var(--muted-foreground)]">公司未找到</p><Link href="/companies"><Button variant="ghost" className="mt-4">返回公司列表</Button></Link></div>);
  }

  const relatedEvents = mockEvents.filter((e) => company.relatedEvents.includes(e.id));

  return (
    <div className="space-y-6">
      <Link href="/companies" className="inline-flex items-center gap-2 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
        <ArrowLeft className="h-4 w-4" /> 返回公司列表
      </Link>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <span className="text-5xl">{company.logo}</span>
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-1">{company.nameZh}</h1>
              <p className="text-[var(--muted-foreground)] mb-4">{company.name} · {company.industry}</p>
              <p className="text-[var(--muted-foreground)] mb-4">{company.descriptionZh}</p>
              <div className="flex flex-wrap gap-4 text-sm text-[var(--muted-foreground)]">
                <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{company.headquarters}</span>
                <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />成立于 {company.founded}</span>
                <a href={company.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-[var(--primary)]"><Globe className="h-4 w-4" />官网 <ExternalLink className="h-3 w-3" /></a>
              </div>
            </div>
            <div className="text-center">
              <HeatBadge score={company.heatScore} size="lg" />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 space-y-6">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Brain className="h-5 w-5 text-[var(--primary)]" />AI 分析</CardTitle></CardHeader>
            <CardContent><p className="text-[var(--muted-foreground)] leading-relaxed">{company.aiAnalysis}</p></CardContent>
          </Card>

          {relatedEvents.length > 0 && (
            <div>
              <h2 className="text-xl font-bold mb-4">相关事件</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{relatedEvents.map((e) => (<EventCard key={e.id} event={e} />))}</div>
            </div>
          )}
        </div>

        <div className="w-full lg:w-80 space-y-4">
          {company.marketCap && (
            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-[var(--muted-foreground)] mb-1">市值</p>
                <p className="text-2xl font-bold">B</p>
                {company.stockChange && (
                  <p className={"text-sm mt-1 " + (company.stockChange >= 0 ? "text-[var(--success)]" : "text-[var(--destructive)]")}>
                    {company.stockChange >= 0 ? <TrendingUp className="h-3 w-3 inline" /> : <TrendingDown className="h-3 w-3 inline" />}
                    {" "}{company.stockChange > 0 ? "+" : ""}{company.stockChange}% {company.stockSymbol}
                  </p>
                )}
              </CardContent>
            </Card>
          )}
          <Card>
            <CardContent className="p-6">
              <p className="text-sm font-semibold mb-3">标签</p>
              <div className="flex flex-wrap gap-2">{company.tags.map((tag) => (<Badge key={tag} variant="secondary">{tag}</Badge>))}</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}