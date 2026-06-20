"""Pydantic schemas for Event CRUD."""

from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, ConfigDict


class EventBase(BaseModel):
    title: str
    summary: str
    content: str | None = None
    category: str
    status: str = "new"
    source_url: str | None = None
    source_type: str | None = None


class EventCreate(EventBase):
    slug: str
    heat_score: float = 0.0
    trend_score: float = 0.0


class EventUpdate(BaseModel):
    title: str | None = None
    summary: str | None = None
    content: str | None = None
    category: str | None = None
    status: str | None = None
    heat_score: float | None = None
    trend_score: float | None = None
    source_url: str | None = None
    source_type: str | None = None


class EventResponse(EventBase):
    id: int
    slug: str
    heat_score: float
    trend_score: float
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class EventListResponse(BaseModel):
    items: list[EventResponse]
    total: int
