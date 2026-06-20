"use client";
import { useState } from "react";
import Link from "next/link";
import { useCompanies } from "@/hooks/use-api";
import { HeatBadge } from "@/components/shared/heat-badge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Building2, Search, TrendingUp, TrendingDown } from "lucide-react";
import { formatNumber } from "@/lib/utils";

export default function CompaniesPage() {
  const { data: companies, isLoading } = useCompanies();
  const [search, setSearch] = useState("");

  const filtered = companies?.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.nameZh.includes(search));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">AI 公司</h1>
        <p className="text-[var(--muted-foreground)] mt-1">追踪全球 AI 领域核心公司的动态与热度</p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)]" />
        <Input placeholder="搜索公司..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (<Skeleton key={i} className="h-48 w-full" />))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered?.map((company) => (
            <Link key={company.id} href={`/companies/${company.id}`}>
              <Card className="h-full hover:border-[var(--primary)]/50 transition-all cursor-pointer group">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{company.logo}</span>
                      <div>
                        <h3 className="font-semibold group-hover:text-[var(--primary)] transition-colors">{company.nameZh}</h3>
                        <p className="text-xs text-[var(--muted-foreground)]">{company.industry}</p>
                      </div>
                    </div>
                    <HeatBadge score={company.heatScore} size="sm" showLabel={false} />
                  </div>
                  <p className="text-sm text-[var(--muted-foreground)] line-clamp-2 mb-3">{company.descriptionZh}</p>
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1">
                      {company.stockChange && (
                        <span className={company.stockChange >= 0 ? "text-[var(--success)]" : "text-[var(--destructive)]"}>
                          {company.stockChange >= 0 ? <TrendingUp className="h-3 w-3 inline" /> : <TrendingDown className="h-3 w-3 inline" />}
                          {" "}{company.stockChange > 0 ? "+" : ""}{company.stockChange}%
                        </span>
                      )}
                      {company.stockSymbol && <span className="text-[var(--muted-foreground)] ml-1">{company.stockSymbol}</span>}
                    </div>
                    {company.marketCap && <span className="text-[var(--muted-foreground)]">市值 ${formatNumber(company.marketCap / 1000000000)}B</span>}
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
