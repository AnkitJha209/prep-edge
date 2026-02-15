import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken'
// import { decode } from "punycode";

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(' ')[1] 
        if(!token){
            res.status(404).json({
                success:false,
                message: "Token not found"
            })
            return
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || "SECRET") as JwtPayload
        
        (req as any).user = decoded
        next()
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

export const verifyADMIN = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {role} = (req as any).user
        if(role !== "ADMIN"){
            res.status(403).json({
                success: false,
                message: "Not authorized to access admin content"
            })
            return
        }
        next();
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

export const verifyRECRUITER = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {role} = (req as any).user
        if(role !== "RECRUITER"){
            res.status(403).json({
                success: false,
                message: "Not authorized to access admin content"
            })
            return
        }
        next();
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}
export const verifyCANDIDATE = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {role} = (req as any).user
        if(role !== "CANDIDATE"){
            res.status(403).json({
                success: false,
                message: "Not authorized to access admin content"
            })
            return
        }
        next();
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Hello there"
        })
    }
}