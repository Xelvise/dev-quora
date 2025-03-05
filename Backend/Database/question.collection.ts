import { Schema, models, model, Document } from "mongoose";
import { TagFormat } from "./tag.collection";
import { UserFormat } from "./user.collection";
import { AnswerFormat } from "./answer.collection";

// "QuestionStructure" inherits properties from the Document class so as to align with MongoDB document schema
// `Schema.Types.ObjectID` represents the unique identifier of a document in a MongoDB collection

interface QuestionStructure extends Document {
    title: string;
    content: string;
    views: number;
    tags: Schema.Types.ObjectId[];
    upvotes: Schema.Types.ObjectId[];
    downvotes: Schema.Types.ObjectId[];
    author: Schema.Types.ObjectId;
    answers: Schema.Types.ObjectId[];
    createdAt: Date;
}

// prettier-ignore
export interface QuestionFormat extends Omit<QuestionStructure, "tags"| "author"> {
    _id: Schema.Types.ObjectId;
    tags: TagFormat[];
    author: UserFormat;
}

const QuestionSchema = new Schema<QuestionStructure>({
    title: { type: String, required: true },
    content: { type: String, required: true },
    views: { type: Number, default: 0 },
    tags: [{ type: Schema.Types.ObjectId, ref: "tags" }], // Array of references to tags associated with this question
    upvotes: [{ type: Schema.Types.ObjectId, ref: "users" }], // Array of references to users that upvoted this question
    downvotes: [{ type: Schema.Types.ObjectId, ref: "users" }], // Array of references to users that downvoted this question
    author: { type: Schema.Types.ObjectId, ref: "users" }, // Reference to the user that authored this question
    answers: [{ type: Schema.Types.ObjectId, ref: "answers" }], // Array of references to answers associated with this question
    createdAt: { type: Date, default: Date.now },
});

const QuestionCollection = models.questions || model("questions", QuestionSchema); // if the collection already exists, use it - otherwise, create a new one
export default QuestionCollection;
