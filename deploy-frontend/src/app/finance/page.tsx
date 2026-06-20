"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HeatBadge } from "@/components/shared/heat-badge";
import { TrendChart } from "@/components/shared/trend-chart";
import { mockEvents } from "@/lib/mock-data";
import { TrendingUp, TrendingDown, DollarSign, BarChart3, AlertTriangle } from "lucide-react";

const marketImpact = [
  { company: "NVIDIA", symbol: "NVDA", change: 2.8, impact: "正面", reason: "B300 发布推动股价上涨", heat: 82 },
  { company: "AMD", symbol: "AMD", change: 4.2, impact: "正面", reason: "MI450 获市场认可", heat: 71 },
  { company: "Tesla", symbol: "TSLA", change: -1.2, impact: "中性", reason: "Optimus 部署但规模化存疑", heat: 76 },
  { company: "Google", symbol: "GOOGL", change: 3.2, impact: "正面", reason: "Gemini 2.5 Ultra 技术领先", heat: 88 },
  { company: "Meta", symbol: "META", change: 5.1, impact: "正面", reason: "Llama 4 开源获开发者支持", heat: 90 },
  { company: "Apple", symbol: "AAPL", change: 1.8, impact: "正面", reason: "端侧 AI 突破", heat: 73 },
];

export default function FinancePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">投资影响分析</h1>
        <p className="text-[var(--muted-foreground)] mt-1">AI 事件对金融市场的影响分析与投资信号</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card><CardContent className="p-6"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-[var(--success)]/10"><TrendingUp className="h-5 w-5 text-[var(--success)]" /></div><div><p className="text-sm text-[var(--muted-foreground)]">正面信号</p><p className="text-2xl font-bold">18</p></div></div></CardContent></Card>
        <Card><CardContent className="p-6"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-[var(--warning)]/10"><AlertTriangle className="h-5 w-5 text-[var(--warning)]" /></div><div><p className="text-sm text-[var(--muted-foreground)]">中性信号</p><p className="text-2xl font-bold">7</p></div></div></CardContent></Card>
        <Card><CardContent className="p-6"><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-[var(--destructive)]/10"><TrendingDown className="h-5 w-5 text-[var(--destructive)]" /></div><div><p className="text-sm text-[var(--muted-foreground)]">负面信号</p><p className="text-2xl font-bold">3</p></div></div></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle>市场影响矩阵</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-4">
            {marketImpact.map((item) => (
              <div key={item.symbol} className="flex items-center gap-4 p-4 rounded-lg bg-[var(--secondary)]/30 hover:bg-[var(--secondary)]/50 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold">{item.company}</span>
                    <span className="text-xs text-[var(--muted-foreground)]">{item.symbol}</span>
                    <Badge variant={item.impact === "正面" ? "success" : item.impact === "负面" ? "destructive" : "warning"}>{item.impact}</Badge>
                  </div>
                  <p className="text-sm text-[var(--muted-foreground)]">{item.reason}</p>
                </div>
                <div className="text-right">
                  <p className={"text-lg font-bold " + (item.change >= 0 ? "text-[var(--success)]" : "text-[var(--destructive)]")}>
                    {item.change > 0 ? "+" : ""}{item.change}%
                  </p>
                  <HeatBadge score={item.heat} size="sm" showLabel={false} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>AI 热度 vs 市场表现</CardTitle></CardHeader>
        <CardContent>
          <TrendChart data={mockEvents[0].heatHistory} height={250} />
        </CardContent>
      </Card>
    </div>
  );
}
