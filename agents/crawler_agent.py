"""CrawlerAgent - Fetches AI industry data from multiple sources.

Simulates crawling RSS feeds, X/Twitter, Reddit, Hacker News,
GitHub Trending, and ArXiv for AI-related events.
Returns raw event dicts ready for downstream processing.
"""

from __future__ import annotations

import hashlib
import random
from datetime import datetime, timedelta, timezone
from typing import Any

from agents.base import BaseAgent


# ------------------------------------------------------------------
# Mock seed data - realistic AI industry headlines
# ------------------------------------------------------------------

_MOCK_EVENTS: list[dict[str, Any]] = [
    {
        "title": "OpenAI announces GPT-5 with native multimodal reasoning",
        "source": "RSS - TechCrunch AI",
        "url": "https://techcrunch.com/2026/06/21/openai-gpt5",
        "category": "LLM Release",
        "company": "OpenAI",
    },
    {
        "title": "Google DeepMind releases Gemini 2.5 Pro with 2M context window",
        "source": "RSS - The Verge AI",
        "url": "https://theverge.com/2026/06/21/gemini-25-pro",
        "category": "LLM Release",
        "company": "Google DeepMind",
    },
    {
        "title": "Anthropic raises $5B Series E at $80B valuation",
        "source": "Bloomberg AI",
        "url": "https://bloomberg.com/news/anthropic-5b-series-e",
        "category": "Funding Round",
        "company": "Anthropic",
    },
    {
        "title": "DeepSeek-V4 open-sources 600B MoE model, tops Arena leaderboard",
        "source": "RSS - Hacker News",
        "url": "https://news.ycombinator.com/item?id=44001234",
        "category": "Open Source Model",
        "company": "DeepSeek",
    },
    {
        "title": "NVIDIA Blackwell Ultra B300 GPU announced: 2x AI training throughput",
        "source": "RSS - Ars Technica",
        "url": "https://arstechnica.com/nvidia-b300-announcement",
        "category": "Chip / Hardware",
        "company": "NVIDIA",
    },
    {
        "title": "Meta releases Llama 5 with 400B parameters under Apache 2.0",
        "source": "Reddit - r/MachineLearning",
        "url": "https://reddit.com/r/MachineLearning/12345",
        "category": "Open Source Model",
        "company": "Meta AI",
    },
    {
        "title": "EU AI Act enforcement begins - first fines issued to major tech companies",
        "source": "Reuters AI",
        "url": "https://reuters.com/technology/eu-ai-act-fines-2026",
        "category": "Regulation",
        "company": "",
    },
    {
        "title": "xAI Grok 3 achieves PhD-level reasoning on MMLU-Pro benchmark",
        "source": "X/Twitter - AI companies",
        "url": "https://x.com/xaborov/status/123456",
        "category": "Benchmark Result",
        "company": "xAI",
    },
    {
        "title": "Runway Gen-4 Turbo generates full 4K videos from text in 30 seconds",
        "source": "RSS - TechCrunch AI",
        "url": "https://techcrunch.com/2026/06/20/runway-gen4-turbo",
        "category": "Creative AI",
        "company": "Runway",
    },
    {
        "title": "Tesla Optimus Gen-3 humanoid robot begins factory deployment",
        "source": "Bloomberg AI",
        "url": "https://bloomberg.com/news/tesla-optimus-gen3-factory",
        "category": "Robotics",
        "company": "Tesla",
    },
    {
        "title": "Moonshot AI Kimi reaches 100M monthly active users in China",
        "source": "RSS - MIT Tech Review",
        "url": "https://technologyreview.com/kimi-100m-mau",
        "category": "Product Launch",
        "company": "Moonshot AI",
    },
    {
        "title": "OpenAI acquires Windsurf (Codeium) for $3B to bolster coding AI",
        "source": "RSS - The Verge AI",
        "url": "https://theverge.com/2026/06/20/openai-acquires-windsurf",
        "category": "Acquisition",
        "company": "OpenAI",
    },
    {
        "title": "Perplexity launches enterprise search with real-time RAG pipeline",
        "source": "RSS - TechCrunch AI",
        "url": "https://techcrunch.com/perplexity-enterprise-search",
        "category": "Enterprise AI",
        "company": "Perplexity",
    },
    {
        "title": "Hugging Face surpasses 2M models on the Hub, adds GPU inference",
        "source": "Reddit - r/LocalLLaMA",
        "url": "https://reddit.com/r/LocalLLaMA/67890",
        "category": "Developer Tools",
        "company": "Hugging Face",
    },
    {
        "title": "Mistral AI partners with SAP to embed LLMs in enterprise ERP",
        "source": "RSS - TechCrunch AI",
        "url": "https://techcrunch.com/mistral-sap-partnership",
        "category": "Partnership",
        "company": "Mistral AI",
    },
    {
        "title": "Stability AI releases Stable Video 3.0 with consistent character generation",
        "source": "X/Twitter - AI researchers",
        "url": "https://x.com/stabilityai/status/789",
        "category": "Creative AI",
        "company": "Stability AI",
    },
    {
        "title": "Palantir AIP wins $500M Pentagon contract for military AI systems",
        "source": "Reuters AI",
        "url": "https://reuters.com/palantir-pentagon-500m",
        "category": "Enterprise AI",
        "company": "Palantir",
    },
    {
        "title": "Baidu Ernie 5.0 surpasses GPT-4o on Chinese language benchmarks",
        "source": "RSS - MIT Tech Review",
        "url": "https://technologyreview.com/baidu-ernie-5",
        "category": "Benchmark Result",
        "company": "Baidu",
    },
    {
        "title": "Anthropic publishes groundbreaking AI safety research on Constitutional AI v3",
        "source": "ArXiv AI/ML",
        "url": "https://arxiv.org/abs/2606.12345",
        "category": "AI Safety",
        "company": "Anthropic",
    },
    {
        "title": "SoundHound AI voice platform adopted by 10,000+ restaurants nationwide",
        "source": "RSS - TechCrunch AI",
        "url": "https://techcrunch.com/soundhound-restaurants",
        "category": "Product Launch",
        "company": "SoundHound",
    },
    {
        "title": "Alibaba Tongyi Qianwen 3.0 open-sources 72B model rivaling GPT-4",
        "source": "GitHub Trending",
        "url": "https://github.com/QwenLM/Qwen3-72B",
        "category": "Open Source Model",
        "company": "Alibaba",
    },
    {
        "title": "Apple Intelligence 2.0 brings on-device LLM to all Apple silicon Macs",
        "source": "RSS - The Verge AI",
        "url": "https://theverge.com/apple-intelligence-2",
        "category": "Product Launch",
        "company": "Apple",
    },
    {
        "title": "Databricks acquires AI startup Neon for $1.2B to expand data lakehouse",
        "source": "Bloomberg AI",
        "url": "https://bloomberg.com/databricks-neon-acquisition",
        "category": "Acquisition",
        "company": "Databricks",
    },
    {
        "title": "OpenAI Codex v3 generates full-stack apps from natural language specs",
        "source": "RSS - TechCrunch AI",
        "url": "https://techcrunch.com/openai-codex-v3",
        "category": "Developer Tools",
        "company": "OpenAI",
    },
    {
        "title": "NVIDIA invests $2B in humanoid robotics startups through NVentures",
        "source": "RSS - Ars Technica",
        "url": "https://arstechnica.com/nvidia-robotics-investment",
        "category": "Robotics",
        "company": "NVIDIA",
    },
    {
        "title": "Cohere launches RAG-native Command R+ Ultra for enterprise search",
        "source": "Reddit - r/MachineLearning",
        "url": "https://reddit.com/r/MachineLearning/11111",
        "category": "Enterprise AI",
        "company": "Cohere",
    },
    {
        "title": "Zhipu AI GLM-5 achieves state-of-the-art on Chinese NLP tasks",
        "source": "ArXiv AI/ML",
        "url": "https://arxiv.org/abs/2606.67890",
        "category": "Research Paper",
        "company": "Zhipu AI",
    },
    {
        "title": "C3.ai stock surges 40% on massive enterprise AI contract wins",
        "source": "Bloomberg AI",
        "url": "https://bloomberg.com/c3ai-stock-surge",
        "category": "Enterprise AI",
        "company": "C3.ai",
    },
    {
        "title": "Midjourney V7 introduces 3D scene generation from single images",
        "source": "X/Twitter - AI researchers",
        "url": "https://x.com/midaborjney/status/456",
        "category": "Creative AI",
        "company": "Midjourney",
    },
    {
        "title": "Snowflake Arctic LLM v2 optimized for enterprise SQL and data analysis",
        "source": "RSS - TechCrunch AI",
        "url": "https://techcrunch.com/snowflake-arctic-v2",
        "category": "Enterprise AI",
        "company": "Snowflake",
    },
]


