"use server";

import { revalidatePath } from "next/cache";
import UserCollection, { UserDoc } from "../../Database/user.collection";
import connectToDB from "../database.connector";
import { CreateUserParams, DeleteUserParams, GetAllUsersParams, UpdateUserParams } from "../parameters";
import QuestionCollection from "@/Backend/Database/question.collection";
import AnswerCollection from "@/Backend/Database/answer.collection";
import { FilterQuery } from "mongoose";
import { redirect } from "next/navigation";
import { BadgeCriteriaType } from "@/types";
import { assignBadges } from "@/app/utils";

export async function getSignedInUser(clerk_id: string | null) {
    try {
        await connectToDB();
        const user = await UserCollection.findOne<UserDoc>({ clerkId: clerk_id });
        return user;
    } catch (error) {
        console.error("User could not be found", error);
        throw new Error("User could not be found");
    }
}

export async function fetchUserProfileInfo(clerkId: string | null) {
    try {
        await connectToDB();
        const user = await UserCollection.findOne<UserDoc>({ clerkId });
        if (!user) throw new Error(`User with clerk_id - "${clerkId}" does not exist`);
        const totalQuestions = await QuestionCollection.countDocuments({ author: user._id }); // total number of questions the User has authored
        const totalAnswers = await AnswerCollection.countDocuments({ author: user._id }); // total number of answers the User has authored

        // Calculate total upvotes on questions that can be attributed to User
        const [QuestionUpvotesDoc] = await QuestionCollection.aggregate([
            { $match: { author: user._id } },
            { $project: { _id: 0, upvote_count: { $size: "$upvotes" } } },
            { $group: { _id: null, totalUpvotes: { $sum: "$upvotes" } } },
        ]);
        // Calculate total upvotes on answers that can be attributed to User
        const [AnswerUpvotesDoc] = await AnswerCollection.aggregate([
            { $match: { author: user._id } },
            { $project: { _id: 0, upvote_count: { $size: "$upvotes" } } },
            { $group: { _id: null, totalUpvotes: { $sum: "$upvotes" } } },
        ]);
        // Calculate User's view count
        const [QuestionViewCountDoc] = await QuestionCollection.aggregate([
            { $match: { author: user._id } },
            { $group: { _id: null, totalViewCount: { $sum: "$views" } } },
        ]);

        const criteria = [
            { type: "QUESTION_COUNT" as BadgeCriteriaType, count: totalQuestions },
            { type: "ANSWER_COUNT" as BadgeCriteriaType, count: totalAnswers },
            { type: "QUESTION_UPVOTES" as BadgeCriteriaType, count: QuestionUpvotesDoc?.totalUpvotes || 0 },
            { type: "ANSWER_UPVOTES" as BadgeCriteriaType, count: AnswerUpvotesDoc?.totalUpvotes || 0 },
            { type: "TOTAL_VIEWS" as BadgeCriteriaType, count: QuestionViewCountDoc?.totalViewCount || 0 },
        ];

        const badgeCounts = assignBadges({ criteria });
        return { user, totalQuestions, totalAnswers, badgeCounts };
    } catch (error) {
        console.error("User could not be found", error);
        throw new Error("User could not be found");
    }
}

export async function fetchUsers(params: GetAllUsersParams) {
    const { page = 1, pageSize = 10, filter = "new_users", searchQuery } = params;
    const filterQuery: FilterQuery<typeof UserCollection> = {};
    if (searchQuery) {
        filterQuery.$or = [
            { name: { $regex: new RegExp(searchQuery, "i") } },
            { username: { $regex: new RegExp(searchQuery, "i") } },
        ];
    }
    try {
        await connectToDB();
        const users_ = UserCollection.find<UserDoc>(filterQuery).limit(page * pageSize); //.skip(past_pages).limit(pageSize);

        const totalUsers = await UserCollection.countDocuments(filterQuery);
        const hasMorePages = totalUsers > page * pageSize;

        let users;
        if (filter === "new_users") {
            users = await users_.sort({ joinedAt: -1 });
        } else if (filter === "old_users") {
            users = await users_.sort({ joinedAt: 1 });
        } else if (filter === "top_contributors") {
            users = await users_.sort({ reputation: -1 });
        } else {
            throw new Error("Invalid filter");
        }
        return { users, hasMorePages };
    } catch (error) {
        console.error("Error occured while fetching Users", error);
        throw new Error("Error occured while fetching Users");
    }
}

export async function createUser(userData: CreateUserParams) {
    try {
        await connectToDB();
        const newUser = await UserCollection.create(userData);
        return newUser;
    } catch (error) {
        console.error("Error occured while creating User", error);
    }
}

export async function updateUser(params: UpdateUserParams) {
    const { clerk_id, updatedData, pathToRefetch, redirectToGivenPath } = params;
    try {
        await connectToDB();
        // prettier-ignore
        const updatedUser = await UserCollection.findOneAndUpdate<UserDoc>({ clerkId: clerk_id }, updatedData, { new: true });
        if (pathToRefetch) {
            pathToRefetch.forEach(path => revalidatePath(path));
            if (redirectToGivenPath) redirect(pathToRefetch[0]);
        }
    } catch (error) {
        console.error("Error occured while updating User", error);
    }
}

export async function deleteUser(params: DeleteUserParams) {
    const { clerk_id } = params;
    try {
        await connectToDB();
        // find User in UserCollection
        const user = await UserCollection.findOne<UserDoc>({ clerkId: clerk_id });
        if (!user) throw new Error("User not found");

        // Using objectIds of User's questions, find & delete all User-associated answers, comments, upvotes, etc.
        // prettier-ignore
        const userQuestionIDs = await QuestionCollection.find<UserDoc>({ author: user._id }).distinct("_id")
        // TODO ...

        // While referencing User's objectId, delete all User-associated questions
        await QuestionCollection.deleteMany({ author: user._id });

        // finally delete the User
        const deletedUser = await UserCollection.findByIdAndDelete(user._id);
        return deletedUser;
    } catch (error) {
        console.error("Error occured while deleting User", error);
    }
}
