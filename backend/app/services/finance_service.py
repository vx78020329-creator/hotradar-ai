"""Stock/fund mapping and market impact analysis service."""

import random
from datetime import datetime, timedelta, timezone


# AI company to stock ticker mapping
COMPANY_STOCK_MAP: dict[str, dict] = {
    "OpenAI": {"ticker": "MSFT", "name": "Microsoft Corp", "relationship": "major_partner"},
    "Anthropic": {"ticker": "GOOG", "name": "Alphabet Inc", "relationship": "investor"},
    "Google DeepMind": {"ticker": "GOOG", "name": "Alphabet Inc", "relationship": "parent"},
    "Meta AI": {"ticker": "META", "name": "Meta Platforms Inc", "relationship": "parent"},
    "Microsoft": {"ticker": "MSFT", "name": "Microsoft Corp", "relationship": "direct"},
    "NVIDIA": {"ticker": "NVDA", "name": "NVIDIA Corp", "relationship": "direct"},
    "Apple": {"ticker": "AAPL", "name": "Apple Inc", "relationship": "direct"},
    "xAI": {"ticker": "TSLA", "name": "Tesla Inc", "relationship": "founder"},
    "Mistral AI": {"ticker": "MSFT", "name": "Microsoft Corp", "relationship": "investor"},
    "Stability AI": {"ticker": "AMD", "name": "AMD Inc", "relationship": "hardware_partner"},
    "AMD": {"ticker": "AMD", "name": "AMD Inc", "relationship": "direct"},
    "Intel": {"ticker": "INTC", "name": "Intel Corp", "relationship": "direct"},
    "Qualcomm": {"ticker": "QCOM", "name": "Qualcomm Inc", "relationship": "direct"},
    "Amazon": {"ticker": "AMZN", "name": "Amazon.com Inc", "relationship": "direct"},
    "IBM": {"ticker": "IBM", "name": "IBM Corp", "relationship": "direct"},
    "Baidu": {"ticker": "BIDU", "name": "Baidu Inc", "relationship": "direct"},
    "Tesla": {"ticker": "TSLA", "name": "Tesla Inc", "relationship": "direct"},
}

SECTOR_ETF_MAP: dict[str, str] = {
    "LLM": "IGV",
    "Computer Vision": "BOTZ",
    "Robotics": "BOTZ",
    "AI Safety": "IGV",
    "AI Policy": "QQQ",
    "AI Startup": "ARKK",
    "AI Research": "QQQ",
    "AI Product": "IGV",
    "AI Regulation": "QQQ",
}


class FinanceService:
    """Service for market impact analysis."""

    @staticmethod
    def get_market_impact(event_title: str, event_category: str) -> dict:
        """Analyze potential market impact of an AI event."""
        # Determine affected stocks
        affected_stocks = []

        for company, info in COMPANY_STOCK_MAP.items():
            if company.lower() in event_title.lower():
                impact_direction = random.choice(["positive", "negative", "neutral"])
                impact_magnitude = round(random.uniform(0.5, 5.0), 2)

                affected_stocks.append({
                    "ticker": info["ticker"],
                    "name": info["name"],
                    "relationship": info["relationship"],
                    "impact_direction": impact_direction,
                    "estimated_change_pct": impact_magnitude if impact_direction == "positive" else -impact_magnitude,
                    "confidence": round(random.uniform(0.3, 0.85), 2),
                })

        # Add sector ETF
        sector_etf = SECTOR_ETF_MAP.get(event_category, "QQQ")

        return {
            "event_title": event_title,
            "affected_stocks": affected_stocks,
            "sector_etf": sector_etf,
            "overall_impact": random.choice(["bullish", "bearish", "neutral"]),
            "confidence": round(random.uniform(0.4, 0.8), 2),
            "timeframe": random.choice(["immediate", "short-term", "medium-term"]),
        }

    @staticmethod
    def get_stock_overview() -> list[dict]:
        """Get an overview of AI-related stocks."""
        stocks = []
        for company, info in COMPANY_STOCK_MAP.items():
            base_price = random.uniform(50, 500)
            change_pct = random.uniform(-5, 8)
            stocks.append({
                "ticker": info["ticker"],
                "name": info["name"],
                "company": company,
                "relationship": info["relationship"],
                "price": round(base_price, 2),
                "change_pct": round(change_pct, 2),
                "volume": random.randint(1000000, 50000000),
                "market_cap_b": round(random.uniform(10, 3000), 1),
                "ai_relevance_score": round(random.uniform(0.3, 1.0), 2),
            })

        # Deduplicate by ticker
        seen_tickers = set()
        unique_stocks = []
        for stock in stocks:
            if stock["ticker"] not in seen_tickers:
                seen_tickers.add(stock["ticker"])
                unique_stocks.append(stock)

        return unique_stocks
