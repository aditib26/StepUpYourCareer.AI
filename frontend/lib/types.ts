export interface ScoredSkill {
  skill: string;
  priority_score: number;
  reason: string;
}

export interface SkillGapResult {
  technical_skill_gaps: ScoredSkill[];
  soft_skill_gaps: ScoredSkill[];
  transferable_skills: string[];
}

export interface Resource {
  title: string;
  url: string;
  type: "course" | "book" | "video" | "article";
  platform: string;
  description?: string;
}

export interface SkillResources {
  skill: string;
  resources: Resource[];
}

export interface Mentor {
  mentor_id: string;
  name: string;
  bio: string;
  linkedin_url: string;
  photo_url?: string;
  technical_skills: string[];
  role: string;
  match_score?: number;
}

export interface AnalysisResult {
  target_role: string;
  company_name: string;
  job_summary: string;
  top_skills: ScoredSkill[];
  skill_gaps: SkillGapResult;
  resources: SkillResources[];
  mentors: Mentor[];
}

export type PipelineStep =
  | "idle"
  | "pdf_parsing"
  | "pdf_parsed"
  | "jd_parsing"
  | "jd_parsed"
  | "anonymizing"
  | "gap_analyzing"
  | "gap_analyzed"
  | "resources_matching"
  | "resources_matched"
  | "mentors_matched"
  | "complete"
  | "error";

export interface PipelineEvent {
  step: PipelineStep;
  message: string;
  progress: number;
  data?: Record<string, unknown>;
}

// ── Sprint 1: AI Document Tools ──────────────────────────────────────────────

export interface CoverLetterResult {
  subject_line: string;
  greeting: string;
  opening_paragraph: string;
  body_paragraphs: string[];
  closing_paragraph: string;
  signature: string;
  full_text: string;
  tone: string;
}

export interface RewrittenBullet {
  original: string;
  rewritten: string;
  reasoning: string;
  keywords_added: string[];
}

export interface ResumeRewriteResult {
  bullets: RewrittenBullet[];
  overall_advice: string;
  keywords_to_emphasize: string[];
  sections_to_add: string[];
}

export interface ColdEmailResult {
  subject_line: string;
  email_body: string;
  follow_up_text: string;
  personalization_notes: string[];
}

export interface LinkedInOptimization {
  headline_options: string[];
  about_section: string;
  skills_to_add: string[];
  experience_bullets: RewrittenBullet[];
  profile_strength_tips: string[];
}

// ── Sprint 2: Mock Interviewer ──────────────────────────────────────────────

export interface InterviewStartResponse {
  session_id: string;
  first_question: string;
  audio_b64: string;
  question_number: number;
  total_questions: number;
}

export interface InterviewRespondResponse {
  session_id: string;
  transcription: string;
  next_question?: string;
  audio_b64?: string;
  question_number: number;
  is_complete: boolean;
}

export interface PerQuestionFeedback {
  question: string;
  answer: string;
  score: number;
  feedback: string;
}

export interface InterviewFeedback {
  overall_score: number;
  communication_score: number;
  technical_score: number;
  structure_score: number;
  strengths: string[];
  improvements: string[];
  per_question_feedback: PerQuestionFeedback[];
  summary: string;
}
