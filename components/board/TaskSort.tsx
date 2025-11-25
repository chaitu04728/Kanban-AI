"use client";

import { ArrowUpDown, Calendar, Flag, User } from "lucide-react";
import { Task } from "@/types";

type SortOption = "priority" | "dueDate" | "assignee" | "createdAt";

interface TaskSortProps {
  onSort: (sortBy: SortOption, direction: "asc" | "desc") => void;
}

export function TaskSort({ onSort }: TaskSortProps) {
  const sortOptions = [
    { value: "priority", label: "Priority", icon: Flag },
    { value: "dueDate", label: "Due Date", icon: Calendar },
    { value: "assignee", label: "Assignee", icon: User },
    { value: "createdAt", label: "Created", icon: Calendar },
  ];

  return (
    <div className="flex items-center gap-2">
      <ArrowUpDown className="h-4 w-4 text-gray-500" />
      <select
        onChange={(e) => {
          const [sortBy, direction] = e.target.value.split("-") as [
            SortOption,
            "asc" | "desc"
          ];
          onSort(sortBy, direction);
        }}
        className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
      >
        <option value="">Sort by...</option>
        {sortOptions.map((option) => (
          <optgroup key={option.value} label={option.label}>
            <option value={`${option.value}-asc`}>
              {option.label} (Low to High)
            </option>
            <option value={`${option.value}-desc`}>
              {option.label} (High to Low)
            </option>
          </optgroup>
        ))}
      </select>
    </div>
  );
}

export function sortTasks(
  tasks: Task[],
  sortBy: SortOption,
  direction: "asc" | "desc"
): Task[] {
  const sorted = [...tasks].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case "priority":
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
        break;
      case "dueDate":
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        comparison =
          new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        break;
      case "assignee":
        comparison = (a.assignee || "").localeCompare(b.assignee || "");
        break;
      case "createdAt":
        comparison =
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        break;
    }

    return direction === "asc" ? comparison : -comparison;
  });

  return sorted;
}
