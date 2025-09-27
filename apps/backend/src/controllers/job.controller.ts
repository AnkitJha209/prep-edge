import { client } from "@repo/db/client";
import { Request, Response } from "express";

export const createJob = async (req: Request, res: Response) => {
    try {
        const {title, description, requirements, location, salary, type} = req.body
        const {id} = (req as any).user
        if(!title || !description || !requirements || !type){
            res.status(400).json({
                success: false,
                message: "Missing important details"
            })
            return
        }
        const newJob = await client.job.create({
            data:{
                title,
                description,
                requirements,
                location,
                type,
                recruiterId: id
            },
            include: {recruiter: true}
        })

        res.status(201).json({
            success: false,
            message: "Job create successfully",
            job: newJob
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}


export const updateStatusOfJob = async (req: Request, res: Response) => {
    try {
        const {status} = req.body
        const jobId = req.query.jobId as string
        const {id}= (req as any).user
        if(!status || !jobId){
            res.status(400).json({
                success: false,
                message: "Missing important details"
            })
            return
        }
        const job = await client.job.findUnique({
            where:{
                id:jobId
            }
        })
        if(!job){
            res.status(404).json({
                success: false,
                message: "No job found"
            })
            return
        }
        if(id !== job.recruiterId){
            res.status(403).json({
                success: false,
                message: "Not authorized to perform any operation on this job" 
            })
            return
        }        
        const updateJob = await client.job.update({
            where:{
                id: jobId
            },
            data:{
                status
            }
        })
        res.status(200).json({
            success: false,
            message: "Updated the job successfully",
            updatedJob: updateJob
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

export const deleteJob = async (req: Request, res: Response) => {
    try {
        const jobId = req.query.jobId as string
        const {id} = (req as any).user

        if(!jobId){
            res.status(400).json({
                success:false,
                message: "Missing job id"
            })
            return
        }
        
        const job = await client.job.findUnique({
            where:{
                id:jobId
            }
        })
        if(!job){
            res.status(404).json({
                success: false,
                message: "No job found"
            })
            return
        }

        if(id !== job.recruiterId){
            res.status(403).json({
                success: false,
                message: "Not authorized to delete the job"
            })
            return
        }

        await client.job.delete({
            where:{
                id: jobId
            }
        })
        
        res.status(200).json({
            success: false,
            message: "Job deleted successfully"
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

export const getAllJobs = async (req: Request, res: Response) => {
    try {
        const jobs = await client.job.findMany({
            include: {
                recruiter: true
            }
        })
        res.status(200).json({
            success: false,
            message: "Jobs fetched successfully",
            jobs
        })

        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

export const getMyAllPostedJobsRecruiterOnly = async (req: Request, res: Response) => {
    try {
        const {id, role} = (req as any).user
        if(!id || !role){
            res.status(400).json({
                success:false,
                message: "Not authorized"
            })
        }
        if(role !== "RECRUITER"){
            res.status(403).json({
                success: false,
                message: "Recruiter only",
            })
            return
        }

        const jobs = await client.job.findMany({
            where:{
                recruiterId: id
            }
        })
        res.status(200).json({
            success: true,
            message: "Job fetched successfully",
            jobs
        })

        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
} 