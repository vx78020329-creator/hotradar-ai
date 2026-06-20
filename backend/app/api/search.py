"""Search API endpoint."""

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import get_db
from app.schemas.common import ApiResponse
from app.services.search_service import SearchService

router = APIRouter(prefix="/search", tags=["Search"])


@router.get("", response_model=ApiResponse)
async def search(
    q: str = Query(..., min_length=1, description="Search query"),
    type: str | None = Query(None, description="Entity type: events, companies, reports, trends"),
    category: str | None = Query(None, description="Filter by category"),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    """Hybrid search across all entities."""
    result = await SearchService.search(
        db=db,
        query=q,
        entity_type=type,
        category=category,
        page=page,
        limit=limit,
    )
    return ApiResponse(success=True, data=result)
