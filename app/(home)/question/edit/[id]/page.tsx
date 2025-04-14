import { fetchQuestionByID } from "@/Backend/Server-Side/Actions/question.action";
import { getSignedInUser } from "@/Backend/Server-Side/Actions/user.action";
import AskQuestionForm from "@/Components/Forms/AskQuestionForm";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function EditQuestionPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const question = await fetchQuestionByID(id);
    if (!question) return redirect("/ask-question"); // TODO: render a toaster saying "Question cannot be edited since it doesn't exist"

    const { userId } = await auth();
    const user = await getSignedInUser(userId);

    return (
        <div className="flex max-w-5xl flex-1 flex-col gap-9">
            <p className="h1-bold max-sm:h3-bold text-dark500_light900">Edit Question</p>
            <AskQuestionForm formType="update" user_id={user?.id} stringifiedPrevQuestion={JSON.stringify(question)} />
        </div>
    );
}
