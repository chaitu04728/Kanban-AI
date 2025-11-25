import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBoard extends Document {
  title: string;
  owner: mongoose.Types.ObjectId;
  columns: {
    id: string;
    title: string;
    order: number;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const BoardSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    columns: [
      {
        id: { type: String, required: true },
        title: { type: String, required: true },
        order: { type: Number, required: true },
      },
    ],
  },
  { timestamps: true }
);

const Board: Model<IBoard> =
  mongoose.models.Board || mongoose.model<IBoard>("Board", BoardSchema);

export default Board;
