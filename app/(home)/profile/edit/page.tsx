import { getSignedInUser } from "@/Backend/Server-Side/Actions/user.action";
import ProfileUpdateForm from "@/Components/Forms/ProfileUpdateForm";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function EditProfilePage() {
    const { userId } = await auth();
    if (!userId) return redirect("/sign-in"); // Clerk Middleware should intercept this route, ensuring User is authenticated
    const profile = await getSignedInUser(userId);
    if (!profile) throw new Error("Could not find associated User");

    return (
        <div className="flex max-w-5xl flex-1 flex-col gap-9">
            <p className="h1-bold text-dark500_light900">Edit Question</p>
            <ProfileUpdateForm clerkId={userId} profileDetails={JSON.stringify(profile)} />
        </div>
    );
}
