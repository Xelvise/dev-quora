"use client";
import { sidebarLinks } from "@/constants";
import { SignedIn, SignedOut, SignOutButton } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../shadcn/button";
import SidebarNavLink from "../shared/SidebarNavLink";
import Image from "next/image";

export default function LeftSidebar() {
    const pathname = usePathname();

    return (
        <section className="bg-light900_dark400 light-border no-scrollbar sticky left-0 top-0 flex h-screen w-fit flex-col justify-between overflow-y-auto border-r p-6 pt-36 shadow-light-300 dark:shadow-none max-sm:hidden lg:w-[270px]">
            <div className="flex flex-col gap-6">
                {sidebarLinks.map(({ imgURL, route, label }, index) => {
                    const isSelected = pathname === route;
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
                        <Button className="base-medium btn-secondary min-h-[41px] w-full rounded-[10px] px-4 py-3 shadow-none">
                            <Image
                                src="/assets/icons/account.svg"
                                alt="login"
                                width={30}
                                height={30}
                                className="invert-colors lg:hidden"
                            />
                            <span className="primary-text-gradient max-lg:hidden">Log In</span>
                        </Button>
                    </Link>
                    <Link href="/sign-up">
                        <Button className="base-medium light-border-2 btn-tertiary text-dark200_light900 min-h-[41px] w-full rounded-[10px] px-4 py-3 shadow-none">
                            <Image
                                src="/assets/icons/sign-up.svg"
                                alt="sign-up"
                                width={30}
                                height={30}
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
