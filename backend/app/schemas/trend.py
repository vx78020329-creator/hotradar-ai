"""Pydantic schemas for Trend CRUD."""

from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, ConfigDict


class TrendBase(BaseModel):
    topic: str
    category: str
    current_score: float = 0.0
    predicted_score: float = 0.0
    confidence: float = 0.0
    timeframe: str | None = None


class TrendCreate(TrendBase):
    pass


class TrendResponse(TrendBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class TrendForecast(BaseModel):
    topic: str
    current_score: float
    predicted_7d: float
    predicted_30d: float
    confidence: float
    direction: str  # rising, stable, declining
    rationale: str
