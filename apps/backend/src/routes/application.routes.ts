import { Router } from "express";
import { verifyCANDIDATE, verifyToken } from "../middlewares/auth.middleware";
import { createApplication } from "../controllers/application.controller";

export const applicationRouter : Router = Router()

applicationRouter.post('/create-application', verifyToken, verifyCANDIDATE, createApplication)