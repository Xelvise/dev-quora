import { Schema, models, model, Document } from "mongoose";
import { TagDocument } from "./tag.collection";
import { UserDocument } from "./user.collection";
import { AnswerDocument } from "./answer.collection";

// "QuestionStructure" inherits properties from the Document class so as to align with MongoDB document schema
// `Schema.Types.ObjectID` represents the unique identifier of a document in a MongoDB collection

interface QuestionStructure extends Document {
    _id: Schema.Types.ObjectId;
    title: string;
    content: string;
    tags: Schema.Types.ObjectId[];
    upvotes: Schema.Types.ObjectId[];
    downvotes: Schema.Types.ObjectId[];
    author: Schema.Types.ObjectId;
    answers: Schema.Types.ObjectId[];
    createdAt: Date;
    views: number;
    anonymous_views: string[];
}

// prettier-ignore
export interface QuestionDocument extends Omit<QuestionStructure, "tags"| "author"> {
    tags: TagDocument[];
    author: UserDocument;
}

const QuestionSchema = new Schema<QuestionStructure>({
    title: { type: String, required: true },
    content: { type: String, required: true },
    tags: [{ type: Schema.Types.ObjectId, ref: "tags" }], // Array of references to tags associated with this question
    upvotes: [{ type: Schema.Types.ObjectId, ref: "users" }], // Array of references to users that upvoted this question
    downvotes: [{ type: Schema.Types.ObjectId, ref: "users" }], // Array of references to users that downvoted this question
    author: { type: Schema.Types.ObjectId, ref: "users" }, // Reference to the user that authored this question
    answers: [{ type: Schema.Types.ObjectId, ref: "answers" }], // Array of references to answers associated with this question
    createdAt: { type: Date, default: Date.now },
    views: { type: Number, default: 0 },
    anonymous_views: [{ type: String }],
});

const QuestionCollection = models.questions || model("questions", QuestionSchema); // if the collection already exists, use it - otherwise, create a new one
export default QuestionCollection;
