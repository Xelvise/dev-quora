"use client";

// prettier-ignore
import { Sheet, SheetContent, SheetClose, SheetTrigger, SheetHeader, SheetTitle } from "@/Components/Shadcn/sheet";
import { SignedOut } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../Shadcn/button";
import { sidebarLinks } from "@/Constants";
import SidebarNavLink from "../Generic/SidebarNavLink";
import { useState } from "react";

export default function MobileSidebar() {
    const [open, setOpen] = useState(false);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Image
                    src="/assets/icons/hamburger.svg"
                    alt="Menu"
                    width={36}
                    height={36}
                    className="invert-colors cursor-pointer sm:hidden"
                />
            </SheetTrigger>

            <SheetContent
                side="right"
                className="bg-light900_dark400 flex w-[20rem] flex-col justify-between border-none"
            >
                <SheetTitle className="hidden">DevQuora</SheetTitle>
                <SheetHeader>
                    <Link href="/" className="flex items-center gap-1">
                        <Image src="/assets/images/site-logo.svg" width={23} height={23} alt="DevQuora" />
                        <div className="h1-bold text-dark500_light900 font-spaceGrotesk">
                            Dev<span className="text-primary-500">Quora</span>
                        </div>
                    </Link>
                    <section className="flex flex-col gap-6 pt-12">
                        {sidebarLinks.map(({ imgURL, route, label }, index) => (
                            <SidebarNavLink
                                key={index}
                                imgURL={imgURL}
                                route={route}
                                label={label}
                                imgSize={16}
                                setOpenFn={setOpen}
                            />
                        ))}
                    </section>
                </SheetHeader>

                <SignedOut>
                    <div className="flex flex-col items-center gap-3">
                        <SheetClose asChild>
                            <Link href="/sign-in">
                                <Button className="paragraph-medium min-h-[41px] w-fit rounded-[10px] px-16 py-5 shadow-none">
                                    <span className="primary-text-gradient">Log In</span>
                                </Button>
                            </Link>
                        </SheetClose>
                        <SheetClose asChild>
                            <Link href="/sign-up">
                                <Button className="paragraph-medium solid-light-border btn-tertiary text-dark200_light900 min-h-[41px] w-fit rounded-[10px] px-16 py-5 shadow-none">
                                    Sign Up
                                </Button>
                            </Link>
                        </SheetClose>
                    </div>
                </SignedOut>
            </SheetContent>
        </Sheet>
    );
}
