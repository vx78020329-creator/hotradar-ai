"use client";
import { useState } from "react";
import { EventCard } from "@/components/shared/event-card";
import { CategoryFilter } from "@/components/shared/category-filter";
import { AnimatedTabs } from "@/components/shared/animated-tabs";
import { EventCardSkeleton } from "@/components/shared/loading-skeleton";
import { useEvents } from "@/hooks/use-api";
import { LayoutGrid, List, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { EventStatus } from "@/types/event";

const statusTabs = [
  { id: "all", label: "全部" },
  { id: "exploding", label: "爆发中" },
  { id: "rising", label: "上升中" },
  { id: "new", label: "新事件" },
  { id: "stable", label: "稳定" },
];

export default function EventsPage() {
  const [category, setCategory] = useState<string | null>(null);
  const [status, setStatus] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const params: Record<string, string> = { sortBy: "heat" };
  if (category) params.category = category;
  if (status !== "all") params.status = status;

  const { data: events, isLoading } = useEvents(params);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">热点事件</h1>
        <p className="text-[var(--muted-foreground)] mt-1">实时追踪全球 AI 领域最热事件</p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <AnimatedTabs tabs={statusTabs} onChange={setStatus} />
          <div className="flex items-center gap-2">
            <Button variant={viewMode === "grid" ? "secondary" : "ghost"} size="icon" onClick={() => setViewMode("grid")}>
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button variant={viewMode === "list" ? "secondary" : "ghost"} size="icon" onClick={() => setViewMode("list")}>
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <CategoryFilter selected={category} onSelect={setCategory} />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <EventCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-4"}>
          {events?.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}

      {events && events.length === 0 && (
        <div className="text-center py-16">
          <SlidersHorizontal className="h-12 w-12 mx-auto text-[var(--muted-foreground)] mb-4" />
          <p className="text-[var(--muted-foreground)]">没有找到匹配的事件</p>
          <Button variant="ghost" className="mt-2" onClick={() => { setCategory(null); setStatus("all"); }}>
            清除筛选
          </Button>
        </div>
      )}
    </div>
  );
}
