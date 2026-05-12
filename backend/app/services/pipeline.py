"""
Async analysis pipeline — orchestrates all services and yields SSE events.
Each yield is a dict that maps to PipelineEvent on the frontend.
"""
import asyncio
import json
from typing import AsyncGenerator

from app.services import pdf_parser, jd_parser, skill_gap, resource_service, mentor_service
from app.models.schemas import AnalysisResult, ScoredSkill


def _event(step: str, message: str, progress: int, data: dict | None = None) -> str:
    payload = {"step": step, "message": message, "progress": progress}
    if data:
        payload["data"] = data
    return f"data: {json.dumps(payload)}\n\n"


async def run_analysis(
    file_bytes: bytes,
    jd_url: str | None,
    jd_text: str | None,
) -> AsyncGenerator[str, None]:

    # ── Step 1: Parse PDF ────────────────────────────────────────────────────
    yield _event("pdf_parsing", "Extracting resume text...", 5)
    resume_text = await asyncio.to_thread(pdf_parser.extract_text, file_bytes)
    word_count = pdf_parser.word_count(resume_text)
    yield _event("pdf_parsed", f"Resume extracted — {word_count} words found", 12)

    # ── Step 2: Fetch + parse JD (parallel with anonymization) ───────────────
    yield _event("jd_parsing", "Fetching and parsing job description...", 18)

    raw_jd = jd_text or ""
    if jd_url and not jd_text:
        try:
            raw_jd = await jd_parser.fetch_jd_from_url(jd_url)
        except Exception:
            raw_jd = ""

    # Run anonymize + JD parse in parallel
    anon_task = asyncio.create_task(skill_gap.anonymize_resume(resume_text))
    jd_task = asyncio.create_task(jd_parser.parse_jd(raw_jd)) if raw_jd else None

    yield _event("anonymizing", "Anonymizing resume for privacy...", 25)

    if jd_task:
        anon_resume, parsed_jd = await asyncio.gather(anon_task, jd_task)
    else:
        anon_resume = await anon_task
        # Fallback minimal JD when no JD provided
        from app.models.schemas import ParsedJD
        parsed_jd = ParsedJD(
            role_title="Target Role",
            company_name="",
            required_skills=[],
            nice_to_have_skills=[],
            experience_years=0,
            job_summary="General career analysis",
        )

    yield _event(
        "jd_parsed",
        f"Job description parsed — {len(parsed_jd.required_skills)} required skills identified",
        35,
    )

    # ── Step 3: Skill gap analysis ────────────────────────────────────────────
    yield _event("gap_analyzing", "Analyzing your skill gaps against the role...", 42)
    gaps = await skill_gap.analyze_skill_gap(anon_resume, parsed_jd)
    tech_names = [s.skill for s in gaps.technical_skill_gaps]
    soft_names = [s.skill for s in gaps.soft_skill_gaps]
    total_gaps = len(tech_names) + len(soft_names)
    yield _event(
        "gap_analyzed",
        f"Found {total_gaps} skill gaps — running Pareto prioritization",
        58,
        data={
            "technical_skill_gaps": [s.model_dump() for s in gaps.technical_skill_gaps],
            "soft_skill_gaps": [s.model_dump() for s in gaps.soft_skill_gaps],
            "transferable_skills": gaps.transferable_skills,
        },
    )

    # ── Step 4: Resources + mentors in parallel ───────────────────────────────
    yield _event("resources_matching", "Matching verified learning resources...", 65)

    resource_task = asyncio.to_thread(
        resource_service.build_resource_plan,
        tech_names,
        soft_names,
        gaps.transferable_skills,
    )
    mentor_task = asyncio.to_thread(mentor_service.match_mentors, tech_names)

    resource_plan, mentors = await asyncio.gather(resource_task, mentor_task)

    yield _event(
        "resources_matched",
        f"Resources found for {len(resource_plan)} skills",
        78,
        data={"resources": [r.model_dump() for r in resource_plan]},
    )

    yield _event(
        "mentors_matched",
        f"{len(mentors)} mentors matched to your skill profile",
        88,
        data={"mentors": [m.model_dump() for m in mentors]},
    )

    # ── Step 5: Build top-3 Pareto priorities ────────────────────────────────
    all_scored: list[ScoredSkill] = gaps.technical_skill_gaps + gaps.soft_skill_gaps
    top_skills = sorted(all_scored, key=lambda s: -s.priority_score)[:3]

    result = AnalysisResult(
        target_role=parsed_jd.role_title,
        company_name=parsed_jd.company_name,
        job_summary=parsed_jd.job_summary,
        top_skills=top_skills,
        skill_gaps=gaps,
        resources=resource_plan,
        mentors=mentors,
    )

    yield _event(
        "complete",
        "Analysis complete!",
        100,
        data=result.model_dump(),
    )
