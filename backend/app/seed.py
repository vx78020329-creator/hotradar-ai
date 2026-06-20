"""Seed script to populate the database with realistic demo data."""

import asyncio
import random
from datetime import datetime, timedelta, timezone

from app.database import async_session_factory, engine
from app.models.event import Event
from app.models.company import Company
from app.models.report import Report
from app.models.trend import Trend
from app.models.source import DataSource
from app.models.user import User
from app.models.agent_log import AgentLog
from app.core.security import hash_password


def _past(days):
    return datetime.now(timezone.utc) - timedelta(days=days)


COMPANIES_DATA = [
    {"name": "OpenAI", "slug": "openai", "description": "AI research company behind ChatGPT and GPT-5.",
     "logo_url": "https://logo.clearbit.com/openai.com", "website": "https://openai.com",
     "industry": "AI Research", "market_cap": 150_000_000_000},
    {"name": "Anthropic", "slug": "anthropic", "description": "AI safety company building Claude.",
     "logo_url": "https://logo.clearbit.com/anthropic.com", "website": "https://anthropic.com",
     "industry": "AI Safety", "market_cap": 60_000_000_000},
    {"name": "Google DeepMind", "slug": "google-deepmind", "description": "World-leading AI research lab.",
     "logo_url": "https://logo.clearbit.com/deepmind.google", "website": "https://deepmind.google",
     "industry": "AI Research", "market_cap": None},
    {"name": "Meta AI", "slug": "meta-ai", "description": "Creators of Llama open-source LLM family.",
     "logo_url": "https://logo.clearbit.com/ai.meta.com", "website": "https://ai.meta.com",
     "industry": "AI Research", "market_cap": None},
    {"name": "NVIDIA", "slug": "nvidia", "description": "GPU powerhouse fueling AI training.",
     "logo_url": "https://logo.clearbit.com/nvidia.com", "website": "https://nvidia.com",
     "industry": "AI Hardware", "market_cap": 3_200_000_000_000},
    {"name": "Microsoft", "slug": "microsoft", "description": "Tech giant with deep OpenAI partnership.",
     "logo_url": "https://logo.clearbit.com/microsoft.com", "website": "https://microsoft.com",
     "industry": "Enterprise AI", "market_cap": 3_100_000_000_000},
    {"name": "xAI", "slug": "xai", "description": "Elon Musk AI venture building Grok.",
     "logo_url": "https://logo.clearbit.com/x.ai", "website": "https://x.ai",
     "industry": "AI Research", "market_cap": 50_000_000_000},
    {"name": "Mistral AI", "slug": "mistral-ai", "description": "European AI champion with open-weight models.",
     "logo_url": "https://logo.clearbit.com/mistral.ai", "website": "https://mistral.ai",
     "industry": "AI Research", "market_cap": 7_000_000_000},
    {"name": "Stability AI", "slug": "stability-ai", "description": "Creators of Stable Diffusion.",
     "logo_url": "https://logo.clearbit.com/stability.ai", "website": "https://stability.ai",
     "industry": "Generative AI", "market_cap": 1_000_000_000},
    {"name": "Cohere", "slug": "cohere", "description": "Enterprise AI platform for LLMs.",
     "logo_url": "https://logo.clearbit.com/cohere.com", "website": "https://cohere.com",
     "industry": "Enterprise AI", "market_cap": 5_500_000_000},
    {"name": "Scale AI", "slug": "scale-ai", "description": "Data platform powering AI development.",
     "logo_url": "https://logo.clearbit.com/scale.com", "website": "https://scale.com",
     "industry": "AI Data", "market_cap": 14_000_000_000},
    {"name": "Perplexity AI", "slug": "perplexity-ai", "description": "AI-powered search engine.",
     "logo_url": "https://logo.clearbit.com/perplexity.ai", "website": "https://perplexity.ai",
     "industry": "AI Search", "market_cap": 9_000_000_000},
]


