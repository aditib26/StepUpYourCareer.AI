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
