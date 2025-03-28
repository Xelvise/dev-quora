"use client";

import { UserDoc } from "@/Backend/Database/user.collection";
import Tag from "./Tag";
import { AnswerDoc } from "@/Backend/Database/answer.collection";
import Filters from "./Filters";
import { AnswerFilters } from "@/Constants/filters";
import AnswerCard from "../Cards/AnswerCard";
import { TagDoc } from "@/Backend/Database/tag.collection";
import Divider from "./Divider";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnswerFilter } from "@/Backend/Server-Side/parameters";
import PopulateQuestionData from "./PopulateQuestionData";

interface Props {
    fetchedAnswers: any;
    answerFilter?: AnswerFilter;
    currentPage?: number;
    questionTags: any;
    signedInUser: any;
    clientIP: string | null;
    hasMorePages: boolean;
}

export default function AnswerLayout({ fetchedAnswers, questionTags, signedInUser, hasMorePages }: Props) {
    const searchParams = useSearchParams();

    const answers = JSON.parse(fetchedAnswers) as AnswerDoc[];
    const questionTags_ = JSON.parse(questionTags) as TagDoc[];
    const signedInUser_ = JSON.parse(signedInUser) as UserDoc | null;

    const [showAnswers, setShowAnswers] = useState(searchParams.get("filter") !== null);

    return (
        <>
            <div className="mt-3 flex w-full items-center justify-between gap-5">
                <div className="flex flex-wrap gap-2" key="tags">
                    {questionTags_.map(({ _id, name }) => (
                        <Tag
                            key={String(_id)}
                            name={name}
                            tag_id={String(_id)}
                            badgeClassNames="uppercase small-regular"
                        />
                    ))}
                </div>
                {answers.length > 0 && (
                    <p
                        className="primary-text-gradient paragraph-regular max-sm:body-regular cursor-pointer"
                        onClick={() => setShowAnswers(initial => !initial)}
                    >
                        {showAnswers
                            ? "Collapse Answers"
                            : answers.length === 1
                              ? `${answers.length} Answer`
                              : `${answers.length} Answers`}
                    </p>
                )}
            </div>

            {showAnswers && (
                <div className="mt-10 w-full">
                    <div className="mb-10 flex w-fit justify-self-end rounded-[7px]">
                        <Filters type="menu-list" filterData={AnswerFilters} defaultFilterValue="recent" />
                    </div>
                    {answers.map(answer => (
                        <div key={answer.id}>
                            <AnswerCard answer={answer} signedInUser={signedInUser_} />
                            {answers[answers.length - 1] !== answer && <Divider className="my-10" />}
                        </div>
                    ))}
                    {/* <PopulateQuestionData hasMorePages={hasMorePages} /> */}
                </div>
            )}
        </>
    );
}
