"""Companies API endpoints."""

import math

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import get_db
from app.models.company import Company
from app.models.event import Event
from app.schemas.common import ApiResponse, PaginationMeta
from app.schemas.company import CompanyResponse
from app.schemas.event import EventResponse

router = APIRouter(prefix="/companies", tags=["Companies"])


@router.get("", response_model=ApiResponse)
async def list_companies(
    industry: str | None = Query(None, description="Filter by industry"),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    """List AI companies."""
    query = select(Company)
    count_query = select(func.count(Company.id))

    if industry:
        query = query.where(Company.industry == industry)
        count_query = count_query.where(Company.industry == industry)

    total_result = await db.execute(count_query)
    total = total_result.scalar() or 0

    query = query.order_by(Company.name)
    offset = (page - 1) * limit
    query = query.offset(offset).limit(limit)

    result = await db.execute(query)
    companies = list(result.scalars().all())

    return ApiResponse(
        success=True,
        data=[CompanyResponse.model_validate(c) for c in companies],
        pagination=PaginationMeta(
            page=page,
            limit=limit,
            total=total,
            total_pages=math.ceil(total / limit) if total > 0 else 0,
        ),
    )


@router.get("/{company_id}", response_model=ApiResponse)
async def get_company(company_id: int, db: AsyncSession = Depends(get_db)):
    """Get a single company by ID."""
    result = await db.execute(select(Company).where(Company.id == company_id))
    company = result.scalar_one_or_none()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    return ApiResponse(success=True, data=CompanyResponse.model_validate(company))


@router.get("/{company_id}/events", response_model=ApiResponse)
async def get_company_events(
    company_id: int,
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    """Get events related to a specific company."""
    # Verify company exists
    company_result = await db.execute(select(Company).where(Company.id == company_id))
    company = company_result.scalar_one_or_none()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")

    # Search events by company name
    query = (
        select(Event)
        .where(Event.title.ilike(f"%{company.name}%"))
        .order_by(Event.heat_score.desc())
    )

    count_result = await db.execute(
        select(func.count(Event.id)).where(Event.title.ilike(f"%{company.name}%"))
    )
    total = count_result.scalar() or 0

    offset = (page - 1) * limit
    query = query.offset(offset).limit(limit)

    result = await db.execute(query)
    events = list(result.scalars().all())

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
