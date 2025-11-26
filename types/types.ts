
export interface Project {
  id: string;
  name: string;
  description?: string;
  managerId: string;
  createdAt: string;
}

export interface Member {
  id: string;
  email: string;
  role: "pm" | "member";
  projectId: string;
}

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  assignedToEmail: string;
  projectId: string;
  createdAt: string;
}