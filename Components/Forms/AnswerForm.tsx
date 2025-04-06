/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";

import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormMessage } from "../Shadcn/form";
import { AnswerSchema } from "./FormSchemas";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { tinyPlugins, tinyToolbar } from "@/Constants/tiny-config";
import { Editor } from "@tinymce/tinymce-react";
import { useRef, useState } from "react";
import { useTheme } from "@/app/GlobalContextProvider";
import { Button } from "../Shadcn/button";
import { Spinner } from "../Shadcn/spinner";
import Image from "next/image";
import { createAnswer } from "@/Backend/Server-Side/Actions/answer.action";
import { usePathname } from "next/navigation";
import { QuestionDoc } from "@/Backend/Database/question.collection";

interface Props {
    signedInUserId: string | null;
    stringifiedQuestion: any;
}

export default function AnswerForm({ signedInUserId, stringifiedQuestion }: Props) {
    const { mode } = useTheme();
    const pathname = usePathname();
    const question = JSON.parse(stringifiedQuestion) as QuestionDoc;

    const form = useForm<z.infer<typeof AnswerSchema>>({
        resolver: zodResolver(AnswerSchema),
        defaultValues: { answer: "" },
    });
    const editorRef = useRef<Editor | null>(null);
    const [isSubmitting, setSubmission] = useState(false);
    const [isGenerating, setGeneration] = useState(false);

    const onSubmitAnswer = async (data: z.infer<typeof AnswerSchema>) => {
        if (!signedInUserId) throw new Error("Something went wrong. Kindly Sign-in to submit an answer");
        setSubmission(true);
        try {
            // Call a server action to submit an answer
            await createAnswer({
                content: data.answer,
                question_id: question.id,
                author_id: signedInUserId,
                pathToRefetch: pathname,
            });
            if (editorRef.current) (editorRef.current as any).setContent("");
        } catch (error) {
            console.error("Answer could not be submitted");
            if (error instanceof Error) {
                // TODO: Add a toast notification to inform the user about the error
            }
        } finally {
            setSubmission(false);
        }
    };

    const generate_AI_answer = async () => {
        if (!signedInUserId) throw new Error("Something went wrong. Kindly Sign-in to generate an answer");
        setGeneration(true);
        try {
            const response = await fetch(`${window.location.origin}/api/answer-generator`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: stringifiedQuestion,
            });
            const ai_answer = await response.json();
            alert(ai_answer.alert);
            if (response.ok) {
                if (editorRef.current) (editorRef.current as any).setContent(ai_answer.message);
            }
        } catch (error) {
            console.log(error);
        } finally {
        }
    };

    return (
        <>
            <div className="mt-16 flex w-full flex-wrap items-center justify-between gap-5">
                <p className="base-semibold max-sm:paragraph-semibold text-dark200_light800">Suggest an answer</p>
                <Button
                    type="button"
                    disabled={isGenerating}
                    className="body-regular dark:solid-light-border flex w-fit gap-2 rounded-[7px] p-3 text-primary-500 dark:text-primary-300"
                    onClick={generate_AI_answer}
                >
                    <Image src="/assets/icons/stars.svg" alt="star" width={12} height={12} className="object-contain" />
                    Generate an AI answer
                </Button>
            </div>

            <Form {...form}>
                <form className="mt-5 flex w-full flex-col gap-5" onSubmit={form.handleSubmit(onSubmitAnswer)}>
                    <FormField
                        control={form.control}
                        name="answer"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Editor
                                        apiKey={process.env.NEXT_PUBLIC_TINY_APIKEY}
                                        // @ts-ignore
                                        onInit={(_, editor) => (editorRef.current = editor)}
                                        initialValue=""
                                        onBlur={field.onBlur}
                                        onEditorChange={content => field.onChange(content)}
                                        init={{
                                            height: 500,
                                            menubar: false,
                                            plugins: tinyPlugins,
                                            toolbar: tinyToolbar,
                                            content_style: "body { font-family:Inter; font-size:16px; }",
                                            skin: mode === "light" ? "oxide" : "oxide-dark",
                                            content_css: mode === "light" ? "light" : "dark",
                                            highlight_on_focus: false,
                                        }}
                                    />
                                </FormControl>
                                <FormMessage className="body-regular text-red-500" />
                            </FormItem>
                        )}
                    />
                    {/* prettier-ignore */}
                    <Button
                        type="submit"
                        className="primary-gradient flex w-fit gap-2 self-center rounded-[7px] text-light-800"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? <><Spinner /> {"Submitting Answer"}</> : "Submit Answer"}
                    </Button>
                </form>
            </Form>
        </>
    );
}
