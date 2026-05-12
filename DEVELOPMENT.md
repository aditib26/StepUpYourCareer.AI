# StepUpYourCareer.AI — V2 Development Guide

## Quick Start

### Backend (FastAPI)
```bash
cd backend
cp .env.example .env          # fill in your OPENAI_API_KEY
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
API will be live at http://localhost:8000
Docs at http://localhost:8000/docs

### Frontend (Next.js 14)
```bash
cd frontend
cp .env.local.example .env.local
npm install
npm run dev
```
App will be live at http://localhost:3000

---

## Project Structure

```
StepUpYourCareer.AI/
├── StepUpAI/          # V1 Streamlit app (still deployed on Streamlit Cloud)
├── backend/           # V2 FastAPI backend
│   ├── main.py
│   ├── requirements.txt
│   └── app/
│       ├── core/config.py         # Settings (pydantic-settings)
│       ├── models/schemas.py      # All Pydantic schemas
│       ├── services/
│       │   ├── pdf_parser.py      # PyMuPDF
│       │   ├── jd_parser.py       # Jina Reader + GPT-4o Structured Outputs
│       │   ├── skill_gap.py       # GPT-4o Structured Outputs gap analysis
│       │   ├── resource_service.py # Curated resource DB lookup
│       │   ├── mentor_service.py  # K-Means cluster matching
│       │   └── pipeline.py        # Async SSE orchestrator
│       ├── api/routes/
│       │   ├── analyze.py         # POST /api/analyze (SSE stream)
│       │   ├── resources.py       # GET /api/resources/{skill}
│       │   └── mentors.py         # POST /api/mentors/match
│       └── data/
│           └── resources.json     # Verified curated resource catalog
└── frontend/          # V2 Next.js 14 frontend
    ├── app/
    │   ├── page.tsx               # Landing page
    │   ├── analyze/page.tsx       # Main analysis page (SSE consumer)
    │   └── dashboard/page.tsx     # Progress tracking
    ├── components/
    │   ├── landing/               # Hero, Features, HowItWorks
    │   ├── analyze/               # ResumeUpload, JDInput, PipelineProgress
    │   ├── results/               # SkillGapSection, ResourceSection, MentorSection
    │   └── shared/                # Navbar
    └── lib/
        ├── types.ts               # TypeScript interfaces
        ├── api.ts                 # SSE API client
        └── utils.ts               # cn(), priorityColor(), etc.
```

---

## Phase 2 Priorities (Next Sprint)
1. Supabase Auth (user accounts + session persistence)
2. pgvector for persistent embeddings (stop re-embedding on every request)
3. Real mentor data — replace generated JSON with 50 real LinkedIn profiles
4. Coursera API + YouTube Data API for additional resource lookup
5. Weekly cron to verify all resource URLs are live
6. Interview prep module (generate mock questions per skill gap)

## Deployment
- **Frontend**: Vercel (connect GitHub repo, set NEXT_PUBLIC_API_URL)
- **Backend**: Railway or Render (set env vars, start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`)
