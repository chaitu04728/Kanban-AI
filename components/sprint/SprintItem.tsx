"use client";

import { useState } from "react";
import { Sprint, Task } from "@/types";
import { format } from "date-fns";
import { MoreVertical, Play, CheckCircle, Calendar } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { TaskDetailDialog } from "../board/TaskDetailDialog";
import { ReleaseNotesDialog } from "./ReleaseNotesDialog";

interface SprintItemProps {
  sprint: Sprint;
  tasks: Task[];
  onEdit?: (sprint: Sprint) => void;
  allSprints?: Sprint[];
}

export function SprintItem({
  sprint,
  tasks,
  onEdit,
  allSprints,
}: SprintItemProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showReleaseNotes, setShowReleaseNotes] = useState(false);

  const handleStatusChange = async (newStatus: "active" | "completed") => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/sprints/${sprint._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to update sprint status", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this sprint?")) return;

    setIsLoading(true);
    try {
      const res = await fetch(`/api/sprints/${sprint._id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to delete sprint", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-900">{sprint.name}</h3>
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                sprint.status === "active"
                  ? "bg-green-100 text-green-700"
                  : sprint.status === "completed"
                  ? "bg-gray-100 text-gray-700"
                  : "bg-blue-100 text-blue-700"
              }`}
            >
              {sprint.status}
            </span>
          </div>
          <div className="mt-1 flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>
                {format(new Date(sprint.startDate), "MMM d")} -{" "}
                {format(new Date(sprint.endDate), "MMM d")}
              </span>
            </div>
            <span>{tasks.length} issues</span>
          </div>
          {sprint.goal && (
            <p className="mt-2 text-sm text-gray-600">{sprint.goal}</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {sprint.status === "planned" && (
            <button
              onClick={() => handleStatusChange("active")}
              disabled={isLoading}
              className="flex items-center gap-1 rounded-md bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-200"
            >
              <Play className="h-3 w-3" />
              Start Sprint
            </button>
          )}
          {sprint.status === "active" && (
            <button
              onClick={() => handleStatusChange("completed")}
              disabled={isLoading}
              className="flex items-center gap-1 rounded-md bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-200"
            >
              <CheckCircle className="h-3 w-3" />
              Complete Sprint
            </button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="rounded-md p-1 hover:bg-gray-100">
                <MoreVertical className="h-4 w-4 text-gray-500" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => onEdit?.(sprint)}
                className="text-gray-900"
              >
                Edit sprint
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setShowReleaseNotes(true)}
                className="text-gray-900"
              >
                Generate release notes
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDelete} className="text-red-600">
                Delete sprint
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Task list placeholder - we will implement drag and drop here later */}
      <div className="mt-4 space-y-2">
        {tasks.length === 0 ? (
          <div className="rounded border border-dashed border-gray-200 p-4 text-center text-sm text-gray-500">
            No issues in this sprint
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task._id}
              onClick={() => setSelectedTask(task)}
              className="flex items-center justify-between rounded border border-gray-100 bg-gray-50 p-2 text-sm cursor-pointer hover:bg-gray-100"
            >
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-700">{task.title}</span>
                <span className="text-gray-400">#{task._id.slice(-4)}</span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`rounded px-1.5 py-0.5 text-xs ${
                    task.priority === "high"
                      ? "bg-red-100 text-red-700"
                      : task.priority === "medium"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {task.priority}
                </span>
                <div className="h-6 w-6 rounded-full bg-gray-200" />
              </div>
            </div>
          ))
        )}
      </div>

      {selectedTask && (
        <TaskDetailDialog
          task={selectedTask}
          open={!!selectedTask}
          onOpenChange={(open) => !open && setSelectedTask(null)}
          sprints={allSprints}
        />
      )}

      <ReleaseNotesDialog
        sprintId={sprint._id}
        sprintName={sprint.name}
        open={showReleaseNotes}
        onOpenChange={setShowReleaseNotes}
      />
    </div>
  );
}
