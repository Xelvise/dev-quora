import { fetchAllTags } from "@/Backend/Server-Side/Actions/tag.action";
import { TagFilter } from "@/Backend/Server-Side/parameters";
import TagCard from "@/Components/Cards/TagCard";
import Filters from "@/Components/Generic/Filters";

import NoResults from "@/Components/Generic/NoResults";
import { LocalSearchBar } from "@/Components/Generic/LocalSearchBar";
import { TagFilters } from "@/Constants/filters";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Tags | DevQuora",
    description:
        "A community-driven platform for asking and answering programming questions. Get help, share knowledge and collaborate with developers around the world. Explore topics in Web development, mobile app development, algorithms, data structures and more.",
    icons: {
        icon: "/assets/images/site-logo.svg",
    },
};

interface Props {
    searchParams: Promise<{
        q?: string;
        filter?: TagFilter;
    }>;
}

export default async function Tags({ searchParams }: Props) {
    const { q, filter } = await searchParams;
    const { tags } = await fetchAllTags({ searchQuery: q, filter });

    return (
        <main className="flex min-h-screen max-w-5xl flex-1 flex-col gap-7">
            <h1 className="h1-bold max-sm:h3-bold text-dark300_light900">Tags</h1>

            <div className="flex w-full gap-5 max-md:gap-3 max-sm:flex-col">
                <LocalSearchBar placeholder="Search by tag name" assetIcon="search" />
                <div className="rounded-[7px]">
                    <Filters type="menu-list" filterData={TagFilters} defaultFilterValue="recent" />
                </div>
            </div>

            {/* prettier-ignore */}
            <section>
                {tags.length > 0 ? (
                    <div className="grid max-xs:grid-cols-1 gap-5 xs:grid-cols-2 md:grid-cols-4">
                        {tags.map(tag => <TagCard key={tag.id} tag={tag} />)}
                    </div>
                ) : (
                    <NoResults
                        title="No Tags found"
                        desc="It looks like there are no tags found"
                        link="/ask-question"
                        linkTitle="Ask a question"
                    />
                )}
            </section>
        </main>
    );
}
