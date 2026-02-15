import { Request, Response } from "express";
import bcrypt from 'bcrypt'
import { client } from "@repo/db/client";
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

export const signUp = async (req:Request, res: Response) => {
    try {
        const {email, password, firstName, lastName, role} = req.body
        if(!email || !password || !firstName || !lastName){
            res.status(400).json({
                success: false,
                message: "Missing Important details"
            })
            return
        } 
        const userExist = await client.user.findUnique({
            where: {email}
        })
        if(userExist){
            res.status(400).json({
                success: false,
                message: "User Already Exist with that email"
            })
            return
        }
        const passwordHash = await bcrypt.hash(password, 10)
        const newUser = await client.user.create({
            data:{
                firstName,
                lastName,
                email,
                passwordHash,
                role: role ? role : "CANDIDATE"
            }
        })
        res.status(201).json({
            success: true,
            message: "User created successfully",
            user: newUser
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

export const signIn = async (req: Request, res: Response) => {
    try {
        const {email, password} = req.body
        if(!email || !password){
            res.status(400).json({
                success: false,
                message: "Missing details"
            })
            return
        } 
        const userExist = await client.user.findUnique({
            where: {
                email
            }
        })
        if(!userExist){
            res.status(404).json({
                success: false,
                message: "User not found"
            })
            return
        }
        if(await bcrypt.compare(password, userExist?.passwordHash)){
            const payload = {
                id:userExist.id,
                email: userExist.email,
                role: userExist.role
            }
            const token = jwt.sign(payload, process.env.JWT_SECRET || "SECRET", {
                expiresIn: '30d'
            })
            res.status(200).cookie("token",token, {maxAge: 24 * 60 * 60 * 1000,httpOnly:false}).json({
                success: true,
                message: "User signed in successfully",
                token
            })
        }else{
            res.status(401).json({
                success: false,
                message: "Password is wrong"
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}