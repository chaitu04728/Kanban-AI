"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Task, Sprint } from "@/types";
import { Sparkles, CheckSquare, AlignLeft, Calendar, Tag, User as UserIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface TaskDetailDialogProps {
  task: Task;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sprints?: Sprint[];
}

export function TaskDetailDialog({
  task,
  open,
  onOpenChange,
  sprints = [],
}: TaskDetailDialogProps) {
  const router = useRouter();
  const [description, setDescription] = useState(task.description || "");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [subtasks, setSubtasks] = useState(task.subtasks || []);
  const [sprintId, setSprintId] = useState(task.sprintId || "");
  const [users, setUsers] = useState<User[]>([]);
  const [assigneeId, setAssigneeId] = useState(task.assignee || "");

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch("/api/users");
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        }
      } catch (error) {
        console.error("Failed to fetch users", error);
      }
    }
    fetchUsers();
  }, []);

  const handleAssigneeChange = async (newAssigneeId: string) => {
    setAssigneeId(newAssigneeId);
    try {
      await fetch(`/api/tasks/${task._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignee: newAssigneeId || null }),
      });
      router.refresh();
    } catch (error) {
      console.error("Failed to update assignee", error);
    }
  };

  const handleSprintChange = async (newSprintId: string) => {
    setSprintId(newSprintId);
    try {
      await fetch(`/api/tasks/${task._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sprintId: newSprintId || null }),
      });
      router.refresh();
    } catch (error) {
      console.error("Failed to update sprint", error);
    }
  };

  const handleSaveDescription = async () => {
    try {
      await fetch(`/api/tasks/${task._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description }),
      });
      router.refresh();
    } catch (error) {
      console.error("Failed to save description", error);
    }
  };

  const handleAiImproveDescription = async () => {
    setIsAiLoading(true);
    try {
      const res = await fetch(`/api/ai/tasks/${task._id}/improve-description`, {
        method: "POST",
      });
      const data = await res.json();
      if (data.suggestion) {
        setDescription(data.suggestion);
      }
    } catch (error) {
      console.error("AI Error", error);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleAiGenerateSubtasks = async () => {
    setIsAiLoading(true);
    try {
      const res = await fetch(`/api/ai/tasks/${task._id}/generate-subtasks`, {
        method: "POST",
      });
      const data = await res.json();
      if (data.subtasks && Array.isArray(data.subtasks)) {
        const newSubtasks = data.subtasks.map((title: string) => ({
          id: crypto.randomUUID(),
          title,
          completed: false,
        }));
        setSubtasks([...subtasks, ...newSubtasks]);

        // Save to DB
        await fetch(`/api/tasks/${task._id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ subtasks: [...subtasks, ...newSubtasks] }),
        });
        router.refresh();
      }
    } catch (error) {
      console.error("AI Error", error);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl gap-0 p-0 sm:max-h-[85vh] overflow-hidden flex flex-col">
        <div className="p-6 pb-4 border-b">
          <DialogHeader>
            <DialogTitle className="text-xl">{task.title}</DialogTitle>
            <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
              <span className="px-2 py-1 rounded bg-gray-100">
                {task.status}
              </span>
              <span
                className={cn(
                  "px-2 py-1 rounded",
                  task.priority === "high"
                    ? "bg-red-100 text-red-700"
                    : task.priority === "medium"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-green-100 text-green-700"
                )}
              >
                {task.priority}
              </span>
            </div>
          </DialogHeader>
        </div>

        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-8">
            {/* Description Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="flex items-center gap-2 font-semibold text-gray-900">
                  <AlignLeft className="h-5 w-5 text-gray-500" />
                  Description
                </h3>
                <button
                  onClick={handleAiImproveDescription}
                  disabled={isAiLoading}
                  className="flex items-center gap-1.5 text-xs font-medium text-purple-600 hover:text-purple-700 disabled:opacity-50"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  AI Improve
                </button>
              </div>
              <div className="relative">
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  onBlur={handleSaveDescription}
                  className="text-gray-900 w-full min-h-[120px] rounded-md border border-gray-300 p-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="Add a more detailed description..."
                />
              </div>
            </div>

            {/* Subtasks Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="flex items-center gap-2 font-semibold text-gray-900">
                  <CheckSquare className="h-5 w-5 text-gray-500" />
                  Subtasks
                </h3>
                <button
                  onClick={handleAiGenerateSubtasks}
                  disabled={isAiLoading}
                  className="flex items-center gap-1.5 text-xs font-medium text-purple-600 hover:text-purple-700 disabled:opacity-50"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  AI Generate
                </button>
              </div>

              <div className="space-y-2">
                {subtasks.map((subtask) => (
                  <div
                    key={subtask.id}
                    className="flex items-center gap-3 group"
                  >
                    <input
                      type="checkbox"
                      checked={subtask.completed}
                      onChange={() => {
                        // Toggle logic here
                      }}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                    />
                    <span
                      className={cn(
                        "text-sm",
                        subtask.completed && "line-through text-gray-500"
                      )}
                    >
                      {subtask.title}
                    </span>
                  </div>
                ))}
                {subtasks.length === 0 && (
                  <p className="text-sm text-gray-500 italic">
                    No subtasks yet.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-gray-500 uppercase">
                Details
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Assignee</span>
                  <select
                    value={assigneeId}
                    onChange={(e) => handleAssigneeChange(e.target.value)}
                    className="max-w-[150px] rounded border-none bg-transparent text-right text-sm font-medium text-gray-900 focus:ring-0"
                  >
                    <option value="">Unassigned</option>
                    {users.map((user) => (
                      <option key={user._id} value={user._id}>
                        {user.name}
                      </option>
                    ))}
                  </select>
                </div>                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Sprint</span>
                  <select
                    value={sprintId}
                    onChange={(e) => handleSprintChange(e.target.value)}
                    className="max-w-[150px] rounded border-none bg-transparent text-right text-sm font-medium text-gray-900 focus:ring-0"
                  >
                    <option value="">No Sprint</option>
                    {sprints.map((sprint) => (
                      <option key={sprint._id} value={sprint._id}>
                        {sprint.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Due Date</span>
                  <span className="text-gray-900">
                    {task.dueDate
                      ? new Date(task.dueDate).toLocaleDateString()
                      : "-"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Story Points</span>
                  <span className="text-gray-900">
                    {task.storyPoints || "-"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
