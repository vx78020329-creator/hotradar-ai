"""Trends API endpoints."""

import math
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import get_db
from app.models.trend import Trend
from app.models.event import Event
from app.schemas.common import ApiResponse, PaginationMeta
from app.schemas.trend import TrendResponse, TrendForecast

router = APIRouter(prefix="/trends", tags=["Trends"])


@router.get("", response_model=ApiResponse)
async def list_trends(
    category: str | None = Query(None, description="Filter by category"),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    """List AI trends. Auto-generates from events if none exist."""
    query = select(Trend)
    count_query = select(func.count(Trend.id))

    if category:
        query = query.where(Trend.category == category)
        count_query = count_query.where(Trend.category == category)

    total_result = await db.execute(count_query)
    total = total_result.scalar() or 0

    # Auto-generate trends from events if none exist
    if total == 0:
        await _auto_generate_trends(db)
        total_result = await db.execute(count_query)
        total = total_result.scalar() or 0

    query = query.order_by(Trend.current_score.desc())
    offset = (page - 1) * limit
    query = query.offset(offset).limit(limit)

    result = await db.execute(query)
    trends = list(result.scalars().all())

    return ApiResponse(
        success=True,
        data=[TrendResponse.model_validate(t) for t in trends],
        pagination=PaginationMeta(
            page=page,
            limit=limit,
            total=total,
            total_pages=math.ceil(total / limit) if total > 0 else 0,
        ),
    )


@router.get("/forecast", response_model=ApiResponse)
async def get_forecast(
    limit: int = Query(10, ge=1, le=50, description="Number of forecasts"),
    db: AsyncSession = Depends(get_db),
):
    """Get AI-generated trend forecasts."""
    # Auto-generate if needed
    count_result = await db.execute(select(func.count(Trend.id)))
    if (count_result.scalar() or 0) == 0:
        await _auto_generate_trends(db)

    result = await db.execute(
        select(Trend).order_by(Trend.current_score.desc()).limit(limit)
    )
    trends = list(result.scalars().all())

    forecasts = []
    for t in trends:
        direction = "rising" if t.predicted_score > t.current_score else "declining" if t.predicted_score < t.current_score else "stable"
        forecasts.append({
            "topic": t.topic,
            "current_score": t.current_score,
            "predicted_7d": round(t.predicted_score * 0.95, 1),
            "predicted_30d": t.predicted_score,
            "confidence": t.confidence,
            "direction": direction,
            "rationale": f"基于 {t.category} 分类下近期事件热度分析",
        })

    return ApiResponse(success=True, data=forecasts)


@router.get("/{trend_id}", response_model=ApiResponse)
async def get_trend(trend_id: int, db: AsyncSession = Depends(get_db)):
    """Get a single trend by ID."""
    result = await db.execute(select(Trend).where(Trend.id == trend_id))
    trend = result.scalar_one_or_none()
    if not trend:
        raise HTTPException(status_code=404, detail="Trend not found")
    return ApiResponse(success=True, data=TrendResponse.model_validate(trend))


async def _auto_generate_trends(db: AsyncSession):
    """Auto-generate trends by aggregating event categories."""
    # Get category stats
    result = await db.execute(
        select(
            Event.category,
            func.count(Event.id).label("count"),
            func.avg(Event.heat_score).label("avg_heat"),
            func.max(Event.heat_score).label("max_heat"),
        )
        .group_by(Event.category)
        .order_by(func.avg(Event.heat_score).desc())
    )
    categories = result.all()

    if not categories:
        return

    for cat_row in categories:
        cat = cat_row[0]
        count = cat_row[1]
        avg_heat = round(float(cat_row[2] or 0), 1)
        max_heat = round(float(cat_row[3] or 0), 1)

        # Check if trend already exists
        existing = await db.execute(
            select(Trend).where(Trend.category == cat)
        )
        if existing.scalar_one_or_none():
            continue

        # Predict score based on current heat and volume
        predicted = min(100, round(avg_heat * 1.1 + count * 0.5, 1))
        confidence = min(90, round(50 + count * 2 + avg_heat * 0.3, 1))

        trend = Trend(
            topic=f"{cat} 领域发展趋势",
            category=cat,
            current_score=avg_heat,
            predicted_score=predicted,
            confidence=confidence,
            timeframe="30d",
        )
        db.add(trend)

    await db.commit()
