"""InsightAgent - Analyzes events for significance and generates insight cards.

Produces structured insight cards with confidence scores, impact
assessment, and actionable takeaways. Template-based for demo.
"""

from __future__ import annotations

import random
from typing import Any

from agents.base import BaseAgent
from agents.crawler_agent import CrawlerAgent
from agents.dedup_agent import DedupAgent


# ------------------------------------------------------------------
# Significance scoring rules
# ------------------------------------------------------------------

_CATEGORY_WEIGHT: dict[str, float] = {
    "LLM Release": 0.95,
    "Open Source Model": 0.90,
    "Funding Round": 0.85,
    "Acquisition": 0.92,
    "Regulation": 0.88,
    "Chip / Hardware": 0.87,
    "Partnership": 0.65,
    "Product Launch": 0.75,
    "Research Paper": 0.70,
    "Benchmark Result": 0.72,
    "Robotics": 0.78,
    "Autonomous Driving": 0.74,
    "AI Safety": 0.82,
    "Developer Tools": 0.60,
    "Enterprise AI": 0.68,
    "Creative AI": 0.66,
    "AI Infrastructure": 0.64,
    "API Update": 0.55,
    "Layoffs": 0.60,
    "Hiring": 0.45,
}

_IMPACT_DESCRIPTIONS: dict[str, list[str]] = {
    "LLM Release": [
        "Resets the competitive landscape for foundation models",
        "Raises the bar for reasoning and multimodal capabilities",
        "Could shift enterprise procurement decisions",
    ],
    "Open Source Model": [
        "Democratizes access to frontier-class AI capabilities",
        "Pressure on closed-source providers to justify pricing",
        "Accelerates community-driven fine-tuning ecosystem",
    ],
    "Funding Round": [
        "Signals investor conviction in AI growth trajectory",
        "Provides runway for aggressive hiring and compute spend",
        "May trigger competitive funding responses",
    ],
    "Acquisition": [
        "Consolidates key talent and technology",
        "May reduce consumer choice in the long term",
        "Signals strategic priority shift for the acquirer",
    ],
    "Regulation": [
        "Sets precedent for global AI governance",
        "Compliance costs may disadvantage smaller players",
        "Could slow or redirect AI development timelines",
    ],
    "Chip / Hardware": [
        "Unlocks next tier of model training scale",
        "Shifts competitive dynamics in AI compute supply chain",
        "Enables new deployment scenarios (edge, mobile)",
    ],
}


