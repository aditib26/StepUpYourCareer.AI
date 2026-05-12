import httpx
from openai import AsyncOpenAI
from app.models.schemas import ParsedJD
from app.core.config import settings

_client = AsyncOpenAI(api_key=settings.openai_api_key)


async def fetch_jd_from_url(url: str) -> str:
    """Use Jina Reader to scrape any job posting URL into clean text."""
    jina_url = f"https://r.jina.ai/{url}"
    async with httpx.AsyncClient(timeout=20) as client:
        resp = await client.get(jina_url, headers={"Accept": "text/plain"})
        resp.raise_for_status()
        return resp.text


async def parse_jd(jd_text: str) -> ParsedJD:
    """Extract structured fields from raw job description text using GPT-4o Structured Outputs."""
    response = await _client.beta.chat.completions.parse(
        model=settings.chat_model,
        temperature=0,
        messages=[
            {
                "role": "system",
                "content": (
                    "You are an expert at parsing job descriptions. "
                    "Extract all required fields accurately. "
                    "For required_skills, include ONLY skills explicitly stated as required. "
                    "For nice_to_have_skills, include skills listed as preferred or bonus. "
                    "experience_years should be the minimum years mentioned; default to 0 if not stated."
                ),
            },
            {"role": "user", "content": f"Parse this job description:\n\n{jd_text[:6000]}"},
        ],
        response_format=ParsedJD,
    )
    return response.choices[0].message.parsed
