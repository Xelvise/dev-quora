import { getSignedInUser } from "@/Backend/Server-Side/Actions/user.action";
import AskQuestionForm from "@/Components/Forms/AskQuestionForm";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function AskQuestion() {
    const { userId: clerkId } = await auth();
    if (!clerkId) redirect("/sign-in");
    const user_id = await getSignedInUser(clerkId);

    return (
        <main className="flex min-h-screen max-w-5xl flex-1 flex-col">
            <p className="h1-bold text-dark500_light900 mb-8">Ask a Question</p>
            <AskQuestionForm user_id={JSON.stringify(user_id)} />
        </main>
    );
}
