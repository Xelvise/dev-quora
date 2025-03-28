import { fetchAllTags } from "@/Backend/Server-Side/Actions/tag.action";
import { TagFilter } from "@/Backend/Server-Side/parameters";
import TagCard from "@/Components/Cards/TagCard";
import Filters from "@/Components/Generic/Filters";
import PopulateQuestionData from "@/Components/Generic/PopulateQuestionData";
import NoResults from "@/Components/Generic/NoResults";
import { LocalSearchBar } from "@/Components/Generic/SearchBar";
import { TagFilters } from "@/Constants/filters";

interface Props {
    searchParams: Promise<{
        q?: string;
        filter?: TagFilter;
        page?: string;
    }>;
}

export default async function Tags({ searchParams }: Props) {
    const { q, filter, page } = await searchParams;
    const { tags, hasMorePages, isFetching } = await fetchAllTags({ searchQuery: q, filter, page: page ? +page : 1 });

    return (
        <main className="flex min-h-screen max-w-5xl flex-1 flex-col gap-7">
            <h1 className="h1-bold text-dark300_light900">Tags</h1>

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
                {/* <PopulateQuestionData hasNextPage={hasMorePages} isFetching={isFetching}/> */}
            </section>
        </main>
    );
}
