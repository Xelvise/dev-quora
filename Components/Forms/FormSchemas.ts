import { z } from "zod";

export const AskQuestionSchema = z.object({
    title: z.string().min(5).max(130),
    explanation: z.string().min(50),
    tags: z.array(z.string().min(1).max(15)).min(1).max(3),
});

export const AnswerSchema = z.object({
    answer: z.string().min(100),
});

export const UserProfileSchema = z.object({
    full_name: z.string().min(2).max(50),
    username: z.string().min(2).max(20),
    bio: z.string().min(10).max(150),
    location: z.string().min(2).max(50),
    portfolioWebsite: z.string().url(),
});
