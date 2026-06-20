"""PersonalAgent - Personalized event recommendations.

Uses content-based filtering: matches user preference profile
(categories, companies, keywords) against event metadata to
produce a personalized feed. Demo uses a sample user profile.
"""

from __future__ import annotations

from typing import Any

from agents.base import BaseAgent
from agents.crawler_agent import CrawlerAgent
from agents.dedup_agent import DedupAgent


# ------------------------------------------------------------------
# Sample user profiles for demo
# ------------------------------------------------------------------

_SAMPLE_PROFILES: dict[str, dict[str, Any]] = {
    "ml_researcher": {
        "name": "Alex (ML Researcher)",
        "preferred_categories": [
            "Research Paper", "Open Source Model", "Benchmark Result",
            "LLM Release", "AI Safety",
        ],
        "preferred_companies": [
            "Google DeepMind", "Anthropic", "OpenAI", "Meta AI",
            "DeepSeek", "Hugging Face",
        ],
        "keywords": ["transformer", "reasoning", "open-source", "safety", "benchmark"],
        "disliked_categories": ["Layoffs", "Hiring"],
        "weight_category": 0.40,
        "weight_company": 0.30,
        "weight_keyword": 0.20,
        "weight_engagement": 0.10,
    },
    "vc_analyst": {
        "name": "Sarah (VC Analyst)",
        "preferred_categories": [
            "Funding Round", "Acquisition", "Partnership",
            "Product Launch", "Enterprise AI",
        ],
        "preferred_companies": [
            "Anthropic", "Mistral AI", "Perplexity", "Cohere",
            "Runway", "Databricks", "Palantir",
        ],
        "keywords": ["valuation", "series", "enterprise", "ARR", "growth"],
        "disliked_categories": ["Research Paper", "Benchmark Result"],
        "weight_category": 0.35,
        "weight_company": 0.30,
        "weight_keyword": 0.20,
        "weight_engagement": 0.15,
    },
    "developer": {
        "name": "Jordan (AI Developer)",
        "preferred_categories": [
            "Developer Tools", "API Update", "Open Source Model",
            "LLM Release", "Creative AI",
        ],
        "preferred_companies": [
            "OpenAI", "Hugging Face", "Anthropic", "Stability AI",
            "Midjourney", "Runway",
        ],
        "keywords": ["API", "SDK", "open-source", "fine-tune", "deploy", "inference"],
        "disliked_categories": ["Funding Round", "Layoffs"],
        "weight_category": 0.35,
        "weight_company": 0.25,
        "weight_keyword": 0.30,
        "weight_engagement": 0.10,
    },
}


def _score_event_for_profile(event: dict[str, Any], profile: dict[str, Any]) -> float:
    """Score how relevant an event is to a user profile.

    Returns a 0-100 relevance score.
    """
    score = 0.0

    # Category match
    cat = event.get("category", "")
    if cat in profile.get("preferred_categories", []):
        rank = profile["preferred_categories"].index(cat)
        score += (1 - rank / max(len(profile["preferred_categories"]), 1)) * 100
    if cat in profile.get("disliked_categories", []):
        score -= 30

    # Company match
    company = event.get("company", "")
    if company in profile.get("preferred_companies", []):
        rank = profile["preferred_companies"].index(company)
        score += (1 - rank / max(len(profile["preferred_companies"]), 1)) * 80

    # Keyword match
    title_lower = event.get("title", "").lower()
    summary_lower = event.get("summary", "").lower()
    text = title_lower + " " + summary_lower
    kw_hits = sum(1 for kw in profile.get("keywords", []) if kw.lower() in text)
    kw_score = min(kw_hits / max(len(profile.get("keywords", [])), 1), 1) * 70
    score += kw_score

    # Engagement bonus
    eng = event.get("engagement", {})
    eng_score = min((eng.get("likes", 0) + eng.get("shares", 0)) / 5000, 1) * 40
    score += eng_score

    return round(max(0, min(100, score)), 1)


