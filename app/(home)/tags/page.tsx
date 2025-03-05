import { fetchAllTags } from "@/Backend/Server-Side/Actions/tag.action";
import TagCard from "@/Components/Cards/TagCard";
import FilterSelector from "@/Components/Shared/FilterSelector";
import { Badge } from "@/Components/Shadcn/badge";
import NoResults from "@/Components/Shared/NoResults";
import SearchBar from "@/Components/Shared/SearchBar";
import { TagFilters } from "@/Constants/filters";
import Link from "next/link";

export default async function Tags() {
    const { tags } = await fetchAllTags({});

    return (
        <main className="flex min-h-screen max-w-5xl flex-1 flex-col gap-7">
            <h1 className="h1-bold text-dark300_light900">Tags</h1>

            <div className="flex w-full gap-5 max-md:gap-3 max-sm:flex-col">
                <SearchBar placeholder="Search by tag name" assetIcon="search" />
                <div className="rounded-[7px] border">
                    <FilterSelector filters={TagFilters} placeholder="Select a Filter" />
                </div>
            </div>

            <section className="flex flex-wrap gap-4">
                {tags.length > 0 ? (
                    tags.map(tag => <TagCard key={tag.id} tag={tag} />)
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
