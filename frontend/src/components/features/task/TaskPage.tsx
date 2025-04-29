import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, CircularProgress, Snackbar, Alert } from '@mui/material';

import TaskHeader from './TaskHeader/TaskHeader';
import TaskList from './TaskList/TaskList';
import TaskMindMap from './TaskMindMap/TaskMindMap';
import TaskDialogs from './TaskDialogs/TaskDialogs';
import { useTaskOperations } from './useTaskOperations';
import { useTaskHistory } from './useTaskHistory';

import { taskApi } from '@/services/api/taskApi';
import useTaskStore from '@/store/taskStore';
import { Task, TaskFormData, FilterFormData, ROOT_TASK_ID } from '@/types/task';

const TaskPage: React.FC = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [parentTaskId, setParentTaskId] = useState<string | undefined>();
  const [viewMode, setViewMode] = useState<'list' | 'mindmap'>('list');

  const { tasks, filters, setTasks, setFilters } = useTaskStore();
  const {
    loading,
    error,
    handleCreateTask,
    handleEditTask,
    handleDeleteTask,
    handleToggleStatus,
    handleMoveTask
  } = useTaskOperations();
  const { historyError, setHistoryError, handleUndo, handleRedo } = useTaskHistory();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await taskApi.getTasks(filters as FilterFormData);
        setTasks(data);
      } catch (err) {
        console.error('获取任务失败:', err);
      }
    };

    fetchTasks();
  }, [filters, setTasks]);

  const handleFilterChange = (newFilters: FilterFormData) => {
    setFilters(newFilters);
  };

  const handleEditTaskClick = (task: Task) => {
    setEditingTask(task);
  };

  const handleCloseEditDialog = () => {
    setEditingTask(null);
    setParentTaskId(undefined);
  };

  const handleSubmitEdit = async (formData: TaskFormData) => {
    if (editingTask) {
      const success = await handleEditTask(editingTask, formData);
      if (success) {
        handleCloseEditDialog();
      }
    }
  };

  const handleCreateTaskClick = () => {
    setParentTaskId(ROOT_TASK_ID);
    setIsCreateDialogOpen(true);
  };

  const handleSubmitCreate = async (formData: TaskFormData) => {
    const success = await handleCreateTask(formData, parentTaskId);
    if (success) {
      setIsCreateDialogOpen(false);
      setParentTaskId(undefined);
    }
  };

  const handleAddSubtask = (parentId: string) => {
    setParentTaskId(parentId);
    setIsCreateDialogOpen(true);
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
          onCreateClick={handleCreateTaskClick}
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
              onEditTask={handleEditTaskClick}
              onDeleteTask={handleDeleteTask}
              onToggleStatus={handleToggleStatus}
              onAddSubtask={handleAddSubtask}
              onMoveTask={handleMoveTask}
            />
          ) : (
            <TaskMindMap
              tasks={tasks}
              onEditTask={handleEditTaskClick}
              onDeleteTask={handleDeleteTask}
              onToggleStatus={handleToggleStatus}
              onAddSubtask={handleAddSubtask}
              onMoveTask={handleMoveTask}
            />
          )}
        </Box>

        <TaskDialogs
          isCreateDialogOpen={isCreateDialogOpen}
          editingTask={editingTask}
          parentTaskId={parentTaskId}
          onCloseCreateDialog={() => {
            setIsCreateDialogOpen(false);
            setParentTaskId(undefined);
          }}
          onCloseEditDialog={handleCloseEditDialog}
          onSubmitCreate={handleSubmitCreate}
          onSubmitEdit={handleSubmitEdit}
        />

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
