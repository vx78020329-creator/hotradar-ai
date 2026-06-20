"use client";
import { useEffect, useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn, formatNumber } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  icon?: React.ReactNode;
  trend?: number;
  className?: string;
}

export function StatCard({ label, value, prefix = "", suffix = "", icon, trend, className }: StatCardProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [isVisible, value]);

  return (
    <Card ref={ref} className={cn("group hover:border-[var(--primary)]/50 transition-all duration-300", className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm text-[var(--muted-foreground)]">{label}</p>
            <p className="text-3xl font-bold tracking-tight">
              {prefix}{formatNumber(displayValue)}{suffix}
            </p>
            {trend !== undefined && (
              <p className={cn("text-xs font-medium", trend >= 0 ? "text-[var(--success)]" : "text-[var(--destructive)]")}>
                {trend >= 0 ? "↑" : "↓"} {Math.abs(trend)}% 较上周
              </p>
            )}
          </div>
          {icon && (
            <div className="rounded-lg bg-[var(--primary)]/10 p-3 text-[var(--primary)]">
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
