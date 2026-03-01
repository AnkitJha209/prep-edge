import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/v1";
const WS_BASE_URL = "ws://localhost:8080/api/v1/interview";

export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
});

// Attach token from localStorage to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Redirect on auth failure
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 || error.response?.status === 404) {
            const msg = error.response?.data?.message || "";
            if (
                msg.includes("Token not found") ||
                msg.includes("Unauthorized")
            ) {
                localStorage.removeItem("token");
                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    },
);

// ==================== AUTH ====================
export const authApi = {
    signUp: (data: {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        role?: string;
    }) => api.post("/auth/sign-up", data),
    signIn: (data: { email: string; password: string }) =>
        api.post("/auth/sign-in", data),
};

// ==================== JOBS ====================
export const jobApi = {
    getAll: () => api.get("/get-all-job"),
    getMyJobs: () => api.get("/get-all-my-job"),
    create: (data: {
        title: string;
        description: string;
        requirements: string[];
        location?: string;
        salary?: string;
        type: string;
    }) => api.post("/create-a-job", data),
    updateStatus: (jobId: string, status: string) =>
        api.put(`/update-a-job?jobId=${jobId}`, { status }),
    delete: (jobId: string) => api.delete(`/delete-a-job?jobId=${jobId}`),
};

// ==================== RESUME ====================
export const resumeApi = {
    analyze: (jobId: string, file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("jobId", jobId);
        return api.post("/resume-analysis", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
    },
};

// ==================== APPLICATION ====================
export const applicationApi = {
    create: (data: {
        jobId: string;
        fileUrl: string;
        resumeScore: number;
        strengths: string[];
        missingSkills: { critical: string[]; minor: string[] };
        experienceGaps: string[];
        improvementSuggestion: string[];
        overallAssessment: string;
        scoreJustification: string;
    }) => api.post("/create-application", data),
};

// ==================== INTERVIEW ====================
export const interviewApi = {
    create: (applicationId: string) =>
        api.post("/create-interview", { applicationId }),
    getReport: (reportId: string) =>
        api.get(`/get-interview-report/${reportId}`),
};

// ==================== DASHBOARD ====================
export const dashboardApi = {
    candidate: () => api.get("/dashboard/candidate"),
    recruiter: () => api.get("/dashboard/recruiter"),
    admin: () => api.get("/dashboard/admin"),
};

// ==================== WEBSOCKET ====================
export const createInterviewWS = (token: string): WebSocket => {
    return new WebSocket(`${WS_BASE_URL}?token=${token}`);
};
