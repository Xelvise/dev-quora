"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/Shadcn/tabs";
import PopulateQuestionCard from "../Populators/PopulateQuestionCard";
import PopulateAnswerCard from "../Populators/PopulateAnswerCard";
import { useState } from "react";

interface Props {
    user_id: string;
    stringifiedQuestionData: string;
    stringifiedAnswerData: string;
    stringifiedSignedInUser: string;
}

// prettier-ignore
export default function QuestionAnswerTab({ user_id, stringifiedQuestionData, stringifiedAnswerData, stringifiedSignedInUser }: Props) {
    const [selectedTab, setSelectedTab] = useState("top-posts");
    const hasQuestions = JSON.parse(stringifiedQuestionData).questions.length > 0;
    const hasAnswers = JSON.parse(stringifiedAnswerData).answers.length > 0;

    if (hasQuestions) {
        return (
            <Tabs defaultValue="top-posts" className="mt-14" onValueChange={setSelectedTab}>
                <TabsList className="bg-light800_dark200 mb-5 flex min-h-[50px] gap-5 rounded-[7px] p-2 max-sm:w-full sm:w-[400px]">
                    <TabsTrigger
                        value="top-posts"
                        className={`${selectedTab === "top-posts" ? "text-primary-500 dark:bg-dark-400" : "text-dark-300 dark:text-light-500"} min-h-full w-full rounded-[7px] p-2`}
                    >
                        Top Posts
                    </TabsTrigger>
                    <TabsTrigger
                        value="top-answers"
                        className={`${selectedTab === "top-answers" ? "text-primary-500 dark:bg-dark-400" : "text-dark-300 dark:text-light-500"} min-h-full w-full rounded-[7px] p-2`}
                        disabled={!hasAnswers}
                    >
                        {!hasAnswers ? "No Answers" : "Top Answers"}
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="top-posts">
                    <PopulateQuestionCard
                        serverAction="fetchUserTopQuestions"
                        user_id={user_id}
                        stringifiedInitialData={stringifiedQuestionData}
                        stringifiedSignedInUser={stringifiedSignedInUser}
                    />
                </TabsContent>
                <TabsContent value="top-answers" className="max-sm:mt-7 sm:mt-10">
                    <PopulateAnswerCard
                        serverAction="fetchUserTopAnswers"
                        user_id={user_id}
                        stringifiedInitialData={stringifiedAnswerData}
                        stringifiedSignedInUser={stringifiedSignedInUser}
                    />
                </TabsContent>
            </Tabs>
        );
    }
}
