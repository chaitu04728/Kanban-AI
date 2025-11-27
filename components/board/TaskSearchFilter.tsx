"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Filter, X, ChevronDown } from "lucide-react";
import { Task } from "@/types";

interface TaskSearchFilterProps {
  tasks: Task[];
  onFilteredTasksChange: (tasks: Task[]) => void;
}

export function TaskSearchFilter({
  tasks,
  onFilteredTasksChange,
}: TaskSearchFilterProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    priority: [] as string[],
    status: [] as string[],
    assignee: [] as string[],
    labels: [] as string[],
  });

  const applyFilters = useCallback(
    (search: string, currentFilters: typeof filters) => {
      let filtered = tasks;

      // Search filter
      if (search) {
        filtered = filtered.filter(
          (task) =>
            task.title.toLowerCase().includes(search.toLowerCase()) ||
            task.description?.toLowerCase().includes(search.toLowerCase())
        );
      }

      // Priority filter
      if (currentFilters.priority.length > 0) {
        filtered = filtered.filter((task) =>
          currentFilters.priority.includes(task.priority)
        );
      }

      // Status filter
      if (currentFilters.status.length > 0) {
        filtered = filtered.filter((task) =>
          currentFilters.status.includes(task.status)
        );
      }

      // Assignee filter
      if (currentFilters.assignee.length > 0) {
        filtered = filtered.filter((task) =>
          task.assignee
            ? currentFilters.assignee.includes(task.assignee)
            : currentFilters.assignee.includes("unassigned")
        );
      }

      onFilteredTasksChange(filtered);
    },
    [tasks, onFilteredTasksChange]
  );

  // Reapply filters when tasks prop changes (new tasks added)
  useEffect(() => {
    applyFilters(searchTerm, filters);
  }, [tasks, applyFilters, searchTerm, filters]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    applyFilters(value, filters);
  };

  const toggleFilter = (filterType: keyof typeof filters, value: string) => {
    const newFilters = { ...filters };
    const currentFilters = newFilters[filterType];

    if (currentFilters.includes(value)) {
      newFilters[filterType] = currentFilters.filter((v) => v !== value);
    } else {
      newFilters[filterType] = [...currentFilters, value];
    }

    setFilters(newFilters);
    applyFilters(searchTerm, newFilters);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilters({
      priority: [],
      status: [],
      assignee: [],
      labels: [],
    });
    onFilteredTasksChange(tasks);
  };

  const activeFilterCount =
    filters.priority.length +
    filters.status.length +
    filters.assignee.length +
    filters.labels.length;

  return (
    <div className="mb-6 space-y-3">
      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="text-gray-500 w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-9 text-sm shadow-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        />
        {searchTerm && (
          <button
            onClick={() => handleSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Filter Toggle */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          <Filter className="h-4 w-4" />
          Filters
          {activeFilterCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-500 px-1.5 text-xs font-semibold text-white">
              {activeFilterCount}
            </span>
          )}
          <ChevronDown
            className={`h-4 w-4 transition-transform ${
              showFilters ? "rotate-180" : ""
            }`}
          />
        </button>

        {activeFilterCount > 0 && (
          <button
            onClick={clearFilters}
            className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Filter Options */}
      {showFilters && (
        <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          {/* Priority Filter */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-gray-900">
              Priority
            </h4>
            <div className="flex flex-wrap gap-2">
              {["low", "medium", "high"].map((priority) => (
                <button
                  key={priority}
                  onClick={() => toggleFilter("priority", priority)}
                  className={`rounded-md border px-4 py-2 text-sm font-medium capitalize transition-all ${
                    filters.priority.includes(priority)
                      ? "border-blue-500 bg-blue-500 text-white shadow-sm"
                      : "border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50"
                  }`}
                >
                  {priority}
                </button>
              ))}
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-gray-900">Status</h4>
            <div className="flex flex-wrap gap-2">
              {["todo", "in-progress", "done"].map((status) => (
                <button
                  key={status}
                  onClick={() => toggleFilter("status", status)}
                  className={`rounded-md border px-4 py-2 text-sm font-medium capitalize transition-all ${
                    filters.status.includes(status)
                      ? "border-blue-500 bg-blue-500 text-white shadow-sm"
                      : "border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50"
                  }`}
                >
                  {status.replace("-", " ")}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
