"use client";
import Link from "next/link";
import { useReports } from "@/hooks/use-api";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, Clock, Eye, Calendar } from "lucide-react";
import { formatDate, formatNumber } from "@/lib/utils";
import { AnimatedTabs } from "@/components/shared/animated-tabs";

const typeColors: Record<string, "default" | "secondary" | "success" | "warning"> = {
  daily: "success",
  weekly: "default",
  monthly: "warning",
  special: "secondary",
};

const typeLabels: Record<string, string> = {
  daily: "日报",
  weekly: "周报",
  monthly: "月报",
  special: "专题",
};

export default function ReportsPage() {
  const { data: reports, isLoading } = useReports();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">研究报告</h1>
        <p className="text-[var(--muted-foreground)] mt-1">AI 生成的深度研究报告</p>
      </div>

      {isLoading ? (
        <div className="space-y-4">{Array.from({ length: 3 }).map((_, i) => (<Skeleton key={i} className="h-40 w-full" />))}</div>
      ) : (
        <div className="space-y-4">
          {reports?.map((report) => (
            <Link key={report.id} href={`/reports/${report.id}`}>
              <Card className="hover:border-[var(--primary)]/50 transition-all cursor-pointer group mb-4">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant={typeColors[report.type]}>{typeLabels[report.type]}</Badge>
                        <span className="text-xs text-[var(--muted-foreground)] flex items-center gap-1"><Clock className="h-3 w-3" />{report.readTime} 分钟阅读</span>
                      </div>
                      <h3 className="text-lg font-semibold mb-2 group-hover:text-[var(--primary)] transition-colors">{report.titleZh}</h3>
                      <p className="text-sm text-[var(--muted-foreground)] mb-3 line-clamp-2">{report.summaryZh}</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {report.highlights.map((h, i) => (
                          <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-[var(--secondary)] text-[var(--muted-foreground)]">{h}</span>
                        ))}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-[var(--muted-foreground)]">
                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{formatDate(report.publishedAt)}</span>
                        <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{formatNumber(report.views)}</span>
                        <span>{report.author}</span>
                      </div>
                    </div>
                    <FileText className="h-8 w-8 text-[var(--muted-foreground)] shrink-0" />
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