class CrawlerAgent(BaseAgent):
    """Fetches AI industry events from multiple simulated data sources.

    In production this would hit real RSS feeds, X API, Reddit API, etc.
    For the demo it returns curated mock data with realistic metadata.
    """

    name = "crawler"
    description = "Fetches AI industry data from RSS, X, Reddit, HN, GitHub, ArXiv"
    schedule_interval = 900  # 15 minutes

    async def execute(self, **kwargs: Any) -> dict[str, Any]:
        """Crawl all configured sources and return raw events."""
        max_events: int = kwargs.get("max_events", len(_MOCK_EVENTS))
        self.logger.info("Crawling %d sources", len(_MOCK_EVENTS))

        events: list[dict[str, Any]] = []
        now = datetime.now(timezone.utc)

        for idx, raw in enumerate(_MOCK_EVENTS[:max_events]):
            # Assign realistic timestamps - stagger by minutes
            ts = now - timedelta(minutes=random.randint(1, 720))
            event_id = hashlib.sha256(
                (raw["title"] + raw["source"]).encode()
            ).hexdigest()[:12]

            events.append({
                "event_id": event_id,
                "title": raw["title"],
                "source": raw["source"],
                "url": raw["url"],
                "category": raw["category"],
                "company": raw.get("company", ""),
                "fetched_at": self._now_iso(),
                "published_at": ts.isoformat() + "Z",
                "raw_score": round(random.uniform(60, 100), 1),
                "engagement": {
                    "likes": random.randint(50, 5000),
                    "shares": random.randint(10, 2000),
                    "comments": random.randint(5, 800),
                },
            })

        source_counts: dict[str, int] = {}
        for e in events:
            source_counts[e["source"]] = source_counts.get(e["source"], 0) + 1

        self.logger.info("Fetched %d events from %d sources", len(events), len(source_counts))
        return {
            "total_events": len(events),
            "sources_scanned": len(source_counts),
            "source_breakdown": source_counts,
            "events": events,
        }


# Standalone runner
if __name__ == "__main__":
    import asyncio

    async def _main() -> None:
        agent = CrawlerAgent()
        result = await agent.run()
        data = result["data"]
        print(f"Crawled {data['total_events']} events from {data['sources_scanned']} sources")
        for e in data["events"][:5]:
            print(f"  [{e['category']}] {e['title'][:60]}...")
        print(f"  ... and {data['total_events'] - 5} more")

    asyncio.run(_main())
