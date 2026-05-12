from pydantic import BaseModel, HttpUrl
from typing import Optional


# ── JD Parsing ──────────────────────────────────────────────────────────────

class ParsedJD(BaseModel):
    role_title: str
    company_name: str
    required_skills: list[str]
    nice_to_have_skills: list[str]
    experience_years: int
    job_summary: str


# ── Skill Gap ────────────────────────────────────────────────────────────────

class ScoredSkill(BaseModel):
    skill: str
    priority_score: int        # 1–100; higher = more critical per Pareto
    reason: str                # why this gap matters for the specific JD


class SkillGapResult(BaseModel):
    technical_skill_gaps: list[ScoredSkill]
    soft_skill_gaps: list[ScoredSkill]
    transferable_skills: list[str]


# ── Resources ────────────────────────────────────────────────────────────────

class Resource(BaseModel):
    title: str
    url: str
    type: str                  # 'course' | 'book' | 'video' | 'article'
    platform: str
    description: Optional[str] = None


class SkillResources(BaseModel):
    skill: str
    resources: list[Resource]


# ── Mentors ──────────────────────────────────────────────────────────────────

class Mentor(BaseModel):
    mentor_id: str
    name: str
    bio: str
    linkedin_url: str
    photo_url: Optional[str] = None
    technical_skills: list[str]
    role: str
    match_score: Optional[float] = None


# ── SSE Pipeline Events ──────────────────────────────────────────────────────

class PipelineEvent(BaseModel):
    step: str
    message: str
    progress: int              # 0–100
    data: Optional[dict] = None


# ── Final Analysis Result ────────────────────────────────────────────────────

class AnalysisResult(BaseModel):
    target_role: str
    company_name: str
    job_summary: str
    top_skills: list[ScoredSkill]   # top 3 Pareto priorities
    skill_gaps: SkillGapResult
    resources: list[SkillResources]
    mentors: list[Mentor]


# ── API Request ──────────────────────────────────────────────────────────────

class AnalyzeRequest(BaseModel):
    jd_url: Optional[str] = None
    jd_text: Optional[str] = None
    user_name: str = "User"
    user_email: str = ""
