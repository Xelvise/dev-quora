"use client";

import { deleteAnswer } from "@/Backend/Server-Side/Actions/answer.action";
import { deleteQuestion } from "@/Backend/Server-Side/Actions/question.action";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useToast } from "../Shadcn/hooks/use-toast";

interface Props {
    postType: "question" | "answer";
    post_id: string;
    exitPageAfterDelete?: boolean;
}

export default function EditAndDeleteAction({ postType, post_id, exitPageAfterDelete }: Props) {
    const pathname = usePathname();
    const router = useRouter();
    const { toast } = useToast();
    const handleEdit = () => router.push(`/question/edit/${post_id}`);

    const handleDelete = async () => {
        if (postType === "question") {
            try {
                await deleteQuestion({ question_id: post_id, pathToRefetch: pathname });
                if (exitPageAfterDelete) router.push("/");
                return toast({
                    title: "Question deleted",
                    description: "Your question has been deleted successfully.",
                    variant: "default",
                    duration: 5000,
                });
            } catch (error) {
                return toast({
                    title: "An error occurred",
                    description: "Unable to delete the question. Please try again.",
                    variant: "destructive",
                    duration: 5000,
                });
            }
        }
        if (postType === "answer") {
            try {
                await deleteAnswer({ answer_id: post_id, pathToRefetch: pathname });
                return toast({
                    title: "Answer deleted",
                    description: "Your answer has been deleted successfully.",
                    variant: "default",
                    duration: 5000,
                });
            } catch (error) {
                return toast({
                    title: "An error occurred",
                    description: "Unable to delete the answer. Please try again.",
                    variant: "destructive",
                    duration: 5000,
                });
            }
        }
    };
    return (
        <div className="flex items-center gap-3 max-sm:gap-2">
            <p className="text-dark500_light900 h3-regular max-sm:paragraph-regular">|</p>
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
