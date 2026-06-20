"use client";
import Link from "next/link";
import { useReports } from "@/hooks/use-api";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, Clock, Eye, Calendar } from "lucide-react";

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

function formatDate(dateStr?: string | null) {
  if (!dateStr) return "";
  try {
    return new Date(dateStr).toLocaleDateString("zh-CN", {
      year: "numeric", month: "2-digit", day: "2-digit",
    });
  } catch {
    return dateStr;
  }
}

interface ReportItem {
  id: number;
  title: string;
  slug: string;
  summary: string;
  content?: string;
  report_type: string;
  published_at?: string;
  created_at: string;
}

export default function ReportsPage() {
  const { data: reports, isLoading } = useReports();

  const reportList = (reports || []) as ReportItem[];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">研究报告</h1>
        <p className="text-[var(--muted-foreground)] mt-1">AI 生成的深度研究报告与趋势分析</p>
      </div>

      {isLoading ? (
        <div className="space-y-4">{Array.from({ length: 3 }).map((_, i) => (<Skeleton key={i} className="h-40 w-full" />))}</div>
      ) : reportList.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="h-12 w-12 mx-auto mb-4 text-[var(--muted-foreground)]" />
            <h3 className="text-lg font-semibold mb-2">暂无报告</h3>
            <p className="text-[var(--muted-foreground)]">报告正在生成中，请稍后刷新查看</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {reportList.map((report) => (
            <Link key={report.id} href={`/reports/${report.id}`}>
              <Card className="hover:border-[var(--primary)]/50 transition-all cursor-pointer group mb-4">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant={typeColors[report.report_type] || "default"}>
                          {typeLabels[report.report_type] || report.report_type}
                        </Badge>
                        <span className="text-xs text-[var(--muted-foreground)] flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {Math.max(1, Math.ceil((report.content || report.summary || "").length / 500))} 分钟阅读
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold mb-2 group-hover:text-[var(--primary)] transition-colors">
                        {report.title}
                      </h3>
                      <p className="text-sm text-[var(--muted-foreground)] mb-3 line-clamp-2">
                        {report.summary}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-[var(--muted-foreground)]">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(report.published_at || report.created_at)}
                        </span>
                        <span>HotRadar AI</span>
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
