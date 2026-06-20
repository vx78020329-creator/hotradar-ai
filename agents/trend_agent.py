"""\"""TrendAgent - Predicts future heat scores using time-series analysis.

Uses exponential moving average (EMA) and momentum indicators to
forecast how hot an event/topic will be over the next 24h / 7d / 30d.
Returns predictions with confidence intervals.
"""

from __future__ import annotations

import math
import random
from typing import Any

from agents.base import BaseAgent
from agents.crawler_agent import CrawlerAgent
from agents.dedup_agent import DedupAgent


def _ema(values: list[float], alpha: float = 0.3) -> float:
    """Compute exponential moving average of a value series."""
    if not values:
        return 0.0
    ema_val = values[0]
    for v in values[1:]:
        ema_val = alpha * v + (1 - alpha) * ema_val
    return ema_val


def _generate_historical_heat(base: float, periods: int = 12) -> list[float]:
    """Simulate historical heat scores (hourly) for demo."""
    values = []
    current = base * 0.6  # start lower
    for _ in range(periods):
        noise = random.uniform(-5, 8)
        trend = random.uniform(0.5, 3.0)
        current = max(0, min(100, current + trend + noise))
        values.append(round(current, 1))
    return values


def _confidence_interval(point_forecast: float, horizon: str) -> tuple[float, float]:
    """Generate a confidence interval that widens with forecast horizon."""
    spread = {"24h": 8, "7d": 15, "30d": 25}.get(horizon, 12)
    lo = max(0, round(point_forecast - random.uniform(spread * 0.7, spread), 1))
    hi = min(100, round(point_forecast + random.uniform(spread * 0.5, spread * 1.2), 1))
    return lo, hi


class TrendAgent(BaseAgent):
    """Predicts future heat / virality scores for events.

    For each event:
      1. Simulates historical heat time-series
      2. Computes EMA and momentum
      3. Forecasts heat at 24h, 7d, 30d horizons
      4. Returns predictions with confidence intervals
    """

    name = "trend"
    description = "Predicts future heat scores using EMA and momentum analysis"
    schedule_interval = 7200  # 2 hours

    async def execute(self, **kwargs: Any) -> dict[str, Any]:
        """Generate trend predictions for all events.

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

        predictions: list[dict[str, Any]] = []
        for evt in events:
            pred = self._predict_trend(evt)
            predictions.append(pred)

        # Sort by 24h predicted heat descending
        predictions.sort(key=lambda p: p["forecast"]["24h"]["point"], reverse=True)

        exploding = sum(1 for p in predictions if p["trend_type"] == "exploding")
        rising = sum(1 for p in predictions if p["trend_type"] == "rising")

        self.logger.info(
            "Predicted trends for %d events (%d exploding, %d rising)",
            len(predictions), exploding, rising,
        )

        return {
            "total_predictions": len(predictions),
            "exploding_count": exploding,
            "rising_count": rising,
            "predictions": predictions,
        }

    def _predict_trend(self, event: dict[str, Any]) -> dict[str, Any]:
        """Predict trend for a single event."""
        raw_score = event.get("raw_score", 50)
        engagement = event.get("engagement", {})
        likes = engagement.get("likes", 0)
        shares = engagement.get("shares", 0)

        # Calculate base heat from engagement metrics
        engagement_heat = min((likes + shares * 2) / 100, 40)
        base_heat = raw_score * 0.5 + engagement_heat

        # Generate historical time-series
        history = _generate_historical_heat(base_heat)
        current_heat = history[-1]

        # EMA calculations
        ema_short = round(_ema(history[-4:], alpha=0.4), 1)  # last 4 hours
        ema_long = round(_ema(history, alpha=0.2), 1)  # full history

        # Momentum = short EMA vs long EMA divergence
        momentum = round(ema_short - ema_long, 1)
        momentum_pct = round((momentum / max(ema_long, 1)) * 100, 1)

        # Determine trend type
        if momentum > 15:
            trend_type = "exploding"
        elif momentum > 5:
            trend_type = "rising"
        elif momentum > -5:
            trend_type = "stable"
        elif momentum > -15:
            trend_type = "cooling"
        else:
            trend_type = "fading"

        # Forecast by horizon
        decay_rates = {"24h": 0.85, "7d": 0.55, "30d": 0.30}
        forecasts: dict[str, dict] = {}
        for horizon, decay in decay_rates.items():
            projected = current_heat + momentum * (1 / decay)
            # Apply category-specific boost/dampener
            cat = event.get("category", "")
            if cat in ("LLM Release", "Open Source Model", "Acquisition"):
                projected *= 1.15
            elif cat in ("Hiring", "API Update"):
                projected *= 0.80

            projected = max(0, min(100, round(projected, 1)))
            lo, hi = _confidence_interval(projected, horizon)
            forecasts[horizon] = {
                "point": projected,
                "ci_low": lo,
                "ci_high": hi,
            }

        return {
            "event_id": event.get("event_id", ""),
            "title": event.get("title", ""),
            "category": event.get("category", ""),
            "current_heat": current_heat,
            "ema_short": ema_short,
            "ema_long": ema_long,
            "momentum": momentum,
            "momentum_pct": momentum_pct,
            "trend_type": trend_type,
            "history_hours": history,
            "forecast": forecasts,
        }


if __name__ == "__main__":
    import asyncio

    async def _main() -> None:
        agent = TrendAgent()
        result = await agent.run()
        data = result["data"]
        print(f"Trend predictions for {data['total_predictions']} events")
        print(f"  Exploding: {data['exploding_count']}, Rising: {data['rising_count']}")
        for p in data["predictions"][:5]:
            f24 = p["forecast"]["24h"]
            print(f"\n  [{p['trend_type'].upper()}] {p['title'][:50]}")
            print(f"    Current: {p['current_heat']} | Momentum: {p['momentum']:+.1f}")
            print(f"    24h forecast: {f24['point']} (CI: {f24['ci_low']}-{f24['ci_high']})")

    asyncio.run(_main())
