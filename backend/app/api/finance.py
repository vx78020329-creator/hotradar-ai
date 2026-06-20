"""Finance API endpoints - market impact analysis."""

from fastapi import APIRouter, Query

from app.schemas.common import ApiResponse
from app.services.finance_service import FinanceService

router = APIRouter(prefix="/finance", tags=["Finance"])


@router.get("/market-impact", response_model=ApiResponse)
async def market_impact(
    title: str = Query(..., description="Event title to analyze"),
    category: str = Query("AI Product", description="Event category"),
):
    """Analyze potential market impact of an AI event."""
    impact = FinanceService.get_market_impact(title, category)
    return ApiResponse(success=True, data=impact)


@router.get("/stocks", response_model=ApiResponse)
async def list_stocks():
    """Get an overview of AI-related stocks."""
    stocks = FinanceService.get_stock_overview()
    return ApiResponse(success=True, data=stocks)
