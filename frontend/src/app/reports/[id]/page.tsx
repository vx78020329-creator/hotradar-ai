"use client";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useReport } from "@/hooks/use-api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Clock, Calendar, User, Share2 } from "lucide-react";

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

interface ReportData {
  id: number;
  title: string;
  slug: string;
  summary: string;
  content?: string;
  report_type: string;
  published_at?: string;
  created_at: string;
}

export default function ReportDetailPage() {
  const params = useParams();
  const { data: report, isLoading } = useReport(params.id as string);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  const r = report as ReportData | null;

  if (!r) {
    return (
      <div className="text-center py-20">
        <p className="text-[var(--muted-foreground)]">报告未找到</p>
        <Link href="/reports">
          <Button variant="ghost" className="mt-4">返回报告列表</Button>
        </Link>
      </div>
    );
  }

  const contentText = r.content || r.summary || "";
  const paragraphs = contentText.split(/\n+/).filter((p: string) => p.trim());

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Link
        href="/reports"
        className="inline-flex items-center gap-2 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> 返回报告列表
      </Link>

      <div>
        <Badge variant="secondary" className="mb-3">
          {typeLabels[r.report_type] || r.report_type}
        </Badge>
        <h1 className="text-3xl font-bold mb-2">{r.title}</h1>
        <p className="text-lg text-[var(--muted-foreground)]">{r.summary}</p>
      </div>

      <div className="flex items-center gap-6 text-sm text-[var(--muted-foreground)]">
        <span className="flex items-center gap-1">
          <User className="h-4 w-4" />HotRadar AI
        </span>
        <span className="flex items-center gap-1">
          <Calendar className="h-4 w-4" />
          {formatDate(r.published_at || r.created_at)}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="h-4 w-4" />
          {Math.max(1, Math.ceil(contentText.length / 500))} 分钟阅读
        </span>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" size="sm" className="gap-1">
          <Share2 className="h-4 w-4" /> 分享
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>完整报告</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-invert max-w-none">
            {paragraphs.length > 0 ? (
              paragraphs.map((p: string, i: number) => (
                <p key={i} className="text-[var(--muted-foreground)] leading-relaxed mb-4">
                  {p}
                </p>
              ))
            ) : (
              <p className="text-[var(--muted-foreground)]">{r.summary}</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
