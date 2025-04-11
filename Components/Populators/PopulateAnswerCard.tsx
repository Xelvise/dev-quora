/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import { Button } from "../Shadcn/button";
import { Spinner } from "../Shadcn/spinner";
// prettier-ignore
import { usePathname, useSearchParams } from "next/navigation";
import { AnswerFilter } from "@/Backend/Server-Side/parameters";
import { AnswerDoc } from "@/Backend/Database/answer.collection";
import { fetchAnswers, fetchUserTopAnswers } from "@/Backend/Server-Side/Actions/answer.action";
import AnswerCard from "../Cards/AnswerCard";
import Divider from "../Generic/Divider";

interface FinalData {
    answers: AnswerDoc[];
    hasMorePages: boolean;
}
interface Props {
    serverAction?: "fetchAnswers" | "fetchUserTopAnswers";
    stringifiedInitialData: string;
    stringifiedSignedInUser: string;
    user_id?: string;
    question_id?: string;
}

// prettier-ignore
export default function PopulateAnswerCard({ serverAction, stringifiedInitialData, stringifiedSignedInUser, user_id, question_id }: Props) {
    const rawData = JSON.parse(stringifiedInitialData);
    delete rawData["totalAnswers"];
    const initialData = rawData as FinalData;
    const signedInUser = JSON.parse(stringifiedSignedInUser);

    const pathname = usePathname();
    const searchParams = useSearchParams();
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
        console.log("Starting to load more answers");

        let stringifiedData: string;
        try {
            if (serverAction === "fetchAnswers") {
                if (!question_id) throw new Error("Question ID is missing");
                stringifiedData = await fetchAnswers({
                    question_id,
                    page: pageNo,
                    filter: filter as AnswerFilter,
                });
            } else if (serverAction === "fetchUserTopAnswers") {
                if (!user_id) throw new Error("User profile's ID is missing");
                stringifiedData = await fetchUserTopAnswers({ page: pageNo, user_id });
            } else {
                throw new Error("Invalid server action");
            }

            const newData = JSON.parse(stringifiedData) as FinalData;
            setFinalData(prev => {
                const mergedAnswers = prev.answers.concat(newData.answers);
                // Create a Map using the answer's id as the key. This automatically removes duplicates.
                const uniqueAnswersMap = new Map(
                    mergedAnswers.map(answer => [answer._id.toString(), answer]),
                );
                // Convert the Map values back into an array of unique answers.
                const uniqueAnswers = Array.from(uniqueAnswersMap.values());
                return {
                    answers: uniqueAnswers,
                    hasMorePages: newData.hasMorePages,
                };
            });
            console.log("Answers successfully loaded");
        } catch (error) {
            console.log("Couldn't load more answers: ", error);
            setPageNo(prev => prev - 1);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex w-full flex-col">
            {finalData.answers.length > 0
                ? finalData.answers.map(answer => (
                      <div key={String(answer._id)}>
                          <AnswerCard answer={answer} signedInUser={signedInUser} />
                          {finalData.answers[finalData.answers.length - 1] !== answer && <Divider className="my-10" />}
                      </div>
                  ))
                : null}

            {finalData.hasMorePages && (
                <div
                    className={`${pathname.includes("/profile") || pathname.includes("/question") ? "mt-5" : "fixed bottom-0 z-50 mb-5"} bg-light850_dark500 dark:solid-light-border flex self-center rounded-[7px]`}
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
