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
        const question = await QuestionCollection.findByIdAndUpdate(question_id, {
            $push: { answers: newAnswerDoc._id },
        });
        // Create an Interaction record for the user's action (create answer)
        await InteractionCollection.create({
            user: author_id,
            action: "create_answer",
            answer: newAnswerDoc._id,
            tags: question?.tags,
        });
        // Increment author's reputation by +10 for creating an answer
        if (String(question.author) !== String(author_id)) {
            await UserCollection.findByIdAndUpdate(author_id, {
                $inc: { reputation: 10 },
            });
        }

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
    const past_pages = (page - 1) * pageSize;
    try {
        connectToDB();
        const answers_ = AnswerCollection.find<AnswerDoc>({ question: question_id })
            .skip(past_pages)
            .limit(pageSize)
            .populate({ path: "author", model: UserCollection });

        let answers: AnswerDoc[];
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

        const totalAnswers = await AnswerCollection.countDocuments({ question: question_id });
        const hasMorePages = totalAnswers > past_pages + answers.length;
        return JSON.stringify({ answers, hasMorePages, totalAnswers });
    } catch (error) {
        console.log("Failed to fetch answers", error);
        throw new Error("Failed to fetch answers");
    } finally {
        // await mongoose.connection.close();
    }
}

export async function fetchUserTopAnswers(params: GetUserStatsParams) {
    const { user_id, page = 1, pageSize = 5 } = params;
    const past_pages = (page - 1) * pageSize;
    try {
        await connectToDB();
        const answers = await AnswerCollection.find<AnswerDoc>({ author: user_id })
            .skip(past_pages)
            .limit(pageSize)
            .populate({ path: "question", model: QuestionCollection })
            .populate({ path: "author", model: UserCollection })
            .sort({ createdAt: -1, upvotes: -1 });

        const totalAnswers = await AnswerCollection.countDocuments({ author: user_id });
        const hasMorePages = totalAnswers > past_pages + answers.length;
        return JSON.stringify({ answers, hasMorePages });
    } catch (error) {
        console.log("Failed to User's top questions", error);
        throw new Error("Failed to User's top questions");
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
        const upvotedAnswer = await AnswerCollection.findByIdAndUpdate<AnswerDoc>(answer_id, updateQuery, {
            new: true,
        });
        if (!upvotedAnswer) throw new Error("Answer not found, hence could not be upvoted");

        if (String(upvotedAnswer.author) !== String(user_id)) {
            // increment User's reputation by +2 or -2 for upvoting or revoking an upvote to a question
            await UserCollection.findByIdAndUpdate(user_id, {
                $inc: { reputation: hasUpvoted ? -2 : 2 },
            });
            // increment Author's reputation by +10 or -10 for receiving or deleting an upvote to/from a question
            await UserCollection.findByIdAndUpdate(upvotedAnswer.author, {
                $inc: { reputation: hasUpvoted ? -10 : 10 },
            });
        }
        if (pathToRefetch) revalidatePath(pathToRefetch); // purges cache data for the specified path
    } catch (error) {
        console.log("Failed to upvote answer", error);
        throw new Error("Failed to upvote answer");
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
        const downvotedAnswer = await AnswerCollection.findByIdAndUpdate<AnswerDoc>(answer_id, updateQuery, {
            new: true,
        });
        if (!downvotedAnswer) throw new Error("Answer not found, hence could not be downvoted");

        if (String(downvotedAnswer.author) !== String(user_id)) {
            // increment User's reputation by +2 or -2 for downvoting or revoking an upvote to a question
            await UserCollection.findByIdAndUpdate(user_id, {
                $inc: { reputation: hasDownvoted ? -2 : 2 },
            });
            // increment Author's reputation by -10 or +10 for receiving or deleting a downvote to/from a question
            await UserCollection.findByIdAndUpdate(downvotedAnswer.author, {
                $inc: { reputation: hasDownvoted ? 10 : -10 },
            });
        }
        if (pathToRefetch) revalidatePath(pathToRefetch); // purges cache data for the specified path
    } catch (error) {
        console.log("Failed to downvote answer", error);
        throw new Error("Failed to downvote answer");
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
        if (!answer) throw new Error("Answer not found, hence cannot be deleted");

        // delete all reputations earned by interactions with this answer
        await UserCollection.findByIdAndUpdate(answer.author, {
            $inc: { reputation: -10 }, // delete reputation acquired from creating answer
        });
        if (answer.upvotes.length > 0) {
            const count = answer.upvotes.length * 10;
            await UserCollection.findByIdAndUpdate(answer.author, {
                $inc: { reputation: -count },
            });
            for (const user_id of answer.upvotes) {
                await UserCollection.findByIdAndUpdate(user_id, {
                    $inc: { reputation: -2 },
                });
            }
        }
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
