import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import connectDB from "@/lib/db";
import Board from "@/models/Board";
import User from "@/models/User";
import { authOptions } from "@/lib/auth";
import { CreateBoardDialog } from "@/components/board/CreateBoardDialog";
import { BoardCard } from "@/components/board/BoardCard";

async function getBoards() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) return null;

  await connectDB();
  const user = await User.findOne({ email: session.user.email });
  if (!user) return null;

  const boards = await Board.find({ owner: user._id }).sort({ createdAt: -1 });
  return JSON.parse(JSON.stringify(boards)); // Serialize for Client Components
}

export default async function BoardsPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/signin");
  }

  const boards = await getBoards();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Boards
          </h1>
          <p className="text-sm text-gray-500">
            Manage your projects and tasks.
          </p>
        </div>
        <CreateBoardDialog />
      </div>

      {boards && boards.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {boards.map((board: any) => (
            <BoardCard key={board._id} board={board} />
          ))}
        </div>
      ) : (
        <div className="flex h-[400px] flex-col items-center justify-center rounded-lg border border-dashed bg-gray-50 text-center">
          <h3 className="mt-2 text-sm font-semibold text-gray-900">
            No boards created
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating a new board.
          </p>
          <div className="mt-6">
            <CreateBoardDialog />
          </div>
        </div>
      )}
    </div>
  );
}
