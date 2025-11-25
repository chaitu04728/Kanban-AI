import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  email: string;
  name: string;
  avatar?: string;
  role: "admin" | "project_manager" | "developer" | "viewer";
  createdAt: Date;
  lastLogin: Date;
}

const UserSchema: Schema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    avatar: { type: String },
    role: {
      type: String,
      enum: ["admin", "project_manager", "developer", "viewer"],
      default: "viewer",
    },
    lastLogin: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
