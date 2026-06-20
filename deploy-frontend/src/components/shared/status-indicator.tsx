import { cn, getStatusColor } from "@/lib/utils";
import type { EventStatus } from "@/types/event";

interface StatusIndicatorProps {
  status: EventStatus;
  showLabel?: boolean;
  className?: string;
}

const statusLabels: Record<EventStatus, string> = {
  new: "新事件",
  rising: "上升中",
  exploding: "爆发中",
  stable: "稳定",
  declining: "下降中",
  dead: "已冷却",
};

export function StatusIndicator({ status, showLabel = true, className }: StatusIndicatorProps) {
  const color = getStatusColor(status);

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <span className="relative flex h-2 w-2">
        {(status === "exploding" || status === "rising") && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" style={{ backgroundColor: color }} />
        )}
        <span className="relative inline-flex h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
      </span>
      {showLabel && (
        <span className="text-xs font-medium" style={{ color }}>
          {statusLabels[status]}
        </span>
      )}
    </div>
  );
}
