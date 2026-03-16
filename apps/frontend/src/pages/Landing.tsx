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
    ScanSearch,
    Briefcase,
    CheckCircle2,
    Radar,
    CircleDashed,
    Stars,
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

const painPoints = [
    {
        title: "Preparation Feels Random",
        description:
            "Candidates practice in the dark without knowing if their resume or answers actually match the role.",
    },
    {
        title: "Hiring Still Runs on Guesswork",
        description:
            "Recruiters waste hours reading resumes without fast signal on skill fit, delivery, and communication.",
    },
    {
        title: "No Shared View of Readiness",
        description:
            "PrepEdge gives both sides a clearer picture with resume analysis, structured interviews, and evidence-backed scoring.",
    },
];

const workflow = [
    {
        step: "01",
        label: "Initialization",
        title: "Upload Resume",
        description:
            "Analyze resumes against live job expectations and surface strengths, gaps, and match score instantly.",
        tone: "border-amber-500/40 bg-amber-500/10 text-amber-200",
    },
    {
        step: "02",
        label: "Simulation",
        title: "Run the AI Interview",
        description:
            "Practice with voice-based questions tailored to the role so answers feel closer to a real screening round.",
        tone: "border-violet-500/40 bg-violet-500/10 text-violet-200",
    },
    {
        step: "03",
        label: "Verification",
        title: "Review the Report",
        description:
            "Get score breakdowns, improvement signals, and recruiter-ready insight instead of vague feedback.",
        tone: "border-emerald-500/40 bg-emerald-500/10 text-emerald-200",
    },
];

