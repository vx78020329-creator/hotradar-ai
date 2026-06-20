"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Globe, Building2, ExternalLink } from "lucide-react";

const API_BASE = "https://aihot-v2-production.up.railway.app/api";

interface CompanyData {
  id: number;
  name: string;
  slug: string;
  description?: string;
  logo_url?: string;
  website?: string;
  industry?: string;
  market_cap?: number;
  created_at: string;
}

interface EventItem {
  id: number;
  title: string;
  summary: string;
  heat_score: number;
  category: string;
  status: string;
}

export default function CompanyDetailPage() {
  const params = useParams();
  const [company, setCompany] = useState<CompanyData | null>(null);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params.id) return;
    Promise.all([
      fetch(`${API_BASE}/companies/${params.id}`).then((r) => r.json()),
      fetch(`${API_BASE}/companies/${params.id}/events?limit=10`).then((r) => r.json()),
    ])
      .then(([companyJson, eventsJson]) => {
        setCompany(companyJson.data || companyJson);
        setEvents(eventsJson.data || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!company) {
    return (
      <div className="text-center py-20">
        <p className="text-[var(--muted-foreground)]">公司未找到</p>
        <Link href="/companies">
          <Button variant="ghost" className="mt-4">返回公司列表</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Link
        href="/companies"
        className="inline-flex items-center gap-2 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> 返回公司列表
      </Link>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 rounded-full bg-[var(--secondary)] flex items-center justify-center text-2xl font-bold shrink-0">
              {company.name.charAt(0)}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-1">{company.name}</h1>
              <p className="text-[var(--muted-foreground)] mb-4">
                {company.industry || "AI"}
              </p>
              <p className="text-[var(--muted-foreground)] mb-4">
                {company.description || `${company.name} 是 AI 行业的领先企业。`}
              </p>
              <div className="flex flex-wrap gap-4 text-sm text-[var(--muted-foreground)]">
                {company.website && (
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:text-[var(--primary)]"
                  >
                    <Globe className="h-4 w-4" />
                    官网 <ExternalLink className="h-3 w-3" />
                  </a>
                )}
                {company.industry && (
                  <span className="flex items-center gap-1">
                    <Building2 className="h-4 w-4" />
                    {company.industry}
                  </span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {events.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4">相关事件</h2>
          <div className="space-y-3">
            {events.map((event) => (
              <Link key={event.id} href={`/events/${event.id}`}>
                <Card className="hover:border-[var(--primary)]/50 transition-all cursor-pointer group mb-3">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className="text-xs">{event.category}</Badge>
                      <span className="text-xs text-[var(--muted-foreground)]">热度 {event.heat_score}</span>
                    </div>
                    <h3 className="font-medium group-hover:text-[var(--primary)] transition-colors">
                      {event.title}
                    </h3>
                    <p className="text-sm text-[var(--muted-foreground)] line-clamp-2 mt-1">
                      {event.summary}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
