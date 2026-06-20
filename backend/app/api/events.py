"""Events API endpoints."""

import math

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import get_db
from app.schemas.common import ApiResponse, PaginationMeta
from app.schemas.event import EventCreate, EventResponse, EventUpdate
from app.services.event_service import EventService

router = APIRouter(prefix="/events", tags=["Events"])


@router.get("", response_model=ApiResponse)
async def list_events(
    category: str | None = Query(None, description="Filter by category"),
    status: str | None = Query(None, description="Filter by status"),
    sort_by: str = Query("heat_score", description="Sort field"),
    sort_order: str = Query("desc", description="Sort order: asc or desc"),
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(20, ge=1, le=100, description="Items per page"),
    db: AsyncSession = Depends(get_db),
):
    """List AI events with filtering, sorting, and pagination."""
    events, total = await EventService.list_events(
        db=db,
        category=category,
        status=status,
        sort_by=sort_by,
        sort_order=sort_order,
        page=page,
        limit=limit,
    )
    return ApiResponse(
        success=True,
        data=[EventResponse.model_validate(e) for e in events],
        pagination=PaginationMeta(
            page=page,
            limit=limit,
            total=total,
            total_pages=math.ceil(total / limit) if total > 0 else 0,
        ),
    )


@router.get("/categories", response_model=ApiResponse)
async def list_categories(db: AsyncSession = Depends(get_db)):
    """List all event categories."""
    categories = await EventService.get_categories(db)
    return ApiResponse(success=True, data=categories)


@router.get("/stats", response_model=ApiResponse)
async def get_stats(db: AsyncSession = Depends(get_db)):
    """Get event statistics."""
    stats = await EventService.get_stats(db)
    return ApiResponse(success=True, data=stats)


@router.get("/{event_id}", response_model=ApiResponse)
async def get_event(event_id: int, db: AsyncSession = Depends(get_db)):
    """Get a single event by ID."""
    event = await EventService.get_event(db, event_id)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return ApiResponse(success=True, data=EventResponse.model_validate(event))


@router.post("", response_model=ApiResponse, status_code=201)
async def create_event(event_data: EventCreate, db: AsyncSession = Depends(get_db)):
    """Create a new event."""
    event = await EventService.create_event(db, event_data.model_dump())
    return ApiResponse(
        success=True,
        data=EventResponse.model_validate(event),
        message="Event created",
    )


@router.patch("/{event_id}", response_model=ApiResponse)
async def update_event(
    event_id: int,
    update_data: EventUpdate,
    db: AsyncSession = Depends(get_db),
):
    """Update an existing event."""
    event = await EventService.update_event(
        db, event_id, update_data.model_dump(exclude_unset=True)
    )
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return ApiResponse(
        success=True,
        data=EventResponse.model_validate(event),
        message="Event updated",
    )
