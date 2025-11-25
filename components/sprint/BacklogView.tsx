"use client";

import { Sprint, Task } from "@/types";
import { SprintList } from "./SprintList";
import { CreateTaskDialog } from "@/components/board/CreateTaskDialog";
import { TaskDetailDialog } from "@/components/board/TaskDetailDialog";
import { useState } from "react";

interface BacklogViewProps {
  boardId: string;
  sprints: Sprint[];
  tasks: Task[];
}

export function BacklogView({ boardId, sprints, tasks }: BacklogViewProps) {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const backlogTasks = tasks.filter((t) => !t.sprintId);

  return (
    <div className="h-full overflow-y-auto p-1">
      <SprintList boardId={boardId} sprints={sprints} tasks={tasks} />

      <div className="mt-8 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-gray-900">Backlog</h2>
            <span className="text-sm text-gray-500">
              {backlogTasks.length} issues
            </span>
          </div>
          <CreateTaskDialog boardId={boardId} />
        </div>

        <div className="mt-4 space-y-2">
          {backlogTasks.length === 0 ? (
            <div className="rounded border border-dashed border-gray-200 p-4 text-center text-sm text-gray-500">
              Your backlog is empty
            </div>
          ) : (
            backlogTasks.map((task) => (
              <div
                key={task._id}
                onClick={() => setSelectedTask(task)}
                className="flex items-center justify-between rounded border border-gray-100 bg-gray-50 p-2 text-sm hover:bg-gray-100 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-700">
                    {task.title}
                  </span>
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
      </div>

      {selectedTask && (
        <TaskDetailDialog
          task={selectedTask}
          open={!!selectedTask}
          onOpenChange={(open) => !open && setSelectedTask(null)}
          sprints={sprints}
        />
      )}
    </div>
  );
}
