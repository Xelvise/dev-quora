import FilterSelector from "@/Components/Shared/FilterSelector";
import SearchBar from "@/Components/Shared/SearchBar";
import { QuestionFilters } from "@/Constants/filters";
import NoResults from "@/Components/Shared/NoResults";
import QuestionCard from "@/Components/Cards/QuestionCard";
import { fetchSavedQuestions } from "@/Backend/Server-Side/Actions/question.action";
import { auth } from "@clerk/nextjs/server";
import { getSignedInUser } from "@/Backend/Server-Side/Actions/user.action";

export default async function SavedCollection() {
    const { userId: clerkId } = await auth();
    if (!clerkId) return console.log("You need to be logged in to view Saved questions"); // render a Toaster
    const user = await getSignedInUser(clerkId);

    try {
        const { savedQuestions } = await fetchSavedQuestions({ clerk_id: clerkId, sortBy: "newest-to-oldest" });
        console.log("savedQuestions: ", savedQuestions);

        return (
            <main className="flex min-h-screen max-w-5xl flex-1 flex-col gap-7 max-sm:gap-5">
                <h1 className="h1-bold text-dark300_light900">Saved Questions</h1>
                <div className="flex w-full gap-5 max-md:gap-3 max-sm:flex-col">
                    <SearchBar placeholder="Search amazing minds here..." assetIcon="search" />
                    <div className="rounded-[7px] border">
                        <FilterSelector filters={QuestionFilters} placeholder="Select a Filter" />
                    </div>
                </div>

                <div className="flex w-full flex-col gap-6">
                    {savedQuestions.length > 0 ? (
                        savedQuestions.map(question => (
                            <QuestionCard key={question.id} question={question} signedInUser={user} />
                        ))
                    ) : (
                        <NoResults
                            title="No Saved Questions Found"
                            desc="It appears that there are no saved questions in your collection at the moment 😞. Be sure to give a Question a star and you'll find it here 😃"
                            link="/"
                            linkTitle="Explore Questions"
                        />
                    )}
                </div>
            </main>
        );
    } catch (error) {
        if (error instanceof Error && error.message === "Failed to retrieve saved questions") {
            // TODO: Add a toast notification to inform the user about the error
        }
    }
}
