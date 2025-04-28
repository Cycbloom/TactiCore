import { create } from 'zustand';

import useTaskStore from './taskStore';

import { Task, TaskFormData } from '@/types/task';
import { taskApi } from '@/services/api/taskApi';

// 定义操作类型
type OperationType = 'create' | 'update' | 'delete' | 'move';

// 定义历史记录中保存的任务数据
interface HistoryTaskData {
  id: string;
  formData: TaskFormData;
  path: string[]; // 添加 path 字段
}

// 定义操作命令接口
interface Operation {
  type: OperationType;
  task: HistoryTaskData;
  oldTask?: HistoryTaskData; // 用于 update 和 move 操作
}

// 从 Task 转换为 HistoryTaskData
export const toHistoryTaskData = (task: Task): HistoryTaskData => {
  return {
    id: task.id,
    formData: {
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate,
      tags: task.tags,
      parentId: task.parentId
    },
    path: task.path
  };
};

interface HistoryState {
  past: Operation[];
  future: Operation[];
  canUndo: boolean;
  canRedo: boolean;
  addOperation: (operation: Operation) => void;
  undo: () => Promise<void>;
  redo: () => Promise<void>;
  clearHistory: () => void;
}

export const useHistoryStore = create<HistoryState>((set, get) => ({
  past: [],
  future: [],
  canUndo: false,
  canRedo: false,
  addOperation: operation =>
    set(state => ({
      past: [...state.past, operation],
      future: [],
      canUndo: true,
      canRedo: false
    })),
  undo: async () => {
    const state = get();
    if (state.past.length === 0) return;

    try {
      const operation = state.past[state.past.length - 1];
      const newPast = state.past.slice(0, -1);
      let newTask;

      // 反向执行操作
      switch (operation.type) {
        case 'create':
          await taskApi.deleteTask(operation.task.id);
          useTaskStore.getState().deleteTask(operation.task.path);
          break;
        case 'update':
          if (operation.oldTask) {
            const updatedTask = await taskApi.updateTask(
              operation.task.id,
              operation.oldTask.formData
            );
            useTaskStore.getState().updateTask(updatedTask);
          }
          break;
        case 'delete':
          newTask = await taskApi.createTask(operation.task.formData);
          // 更新历史记录中的 id
          operation.task.id = newTask.id;
          useTaskStore.getState().addTask(newTask);
          break;
        case 'move':
          if (operation.oldTask?.formData.parentId) {
            const movedTask = await taskApi.updateTask(operation.task.id, {
              parentId: operation.oldTask.formData.parentId
            });
            useTaskStore.getState().updateTask(movedTask);
          }
          break;
      }

      set({
        past: newPast,
        future: [operation, ...state.future],
        canUndo: newPast.length > 0,
        canRedo: true
      });
    } catch (error) {
      console.error('撤销操作失败:', error);
      throw error;
    }
  },
  redo: async () => {
    const state = get();
    if (state.future.length === 0) return;

    try {
      const operation = state.future[0];
      const newFuture = state.future.slice(1);
      let newTask;
      let updatedTask;
      let movedTask;

      // 重新执行操作
      switch (operation.type) {
        case 'create':
          newTask = await taskApi.createTask(operation.task.formData);
          // 更新历史记录中的 id
          operation.task.id = newTask.id;
          useTaskStore.getState().addTask(newTask);
          break;
        case 'update':
          updatedTask = await taskApi.updateTask(operation.task.id, operation.task.formData);
          useTaskStore.getState().updateTask(updatedTask);
          break;
        case 'delete':
          await taskApi.deleteTask(operation.task.id);
          useTaskStore.getState().deleteTask(operation.task.path);
          break;
        case 'move':
          if (operation.task?.formData.parentId) {
            movedTask = await taskApi.updateTask(operation.task.id, {
              parentId: operation.task.formData.parentId
            });
            useTaskStore.getState().updateTask(movedTask);
          }
          break;
      }

      set({
        past: [...state.past, operation],
        future: newFuture,
        canUndo: true,
        canRedo: newFuture.length > 0
      });
    } catch (error) {
      console.error('重做操作失败:', error);
      throw error;
    }
  },
  clearHistory: () =>
    set({
      past: [],
      future: [],
      canUndo: false,
      canRedo: false
    })
}));
