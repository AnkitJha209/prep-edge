import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer className="mt-10 border-t border-border/70 bg-black/10">
            <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
                <div className="flex flex-col items-center justify-between gap-8 border-b border-border/70 pb-8 md:flex-row md:items-start">
                    <div className="flex flex-col items-center gap-3 text-center md:items-start md:text-left">
                        <div className="flex items-center gap-3">
                            <div className="h-6 w-1.5 rounded-full bg-primary" />
                            <span className="text-lg font-extrabold tracking-tight">
                                PrepEdge
                            </span>
                        </div>
                        <p className="text-sm italic text-muted-foreground">
                            AI-powered interview prep and hiring workflows.
                        </p>
                        <p className="max-w-sm text-xs leading-6 text-muted-foreground/80">
                            Resume scoring, mock interviews, and recruiter
                            review tools in one evidence-first workflow.
                        </p>
                    </div>
                    <div className="flex flex-col items-center gap-4 md:items-end">
                        <span className="font-mono text-[0.62rem] uppercase tracking-[0.28em] text-muted-foreground">
                            Navigate
                        </span>
                        <nav className="flex gap-3 text-sm text-muted-foreground">
                            <Link
                                to="/jobs"
                                className="rounded-full border border-border/70 px-4 py-2 transition-colors hover:border-white/20 hover:text-foreground"
                            >
                                Jobs
                            </Link>
                            <Link
                                to="/login"
                                className="rounded-full border border-border/70 px-4 py-2 transition-colors hover:border-white/20 hover:text-foreground"
                            >
                                Sign In
                            </Link>
                            <Link
                                to="/signup"
                                className="rounded-full border border-border/70 px-4 py-2 transition-colors hover:border-white/20 hover:text-foreground"
                            >
                                Sign Up
                            </Link>
                        </nav>
                    </div>
                </div>
                <div className="flex flex-col items-center justify-between gap-3 pt-5 text-center md:flex-row md:text-left">
                    <p className="text-xs text-muted-foreground">
                        &copy; {new Date().getFullYear()} PrepEdge. All rights
                        reserved.
                    </p>
                    <p className="text-xs text-muted-foreground/80">
                        Built for candidates, recruiters, and teams that want
                        signal over guesswork.
                    </p>
                </div>
            </div>
        </footer>
    );
}
