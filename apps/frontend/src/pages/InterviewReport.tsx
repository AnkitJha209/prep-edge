import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { interviewApi } from "@/lib/api";
import type { InterviewReport as IReport } from "@/types";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
    ArrowLeft,
    FileText,
    CheckCircle2,
    AlertTriangle,
    Star,
    MessageSquare,
} from "lucide-react";

export default function InterviewReport() {
    const { reportId } = useParams();

    const {
        data: report,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["interview-report", reportId],
        queryFn: async () => {
            const res = await interviewApi.getReport(reportId!);
            return res.data.data as IReport;
        },
        enabled: !!reportId,
    });

    if (isLoading) {
        return (
            <div className="page-shell max-w-4xl">
                <Skeleton className="mb-6 h-6 w-32" />
                <Skeleton className="mb-4 h-8 w-64" />
                <Skeleton className="h-64 rounded-xl" />
            </div>
        );
    }

    if (error || !report) {
        return (
            <div className="page-shell max-w-4xl text-center">
                <p className="text-muted-foreground">
                    Report not found or you don&apos;t have access.
                </p>
                <Link to="/dashboard">
                    <Button variant="outline" className="mt-4 gap-2">
                        <ArrowLeft className="h-4 w-4" /> Dashboard
                    </Button>
                </Link>
            </div>
        );
    }

    const score = report.overallScore ?? 0;
    const scoreColor =
        score >= 75
            ? "text-primary"
            : score >= 50
              ? "text-yellow-500"
              : "text-destructive";

    return (
        <div className="page-shell max-w-4xl">
            <Link
                to="/dashboard"
                className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
                <ArrowLeft className="h-3.5 w-3.5" /> Back to Dashboard
            </Link>

            <Card>
                <CardHeader>
                    <div className="flex items-start justify-between">
                        <div>
                            <span className="editorial-kicker mb-4">
                                Interview Summary
                            </span>
                            <CardTitle className="flex items-center gap-2 text-2xl">
                                <FileText className="h-6 w-6 text-primary" />
                                Interview Report
                            </CardTitle>
                            <CardDescription className="mt-1">
                                Generated on{" "}
                                {new Date(
                                    report.createdAt,
                                ).toLocaleDateString()}
                            </CardDescription>
                        </div>
                        <div className="text-right">
                            <div className={`text-3xl font-bold ${scoreColor}`}>
                                {Math.round(score)}
                            </div>
                            <div className="text-xs text-muted-foreground">
                                out of 100
                            </div>
                        </div>
                    </div>
                    <Progress value={score} className="mt-4 h-2" />
                </CardHeader>

                <Separator />

                <CardContent className="space-y-6 p-6">
                    {/* Summary */}
                    <div>
                        <h3 className="mb-2 flex items-center gap-2 font-semibold">
                            <MessageSquare className="h-4 w-4 text-primary" />{" "}
                            Summary
                        </h3>
                        <p className="text-sm leading-relaxed text-muted-foreground">
                            {report.summary}
                        </p>
                    </div>

                    {/* Strengths */}
                    {report.strengths && (
                        <div>
                            <h3 className="mb-2 flex items-center gap-2 font-semibold">
                                <CheckCircle2 className="h-4 w-4 text-primary" />{" "}
                                Strengths
                            </h3>
                            <p className="text-sm leading-relaxed text-muted-foreground">
                                {report.strengths}
                            </p>
                        </div>
                    )}

                    {/* Weaknesses */}
                    {report.weaknesses && (
                        <div>
                            <h3 className="mb-2 flex items-center gap-2 font-semibold">
                                <AlertTriangle className="h-4 w-4 text-yellow-500" />{" "}
                                Areas for Improvement
                            </h3>
                            <p className="text-sm leading-relaxed text-muted-foreground">
                                {report.weaknesses}
                            </p>
                        </div>
                    )}

                    {/* AI Recommendation */}
                    {report.aiRecommendation && (
                        <div className="rounded-lg bg-primary/5 border border-primary/20 p-4">
                            <h3 className="mb-2 flex items-center gap-2 font-semibold">
                                <Star className="h-4 w-4 text-primary" /> AI
                                Recommendation
                            </h3>
                            <p className="text-sm leading-relaxed text-muted-foreground">
                                {report.aiRecommendation}
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
