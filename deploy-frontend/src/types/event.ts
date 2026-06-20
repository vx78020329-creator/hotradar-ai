export type EventStatus = "new" | "rising" | "exploding" | "stable" | "declining" | "dead";

export type EventCategory =
  | "llm"
  | "computer-vision"
  | "robotics"
  | "ai-chips"
  | "autonomous-driving"
  | "ai-safety"
  | "ai-funding"
  | "ai-regulation"
  | "generative-ai"
  | "ai-education"
  | "ai-healthcare"
  | "ai-entertainment";

export interface HotEvent {
  id: string;
  title: string;
  titleZh: string;
  description: string;
  descriptionZh: string;
  category: EventCategory;
  status: EventStatus;
  heatScore: number;
  heatHistory: HeatPoint[];
  sources: Source[];
  companies: string[];
  tags: string[];
  aiAnalysis: string;
  relatedEvents: string[];
  createdAt: string;
  updatedAt: string;
  views: number;
  shares: number;
  imageUrl?: string;
}

export interface HeatPoint {
  date: string;
  score: number;
}

export interface Source {
  name: string;
  url: string;
  type: "news" | "social" | "academic" | "official" | "blog";
  publishedAt: string;
}