EVENTS_DATA = [
    {"title": "GPT-5 Launch: OpenAI Unveils Next-Generation AI Model", "slug": "gpt-5-launch",
     "summary": "OpenAI launches GPT-5 with groundbreaking reasoning, native multimodal understanding, and 10x context window.",
     "content": "OpenAI launches GPT-5 with groundbreaking reasoning, native multimodal understanding, and 10x context window.",
     "heat_score": 97.5, "trend_score": 95.0,
     "category": "LLM", "status": "exploding",
     "source_url": "https://example.com/gpt-5-launch", "source_type": "official"},
    {"title": "Anthropic Claude 4 Opus Sets New Safety Benchmarks", "slug": "claude-4-opus",
     "summary": "Anthropic releases Claude 4 Opus with 2M token context and strongest safety profile.",
     "content": "Anthropic releases Claude 4 Opus with 2M token context and strongest safety profile.",
     "heat_score": 94.2, "trend_score": 91.0,
     "category": "LLM", "status": "exploding",
     "source_url": "https://example.com/claude-4-opus", "source_type": "official"},
    {"title": "Google Gemini Ultra 2 Achieves PhD-Level Reasoning", "slug": "gemini-ultra-2",
     "summary": "Google DeepMind unveils Gemini Ultra 2 with native tool use and PhD-level reasoning.",
     "content": "Google DeepMind unveils Gemini Ultra 2 with native tool use and PhD-level reasoning.",
     "heat_score": 91.8, "trend_score": 88.0,
     "category": "LLM", "status": "exploding",
     "source_url": "https://example.com/gemini-ultra-2", "source_type": "official"},
    {"title": "Meta Releases Llama 4: Open-Source Rivals GPT-5", "slug": "llama-4",
     "summary": "Meta open-sources Llama 4, a 400B parameter MoE model matching GPT-5.",
     "content": "Meta open-sources Llama 4, a 400B parameter MoE model matching GPT-5.",
     "heat_score": 93.1, "trend_score": 92.0,
     "category": "LLM", "status": "exploding",
     "source_url": "https://example.com/llama-4", "source_type": "official"},
    {"title": "NVIDIA Blackwell Ultra B300 GPU Announced", "slug": "nvidia-b300",
     "summary": "NVIDIA reveals B300 GPU at GTC with 2x AI training performance.",
     "content": "NVIDIA reveals B300 GPU at GTC with 2x AI training performance.",
     "heat_score": 89.5, "trend_score": 85.0,
     "category": "AI Product", "status": "exploding",
     "source_url": "https://example.com/nvidia-b300", "source_type": "official"},
    {"title": "EU AI Act Full Enforcement Begins", "slug": "eu-ai-act",
     "summary": "EU AI Act enters full enforcement. Companies must comply or face fines up to 7pct of revenue.",
     "content": "EU AI Act enters full enforcement. Companies must comply or face fines up to 7pct of revenue.",
     "heat_score": 82.3, "trend_score": 78.0,
     "category": "AI Regulation", "status": "rising",
     "source_url": "https://example.com/eu-ai-act", "source_type": "news"},
    {"title": "Sora 2: Full-Length AI Video Generation", "slug": "sora-2",
     "summary": "OpenAI launches Sora 2 generating coherent 30-minute videos.",
     "content": "OpenAI launches Sora 2 generating coherent 30-minute videos.",
     "heat_score": 88.7, "trend_score": 86.0,
     "category": "AI Product", "status": "exploding",
     "source_url": "https://example.com/sora-2", "source_type": "official"},
    {"title": "Figure 02 Achieves Autonomous Warehouse Work", "slug": "figure-02",
     "summary": "Figure humanoid robot completes 1000+ hours autonomous operations at BMW.",
     "content": "Figure humanoid robot completes 1000+ hours autonomous operations at BMW.",
     "heat_score": 86.4, "trend_score": 84.0,
     "category": "Robotics", "status": "rising",
     "source_url": "https://example.com/figure-02", "source_type": "news"},
    {"title": "AI Safety Summit 2026: Global Agreement on Testing", "slug": "safety-summit",
     "summary": "30 nations sign binding agreement requiring mandatory red-teaming.",
     "content": "30 nations sign binding agreement requiring mandatory red-teaming.",
     "heat_score": 79.1, "trend_score": 75.0,
     "category": "AI Safety", "status": "rising",
     "source_url": "https://example.com/safety-summit", "source_type": "news"},
    {"title": "Cursor AI Reaches 10M Developers", "slug": "cursor-10m",
     "summary": "AI code editor Cursor surpasses 10M developers with 40pct productivity gains.",
     "content": "AI code editor Cursor surpasses 10M developers with 40pct productivity gains.",
     "heat_score": 84.6, "trend_score": 82.0,
     "category": "AI Product", "status": "rising",
     "source_url": "https://example.com/cursor-10m", "source_type": "news"},
    {"title": "Perplexity AI Hits 100M Monthly Users", "slug": "perplexity-100m",
     "summary": "Perplexity reaches 100M MAU, Google search share dips below 90pct.",
     "content": "Perplexity reaches 100M MAU, Google search share dips below 90pct.",
     "heat_score": 87.3, "trend_score": 85.0,
     "category": "AI Startup", "status": "rising",
     "source_url": "https://example.com/perplexity-100m", "source_type": "news"},
    {"title": "AI Solves International Math Olympiad Problems", "slug": "ai-imo",
     "summary": "DeepMind AlphaProof 2 solves 5/6 IMO problems, gold-medal performance.",
     "content": "DeepMind AlphaProof 2 solves 5/6 IMO problems, gold-medal performance.",
     "heat_score": 90.2, "trend_score": 88.0,
     "category": "AI Research", "status": "exploding",
     "source_url": "https://example.com/ai-imo", "source_type": "official"},
    {"title": "Apple Intelligence 2.0: On-Device AI Rivals Cloud", "slug": "apple-intelligence-2",
     "summary": "Apple unveils Intelligence 2.0 with on-device LLM matching 2024 cloud models.",
     "content": "Apple unveils Intelligence 2.0 with on-device LLM matching 2024 cloud models.",
     "heat_score": 85.9, "trend_score": 83.0,
     "category": "AI Product", "status": "rising",
     "source_url": "https://example.com/apple-intelligence-2", "source_type": "official"},
    {"title": "xAI Grok 3: Real-Time X Platform Understanding", "slug": "grok-3",
     "summary": "xAI launches Grok 3 with real-time analysis of posts, images, and videos on X.",
     "content": "xAI launches Grok 3 with real-time analysis of posts, images, and videos on X.",
     "heat_score": 76.8, "trend_score": 73.0,
     "category": "LLM", "status": "rising",
     "source_url": "https://example.com/grok-3", "source_type": "official"},
    {"title": "Mistral Large 3: European Frontier AI", "slug": "mistral-large-3",
     "summary": "Mistral releases Large 3 matching GPT-5 on European language benchmarks.",
     "content": "Mistral releases Large 3 matching GPT-5 on European language benchmarks.",
     "heat_score": 78.4, "trend_score": 76.0,
     "category": "LLM", "status": "rising",
     "source_url": "https://example.com/mistral-large-3", "source_type": "official"},
    {"title": "AI Music Hits Billboard Top 10", "slug": "ai-music-billboard",
     "summary": "Entirely AI-generated song reaches Billboard Hot 100 top 10.",
     "content": "Entirely AI-generated song reaches Billboard Hot 100 top 10.",
     "heat_score": 83.5, "trend_score": 80.0,
     "category": "AI Product", "status": "stable",
     "source_url": "https://example.com/ai-music-billboard", "source_type": "news"},
    {"title": "Waymo Robotaxi Expands to 20 US Cities", "slug": "waymo-20-cities",
     "summary": "Waymo launches robotaxi service in 20 new US cities simultaneously.",
     "content": "Waymo launches robotaxi service in 20 new US cities simultaneously.",
     "heat_score": 81.7, "trend_score": 79.0,
     "category": "Robotics", "status": "stable",
     "source_url": "https://example.com/waymo-20-cities", "source_type": "news"},
    {"title": "Congress Passes AI Transparency Act", "slug": "ai-transparency-act",
     "summary": "US Congress passes AI Transparency Act requiring content labeling.",
     "content": "US Congress passes AI Transparency Act requiring content labeling.",
     "heat_score": 77.9, "trend_score": 74.0,
     "category": "AI Policy", "status": "rising",
     "source_url": "https://example.com/ai-transparency-act", "source_type": "news"},
    {"title": "Scale AI IPO Raises 8B at 40B Valuation", "slug": "scale-ai-ipo",
     "summary": "Scale AI goes public on NASDAQ, raising 8B at 40B valuation.",
     "content": "Scale AI goes public on NASDAQ, raising 8B at 40B valuation.",
     "heat_score": 80.3, "trend_score": 77.0,
     "category": "AI Startup", "status": "stable",
     "source_url": "https://example.com/scale-ai-ipo", "source_type": "news"},
    {"title": "NVIDIA Surpasses 4 Trillion Market Cap", "slug": "nvidia-4t",
     "summary": "NVIDIA becomes most valuable company, surpassing 4T market cap.",
     "content": "NVIDIA becomes most valuable company, surpassing 4T market cap.",
     "heat_score": 88.9, "trend_score": 86.0,
     "category": "AI Startup", "status": "exploding",
     "source_url": "https://example.com/nvidia-4t", "source_type": "news"},
    {"title": "AutoForge Hits 100K GitHub Stars", "slug": "autoforge-100k",
     "summary": "Open-source AI agents framework reaches 100K stars in 3 months.",
     "content": "Open-source AI agents framework reaches 100K stars in 3 months.",
     "heat_score": 82.1, "trend_score": 80.0,
     "category": "AI Startup", "status": "rising",
     "source_url": "https://example.com/autoforge-100k", "source_type": "social"},
    {"title": "Isomorphic Labs Enters Phase III Clinical Trials", "slug": "isomorphic-phase3",
     "summary": "DeepMind drug candidate enters Phase III, first fully AI-designed drug.",
     "content": "DeepMind drug candidate enters Phase III, first fully AI-designed drug.",
     "heat_score": 85.6, "trend_score": 83.0,
     "category": "AI Research", "status": "rising",
     "source_url": "https://example.com/isomorphic-phase3", "source_type": "news"},
    {"title": "Devin 2.0: AI Completes Full-Stack Projects", "slug": "devin-2",
     "summary": "Cognition Labs releases Devin 2.0 for autonomous full-stack development.",
     "content": "Cognition Labs releases Devin 2.0 for autonomous full-stack development.",
     "heat_score": 84.2, "trend_score": 81.0,
     "category": "AI Product", "status": "rising",
     "source_url": "https://example.com/devin-2", "source_type": "official"},
    {"title": "DeepSeek V3 Challenges Western AI", "slug": "deepseek-v3",
     "summary": "Chinese lab DeepSeek releases V3 competitive with GPT-5 at lower cost.",
     "content": "Chinese lab DeepSeek releases V3 competitive with GPT-5 at lower cost.",
     "heat_score": 87.1, "trend_score": 84.0,
     "category": "LLM", "status": "rising",
     "source_url": "https://example.com/deepseek-v3", "source_type": "news"},
    {"title": "Anthropic Raises 10B at 100B Valuation", "slug": "anthropic-10b",
     "summary": "Anthropic closes 10B Series E at 100B valuation.",
     "content": "Anthropic closes 10B Series E at 100B valuation.",
     "heat_score": 86.8, "trend_score": 83.0,
     "category": "AI Startup", "status": "stable",
     "source_url": "https://example.com/anthropic-10b", "source_type": "news"},
    {"title": "Real-Time 3D Scene Understanding Breakthrough", "slug": "3d-scene",
     "summary": "NVIDIA researchers publish real-time 3D scene understanding at 60fps.",
     "content": "NVIDIA researchers publish real-time 3D scene understanding at 60fps.",
     "heat_score": 75.3, "trend_score": 72.0,
     "category": "Computer Vision", "status": "stable",
     "source_url": "https://example.com/3d-scene", "source_type": "blog"},
    {"title": "Suno and Udio Settle Copyright Lawsuits", "slug": "suno-udio-settle",
     "summary": "AI music generators settle with record labels, licensing framework established.",
     "content": "AI music generators settle with record labels, licensing framework established.",
     "heat_score": 72.4, "trend_score": 68.0,
     "category": "AI Policy", "status": "stable",
     "source_url": "https://example.com/suno-udio-settle", "source_type": "news"},
    {"title": "Tesla Optimus Begins Home Trials", "slug": "tesla-optimus",
     "summary": "Tesla starts limited home trials of Optimus humanoid robot.",
     "content": "Tesla starts limited home trials of Optimus humanoid robot.",
     "heat_score": 83.8, "trend_score": 81.0,
     "category": "Robotics", "status": "rising",
     "source_url": "https://example.com/tesla-optimus", "source_type": "news"},
    {"title": "China Implements Mandatory AI Registration", "slug": "china-ai-reg",
     "summary": "China launches mandatory AI registration for all AI services.",
     "content": "China launches mandatory AI registration for all AI services.",
     "heat_score": 74.6, "trend_score": 70.0,
     "category": "AI Regulation", "status": "stable",
     "source_url": "https://example.com/china-ai-reg", "source_type": "news"},
    {"title": "Runway Gen-4 Enters Professional Film Production", "slug": "runway-gen4",
     "summary": "Runway launches Gen-4 with Hollywood-grade quality.",
     "content": "Runway launches Gen-4 with Hollywood-grade quality.",
     "heat_score": 81.9, "trend_score": 79.0,
     "category": "AI Product", "status": "rising",
     "source_url": "https://example.com/runway-gen4", "source_type": "official"},
    {"title": "Cerebras IPO Challenges NVIDIA", "slug": "cerebras-ipo",
     "summary": "AI chip startup Cerebras completes NASDAQ IPO, raising 4.5B.",
     "content": "AI chip startup Cerebras completes NASDAQ IPO, raising 4.5B.",
     "heat_score": 79.7, "trend_score": 76.0,
     "category": "AI Startup", "status": "stable",
     "source_url": "https://example.com/cerebras-ipo", "source_type": "news"},
    {"title": "Multimodal AI Agents Browse Web Autonomously", "slug": "ai-agents-web",
     "summary": "Multiple companies release AI agents for autonomous web browsing.",
     "content": "Multiple companies release AI agents for autonomous web browsing.",
     "heat_score": 85.1, "trend_score": 83.0,
     "category": "AI Product", "status": "rising",
     "source_url": "https://example.com/ai-agents-web", "source_type": "news"},
    {"title": "Stability AI Launches Stable Video 4", "slug": "stable-video-4",
     "summary": "Stability AI releases real-time 4K video generation, fully open-source.",
     "content": "Stability AI releases real-time 4K video generation, fully open-source.",
     "heat_score": 78.2, "trend_score": 75.0,
     "category": "Computer Vision", "status": "stable",
     "source_url": "https://example.com/stable-video-4", "source_type": "official"},
]


