import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Dialog,
  CircularProgress,
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material';
import ViewListIcon from '@mui/icons-material/ViewList';
import AccountTreeIcon from '@mui/icons-material/AccountTree';

import TaskHeader from './TaskHeader';
import TaskList from './TaskList';
import TaskForm from './TaskForm';
import TaskMindMap from './TaskMindMap';

import { taskApi } from '@/services/api/taskApi';
import useTaskStore from '@/store/taskStore';
import { Task, TaskFormData, FilterFormData, TaskStatus, ROOT_TASK_ID } from '@/types/task';

const TaskPage: React.FC = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [parentTaskId, setParentTaskId] = useState<string | undefined>();
  const [viewMode, setViewMode] = useState<'list' | 'mindmap'>('list');
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

  const handleDeleteTask = async (taskPath: string[]) => {
    try {
      setLoading(true);
      const taskId = taskPath[taskPath.length - 1];
      await taskApi.deleteTask(taskId);
      deleteTask(taskPath);
    } catch (err) {
      setError(err instanceof Error ? err.message : '删除任务失败');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (taskId: string, newStatus: TaskStatus) => {
    try {
      setLoading(true);
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
        parentId: parentTaskId || ROOT_TASK_ID
      });
      addTask(newTask);
    } catch (err) {
      setError(err instanceof Error ? err.message : '创建任务失败');
    } finally {
      setIsCreateDialogOpen(false);
      setParentTaskId(undefined);
      setLoading(false);
    }
  };

  const handleMoveTask = async (taskPath: string[], newTaskPath: string[]) => {
    try {
      setLoading(true);
      const taskId = taskPath[taskPath.length - 1];
      const newTaskId = newTaskPath.length > 0 ? newTaskPath[newTaskPath.length - 1] : ROOT_TASK_ID;

      // 检查是否尝试将任务移动到自身
      if (taskId === newTaskId) {
        setError('不能将任务移动到自身');
        return;
      }

      // 检查是否尝试将任务移动到其子任务
      if (newTaskPath.includes(taskId)) {
        setError('不能将任务移动到其子任务中');
        return;
      }

      const updatedTask = await taskApi.updateTask(taskId, { parentId: newTaskId });
      deleteTask(taskPath);
      addTask(updatedTask);
    } catch (err) {
      setError(err instanceof Error ? err.message : '移动任务失败');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubtask = (parentId: string) => {
    setParentTaskId(parentId);
    setIsCreateDialogOpen(true);
  };

  const handleViewModeChange = (
    _event: React.MouseEvent<HTMLElement>,
    newViewMode: 'list' | 'mindmap'
  ) => {
    if (newViewMode !== null) {
      setViewMode(newViewMode);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          任务管理
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <TaskHeader
            filters={filters as FilterFormData}
            onFilterChange={handleFilterChange}
            onCreateClick={() => {
              setParentTaskId(ROOT_TASK_ID);
              setIsCreateDialogOpen(true);
            }}
          />
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={handleViewModeChange}
            aria-label="视图模式"
          >
            <ToggleButton value="list" aria-label="列表视图">
              <ViewListIcon />
            </ToggleButton>
            <ToggleButton value="mindmap" aria-label="思维导图视图">
              <AccountTreeIcon />
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

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
          {viewMode === 'list' ? (
            <TaskList
              tasks={tasks.filter(task => task.parentId === ROOT_TASK_ID)}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
              onToggleStatus={handleToggleStatus}
              onAddSubtask={handleAddSubtask}
              onMoveTask={handleMoveTask}
            />
          ) : (
            <TaskMindMap
              tasks={tasks}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
              onToggleStatus={handleToggleStatus}
              onAddSubtask={handleAddSubtask}
              onMoveTask={handleMoveTask}
            />
          )}
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
              formTitle={parentTaskId ? '创建子任务' : '创建任务'}
              submitText={parentTaskId ? '创建子任务' : '创建任务'}
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
