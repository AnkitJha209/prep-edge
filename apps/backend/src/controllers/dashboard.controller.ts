import { Request, Response } from "express";
import { client } from "@repo/db/client";

export const getCandidateDashboard = async (req: Request, res: Response) => {
    try {
        const { id, role } = (req as any).user;

        if (role !== "CANDIDATE") {
            return res.status(403).json({
                success: false,
                message: "Access denied. Candidate only.",
            });
        }

        // Total applications
        const totalApplications = await client.application.count({
            where: { candidateId: id },
        });

        // Total interviews
        const totalInterviews = await client.interview.count({
            where: { candidateId: id },
        });

        // Average resume score
        const avgScore = await client.application.aggregate({
            where: { candidateId: id },
            _avg: { resumeScore: true },
        });

        // Recent applications
        const recentApplications = await client.application.findMany({
            where: { candidateId: id },
            include: {
                job: {
                    select: {
                        title: true,
                        location: true,
                        type: true,
                    },
                },
            },
            take: 5,
        });

        return res.status(200).json({
            success: true,
            data: {
                totalApplications,
                totalInterviews,
                averageResumeScore: avgScore._avg.resumeScore || 0,
                recentApplications,
            },
        });
    } catch (error) {
        console.error("Candidate Dashboard Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const getRecruiterDashboard = async (req: Request, res: Response) => {
    try {
        const { id, role } = (req as any).user;

        if (role !== "RECRUITER") {
            return res.status(403).json({
                success: false,
                message: "Access denied. Recruiter only.",
            });
        }

        // Total jobs posted
        const totalJobs = await client.job.count({
            where: { recruiterId: id },
        });

        // Active jobs
        const activeJobs = await client.job.count({
            where: {
                recruiterId: id,
                status: "ACTIVE",
            },
        });

        // Applications received on recruiter's jobs
        const totalApplications = await client.application.count({
            where: {
                job: {
                    recruiterId: id,
                },
            },
        });

        // Interviews created for recruiter's jobs
        const totalInterviews = await client.interview.count({
            where: {
                application: {
                    job: {
                        recruiterId: id,
                    },
                },
            },
        });

        // Top candidates (highest resume score)
        const topCandidates = await client.application.findMany({
            where: {
                job: { recruiterId: id },
            },
            orderBy: {
                resumeScore: "desc",
            },
            include: {
                candidate: {
                    select: {
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
                job: {
                    select: {
                        title: true,
                    },
                },
            },
            take: 5,
        });

        // Interview reports for candidates who completed interview rounds on recruiter's jobs
        const interviewReports = await client.interviewReport.findMany({
            where: {
                interview: {
                    application: {
                        job: {
                            recruiterId: id,
                        },
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
            include: {
                interview: {
                    select: {
                        candidate: {
                            select: {
                                firstName: true,
                                lastName: true,
                                email: true,
                            },
                        },
                        application: {
                            select: {
                                job: {
                                    select: {
                                        title: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
            take: 50,
        });

        // All interview attempts on recruiter's jobs (report can be pending)
        const interviewedCandidates = await client.interview.findMany({
            where: {
                application: {
                    job: {
                        recruiterId: id,
                    },
                },
                OR: [
                    { startedAt: { not: null } },
                    { completedAt: { not: null } },
                    { status: "IN_PROGRESS" },
                    { status: "COMPLETED" },
                    { status: "REVIEWED" },
                    { status: "ACCEPTED" },
                    { status: "REJECTED" },
                    { status: "CANCELLED" },
                ],
            },
            orderBy: {
                updatedAt: "desc",
            },
            include: {
                report: {
                    select: {
                        id: true,
                        overallScore: true,
                        createdAt: true,
                    },
                },
                candidate: {
                    select: {
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
                application: {
                    select: {
                        job: {
                            select: {
                                title: true,
                            },
                        },
                    },
                },
            },
            take: 100,
        });

        return res.status(200).json({
            success: true,
            data: {
                totalJobs,
                activeJobs,
                totalApplications,
                totalInterviews,
                topCandidates,
                interviewReports,
                interviewedCandidates,
            },
        });
    } catch (error) {
        console.error("Recruiter Dashboard Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const getAdminDashboard = async (req: Request, res: Response) => {
    try {
        const { role } = (req as any).user;

        if (role !== "ADMIN") {
            return res.status(403).json({
                success: false,
                message: "Access denied. Admin only.",
            });
        }

        const totalUsers = await client.user.count();

        const totalCandidates = await client.user.count({
            where: { role: "CANDIDATE" },
        });

        const totalRecruiters = await client.user.count({
            where: { role: "RECRUITER" },
        });

        const totalJobs = await client.job.count();

        const totalApplications = await client.application.count();

        const totalInterviews = await client.interview.count();

        // Recent users
        const recentUsers = await client.user.findMany({
            orderBy: { createdAt: "desc" },
            take: 5,
            select: {
                id: true,
                email: true,
                role: true,
                createdAt: true,
            },
        });

        return res.status(200).json({
            success: true,
            data: {
                totalUsers,
                totalCandidates,
                totalRecruiters,
                totalJobs,
                totalApplications,
                totalInterviews,
                recentUsers,
            },
        });
    } catch (error) {
        console.error("Admin Dashboard Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
