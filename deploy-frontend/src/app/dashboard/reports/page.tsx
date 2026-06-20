"use client";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockReports } from "@/lib/mock-data";
import { FileText, Calendar, Clock } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function DashReportsPage() {
  return (
    <div className="space-y-6">
      <div><h1 className="text-3xl font-bold">我的报告</h1><p className="text-[var(--muted-foreground)] mt-1">查看和管理你的报告</p></div>
      <div className="space-y-4">
        {mockReports.map((report) => (
          <Link key={report.id} href={`/reports/${report.id}`}>
            <Card className="hover:border-[var(--primary)]/50 transition-all cursor-pointer mb-4">
              <CardContent className="p-5 flex items-center gap-4">
                <FileText className="h-8 w-8 text-[var(--muted-foreground)] shrink-0" />
                <div className="flex-1">
                  <h3 className="font-semibold">{report.titleZh}</h3>
                  <p className="text-sm text-[var(--muted-foreground)] line-clamp-1">{report.summaryZh}</p>
                </div>
                <div className="text-right shrink-0">
                  <Badge variant="secondary">{report.type}</Badge>
                  <p className="text-xs text-[var(--muted-foreground)] mt-1 flex items-center gap-1"><Calendar className="h-3 w-3" />{formatDate(report.publishedAt)}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
