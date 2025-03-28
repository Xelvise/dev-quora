import { SignedIn, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import ThemeSwitch from "./ThemeSwitch";
import MobileSidebar from "../Sidebar/MobileSidebar";
import { GlobalSearchBar } from "./SearchBar";

export default function Navbar() {
    return (
        <nav className="flex-between bg-light900_dark400 shadow-effect fixed z-50 flex w-full gap-5 px-8 py-4 dark:shadow-none max-sm:px-5 max-sm:py-3">
            {/* Desktop-only */}
            <Link href="/" className="flex items-center gap-1 max-sm:hidden">
                <Image src="/assets/images/site-logo.svg" width={23} height={23} alt="DevQuora" />
                <p className="h1-bold font-spaceGrotesk text-dark-500 dark:text-light-900">
                    Dev<span className="text-primary-500">Quora</span>
                </p>
            </Link>

            {/* Mobile-only */}
            <div className="flex items-center sm:hidden">
                <SignedIn>
                    <UserButton
                        appearance={{ elements: { avatarBox: "h-10 w-10" }, variables: { colorPrimary: "#ff7000" } }}
                    />
                </SignedIn>
            </div>

            {/* Desktop-only */}
            <div className="w-full max-w-[600px] max-lg:hidden">
                <GlobalSearchBar placeholder="Search globally" assetIcon="search" />
            </div>

            {/* Mobile and Desktop */}
            <div className="flex-between gap-10">
                <ThemeSwitch />
                {/* Desktop-only */}
                <div className="flex self-center max-sm:hidden">
                    <SignedIn>
                        <UserButton
                            appearance={{
                                elements: { avatarBox: "h-10 w-10" },
                                variables: { colorPrimary: "#ff7000" },
                            }}
                        />
                    </SignedIn>
                </div>
                <MobileSidebar />
            </div>
        </nav>
    );
}
