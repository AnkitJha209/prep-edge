import { client } from "@repo/db/client";
import { Request, Response } from "express";
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import dotenv from 'dotenv'
dotenv.config()

export const createInterview = async (req: Request, res: Response) => {
    try {
        const {applicationId} = req.body
        const candidateId = (req as any).user.id

        if(!applicationId || !candidateId){
            res.status(404).json({
                success: false,
                message: "Candiate Id or Application Id missing"
            })
            return
        }

        const application = await client.application.findFirst({
            where: {id : applicationId}
        })

        if(!application){
            res.status(404).json({
                success: false,
                message: "No application found"
            })
            return
        }

        if(candidateId !== application.candidateId){
            res.status(400).json({
                success: false,
                message: "Candidate Id is not matching with the application"
            })
            return
        }

        const interview = await client.interview.create({
            data: {
                applicationId,
                candidateId,
                sessionId: crypto.randomUUID(),
            }
        })

        const payload = {
            jobId: application.jobId,
            userId: application.candidateId,
            interviewId: interview.id
        }

        const interviewToken = jwt.sign(payload, process.env.INTERVIEW_SECRET as string || "INTERVIEW_SECRET", {expiresIn: '2h'})

        res.status(200).json({
            success: true,
            message: "Interivew created successfully",
            interviewToken,
        })
        return
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
        return 
    }
}