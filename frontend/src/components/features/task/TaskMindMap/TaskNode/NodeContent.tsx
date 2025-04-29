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
        return '#d32f2f';
      case 'high':
        return '#f44336';
      case 'medium':
        return '#ff9800';
      case 'low':
        return '#4caf50';
      case 'minimal':
        return '#2196f3';
    }
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'completed':
        return '#4caf50';
      case 'inProgress':
        return '#2196f3';
      case 'todo':
        return '#757575';
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
            width: 'fit-content',
            '& .MuiChip-label': {
              color: 'white'
            }
          }}
        />
        <Chip
          icon={<FlagIcon />}
          label={task.priority}
          size="small"
          sx={{
            backgroundColor: getPriorityColor(task.priority),
            color: 'white',
            width: 'fit-content',
            '& .MuiChip-label': {
              color: 'white'
            }
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
