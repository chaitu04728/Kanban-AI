"use client";

import { Droppable } from "@hello-pangea/dnd";
import { MoreHorizontal } from "lucide-react";
import { TaskCard } from "./TaskCard";
import { CreateTaskDialog } from "./CreateTaskDialog";
import { Task, Sprint } from "@/types";
import { cn } from "@/lib/utils";

interface ColumnProps {
  id: string;
  title: string;
  tasks: Task[];
  boardId: string;
  sprints?: Sprint[];
}

export function Column({ id, title, tasks, boardId, sprints }: ColumnProps) {
  return (
    <div className="flex h-full flex-1 flex-col rounded-lg bg-gray-50 border border-gray-200">
      <div className="flex items-center justify-between px-3 py-3 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-sm text-gray-700">{title}</h3>
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-gray-200 px-1.5 text-xs font-medium text-gray-600">
            {tasks.length}
          </span>
        </div>
        <div className="flex items-center gap-0.5">
          <CreateTaskDialog boardId={boardId} columnId={id} />
          <button className="rounded p-1 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-600">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>

      <Droppable droppableId={id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={cn(
              "flex-1 overflow-y-auto px-2.5 py-2 scrollbar-hide",
              snapshot.isDraggingOver ? "bg-blue-50/50" : ""
            )}
          >
            {tasks.map((task, index) => (
              <TaskCard
                key={task._id}
                task={task}
                index={index}
                sprints={sprints}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
