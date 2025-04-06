import { Schema, model, models, Document } from "mongoose";

// "InteractionStructure" inherits properties from the Document class so as to align with MongoDB document schema
// `Schema.Types.ObjectID` represents the unique identifier of a document in a MongoDB collection

export interface InteractionDoc extends Document {
    _id: Schema.Types.ObjectId;
    user: Schema.Types.ObjectId;
    action: string;
    question?: Schema.Types.ObjectId;
    answer?: Schema.Types.ObjectId;
    tags?: Schema.Types.ObjectId[];
    createdOn?: Date;
}

// export interface InteractionFormat extends InteractionStructure {}

const InteractionSchema = new Schema<InteractionDoc>({
    user: { type: Schema.Types.ObjectId, required: true, ref: "users" }, // Reference to the User who made this interaction
    action: { type: String, required: true }, // Type of interaction made by the user
    question: { type: Schema.Types.ObjectId, ref: "questions" }, // References to questions that interactions were made on
    answer: { type: Schema.Types.ObjectId, ref: "answers" }, // References to answers that interactions were made on
    tags: [{ type: Schema.Types.ObjectId, ref: "tags" }],
    createdOn: { type: Date, default: Date.now },
});

const InteractionCollection = models.interactions || model("interactions", InteractionSchema); // if the collection already exists, use it; otherwise, create a new one
export default InteractionCollection;
