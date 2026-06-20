"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Terminal } from "lucide-react";

const logs = [
  { time: "2026-06-21 14:32:01", level: "info", service: "discovery", message: "New event detected: GPT-5 Multimodal Breakthrough" },
  { time: "2026-06-21 14:31:45", level: "info", service: "analysis", message: "Heat score updated for evt-001: 95" },
  { time: "2026-06-21 14:31:22", level: "warn", service: "collection", message: "Twitter API rate limit reached, switching to backup" },
  { time: "2026-06-21 14:30:58", level: "info", service: "reporting", message: "Daily report generation started" },
  { time: "2026-06-21 14:30:15", level: "error", service: "collection", message: "Failed to sync source: Twitter/X AI - Connection timeout" },
  { time: "2026-06-21 14:29:44", level: "info", service: "notification", message: "Push notification sent: 1284 users notified about exploding event" },
  { time: "2026-06-21 14:29:12", level: "info", service: "knowledge", message: "Knowledge graph updated: 15 new relationships discovered" },
  { time: "2026-06-21 14:28:55", level: "warn", service: "agent", message: "Knowledge graph agent stopped unexpectedly" },
  { time: "2026-06-21 14:28:30", level: "info", service: "cleanup", message: "Data deduplication complete: 23 duplicates removed" },
  { time: "2026-06-21 14:28:01", level: "info", service: "ai", message: "AI insight generated for 6 events" },
];

const levelColors: Record<string, "default" | "success" | "warning" | "destructive"> = {
  info: "default",
  warn: "warning",
  error: "destructive",
};

export default function AdminLogsPage() {
  return (
    <div className="space-y-6">
      <div><h1 className="text-3xl font-bold">系统日志</h1><p className="text-[var(--muted-foreground)] mt-1">查看系统运行日志</p></div>
      <div className="relative max-w-md"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)]" /><Input placeholder="搜索日志..." className="pl-10" /></div>
      <Card>
        <CardContent className="p-0">
          <div className="font-mono text-sm">
            {logs.map((log, i) => (
              <div key={i} className="flex items-start gap-3 px-4 py-3 border-b border-[var(--border)] last:border-0 hover:bg-[var(--secondary)]/30">
                <span className="text-xs text-[var(--muted-foreground)] shrink-0 w-36">{log.time}</span>
                <Badge variant={levelColors[log.level]} className="shrink-0 w-14 justify-center">{log.level}</Badge>
                <span className="text-xs text-[var(--primary)] shrink-0 w-24">[{log.service}]</span>
                <span className="text-xs">{log.message}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
