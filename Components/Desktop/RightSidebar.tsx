import Image from "next/image";
import Link from "next/link";
import Tag from "../Shared/Tag";

const hotQuestions = [
    { _id: 1, title: "How do I use express as a Custom server in NextJS?" },
    { _id: 2, title: "Cascading Deletes in SQLAlchemy" },
    { _id: 3, title: "How to perfectly center a div in CSS?" },
    { _id: 4, title: "Best practices for data fetching in a NextJS application with Server-Side Rendering (SSR)" },
    { _id: 5, title: "Redux toolkit not updating state as expected" },
];
const popularTags = [
    { _id: "1", name: "JavaScript", totalQuestions: 5 },
    { _id: "2", name: "React", totalQuestions: 3 },
    { _id: "3", name: "Next", totalQuestions: 1 },
    { _id: "4", name: "Vue", totalQuestions: 2 },
    { _id: "5", name: "Redux", totalQuestions: 4 },
];

export default function RightSidebar() {
    return (
        <section className="bg-light900_dark400 light-border no-scrollbar sticky right-0 top-0 flex h-screen w-[400px] flex-col overflow-y-auto border-l p-6 pt-36 shadow-light-300 dark:shadow-none max-xl:hidden">
            <div>
                <h3 className="h3-bold text-dark400_light900">Top Questions</h3>
                <div className="mt-7 flex w-full flex-col gap-[30px]">
                    {hotQuestions.map(({ _id, title }) => (
                        <Link
                            key={_id}
                            href={`/questions/${_id}`}
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

            <div className="mt-16">
                <h3 className="h3-bold text-dark400_light900">Popular tags</h3>
                <div className="mt-7 flex flex-col gap-4">
                    {popularTags.map(({ _id, name, totalQuestions }) => (
                        <Tag
                            key={_id}
                            id={_id}
                            name={name}
                            badgeClassNames="subtle-medium uppercase"
                            totalQuestions={totalQuestions}
                            showCount
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
