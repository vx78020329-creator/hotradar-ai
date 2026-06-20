"use client";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useSearch } from "@/hooks/use-api";
import { EventCard } from "@/components/shared/event-card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { EventCardSkeleton } from "@/components/shared/loading-skeleton";
import { Search, Building2, FileText } from "lucide-react";
import Link from "next/link";

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const { data, isLoading } = useSearch(query);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Search</h1>
        <p className="text-[var(--muted-foreground)] mt-1">Search AI hot events, companies and reports</p>
      </div>

      <div className="relative max-w-2xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--muted-foreground)]" />
        <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Type keywords..." className="pl-12 h-12 text-base" />
      </div>

      {!query && (
        <div className="text-center py-16">
          <Search className="h-16 w-16 mx-auto text-[var(--muted-foreground)] mb-4 opacity-50" />
          <p className="text-[var(--muted-foreground)]">Enter keywords to search</p>
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {["GPT-5", "Robotics", "AI Chips", "Autonomous Driving", "OpenAI"].map((tag) => (
              <button key={tag} onClick={() => setQuery(tag)} className="px-3 py-1.5 rounded-full bg-[var(--secondary)] text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors cursor-pointer">{tag}</button>
            ))}
          </div>
        </div>
      )}

      {query && isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (<EventCardSkeleton key={i} />))}
        </div>
      )}

      {data && query && (
        <div className="space-y-8">
          {data.events.length > 0 && (
            <div>
              <h2 className="text-xl font-bold mb-4">Events ({data.events.length})</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.events.map((event) => (<EventCard key={event.id} event={event} />))}
              </div>
            </div>
          )}

          {data.companies.length > 0 && (
            <div>
              <h2 className="text-xl font-bold mb-4">Companies ({data.companies.length})</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.companies.map((company) => (
                  <Link key={company.id} href={`/companies/${company.id}`}>
                    <Card className="hover:border-[var(--primary)]/50 transition-all cursor-pointer">
                      <CardContent className="p-4 flex items-center gap-3">
                        <span className="text-2xl">{company.logo}</span>
                        <div><p className="font-medium">{company.nameZh}</p><p className="text-xs text-[var(--muted-foreground)]">{company.industry}</p></div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {data.events.length === 0 && data.companies.length === 0 && (
            <div className="text-center py-16">
              <p className="text-[var(--muted-foreground)]">No results found for &quot;{query}&quot;</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="py-16 text-center text-[var(--muted-foreground)]">Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
}