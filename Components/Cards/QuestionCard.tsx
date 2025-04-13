import Tag from "../Generic/Tag";
import Link from "next/link";
import Metric from "../Generic/Metric";
import { formatNumber, calcTimeDiff } from "@/app/utils";
import { QuestionDoc } from "@/Backend/Database/question.collection";
import VoteSection from "../Generic/VoteSection";
import { UserDoc } from "@/Backend/Database/user.collection";
import { TagDoc } from "@/Backend/Database/tag.collection";

interface Props {
    question: QuestionDoc;
    signedInUser: UserDoc | null;
}

export default function QuestionCard({ question, signedInUser }: Props) {
    const { _id, id, title, upvotes, downvotes, views, answers, createdAt } = question;
    const questionAuthor = question.author as any as UserDoc;
    const questionTags = question.tags as any as TagDoc[];
    const totalVotes = upvotes.length + downvotes.length;

    return (
        <div className="shadow-effect flex flex-col items-start justify-center gap-5 rounded-[10px] px-6 py-8 max-sm:px-4 max-sm:py-5">
            <div className="flex w-full flex-col-reverse items-start gap-1">
                <div className="flex flex-col gap-1">
                    <p className="subtle-regular text-dark200_light700 line-clamp-1 md:hidden">{`asked ${calcTimeDiff(new Date(createdAt))}`}</p>
                    <Link href={`/question/${String(_id)}`}>
                        <p className="base-regular max-sm:paragraph-regular text-dark400_light900 line-clamp-1">
                            {title}
                        </p>
                    </Link>
                </div>
                <div className="flex items-center gap-3 self-end">
                    <VoteSection
                        postType="question"
                        post_id={String(_id)}
                        userId={signedInUser ? String(signedInUser._id) : null}
                        upvotes={upvotes.length}
                        downvotes={downvotes.length}
                        hasUpvoted={signedInUser ? upvotes.includes(signedInUser._id) : false}
                        hasDownvoted={signedInUser ? downvotes.includes(signedInUser._id) : false}
                        hasSaved={signedInUser ? signedInUser.saved.includes(_id) : false}
                    />
                </div>
            </div>

            <div className="flex flex-wrap gap-2">
                {questionTags.map(({ _id, name }) => (
                    <Tag
                        key={String(_id)}
                        tag_id={String(_id)}
                        name={name}
                        badgeClassNames="uppercase small-regular max-sm:subtle-regular rounded-[10px]"
                    />
                ))}
            </div>

            <div className="flex w-full flex-wrap items-center justify-between gap-3">
                <Metric
                    imgPath={questionAuthor.picture}
                    imgSize={25}
                    metricValue={questionAuthor.name}
                    metricName={`• asked ${calcTimeDiff(new Date(createdAt))}`}
                    href={`/profile/${questionAuthor.clerkId}`}
                    isAuthor
                />
                <div className="flex gap-3">
                    <Metric
                        imgPath="/assets/icons/like.svg"
                        metricValue={formatNumber(totalVotes)}
                        metricName={totalVotes === 1 ? "Vote" : "Votes"}
                        textStyles="line-clamp-1"
                    />
                    <Metric
                        imgPath="/assets/icons/message.svg"
                        metricValue={formatNumber(answers.length)}
                        metricName={answers.length === 1 ? "Answer" : "Answers"}
                        textStyles="line-clamp-1"
                    />
                    <Metric
                        imgPath="/assets/icons/eye.svg"
                        metricValue={formatNumber(views)}
                        metricName={views === 1 ? "View" : "Views"}
                        textStyles="line-clamp-1"
                    />
                </div>
            </div>
        </div>
    );
}
