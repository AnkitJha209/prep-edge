import express, {
    Application,
    Request,
    Response as ExResponse,
    urlencoded,
} from "express";
import { authRouter } from "./routes/auth.routes";
import { resumeRouter } from "./routes/resume.routes";
import { jobRouter } from "./routes/job.routes";
import { applicationRouter } from "./routes/application.routes";
import { interviewRouter } from "./routes/interview.routes";
import cors from "cors";
import { dashboardRouter } from "./routes/dashboard.routes";
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

const app: Application = express();

app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(
    cors({
        origin: [
            "http://localhost:8080",
            "http://localhost:5173",
            "http://localhost:5174",
        ],
        credentials: true,
    }),
);

app.get("/health-check", (req: Request, res: ExResponse) => {
    res.status(200).json({
        message: "All GOOD",
    });
});

const elevenlabs = new ElevenLabsClient();

// testing of text to speech
app.post("/tts", async (req: Request, res: ExResponse) => {
    try {
        const { text } = req.body;

        const audioStream = await elevenlabs.textToSpeech.convert(
            "JBFqnCBsd6RMkjVDRZzb",
            {
                text,
                modelId: "eleven_multilingual_v2",
                outputFormat: "mp3_44100_128",
            },
        );

        const arrayBuffer = await new Response(audioStream).arrayBuffer();
        const audioBuffer = Buffer.from(arrayBuffer);

        res.setHeader("Content-Type", "audio/mpeg");
        res.setHeader("Content-Length", audioBuffer.length);

        res.send(audioBuffer);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "TTS failed" });
    }
});

app.use("/api/v1", authRouter);
app.use("/api/v1", resumeRouter);
app.use("/api/v1", jobRouter);
app.use("/api/v1", applicationRouter);
app.use("/api/v1", interviewRouter);
app.use("/api/v1", dashboardRouter);

app.listen(5000, "0.0.0.0", () => {
    console.log(`Server is running http://localhost:5000`);
});
