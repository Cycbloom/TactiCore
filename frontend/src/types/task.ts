import * as z from 'zod';

import { SelectOption } from '@/components/common/form-controls';

export type TaskStatus = 'todo' | 'inProgress' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: Date;
  tags?: string[];
  createdAt?: Date;
  updatedAt?: Date;
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

export type FilterFormData = {
  search: string;
  status: 'all' | 'todo' | 'inProgress' | 'completed';
  priority: 'all' | 'high' | 'medium' | 'low';
};

export const filterSchema = z.object({
  search: z.string(),
  status: z.enum(['all', 'todo', 'inProgress', 'completed']),
  priority: z.enum(['all', 'high', 'medium', 'low'])
}) as z.ZodType<FilterFormData>;

export const statusOptionsWithAll: SelectOption[] = [
  { value: 'all', label: '全部状态' },
  { value: 'todo', label: '待办' },
  { value: 'inProgress', label: '进行中' },
  { value: 'completed', label: '已完成' }
];

export const priorityOptionsWithAll: SelectOption[] = [
  { value: 'all', label: '全部优先级' },
  { value: 'high', label: '高' },
  { value: 'medium', label: '中' },
  { value: 'low', label: '低' }
];
