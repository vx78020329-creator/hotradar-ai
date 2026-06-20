"""
Agent Scheduler - Orchestrates periodic execution of all HotRadar AI agents.

For production, this uses Celery + Redis. For development, it provides
a simple asyncio-based scheduler that runs agents on intervals.
"""
import asyncio
import logging
from datetime import datetime
from typing import Callable, Coroutine, Any

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(name)s] %(message)s")
logger = logging.getLogger("scheduler")


class AgentScheduler:
    """Simple async scheduler for running agents periodically."""

    def __init__(self):
        self.tasks: dict[str, asyncio.Task] = {}
        self.running = False

    def register(self, name: str, coro_fn: Callable[[], Coroutine[Any, Any, Any]], interval_seconds: int):
        """Register an agent to run at the given interval."""
        async def loop():
            while self.running:
                try:
                    logger.info(f"[{name}] Starting scheduled run")
                    result = await coro_fn()
                    logger.info(f"[{name}] Completed: {result.get('status', 'unknown')}")
                except Exception as e:
                    logger.error(f"[{name}] Error: {e}")
                await asyncio.sleep(interval_seconds)

        self.tasks[name] = asyncio.create_task(loop())
        logger.info(f"Registered {name} (every {interval_seconds}s)")

    async def start(self):
        """Start all registered agents."""
        self.running = True
        logger.info(f"Scheduler started with {len(self.tasks)} agents")
        await asyncio.gather(*self.tasks.values())

    def stop(self):
        """Stop all agents."""
        self.running = False
        for task in self.tasks.values():
            task.cancel()
        logger.info("Scheduler stopped")


async def run_all_once():
    """Run all agents once (for testing)."""
    from agents.crawler_agent import CrawlerAgent
    from agents.dedup_agent import DedupAgent
    from agents.summary_agent import SummaryAgent
    from agents.insight_agent import InsightAgent
    from agents.trend_agent import TrendAgent
    from agents.finance_agent import FinanceAgent
    from agents.ranking_agent import RankingAgent
    from agents.personal_agent import PersonalAgent
    from agents.report_agent import ReportAgent

    agents = [
        CrawlerAgent(), DedupAgent(), SummaryAgent(),
        InsightAgent(), TrendAgent(), FinanceAgent(),
        RankingAgent(), PersonalAgent(), ReportAgent(),
    ]

    for agent in agents:
        result = await agent.run()
        logger.info(f"{agent.name}: {result['status']} ({result['duration_ms']}ms)")


if __name__ == "__main__":
    asyncio.run(run_all_once())