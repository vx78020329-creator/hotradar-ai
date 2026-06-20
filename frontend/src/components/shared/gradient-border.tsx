"use client";
import { cn } from "@/lib/utils";

interface GradientBorderProps {
  children: React.ReactNode;
  className?: string;
  colors?: string[];
}

export function GradientBorder({ children, className, colors = ["#3B82F6", "#60A5FA", "#93C5FD"] }: GradientBorderProps) {
  const gradient = `linear-gradient(135deg, ${colors.join(", ")})`;

  return (
    <div className={cn("relative p-[1px] rounded-xl", className)} style={{ background: gradient }}>
      <div className="rounded-xl bg-[var(--card)] h-full w-full">
        {children}
      </div>
    </div>
  );
}
