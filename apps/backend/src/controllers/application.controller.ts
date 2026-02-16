import { Request, Response } from "express";
import { client } from "@repo/db/client";

export const createApplication = async (req: Request, res: Response) => {
    try {
        const {
            jobId,
            fileUrl,
            resumeScore,
            strengths,
            missingSkills,
            experienceGaps,
            improvementSuggestion,
            overallAssessment,
            scoreJustification,
        } = req.body;
        const { id } = (req as any).user;
        if (!jobId || !fileUrl) {
            res.status(400).json({
                success: false,
                message: "Missing important details",
            });
            return;
        }

        const job = await client.job.findUnique({
            where: { id: jobId },
        });

        if (!job) {
            res.status(404).json({
                success: false,
                message: "Job not found",
            });
            return
        }

        const existingApplication = await client.application.findFirst({
            where: {
                candidateId: id,
                jobId,
            },
        });

        if (existingApplication) {
            res.status(400).json({
                success: false,
                message: "You have already applied to this job",
            });
            return
        }


        // change this so no one can bypass this from frontend 
        // here the issue is the user can modify the request before sending it to the backend which can cause trouble
        if (resumeScore < 65) {
            res.status(403).json({
                success: false,
                message: "Cannot apply due to low score of resume",
            });
            return;
        }

        const application = await client.application.create({
            data: {
                candidateId: id,
                jobId,
                resumeUrl: fileUrl,
                resumeScore,
                strengths,
                missingSkills,
                experienceGaps,
                improvementSuggestion,
                overallAssessment,
                scoreJustification,
            },
        });

        res.status(200).json({
            success: true,
            message: "Proceed for the interview",
            application,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
