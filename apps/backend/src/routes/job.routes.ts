import { Router } from "express";
import { verifyRECRUITER, verifyToken } from "../middlewares/auth.middleware";
import { createJob, deleteJob, getAllJobs, updateStatusOfJob } from "../controllers/job.controller";
import { get } from "http";

export const jobRouter : Router = Router()

jobRouter.post('/create-a-job', verifyToken, verifyRECRUITER, createJob)
jobRouter.put('/update-a-job', verifyToken, verifyRECRUITER, updateStatusOfJob)
jobRouter.get('/get-all-job', verifyToken, getAllJobs)
jobRouter.get('/get-all-my-job', verifyToken, verifyRECRUITER, getAllJobs)
jobRouter.delete('/delete-a-job', verifyToken, verifyRECRUITER, deleteJob)