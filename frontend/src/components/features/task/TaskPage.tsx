import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Dialog,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';

import TaskHeader from './TaskHeader';
import TaskList from './TaskList';
import TaskForm from './TaskForm';
import TaskMindMap from './TaskMindMap';

import { taskApi } from '@/services/api/taskApi';
import useTaskStore from '@/store/taskStore';
import { useHistoryStore, toHistoryTaskData } from '@/store/historyStore';
import { Task, TaskFormData, FilterFormData, TaskStatus, ROOT_TASK_ID } from '@/types/task';

const TaskPage: React.FC = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [parentTaskId, setParentTaskId] = useState<string | undefined>();
  const [viewMode, setViewMode] = useState<'list' | 'mindmap'>('list');
  const [historyError, setHistoryError] = useState<string | null>(null);
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
    deleteTask,
    getTaskByPath
  } = useTaskStore();
  const { addOperation, undo, redo } = useHistoryStore();

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
        addOperation({
          type: 'update',
          task: toHistoryTaskData(updatedTask),
          oldTask: toHistoryTaskData(editingTask)
        });
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
      const taskToDelete = getTaskByPath(taskPath);
      if (!taskToDelete) return;

      await taskApi.deleteTask(taskId);
      deleteTask(taskPath);
      addOperation({
        type: 'delete',
        task: toHistoryTaskData(taskToDelete)
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : '删除任务失败');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (taskPath: string[], newStatus: TaskStatus) => {
    try {
      setLoading(true);
      const taskId = taskPath[taskPath.length - 1];
      const taskToUpdate = getTaskByPath(taskPath);
      if (!taskToUpdate) return;

      const updatedTask = await taskApi.updateTask(taskId, { status: newStatus });
      updateTask(updatedTask);
      addOperation({
        type: 'update',
        task: toHistoryTaskData(updatedTask),
        oldTask: toHistoryTaskData(taskToUpdate)
      });
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
      addOperation({
        type: 'create',
        task: toHistoryTaskData(newTask)
      });
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
      const taskToMove = getTaskByPath(taskPath);
      if (!taskToMove) return;

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
      addOperation({
        type: 'move',
        task: toHistoryTaskData(updatedTask),
        oldTask: toHistoryTaskData(taskToMove)
      });
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

  const handleUndo = async () => {
    try {
      setLoading(true);
      await undo();
      // 重新获取最新数据
      const data = await taskApi.getTasks(filters as FilterFormData);
      setTasks(data);
    } catch (err) {
      setHistoryError(err instanceof Error ? err.message : '撤销操作失败');
    } finally {
      setLoading(false);
    }
  };

  const handleRedo = async () => {
    try {
      setLoading(true);
      await redo();
      // 重新获取最新数据
      const data = await taskApi.getTasks(filters as FilterFormData);
      setTasks(data);
    } catch (err) {
      setHistoryError(err instanceof Error ? err.message : '重做操作失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          任务管理
        </Typography>

        <TaskHeader
          filters={filters as FilterFormData}
          onFilterChange={handleFilterChange}
          onCreateClick={() => {
            setParentTaskId(ROOT_TASK_ID);
            setIsCreateDialogOpen(true);
          }}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onUndo={handleUndo}
          onRedo={handleRedo}
        />

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

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
              formTitle="编辑任务"
              submitText="保存"
            />
          </Box>
        </Dialog>

        <Snackbar
          open={!!historyError}
          autoHideDuration={6000}
          onClose={() => setHistoryError(null)}
        >
          <Alert onClose={() => setHistoryError(null)} severity="error" sx={{ width: '100%' }}>
            {historyError}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
};

export default TaskPage;
