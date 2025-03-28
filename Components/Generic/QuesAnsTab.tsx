"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/Shadcn/tabs";
import { useRouter } from "next/navigation";
import AnswerCard from "../Cards/AnswerCard";
import QuestionCard from "../Cards/QuestionCard";
import Divider from "./Divider";
import PopulateQuestionData from "./PopulateQuestionData";
import { QuestionDoc } from "@/Backend/Database/question.collection";
import { AnswerDoc } from "@/Backend/Database/answer.collection";

interface Props {
    questions: any;
    answers: any;
    signedInUser: any;
    hasMoreQuestions: boolean;
    hasMoreAnswers: boolean;
}

export default function QuesAnsTab({ questions, answers, signedInUser, hasMoreQuestions, hasMoreAnswers }: Props) {
    const router = useRouter();

    const switchTabs = () => {
        const newURL = new URL(window.location.href);
        newURL.searchParams.delete("page");
        router.replace(newURL.toString(), { scroll: false });
    };

    return (
        <Tabs defaultValue="top-posts" className="mt-14">
            <TabsList className="bg-light800_dark200 mb-5 flex min-h-[50px] gap-5 rounded-[7px] p-1 max-sm:w-full sm:w-[400px]">
                <TabsTrigger value="top-posts" className="tab w-full rounded-[7px]">
                    Top Posts
                </TabsTrigger>
                <TabsTrigger value="answers" className="tab w-full rounded-[7px]">
                    Answers
                </TabsTrigger>
            </TabsList>
            <TabsContent value="top-posts" onClick={switchTabs}>
                {(JSON.parse(questions) as QuestionDoc[]).map(question => (
                    <QuestionCard key={question.id} question={question} signedInUser={signedInUser} />
                ))}
                {/* <PopulateQuestionData hasMorePages={hasMoreQuestions} /> */}
            </TabsContent>
            <TabsContent value="answers" onClick={switchTabs}>
                {(JSON.parse(answers) as AnswerDoc[]).map(answer => (
                    <div key={answer.id}>
                        <AnswerCard answer={answer} signedInUser={signedInUser} />
                        {answers[answers.length - 1] !== answer && <Divider className="my-10" />}
                    </div>
                ))}
                {/* <PopulateQuestionData hasMorePages={hasMoreAnswers} /> */}
            </TabsContent>
        </Tabs>
    );
}
