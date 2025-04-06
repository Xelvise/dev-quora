/* eslint-disable @typescript-eslint/no-unused-expressions */
"use client";

import { findFilterNameByValue } from "@/app/utils";
// prettier-ignore
import { Select, SelectLabel, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/Components/Shadcn/select";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Badge } from "../Shadcn/badge";
import { useFilters } from "@/app/GlobalContextProvider";
import { useState } from "react";

interface Props {
    type: "tags" | "menu-list";
    filterData: { name: string; value: string }[];
    placeholder?: string;
    menuTriggerClassName?: string;
    menuContentClassName?: string;
    defaultFilterValue?: string;
}

// prettier-ignore
export default function Filters({ type, filterData, defaultFilterValue, placeholder="Select a Filter", menuTriggerClassName="", menuContentClassName=""}: Props) {
    const router = useRouter();
    const pathname = usePathname()
    const queryParams = useSearchParams();

    const initialFilter = queryParams.get("filter")
    const [selectedFilter, setSelectedFilter] = useState(initialFilter || "");

    const { filterFromContext, sendFilterToContext } = useFilters();

    const handleFilterSelection = async (value: string) => {
        pathname === "/" ? sendFilterToContext(value) : setSelectedFilter(value);
        const newURL = new URL(window.location.href);
        newURL.searchParams.set("filter", value);
        newURL.searchParams.delete("page");
        router.push(newURL.toString(), { scroll: false });
    }

    if (type === "menu-list") {
        return (
            <Select onValueChange={value => handleFilterSelection(value)}>
                <SelectTrigger
                    className={`bg-light800_darkgradient text-dark100_light700 paragraph-regular max-sm:body-regular rounded-[7px] border-none px-4 focus:ring-transparent h-[50px] min-w-[170px] ${menuTriggerClassName}`}
                >
                    <SelectValue
                        placeholder={
                            pathname === "/"
                                ? findFilterNameByValue(filterData, filterFromContext) ||
                                  findFilterNameByValue(filterData, defaultFilterValue) ||
                                  placeholder
                                : findFilterNameByValue(filterData, selectedFilter) ||
                                  findFilterNameByValue(filterData, defaultFilterValue) ||
                                  placeholder
                        }
                    />
                </SelectTrigger>
                <SelectContent
                    className={`bg-light800_dark200 text-dark100_light700 rounded-[7px] border-none p-1 ${menuContentClassName}`}
                >
                    <SelectGroup>
                        <SelectLabel className="paragraph-regular text-light-400">{placeholder}</SelectLabel>
                        {filterData.map(({ value, name }, index) => (
                            <SelectItem key={index} value={value} className="paragraph-regular">
                                {name}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
        );
    } else {
        return (
            <div className="flex flex-wrap justify-start gap-4 max-md:hidden">
                {filterData.map(({ value, name }, index) => (
                    <Badge
                        key={index}
                        className={`${(filterFromContext || defaultFilterValue) === value ? "bg-primary-100 text-primary-500" : "bg-light800_dark300 text-light400_light500"} cursor-pointer whitespace-nowrap rounded-[10px] px-4 py-2 capitalize`}
                        onClick={() => handleFilterSelection(value)}
                    >
                        {name}
                    </Badge>
                ))}
            </div>
        );
    }
}
