"use client";

import { useState, useRef, useEffect } from "react";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { Column } from "./Column";
import { Board, Task, Sprint } from "@/types";
import { TaskSearchFilter } from "./TaskSearchFilter";
import { QuickAddTaskDialog } from "./QuickAddTaskDialog";
import { KeyboardShortcutsDialog } from "../KeyboardShortcutsDialog";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { TaskSort, sortTasks } from "./TaskSort";
import { Archive } from "lucide-react";

interface BoardViewProps {
  board: Board;
  initialTasks: Task[];
  sprints?: Sprint[];
}

export function BoardView({
  board,
  initialTasks,
  sprints = [],
}: BoardViewProps) {
  const activeTasks = initialTasks.filter((task) => !task.archived);
  const [tasks, setTasks] = useState<Task[]>(activeTasks);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>(activeTasks);
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const [sortConfig, setSortConfig] = useState<{
    sortBy: any;
    direction: "asc" | "desc";
  } | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Sync state when initialTasks prop changes (after router.refresh())
  useEffect(() => {
    const newActiveTasks = initialTasks.filter((task) => !task.archived);
    if (showArchived) {
      setTasks(initialTasks);
    } else {
      setTasks(newActiveTasks);
    }
    // Don't reset filteredTasks here - let TaskSearchFilter handle it
  }, [initialTasks, showArchived]);

  const handleSort = (sortBy: any, direction: "asc" | "desc") => {
    setSortConfig({ sortBy, direction });
    const sorted = sortTasks(filteredTasks, sortBy, direction);
    setFilteredTasks(sorted);
  };

  const toggleArchived = () => {
    setShowArchived(!showArchived);
    if (!showArchived) {
      setTasks(initialTasks);
      setFilteredTasks(initialTasks);
    } else {
      setTasks(activeTasks);
      setFilteredTasks(activeTasks);
    }
  };

  // Keyboard shortcuts
  useKeyboardShortcuts([
    {
      key: "n",
      callback: () => setQuickAddOpen(true),
      description: "Create new task",
    },
    {
      key: "/",
      callback: () => {
        const searchInput = document.querySelector(
          'input[placeholder="Search tasks..."]'
        ) as HTMLInputElement;
        searchInput?.focus();
      },
      description: "Focus search",
    },
    {
      key: "Escape",
      callback: () => setQuickAddOpen(false),
      description: "Close dialog",
    },
  ]);

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return; // No change
    }

    // Store original state for rollback
    const originalTasks = tasks;
    const originalFilteredTasks = filteredTasks;

    // Optimistic update - immediately update the UI
    const updatedTasks = tasks.map((t) =>
      t._id === draggableId ? { ...t, status: destination.droppableId } : t
    );

    const updatedFilteredTasks = filteredTasks.map((t) =>
      t._id === draggableId ? { ...t, status: destination.droppableId } : t
    );

    setTasks(updatedTasks);
    setFilteredTasks(updatedFilteredTasks);

    // API Call
    try {
      const response = await fetch(`/api/tasks/${draggableId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: destination.droppableId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update task");
      }
    } catch (error) {
      console.error("Failed to update task", error);
      // Rollback on error
      setTasks(originalTasks);
      setFilteredTasks(originalFilteredTasks);
    }
  };

  return (
    <div className="flex h-full flex-col space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <TaskSearchFilter
            tasks={tasks}
            onFilteredTasksChange={setFilteredTasks}
          />
        </div>
        <div className="ml-4 flex items-center gap-3">
          <TaskSort onSort={handleSort} />
          <button
            onClick={toggleArchived}
            className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
              showArchived
                ? "border-blue-500 bg-blue-50 text-blue-700"
                : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Archive className="h-4 w-4" />
            {showArchived ? "Hide Archived" : "Show Archived"}
          </button>
        </div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex flex-1 gap-4">
          {board.columns.map((column) => {
            const columnTasks = filteredTasks.filter(
              (task) => task.status === column.id
            );
            return (
              <Column
                key={column.id}
                id={column.id}
                title={column.title}
                tasks={columnTasks}
                boardId={board._id}
                sprints={sprints}
              />
            );
          })}
        </div>
      </DragDropContext>

      <QuickAddTaskDialog
        boardId={board._id}
        open={quickAddOpen}
        onOpenChange={setQuickAddOpen}
      />

      <KeyboardShortcutsDialog />
    </div>
  );
}
