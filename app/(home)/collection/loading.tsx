import Filters from "@/Components/Generic/Filters";
import { LocalSearchBar } from "@/Components/Generic/LocalSearchBar";
import { Skeleton } from "@/Components/Shadcn/skeleton";
import { QuestionFilters } from "@/Constants/filters";

export default function Loading() {
    return (
        <main className="flex min-h-screen max-w-5xl flex-1 flex-col gap-7 max-sm:gap-5">
            <h1 className="h1-bold max-sm:h3-bold text-dark300_light900">Saved Questions</h1>
            <div className="flex w-full gap-5 max-md:gap-3 max-sm:flex-col">
                <LocalSearchBar placeholder="Search your saved collections" assetIcon="search" />
                <div className="rounded-[7px]">
                    <Filters type="menu-list" filterData={QuestionFilters} defaultFilterValue="most_recent" />
                </div>
            </div>

            <div className="mb-12 mt-11 flex flex-wrap gap-4">
                <Skeleton className="h-14 flex-1" />
                <Skeleton className="h-14 w-28" />
            </div>

            <div className="flex w-full flex-col gap-6">
                {Array.from({ length: 10 }).map((_, index) => (
                    <Skeleton
                        key={index}
                        className="flex h-60 flex-col items-start justify-center gap-5 rounded-[10px] px-6 py-8 max-sm:px-4 max-sm:py-5"
                    />
                ))}
            </div>
        </main>
    );
}
