import { TagDoc } from "@/Backend/Database/tag.collection";
import Link from "next/link";
import Tag from "../Generic/Tag";

export default function TagCard({ tag }: { tag: TagDoc }) {
    return (
        <Link key={tag.id} href={`/tags/${tag.id}`}>
            <article className="bg-light900_dark400 solid-light-border card-wrapper dark:card-wrapper-dark flex flex-col items-center rounded-2xl py-10">
                <Tag name={tag.name} badgeClassNames="uppercase" />
                <p className="small-medium text-dark200_light500 mt-3.5">
                    <span className="body-semibold primary-text-gradient mr-2">{tag.questions.length}+</span>
                    Questions
                </p>
            </article>
        </Link>
    );
}
