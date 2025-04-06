/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import { Button } from "../Shadcn/button";
import { Spinner } from "../Shadcn/spinner";
// prettier-ignore
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AnswerFilter } from "@/Backend/Server-Side/parameters";
import { areArraysEqual } from "@/app/utils";
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
    initial_data: any;
    signedInUser: any;
    user_id?: string;
    question_id?: string;
    fetchOnServerSide: boolean;
}

// prettier-ignore
export default function PopulateAnswerCard({ serverAction, initial_data, signedInUser, user_id, question_id, fetchOnServerSide }: Props) {
    const initialData = typeof initial_data === "object" ? (initial_data as FinalData) : (JSON.parse(initial_data) as FinalData);
    const signedInUser_ = typeof signedInUser === "object" ? signedInUser : JSON.parse(signedInUser);

    const router = useRouter();
    const pathname = usePathname();

    const searchParams = useSearchParams();
    const page = searchParams.get("page");
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
    }, [])

    useEffect(() => {
        if (page) {
            setLoading(false);
            const initial = initialData.answers.map(ans => String(ans._id));
            const final = finalData.answers.map(ans => String(ans._id));
            if (!areArraysEqual(final, initial)) {
                setFinalData(prev => ({
                    answers: prev.answers.concat(initialData.answers),
                    hasMorePages: initialData.hasMorePages,
                }));
            }
        } else {
            setFinalData(initialData);
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
            console.log("Starting to load more answers");
            setLoading(true);
            try {
                let newData: FinalData;
                if (serverAction === "fetchAnswers") {
                    if (!question_id) throw new Error("Question ID is missing");
                    newData = await fetchAnswers({
                        question_id,
                        page: pageNo,
                        filter: filter as AnswerFilter,
                    });
                } else if (serverAction === "fetchUserTopAnswers") {
                    if (!user_id) throw new Error("User profile's ID is missing");
                    newData = await fetchUserTopAnswers({ page: pageNo, user_id });
                } else {
                    throw new Error("Invalid server action");
                }
                setFinalData(prev => ({
                    answers: [...prev.answers, ...newData.answers],
                    hasMorePages: newData.hasMorePages,
                }));
                console.log("Loaded more answers");
            } catch (error) {
                console.log("Couldn't load more answers: ", error);
                setPageNo(prev => prev - 1);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="flex w-full flex-col">
            {finalData.answers.length > 0
                ? finalData.answers.map(answer => (
                      <div key={String(answer._id)}>
                          <AnswerCard answer={answer} signedInUser={signedInUser_} />
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
