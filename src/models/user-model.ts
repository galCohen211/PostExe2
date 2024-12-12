import mongoose, { Schema, Document, Model } from "mongoose";

interface iUser extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string
}

const UserSchema: Schema<iUser> = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
});

const User: Model<iUser> = mongoose.model<iUser>("User", UserSchema);
export default User;