class PersonalAgent(BaseAgent):
    """Generates personalized event recommendations.

    Uses content-based filtering against user preference profiles.
    For demo, produces recommendations for three sample profiles
    (ML researcher, VC analyst, developer).
    """

    name = "personal"
    description = "Generates personalized recommendations based on user preferences"
    schedule_interval = 3600

    async def execute(self, **kwargs: Any) -> dict[str, Any]:
        """Generate personalized feeds for sample user profiles.

        Accepts `events` kwarg. If absent, runs upstream pipeline.
        Optionally accepts `profile` (str) to select a single profile.
        """
        events: list[dict[str, Any]] | None = kwargs.get("events")
        if events is None:
            self.logger.info("No input; running upstream pipeline")
            crawler = CrawlerAgent()
            dedup = DedupAgent()
            crawl_res = await crawler.run()
            dedup_res = await dedup.run(events=crawl_res["data"]["events"])
            events = dedup_res["data"]["events"]

        # Add summaries if missing
        for evt in events:
            if "summary" not in evt:
                evt["summary"] = evt.get("title", "")

        target_profile: str | None = kwargs.get("profile")
        profiles_to_run = (
            {target_profile: _SAMPLE_PROFILES[target_profile]}
            if target_profile and target_profile in _SAMPLE_PROFILES
            else _SAMPLE_PROFILES
        )

        all_feeds: dict[str, dict[str, Any]] = {}
        for profile_key, profile in profiles_to_run.items():
            scored_events: list[dict[str, Any]] = []
            for evt in events:
                relevance = _score_event_for_profile(evt, profile)
                if relevance > 15:  # minimum threshold
                    entry = evt.copy()
                    entry["relevance_score"] = relevance
                    entry["match_reasons"] = self._explain_match(evt, profile)
                    scored_events.append(entry)

            scored_events.sort(key=lambda x: x["relevance_score"], reverse=True)

            all_feeds[profile_key] = {
                "profile_name": profile["name"],
                "total_recommended": len(scored_events),
                "top_categories": self._top_categories(scored_events),
                "events": scored_events[:10],  # top 10
            }

            self.logger.info(
                "%s: %d recommendations", profile["name"], len(scored_events)
            )

        return {
            "profiles_generated": len(all_feeds),
            "feeds": all_feeds,
        }

    def _explain_match(self, event: dict[str, Any], profile: dict[str, Any]) -> list[str]:
        """Explain why an event matches a profile."""
        reasons: list[str] = []
        cat = event.get("category", "")
        company = event.get("company", "")

        if cat in profile.get("preferred_categories", []):
            reasons.append(f"Matches preferred category: {cat}")
        if company in profile.get("preferred_companies", []):
            reasons.append(f"From tracked company: {company}")

        title_lower = event.get("title", "").lower()
        matched_kw = [kw for kw in profile.get("keywords", []) if kw.lower() in title_lower]
        if matched_kw:
            reasons.append(f"Keywords matched: {', '.join(matched_kw)}")

        eng = event.get("engagement", {})
        if eng.get("likes", 0) > 2000:
            reasons.append("High community engagement")

        return reasons[:3]

    def _top_categories(self, events: list[dict[str, Any]], n: int = 3) -> list[dict[str, Any]]:
        """Get top N categories from recommended events."""
        cat_counts: dict[str, int] = {}
        for evt in events:
            cat = evt.get("category", "Other")
            cat_counts[cat] = cat_counts.get(cat, 0) + 1

        sorted_cats = sorted(cat_counts.items(), key=lambda x: x[1], reverse=True)
        return [{"category": c, "count": n} for c, n in sorted_cats[:n]]


if __name__ == "__main__":
    import asyncio

    async def _main() -> None:
        agent = PersonalAgent()
        result = await agent.run()
        feeds = result["data"]["feeds"]
        for key, feed in feeds.items():
            print(f"\n{'='*50}")
            print(f"Feed for: {feed['profile_name']}")
            print(f"Recommended: {feed['total_recommended']} events")
            print(f"Top categories: {[c['category'] for c in feed['top_categories']]}")
            for e in feed["events"][:3]:
                print(f"  [{e['relevance_score']}] {e['title'][:55]}")
                for r in e.get("match_reasons", []):
                    print(f"    -> {r}")

    asyncio.run(_main())
