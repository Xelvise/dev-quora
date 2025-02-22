"use server";

import { revalidatePath } from "next/cache";
import UserCollection, { UserFormat } from "../../Database/user.collection";
import connectToDB from "../database-connector";
import { CreateUserParams, DeleteUserParams, UpdateUserParams } from "../shared-types";
import QuestionCollection from "@/Backend/Database/question.collection";
import { Schema } from "mongoose";

export async function getUserByClerkID(id: string) {
    try {
        await connectToDB();
        const user = await UserCollection.findOne<UserFormat>({ clerkId: id });
        return user;
    } catch (error) {
        console.error("User could not be found", error);
        throw new Error("User could not be found");
    }
}

export async function createUser(userData: CreateUserParams) {
    try {
        await connectToDB();
        const newUser = await UserCollection.create(userData);
        return newUser;
    } catch (error) {
        console.error("User could not be created", error);
    }
}

export async function updateUser(params: UpdateUserParams) {
    try {
        await connectToDB();
        const { clerkId, updatedData, pathToRefetch } = params;
        const updatedUser = await UserCollection.findOneAndUpdate<UserFormat>({ clerkId: clerkId }, updatedData, {
            new: true,
        });
        if (pathToRefetch) revalidatePath(pathToRefetch);
        return updatedUser;
    } catch (error) {
        console.error("User could not be updated", error);
    }
}

export async function deleteUser(params: DeleteUserParams) {
    try {
        await connectToDB();
        const { clerkId } = params;
        // find User in UserCollection
        const user = await UserCollection.findOne<UserFormat>({ clerkId: clerkId });
        if (!user) throw new Error("User not found");

        // While referencing User's objectId, delete all User-associated questions
        await QuestionCollection.deleteMany({ author: user._id });

        // Using objectIds of User's questions, find & delete all User-associated answers, comments, upvotes, etc.
        // prettier-ignore
        const userQuestionIDs = await QuestionCollection.find({ author: user._id }).distinct("_id") as Schema.Types.ObjectId[];
        // TODO ...

        // finally delete the User
        const deletedUser = await UserCollection.findByIdAndDelete(user._id);
        return deletedUser;
    } catch (error) {
        console.error("User could not be deleted", error);
    }
}
