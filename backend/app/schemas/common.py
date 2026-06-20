"""Common response schemas: pagination, API wrapper."""

from __future__ import annotations

from typing import Any, Generic, TypeVar
from pydantic import BaseModel

T = TypeVar("T")


class PaginationMeta(BaseModel):
    page: int
    limit: int
    total: int
    total_pages: int


class ApiResponse(BaseModel, Generic[T]):
    success: bool = True
    data: T | None = None
    message: str = "OK"
    pagination: PaginationMeta | None = None

    model_config = {"populate_by_name": True}


class HealthResponse(BaseModel):
    status: str
    version: str
    database: str
