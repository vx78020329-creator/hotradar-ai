# HotRadar AI - Agent System

A multi-agent system for monitoring, analyzing, and ranking AI industry hotspots.
Each agent is a standalone async Python module that can be run independently or as
part of a scheduled pipeline.

## Architecture

`
┌──────────────┐
│  CrawlerAgent │  Fetches events from RSS, X, Reddit, HN, ArXiv...
└──────┬───────┘
       ▼
┌──────────────┐
│  DedupAgent  │  Clusters & merges duplicate events
└──────┬───────┘
       ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ SummaryAgent │  │ InsightAgent │  │  TrendAgent  │  (parallel)
└──────┬───────┘  └──────┬───────┘  └──────┬───────┘
       └────────────┬────┴──────────────────┘
                    ▼
       ┌────────────────────────┐
       │     RankingAgent       │  Generates leaderboards
       └────────────┬───────────┘
                    ▼
       ┌────────────────────────┐
       │     FinanceAgent       │  Maps to stocks & market impact
       └────────────┬───────────┘
                    ▼
       ┌────────────────────────┐
       │     PersonalAgent      │  Personalized recommendations
       └────────────┬───────────┘
                    ▼
       ┌────────────────────────┐
       │      ReportAgent       │  Daily / weekly / monthly reports
       └────────────────────────┘
`

## Agents

| Agent | Description | Interval |
|-------|-------------|----------|
| **CrawlerAgent** | Fetches data from RSS, X/Twitter, Reddit, Hacker News, GitHub, ArXiv | 15 min |
| **DedupAgent** | Clusters similar events using title similarity (Jaccard + LCS) | 15 min |
| **SummaryAgent** | Generates concise summaries (template-based, swap with LLM) | 30 min |
| **InsightAgent** | Analyzes significance, produces insight cards with confidence scores | 1 hour |
| **TrendAgent** | Predicts future heat scores using EMA and momentum analysis | 2 hours |
| **FinanceAgent** | Maps events to stocks/funds, estimates market impact | 1 hour |
| **RankingAgent** | Generates leaderboards: exploding, rising, category leaders | 30 min |
| **PersonalAgent** | Content-based filtering for personalized recommendations | 1 hour |
| **ReportAgent** | Generates daily/weekly/monthly aggregated reports | 24 hours |

## Quick Start

`ash
# Run all agents
cd hotradar-ai
python -m agents.run

# Run a single agent
python -m agents.run crawler
python -m agents.run trend
python -m agents.run report

# Run with verbose output
python -m agents.run --verbose

# JSON output (for piping to other tools)
python -m agents.run --json

# Run an agent module directly
python -m agents.crawler_agent
python -m agents.trend_agent
`

## Adding a New Agent

1. Create a new file gents/my_agent.py:

`python
""""MyAgent - Description of what it does."""
from typing import Any
from agents.base import BaseAgent


class MyAgent(BaseAgent):
    name = "my_agent"
    description = "What this agent does"
    schedule_interval = 3600  # seconds

    async def execute(self, **kwargs: Any) -> dict[str, Any]:
        events = kwargs.get("events", [])
        # Your logic here
        return {"total": len(events), "results": [...]}


if __name__ == "__main__":
    import asyncio

    async def _main():
        agent = MyAgent()
        result = await agent.run()
        print(result)

    asyncio.run(_main())
`

2. Register it in gents/__init__.py
3. Add it to AGENTS dict in gents/run.py
4. Add schedule to gents/config.py SCHEDULE dict

## Connecting to Backend

In production:

| Component | Current (Demo) | Production |
|-----------|---------------|------------|
| Data sources | Mock data | RSS parser, X API, Reddit API, HN API |
| Summarization | Templates | OpenAI / Anthropic API |
| Similarity | String matching | Sentence embeddings |
| Trend prediction | Simple EMA | Prophet / NeuralProphet |
| Storage | In-memory | PostgreSQL + Redis |
| Scheduler | asyncio loop | Celery Beat + Redis broker |
| API | CLI | FastAPI REST endpoints |

## Configuration

See gents/config.py for:
- AI_COMPANY_STOCKS - Company to stock symbol mapping (30+ companies)
- EVENT_CATEGORIES - 20 event categories
- DATA_SOURCES - 15 data source definitions
- SCHEDULE - Per-agent scheduling intervals

## Project Structure

`
agents/
├── __init__.py          # Package exports
├── base.py              # BaseAgent abstract class (timing, logging, error handling)
├── config.py            # Shared configuration, mappings, constants
├── scheduler.py         # Celery Beat + async fallback scheduler
├── crawler_agent.py     # Data fetching from multiple sources
├── dedup_agent.py       # Event deduplication via title similarity
├── summary_agent.py     # AI-powered event summarization
├── insight_agent.py     # Significance analysis & insight cards
├── trend_agent.py       # Heat score prediction (EMA + momentum)
├── finance_agent.py     # Stock/fund mapping & market impact
├── ranking_agent.py     # Leaderboard generation
├── personal_agent.py    # Personalized recommendations
├── report_agent.py      # Report generation (daily/weekly/monthly)
├── run.py               # CLI entry point
└── README.md            # This file
`

## License

Internal project - HotRadar AI
