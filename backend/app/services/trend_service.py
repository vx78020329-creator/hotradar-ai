"""Trend analysis and prediction logic."""

import random

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.trend import Trend


class TrendService:
    """Service layer for Trend operations."""

    @staticmethod
    async def list_trends(
        db: AsyncSession,
        category: str | None = None,
        page: int = 1,
        limit: int = 20,
    ) -> tuple[list[Trend], int]:
        """List trends with optional category filter."""
        query = select(Trend)
        count_query = select(func.count(Trend.id))

        if category:
            query = query.where(Trend.category == category)
            count_query = count_query.where(Trend.category == category)

        total_result = await db.execute(count_query)
        total = total_result.scalar() or 0

        query = query.order_by(Trend.current_score.desc())
        offset = (page - 1) * limit
        query = query.offset(offset).limit(limit)

        result = await db.execute(query)
        trends = list(result.scalars().all())
        return trends, total

    @staticmethod
    async def get_trend(db: AsyncSession, trend_id: int) -> Trend | None:
        """Get a single trend by ID."""
        result = await db.execute(select(Trend).where(Trend.id == trend_id))
        return result.scalar_one_or_none()

    @staticmethod
    async def get_forecast(db: AsyncSession, limit: int = 10) -> list[dict]:
        """Generate trend forecasts (mock AI predictions for now)."""
        result = await db.execute(
            select(Trend).order_by(Trend.current_score.desc()).limit(limit)
        )
        trends = list(result.scalars().all())

        forecasts = []
        for trend in trends:
            # Simulate prediction logic
            volatility = random.uniform(0.05, 0.25)
            direction_7d = random.choice(["rising", "stable", "declining"])
            direction_30d = random.choice(["rising", "stable", "declining"])

            if direction_7d == "rising":
                predicted_7d = trend.current_score * (1 + volatility)
            elif direction_7d == "declining":
                predicted_7d = trend.current_score * (1 - volatility)
            else:
                predicted_7d = trend.current_score

            if direction_30d == "rising":
                predicted_30d = trend.current_score * (1 + volatility * 2)
            elif direction_30d == "declining":
                predicted_30d = trend.current_score * (1 - volatility * 2)
            else:
                predicted_30d = trend.current_score

            rationale = _generate_rationale(trend.topic, direction_7d, direction_30d)

            forecasts.append({
                "topic": trend.topic,
                "category": trend.category,
                "current_score": round(trend.current_score, 2),
                "predicted_7d": round(min(predicted_7d, 100.0), 2),
                "predicted_30d": round(min(predicted_30d, 100.0), 2),
                "confidence": round(trend.confidence, 2),
                "direction_7d": direction_7d,
                "direction_30d": direction_30d,
                "rationale": rationale,
            })

        return forecasts


def _generate_rationale(topic: str, dir_7d: str, dir_30d: str) -> str:
    """Generate a mock rationale for trend prediction."""
    reasons = {
        "rising": [
            f"Growing industry interest in {topic} drives continued momentum.",
            f"Recent product launches accelerate adoption of {topic}.",
            f"Venture capital inflows suggest {topic} will gain further traction.",
        ],
        "stable": [
            f"{topic} has reached market saturation in current adoption cycle.",
            f"Mature ecosystem around {topic} maintains steady state.",
            f"Regulatory clarity keeps {topic} development predictable.",
        ],
        "declining": [
            f"Market attention is shifting away from {topic} toward newer paradigms.",
            f"Technical limitations are slowing progress in {topic}.",
            f"Competing approaches are fragmenting the {topic} ecosystem.",
        ],
    }
    return random.choice(reasons.get(dir_7d, reasons["stable"]))
