"use server";

import QuestionCollection, { QuestionDocument } from "@/Backend/Database/question.collection";
import connectToDB from "../database.connector";
import { ViewQuestionParams } from "../parameters";
import InteractionCollection, { InteractionDocument } from "@/Backend/Database/interaction.collection";
import { revalidatePath } from "next/cache";

export async function viewQuestion(params: ViewQuestionParams) {
    const { question_id, user_id, clientIP, pathToRefetch } = params;
    try {
        connectToDB();
        if (user_id) {
            // check for existing interaction
            const existingInteraction = await InteractionCollection.findOne<InteractionDocument>({
                user: user_id,
                action: "view",
                question: question_id,
            });
            if (!existingInteraction) {
                await InteractionCollection.create({ user: user_id, action: "view", question: question_id });
                // update view count of currently-viewed question of signed-in user
                await QuestionCollection.findByIdAndUpdate(question_id, { $inc: { views: 1 } });
                if (pathToRefetch) {
                    revalidatePath(pathToRefetch);
                    revalidatePath("/");
                }
            }
        } else if (clientIP) {
            // If user_id is undefined, then we assume viewer is not signed-in
            const viewedQuestion = await QuestionCollection.findOne<QuestionDocument>({
                _id: question_id,
                anonymous_views: clientIP,
            });
            if (!viewedQuestion) {
                await QuestionCollection.findByIdAndUpdate(question_id, {
                    $inc: { views: 1 },
                    $push: { anonymous_views: clientIP },
                });
                if (pathToRefetch) {
                    revalidatePath(pathToRefetch);
                    revalidatePath("/");
                }
            }
        }
    } catch (error) {
        console.log("Could not increment view: ", error);
        throw new Error("Could not increment view");
    } finally {
    }
}
