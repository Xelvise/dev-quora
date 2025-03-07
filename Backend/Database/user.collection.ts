import { Schema, models, model, Document } from "mongoose";
import { QuestionDocument } from "./question.collection";

// "UserStructure" inherits properties from the Document class so as to align with MongoDB document schema
// `Schema.Types.ObjectID` represents the unique identifier of a document in a MongoDB collection

export interface UserStructure extends Document {
    _id: Schema.Types.ObjectId;
    clerkId: string;
    name: string;
    username: string;
    email: string;
    password?: string;
    bio?: string;
    picture: string;
    location?: string;
    portfolioWebsite?: string;
    reputation: number;
    saved: Schema.Types.ObjectId[];
    joinedAt: Date;
}

export interface UserDocument extends Omit<UserStructure, "saved"> {
    saved: QuestionDocument[];
}

const UserSchema = new Schema<UserStructure>({
    clerkId: { type: String, required: true },
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    bio: { type: String },
    picture: { type: String, required: true },
    location: { type: String },
    portfolioWebsite: { type: String },
    reputation: { type: Number, default: 0 },
    saved: [{ type: Schema.Types.ObjectId, ref: "questions" }], // Array of references to questions saved by this user
    joinedAt: { type: Date, default: Date.now },
});

const UserCollection = models.users || model("users", UserSchema); // if the collection already exists, use it; otherwise, create a new one
export default UserCollection;