REPORTS_DATA = [
    {"title": "AI Hotspot Daily Report - 2026-06-20", "slug": "daily-2026-06-20", "summary": "Top AI stories: GPT-5 launch dominates, NVIDIA hits 4T.",
     "content": "Top AI stories: GPT-5 launch dominates, NVIDIA hits 4T.", "report_type": "daily", "published_at": _past(1)},
    {"title": "AI Weekly Digest - Week 25 2026", "slug": "weekly-week-25", "summary": "Three frontier models, robotics breakthroughs, regulation shifts.",
     "content": "Three frontier models, robotics breakthroughs, regulation shifts.", "report_type": "weekly", "published_at": _past(3)},
    {"title": "AI Monthly Outlook - June 2026", "slug": "monthly-june-2026", "summary": "The Great AI Convergence: AI becomes invisible infrastructure.",
     "content": "The Great AI Convergence: AI becomes invisible infrastructure.", "report_type": "monthly", "published_at": _past(10)},
    {"title": "AI Safety Quarterly Review - Q2 2026", "slug": "safety-q2-2026", "summary": "Constitutional AI advances, governance agreements, alignment progress.",
     "content": "Constitutional AI advances, governance agreements, alignment progress.", "report_type": "monthly", "published_at": _past(15)},
    {"title": "AI Startup Ecosystem - Q2 2026", "slug": "startups-q2-2026", "summary": "45B Q2 funding, emerging categories, new AI-native companies.",
     "content": "45B Q2 funding, emerging categories, new AI-native companies.", "report_type": "monthly", "published_at": _past(20)},
]


