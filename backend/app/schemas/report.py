"""Pydantic schemas for Report CRUD."""

from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, ConfigDict


class ReportBase(BaseModel):
    title: str
    summary: str
    content: str | None = None
    report_type: str  # daily, weekly, monthly


class ReportCreate(ReportBase):
    slug: str
    published_at: datetime | None = None


class ReportResponse(ReportBase):
    id: int
    slug: str
    published_at: datetime | None = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ReportGenerateRequest(BaseModel):
    report_type: str = "daily"
    categories: list[str] | None = None
    date_from: datetime | None = None
    date_to: datetime | None = None
