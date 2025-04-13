import { formatNumber } from "@/app/utils";
import { BadgeCounts } from "@/types";
import Image from "next/image";

interface Props {
    totalAnswers: number;
    totalQuestions: number;
    badgeCounts: BadgeCounts;
    reputation: number;
}

export default function UserStats({ totalAnswers, totalQuestions, badgeCounts, reputation }: Props) {
    const questionCount = formatNumber(totalQuestions);
    const answerCount = formatNumber(totalAnswers);
    const reputationLevel = formatNumber(reputation);

    return (
        <div className="mt-14 max-sm:mt-10">
            <p className="base-semibold text-dark400_light900 max-sm:paragraph-semibold mb-3">
                ⭐ {reputationLevel} Reward points
            </p>
            <div className="grid grid-cols-1 gap-5 xs:grid-cols-2 md:grid-cols-4">
                <div className="light-border bg-light900_dark300 flex flex-wrap items-center gap-4 rounded-md border p-6 shadow-light-300 dark:shadow-dark-200">
                    <div>
                        <p className="paragraph-semibold text-dark200_light900">{questionCount}</p>
                        <p className="body-medium text-dark200_light700">
                            {questionCount === "1" ? "Question" : "Questions"}
                        </p>
                    </div>
                    <div>
                        <p className="paragraph-semibold text-dark200_light900">{answerCount}</p>
                        <p className="body-medium text-dark200_light700">
                            {answerCount === "1" ? "Answer" : "Answers"}
                        </p>
                    </div>
                </div>

                <StatsCard imgURL="/assets/icons/gold-medal.svg" value={badgeCounts.GOLD} title="Gold Badges" />
                <StatsCard imgURL="/assets/icons/silver-medal.svg" value={badgeCounts.SILVER} title="Silver Badges" />
                <StatsCard imgURL="/assets/icons/bronze-medal.svg" value={badgeCounts.BRONZE} title="Bronze Badges" />
            </div>
        </div>
    );
}

const StatsCard = (props: { imgURL: string; value: number; title: string }) => {
    const { imgURL, value, title } = props;
    return (
        <div className="light-border bg-light900_dark300 flex flex-wrap items-center justify-start gap-4 rounded-md border p-6 shadow-light-300 dark:shadow-dark-200">
            <Image src={imgURL} alt="title" width={40} height={50} />
            <div>
                <p className="paragraph-semibold text-dark200_light900">{value}</p>
                <p className="body-medium text-dark200_light700">{title}</p>
            </div>
        </div>
    );
};
