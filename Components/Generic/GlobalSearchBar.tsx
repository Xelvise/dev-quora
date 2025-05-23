/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import Image from "next/image";
import { Input } from "../Shadcn/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import GlobalSearchResultModal from "./GlobalSearchResultModal";

interface Props {
    placeholder?: string;
    removeIcon?: boolean;
    inputClassName?: string;
    assetIcon?: string;
    className?: string;
}

// prettier-ignore
export function GlobalSearchBar({ placeholder, removeIcon, assetIcon, inputClassName="", className="" }: Props) {
    const router = useRouter();
    const pathname = usePathname();
    const queryParams = useSearchParams();

    const localQuery = queryParams.get("q");
    const globalQuery = queryParams.get("global");
    const [searchValue, setSearchValue] = useState(globalQuery || "");

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

    // Ref to track the search bar container
    const modal = useRef<HTMLDivElement>(null);
    const [isOpen, setOpenState] = useState(false);

    // Close the modal on outside click
    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (modal.current && !modal.current.contains(event.target as Node)) {
                setOpenState(false); // Close the modal
            }
        };
        document.addEventListener("mousedown", handleOutsideClick);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, []);

    // Close the modal when the pathname changes
    useEffect(() => {
        setSearchValue("")
        setOpenState(false);
    }, [pathname]);

    return (
        <div
            className={`bg-light800_darkgradient flex h-[50px] max-w-[600px] grow items-center gap-1 rounded-[7px] px-4 xl:max-w-[800px] ${className}`}
            ref={modal}
        >
            {removeIcon
                ? null
                : assetIcon && (
                      <Image
                          src={`/assets/icons/${assetIcon}.svg`}
                          alt="Icon"
                          width={20}
                          height={20}
                          className="cursor-pointer"
                      />
                  )}
            <Input
                type="text"
                placeholder={placeholder}
                value={searchValue}
                className={`paragraph-regular max-sm:body-regular no-focus placeholder text-dark400_light800 border-none shadow-none outline-none ${inputClassName}`}
                onChange={event => {
                    setSearchValue(event.target.value);
                    if (!isOpen && event.target.value.trim()) setOpenState(true);
                    if (event.target.value === "" && isOpen) setOpenState(false);
                }}
            />
            {isOpen && (
                <GlobalSearchResultModal className="absolute top-full z-10 mt-3 max-w-[570px] rounded-xl bg-light-800 py-5 shadow-sm dark:bg-dark-400 xl:max-w-[770px]" />
            )}
        </div>
    );
}
