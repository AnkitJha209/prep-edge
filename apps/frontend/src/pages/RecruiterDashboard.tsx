import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "@/lib/api";
import type { RecruiterDashboard as RDashboard } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Briefcase,
    FileText,
    Mic,
    Users,
    TrendingUp,
    ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function RecruiterDashboard() {
    const { data, isLoading } = useQuery({
        queryKey: ["dashboard", "recruiter"],
        queryFn: async () => {
            const res = await dashboardApi.recruiter();
            return res.data.data as RDashboard;
        },
    });

    if (isLoading) {
        return (
            <div className="page-shell">
                <Skeleton className="mb-2 h-8 w-64" />
                <Skeleton className="mb-8 h-4 w-48" />
                <div className="grid gap-4 sm:grid-cols-4">
                    {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} className="h-24 rounded-xl" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="page-shell">
            <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <span className="editorial-kicker">Recruiter View</span>
                    <h1 className="page-heading mt-5">Recruiter Dashboard</h1>
                    <p className="page-subtle mt-3 max-w-2xl">
                        Manage active roles, review candidate signal, and keep
                        your screening workflow moving.
                    </p>
                </div>
                <Link to="/recruiter/jobs/create">
                    <Button className="gap-2">
                        <Briefcase className="h-4 w-4" /> Post a Job
                    </Button>
                </Link>
            </div>

            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    icon={Briefcase}
                    label="Total Jobs"
                    value={data?.totalJobs ?? 0}
                />
                <StatCard
                    icon={TrendingUp}
                    label="Active Jobs"
                    value={data?.activeJobs ?? 0}
                />
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
            </div>

            {/* Top Candidates */}
            <div className="mt-10">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Top Candidates</h2>
                    <Link to="/recruiter/jobs">
                        <Button variant="ghost" size="sm" className="gap-1">
                            My Jobs <ArrowRight className="h-3.5 w-3.5" />
                        </Button>
                    </Link>
                </div>
                {data?.topCandidates && data.topCandidates.length > 0 ? (
                    <div className="grid gap-3">
                        {data.topCandidates.map((c) => (
                            <Card key={c.id}>
                                <CardContent className="flex items-center justify-between p-4">
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                                            <Users className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-medium">
                                                {c.candidate?.firstName}{" "}
                                                {c.candidate?.lastName}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {c.candidate?.email}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-primary">
                                            {c.resumeScore != null
                                                ? `${Math.round(c.resumeScore)}%`
                                                : "N/A"}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {c.job?.title}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <Users className="mb-3 h-10 w-10 text-muted-foreground/50" />
                            <p className="text-muted-foreground">
                                No candidates yet
                            </p>
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
    value: number;
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
