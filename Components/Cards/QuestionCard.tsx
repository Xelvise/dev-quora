import Tag from "../Shared/Tag";
import Link from "next/link";
import Metric from "../Shared/Metric";
import { formatNumber, calcTimeDiff } from "@/app/utils";
import { QuestionFormat } from "@/Backend/Database/question.collection";

export default function QuestionCard({ question }: { question: QuestionFormat }) {
    const { id, title, tags, author, upvotes, views, answers, createdAt } = question;
    return (
        <div className="card-wrapper dark:card-wrapper-dark flex flex-col items-start justify-center gap-5 rounded-[10px] p-8 sm:px-10">
            <div className="flex flex-col gap-1">
                <p className="subtle-regular text-dark200_light700 line-clamp-1 sm:hidden">{`asked ${calcTimeDiff(createdAt)}`}</p>
                <Link href={`/question/${id}`}>
                    <p className="sm:h3-semibold base-semibold text-dark400_light900 line-clamp-1">{title}</p>
                </Link>
            </div>

            {/* If signed in, implement - add, edit & delete actions */}

            <div className="flex flex-wrap gap-2">
                {tags.map(({ id, name }) => (
                    <Tag key={id} id={id} name={name} badgeClassNames="uppercase small-regular rounded-[10px]" />
                ))}
            </div>

            <div className="flex w-full flex-wrap items-center justify-between gap-3">
                <Metric
                    imgPath={author.picture}
                    imgSize={30}
                    metricValue={author.name}
                    metricName={`• asked ${calcTimeDiff(createdAt)}`}
                    href={`/profile/${author.clerkId}`}
                    isAuthor
                />
                <div className="flex gap-4">
                    <Metric
                        imgPath="/assets/icons/like.svg"
                        metricValue={formatNumber(upvotes.length)}
                        metricName="Likes"
                        textStyles="line-clamp-1"
                    />
                    <Metric
                        imgPath="/assets/icons/message.svg"
                        metricName="Answers"
                        metricValue={formatNumber(answers.length)}
                        textStyles="line-clamp-1"
                    />
                    <Metric
                        imgPath="/assets/icons/eye.svg"
                        metricName="Views"
                        metricValue={formatNumber(views)}
                        textStyles="line-clamp-1"
                    />
                </div>
            </div>
        </div>
    );
}
