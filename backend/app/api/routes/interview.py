from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from app.services import mock_interviewer, pdf_parser
from app.models.schemas import (
    InterviewStartResponse,
    InterviewRespondResponse,
    InterviewFeedback,
)

router = APIRouter()


@router.post("/interview/start", response_model=InterviewStartResponse)
async def start(
    resume: UploadFile = File(...),
    jd_text: str = Form(...),
    target_role: str = Form(...),
):
    file_bytes = await resume.read()
    resume_text = pdf_parser.extract_text(file_bytes)
    if not resume_text.strip():
        raise HTTPException(status_code=400, detail="Could not extract text from PDF")

    session_id, first_question, audio_b64 = await mock_interviewer.start_session(
        resume_text=resume_text,
        jd_text=jd_text,
        target_role=target_role,
    )

    return InterviewStartResponse(
        session_id=session_id,
        first_question=first_question,
        audio_b64=audio_b64,
        question_number=1,
        total_questions=5,
    )


@router.post("/interview/respond", response_model=InterviewRespondResponse)
async def respond(
    session_id: str = Form(...),
    audio: UploadFile = File(...),
):
    audio_bytes = await audio.read()
    if not audio_bytes:
        raise HTTPException(status_code=400, detail="Empty audio file")

    try:
        transcription, next_q, audio_b64, q_num, complete = await mock_interviewer.process_response(
            session_id=session_id,
            audio_bytes=audio_bytes,
            filename=audio.filename or "response.webm",
        )
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

    return InterviewRespondResponse(
        session_id=session_id,
        transcription=transcription,
        next_question=next_q,
        audio_b64=audio_b64,
        question_number=q_num,
        is_complete=complete,
    )


@router.post("/interview/finish", response_model=InterviewFeedback)
async def finish(session_id: str = Form(...)):
    try:
        return await mock_interviewer.finish_session(session_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
