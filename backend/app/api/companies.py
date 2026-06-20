"""Companies API endpoints."""

import math
import re
from datetime import datetime, timezone

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

# Well-known AI companies for extraction
KNOWN_COMPANIES = [
    ("OpenAI", "AI Research", "https://openai.com"),
    ("Google", "AI Research", "https://ai.google"),
    ("DeepMind", "AI Research", "https://deepmind.google"),
    ("NVIDIA", "AI Chips", "https://nvidia.com"),
    ("Meta", "AI Research", "https://ai.meta.com"),
    ("Microsoft", "AI Product", "https://microsoft.com"),
    ("Anthropic", "AI Safety", "https://anthropic.com"),
    ("Tesla", "Robotics", "https://tesla.com"),
    ("Apple", "AI Product", "https://apple.com"),
    ("AMD", "AI Chips", "https://amd.com"),
    ("Intel", "AI Chips", "https://intel.com"),
    ("Mistral AI", "LLM", "https://mistral.ai"),
    ("Stability AI", "Computer Vision", "https://stability.ai"),
    ("Midjourney", "Computer Vision", "https://midjourney.com"),
    ("Hugging Face", "LLM", "https://huggingface.co"),
    ("Cohere", "LLM", "https://cohere.com"),
    ("ByteDance", "AI Product", "https://bytedance.com"),
    ("Baidu", "AI Research", "https://baidu.com"),
    ("Alibaba", "AI Product", "https://alibaba.com"),
    ("Samsung", "AI Chips", "https://samsung.com"),
    ("Boston Dynamics", "Robotics", "https://bostondynamics.com"),
    ("Figure AI", "Robotics", "https://figure.ai"),
    ("xAI", "LLM", "https://x.ai"),
    ("Perplexity", "AI Product", "https://perplexity.ai"),
]


@router.get("", response_model=ApiResponse)
async def list_companies(
    industry: str | None = Query(None, description="Filter by industry"),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    """List AI companies. Auto-generates from events if none exist."""
    query = select(Company)
    count_query = select(func.count(Company.id))

    if industry:
        query = query.where(Company.industry == industry)
        count_query = count_query.where(Company.industry == industry)

    total_result = await db.execute(count_query)
    total = total_result.scalar() or 0

    # Auto-generate if empty
    if total == 0:
        await _auto_generate_companies(db)
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
    company_result = await db.execute(select(Company).where(Company.id == company_id))
    company = company_result.scalar_one_or_none()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")

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


async def _auto_generate_companies(db: AsyncSession):
    """Auto-generate companies from events data."""
    # Get all event titles
    result = await db.execute(select(Event.title))
    titles = [row[0] for row in result.all()]

    if not titles:
        return

    # Count mentions
    company_counts: dict[str, int] = {}
    for name, industry, website in KNOWN_COMPANIES:
        count = sum(1 for t in titles if name.lower() in t.lower())
        if count > 0:
            company_counts[name] = count

    for name, industry, website in KNOWN_COMPANIES:
        # Check if already exists
        existing = await db.execute(select(Company).where(Company.name == name))
        if existing.scalar_one_or_none():
            continue

        mentions = company_counts.get(name, 0)
        slug = name.lower().replace(" ", "-")

        company = Company(
            name=name,
            slug=slug,
            description=f"{name} is a leading company in the {industry} sector.",
            website=website,
            industry=industry,
        )
        db.add(company)

    await db.commit()
