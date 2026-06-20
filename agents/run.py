"""CLI entry point to run any HotRadar AI agent.

Usage:
  python -m agents.run              # run all agents
  python -m agents.run crawler      # run single agent
  python -m agents.run ranking      # run single agent
  python -m agents.run report       # run report agent
  python -m agents.run --help       # show help
"""

from __future__ import annotations

import asyncio
import json
import logging
import sys
from typing import Any


def _get_agents() -> dict[str, type]:
    """Lazy import all agent classes."""
    from agents.crawler_agent import CrawlerAgent
    from agents.dedup_agent import DedupAgent
    from agents.summary_agent import SummaryAgent
    from agents.insight_agent import InsightAgent
    from agents.trend_agent import TrendAgent
    from agents.finance_agent import FinanceAgent
    from agents.ranking_agent import RankingAgent
    from agents.personal_agent import PersonalAgent
    from agents.report_agent import ReportAgent

    return {
        "crawler": CrawlerAgent,
        "dedup": DedupAgent,
        "summary": SummaryAgent,
        "insight": InsightAgent,
        "trend": TrendAgent,
        "finance": FinanceAgent,
        "ranking": RankingAgent,
        "personal": PersonalAgent,
        "report": ReportAgent,
    }


def _print_banner() -> None:
    print(r"""
  _   _           ___           _             
 | | | | ___  _ _/ _ \__ _ _ _| | __ _ _ _  
 | |_| |/ _ \| '_| (_) \ \/ _ | |/ _ | ' \ 
  \___/ \___/|_|  \___//_\__,_|_|\__,_|_||_|
                                              
  AI Industry Hotspot Radar - Agent System
""")


def _print_agent_result(name: str, result: dict[str, Any], verbose: bool = False) -> None:
    """Pretty-print an agent result."""
    status = result.get("status", "unknown")
    duration = result.get("duration_ms", 0)
    data = result.get("data", {})
    error = result.get("error", "")

    icon = "[OK]" if status == "success" else "[FAIL]"
    print(f"  {icon} {name:15s}  {duration:>5d}ms", end="")

    if status == "success":
        # Print a relevant metric
        if "total_events" in data:
            print(f"  events={data['total_events']}", end="")
        elif "total_insights" in data:
            print(f"  insights={data['total_insights']}", end="")
        elif "total_predictions" in data:
            print(f"  predictions={data['total_predictions']}", end="")
        elif "total_scored" in data:
            print(f"  scored={data['total_scored']}", end="")
        elif "profiles_generated" in data:
            print(f"  profiles={data['profiles_generated']}", end="")
        elif "header" in data:
            print(f"  report={data['header'].get('report_type', '?')}", end="")
        elif "input_count" in data:
            print(f"  dedup: {data['input_count']}->{data['output_count']}", end="")
        print()
    else:
        print(f"  error: {error[:60]}")


async def main() -> None:
    """Main CLI entry point."""
    logging.basicConfig(
        level=logging.WARNING,
        format="%(asctime)s %(name)s %(levelname)s %(message)s",
    )

    args = sys.argv[1:]

    if "--help" in args or "-h" in args:
        _print_banner()
        agents = _get_agents()
        print("Usage: python -m agents.run [agent_name|all] [--verbose] [--json]\n")
        print("Available agents:")
        for name, cls in agents.items():
            print(f"  {name:15s} - {cls.description}")
        print(f"  {'all':15s} - Run all agents sequentially")
        print("\nOptions:")
        print("  --verbose, -v   Enable detailed logging")
        print("  --json          Output results as JSON")
        print("  --help, -h      Show this help")
        return

    verbose = "--verbose" in args or "-v" in args
    json_output = "--json" in args

    if verbose:
        logging.getLogger().setLevel(logging.INFO)

    args = [a for a in args if not a.startswith("-")]
    agent_name = args[0] if args else "all"

    agents = _get_agents()

    if not json_output:
        _print_banner()

    if agent_name == "all":
        results: dict[str, Any] = {}
        for name, AgentClass in agents.items():
            agent = AgentClass()
            result = await agent.run()
            results[name] = result
            if not json_output:
                _print_agent_result(name, result, verbose)

        if json_output:
            print(json.dumps(results, indent=2, default=str))
        else:
            success = sum(1 for r in results.values() if r["status"] == "success")
            total_ms = sum(r.get("duration_ms", 0) for r in results.values())
            print(f"\n  Summary: {success}/{len(results)} succeeded in {total_ms}ms total")

    elif agent_name in agents:
        agent = agents[agent_name]()
        result = await agent.run()
        if json_output:
            print(json.dumps(result, indent=2, default=str))
        else:
            _print_agent_result(agent_name, result, verbose)
            if verbose:
                print(json.dumps(result, indent=2, default=str))
    else:
        print(f"Unknown agent: {agent_name}")
        print(f"Available: {', '.join(agents.keys())}, all")
        sys.exit(1)


if __name__ == "__main__":
    asyncio.run(main())
