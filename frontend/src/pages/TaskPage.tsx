import React, { useEffect } from 'react';
import { Box, Container, Typography } from '@mui/material';

import useTaskStore from '../store/taskStore';
import { taskApi } from '../services/api/taskApi';

import { TaskList } from '@/components/features/task';
import { Task, TaskFormData, FilterFormData } from '@/types/task';

const TaskPage: React.FC = () => {
  const {
    tasks,
    loading,
    error,
    filters,
    setTasks,
    setLoading,
    setError,
    setFilters,
    addTask,
    updateTask,
    deleteTask
  } = useTaskStore();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const data = await taskApi.getTasks(filters as FilterFormData);
        setTasks(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : '获取任务失败');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [filters, setTasks, setLoading, setError]);

  const handleFilterChange = (newFilters: FilterFormData) => {
    setFilters(newFilters);
  };

  const handleEditTask = async (task: Task) => {
    try {
      setLoading(true);
      const updatedTask = await taskApi.updateTask(task.id, task);
      updateTask(updatedTask);
    } catch (err) {
      setError(err instanceof Error ? err.message : '更新任务失败');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      setLoading(true);
      await taskApi.deleteTask(taskId);
      deleteTask(taskId);
    } catch (err) {
      setError(err instanceof Error ? err.message : '删除任务失败');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (taskId: string) => {
    try {
      setLoading(true);
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;

      const newStatus = task.status === 'completed' ? 'todo' : 'completed';
      const updatedTask = await taskApi.updateTask(taskId, { ...task, status: newStatus });
      updateTask(updatedTask);
    } catch (err) {
      setError(err instanceof Error ? err.message : '更新任务状态失败');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (formData: TaskFormData) => {
    try {
      setLoading(true);
      const newTask = await taskApi.createTask(formData);
      addTask(newTask);
    } catch (err) {
      setError(err instanceof Error ? err.message : '创建任务失败');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Typography>加载中...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          任务管理
        </Typography>
        <TaskList
          tasks={tasks}
          filters={filters as FilterFormData}
          onFilterChange={handleFilterChange}
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteTask}
          onToggleStatus={handleToggleStatus}
          onCreateTask={handleCreateTask}
        />
      </Box>
    </Container>
  );
};

export default TaskPage;
