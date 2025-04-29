import React from 'react';
import { Box, Typography, Stack, Chip } from '@mui/material';
import FlagIcon from '@mui/icons-material/Flag';

import { Task, TaskStatus, TaskPriority } from '@/types/task';

interface NodeContentProps {
  task: Task;
}

const NodeContent: React.FC<NodeContentProps> = ({ task }) => {
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
    <Box>
      {task.description && (
        <Typography variant="body2" color="text.secondary" sx={{ wordBreak: 'break-word' }}>
          {task.description}
        </Typography>
      )}

      <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
        <Chip
          label={task.status}
          size="small"
          sx={{
            backgroundColor: getStatusColor(task.status),
            color: 'white',
            width: 'fit-content'
          }}
        />
        <Chip
          icon={<FlagIcon />}
          label={task.priority}
          size="small"
          sx={{
            backgroundColor: getPriorityColor(task.priority),
            color: 'white',
            width: 'fit-content'
          }}
        />
      </Stack>

      {task.dueDate && (
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
          截止日期: {new Date(task.dueDate).toLocaleDateString()}
        </Typography>
      )}
    </Box>
  );
};

export default NodeContent;
