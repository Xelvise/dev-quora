import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
    return (
        <main className="flex min-h-screen w-full flex-col items-center justify-center">
            <SignIn />
        </main>
    );
}
