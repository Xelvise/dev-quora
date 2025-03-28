"use client";

import { deleteAnswer } from "@/Backend/Server-Side/Actions/answer.action";
import { deleteQuestion } from "@/Backend/Server-Side/Actions/question.action";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

interface Props {
    postType: "question" | "answer";
    post_id: string;
    exitPageAfterDelete?: boolean;
}

export default function EditAndDeleteAction({ postType, post_id, exitPageAfterDelete }: Props) {
    const pathname = usePathname();
    const router = useRouter();

    const handleEdit = () => router.push(`/question/edit/${post_id}`);

    const handleDelete = async () => {
        if (postType === "question") {
            await deleteQuestion({ question_id: post_id, pathToRefetch: pathname });
            if (exitPageAfterDelete) router.push("/");
        }
        if (postType === "answer") await deleteAnswer({ answer_id: post_id, pathToRefetch: pathname });
    };
    return (
        <div className="flex items-center gap-3">
            <p className="text-dark500_light900 h3-regular">|</p>
            <Image
                src="/assets/icons/edit.svg"
                alt="Edit"
                width={15}
                height={15}
                className={postType === "question" ? "cursor-pointer object-contain" : "hidden"}
                onClick={handleEdit}
            />
            <Image
                src="/assets/icons/trash.svg"
                alt="Delete"
                width={15}
                height={15}
                className="cursor-pointer object-contain"
                onClick={handleDelete}
            />
        </div>
    );
}
