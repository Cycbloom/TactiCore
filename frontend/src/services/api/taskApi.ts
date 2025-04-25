import { AxiosRequestHeaders } from 'axios';

import request from './request';

import { Task, TaskFormData, FilterFormData } from '@/types/task';

const cleanFilters = (filters: FilterFormData) => {
  const cleaned: Record<string, string> = {};

  if (filters.search && filters.search.trim()) {
    cleaned.search = filters.search.trim();
  }

  if (filters.status && filters.status !== 'all') {
    cleaned.status = filters.status;
  }

  if (filters.priority && filters.priority !== 'all') {
    cleaned.priority = filters.priority;
  }

  return cleaned;
};

export const taskApi = {
  // 获取任务列表
  getTasks: (filters: FilterFormData) => {
    const cleanedFilters = cleanFilters(filters);
    return request.get<Task[]>('/tasks', {
      params: cleanedFilters,
      headers: {
        'Content-Type': 'application/json'
      } as AxiosRequestHeaders
    });
  },

  // 获取单个任务
  getTask: (id: string) => {
    return request.get<Task>(`/tasks/${id}`);
  },

  // 创建任务
  createTask: (taskData: TaskFormData) => {
    return request.post<Task>('/tasks', taskData);
  },

  // 更新任务
  updateTask: (id: string, taskData: Partial<TaskFormData>) => {
    return request.patch<Task>(`/tasks/${id}`, taskData);
  },

  // 删除任务
  deleteTask: (id: string) => {
    return request.delete(`/tasks/${id}`);
  }
};
