"use server";

import QuestionCollection, { QuestionDoc } from "@/Backend/Database/question.collection";
import connectToDB from "../database.connector";
import { ViewQuestionParams } from "../parameters";
import InteractionCollection, { InteractionDoc } from "@/Backend/Database/interaction.collection";
import { revalidatePath } from "next/cache";
import UserCollection from "@/Backend/Database/user.collection";

// prettier-ignore
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
                const question = await QuestionCollection.findByIdAndUpdate(question_id, { $inc: { views: 1 } });
                if (question && question.views > 50) {
                    await UserCollection.findByIdAndUpdate(question.author, {
                        $inc: { reputation: 10 * Math.floor(question.views / 50) },
                    });
                }
                if (pathToRefetch) {
                    revalidatePath(pathToRefetch);
                    revalidatePath("/");
                }
            }
        } else if (clientIP) {
            // If user_id is undefined, then we assume viewer is not signed-in
            const question = await QuestionCollection.findById<QuestionDoc>(question_id);
            if (!question) throw new Error("Question not found");

            // Helper function to check if two IPs are similar (first three octets match)
            const areIPsSimilar = (ip1: string, ip2: string): boolean => {
                const ip1Parts = ip1.split(".");
                const ip2Parts = ip2.split(".");
                // Check if the first three octets match
                return (
                    ip1Parts.length === 4 &&
                    ip2Parts.length === 4 &&
                    ip1Parts[0] === ip2Parts[0] &&
                    ip1Parts[1] === ip2Parts[1] &&
                    ip1Parts[2] === ip2Parts[2]
                );
            };

            // Check if any IP in anonymous_views is similar to clientIP
            const hasSimilarIP = question.anonymous_views && question.anonymous_views.some(ip => areIPsSimilar(ip, clientIP));
            if (!hasSimilarIP) {
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
