/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import Image from "next/image";
import { Input } from "../Shadcn/input";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Props {
    placeholder?: string;
    removeIcon?: boolean;
    inputClassName?: string;
    iconPosition?: "left" | "right";
    assetIcon?: string;
    containerClassName?: string;
}

// prettier-ignore
export function LocalSearchBar({ placeholder, removeIcon, assetIcon, inputClassName="", containerClassName="", iconPosition="left" }: Props) {
    const router = useRouter();
    const queryParams = useSearchParams();

    const localQuery = queryParams.get("q");
    const [searchValue, setSearchValue] = useState(localQuery || "");

    useEffect(() => {
        const debounceDelayFn = setTimeout(() => {
            const newURL = new URL(window.location.href);
            if (searchValue.trim()) {
                newURL.searchParams.set("q", searchValue);
                newURL.searchParams.delete("global");
            } else {
                newURL.searchParams.delete("q");
            }
            newURL.searchParams.delete("page");
            router.push(newURL.toString(), { scroll: false });
        }, 1000)
        return () => clearTimeout(debounceDelayFn)
    }, [searchValue])

    return (
        <div
            className={`bg-light800_darkgradient flex h-[50px] grow items-center gap-1 rounded-[7px] px-4 ${containerClassName}`}
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
                onChange={event => setSearchValue(event.target.value)}
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
        </div>
    );
}
