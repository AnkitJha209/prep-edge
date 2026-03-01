import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
    return (
        <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4">
            <h1 className="text-6xl font-bold text-primary">404</h1>
            <p className="mt-4 text-lg text-muted-foreground">Page not found</p>
            <Link to="/">
                <Button variant="outline" className="mt-6 gap-2">
                    <ArrowLeft className="h-4 w-4" /> Go Home
                </Button>
            </Link>
        </div>
    );
}
