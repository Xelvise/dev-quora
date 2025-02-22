import FilterTags from "@/Components/Desktop/FilterTags";
import FilterSelector from "@/Components/Mobile/FilterSelector";
import SearchBar from "@/Components/Shared/SearchBar";
import Link from "next/link";
import { HomePageFilters } from "@/Constants/filters";
import NoResults from "@/Components/Shared/NoResults";
import QuestionCard from "@/Components/Cards/QuestionCard";
import { getQuestions } from "@/Backend/Server-Side/Actions/question.action";

export default async function Homepage() {
    try {
        const result = await getQuestions({ sort: "earliest-first" });

        return (
            <main className="flex min-h-screen max-w-5xl flex-1 flex-col gap-7 max-sm:gap-5">
                <div className="flex items-center justify-between">
                    <h1 className="h1-bold text-dark300_light900">All Questions</h1>
                    <Link
                        href="/ask-question"
                        className="primary-gradient paragraph-semibold max-sm:body-medium flex items-center rounded-[7px] p-3 text-light-900 max-sm:p-2"
                    >
                        Ask a Question
                    </Link>
                </div>

                <div className="flex w-full gap-5 max-md:flex-row max-sm:flex-col max-sm:justify-between max-sm:gap-3 md:flex-col">
                    <SearchBar placeholder="Search questions" assetIcon="search" />
                    <FilterTags filters={HomePageFilters} />
                    <FilterSelector
                        filters={HomePageFilters}
                        contentClassNames="w-[380px]"
                        containerClassNames="border rounded-[7px]"
                    />
                </div>

                <div className="flex w-full flex-col gap-6">
                    {result.questions.length > 0 ? (
                        result.questions.map(question => (
                            <QuestionCard key={question._id as string} question={question} />
                        ))
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
