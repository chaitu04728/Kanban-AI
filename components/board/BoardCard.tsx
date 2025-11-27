import Link from "next/link";
import { IBoard } from "@/models/Board";
import { Calendar, User } from "lucide-react";

interface BoardCardProps {
  board: IBoard & {
    owner?: {
      name?: string;
      email?: string;
    };
  };
}

export function BoardCard({ board }: BoardCardProps) {
  return (
    <Link
      href={`/boards/${board._id}`}
      className="group relative flex flex-col justify-between overflow-hidden rounded-lg border bg-white p-6 shadow-sm transition-all hover:shadow-md"
    >
      <div>
        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600">
          {board.title}
        </h3>
        <p className="mt-2 text-sm text-gray-500">
          {board.columns?.length || 0} columns
        </p>
      </div>
      <div className="mt-4 space-y-1">
        {board.owner && (
          <div className="flex items-center text-xs text-gray-400">
            <User className="mr-1.5 h-3.5 w-3.5" />
            Created by {board.owner.name || board.owner.email}
          </div>
        )}
        <div className="flex items-center text-xs text-gray-400">
          <Calendar className="mr-1.5 h-3.5 w-3.5" />
          {new Date(board.createdAt).toLocaleDateString()}
        </div>
      </div>
    </Link>
  );
}
