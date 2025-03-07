"use client";

import { formatNumber } from "@/app/utils";
import { downvoteAnswer, upvoteAnswer } from "@/Backend/Server-Side/Actions/answer.action";
import { downvoteQuestion, toggleSaveQuestion, upvoteQuestion } from "@/Backend/Server-Side/Actions/question.action";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface Props {
    type: "question" | "answer";
    typeId: string;
    userId: string | null;
    upvotes: number;
    downvotes: number;
    hasUpvoted: boolean;
    hasDownvoted: boolean;
    hasSaved?: boolean; // only applicable to questions
}

// prettier-ignore
export default function VoteSection({ type, typeId, userId, upvotes, downvotes, hasUpvoted, hasDownvoted, hasSaved }: Props) {
    const pathname = usePathname();

    const [reclickOptions, setReclickState] = useState({ canUpvote: true, canDownvote: true, canSave: true });
    const [optimisticUpvotes, setOptimisticUpvotes] = useState(upvotes);
    const [optimisticDownvotes, setOptimisticDownvotes] = useState(downvotes);
    const [hasUpvotedOptimistically, setUpvotedOptimistically] = useState(hasUpvoted);
    const [hasDownvotedOptimistically, setDownvotedOptimistically] = useState(hasDownvoted);
    const [hasSavedOptimistically, setSavedOptimistically] = useState(hasSaved)

    const handleVote = async (action: "upvote" | "downvote") => {
        if (!userId) return console.log("You are not logged in..."); // TODO: render a Toaster that instructs the User to sign in

        setReclickState({ ...reclickOptions, canUpvote: false, canDownvote: false });
        if (action === "upvote") {
            setUpvotedOptimistically(!hasUpvotedOptimistically);
            setOptimisticUpvotes(hasUpvotedOptimistically ? optimisticUpvotes - 1 : optimisticUpvotes + 1);
            if (hasDownvotedOptimistically) {
                setDownvotedOptimistically(false);
                setOptimisticDownvotes(optimisticDownvotes > 0 ? optimisticDownvotes - 1 : optimisticDownvotes);
            }
            try {
                if (type === "question") {
                    await upvoteQuestion({
                        question_id: typeId,
                        user_id: userId,
                        hasUpvoted,
                        hasDownvoted,
                        pathToRefetch: pathname,
                    });
                } else {
                    await upvoteAnswer({
                        answer_id: typeId,
                        user_id: userId,
                        hasUpvoted,
                        hasDownvoted,
                        pathToRefetch: pathname,
                    });
                }
                console.log("Request was successful"); // TODO: render a toaster that says "Upvoted successfully"
            } catch (error) {
                setUpvotedOptimistically(hasUpvoted);
                setDownvotedOptimistically(hasDownvoted);
                setOptimisticUpvotes(upvotes);
                setOptimisticDownvotes(downvotes);
            } finally {
                setReclickState({ ...reclickOptions, canUpvote: true });
            }

        } else if (action === "downvote") {
            setDownvotedOptimistically(!hasDownvotedOptimistically);
            setOptimisticDownvotes(hasDownvotedOptimistically ? optimisticDownvotes - 1 : optimisticDownvotes + 1);
            if (hasUpvotedOptimistically) {
                setUpvotedOptimistically(false);
                setOptimisticUpvotes(optimisticUpvotes > 0 ? optimisticUpvotes - 1 : optimisticUpvotes);
            }
            try {
                if (type === "question") {
                    await downvoteQuestion({
                        question_id: typeId,
                        user_id: userId,
                        hasUpvoted,
                        hasDownvoted,
                        pathToRefetch: pathname,
                    });
                } else {
                    await downvoteAnswer({
                        answer_id: typeId,
                        user_id: userId,
                        hasUpvoted,
                        hasDownvoted,
                        pathToRefetch: pathname,
                    });
                }
                console.log("Request was successful"); // TODO: render a toaster that says "Downvoted successfully"
            } catch (error) {
                setDownvotedOptimistically(hasDownvoted);
                setUpvotedOptimistically(hasUpvoted);
                setOptimisticDownvotes(downvotes);
                setOptimisticUpvotes(upvotes);
            } finally {
                setReclickState({ ...reclickOptions, canDownvote: true });
            }
        };
    };
    
    const toggleSave = async (hasSaved: boolean) => {
        if (!userId) return console.log("You are not logged in..."); // TODO: render a Toaster that instructs the User to sign in
        setReclickState({...reclickOptions, canSave: false})
        setSavedOptimistically(!hasSavedOptimistically)
        try {
            await toggleSaveQuestion({
                hasSaved: hasSaved,
                question_id: typeId,
                user_id: userId,
                pathToRefetch: pathname,
            });
            console.log("Question was saved successfully"); // TODO: render a toaster that says "Saved successfully"
        } catch (error) {
            setSavedOptimistically(hasSaved);
        } finally {
            setReclickState({ ...reclickOptions, canSave: true });
        }
    };
    
    return (
        <div className="flex gap-3">
            <div className="flex items-center justify-center gap-2">
                <div className="flex items-center justify-center gap-1">
                    <Image
                        src={hasUpvotedOptimistically ? "/assets/icons/upvoted.svg" : "/assets/icons/upvote.svg"}
                        width={18}
                        height={18}
                        alt="upvote"
                        className={reclickOptions.canUpvote ? "cursor-pointer" : "cursor-not-allowed"}
                        onClick={reclickOptions.canUpvote ? () => handleVote("upvote") : undefined}
                    />
                    <div className="bg-light700_dark200 flex min-w-[18px] items-center justify-center rounded-sm p-1">
                        <p className="subtle-medium text-dark200_light900">{formatNumber(optimisticUpvotes)}</p>
                    </div>
                </div>
                <div className="flex items-center justify-center gap-1">
                    <Image
                        src={hasDownvotedOptimistically ? "/assets/icons/downvoted.svg" : "/assets/icons/downvote.svg"}
                        width={18}
                        height={18}
                        alt="downvote"
                        className={reclickOptions.canDownvote ? "cursor-pointer" : "cursor-not-allowed"}
                        onClick={reclickOptions.canDownvote ? () => handleVote("downvote") : undefined}
                    />
                    <div className="bg-light700_dark200 flex min-w-[18px] items-center justify-center rounded-sm p-1">
                        <p className="subtle-medium text-dark200_light900">{formatNumber(optimisticDownvotes)}</p>
                    </div>
                </div>
            </div>

            {type === "question" && typeof hasSaved !== "undefined" && (
                <Image
                    src={hasSavedOptimistically ? "/assets/icons/star-filled.svg" : "/assets/icons/star-red.svg"}
                    width={18}
                    height={18}
                    alt="star"
                    className={reclickOptions.canSave ? "cursor-pointer" : "cursor-not-allowed"}
                    onClick={reclickOptions.canSave ? () => toggleSave(hasSaved) : undefined}
                />
            )}
        </div>
    );
}
