import { useEffect, useRef, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import {
    startInterview,
    addAiMessage,
    aiMessageEnd,
    setRecording,
    addUserMessage,
    endInterview,
    resetInterview,
} from "@/store/slices/interviewSlice";
import { createInterviewWS } from "@/lib/api";
import type { WSServerMessage } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Mic,
    MicOff,
    Phone,
    PhoneOff,
    Loader2,
    Bot,
    User,
    Volume2,
} from "lucide-react";
import { toast } from "sonner";

export default function InterviewRoom() {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const {
        isInterviewActive,
        isAiSpeaking,
        isRecording,
        messages,
        currentQuestionId,
    } = useAppSelector((s) => s.interview);

    const interviewToken = (location.state as { interviewToken?: string })
        ?.interviewToken;

    const wsRef = useRef<WebSocket | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);

    const videoRef = useRef<HTMLVideoElement | null>(null);
    const cameraStreamRef = useRef<MediaStream | null>(null);
    const [cameraOn, setCameraOn] = useState(false);
    const audioChunksRef = useRef<Blob[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const contextReadyRef = useRef(false);
    const [connecting, setConnecting] = useState(false);
    const [connected, setConnected] = useState(false);
    const [preparingContext, setPreparingContext] = useState(false);
    const [retryCount, setRetryCount] = useState(0);
    const [timeLeft, setTimeLeft] = useState(180);
    

    // Streaming typewriter state
    const [streamingMsgId, setStreamingMsgId] = useState<string | null>(null);
    const [streamedLength, setStreamedLength] = useState(0);
    const streamIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
        null,
    );

    // Live speech-to-text transcription
    const [liveTranscript, setLiveTranscript] = useState("");
    const recognitionRef = useRef<any>(null);
    const liveTranscriptRef = useRef("");
    const isRecordingRef = useRef(false);
    const accumulatedTranscriptRef = useRef("");

    // Auto-scroll messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, streamedLength, liveTranscript]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
            if (streamIntervalRef.current)
                clearInterval(streamIntervalRef.current);
            recognitionRef.current?.stop();
            wsRef.current?.close();
            dispatch(resetInterview());
        };
    }, [dispatch]);

    // Free tier timer (3 minutes)
