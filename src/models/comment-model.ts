import mongoose, { Schema, Document, Model } from "mongoose";

interface iComment extends Document {
    owner: mongoose.Types.ObjectId;
    comment: string;
    postId: mongoose.Types.ObjectId;
}

const CommentSchema: Schema<iComment> = new mongoose.Schema({
    owner: { type: mongoose.Schema.ObjectId, required: true, ref: "User" },
    comment: { type: String, required: true },
    postId: { type: mongoose.Schema.ObjectId, required: true, ref: "Post" },
});

const Comment: Model<iComment> = mongoose.model<iComment>("Comment", CommentSchema);
export default Comment;
