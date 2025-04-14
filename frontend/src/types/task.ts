export type TaskStatus = 'todo' | 'inProgress' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  dueDate?: Date;
  priority: TaskPriority;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskProps {
  task: Task;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onStatusChange?: (id: string, status: TaskStatus) => void;
}