TRENDS_DATA = [
    {"topic": "Frontier Language Models", "category": "LLM", "current_score": 95.0,
     "predicted_score": 97.0, "confidence": 0.92, "timeframe": "30d"},
    {"topic": "AI Agents and Autonomous Systems", "category": "AI Product", "current_score": 88.0,
     "predicted_score": 93.0, "confidence": 0.85, "timeframe": "30d"},
    {"topic": "AI-Powered Code Generation", "category": "AI Product", "current_score": 86.0,
     "predicted_score": 90.0, "confidence": 0.88, "timeframe": "30d"},
    {"topic": "Open-Source AI Models", "category": "LLM", "current_score": 84.0,
     "predicted_score": 88.0, "confidence": 0.8, "timeframe": "30d"},
    {"topic": "Humanoid Robotics", "category": "Robotics", "current_score": 82.0,
     "predicted_score": 87.0, "confidence": 0.72, "timeframe": "30d"},
    {"topic": "AI Video Generation", "category": "Computer Vision", "current_score": 80.0,
     "predicted_score": 85.0, "confidence": 0.78, "timeframe": "30d"},
    {"topic": "AI Drug Discovery", "category": "AI Research", "current_score": 78.0,
     "predicted_score": 83.0, "confidence": 0.7, "timeframe": "30d"},
    {"topic": "AI Regulation and Governance", "category": "AI Regulation", "current_score": 76.0,
     "predicted_score": 80.0, "confidence": 0.82, "timeframe": "30d"},
    {"topic": "AI Search Engines", "category": "AI Product", "current_score": 75.0,
     "predicted_score": 82.0, "confidence": 0.75, "timeframe": "30d"},
    {"topic": "AI Hardware Competition", "category": "AI Startup", "current_score": 74.0,
     "predicted_score": 78.0, "confidence": 0.68, "timeframe": "30d"},
    {"topic": "Multimodal AI Understanding", "category": "LLM", "current_score": 83.0,
     "predicted_score": 89.0, "confidence": 0.83, "timeframe": "30d"},
    {"topic": "AI Safety and Alignment", "category": "AI Safety", "current_score": 72.0,
     "predicted_score": 77.0, "confidence": 0.76, "timeframe": "30d"},
    {"topic": "Enterprise AI Adoption", "category": "AI Product", "current_score": 81.0,
     "predicted_score": 86.0, "confidence": 0.85, "timeframe": "30d"},
    {"topic": "AI Music and Audio Generation", "category": "AI Product", "current_score": 68.0,
     "predicted_score": 74.0, "confidence": 0.65, "timeframe": "30d"},
    {"topic": "Sovereign AI Initiatives", "category": "AI Policy", "current_score": 70.0,
     "predicted_score": 76.0, "confidence": 0.72, "timeframe": "30d"},
]


