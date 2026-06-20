"""Admin API endpoints - CRUD for sources, events, agents, users, system stats."""

import math
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import get_db, get_current_user
from app.models.user import User
from app.models.source import DataSource
from app.models.event import Event
from app.models.agent_log import AgentLog
from app.models.company import Company
from app.models.report import Report
from app.models.trend import Trend
from app.schemas.common import ApiResponse, PaginationMeta
from app.schemas.source import SourceCreate, SourceUpdate, SourceResponse
from app.schemas.event import EventResponse
from app.schemas.user import UserResponse, UserUpdate

router = APIRouter(prefix="/admin", tags=["Admin"])


# ── System Stats ──────────────────────────────────────────────────────────────

@router.get("/stats", response_model=ApiResponse)
async def system_stats(db: AsyncSession = Depends(get_db)):
    """Get overall system statistics."""
    counts = {}
    for label, model in [
        ("events", Event),
        ("companies", Company),
        ("reports", Report),
        ("trends", Trend),
        ("sources", DataSource),
        ("users", User),
        ("agent_logs", AgentLog),
    ]:
        result = await db.execute(select(func.count(model.id)))
        counts[label] = result.scalar() or 0

    # Recent agent activity
    recent_logs_result = await db.execute(
        select(AgentLog).order_by(AgentLog.created_at.desc()).limit(5)
    )
    recent_logs = [
        {
            "id": log.id,
            "agent_name": log.agent_name,
            "action": log.action,
            "status": log.status,
            "duration_ms": log.duration_ms,
            "created_at": log.created_at.isoformat() if log.created_at else None,
        }
        for log in recent_logs_result.scalars().all()
    ]

    return ApiResponse(
        success=True,
        data={
            "counts": counts,
            "recent_agent_activity": recent_logs,
            "system_time": datetime.now(timezone.utc).isoformat(),
        },
    )


# ── Sources CRUD ──────────────────────────────────────────────────────────────

@router.get("/sources", response_model=ApiResponse)
async def list_sources(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    """List all data sources."""
    count_result = await db.execute(select(func.count(DataSource.id)))
    total = count_result.scalar() or 0

    offset = (page - 1) * limit
    result = await db.execute(
        select(DataSource).order_by(DataSource.name).offset(offset).limit(limit)
    )
    sources = list(result.scalars().all())

    return ApiResponse(
        success=True,
        data=[SourceResponse.model_validate(s) for s in sources],
        pagination=PaginationMeta(
            page=page,
            limit=limit,
            total=total,
            total_pages=math.ceil(total / limit) if total > 0 else 0,
        ),
    )


@router.post("/sources", response_model=ApiResponse, status_code=201)
async def create_source(source_data: SourceCreate, db: AsyncSession = Depends(get_db)):
    """Create a new data source."""
    source = DataSource(**source_data.model_dump())
    db.add(source)
    await db.flush()
    await db.refresh(source)
    return ApiResponse(
        success=True,
        data=SourceResponse.model_validate(source),
        message="Source created",
    )


@router.put("/sources/{source_id}", response_model=ApiResponse)
async def update_source(
    source_id: int,
    update_data: SourceUpdate,
    db: AsyncSession = Depends(get_db),
):
    """Update a data source."""
    result = await db.execute(select(DataSource).where(DataSource.id == source_id))
    source = result.scalar_one_or_none()
    if not source:
        raise HTTPException(status_code=404, detail="Source not found")

    for key, value in update_data.model_dump(exclude_unset=True).items():
        setattr(source, key, value)

    await db.flush()
    await db.refresh(source)
    return ApiResponse(
        success=True,
        data=SourceResponse.model_validate(source),
        message="Source updated",
    )


@router.delete("/sources/{source_id}", response_model=ApiResponse)
async def delete_source(source_id: int, db: AsyncSession = Depends(get_db)):
    """Delete a data source."""
    result = await db.execute(select(DataSource).where(DataSource.id == source_id))
    source = result.scalar_one_or_none()
    if not source:
        raise HTTPException(status_code=404, detail="Source not found")

    await db.delete(source)
    return ApiResponse(success=True, message="Source deleted")


# ── Agent Logs ────────────────────────────────────────────────────────────────

@router.get("/agents/logs", response_model=ApiResponse)
async def list_agent_logs(
    agent_name: str | None = Query(None),
    status: str | None = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    """List AI agent execution logs."""
    query = select(AgentLog)
    count_query = select(func.count(AgentLog.id))

    if agent_name:
        query = query.where(AgentLog.agent_name == agent_name)
        count_query = count_query.where(AgentLog.agent_name == agent_name)
    if status:
        query = query.where(AgentLog.status == status)
        count_query = count_query.where(AgentLog.status == status)

    total_result = await db.execute(count_query)
    total = total_result.scalar() or 0

    offset = (page - 1) * limit
    query = query.order_by(AgentLog.created_at.desc()).offset(offset).limit(limit)

    result = await db.execute(query)
    logs = result.scalars().all()

    return ApiResponse(
        success=True,
        data=[
            {
                "id": log.id,
                "agent_name": log.agent_name,
                "action": log.action,
                "status": log.status,
                "input_data": log.input_data,
                "output_data": log.output_data,
                "duration_ms": log.duration_ms,
                "created_at": log.created_at.isoformat() if log.created_at else None,
            }
            for log in logs
        ],
        pagination=PaginationMeta(
            page=page,
            limit=limit,
            total=total,
            total_pages=math.ceil(total / limit) if total > 0 else 0,
        ),
    )


# ── Users ─────────────────────────────────────────────────────────────────────

@router.get("/users", response_model=ApiResponse)
async def list_users(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    """List all users."""
    count_result = await db.execute(select(func.count(User.id)))
    total = count_result.scalar() or 0

    offset = (page - 1) * limit
    result = await db.execute(
        select(User).order_by(User.created_at.desc()).offset(offset).limit(limit)
    )
    users = list(result.scalars().all())

    return ApiResponse(
        success=True,
        data=[UserResponse.model_validate(u) for u in users],
        pagination=PaginationMeta(
            page=page,
            limit=limit,
            total=total,
            total_pages=math.ceil(total / limit) if total > 0 else 0,
        ),
    )


@router.patch("/users/{user_id}", response_model=ApiResponse)
async def update_user(
    user_id: int,
    update_data: UserUpdate,
    db: AsyncSession = Depends(get_db),
):
    """Update a user (admin only)."""
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    for key, value in update_data.model_dump(exclude_unset=True).items():
        setattr(user, key, value)

    await db.flush()
    await db.refresh(user)
    return ApiResponse(
        success=True,
        data=UserResponse.model_validate(user),
        message="User updated",
    )
