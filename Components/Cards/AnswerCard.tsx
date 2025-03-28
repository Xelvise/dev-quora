import { AnswerDoc } from "@/Backend/Database/answer.collection";
import Image from "next/image";
import Link from "next/link";
import VoteSection from "../Generic/VoteSection";
import { UserDoc } from "@/Backend/Database/user.collection";
import { calcTimeDiff } from "@/app/utils";
import ContentParser from "../Generic/ContentParser";
import EditAndDeleteAction from "../Generic/EditAndDeleteAction";

interface Props {
    answer: AnswerDoc;
    signedInUser: UserDoc | null;
}

export default function AnswerCard({ answer, signedInUser }: Props) {
    const answerAuthor = answer.author as any as UserDoc;
    const isUserAuthorized = signedInUser && signedInUser.id === answerAuthor.id;

    return (
        <article key={answer.id}>
            {/* Add a Span ID */}
            <div className="flex flex-1 justify-between gap-2 max-sm:flex-col-reverse max-sm:gap-0 sm:items-center">
                <Link
                    href={`/profile/${answerAuthor.clerkId}`}
                    className="flex flex-1 items-start gap-1 sm:items-center"
                >
                    <Image
                        src={answerAuthor.picture}
                        width={25}
                        height={25}
                        alt="profile"
                        className="rounded-full object-cover max-sm:mt-0.5"
                    />
                    <div className="flex gap-1 max-sm:flex-col sm:items-center">
                        <p className="body-semibold text-dark300_light700">{answerAuthor.name}</p>
                        <p className="small-regular text-light400_light500 ml-0.5 line-clamp-1 cursor-text">
                            <span className="max-sm:hidden"> - </span> answered{" "}
                            {calcTimeDiff(new Date(answer.createdAt))}
                        </p>
                    </div>
                </Link>
                <div className="flex items-center gap-2 self-end">
                    {/* prettier-ignore */}
                    <VoteSection
                          postType="question"
                          post_id={answer.id}
                          userId={signedInUser?.id}
                          upvotes={answer.upvotes.length}
                          downvotes={answer.downvotes.length}
                          hasUpvoted={signedInUser ? answer.upvotes.includes(signedInUser._id) : false}
                          hasDownvoted={signedInUser ? answer.downvotes.includes(signedInUser._id) : false}
                    />
                    {isUserAuthorized && <EditAndDeleteAction postType="answer" post_id={String(answer._id)} />}
                </div>
            </div>

            <ContentParser content={answer.content} />
        </article>
    );
}
