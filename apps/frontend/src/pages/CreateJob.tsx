import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { jobApi } from "@/lib/api";
import { createJobSchema, type CreateJobInput } from "@/lib/validators";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

export default function CreateJob() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<CreateJobInput>({
        resolver: zodResolver(createJobSchema),
        defaultValues: { type: "FULL_TIME" },
    });

    const mutation = useMutation({
        mutationFn: (data: CreateJobInput) => {
            const requirements = data.requirements
                .split(",")
                .map((r) => r.trim())
                .filter(Boolean);
            return jobApi.create({ ...data, requirements });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["recruiter-jobs"] });
            toast.success("Job posted successfully");
            navigate("/recruiter/jobs");
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || "Failed to create job");
        },
    });

    return (
        <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
            <Link
                to="/recruiter/jobs"
                className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
            >
                <ArrowLeft className="h-3.5 w-3.5" /> Back to My Jobs
            </Link>

            <Card className="border-border/50 bg-card/50">
                <CardHeader>
                    <CardTitle>Post a New Job</CardTitle>
                    <CardDescription>
                        Fill in the details to create a new job listing
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form
                        onSubmit={handleSubmit((d) => mutation.mutate(d))}
                        className="space-y-5"
                    >
                        <div className="space-y-2">
                            <Label htmlFor="title">Job Title</Label>
                            <Input
                                id="title"
                                placeholder="e.g. Senior Backend Developer"
                                {...register("title")}
                            />
                            {errors.title && (
                                <p className="text-xs text-destructive">
                                    {errors.title.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                placeholder="Describe the role, responsibilities, and team..."
                                rows={5}
                                {...register("description")}
                            />
                            {errors.description && (
                                <p className="text-xs text-destructive">
                                    {errors.description.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="requirements">
                                Requirements (comma-separated)
                            </Label>
                            <Input
                                id="requirements"
                                placeholder="e.g. React, Node.js, PostgreSQL, TypeScript"
                                {...register("requirements")}
                            />
                            {errors.requirements && (
                                <p className="text-xs text-destructive">
                                    {errors.requirements.message}
                                </p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="location">Location</Label>
                                <Input
                                    id="location"
                                    placeholder="e.g. Remote, NYC"
                                    {...register("location")}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="salary">Salary</Label>
                                <Input
                                    id="salary"
                                    placeholder="e.g. $120k - $150k"
                                    {...register("salary")}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Job Type</Label>
                            <Select
                                defaultValue="FULL_TIME"
                                onValueChange={(v) =>
                                    setValue("type", v as any)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="FULL_TIME">
                                        Full Time
                                    </SelectItem>
                                    <SelectItem value="PART_TIME">
                                        Part Time
                                    </SelectItem>
                                    <SelectItem value="CONTRACT">
                                        Contract
                                    </SelectItem>
                                    <SelectItem value="INTERNSHIP">
                                        Internship
                                    </SelectItem>
                                    <SelectItem value="FREELANCE">
                                        Freelance
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={mutation.isPending}
                        >
                            {mutation.isPending ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : null}
                            Post Job
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
