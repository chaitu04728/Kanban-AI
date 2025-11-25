export interface Task {
  _id: string;
  title: string;
  description?: string;
  status: string;
  priority: "low" | "medium" | "high";
  boardId: string;
  assignee?: string;
  sprintId?: string;
  storyPoints?: number;
  dueDate?: string;
  labels: string[];
  subtasks: {
    id: string;
    title: string;
    completed: boolean;
  }[];
  order: number;
  archived?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Board {
  _id: string;
  title: string;
  owner: string;
  columns: {
    id: string;
    title: string;
    order: number;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface Sprint {
  _id: string;
  name: string;
  goal?: string;
  startDate: string;
  endDate: string;
  status: "planned" | "active" | "completed";
  boardId: string;
  createdAt: string;
  updatedAt: string;
}
