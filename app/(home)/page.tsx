import Filters from "@/Components/Generic/Filters";
import { LocalSearchBar } from "@/Components/Generic/LocalSearchBar";
import Link from "next/link";
import { HomePageFilters } from "@/Constants/filters";
import { fetchQuestions } from "@/Backend/Server-Side/Actions/question.action";
import { auth } from "@clerk/nextjs/server";
import { getSignedInUser } from "@/Backend/Server-Side/Actions/user.action";
import { QuestionFilter } from "@/Backend/Server-Side/parameters";
import PopulateQuestionCard from "@/Components/Populators/PopulateQuestionCard";
import NoResults from "@/Components/Generic/NoResults";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Home | DevQuora",
    description:
        "A community-driven platform for asking and answering programming questions. Get help, share knowledge and collaborate with developers around the world. Explore topics in Web development, mobile app development, algorithms, data structures and more.",
    applicationName: "DevQuora",
    authors: { name: "Elvis Gideon", url: "https://linkedin.com/in/elvisgideon001" },
    icons: { icon: "/assets/images/site-logo.svg" },
    // prettier-ignore
    keywords: [ "DevQuora", "Dev community", "stack overflow", "question and answer", "Q&A", "programming", "developers" ],
    creator: "Elvis Gideon",
    openGraph: {
        title: "DevQuora - Programming Q&A Platform",
        description: "A community-driven platform for asking and answering programming questions.",
        url: "https://dev-quora.vercel.app/",
        siteName: "DevQuora",
        images: [
            {
                url: "https://dev-quora.vercel.app/app-image.png",
                width: 1200,
                height: 630,
                alt: "DevQuora Preview",
            },
        ],
        type: "website",
    },
};

interface Props {
    searchParams: Promise<{
        q?: string;
        filter?: QuestionFilter;
    }>;
}

export default async function Homepage({ searchParams }: Props) {
    const { q, filter } = await searchParams;
    const { userId: clerkId } = await auth();
    const user = await getSignedInUser(clerkId);

    const data = await fetchQuestions({ searchQuery: q, filter });

    return (
        <main className="flex min-h-screen max-w-5xl flex-1 flex-col gap-7 max-sm:gap-5">
            <div className="flex flex-col-reverse">
                <h1 className="h1-bold max-sm:h3-bold text-dark300_light900">All Questions</h1>
                <Link
                    href="/ask-question"
                    className="primary-gradient paragraph-semibold max-sm:small-medium flex self-end rounded-[7px] p-3 text-light-900 max-sm:p-2"
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
                stringifiedInitialData={data}
                stringifiedSignedInUser={JSON.stringify(user)}
            >
                <NoResults
                    title="There are no questions to show"
                    desc="Be the first to break the silence! 🚀 Ask a Question and kickstart the discussion. Our query could be the next big thing others learn from. Get Involved! 💡"
                    link="/ask-question"
                    linkTitle="Ask a Question"
                />
            </PopulateQuestionCard>
        </main>
    );
}
