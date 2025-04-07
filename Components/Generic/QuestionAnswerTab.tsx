"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/Shadcn/tabs";
import PopulateQuestionCard from "../Populators/PopulateQuestionCard";
import PopulateAnswerCard from "../Populators/PopulateAnswerCard";

interface Props {
    user_id: string;
    stringifiedQuestionData: string;
    stringifiedAnswerData: string;
    stringifiedSignedInUser: string;
}

// prettier-ignore
export default function QuestionAnswerTab({ user_id, stringifiedQuestionData, stringifiedAnswerData, stringifiedSignedInUser }: Props) {
    return (
        <Tabs defaultValue="top-posts" className="mt-14">
            <TabsList className="bg-light800_dark200 mb-5 flex min-h-[50px] gap-5 rounded-[7px] p-1 max-sm:w-full sm:w-[400px]">
                <TabsTrigger
                    value="top-posts"
                    className="tab w-full rounded-[7px]"
                    disabled={JSON.parse(stringifiedAnswerData).answers.length === 0}
                >
                    Top Posts
                </TabsTrigger>
                <TabsTrigger
                    value="answers"
                    className="tab w-full rounded-[7px]"
                    disabled={JSON.parse(stringifiedAnswerData).answers.length === 0}
                >
                    Answers
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
            <TabsContent value="answers" className="max-sm:mt-7 sm:mt-10">
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
