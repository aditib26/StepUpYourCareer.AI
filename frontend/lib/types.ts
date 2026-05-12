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
