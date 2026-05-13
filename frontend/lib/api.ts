import type {
  CoverLetterResult,
  ResumeRewriteResult,
  ColdEmailResult,
  LinkedInOptimization,
  InterviewStartResponse,
  InterviewRespondResponse,
  InterviewFeedback,
} from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface AnalyzeFormData {
  resume: File;
  jdUrl?: string;
  jdText?: string;
  userName?: string;
  userEmail?: string;
}

/**
 * Submits a resume + JD to the backend and returns a ReadableStream of SSE events.
 * Each chunk is a JSON string matching PipelineEvent.
 */
export async function streamAnalysis(data: AnalyzeFormData): Promise<ReadableStream<string>> {
  const form = new FormData();
  form.append("resume", data.resume);
  form.append("jd_url", data.jdUrl ?? "");
  form.append("jd_text", data.jdText ?? "");
  form.append("user_name", data.userName ?? "User");
  form.append("user_email", data.userEmail ?? "");

  const response = await fetch(`${API_BASE}/api/analyze`, {
    method: "POST",
    body: form,
  });

  if (!response.ok || !response.body) {
    throw new Error(`API error: ${response.status}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  return new ReadableStream<string>({
    async pull(controller) {
      const { done, value } = await reader.read();
      if (done) {
        controller.close();
        return;
      }
      const text = decoder.decode(value, { stream: true });
      // SSE lines start with "data: "
      const lines = text.split("\n");
      for (const line of lines) {
        if (line.startsWith("data: ")) {
          controller.enqueue(line.slice(6).trim());
        }
      }
    },
  });
}

// ── Sprint 1: AI Document Tools API ──────────────────────────────────────────

async function postFormData<T>(path: string, form: FormData): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, { method: "POST", body: form });
  if (!res.ok) {
    const detail = await res.text();
    throw new Error(detail || `Request failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export async function generateCoverLetter(data: {
  resume: File;
  jdText: string;
  userName: string;
  companyName?: string;
  tone?: string;
}): Promise<CoverLetterResult> {
  const form = new FormData();
  form.append("resume", data.resume);
  form.append("jd_text", data.jdText);
  form.append("user_name", data.userName);
  form.append("company_name", data.companyName ?? "");
  form.append("tone", data.tone ?? "professional");
  return postFormData<CoverLetterResult>("/api/tools/cover-letter", form);
}

export async function rewriteResume(data: {
  resume: File;
  jdText: string;
  targetRole?: string;
}): Promise<ResumeRewriteResult> {
  const form = new FormData();
  form.append("resume", data.resume);
  form.append("jd_text", data.jdText);
  form.append("target_role", data.targetRole ?? "");
  return postFormData<ResumeRewriteResult>("/api/tools/resume-rewriter", form);
}

export async function generateColdEmail(data: {
  resume: File;
  targetRole: string;
  targetCompany: string;
  targetPersonName: string;
  targetPersonRole: string;
  userName: string;
  purpose?: string;
}): Promise<ColdEmailResult> {
  const form = new FormData();
  form.append("resume", data.resume);
  form.append("target_role", data.targetRole);
  form.append("target_company", data.targetCompany);
  form.append("target_person_name", data.targetPersonName);
  form.append("target_person_role", data.targetPersonRole);
  form.append("user_name", data.userName);
  form.append("purpose", data.purpose ?? "informational_interview");
  return postFormData<ColdEmailResult>("/api/tools/cold-email", form);
}

export async function optimizeLinkedIn(data: {
  resume: File;
  targetRole: string;
  currentHeadline?: string;
  currentAbout?: string;
}): Promise<LinkedInOptimization> {
  const form = new FormData();
  form.append("resume", data.resume);
  form.append("target_role", data.targetRole);
  form.append("current_headline", data.currentHeadline ?? "");
  form.append("current_about", data.currentAbout ?? "");
  return postFormData<LinkedInOptimization>("/api/tools/linkedin-optimizer", form);
}

// ── Sprint 2: Mock Interviewer API ───────────────────────────────────────────

export async function startInterview(data: {
  resume: File;
  jdText: string;
  targetRole: string;
}): Promise<InterviewStartResponse> {
  const form = new FormData();
  form.append("resume", data.resume);
  form.append("jd_text", data.jdText);
  form.append("target_role", data.targetRole);
  return postFormData<InterviewStartResponse>("/api/interview/start", form);
}

export async function respondInterview(data: {
  sessionId: string;
  audio: Blob;
}): Promise<InterviewRespondResponse> {
  const form = new FormData();
  form.append("session_id", data.sessionId);
  form.append("audio", data.audio, "response.webm");
  return postFormData<InterviewRespondResponse>("/api/interview/respond", form);
}

export async function finishInterview(sessionId: string): Promise<InterviewFeedback> {
  const form = new FormData();
  form.append("session_id", sessionId);
  return postFormData<InterviewFeedback>("/api/interview/finish", form);
}
