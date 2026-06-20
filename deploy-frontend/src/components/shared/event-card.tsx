"use client";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HeatBadge } from "@/components/shared/heat-badge";
import { StatusIndicator } from "@/components/shared/status-indicator";
import { Eye, Share2 } from "lucide-react";
import type { HotEvent } from "@/types/event";
import { formatNumber, formatDate } from "@/lib/utils";

interface EventCardProps {
  event: HotEvent;
}

export function EventCard({ event }: EventCardProps) {
  return (
    <Link href={`/events/${event.id}`}>
      <Card className="group h-full hover:border-[var(--primary)]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[var(--primary)]/5 cursor-pointer">
        <div className="p-5 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <StatusIndicator status={event.status} />
                <Badge variant="secondary" className="text-xs">
                  {event.category.replace("-", " ")}
                </Badge>
              </div>
              <h3 className="font-semibold text-[var(--foreground)] line-clamp-2 group-hover:text-[var(--primary)] transition-colors">
                {event.titleZh}
              </h3>
            </div>
            <HeatBadge score={event.heatScore} size="sm" />
          </div>

          <p className="text-sm text-[var(--muted-foreground)] line-clamp-2">
            {event.descriptionZh}
          </p>

          <div className="flex flex-wrap gap-1.5">
            {event.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-[var(--secondary)] text-[var(--muted-foreground)]">
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between text-xs text-[var(--muted-foreground)] pt-2 border-t border-[var(--border)]">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {formatNumber(event.views)}
              </span>
              <span className="flex items-center gap-1">
                <Share2 className="h-3 w-3" />
                {formatNumber(event.shares)}
              </span>
            </div>
            <span>{formatDate(event.updatedAt)}</span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
