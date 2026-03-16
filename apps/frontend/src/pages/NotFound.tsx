import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
    return (
        <div className="page-shell flex min-h-[calc(100vh-8rem)] items-center justify-center">
            <div className="glass-panel max-w-2xl rounded-[2rem] px-8 py-14 text-center sm:px-12">
                <p className="font-mono text-[0.72rem] uppercase tracking-[0.3em] text-muted-foreground">
                    Lost in the workflow
                </p>
                <h1 className="mt-4 text-7xl font-extrabold text-primary">
                    404
                </h1>
                <p className="mt-4 text-lg leading-8 text-muted-foreground">
                    The page you requested does not exist or is no longer part
                    of this flow.
                </p>
                <Link to="/">
                    <Button variant="outline" className="mt-8 gap-2">
                        <ArrowLeft className="h-4 w-4" /> Go Home
                    </Button>
                </Link>
            </div>
        </div>
    );
}
