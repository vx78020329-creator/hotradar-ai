"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedTabsProps {
  tabs: { id: string; label: string }[];
  onChange?: (id: string) => void;
  className?: string;
}

export function AnimatedTabs({ tabs, onChange, className }: AnimatedTabsProps) {
  const [active, setActive] = useState(tabs[0]?.id || "");

  return (
    <div className={cn("flex gap-1 rounded-lg bg-[var(--secondary)] p-1", className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => { setActive(tab.id); onChange?.(tab.id); }}
          className={cn("relative px-4 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer", active === tab.id ? "text-[var(--foreground)]" : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]")}
        >
          {active === tab.id && (
            <motion.div
              layoutId="activeTab"
              className="absolute inset-0 bg-[var(--background)] rounded-md shadow-sm"
              transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
            />
          )}
          <span className="relative z-10">{tab.label}</span>
        </button>
      ))}
    </div>
  );
}
