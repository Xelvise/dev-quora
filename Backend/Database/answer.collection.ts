import { Schema, models, model, Document } from "mongoose";
import { UserDocument } from "./user.collection";
import { QuestionDocument } from "./question.collection";

// "AnswerStructure" inherits properties from the Document class so as to align with MongoDB document schema
// `Schema.Types.ObjectID` represents the unique identifier of a document in a MongoDB collection

interface AnswerStructure extends Document {
    _id: Schema.Types.ObjectId;
    content: string;
    upvotes: Schema.Types.ObjectId[];
    downvotes: Schema.Types.ObjectId[];
    author: Schema.Types.ObjectId;
    question: Schema.Types.ObjectId;
    createdAt: Date;
}

export interface AnswerDocument extends Omit<AnswerStructure, "author" | "question"> {
    author: UserDocument;
    question: QuestionDocument;
}

const AnswerSchema = new Schema<AnswerStructure>({
    content: { type: String, required: true },
    upvotes: [{ type: Schema.Types.ObjectId, ref: "users" }], // Array of references to users that upvoted this question
    downvotes: [{ type: Schema.Types.ObjectId, ref: "users" }], // Array of references to users that downvoted this question
    author: { type: Schema.Types.ObjectId, ref: "users", required: true }, // Reference to the user that authored this question
    question: { type: Schema.Types.ObjectId, ref: "questions", required: true }, // Reference to answers associated with this question
    createdAt: { type: Date, default: Date.now },
});

const AnswerCollection = models.answers || model("answers", AnswerSchema); // if the collection already exists, use it; otherwise, create a new one
export default AnswerCollection;
