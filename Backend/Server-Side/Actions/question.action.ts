"use server";

import QuestionCollection, { QuestionDoc } from "@/Backend/Database/question.collection";
import connectToDB from "../database.connector";
import TagCollection, { TagDoc } from "@/Backend/Database/tag.collection";
import {
    CreateQuestionParams,
    DeleteQuestionParams,
    EditQuestionParams,
    GetQuestionsParams,
    GetSavedQuestionsParams,
    GetUserStatsParams,
    QuestionVoteParams,
    SaveQuestionParams,
} from "../parameters";
import UserCollection, { UserDoc } from "@/Backend/Database/user.collection";
import { revalidatePath } from "next/cache";
import mongoose, { FilterQuery } from "mongoose";
import AnswerCollection from "@/Backend/Database/answer.collection";
import InteractionCollection from "@/Backend/Database/interaction.collection";

export async function fetchQuestions(params: GetQuestionsParams) {
    const { page = 1, pageSize = 5, searchQuery, filter = "latest" } = params;
    const filterQuery: FilterQuery<typeof QuestionCollection> = {};
    // if (searchQuery) {
    //     filterQuery.$or = [
    //         { title: { $regex: new RegExp(searchQuery, "i") } },
    //         { content: { $regex: new RegExp(searchQuery, "i") } },
    //     ];
    // }
    if (filter === "unanswered") filterQuery.answers = { $size: 0 };

    const pastQuestions = (page - 1) * pageSize;
    console.log("fetching questions");
    try {
        await connectToDB();
        const questions_ = QuestionCollection.find<QuestionDoc>(filterQuery)
            .skip(pastQuestions)
            .limit(pageSize)
            .populate({ path: "tags", model: TagCollection })
            .populate({ path: "author", model: UserCollection });

        let questions;
        if (filter === "latest") {
            questions = await questions_.sort({ createdAt: -1 });
        } else if (filter === "frequent") {
            questions = await questions_.sort({ views: -1 });
        } else if (filter === "recommended") {
            await QuestionCollection.aggregate([{ $project: { numOfUpvotes: { $size: "$upvotes" } } }]);
            questions = await questions_.sort({ numOfUpvotes: -1 });
        } else if (filter === "unanswered") {
            questions = await questions_.sort({ createdAt: -1 });
        } else {
            throw new Error("Invalid filter");
        }
        const totalQuestions = await QuestionCollection.countDocuments(filterQuery);
        const hasMorePages = totalQuestions > pastQuestions + questions.length;
        console.log("Questions retrieved successfully", questions);
        return { questions, hasMorePages };
    } catch (error) {
        console.log("Failed to retrieve questions", error);
        throw new Error("Failed to retrieve questions");
    } finally {
        // await mongoose.connection.close();
    }
}

export async function fetchSavedQuestions(params: GetSavedQuestionsParams) {
    const { clerk_id, page = 1, pageSize = 5, searchQuery, filter = "most_recent" } = params;

    const filterQuery: FilterQuery<typeof QuestionCollection> = {};
    if (searchQuery) {
        filterQuery.$or = [
            { title: { $regex: new RegExp(searchQuery, "i") } },
            { content: { $regex: new RegExp(searchQuery, "i") } },
        ];
    }
    // const pastQuestions = (page - 1) * pageSize;
    // prettier-ignore
    const sortOptions = filter === "most_recent"
                            ? { createdAt: -1 }
                            : filter === "oldest"
                                ? { createdAt: 1 }
                                : filter === "most_viewed"
                                    ? { views: -1 }
                                    : filter === "most_voted"
                                        ? { numOfUpvotes: -1 }
                                        : filter === "most_answered"
                                            ? { numOfAnswers: -1 } : {};
    try {
        await connectToDB();
        if (filter === "most_voted") {
            await QuestionCollection.aggregate([{ $project: { numOfUpvotes: { $size: "$upvotes" } } }]);
        } else if (filter === "most_answered") {
            await QuestionCollection.aggregate([{ $project: { numOfAnswers: { $size: "$answers" } } }]);
        }
        const user_ = UserCollection.findOne<UserDoc>({ clerkId: clerk_id });
        let userDoc = await user_;
        if (!userDoc) throw new Error("User not found");
        const totalQuestions = userDoc.saved.length;

        userDoc = await user_.limit(page * pageSize).populate({
            path: "saved",
            model: QuestionCollection,
            match: filterQuery,
            populate: [
                { path: "tags", model: TagCollection },
                { path: "author", model: UserCollection },
            ],
            options: { sort: sortOptions },
        });
        const savedQuestions = userDoc?.saved as any as QuestionDoc[];
        const hasMorePages = totalQuestions > page * pageSize; // > pastQuestions + savedQuestions.length;

        return { savedQuestions, hasMorePages };
    } catch (error) {
        console.log("Failed to retrieve saved questions", error);
        throw new Error("Failed to retrieve saved questions");
    } finally {
        // await mongoose.connection.close();
    }
}

export async function fetchQuestionByID(question_id: string) {
    try {
        await connectToDB();
        const question = await QuestionCollection.findById<QuestionDoc>(question_id)
            .populate({ path: "tags", model: TagCollection })
            .populate({ path: "author", model: UserCollection });
        return question;
    } catch (error) {
        console.log("Failed to retrieve question and/or answers", error);
        throw new Error("Failed to retrieve question and/or answers");
    } finally {
        // await mongoose.connection.close();
    }
}

