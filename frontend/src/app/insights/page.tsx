"use client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GlassCard } from "@/components/shared/glass-card";
import { Spotlight } from "@/components/shared/spotlight";
import { Brain, Sparkles, Target, TrendingUp, Zap, Shield } from "lucide-react";

const insights = [
  { id: 1, title: "多模态 AI 将在 Q3 成为企业标配", content: "基于 GPT-5、Gemini 2.5 Ultra 和 Llama 4 的发布节奏分析，多模态能力将在 2026 年 Q3 成为企业 AI 选型的首要考量。建议关注具备多模态能力的 AI 服务商。", confidence: 88, category: "技术趋势", icon: Brain, color: "text-[var(--primary)]" },
  { id: 2, title: "AI 芯片价格战即将打响", content: "AMD MI450 的发布和云厂商自研芯片的加速，将迫使 NVIDIA 调整定价策略。预计 2026 年下半年 AI 训练成本将下降 30-40%。", confidence: 75, category: "市场分析", icon: Zap, color: "text-[var(--heat)]" },
  { id: 3, title: "开源大模型生态将迎来爆发期", content: "Meta Llama 4 的完全开源策略正在引发连锁反应。预计未来 6 个月内，基于开源模型的应用开发将增长 200%。", confidence: 82, category: "生态趋势", icon: Sparkles, color: "text-[var(--success)]" },
  { id: 4, title: "人形机器人商业化拐点将至", content: "特斯拉 Optimus Gen-3 的工厂部署标志着人形机器人从实验室走向商业化的转折点。制造业和物流将是首批大规模应用领域。", confidence: 65, category: "行业趋势", icon: Target, color: "text-purple-400" },
  { id: 5, title: "AI 监管将重塑全球竞争格局", content: "欧盟 AI 法案第二阶段的执行将产生示范效应，推动全球主要经济体加速 AI 立法。合规成本将成为 AI 企业的重要考量因素。", confidence: 70, category: "监管趋势", icon: Shield, color: "text-[var(--warning)]" },
  { id: 6, title: "端侧 AI 将成为下一个增长引擎", content: "Apple Intelligence 2.0 的端侧 AI 突破证明了在设备端运行高性能 AI 模型的可行性。这将推动整个行业重新思考 AI 部署策略。", confidence: 78, category: "技术趋势", icon: TrendingUp, color: "text-cyan-400" },
];

export default function InsightsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">AI 洞察</h1>
        <p className="text-[var(--muted-foreground)] mt-1">AI 生成的深度分析与预测</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {insights.map((insight) => (
          <Spotlight key={insight.id}>
            <GlassCard>
              <div className="flex items-start gap-3 mb-3">
                <insight.icon className={"h-5 w-5 mt-0.5 " + insight.color} />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="secondary" className="text-xs">{insight.category}</Badge>
                  </div>
                  <h3 className="font-semibold">{insight.title}</h3>
                </div>
              </div>
              <p className="text-sm text-[var(--muted-foreground)] mb-4 leading-relaxed">{insight.content}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-16 rounded-full bg-[var(--secondary)] overflow-hidden">
                    <div className="h-full bg-[var(--primary)] rounded-full" style={{ width: insight.confidence + "%" }} />
                  </div>
                  <span className="text-xs text-[var(--muted-foreground)]">置信度 {insight.confidence}%</span>
                </div>
              </div>
            </GlassCard>
          </Spotlight>
        ))}
      </div>
    </div>
  );
}
