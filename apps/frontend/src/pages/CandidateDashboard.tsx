import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "@/lib/api";
import type { CandidateDashboard as CDashboard } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
    FileText,
    Mic,
    BarChart3,
    Briefcase,
    MapPin,
    ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function CandidateDashboard() {
    const { data, isLoading } = useQuery({
        queryKey: ["dashboard", "candidate"],
        queryFn: async () => {
            const res = await dashboardApi.candidate();
            return res.data.data as CDashboard;
        },
    });

    if (isLoading) return <DashboardSkeleton />;

    return (
        <div className="page-shell">
            <div className="mb-10">
                <span className="editorial-kicker">Candidate View</span>
                <h1 className="page-heading mt-5">Candidate Dashboard</h1>
                <p className="page-subtle mt-3 max-w-2xl">
                    Track applications, interview activity, and how your resume
                    signal is trending over time.
                </p>
            </div>

            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-3">
                <StatCard
                    icon={FileText}
                    label="Applications"
                    value={data?.totalApplications ?? 0}
                />
                <StatCard
                    icon={Mic}
                    label="Interviews"
                    value={data?.totalInterviews ?? 0}
                />
                <StatCard
                    icon={BarChart3}
                    label="Avg Resume Score"
                    value={
                        data?.averageResumeScore
                            ? `${Math.round(data.averageResumeScore)}%`
                            : "N/A"
                    }
                />
            </div>

            {/* Recent Applications */}
            <div className="mt-10">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-semibold">
                        Recent Applications
                    </h2>
                    <Link to="/jobs">
                        <Button variant="ghost" size="sm" className="gap-1">
                            Browse Jobs <ArrowRight className="h-3.5 w-3.5" />
                        </Button>
                    </Link>
                </div>

                {data?.recentApplications &&
                data.recentApplications.length > 0 ? (
                    <div className="grid gap-3">
                        {data.recentApplications.map((app) => (
                            <Card key={app.id}>
                                <CardContent className="flex items-center justify-between p-4">
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                            <Briefcase className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-medium">
                                                {app.job?.title ||
                                                    "Unknown Job"}
                                            </p>
                                            <div className="mt-0.5 flex items-center gap-2 text-sm text-muted-foreground">
                                                {app.job?.location && (
                                                    <span className="flex items-center gap-1">
                                                        <MapPin className="h-3 w-3" />{" "}
                                                        {app.job.location}
                                                    </span>
                                                )}
                                                <span>
                                                    {app.job?.type?.replace(
                                                        "_",
                                                        " ",
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {app.resumeScore != null && (
                                            <span className="text-sm font-medium text-primary">
                                                {Math.round(app.resumeScore)}%
                                            </span>
                                        )}
                                        <StatusBadge status={app.status} />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <FileText className="mb-3 h-10 w-10 text-muted-foreground/50" />
                            <p className="text-muted-foreground">
                                No applications yet
                            </p>
                            <Link to="/jobs" className="mt-3">
                                <Button size="sm" variant="outline">
                                    Browse Jobs
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}

function StatCard({
    icon: Icon,
    label,
    value,
}: {
    icon: any;
    label: string;
    value: string | number;
}) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    {label}
                </CardTitle>
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/[0.04] text-primary">
                    <Icon className="h-4 w-4" />
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-bold">{value}</div>
            </CardContent>
        </Card>
    );
}

function StatusBadge({ status }: { status: string }) {
    const variant =
        status === "ACCEPTED"
            ? "default"
            : status === "REJECTED"
              ? "destructive"
              : "secondary";
    return (
        <Badge variant={variant} className="text-xs">
            {status.replace("_", " ")}
        </Badge>
    );
}

function DashboardSkeleton() {
    return (
        <div className="page-shell">
            <Skeleton className="mb-2 h-8 w-64" />
            <Skeleton className="mb-8 h-4 w-48" />
            <div className="grid gap-4 sm:grid-cols-3">
                {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-24 rounded-xl" />
                ))}
            </div>
            <Skeleton className="mt-10 mb-4 h-6 w-48" />
            {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="mb-3 h-16 rounded-xl" />
            ))}
        </div>
    );
}
