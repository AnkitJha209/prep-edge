import express, { Application, Request, Response, urlencoded } from "express"
import { authRouter } from "./routes/auth.routes"
import { resumeRouter } from "./routes/resume.routes"
import { jobRouter } from "./routes/job.routes"
import { applicationRouter } from "./routes/application.routes"
import { interviewRouter } from "./routes/interview.routes"
import cors from 'cors'
import { dashboardRouter } from "./routes/dashboard.routes"

const app : Application = express()

app.use(express.json())
app.use(urlencoded({extended: true}))
app.use(cors({
    origin: ["http://localhost:8080"],
    credentials: true
}))

app.get('/health-check', (req: Request, res: Response) => {
    res.status(200).json({
        message: "All GOOD"
    })
})

app.use('/api/v1', authRouter)
app.use('/api/v1', resumeRouter)
app.use('/api/v1', jobRouter)
app.use('/api/v1', applicationRouter)
app.use('/api/v1', interviewRouter)
app.use('/api/v1', dashboardRouter)

app.listen(5000, "0.0.0.0", () => {
    console.log(`Server is running http://localhost:5000`)
})