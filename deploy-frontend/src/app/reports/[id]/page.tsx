"use client";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useReport } from "@/hooks/use-api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Clock, Eye, Calendar, User, Share2, Download } from "lucide-react";
import { formatDate, formatNumber } from "@/lib/utils";

const typeLabels: Record<string, string> = { daily: "日报", weekly: "周报", monthly: "月报", special: "专题" };

export default function ReportDetailPage() {
  const params = useParams();
  const { data: report, isLoading } = useReport(params.id as string);

  if (isLoading) {
    return (<div className="space-y-6"><Skeleton className="h-8 w-32" /><Skeleton className="h-12 w-3/4" /><Skeleton className="h-96 w-full" /></div>);
  }

  if (!report) {
    return (<div className="text-center py-20"><p className="text-[var(--muted-foreground)]">报告未找到</p><Link href="/reports"><Button variant="ghost" className="mt-4">返回报告列表</Button></Link></div>);
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Link href="/reports" className="inline-flex items-center gap-2 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
        <ArrowLeft className="h-4 w-4" /> 返回报告列表
      </Link>

      <div>
        <Badge variant="secondary" className="mb-3">{typeLabels[report.type]}</Badge>
        <h1 className="text-3xl font-bold mb-2">{report.titleZh}</h1>
        <p className="text-lg text-[var(--muted-foreground)]">{report.summaryZh}</p>
      </div>

      <div className="flex items-center gap-6 text-sm text-[var(--muted-foreground)]">
        <span className="flex items-center gap-1"><User className="h-4 w-4" />{report.author}</span>
        <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />{formatDate(report.publishedAt)}</span>
        <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{report.readTime} 分钟</span>
        <span className="flex items-center gap-1"><Eye className="h-4 w-4" />{formatNumber(report.views)}</span>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" size="sm" className="gap-1"><Share2 className="h-4 w-4" /> 分享</Button>
        <Button variant="outline" size="sm" className="gap-1"><Download className="h-4 w-4" /> 下载 PDF</Button>
      </div>

      <Card>
        <CardHeader><CardTitle>报告要点</CardTitle></CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {report.highlights.map((h, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-[var(--primary)] shrink-0" />
                <span className="text-[var(--muted-foreground)]">{h}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>完整报告</CardTitle></CardHeader>
        <CardContent>
          <div className="prose prose-invert max-w-none">
            <p className="text-[var(--muted-foreground)] leading-relaxed">
              {report.summaryZh}
            </p>
            <p className="text-[var(--muted-foreground)] leading-relaxed mt-4">
              本报告基于 HotRadar AI 平台的实时数据分析和 AI 模型生成。报告涵盖了本周 AI 领域的重大事件、趋势变化和投资影响分析。
              数据来源包括 {report.tags.join("、")} 等多个维度的信息。
            </p>
            <p className="text-[var(--muted-foreground)] leading-relaxed mt-4">
              关键发现：本周 AI 领域呈现出多模态能力竞赛加速、开源生态持续繁荣、AI 芯片竞争白热化三大趋势。
              这些趋势将对整个 AI 产业链产生深远影响。
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-2">{report.tags.map((tag) => (<Badge key={tag} variant="secondary">{tag}</Badge>))}</div>
        </CardContent>
      </Card>
    </div>
  );
}