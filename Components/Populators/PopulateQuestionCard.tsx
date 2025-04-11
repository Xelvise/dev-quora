/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { ReactNode, useEffect, useState } from "react";
import { Button } from "../Shadcn/button";
import { Spinner } from "../Shadcn/spinner";
// prettier-ignore
import { fetchQuestions, fetchSavedQuestions, fetchUserTopQuestions } from "@/Backend/Server-Side/Actions/question.action";
import { QuestionDoc } from "@/Backend/Database/question.collection";
import { usePathname, useSearchParams } from "next/navigation";
import { QuestionFilter, SavedQuestionFilter } from "@/Backend/Server-Side/parameters";
import QuestionCard from "../Cards/QuestionCard";

interface FinalData {
    questions: QuestionDoc[];
    hasMorePages: boolean;
}
interface Props {
    children?: ReactNode;
    serverAction: "fetchQuestions" | "fetchSavedQuestions" | "fetchUserTopQuestions";
    stringifiedInitialData: string;
    stringifiedSignedInUser: string;
    user_id?: string;
    clerk_id?: string;
}

// prettier-ignore
export default function PopulateQuestionCard({ children, serverAction, stringifiedInitialData, stringifiedSignedInUser, user_id, clerk_id }: Props) {
    const initialData = JSON.parse(stringifiedInitialData) as FinalData;
    const signedInUser = JSON.parse(stringifiedSignedInUser)

    const pathname = usePathname();
    const searchParams = useSearchParams();
    const searchQuery = searchParams.get("q") ?? undefined;
    const filter = searchParams.get("filter") ?? undefined;

    const [finalData, setFinalData] = useState(initialData);
    const [pageNo, setPageNo] = useState(1);
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        setFinalData(initialData);
        setPageNo(1);
    }, [stringifiedInitialData]);

    const handleLoadMore = async () => {
        setLoading(true); setPageNo(prev => prev + 1);
        console.log("Starting to load more questions");

        let stringifiedData: string;
        try {
            if (serverAction === "fetchQuestions") {
                stringifiedData = await fetchQuestions({
                    page: pageNo,
                    searchQuery,
                    filter: filter as QuestionFilter,
                });
            } else if (serverAction === "fetchSavedQuestions") {
                if (!clerk_id) throw new Error("Clerk ID is missing");
                stringifiedData = await fetchSavedQuestions({
                    page: pageNo,
                    searchQuery,
                    filter: filter as SavedQuestionFilter,
                    clerk_id,
                });
            } else if (serverAction === "fetchUserTopQuestions") {
                if (!user_id) throw new Error("User ID is missing");
                stringifiedData = await fetchUserTopQuestions({ page: pageNo, user_id });
            } else {
                throw new Error("Invalid server action");
            }

            const newData = JSON.parse(stringifiedData) as FinalData
            setFinalData(prev => {
                const mergedQuestions = prev.questions.concat(newData.questions);
                // Create a Map using the question's id as the key. This automatically removes duplicates.
                const uniqueQuestionsMap = new Map(
                    mergedQuestions.map(question => [question._id.toString(), question]),
                );
                // Convert the Map values back into an array of unique questions.
                const uniqueQuestions = Array.from(uniqueQuestionsMap.values());
                return {
                    questions: uniqueQuestions,
                    hasMorePages: newData.hasMorePages,
                };
            });
            console.log("Questions successfully loaded");
        } catch (error) {
            console.log("Couldn't load more questions: ", error);
            setPageNo(prev => prev - 1);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex w-full flex-col gap-6">
            {finalData.questions.length > 0 ? (
                finalData.questions.map(question => (
                    <QuestionCard key={String(question._id)} question={question} signedInUser={signedInUser} />
                ))
            ) : children}

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
