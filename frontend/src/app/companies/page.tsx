"use client";
import { useState } from "react";
import Link from "next/link";
import { useCompanies } from "@/hooks/use-api";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Building2, Search, ExternalLink } from "lucide-react";

interface CompanyItem {
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

export default function CompaniesPage() {
  const { data: companies, isLoading } = useCompanies();
  const [search, setSearch] = useState("");

  const list = (companies || []) as CompanyItem[];
  const filtered = list.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.industry || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">AI 公司</h1>
        <p className="text-[var(--muted-foreground)] mt-1">追踪全球 AI 领域核心公司的动态与热度</p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)]" />
        <Input
          placeholder="搜索公司..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Building2 className="h-12 w-12 mx-auto mb-4 text-[var(--muted-foreground)]" />
            <h3 className="text-lg font-semibold mb-2">暂无公司数据</h3>
            <p className="text-[var(--muted-foreground)]">数据正在生成中，请稍后刷新查看</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((company) => (
            <Link key={company.id} href={`/companies/${company.id}`}>
              <Card className="h-full hover:border-[var(--primary)]/50 transition-all cursor-pointer group">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[var(--secondary)] flex items-center justify-center text-lg font-bold">
                        {company.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-semibold group-hover:text-[var(--primary)] transition-colors">
                          {company.name}
                        </h3>
                        <p className="text-xs text-[var(--muted-foreground)]">
                          {company.industry || "AI"}
                        </p>
                      </div>
                    </div>
                    {company.website && (
                      <a
                        href={company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                  <p className="text-sm text-[var(--muted-foreground)] line-clamp-2 mb-3">
                    {company.description || `${company.name} - AI 行业领先企业`}
                  </p>
                  {company.industry && (
                    <Badge variant="secondary" className="text-xs">
                      {company.industry}
                    </Badge>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
