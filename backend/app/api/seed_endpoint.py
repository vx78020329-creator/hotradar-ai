"""Seed endpoint - call POST /api/admin/seed to populate database."""
import asyncio
from fastapi import APIRouter
from app.seed import seed_database
from app.database import async_session_factory
from app.models.event import Event
from sqlalchemy import select, func

router = APIRouter()

@router.post("/seed")
async def seed_data():
    """Seed database with demo data."""
    async with async_session_factory() as session:
        result = await session.execute(select(func.count(Event.id)))
        count = result.scalar()
    
    if count > 0:
        return {"message": f"Database already has {count} events", "status": "skipped"}
    
    await seed_database()
    return {"message": "Database seeded successfully", "status": "success"}