import { fetchUserProfileInfo, getSignedInUser } from "@/Backend/Server-Side/Actions/user.action";
import { SignedIn } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/Components/Shadcn/button";
import { parseDate } from "@/app/utils";
import { auth } from "@clerk/nextjs/server";
import ProfileLink from "@/Components/Generic/ProfileLink";
import UserStats from "@/Components/Generic/UserStats";
import { fetchUserTopQuestions } from "@/Backend/Server-Side/Actions/question.action";
import { fetchUserTopAnswers } from "@/Backend/Server-Side/Actions/answer.action";
import { redirect } from "next/navigation";
import QuestionAnswerTab from "@/Components/Generic/QuestionAnswerTab";

interface Props {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ page?: string }>;
}

export default async function Profile({ params }: Props) {
    const { id } = await params;

    const { userId: signedInUserId } = await auth();
    const signedInUser = await getSignedInUser(signedInUserId);

    const { user, totalQuestions, totalAnswers, badgeCounts } = await fetchUserProfileInfo(id);
    if (!user) redirect("/community"); // TODO: render a Toaster saying "User profile does not exist"
    const questionData = await fetchUserTopQuestions({ user_id: user.id });
    const answerData = await fetchUserTopAnswers({ user_id: user.id });

    return (
        <main className="flex max-w-5xl flex-1 flex-col">
            <div className="flex items-start justify-between max-sm:flex-col-reverse">
                <div className="flex items-start gap-4 max-md:flex-col max-sm:gap-2">
                    <Image
                        src={user.picture}
                        alt="picture"
                        width={120}
                        height={120}
                        className="rounded-full object-cover"
                    />
                    <div className="mt-3 flex flex-col">
                        <p className="h2-bold max-sm:base-semibold text-dark500_light900">{user.name}</p>
                        <p className="paragraph-regular max-sm:body-regular">
                            <span className="text-dark200_light500">@</span>
                            <span className="text-dark400_light800">{user.username}</span>
                        </p>
                        <div className="mt-3 flex flex-wrap gap-5 max-sm:flex-col max-sm:gap-2 sm:items-center">
                            {user.portfolioWebsite && (
                                <ProfileLink
                                    imgURL="/assets/icons/link.svg"
                                    href={user.portfolioWebsite}
                                    title="Portfolio"
                                />
                            )}
                            {user.location && <ProfileLink imgURL="/assets/icons/location.svg" title={user.location} />}
                            <ProfileLink
                                imgURL="/assets/icons/calendar.svg"
                                title={`Joined ${parseDate(user.joinedAt)}`}
                            />
                        </div>
                        {user.bio && (
                            <p className="paragraph-regular max-sm:body-regular text-dark200_light800 mt-5">
                                {user.bio}
                            </p>
                        )}
                    </div>
                </div>
                <div className="flex justify-end max-sm:w-full sm:mt-3">
                    <SignedIn>
                        {signedInUserId === user.clerkId && (
                            <Link href={"/profile/edit"}>
                                <Button className="paragraph-medium max-sm:body-medium btn-secondary text-dark300_light900 p-6 max-sm:p-4">
                                    Edit profile
                                </Button>
                            </Link>
                        )}
                    </SignedIn>
                </div>
            </div>
            <UserStats
                totalQuestions={totalQuestions}
                totalAnswers={totalAnswers}
                badgeCounts={badgeCounts}
                reputation={user.reputation}
            />
            <QuestionAnswerTab
                user_id={user.id}
                stringifiedQuestionData={questionData}
                stringifiedAnswerData={answerData}
                stringifiedSignedInUser={JSON.stringify(signedInUser)}
            />
        </main>
    );
}
