import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITask extends Document {
  title: string;
  description?: string;
  status: string; // Column ID
  priority: "low" | "medium" | "high";
  boardId: mongoose.Types.ObjectId;
  assignee?: mongoose.Types.ObjectId;
  sprintId?: mongoose.Types.ObjectId;
  storyPoints?: number;
  dueDate?: Date;
  labels: string[];
  subtasks: {
    id: string;
    title: string;
    completed: boolean;
  }[];
  order: number;
  archived: boolean;
}

const TaskSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    status: { type: String, required: true },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    boardId: { type: Schema.Types.ObjectId, ref: "Board", required: true },
    assignee: { type: Schema.Types.ObjectId, ref: "User" },
    sprintId: { type: Schema.Types.ObjectId, ref: "Sprint" },
    storyPoints: { type: Number },
    dueDate: { type: Date },
    labels: [{ type: String }],
    subtasks: [
      {
        id: { type: String },
        title: { type: String },
        completed: { type: Boolean, default: false },
      },
    ],
    order: { type: Number, default: 0 },
    archived: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Task: Model<ITask> =
  mongoose.models.Task || mongoose.model<ITask>("Task", TaskSchema);

export default Task;
