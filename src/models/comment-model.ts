import mongoose, { Schema, Document, Model } from "mongoose";

interface iComment extends Document {
    owner: string;
    content: string;
    postId: mongoose.Types.ObjectId;
}

const CommentSchema: Schema<iComment> = new mongoose.Schema({
    owner: { type: String, required: true},
    content: { type: String, required: true },
    postId: { type: mongoose.Schema.ObjectId, required: true, ref: "Post" },
});

const Comment: Model<iComment> = mongoose.model<iComment>("Comment", CommentSchema);
export default Comment;
