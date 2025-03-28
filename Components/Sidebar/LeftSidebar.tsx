"use client";
import { sidebarLinks } from "@/Constants";
import { SignedIn, SignedOut, SignOutButton } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../Shadcn/button";
import SidebarNavLink from "../Generic/SidebarNavLink";
import Image from "next/image";

export default function LeftSidebar() {
    const pathname = usePathname();

    return (
        <section className="bg-light900_dark400 light-border no-scrollbar sticky left-0 top-0 flex h-screen w-fit flex-col justify-between gap-10 overflow-y-auto border-r p-5 pt-32 shadow-light-400 dark:shadow-none max-sm:hidden lg:w-[275px]">
            <div className="flex flex-col gap-5">
                {sidebarLinks.map(({ imgURL, route, label }, index) => {
                    const isSelected = pathname === route; // || pathname.split("/").includes(label.toLowerCase());
                    return (
                        <SidebarNavLink
                            key={index}
                            imgURL={imgURL}
                            imgSize={20}
                            route={route}
                            label={label}
                            isSelected={isSelected}
                            isDesktopView
                        />
                    );
                })}
            </div>

            <SignedOut>
                <div className="flex flex-col gap-3">
                    <Link href="/sign-in">
                        <Button className="base-medium min-h-[41px] w-full rounded-[10px] px-4 py-6 shadow-none lg:hover:border-[2px] lg:hover:border-primary-300">
                            <Image
                                src="/assets/icons/account.svg"
                                alt="login"
                                width={25}
                                height={25}
                                className="invert-colors lg:hidden"
                            />
                            <span className="primary-text-gradient max-lg:hidden">Log In</span>
                        </Button>
                    </Link>
                    <Link href="/sign-up">
                        <Button className="base-medium lg:solid-light-border lg:btn-tertiary text-dark200_light900 min-h-[41px] w-full px-4 py-6 shadow-none lg:rounded-[10px]">
                            <Image
                                src="/assets/icons/sign-up.svg"
                                alt="sign-up"
                                width={25}
                                height={25}
                                className="invert-colors lg:hidden"
                            />
                            <span className="max-lg:hidden">Sign Up</span>
                        </Button>
                    </Link>
                </div>
            </SignedOut>
        </section>
    );
}
