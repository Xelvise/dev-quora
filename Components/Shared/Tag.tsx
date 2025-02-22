import Link from "next/link";
import { Badge } from "../Shadcn/badge";

interface Props {
    id: string;
    name: string;
    badgeClassNames?: string;
    totalQuestions?: number;
    showCount?: boolean;
}

export default function Tag({ id, name, badgeClassNames = "", totalQuestions, showCount }: Props) {
    return (
        <div className={showCount ? "flex w-full justify-between gap-2" : ""}>
            <Link href={`/tags/${id}`}>
                <Badge
                    className={`bg-light800_dark300 text-light400_light500 whitespace-nowrap rounded-lg px-4 py-2 ${badgeClassNames}`}
                >
                    {name}
                </Badge>
            </Link>
            {showCount && <p className="small-medium text-dark100_light700">{totalQuestions}</p>}
        </div>
    );
}
