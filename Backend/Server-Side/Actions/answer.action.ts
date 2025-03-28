"use server";

import AnswerCollection, { AnswerDoc } from "@/Backend/Database/answer.collection";
import connectToDB from "../database.connector";
import {
    AnswerVoteParams,
    CreateAnswerParams,
    DeleteAnswerParams,
    GetAnswersParams,
    GetUserStatsParams,
} from "../parameters";
import QuestionCollection from "@/Backend/Database/question.collection";
import { revalidatePath } from "next/cache";
import UserCollection from "@/Backend/Database/user.collection";
import InteractionCollection from "@/Backend/Database/interaction.collection";

export async function createAnswer(params: CreateAnswerParams) {
    const { content, author_id, question_id, pathToRefetch } = params;
    try {
        await connectToDB();
        const newAnswerDoc: AnswerDoc = await AnswerCollection.create({
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
    const { question_id, page = 1, pageSize = 5, filter = "recent" } = params;
    // const past_pages = (page - 1) * pageSize;
    let isFetching = true;
    try {
        connectToDB();
        const answers_ = AnswerCollection.find<AnswerDoc>({ question: question_id })
            // .skip(past_pages)
            .limit(page * pageSize)
            .populate({ path: "author", model: UserCollection });

        const totalAnswers = await AnswerCollection.countDocuments({ question: question_id });
        const hasMorePages = totalAnswers > page * pageSize; // > past_pages + (await answers_).length;

        let answers;
        if (filter === "recent") {
            answers = await answers_.sort({ createdAt: -1 });
        } else if (filter === "old") {
            answers = await answers_.sort({ createdAt: 1 });
        } else if (filter === "highestUpvotes") {
            answers = await answers_.sort({ upvotes: -1 });
        } else if (filter === "lowestUpvotes") {
            answers = await answers_.sort({ upvotes: 1 });
        } else {
            throw new Error("Invalid filter");
        }
        isFetching = false;
        return { answers, hasMorePages, isFetching };
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
        const question = await AnswerCollection.findByIdAndUpdate<AnswerDoc>(answer_id, updateQuery, {
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
        const question = await AnswerCollection.findByIdAndUpdate<AnswerDoc>(answer_id, updateQuery, {
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

export async function fetchUserTopAnswers(params: GetUserStatsParams) {
    const { user_id, page = 1, pageSize = 10 } = params;
    // const past_pages = (page - 1) * pageSize;
    let isFetching = true;
    try {
        await connectToDB();
        const answers = await AnswerCollection.find<AnswerDoc>({ author: user_id })
            // .skip(past_pages)
            .limit(page * pageSize)
            .populate({ path: "question", model: QuestionCollection })
            .populate({ path: "author", model: UserCollection })
            .sort({ upvotes: -1 });

        const totalAnswers = await AnswerCollection.countDocuments({ author: user_id });
        const hasMorePages = totalAnswers > page * pageSize;
        isFetching = false;
        return { answers, hasMorePages, isFetching };
    } catch (error) {
        console.log("Failed to User's top questions", error);
        throw new Error("Failed to User's top questions");
    } finally {
        // await mongoose.connection.close();
    }
}

export async function deleteAnswer(params: DeleteAnswerParams) {
    const { answer_id, pathToRefetch } = params;
    try {
        await connectToDB();
        console.log("Answer_id provided: ", answer_id);
        const answer = await AnswerCollection.findById<AnswerDoc>(answer_id);
        if (!answer) throw new Error("Answer not found");

        await AnswerCollection.deleteOne({ _id: answer_id });
        await QuestionCollection.updateMany({ _id: answer.question }, { $pull: { answers: answer_id } });
        await InteractionCollection.deleteMany({ answer: answer_id });
        if (pathToRefetch) revalidatePath(pathToRefetch);
    } catch (error) {
        console.log("Failed to delete answer", error);
        throw new Error("Failed to delete answer");
    } finally {
        // await mongoose.connection.close();
    }
}
