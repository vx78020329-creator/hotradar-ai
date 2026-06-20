"""Event model - core entity for AI hotspot events."""

import enum
from datetime import datetime

from sqlalchemy import String, Text, Float, Enum, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class EventStatus(str, enum.Enum):
    new = "new"
    rising = "rising"
    exploding = "exploding"
    stable = "stable"
    declining = "declining"
    dead = "dead"


class EventCategory(str, enum.Enum):
    LLM = "LLM"
    ComputerVision = "Computer Vision"
    Robotics = "Robotics"
    AISafety = "AI Safety"
    AIPolicy = "AI Policy"
    AIStartup = "AI Startup"
    AIResearch = "AI Research"
    AIProduct = "AI Product"
    AIRegulation = "AI Regulation"


class Event(Base):
    __tablename__ = "events"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String(500), nullable=False, index=True)
    slug: Mapped[str] = mapped_column(String(500), unique=True, nullable=False, index=True)
    summary: Mapped[str] = mapped_column(Text, nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=True)
    heat_score: Mapped[float] = mapped_column(Float, default=0.0, index=True)
    trend_score: Mapped[float] = mapped_column(Float, default=0.0)
    category: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    status: Mapped[str] = mapped_column(
        String(20), default=EventStatus.new.value, index=True
    )
    source_url: Mapped[str] = mapped_column(String(1000), nullable=True)
    source_type: Mapped[str] = mapped_column(String(50), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )
