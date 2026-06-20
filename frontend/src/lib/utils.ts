import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
}

export function getHeatColor(heat: number): string {
  if (heat >= 80) return "#EF4444";
  if (heat >= 60) return "#F97316";
  if (heat >= 40) return "#EAB308";
  return "#22C55E";
}

export function getHeatLabel(heat: number): string {
  if (heat >= 80) return "极热";
  if (heat >= 60) return "热门";
  if (heat >= 40) return "升温";
  return "平静";
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    exploding: "#EF4444",
    rising: "#F97316",
    new: "#3B82F6",
    stable: "#22C55E",
    declining: "#A1A1AA",
    dead: "#52525B",
  };
  return colors[status] || "#A1A1AA";
}

export function slugify(text: string): string {
  return text.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "");
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + "...";
}
