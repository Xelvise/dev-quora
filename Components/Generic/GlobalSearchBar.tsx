/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import Image from "next/image";
import { Input } from "../Shadcn/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import GlobalSearchResultModal from "./SearchResultModal";

interface Props {
    placeholder?: string;
    removeIcon?: boolean;
    inputClassName?: string;
    iconPosition?: "left" | "right";
    assetIcon?: string;
}

// prettier-ignore
export function GlobalSearchBar({ placeholder, removeIcon, assetIcon, inputClassName="", iconPosition="left" }: Props) {
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
            newURL.searchParams.delete("page");
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
        setOpenState(false);
    }, [pathname]);

    return (
        <div
            className="bg-light800_darkgradient flex h-[50px] max-w-[600px] grow items-center gap-1 rounded-[7px] px-4 max-lg:hidden xl:max-w-[800px]"
            ref={modal}
        >
            {removeIcon
                ? null
                : iconPosition === "left" &&
                  assetIcon && (
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
                    if (!isOpen) setOpenState(true);
                    if (event.target.value === "" && isOpen) setOpenState(false);
                }}
            />
            {removeIcon
                ? null
                : iconPosition === "right" &&
                  assetIcon && (
                      <Image
                          src={`/assets/icons/${assetIcon}.svg`}
                          alt="searchIcon"
                          width={20}
                          height={20}
                          className="cursor-pointer"
                      />
                  )}
            {isOpen && <GlobalSearchResultModal />}
        </div>
    );
}
