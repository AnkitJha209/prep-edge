import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { jobApi } from "@/lib/api";
import type { Job } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Briefcase,
    MapPin,
    MoreVertical,
    Plus,
    Trash2,
    ToggleLeft,
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

export default function RecruiterJobs() {
    const queryClient = useQueryClient();

    const { data: jobs, isLoading } = useQuery({
        queryKey: ["recruiter-jobs"],
        queryFn: async () => {
            const res = await jobApi.getMyJobs();
            return (res.data.jobs ?? []) as Job[];
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (jobId: string) => jobApi.delete(jobId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["recruiter-jobs"] });
            toast.success("Job deleted");
        },
        onError: () => toast.error("Failed to delete job"),
    });

    const statusMutation = useMutation({
        mutationFn: ({ jobId, status }: { jobId: string; status: string }) =>
            jobApi.updateStatus(jobId, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["recruiter-jobs"] });
            toast.success("Status updated");
        },
        onError: () => toast.error("Failed to update status"),
    });

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">My Jobs</h1>
                    <p className="mt-1 text-muted-foreground">
                        Manage your posted jobs
                    </p>
                </div>
                <Link to="/recruiter/jobs/create">
                    <Button className="gap-2">
                        <Plus className="h-4 w-4" /> Post New Job
                    </Button>
                </Link>
            </div>

            {isLoading ? (
                <div className="grid gap-4">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-24 rounded-xl" />
                    ))}
                </div>
            ) : jobs && jobs.length > 0 ? (
                <div className="grid gap-4">
                    {jobs.map((job) => (
                        <Card
                            key={job.id}
                            className="border-border/50 bg-card/50"
                        >
                            <CardContent className="flex items-center justify-between p-5">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                        <Briefcase className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">
                                            {job.title}
                                        </h3>
                                        <div className="mt-0.5 flex items-center gap-3 text-sm text-muted-foreground">
                                            {job.location && (
                                                <span className="flex items-center gap-1">
                                                    <MapPin className="h-3 w-3" />{" "}
                                                    {job.location}
                                                </span>
                                            )}
                                            <span>
                                                {job.type.replace("_", " ")}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Badge
                                        variant={
                                            job.status === "ACTIVE"
                                                ? "default"
                                                : "secondary"
                                        }
                                    >
                                        {job.status}
                                    </Badge>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm">
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem
                                                onClick={() =>
                                                    statusMutation.mutate({
                                                        jobId: job.id,
                                                        status:
                                                            job.status ===
                                                            "ACTIVE"
                                                                ? "CLOSED"
                                                                : "ACTIVE",
                                                    })
                                                }
                                            >
                                                <ToggleLeft className="mr-2 h-4 w-4" />
                                                {job.status === "ACTIVE"
                                                    ? "Close"
                                                    : "Reactivate"}
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                className="text-destructive"
                                                onClick={() =>
                                                    deleteMutation.mutate(
                                                        job.id,
                                                    )
                                                }
                                            >
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card className="border-border/50 bg-card/30">
                    <CardContent className="flex flex-col items-center justify-center py-16">
                        <Briefcase className="mb-3 h-10 w-10 text-muted-foreground/50" />
                        <p className="text-muted-foreground">
                            You haven&apos;t posted any jobs yet
                        </p>
                        <Link to="/recruiter/jobs/create" className="mt-3">
                            <Button size="sm">Post Your First Job</Button>
                        </Link>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
