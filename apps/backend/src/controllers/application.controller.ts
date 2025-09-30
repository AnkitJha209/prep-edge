import { Request, Response } from "express";
import { analyzeTheApplication } from "../utils/analyzeResume";
import { ingestResume } from "../utils/ingestion";
import { client } from "@repo/db/client";

export const createApplication = async (req: Request, res: Response) => {
    try {
        const {jobId, resumeUrl, fileName} = req.body
        const {id} = (req as any).user
        if(!jobId || !resumeUrl){
            res.status(400).json({
                success: false,
                message: "Missing important details"
            })
        }
        await ingestResume(resumeUrl, fileName)
        const analysis = await analyzeTheApplication(jobId, fileName)
        if(analysis === 'No job found'){
            res.status(404).json({
                success: true,
                message: "No job found"
            })
            return
        }
        if(analysis?.analysis.matchScore < 65){
            res.status(400).json({
                success: false,
                message: "You cannot proceed further please enhance your resume",
                analysis
            })
            return
        }

        const application = await client.application.create({
            data: {
                candidateId: id,
                jobId,
                resumeUrl,
                resumeScore: analysis?.analysis.matchScore,
            }
        })
        res.status(200).json({
            success: true,
            message: "Proceed for the interview",
            analysis,
            application
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}