import { Router } from "express";
import { verifyRECRUITER, verifyToken } from "../middlewares/auth.middleware";
import { createJob, deleteJob, updateStatusOfJob } from "../controllers/job.controller";

export const jobRouter : Router = Router()

jobRouter.post('/create-a-job', verifyToken, verifyRECRUITER, createJob)
jobRouter.put('/update-a-job', verifyToken, verifyRECRUITER, updateStatusOfJob)
jobRouter.get('/get-all-job', verifyToken, updateStatusOfJob)
jobRouter.get('/get-all-my-job', verifyToken, verifyRECRUITER, updateStatusOfJob)
jobRouter.delete('/delete-a-job', verifyToken, verifyRECRUITER, deleteJob)