"use server";

import { revalidatePath } from "next/cache";
import UserCollection, { UserDoc } from "../../Database/user.collection";
import connectToDB from "../database.connector";
import { CreateUserParams, DeleteUserParams, GetAllUsersParams, UpdateUserParams } from "../parameters";
import QuestionCollection from "@/Backend/Database/question.collection";

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

export async function fetchUsers(params: GetAllUsersParams) {
    const { page = 1, pageLimit, filter, searchQuery, sortBy } = params;
    try {
        await connectToDB();
        const query = UserCollection.find<UserDoc>({});
        if (pageLimit) query.limit(pageLimit);
        const users = await query.sort({ createdAt: sortBy === "newest-to-oldest" ? -1 : 1 });
        return { users };
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
    const { clerk_id, updatedData, pathToRefetch } = params;
    try {
        await connectToDB();
        // prettier-ignore
        const updatedUser = await UserCollection.findOneAndUpdate<UserDoc>({ clerkId: clerk_id }, updatedData, { new: true });
        if (pathToRefetch) {
            pathToRefetch.forEach(path => revalidatePath(path));
        }
        return updatedUser;
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
