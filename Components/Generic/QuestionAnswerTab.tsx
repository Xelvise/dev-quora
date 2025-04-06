"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/Shadcn/tabs";
import { useRouter } from "next/navigation";
import PopulateQuestionCard from "../Populators/PopulateQuestionCard";
import PopulateAnswerCard from "../Populators/PopulateAnswerCard";

interface Props {
    stringifiedQuestionData: any;
    stringifiedAnswerData: any;
    stringifiedSignedInUser: any;
}

// prettier-ignore
export default function QuestionAnswerTab({ stringifiedQuestionData, stringifiedAnswerData, stringifiedSignedInUser }: Props) {
    const router = useRouter();

    const switchTabs = () => {
        const newURL = new URL(window.location.href);
        newURL.searchParams.delete("page");
        router.replace(newURL.toString(), { scroll: false });
    };

    return (
        <Tabs defaultValue="top-posts" className="mt-14">
            <TabsList className="bg-light800_dark200 mb-5 flex min-h-[50px] gap-5 rounded-[7px] p-1 max-sm:w-full sm:w-[400px]">
                <TabsTrigger
                    value="top-posts"
                    className="tab w-full rounded-[7px]"
                    onClick={switchTabs}
                    disabled={JSON.parse(stringifiedAnswerData).answers.length === 0}
                >
                    Top Posts
                </TabsTrigger>
                <TabsTrigger
                    value="answers"
                    className="tab w-full rounded-[7px]"
                    onClick={switchTabs}
                    disabled={JSON.parse(stringifiedAnswerData).answers.length === 0}
                >
                    Answers
                </TabsTrigger>
            </TabsList>
            <TabsContent value="top-posts">
                <PopulateQuestionCard
                    initial_data={stringifiedQuestionData}
                    signedInUser={JSON.parse(stringifiedSignedInUser)}
                    fetchOnServerSide
                />
            </TabsContent>
            <TabsContent value="answers" className="max-sm:mt-7 sm:mt-10">
                <PopulateAnswerCard
                    initial_data={stringifiedAnswerData}
                    signedInUser={JSON.parse(stringifiedSignedInUser)}
                    fetchOnServerSide
                />
            </TabsContent>
        </Tabs>
    );
}
