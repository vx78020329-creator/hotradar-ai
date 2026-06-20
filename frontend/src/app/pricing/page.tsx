"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Zap, Crown, Building2 } from "lucide-react";
import Link from "next/link";
import { Spotlight } from "@/components/shared/spotlight";

const plans = [
  {
    name: "Free",
    nameZh: "免费版",
    price: "￥0",
    period: "/月",
    icon: Zap,
    description: "基础功能，适合个人探索",
    features: [
      { name: "每日热点浏览", included: true },
      { name: "基础趋势图表", included: true },
      { name: "公司信息查看", included: true },
      { name: "每日 10 次搜索", included: true },
      { name: "AI 洞察", included: false },
      { name: "实时推送", included: false },
      { name: "API 访问", included: false },
      { name: "数据导出", included: false },
    ],
    cta: "免费开始",
    variant: "outline" as const,
  },
  {
    name: "Pro",
    nameZh: "专业版",
    price: "￥99",
    period: "/月",
    icon: Crown,
    description: "完整功能，适合专业人士",
    popular: true,
    features: [
      { name: "无限热点浏览", included: true },
      { name: "高级趋势分析", included: true },
      { name: "AI 深度洞察", included: true },
      { name: "实时热点推送", included: true },
      { name: "无限搜索", included: true },
      { name: "研究报告", included: true },
      { name: "数据导出 (CSV/JSON)", included: true },
      { name: "API 访问", included: false },
    ],
    cta: "升级 Pro",
    variant: "default" as const,
  },
  {
    name: "Enterprise",
    nameZh: "企业版",
    price: "￥999",
    period: "/月",
    icon: Building2,
    description: "定制化方案，适合团队和企业",
    features: [
      { name: "Pro 版全部功能", included: true },
      { name: "API 全量访问", included: true },
      { name: "自定义数据源", included: true },
      { name: "团队协作", included: true },
      { name: "专属客户经理", included: true },
      { name: "SLA 保障", included: true },
      { name: "白标方案", included: true },
      { name: "私有部署", included: true },
    ],
    cta: "联系销售",
    variant: "outline" as const,
  },
];

export default function PricingPage() {
  return (
    <div className="py-12 space-y-12">
      <div className="text-center">
        <Badge variant="secondary" className="mb-4">定价方案</Badge>
        <h1 className="text-4xl font-bold mb-4">选择适合你的方案</h1>
        <p className="text-[var(--muted-foreground)] text-lg max-w-2xl mx-auto">
          从免费版开始探索，随时升级获取完整功能和实时数据
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {plans.map((plan) => (
          <Spotlight key={plan.name}>
            <Card className={"relative h-full " + (plan.popular ? "border-[var(--primary)]" : "")}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge>最受欢迎</Badge>
                </div>
              )}
              <CardHeader className="text-center pb-8 pt-8">
                <plan.icon className="h-10 w-10 mx-auto mb-4 text-[var(--primary)]" />
                <CardTitle className="text-2xl">{plan.nameZh}</CardTitle>
                <p className="text-sm text-[var(--muted-foreground)]">{plan.description}</p>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-[var(--muted-foreground)]">{plan.period}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {plan.features.map((feature) => (
                    <div key={feature.name} className="flex items-center gap-3">
                      {feature.included ? (
                        <Check className="h-4 w-4 text-[var(--success)] shrink-0" />
                      ) : (
                        <X className="h-4 w-4 text-[var(--muted-foreground)] shrink-0" />
                      )}
                      <span className={"text-sm " + (feature.included ? "" : "text-[var(--muted-foreground)]")}>{feature.name}</span>
                    </div>
                  ))}
                </div>
                <Link href={plan.name === "Enterprise" ? "/about" : "/auth/register"}>
                  <Button variant={plan.variant} className="w-full mt-6" size="lg">{plan.cta}</Button>
                </Link>
              </CardContent>
            </Card>
          </Spotlight>
        ))}
      </div>
    </div>
  );
}
