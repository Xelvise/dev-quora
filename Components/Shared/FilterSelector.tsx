import {
    Select,
    SelectLabel,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/Shadcn/select";

interface Props {
    placeholder: string;
    filters: { name: string; value: string }[];
    triggerClassNames?: string;
    contentClassNames?: string;
}

// prettier-ignore
export default function FilterSelector({ filters, placeholder, triggerClassNames="", contentClassNames=""}: Props) {
    return (
        <Select>
            <SelectTrigger className={`bg-light800_darkgradient text-dark100_light700 paragraph-regular max-sm:body-regular sm:h-[50px] rounded-[7px] border-none px-4 focus:ring-transparent ${triggerClassNames}`}>
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent className={`bg-light800_dark200 text-dark100_light700 rounded-[7px] border-none p-1 ${contentClassNames}`}>
                <SelectGroup>
                    <SelectLabel className="paragraph-regular text-light-400">{placeholder}</SelectLabel>
                    {filters.map(({ value, name }, index) => (
                        <SelectItem key={index} value={value} className="paragraph-regular">
                            {name}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}
