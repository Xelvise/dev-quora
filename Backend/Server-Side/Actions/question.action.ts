"use server";

import QuestionCollection, { QuestionFormat } from "@/Backend/Database/question.collection";
import connectToDB from "../database-connector";
import TagCollection, { TagFormat } from "@/Backend/Database/tag.collection";
import { CreateQuestionParams, GetQuestionsParams } from "../shared-types";
import UserCollection from "@/Backend/Database/user.collection";
import { revalidatePath } from "next/cache";

export async function getQuestions(params: GetQuestionsParams) {
    const { page, pageSize, searchQuery, filter, sort } = params;
    try {
        await connectToDB();
        const questions = await QuestionCollection.find<QuestionFormat>({})
            .populate({ path: "tags", model: TagCollection })
            .populate({ path: "author", model: UserCollection })
            .sort({ createdAt: sort === "earliest-first" ? -1 : 1 });
        return { questions };
    } catch (error) {
        console.log("Failed to retrieve questions", error);
        throw new Error("Failed to retrieve questions");
    } finally {
        // await mongoose.connection.close();
    }
}

export async function createQuestion(params: CreateQuestionParams) {
    const { title, content, tags, author, pathToRefetch } = params;
    try {
        await connectToDB();

        // create a new question document and return a reference to the question
        const newQuestionDoc: QuestionFormat = await QuestionCollection.create({ title, content, author });
        const tagsArray = [];

        // create a new tag document or update existing tag document
        for (const tag of tags) {
            const existingTag = await TagCollection.findOneAndUpdate<TagFormat>(
                { name: { $regex: new RegExp(`^${tag}$`, "i") } }, // performs a case-insensitive search for a document that matches `tag`
                { $setOnInsert: { name: tag }, $push: { question: newQuestionDoc._id } }, // if it exists, we append the new question's objectId to the tag's `questions` array
                { upsert: true, new: true }, // if there's no existing Tag document that matches `tag`, we insert a new one; where `name` = tag and `questions` is an array containing the question's objectId
            );
            tagsArray.push(existingTag._id);
        }

        // update the newly-created question document by adding a Tag property
        await QuestionCollection.findByIdAndUpdate(newQuestionDoc._id, {
            $push: { tags: { $each: tagsArray } },
        });

        // Increment author's reputation by +5 points for creating a question
        await UserCollection.findByIdAndUpdate(author, {
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
