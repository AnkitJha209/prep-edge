import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="skeleton"
            className={cn(
                "bg-white/[0.08] animate-pulse rounded-2xl",
                className,
            )}
            {...props}
        />
    );
}

export { Skeleton };
