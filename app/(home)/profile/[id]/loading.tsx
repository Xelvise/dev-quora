import { Skeleton } from "@/Components/Shadcn/skeleton";

export default function Loading() {
    return (
        <main className="flex max-w-5xl flex-1 flex-col">
            <div className="flex items-start justify-between max-sm:flex-col-reverse">
                <div className="flex items-start gap-4 max-md:flex-col max-sm:gap-2">
                    {/* Profile image skeleton */}
                    <Skeleton className="h-[120px] w-[120px] rounded-full" />

                    <div className="mt-3 flex flex-col">
                        {/* User name skeleton */}
                        <Skeleton className="h-8 w-40 max-sm:h-6" />

                        {/* Username skeleton */}
                        <Skeleton className="mt-1 h-5 w-32 max-sm:h-4" />

                        {/* Profile links skeleton */}
                        <div className="mt-3 flex flex-wrap gap-5 max-sm:flex-col max-sm:gap-2 sm:items-center">
                            <Skeleton className="h-6 w-28 rounded-md" />
                            <Skeleton className="h-6 w-28 rounded-md" />
                            <Skeleton className="h-6 w-36 rounded-md" />
                        </div>

                        {/* Bio skeleton */}
                        <Skeleton className="mt-5 h-16 w-full" />
                    </div>
                </div>

                {/* Edit profile button skeleton */}
                <div className="flex justify-end max-sm:w-full sm:mt-3">
                    <Skeleton className="h-10 w-28 rounded-md" />
                </div>
            </div>

            {/* User stats skeleton */}
            <div className="mt-10 flex flex-wrap gap-10 border-y border-dark-300/80 py-5 dark:border-light-700">
                {Array.from({ length: 4 }).map((_, index) => (
                    <Skeleton key={index} className="h-16 w-28" />
                ))}
            </div>

            {/* Tabs skeleton */}
            <div className="mt-10 flex w-full flex-col gap-6">
                {/* Tab buttons skeleton */}
                <div className="flex gap-4">
                    <Skeleton className="h-10 w-28 rounded-md" />
                    <Skeleton className="h-10 w-28 rounded-md" />
                </div>

                {/* Question/Answer cards skeleton */}
                <div className="flex w-full flex-col gap-6">
                    {Array.from({ length: 3 }).map((_, index) => (
                        <Skeleton key={index} className="h-48 w-full rounded-xl p-4" />
                    ))}
                </div>
            </div>
        </main>
    );
}
