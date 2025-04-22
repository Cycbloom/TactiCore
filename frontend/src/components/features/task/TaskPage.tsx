import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Dialog, CircularProgress } from '@mui/material';

import TaskHeader from './TaskHeader';
import TaskList from './TaskList';
import TaskForm from './TaskForm';

import { taskApi } from '@/services/api/taskApi';
import useTaskStore from '@/store/taskStore';
import { Task, TaskFormData, FilterFormData } from '@/types/task';

const TaskPage: React.FC = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [parentTaskId, setParentTaskId] = useState<string | undefined>();
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

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
  };

  const handleCloseEditDialog = () => {
    setEditingTask(null);
    setParentTaskId(undefined);
  };

  const handleSubmitEdit = async (formData: TaskFormData) => {
    if (editingTask) {
      try {
        setLoading(true);
        const updatedTask = await taskApi.updateTask(editingTask.id, formData);
        updateTask(updatedTask);
        handleCloseEditDialog();
      } catch (err) {
        setError(err instanceof Error ? err.message : '更新任务失败');
      } finally {
        setLoading(false);
      }
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
      const updatedTask = await taskApi.updateTask(taskId, { status: newStatus });
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
      const newTask = await taskApi.createTask({
        ...formData,
        parentId: parentTaskId,
        level: parentTaskId ? 1 : 0,
        order: tasks.filter(t => t.parentId === parentTaskId).length
      });
      addTask(newTask);
      setIsCreateDialogOpen(false);
      setParentTaskId(undefined);
    } catch (err) {
      setError(err instanceof Error ? err.message : '创建任务失败');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubtask = (parentId: string) => {
    setParentTaskId(parentId);
    setIsCreateDialogOpen(true);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          任务管理
        </Typography>

        <TaskHeader
          filters={filters as FilterFormData}
          onFilterChange={handleFilterChange}
          onCreateClick={() => {
            setParentTaskId(undefined);
            setIsCreateDialogOpen(true);
          }}
        />

        {error && <Typography color="error">{error}</Typography>}

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
          <TaskList
            tasks={tasks.filter(task => !task.parentId)}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            onToggleStatus={handleToggleStatus}
            onAddSubtask={handleAddSubtask}
          />
        </Box>

        <Dialog
          open={isCreateDialogOpen}
          onClose={() => {
            setIsCreateDialogOpen(false);
            setParentTaskId(undefined);
          }}
          maxWidth="sm"
          fullWidth
        >
          <Box sx={{ p: 3 }}>
            <TaskForm
              onSubmit={handleCreateTask}
              onCancel={() => {
                setIsCreateDialogOpen(false);
                setParentTaskId(undefined);
              }}
              initialData={parentTaskId ? { parentId: parentTaskId } : undefined}
            />
          </Box>
        </Dialog>

        <Dialog open={!!editingTask} onClose={handleCloseEditDialog} maxWidth="sm" fullWidth>
          <Box sx={{ p: 3 }}>
            <TaskForm
              initialData={editingTask || undefined}
              onSubmit={handleSubmitEdit}
              onCancel={handleCloseEditDialog}
            />
          </Box>
        </Dialog>
      </Box>
    </Container>
  );
};

export default TaskPage;
