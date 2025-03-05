// NB: `params` returns path params, while searchParams returns query params

import { calcTimeDiff, formatNumber } from "@/app/utils";
import { fetchQuestionByID } from "@/Backend/Server-Side/Actions/question.action";
import Metric from "@/Components/Shared/Metric";
import ContentParser from "@/Components/Shared/ContentParser";
import Tag from "@/Components/Shared/Tag";
import Image from "next/image";
import Link from "next/link";
import AnswerForm from "@/Components/Forms/AnswerForm";
import { auth } from "@clerk/nextjs/server";
import AllAnswers from "@/Components/Shared/AllAnswers";
import { getSignedInUser } from "@/Backend/Server-Side/Actions/user.action";
import VoteSection from "@/Components/Shared/VoteSection";

export default async function QuestionDetails({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const { userId: clerkId } = await auth();
    const signedInUser = await getSignedInUser(clerkId);

    const question = await fetchQuestionByID(id);
    if (!question) return; // TODO: render a Toaster beneath the page to inform User of resulting error

    return (
        <main className="flex min-h-screen max-w-5xl flex-1 flex-col items-start justify-start">
            <div className="flex w-full justify-between gap-5 max-sm:flex-col-reverse max-sm:gap-1 sm:items-center">
                <Link href={`/profile/${question.author.clerkId}`} className="flex justify-start gap-2">
                    <Image
                        src={question.author.picture}
                        alt="profile-pic"
                        className="rounded-full object-contain"
                        width={25}
                        height={25}
                    />
                    <p className="paragraph-semibold text-dark300_light700">{question.author.name}</p>
                </Link>
                <div className="flex justify-end">
                    <VoteSection
                        type="question"
                        typeId={question.id}
                        userId={signedInUser?.id}
                        upvotes={question.upvotes.length}
                        downvotes={question.downvotes.length}
                        hasUpvoted={signedInUser ? question.upvotes.includes(signedInUser._id) : false}
                        hasDownvoted={signedInUser ? question.downvotes.includes(signedInUser._id) : false}
                        hasSaved={signedInUser ? signedInUser.saved.includes(question._id) : false}
                    />
                </div>
            </div>

            <h2 className="h2-semibold text-dark400_light900 mt-3.5 w-full text-left">{question.title}</h2>

            <div className="mb-2 mt-3 flex flex-wrap gap-4">
                <Metric
                    imgPath="/assets/icons/clock.svg"
                    metricValue={`asked ${calcTimeDiff(question.createdAt)}`}
                    textStyles="line-clamp-1"
                />
                <Metric
                    imgPath="/assets/icons/message.svg"
                    metricValue={formatNumber(question.answers.length)}
                    metricName={question.answers.length === 1 ? "Answer" : "Answers"}
                    textStyles="line-clamp-1"
                />
                <Metric
                    imgPath="/assets/icons/eye.svg"
                    metricValue={formatNumber(question.views)}
                    metricName={question.views === 1 ? "View" : "Views"}
                    textStyles="line-clamp-1"
                />
            </div>

            <ContentParser content={question.content} />

            <div className="mt-3 flex flex-wrap gap-2">
                {question.tags.map(({ id, name }) => (
                    <Tag key={id} name={name} id={id} badgeClassNames="uppercase small-regular" />
                ))}
            </div>

            <AllAnswers question_id={question.id} signedInUser={signedInUser} />

            <AnswerForm question_id={question.id} signedInUserId={signedInUser?.id} />
        </main>
    );
}
