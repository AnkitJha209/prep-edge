import { Router } from "express";
import { verifyCANDIDATE, verifyToken } from "../middlewares/auth.middleware";
import { createInterview } from "../controllers/interview.controller";

export const interviewRouter : Router = Router()

interviewRouter.post('/create-interview', verifyToken, verifyCANDIDATE, createInterview)