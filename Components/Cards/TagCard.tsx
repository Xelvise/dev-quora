import { TagFormat } from "@/Backend/Database/tag.collection";
import Link from "next/link";
import Tag from "../Shared/Tag";

export default function TagCard({ tag }: { tag: TagFormat }) {
    return (
        <Link key={tag.id} href={`/tags/${tag.id}`}>
            <article className="bg-light900_dark400 light-border card-wrapper dark:card-wrapper-dark flex w-fit flex-col items-center rounded-2xl border px-6 py-10 sm:w-[260px]">
                <Tag name={tag.name} badgeClassNames="uppercase" />
                <p className="small-medium text-dark200_light500 mt-3.5">
                    <span className="body-semibold primary-text-gradient mr-2.5">{tag.questions.length}+</span>{" "}
                    Questions
                </p>
            </article>
        </Link>
    );
}