SOURCES_DATA = [
    {"name": "OpenAI Blog", "url": "https://openai.com/blog", "source_type": "rss", "category": "LLM", "is_active": True},
    {"name": "Anthropic News", "url": "https://anthropic.com/news", "source_type": "rss", "category": "LLM", "is_active": True},
    {"name": "Google AI Blog", "url": "https://ai.googleblog.com", "source_type": "rss", "category": "AI Research", "is_active": True},
    {"name": "Meta AI Blog", "url": "https://ai.meta.com/blog", "source_type": "rss", "category": "LLM", "is_active": True},
    {"name": "NVIDIA Dev Blog", "url": "https://developer.nvidia.com/blog", "source_type": "rss", "category": "AI Product", "is_active": True},
    {"name": "Hacker News", "url": "https://news.ycombinator.com", "source_type": "api", "category": "AI Startup", "is_active": True},
    {"name": "arXiv AI/ML", "url": "https://arxiv.org/list/cs.AI/recent", "source_type": "scrape", "category": "AI Research", "is_active": True},
    {"name": "TechCrunch AI", "url": "https://techcrunch.com/category/ai", "source_type": "rss", "category": "AI Startup", "is_active": True},
    {"name": "The Verge AI", "url": "https://theverge.com/ai", "source_type": "rss", "category": "AI Product", "is_active": True},
    {"name": "Reuters AI", "url": "https://reuters.com/technology/ai", "source_type": "rss", "category": "AI Policy", "is_active": True},
    {"name": "GitHub Trending", "url": "https://github.com/trending", "source_type": "api", "category": "AI Startup", "is_active": True},
    {"name": "Reddit ML", "url": "https://reddit.com/r/MachineLearning", "source_type": "api", "category": "AI Research", "is_active": True},
]


