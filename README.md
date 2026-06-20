# HotRadar AI

> Global AI Hotspot Discovery Platform + Trend Prediction + Agent Analysis + Investment Impact Analysis

## Architecture

- **Frontend**: Next.js 15 + React 19 + TypeScript + TailwindCSS 4 + Shadcn UI
- **Backend**: FastAPI + Python + SQLAlchemy + Celery + Redis
- **Database**: PostgreSQL + Redis + Qdrant + ClickHouse
- **Deployment**: Docker + GitHub Actions + Vercel/Railway

## Project Structure

\\\
hotradar-ai/
├── frontend/          # Next.js 15 App
├── backend/           # FastAPI Backend
├── agents/            # AI Agent System (9 Agents)
└── deploy/            # Docker & CI/CD configs
\\\

## Quick Start

### Frontend
\\\ash
cd frontend
npm install
npm run dev
\\\

### Backend
\\\ash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
\\\

## Tech Stack

### Frontend
- Next.js 15 (App Router)
- React 19
- TypeScript 5
- TailwindCSS 4
- Shadcn UI
- Framer Motion
- React Bits
- TanStack Query
- Zustand
- Recharts
- D3

### Backend
- FastAPI
- Python 3.12+
- SQLAlchemy 2.0
- Celery + Redis
- Pydantic v2

### Database
- PostgreSQL 16
- Redis 7
- Qdrant
- ClickHouse

## License

Proprietary
