import React from 'react';
import { Box, Stack, Chip } from '@mui/material';

import { Task, TaskStatus, TaskPriority } from '@/types/task';

interface TaskCardChipsProps {
  task: Task;
}

const TaskCardChips: React.FC<TaskCardChipsProps> = ({ task }) => {
  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case 'urgent':
        return 'error';
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      case 'minimal':
        return 'info';
    }
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'inProgress':
        return 'info';
      case 'todo':
        return 'default';
    }
  };

  return (
    <>
      <Box sx={{ mt: 2 }}>
        <Stack direction="row" spacing={1}>
          <Chip label={task.status} color={getStatusColor(task.status)} size="small" />
          <Chip
            label={`${task.priority} (${task.priorityScore})`}
            color={getPriorityColor(task.priority)}
            size="small"
          />
          {task.dueDate && (
            <Chip
              label={new Date(task.dueDate).toLocaleDateString()}
              variant="outlined"
              size="small"
            />
          )}
        </Stack>
      </Box>

      <Box sx={{ mt: 1 }}>
        <Stack direction="row" spacing={1}>
          {task.estimatedHours && (
            <Chip label={`预计: ${task.estimatedHours}h`} variant="outlined" size="small" />
          )}
          {task.actualHours && (
            <Chip label={`实际: ${task.actualHours}h`} variant="outlined" size="small" />
          )}
          {task.isUrgent && <Chip label="紧急" color="error" size="small" />}
          {task.isBlocked && <Chip label="已阻塞" color="error" size="small" />}
        </Stack>
      </Box>
    </>
  );
};

export default TaskCardChips;
