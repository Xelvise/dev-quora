"use client";

import Tag from "./Tag";
import Filters from "./Filters";
import { AnswerFilters } from "@/Constants/filters";
import { TagDoc } from "@/Backend/Database/tag.collection";
import { useState } from "react";
import PopulateAnswerCard from "../Populators/PopulateAnswerCard";
import { AnswerDoc } from "@/Backend/Database/answer.collection";

interface Props {
    stringifiedData: string;
    question_id: string;
    stringifiedQuestionTags: string;
    stringifiedSignedInUser: string;
    clientIP: string | null;
}

interface FetchedData {
    answers: AnswerDoc[];
    hasMorePages: boolean;
    totalAnswers: number;
}

// prettier-ignore
export default function AnswerLayout({ stringifiedData, question_id, stringifiedQuestionTags, stringifiedSignedInUser }: Props) {
    const data = JSON.parse(stringifiedData) as FetchedData;
    const question_tags = JSON.parse(stringifiedQuestionTags) as TagDoc[];

    const [showAnswers, setShowAnswers] = useState(false);

    return (
        <>
            <div className="mt-3 flex w-full items-center justify-between gap-5">
                <div className="flex flex-wrap gap-2" key="tags">
                    {question_tags.map(({ _id, name }) => (
                        <Tag
                            key={String(_id)}
                            name={name}
                            tag_id={String(_id)}
                            badgeClassNames="uppercase small-regular"
                        />
                    ))}
                </div>
                {data.totalAnswers > 0 && (
                    <p
                        className="primary-text-gradient paragraph-regular max-sm:body-regular cursor-pointer"
                        onClick={() => setShowAnswers(initial => !initial)}
                    >
                        {showAnswers
                            ? "Collapse Answers"
                            : data.totalAnswers === 1
                              ? `${data.totalAnswers} Answer`
                              : `${data.totalAnswers} Answers`}
                    </p>
                )}
            </div>

            <div className={`mt-10 w-full ${showAnswers ? "block" : "hidden"}`}>
                {data.totalAnswers > 0 && (
                    <div className="mb-10 flex w-fit justify-self-start rounded-[7px] max-sm:mb-5">
                        <Filters type="menu-list" filterData={AnswerFilters} defaultFilterValue="recent" />
                    </div>
                )}
                <PopulateAnswerCard
                    question_id={question_id}
                    stringifiedInitialData={stringifiedData}
                    stringifiedSignedInUser={stringifiedSignedInUser}
                />
            </div>
        </>
    );
}
