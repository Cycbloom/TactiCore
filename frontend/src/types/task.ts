import * as z from 'zod';

import { SelectOption } from '@/components/common/form-controls';

export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'inProgress',
  COMPLETED = 'completed'
}

export enum TaskPriority {
  URGENT = 'urgent', // 紧急
  HIGH = 'high', // 高
  MEDIUM = 'medium', // 中
  LOW = 'low', // 低
  MINIMAL = 'minimal' // 最低
}

export const ROOT_TASK_ID = '00000000-0000-0000-0000-000000000000';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  priorityScore: number; // 优先级分数（0-100）
  estimatedHours?: number; // 预计完成时间（小时）
  actualHours?: number; // 实际完成时间（小时）
  dueDate?: Date;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  parentId?: string;
  children?: Task[];
  order: number;
  path: string[];
  isRoot: boolean;
  lastPostponed?: Date; // 最后推迟时间
  postponeCount: number; // 推迟次数
  isUrgent: boolean; // 是否紧急
  dependencies: string[]; // 依赖的任务ID
  isBlocked: boolean; // 是否被阻塞
}

// 状态选项
export const statusOptions = [
  { value: 'todo', label: '待办' },
  { value: 'inProgress', label: '进行中' },
  { value: 'completed', label: '已完成' }
] as SelectOption[];

// 优先级选项
export const priorityOptions = [
  { value: 'urgent', label: '紧急', color: '#ff4d4f' },
  { value: 'high', label: '高', color: '#ff7a45' },
  { value: 'medium', label: '中', color: '#faad14' },
  { value: 'low', label: '低', color: '#52c41a' },
  { value: 'minimal', label: '最低', color: '#1890ff' }
] as const;

export type PriorityKey = (typeof priorityOptions)[number]['value'];

// 表单数据类型
export const taskSchema = z.object({
  title: z.string().min(1, '标题不能为空'),
  description: z.string().optional(),
  status: z.enum(['todo', 'inProgress', 'completed']),
  priority: z.enum(['urgent', 'high', 'medium', 'low', 'minimal']),
  priorityScore: z.number().min(0).max(100),
  estimatedHours: z.number().min(0).optional(),
  actualHours: z.number().min(0).optional(),
  dueDate: z.date().optional(),
  tags: z.array(z.string()).optional(),
  parentId: z.string().optional(),
  dependencies: z.array(z.string()).optional()
});

export type TaskFormData = z.infer<typeof taskSchema>;

export type FilterFormData = {
  search: string;
  status: 'all' | 'todo' | 'inProgress' | 'completed';
  priority: 'all' | 'urgent' | 'high' | 'medium' | 'low' | 'minimal';
};

export const filterSchema = z.object({
  search: z.string(),
  status: z.enum(['all', 'todo', 'inProgress', 'completed']),
  priority: z.enum(['all', 'urgent', 'high', 'medium', 'low', 'minimal'])
}) as z.ZodType<FilterFormData>;

export const statusOptionsWithAll: SelectOption[] = [
  { value: 'all', label: '全部状态' },
  { value: 'todo', label: '待办' },
  { value: 'inProgress', label: '进行中' },
  { value: 'completed', label: '已完成' }
];

export const priorityOptionsWithAll: SelectOption[] = [
  { value: 'all', label: '全部优先级' },
  { value: 'urgent', label: '紧急' },
  { value: 'high', label: '高' },
  { value: 'medium', label: '中' },
  { value: 'low', label: '低' },
  { value: 'minimal', label: '最低' }
];
