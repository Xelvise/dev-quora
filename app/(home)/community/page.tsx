import { fetchUsers } from "@/Backend/Server-Side/Actions/user.action";
import { UserFilter } from "@/Backend/Server-Side/parameters";
import UserCard from "@/Components/Cards/UserCard";
import Filters from "@/Components/Generic/Filters";
import NoResults from "@/Components/Generic/NoResults";
import { LocalSearchBar } from "@/Components/Generic/LocalSearchBar";
import { UserFilters } from "@/Constants/filters";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Community | DevQuora",
    description:
        "A community-driven platform for asking and answering programming questions. Get help, share knowledge and collaborate with developers around the world. Explore topics in Web development, mobile app development, algorithms, data structures and more.",
    icons: {
        icon: "/assets/images/site-logo.svg",
    },
};

interface Props {
    searchParams: Promise<{
        q?: string;
        filter?: UserFilter;
    }>;
}

export default async function Community({ searchParams }: Props) {
    const { q, filter } = await searchParams;
    const { users } = await fetchUsers({ searchQuery: q, filter });

    return (
        <main className="flex min-h-screen max-w-5xl flex-1 flex-col gap-7">
            <h1 className="h1-bold max-sm:h3-bold text-dark300_light900">All Users</h1>

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
                    <NoResults
                        title="There are no Users yet 😞"
                        desc="Why not be the first to register and earn yourself a badge? 😃"
                    />
                )}
            </section>
        </main>
    );
}
