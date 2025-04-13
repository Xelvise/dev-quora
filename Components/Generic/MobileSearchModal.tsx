/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/Components/Shadcn/dialog";
import { Button } from "../Shadcn/button";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Input } from "../Shadcn/input";
import GlobalSearchResultModal from "./GlobalSearchResultModal";

export default function MobileSearchModal() {
    const router = useRouter();
    const pathname = usePathname();
    const [searchValue, setSearchValue] = useState("");

    useEffect(() => {
        const debounceDelayFn = setTimeout(() => {
            const newURL = new URL(window.location.href);
            if (searchValue.trim()) {
                newURL.searchParams.set("global", searchValue);
            } else {
                newURL.searchParams.delete("global");
                newURL.searchParams.delete("type");
            }
            router.push(newURL.toString(), { scroll: false });
        }, 1000);
        return () => clearTimeout(debounceDelayFn);
    }, [searchValue]);

    // Ref to track the search bar container and search results container
    const modal = useRef<HTMLDivElement>(null);
    // State to manage the modal open/close state
    const [isOpen, setOpenState] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);

    // Close the modal on outside click, while ensuring clicks on search results or filters keeps the modal open
    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            const target = event.target as Node;
            // Check if the click is outside both the modal and the search results container
            if (modal.current && !modal.current.contains(target)) {
                setOpenState(false); // Close the modal
            }
        };
        document.addEventListener("mousedown", handleOutsideClick);
        return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, []);

    // Close the modal and dialog when the pathname changes
    useEffect(() => {
        setSearchValue("");
        setOpenState(false);
        setDialogOpen(false);
    }, [pathname]);

    // Handle link clicks in the search results
    const handleLinkClick = (href: string) => {
        const linkPath = href.split("?")[0]; // Remove query params to compare just the pathname
        // If the link points to the current page, we need to explicitly close the dialog since there won't be a pathname change event
        if (linkPath === pathname) {
            setDialogOpen(false);
            setOpenState(false);
        }
    };

    const handleEnterKeyPress = (event: React.MouseEvent<HTMLInputElement>) => {
        const value = event.currentTarget.value;
        if (value.trim()) {
            setSearchValue(value);
            if (!isOpen) setOpenState(true);
        }
    };

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                <Button className="bg-light800_dark300 max-w-[150px] grow gap-2 rounded-[10px] p-3">
                    <Image src="/assets/icons/search.svg" alt="searchIcon" width={18} height={18} />
                    <span className="small-regular text-light400_light500">Search globally</span>
                </Button>
            </DialogTrigger>

            <DialogContent className="border-none bg-white focus:outline-none dark:bg-dark-300" ref={modal}>
                <DialogTitle className="hidden">Mobile Search Modal</DialogTitle>
                <div className="mb-5 mt-20 flex h-[50px] w-full grow items-center gap-1 rounded-[7px] bg-light-800 px-5 dark:bg-dark-500">
                    <Image
                        src={`/assets/icons/search.svg`}
                        alt="Icon"
                        width={20}
                        height={20}
                        className="cursor-pointer"
                    />
                    <Input
                        type="text"
                        placeholder="Search globally"
                        value={searchValue}
                        className="paragraph-regular max-sm:body-regular no-focus placeholder text-dark400_light800 border-none shadow-none outline-none"
                        onChange={event => {
                            setSearchValue(event.target.value);
                            if (!isOpen && event.target.value.trim()) setOpenState(true);
                            if (event.target.value === "" && isOpen) setOpenState(false);
                        }}
                        onMouseDown={handleEnterKeyPress}
                    />
                </div>
                {isOpen && <GlobalSearchResultModal className="mt-2" onLinkClick={handleLinkClick} scrolling_filters />}
            </DialogContent>
        </Dialog>
    );
}
