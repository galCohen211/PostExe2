import mongoose from "mongoose";

export interface iPost {
  title: String,
  content: String,
  owner: String,
}

const postSchema = new mongoose.Schema<iPost>({
  title: {
    type: String,
    required: true,
  },
  content: String,
  owner: {
    type: String,
    required: true,
  },
});

const postModel = mongoose.model<iPost>("Post", postSchema);

export default postModel;