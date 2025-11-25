"use client";

import { useState } from "react";
import { Draggable } from "@hello-pangea/dnd";
import { Calendar, MoreHorizontal, Copy, Archive } from "lucide-react";
import { Task, Sprint } from "@/types";
import { cn } from "@/lib/utils";
import { TaskDetailDialog } from "./TaskDetailDialog";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface TaskCardProps {
  task: Task;
  index: number;
  sprints?: Sprint[];
}

export function TaskCard({ task, index, sprints }: TaskCardProps) {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const router = useRouter();

  const handleDuplicate = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...task,
          _id: undefined,
          title: `${task.title} (Copy)`,
          createdAt: undefined,
          updatedAt: undefined,
        }),
      });

      if (response.ok) {
        toast.success("Task duplicated successfully");
        router.refresh();
      }
    } catch (error) {
      toast.error("Failed to duplicate task");
    }
    setShowActions(false);
  };

  const handleArchive = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const response = await fetch(`/api/tasks/${task._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ archived: true }),
      });

      if (response.ok) {
        toast.success("Task archived");
        router.refresh();
      }
    } catch (error) {
      toast.error("Failed to archive task");
    }
    setShowActions(false);
  };

  return (
    <>
      <Draggable draggableId={task._id} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            onClick={() => setIsDetailOpen(true)}
            className={cn(
              "group relative mb-3 rounded-lg border bg-white p-3 shadow-sm transition-all hover:shadow-md cursor-pointer",
              snapshot.isDragging &&
                "rotate-2 shadow-lg ring-2 ring-blue-500 ring-opacity-50"
            )}
            style={provided.draggableProps.style}
          >
            <div className="flex items-start justify-between">
              <h4 className="text-sm font-medium text-gray-900 line-clamp-2">
                {task.title}
              </h4>
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowActions(!showActions);
                  }}
                  className="opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <MoreHorizontal className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                </button>
                {showActions && (
                  <div className="absolute right-0 top-6 z-10 w-40 rounded-md border border-gray-200 bg-white shadow-lg">
                    <button
                      onClick={handleDuplicate}
                      className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <Copy className="h-4 w-4" />
                      Duplicate
                    </button>
                    <button
                      onClick={handleArchive}
                      className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <Archive className="h-4 w-4" />
                      Archive
                    </button>
                  </div>
                )}
              </div>
            </div>

            {task.labels && task.labels.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {task.labels.map((label, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700"
                  >
                    {label}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-2">
                {task.priority && (
                  <span
                    className={cn(
                      "h-2 w-2 rounded-full",
                      task.priority === "high"
                        ? "bg-red-500"
                        : task.priority === "medium"
                        ? "bg-yellow-500"
                        : "bg-green-500"
                    )}
                  />
                )}
                {task.dueDate && (
                  <div className="flex items-center">
                    <Calendar className="mr-1 h-3 w-3" />
                    {new Date(task.dueDate).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                )}
              </div>
              {task.storyPoints && (
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-100 font-medium">
                  {task.storyPoints}
                </div>
              )}
            </div>
          </div>
        )}
      </Draggable>

      <TaskDetailDialog
        task={task}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        sprints={sprints}
      />
    </>
  );
}
