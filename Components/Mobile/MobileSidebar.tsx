"use client";

// prettier-ignore
import { Sheet, SheetContent, SheetClose, SheetTrigger, SheetHeader, SheetDescription, SheetTitle } from "@/Components/Shadcn/sheet";
import { SignedOut } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../Shadcn/button";
import { sidebarLinks } from "@/Constants";
import { usePathname } from "next/navigation";
import SidebarNavLink from "../Shared/SidebarNavLink";

export default function MobileSidebar() {
    const pathname = usePathname();

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Image
                    src="/assets/icons/hamburger.svg"
                    alt="Menu"
                    width={36}
                    height={36}
                    className="invert-colors sm:hidden"
                />
            </SheetTrigger>

            <SheetContent side="left" className="bg-light900_dark400 flex flex-col justify-between border-none">
                <SheetHeader>
                    <Link href="/" className="flex items-center gap-1">
                        <Image src="/assets/images/site-logo.svg" width={23} height={23} alt="DevQuora" />
                        <div className="h1-bold text-dark500_light900 font-spaceGrotesk">
                            Dev<span className="text-primary-500">Quora</span>
                        </div>
                    </Link>
                    <section className="flex flex-col gap-6 pt-12">
                        {sidebarLinks.map(({ imgURL, route, label }, index) => {
                            const isSelected = pathname === route;
                            return (
                                <SheetClose asChild key={index}>
                                    <SidebarNavLink
                                        imgURL={imgURL}
                                        route={route}
                                        label={label}
                                        isSelected={isSelected}
                                        imgSize={20}
                                    />
                                </SheetClose>
                            );
                        })}
                    </section>
                </SheetHeader>

                <SignedOut>
                    <div className="flex flex-col gap-3">
                        <SheetClose asChild>
                            <Link href="/sign-in">
                                <Button className="base-medium btn-secondary min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none">
                                    <span className="primary-text-gradient">Log In</span>
                                </Button>
                            </Link>
                        </SheetClose>
                        <SheetClose asChild>
                            <Link href="/sign-up">
                                <Button className="base-medium light-border-2 btn-tertiary text-dark200_light900 min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none">
                                    Sign Up
                                </Button>
                            </Link>
                        </SheetClose>
                    </div>
                </SignedOut>

                <SheetTitle className="hidden">DevQuora</SheetTitle>
                <SheetDescription className="hidden">Sidebar for Mobile view</SheetDescription>
            </SheetContent>
        </Sheet>
    );
}
