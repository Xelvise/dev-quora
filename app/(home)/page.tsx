import Filters from "@/Components/Generic/Filters";
import { LocalSearchBar } from "@/Components/Generic/LocalSearchBar";
import Link from "next/link";
import { HomePageFilters } from "@/Constants/filters";
import { fetchQuestions } from "@/Backend/Server-Side/Actions/question.action";
import { auth } from "@clerk/nextjs/server";
import { getSignedInUser } from "@/Backend/Server-Side/Actions/user.action";
import { QuestionFilter } from "@/Backend/Server-Side/parameters";
import PopulateQuestionCard from "@/Components/Populators/PopulateQuestionCard";

interface Props {
    searchParams: Promise<{
        q?: string;
        filter?: QuestionFilter;
        page?: string;
    }>;
}

export default async function Homepage({ searchParams }: Props) {
    const { q, filter, page } = await searchParams;
    const pageNo = page ? +page : 1;
    const { userId: clerkId } = await auth();
    const user = await getSignedInUser(clerkId);

    try {
        const data = await fetchQuestions({ searchQuery: q, filter, page: pageNo });

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

                <PopulateQuestionCard
                    serverAction="fetchQuestions"
                    initial_data={JSON.stringify(data)}
                    signedInUser={JSON.stringify(user)}
                    fetchOnServerSide
                />
            </main>
        );
    } catch (error) {
        if (error instanceof Error && error.message === "Failed to retrieve questions") {
            // TODO: Add a toast notification to inform the user about the error
        }
        console.log("Experienced an error: ", error);
    }
}
