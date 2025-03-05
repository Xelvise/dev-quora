import FilterTags from "@/Components/Desktop/FilterTags";
import FilterSelector from "@/Components/Shared/FilterSelector";
import SearchBar from "@/Components/Shared/SearchBar";
import Link from "next/link";
import { HomePageFilters } from "@/Constants/filters";
import NoResults from "@/Components/Shared/NoResults";
import QuestionCard from "@/Components/Cards/QuestionCard";
import { fetchQuestions } from "@/Backend/Server-Side/Actions/question.action";

export default async function Homepage() {
    try {
        const { questions } = await fetchQuestions({ sortBy: "newest-to-oldest" });

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
                    <SearchBar placeholder="Search questions" assetIcon="search" />
                    <FilterTags filters={HomePageFilters} />
                    <div className="rounded-[7px] border md:hidden">
                        <FilterSelector
                            filters={HomePageFilters}
                            contentClassNames="w-[380px]"
                            placeholder="Select a Filter"
                        />
                    </div>
                </div>

                <div className="flex w-full flex-col gap-6">
                    {questions.length > 0 ? (
                        questions.map(question => <QuestionCard key={question.id} question={question} />)
                    ) : (
                        <NoResults
                            title="There's no question to show"
                            desc="Be the first to break the silence! 🚀 Ask a Question and kickstart the discussion. Our query could be the next big thing others learn from. Get Involved! 💡"
                            link="/ask-question"
                            linkTitle="Ask a Question"
                        />
                    )}
                </div>
            </main>
        );
    } catch (error) {
        if (error instanceof Error && error.message === "Failed to retrieve questions") {
            // TODO: Add a toast notification to inform the user about the error
        }
    }
}
