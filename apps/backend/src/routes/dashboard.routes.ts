import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware";
import {
  getCandidateDashboard,
  getRecruiterDashboard,
  getAdminDashboard,
} from "../controllers/dashboard.controller";

export const dashboardRouter : Router = Router();

dashboardRouter.get("/dashboard/candidate", verifyToken, getCandidateDashboard);
dashboardRouter.get("/dashboard/recruiter", verifyToken, getRecruiterDashboard);
dashboardRouter.get("/dashboard/admin", verifyToken, getAdminDashboard);
