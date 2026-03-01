import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Sparkles,
    Mic,
    Brain,
    FileText,
    BarChart3,
    ArrowRight,
    Shield,
    Zap,
    Users,
} from "lucide-react";

const features = [
    {
        icon: FileText,
        title: "AI Resume Analysis",
        description:
            "Upload your resume and get instant AI-powered scoring against job requirements with detailed feedback.",
    },
    {
        icon: Mic,
        title: "Voice-Based Interviews",
        description:
            "Experience real-time AI interviews with natural voice interaction — speak your answers, get evaluated instantly.",
    },
    {
        icon: Brain,
        title: "Intelligent Evaluation",
        description:
            "Powered by Google Gemini, each answer is evaluated on technical accuracy, communication, and relevance.",
    },
    {
        icon: BarChart3,
        title: "Detailed Reports",
        description:
            "Get comprehensive interview reports with scores, strengths, weaknesses, and AI recommendations.",
    },
];

const stats = [
    { value: "AI-Powered", label: "Interview Engine" },
    { value: "Real-time", label: "Voice Processing" },
    { value: "Instant", label: "Resume Scoring" },
    { value: "Detailed", label: "Feedback Reports" },
];

export default function Landing() {
    return (
        <div className="relative">
            {/* Hero */}
            <section className="relative overflow-hidden px-4 pb-20 pt-24 sm:px-6 lg:pt-32">
                {/* Gradient orb */}
                <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2">
                    <div className="h-[500px] w-[800px] rounded-full bg-primary/8 blur-3xl" />
                </div>

                <div className="relative mx-auto max-w-5xl text-center">
                    <Badge
                        variant="secondary"
                        className="mb-6 gap-1.5 px-3 py-1.5"
                    >
                        <Sparkles className="h-3.5 w-3.5" />
                        AI-Powered Interview Platform
                    </Badge>

                    <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                        Ace Your Next Interview
                        <br />
                        <span className="text-primary">
                            with AI Preparation
                        </span>
                    </h1>

                    <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
                        PrepEdge uses advanced AI to analyze your resume,
                        conduct realistic voice interviews, and provide detailed
                        performance reports — giving you the edge you need.
                    </p>

                    <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <Link to="/signup">
                            <Button size="lg" className="gap-2 px-8 text-base">
                                Get Started Free
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </Link>
                        <Link to="/jobs">
                            <Button
                                variant="outline"
                                size="lg"
                                className="gap-2 px-8 text-base"
                            >
                                Browse Jobs
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="border-y border-border/50 bg-card/30 px-4 py-12 sm:px-6">
                <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 lg:grid-cols-4">
                    {stats.map((stat) => (
                        <div key={stat.label} className="text-center">
                            <div className="text-2xl font-bold text-primary">
                                {stat.value}
                            </div>
                            <div className="mt-1 text-sm text-muted-foreground">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Features */}
            <section className="px-4 py-24 sm:px-6">
                <div className="mx-auto max-w-5xl">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                            Everything you need to{" "}
                            <span className="text-primary">prepare & hire</span>
                        </h2>
                        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
                            Whether you're a candidate preparing for interviews
                            or a recruiter evaluating talent, PrepEdge has the
                            tools you need.
                        </p>
                    </div>

                    <div className="mt-16 grid gap-6 sm:grid-cols-2">
                        {features.map((feature) => (
                            <Card
                                key={feature.title}
                                className="border-border/50 bg-card/50 transition-colors hover:border-primary/30"
                            >
                                <CardContent className="p-6">
                                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                        <feature.icon className="h-5 w-5 text-primary" />
                                    </div>
                                    <h3 className="mb-2 text-lg font-semibold">
                                        {feature.title}
                                    </h3>
                                    <p className="text-sm leading-relaxed text-muted-foreground">
                                        {feature.description}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* How it works */}
            <section className="border-t border-border/50 bg-card/20 px-4 py-24 sm:px-6">
                <div className="mx-auto max-w-5xl">
                    <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
                        How it works
                    </h2>
                    <div className="mt-16 grid gap-8 sm:grid-cols-3">
                        {[
                            {
                                step: "01",
                                icon: FileText,
                                title: "Upload Resume",
                                desc: "Submit your resume to get AI-powered analysis and matching score for any job listing.",
                            },
                            {
                                step: "02",
                                icon: Mic,
                                title: "AI Interview",
                                desc: "Start a voice-based interview session. The AI asks tailored questions and listens to your answers.",
                            },
                            {
                                step: "03",
                                icon: BarChart3,
                                title: "Get Report",
                                desc: "Receive a detailed report with scores, strengths, weaknesses, and improvement suggestions.",
                            },
                        ].map((item) => (
                            <div key={item.step} className="text-center">
                                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
                                    {item.step}
                                </div>
                                <h3 className="mb-2 text-lg font-semibold">
                                    {item.title}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA for both roles */}
            <section className="px-4 py-24 sm:px-6">
                <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2">
                    <Card className="border-border/50 bg-card/50">
                        <CardContent className="p-8">
                            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                <Users className="h-5 w-5 text-primary" />
                            </div>
                            <h3 className="mb-2 text-xl font-bold">
                                For Candidates
                            </h3>
                            <p className="mb-6 text-sm text-muted-foreground">
                                Browse jobs, get your resume scored, practice
                                with AI interviews, and track your progress —
                                all in one place.
                            </p>
                            <Link to="/signup">
                                <Button className="gap-2">
                                    Sign Up as Candidate{" "}
                                    <ArrowRight className="h-4 w-4" />
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                    <Card className="border-border/50 bg-card/50">
                        <CardContent className="p-8">
                            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                <Shield className="h-5 w-5 text-primary" />
                            </div>
                            <h3 className="mb-2 text-xl font-bold">
                                For Recruiters
                            </h3>
                            <p className="mb-6 text-sm text-muted-foreground">
                                Post jobs, review AI-scored applications, manage
                                candidates, and let the AI handle first-round
                                interviews.
                            </p>
                            <Link to="/signup">
                                <Button variant="outline" className="gap-2">
                                    Sign Up as Recruiter{" "}
                                    <ArrowRight className="h-4 w-4" />
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Final CTA */}
            <section className="border-t border-border/50 px-4 py-20 sm:px-6">
                <div className="mx-auto max-w-3xl text-center">
                    <Zap className="mx-auto mb-4 h-8 w-8 text-primary" />
                    <h2 className="text-3xl font-bold tracking-tight">
                        Ready to get your edge?
                    </h2>
                    <p className="mt-4 text-muted-foreground">
                        Join PrepEdge today and experience the future of
                        interview preparation.
                    </p>
                    <Link to="/signup">
                        <Button size="lg" className="mt-8 gap-2 px-8">
                            Start Now — It&apos;s Free
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    );
}
