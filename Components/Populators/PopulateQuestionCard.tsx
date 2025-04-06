/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import { Button } from "../Shadcn/button";
import { Spinner } from "../Shadcn/spinner";
// prettier-ignore
import { fetchQuestions, fetchSavedQuestions, fetchUserTopQuestions } from "@/Backend/Server-Side/Actions/question.action";
import { QuestionDoc } from "@/Backend/Database/question.collection";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { QuestionFilter, SavedQuestionFilter } from "@/Backend/Server-Side/parameters";
import QuestionCard from "../Cards/QuestionCard";
import { areArraysEqual } from "@/app/utils";
import NoResults from "../Generic/NoResults";

interface FinalData {
    questions: QuestionDoc[];
    hasMorePages: boolean;
}
interface Props {
    serverAction?: "fetchQuestions" | "fetchSavedQuestions" | "fetchUserTopQuestions";
    initial_data: any;
    signedInUser: any;
    user_id?: string;
    clerk_id?: string;
    fetchOnServerSide: boolean;
}

// prettier-ignore
export default function PopulateQuestionCard({ serverAction, initial_data, signedInUser, user_id, clerk_id, fetchOnServerSide }: Props) {
    const initialData = typeof initial_data === "object" ? initial_data as FinalData : JSON.parse(initial_data) as FinalData;
    const signedInUser_ = typeof signedInUser === "object" || signedInUser === null ? signedInUser : JSON.parse(signedInUser);

    const router = useRouter();
    const pathname = usePathname();

    const searchParams = useSearchParams();
    const page = searchParams.get("page");
    const searchQuery = searchParams.get("q") ?? undefined;
    const filter = searchParams.get("filter") ?? undefined;

    const [finalData, setFinalData] = useState(initialData);
    const [pageNo, setPageNo] = useState(page ? +page : 1);
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        if (page && +page > 1) {
            const newURL = new URL(window.location.href);
            newURL.searchParams.delete("page");
            router.replace(newURL.toString(), { scroll: false });
        }
    }, []);

    useEffect(() => {
        if (page) {
            setLoading(false);

            const initial = initialData.questions.map(ques => String(ques._id));
            const final = finalData.questions.map(ques => String(ques._id));
            if (!areArraysEqual(final, initial)) {
                setFinalData(prev => ({
                    questions: prev.questions.concat(initialData.questions),
                    hasMorePages: initialData.hasMorePages,
                }));
            }
        } else {
            setFinalData(initialData)
            setPageNo(1);
        }
    }, [initial_data]);

    const handleLoadMore = async () => {
        setLoading(true);
        const nextPage = pageNo + 1; setPageNo(nextPage);

        if (fetchOnServerSide) {
            const newURL = new URL(window.location.href);
            newURL.searchParams.set("page", nextPage.toString());
            router.push(newURL.toString(), { scroll: false });
        } else {
            console.log("Starting to load more questions");
            try {
                let newData: FinalData;
                if (serverAction === "fetchQuestions") {
                    newData = await fetchQuestions({
                        page: pageNo,
                        searchQuery,
                        filter: filter as QuestionFilter,
                    });
                } else if (serverAction === "fetchSavedQuestions") {
                    if (!clerk_id) throw new Error("Clerk ID is missing");
                    newData = await fetchSavedQuestions({
                        page: pageNo,
                        searchQuery,
                        filter: filter as SavedQuestionFilter,
                        clerk_id,
                    });
                } else if (serverAction === "fetchUserTopQuestions") {
                    if (!user_id) throw new Error("User ID is missing");
                    newData = await fetchUserTopQuestions({ page: pageNo, user_id });
                } else {
                    throw new Error("Invalid server action");
                }
                setFinalData(prev => ({
                    questions: prev.questions.concat(newData.questions),
                    hasMorePages: newData.hasMorePages,
                }));
                console.log("Loaded more questions");
            } catch (error) {
                console.log("Couldn't load more questions: ", error);
                setPageNo(prev => prev - 1);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="flex w-full flex-col gap-6">
            {finalData.questions.length > 0 ? (
                finalData.questions.map(question => (
                    <QuestionCard key={String(question._id)} question={question} signedInUser={signedInUser_} />
                ))
            ) : (
                <NoResults
                    title="There's no question to show"
                    desc="Be the first to break the silence! 🚀 Ask a Question and kickstart the discussion. Our query could be the next big thing others learn from. Get Involved! 💡"
                    link="/ask-question"
                    linkTitle="Ask a Question"
                />
            )}

            {finalData.hasMorePages && (
                <div
                    className={`${pathname.includes("/profile") ? "mt-5" : "fixed bottom-0 z-50 mb-5"} bg-light850_dark500 dark:solid-light-border flex self-center rounded-[7px]`}
                >
                    <Button
                        type="button"
                        className="body-medium max-sm:small-medium p-2 text-primary-500 dark:text-primary-300"
                        disabled={isLoading}
                        onClick={handleLoadMore}
                    >
                        {isLoading ? (
                            <>
                                <Spinner /> {"Loading..."}
                            </>
                        ) : (
                            "Load More"
                        )}
                    </Button>
                </div>
            )}
        </div>
    );
}
