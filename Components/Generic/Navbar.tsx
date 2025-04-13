import { SignedIn, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import ThemeSwitch from "./ThemeSwitch";
import MobileSidebar from "../Sidebar/MobileSidebar";
import { GlobalSearchBar } from "./GlobalSearchBar";
import MobileSearchModal from "./MobileSearchModal";
import { auth } from "@clerk/nextjs/server";

export default async function Navbar() {
    const { userId: clerkId } = await auth();
    return (
        <>
            {/* Desktop-only */}
            <nav className="bg-light900_dark400 shadow-effect fixed z-50 flex w-full items-center justify-between gap-5 px-8 py-4 dark:shadow-none max-sm:hidden">
                <Link href="/" className="flex items-center gap-1">
                    <Image src="/assets/images/site-logo.svg" width={23} height={23} alt="DevQuora" />
                    <p className="h1-bold font-spaceGrotesk text-dark-500 dark:text-light-900">
                        Dev<span className="text-primary-500">Quora</span>
                    </p>
                </Link>

                <GlobalSearchBar placeholder="Search globally" assetIcon="search" className="max-lg:hidden" />

                <div className="flex-between gap-10">
                    <ThemeSwitch />
                    <SignedIn>
                        <UserButton
                            appearance={{
                                elements: { avatarBox: "h-10 w-10" },
                                variables: { colorPrimary: "#ff7000" },
                            }}
                        />
                    </SignedIn>
                </div>
            </nav>

            {/* Mobile-only */}
            <nav className="bg-light900_dark400 shadow-effect fixed z-50 flex w-full items-center justify-between gap-5 px-8 py-4 dark:shadow-none max-sm:px-5 max-sm:py-3 sm:hidden">
                {clerkId ? (
                    <UserButton
                        appearance={{
                            elements: { avatarBox: "h-10 w-10" },
                            variables: { colorPrimary: "#ff7000" },
                        }}
                    />
                ) : (
                    <Link href="/">
                        <Image src="/assets/images/site-logo.svg" width={23} height={23} alt="DevQuora" />
                    </Link>
                )}

                <MobileSearchModal />

                <div className="flex-between gap-7">
                    <ThemeSwitch />
                    <MobileSidebar />
                </div>
            </nav>
        </>
    );
}