AGENT_LOGS_DATA = [
    {"agent_name": "news_crawler", "action": "fetch_rss", "status": "success", "duration_ms": 2340},
    {"agent_name": "news_crawler", "action": "fetch_rss", "status": "success", "duration_ms": 1890},
    {"agent_name": "news_crawler", "action": "fetch_rss", "status": "error", "duration_ms": 5000},
    {"agent_name": "heat_scorer", "action": "calculate_scores", "status": "success", "duration_ms": 450},
    {"agent_name": "heat_scorer", "action": "calculate_scores", "status": "success", "duration_ms": 380},
    {"agent_name": "trend_analyzer", "action": "analyze_trends", "status": "success", "duration_ms": 12000},
    {"agent_name": "trend_analyzer", "action": "generate_forecast", "status": "success", "duration_ms": 8500},
    {"agent_name": "report_generator", "action": "generate_daily", "status": "success", "duration_ms": 15000},
    {"agent_name": "report_generator", "action": "generate_weekly", "status": "success", "duration_ms": 25000},
    {"agent_name": "insight_engine", "action": "generate_insights", "status": "success", "duration_ms": 6700},
    {"agent_name": "dedup_agent", "action": "deduplicate", "status": "success", "duration_ms": 920},
    {"agent_name": "sentiment_analyzer", "action": "analyze_sentiment", "status": "success", "duration_ms": 3200},
]


