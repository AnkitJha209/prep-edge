import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "@/lib/api";
import type { AdminDashboard as ADashboard } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Users,
    Briefcase,
    FileText,
    Mic,
    Shield,
    UserPlus,
} from "lucide-react";

export default function AdminDashboard() {
    const { data, isLoading } = useQuery({
        queryKey: ["dashboard", "admin"],
        queryFn: async () => {
            const res = await dashboardApi.admin();
            return res.data.data as ADashboard;
        },
    });

    if (isLoading) {
        return (
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
                <Skeleton className="mb-2 h-8 w-64" />
                <Skeleton className="mb-8 h-4 w-48" />
                <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <Skeleton key={i} className="h-24 rounded-xl" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
            <div className="mb-8">
                <div className="flex items-center gap-2">
                    <Shield className="h-6 w-6 text-primary" />
                    <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                </div>
                <p className="mt-1 text-muted-foreground">
                    Platform-wide overview
                </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <StatCard
                    icon={Users}
                    label="Total Users"
                    value={data?.totalUsers ?? 0}
                />
                <StatCard
                    icon={UserPlus}
                    label="Candidates"
                    value={data?.totalCandidates ?? 0}
                />
                <StatCard
                    icon={Shield}
                    label="Recruiters"
                    value={data?.totalRecruiters ?? 0}
                />
                <StatCard
                    icon={Briefcase}
                    label="Jobs"
                    value={data?.totalJobs ?? 0}
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

            {/* Recent Users */}
            <div className="mt-10">
                <h2 className="mb-4 text-xl font-semibold">Recent Users</h2>
                {data?.recentUsers && data.recentUsers.length > 0 ? (
                    <div className="grid gap-3">
                        {data.recentUsers.map((u) => (
                            <Card
                                key={u.id}
                                className="border-border/50 bg-card/50"
                            >
                                <CardContent className="flex items-center justify-between p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                                            {u.email[0]?.toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">
                                                {u.email}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                Joined{" "}
                                                {new Date(
                                                    u.createdAt,
                                                ).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <Badge variant="secondary">{u.role}</Badge>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground">
                        No users yet.
                    </p>
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
        <Card className="border-border/50 bg-card/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    {label}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
            </CardContent>
        </Card>
    );
}
