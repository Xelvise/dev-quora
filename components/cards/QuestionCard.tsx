import Tag from "../shared/Tag";
import Link from "next/link";
import Metric from "../shared/Metric";
import { formatNumber, getTimestamp } from "@/lib/utils";

interface Props {
    question: {
        _id: string;
        title: string;
        tags: {
            _id: string;
            name: string;
        }[];
        author: {
            _id: string;
            name: string;
            picture: string;
        };
        upvotes: number;
        views: number;
        answers: object[];
        createdAt: Date;
    };
}

export default function QuestionCard({ question }: Props) {
    const { _id, title, tags, author, upvotes, views, answers, createdAt } = question;
    return (
        <div className="card-wrapper dark:card-wrapper-dark flex flex-col items-start justify-center gap-5 rounded-[10px] p-8 sm:px-10">
            <div className="flex flex-col gap-1">
                <p className="subtle-regular text-dark200_light700 line-clamp-1 sm:hidden">{`${getTimestamp(createdAt)} days ago`}</p>
                <Link href={`/question/${_id}`}>
                    <p className="sm:h3-semibold base-semibold text-dark400_light900 line-clamp-1">{title}</p>
                </Link>
            </div>

            {/* If signed in, implement - add, edit & delete actions */}

            <div className="flex flex-wrap gap-2">
                {tags.map(({ _id, name }) => (
                    <Tag key={_id} id={_id} name={name} badgeClassNames="uppercase small-regular rounded-[10px]" />
                ))}
            </div>

            <div className="flex w-full flex-wrap items-center justify-between gap-3">
                <Metric
                    imgPath="/assets/icons/avatar.svg"
                    metricValue={author.name}
                    metricName={`• asked ${getTimestamp(createdAt)} days ago`}
                    href={`/profile/${author._id}`}
                    isAuthor
                />
                <div className="flex gap-4">
                    <Metric
                        imgPath="/assets/icons/like.svg"
                        metricValue={formatNumber(upvotes)}
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