export default function Landing() {
    return (
        <div className="relative pb-8">
            <section className="page-shell relative overflow-hidden pt-16 lg:pt-24">
                <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
                    <div>
                        <span className="editorial-kicker">
                            <Sparkles className="h-3.5 w-3.5 text-primary" />
                            AI Interview Platform
                        </span>
                        <h1 className="mt-6 max-w-4xl text-balance text-5xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl">
                            Prepare smarter.
                            <br />
                            Hire with proof.
                        </h1>
                        <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
                            PrepEdge turns resume uploads, role fit analysis,
                            voice interviews, and post-round reports into one
                            evidence-first workflow for candidates and
                            recruiters.
                        </p>
                        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                            <Link to="/signup">
                                <Button size="lg" className="gap-2">
                                    Start Free
                                    <ArrowRight className="h-4 w-4" />
                                </Button>
                            </Link>
                            <Link to="/jobs">
                                <Button variant="outline" size="lg">
                                    Browse Open Roles
                                </Button>
                            </Link>
                        </div>
                        <div className="mt-8 flex flex-wrap gap-6 text-sm text-muted-foreground">
                            <span className="flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-primary" />
                                Resume scoring in seconds
                            </span>
                            <span className="flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-primary" />
                                Voice-led interview practice
                            </span>
                            <span className="flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-primary" />
                                Recruiter-ready reports
                            </span>
                        </div>
                    </div>

                    <div className="glass-panel relative overflow-hidden rounded-[2rem] p-3">
                        <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-primary/15 blur-3xl" />
                        <div className="absolute -bottom-20 left-0 h-40 w-40 rounded-full bg-amber-400/10 blur-3xl" />
                        <div className="rounded-[1.5rem] border border-white/6 bg-black/20 p-6">
                            <div className="flex items-center justify-between border-b border-border/70 pb-4">
                                <div>
                                    <p className="font-mono text-[0.66rem] uppercase tracking-[0.28em] text-muted-foreground">
                                        Prep Dashboard
                                    </p>
                                    <h3 className="mt-2 text-xl font-bold">
                                        Candidate Readiness Console
                                    </h3>
                                </div>
                                <Badge className="gap-1.5">
                                    <Radar className="h-3 w-3" /> 91 Match
                                </Badge>
                            </div>

                            <div className="mt-6 grid gap-3 sm:grid-cols-3">
                                {stats.map((stat) => (
                                    <div
                                        key={stat.label}
                                        className="rounded-[1.35rem] border border-border/70 bg-white/[0.04] p-4"
                                    >
                                        <p className="text-2xl font-bold text-white">
                                            {stat.value}
                                        </p>
                                        <p className="mt-2 text-xs uppercase tracking-[0.22em] text-muted-foreground">
                                            {stat.label}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 grid gap-3 lg:grid-cols-[1.2fr_0.8fr]">
                                <div className="rounded-[1.35rem] border border-border/70 bg-white/[0.04] p-4">
                                    <div className="mb-4 flex items-center justify-between">
                                        <p className="font-medium text-white">
                                            Interview Pipeline
                                        </p>
                                        <span className="font-mono text-[0.68rem] uppercase tracking-[0.24em] text-muted-foreground">
                                            Live
                                        </span>
                                    </div>
                                    <div className="space-y-3">
                                        {[
                                            {
                                                name: "Resume Analysis",
                                                score: "92/100",
                                                tone: "bg-amber-400",
                                            },
                                            {
                                                name: "Voice Interview",
                                                score: "In Progress",
                                                tone: "bg-primary",
                                            },
                                            {
                                                name: "Final Report",
                                                score: "Queued",
                                                tone: "bg-emerald-400",
                                            },
                                        ].map((item) => (
                                            <div
                                                key={item.name}
                                                className="flex items-center justify-between rounded-2xl border border-border/60 bg-black/20 px-4 py-3"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span
                                                        className={`h-2.5 w-2.5 rounded-full ${item.tone}`}
                                                    />
                                                    <span className="text-sm font-medium">
                                                        {item.name}
                                                    </span>
                                                </div>
                                                <span className="text-xs text-muted-foreground">
                                                    {item.score}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="rounded-[1.35rem] border border-border/70 bg-white/[0.04] p-4">
                                    <p className="font-medium text-white">
                                        Signal Snapshot
                                    </p>
                                    <div className="mt-4 space-y-4">
                                        {[
                                            {
                                                icon: ScanSearch,
                                                label: "Resume clarity",
                                                value: "High",
                                            },
                                            {
                                                icon: Mic,
                                                label: "Delivery confidence",
                                                value: "Strong",
                                            },
                                            {
                                                icon: Brain,
                                                label: "Role alignment",
                                                value: "91%",
                                            },
                                        ].map((item) => (
                                            <div
                                                key={item.label}
                                                className="flex items-center justify-between rounded-2xl border border-border/60 bg-black/20 px-4 py-3"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <item.icon className="h-4 w-4 text-primary" />
                                                    <span className="text-sm text-muted-foreground">
                                                        {item.label}
                                                    </span>
                                                </div>
                                                <span className="text-sm font-semibold text-white">
                                                    {item.value}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="border-y border-border/70 bg-black/10 py-24">
                <div className="page-shell py-0">
                    <div className="grid gap-10 md:grid-cols-[0.8fr_1.2fr] md:items-start">
                        <div>
                            <span className="editorial-kicker">
                                The Challenge
                            </span>
                            <h2 className="mt-5 text-4xl font-extrabold tracking-tight sm:text-5xl">
                                Interview prep and hiring both suffer when the
                                signal is weak.
                            </h2>
                        </div>
                        <div className="grid gap-5 md:grid-cols-3">
                            {painPoints.map((item) => (
                                <div
                                    key={item.title}
                                    className="rounded-[1.6rem] border-2 border-dashed border-border/80 bg-white/[0.04] p-6 transition-colors hover:border-white/20 hover:bg-white/[0.06]"
                                >
                                    <div className="mb-4 font-mono text-[0.68rem] uppercase tracking-[0.24em] text-muted-foreground">
                                        // Pain Point
                                    </div>
                                    <h3 className="text-lg font-bold text-white">
                                        {item.title}
                                    </h3>
                                    <p className="mt-3 text-sm leading-7 text-muted-foreground">
                                        {item.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="page-shell py-28">
                <div className="mx-auto max-w-3xl text-center">
                    <span className="editorial-kicker">How It Works</span>
                    <h2 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-5xl">
                        From resume upload to interview report.
                    </h2>
                    <p className="mt-5 text-lg leading-8 text-muted-foreground">
                        The workflow stays structured, visual, and fast so both
                        candidates and recruiters can make better calls with
                        less friction.
                    </p>
                </div>

                <div className="relative mx-auto mt-16 max-w-5xl">
                    <div className="absolute left-4 top-0 h-full w-px bg-border/80 md:left-1/2" />
                    <div className="space-y-12 md:space-y-16">
                        {workflow.map((item, index) => (
                            <div
                                key={item.step}
                                className={`relative grid gap-6 md:grid-cols-2 md:items-center ${index % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""}`}
                            >
                                <div
                                    className={
                                        index % 2 === 0
                                            ? "md:pr-12 md:text-right"
                                            : "md:pl-12"
                                    }
                                >
                                    <div
                                        className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl border font-mono text-base font-bold ${item.tone}`}
                                    >
                                        {item.step}
                                    </div>
                                    <p className="font-mono text-[0.7rem] uppercase tracking-[0.28em] text-muted-foreground">
                                        {item.label}
                                    </p>
                                    <h3 className="mt-3 text-3xl font-bold tracking-tight text-white">
                                        {item.title}
                                    </h3>
                                    <p className="mt-4 text-base leading-8 text-muted-foreground">
                                        {item.description}
                                    </p>
                                </div>

                                <div className="glass-panel relative rounded-[1.8rem] p-5">
                                    <div className="rounded-[1.45rem] border border-white/6 bg-black/20 p-5">
                                        {index === 0 && (
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between rounded-2xl border border-border/60 bg-white/[0.04] p-4">
                                                    <div className="flex items-center gap-3">
                                                        <FileText className="h-4 w-4 text-amber-300" />
                                                        <span className="text-sm font-medium">
                                                            Resume uploaded
                                                        </span>
                                                    </div>
                                                    <Badge variant="secondary">
                                                        Parsing
                                                    </Badge>
                                                </div>
                                                <div className="rounded-2xl border border-border/60 bg-white/[0.04] p-4">
                                                    <div className="mb-3 flex items-center justify-between text-sm">
                                                        <span className="text-muted-foreground">
                                                            Match Score
                                                        </span>
                                                        <span className="font-semibold text-white">
                                                            86/100
                                                        </span>
                                                    </div>
                                                    <div className="h-2.5 rounded-full bg-white/[0.05]">
                                                        <div className="h-2.5 w-[86%] rounded-full bg-amber-300" />
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        {index === 1 && (
                                            <div className="grid gap-3">
                                                {[
                                                    "Tell me about a system you shipped.",
                                                    "How would you debug latency spikes?",
                                                    "Explain a tradeoff you made recently.",
                                                ].map((question, itemIndex) => (
                                                    <div
                                                        key={question}
                                                        className={`rounded-2xl border px-4 py-3 text-sm ${itemIndex === 1 ? "border-primary/30 bg-primary/10 text-white" : "border-border/60 bg-white/[0.04] text-muted-foreground"}`}
                                                    >
                                                        {question}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        {index === 2 && (
                                            <div className="grid gap-3 sm:grid-cols-3">
                                                {[
                                                    {
                                                        icon: Briefcase,
                                                        label: "Role fit",
                                                        value: "Strong",
                                                    },
                                                    {
                                                        icon: Stars,
                                                        label: "Clarity",
                                                        value: "Clear",
                                                    },
                                                    {
                                                        icon: BarChart3,
                                                        label: "Overall",
                                                        value: "89",
                                                    },
                                                ].map((block) => (
                                                    <div
                                                        key={block.label}
                                                        className="rounded-2xl border border-border/60 bg-white/[0.04] p-4"
                                                    >
                                                        <block.icon className="h-4 w-4 text-emerald-300" />
                                                        <p className="mt-4 text-xs uppercase tracking-[0.22em] text-muted-foreground">
                                                            {block.label}
                                                        </p>
                                                        <p className="mt-2 text-xl font-bold text-white">
                                                            {block.value}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="border-y border-border/70 bg-black/10 py-24">
                <div className="page-shell py-0">
                    <div className="mb-14 max-w-3xl">
                        <span className="editorial-kicker">What You Get</span>
                        <h2 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-5xl">
                            The complete preparation and hiring stack.
                        </h2>
                        <p className="mt-5 text-lg leading-8 text-muted-foreground">
                            PrepEdge keeps the interface dense, readable, and
                            evidence-driven across candidate prep and recruiter
                            workflows.
                        </p>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-4">
                        <Card className="lg:col-span-2">
                            <CardContent className="p-8">
                                <div className="mb-6 flex items-center gap-3">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                                        <Users className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold">
                                            Candidate Command Center
                                        </h3>
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            One place to browse roles, score
                                            resumes, and review interview
                                            performance.
                                        </p>
                                    </div>
                                </div>
                                <div className="grid gap-3">
                                    {[
                                        "Resume scorecards and missing-skill highlights",
                                        "Voice practice with structured AI prompts",
                                        "Post-interview summaries and recommendations",
                                    ].map((item) => (
                                        <div
                                            key={item}
                                            className="flex items-center gap-3 rounded-2xl border border-border/70 bg-white/[0.04] px-4 py-3 text-sm text-muted-foreground"
                                        >
                                            <CircleDashed className="h-4 w-4 text-primary" />
                                            {item}
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-8">
                                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400/12 text-amber-300">
                                    <Shield className="h-5 w-5" />
                                </div>
                                <h3 className="text-xl font-bold">
                                    Recruiter Review Surface
                                </h3>
                                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                                    Track jobs, compare applicants, and use AI
                                    summaries to move faster through the funnel.
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-8">
                                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400/12 text-emerald-300">
                                    <Zap className="h-5 w-5" />
                                </div>
                                <h3 className="text-xl font-bold">
                                    Faster Decision Loops
                                </h3>
                                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                                    Replace manual guesswork with clearer fit
                                    signals, consistent scoring, and better
                                    follow-up actions.
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
                        {features.map((feature) => (
                            <Card
                                key={feature.title}
                                className="transition-colors hover:border-white/20"
                            >
                                <CardContent className="p-6">
                                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                                        <feature.icon className="h-5 w-5" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-white">
                                        {feature.title}
                                    </h3>
                                    <p className="mt-3 text-sm leading-7 text-muted-foreground">
                                        {feature.description}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            <section className="page-shell py-24">
                <div className="grid gap-6 lg:grid-cols-2">
                    <Card>
                        <CardContent className="p-8">
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                                <Users className="h-5 w-5" />
                            </div>
                            <h3 className="text-2xl font-bold">
                                For Candidates
                            </h3>
                            <p className="mt-4 text-sm leading-7 text-muted-foreground">
                                Practice with role-specific interviews, measure
                                resume fit, and walk into the actual call with a
                                clearer view of your weak spots.
                            </p>
                            <Link to="/signup" className="mt-6 inline-flex">
                                <Button className="gap-2">
                                    Create Candidate Account
                                    <ArrowRight className="h-4 w-4" />
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-8">
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400/12 text-amber-300">
                                <Shield className="h-5 w-5" />
                            </div>
                            <h3 className="text-2xl font-bold">
                                For Recruiters
                            </h3>
                            <p className="mt-4 text-sm leading-7 text-muted-foreground">
                                Post roles, review AI-assisted analysis, and
                                keep candidate signal centralized across the
                                first screening workflow.
                            </p>
                            <Link to="/signup" className="mt-6 inline-flex">
                                <Button variant="outline" className="gap-2">
                                    Create Recruiter Account
                                    <ArrowRight className="h-4 w-4" />
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </section>

            <section className="page-shell pt-0">
                <div className="glass-panel rounded-[2rem] px-6 py-12 text-center sm:px-10">
                    <Sparkles className="mx-auto h-8 w-8 text-primary" />
                    <h2 className="mt-5 text-4xl font-extrabold tracking-tight sm:text-5xl">
                        Build more confidence before the interview starts.
                    </h2>
                    <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
                        PrepEdge brings together resume analysis, AI interviews,
                        and recruiter-facing insights inside one consistent
                        visual workflow.
                    </p>
                    <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                        <Link to="/signup">
                            <Button size="lg" className="gap-2">
                                Get Started
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </Link>
                        <Link to="/jobs">
                            <Button size="lg" variant="outline">
                                Explore Jobs
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
