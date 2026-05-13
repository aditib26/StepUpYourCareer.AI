"""
AI document generation services — all use GPT-4o with Structured Outputs
for guaranteed schema-valid JSON responses.
"""
from openai import AsyncOpenAI
from app.models.schemas import (
    CoverLetterResult,
    ResumeRewriteResult,
    ColdEmailResult,
    LinkedInOptimization,
)
from app.core.config import settings


def _get_client() -> AsyncOpenAI:
    return AsyncOpenAI(api_key=settings.openai_api_key)


# ── Cover Letter ─────────────────────────────────────────────────────────────

async def generate_cover_letter(
    resume_text: str,
    jd_text: str,
    user_name: str,
    company_name: str = "",
    tone: str = "professional",
) -> CoverLetterResult:
    response = await _get_client().beta.chat.completions.parse(
        model=settings.chat_model,
        temperature=0.7,
        messages=[
            {
                "role": "system",
                "content": (
                    "You are a top-tier career coach who has written 10,000+ cover letters. "
                    "Write a compelling, specific, non-generic cover letter that connects the candidate's "
                    "experience directly to the job's requirements. "
                    "Avoid clichés like 'I am writing to apply'. Lead with a hook. "
                    f"Use a {tone} tone. The candidate's name is {user_name}."
                ),
            },
            {
                "role": "user",
                "content": (
                    f"JOB DESCRIPTION:\n{jd_text[:4000]}\n\n"
                    f"CANDIDATE RESUME:\n{resume_text[:4000]}\n\n"
                    f"Company: {company_name or 'the company'}\n"
                    "Generate the cover letter. The 'full_text' field should contain the complete letter "
                    "with proper paragraph breaks (\\n\\n between paragraphs)."
                ),
            },
        ],
        response_format=CoverLetterResult,
    )
    return response.choices[0].message.parsed


# ── Resume Rewriter ──────────────────────────────────────────────────────────

async def rewrite_resume_bullets(
    resume_text: str,
    jd_text: str,
    target_role: str = "",
) -> ResumeRewriteResult:
    response = await _get_client().beta.chat.completions.parse(
        model=settings.chat_model,
        temperature=0.5,
        messages=[
            {
                "role": "system",
                "content": (
                    "You are a senior technical recruiter at a top tech firm. "
                    "Rewrite resume bullets to be stronger using the XYZ formula: "
                    "'Accomplished [X] as measured by [Y] by doing [Z]'. "
                    "Always include quantification (numbers, percentages, scale). "
                    "Incorporate exact keywords from the JD where genuinely applicable — never fabricate. "
                    "Use strong action verbs. No weak phrases like 'responsible for' or 'helped with'. "
                    "Return 5-8 of the most impactful bullets across the candidate's experience."
                ),
            },
            {
                "role": "user",
                "content": (
                    f"TARGET ROLE: {target_role}\n\n"
                    f"JOB DESCRIPTION:\n{jd_text[:4000]}\n\n"
                    f"CANDIDATE RESUME:\n{resume_text[:4000]}\n\n"
                    "For each bullet, show the original (or empty string if you're adding new), "
                    "the rewritten version, why it's stronger, and the JD keywords now present."
                ),
            },
        ],
        response_format=ResumeRewriteResult,
    )
    return response.choices[0].message.parsed


# ── Cold Email ───────────────────────────────────────────────────────────────

async def generate_cold_email(
    resume_text: str,
    target_role: str,
    target_company: str,
    target_person_name: str,
    target_person_role: str,
    user_name: str,
    purpose: str = "informational_interview",  # 'informational_interview' | 'referral_request' | 'job_application'
) -> ColdEmailResult:
    response = await _get_client().beta.chat.completions.parse(
        model=settings.chat_model,
        temperature=0.7,
        messages=[
            {
                "role": "system",
                "content": (
                    "You are a master at writing high-response-rate cold outreach emails. "
                    "Rules: "
                    "1) Subject line under 8 words, no clickbait, specific. "
                    "2) Email body under 150 words. "
                    "3) Lead with genuine context (something specific about their work/company). "
                    "4) State a clear, small ask (15-min chat, not a job). "
                    "5) Make it easy to say no. "
                    "6) Never use 'I hope this finds you well' or other dead phrases. "
                    f"The sender's name is {user_name}."
                ),
            },
            {
                "role": "user",
                "content": (
                    f"PURPOSE: {purpose}\n"
                    f"TARGET PERSON: {target_person_name} ({target_person_role} at {target_company})\n"
                    f"TARGET ROLE I want: {target_role}\n\n"
                    f"MY RESUME:\n{resume_text[:3000]}\n\n"
                    "Write the email. Also produce a short, polite 7-day follow-up if they don't reply."
                ),
            },
        ],
        response_format=ColdEmailResult,
    )
    return response.choices[0].message.parsed


# ── LinkedIn Optimizer ───────────────────────────────────────────────────────

async def optimize_linkedin(
    resume_text: str,
    target_role: str,
    current_headline: str = "",
    current_about: str = "",
) -> LinkedInOptimization:
    response = await _get_client().beta.chat.completions.parse(
        model=settings.chat_model,
        temperature=0.6,
        messages=[
            {
                "role": "system",
                "content": (
                    "You are a LinkedIn profile optimization expert who has rewritten profiles "
                    "for executives, engineers, and career switchers. "
                    "Rules: "
                    "1) Headline: 220 chars max, packed with searchable keywords + value proposition. "
                    "2) About: First person, scannable, max 5 short paragraphs, 1-2 specific achievements. "
                    "3) Skills: Recommend the 10-15 most strategic skills LinkedIn should list. "
                    "4) Experience bullets: rewrite for impact + quantification. "
                    "5) Generate 3 different headline options optimized for different angles."
                ),
            },
            {
                "role": "user",
                "content": (
                    f"TARGET ROLE: {target_role}\n"
                    f"CURRENT HEADLINE (if any): {current_headline}\n"
                    f"CURRENT ABOUT (if any): {current_about}\n\n"
                    f"RESUME:\n{resume_text[:4000]}\n\n"
                    "Generate the full LinkedIn optimization."
                ),
            },
        ],
        response_format=LinkedInOptimization,
    )
    return response.choices[0].message.parsed
