"use client";

import { formatNumber } from "@/app/utils";
import { downvoteAnswer, upvoteAnswer } from "@/Backend/Server-Side/Actions/answer.action";
import {
    downvoteQuestion,
    getPostAuthorID,
    toggleSaveQuestion,
    upvoteQuestion,
} from "@/Backend/Server-Side/Actions/question.action";
import { useToast } from "@/Components/Shadcn/hooks/use-toast";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { ToastAction } from "../Shadcn/toast";

interface Props {
    postType: "question" | "answer";
    post_id: string;
    userId: string | null;
    upvotes: number;
    downvotes: number;
    hasUpvoted: boolean;
    hasDownvoted: boolean;
    hasSaved?: boolean; // only applicable to questions
}

// prettier-ignore
export default function VoteSection({ postType, post_id, userId, upvotes, downvotes, hasUpvoted, hasDownvoted, hasSaved }: Props) {
    const router = useRouter();
    const { toast } = useToast();
    const pathname = usePathname();

    const [reclickState, setReclickState] = useState({ canUpvote: true, canDownvote: true, canSave: true });
    const [optimisticUpvotes, setOptimisticUpvotes] = useState(upvotes);
    const [optimisticDownvotes, setOptimisticDownvotes] = useState(downvotes);
    const [hasUpvotedOptimistically, setUpvotedOptimistically] = useState(hasUpvoted);
    const [hasDownvotedOptimistically, setDownvotedOptimistically] = useState(hasDownvoted);
    const [hasSavedOptimistically, setSavedOptimistically] = useState(hasSaved)

    const handleVote = async (action: "upvote" | "downvote") => {
        if (!userId) {
            return toast({
                title: "Only logged-in Users can cast a vote",
                variant: "destructive",
                duration: 3000,
                action: <ToastAction altText="Sign in" onClick={() => router.push("/sign-in")}>Sign In</ToastAction>,
            });
        }
        setReclickState(prev => ({ ...prev, canUpvote: false, canDownvote: false }));

        if (action === "upvote") {
            // Check if the user is the author of the post
            const authorId = await getPostAuthorID(post_id, postType);
            if (authorId === userId) {
                return toast({
                    title: "You cannot upvote your own post",
                    variant: "destructive",
                    duration: 3000,
                });
            }
            setUpvotedOptimistically(!hasUpvotedOptimistically);
            setOptimisticUpvotes(hasUpvotedOptimistically ? optimisticUpvotes - 1 : optimisticUpvotes + 1);
            if (hasDownvotedOptimistically) {
                setDownvotedOptimistically(false);
                setOptimisticDownvotes(optimisticDownvotes > 0 ? optimisticDownvotes - 1 : optimisticDownvotes);
            }
            try {
                if (postType === "question") {
                    await upvoteQuestion({
                        question_id: post_id,
                        user_id: userId,
                        hasUpvoted,
                        hasDownvoted,
                        pathToRefetch: pathname,
                    });
                } else {
                    await upvoteAnswer({
                        answer_id: post_id,
                        user_id: userId,
                        hasUpvoted,
                        hasDownvoted,
                        pathToRefetch: pathname,
                    });
                }
                console.log("Request was successful");
            } catch (error) {
                setUpvotedOptimistically(hasUpvoted);
                setDownvotedOptimistically(hasDownvoted);
                setOptimisticUpvotes(upvotes);
                setOptimisticDownvotes(downvotes);
            } finally {
                setReclickState(prev => ({ ...prev, canUpvote: true }));
            }

        } else if (action === "downvote") {
            // Check if the user is the author of the post
            const authorId = await getPostAuthorID(post_id, postType);
            if (authorId === userId) {
                return toast({
                    title: "You cannot downvote your own post",
                    variant: "destructive",
                    duration: 3000,
                });
            }
            setDownvotedOptimistically(!hasDownvotedOptimistically);
            setOptimisticDownvotes(hasDownvotedOptimistically ? optimisticDownvotes - 1 : optimisticDownvotes + 1);
            if (hasUpvotedOptimistically) {
                setUpvotedOptimistically(false);
                setOptimisticUpvotes(optimisticUpvotes > 0 ? optimisticUpvotes - 1 : optimisticUpvotes);
            }
            try {
                if (postType === "question") {
                    await downvoteQuestion({
                        question_id: post_id,
                        user_id: userId,
                        hasUpvoted,
                        hasDownvoted,
                        pathToRefetch: pathname,
                    });
                } else {
                    await downvoteAnswer({
                        answer_id: post_id,
                        user_id: userId,
                        hasUpvoted,
                        hasDownvoted,
                        pathToRefetch: pathname,
                    });
                }
                console.log("Request was successful");
            } catch (error) {
                setDownvotedOptimistically(hasDownvoted);
                setUpvotedOptimistically(hasUpvoted);
                setOptimisticDownvotes(downvotes);
                setOptimisticUpvotes(upvotes);
            } finally {
                setReclickState(prev => ({ ...prev, canDownvote: true }));
            }
        };
    };
    
    const toggleSave = async (hasSaved: boolean) => {
        if (!userId) {
            return toast({
                title: "Only logged-in Users can save a Question",
                variant: "destructive",
                duration: 3000,
                action: <ToastAction altText="Sign in" onClick={() => router.push("/sign-in")}>Sign In</ToastAction>,
            });
        }
        setReclickState(prev => ({ ...prev, canSave: false }))
        setSavedOptimistically(!hasSavedOptimistically)
        try {
            await toggleSaveQuestion({
                hasSaved: hasSaved,
                question_id: post_id,
                user_id: userId,
                pathToRefetch: pathname,
            });
            console.log("Question was saved successfully");
            toast({
                title: hasSaved
                    ? "We've removed this question from your collection"
                    : "We've added this question to your collection",
                variant: "default",
                duration: 3000,
            });
            
        } catch (error) {
            setSavedOptimistically(hasSaved);
        } finally {
            setReclickState(prev => ({ ...prev, canSave: true }));
        }
    };
    
    return (
        <div className="flex gap-2">
            <div className="flex items-center justify-center gap-2">
                <div className="flex items-center justify-center gap-1">
                    <Image
                        src={hasUpvotedOptimistically ? "/assets/icons/upvoted.svg" : "/assets/icons/upvote.svg"}
                        width={18}
                        height={18}
                        alt="upvote"
                        className={`max-sm:h-[15px] max-sm:w-[15px] ${reclickState.canUpvote ? "cursor-pointer" : "cursor-not-allowed"}`}
                        onClick={reclickState.canUpvote ? () => handleVote("upvote") : undefined}
                    />
                    <div className="bg-light700_dark200 flex min-w-[15px] items-center justify-center rounded-sm p-0.5">
                        <p className="subtle-medium text-dark200_light900">{formatNumber(optimisticUpvotes)}</p>
                    </div>
                </div>
                <div className="flex items-center justify-center gap-1">
                    <Image
                        src={hasDownvotedOptimistically ? "/assets/icons/downvoted.svg" : "/assets/icons/downvote.svg"}
                        width={18}
                        height={18}
                        alt="downvote"
                        className={`max-sm:h-[15px] max-sm:w-[15px] ${reclickState.canDownvote ? "cursor-pointer" : "cursor-not-allowed"}`}
                        onClick={reclickState.canDownvote ? () => handleVote("downvote") : undefined}
                    />
                    <div className="bg-light700_dark200 flex min-w-[15px] items-center justify-center rounded-sm p-0.5">
                        <p className="subtle-medium text-dark200_light900">{formatNumber(optimisticDownvotes)}</p>
                    </div>
                </div>
            </div>

            {postType === "question" && typeof hasSaved !== "undefined" && (
                <Image
                    src={hasSavedOptimistically ? "/assets/icons/star-filled.svg" : "/assets/icons/star-red.svg"}
                    width={18}
                    height={18}
                    alt="star"
                    className={`max-sm:h-[15px] max-sm:w-[15px] ${reclickState.canSave ? "cursor-pointer" : "cursor-not-allowed"}`}
                    onClick={reclickState.canSave ? () => toggleSave(hasSaved) : undefined}
                />
            )}
        </div>
    );
}
