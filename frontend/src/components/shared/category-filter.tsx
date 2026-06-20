"use client";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { id: "LLM", label: "LLM", icon: "🧠" },
  { id: "Computer Vision", label: "计算机视觉", icon: "👁" },
  { id: "Robotics", label: "机器人", icon: "🤖" },
  { id: "AI Research", label: "AI 研究", icon: "🔬" },
  { id: "AI Product", label: "AI 产品", icon: "📱" },
  { id: "AI Safety", label: "AI 安全", icon: "🛡" },
  { id: "AI Policy", label: "AI 政策", icon: "📋" },
  { id: "AI Startup", label: "AI 创业", icon: "🚀" },
  { id: "AI Chips", label: "AI 芯片", icon: "⚡" },
  { id: "AI Finance", label: "AI 金融", icon: "💰" },
  { id: "AI Healthcare", label: "AI 医疗", icon: "🏥" },
  { id: "AI Regulation", label: "AI 监管", icon: "⚖" },
];

interface CategoryFilterProps {
  selected: string | null;
  onSelect: (category: string | null) => void;
  className?: string;
}

export function CategoryFilter({ selected, onSelect, className }: CategoryFilterProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      <button
        onClick={() => onSelect(null)}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-all cursor-pointer",
          selected === null
            ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
            : "bg-[var(--secondary)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
        )}
      >
        全部
      </button>
      {CATEGORIES.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id === selected ? null : cat.id)}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-all cursor-pointer",
            selected === cat.id
              ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
              : "bg-[var(--secondary)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
          )}
        >
          <span>{cat.icon}</span>
          <span>{cat.label}</span>
        </button>
      ))}
    </div>
  );
}
