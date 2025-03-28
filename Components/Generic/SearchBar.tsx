/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import Image from "next/image";
import { Input } from "../Shadcn/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { appendToQueryParams, removeFromQueryParams } from "@/app/utils";

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
    const pathname = usePathname();
    const queryParams = useSearchParams();

    const initialQuery = queryParams.get("q");
    const [searchValue, setSearchValue] = useState(initialQuery || "");

    useEffect(() => {
        const keyStrokeDelayFn = setTimeout(() => {
            if (searchValue.trim()) {
                const newURL = appendToQueryParams({
                    queryParamStr: queryParams.toString(), // takes the form of "filter=frequent&q=react"
                    queryKey: "q", 
                    queryValue: searchValue
                })
                router.push(newURL, {scroll: false})
            } else {
                const newURL = removeFromQueryParams({
                    queryParamStr: queryParams.toString(), // takes the form of "filter=frequent&q=react"
                    queryKeys: ["q"]
                });
                router.push(newURL, { scroll: false });
            }
        }, 1000)
        return () => clearTimeout(keyStrokeDelayFn)
    }, [searchValue])

    return (
        <div className={`bg-light800_darkgradient flex h-[50px] grow items-center gap-1 rounded-[7px] px-4 ${containerClassName}`}>
            {removeIcon
                ? null
                : iconPosition === "left" && assetIcon && (
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
                onChange={(event) => setSearchValue(event.target.value)}
            />
            {removeIcon
                ? null
                : iconPosition === "right" && assetIcon && (
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

// prettier-ignore
export function GlobalSearchBar({ placeholder, removeIcon, assetIcon, inputClassName="", containerClassName="", iconPosition="left" }: Props) {
    return (
        <div className={`bg-light800_darkgradient flex h-[50px] grow items-center gap-1 rounded-[7px] px-4 ${containerClassName}`}>
            {removeIcon
                ? null
                : iconPosition === "left" && assetIcon && (
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
                // value={searchValue}
                className={`paragraph-regular max-sm:body-regular no-focus placeholder text-dark400_light800 border-none shadow-none outline-none ${inputClassName}`}
                // onChange={(event) => setSearchValue(event.target.value)}
            />
            {removeIcon
                ? null
                : iconPosition === "right" && assetIcon && (
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
