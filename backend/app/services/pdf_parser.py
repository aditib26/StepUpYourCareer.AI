import fitz  # PyMuPDF


def extract_text(file_bytes: bytes) -> str:
    """Extract clean text from a PDF byte payload using PyMuPDF."""
    doc = fitz.open(stream=file_bytes, filetype="pdf")
    pages = []
    for page in doc:
        text = page.get_text("text")
        if text.strip():
            pages.append(text.strip())
    doc.close()
    return "\n\n".join(pages)


def word_count(text: str) -> int:
    return len(text.split())
