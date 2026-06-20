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
    """List AI reports. Auto-generates reports if none exist."""
    query = select(Report)
    count_query = select(func.count(Report.id))

    if report_type:
        query = query.where(Report.report_type == report_type)
        count_query = count_query.where(Report.report_type == report_type)

    total_result = await db.execute(count_query)
    total = total_result.scalar() or 0

    # Auto-generate reports if none exist
    if total == 0:
        await _auto_generate_reports(db)
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
    title = f"AI 热点{type_label(request.report_type)} - {date_str}"
    summary_parts = []
    for event in events[:5]:
        summary_parts.append(f"- {event.title} (热度: {event.heat_score})")
    summary = f"本{type_label(request.report_type)}AI 领域 Top 热点事件:\n" + "\n".join(summary_parts)

    content_sections = []
    for i, event in enumerate(events, 1):
        content_sections.append(
            f"## {i}. {event.title}\n\n"
            f"**分类:** {event.category} | **热度:** {event.heat_score} | **状态:** {event.status}\n\n"
            f"{event.content or event.summary}\n"
        )
    content = f"# {title}\n\n{summary}\n\n" + "\n\n---\n\n".join(content_sections)

    slug = f"report-{request.report_type}-{date_str}-{now.strftime('%H%M%S')}"

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


def type_label(t: str) -> str:
    return {"daily": "日报", "weekly": "周报", "monthly": "月报", "special": "专题"}.get(t, "报告")


async def _auto_generate_reports(db: AsyncSession):
    """Auto-generate daily and weekly reports from existing events."""
    now = datetime.now(timezone.utc)
    date_str = now.strftime("%Y-%m-%d")

    for rtype in ["daily", "weekly"]:
        slug = f"report-{rtype}-{date_str}"
        existing = await db.execute(select(Report).where(Report.slug == slug))
        if existing.scalar_one_or_none():
            continue

        # Get top events
        limit = 15 if rtype == "daily" else 30
        events_result = await db.execute(
            select(Event).order_by(Event.heat_score.desc()).limit(limit)
        )
        events = list(events_result.scalars().all())
        if not events:
            continue

        label = type_label(rtype)
        title = f"AI 热点{label} - {date_str}"

        # Summary
        top5 = events[:5]
        summary_lines = [f"- {e.title} (热度: {e.heat_score})" for e in top5]
        summary = f"本{label}AI 领域 Top 热点事件:\n" + "\n".join(summary_lines)

        # Full content
        sections = []
        for i, event in enumerate(events, 1):
            sections.append(
                f"## {i}. {event.title}\n\n"
                f"**分类:** {event.category} | **热度:** {event.heat_score} | **状态:** {event.status}\n\n"
                f"{event.content or event.summary}\n"
            )
        content = f"# {title}\n\n{summary}\n\n" + "\n\n---\n\n".join(sections)

        report = Report(
            title=title,
            slug=slug,
            summary=summary,
            content=content,
            report_type=rtype,
            published_at=now,
        )
        db.add(report)

    await db.commit()
