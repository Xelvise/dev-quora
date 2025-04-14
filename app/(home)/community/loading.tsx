import Filters from "@/Components/Generic/Filters";
import { LocalSearchBar } from "@/Components/Generic/LocalSearchBar";
import { Skeleton } from "@/Components/Shadcn/skeleton";
import { UserFilters } from "@/Constants/filters";

export default function Loading() {
    return (
        <main className="flex min-h-screen max-w-5xl flex-1 flex-col gap-7">
            <h1 className="h1-bold max-sm:h3-bold text-dark300_light900">All Users</h1>
            <div className="flex w-full gap-5 max-md:gap-3 max-sm:flex-col">
                <LocalSearchBar placeholder="Search Users by name or username..." assetIcon="search" />
                <div className="rounded-[7px]">
                    <Filters type="menu-list" filterData={UserFilters} defaultFilterValue="new_users" />
                </div>
            </div>

            <div className="mb-12 mt-11 flex flex-wrap gap-4">
                <Skeleton className="h-14 flex-1" />
                <Skeleton className="h-14 w-28" />
            </div>

            <div className="flex flex-wrap gap-4">
                {Array.from({ length: 10 }).map((_, index) => (
                    <Skeleton key={index} className="h-60 rounded-2xl max-xs:min-w-full xs:w-[260px]" />
                ))}
            </div>
        </main>
    );
}
