"""Agent configuration - shared settings and constants."""

from dataclasses import dataclass, field


# ------------------------------------------------------------------
# AI company -> stock symbol mapping (used by FinanceAgent)
# ------------------------------------------------------------------

AI_COMPANY_STOCKS: dict[str, dict] = {
    "OpenAI": {"symbol": "MSFT", "exchange": "NASDAQ", "note": "Major investor / partner"},
    "Google DeepMind": {"symbol": "GOOGL", "exchange": "NASDAQ", "note": "Alphabet subsidiary"},
    "Anthropic": {"symbol": "AMZN", "exchange": "NASDAQ", "note": "Major investor (Amazon)"},
    "Meta AI": {"symbol": "META", "exchange": "NASDAQ", "note": "Meta Platforms division"},
    "NVIDIA": {"symbol": "NVDA", "exchange": "NASDAQ", "note": "AI chip leader"},
    "AMD": {"symbol": "AMD", "exchange": "NASDAQ", "note": "AI chip competitor"},
    "Apple": {"symbol": "AAPL", "exchange": "NASDAQ", "note": "Apple Intelligence"},
    "Tesla": {"symbol": "TSLA", "exchange": "NASDAQ", "note": "FSD / Optimus robotics"},
    "Baidu": {"symbol": "BIDU", "exchange": "NASDAQ", "note": "Ernie Bot / Apollo"},
    "Alibaba": {"symbol": "BABA", "exchange": "NYSE", "note": "Tongyi Qianwen"},
    "Tencent": {"symbol": "TCEHY", "exchange": "OTC", "note": "Hunyuan"},
    "ByteDance": {"symbol": "PRIVATE", "exchange": "-", "note": "Doubao / Seed"},
    "Mistral AI": {"symbol": "PRIVATE", "exchange": "-", "note": "European LLM leader"},
    "Cohere": {"symbol": "PRIVATE", "exchange": "-", "note": "Enterprise LLM"},
    "Stability AI": {"symbol": "PRIVATE", "exchange": "-", "note": "Stable Diffusion"},
    "Midjourney": {"symbol": "PRIVATE", "exchange": "-", "note": "Image generation"},
    "Databricks": {"symbol": "PRIVATE", "exchange": "-", "note": "MosaicML acquisition"},
    "Palantir": {"symbol": "PLTR", "exchange": "NYSE", "note": "AIP platform"},
    "C3.ai": {"symbol": "AI", "exchange": "NYSE", "note": "Enterprise AI"},
    "SoundHound": {"symbol": "SOUN", "exchange": "NASDAQ", "note": "Voice AI"},
    "UiPath": {"symbol": "PATH", "exchange": "NYSE", "note": "AI automation"},
    "Snowflake": {"symbol": "SNOW", "exchange": "NYSE", "note": "Data cloud + AI"},
    "Hugging Face": {"symbol": "PRIVATE", "exchange": "-", "note": "Open-source ML hub"},
    "xAI": {"symbol": "PRIVATE", "exchange": "-", "note": "Grok"},
    "DeepSeek": {"symbol": "PRIVATE", "exchange": "-", "note": "DeepSeek-V3 / R1"},
    "Moonshot AI": {"symbol": "PRIVATE", "exchange": "-", "note": "Kimi"},
    "Zhipu AI": {"symbol": "PRIVATE", "exchange": "-", "note": "GLM"},
    "01.AI": {"symbol": "PRIVATE", "exchange": "-", "note": "Yi series"},
    "Runway": {"symbol": "PRIVATE", "exchange": "-", "note": "Gen-3 video"},
    "Perplexity": {"symbol": "PRIVATE", "exchange": "-", "note": "AI search"},
}

# ------------------------------------------------------------------
# Event categories
# ------------------------------------------------------------------

EVENT_CATEGORIES: list[str] = [
    "LLM Release",
    "Open Source Model",
    "Funding Round",
    "Acquisition",
    "Partnership",
    "Product Launch",
    "Research Paper",
    "Regulation",
    "API Update",
    "Benchmark Result",
    "Layoffs",
    "Hiring",
    "Chip / Hardware",
    "Robotics",
    "Autonomous Driving",
    "AI Safety",
    "Developer Tools",
    "Enterprise AI",
    "Creative AI",
    "AI Infrastructure",
]

# ------------------------------------------------------------------
# Data sources
# ------------------------------------------------------------------

DATA_SOURCES: list[str] = [
    "RSS - TechCrunch AI",
    "RSS - The Verge AI",
    "RSS - Ars Technica",
    "RSS - MIT Tech Review",
    "RSS - Hacker News",
    "X/Twitter - AI researchers",
    "X/Twitter - AI companies",
    "Reddit - r/MachineLearning",
    "Reddit - r/artificial",
    "Reddit - r/LocalLLaMA",
    "GitHub Trending",
    "Hugging Face Trending",
    "ArXiv AI/ML",
    "Bloomberg AI",
    "Reuters AI",
]

# ------------------------------------------------------------------
# Report config
# ------------------------------------------------------------------


@dataclass
class ReportConfig:
    """Configuration for report generation."""
    daily_top_n: int = 10
    weekly_top_n: int = 20
    monthly_top_n: int = 50
    include_charts: bool = True
    include_insights: bool = True
    include_finance: bool = True


# ------------------------------------------------------------------
# Agent schedule intervals (seconds)
# ------------------------------------------------------------------

SCHEDULE: dict[str, int] = {
    "crawler": 900,      # 15 min
    "dedup": 900,        # 15 min
    "summary": 1800,     # 30 min
    "insight": 3600,     # 1 hour
    "trend": 7200,       # 2 hours
    "finance": 3600,     # 1 hour
    "ranking": 1800,     # 30 min
    "personal": 3600,    # 1 hour
    "report": 86400,     # 24 hours
}
