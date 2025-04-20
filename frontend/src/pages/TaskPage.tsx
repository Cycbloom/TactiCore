import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Dialog, CircularProgress } from '@mui/material';

import useTaskStore from '../store/taskStore';
import { taskApi } from '../services/api/taskApi';

import TaskListHeader from '@/components/features/task/TaskListHeader';
import TaskListContent from '@/components/features/task/TaskListContent';
import TaskForm from '@/components/features/task/TaskForm';
import { Task, TaskFormData, FilterFormData } from '@/types/task';
import { ProtectedRoute } from '@/contexts';

const TaskPage: React.FC = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
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
      setIsCreateDialogOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : '创建任务失败');
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          任务管理
        </Typography>

        <TaskListHeader
          filters={filters as FilterFormData}
          onFilterChange={handleFilterChange}
          onCreateClick={() => setIsCreateDialogOpen(true)}
        />

        <Box sx={{ position: 'relative' }}>
          {loading && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                zIndex: 1
              }}
            >
              <CircularProgress />
            </Box>
          )}
          <ProtectedRoute showLoading={false}>
            <TaskListContent
              tasks={tasks}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
              onToggleStatus={handleToggleStatus}
            />
          </ProtectedRoute>
        </Box>

        <Dialog
          open={isCreateDialogOpen}
          onClose={() => setIsCreateDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <Box sx={{ p: 3 }}>
            <TaskForm onSubmit={handleCreateTask} onCancel={() => setIsCreateDialogOpen(false)} />
          </Box>
        </Dialog>
      </Box>
    </Container>
  );
};

export default TaskPage;
