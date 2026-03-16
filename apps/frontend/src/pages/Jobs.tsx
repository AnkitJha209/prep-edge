import { useQuery } from "@tanstack/react-query";
import { jobApi } from "@/lib/api";
import type { Job } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Briefcase, MapPin, Clock, Search, DollarSign } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const JOB_TYPE_LABELS: Record<string, string> = {
    FULL_TIME: "Full Time",
    PART_TIME: "Part Time",
    CONTRACT: "Contract",
    INTERNSHIP: "Internship",
    FREELANCE: "Freelance",
};

export default function Jobs() {
    const [search, setSearch] = useState("");

    const { data: jobs, isLoading } = useQuery({
        queryKey: ["jobs"],
        queryFn: async () => {
            const res = await jobApi.getAll();
            return (res.data.jobs ?? []) as Job[];
        },
    });

    const filtered = jobs?.filter(
        (j) =>
            j.title.toLowerCase().includes(search.toLowerCase()) ||
            j.description.toLowerCase().includes(search.toLowerCase()) ||
            j.location?.toLowerCase().includes(search.toLowerCase()),
    );

    return (
        <div className="page-shell">
            <div className="mb-10">
                <span className="editorial-kicker">Open Roles</span>
                <h1 className="page-heading mt-5">Browse Jobs</h1>
                <p className="page-subtle mt-3 max-w-2xl">
                    Explore active opportunities, review requirements, and move
                    straight into the PrepEdge application flow.
                </p>
            </div>

            {/* Search */}
            <div className="relative mb-8 max-w-xl">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    placeholder="Search by title, description, or location..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-11"
                />
            </div>

            {isLoading ? (
                <div className="grid gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} className="h-28 rounded-xl" />
                    ))}
                </div>
            ) : filtered && filtered.length > 0 ? (
                <div className="grid gap-4">
                    {filtered.map((job) => (
                        <Link
                            key={job.id}
                            to={`/jobs/${job.id}`}
                            state={{ job }}
                        >
                            <Card className="transition-all hover:-translate-y-0.5 hover:border-white/20">
                                <CardContent className="p-5">
                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                        <div className="flex gap-4">
                                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                                                <Briefcase className="h-6 w-6 text-primary" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold">
                                                    {job.title}
                                                </h3>
                                                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                                                    {job.description}
                                                </p>
                                                <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                                                    {job.location && (
                                                        <span className="flex items-center gap-1">
                                                            <MapPin className="h-3.5 w-3.5" />{" "}
                                                            {job.location}
                                                        </span>
                                                    )}
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="h-3.5 w-3.5" />{" "}
                                                        {JOB_TYPE_LABELS[
                                                            job.type
                                                        ] || job.type}
                                                    </span>
                                                    {job.salary && (
                                                        <span className="flex items-center gap-1">
                                                            <DollarSign className="h-3.5 w-3.5" />{" "}
                                                            {job.salary}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex shrink-0 items-center gap-2">
                                            <Badge
                                                variant={
                                                    job.status === "ACTIVE"
                                                        ? "default"
                                                        : "secondary"
                                                }
                                                className="whitespace-nowrap"
                                            >
                                                {job.status}
                                            </Badge>
                                            <Button variant="outline" size="sm">
                                                View Details
                                            </Button>
                                        </div>
                                    </div>
                                    {job.requirements.length > 0 && (
                                        <div className="mt-3 flex flex-wrap gap-1.5 pl-16">
                                            {job.requirements
                                                .slice(0, 5)
                                                .map((req, i) => (
                                                    <Badge
                                                        key={i}
                                                        variant="secondary"
                                                        className="text-xs font-normal"
                                                    >
                                                        {req}
                                                    </Badge>
                                                ))}
                                            {job.requirements.length > 5 && (
                                                <Badge
                                                    variant="secondary"
                                                    className="text-xs font-normal"
                                                >
                                                    +
                                                    {job.requirements.length -
                                                        5}{" "}
                                                    more
                                                </Badge>
                                            )}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            ) : (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-16">
                        <Briefcase className="mb-3 h-10 w-10 text-muted-foreground/50" />
                        <p className="text-muted-foreground">
                            {search
                                ? "No jobs match your search"
                                : "No jobs available right now"}
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
