import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Jobs | DevQuora",
    description:
        "A community-driven platform for asking and answering programming questions. Get help, share knowledge and collaborate with developers around the world. Explore topics in Web development, mobile app development, algorithms, data structures and more.",
    icons: {
        icon: "/assets/images/site-logo.svg",
    },
};

export default function Jobs() {
    return (
        <main className="flex min-h-screen max-w-5xl flex-1 flex-col gap-7 max-sm:gap-5">
            <h1 className="h1-bold max-sm:h3-bold text-dark300_light900">Find Jobs</h1>

            <section className="card-wrapper dark:card-wrapper-dark flex max-w-md flex-col items-center justify-center gap-5 rounded-lg p-10 text-center max-sm:p-5">
                <h2 className="h2-bold max-sm:h3-bold primary-text-gradient">Coming Soon!</h2>
                <p className="paragraph-regular text-dark300_light700">
                    We&apos;re working hard to bring you the best developer job opportunities. Job listings will be
                    available soon. Check back later!
                </p>
                <div className="mt-4 flex gap-5">
                    <Link href="/" className="paragraph-medium btn-secondary text-dark400_light900 rounded-[10px] p-3">
                        Explore Questions
                    </Link>
                    <Link
                        href="/community"
                        className="paragraph-medium primary-gradient rounded-[10px] p-3 text-light-900"
                    >
                        Connect with Devs
                    </Link>
                </div>
            </section>
        </main>
    );
}
