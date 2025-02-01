import Navbar from "@/components/shared/Navbar";

export default function HomeLayout({ children }: { children: React.ReactNode }) {
    return (
        <main className="relative bg-light850_dark500">
            <Navbar />
            <div className="flex">
                LeftSidebar
                <section className="flex flex-1 flex-col min-h-screen px-6 sm:px-14 pb-6 pt-36 max-md:pb-14">
                    <div className="mx-auto w-full max-w-5xl">{children}</div>
                </section>
                RightSidebar
            </div>
            Toaster
        </main>
    );
}
