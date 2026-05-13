from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from app.services import document_generator, pdf_parser
from app.models.schemas import (
    CoverLetterResult,
    ResumeRewriteResult,
    ColdEmailResult,
    LinkedInOptimization,
)

router = APIRouter()


async def _extract_resume_text(resume: UploadFile) -> str:
    file_bytes = await resume.read()
    text = pdf_parser.extract_text(file_bytes)
    if not text.strip():
        raise HTTPException(status_code=400, detail="Could not extract text from PDF")
    return text


@router.post("/tools/cover-letter", response_model=CoverLetterResult)
async def cover_letter(
    resume: UploadFile = File(...),
    jd_text: str = Form(...),
    user_name: str = Form(...),
    company_name: str = Form(default=""),
    tone: str = Form(default="professional"),
):
    resume_text = await _extract_resume_text(resume)
    return await document_generator.generate_cover_letter(
        resume_text=resume_text,
        jd_text=jd_text,
        user_name=user_name,
        company_name=company_name,
        tone=tone,
    )


@router.post("/tools/resume-rewriter", response_model=ResumeRewriteResult)
async def resume_rewriter(
    resume: UploadFile = File(...),
    jd_text: str = Form(...),
    target_role: str = Form(default=""),
):
    resume_text = await _extract_resume_text(resume)
    return await document_generator.rewrite_resume_bullets(
        resume_text=resume_text,
        jd_text=jd_text,
        target_role=target_role,
    )


@router.post("/tools/cold-email", response_model=ColdEmailResult)
async def cold_email(
    resume: UploadFile = File(...),
    target_role: str = Form(...),
    target_company: str = Form(...),
    target_person_name: str = Form(...),
    target_person_role: str = Form(...),
    user_name: str = Form(...),
    purpose: str = Form(default="informational_interview"),
):
    resume_text = await _extract_resume_text(resume)
    return await document_generator.generate_cold_email(
        resume_text=resume_text,
        target_role=target_role,
        target_company=target_company,
        target_person_name=target_person_name,
        target_person_role=target_person_role,
        user_name=user_name,
        purpose=purpose,
    )


@router.post("/tools/linkedin-optimizer", response_model=LinkedInOptimization)
async def linkedin_optimizer(
    resume: UploadFile = File(...),
    target_role: str = Form(...),
    current_headline: str = Form(default=""),
    current_about: str = Form(default=""),
):
    resume_text = await _extract_resume_text(resume)
    return await document_generator.optimize_linkedin(
        resume_text=resume_text,
        target_role=target_role,
        current_headline=current_headline,
        current_about=current_about,
    )
