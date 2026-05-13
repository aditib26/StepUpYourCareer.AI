from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.routes import analyze, resources, mentors, tools, interview

app = FastAPI(title="StepUpYourCareer.AI API", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url, "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analyze.router, prefix="/api", tags=["analyze"])
app.include_router(resources.router, prefix="/api", tags=["resources"])
app.include_router(mentors.router, prefix="/api", tags=["mentors"])
app.include_router(tools.router, prefix="/api", tags=["tools"])
app.include_router(interview.router, prefix="/api", tags=["interview"])


@app.get("/health")
async def health():
    return {"status": "ok", "version": "2.0.0"}
