import { Request, Response } from "express";
import { analyzeTheApplication } from "../utils/analyzeResume";
import { ingestResume } from "../utils/ingestion";

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
    } catch (error) {
        
    }
}