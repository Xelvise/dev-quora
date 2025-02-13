import {
    Select,
    SelectLabel,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/shadcn/select";

interface Props {
    filters: { name: string; value: string }[];
    triggerClassNames?: string;
    contentClassNames?: string;
    overrideMediaQuery?: string;
    containerClassNames?: string;
}

// prettier-ignore
export default function FilterSelector({ filters, triggerClassNames="", contentClassNames="", overrideMediaQuery="", containerClassNames=""}: Props) {
    return (
        <div className={`${overrideMediaQuery || "md:hidden"} ${containerClassNames}`}>
            <Select>
                <SelectTrigger className={`bg-light800_darkgradient text-dark100_light700 paragraph-regular h-[50px] w-full rounded-[7px] border-none px-4 focus:ring-transparent ${triggerClassNames}`}>
                    <SelectValue placeholder="Select a Filter" />
                </SelectTrigger>
                <SelectContent className={`bg-light800_darkgradient text-dark100_light700 rounded-[7px] border-none px-4 focus:ring-transparent ${contentClassNames}`}>
                    <SelectGroup>
                        <SelectLabel className="paragraph-regular text-light-400">Select a Filter</SelectLabel>
                        {filters.map(({ value, name }, index) => (
                            <SelectItem key={index} value={value} className="paragraph-regular">
                                {name}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    );
}
