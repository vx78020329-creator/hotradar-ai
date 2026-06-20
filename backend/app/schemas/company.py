"""Pydantic schemas for Company CRUD."""

from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, ConfigDict


class CompanyBase(BaseModel):
    name: str
    description: str | None = None
    logo_url: str | None = None
    website: str | None = None
    industry: str | None = None
    market_cap: float | None = None


class CompanyCreate(CompanyBase):
    slug: str


class CompanyResponse(CompanyBase):
    id: int
    slug: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
