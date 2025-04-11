"use server";

import QuestionCollection from "@/Backend/Database/question.collection";
import connectToDB from "../database.connector";
import { SearchParams } from "../parameters";
import UserCollection from "@/Backend/Database/user.collection";
import AnswerCollection from "@/Backend/Database/answer.collection";
import TagCollection from "@/Backend/Database/tag.collection";

export interface SearchResult {
    id: string;
    title: string;
    type: string;
}

export async function fetchGlobalSearchResults(params: SearchParams) {
    const { type, query } = params;
    const regexQuery = { $regex: query, $options: "i" };
    const validTypes = ["question", "answer", "user", "tag"];

    try {
        await connectToDB();
        let results: SearchResult[] = [];
        const collections = [
            { model: QuestionCollection, searchField: "title", type: "question" },
            { model: UserCollection, searchField: "name", type: "user" },
            { model: AnswerCollection, searchField: "content", type: "answer" },
            { model: TagCollection, searchField: "name", type: "tag" },
        ];

        if (type && validTypes.includes(type.toLowerCase())) {
            const searchedCollection = collections.find(item => item.type === type);
            if (!searchedCollection) throw new Error("Invalid search type");
            const queryResult = await searchedCollection.model
                .find({ [searchedCollection.searchField]: regexQuery })
                .limit(8);

            results = queryResult.map(item => ({
                title: type === "answer" ? `Answers containing "${query}"` : item[searchedCollection.searchField],
                type,
                id: type === "user" ? item.clerkId : type === "answer" ? item.question : item._id,
            }));
        } else {
            for (const { model, searchField, type } of collections) {
                const queryResult = await model.find({ [searchField]: regexQuery }).limit(2);
                const searchResult = queryResult.map(item => ({
                    title: type === "answer" ? `Answers containing "${query}"` : item[searchField],
                    type,
                    id: type === "user" ? item.clerkId : type === "answer" ? item.question : item._id,
                }));
                results.push(...searchResult);
            }
        }
        return JSON.stringify(results);
    } catch (error) {
        console.log("Error fetching global results", error);
        throw new Error("Failed to fetch global results");
    }
}
