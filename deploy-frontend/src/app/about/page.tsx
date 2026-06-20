import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Brain, Globe, Zap, Users, Target, Shield } from "lucide-react";
import Link from "next/link";

export const metadata = { title: "关于 HotRadar AI" };

const values = [
  { icon: Brain, title: "AI 驱动", desc: "利用先进的 AI 技术自动发现、分析和预测 AI 领域的热点趋势" },
  { icon: Globe, title: "全球视野", desc: "覆盖全球主要 AI 信息源，包括论文、新闻、社交媒体和官方公告" },
  { icon: Zap, title: "实时响应", desc: "分钟级的热点发现和推送，确保你不会错过任何重要动态" },
  { icon: Target, title: "精准预测", desc: "基于历史数据和 AI 模型，预测事件的爆发趋势和影响范围" },
  { icon: Users, title: "社区驱动", desc: "结合专业分析师和社区用户的智慧，提供多元化的视角" },
  { icon: Shield, title: "数据安全", desc: "企业级数据安全保护，确保用户数据和分析结果的安全性" },
];

export default function AboutPage() {
  return (
    <div className="py-12 space-y-16">
      <div className="text-center max-w-3xl mx-auto">
        <Badge variant="secondary" className="mb-4">关于我们</Badge>
        <h1 className="text-4xl font-bold mb-4">用 AI 发现趋势，而不是等待新闻</h1>
        <p className="text-[var(--muted-foreground)] text-lg">
          HotRadar AI 是一个全球 AI 热点发现平台，利用先进的人工智能技术，
          实时追踪和分析全球 AI 领域的最新动态、趋势变化和投资机会。
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {values.map((value) => (
          <Card key={value.title} className="hover:border-[var(--primary)]/50 transition-colors">
            <CardContent className="p-6">
              <value.icon className="h-8 w-8 text-[var(--primary)] mb-4" />
              <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
              <p className="text-sm text-[var(--muted-foreground)]">{value.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">加入我们</h2>
        <p className="text-[var(--muted-foreground)] mb-6 max-w-lg mx-auto">
          无论你是 AI 研究者、投资者还是爱好者，HotRadar AI 都能帮助你更好地理解和把握 AI 领域的发展趋势。
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link href="/auth/register"><Button size="lg">免费注册</Button></Link>
          <Link href="/pricing"><Button variant="outline" size="lg">查看定价</Button></Link>
        </div>
      </div>
    </div>
  );
}
