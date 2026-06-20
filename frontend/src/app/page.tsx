"use client";
import { motion } from "framer-motion";
import { ParticleBackground } from "@/components/shared/particle-background";
import { TextReveal } from "@/components/shared/text-reveal";
import { StatCard } from "@/components/shared/stat-card";
import { EventCard } from "@/components/shared/event-card";
import { TrendChart } from "@/components/shared/trend-chart";
import { GlassCard } from "@/components/shared/glass-card";
import { HeatBadge } from "@/components/shared/heat-badge";
import { InfiniteMarquee } from "@/components/shared/infinite-marquee";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spotlight } from "@/components/shared/spotlight";
import { mockEvents, mockTrends } from "@/lib/mock-data";
import { Activity, Database, Building2, FileText, ArrowRight, Zap, TrendingUp, Brain, Sparkles } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const explodingEvents = mockEvents.filter((e) => e.status === "exploding");
  const risingEvents = mockEvents.filter((e) => e.status === "rising");
  const topEvents = [...mockEvents].sort((a, b) => b.heatScore - a.heatScore).slice(0, 6);

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative -mx-4 lg:-mx-8 -mt-6 overflow-hidden">
        <div className="relative h-[520px] flex items-center justify-center">
          <ParticleBackground particleCount={40} />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--background)]" />
          <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <Badge variant="secondary" className="mb-6 px-4 py-1.5">
                <Zap className="h-3 w-3 mr-1 text-[var(--heat)]" />
                AI 驱动的实时热点发现
              </Badge>
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
              <span className="gradient-text">Global AI Radar</span>
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-xl text-[var(--muted-foreground)] mb-8"
            >
              发现趋势，而不是等待新闻
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex items-center justify-center gap-4"
            >
              <Link href="/events">
                <Button size="lg" className="gap-2">
                  探索热点 <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button variant="outline" size="lg">
                  了解更多
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Hot Events Marquee */}
      <section>
        <InfiniteMarquee speed={40} className="py-2">
          {mockEvents.map((event) => (
            <Link key={event.id} href={`/events/${event.id}`} className="flex items-center gap-3 px-4 py-2 rounded-full bg-[var(--card)] border border-[var(--border)] hover:border-[var(--primary)]/50 transition-colors">
              <HeatBadge score={event.heatScore} size="sm" showLabel={false} />
              <span className="text-sm font-medium whitespace-nowrap">{event.titleZh}</span>
            </Link>
          ))}
        </InfiniteMarquee>
      </section>

      {/* Stats Section */}
      <section>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="热点事件" value={1284} icon={<Activity className="h-5 w-5" />} trend={12.5} />
          <StatCard label="数据源" value={5620} icon={<Database className="h-5 w-5" />} trend={8.3} />
          <StatCard label="跟踪公司" value={892} icon={<Building2 className="h-5 w-5" />} trend={15.7} />
          <StatCard label="研究报告" value={347} icon={<FileText className="h-5 w-5" />} trend={22.1} />
        </div>
      </section>

      {/* Exploding Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="h-8 w-1 rounded-full bg-[var(--destructive)]" />
            <div>
              <h2 className="text-2xl font-bold">?? 爆发榜</h2>
              <p className="text-sm text-[var(--muted-foreground)]">当前最热的 AI 事件</p>
            </div>
          </div>
          <Link href="/events?status=exploding">
            <Button variant="ghost" className="gap-1">
              查看全部 <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {explodingEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </section>

      {/* About to Explode */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="h-8 w-1 rounded-full bg-[var(--heat)]" />
            <div>
              <h2 className="text-2xl font-bold">? 即将爆发</h2>
              <p className="text-sm text-[var(--muted-foreground)]">AI 预测即将升温的事件</p>
            </div>
          </div>
          <Link href="/events?status=rising">
            <Button variant="ghost" className="gap-1">
              查看全部 <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {risingEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </section>

      {/* Trend Chart Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="h-8 w-1 rounded-full bg-[var(--primary)]" />
            <div>
              <h2 className="text-2xl font-bold">?? 趋势总览</h2>
              <p className="text-sm text-[var(--muted-foreground)]">全领域热度趋势</p>
            </div>
          </div>
          <Link href="/trends">
            <Button variant="ghost" className="gap-1">
              详细分析 <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <Card>
          <CardContent className="p-6">
            <TrendChart data={mockEvents[0].heatHistory} height={300} />
          </CardContent>
        </Card>
      </section>

      {/* AI Insights */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="h-8 w-1 rounded-full bg-[var(--success)]" />
          <div>
            <h2 className="text-2xl font-bold">?? AI 洞察</h2>
            <p className="text-sm text-[var(--muted-foreground)]">AI 生成的深度分析</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Spotlight>
            <GlassCard>
              <div className="flex items-start gap-3 mb-3">
                <Brain className="h-5 w-5 text-[var(--primary)] mt-0.5" />
                <h3 className="font-semibold">多模态 AI 竞赛加速</h3>
              </div>
              <p className="text-sm text-[var(--muted-foreground)] mb-4">
                GPT-5、Gemini 2.5 Ultra 和 Llama 4 的相继发布表明，多模态 AI 能力已成为主要 AI 实验室的核心竞争维度。预计未来 3 个月内，多模态能力将成为企业选型的首要考量。
              </p>
              <div className="flex items-center justify-between">
                <Badge variant="success">置信度 88%</Badge>
                <Link href="/insights">
                  <span className="text-xs text-[var(--primary)] hover:underline cursor-pointer">查看详情 →</span>
                </Link>
              </div>
            </GlassCard>
          </Spotlight>
          <Spotlight>
            <GlassCard>
              <div className="flex items-start gap-3 mb-3">
                <Sparkles className="h-5 w-5 text-[var(--heat)] mt-0.5" />
                <h3 className="font-semibold">AI 芯片格局重塑</h3>
              </div>
              <p className="text-sm text-[var(--muted-foreground)] mb-4">
                AMD MI450 的发布和云厂商自研芯片的加速，正在打破 NVIDIA 的垄断格局。AI 芯片市场竞争将在 2026 年下半年达到白热化，训练成本有望下降 30-40%。
              </p>
              <div className="flex items-center justify-between">
                <Badge variant="warning">置信度 75%</Badge>
                <Link href="/insights">
                  <span className="text-xs text-[var(--primary)] hover:underline cursor-pointer">查看详情 →</span>
                </Link>
              </div>
            </GlassCard>
          </Spotlight>
        </div>
      </section>

      {/* Investment Impact */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="h-8 w-1 rounded-full bg-[var(--warning)]" />
          <div>
            <h2 className="text-2xl font-bold">?? 投资影响</h2>
            <p className="text-sm text-[var(--muted-foreground)]">AI 事件对市场的影响分析</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mockEvents.slice(0, 3).map((event) => (
            <Card key={event.id} className="hover:border-[var(--primary)]/50 transition-colors">
              <CardContent className="p-5">
                <HeatBadge score={event.heatScore} size="sm" className="mb-3" />
                <h3 className="font-semibold text-sm mb-2 line-clamp-2">{event.titleZh}</h3>
                <p className="text-xs text-[var(--muted-foreground)] mb-3 line-clamp-2">{event.aiAnalysis}</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[var(--success)]">正面影响</span>
                  <span className="text-[var(--muted-foreground)]">影响指数: {(event.heatScore * 0.8).toFixed(0)}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Knowledge Graph Preview */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="h-8 w-1 rounded-full bg-purple-500" />
          <div>
            <h2 className="text-2xl font-bold">??? 知识图谱</h2>
            <p className="text-sm text-[var(--muted-foreground)]">AI 事件、公司、技术的关联网络</p>
          </div>
        </div>
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="h-64 flex items-center justify-center bg-gradient-to-br from-[var(--card)] to-[var(--background)] relative">
              <div className="absolute inset-0 dot-grid opacity-30" />
              <div className="relative z-10 text-center">
                <div className="flex items-center justify-center gap-4 mb-4">
                  {["OpenAI", "Google", "Meta", "NVIDIA", "Anthropic"].map((name, i) => (
                    <motion.div
                      key={name}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                      className="px-3 py-1.5 rounded-full bg-[var(--primary)]/20 text-[var(--primary)] text-xs font-medium"
                    >
                      {name}
                    </motion.div>
                  ))}
                </div>
                <p className="text-sm text-[var(--muted-foreground)]">
                  可视化 AI 生态系统中事件、公司和技术的关联关系
                </p>
                <Link href="/trends">
                  <Button variant="outline" size="sm" className="mt-4">
                    探索图谱
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* CTA Section */}
      <section>
        <Spotlight>
          <Card className="border-[var(--primary)]/30 overflow-hidden">
            <CardContent className="p-12 text-center relative">
              <div className="absolute inset-0 dot-grid opacity-10" />
              <div className="relative z-10">
                <h2 className="text-3xl font-bold mb-4">
                  <span className="gradient-text">开始你的 AI 情报之旅</span>
                </h2>
                <p className="text-[var(--muted-foreground)] mb-8 max-w-lg mx-auto">
                  加入 HotRadar AI，第一时间获取全球 AI 热点动态、深度分析和投资洞察。
                </p>
                <div className="flex items-center justify-center gap-4">
                  <Link href="/auth/register">
                    <Button size="lg" className="gap-2">
                      免费注册 <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/pricing">
                    <Button variant="outline" size="lg">
                      查看定价
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </Spotlight>
      </section>
    </div>
  );
}
