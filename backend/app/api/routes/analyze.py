from fastapi import APIRouter, UploadFile, File, Form
from fastapi.responses import StreamingResponse
from app.services.pipeline import run_analysis

router = APIRouter()


@router.post("/analyze")
async def analyze(
    resume: UploadFile = File(...),
    jd_url: str = Form(default=""),
    jd_text: str = Form(default=""),
    user_name: str = Form(default="User"),
    user_email: str = Form(default=""),
):
    file_bytes = await resume.read()

    async def event_stream():
        async for chunk in run_analysis(
            file_bytes=file_bytes,
            jd_url=jd_url or None,
            jd_text=jd_text or None,
        ):
            yield chunk

    return StreamingResponse(
        event_stream(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        },
    )
