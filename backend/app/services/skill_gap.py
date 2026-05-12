from openai import AsyncOpenAI
from app.models.schemas import ParsedJD, SkillGapResult, ScoredSkill
from app.core.config import settings

_client = AsyncOpenAI(api_key=settings.openai_api_key)


async def anonymize_resume(resume_text: str) -> str:
    response = await _client.chat.completions.create(
        model="gpt-4o-mini",
        temperature=0,
        messages=[
            {
                "role": "system",
                "content": "Remove all personal identifiers (name, email, phone, address, LinkedIn URL, GitHub URL) from this resume. Replace them with [REDACTED]. Return only the cleaned resume text.",
            },
            {"role": "user", "content": resume_text},
        ],
    )
    return response.choices[0].message.content.strip()


async def analyze_skill_gap(
    resume_text: str,
    parsed_jd: ParsedJD,
) -> SkillGapResult:
    """
    Compare resume against JD using GPT-4o Structured Outputs.
    Returns skill gaps with individual Pareto priority scores and reasons.
    """
    jd_context = (
        f"Role: {parsed_jd.role_title} at {parsed_jd.company_name}\n"
        f"Summary: {parsed_jd.job_summary}\n"
        f"Required skills: {', '.join(parsed_jd.required_skills)}\n"
        f"Nice-to-have: {', '.join(parsed_jd.nice_to_have_skills)}"
    )

    response = await _client.beta.chat.completions.parse(
        model=settings.chat_model,
        temperature=0,
        messages=[
            {
                "role": "system",
                "content": (
                    "You are a senior technical recruiter and career coach. "
                    "Analyze the candidate's resume against the specific job description. "
                    "Identify ONLY genuine gaps — skills the JD requires that are missing or weak in the resume. "
                    "Assign a priority_score 1–100 based on the Pareto principle: "
                    "skills that appear as required in the JD get scores 70–100, "
                    "nice-to-have skills get 40–69, inferred soft gaps get 20–39. "
                    "The 'reason' field must reference the specific JD context, not generic advice. "
                    "transferable_skills are skills in the resume that partially bridge the gap."
                ),
            },
            {
                "role": "user",
                "content": f"JOB DESCRIPTION:\n{jd_context}\n\nRESUME:\n{resume_text[:5000]}",
            },
        ],
        response_format=SkillGapResult,
    )
    return response.choices[0].message.parsed
