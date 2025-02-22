"use client";

import { useState } from "react";
import { Badge } from "../Shadcn/badge";

interface Props {
    filters: { name: string; value: string }[];
    badgeClasses?: string;
}

export default function FilterTags({ filters }: Props) {
    const [selectedTag, setSelectedTag] = useState("");

    return (
        <div className="flex flex-wrap justify-start gap-4 max-md:hidden">
            {filters.map(({ value, name }, index) => (
                <Badge
                    key={index}
                    className={`${selectedTag === value ? "bg-primary-100 text-primary-500" : "bg-light800_dark300 text-light400_light500"} cursor-pointer whitespace-nowrap rounded-[10px] px-4 py-2 capitalize`}
                >
                    {name}
                </Badge>
            ))}
        </div>
    );
}
