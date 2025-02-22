import LeftSidebar from "@/Components/Desktop/LeftSidebar";
import Navbar from "@/Components/Shared/Navbar";
import RightSidebar from "@/Components/Desktop/RightSidebar";

export default function HomeLayout({ children }: { children: React.ReactNode }) {
    return (
        <section className="bg-light850_dark500 relative">
            <Navbar />
            <div className="flex">
                <LeftSidebar />
                <section className="flex flex-1 justify-center px-10 pb-10 pt-40 max-sm:px-5 max-sm:pt-32">
                    {children}
                </section>
                <RightSidebar />
            </div>
            {/* Toaster */}
        </section>
    );
}
