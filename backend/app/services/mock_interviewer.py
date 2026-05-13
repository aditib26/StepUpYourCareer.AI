"""
AI Mock Interviewer — voice-based interview simulator.
Pipeline: Whisper (STT) → GPT-4o (conversation) → OpenAI TTS (voice synthesis).
"""
import io
import uuid
import base64
from typing import Optional
from openai import AsyncOpenAI
from app.models.schemas import InterviewFeedback
from app.core.config import settings


# In-memory session store. Production: replace with Redis or Supabase.
_sessions: dict[str, dict] = {}


def _get_client() -> AsyncOpenAI:
    return AsyncOpenAI(api_key=settings.openai_api_key)


# ── Voice synthesis ──────────────────────────────────────────────────────────

async def synthesize_voice(text: str) -> str:
    """Generate audio for the given text and return base64-encoded MP3."""
    response = await _get_client().audio.speech.create(
        model="tts-1",
        voice="nova",
        input=text,
        response_format="mp3",
    )
    audio_bytes = response.content
    return base64.b64encode(audio_bytes).decode("utf-8")


# ── Speech to text ───────────────────────────────────────────────────────────

async def transcribe_audio(audio_bytes: bytes, filename: str = "response.webm") -> str:
    """Transcribe audio using Whisper."""
    audio_file = io.BytesIO(audio_bytes)
    audio_file.name = filename

    response = await _get_client().audio.transcriptions.create(
        model="whisper-1",
        file=audio_file,
    )
    return response.text.strip()


# ── Interview session lifecycle ──────────────────────────────────────────────

async def start_session(
    resume_text: str,
    jd_text: str,
    target_role: str,
    total_questions: int = 5,
) -> tuple[str, str, str]:
    """Initialize a new interview session. Returns (session_id, first_question, audio_b64)."""
    session_id = str(uuid.uuid4())

    system_prompt = (
        f"You are an experienced interviewer conducting a real interview for the role of {target_role}. "
        "You have read the candidate's resume and the job description. "
        "Your goal: ask incisive, role-specific questions — mix of behavioral and technical. "
        "Vary question types: 1 background/intro, 1-2 technical (specific to the JD's required skills), "
        "1-2 behavioral (STAR method), and 1 closing question. "
        "Keep each question concise (under 2 sentences). "
        "After receiving an answer, do NOT give feedback in the moment — only ask the next question. "
        "Final feedback will be generated at the end of the interview."
    )

    context_message = (
        f"INTERVIEW CONTEXT:\n"
        f"Role: {target_role}\n\n"
        f"JOB DESCRIPTION:\n{jd_text[:3000]}\n\n"
        f"CANDIDATE RESUME:\n{resume_text[:3000]}\n\n"
        f"Ask your first question now. Keep it warm and inviting — start with a 'walk me through your background' style opener."
    )

    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": context_message},
    ]

    response = await _get_client().chat.completions.create(
        model=settings.chat_model,
        temperature=0.7,
        messages=messages,
    )
    first_question = response.choices[0].message.content.strip()

    # Store full conversation history for later
    messages.append({"role": "assistant", "content": first_question})

    _sessions[session_id] = {
        "messages": messages,
        "target_role": target_role,
        "resume_text": resume_text,
        "jd_text": jd_text,
        "question_count": 1,
        "total_questions": total_questions,
        "transcript": [
            {"role": "interviewer", "text": first_question},
        ],
    }

    audio_b64 = await synthesize_voice(first_question)
    return session_id, first_question, audio_b64


async def process_response(
    session_id: str,
    audio_bytes: bytes,
    filename: str = "response.webm",
) -> tuple[str, Optional[str], Optional[str], int, bool]:
    """
    Process candidate's audio response, return:
    (transcription, next_question_text_or_None, next_question_audio_b64_or_None, question_number, is_complete)
    """
    if session_id not in _sessions:
        raise ValueError("Session not found")

    session = _sessions[session_id]

    # 1. Transcribe
    transcription = await transcribe_audio(audio_bytes, filename)
    session["transcript"].append({"role": "candidate", "text": transcription})
    session["messages"].append({"role": "user", "content": transcription})

    # 2. Check if interview should end
    if session["question_count"] >= session["total_questions"]:
        return transcription, None, None, session["question_count"], True

    # 3. Generate next question
    response = await _get_client().chat.completions.create(
        model=settings.chat_model,
        temperature=0.7,
        messages=session["messages"] + [
            {
                "role": "user",
                "content": (
                    f"That was answer #{session['question_count']}. "
                    f"Now ask the next question (this will be question #{session['question_count'] + 1} "
                    f"of {session['total_questions']}). "
                    "Do not comment on the previous answer — just ask the next question."
                ),
            }
        ],
    )
    next_question = response.choices[0].message.content.strip()

    session["messages"].append({"role": "assistant", "content": next_question})
    session["transcript"].append({"role": "interviewer", "text": next_question})
    session["question_count"] += 1

    # 4. Synthesize audio
    audio_b64 = await synthesize_voice(next_question)

    return transcription, next_question, audio_b64, session["question_count"], False


async def finish_session(session_id: str) -> InterviewFeedback:
    """Generate final feedback report for the interview."""
    if session_id not in _sessions:
        raise ValueError("Session not found")

    session = _sessions[session_id]
    transcript = session["transcript"]

    transcript_text = "\n\n".join(
        f"{t['role'].upper()}: {t['text']}" for t in transcript
    )

    response = await _get_client().beta.chat.completions.parse(
        model=settings.chat_model,
        temperature=0.3,
        messages=[
            {
                "role": "system",
                "content": (
                    "You are a senior interviewer providing honest, specific feedback on a mock interview. "
                    "Score each dimension 0-100. Be tough but fair — most candidates score 60-75. "
                    "communication_score: clarity, articulation, pacing. "
                    "technical_score: accuracy and depth of technical answers. "
                    "structure_score: did they use STAR method, organize thoughts logically. "
                    "For per_question_feedback, include one entry per question-answer pair with "
                    "{question, answer, score (0-100), feedback (2-3 sentences)}. "
                    "Be specific — quote phrases from their actual answers."
                ),
            },
            {
                "role": "user",
                "content": (
                    f"ROLE: {session['target_role']}\n\n"
                    f"INTERVIEW TRANSCRIPT:\n{transcript_text}\n\n"
                    "Generate the feedback report."
                ),
            },
        ],
        response_format=InterviewFeedback,
    )

    feedback = response.choices[0].message.parsed

    # Clean up session
    del _sessions[session_id]
    return feedback
