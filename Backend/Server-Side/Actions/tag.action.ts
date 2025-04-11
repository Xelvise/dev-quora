"use server";

import UserCollection, { UserDoc } from "@/Backend/Database/user.collection";
import connectToDB from "../database.connector";
import { GetAllTagsParams, QuestionsByTagIdParams, TopInteractedTagsParams } from "../parameters";
import TagCollection, { TagDoc } from "@/Backend/Database/tag.collection";
import QuestionCollection, { QuestionDoc } from "@/Backend/Database/question.collection";

export async function fetchAllTags(params: GetAllTagsParams) {
    const { page = 1, pageSize = 20, filter = "recent", searchQuery } = params;
    const filterQuery = searchQuery ? { name: { $regex: new RegExp(searchQuery, "i") } } : {};
    try {
        await connectToDB();
        const tags_ = TagCollection.find<TagDoc>(filterQuery);

        let tags;
        if (filter === "recent") {
            tags = await tags_.sort({ createdOn: -1 });
        } else if (filter === "old") {
            tags = await tags_.sort({ createdOn: 1 });
        } else if (filter === "popular") {
            await TagCollection.aggregate([{ $project: { numOfQuestions: { $size: "$questions" } } }]);
            tags = await tags_.sort({ numOfQuestions: -1 });
        } else if (filter === "name") {
            tags = await tags_.sort({ name: 1 });
        } else {
            throw new Error("Invalid Filter");
        }
        return { tags };
    } catch (error) {
        console.error("Error occured while fetching all tags", error);
        throw new Error("Error occured while fetching all tags");
    }
}

export async function fetchPopularTags() {
    // prettier-ignore
    interface TagDoc_ extends TagDoc { numOfQuestions: number }

    try {
        await connectToDB();
        const popularTags = await TagCollection.aggregate<TagDoc>([
            { $project: { name: 1, numOfQuestions: { $size: "$questions" } } },
            { $sort: { numOfQuestions: -1 } },
            { $limit: 5 },
        ]);
        return popularTags as TagDoc_[];
    } catch (error) {
        console.error("Error occured while fetching popular tags", error);
        throw new Error("Error occured while fetching popular tags");
    }
}

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

export async function fetchAllQuestionsByTagID(params: QuestionsByTagIdParams) {
    const { tag_id, page = 1, pageSize = 5, searchQuery } = params;
    const filterQuery = searchQuery ? { title: { $regex: new RegExp(searchQuery, "i") } } : {};

    try {
        await connectToDB();
        // Create a new query to fetch paginated and populated questions
        const tagDoc = await TagCollection.findById<TagDoc>(tag_id).populate({
            path: "questions",
            model: QuestionCollection,
            match: filterQuery,
            options: { sort: { createdAt: -1 } },
            populate: [
                { path: "tags", model: TagCollection },
                { path: "author", model: UserCollection },
            ],
        });
        if (!tagDoc) throw new Error("Tag not found");
        const questions = tagDoc.questions as any as QuestionDoc[];

        return { tagTitle: tagDoc.name, questions };
    } catch (error) {
        console.error("Error occurred while fetching Questions", error);
        throw new Error("Error occurred while fetching Questions");
    }
}
