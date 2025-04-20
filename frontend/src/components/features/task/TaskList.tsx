import React, { useState } from 'react';
import { Box, Button, Dialog, Stack } from '@mui/material';

import TaskCard from './TaskCard';
import TaskFilter from './TaskFilter';
import TaskForm from './TaskForm';

import { Task, FilterFormData, TaskFormData } from '@/types/task';

interface TaskListProps {
  tasks: Task[];
  filters: FilterFormData;
  onFilterChange: (filters: FilterFormData) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onToggleStatus: (taskId: string) => void;
  onCreateTask: (task: TaskFormData) => void;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  filters,
  onFilterChange,
  onEditTask,
  onDeleteTask,
  onToggleStatus,
  onCreateTask
}) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  return (
    <Box>
      <Stack spacing={2} sx={{ mb: 3 }}>
        <TaskFilter filters={filters} onFilterChange={onFilterChange} />
        <Button variant="contained" onClick={() => setIsCreateDialogOpen(true)}>
          创建任务
        </Button>
      </Stack>

      <Stack spacing={2}>
        {tasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={() => onEditTask(task)}
            onDelete={() => onDeleteTask(task.id)}
            onStatusChange={() => onToggleStatus(task.id)}
          />
        ))}
      </Stack>

      <Dialog
        open={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <Box sx={{ p: 3 }}>
          <TaskForm onSubmit={onCreateTask} onCancel={() => setIsCreateDialogOpen(false)} />
        </Box>
      </Dialog>
    </Box>
  );
};

export default TaskList;
