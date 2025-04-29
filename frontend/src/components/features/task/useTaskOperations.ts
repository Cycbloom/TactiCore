import { useCallback } from 'react';

import { taskApi } from '@/services/api/taskApi';
import useTaskStore from '@/store/taskStore';
import { useHistoryStore, toHistoryTaskData } from '@/store/historyStore';
import { Task, TaskFormData, TaskStatus, ROOT_TASK_ID } from '@/types/task';

export const useTaskOperations = () => {
  const { loading, error, setLoading, setError, addTask, updateTask, deleteTask, getTaskByPath } =
    useTaskStore();
  const { addOperation } = useHistoryStore();

  const handleCreateTask = useCallback(
    async (formData: TaskFormData, parentTaskId?: string) => {
      try {
        setLoading(true);
        const newTask = await taskApi.createTask({
          ...formData,
          parentId: parentTaskId || ROOT_TASK_ID
        });
        addTask(newTask);
        addOperation({
          type: 'create',
          task: toHistoryTaskData(newTask)
        });
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : '创建任务失败');
        return false;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError, addTask, addOperation]
  );

  const handleEditTask = useCallback(
    async (task: Task, formData: TaskFormData) => {
      try {
        setLoading(true);
        const updatedTask = await taskApi.updateTask(task.id, formData);
        updateTask(updatedTask);
        addOperation({
          type: 'update',
          task: toHistoryTaskData(updatedTask),
          oldTask: toHistoryTaskData(task)
        });
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : '更新任务失败');
        return false;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError, updateTask, addOperation]
  );

  const handleDeleteTask = useCallback(
    async (taskPath: string[]) => {
      try {
        setLoading(true);
        const taskId = taskPath[taskPath.length - 1];
        const taskToDelete = getTaskByPath(taskPath);
        if (!taskToDelete) return false;

        await taskApi.deleteTask(taskId);
        deleteTask(taskPath);
        addOperation({
          type: 'delete',
          task: toHistoryTaskData(taskToDelete)
        });
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : '删除任务失败');
        return false;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError, deleteTask, getTaskByPath, addOperation]
  );

  const handleToggleStatus = useCallback(
    async (taskPath: string[], newStatus: TaskStatus) => {
      try {
        setLoading(true);
        const taskId = taskPath[taskPath.length - 1];
        const taskToUpdate = getTaskByPath(taskPath);
        if (!taskToUpdate) return false;

        const updatedTask = await taskApi.updateTask(taskId, { status: newStatus });
        updateTask(updatedTask);
        addOperation({
          type: 'update',
          task: toHistoryTaskData(updatedTask),
          oldTask: toHistoryTaskData(taskToUpdate)
        });
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : '更新任务状态失败');
        return false;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError, updateTask, getTaskByPath, addOperation]
  );

  const handleMoveTask = useCallback(
    async (taskPath: string[], newTaskPath: string[]) => {
      try {
        setLoading(true);
        const taskId = taskPath[taskPath.length - 1];
        const newTaskId =
          newTaskPath.length > 0 ? newTaskPath[newTaskPath.length - 1] : ROOT_TASK_ID;
        const taskToMove = getTaskByPath(taskPath);
        if (!taskToMove) return false;

        // 检查是否尝试将任务移动到自身
        if (taskId === newTaskId) {
          setError('不能将任务移动到自身');
          return false;
        }

        // 检查是否尝试将任务移动到其子任务
        if (newTaskPath.includes(taskId)) {
          setError('不能将任务移动到其子任务中');
          return false;
        }

        const updatedTask = await taskApi.updateTask(taskId, { parentId: newTaskId });
        deleteTask(taskPath);
        addTask(updatedTask);
        addOperation({
          type: 'move',
          task: toHistoryTaskData(updatedTask),
          oldTask: toHistoryTaskData(taskToMove)
        });
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : '移动任务失败');
        return false;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError, deleteTask, addTask, getTaskByPath, addOperation]
  );

  return {
    loading,
    error,
    handleCreateTask,
    handleEditTask,
    handleDeleteTask,
    handleToggleStatus,
    handleMoveTask
  };
};
