"""Pydantic schemas for search requests/responses."""

from __future__ import annotations

from typing import Any

from pydantic import BaseModel


class SearchRequest(BaseModel):
    q: str
    type: str | None = None  # events, companies, reports, trends
    category: str | None = None
    page: int = 1
    limit: int = 20


class SearchResultItem(BaseModel):
    id: int
    title: str
    summary: str
    entity_type: str  # event, company, report, trend
    score: float
    metadata: dict[str, Any] = {}


class SearchResponse(BaseModel):
    query: str
    results: list[SearchResultItem]
    total: int
    took_ms: float
