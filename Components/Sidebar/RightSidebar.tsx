import Image from "next/image";
import Link from "next/link";
import Tag from "../Generic/Tag";
import { fetchHotQuestions } from "@/Backend/Server-Side/Actions/question.action";
import { fetchPopularTags } from "@/Backend/Server-Side/Actions/tag.action";

export default async function RightSidebar() {
    const hotQuestions = await fetchHotQuestions();
    const popularTags = await fetchPopularTags();
    return (
        <section className="bg-light900_dark400 light-border no-scrollbar sticky right-0 top-0 flex h-screen w-[400px] flex-col overflow-y-auto border-l p-6 pt-32 shadow-light-300 dark:shadow-none max-xl:hidden">
            <div>
                <h3 className="h3-bold text-dark400_light900">Top Questions</h3>
                <div className="mt-7 flex w-full flex-col gap-[30px]">
                    {hotQuestions.map(({ id, title }) => (
                        <Link
                            key={id}
                            href={`/question/${id}`}
                            className="flex cursor-pointer items-center justify-between gap-7"
                        >
                            <p className="body-medium text-dark100_light700">{title}</p>
                            <Image
                                src="/assets/icons/chevron-right.svg"
                                alt="chevron-right"
                                width={20}
                                height={20}
                                className="invert-colors"
                            />
                        </Link>
                    ))}
                </div>
            </div>

            <div className="mt-20">
                <h3 className="h3-bold text-dark400_light900">Popular tags</h3>
                <div className="mt-7 flex flex-col gap-4">
                    {popularTags.map(({ _id, name, numOfQuestions }) => (
                        <Tag
                            key={String(_id)}
                            tag_id={String(_id)}
                            name={name}
                            badgeClassNames="subtle-medium uppercase"
                            totalQuestions={numOfQuestions}
                            showCount
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