class InsightAgent(BaseAgent):
    """Analyzes events for strategic significance and generates insight cards.

    Each insight card contains:
      - significance score (0-100)
      - impact level (critical / high / medium / low)
      - confidence score (0-1)
      - impact description
      - actionable takeaway
    """

    name = "insight"
    description = "Analyzes event significance and generates insight cards"
    schedule_interval = 3600

    async def execute(self, **kwargs: Any) -> dict[str, Any]:
        """Analyze events and produce insight cards.

        Accepts `events` kwarg. If absent, runs upstream pipeline.
        """
        events: list[dict[str, Any]] | None = kwargs.get("events")
        if events is None:
            self.logger.info("No input; running upstream pipeline")
            crawler = CrawlerAgent()
            dedup = DedupAgent()
            crawl_res = await crawler.run()
            dedup_res = await dedup.run(events=crawl_res["data"]["events"])
            events = dedup_res["data"]["events"]

        insights: list[dict[str, Any]] = []
        for evt in events:
            insight = self._analyze_event(evt)
            insights.append(insight)

        # Sort by significance descending
        insights.sort(key=lambda x: x["significance_score"], reverse=True)

        critical = sum(1 for i in insights if i["impact_level"] == "critical")
        high = sum(1 for i in insights if i["impact_level"] == "high")

        self.logger.info(
            "Generated %d insights (%d critical, %d high)",
            len(insights), critical, high,
        )

        return {
            "total_insights": len(insights),
            "critical_count": critical,
            "high_count": high,
            "insights": insights,
        }

    def _analyze_event(self, event: dict[str, Any]) -> dict[str, Any]:
        """Produce an insight card for a single event."""
        category = event.get("category", "")
        company = event.get("company", "")
        engagement = event.get("engagement", {})
        raw_score = event.get("raw_score", 50)

        # Calculate significance score
        cat_weight = _CATEGORY_WEIGHT.get(category, 0.5)
        engagement_bonus = min(engagement.get("likes", 0) / 5000, 0.15)
        source_bonus = min(event.get("merge_count", 1) * 0.03, 0.12)
        significance = round(
            min((cat_weight + engagement_bonus + source_bonus) * 100, 100), 1
        )

        # Impact level
        if significance >= 85:
            impact_level = "critical"
        elif significance >= 70:
            impact_level = "high"
        elif significance >= 50:
            impact_level = "medium"
        else:
            impact_level = "low"

        # Confidence based on source diversity
        source_count = event.get("merge_count", 1)
        confidence = round(min(0.5 + source_count * 0.12 + random.uniform(0, 0.15), 0.98), 2)

        # Impact description
        impacts = _IMPACT_DESCRIPTIONS.get(category, [
            "Notable development in the AI industry",
            "Warrants monitoring for downstream effects",
        ])
        impact_desc = random.choice(impacts)

        # Actionable takeaway
        takeaway = self._generate_takeaway(event, impact_level)

        return {
            "event_id": event.get("event_id", ""),
            "title": event.get("title", ""),
            "category": category,
            "company": company,
            "significance_score": significance,
            "impact_level": impact_level,
            "confidence": confidence,
            "impact_description": impact_desc,
            "takeaway": takeaway,
            "signals": self._extract_signals(event),
        }

    def _generate_takeaway(self, event: dict[str, Any], level: str) -> str:
        """Generate an actionable takeaway based on impact level."""
        company = event.get("company", "the company")
        category = event.get("category", "")

        if level == "critical":
            return (
                f"Immediate attention required. Monitor {company} closely for follow-up "
                f"announcements. Assess impact on portfolio/strategy."
            )
        elif level == "high":
            return (
                f"Significant development worth tracking. Review implications for "
                f"{category.lower()} landscape within 48 hours."
            )
        elif level == "medium":
            return (
                f"Add to watchlist. May become significant with additional developments. "
                f"Review at next strategy meeting."
            )
        else:
            return "Background signal. Log for trend analysis but no immediate action needed."

    def _extract_signals(self, event: dict[str, Any]) -> list[str]:
        """Extract early-warning signals from the event."""
        signals: list[str] = []
        cat = event.get("category", "")
        company = event.get("company", "")
        engagement = event.get("engagement", {})

        if engagement.get("shares", 0) > 1000:
            signals.append("high_virality")
        if event.get("merge_count", 1) >= 3:
            signals.append("multi_source_confirmed")
        if cat in ("LLM Release", "Open Source Model"):
            signals.append("model_cycle_active")
        if cat == "Funding Round":
            signals.append("capital_flowing")
        if cat in ("Acquisition",):
            signals.append("consolidation_trend")
        if cat == "Regulation":
            signals.append("regulatory_shift")

        return signals


if __name__ == "__main__":
    import asyncio

    async def _main() -> None:
        agent = InsightAgent()
        result = await agent.run()
        data = result["data"]
        print(f"Generated {data['total_insights']} insights")
        print(f"  Critical: {data['critical_count']}, High: {data['high_count']}")
        for i in data["insights"][:5]:
            print(f"\n  [{i['impact_level'].upper()}] {i['title'][:55]}")
            print(f"    Score: {i['significance_score']} | Confidence: {i['confidence']}")
            print(f"    {i['takeaway'][:80]}")

    asyncio.run(_main())
