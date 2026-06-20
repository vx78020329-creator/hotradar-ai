"""AI Insights API endpoints."""

import math

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import get_db
from app.schemas.common import ApiResponse, PaginationMeta
from app.services.insight_service import InsightService

router = APIRouter(prefix="/insights", tags=["Insights"])


@router.get("", response_model=ApiResponse)
async def list_insights(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    """Get AI-generated insights based on current hotspot data."""
    insights, total = await InsightService.list_insights(db, page=page, limit=limit)
    return ApiResponse(
        success=True,
        data=insights,
        pagination=PaginationMeta(
            page=page,
            limit=limit,
            total=total,
            total_pages=math.ceil(total / limit) if total > 0 else 0,
        ),
    )


@router.get("/{insight_id}", response_model=ApiResponse)
async def get_insight(insight_id: int, db: AsyncSession = Depends(get_db)):
    """Get a specific insight by ID."""
    insight = await InsightService.get_insight(db, insight_id)
    if not insight:
        raise HTTPException(status_code=404, detail="Insight not found")
    return ApiResponse(success=True, data=insight)
