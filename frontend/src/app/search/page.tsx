"use client";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Search as SearchIcon, Building2 } from "lucide-react";

const API_BASE = "https://aihot-v2-production.up.railway.app/api";

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const doSearch = (q: string) => {
    if (!q.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    fetch(`${API_BASE}/events?limit=50`)
      .then((r) => r.json())
      .then((json) => {
        const events = (json.data || []).filter(
          (e: any) =>
            e.title?.toLowerCase().includes(q.toLowerCase()) ||
            e.summary?.toLowerCase().includes(q.toLowerCase()) ||
            e.category?.toLowerCase().includes(q.toLowerCase())
        );
        setResults(events);
      })
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">搜索</h1>
        <p className="text-[var(--muted-foreground)] mt-1">搜索 AI 热点事件、公司和报告</p>
      </div>

      <div className="relative max-w-2xl">
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--muted-foreground)]" />
        <Input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            doSearch(e.target.value);
          }}
          placeholder="输入关键词搜索..."
          className="pl-12 h-12 text-base"
        />
      </div>

      {!query && (
        <div className="text-center py-16">
          <SearchIcon className="h-16 w-16 mx-auto text-[var(--muted-foreground)] mb-4 opacity-50" />
          <p className="text-[var(--muted-foreground)]">输入关键词开始搜索</p>
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {["GPT-5", "Robotics", "AI Chips", "OpenAI", "LLM", "NVIDIA"].map((tag) => (
              <button
                key={tag}
                onClick={() => {
                  setQuery(tag);
                  doSearch(tag);
                }}
                className="px-3 py-1.5 rounded-full bg-[var(--secondary)] text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors cursor-pointer"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-40 w-full" />
          ))}
        </div>
      )}

      {query && !loading && (
        <div className="space-y-4">
          <p className="text-sm text-[var(--muted-foreground)]">
            找到 {results.length} 个结果
          </p>
          {results.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.map((event: any) => (
                <Link key={event.id} href={`/events/${event.id}`}>
                  <Card className="h-full hover:border-[var(--primary)]/50 transition-all cursor-pointer group">
                    <CardContent className="p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary" className="text-xs">
                          {event.category}
                        </Badge>
                        <span className="text-xs text-[var(--muted-foreground)]">
                          热度 {event.heat_score}
                        </span>
                      </div>
                      <h3 className="font-bold mb-2 group-hover:text-[var(--primary)] transition-colors line-clamp-2">
                        {event.title}
                      </h3>
                      <p className="text-sm text-[var(--muted-foreground)] line-clamp-2">
                        {event.summary}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-[var(--muted-foreground)]">
                未找到 &quot;{query}&quot; 相关结果
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="py-16 text-center text-[var(--muted-foreground)]">
          Loading...
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
