// NB: `params` returns path params, while searchParams returns query params

import { calcTimeDiff, formatNumber } from "@/app/utils";
import { fetchQuestionByID } from "@/Backend/Server-Side/Actions/question.action";
import Metric from "@/Components/Generic/Metric";
import ContentParser from "@/Components/Generic/ContentParser";
import Image from "next/image";
import Link from "next/link";
import AnswerForm from "@/Components/Forms/AnswerForm";
import { auth } from "@clerk/nextjs/server";
import { getSignedInUser } from "@/Backend/Server-Side/Actions/user.action";
import VoteSection from "@/Components/Generic/VoteSection";
import { QuestionViewCounter } from "@/Components/Generic/ViewCounters";
import { headers } from "next/headers";
import AnswerLayout from "@/Components/Generic/AnswerLayout";
import { UserDoc } from "@/Backend/Database/user.collection";
import EditAndDeleteAction from "@/Components/Generic/EditAndDeleteAction";
import { redirect } from "next/navigation";
import { fetchAnswers } from "@/Backend/Server-Side/Actions/answer.action";
import { AnswerFilter } from "@/Backend/Server-Side/parameters";

interface Props {
    params: Promise<{ id: string }>;
    searchParams: Promise<{
        filter?: AnswerFilter;
        page?: number;
    }>;
}

export default async function QuestionDetails({ params, searchParams }: Props) {
    const { id } = await params;
    const { filter, page } = await searchParams;
    const { userId: clerkId } = await auth();
    const signedInUser = await getSignedInUser(clerkId);

    const headersList = await headers();
    const IPs = headersList.get("x-forwarded-for");
    const ip = IPs ? IPs.split(",")[0].trim() : headersList.get("remote-addr");

    const question = await fetchQuestionByID(id);
    if (!question) return redirect("/"); // TODO: render a Toaster saying "Selected Question does not exist"
    const data = await fetchAnswers({ question_id: id, filter, page });

    const questionAuthor = question.author as any as UserDoc;
    const isUserAuthorized = signedInUser && signedInUser.id === questionAuthor.id;
    return (
        <main className="flex min-h-screen max-w-5xl flex-1 flex-col items-start justify-start">
            <QuestionViewCounter question_id={id} user_id={signedInUser?.id} clientIP={ip} />

            <div className="flex w-full justify-between gap-5 max-sm:flex-col-reverse max-sm:gap-1 sm:items-center">
                <Link href={`/profile/${questionAuthor.clerkId}`} className="flex justify-start gap-2">
                    <Image
                        src={questionAuthor.picture}
                        alt="profile-pic"
                        className="rounded-full object-contain"
                        width={25}
                        height={25}
                    />
                    <p className="paragraph-semibold text-dark300_light700">{questionAuthor.name}</p>
                </Link>
                <div className="flex items-center justify-end gap-3">
                    <VoteSection
                        postType="question"
                        post_id={question.id}
                        userId={signedInUser?.id}
                        upvotes={question.upvotes.length}
                        downvotes={question.downvotes.length}
                        hasUpvoted={signedInUser ? question.upvotes.includes(signedInUser._id) : false}
                        hasDownvoted={signedInUser ? question.downvotes.includes(signedInUser._id) : false}
                        hasSaved={signedInUser ? signedInUser.saved.includes(question._id) : false}
                    />
                    {isUserAuthorized && <EditAndDeleteAction postType="question" post_id={id} exitPageAfterDelete />}
                </div>
            </div>

            <h2 className="h2-semibold max-sm:h3-semibold text-dark400_light900 mt-3.5 w-full text-left">
                {question.title}
            </h2>

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

            <AnswerLayout
                stringifiedFetchedData={JSON.stringify(data)}
                currentPage={page}
                stringifiedQuestionTags={JSON.stringify(question.tags)}
                stringifiedSignedInUser={JSON.stringify(signedInUser)}
                clientIP={ip}
            />
            <AnswerForm stringifiedQuestion={JSON.stringify(question)} signedInUserId={signedInUser?.id} />
        </main>
    );
}
