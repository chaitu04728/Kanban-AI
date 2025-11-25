import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import connectDB from "@/lib/db";
import Board from "@/models/Board";
import Task from "@/models/Task";
import Sprint from "@/models/Sprint";
import User from "@/models/User";
import { authOptions } from "@/lib/auth";
import { BoardContainer } from "@/components/board/BoardContainer";
import {
  Board as BoardType,
  Task as TaskType,
  Sprint as SprintType,
} from "@/types";

async function getBoardData(id: string) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) return null;

  await connectDB();
  const user = await User.findOne({ email: session.user.email });
  if (!user) return null;

  const board = await Board.findOne({ _id: id, owner: user._id });
  if (!board) return null;

  const tasks = await Task.find({ boardId: id }).sort({ order: 1 });
  const sprints = await Sprint.find({ boardId: id }).sort({ startDate: 1 });

  // Serialize Mongoose documents to plain objects
  const serializedBoard: BoardType = JSON.parse(JSON.stringify(board));
  const serializedTasks: TaskType[] = JSON.parse(JSON.stringify(tasks));
  const serializedSprints: SprintType[] = JSON.parse(JSON.stringify(sprints));

  return {
    board: serializedBoard,
    tasks: serializedTasks,
    sprints: serializedSprints,
  };
}

export default async function BoardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/signin");
  }

  const data = await getBoardData(id);

  if (!data) {
    notFound();
  }

  return (
    <BoardContainer
      board={data.board}
      tasks={data.tasks}
      sprints={data.sprints}
    />
  );
}
