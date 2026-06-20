"""AI insight generation service (mock for now)."""

import random
from datetime import datetime, timedelta, timezone

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.event import Event
from app.models.trend import Trend


# Mock insight templates
INSIGHT_TEMPLATES = [
    {
        "type": "trend_shift",
        "titles": [
            "{category} is seeing a major shift toward {direction}",
            "Emerging pattern: {category} momentum changing",
            "Watch: {category} trend reversal detected",
        ],
        "summaries": [
            "Our AI analysis detects a significant shift in {category} trends. "
            "Multiple signals suggest {direction} momentum over the next 7 days.",
            "Cross-referencing data from 12+ sources reveals an emerging pattern in {category}. "
            "Confidence is high that this trend will {direction}.",
        ],
    },
    {
        "type": "market_alert",
        "titles": [
            "Market impact: {company} announcement ripples across sector",
            "Breaking: {company} moves could reshape {category}",
            "{company} signal detected - sector-wide implications",
        ],
        "summaries": [
            "A recent development involving {company} is generating significant market signals. "
            "We estimate a {pct}% probability of sector-wide impact within 48 hours.",
            "Our monitoring agents detected unusual activity around {company}. "
            "This correlates with {category} trends and may affect related stocks.",
        ],
    },
    {
        "type": "research_highlight",
        "titles": [
            "New research breakthrough in {category}",
            "Paper alert: {category} gets a significant advance",
            "Research frontier: {category} milestone achieved",
        ],
        "summaries": [
            "A new research paper demonstrates significant advances in {category}. "
            "This could accelerate product development timelines by 6-12 months.",
            "Key findings from a leading research lab suggest {category} "
            "capabilities are advancing faster than industry predictions.",
        ],
    },
]

COMPANY_NAMES = [
    "OpenAI", "Anthropic", "Google DeepMind", "Meta AI", "Microsoft",
    "NVIDIA", "Apple", "xAI", "Mistral AI", "Stability AI",
]

CATEGORY_OPTIONS = [
    "LLM", "Computer Vision", "Robotics", "AI Safety", "AI Policy",
    "AI Startup", "AI Research", "AI Product", "AI Regulation",
]


class InsightService:
    """Service for generating AI-powered insights."""

    @staticmethod
    async def list_insights(
        db: AsyncSession,
        page: int = 1,
        limit: int = 20,
    ) -> tuple[list[dict], int]:
        """List AI-generated insights based on current data."""
        # Fetch recent hot events
        result = await db.execute(
            select(Event)
            .where(Event.heat_score >= 50)
            .order_by(Event.heat_score.desc())
            .limit(30)
        )
        hot_events = list(result.scalars().all())

        # Fetch top trends
        trend_result = await db.execute(
            select(Trend).order_by(Trend.current_score.desc()).limit(20)
        )
        top_trends = list(trend_result.scalars().all())

        # Generate insights from data
        insights = []
        insight_id = 1

        # Event-based insights
        for event in hot_events[:10]:
            template = random.choice(INSIGHT_TEMPLATES)
            company = random.choice(COMPANY_NAMES)
            pct = random.randint(30, 85)

            title = random.choice(template["titles"]).format(
                category=event.category,
                direction=random.choice(["upward", "downward", "accelerating"]),
                company=company,
            )
            summary = random.choice(template["summaries"]).format(
                category=event.category,
                direction=random.choice(["accelerate", "stabilize", "decline"]),
                company=company,
                pct=pct,
            )

            insights.append({
                "id": insight_id,
                "type": template["type"],
                "title": title,
                "summary": summary,
                "confidence": round(random.uniform(0.6, 0.95), 2),
                "impact_level": random.choice(["high", "medium", "low"]),
                "related_events": [event.id],
                "related_trends": [],
                "generated_at": datetime.now(timezone.utc).isoformat(),
            })
            insight_id += 1

        # Trend-based insights
        for trend in top_trends[:5]:
            template = INSIGHT_TEMPLATES[0]
            title = random.choice(template["titles"]).format(
                category=trend.category,
                direction=random.choice(["rapid growth", "consolidation", "divergence"]),
            )
            summary = random.choice(template["summaries"]).format(
                category=trend.category,
                direction=random.choice(["accelerate", "stabilize", "fragment"]),
            )

            insights.append({
                "id": insight_id,
                "type": "trend_analysis",
                "title": title,
                "summary": summary,
                "confidence": round(trend.confidence, 2),
                "impact_level": "medium" if trend.current_score < 70 else "high",
                "related_events": [],
                "related_trends": [trend.id],
                "generated_at": datetime.now(timezone.utc).isoformat(),
            })
            insight_id += 1

        total = len(insights)
        offset = (page - 1) * limit
        paginated = insights[offset: offset + limit]

        return paginated, total

    @staticmethod
    async def get_insight(db: AsyncSession, insight_id: int) -> dict | None:
        """Get a specific insight by ID."""
        # Since insights are generated on-the-fly, we regenerate all and pick
        insights, _ = await InsightService.list_insights(db, page=1, limit=100)
        for insight in insights:
            if insight["id"] == insight_id:
                return insight
        return None
