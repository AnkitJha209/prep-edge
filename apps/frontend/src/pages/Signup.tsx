import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/lib/api";
import { signUpSchema, type SignUpInput } from "@/lib/validators";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Sparkles, Loader2, Users, Shield, Brain } from "lucide-react";
import { toast } from "sonner";

export default function Signup() {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<SignUpInput>({
        resolver: zodResolver(signUpSchema),
        defaultValues: { role: "CANDIDATE" },
    });

    const mutation = useMutation({
        mutationFn: (data: SignUpInput) => authApi.signUp(data),
        onSuccess: () => {
            toast.success("Account created! Please sign in.");
            navigate("/login");
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || "Sign up failed");
        },
    });

    return (
        <div className="page-shell flex min-h-[calc(100vh-8rem)] items-center py-8">
            <div className="grid w-full gap-6 lg:grid-cols-[1fr_520px]">
                <Card className="hidden min-h-[40rem] lg:block">
                    <CardContent className="flex h-full flex-col justify-between p-10">
                        <div>
                            <span className="editorial-kicker">
                                Create Workspace
                            </span>
                            <h1 className="mt-6 max-w-lg text-5xl font-extrabold tracking-tight text-white">
                                Join as a candidate or recruiter without leaving
                                the same workflow.
                            </h1>
                            <p className="mt-5 max-w-xl text-lg leading-8 text-muted-foreground">
                                PrepEdge keeps both prep and screening inside
                                one consistent UI so progress, scores, and
                                hiring context stay connected.
                            </p>
                        </div>

                        <div className="grid gap-3">
                            {[
                                {
                                    icon: Users,
                                    title: "Candidate mode",
                                    description:
                                        "Resume match, voice interviews, and feedback loops.",
                                },
                                {
                                    icon: Shield,
                                    title: "Recruiter mode",
                                    description:
                                        "Post jobs, review applications, and compare signals quickly.",
                                },
                                {
                                    icon: Brain,
                                    title: "Shared AI layer",
                                    description:
                                        "A single scoring and analysis system across both sides.",
                                },
                            ].map((item) => (
                                <div
                                    key={item.title}
                                    className="rounded-[1.4rem] border border-border/70 bg-white/[0.04] p-4"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                                            <item.icon className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-white">
                                                {item.title}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {item.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="w-full">
                    <CardHeader className="text-center">
                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-[1.35rem] border border-primary/30 bg-primary/12 text-primary">
                            <Sparkles className="h-6 w-6" />
                        </div>
                        <CardTitle className="text-3xl">
                            Create your account
                        </CardTitle>
                        <CardDescription>
                            Start your PrepEdge workflow in minutes.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form
                            onSubmit={handleSubmit((d) => mutation.mutate(d))}
                            className="space-y-4"
                        >
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName">
                                        First Name
                                    </Label>
                                    <Input
                                        id="firstName"
                                        placeholder="John"
                                        {...register("firstName")}
                                    />
                                    {errors.firstName && (
                                        <p className="text-xs text-destructive">
                                            {errors.firstName.message}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName">Last Name</Label>
                                    <Input
                                        id="lastName"
                                        placeholder="Doe"
                                        {...register("lastName")}
                                    />
                                    {errors.lastName && (
                                        <p className="text-xs text-destructive">
                                            {errors.lastName.message}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    {...register("email")}
                                />
                                {errors.email && (
                                    <p className="text-xs text-destructive">
                                        {errors.email.message}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    {...register("password")}
                                />
                                {errors.password && (
                                    <p className="text-xs text-destructive">
                                        {errors.password.message}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label>I am a</Label>
                                <Select
                                    defaultValue="CANDIDATE"
                                    onValueChange={(v) =>
                                        setValue(
                                            "role",
                                            v as "CANDIDATE" | "RECRUITER",
                                        )
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="CANDIDATE">
                                            Candidate
                                        </SelectItem>
                                        <SelectItem value="RECRUITER">
                                            Recruiter
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button
                                type="submit"
                                className="mt-2 w-full"
                                disabled={mutation.isPending}
                            >
                                {mutation.isPending ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : null}
                                Create Account
                            </Button>
                        </form>
                        <p className="mt-6 text-center text-sm text-muted-foreground">
                            Already have an account?{" "}
                            <Link
                                to="/login"
                                className="font-medium text-primary hover:underline"
                            >
                                Sign in
                            </Link>
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
