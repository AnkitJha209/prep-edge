import express, { Application, Request, Response, urlencoded } from "express"
import { authRouter } from "./routes/auth.routes"
import { resumeRouter } from "./routes/resume.routes"
import { jobRouter } from "./routes/job.routes"
import { applicationRouter } from "./routes/application.routes"

const app : Application = express()

app.use(express.json())
app.use(urlencoded())


app.get('/health-check', (req: Request, res: Response) => {
    res.status(200).json({
        message: "All GOOD"
    })
})

app.use('/api/v1', authRouter)
app.use('/api/v1', resumeRouter)
app.use('/api/v1', jobRouter)
app.use('/api/v1', applicationRouter)

app.listen(8080, "0.0.0.0", () => {
    console.log(`Server is running http://localhost:8080`)
})