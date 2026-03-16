import { useLocation, useNavigate } from "react-router-dom";
import type { Job } from "@/types";
import { useAppSelector } from "@/hooks/useStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
    Briefcase,
    MapPin,
    Clock,
    DollarSign,
    ArrowLeft,
    Upload,
    User,
} from "lucide-react";
import { Link } from "react-router-dom";

const JOB_TYPE_LABELS: Record<string, string> = {
    FULL_TIME: "Full Time",
    PART_TIME: "Part Time",
    CONTRACT: "Contract",
    INTERNSHIP: "Internship",
    FREELANCE: "Freelance",
};

export default function JobDetail() {
    const location = useLocation();
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAppSelector((s) => s.auth);

    // Job passed via router state
    const job = (location.state as { job?: Job })?.job;

    if (!job) {
        return (
            <div className="mx-auto max-w-3xl px-4 py-16 text-center">
                <p className="text-muted-foreground">
                    Job not found. Please go back to the listing.
                </p>
                <Link to="/jobs">
                    <Button variant="outline" className="mt-4 gap-2">
                        <ArrowLeft className="h-4 w-4" /> Back to Jobs
                    </Button>
                </Link>
            </div>
        );
    }

    const handleApply = () => {
        navigate(`/apply/${job.id}`, { state: { job } });
    };

    return (
        <div className="page-shell max-w-5xl">
            <Link
                to="/jobs"
                className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
                <ArrowLeft className="h-3.5 w-3.5" /> Back to Jobs
            </Link>

            <Card>
                <CardHeader>
                    <div className="flex items-start gap-4">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[1.35rem] bg-primary/12">
                            <Briefcase className="h-7 w-7 text-primary" />
                        </div>
                        <div className="flex-1">
                            <span className="editorial-kicker mb-4">
                                Role Detail
                            </span>
                            <CardTitle className="text-2xl">
                                {job.title}
                            </CardTitle>
                            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                                {job.location && (
                                    <span className="flex items-center gap-1">
                                        <MapPin className="h-3.5 w-3.5" />{" "}
                                        {job.location}
                                    </span>
                                )}
                                <span className="flex items-center gap-1">
                                    <Clock className="h-3.5 w-3.5" />{" "}
                                    {JOB_TYPE_LABELS[job.type] || job.type}
                                </span>
                                {job.salary && (
                                    <span className="flex items-center gap-1">
                                        <DollarSign className="h-3.5 w-3.5" />{" "}
                                        {job.salary}
                                    </span>
                                )}
                                <Badge
                                    variant={
                                        job.status === "ACTIVE"
                                            ? "default"
                                            : "secondary"
                                    }
                                >
                                    {job.status}
                                </Badge>
                            </div>
                            {job.recruiter && (
                                <p className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
                                    <User className="h-3.5 w-3.5" />
                                    Posted by {job.recruiter.firstName}{" "}
                                    {job.recruiter.lastName}
                                </p>
                            )}
                        </div>
                    </div>
                </CardHeader>

                <Separator />

                <CardContent className="p-6">
                    <div className="space-y-6">
                        <div>
                            <h3 className="mb-2 font-semibold">Description</h3>
                            <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                                {job.description}
                            </p>
                        </div>

                        {job.requirements.length > 0 && (
                            <div>
                                <h3 className="mb-3 font-semibold">
                                    Requirements
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {job.requirements.map((req, i) => (
                                        <Badge
                                            key={i}
                                            variant="secondary"
                                            className="font-normal"
                                        >
                                            {req}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Apply Button */}
                        {isAuthenticated &&
                            user?.role === "CANDIDATE" &&
                            job.status === "ACTIVE" && (
                                <div className="pt-4">
                                    <Button
                                        size="lg"
                                        className="gap-2"
                                        onClick={handleApply}
                                    >
                                        <Upload className="h-4 w-4" /> Apply Now
                                    </Button>
                                </div>
                            )}
                        {!isAuthenticated && (
                            <div className="pt-4">
                                <Link to="/login">
                                    <Button
                                        size="lg"
                                        variant="outline"
                                        className="gap-2"
                                    >
                                        Sign in to Apply
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
