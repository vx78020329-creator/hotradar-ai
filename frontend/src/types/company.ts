export interface Company {
  id: string;
  name: string;
  nameZh: string;
  logo: string;
  description: string;
  descriptionZh: string;
  industry: string;
  heatScore: number;
  marketCap?: number;
  stockSymbol?: string;
  stockChange?: number;
  founded: string;
  headquarters: string;
  website: string;
  relatedEvents: string[];
  aiAnalysis: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}
