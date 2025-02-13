"use client";

import { SignedIn, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import ThemeSwitch from "./ThemeSwitch";
import MobileSidebar from "../mobile/MobileSidebar";
import InputField from "./InputField";

export default function Navbar() {
    return (
        <nav
            suppressHydrationWarning
            className="flex-between bg-light900_dark400 fixed z-50 flex w-full gap-5 p-6 shadow-light-300 dark:shadow-none sm:px-12"
        >
            <Link href="/" className="flex items-center gap-1">
                <Image src="/assets/images/site-logo.svg" width={23} height={23} alt="DevFlow" />
                <p className="h1-bold font-spaceGrotesk text-dark-500 dark:text-light-900 max-sm:hidden">
                    Dev<span className="text-primary-500">Quora</span>
                </p>
            </Link>
            <div className="w-full max-w-[600px] max-lg:hidden">
                <InputField placeholder="Search globally" searchFn={(text) => {}} />
            </div>
            <div className="flex-between gap-5">
                <ThemeSwitch />
                <SignedIn>
                    <UserButton
                        afterSignOutUrl="/"
                        appearance={{ elements: { avatarBox: "h-10 w-10" }, variables: { colorPrimary: "#ff7000" } }}
                    />
                </SignedIn>
                <MobileSidebar />
            </div>
        </nav>
    );
}
