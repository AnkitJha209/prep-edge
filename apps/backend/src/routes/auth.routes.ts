import { Router } from "express";
import { signIn, signUp } from "../controllers/auth.controller";

export const authRouter: Router = Router()

authRouter.post('/auth/sign-up', signUp)
authRouter.post('/auth/sign-in', signIn)