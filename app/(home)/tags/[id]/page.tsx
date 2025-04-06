import { fetchQuestionsByTagID } from "@/Backend/Server-Side/Actions/tag.action";
import { getSignedInUser } from "@/Backend/Server-Side/Actions/user.action";
import QuestionCard from "@/Components/Cards/QuestionCard";

import { LocalSearchBar } from "@/Components/Generic/LocalSearchBar";
import { auth } from "@clerk/nextjs/server";

interface Props {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ q?: string; page?: string }>;
}

export default async function TagDetails({ params, searchParams }: Props) {
    const { id } = await params;
    const { q, page } = await searchParams;

    const { userId: clerkId } = await auth();
    const user = await getSignedInUser(clerkId);

    try {
        const { tagTitle, questions, hasMorePages } = await fetchQuestionsByTagID({
            tag_id: id,
            searchQuery: q,
            page: page ? +page : 1,
        });
        return (
            <main className="flex min-h-screen max-w-5xl flex-1 flex-col gap-7 max-sm:gap-5">
                <h1 className="h1-bold text-dark300_light900">{tagTitle}</h1>

                <div className="flex w-full">
                    <LocalSearchBar placeholder={`Search questions associated with ${tagTitle}`} assetIcon="search" />
                </div>

                <div className="flex w-full flex-col gap-6">
                    {questions.map(question => (
                        <QuestionCard key={question.id} question={question} signedInUser={user} />
                    ))}
                    {/* <PopulateQuestionData hasNextPage={hasMorePages} isFetching={isFetching} /> */}
                </div>
            </main>
        );
    } catch (error) {
        if (error instanceof Error && error.message === "Tag not found") {
            // TODO: render a Toaster beneath the page to inform User of resulting error
        }
    }
}
