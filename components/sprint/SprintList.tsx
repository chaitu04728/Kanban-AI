"use client";

import { Sprint, Task } from "@/types";
import { SprintItem } from "./SprintItem";
import { CreateSprintDialog } from "./CreateSprintDialog";
import { useState } from "react";

interface SprintListProps {
  boardId: string;
  sprints: Sprint[];
  tasks: Task[];
}

export function SprintList({ boardId, sprints, tasks }: SprintListProps) {
  const [editingSprint, setEditingSprint] = useState<Sprint | null>(null);

  // Group tasks by sprint
  const tasksBySprint = tasks.reduce((acc, task) => {
    if (task.sprintId) {
      if (!acc[task.sprintId]) {
        acc[task.sprintId] = [];
      }
      acc[task.sprintId].push(task);
    }
    return acc;
  }, {} as Record<string, Task[]>);

  // Sort sprints: active first, then planned by date
  const sortedSprints = [...sprints].sort((a, b) => {
    if (a.status === "active") return -1;
    if (b.status === "active") return 1;
    if (a.status === "completed" && b.status !== "completed") return 1;
    if (b.status === "completed" && a.status !== "completed") return -1;
    return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Sprints</h2>
        <CreateSprintDialog boardId={boardId} />
      </div>

      <div className="space-y-4">
        {sortedSprints.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-200 p-8 text-center">
            <h3 className="text-sm font-medium text-gray-900">
              No sprints yet
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Create a sprint to start planning your work.
            </p>
          </div>
        ) : (
          sortedSprints.map((sprint) => (
            <SprintItem
              key={sprint._id}
              sprint={sprint}
              tasks={tasksBySprint[sprint._id] || []}
              onEdit={setEditingSprint}
              allSprints={sprints}
            />
          ))
        )}
      </div>
    </div>
  );
}
