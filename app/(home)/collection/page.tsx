import Filters from "@/Components/Generic/Filters";
import { LocalSearchBar } from "@/Components/Generic/LocalSearchBar";
import { QuestionFilters } from "@/Constants/filters";
import NoResults from "@/Components/Generic/NoResults";
import { fetchSavedQuestions } from "@/Backend/Server-Side/Actions/question.action";
import { auth } from "@clerk/nextjs/server";
import { getSignedInUser } from "@/Backend/Server-Side/Actions/user.action";
import { redirect } from "next/navigation";
import { SavedQuestionFilter } from "@/Backend/Server-Side/parameters";
import PopulateQuestionCard from "@/Components/Populators/PopulateQuestionCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Collections | DevQuora",
    description:
        "A community-driven platform for asking and answering programming questions. Get help, share knowledge and collaborate with developers around the world. Explore topics in Web development, mobile app development, algorithms, data structures and more.",
    icons: {
        icon: "/assets/images/site-logo.svg",
    },
};

interface Props {
    searchParams: Promise<{
        q?: string;
        filter?: SavedQuestionFilter;
    }>;
}

export default async function SavedCollection({ searchParams }: Props) {
    const { q, filter } = await searchParams;
    const { userId: clerkId } = await auth();
    if (!clerkId) return redirect("/sign-in");
    const user = await getSignedInUser(clerkId);

    const data = await fetchSavedQuestions({ clerk_id: clerkId, searchQuery: q, filter });

    return (
        <main className="flex min-h-screen max-w-5xl flex-1 flex-col gap-7 max-sm:gap-5">
            <h1 className="h1-bold max-sm:h3-bold text-dark300_light900">Saved Questions</h1>
            <div className="flex w-full gap-5 max-md:gap-3 max-sm:flex-col">
                <LocalSearchBar placeholder="Search your saved collections" assetIcon="search" />
                <div className="rounded-[7px]">
                    <Filters type="menu-list" filterData={QuestionFilters} defaultFilterValue="most_recent" />
                </div>
            </div>
            <PopulateQuestionCard
                serverAction="fetchSavedQuestions"
                clerk_id={clerkId}
                stringifiedInitialData={data}
                stringifiedSignedInUser={JSON.stringify(user)}
            >
                <NoResults
                    title="No Saved Questions Found"
                    desc="It appears there are no saved questions in your collection at the moment 😞. Be sure to give a Question a star and you'll find it here 😃"
                    link="/"
                    linkTitle="Explore Questions"
                />
            </PopulateQuestionCard>
        </main>
    );
}
