import { AnswerDocument } from "@/Backend/Database/answer.collection";
import Image from "next/image";
import Link from "next/link";
import VoteSection from "../Shared/VoteSection";
import { UserStructure } from "@/Backend/Database/user.collection";
import { calcTimeDiff } from "@/app/utils";
import ContentParser from "../Shared/ContentParser";

interface Props {
    answer: AnswerDocument;
    signedInUser: UserStructure | null;
}

export default function AnswerCard({ answer, signedInUser }: Props) {
    return (
        <article key={answer.id} className="bottom-only-border py-10">
            {/* Add a Span ID */}
            <div className="mb-3 flex flex-1 justify-between gap-2 max-sm:flex-col-reverse max-sm:gap-0 sm:items-center">
                <Link
                    href={`/profile/${answer.author.clerkId}`}
                    className="flex flex-1 items-start gap-1 sm:items-center"
                >
                    <Image
                        src={answer.author.picture}
                        width={25}
                        height={25}
                        alt="profile"
                        className="rounded-full object-cover max-sm:mt-0.5"
                    />
                    <div className="flex gap-1 max-sm:flex-col sm:items-center">
                        <p className="body-semibold text-dark300_light700">{answer.author.name}</p>
                        <p className="small-regular text-light400_light500 ml-0.5 line-clamp-1 cursor-text">
                            <span className="max-sm:hidden"> - </span> answered {calcTimeDiff(answer.createdAt)}
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
    );
}
