"""Hybrid search service: keyword + basic vector simulation."""

import time
from datetime import datetime

from sqlalchemy import select, or_, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.event import Event
from app.models.company import Company
from app.models.report import Report
from app.models.trend import Trend


class SearchService:
    """Hybrid search across all entity types."""

    @staticmethod
    async def search(
        db: AsyncSession,
        query: str,
        entity_type: str | None = None,
        category: str | None = None,
        page: int = 1,
        limit: int = 20,
    ) -> dict:
        """Perform a hybrid keyword search across all entities."""
        start_time = time.time()
        results = []
        q_lower = query.lower()

        # Search Events
        if entity_type is None or entity_type == "events":
            stmt = select(Event).where(
                or_(
                    Event.title.ilike(f"%{query}%"),
                    Event.summary.ilike(f"%{query}%"),
                    Event.content.ilike(f"%{query}%"),
                    Event.category.ilike(f"%{query}%"),
                )
            )
            if category:
                stmt = stmt.where(Event.category == category)
            stmt = stmt.order_by(Event.heat_score.desc()).limit(50)

            event_result = await db.execute(stmt)
            for event in event_result.scalars().all():
                score = _calculate_relevance(q_lower, event.title, event.summary)
                results.append({
                    "id": event.id,
                    "title": event.title,
                    "summary": event.summary,
                    "entity_type": "event",
                    "score": score,
                    "metadata": {
                        "category": event.category,
                        "heat_score": event.heat_score,
                        "status": event.status,
                    },
                })

        # Search Companies
        if entity_type is None or entity_type == "companies":
            stmt = select(Company).where(
                or_(
                    Company.name.ilike(f"%{query}%"),
                    Company.description.ilike(f"%{query}%"),
                    Company.industry.ilike(f"%{query}%"),
                )
            )
            stmt = stmt.limit(50)

            company_result = await db.execute(stmt)
            for company in company_result.scalars().all():
                score = _calculate_relevance(q_lower, company.name, company.description or "")
                results.append({
                    "id": company.id,
                    "title": company.name,
                    "summary": company.description or "",
                    "entity_type": "company",
                    "score": score,
                    "metadata": {
                        "industry": company.industry,
                        "website": company.website,
                    },
                })

        # Search Reports
        if entity_type is None or entity_type == "reports":
            stmt = select(Report).where(
                or_(
                    Report.title.ilike(f"%{query}%"),
                    Report.summary.ilike(f"%{query}%"),
                    Report.content.ilike(f"%{query}%"),
                )
            )
            stmt = stmt.limit(50)

            report_result = await db.execute(stmt)
            for report in report_result.scalars().all():
                score = _calculate_relevance(q_lower, report.title, report.summary)
                results.append({
                    "id": report.id,
                    "title": report.title,
                    "summary": report.summary,
                    "entity_type": "report",
                    "score": score,
                    "metadata": {
                        "report_type": report.report_type,
                    },
                })

        # Search Trends
        if entity_type is None or entity_type == "trends":
            stmt = select(Trend).where(
                or_(
                    Trend.topic.ilike(f"%{query}%"),
                    Trend.category.ilike(f"%{query}%"),
                )
            )
            stmt = stmt.limit(50)

            trend_result = await db.execute(stmt)
            for trend in trend_result.scalars().all():
                score = _calculate_relevance(q_lower, trend.topic, trend.category)
                results.append({
                    "id": trend.id,
                    "title": trend.topic,
                    "summary": f"Category: {trend.category} | Score: {trend.current_score}",
                    "entity_type": "trend",
                    "score": score,
                    "metadata": {
                        "current_score": trend.current_score,
                        "predicted_score": trend.predicted_score,
                    },
                })

        # Sort by relevance score
        results.sort(key=lambda x: x["score"], reverse=True)

        # Paginate
        total = len(results)
        offset = (page - 1) * limit
        paginated = results[offset: offset + limit]

        elapsed_ms = round((time.time() - start_time) * 1000, 2)

        return {
            "query": query,
            "results": paginated,
            "total": total,
            "took_ms": elapsed_ms,
        }


def _calculate_relevance(query_lower: str, title: str, summary: str) -> float:
    """Calculate a simple relevance score based on keyword matching."""
    title_lower = title.lower()
    summary_lower = summary.lower()

    score = 0.0

    # Exact title match
    if query_lower == title_lower:
        score += 10.0
    # Title contains query
    elif query_lower in title_lower:
        score += 7.0
    # Query words in title
    else:
        query_words = query_lower.split()
        title_words = title_lower.split()
        overlap = len(set(query_words) & set(title_words))
        if overlap > 0:
            score += 4.0 * (overlap / len(query_words))

    # Summary contains query
    if query_lower in summary_lower:
        score += 3.0
    else:
        query_words = query_lower.split()
        summary_words = summary_lower.split()
        overlap = len(set(query_words) & set(summary_words))
        if overlap > 0:
            score += 1.5 * (overlap / len(query_words))

    return round(min(score, 10.0), 2)
