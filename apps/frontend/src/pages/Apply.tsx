import { useState, useCallback } from "react";
import { useLocation, useNavigate, useParams, Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { resumeApi, applicationApi, interviewApi } from "@/lib/api";
import type { Job, ResumeAnalysis } from "@/types";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
    ArrowLeft,
    Upload,
    FileText,
    CheckCircle2,
    XCircle,
    AlertTriangle,
    Loader2,
    Mic,
    ArrowRight,
} from "lucide-react";
import { toast } from "sonner";

type Step = "upload" | "analysis" | "submitted";

export default function Apply() {
    const { jobId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const job = (location.state as { job?: Job })?.job;

    const [step, setStep] = useState<Step>("upload");
    const [file, setFile] = useState<File | null>(null);
    const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
    const [resumeUrl, setResumeUrl] = useState("");
    const [applicationId, setApplicationId] = useState("");

    // Resume upload + analysis
    const analyzeMutation = useMutation({
        mutationFn: () => {
            if (!file || !jobId) throw new Error("Missing data");
            return resumeApi.analyze(jobId, file);
        },
        onSuccess: (res) => {
            const aiResult = res.data.ai_analysis;
            setResumeUrl(aiResult.resumeUrl);
            setAnalysis(aiResult.result.analysis);
            setStep("analysis");
        },
        onError: (err: any) => {
            toast.error(
                err.response?.data?.message || "Resume analysis failed",
            );
        },
    });

    // Submit application
    const applyMutation = useMutation({
        mutationFn: () => {
            if (!analysis || !jobId) throw new Error("Missing data");
            return applicationApi.create({
                jobId,
                fileUrl: resumeUrl,
                resumeScore: analysis.resumeScore,
                strengths: analysis.strengths,
                missingSkills: analysis.missingSkills,
                experienceGaps: analysis.experienceGaps,
                improvementSuggestion: analysis.improvementSuggestions,
                overallAssessment: analysis.overallAssessment,
                scoreJustification: analysis.scoreJustification,
            });
        },
        onSuccess: (res) => {
            setApplicationId(res.data.application.id);
            setStep("submitted");
            toast.success("Application submitted!");
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || "Application failed");
        },
    });

    // Start interview
    const interviewMutation = useMutation({
        mutationFn: () => interviewApi.create(applicationId),
        onSuccess: (res) => {
            const token = res.data.interviewToken;
            navigate(`/interview`, { state: { interviewToken: token } });
        },
        onError: (err: any) => {
            toast.error(
                err.response?.data?.message || "Failed to start interview",
            );
        },
    });

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile?.type === "application/pdf") setFile(droppedFile);
        else toast.error("Only PDF files are accepted");
    }, []);

    if (!job) {
        return (
            <div className="mx-auto max-w-3xl px-4 py-16 text-center">
                <p className="text-muted-foreground">Job not found.</p>
                <Link to="/jobs">
                    <Button variant="outline" className="mt-4 gap-2">
                        <ArrowLeft className="h-4 w-4" /> Back to Jobs
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
            <Link
                to={`/jobs/${jobId}`}
                state={{ job }}
                className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
            >
                <ArrowLeft className="h-3.5 w-3.5" /> Back to {job.title}
            </Link>

            {/* Step indicator */}
            <div className="mb-8 flex items-center gap-3">
                {["Upload Resume", "AI Analysis", "Applied"].map((label, i) => {
                    const steps: Step[] = ["upload", "analysis", "submitted"];
                    const isActive = steps.indexOf(step) >= i;
                    return (
                        <div key={label} className="flex items-center gap-2">
                            <div
                                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                                    isActive
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-muted text-muted-foreground"
                                }`}
                            >
                                {i + 1}
                            </div>
                            <span
                                className={`text-sm ${isActive ? "text-foreground" : "text-muted-foreground"}`}
                            >
                                {label}
                            </span>
                            {i < 2 && (
                                <div
                                    className={`h-px w-8 ${isActive ? "bg-primary" : "bg-border"}`}
                                />
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Step: Upload */}
            {step === "upload" && (
                <Card className="border-border/50 bg-card/50">
                    <CardHeader>
                        <CardTitle>Upload Your Resume</CardTitle>
                        <CardDescription>
                            We'll analyze your resume against the requirements
                            for <strong>{job.title}</strong>
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div
                            className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border p-12 transition-colors hover:border-primary/50"
                            onDrop={handleDrop}
                            onDragOver={(e) => e.preventDefault()}
                            onClick={() =>
                                document.getElementById("resume-input")?.click()
                            }
                        >
                            <Upload className="mb-3 h-10 w-10 text-muted-foreground" />
                            <p className="text-sm font-medium">
                                {file
                                    ? file.name
                                    : "Drop your PDF resume here or click to browse"}
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">
                                PDF files only
                            </p>
                            <input
                                id="resume-input"
                                type="file"
                                accept=".pdf"
                                className="hidden"
                                onChange={(e) => {
                                    const f = e.target.files?.[0];
                                    if (f) setFile(f);
                                }}
                            />
                        </div>

                        {file && (
                            <div className="mt-4 flex items-center gap-3 rounded-lg bg-muted/50 p-3">
                                <FileText className="h-5 w-5 text-primary" />
                                <span className="flex-1 text-sm">
                                    {file.name}
                                </span>
                                <Button
                                    size="sm"
                                    onClick={() => analyzeMutation.mutate()}
                                    disabled={analyzeMutation.isPending}
                                >
                                    {analyzeMutation.isPending ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : null}
                                    Analyze Resume
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Step: Analysis */}
            {step === "analysis" && analysis && (
                <Card className="border-border/50 bg-card/50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3">
                            Resume Analysis
                            <Badge
                                variant={
                                    analysis.resumeScore >= 65
                                        ? "default"
                                        : "destructive"
                                }
                                className="text-base"
                            >
                                {analysis.resumeScore}/100
                            </Badge>
                        </CardTitle>
                        <CardDescription>
                            {analysis.scoreJustification}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Score bar */}
                        <div>
                            <div className="mb-2 flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">
                                    Match Score
                                </span>
                                <span className="font-medium">
                                    {analysis.resumeScore}%
                                </span>
                            </div>
                            <Progress
                                value={analysis.resumeScore}
                                className="h-2"
                            />
                        </div>

                        <Separator />

                        {/* Strengths */}
                        {analysis.strengths.length > 0 && (
                            <div>
                                <h3 className="mb-2 flex items-center gap-2 font-semibold">
                                    <CheckCircle2 className="h-4 w-4 text-primary" />{" "}
                                    Strengths
                                </h3>
                                <ul className="space-y-1.5 pl-6">
                                    {analysis.strengths.map((s, i) => (
                                        <li
                                            key={i}
                                            className="text-sm text-muted-foreground list-disc"
                                        >
                                            {s}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Missing Skills */}
                        {analysis.missingSkills && (
                            <div>
                                <h3 className="mb-2 flex items-center gap-2 font-semibold">
                                    <XCircle className="h-4 w-4 text-destructive" />{" "}
                                    Missing Skills
                                </h3>
                                {analysis.missingSkills.critical.length > 0 && (
                                    <div className="mb-2">
                                        <p className="mb-1 text-xs font-medium text-destructive">
                                            Critical
                                        </p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {analysis.missingSkills.critical.map(
                                                (s, i) => (
                                                    <Badge
                                                        key={i}
                                                        variant="destructive"
                                                        className="font-normal"
                                                    >
                                                        {s}
                                                    </Badge>
                                                ),
                                            )}
                                        </div>
                                    </div>
                                )}
                                {analysis.missingSkills.minor.length > 0 && (
                                    <div>
                                        <p className="mb-1 text-xs font-medium text-muted-foreground">
                                            Minor
                                        </p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {analysis.missingSkills.minor.map(
                                                (s, i) => (
                                                    <Badge
                                                        key={i}
                                                        variant="secondary"
                                                        className="font-normal"
                                                    >
                                                        {s}
                                                    </Badge>
                                                ),
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Experience Gaps */}
                        {analysis.experienceGaps.length > 0 && (
                            <div>
                                <h3 className="mb-2 flex items-center gap-2 font-semibold">
                                    <AlertTriangle className="h-4 w-4 text-yellow-500" />{" "}
                                    Experience Gaps
                                </h3>
                                <ul className="space-y-1.5 pl-6">
                                    {analysis.experienceGaps.map((g, i) => (
                                        <li
                                            key={i}
                                            className="text-sm text-muted-foreground list-disc"
                                        >
                                            {g}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Overall Assessment */}
                        <div className="rounded-lg bg-muted/50 p-4">
                            <p className="text-sm leading-relaxed text-muted-foreground">
                                {analysis.overallAssessment}
                            </p>
                        </div>

                        <Separator />

                        {analysis.resumeScore >= 65 ? (
                            <Button
                                size="lg"
                                className="w-full gap-2"
                                onClick={() => applyMutation.mutate()}
                                disabled={applyMutation.isPending}
                            >
                                {applyMutation.isPending ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : null}
                                Submit Application
                            </Button>
                        ) : (
                            <div className="text-center">
                                <p className="text-sm text-destructive">
                                    Your resume score is below the 65% threshold
                                    required to apply.
                                </p>
                                <Button
                                    variant="outline"
                                    className="mt-3"
                                    onClick={() => {
                                        setStep("upload");
                                        setFile(null);
                                    }}
                                >
                                    Try a Different Resume
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Step: Submitted */}
            {step === "submitted" && (
                <Card className="border-border/50 bg-card/50">
                    <CardContent className="flex flex-col items-center justify-center py-16">
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                            <CheckCircle2 className="h-8 w-8 text-primary" />
                        </div>
                        <h2 className="text-xl font-bold">
                            Application Submitted!
                        </h2>
                        <p className="mt-2 text-center text-sm text-muted-foreground">
                            Your application for <strong>{job.title}</strong>{" "}
                            has been submitted.
                            <br />
                            You can now proceed to the AI interview.
                        </p>
                        <div className="mt-8 flex gap-3">
                            <Button
                                size="lg"
                                className="gap-2"
                                onClick={() => interviewMutation.mutate()}
                                disabled={interviewMutation.isPending}
                            >
                                {interviewMutation.isPending ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Mic className="h-4 w-4" />
                                )}
                                Start AI Interview
                            </Button>
                            <Link to="/dashboard">
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="gap-2"
                                >
                                    Dashboard <ArrowRight className="h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
