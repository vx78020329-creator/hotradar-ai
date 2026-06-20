"""
HotRadar AI - Agent System
==========================
A multi-agent system for monitoring, analyzing, and ranking AI industry hotspots.

Agents:
  - CrawlerAgent: Fetches data from RSS, X, Reddit, news sites
  - DedupAgent: Clusters and merges duplicate events
  - SummaryAgent: Generates AI-powered summaries
  - InsightAgent: Analyzes value and significance
  - TrendAgent: Predicts future heat scores
  - FinanceAgent: Maps events to stocks/funds
  - RankingAgent: Generates leaderboards
  - PersonalAgent: Personalized recommendations
  - ReportAgent: Daily/weekly/monthly reports
"""

from agents.base import BaseAgent
from agents.crawler_agent import CrawlerAgent
from agents.dedup_agent import DedupAgent
from agents.summary_agent import SummaryAgent
from agents.insight_agent import InsightAgent
from agents.trend_agent import TrendAgent
from agents.finance_agent import FinanceAgent
from agents.ranking_agent import RankingAgent
from agents.personal_agent import PersonalAgent
from agents.report_agent import ReportAgent

__all__ = [
    "BaseAgent",
    "CrawlerAgent",
    "DedupAgent",
    "SummaryAgent",
    "InsightAgent",
    "TrendAgent",
    "FinanceAgent",
    "RankingAgent",
    "PersonalAgent",
    "ReportAgent",
]
