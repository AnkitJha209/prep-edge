import { client } from "@repo/db/client";
import { analyzeInterview } from "./aiEvaluation";

export const createReport = async (
    interviewId: string,
    jobData: any,
    userData: any,
) => {
    try {
        const interview = await client.interview.update({
            where: { id: interviewId },
            data: {
                status: "COMPLETED",
                completedAt: new Date(),
            },
            include: {
                application: true,
                questions: true,
            },
        });

        if (!interview) {
            throw new Error("No interview found");
        }

        const report = await analyzeInterview(interview, jobData, userData);

        const savedReport = await client.interviewReport.upsert({
            where: { interviewId },
            create: {
                interviewId,
                summary: report.summary,
                strengths: report.strengths,
                weaknesses: report.weaknesses,
                overallScore: report.overallScore,
                aiRecommendation: report.aiRecommendation,
            },
            update: {
                summary: report.summary,
                strengths: report.strengths,
                weaknesses: report.weaknesses,
                overallScore: report.overallScore,
                aiRecommendation: report.aiRecommendation,
            },
        });

        return savedReport;
    } catch (error) {
        console.log(error);
        throw new Error("Cannot Create the Report for some reason try again");
    }
};
