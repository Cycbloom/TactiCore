import * as z from 'zod';

import { SelectOption } from '@/components/ui/common/form-controls';

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

// 状态选项
export const statusOptions = [
  { value: 'todo', label: '待办' },
  { value: 'inProgress', label: '进行中' },
  { value: 'completed', label: '已完成' }
] as SelectOption[];

// 优先级选项
export const priorityOptions = [
  { value: 'low', label: '低' },
  { value: 'medium', label: '中' },
  { value: 'high', label: '高' }
] as const;

export type PriorityKey = (typeof priorityOptions)[number]['value'];

// 标签类型
export interface Tag {
  id: string;
  name: string;
  color?: string;
}

// 表单数据类型
export const taskSchema = z.object({
  title: z.string().min(1, '标题不能为空'),
  description: z.string().optional(),
  status: z.enum(['todo', 'inProgress', 'completed']),
  priority: z.enum(['low', 'medium', 'high']),
  dueDate: z.date().optional(),
  tags: z.array(z.string()).optional()
});

export type TaskFormData = z.infer<typeof taskSchema>;
