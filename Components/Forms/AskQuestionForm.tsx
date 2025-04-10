/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";

import { useForm } from "react-hook-form";
import { useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/Components/Shadcn/button";
// prettier-ignore
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/Components/Shadcn/form";
import { Input } from "@/Components/Shadcn/input";
import { Badge } from "../Shadcn/badge";
import Image from "next/image";
import { tinyPlugins, tinyToolbar } from "@/Constants/tiny-config";
import { Spinner } from "../Shadcn/spinner";
import { createQuestion, updateQuestion } from "@/Backend/Server-Side/Actions/question.action";
import { AskQuestionSchema } from "./FormSchemas";
import { useTheme } from "@/app/GlobalContextProvider";
import { QuestionDoc } from "@/Backend/Database/question.collection";
import { useRouter } from "next/navigation";
import { useToast } from "@/Components/Shadcn/hooks/use-toast";

interface Props {
    formType?: "update" | "create";
    user_id: string | null;
    stringifiedPrevQuestion?: any;
}

export default function AskQuestionForm({ formType = "create", user_id, stringifiedPrevQuestion }: Props) {
    const { toast } = useToast();
    const { mode } = useTheme(); // used to decide the theme of the editor
    const router = useRouter();

    const prevQuestion: QuestionDoc = stringifiedPrevQuestion ? JSON.parse(stringifiedPrevQuestion) : {};
    const tags = prevQuestion?.tags?.map((tag: any) => tag.name as string) || [];

    const form = useForm<z.infer<typeof AskQuestionSchema>>({
        resolver: zodResolver(AskQuestionSchema),
        defaultValues: {
            tags,
            title: prevQuestion?.title || "",
            explanation: prevQuestion?.content || "",
        },
    });
    const editorRef = useRef<Editor | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const onSubmitForm = async (data: z.infer<typeof AskQuestionSchema>) => {
        setIsSubmitting(true);
        // Call a server action to create a question
        try {
            if (!user_id) {
                return toast({
                    title: "Only signed-in users can create or modify a Question",
                    variant: "destructive",
                    duration: 3000,
                });
            }
            if (Object.keys(prevQuestion).length > 0) {
                await updateQuestion({
                    question_id: prevQuestion._id,
                    updatedTitle: data.title,
                    updatedContent: data.explanation,
                    updatedTags: data.tags,
                    pathToRefetch: "/",
                });
                router.back();
                toast({
                    title: "Your question has been modified",
                    description: "Be rest assured you'll get an answer soonest",
                    variant: "default",
                    duration: 3000,
                });
            } else {
                await createQuestion({
                    title: data.title,
                    content: data.explanation,
                    tags: data.tags,
                    author_id: user_id,
                    pathToRefetch: "/",
                });
                router.push("/");
                toast({
                    title: "Thanks for dropping a question",
                    description: "Be rest assured you'll get an answer soonest",
                    variant: "default",
                    duration: 3000,
                });
            }
        } catch (error) {
            console.error("Question could not be created: ", error);
            toast({
                title: "Something went wrong. Kindly try again.",
                variant: "destructive",
                duration: 3000,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    // prettier-ignore
    const handleTagInput = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            event.preventDefault();
            const tagElement = event.target as HTMLInputElement;
            const tagValue = tagElement.value.trim();

            if (tagValue) {
                if (form.getValues("tags").length < 3) {
                    if (tagValue.length > 15) {
                        return form.setError("tags", { type: "maxLength", message: "Tag must be less than 15 characters" });
                    }
                    // if tag doesn't already exists or hasn't been added, then append tag to field.value
                    if (!form.getValues("tags").map(tag => tag.toLowerCase()).includes(tagValue.toLowerCase())) {
                        form.setValue("tags", [...form.getValues("tags"), tagValue]);
                        // empty the input field and clear errors after adding the tag
                        tagElement.value = "";
                        form.clearErrors("tags");
                    } else {
                        form.setError("tags", { type: "required", message: "Tag already exists." });
                        tagElement.value = "";
                    }
                } else {
                    form.setError("tags", { type: "maxLength", message: "Total added tags must not exceed 3" });
                    tagElement.value = ""
                }
            } else {
                form.trigger("tags");
            }
        }
    };

    // prettier-ignore
    const deleteTag = (unwantedTag: string) => {
        form.setValue("tags", form.getValues("tags").filter(existingTag => existingTag !== unwantedTag));
    };

    return (
        <Form {...form}>
            <form className="flex flex-1 flex-col gap-7" onSubmit={form.handleSubmit(onSubmitForm)}>
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="paragraph-semibold text-dark200_light800">
                                Question Title <span className="text-primary-500">*</span>
                            </FormLabel>
                            <FormControl>
                                <Input
                                    className="no-focus paragraph-regular max-sm:body-regular bg-light700_dark300 light-border-2 text-dark300_light700 min-h-[50px] rounded-[7px]"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription className="body-regular text-light-500">
                                Be specific and imagine you&apos;re asking a question to another person
                            </FormDescription>
                            <FormMessage className="body-regular text-red-500" />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="explanation"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="paragraph-semibold text-dark200_light800">
                                Detailed explanation of the problem <span className="text-primary-500">*</span>
                            </FormLabel>
                            <FormControl>
                                <Editor
                                    apiKey={process.env.NEXT_PUBLIC_TINY_APIKEY}
                                    // @ts-ignore
                                    onInit={(_, editor) => (editorRef.current = editor)}
                                    initialValue={prevQuestion?.content || ""}
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
                            <FormDescription className="body-regular text-light-500">
                                Introduce the problem and expand on what you wrote in the title. Minimum of 20
                                characters
                            </FormDescription>
                            <FormMessage className="body-regular text-red-500" />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="paragraph-semibold text-dark200_light800">
                                Tags <span className="text-primary-500">*</span>
                            </FormLabel>
                            <FormControl>
                                <Input
                                    className="no-focus paragraph-regular max-sm:body-regular bg-light700_dark300 light-border-2 text-dark300_light700 min-h-[50px] rounded-[7px]"
                                    placeholder="Add tags..."
                                    onKeyDown={event => handleTagInput(event)}
                                />
                            </FormControl>
                            {field.value.length > 0 && (
                                <div className="flex-start mt-2.5 gap-2.5">
                                    {field.value.map(tag => (
                                        <Badge
                                            key={tag}
                                            className="bg-light800_dark300 text-light400_light500 whitespace-nowrap rounded-[7px] px-4 py-2"
                                        >
                                            {tag}
                                            <Image
                                                src="/assets/icons/close.svg"
                                                alt="close"
                                                width={12}
                                                height={12}
                                                className="ml-2 cursor-pointer invert-0 dark:invert"
                                                onClick={() => deleteTag(tag)}
                                            />
                                        </Badge>
                                    ))}
                                </div>
                            )}
                            <FormDescription className="body-regular text-light-500">
                                Add up to 3 tags to describe what your question is about. You need to press Enter to
                                enter a tag
                            </FormDescription>
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
                    {isSubmitting ? (
                        <>
                            <Spinner />
                            {formType === "create" ? "Creating Question" : "Updating Question"}
                        </>
                    ) : formType === "create" ? "Create Question" : "Update Question"}
                </Button>
            </form>
        </Form>
    );
}
