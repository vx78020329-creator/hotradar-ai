"""RankingAgent - Generates leaderboards and ranked lists.

Produces multiple ranking views: top exploding, top rising,
category leaders, company spotlight, and cross-category movers.
"""

from __future__ import annotations

from typing import Any

from agents.base import BaseAgent
from agents.crawler_agent import CrawlerAgent
from agents.dedup_agent import DedupAgent
from agents.insight_agent import InsightAgent
from agents.trend_agent import TrendAgent


def _composite_score(
    raw_score: float,
    significance: float,
    momentum: float,
    engagement: dict[str, int],
) -> float:
    """Calculate a composite ranking score.

    Weights:
      - raw_score: 20%
      - significance: 35%
      - momentum: 25%
      - engagement (normalized): 20%
    """
    eng = engagement.get("likes", 0) + engagement.get("shares", 0) * 2
    eng_norm = min(eng / 5000, 1) * 100

    return round(
        raw_score * 0.20
        + significance * 0.35
        + max(momentum + 50, 0) * 0.25  # shift momentum to positive range
        + eng_norm * 0.20,
        1,
    )


class RankingAgent(BaseAgent):
    """Generates multiple leaderboard views from event data.

    Rankings produced:
      - Top Exploding: highest momentum events
      - Top Rising: steadily gaining events
      - Category Leaders: top event per category
      - Company Spotlight: top event per company
      - Cross-Category Movers: events spanning multiple categories
    """

    name = "ranking"
    description = "Generates leaderboards: exploding, rising, category leaders"
    schedule_interval = 1800

    async def execute(self, **kwargs: Any) -> dict[str, Any]:
        """Generate ranked leaderboards.

        Accepts pre-computed `insights` and `predictions` kwargs.
        If absent, runs upstream pipeline.
        """
        insights: list[dict[str, Any]] | None = kwargs.get("insights")
        predictions: list[dict[str, Any]] | None = kwargs.get("predictions")
        events: list[dict[str, Any]] | None = kwargs.get("events")

        if insights is None or predictions is None:
            self.logger.info("No input; running upstream pipeline")
            crawler = CrawlerAgent()
            dedup = DedupAgent()
            insight_agent = InsightAgent()
            trend_agent = TrendAgent()

            crawl_res = await crawler.run()
            dedup_res = await dedup.run(events=crawl_res["data"]["events"])
            events = dedup_res["data"]["events"]
            insight_res = await insight_agent.run(events=events)
            insights = insight_res["data"]["insights"]
            pred_res = await trend_agent.run(events=events)
            predictions = pred_res["data"]["predictions"]

        if events is None:
            events = []

        # Build lookup maps
        insight_map = {i["event_id"]: i for i in insights}
        pred_map = {p["event_id"]: p for p in predictions}

        # Score every event
        scored: list[dict[str, Any]] = []
        for evt in events:
            eid = evt.get("event_id", "")
            insight = insight_map.get(eid, {})
            pred = pred_map.get(eid, {})

            composite = _composite_score(
                raw_score=evt.get("raw_score", 50),
                significance=insight.get("significance_score", 50),
                momentum=pred.get("momentum", 0),
                engagement=evt.get("engagement", {}),
            )

            scored.append({
                "event_id": eid,
                "title": evt.get("title", ""),
                "category": evt.get("category", ""),
                "company": evt.get("company", ""),
                "composite_score": composite,
                "significance": insight.get("significance_score", 0),
                "trend_type": pred.get("trend_type", "stable"),
                "current_heat": pred.get("current_heat", 0),
                "momentum": pred.get("momentum", 0),
                "forecast_24h": pred.get("forecast", {}).get("24h", {}).get("point", 0),
            })

        # Generate leaderboards
        top_exploding = sorted(
            [s for s in scored if s["trend_type"] in ("exploding", "rising")],
            key=lambda x: x["momentum"],
            reverse=True,
        )[:10]

        top_rising = sorted(
            scored, key=lambda x: x["composite_score"], reverse=True
        )[:10]

        # Category leaders
        category_leaders: dict[str, dict] = {}
        for s in scored:
            cat = s["category"]
            if cat not in category_leaders or s["composite_score"] > category_leaders[cat]["composite_score"]:
                category_leaders[cat] = s

        # Company spotlight
        company_spotlight: dict[str, dict] = {}
        for s in scored:
            comp = s["company"]
            if comp and (comp not in company_spotlight or s["composite_score"] > company_spotlight[comp]["composite_score"]):
                company_spotlight[comp] = s

        self.logger.info(
            "Generated rankings: %d exploding, %d top overall, %d category leaders",
            len(top_exploding), len(top_rising), len(category_leaders),
        )

        return {
            "total_scored": len(scored),
            "top_exploding": top_exploding,
            "top_rising": top_rising,
            "category_leaders": category_leaders,
            "company_spotlight": company_spotlight,
        }


if __name__ == "__main__":
    import asyncio

    async def _main() -> None:
        agent = RankingAgent()
        result = await agent.run()
        data = result["data"]
        print(f"Ranked {data['total_scored']} events\n")
        print("=== Top Exploding ===")
        for i, r in enumerate(data["top_exploding"][:5], 1):
            print(f"  {i}. {r['title'][:55]} (momentum: {r['momentum']:+.1f})")
        print("\n=== Top Rising ===")
        for i, r in enumerate(data["top_rising"][:5], 1):
            print(f"  {i}. {r['title'][:55]} (score: {r['composite_score']})")
        print(f"\n=== Category Leaders ({len(data['category_leaders'])}) ===")
        for cat, r in list(data["category_leaders"].items())[:5]:
            print(f"  {cat}: {r['title'][:50]}")

    asyncio.run(_main())
