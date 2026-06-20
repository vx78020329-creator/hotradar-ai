"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Database, Plus, Search, RefreshCw, CheckCircle, XCircle } from "lucide-react";

const sources = [
  { id: 1, name: "OpenAI Blog", url: "https://openai.com/blog", type: "official", status: "active", lastSync: "2 分钟前", events: 45 },
  { id: 2, name: "Google AI Blog", url: "https://ai.googleblog.com", type: "official", status: "active", lastSync: "5 分钟前", events: 38 },
  { id: 3, name: "TechCrunch AI", url: "https://techcrunch.com/category/ai", type: "news", status: "active", lastSync: "1 分钟前", events: 124 },
  { id: 4, name: "ArXiv CS.AI", url: "https://arxiv.org/list/cs.AI", type: "academic", status: "active", lastSync: "10 分钟前", events: 256 },
  { id: 5, name: "Hacker News", url: "https://news.ycombinator.com", type: "social", status: "active", lastSync: "30 秒前", events: 89 },
  { id: 6, name: "36氪", url: "https://36kr.com", type: "news", status: "active", lastSync: "3 分钟前", events: 67 },
  { id: 7, name: "Twitter/X AI", url: "https://x.com", type: "social", status: "error", lastSync: "2 小时前", events: 0 },
  { id: 8, name: "Reddit r/MachineLearning", url: "https://reddit.com/r/MachineLearning", type: "social", status: "active", lastSync: "1 分钟前", events: 42 },
];

export default function AdminSourcesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-3xl font-bold">数据源管理</h1><p className="text-[var(--muted-foreground)] mt-1">管理和监控数据源</p></div>
        <Button className="gap-2"><Plus className="h-4 w-4" /> 添加数据源</Button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1 max-w-md"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)]" /><Input placeholder="搜索数据源..." className="pl-10" /></div>
        <Button variant="outline" className="gap-2"><RefreshCw className="h-4 w-4" /> 全部同步</Button>
      </div>

      <div className="space-y-3">
        {sources.map((source) => (
          <Card key={source.id}>
            <CardContent className="p-4 flex items-center gap-4">
              {source.status === "active" ? <CheckCircle className="h-5 w-5 text-[var(--success)] shrink-0" /> : <XCircle className="h-5 w-5 text-[var(--destructive)] shrink-0" />}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold">{source.name}</span>
                  <Badge variant="secondary">{source.type}</Badge>
                </div>
                <p className="text-xs text-[var(--muted-foreground)] truncate">{source.url}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-medium">{source.events} 事件</p>
                <p className="text-xs text-[var(--muted-foreground)]">同步: {source.lastSync}</p>
              </div>
              <Button variant="ghost" size="sm">管理</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
