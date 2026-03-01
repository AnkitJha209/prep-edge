// ==================== ENUMS ====================
export type UserRole = "CANDIDATE" | "RECRUITER" | "ADMIN";
export type JobType =
    | "FULL_TIME"
    | "PART_TIME"
    | "CONTRACT"
    | "INTERNSHIP"
    | "FREELANCE";
export type JobStatus = "ACTIVE" | "INACTIVE" | "CLOSED" | "DRAFT";
export type ApplicationStatus =
    | "PENDING"
    | "REVIEWING"
    | "INTERVIEW_SCHEDULED"
    | "INTERVIEW_COMPLETED"
    | "ACCEPTED"
    | "REJECTED"
    | "WITHDRAWN";
export type InterviewStatus =
    | "SCHEDULED"
    | "IN_PROGRESS"
    | "COMPLETED"
    | "REVIEWED"
    | "ACCEPTED"
    | "REJECTED"
    | "CANCELLED";
export type QuestionType =
    | "TECHNICAL"
    | "BEHAVIORAL"
    | "PROBLEM_SOLVING"
    | "CULTURE_FIT"
    | "GENERAL";

// ==================== MODELS ====================
export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    passwordHash?: string;
    createdAt: string;
    updatedAt: string;
}

export interface Job {
    id: string;
    title: string;
    description: string;
    requirements: string[];
    salary?: string | null;
    location?: string | null;
    type: JobType;
    status: JobStatus;
    recruiterId: string;
    recruiter?: User;
    createdAt: string;
    updatedAt: string;
}

export interface Application {
    id: string;
    candidateId: string;
    jobId: string;
    resumeUrl: string;
    resumeScore?: number | null;
    status: ApplicationStatus;
    coverLetter?: string | null;
    scoreJustification?: string | null;
    strengths: string[];
    missingSkills?: { critical: string[]; minor: string[] } | null;
    experienceGaps: string[];
    improvementSuggestion: string[];
    overallAssessment?: string | null;
    appliedAt: string;
    updatedAt: string;
    job?: Job;
    candidate?: User;
    interview?: Interview | null;
}

export interface Interview {
    id: string;
    applicationId: string;
    candidateId: string;
    sessionId: string;
    status: InterviewStatus;
    scheduledAt?: string | null;
    startedAt?: string | null;
    completedAt?: string | null;
    createdAt: string;
    updatedAt: string;
    application?: Application;
    candidate?: User;
    questions?: InterviewQuestion[];
    report?: InterviewReport | null;
}

export interface InterviewQuestion {
    id: string;
    interviewId: string;
    questionText: string;
    questionType: QuestionType;
    answerText?: string | null;
    aiEvaluation?: Record<string, unknown> | null;
    orderIndex: number;
    createdAt: string;
}

export interface InterviewReport {
    id: string;
    interviewId: string;
    summary: string;
    strengths?: string | null;
    weaknesses?: string | null;
    overallScore?: number | null;
    aiRecommendation?: string | null;
    createdAt: string;
    interview?: Interview;
}

// ==================== API RESPONSE TYPES ====================
export interface ApiResponse<T = unknown> {
    success: boolean;
    message: string;
    data?: T;
    [key: string]: unknown;
}

export interface AuthResponse {
    success: boolean;
    message: string;
    token?: string;
    user?: User;
}

export interface ResumeAnalysis {
    resumeScore: number;
    scoreJustification: string;
    strengths: string[];
    missingSkills: { critical: string[]; minor: string[] };
    experienceGaps: string[];
    improvementSuggestions: string[];
    overallAssessment: string;
}

export interface ResumeUploadResponse {
    success: boolean;
    message: string;
    ai_analysis: {
        resumeUrl: string;
        result: {
            success: boolean;
            jobId: string;
            analysis: ResumeAnalysis;
        };
    };
}

export interface CandidateDashboard {
    totalApplications: number;
    totalInterviews: number;
    averageResumeScore: number;
    recentApplications: (Application & {
        job: { title: string; location: string; type: string };
    })[];
}

export interface RecruiterDashboard {
    totalJobs: number;
    activeJobs: number;
    totalApplications: number;
    totalInterviews: number;
    topCandidates: (Application & {
        candidate: { firstName: string; lastName: string; email: string };
        job: { title: string };
    })[];
}

export interface AdminDashboard {
    totalUsers: number;
    totalCandidates: number;
    totalRecruiters: number;
    totalJobs: number;
    totalApplications: number;
    totalInterviews: number;
    recentUsers: {
        id: string;
        email: string;
        role: UserRole;
        createdAt: string;
    }[];
}

// ==================== WS MESSAGE TYPES ====================
export type WSClientMessage =
    | { type: "Start_Interview" }
    | { type: "ANSWER_FROM_USER"; questionId: string }
    | { type: "END_INTERVIEW" };

export type WSServerMessage =
    | {
          type: "AI_MESSAGE_START";
          questionId: string;
          text: string;
          audioIncoming: boolean;
      }
    | { type: "AI_MESSAGE_END"; questionId: string }
    | { type: "INTERVIEW_ENDED"; message: string }
    | { type: "ERROR"; message: string };
