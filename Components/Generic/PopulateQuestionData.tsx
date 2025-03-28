/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { ReactNode, useEffect, useState } from "react";
import { Button } from "../Shadcn/button";
import { Spinner } from "../Shadcn/spinner";
import { fetchQuestions } from "@/Backend/Server-Side/Actions/question.action";
import { QuestionDoc } from "@/Backend/Database/question.collection";
import { useSearchParams } from "next/navigation";
import { QuestionFilter } from "@/Backend/Server-Side/parameters";
import QuestionCard from "../Cards/QuestionCard";
import { areArraysEqual } from "@/app/utils";
import { init } from "next/dist/compiled/webpack/webpack";

interface FinalData {
    questions: QuestionDoc[];
    hasMorePages: boolean;
}
interface Props {
    children?: ReactNode;
    initial_data: any;
    signedInUser: any;
}

export default function PopulateQuestionData({ children, initial_data, signedInUser }: Props) {
    // const initialData = JSON.parse(initial_data) as FinalData;
    const [finalData, setFinalData] = useState(JSON.parse(initial_data) as FinalData);

    const [pageNo, setPageNo] = useState(1);
    const [isLoading, setLoading] = useState(false);

    const searchParams = useSearchParams();
    const searchQuery = searchParams.get("q") ?? undefined;
    const filter = (searchParams.get("filter") as QuestionFilter) ?? undefined;

    // useEffect(() => {
    //     const initial = initialData.questions.map(ques => String(ques._id));
    //     const final = finalData.questions.map(ques => String(ques._id));
    //     if (!areArraysEqual(initial, final)) {
    //         setFinalData(initialData);
    //         setPageNo(1); // Reset page number
    //     }
    // }, []);

    useEffect(() => {
        setFinalData(JSON.parse(initial_data) as FinalData);
        setPageNo(1);
        setLoading(false);
    }, [initial_data]);

    const handleLoadMore = async () => {
        console.log("Starting to load more questions");
        setLoading(true);
        setPageNo(prev => prev + 1);
        console.log("Just about to start loading more questions");
        try {
            const newData = await fetchQuestions({ page: pageNo, pageSize: 1, searchQuery, filter });
            setFinalData(prev => ({
                questions: [...prev.questions, ...newData.questions],
                hasMorePages: newData.hasMorePages,
            }));
            console.log("Loaded more questions");
        } catch {
            console.log("Couldn't load more questions");
            setPageNo(prev => prev - 1);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex w-full flex-col gap-6">
            {finalData.questions.length > 0
                ? finalData.questions.map(question => (
                      <QuestionCard
                          key={String(question._id)}
                          question={question}
                          signedInUser={JSON.parse(signedInUser)}
                      />
                  ))
                : children}

            {finalData.hasMorePages && (
                <div className="bg-light850_dark500 dark:solid-light-border fixed bottom-0 z-50 mb-5 flex self-center rounded-[7px]">
                    <Button
                        type="button"
                        className="paragraph-semibold max-sm:body-medium p-3 text-primary-500 dark:text-primary-300"
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

// const handleLoadMore = () => {
//     pageNo += 1;
//     const newURL = new URL(window.location.href);
//     newURL.searchParams.set("page", pageNo.toString());
//     router.replace(newURL.toString(), { scroll: false });
// };
