import { TagDoc } from "@/Backend/Database/tag.collection";
import Link from "next/link";
import Tag from "../Generic/Tag";

export default function TagCard({ tag }: { tag: TagDoc }) {
    const count = tag.questions.length;
    return (
        <Link key={tag.id} href={`/tags/${tag.id}`}>
            <article className="card-wrapper dark:card-wrapper-dark solid-light-border flex w-fit flex-col flex-wrap items-center justify-center rounded-2xl p-8">
                <Tag name={tag.name} badgeClassNames="uppercase" />
                <p className="small-medium text-dark200_light500 mt-3.5">
                    <span className="body-semibold primary-text-gradient mr-2">{count}</span>
                    {count === 1 ? "Question" : "Questions"}
                </p>
            </article>
        </Link>
    );
}
