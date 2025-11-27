"use client";

import { useState } from "react";
import { Draggable } from "@hello-pangea/dnd";
import { Calendar, MoreHorizontal, Copy, Archive, User } from "lucide-react";
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
              "group relative mb-2.5 cursor-pointer rounded-lg border border-gray-200 bg-white p-3 shadow-sm transition-all hover:shadow-md",
              snapshot.isDragging && "shadow-xl ring-2 ring-blue-500"
            )}
            style={provided.draggableProps.style}
          >
            {/* Title and Menu */}
            <div className="mb-2 flex items-start justify-between gap-2">
              <h4 className="flex-1 text-sm font-medium text-gray-900 line-clamp-2">
                {task.title}
              </h4>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowActions(!showActions);
                }}
                className="rounded p-0.5 opacity-0 transition-opacity hover:bg-gray-100 group-hover:opacity-100"
              >
                <MoreHorizontal className="h-4 w-4 text-gray-400" />
              </button>
              {showActions && (
                <div className="absolute right-2 top-8 z-10 w-36 overflow-hidden rounded-md border bg-white shadow-lg">
                  <button
                    onClick={handleDuplicate}
                    className="flex w-full items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    Duplicate
                  </button>
                  <button
                    onClick={handleArchive}
                    className="flex w-full items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50"
                  >
                    <Archive className="h-3.5 w-3.5" />
                    Archive
                  </button>
                </div>
              )}
            </div>

            {/* Labels */}
            {task.labels && task.labels.length > 0 && (
              <div className="mb-2 flex flex-wrap gap-1">
                {task.labels.slice(0, 2).map((label, i) => (
                  <span
                    key={i}
                    className="rounded bg-blue-100 px-1.5 py-0.5 text-xs text-blue-700"
                  >
                    {label}
                  </span>
                ))}
                {task.labels.length > 2 && (
                  <span className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600">
                    +{task.labels.length - 2}
                  </span>
                )}
              </div>
            )}

            {/* Bottom Info */}
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-2">
                {task.priority && (
                  <span
                    className={cn(
                      "h-1.5 w-1.5 rounded-full",
                      task.priority === "high"
                        ? "bg-red-500"
                        : task.priority === "medium"
                        ? "bg-yellow-500"
                        : "bg-green-500"
                    )}
                  />
                )}
                {task.assignee && (
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    <span className="text-xs">
                      {typeof task.assignee === "object"
                        ? (task.assignee as any).name
                        : ""}
                    </span>
                  </div>
                )}
                {task.dueDate && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>
                      {new Date(task.dueDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                )}
              </div>
              {task.storyPoints && (
                <span className="flex h-5 w-5 items-center justify-center rounded bg-purple-100 text-xs font-semibold text-purple-700">
                  {task.storyPoints}
                </span>
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
