import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer className="border-t border-border/50 bg-background/50">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
                <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                    <div className="flex items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary">
                            <Sparkles className="h-3 w-3 text-primary-foreground" />
                        </div>
                        <span className="text-sm font-semibold">PrepEdge</span>
                    </div>
                    <nav className="flex gap-6 text-sm text-muted-foreground">
                        <Link
                            to="/jobs"
                            className="hover:text-foreground transition-colors"
                        >
                            Jobs
                        </Link>
                        <Link
                            to="/login"
                            className="hover:text-foreground transition-colors"
                        >
                            Sign In
                        </Link>
                        <Link
                            to="/signup"
                            className="hover:text-foreground transition-colors"
                        >
                            Sign Up
                        </Link>
                    </nav>
                    <p className="text-xs text-muted-foreground">
                        &copy; {new Date().getFullYear()} PrepEdge. All rights
                        reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
