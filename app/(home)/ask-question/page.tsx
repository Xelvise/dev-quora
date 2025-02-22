import { getUserByClerkID } from "@/Backend/Server-Side/Actions/user.action";
import AskQuestionForm from "@/Components/Forms/AskQuestionForm";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function AskQuestion() {
    const { userId } = await auth();
    if (!userId) redirect("/sign-in");
    const loggedInUser = await getUserByClerkID(userId);

    return (
        <main className="flex min-h-screen max-w-5xl flex-1 flex-col">
            <p className="h1-bold text-dark500_light900 mb-8">Ask a Question</p>
            <AskQuestionForm userObjectId={JSON.stringify(loggedInUser?._id)} />
        </main>
    );
}
