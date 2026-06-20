"""Pydantic schemas for DataSource CRUD."""

from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, ConfigDict


class SourceBase(BaseModel):
    name: str
    url: str
    source_type: str  # rss, api, scrape
    category: str | None = None
    is_active: bool = True


class SourceCreate(SourceBase):
    pass


class SourceUpdate(BaseModel):
    name: str | None = None
    url: str | None = None
    source_type: str | None = None
    category: str | None = None
    is_active: bool | None = None


class SourceResponse(SourceBase):
    id: int
    last_fetched: datetime | None = None

    model_config = ConfigDict(from_attributes=True)
