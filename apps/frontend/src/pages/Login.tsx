import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/lib/api";
import { signInSchema, type SignInInput } from "@/lib/validators";
import { useAppDispatch } from "@/hooks/useStore";
import { setCredentials } from "@/store/slices/authSlice";
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
import { Sparkles, Loader2, Mic, FileText, BarChart3 } from "lucide-react";
import { toast } from "sonner";

export default function Login() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignInInput>({ resolver: zodResolver(signInSchema) });

    const mutation = useMutation({
        mutationFn: (data: SignInInput) => authApi.signIn(data),
        onSuccess: (res) => {
            const { token, user } = res.data;
            if (token) {
                dispatch(setCredentials({ token, user }));
                toast.success("Signed in successfully");
                navigate("/dashboard");
            }
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || "Sign in failed");
        },
    });

    return (
        <div className="page-shell flex min-h-[calc(100vh-8rem)] items-center">
            <div className="grid w-full gap-6 lg:grid-cols-[1fr_460px]">
                <Card className="hidden min-h-[36rem] lg:block">
                    <CardContent className="flex h-full flex-col justify-between p-10">
                        <div>
                            <span className="editorial-kicker">
                                Welcome Back
                            </span>
                            <h1 className="mt-6 max-w-lg text-5xl font-extrabold tracking-tight text-white">
                                Pick up exactly where your preparation left off.
                            </h1>
                            <p className="mt-5 max-w-xl text-lg leading-8 text-muted-foreground">
                                Resume fit, interview rounds, and recruiter
                                signals stay in one dark, focused workspace.
                            </p>
                        </div>

                        <div className="grid gap-3">
                            {[
                                {
                                    icon: FileText,
                                    title: "Resume analysis",
                                    description:
                                        "Re-open your latest fit report in seconds.",
                                },
                                {
                                    icon: Mic,
                                    title: "Voice interviews",
                                    description:
                                        "Jump back into AI-led practice sessions.",
                                },
                                {
                                    icon: BarChart3,
                                    title: "Clear reporting",
                                    description:
                                        "Track progress with structured evaluation.",
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
                        <CardTitle className="text-3xl">Sign in</CardTitle>
                        <CardDescription>
                            Access your PrepEdge workspace.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form
                            onSubmit={handleSubmit((d) => mutation.mutate(d))}
                            className="space-y-4"
                        >
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
                            <Button
                                type="submit"
                                className="mt-2 w-full"
                                disabled={mutation.isPending}
                            >
                                {mutation.isPending ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : null}
                                Sign In
                            </Button>
                        </form>
                        <p className="mt-6 text-center text-sm text-muted-foreground">
                            Don&apos;t have an account?{" "}
                            <Link
                                to="/signup"
                                className="font-medium text-primary hover:underline"
                            >
                                Create one
                            </Link>
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
