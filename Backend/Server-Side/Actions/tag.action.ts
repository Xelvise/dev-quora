"use server";

import UserCollection, { UserFormat } from "@/Backend/Database/user.collection";
import connectToDB from "../database.connector";
import { GetAllTagsParams, TopInteractedTagsParams } from "../parameters";
import TagCollection, { TagFormat } from "@/Backend/Database/tag.collection";
import { model } from "mongoose";
import QuestionCollection from "@/Backend/Database/question.collection";

export async function fetchTopInteractedTags(params: TopInteractedTagsParams): Promise<TagFormat[]> {
    const { user_id, limit = 3 } = params;
    try {
        await connectToDB();
        const user = await UserCollection.findById<UserFormat>(user_id);
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
        const tags = await TagCollection.find<TagFormat>({}).populate({ path: "questions", model: QuestionCollection });
        return { tags };
    } catch (error) {
        console.error("Error occured while fetching all tags", error);
        throw new Error("Error occured while fetching all tags");
    }
}
