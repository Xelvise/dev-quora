import { Schema, model, models, Document } from "mongoose";
import { QuestionFormat } from "./question.collection";
import { UserFormat } from "./user.collection";

// "TagStructure" inherits properties from the Document class so as to align with MongoDB document schema
// `Schema.Types.ObjectID` represents the unique identifier of a document in a MongoDB collection

interface TagStructure extends Document {
    name: string;
    desc?: string;
    questions: Schema.Types.ObjectId[];
    followers: Schema.Types.ObjectId[];
    createdOn: Date;
}

export interface TagFormat extends Omit<TagStructure, "questions"> {
    _id: Schema.Types.ObjectId;
    questions: QuestionFormat[];
}

const TagSchema = new Schema<TagStructure>({
    name: { type: String, required: true, unique: true },
    desc: { type: String },
    questions: [{ type: Schema.Types.ObjectId, ref: "questions" }], // Array of references to questions associated with this tag
    followers: [{ type: Schema.Types.ObjectId, ref: "users" }], // Array of references to Users whose questions are associated with this tag
    createdOn: { type: Date, default: Date.now },
});

const TagCollection = models.tags || model("tags", TagSchema); // if the collection already exists, use it; otherwise, create a new one
export default TagCollection;
