import FilterSelector from "./FilterSelector";
import { AnswerFilters } from "@/Constants/filters";
import { fetchAnswers } from "@/Backend/Server-Side/Actions/answer.action";
import Link from "next/link";
import Image from "next/image";
import { calcTimeDiff } from "@/app/utils";
import ContentParser from "./ContentParser";
import VoteSection from "./VoteSection";
import { Schema } from "mongoose";
import { UserFormat } from "@/Backend/Database/user.collection";

interface Props {
    question_id: string;
    signedInUser: UserFormat | null;
}

export default async function AllAnswers({ question_id, signedInUser }: Props) {
    const answers = await fetchAnswers({ question_id, sortBy: "newest-to-oldest" });

    if (answers.length > 0) {
        return (
            <div className="mt-11 w-full">
                <div className="flex items-center justify-between">
                    <p className="primary-text-gradient paragraph-regular">
                        {answers.length === 1 ? `${answers.length} Answer` : `${answers.length} Answers`}
                    </p>
                    <div className="rounded-[7px] border">
                        <FilterSelector filters={AnswerFilters} placeholder="Select a Filter" />
                    </div>
                </div>

                <>
                    {answers.map(answer => (
                        <article key={answer.id} className="light-border border-b-2 py-10">
                            {/* Add a Span ID */}
                            <div className="mb-3 flex flex-1 justify-between gap-2 max-sm:flex-col-reverse max-sm:gap-0 sm:items-center">
                                <Link
                                    href={`/profile/${answer.author.clerkId}`}
                                    className="flex flex-1 items-start gap-1 sm:items-center"
                                >
                                    <Image
                                        src={answer.author.picture}
                                        width={18}
                                        height={18}
                                        alt="profile"
                                        className="rounded-full object-cover max-sm:mt-0.5"
                                    />
                                    <div className="flex gap-1 max-sm:flex-col sm:items-center">
                                        <p className="body-semibold text-dark300_light700">{answer.author.name}</p>
                                        <p className="small-regular text-light400_light500 ml-0.5 line-clamp-1 cursor-text">
                                            <span className="max-sm:hidden"> - </span> answered{" "}
                                            {calcTimeDiff(answer.createdAt)}
                                        </p>
                                    </div>
                                </Link>
                                <div className="flex justify-end">
                                    {/* prettier-ignore */}
                                    <VoteSection
                                        type="question"
                                        typeId={answer.id}
                                        userId={signedInUser?.id}
                                        upvotes={answer.upvotes.length}
                                        downvotes={answer.downvotes.length}
                                        hasUpvoted={signedInUser ? answer.upvotes.includes(signedInUser._id) : false}
                                        hasDownvoted={signedInUser ? answer.downvotes.includes(signedInUser._id) : false}
                                    />
                                </div>
                            </div>

                            <ContentParser content={answer.content} />
                        </article>
                    ))}
                </>
            </div>
        );
    }
    return null;
}
