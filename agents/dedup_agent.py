"""DedupAgent - Clusters and merges duplicate events.

Uses title similarity (Jaccard + sequence matching) to group
events that cover the same underlying story. Merges metadata
from clustered events to produce deduplicated output.
"""

from __future__ import annotations

import re
from typing import Any

from agents.base import BaseAgent

# Re-use mock data from crawler for standalone demo
from agents.crawler_agent import CrawlerAgent


def _tokenize(text: str) -> set[str]:
    """Lowercase and split text into alphanumeric tokens."""
    return set(re.findall(r"[a-z0-9]+", text.lower()))


def _jaccard(a: set[str], b: set[str]) -> float:
    """Jaccard similarity between two token sets."""
    if not a and not b:
        return 0.0
    return len(a & b) / len(a | b)


def _title_similarity(t1: str, t2: str) -> float:
    """Combined similarity score for two titles.

    Blends Jaccard token overlap (0.6) with longest-common-subsequence
    ratio (0.4) for robust matching.
    """
    tokens1, tokens2 = _tokenize(t1), _tokenize(t2)
    jaccard = _jaccard(tokens1, tokens2)

    # LCS ratio
    s1, s2 = t1.lower(), t2.lower()
    m, n = len(s1), len(s2)
    if m == 0 or n == 0:
        lcs_ratio = 0.0
    else:
        # DP LCS length (limited to first 300 chars for speed)
        s1, s2 = s1[:300], s2[:300]
        m, n = len(s1), len(s2)
        prev = [0] * (n + 1)
        for i in range(1, m + 1):
            curr = [0] * (n + 1)
            for j in range(1, n + 1):
                if s1[i - 1] == s2[j - 1]:
                    curr[j] = prev[j - 1] + 1
                else:
                    curr[j] = max(curr[j - 1], prev[j])
            prev = curr
        lcs_ratio = prev[n] / max(m, n)

    return 0.6 * jaccard + 0.4 * lcs_ratio


class DedupAgent(BaseAgent):
    """Clusters and deduplicates events based on title similarity.

    Takes the raw event list from CrawlerAgent, groups events that
    describe the same story, and merges metadata (sources, scores,
    engagement) into a single canonical event per cluster.
    """

    name = "dedup"
    description = "Clusters and merges duplicate events using title similarity"
    schedule_interval = 900

    # Minimum similarity to consider two events as duplicates
    SIMILARITY_THRESHOLD: float = 0.45

    async def execute(self, **kwargs: Any) -> dict[str, Any]:
        """Deduplicate events.

        Accepts `events` (list) kwarg. If absent, fetches from
        CrawlerAgent for standalone demo.
        """
        events: list[dict[str, Any]] | None = kwargs.get("events")
        if events is None:
            self.logger.info("No input events; running CrawlerAgent for demo")
            crawler = CrawlerAgent()
            crawl_result = await crawler.run()
            events = crawl_result["data"]["events"]

        clusters: list[list[dict[str, Any]]] = []
        assigned: set[int] = set()

        for i, evt in enumerate(events):
            if i in assigned:
                continue
            cluster = [evt]
            assigned.add(i)
            for j in range(i + 1, len(events)):
                if j in assigned:
                    continue
                sim = _title_similarity(evt["title"], events[j]["title"])
                if sim >= self.SIMILARITY_THRESHOLD:
                    cluster.append(events[j])
                    assigned.add(j)
            clusters.append(cluster)

        # Merge each cluster into one canonical event
        deduped: list[dict[str, Any]] = []
        for cluster in clusters:
            merged = self._merge_cluster(cluster)
            deduped.append(merged)

        self.logger.info(
            "Dedup: %d events -> %d unique (%d clusters merged)",
            len(events),
            len(deduped),
            sum(1 for c in clusters if len(c) > 1),
        )

        return {
            "input_count": len(events),
            "output_count": len(deduped),
            "clusters_merged": sum(1 for c in clusters if len(c) > 1),
            "events": deduped,
        }

    def _merge_cluster(self, cluster: list[dict[str, Any]]) -> dict[str, Any]:
        """Merge a cluster of similar events into one canonical event."""
        primary = cluster[0].copy()
        if len(cluster) == 1:
            primary["merge_count"] = 1
            primary["all_sources"] = [primary["source"]]
            return primary

        # Use the highest-scoring event as the primary
        cluster_sorted = sorted(cluster, key=lambda e: e.get("raw_score", 0), reverse=True)
        primary = cluster_sorted[0].copy()

        # Aggregate metadata
        all_sources = list({e["source"] for e in cluster})
        total_engagement = {
            "likes": sum(e.get("engagement", {}).get("likes", 0) for e in cluster),
            "shares": sum(e.get("engagement", {}).get("shares", 0) for e in cluster),
            "comments": sum(e.get("engagement", {}).get("comments", 0) for e in cluster),
        }
        all_urls = [e["url"] for e in cluster]

        primary["merge_count"] = len(cluster)
        primary["all_sources"] = all_sources
        primary["all_urls"] = all_urls
        primary["engagement"] = total_engagement
        primary["raw_score"] = round(
            sum(e.get("raw_score", 0) for e in cluster) / len(cluster), 1
        )

        return primary


if __name__ == "__main__":
    import asyncio

    async def _main() -> None:
        agent = DedupAgent()
        result = await agent.run()
        data = result["data"]
        print(f"Dedup: {data['input_count']} -> {data['output_count']} ({data['clusters_merged']} merged)")
        for e in data["events"][:5]:
            mc = e.get("merge_count", 1)
            tag = f" [merged x{mc}]" if mc > 1 else ""
            print(f"  [{e['category']}] {e['title'][:55]}...{tag}")

    asyncio.run(_main())
