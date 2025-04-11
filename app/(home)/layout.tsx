import LeftSidebar from "@/Components/Sidebar/LeftSidebar";
import Navbar from "@/Components/Generic/Navbar";
import RightSidebar from "@/Components/Sidebar/RightSidebar";
import { Toaster } from "@/Components/Shadcn/toaster";

export default function HomeLayout({ children }: { children: React.ReactNode }) {
    return (
        <section className="bg-light850_dark500 relative">
            <Navbar />
            <div className="flex">
                <LeftSidebar />
                <section className="flex flex-1 justify-center px-10 pb-10 pt-28 max-lg:px-6 max-sm:px-4 max-sm:pt-24">
                    {children}
                </section>
                <RightSidebar />
            </div>
            <Toaster />
        </section>
    );
}
