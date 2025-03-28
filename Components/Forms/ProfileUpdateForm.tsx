"use client";

// prettier-ignore
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/Components/Shadcn/form";
import { Input } from "@/Components/Shadcn/input";
import { Button } from "../Shadcn/button";
import { UserDoc } from "@/Backend/Database/user.collection";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { UserProfileSchema } from "./FormSchemas";
import { Textarea } from "../Shadcn/textarea";
import { useState } from "react";
import { Spinner } from "../Shadcn/spinner";
import { useRouter } from "next/navigation";
import { updateUser } from "@/Backend/Server-Side/Actions/user.action";

interface Props {
    clerkId: string;
    profileDetails: any;
}

export default function ProfileUpdateForm({ clerkId, profileDetails }: Props) {
    const profile = JSON.parse(profileDetails) as UserDoc;
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<z.infer<typeof UserProfileSchema>>({
        resolver: zodResolver(UserProfileSchema),
        defaultValues: {
            full_name: profile.name,
            username: profile.username,
            bio: profile.bio || "",
            location: profile.location || "",
            portfolioWebsite: profile.portfolioWebsite || "",
        },
    });

    const onSubmitForm = async (data: z.infer<typeof UserProfileSchema>) => {
        setIsSubmitting(true);
        try {
            await updateUser({
                clerk_id: clerkId,
                updatedData: {
                    name: data.full_name,
                    username: data.username,
                    bio: data.bio,
                    location: data.location,
                    portfolioWebsite: data.portfolioWebsite,
                },
                pathToRefetch: [`/profile/${clerkId}`],
                redirectToGivenPath: true,
            });
            router.back();
        } catch (error) {
            console.log("Profile could not be updated: ");
            if (error instanceof Error) {
                // TODO: Add a toast notification to inform the user about the error
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Form {...form}>
            <form className="flex flex-1 flex-col gap-7" onSubmit={form.handleSubmit(onSubmitForm)}>
                <FormField
                    control={form.control}
                    name="full_name"
                    render={({ field }) => (
                        <FormItem className="space-y-3.5">
                            <FormLabel className="paragraph-semibold text-dark200_light800">
                                Full Name <span className="text-primary-500">*</span>
                            </FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Surname, Firstname"
                                    className="no-focus paragraph-regular max-sm:body-regular bg-light700_dark300 light-border-2 text-dark300_light700 min-h-[50px] rounded-[7px]"
                                    {...field}
                                    disabled
                                />
                            </FormControl>
                            <FormMessage className="body-regular text-red-500" />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem className="space-y-3.5">
                            <FormLabel className="paragraph-semibold text-dark200_light800">
                                Username <span className="text-primary-500">*</span>
                            </FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Your unique username"
                                    className="no-focus paragraph-regular max-sm:body-regular bg-light700_dark300 light-border-2 text-dark300_light700 min-h-[50px] rounded-[7px]"
                                    {...field}
                                    disabled
                                />
                            </FormControl>
                            <FormMessage className="body-regular text-red-500" />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="portfolioWebsite"
                    render={({ field }) => (
                        <FormItem className="space-y-3.5">
                            <FormLabel className="paragraph-semibold text-dark200_light800">Portfolio Link</FormLabel>
                            <FormControl>
                                <Input
                                    type="url"
                                    placeholder="Your portfolio URL"
                                    className="no-focus paragraph-regular max-sm:body-regular bg-light700_dark300 light-border-2 text-dark300_light700 min-h-[50px] rounded-[7px]"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage className="body-regular text-red-500" />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                        <FormItem className="space-y-3.5">
                            <FormLabel className="paragraph-semibold text-dark200_light800">Location</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Where are you resident at?"
                                    className="no-focus paragraph-regular max-sm:body-regular bg-light700_dark300 light-border-2 text-dark300_light700 min-h-[50px] rounded-[7px]"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage className="body-regular text-red-500" />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                        <FormItem className="space-y-3.5">
                            <FormLabel className="paragraph-semibold text-dark200_light800">Bio</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="What's special about you?"
                                    className="no-focus paragraph-regular max-sm:body-regular bg-light700_dark300 light-border-2 text-dark300_light700 min-h-[50px] rounded-[7px]"
                                    {...field}
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
                    {isSubmitting ? (
                        <>
                            <Spinner />
                            {"Updating Profile"}
                        </>
                    ) : "Update Profile"}
                </Button>
            </form>
        </Form>
    );
}
