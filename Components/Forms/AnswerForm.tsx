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
import { useToast } from "@/Components/Shadcn/hooks/use-toast";

interface Props {
    signedInUserId: string | null;
    stringifiedQuestion: string;
}

export default function AnswerForm({ signedInUserId, stringifiedQuestion }: Props) {
    const { toast } = useToast();
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
        if (!signedInUserId) {
            return toast({
                title: "Kindly sign in to submit an answer",
                variant: "destructive",
                duration: 5000,
            });
        }
        setSubmission(true);
        try {
            // Call a server action to submit an answer
            await createAnswer({
                content: data.answer,
                question_id: String(question._id),
                author_id: signedInUserId,
                pathToRefetch: pathname,
            });
            if (editorRef.current) (editorRef.current as any).setContent("");
            toast({
                title: "Answer submitted",
                description: "Your answer has been submitted successfully.",
                variant: "default",
                duration: 5000,
            });
        } catch (error) {
            console.log("Answer could not be submitted", error);
            toast({
                title: "An error occurred while submitting your answer",
                description: "Please try again.",
                variant: "destructive",
                duration: 5000,
            });
        } finally {
            setSubmission(false);
        }
    };

    const generate_AI_answer = async () => {
        if (!signedInUserId) {
            return toast({
                title: "Kindly sign in to use this feature.",
                variant: "destructive",
                duration: 5000,
            });
        }
        setGeneration(true);
        try {
            console.log("Generating AI answer...");
            const response = await fetch(`${window.location.origin}/api/answer-generator`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: question.title, content: question.content }),
            });
            const data = await response.json();
            if (response.ok) {
                if (editorRef.current) (editorRef.current as any).setContent(data.message.replace(/\n/g, "<br />"));
                toast({
                    title: "Gemini just generated you an answer",
                    variant: "default",
                    duration: 5000,
                });
            } else {
                console.log("Server error: ", data.error);
                toast({
                    title: "Gemini failed to generate an answer",
                    description: "Please try again.",
                    variant: "destructive",
                    duration: 3000,
                });
            }
        } catch (error: any) {
            console.error("Answer generation failed", error.message);
            toast({
                title: "Gemini failed to generate an answer",
                description: "Please try again.",
                variant: "destructive",
                duration: 3000,
            });
        } finally {
            setGeneration(false);
        }
    };

    return (
        <>
            <div className="mt-16 flex w-full flex-wrap items-center justify-between gap-5">
                <p className="base-semibold max-sm:paragraph-semibold text-dark200_light800">Suggest an answer</p>
                <Button
                    type="button"
                    disabled={isGenerating}
                    className="body-regular dark:solid-light-border flex min-w-[200px] gap-2 rounded-[7px] p-3 text-primary-500 dark:text-primary-300"
                    onClick={generate_AI_answer}
                >
                    {isGenerating ? (
                        <>
                            <Spinner /> Generating
                        </>
                    ) : (
                        <>
                            <Image
                                src="/assets/icons/stars.svg"
                                alt="star"
                                width={12}
                                height={12}
                                className="object-contain"
                            />
                            Generate an AI answer
                        </>
                    )}
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
