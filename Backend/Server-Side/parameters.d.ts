import { Schema } from "mongoose";
import { UserDoc } from "../Database/user.collection";

export type QuestionFilter = "latest" | "recommended" | "frequent" | "unanswered";
export type SavedQuestionFilter = "most_recent" | "oldest" | "most_voted" | "most_viewed" | "most_answered";
export type AnswerFilter = "highestUpvotes" | "lowestUpvotes" | "recent" | "old";
export type UserFilter = "new_users" | "old_users" | "top_contributors";
export type TagFilter = "popular" | "recent" | "name" | "old";

export interface GetQuestionsParams {
    page?: number;
    pageSize?: number;
    searchQuery?: string;
    filter?: QuestionFilter;
}

export interface GetSavedQuestionsParams {
    clerk_id: string;
    page?: number;
    pageSize?: number;
    filter?: SavedQuestionFilter;
    searchQuery?: string;
}

export interface GetQuestionsByIdParams {
    id: string;
    retrieveAnswers?: boolean;
    sortAnswersBy?: "newest-to-oldest" | "oldest-to-newest";
}

export interface CreateQuestionParams {
    title: string;
    content: string;
    tags: string[];
    author_id: string;
    pathToRefetch?: string;
    redirectToGivenPath?: boolean;
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
    pageSize?: number;
    filter?: AnswerFilter;
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
    pageSize?: number;
    searchQuery?: string;
}

export interface ViewQuestionParams {
    question_id: string;
    user_id: string | null;
    clientIP: string | null;
    pathToRefetch?: string;
}

export interface JobFilterParams {
    query: string;
    page: string;
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
    question_id: Schema.Types.ObjectId;
    updatedTitle: string;
    updatedContent: string;
    updatedTags: string[];
    pathToRefetch?: string;
    redirectToGivenPath?: boolean;
}

export interface GetAllTagsParams {
    page?: number;
    pageSize?: number;
    filter?: TagFilter;
    searchQuery?: string;
}

export interface QuestionsByTagIdParams {
    tag_id: string;
    page?: number;
    pageSize?: number;
    searchQuery?: string;
}

export interface TopInteractedTagsParams {
    user_id: string;
    limit?: number;
}

export interface CreateUserParams {
    clerkId: string;
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
    pageSize?: number;
    filter?: UserFilter;
    searchQuery?: string; // Add searchQuery parameter
}

export interface UpdateUserParams {
    clerk_id: string;
    updatedData: Partial<UserDoc>;
    pathToRefetch?: string[];
    redirectToGivenPath?: boolean;
}

export interface SaveQuestionParams {
    hasSaved: boolean;
    user_id: string;
    question_id: string;
    pathToRefetch?: string;
}

export interface GetUserStatsParams {
    user_id: string;
    page?: number;
    pageSize?: number;
}

export interface DeleteUserParams {
    clerk_id: string;
}
