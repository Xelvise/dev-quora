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
import mongoose, { FilterQuery, Schema } from "mongoose";
import AnswerCollection, { AnswerDoc } from "@/Backend/Database/answer.collection";
import InteractionCollection from "@/Backend/Database/interaction.collection";

export async function fetchQuestions(params: GetQuestionsParams) {
    const { page = 1, pageSize = 5, searchQuery, filter = "latest" } = params;
    const filterQuery: FilterQuery<typeof QuestionCollection> = {};
    if (searchQuery) {
        filterQuery.$or = [
            { title: { $regex: new RegExp(searchQuery, "i") } },
            { content: { $regex: new RegExp(searchQuery, "i") } },
        ];
    }
    if (filter === "unanswered") filterQuery.answers = { $size: 0 };

    const past_pages = (page - 1) * pageSize;
    try {
        await connectToDB();
        const questions_ = QuestionCollection.find<QuestionDoc>(filterQuery)
            .skip(past_pages)
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
        const hasMorePages = totalQuestions > past_pages + questions.length;
        console.log("Questions retrieved successfully", questions);
        return JSON.stringify({ questions, hasMorePages });
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
    const past_pages = (page - 1) * pageSize;
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
        const userDoc = await UserCollection.findOne<UserDoc>({ clerkId: clerk_id });
        if (!userDoc) throw new Error("User not found");

        const totalQuestions = userDoc.saved.length;
        const savedQuestions = await QuestionCollection.find({
            _id: { $in: userDoc.saved }, // Only get questions that are in the user's saved array
            ...filterQuery, // Apply any additional filters
        })
            .sort(sortOptions as any)
            .skip(past_pages)
            .limit(pageSize)
            .populate([
                { path: "tags", model: TagCollection },
                { path: "author", model: UserCollection },
            ]);

        const hasMorePages = totalQuestions > past_pages + savedQuestions.length;
        return JSON.stringify({ questions: savedQuestions, hasMorePages });
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

export async function getPostAuthorID(post_id: string, type: "question" | "answer") {
    try {
        await connectToDB();
        if (type === "question") {
            const question = await QuestionCollection.findById<QuestionDoc>(post_id);
            if (!question) throw new Error("Question not found");
            return question.author.toString();
        } else if (type === "answer") {
            const answer = await AnswerCollection.findById<AnswerDoc>(post_id);
            if (!answer) throw new Error("Answer not found");
            return answer.author.toString();
        }
    } catch (error) {
        console.log(`Failed to retrieve ${type} author ID`, error);
        throw new Error(`Failed to retrieve ${type} author ID`);
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
        const tagsArray: Schema.Types.ObjectId[] = [];

        // create a new tag document or update existing tag document
        for (const tag of tags) {
            const existingTag = await TagCollection.findOneAndUpdate<TagDoc>(
                { name: { $regex: new RegExp(`^${tag}$`, "i") } }, // performs a case-insensitive search for a document whose `name` field matches `tag`
                { $setOnInsert: { name: tag }, $push: { questions: newQuestionDoc._id } }, // if there's a match, we append the new question's objectId to the tag's `questions` array
                { upsert: true, new: true }, // if there isn't a match, we upsert a new Tag: where `name` = tag and `questions` is an array containing the question's objectId
            );
            tagsArray.push(existingTag._id);
        }
        // append array of tags into the newly-created question document
        const newDoc = await QuestionCollection.findByIdAndUpdate(
            newQuestionDoc._id,
            { $set: { tags: tagsArray } },
            { new: true },
        );
        console.log("Question created successfully", newDoc);

        // Create an Interaction record for the user's action (Ask question)
        await InteractionCollection.create({
            user: author_id,
            action: "ask_question",
            question: newQuestionDoc._id,
            tags: tagsArray,
        });
        // Increment author's reputation by +5 for creating a question
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
        const updatedTagNames = new Set(updatedTags.map(tagName => tagName.toLowerCase()));
        // For each tag in existingTags, we check for its existence in the updatedTags. If it doesn't exist, then it's a replacedTag.
        const replaced_tags = existingTags.filter(tag => !updatedTagNames.has(tag.name.toLowerCase()));

        // Step 3: Remove question_id from the old tags' questions array and delete tags if necessary
        for (const tag of replaced_tags) {
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
        const upvotedQuestion = await QuestionCollection.findById<QuestionDoc>(question_id);
        if (!upvotedQuestion) throw new Error("Question not found, hence could not be upvoted");

        // Check if the user is the author of the question
        // prettier-ignore
        if (String(upvotedQuestion.author) !== String(user_id)) {
            if (hasUpvoted) {
                // if user has already upvoted, pull out/delete the User's ID from upvotes array
                updateQuery = { $pull: { upvotes: user_id } };
            } else if (hasDownvoted) {
                // if user has downvoted, pull out/delete user's ID from the downvotes array and append to the upvotes array
                updateQuery = { $pull: { downvotes: user_id }, $push: { upvotes: user_id } };
            } else {
                // If user has neither upvoted nor downvoted, add a new upvote of UserId to the set of upvotes
                updateQuery = { $addToSet: { upvotes: user_id } };
            }
            await QuestionCollection.findByIdAndUpdate<QuestionDoc>(question_id, updateQuery, { new: true });

            // increment User's reputation by +2 or -2 for upvoting or revoking an upvote to a question
            await UserCollection.findByIdAndUpdate(user_id, {
                $inc: { reputation: hasUpvoted ? -2 : 2 },
            });
            // increment Author's reputation by +5 or -5 for receiving or deleting an upvote to/from a question
            await UserCollection.findByIdAndUpdate(upvotedQuestion.author, {
                $inc: { reputation: hasUpvoted ? -5 : 5 },
            });
        }

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
        const downvotedQuestion = await QuestionCollection.findById<QuestionDoc>(question_id);
        if (!downvotedQuestion) throw new Error("Question not found, hence could not be upvoted");

        // Check if the user is the author of the question
        // prettier-ignore
        if (String(downvotedQuestion.author) !== String(user_id)) {
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
            await QuestionCollection.findByIdAndUpdate<QuestionDoc>(question_id, updateQuery, { new: true });

            // increment User's reputation by +2 or -2 for downvoting or revoking an upvote to a question
            await UserCollection.findByIdAndUpdate(user_id, {
                $inc: { reputation: hasDownvoted ? -2 : 2 },
            });
            // increment Author's reputation by -5 or +5 for receiving or deleting a downvote to/from a question
            await UserCollection.findByIdAndUpdate(downvotedQuestion.author, {
                $inc: { reputation: hasDownvoted ? 5 : -5 },
            });
        }

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
    const past_pages = (page - 1) * pageSize;
    try {
        await connectToDB();
        const questions = await QuestionCollection.find<QuestionDoc>({ author: user_id })
            .skip(past_pages)
            .limit(pageSize)
            .populate({ path: "tags", model: TagCollection })
            .populate({ path: "author", model: UserCollection })
            .sort({ createdAt: -1, views: -1, upvotes: -1 });

        const totalQuestions = await QuestionCollection.countDocuments({ author: user_id });
        const hasMorePages = totalQuestions > past_pages + questions.length;

        return JSON.stringify({ questions, hasMorePages });
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
        const question = await QuestionCollection.findById<QuestionDoc>(question_id);
        if (!question) throw new Error("No such question exists, hence cannot be deleted");

        // delete all reputations earned by interactions with this question and its answers
        await UserCollection.findByIdAndUpdate(question.author, {
            $inc: { reputation: -5 }, // delete reputation acquired from creating question
        });
        if (question.views > 50) {
            const count = 10 * Math.floor(question.views / 50);
            await UserCollection.findByIdAndUpdate(question.author, {
                $inc: { reputation: -count }, // delete reputation acquired from view count
            });
        }
        if (question.upvotes.length > 0) {
            const count = question.upvotes.length * 5;
            await UserCollection.findByIdAndUpdate(question.author, {
                $inc: { reputation: -count },
            });
            for (const user_id of question.upvotes) {
                await UserCollection.findByIdAndUpdate(user_id, {
                    $inc: { reputation: -2 },
                });
            }
        }
        if (question.answers.length > 0) {
            for (const answer_id of question.answers) {
                const answer = await AnswerCollection.findById<AnswerDoc>(answer_id);
                // Even if question is deleted, we do not delete author's reputation earned from creating answer (unless the answer is deleted by the author)
                // However, we delete all the extra reputations the author earned from people that upvoted
                if (answer && answer.upvotes.length > 0) {
                    const count = answer.upvotes.length * 5;
                    await UserCollection.findByIdAndUpdate(answer.author, {
                        $inc: { reputation: -count },
                    });
                    for (const user_id of answer.upvotes) {
                        await UserCollection.findByIdAndUpdate(user_id, {
                            $inc: { reputation: -2 },
                        });
                    }
                }
            }
        }
        await QuestionCollection.deleteOne({ _id: question_id });
        await AnswerCollection.deleteMany({ question: question_id });
        await InteractionCollection.deleteMany({ question: question_id });

        // Next, delete all tags associated with this question
        // Step 1: Find tags whose questions' array contain this question
        const questionTags = await TagCollection.find<TagDoc>({ questions: question_id });
        // Step 2: For as many tags that contains question_id in its questions array, remove the question_id
        await TagCollection.updateMany({ questions: question_id }, { $pull: { questions: question_id } });
        // Step 3: Delete tags that now have empty questions arrays
        for (const tagDoc of questionTags) {
            // Check the current state of the tag after the question_id has been removed
            const updatedTag = await TagCollection.findById<TagDoc>(tagDoc._id);
            // Delete tag if it exists and its questions array is empty
            if (updatedTag && updatedTag.questions.length === 0) {
                await TagCollection.findByIdAndDelete(tagDoc._id);
            }
        }
        if (pathToRefetch) revalidatePath(pathToRefetch);
    } catch (error) {
        console.log("Failed to delete question", error);
        throw new Error("Failed to delete question");
    } finally {
        // await mongoose.connection.close();
    }
}