async def seed_database():
    """Populate the database with all demo data."""
    from app.database import Base

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)

    async with async_session_factory() as session:
        for data in COMPANIES_DATA:
            session.add(Company(**data))

        for data in EVENTS_DATA:
            days_ago = random.randint(0, 14)
            session.add(Event(
                **data,
                created_at=_past(days_ago),
                updated_at=_past(max(0, days_ago - random.randint(0, 3))),
            ))

        for data in REPORTS_DATA:
            pub = data["published_at"]
            session.add(Report(title=data["title"], slug=data["slug"], summary=data["summary"],
                               content=data["content"], report_type=data["report_type"],
                               published_at=pub, created_at=pub))

        for data in TRENDS_DATA:
            session.add(Trend(**data, created_at=_past(random.randint(0, 7))))

        for data in SOURCES_DATA:
            session.add(DataSource(**data, last_fetched=_past(random.randint(0, 2))))

        for data in AGENT_LOGS_DATA:
            session.add(AgentLog(**data,
                                 input_data='{"source": "api", "limit": 50}',
                                 output_data='{"processed": 50, "new": 12}',
                                 created_at=_past(random.randint(0, 3))))

        session.add(User(email="demo@hotradar.ai", name="Demo User",
                         hashed_password=hash_password("demo1234"), role="pro"))

        await session.commit()

    print("=" * 50)
    print("  HotRadar AI - Database seeded!")
    print(f"  Companies:  {len(COMPANIES_DATA)}")
    print(f"  Events:     {len(EVENTS_DATA)}")
    print(f"  Reports:    {len(REPORTS_DATA)}")
    print(f"  Trends:     {len(TRENDS_DATA)}")
    print(f"  Sources:    {len(SOURCES_DATA)}")
    print(f"  Agent Logs: {len(AGENT_LOGS_DATA)}")
    print(f"  Users:      1 (demo@hotradar.ai / demo1234)")
    print("=" * 50)


if __name__ == "__main__":
    asyncio.run(seed_database())
