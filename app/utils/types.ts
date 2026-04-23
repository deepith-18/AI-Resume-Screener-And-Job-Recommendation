/**
 * utils/types.ts — FINAL FIXED VERSION
 */

// ─── Resume Types ─────────────────────────────────────────────

export type SkillCategory =
  | 'technical'
  | 'soft'
  | 'language'
  | 'tool'
  | 'framework'
  | 'other';

export type SkillProficiency =
  | 'beginner'
  | 'intermediate'
  | 'advanced'
  | 'expert';

export type ExperienceLevel =
  | 'entry'
  | 'junior'
  | 'mid'
  | 'senior'
  | 'lead'
  | 'executive';

export type AnalysisStatus =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed';

export type JobType =
  | 'full-time'
  | 'part-time'
  | 'contract'
  | 'freelance'
  | 'internship';

export interface Skill {
  name: string;
  category: SkillCategory;
  proficiency: SkillProficiency;
}

export interface Experience {
  company: string;
  role: string;
  duration: string;
  startDate: string;
  endDate: string;
  description: string;
  technologies: string[];
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  graduationYear: string;
  gpa?: string;
}

export interface ParsedResumeData {
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedIn?: string;
  summary?: string;
  totalExperienceYears?: number;
  experienceLevel?: ExperienceLevel;
  skills: Skill[];
  experience: Experience[];
  education: Education[];
  certifications: string[];
  languages: string[];
}

// 🔥 IMPORTANT FIX: support MongoDB _id
export interface ResumeAnalysis {
  _id: string; // ✅ added
  resumeId?: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  analysisStatus: AnalysisStatus;
  analysisError?: string;
  overallScore?: number;
  strengths?: string[];
  improvements?: string[];
  aiSummary?: string;
  parsedData?: ParsedResumeData;
  uploadedAt: string;
  analyzedAt?: string;
}

// ─── Job Types ─────────────────────────────────────────────

export interface SalaryRange {
  min: number;
  max: number;
  currency: string;
}

export interface JobRecommendation {
  title: string;
  company?: string;
  industry?: string;
  salaryRange?: SalaryRange;
  location?: string;
  remote?: boolean;
  relevanceScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  reasoning: string;
  jobType: JobType;
  experienceRequired?: string;
  responsibilities?: string[];
  benefits?: string[];
  applyUrl?: string;
}

export interface JobMatchResult {
  matchId: string;
  resumeId: string;
  candidateName?: string;
  experienceLevel?: ExperienceLevel;
  resumeScore?: number;
  recommendations: JobRecommendation[];
  topIndustries: string[];
  careerTrajectory?: string;
  developmentAreas: string[];
  generatedAt: string;
}

// ─── API Types ─────────────────────────────────────────────

// 🔥 FIXED RESPONSE
export interface UploadResponse {
  _id: string; // ✅ FIXED (was resumeId ❌)
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  error?: string;
  data?: T;
}

// ─── Navigation ─────────────────────────────────────────────

export type RootStackParamList = {
  Splash: undefined;
  Main: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Upload: undefined;
  Profile: undefined;
};

export type HomeStackParamList = {
  HomeScreen: undefined;
  ResumeAnalysis: { resumeId: string };
  JobRecommendations: { resumeId: string };
};

// ─── UI State ─────────────────────────────────────────────

export interface LoadingState {
  isLoading: boolean;
  message?: string;
}

export interface ErrorState {
  hasError: boolean;
  message?: string;
}