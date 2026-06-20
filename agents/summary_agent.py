"""SummaryAgent - Generates concise AI-powered summaries for events.

Uses template-based summarization for the demo (no actual LLM call).
In production this would call OpenAI / Anthropic APIs.
"""

from __future__ import annotations

from typing import Any

from agents.base import BaseAgent
from agents.crawler_agent import CrawlerAgent
from agents.dedup_agent import DedupAgent


# ------------------------------------------------------------------
# Template-based summarization (demo / offline mode)
# ------------------------------------------------------------------

_SUMMARY_TEMPLATES: dict[str, str] = {
    "LLM Release": (
        "{company} has released a new large language model. {detail} "
        "This represents a significant step forward in the AI model landscape "
        "and is expected to influence both research and commercial applications."
    ),
    "Open Source Model": (
        "{company} has open-sourced a major new model. {detail} "
        "The release to the community is expected to accelerate open-source "
        "AI development and lower barriers to entry for researchers and startups."
    ),
    "Funding Round": (
        "{company} has closed a significant funding round. {detail} "
        "The investment signals continued strong confidence in AI valuations "
        "and the company's competitive position in the market."
    ),
    "Acquisition": (
        "A major acquisition has been announced in the AI space. {detail} "
        "This deal reflects the ongoing consolidation trend as larger players "
        "seek to expand their AI capabilities through strategic M&A."
    ),
    "Partnership": (
        "{company} has formed a strategic partnership. {detail} "
        "This collaboration highlights the growing importance of ecosystem "
        "alliances in the competitive AI landscape."
    ),
    "Product Launch": (
        "{company} has launched a new AI product. {detail} "
        "The launch targets an expanding market segment and demonstrates "
        "the company's execution speed in bringing AI to production."
    ),
    "Research Paper": (
        "A notable AI research paper has been published. {detail} "
        "The work introduces novel techniques that could influence future "
        "model architectures and training methodologies."
    ),
    "Regulation": (
        "New regulatory developments affecting AI have emerged. {detail} "
        "These changes may reshape how AI companies operate and could "
        "influence global AI governance frameworks."
    ),
    "API Update": (
        "A major API platform update has been released. {detail} "
        "Developers should review the changes for potential migration needs "
        "and new capabilities available in their applications."
    ),
    "Benchmark Result": (
        "New benchmark results have been reported. {detail} "
        "Benchmark leadership is increasingly important for model selection "
        "in both research and enterprise deployment."
    ),
    "Chip / Hardware": (
        "New AI hardware has been announced. {detail} "
        "Hardware advances are critical enablers for scaling AI training "
        "and inference workloads across the industry."
    ),
    "Robotics": (
        "A significant robotics development has been announced. {detail} "
        "Robotics represents a frontier where AI meets the physical world, "
        "with major implications for manufacturing and daily life."
    ),
    "Autonomous Driving": (
        "An autonomous driving milestone has been reached. {detail} "
        "Self-driving technology continues to advance with increasing "
        "commercial deployments and regulatory approvals."
    ),
    "AI Safety": (
        "Important AI safety research or policy has been published. {detail} "
        "Safety research is critical for responsible AI development and "
        "building public trust in increasingly capable systems."
    ),
    "Developer Tools": (
        "A new developer tool for AI has been released. {detail} "
        "Developer productivity tools are essential for the growing AI "
        "engineering workforce and accelerate the AI development cycle."
    ),
    "Enterprise AI": (
        "An enterprise AI deployment or product update has been announced. {detail} "
        "Enterprise adoption continues to be the primary revenue driver "
        "for AI companies and a key indicator of market maturity."
    ),
    "Creative AI": (
        "A creative AI tool has received a major update. {detail} "
        "Generative creative tools are transforming content production "
        "across industries from entertainment to marketing."
    ),
    "AI Infrastructure": (
        "AI infrastructure news has emerged. {detail} "
        "Infrastructure investments underpin the entire AI ecosystem "
        "and often signal where the next wave of capabilities will come from."
    ),
}

_GENERIC_DETAIL = "The announcement has generated significant attention across the AI community."


def _generate_summary(event: dict[str, Any]) -> str:
    """Generate a summary from event metadata using templates."""
    category = event.get("category", "")
    company = event.get("company", "The company") or "The company"
    template = _SUMMARY_TEMPLATES.get(category, "{company} has made an announcement. {detail}")

    # Extract detail from title
    title = event.get("title", "")
    detail = title.rstrip(".") + "." if title else _GENERIC_DETAIL

    return template.format(company=company, detail=detail)


class SummaryAgent(BaseAgent):
    """Generates concise summaries for deduplicated events.

    In production, this calls an LLM API. For the demo, it uses
    template-based summarization to produce realistic output.
    """

    name = "summary"
    description = "Generates AI-powered summaries for events"
    schedule_interval = 1800  # 30 minutes

    async def execute(self, **kwargs: Any) -> dict[str, Any]:
        """Generate summaries for all events.

        Accepts `events` kwarg. If absent, runs the upstream
        pipeline (Crawler -> Dedup) for standalone demo.
        """
        events: list[dict[str, Any]] | None = kwargs.get("events")
        if events is None:
            self.logger.info("No input; running Crawler -> Dedup pipeline")
            crawler = CrawlerAgent()
            dedup = DedupAgent()
            crawl_res = await crawler.run()
            dedup_res = await dedup.run(events=crawl_res["data"]["events"])
            events = dedup_res["data"]["events"]

        summarized: list[dict[str, Any]] = []
        for evt in events:
            evt_copy = evt.copy()
            evt_copy["summary"] = _generate_summary(evt)
            # Add key points
            evt_copy["key_points"] = self._extract_key_points(evt)
            summarized.append(evt_copy)

        self.logger.info("Generated summaries for %d events", len(summarized))
        return {
            "total_events": len(summarized),
            "events": summarized,
        }

    def _extract_key_points(self, event: dict[str, Any]) -> list[str]:
        """Extract 2-3 key points from event metadata."""
        points: list[str] = []
        cat = event.get("category", "")
        company = event.get("company", "")
        engagement = event.get("engagement", {})

        if company:
            points.append(f"Key player: {company}")
        points.append(f"Category: {cat}")

        likes = engagement.get("likes", 0)
        if likes > 1000:
            points.append(f"High community engagement ({likes:,} likes)")

        merge_count = event.get("merge_count", 1)
        if merge_count > 1:
            points.append(f"Reported by {merge_count} sources")

        return points[:3]


if __name__ == "__main__":
    import asyncio

    async def _main() -> None:
        agent = SummaryAgent()
        result = await agent.run()
        events = result["data"]["events"]
        print(f"Summarized {len(events)} events")
        for e in events[:3]:
            print(f"\n[{e['category']}] {e['title'][:60]}")
            print(f"  Summary: {e['summary'][:100]}...")
            print(f"  Key points: {e['key_points']}")

    asyncio.run(_main())
