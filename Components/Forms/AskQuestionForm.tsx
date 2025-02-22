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
import { createQuestion } from "@/Backend/Server-Side/Actions/question.action";

export const FormSchema = z.object({
    title: z.string().min(5).max(130),
    explanation: z.string().min(100),
    tags: z.array(z.string().min(1).max(15)).min(1).max(3),
});

interface Props {
    formType?: "update" | "create";
    userObjectId: string;
}

export default function AskQuestionForm({ formType = "create", userObjectId }: Props) {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: { tags: [], title: "", explanation: "" },
    });
    const editorRef = useRef<Editor | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const onSubmitForm = async (values: z.infer<typeof FormSchema>) => {
        setIsSubmitting(true);
        // Call a server action to create a question
        try {
            await createQuestion({
                title: values.title,
                content: values.explanation,
                tags: values.tags,
                author: JSON.parse(userObjectId),
                pathToRefetch: "/",
            });
            form.setValue("title", "");
            form.setValue("explanation", "");
            form.setValue("tags", []);
        } catch (error) {
            if (error instanceof Error && error.message === "Failed to create question") {
                // TODO: Add a toast notification to inform the user about the error
            }
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
                    if (!form.getValues("tags").includes(tagValue as never)) {
                        form.setValue("tags", [...form.getValues("tags"), tagValue]);
                        // empty the input field and clear errors after adding the tag
                        tagElement.value = "";
                        form.clearErrors("tags");
                    } else {
                        form.setError("tags", { type: "required", message: "Tag already exists." });
                    }
                } else {
                    form.setError("tags", { type: "maxLength", message: "Total added tags must not exceed 3" });
                    return tagElement.value = ""
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
            <form onSubmit={form.handleSubmit(onSubmitForm)} className="flex flex-1 flex-col gap-10">
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
                                    className="no-focus paragraph-regular bg-light700_dark300 light-border-2 text-dark300_light700 min-h-[56px] rounded-[7px]"
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
                                    initialValue=""
                                    onBlur={field.onBlur}
                                    onEditorChange={content => field.onChange(content)}
                                    init={{
                                        height: 500,
                                        menubar: false,
                                        plugins: tinyPlugins,
                                        toolbar: tinyToolbar,
                                        content_style: "body { font-family:Inter; font-size:16px; }",
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
                                    className="no-focus paragraph-regular bg-light700_dark300 light-border-2 text-dark300_light700 min-h-[56px] rounded-[7px]"
                                    placeholder="Add tags..."
                                    onKeyDown={event => handleTagInput(event)}
                                />
                            </FormControl>
                            {field.value.length > 0 && (
                                <div className="flex-start mt-2.5 gap-2.5">
                                    {field.value.map(tag => (
                                        <Badge
                                            key={tag}
                                            className="bg-light800_dark300 text-light400_light500 whitespace-nowrap rounded-lg px-4 py-2"
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
                            {formType === "create" ? "Creating Question" : "Updating Question"}
                            <Spinner />
                        </>
                    ) : formType === "create" ? "Create Question" : "Update Question"}
                </Button>
            </form>
        </Form>
    );
}
