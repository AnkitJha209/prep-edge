import WebSocket, { WebSocketServer } from "ws";
import { checkUser } from "./utils/checkUser";
import { JwtPayload } from "jsonwebtoken";
import { client } from "@repo/db/client";
import { greetApplicant } from "./utils/greetApplicant";
import { textToSpeech } from "./utils/elevenLabs";
import { saveToDB } from "./utils/saveToDB";
import { handleUserAnswer } from "./utils/userAnswer";
import { createReport } from "./utils/reportCreation";

const wss = new WebSocketServer({
    port: 8080,
    path: "/api/v1/interview",
});

wss.on("connection", (ws, request) => {
    console.log("✅ New WS connection");

    let currentQuestionId: string | null = null;
    let userData: any = null;
    let jobData: any = null;
    let interviewData: any = null;
    let interviewId: string = "";

    // Parse & verify token immediately
    try {
        const url = request.url;
        if (!url) {
            ws.close();
            return;
        }

        const queryParams = new URLSearchParams(url.split("?")[1]);
        const token = queryParams.get("token") || "";

        const decoded = checkUser(token) as JwtPayload;
        const { userId, interviewId: iId, jobId } = decoded;

        if (!userId || !iId || !jobId) {
            ws.close();
            return;
        }

        interviewId = iId;

        // Fetch DB data
        (async () => {
            try {
                userData = await client.user.findFirst({
                    where: { id: userId },
                });

                jobData = await client.job.findFirst({
                    where: { id: jobId },
                });

                interviewData = await client.interview.findFirst({
                    where: { id: interviewId },
                    include: { application: true },
                });

                if (!interviewData) {
                    console.log("❌ Interview not found");
                    ws.close();
                    return;
                }

                console.log("✅ Interview context ready");
            } catch (err) {
                console.error("DB error:", err);
                ws.close();
            }
        })();
    } catch (err) {
        console.error("Token verification failed:", err);
        ws.close();
        return;
    }

    ws.on("message", async (data: WebSocket.RawData, isBinary: boolean) => {
        try {
            if (isBinary) {
                if (!currentQuestionId) {
                    console.warn(
                        "Audio received but no currentQuestionId set, ignoring.",
                    );
                    return;
                }

                console.log("🎙 Audio buffer received");

                let audioBuffer: Buffer;

                if (Buffer.isBuffer(data)) {
                    audioBuffer = data;
                } else if (data instanceof ArrayBuffer) {
                    audioBuffer = Buffer.from(data);
                } else if (Array.isArray(data)) {
                    audioBuffer = Buffer.concat(data);
                } else {
                    audioBuffer = Buffer.from(data as Uint8Array);
                }

                await handleUserAnswer(
                    audioBuffer,
                    currentQuestionId,
                    interviewId,
                    jobData,
                    interviewData?.application,
                    ws,
                );

                currentQuestionId = null;
                return;
            }

            let payload: any = null;

            try {
                payload = JSON.parse(data.toString());
            } catch {
                console.warn("Received non-JSON text frame, ignoring.");
                return;
            }

            console.log("📩 Payload received:", payload);

            if (payload.type === "Start_Interview") {
                if (!userData || !jobData || !interviewData) {
                    console.log("Context not ready yet");
                    ws.send(
                        JSON.stringify({
                            type: "ERROR",
                            message:
                                "Interview context not ready, please retry.",
                        }),
                    );
                    return;
                }

                const greetingText = await greetApplicant(
                    userData,
                    jobData,
                    interviewData,
                );
                console.log("Greeting Text:", greetingText);

                const questionId = await saveToDB(greetingText, interviewId);
                const speech = await textToSpeech(greetingText);

                console.log("Speech created successfully");

                ws.send(
                    JSON.stringify({
                        type: "AI_MESSAGE_START",
                        questionId,
                        text: greetingText,
                        audioIncoming: true,
                    }),
                );

                ws.send(speech);

                ws.send(
                    JSON.stringify({
                        type: "AI_MESSAGE_END",
                        questionId,
                    }),
                );
            } else if (payload.type === "ANSWER_FROM_USER") {
                if (!payload.questionId) {
                    console.warn("ANSWER_FROM_USER missing questionId");
                    return;
                }

                currentQuestionId = payload.questionId;
                console.log("✅ currentQuestionId set to:", currentQuestionId);
            } else if (payload.type === "END_INTERVIEW") {
                console.log("Ending interview...");

                await createReport(interviewId, jobData, userData);

                ws.send(
                    JSON.stringify({
                        type: "INTERVIEW_ENDED",
                        message: "Report created successfully.",
                    }),
                );

                ws.close();
            } else {
                console.warn("Unknown payload type:", payload.type);
            }
        } catch (error) {
            console.error("WS MESSAGE ERROR:", error);
        }
    });

    ws.on("close", async () => {
        console.log("User disconnected");

        if (interviewId) {
            await client.interview.update({
                where: { id: interviewId },
                data: { status: "CANCELLED" },
            });
        }
    });

    ws.on("error", (err) => {
        console.error("WS ERROR:", err);
    });
});
