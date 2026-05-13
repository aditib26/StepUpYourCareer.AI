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


# ══════════════════════════════════════════════════════════════════════════════
#  SPRINT 1: AI Document Generation Tools
# ══════════════════════════════════════════════════════════════════════════════

# ── Cover Letter ─────────────────────────────────────────────────────────────

class CoverLetterResult(BaseModel):
    subject_line: str
    greeting: str                     # "Dear Ms. Smith,"
    opening_paragraph: str            # hook
    body_paragraphs: list[str]        # 2-3 body paragraphs
    closing_paragraph: str            # call-to-action
    signature: str                    # "Sincerely, [Name]"
    full_text: str                    # complete letter as one block
    tone: str                         # 'formal' | 'enthusiastic' | 'conversational'


# ── Resume Rewriter ──────────────────────────────────────────────────────────

class RewrittenBullet(BaseModel):
    original: str                     # original bullet from resume (or empty if new)
    rewritten: str                    # improved version
    reasoning: str                    # why this is stronger
    keywords_added: list[str]         # JD keywords now in the bullet


class ResumeRewriteResult(BaseModel):
    bullets: list[RewrittenBullet]
    overall_advice: str
    keywords_to_emphasize: list[str]  # most important JD keywords
    sections_to_add: list[str]        # e.g., "Projects", "Certifications"


# ── Cold Email ───────────────────────────────────────────────────────────────

class ColdEmailResult(BaseModel):
    subject_line: str
    email_body: str
    follow_up_text: str               # short 7-day follow-up if no reply
    personalization_notes: list[str]  # tips on customizing further


# ── LinkedIn Optimizer ───────────────────────────────────────────────────────

class LinkedInOptimization(BaseModel):
    headline_options: list[str]       # 3 headline variations
    about_section: str                # optimized About section
    skills_to_add: list[str]          # skills LinkedIn should list
    experience_bullets: list[RewrittenBullet]   # rewritten experience bullets
    profile_strength_tips: list[str]  # actionable improvements


# ══════════════════════════════════════════════════════════════════════════════
#  SPRINT 2: Mock Interviewer
# ══════════════════════════════════════════════════════════════════════════════

class InterviewTurn(BaseModel):
    role: str                         # 'interviewer' | 'candidate'
    text: str
    audio_url: Optional[str] = None


class InterviewStartResponse(BaseModel):
    session_id: str
    first_question: str
    audio_b64: str                    # base64-encoded audio of the question
    question_number: int = 1
    total_questions: int = 5


class InterviewRespondResponse(BaseModel):
    session_id: str
    transcription: str                # what the user said
    next_question: Optional[str] = None
    audio_b64: Optional[str] = None
    question_number: int
    is_complete: bool = False


class InterviewFeedback(BaseModel):
    overall_score: int                # 0-100
    communication_score: int          # 0-100
    technical_score: int              # 0-100
    structure_score: int              # 0-100 (STAR method usage)
    strengths: list[str]
    improvements: list[str]
    per_question_feedback: list[dict]
    summary: str
