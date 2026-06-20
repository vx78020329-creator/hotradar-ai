export type ReportType = "daily" | "weekly" | "monthly" | "special";

export interface Report {
  id: string;
  title: string;
  titleZh: string;
  type: ReportType;
  summary: string;
  summaryZh: string;
  content: string;
  contentZh: string;
  highlights: string[];
  charts: ChartData[];
  publishedAt: string;
  author: string;
  tags: string[];
  readTime: number;
  views: number;
}

export interface ChartData {
  type: "line" | "bar" | "pie" | "area";
  title: string;
  data: Record<string, unknown>[];
}
