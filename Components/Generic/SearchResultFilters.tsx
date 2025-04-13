"use client";

import { GlobalSearchFilters } from "@/Constants/filters";
import { Button } from "../Shadcn/button";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SearchResultFilters({ className = "" }: { className?: string }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const searchFilter = searchParams.get("type");
    const [activeFilter, setActiveFilter] = useState(searchFilter || "");

    const handleTypeClick = (value: string) => {
        const newURL = new URL(window.location.href);
        if (activeFilter === value) {
            setActiveFilter("");
            newURL.searchParams.delete("type");
        } else {
            setActiveFilter(value);
            newURL.searchParams.set("type", value);
        }
        router.push(newURL.toString(), { scroll: false });
    };

    return (
        <div className={"flex items-center justify-start gap-5 " + className}>
            <p className="text-dark200_light900 paragraph-regular ml-2 sm:px-3">Type:</p>

            <div className="flex gap-3">
                {GlobalSearchFilters.map(({ name, value }) => (
                    <Button
                        key={value}
                        className={`light-border-2 small-medium rounded-2xl px-5 py-2 capitalize dark:text-light-800 ${activeFilter === value ? "bg-primary-500 text-light-900" : "bg-light-700 text-dark-400 dark:bg-dark-500 dark:hover:text-primary-500"}`}
                        onClick={() => handleTypeClick(value)}
                    >
                        {name}
                    </Button>
                ))}
            </div>
        </div>
    );
}
