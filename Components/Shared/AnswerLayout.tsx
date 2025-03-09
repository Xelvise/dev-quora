import { UserDoc } from "@/Backend/Database/user.collection";
import Tag from "./Tag";
import { AnswerDoc } from "@/Backend/Database/answer.collection";
import FilterSelector from "./FilterSelector";
import { AnswerFilters } from "@/Constants/filters";
import AnswerCard from "../Cards/AnswerCard";
import { AnswerViewCounter } from "./ViewCounters";
import { TagDoc } from "@/Backend/Database/tag.collection";

interface Props {
    questionTags: TagDoc[];
    answers: AnswerDoc[];
    signedInUser: UserDoc | null;
    clientIP: string | null;
}

export default function AnswerLayout({ questionTags, answers, signedInUser, clientIP }: Props) {
    return (
        <>
            <div className="mt-3 flex w-full items-center justify-between gap-5">
                <div className="flex flex-wrap gap-2">
                    {questionTags.map(({ id, name }) => (
                        <Tag key={id} name={name} tag_id={id} badgeClassNames="uppercase small-regular" />
                    ))}
                </div>
                {answers.length > 0 && (
                    <p className="primary-text-gradient paragraph-regular cursor-pointer" data-toggle="answer-layout">
                        {answers.length === 1 ? `${answers.length} Answer` : `${answers.length} Answers`}
                    </p>
                )}
            </div>

            <div id="answer-layout" className="mt-10 hidden w-full">
                <div className="flex w-fit rounded-[7px] border">
                    <FilterSelector filters={AnswerFilters} placeholder="Select a Filter" />
                </div>

                {answers.map(answer => (
                    <div key={answer.id}>
                        <AnswerCard answer={answer} signedInUser={signedInUser} />
                        <AnswerViewCounter answer_id={answer.id} user_id={signedInUser?.id} clientIP={clientIP} />
                    </div>
                ))}
            </div>

            <script
                dangerouslySetInnerHTML={{
                    __html: `
                document.addEventListener('DOMContentLoaded', function() {
                    const toggleElement = document.querySelector('[data-toggle="answer-layout"]');
                    const layout = document.getElementById('answer-layout');
                    if (toggleElement && layout) {
                        toggleElement.addEventListener('click', function() {
                            layout.classList.toggle('hidden');
                            toggleElement.textContent = layout.classList.contains('hidden')
                                ? '${answers.length === 1 ? `${answers.length} Answer` : `${answers.length} Answers`}'
                                : 'Collapse';
                        });
                    }
                });
            `,
                }}
            />
        </>
    );
}
