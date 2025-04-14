import React from 'react';
import { Card, CardContent, Typography, Chip, IconButton, Box, Stack } from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';

import { TaskProps, TaskStatus, TaskPriority } from '@/types/task';

const TaskCard: React.FC<TaskProps> = ({ task, onEdit, onDelete, onStatusChange }) => {
  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
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
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" component="div">
            {task.title}
          </Typography>
          <Stack direction="row" spacing={1}>
            <IconButton size="small" onClick={() => onStatusChange?.(task.id, 'completed')}>
              <CheckCircleIcon />
            </IconButton>
            <IconButton size="small" onClick={() => onEdit?.(task.id)}>
              <EditIcon />
            </IconButton>
            <IconButton size="small" onClick={() => onDelete?.(task.id)}>
              <DeleteIcon />
            </IconButton>
          </Stack>
        </Box>

        {task.description && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {task.description}
          </Typography>
        )}

        <Box sx={{ mt: 2 }}>
          <Stack direction="row" spacing={1}>
            <Chip label={task.status} color={getStatusColor(task.status)} size="small" />
            <Chip label={task.priority} color={getPriorityColor(task.priority)} size="small" />
            {task.dueDate && (
              <Chip
                label={new Date(task.dueDate).toLocaleDateString()}
                variant="outlined"
                size="small"
              />
            )}
          </Stack>
        </Box>

        {task.tags && task.tags.length > 0 && (
          <Box sx={{ mt: 1 }}>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {task.tags.map(tag => (
                <Chip key={tag} label={tag} size="small" variant="outlined" />
              ))}
            </Stack>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default TaskCard;
