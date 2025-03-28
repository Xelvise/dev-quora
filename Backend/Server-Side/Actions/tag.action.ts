"use server";

import UserCollection, { UserDoc } from "@/Backend/Database/user.collection";
import connectToDB from "../database.connector";
import { GetAllTagsParams, QuestionsByTagIdParams, TopInteractedTagsParams } from "../parameters";
import TagCollection, { TagDoc } from "@/Backend/Database/tag.collection";
import QuestionCollection, { QuestionDoc } from "@/Backend/Database/question.collection";

export async function fetchAllTags(params: GetAllTagsParams) {
    const { page = 1, pageSize = 20, filter = "recent", searchQuery } = params;
    const filterQuery = searchQuery ? { name: { $regex: new RegExp(searchQuery, "i") } } : {};
    // const past_pages = (page - 1) * pageSize;
    let isFetching = true;
    try {
        await connectToDB();
        const tags_ = TagCollection.find<TagDoc>(filterQuery).limit(page * pageSize); // .skip(past_pages).limit(pageSize)
        const totalTags = await TagCollection.countDocuments(filterQuery);
        const hasMorePages = totalTags > page * pageSize; // past_pages + (await tags_).length;

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
        isFetching = false;
        return { tags, hasMorePages, isFetching };
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

export async function fetchQuestionsByTagID(params: QuestionsByTagIdParams) {
    const { tag_id, page = 1, pageSize = 5, searchQuery } = params;
    const filterQuery = searchQuery ? { title: { $regex: new RegExp(searchQuery, "i") } } : {};
    // const past_pages = (page - 1) * pageSize;
    let isFetching = true;
    try {
        await connectToDB();
        const tag_ = TagCollection.findById<TagDoc>(tag_id);
        let tagDoc = await tag_;
        if (!tagDoc) throw new Error("Tag not found");
        const totalQuestions = tagDoc.questions.length;

        tagDoc = await tag_
            // .skip(past_pages)
            .limit(page * pageSize)
            .populate({
                path: "questions",
                model: QuestionCollection,
                match: filterQuery,
                populate: [
                    { path: "tags", model: TagCollection },
                    { path: "author", model: UserCollection },
                ],
                options: { sort: { createdAt: -1 } },
            });

        const questions = tagDoc!.questions as any as QuestionDoc[];
        const hasMorePages = totalQuestions > page * pageSize; // > past_pages + questions.length;
        isFetching = false;
        return { tagTitle: tagDoc!.name, questions, hasMorePages, isFetching };
    } catch (error) {
        console.error("Error occured while fetching Questions", error);
        throw new Error("Error occured while fetching Questions");
    }
}
