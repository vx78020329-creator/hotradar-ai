"""Reports API endpoints."""

import math
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import get_db
from app.models.report import Report
from app.models.event import Event
from app.schemas.common import ApiResponse, PaginationMeta
from app.schemas.report import ReportResponse, ReportGenerateRequest
from app.services.event_service import EventService

router = APIRouter(prefix="/reports", tags=["Reports"])


@router.get("", response_model=ApiResponse)
async def list_reports(
    report_type: str | None = Query(None, description="Filter by type: daily, weekly, monthly"),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    """List AI reports."""
    query = select(Report)
    count_query = select(func.count(Report.id))

    if report_type:
        query = query.where(Report.report_type == report_type)
        count_query = count_query.where(Report.report_type == report_type)

    total_result = await db.execute(count_query)
    total = total_result.scalar() or 0

    query = query.order_by(Report.created_at.desc())
    offset = (page - 1) * limit
    query = query.offset(offset).limit(limit)

    result = await db.execute(query)
    reports = list(result.scalars().all())

    return ApiResponse(
        success=True,
        data=[ReportResponse.model_validate(r) for r in reports],
        pagination=PaginationMeta(
            page=page,
            limit=limit,
            total=total,
            total_pages=math.ceil(total / limit) if total > 0 else 0,
        ),
    )


@router.get("/{report_id}", response_model=ApiResponse)
async def get_report(report_id: int, db: AsyncSession = Depends(get_db)):
    """Get a single report by ID."""
    result = await db.execute(select(Report).where(Report.id == report_id))
    report = result.scalar_one_or_none()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    return ApiResponse(success=True, data=ReportResponse.model_validate(report))


@router.post("/generate", response_model=ApiResponse, status_code=201)
async def generate_report(
    request: ReportGenerateRequest,
    db: AsyncSession = Depends(get_db),
):
    """Generate a new AI report from current data."""
    # Get top events for the report
    events_query = select(Event).order_by(Event.heat_score.desc()).limit(20)
    if request.categories:
        events_query = events_query.where(Event.category.in_(request.categories))

    result = await db.execute(events_query)
    events = list(result.scalars().all())

    now = datetime.now(timezone.utc)
    date_str = now.strftime("%Y-%m-%d")

    # Build report content
    title = f"AI Hotspot {request.report_type.capitalize()} Report - {date_str}"
    summary_parts = []
    for event in events[:5]:
        summary_parts.append(f"- {event.title} (Heat: {event.heat_score})")
    summary = f"Top AI stories this {request.report_type}:\n" + "\n".join(summary_parts)

    content_sections = []
    for i, event in enumerate(events, 1):
        content_sections.append(
            f"### {i}. {event.title}\n"
            f"**Category:** {event.category} | **Heat Score:** {event.heat_score}\n\n"
            f"{event.summary}\n"
        )
    content = f"# {title}\n\n{summary}\n\n" + "\n".join(content_sections)

    slug = f"report-{request.report_type}-{date_str}"

    report = Report(
        title=title,
        slug=slug,
        summary=summary,
        content=content,
        report_type=request.report_type,
        published_at=now,
    )
    db.add(report)
    await db.flush()
    await db.refresh(report)

    return ApiResponse(
        success=True,
        data=ReportResponse.model_validate(report),
        message="Report generated",
    )
