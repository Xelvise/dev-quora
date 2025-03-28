import Filters from "@/Components/Generic/Filters";
import { LocalSearchBar } from "@/Components/Generic/SearchBar";
import Link from "next/link";
import { HomePageFilters } from "@/Constants/filters";
import NoResults from "@/Components/Generic/NoResults";
import { fetchQuestions } from "@/Backend/Server-Side/Actions/question.action";
import { auth } from "@clerk/nextjs/server";
import { getSignedInUser } from "@/Backend/Server-Side/Actions/user.action";
import { QuestionFilter } from "@/Backend/Server-Side/parameters";
import PopulateQuestionData from "@/Components/Generic/PopulateQuestionData";

interface Props {
    searchParams: Promise<{
        q?: string;
        filter?: QuestionFilter;
        page?: string;
    }>;
}

export default async function Homepage({ searchParams }: Props) {
    const { q, filter } = await searchParams;
    const { userId: clerkId } = await auth();
    const user = await getSignedInUser(clerkId);

    try {
        const data = await fetchQuestions({ searchQuery: q, filter });

        return (
            <main className="flex min-h-screen max-w-5xl flex-1 flex-col gap-7 max-sm:gap-5">
                <div className="flex flex-col-reverse">
                    <h1 className="h1-bold text-dark300_light900">All Questions</h1>
                    <Link
                        href="/ask-question"
                        className="primary-gradient paragraph-semibold max-sm:body-medium flex self-end rounded-[7px] p-3 text-light-900 max-sm:p-2"
                    >
                        Ask a Question
                    </Link>
                </div>

                <div className="flex w-full gap-5 max-md:flex-row max-md:justify-between max-sm:flex-col max-sm:gap-3 md:flex-col">
                    <LocalSearchBar placeholder="Search questions" assetIcon="search" />
                    <Filters type="tags" filterData={HomePageFilters} defaultFilterValue="latest" />
                    <div className="rounded-[7px] md:hidden">
                        <Filters type="menu-list" filterData={HomePageFilters} defaultFilterValue="latest" />
                    </div>
                </div>

                <PopulateQuestionData initial_data={JSON.stringify(data)} signedInUser={JSON.stringify(user)}>
                    <NoResults
                        title="There's no question to show"
                        desc="Be the first to break the silence! 🚀 Ask a Question and kickstart the discussion. Our query could be the next big thing others learn from. Get Involved! 💡"
                        link="/ask-question"
                        linkTitle="Ask a Question"
                    />
                </PopulateQuestionData>
            </main>
        );
    } catch (error) {
        if (error instanceof Error && error.message === "Failed to retrieve questions") {
            // TODO: Add a toast notification to inform the user about the error
        }
    }
}
