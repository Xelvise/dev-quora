import { fetchUsers } from "@/Backend/Server-Side/Actions/user.action";
import { UserFilter } from "@/Backend/Server-Side/parameters";
import UserCard from "@/Components/Cards/UserCard";
import Filters from "@/Components/Generic/Filters";
import PopulateQuestionData from "@/Components/Generic/PopulateQuestionData";
import NoResults from "@/Components/Generic/NoResults";
import { LocalSearchBar } from "@/Components/Generic/SearchBar";
import { UserFilters } from "@/Constants/filters";

interface Props {
    searchParams: Promise<{
        q?: string;
        filter?: UserFilter;
        page?: string;
    }>;
}

export default async function Community({ searchParams }: Props) {
    const { q, filter, page } = await searchParams;
    const { users, hasMorePages } = await fetchUsers({ searchQuery: q, filter, page: page ? +page : 1 });
    return (
        <main className="flex min-h-screen max-w-5xl flex-1 flex-col gap-7">
            <h1 className="h1-bold text-dark300_light900">All Users</h1>

            <div className="flex w-full gap-5 max-md:gap-3 max-sm:flex-col">
                <LocalSearchBar placeholder="Search Users by name or username..." assetIcon="search" />
                <div className="rounded-[7px]">
                    <Filters type="menu-list" filterData={UserFilters} defaultFilterValue="new_users" />
                </div>
            </div>

            <section className="flex flex-wrap gap-4">
                {users.length > 0 ? (
                    users.map(user => <UserCard key={user.id} user={user} />)
                ) : (
                    <NoResults title="No Users yet" />
                )}
                {/* <PopulateQuestionData hasMorePages={hasMorePages} /> */}
            </section>
        </main>
    );
}
