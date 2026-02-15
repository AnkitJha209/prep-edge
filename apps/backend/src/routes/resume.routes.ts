import { Router } from "express";
import multer from "multer";
import { resumeUpload } from "../controllers/resume.controller";
import { verifyCANDIDATE, verifyToken } from "../middlewares/auth.middleware";

export const resumeRouter: Router = Router()
const upload = multer({storage: multer.memoryStorage()})

resumeRouter.post("/resume-analysis", verifyToken, verifyCANDIDATE, upload.single('file'), resumeUpload)