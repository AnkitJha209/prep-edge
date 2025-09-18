import express, { Application, Request, Response, urlencoded } from "express"

const app : Application = express()

app.use(express.json())
app.use(urlencoded())


app.get('/health-check', (req: Request, res: Response) => {
    console.log("hiii")
    res.status(200).json({
        message: "All GOOD"
    })
})

app.post("/sign-up", (req: Request, res: Response) => {
    console.log(req.body)
    res.status(200).send("Successfull")
})

app.listen(8080, () => {
    console.log(`Server is running http://localhost:8080`)
})