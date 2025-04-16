import { Skeleton } from "@/Components/Shadcn/skeleton";

export default function Loading() {
    return (
        <main className="flex min-h-screen max-w-5xl flex-1 flex-col gap-7 max-sm:gap-5">
            {/* Title and Ask Question button */}
            <div className="flex flex-col-reverse">
                <Skeleton className="h-10 w-48 max-sm:h-8" />
                <Skeleton className="h-12 w-36 self-end rounded-[7px] max-sm:h-10 max-sm:w-32" />
            </div>

            {/* Search and filters */}
            <div className="flex w-full gap-5 max-md:flex-row max-md:justify-between max-sm:flex-col max-sm:gap-3 md:flex-col">
                <Skeleton className="h-14 w-full rounded-[7px]" />
                <Skeleton className="h-14 rounded-[7px] max-md:w-40 md:w-full" />
                <Skeleton className="h-14 w-40 rounded-[7px] md:hidden" />
            </div>

            {/* Question cards */}
            <div className="flex w-full flex-col gap-6">
                {Array.from({ length: 5 }).map((_, index) => (
                    <Skeleton key={index} className="h-48 w-full rounded-xl p-4" />
                ))}
            </div>
        </main>
    );
}
