"use client";

import { deleteAnswer } from "@/Backend/Server-Side/Actions/answer.action";
import { deleteQuestion } from "@/Backend/Server-Side/Actions/question.action";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useToast } from "../Shadcn/hooks/use-toast";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogTrigger,
    AlertDialogTitle,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/Components/Shadcn/alert-dialog";
import { AlertDialogDescription } from "@radix-ui/react-alert-dialog";
import { useState } from "react";
import { Spinner } from "../Shadcn/spinner";
import { Button } from "../Shadcn/button";

interface Props {
    postType: "question" | "answer";
    post_id: string;
    exitPageAfterDelete?: boolean;
}

export default function EditAndDeleteAction({ postType, post_id, exitPageAfterDelete }: Props) {
    const pathname = usePathname();
    const router = useRouter();
    const [alertOpen, setAlertOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const { toast } = useToast();

    const handleEdit = () => router.push(`/question/edit/${post_id}`);

    const handleDelete = async () => {
        setIsDeleting(true);
        if (postType === "question") {
            try {
                await deleteQuestion({ question_id: post_id, pathToRefetch: pathname });
                setIsDeleting(false);
                setAlertOpen(false);
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
                setIsDeleting(false);
                setAlertOpen(false);
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
            <p className="text-dark500_light900 h-full">|</p>
            <Image
                src="/assets/icons/edit.svg"
                alt="Edit"
                width={15}
                height={15}
                className={postType === "question" ? "cursor-pointer object-contain" : "hidden"}
                onClick={handleEdit}
            />
            <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
                <AlertDialogTrigger asChild>
                    <Image
                        src="/assets/icons/trash.svg"
                        alt="Delete"
                        width={15}
                        height={15}
                        className="cursor-pointer object-contain"
                    />
                </AlertDialogTrigger>
                <AlertDialogContent className="border-none bg-white p-4 focus:outline-none dark:bg-dark-300">
                    <AlertDialogTitle className="">Confirm {postType} deletion</AlertDialogTitle>
                    <AlertDialogDescription className="max-sm:body-regular text-light-400">
                        This action is irrevocable and will completely delete your {postType} from our servers
                    </AlertDialogDescription>
                    <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                    <Button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="body-semibold rounded-[7px] bg-red-600 text-white"
                    >
                        {isDeleting ? (
                            <>
                                <Spinner size="small" />
                                Deleting
                            </>
                        ) : (
                            "Delete"
                        )}
                    </Button>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
