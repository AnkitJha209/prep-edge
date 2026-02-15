import { Request, Response } from "express";
import { client } from "@repo/db/client";

export const createApplication = async (req: Request, res: Response) => {
    try {
        const {jobId, fileUrl, resumeScore} = req.body
        const {id} = (req as any).user
        if(!jobId || !fileUrl){
            res.status(400).json({
                success: false,
                message: "Missing important details"
            })
        }

        const application = await client.application.create({
            data: {
                candidateId: id,
                jobId,
                resumeUrl:fileUrl,
                resumeScore
            }
        })
        res.status(200).json({
            success: true,
            message: "Proceed for the interview",
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


