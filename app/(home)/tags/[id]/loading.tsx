import { Skeleton } from "@/Components/Shadcn/skeleton";

export default function Loading() {
    return (
        <main className="flex min-h-screen max-w-5xl flex-1 flex-col gap-7 max-sm:gap-5">
            {/* Title skeleton */}
            <Skeleton className="h-10 w-64 max-sm:h-8" />

            {/* Search bar skeleton */}
            <div className="flex w-full">
                <Skeleton className="h-14 w-full rounded-[7px]" />
            </div>

            {/* Question cards skeleton */}
            <div className="flex w-full flex-col gap-6">
                {Array.from({ length: 5 }).map((_, index) => (
                    <Skeleton key={index} className="h-48 w-full rounded-xl p-4" />
                ))}
            </div>
        </main>
    );
}
