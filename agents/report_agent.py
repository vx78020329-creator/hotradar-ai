"""Report Agent - Generates daily, weekly, and monthly reports by aggregating top events, trends, and insights."""
import random
from datetime import datetime, timedelta
from typing import Any
from agents.base import BaseAgent

class ReportAgent(BaseAgent):
    name = "report_agent"
    description = "Generates daily/weekly/monthly aggregated reports"
    schedule_interval = 86400

    TEMPLATES = {
        "daily": {
            "title_tpl": "Daily AI Briefing - {date}",
            "sections": ["Top Events", "Trending Topics", "Market Impact", "Key Insights"],
            "max_events": 10,
        },
        "weekly": {
            "title_tpl": "Weekly AI Report - Week {week}",
            "sections": ["Executive Summary", "Top Stories", "Trend Analysis", "Company Watch", "Investment Signals"],
            "max_events": 25,
        },
        "monthly": {
            "title_tpl": "Monthly AI Landscape - {month}",
            "sections": ["Overview", "Major Launches", "Regulatory Updates", "Market Movements", "Predictions"],
            "max_events": 50,
        },
    }

    MOCK_TOP_EVENTS = [
        {"title": "GPT-5 Launch: OpenAI Unveils Next-Gen Model", "heat": 97.5, "category": "LLM"},
        {"title": "Anthropic Claude 4 Opus Sets Safety Benchmarks", "heat": 94.2, "category": "LLM"},
        {"title": "Google DeepMind Gemini 3 Achieves PhD-level Reasoning", "heat": 91.8, "category": "LLM"},
        {"title": "Tesla Optimus Gen 3 Enters Factory Beta", "heat": 89.5, "category": "Robotics"},
        {"title": "NVIDIA Blackwell Ultra B300 Announced", "heat": 88.3, "category": "AI Chips"},
        {"title": "EU AI Act Enforcement Begins", "heat": 85.1, "category": "AI Policy"},
        {"title": "Meta Llama 4 Open-Source Release", "heat": 93.1, "category": "LLM"},
        {"title": "Apple Intelligence 2.0 with On-Device LLM", "heat": 82.7, "category": "AI Product"},
        {"title": "Microsoft Copilot Studio Goes GA", "heat": 79.4, "category": "AI Product"},
        {"title": "Stability AI SD4 Turbo Launch", "heat": 76.2, "category": "Computer Vision"},
    ]

    MOCK_TRENDS = [
        {"topic": "Frontier Language Models", "score": 95.0, "direction": "rising"},
        {"topic": "AI Agents & Autonomous Systems", "score": 88.0, "direction": "rising"},
        {"topic": "AI Regulation & Governance", "score": 78.0, "direction": "exploding"},
        {"topic": "Open-Source AI Models", "score": 82.0, "direction": "stable"},
        {"topic": "AI in Healthcare", "score": 71.0, "direction": "rising"},
    ]

    async def execute(self, report_type: str = "daily", **kwargs) -> dict[str, Any]:
        now = datetime.now()
        template = self.TEMPLATES.get(report_type, self.TEMPLATES["daily"])

        title = template["title_tpl"].format(
            date=now.strftime("%Y-%m-%d"),
            week=now.strftime("%Y-W%W"),
            month=now.strftime("%Y-%B"),
        )

        top_events = random.sample(self.MOCK_TOP_EVENTS, min(template["max_events"], len(self.MOCK_TOP_EVENTS)))
        top_events.sort(key=lambda e: e["heat"], reverse=True)

        sections = []
        for section_name in template["sections"]:
            if section_name in ("Top Events", "Top Stories", "Major Launches"):
                content = "\n".join(
                    f"  {i+1}. [{e['category']}] {e['title']} (Heat: {e['heat']})"
                    for i, e in enumerate(top_events[:5])
                )
            elif section_name in ("Trending Topics", "Trend Analysis"):
                content = "\n".join(
                    f"  - {t['topic']} (Score: {t['score']}, {t['direction']})"
                    for t in self.MOCK_TRENDS[:3]
                )
            elif section_name in ("Market Impact", "Market Movements", "Investment Signals"):
                content = "  AI sector index: +3.2% | NVDA: +5.1% | MSFT: +2.3% | GOOGL: +1.8%"
            elif section_name == "Executive Summary":
                content = f"  {len(top_events)} significant AI events tracked. Frontier models dominate with {sum(1 for e in top_events if e['category']=='LLM')} LLM-related events."
            elif section_name == "Key Insights":
                content = "  - Multi-modal AI is becoming the standard\n  - Open-source models closing the gap\n  - AI regulation accelerating globally"
            elif section_name == "Company Watch":
                content = "  OpenAI: 4 events | Anthropic: 2 events | Google: 3 events | Meta: 2 events"
            elif section_name == "Predictions":
                content = "  - Next week: 2-3 major model releases expected\n  - AI chip demand to surge 40% in Q3\n  - Enterprise AI adoption hitting inflection point"
            elif section_name == "Regulatory Updates":
                content = "  - EU AI Act high-risk provisions in effect\n  - US Executive Order on AI safety updates\n  - China new AI labeling requirements"
            else:
                content = "  [Data pending]"

            sections.append({"title": section_name, "content": content})

        report = {
            "title": title,
            "type": report_type,
            "generated_at": now.isoformat(),
            "period": {
                "start": (now - timedelta(days=1 if report_type == "daily" else 7 if report_type == "weekly" else 30)).isoformat(),
                "end": now.isoformat(),
            },
            "sections": sections,
            "stats": {
                "total_events": len(top_events),
                "avg_heat_score": round(sum(e["heat"] for e in top_events) / len(top_events), 1),
                "top_category": max(set(e["category"] for e in top_events), key=lambda c: sum(1 for e in top_events if e["category"] == c)),
                "trends_tracked": len(self.MOCK_TRENDS),
            },
        }

        self.logger.info(f"Generated {report_type} report: {title}")
        return report