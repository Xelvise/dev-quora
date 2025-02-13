"use client";

import Image from "next/image";
import { Input } from "../shadcn/input";

interface Props {
    searchFn: (text: string) => void;
    placeholder: string;
    removeIcon?: boolean;
    className?: string;
    iconPosition?: "left" | "right";
    icon?: string;
}

// prettier-ignore
export default function InputField({ searchFn, placeholder, removeIcon, className="", icon, iconPosition="left" }: Props) {
    return (
        <div className="bg-light800_darkgradient flex h-[50px] grow items-center gap-1 rounded-[7px] px-4">
            {removeIcon
                ? null
                : iconPosition === "left" && (
                      <Image
                          src={`/assets/icons/${icon ? icon : "search"}.svg`}
                          alt="searchIcon"
                          width={20}
                          height={20}
                          className="cursor-pointer"
                      />
                  )}
            <Input
                type="text"
                placeholder={placeholder}
                className={`paragraph-regular no-focus placeholder text-dark400_light800 border-none shadow-none outline-none ${className}`}
                onChange={() => searchFn}
            />
            {removeIcon
                ? null
                : iconPosition === "right" && (
                      <Image
                          src={`/assets/icons/${icon ? icon : "search"}.svg`}
                          alt="searchIcon"
                          width={20}
                          height={20}
                          className="cursor-pointer"
                      />
                  )}
        </div>
    );
}
