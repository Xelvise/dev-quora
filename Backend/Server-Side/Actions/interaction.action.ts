"use server";

import QuestionCollection, { QuestionDoc } from "@/Backend/Database/question.collection";
import connectToDB from "../database.connector";
import { ViewQuestionParams } from "../parameters";
import InteractionCollection, { InteractionDoc } from "@/Backend/Database/interaction.collection";
import { revalidatePath } from "next/cache";
import UserCollection from "@/Backend/Database/user.collection";

export async function viewQuestion(params: ViewQuestionParams) {
    const { question_id, user_id, clientIP, pathToRefetch } = params;
    try {
        connectToDB();
        if (user_id) {
            // check for existing interaction
            const existingInteraction = await InteractionCollection.findOne<InteractionDoc>({
                user: user_id,
                action: "view",
                question: question_id,
            });
            if (!existingInteraction) {
                await InteractionCollection.create({ user: user_id, action: "view", question: question_id });
                // update view count of currently-viewed question by signed-in user
                await QuestionCollection.findByIdAndUpdate(question_id, { $inc: { views: 1 } });
                if (pathToRefetch) {
                    revalidatePath(pathToRefetch);
                    revalidatePath("/");
                }
            }
            const question = await QuestionCollection.findById<QuestionDoc>(question_id);
            if (question && question.views > 50) {
                await UserCollection.findByIdAndUpdate(question.author, {
                    $inc: { reputation: 10 * Math.floor(question.views / 50) },
                });
            }
        } else if (clientIP) {
            // If user_id is undefined, then we assume viewer is not signed-in
            const viewedQuestion = await QuestionCollection.findOne<QuestionDoc>({
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
