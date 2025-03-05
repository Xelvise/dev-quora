import { Schema } from "mongoose";
import { UserFormat } from "../Database/user.collection";

export interface GetQuestionsParams {
    page?: number;
    pageLimit?: number;
    searchQuery?: number;
    filter?: string;
    sortBy?: "newest-to-oldest" | "oldest-to-newest";
}

export interface CreateQuestionParams {
    title: string;
    content: string;
    tags: string[];
    author_id: string;
    pathToRefetch?: string;
}

export interface CreateAnswerParams {
    content: string;
    author_id: string; // User ID
    question_id: string; // Question ID
    pathToRefetch: string;
}

export interface GetAnswersParams {
    question_id: string;
    page?: number;
    pageLimit?: number;
    filter?: string;
    sortBy?: "newest-to-oldest" | "oldest-to-newest";
}

export interface AnswerVoteParams {
    answer_id: string;
    user_id: string;
    hasUpvoted: boolean;
    hasDownvoted: boolean;
    pathToRefetch?: string;
}

export interface DeleteAnswerParams {
    answer_id: string;
    pathToRefetch?: string;
}

export interface SearchParams {
    query?: string | null;
    type?: string | null;
}

export interface RecommendedParams {
    user_id: string;
    page?: number;
    pageLimit?: number;
    searchQuery?: string;
}

export interface ViewQuestionParams {
    question_id: string;
    user_id?: string;
}

export interface JobFilterParams {
    query: string;
    page: string;
}

export interface GetQuestionByIdParams {
    question_id: string;
}

export interface QuestionVoteParams {
    question_id: string;
    user_id: string;
    hasUpvoted: boolean;
    hasDownvoted: boolean;
    pathToRefetch?: string;
}

export interface DeleteQuestionParams {
    question_id: string;
    pathToRefetch?: string;
}

export interface EditQuestionParams {
    question_id: string;
    title: string;
    content: string;
    pathToRefetch?: string;
}

export interface GetAllTagsParams {
    page?: number;
    pageLimit?: number;
    filter?: string;
    searchQuery?: string;
}

export interface QuestionsByTagIdParams {
    tag_id: string;
    page?: number;
    pageLimit?: number;
    searchQuery?: string;
}

export interface TopInteractedTagsParams {
    user_id: string;
    limit?: number;
}

export interface CreateUserParams {
    clerk_id: string;
    name: string;
    username: string;
    email: string;
    picture: string;
}

export interface GetUserByIdParams {
    user_id: string;
}

export interface GetAllUsersParams {
    page?: number;
    pageLimit?: number;
    filter?: string;
    searchQuery?: string; // Add searchQuery parameter
    sortBy?: "newest-to-oldest" | "oldest-to-newest";
}

export interface UpdateUserParams {
    clerk_id: string;
    updatedData: Partial<UserFormat>;
    pathToRefetch?: string[];
}

export interface SaveQuestionParams {
    hasSaved: boolean;
    user_id: string;
    question_id: string;
    pathToRefetch?: string;
}

export interface GetSavedQuestionsParams {
    clerk_id: string;
    page?: number;
    pageLimit?: number;
    filter?: string;
    searchQuery?: string;
}

export interface GetUserStatsParams {
    user_id: string;
    page?: number;
    pageLimit?: number;
}

export interface DeleteUserParams {
    clerk_id: string;
}
