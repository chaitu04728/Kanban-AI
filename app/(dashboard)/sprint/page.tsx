import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import connectDB from "@/lib/db";
import Board from "@/models/Board";
import User from "@/models/User";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { ArrowRight, Layout } from "lucide-react";

async function getBoards() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) return null;

  await connectDB();
  const user = await User.findOne({ email: session.user.email });
  if (!user) return null;

  // Find boards where user is owner or member (for now just owner as per schema)
  const boards = await Board.find({ owner: user._id }).sort({ updatedAt: -1 });
  return JSON.parse(JSON.stringify(boards));
}

export default async function SprintsPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/signin");
  }

  const boards = await getBoards();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Sprints
        </h1>
        <p className="text-sm text-gray-500">
          Select a board to manage its sprints and backlog.
        </p>
      </div>

      {boards && boards.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {boards.map((board: any) => (
            <Link
              key={board._id}
              href={`/boards/${board._id}?tab=sprints`}
              className="group relative flex flex-col justify-between space-y-4 overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-blue-500 hover:shadow-md"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Layout className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {board.name}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-1">
                    {board.description || "No description"}
                  </p>
                </div>
              </div>

              <div className="flex items-center text-sm font-medium text-blue-600 opacity-0 transition-opacity group-hover:opacity-100">
                Manage Sprints <ArrowRight className="ml-1 h-4 w-4" />
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex h-[400px] flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 text-center">
          <Layout className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">
            No boards found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Create a board first to start managing sprints.
          </p>
          <div className="mt-6">
            <Link
              href="/boards"
              className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Go to Boards
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
