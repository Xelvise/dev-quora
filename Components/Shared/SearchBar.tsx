"use client";

import Image from "next/image";
import { Input } from "../Shadcn/input";

interface Props {
    placeholder?: string;
    removeIcon?: boolean;
    inputClassName?: string;
    iconPosition?: "left" | "right";
    assetIcon?: string;
    containerClassName?: string;
}

const searchFn = (text: string) => {};

// prettier-ignore
export default function SearchBar({ placeholder="", removeIcon, inputClassName="", containerClassName="", assetIcon, iconPosition="left" }: Props) {
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
                className={`paragraph-regular max-sm:body-regular no-focus placeholder text-dark400_light800 border-none shadow-none outline-none ${inputClassName}`}
                onChange={(event) => searchFn(event.target.value)}
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
