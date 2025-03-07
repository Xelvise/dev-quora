"use client";

import { QuestionDocument } from "@/Backend/Database/question.collection";
import { UserStructure } from "@/Backend/Database/user.collection";
import { Button } from "../Shadcn/button";
import Tag from "./Tag";
import { useState } from "react";
import { AnswerDocument } from "@/Backend/Database/answer.collection";
import FilterSelector from "./FilterSelector";
import { AnswerFilters } from "@/Constants/filters";
import AnswerCard from "../Cards/AnswerCard";
import { AnswerViewCounter } from "./ViewCounters";

interface Props {
    question: QuestionDocument;
    signedInUser: UserStructure | null;
    answers: AnswerDocument[];
}

export default function AnswerLayout({ question, signedInUser, answers }: Props) {
    const [open, setOpen] = useState(false);
    console.log("Rendering Answer Layout");

    return (
        <>
            <div className="flex w-full items-center justify-between">
                <div className="mt-3 flex flex-wrap gap-2">
                    {question.tags.map(({ id, name }) => (
                        <Tag key={id} name={name} id={id} badgeClassNames="uppercase small-regular" />
                    ))}
                </div>
                <Button variant="link" className="hover:no-underline" onClick={() => setOpen(!open)}>
                    <p className="primary-text-gradient paragraph-regular">
                        {open
                            ? "Collapse Answers"
                            : question.answers.length === 1
                              ? `${question.answers.length} Answer`
                              : `${question.answers.length} Answers`}
                    </p>
                </Button>
            </div>

            {open && answers.length > 0 ? (
                <div className="mt-11 w-full">
                    {/* <AnswerViewCounter/> */}
                    <div className="flex self-end rounded-[7px] border">
                        <FilterSelector filters={AnswerFilters} placeholder="Select a Filter" />
                    </div>

                    {answers.map(answer => (
                        <AnswerCard key={answer.id} answer={answer} signedInUser={signedInUser} />
                    ))}
                </div>
            ) : null}
        </>
    );
}
