/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { viewQuestion } from "@/Backend/Server-Side/Actions/interaction.action";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

interface QuestionViewProps {
    question_id: string;
    user_id: string | null;
    clientIP: string | null;
}

interface AnswerViewProps {
    answer_id: string;
    user_id: string | null;
    clientIP: string | null;
}

export function QuestionViewCounter({ question_id, user_id, clientIP }: QuestionViewProps) {
    const pathname = usePathname();
    useEffect(() => {
        (async () => await viewQuestion({ question_id, user_id, clientIP, pathToRefetch: pathname }))(); // immediately-invoked function expression
    }, [question_id]);
    return null;
}

export function AnswerViewCounter({ answer_id, user_id, clientIP }: AnswerViewProps) {
    const pathname = usePathname();
    useEffect(() => {}, [answer_id, user_id, clientIP, pathname]);
    return null;
}
