"use server";

import AnswerCollection, { AnswerFormat } from "@/Backend/Database/answer.collection";
import connectToDB from "../database.connector";
import { AnswerVoteParams, CreateAnswerParams, GetAnswersParams } from "../parameters";
import QuestionCollection from "@/Backend/Database/question.collection";
import { revalidatePath } from "next/cache";
import UserCollection from "@/Backend/Database/user.collection";

export async function createAnswer(params: CreateAnswerParams) {
    const { content, author_id, question_id, pathToRefetch } = params;
    try {
        await connectToDB();
        const newAnswerDoc: AnswerFormat = await AnswerCollection.create({
            content,
            author: author_id,
            question: question_id,
        });
        // append the answer's objectId to its question's `answers` field
        await QuestionCollection.findByIdAndUpdate(question_id, { $push: { answers: newAnswerDoc._id } });
        // TODO: Add Interaction...

        if (pathToRefetch) revalidatePath(pathToRefetch); // purges cache data for the specified path
    } catch (error) {
        console.log("Failed to create answer", error);
        throw new Error("Failed to create answer");
    } finally {
        // await mongoose.connection.close();
    }
}

export async function fetchAnswers(params: GetAnswersParams) {
    const { question_id, page, pageLimit, filter, sortBy } = params;
    try {
        connectToDB();
        const answers = await AnswerCollection.find<AnswerFormat>({ question: question_id })
            .populate({ path: "author", model: UserCollection })
            .sort({ createdAt: sortBy === "newest-to-oldest" ? -1 : 1 });
        return answers;
    } catch (error) {
        console.log("Failed to fetch answers", error);
        throw new Error("Failed to fetch answers");
    } finally {
        // await mongoose.connection.close();
    }
}

export async function upvoteAnswer(params: AnswerVoteParams) {
    const { answer_id, user_id, hasUpvoted, hasDownvoted, pathToRefetch } = params;
    try {
        await connectToDB();
        let updateQuery = {};
        if (hasUpvoted) {
            // if user has already upvoted, we pull out/delete the User's ID from upvotes array
            updateQuery = { $pull: { upvotes: user_id } };
        } else if (hasDownvoted) {
            // if user has downvoted, we pull out/delete user's ID from the downvotes array and append to the upvotes array
            updateQuery = { $pull: { downvotes: user_id }, $push: { upvotes: user_id } };
        } else {
            // If user has neither upvoted nor downvoted, we add a new upvote of UserId to the set of upvotes
            updateQuery = { $addToSet: { upvotes: user_id } };
        }
        const question = await AnswerCollection.findByIdAndUpdate<AnswerFormat>(answer_id, updateQuery, {
            new: true,
        });
        if (!question) throw new Error("Question not found");

        // increment user's reputation by +10
        await UserCollection.findByIdAndUpdate(user_id, {
            $inc: { reputation: 10 },
        });
        if (pathToRefetch) revalidatePath(pathToRefetch); // purges cache data for the specified path
    } catch (error) {
        console.log("Failed to upvote question", error);
        throw new Error("Failed to upvote question");
    } finally {
        // await mongoose.connection.close();
    }
}

export async function downvoteAnswer(params: AnswerVoteParams) {
    const { answer_id, user_id, hasUpvoted, hasDownvoted, pathToRefetch } = params;
    try {
        await connectToDB();
        let updateQuery = {};
        if (hasDownvoted) {
            // if user has downvoted, we pull out/delete user's ID from the downvotes array
            updateQuery = { $pull: { downvotes: user_id } };
        } else if (hasUpvoted) {
            // if user has already upvoted, we pull out/delete the User's ID from upvotes array and append to the downvotes array
            updateQuery = { $pull: { upvotes: user_id }, $push: { downvotes: user_id } };
        } else {
            // If user has neither upvoted nor downvoted, we add a new upvote of UserId to the set of upvotes
            updateQuery = { $addToSet: { downvotes: user_id } };
        }
        const question = await AnswerCollection.findByIdAndUpdate<AnswerFormat>(answer_id, updateQuery, {
            new: true,
        });
        if (!question) throw new Error("Question not found");

        // increment user's reputation by +10
        await UserCollection.findByIdAndUpdate(user_id, {
            $inc: { reputation: 10 },
        });
        if (pathToRefetch) revalidatePath(pathToRefetch); // purges cache data for the specified path
    } catch (error) {
        console.log("Failed to downvote question", error);
        throw new Error("Failed to downvote question");
    } finally {
        // await mongoose.connection.close();
    }
}
