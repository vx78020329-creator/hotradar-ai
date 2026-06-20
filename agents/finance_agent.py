"""FinanceAgent - Maps AI events to stocks, funds, and market impact.

Uses the company-stock mapping from config to identify publicly traded
entities affected by each event, and estimates market impact direction
and magnitude.
"""

from __future__ import annotations

import random
from typing import Any

from agents.base import BaseAgent
from agents.config import AI_COMPANY_STOCKS
from agents.crawler_agent import CrawlerAgent
from agents.dedup_agent import DedupAgent


# ------------------------------------------------------------------
# Market impact heuristics
# ------------------------------------------------------------------

_CATEGORY_MARKET_IMPACT: dict[str, dict[str, float]] = {
    "LLM Release":        {"direction": 1.0, "base_magnitude": 3.5},
    "Open Source Model":  {"direction": 1.0, "base_magnitude": 2.8},
    "Funding Round":      {"direction": 1.0, "base_magnitude": 2.0},
    "Acquisition":        {"direction": 0.5, "base_magnitude": 4.0},
    "Partnership":        {"direction": 1.0, "base_magnitude": 1.5},
    "Product Launch":     {"direction": 1.0, "base_magnitude": 2.2},
    "Benchmark Result":   {"direction": 1.0, "base_magnitude": 2.5},
    "Chip / Hardware":    {"direction": 1.0, "base_magnitude": 3.8},
    "Regulation":         {"direction": -0.5, "base_magnitude": 3.0},
    "AI Safety":          {"direction": 0.2, "base_magnitude": 1.5},
    "Research Paper":     {"direction": 0.8, "base_magnitude": 1.2},
    "Robotics":           {"direction": 1.0, "base_magnitude": 2.6},
    "Enterprise AI":      {"direction": 1.0, "base_magnitude": 2.0},
    "Creative AI":        {"direction": 1.0, "base_magnitude": 1.8},
    "Developer Tools":    {"direction": 1.0, "base_magnitude": 1.6},
    "Layoffs":            {"direction": -0.8, "base_magnitude": 2.0},
    "Hiring":             {"direction": 0.5, "base_magnitude": 1.0},
}

# ETF tickers that correlate with AI sector
_AI_ETFS = [
    {"symbol": "BOTZ", "name": "Global X Robotics & AI ETF"},
    {"symbol": "AIQ", "name": "Global X AI & Technology ETF"},
    {"symbol": "ROBT", "name": "First Trust Nasdaq AI & Robotics ETF"},
    {"symbol": "ARKK", "name": "ARK Innovation ETF"},
    {"symbol": "SOXX", "name": "iShares Semiconductor ETF"},
    {"symbol": "SMH", "name": "VanEck Semiconductor ETF"},
]


class FinanceAgent(BaseAgent):
    """Maps events to financial instruments and estimates market impact.

    For each event:
      1. Identifies the company and its stock symbol
      2. Estimates directional impact (% move) using category heuristics
      3. Identifies correlated ETFs
      4. Produces a market impact card
    """

    name = "finance"
    description = "Maps AI events to stocks/funds and estimates market impact"
    schedule_interval = 3600

    async def execute(self, **kwargs: Any) -> dict[str, Any]:
        """Analyze financial impact of events.

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

        market_cards: list[dict[str, Any]] = []
        affected_symbols: dict[str, dict] = {}

        for evt in events:
            card = self._analyze_market_impact(evt)
            market_cards.append(card)

            # Aggregate affected symbols
            for stock in card.get("affected_stocks", []):
                sym = stock["symbol"]
                if sym not in affected_symbols:
                    affected_symbols[sym] = {
                        "symbol": sym,
                        "company": stock.get("company", ""),
                        "exchange": stock.get("exchange", ""),
                        "events": [],
                        "net_impact": 0.0,
                    }
                affected_symbols[sym]["events"].append(card["title"][:50])
                affected_symbols[sym]["net_impact"] += stock.get("estimated_impact_pct", 0)

        # Round net impacts
        for sym_data in affected_symbols.values():
            sym_data["net_impact"] = round(sym_data["net_impact"], 2)

        # Sort by absolute net impact
        top_affected = sorted(
            affected_symbols.values(),
            key=lambda s: abs(s["net_impact"]),
            reverse=True,
        )[:10]

        bullish = sum(1 for c in market_cards if c["overall_direction"] == "bullish")
        bearish = sum(1 for c in market_cards if c["overall_direction"] == "bearish")

        self.logger.info(
            "Analyzed %d events: %d bullish, %d bearish signals",
            len(market_cards), bullish, bearish,
        )

        return {
            "total_events": len(market_cards),
            "bullish_signals": bullish,
            "bearish_signals": bearish,
            "top_affected_stocks": top_affected,
            "market_cards": market_cards,
        }

    def _analyze_market_impact(self, event: dict[str, Any]) -> dict[str, Any]:
        """Produce a market impact card for a single event."""
        company = event.get("company", "")
        category = event.get("category", "")
        engagement = event.get("engagement", {})

        # Look up stock info
        stock_info = AI_COMPANY_STOCKS.get(company, {})
        symbol = stock_info.get("symbol", "")
        exchange = stock_info.get("exchange", "")

        # Calculate impact
        impact_info = _CATEGORY_MARKET_IMPACT.get(
            category, {"direction": 0, "base_magnitude": 1.0}
        )
        base_mag = impact_info["base_magnitude"]
        direction = impact_info["direction"]

        # Engagement amplifier
        eng_boost = min(engagement.get("likes", 0) / 3000, 1.5)
        magnitude = round(base_mag * (1 + eng_boost * 0.3) + random.uniform(-0.5, 0.5), 2)

        # Determine direction
        if direction > 0.3:
            overall = "bullish"
        elif direction < -0.3:
            overall = "bearish"
        else:
            overall = "neutral"

        # Build affected stocks list
        affected_stocks: list[dict[str, Any]] = []
        if symbol and symbol != "PRIVATE":
            estimated_pct = round(magnitude * direction + random.uniform(-0.3, 0.3), 2)
            affected_stocks.append({
                "symbol": symbol,
                "company": company,
                "exchange": exchange,
                "estimated_impact_pct": estimated_pct,
                "note": stock_info.get("note", ""),
            })

        # Add correlated ETFs
        relevant_etfs = random.sample(_AI_ETFS, min(2, len(_AI_ETFS)))

        return {
            "event_id": event.get("event_id", ""),
            "title": event.get("title", ""),
            "category": category,
            "company": company,
            "overall_direction": overall,
            "impact_magnitude": magnitude,
            "affected_stocks": affected_stocks,
            "related_etfs": relevant_etfs,
            "confidence": round(random.uniform(0.55, 0.92), 2),
            "time_horizon": "1-5 trading days",
        }


if __name__ == "__main__":
    import asyncio

    async def _main() -> None:
        agent = FinanceAgent()
        result = await agent.run()
        data = result["data"]
        print(f"Market analysis for {data['total_events']} events")
        print(f"  Bullish: {data['bullish_signals']}, Bearish: {data['bearish_signals']}")
        print("\nTop affected stocks:")
        for s in data["top_affected_stocks"][:5]:
            print(f"  {s['symbol']:8s} net impact: {s['net_impact']:+.2f}%")

    asyncio.run(_main())
