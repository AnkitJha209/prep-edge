import { Request, Response } from "express";
import { analyzeTheApplication } from "../utils/analyzeResume";
import { pdfUpload } from "../utils/uploader";

export const resumeUpload = async (req:Request, res:Response) => {
    try {
        const {jobId} = req.body
        const file = (req as any).file

        if (!file) {
            res.status(400).json({
                success: false,
                message: "No pdf file uploaded",
            });
            return;
        }

        if (file.mimetype !== "application/pdf") {
            res.status(400).json({
                success: false,
                message: "Only PDF files are allowed",
            });
            return
        }


        const pdfBuffer: Buffer = file.buffer;

        const fileUrl = await pdfUpload(pdfBuffer)

        // so here we can analyze the resume and can give score to the resume as well 
        const result = analyzeTheApplication(jobId, fileUrl)

        res.status(200).json({
            success: true,
            message: "Resume Uploaded successfully",
            ai_analysis: {
                resumeUrl: fileUrl,
                result
            }
        })

        // we can just make two api request from the frontend at the same time firstly we will take resume and analyze and give him the score if the score is less than 65% we will not create an application for the user he can try again
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}