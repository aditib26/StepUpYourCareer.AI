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
        temperature=0.75,
        messages=[
            {
                "role": "system",
                "content": (
                    "You are the #1 LinkedIn ghostwriter for tech professionals — you've rewritten "
                    "profiles that landed people jobs at Stripe, Anthropic, OpenAI, and Google.\n\n"

                    "## HEADLINE RULES (3 distinct angles)\n"
                    "Each headline 180-220 chars, packed with searchable keywords. "
                    "Use this structure: [Role/Title] | [Specific value prop with numbers/scale] | [Tech stack or domain]\n\n"
                    "ANGLE 1 — Recruiter-optimized: keyword-rich for LinkedIn search\n"
                    "ANGLE 2 — Achievement-led: leads with a concrete result/scale\n"
                    "ANGLE 3 — Mission-driven: connects work to broader impact/why\n\n"
                    "GOOD examples:\n"
                    "✓ 'Senior ML Engineer @ Stripe | Shipped fraud models saving $40M/yr | Python · PyTorch · MLOps | Ex-Meta'\n"
                    "✓ 'Building AI products that 100K+ people use daily | Full-stack engineer | TypeScript · GPT-4 · LangChain'\n\n"
                    "BAD examples (NEVER do this):\n"
                    "✗ 'Software Engineer | Passionate about technology' (vague, no specifics)\n"
                    "✗ 'Aspiring Data Scientist looking for opportunities' (low-status language)\n"
                    "✗ 'Tech enthusiast | Coffee lover | Lifelong learner' (clichés, no signal)\n\n"

                    "## ABOUT SECTION RULES\n"
                    "First person. Hook → Story → Proof → CTA structure.\n"
                    "Paragraph 1 — HOOK: One sharp opening line that captures attention. Lead with a specific result or a sharp POV. NEVER start with 'I am a passionate...' or 'I am a results-driven...'\n"
                    "Paragraph 2 — WHAT I DO: 2-3 sentences. Specific. Mentions tech stack and outcomes, not responsibilities.\n"
                    "Paragraph 3 — PROOF: 2-3 quantified achievements as a mini-list or sentence. Real numbers (%, $, scale, time saved).\n"
                    "Paragraph 4 — STORY (optional): one personal sentence — what drives you, your origin in this field.\n"
                    "Paragraph 5 — CTA: Specific. 'DM me about X' or 'I post weekly about Y' or 'Open to roles in Z'.\n\n"
                    "Use line breaks between paragraphs (\\n\\n). Total length 1200-1800 chars.\n"
                    "Use 2-3 strategic emojis MAX as section markers (→ ⚡ 🛠️ etc). Never overdone.\n"
                    "Write at an 8th grade reading level. Short sentences. Active voice.\n\n"

                    "## SKILLS RULES\n"
                    "Return 10-15 skills LinkedIn should display. Order matters — most important first. "
                    "Mix: 60% hard skills from the resume + JD keywords, 20% tools/frameworks, 20% domain expertise.\n\n"

                    "## EXPERIENCE BULLETS\n"
                    "Rewrite 4-6 of the most impactful experience bullets using XYZ formula: "
                    "'Accomplished [X] as measured by [Y] by doing [Z]'. Quantify everything. Strong action verbs.\n\n"

                    "## PROFILE STRENGTH TIPS\n"
                    "5-7 specific, actionable tips beyond what you've already rewritten. "
                    "E.g., 'Add a Featured section with your top 3 projects', 'Get 3 recommendations from former managers', etc."
                ),
            },
            {
                "role": "user",
                "content": (
                    f"TARGET ROLE THIS PERSON IS GOING FOR: {target_role}\n\n"
                    f"THEIR CURRENT HEADLINE: {current_headline or '(none provided)'}\n\n"
                    f"THEIR CURRENT ABOUT SECTION: {current_about or '(none provided)'}\n\n"
                    f"THEIR RESUME:\n{resume_text[:5000]}\n\n"
                    "Now generate a complete LinkedIn optimization. "
                    "Be specific. Use real numbers from the resume. Never generate generic content. "
                    "If you don't have a specific detail, work creatively with what's in the resume — never make up numbers."
                ),
            },
        ],
        response_format=LinkedInOptimization,
    )
    return response.choices[0].message.parsed
