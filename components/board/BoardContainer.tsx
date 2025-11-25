"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Board, Task, Sprint } from "@/types";
import { BoardView } from "./BoardView";
import { BacklogView } from "../sprint/BacklogView";
import { Layout, List } from "lucide-react";
import { CreateTaskDialog } from "./CreateTaskDialog";

interface BoardContainerProps {
  board: Board;
  tasks: Task[];
  sprints: Sprint[];
}

export function BoardContainer({ board, tasks, sprints }: BoardContainerProps) {
  const searchParams = useSearchParams();
  const initialTab =
    searchParams.get("tab") === "sprints" ? "backlog" : "board";
  const [view, setView] = useState<"board" | "backlog">(initialTab);

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "sprints") {
      setView("backlog");
    } else if (tab === "board") {
      setView("board");
    }
  }, [searchParams]);

  return (
    <div className="flex h-full flex-col space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-900">{board.title}</h1>
          <div className="flex rounded-lg bg-gray-100 p-1">
            <button
              onClick={() => setView("board")}
              className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                view === "board"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              <Layout className="h-4 w-4" />
              Board
            </button>
            <button
              onClick={() => setView("backlog")}
              className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                view === "backlog"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              <List className="h-4 w-4" />
              Backlog
            </button>
          </div>
        </div>
        {view === "board" && <CreateTaskDialog boardId={board._id} />}
      </div>

      <div className="flex-1 overflow-hidden">
        {view === "board" ? (
          <BoardView board={board} initialTasks={tasks} />
        ) : (
          <BacklogView boardId={board._id} sprints={sprints} tasks={tasks} />
        )}
      </div>
    </div>
  );
}
