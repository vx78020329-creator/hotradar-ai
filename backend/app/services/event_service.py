"""Event business logic: heat score calculation, filtering, sorting."""

import math
import random
from datetime import datetime, timedelta, timezone

from sqlalchemy import select, func, or_
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.event import Event


# Source weight mapping for heat score
SOURCE_WEIGHTS: dict[str, float] = {
    "official": 1.0,
    "news": 0.8,
    "social": 0.6,
    "blog": 0.5,
    "forum": 0.4,
    "unknown": 0.3,
}


def calculate_heat_score(
    source_weight: float,
    discussion_volume: float,
    growth_rate: float,
    velocity: float,
    persistence: float,
) -> float:
    """
    Calculate the heat score for an event.

    Args:
        source_weight: Credibility of the source (0-100)
        discussion_volume: Volume of discussions (0-100)
        growth_rate: Rate of growth in discussions (0-100)
        velocity: Speed of spread (0-100)
        persistence: How long the topic stays relevant (0-100)

    Returns:
        Heat score between 0 and 100
    """
    score = (
        0.35 * source_weight
        + 0.25 * discussion_volume
        + 0.15 * growth_rate
        + 0.15 * velocity
        + 0.10 * persistence
    )
    return round(min(max(score, 0.0), 100.0), 2)


def determine_event_status(heat_score: float, trend_score: float) -> str:
    """Determine event status based on heat and trend scores."""
    if heat_score >= 85:
        return "exploding"
    elif heat_score >= 70:
        return "rising"
    elif heat_score >= 40:
        return "stable"
    elif heat_score >= 20:
        return "declining"
    else:
        return "dead"


class EventService:
    """Service layer for Event operations."""

    @staticmethod
    async def list_events(
        db: AsyncSession,
        category: str | None = None,
        status: str | None = None,
        sort_by: str = "heat_score",
        sort_order: str = "desc",
        page: int = 1,
        limit: int = 20,
    ) -> tuple[list[Event], int]:
        """List events with filtering, sorting, and pagination."""
        query = select(Event)
        count_query = select(func.count(Event.id))

        # Apply filters
        if category:
            query = query.where(Event.category == category)
            count_query = count_query.where(Event.category == category)
        if status:
            query = query.where(Event.status == status)
            count_query = count_query.where(Event.status == status)

        # Get total count
        total_result = await db.execute(count_query)
        total = total_result.scalar() or 0

        # Apply sorting
        sort_column = getattr(Event, sort_by, Event.heat_score)
        if sort_order == "desc":
            query = query.order_by(sort_column.desc())
        else:
            query = query.order_by(sort_column.asc())

        # Apply pagination
        offset = (page - 1) * limit
        query = query.offset(offset).limit(limit)

        result = await db.execute(query)
        events = list(result.scalars().all())
        return events, total

    @staticmethod
    async def get_event(db: AsyncSession, event_id: int) -> Event | None:
        """Get a single event by ID."""
        result = await db.execute(select(Event).where(Event.id == event_id))
        return result.scalar_one_or_none()

    @staticmethod
    async def create_event(db: AsyncSession, event_data: dict) -> Event:
        """Create a new event."""
        event = Event(**event_data)
        db.add(event)
        await db.flush()
        await db.refresh(event)
        return event

    @staticmethod
    async def update_event(db: AsyncSession, event_id: int, update_data: dict) -> Event | None:
        """Update an existing event."""
        event = await EventService.get_event(db, event_id)
        if not event:
            return None
        for key, value in update_data.items():
            if value is not None and hasattr(event, key):
                setattr(event, key, value)
        await db.flush()
        await db.refresh(event)
        return event

    @staticmethod
    async def get_categories(db: AsyncSession) -> list[str]:
        """Get all distinct categories."""
        result = await db.execute(
            select(Event.category).distinct().order_by(Event.category)
        )
        return [row[0] for row in result.all()]

    @staticmethod
    async def get_stats(db: AsyncSession) -> dict:
        """Get event statistics."""
        total_result = await db.execute(select(func.count(Event.id)))
        total = total_result.scalar() or 0

        avg_heat_result = await db.execute(select(func.avg(Event.heat_score)))
        avg_heat = avg_heat_result.scalar() or 0.0

        status_counts = {}
        for s in ["new", "rising", "exploding", "stable", "declining", "dead"]:
            r = await db.execute(select(func.count(Event.id)).where(Event.status == s))
            status_counts[s] = r.scalar() or 0

        return {
            "total_events": total,
            "avg_heat_score": round(float(avg_heat), 2),
            "by_status": status_counts,
        }