export async function fetchHotQuestions() {
    try {
        await connectToDB();
        const hotQuestions = await QuestionCollection.find<QuestionDoc>({}).limit(5).sort({ views: -1, upvotes: -1 }); // newest-to-oldest
        return hotQuestions;
    } catch (error) {
        console.log("Failed to retrieve question and/or answers", error);
        throw new Error("Failed to retrieve question and/or answers");
    } finally {
        // await mongoose.connection.close();
    }
}

export async function createQuestion(params: CreateQuestionParams) {
    const { title, content, tags, author_id, pathToRefetch } = params;
    try {
        await connectToDB();

        // create a new question document and return a reference to the question
        const newQuestionDoc: QuestionDoc = await QuestionCollection.create({ title, content, author: author_id });
        const tagsArray: string[] = [];

        // create a new tag document or update existing tag document
        for (const tag of tags) {
            const existingTag = await TagCollection.findOneAndUpdate<TagDoc>(
                { name: { $regex: new RegExp(`^${tag}$`, "i") } }, // performs a case-insensitive search for a document whose `name` field matches `tag`
                { $setOnInsert: { name: tag }, $push: { questions: newQuestionDoc._id } }, // if there's a match, we append the new question's objectId to the tag's `questions` array
                { upsert: true, new: true }, // if there isn't a match, we upsert a new Tag: where `name` = tag and `questions` is an array containing the question's objectId
            );
            tagsArray.push(existingTag.id);
        }
        // append array of tags into the newly-created question document
        const newDoc = await QuestionCollection.findByIdAndUpdate(
            newQuestionDoc._id,
            { $set: { tags: tagsArray } },
            { new: true },
        );
        console.log("Question created successfully", newDoc);

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

export async function updateQuestion(params: EditQuestionParams) {
    const { question_id, updatedTitle, updatedContent, updatedTags, pathToRefetch } = params;
    try {
        await connectToDB();

        // Step 1: Retrieve the existing array of tags of the question
        const question = await QuestionCollection.findById<QuestionDoc>(question_id).populate("tags");
        if (!question) throw new Error("Question not found");

        const existingTags = question.tags as any as TagDoc[];

        // Step 2: Identify the updated and replaced tags
        const updatedTags_ = new Set(updatedTags.map(tag => tag.toLowerCase()));
        const replacedTags = existingTags.filter(tag => !updatedTags_.has(tag.name.toLowerCase()));

        // Step 3: Remove question_id from the old tags' questions array and delete tags if necessary
        for (const tag of replacedTags) {
            const tagDoc = await TagCollection.findByIdAndUpdate<TagDoc>(
                tag._id,
                { $pull: { questions: question_id } },
                { new: true },
            );
            if (tagDoc?.questions.length === 0) await TagCollection.findByIdAndDelete(tag._id);
        }

        // Step 4: Handle new and existing tags
        const tagsArray: string[] = [];
        for (const tag of updatedTags) {
            const existingTag = await TagCollection.findOneAndUpdate<TagDoc>(
                { name: { $regex: new RegExp(`^${tag}$`, "i") } }, // performs a case-insensitive search for a document whose `name` field matches `tag`
                { $setOnInsert: { name: tag }, $addToSet: { questions: question_id } }, // if it exists, we append the new question's objectId to the tag's `questions` field
                { upsert: true, new: true }, // if there isn't a match, we upsert a new Tag: where `name` = tag and `questions` is an array containing the question's objectId
            );
            tagsArray.push(existingTag.id);
        }

        // Step 5: Update the question document with new title, content, and tags
        const updatedQuestionDoc = await QuestionCollection.findByIdAndUpdate<QuestionDoc>(
            question_id,
            { title: updatedTitle, content: updatedContent, tags: tagsArray },
            { new: true },
        );
        console.log("Question updated successfully", updatedQuestionDoc);

        if (pathToRefetch) revalidatePath(pathToRefetch); // purges cache data for the specified path
    } catch (error) {
        console.log("Failed to update question", error);
        throw new Error("Failed to update question");
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
        await QuestionCollection.findByIdAndUpdate<QuestionDoc>(question_id, updateQuery, {
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
        await QuestionCollection.findByIdAndUpdate<QuestionDoc>(question_id, updateQuery, {
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

export async function fetchUserTopQuestions(params: GetUserStatsParams) {
    const { user_id, page = 1, pageSize = 10 } = params;
    try {
        await connectToDB();
        const questions = await QuestionCollection.find<QuestionDoc>({ author: user_id })
            .limit(page * pageSize)
            .populate({ path: "tags", model: TagCollection })
            .populate({ path: "author", model: UserCollection })
            .sort({ views: -1, upvotes: -1 });

        const totalQuestions = await QuestionCollection.countDocuments({ author: user_id });
        const hasMorePages = totalQuestions > page * pageSize; // > pastQuestions + questions.length;

        return { questions, hasMorePages };
    } catch (error) {
        console.log("Failed to User's top questions", error);
        throw new Error("Failed to User's top questions");
    } finally {
        // await mongoose.connection.close();
    }
}

export async function deleteQuestion(params: DeleteQuestionParams) {
    const { question_id, pathToRefetch } = params;
    try {
        await connectToDB();
        await QuestionCollection.deleteOne({ _id: question_id });
        await AnswerCollection.deleteMany({ question: question_id });
        await InteractionCollection.deleteMany({ question: question_id });
        await TagCollection.updateMany({ questions: question_id }, { $pull: { questions: question_id } });
        if (pathToRefetch) revalidatePath(pathToRefetch);
    } catch (error) {
        console.log("Failed to delete question", error);
        throw new Error("Failed to delete question");
    } finally {
        // await mongoose.connection.close();
    }
}
