import { fetchUsers } from "@/Backend/Server-Side/Actions/user.action";
import UserCard from "@/Components/Cards/UserCard";
import FilterSelector from "@/Components/Shared/FilterSelector";
import NoResults from "@/Components/Shared/NoResults";
import SearchBar from "@/Components/Shared/SearchBar";
import { UserFilters } from "@/Constants/filters";

export default async function Community() {
    const { users } = await fetchUsers({ sortBy: "newest-to-oldest" });
    return (
        <main className="flex min-h-screen max-w-5xl flex-1 flex-col gap-7">
            <h1 className="h1-bold text-dark300_light900">All Users</h1>

            <div className="flex w-full gap-5 max-md:gap-3 max-sm:flex-col">
                <SearchBar placeholder="Search amazing minds here..." assetIcon="search" />
                <div className="rounded-[7px] border">
                    <FilterSelector filters={UserFilters} placeholder="Select a Filter" />
                </div>
            </div>

            <section className="flex flex-wrap gap-4">
                {users.length > 0 ? (
                    users.map(user => <UserCard key={user.id} user={user} />)
                ) : (
                    <NoResults title="No Users yet" />
                )}
            </section>
        </main>
    );
}
