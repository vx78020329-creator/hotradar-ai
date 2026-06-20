export interface Trend {
  id: string;
  name: string;
  nameZh: string;
  description: string;
  descriptionZh: string;
  category: string;
  direction: "up" | "down" | "stable";
  strength: number;
  confidence: number;
  predictions: Prediction[];
  relatedEvents: string[];
  historicalData: TrendDataPoint[];
  createdAt: string;
  updatedAt: string;
}

export interface Prediction {
  date: string;
  value: number;
  confidence: number;
  label: string;
}

export interface TrendDataPoint {
  date: string;
  value: number;
  volume: number;
}
