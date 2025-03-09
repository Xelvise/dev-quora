"use server";

import UserCollection, { UserDoc } from "@/Backend/Database/user.collection";
import connectToDB from "../database.connector";
import { GetAllTagsParams, QuestionsByTagIdParams, TopInteractedTagsParams } from "../parameters";
import TagCollection, { TagDoc } from "@/Backend/Database/tag.collection";
import { model } from "mongoose";
import QuestionCollection, { QuestionDoc } from "@/Backend/Database/question.collection";

export async function fetchTopInteractedTags(params: TopInteractedTagsParams): Promise<TagDoc[]> {
    const { user_id, limit = 3 } = params;
    try {
        await connectToDB();
        const user = await UserCollection.findById<UserDoc>(user_id);
        if (!user) console.error("User could not be found");

        // Find User-associated tags from User interactions like questions, answers etc...
        // TODO
        return [];
    } catch (error) {
        console.error("Error occured while fetching top interacted tags", error);
        throw new Error("Error occured while fetching top interacted tags");
    }
}

export async function fetchAllTags(params: GetAllTagsParams) {
    const {} = params;
    try {
        await connectToDB();
        const tags = await TagCollection.find<TagDoc>({});
        return { tags };
    } catch (error) {
        console.error("Error occured while fetching all tags", error);
        throw new Error("Error occured while fetching all tags");
    }
}

export async function fetchQuestionsByTagID(params: QuestionsByTagIdParams) {
    const { tag_id, page = 1, pageLimit = 10, searchQuery, sortBy } = params;
    const query = searchQuery ? { title: { $regex: new RegExp(searchQuery, "i") } } : {};
    try {
        await connectToDB();
        const tag = await TagCollection.findById<TagDoc>(tag_id).populate({
            path: "questions",
            model: QuestionCollection,
            match: query,
            populate: [
                { path: "tags", model: TagCollection },
                { path: "author", model: UserCollection },
            ],
            options: { sort: { createdAt: sortBy === "newest-to-oldest" ? -1 : 1 } },
        });
        if (!tag) throw new Error("Tag not found");
        const questions = tag.questions as any as QuestionDoc[];
        return { tagTitle: tag.name, questions };
    } catch (error) {
        console.error("Error occured while fetching Questions", error);
        throw new Error("Error occured while fetching Questions");
    }
}
