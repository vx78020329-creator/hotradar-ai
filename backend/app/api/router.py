"""Main API router - aggregates all sub-routers."""

from fastapi import APIRouter

from app.api import events, trends, companies, reports, search, insights, finance, auth, admin

api_router = APIRouter(prefix="/api")

api_router.include_router(events.router)
api_router.include_router(trends.router)
api_router.include_router(companies.router)
api_router.include_router(reports.router)
api_router.include_router(search.router)
api_router.include_router(insights.router)
api_router.include_router(finance.router)
api_router.include_router(auth.router)
api_router.include_router(admin.router)
