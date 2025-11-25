import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISprint extends Document {
  name: string;
  goal?: string;
  startDate: Date;
  endDate: Date;
  boardId: mongoose.Types.ObjectId;
  status: "planned" | "active" | "completed";
}

const SprintSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    goal: { type: String },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    boardId: { type: Schema.Types.ObjectId, ref: "Board", required: true },
    status: {
      type: String,
      enum: ["planned", "active", "completed"],
      default: "planned",
    },
  },
  { timestamps: true }
);

const Sprint: Model<ISprint> =
  mongoose.models.Sprint || mongoose.model<ISprint>("Sprint", SprintSchema);

export default Sprint;
