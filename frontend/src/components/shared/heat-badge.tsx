"use client";
import { cn, getHeatColor, getHeatLabel } from "@/lib/utils";

interface HeatBadgeProps {
  score: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

export function HeatBadge({ score, size = "md", showLabel = true, className }: HeatBadgeProps) {
  const color = getHeatColor(score);
  const label = getHeatLabel(score);

  const sizeClasses = {
    sm: "h-6 px-2 text-xs gap-1",
    md: "h-8 px-3 text-sm gap-1.5",
    lg: "h-10 px-4 text-base gap-2",
  };

  return (
    <div
      className={cn("inline-flex items-center rounded-full font-semibold", sizeClasses[size], className)}
      style={{ backgroundColor: `${color}20`, color }}
    >
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" style={{ backgroundColor: color }} />
        <span className="relative inline-flex h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
      </span>
      <span>{score}</span>
      {showLabel && <span className="opacity-80">{label}</span>}
    </div>
  );
}
