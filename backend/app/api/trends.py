"""Trends API endpoints."""

import math

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import get_db
from app.schemas.common import ApiResponse, PaginationMeta
from app.schemas.trend import TrendResponse, TrendForecast
from app.services.trend_service import TrendService

router = APIRouter(prefix="/trends", tags=["Trends"])


@router.get("", response_model=ApiResponse)
async def list_trends(
    category: str | None = Query(None, description="Filter by category"),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    """List AI trends with optional category filter."""
    trends, total = await TrendService.list_trends(
        db=db, category=category, page=page, limit=limit
    )
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
    forecasts = await TrendService.get_forecast(db, limit=limit)
    return ApiResponse(success=True, data=forecasts)


@router.get("/{trend_id}", response_model=ApiResponse)
async def get_trend(trend_id: int, db: AsyncSession = Depends(get_db)):
    """Get a single trend by ID."""
    trend = await TrendService.get_trend(db, trend_id)
    if not trend:
        raise HTTPException(status_code=404, detail="Trend not found")
    return ApiResponse(success=True, data=TrendResponse.model_validate(trend))