useEffect(() => {
    if (!isInterviewActive) return;

    const timer = setInterval(() => {
        setTimeLeft((prev) => {
            if (prev <= 1) {
                handleEndInterview();
                toast.warning("Interview time limit reached");
                return 0;
            }
            return prev - 1;
        });
    }, 1000);

    return () => clearInterval(timer);
}, [isInterviewActive]);


    const playAudioBuffer = useCallback(async (buffer: ArrayBuffer) => {
        try {
            if (!audioContextRef.current) {
                audioContextRef.current = new AudioContext();
            }
            const ctx = audioContextRef.current;
            const audioBuffer = await ctx.decodeAudioData(buffer.slice(0));
            const source = ctx.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(ctx.destination);
            source.start(0);
        } catch {
            // Fallback: play as MP3 blob
            const blob = new Blob([buffer], { type: "audio/mpeg" });
            const url = URL.createObjectURL(blob);
            const audio = new Audio(url);
            audio.play().catch(() => {});
        }
    }, []);

    // Send Start_Interview with retry – called after WS is open
    const sendStartInterview = useCallback(() => {
        const ws = wsRef.current;
        if (!ws || ws.readyState !== WebSocket.OPEN || contextReadyRef.current)
            return;

        ws.send(JSON.stringify({ type: "Start_Interview" }));
        setRetryCount((prev) => prev + 1);
    }, []);

    // Schedule a retry after a delay
    const scheduleRetry = useCallback(
        (delay: number) => {
            if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
            retryTimerRef.current = setTimeout(() => {
                if (!contextReadyRef.current) {
                    sendStartInterview();
                }
            }, delay);
        },
        [sendStartInterview],
    );

    // Typewriter streaming for AI messages — paced to roughly match TTS speech
    const startStreaming = useCallback((msgId: string, fullText: string) => {
        if (streamIntervalRef.current) clearInterval(streamIntervalRef.current);
        setStreamingMsgId(msgId);
        setStreamedLength(0);

        // ~15 chars/sec to match natural TTS speed (~150 wpm)
        // For a 500-char message this takes ~33s which aligns with audio
        const charsPerTick = 1;
        const intervalMs = 50;

        streamIntervalRef.current = setInterval(() => {
            setStreamedLength((prev) => {
                const next = prev + charsPerTick;
                if (next >= fullText.length) {
                    clearInterval(streamIntervalRef.current!);
                    streamIntervalRef.current = null;
                    setStreamingMsgId(null);
                    return fullText.length;
                }
                return next;
            });
        }, intervalMs);
    }, []);

    const handleConnect = useCallback(() => {
        if (!interviewToken) {
            toast.error(
                "No interview token. Please start from an application.",
            );
            navigate("/dashboard");
            return;
        }

        setConnecting(true);
        const ws = createInterviewWS(interviewToken);
        wsRef.current = ws;
        contextReadyRef.current = false;

        ws.binaryType = "arraybuffer";

        ws.onopen = () => {
            setConnecting(false);
            setConnected(true);
            setPreparingContext(true);
            setRetryCount(0);
            toast.success("Connected — preparing interview environment...");

            // First attempt after a short grace period to let server fetch DB data
            retryTimerRef.current = setTimeout(() => {
                sendStartInterview();
            }, 2000);
        };

        ws.onmessage = (event) => {
            if (event.data instanceof ArrayBuffer) {
                // Binary audio from AI
                playAudioBuffer(event.data);
                return;
            }

            try {
                const msg = JSON.parse(event.data) as WSServerMessage;

                switch (msg.type) {
                    case "AI_MESSAGE_START": {
                        // Context was ready – server responded with first question
                        if (!contextReadyRef.current) {
                            contextReadyRef.current = true;
                            if (retryTimerRef.current)
                                clearTimeout(retryTimerRef.current);
                            setPreparingContext(false);
                            dispatch(startInterview());
                            toast.success("Interview started!");
                        }
                        const msgId = crypto.randomUUID();
                        dispatch(
                            addAiMessage({
                                questionId: msg.questionId,
                                text: msg.text,
                                id: msgId,
                            }),
                        );
                        startStreaming(msgId, msg.text);
                        break;
                    }
                    case "AI_MESSAGE_END":
                        dispatch(aiMessageEnd());
                        break;
                    case "INTERVIEW_ENDED":
                        dispatch(endInterview());
                        setConnected(false);
                        setPreparingContext(false);
                        toast.success(
                            "Interview completed! Redirecting to dashboard...",
                        );
                        setTimeout(() => navigate("/dashboard"), 2000);
                        break;
                    case "ERROR":
                        // If context not ready, schedule a retry
                        if (
                            msg.message?.includes("context not ready") ||
                            msg.message?.includes("not ready")
                        ) {
                            console.log(
                                "Server context not ready, retrying in 2s...",
                            );
                            scheduleRetry(2000);
                        } else {
                            toast.error(msg.message);
                        }
                        break;
                }
            } catch {
                // Non-JSON text, ignore
            }
        };

        ws.onerror = () => {
            setConnecting(false);
            toast.error("Connection error");
        };

        ws.onclose = () => {
            setConnected(false);
            setConnecting(false);
            setPreparingContext(false);
            if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
        };
    }, [
        interviewToken,
        dispatch,
        navigate,
        playAudioBuffer,
        sendStartInterview,
        scheduleRetry,
        startStreaming,
    ]);

    const startRecording = useCallback(async () => {
        if (!currentQuestionId || !wsRef.current) return;

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
            });
            const recorder = new MediaRecorder(stream, {
                mimeType: "audio/webm",
            });
            mediaRecorderRef.current = recorder;
            audioChunksRef.current = [];

            // Reset transcript state
            setLiveTranscript("");
            liveTranscriptRef.current = "";
            accumulatedTranscriptRef.current = "";
            isRecordingRef.current = true;

            // Start speech recognition for live transcription
            const SpeechRecognitionAPI =
                (window as any).SpeechRecognition ||
                (window as any).webkitSpeechRecognition;
            if (SpeechRecognitionAPI) {
                const createRecognition = () => {
                    const recognition = new SpeechRecognitionAPI();
                    recognition.continuous = true;
                    recognition.interimResults = true;
                    recognition.lang = "en-US";

                    recognition.onresult = (event: any) => {
                        let finalText = accumulatedTranscriptRef.current;
                        let interim = "";
                        for (
                            let i = event.resultIndex;
                            i < event.results.length;
                            i++
                        ) {
                            const transcript = event.results[i][0].transcript;
                            if (event.results[i].isFinal) {
                                finalText += transcript + " ";
                                accumulatedTranscriptRef.current = finalText;
                            } else {
                                interim += transcript;
                            }
                        }
                        const full = (finalText + interim).trim();
                        liveTranscriptRef.current = full;
                        setLiveTranscript(full);
                    };

                    // Auto-restart if recognition stops mid-recording
                    recognition.onend = () => {
                        if (isRecordingRef.current) {
                            try {
                                recognition.start();
                            } catch {
                                // Already started or stopped, ignore
                            }
                        }
                    };

                    recognition.onerror = (e: any) => {
                        // "no-speech" and "aborted" are normal, only log others
                        if (e.error !== "no-speech" && e.error !== "aborted") {
                            console.warn("Speech recognition error:", e.error);
                        }
                    };

                    return recognition;
                };

                const recognition = createRecognition();
                recognition.start();
                recognitionRef.current = recognition;
            }

            // Tell server we're about to send audio for this question
            wsRef.current.send(
                JSON.stringify({
                    type: "ANSWER_FROM_USER",
                    questionId: currentQuestionId,
                }),
            );

            recorder.ondataavailable = (e) => {
                if (e.data.size > 0) audioChunksRef.current.push(e.data);
            };

            recorder.onstop = async () => {
                // Capture the transcript BEFORE stopping recognition
                isRecordingRef.current = false;
                const capturedTranscript = liveTranscriptRef.current.trim();

                // Give recognition a moment to finalize any pending results
                await new Promise((resolve) => setTimeout(resolve, 300));

                // Now grab the potentially updated final transcript
                const finalTranscript =
                    liveTranscriptRef.current.trim() || capturedTranscript;

                // Stop recognition and mic
                try {
                    recognitionRef.current?.stop();
                } catch {
                    // ignore
                }
                recognitionRef.current = null;
                stream.getTracks().forEach((t) => t.stop());

                const blob = new Blob(audioChunksRef.current, {
                    type: "audio/webm",
                });
                const buffer = await blob.arrayBuffer();

                if (wsRef.current?.readyState === WebSocket.OPEN) {
                    wsRef.current.send(buffer);
                }

                // Use transcribed text or fallback
                const messageText = finalTranscript || "(Voice answer sent)";

                dispatch(
                    addUserMessage({
                        questionId: currentQuestionId!,
                        text: messageText,
                    }),
                );
                setLiveTranscript("");
                liveTranscriptRef.current = "";
                accumulatedTranscriptRef.current = "";
                dispatch(setRecording(false));
            };

            recorder.start();
            dispatch(setRecording(true));
        } catch {
            toast.error("Microphone access denied");
        }
    }, [currentQuestionId, dispatch]);

    const toggleCamera = async () => {
    if (cameraOn) {
        cameraStreamRef.current?.getTracks().forEach(t => t.stop());
        cameraStreamRef.current = null;
        setCameraOn(false);
        return;
    }

    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
        });

        cameraStreamRef.current = stream;

        if (videoRef.current) {
            videoRef.current.srcObject = stream;
        }

        setCameraOn(true);
    } catch {
        toast.error("Camera access denied");
    }
};

    const stopRecording = useCallback(() => {
        mediaRecorderRef.current?.stop();
    }, []);

    const handleEndInterview = useCallback(() => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({ type: "END_INTERVIEW" }));
        }
    }, []);

    if (!interviewToken) {
        return (
            <div className="mx-auto max-w-3xl px-4 py-16 text-center">
                <p className="text-muted-foreground">
                    No interview token found. Please start from your
                    application.
                </p>
                <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => navigate("/dashboard")}
                >
                    Go to Dashboard
                </Button>
            </div>
        );
    }

    return (
        <div
            className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-6 sm:px-6"
            style={{ height: "calc(100vh - 4rem)" }}
        >
            {/* Header */}
            <div className="flex shrink-0 items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <Bot className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <h1 className="font-semibold">AI Interview</h1>
                        <div className="flex items-center gap-2">
                            <Badge
                                variant={connected ? "default" : "secondary"}
                                className="text-xs"
                            >
                                {preparingContext
                                    ? "Preparing..."
                                    : connected
                                      ? "Live"
                                      : "Disconnected"}
                            </Badge>
                             <Badge variant="outline" className="text-xs">
                                {Math.floor(timeLeft / 60)}:
                                {String(timeLeft % 60).padStart(2, "0")}
                            </Badge>
                            {isAiSpeaking && (
                                <Badge
                                    variant="secondary"
                                    className="gap-1 text-xs"
                                >
                                    <Volume2 className="h-3 w-3 animate-pulse" />{" "}
                                    AI Speaking
                                </Badge>
                            )}
                        </div>
                    </div>
                </div>
                {connected && (
                    <Button
                        variant="destructive"
                        size="sm"
                        className="gap-2"
                        onClick={handleEndInterview}
                    >
                        <PhoneOff className="h-4 w-4" /> End Interview
                    </Button>
                )}
            </div>

            {/* Main Layout Grid */}
            <div className="grid flex-1 grid-cols-1 gap-4 overflow-y-auto md:grid-cols-3">
                {/* AI Avatar Card */}
                <Card className="flex flex-col items-center justify-center border-border/50 bg-card/30 p-6">
                    <div className="flex h-48 w-48 items-center justify-center rounded-full bg-muted shadow-inner">
                        <Bot className="h-24 w-24 text-primary" />
                    </div>
                    <p className="mt-6 text-lg font-medium">AI Interviewer</p>
                </Card>

                {/* Candidate Camera Card */}
                <Card className="flex flex-col items-center justify-center border-border/50 bg-card/30 p-6">
                    <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black shadow-inner ring-1 ring-border/50">
                        <video
                            ref={videoRef}
                            autoPlay
                            muted
                            className="h-full w-full object-cover"
                        />
                        {!cameraOn && (
                            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                                <span className="text-sm">Camera Off</span>
                            </div>
                        )}
                    </div>

                    <Button
                        variant="outline"
                        className="mt-6"
                        onClick={toggleCamera}
                    >
                        {cameraOn ? "Turn Camera Off" : "Turn Camera On"}
                    </Button>
                </Card>

                {/* Chat/Transcript Card */}
                <Card className="flex flex-col overflow-hidden border-border/50 bg-card/30">
                    <CardContent className="flex h-full flex-col p-0">
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {/* Pre-connect: Start button */}
                            {!connected &&
                                !isInterviewActive &&
                                !preparingContext && (
                                    <div className="flex h-full flex-col items-center justify-center">
                                        <Bot className="mb-4 h-16 w-16 text-muted-foreground/30" />
                                        <h2 className="text-lg font-semibold">
                                            Ready to begin?
                                        </h2>
                                        <p className="mt-1 mb-6 text-sm text-muted-foreground text-center max-w-sm">
                                            Click the button below to connect and
                                            start your AI-powered interview. Make
                                            sure your microphone is ready.
                                        </p>
                                        <Button
                                            size="lg"
                                            className="gap-2"
                                            onClick={handleConnect}
                                            disabled={connecting}
                                        >
                                            {connecting ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <Phone className="h-4 w-4" />
                                            )}
                                            {connecting
                                                ? "Connecting..."
                                                : "Start Interview"}
                                        </Button>
                                    </div>
                                )}

                            {/* Preparing context loading screen */}
                            {preparingContext && (
                                <div className="flex h-full flex-col items-center justify-center">
                                    <div className="relative mb-6">
                                        <div className="h-20 w-20 rounded-full border-4 border-primary/20" />
                                        <div
                                            className="absolute inset-0 h-20 w-20 animate-spin rounded-full border-4 border-transparent border-t-primary"
                                            style={{ animationDuration: "1.5s" }}
                                        />
                                        <Bot className="absolute inset-0 m-auto h-8 w-8 text-primary" />
                                    </div>
                                    <h2 className="text-lg font-semibold">
                                        Preparing your interview...
                                    </h2>
                                    <p className="mt-2 text-sm text-muted-foreground text-center max-w-sm">
                                        Setting up your interview environment.
                                        Loading your profile, job details, and
                                        generating interview questions.
                                    </p>
                                    <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                                        <Loader2 className="h-3 w-3 animate-spin" />
                                        {retryCount === 0
                                            ? "Initializing connection..."
                                            : retryCount === 1
                                              ? "Loading interview context..."
                                              : `Still preparing... (attempt ${retryCount})`}
                                    </div>
                                </div>
                            )}

                            {messages.map((msg) => {
                                const isStreamingThis = streamingMsgId === msg.id;
                                const displayText = isStreamingThis
                                    ? msg.text.slice(0, streamedLength)
                                    : msg.text;

                                return (
                                    <div
                                        key={msg.id}
                                        className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                                    >
                                        <div
                                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                                                msg.role === "ai"
                                                    ? "bg-primary/10"
                                                    : "bg-muted"
                                            }`}
                                        >
                                            {msg.role === "ai" ? (
                                                <Bot className="h-4 w-4 text-primary" />
                                            ) : (
                                                <User className="h-4 w-4" />
                                            )}
                                        </div>
                                        <div
                                            className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                                                msg.role === "ai"
                                                    ? "bg-muted text-foreground"
                                                    : "bg-primary text-primary-foreground"
                                            }`}
                                        >
                                            {displayText}
                                            {isStreamingThis && (
                                                <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-current align-middle" />
                                            )}
                                        </div>
                                    </div>
                                );
                            })}

                            {/* Live transcript bubble while recording */}
                            {isRecording && (
                                <div className="flex gap-3 flex-row-reverse">
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                                        <Mic className="h-4 w-4 text-red-400 animate-pulse" />
                                    </div>
                                    <div className="max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed bg-primary/80 text-primary-foreground">
                                        {liveTranscript || (
                                            <span className="italic text-primary-foreground/60">
                                                Listening...
                                            </span>
                                        )}
                                        <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-current align-middle" />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Controls */}
                        {connected && (
                            <div className="border-t border-border/50 p-4">
                                <div className="flex items-center justify-center gap-4">
                                    {!isRecording ? (
                                        <Button
                                            size="lg"
                                            className="h-14 w-14 rounded-full p-0"
                                            onClick={startRecording}
                                            disabled={
                                                isAiSpeaking || !currentQuestionId
                                            }
                                        >
                                            <Mic className="h-6 w-6" />
                                        </Button>
                                    ) : (
                                        <Button
                                            size="lg"
                                            variant="destructive"
                                            className="h-14 w-14 rounded-full p-0 animate-pulse"
                                            onClick={stopRecording}
                                        >
                                            <MicOff className="h-6 w-6" />
                                        </Button>
                                    )}
                                    <p className="text-xs text-muted-foreground">
                                        {isAiSpeaking
                                            ? "AI is speaking..."
                                            : isRecording
                                              ? "Recording... Click to stop"
                                              : currentQuestionId
                                                ? "Click to record your answer"
                                                : "Waiting for question..."}
                                    </p>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
