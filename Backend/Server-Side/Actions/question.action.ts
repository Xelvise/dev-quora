"use server";

import QuestionCollection, { QuestionFormat } from "@/Backend/Database/question.collection";
import connectToDB from "../database.connector";
import TagCollection, { TagFormat } from "@/Backend/Database/tag.collection";
import { CreateQuestionParams, GetQuestionsParams, QuestionVoteParams, SaveQuestionParams } from "../parameters";
import UserCollection from "@/Backend/Database/user.collection";
import { revalidatePath } from "next/cache";
import mongoose from "mongoose";

export async function fetchQuestions(params: GetQuestionsParams) {
    const { page, pageLimit, searchQuery, filter, sortBy } = params;
    try {
        await connectToDB();
        const questions = await QuestionCollection.find<QuestionFormat>({})
            .populate({ path: "tags", model: TagCollection })
            .populate({ path: "author", model: UserCollection })
            .sort({ createdAt: sortBy === "newest-to-oldest" ? -1 : 1 });
        return { questions };
    } catch (error) {
        console.log("Failed to retrieve questions", error);
        throw new Error("Failed to retrieve questions");
    } finally {
        // await mongoose.connection.close();
    }
}

export async function fetchQuestionByID(id: string) {
    try {
        await connectToDB();
        const question = await QuestionCollection.findById<QuestionFormat>(id)
            .populate({ path: "tags", model: TagCollection })
            .populate({ path: "author", model: UserCollection });
        return question;
    } catch (error) {
        console.log("Failed to retrieve question", error);
        throw new Error("Failed to retrieve question");
    } finally {
        // await mongoose.connection.close();
    }
}

export async function createQuestion(params: CreateQuestionParams) {
    const { title, content, tags, author_id, pathToRefetch } = params;
    try {
        await connectToDB();

        // create a new question document and return a reference to the question
        const newQuestionDoc: QuestionFormat = await QuestionCollection.create({ title, content, author: author_id });
        const tagsArray: string[] = [];

        // create a new tag document or update existing tag document
        tags.forEach(async tag => {
            const existingTag = await TagCollection.findOneAndUpdate<TagFormat>(
                { name: { $regex: new RegExp(`^${tag}$`, "i") } }, // performs a case-insensitive search for a document whose `name` field matches `tag`
                { $setOnInsert: { name: tag }, $push: { questions: newQuestionDoc._id } }, // if it exists, we append the new question's objectId to the tag's `questions` field
                { upsert: true, new: true }, // if there's no existing Tag document that matches `tag`, we insert a new one: where `name` = tag and `questions` is an array containing the question's objectId
            );
            tagsArray.push(existingTag.id);
        });

        // append array of tags into the newly-created question document
        await QuestionCollection.findByIdAndUpdate(newQuestionDoc._id, {
            $push: { tags: { $each: tagsArray } },
        });

        // Increment author's reputation by +5 points for creating a question
        await UserCollection.findByIdAndUpdate(author_id, {
            $inc: { reputation: 5 },
        });

        if (pathToRefetch) revalidatePath(pathToRefetch); // purges cache data for the specified path
    } catch (error) {
        console.log("Failed to create question", error);
        throw new Error("Failed to create question");
    } finally {
        // await mongoose.connection.close();
    }
}

export async function upvoteQuestion(params: QuestionVoteParams) {
    const { question_id, user_id, hasUpvoted, hasDownvoted, pathToRefetch } = params;
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
        await QuestionCollection.findByIdAndUpdate<QuestionFormat>(question_id, updateQuery, {
            new: true,
        });

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

export async function downvoteQuestion(params: QuestionVoteParams) {
    const { question_id, user_id, hasUpvoted, hasDownvoted, pathToRefetch } = params;
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
            // If user has neither upvoted nor downvoted, we add a new downvote of UserId to the set of downvotes
            updateQuery = { $addToSet: { downvotes: user_id } };
        }
        await QuestionCollection.findByIdAndUpdate<QuestionFormat>(question_id, updateQuery, {
            new: true,
        });

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

export async function toggleSaveQuestion(params: SaveQuestionParams) {
    const { hasSaved, question_id, user_id, pathToRefetch } = params;
    try {
        await connectToDB();
        if (!hasSaved) {
            await UserCollection.findByIdAndUpdate(user_id, { $addToSet: { saved: question_id } });
        } else {
            await UserCollection.findByIdAndUpdate(user_id, { $pull: { saved: question_id } });
        }
        if (pathToRefetch) revalidatePath(pathToRefetch); // purges cache data for the specified path
    } catch (error) {
        console.log("Failed to save question", error);
        throw new Error("Failed to save question");
    } finally {
        // await mongoose.connection.close();
    }
}
